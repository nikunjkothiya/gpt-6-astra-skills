import { readFile, readdir, realpath, stat } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const SERVER_NAME = 'visual-engineering-intelligence';
const MAX_DOCUMENT_BYTES = 128 * 1024;
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REFERENCE = /^references\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

export function inside(root, path) {
  const diff = relative(root, path);
  return diff !== '' && diff !== '..' && !diff.startsWith(`..${sep}`) && !isAbsolute(diff);
}

async function packagedText(root, path) {
  const actual = await realpath(path);
  if (!inside(root, actual)) throw new Error(`Packaged file escapes its directory: ${path}`);
  const info = await stat(actual);
  if (!info.isFile() || info.size > MAX_DOCUMENT_BYTES) throw new Error(`Invalid or oversized packaged file: ${path}`);
  return (await readFile(actual, 'utf8')).replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
}

export function parseSkill(text, expectedName) {
  const match = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match || !text.slice(match[0].length).trim()) throw new Error(`Invalid skill body: ${expectedName}`);
  const metadata = {};
  for (const key of ['name', 'description']) {
    const fields = [...match[1].matchAll(new RegExp(`^${key}:[ \\t]*(.*)$`, 'gm'))];
    if (fields.length !== 1) throw new Error(`Expected one ${key} in ${expectedName}`);
    let value = fields[0][1].trim();
    if (value.startsWith('"')) {
      try { value = JSON.parse(value); } catch { throw new Error(`Malformed ${key} in ${expectedName}`); }
    } else if (value.startsWith("'")) {
      if (value.length < 2 || !value.endsWith("'")) throw new Error(`Malformed ${key} in ${expectedName}`);
      value = value.slice(1, -1).replace(/''/g, "'");
    }
    if (typeof value !== 'string' || !value.trim() || /[\r\n]/.test(value) || /^[>|]/.test(value)) {
      throw new Error(`Expected a nonempty single-line ${key} in ${expectedName}`);
    }
    metadata[key] = value;
  }
  if (metadata.name !== expectedName) throw new Error(`Skill name differs from folder: ${expectedName}`);
  return metadata;
}

// Link rewriting deliberately excludes code examples. Every local documentation
// link must resolve to an inventoried document; a URI alone never loads a body.
export function rewriteLinks(text, sourcePath, documentsByPath) {
  let fenced = false;
  let fenceCharacter = '';
  let fenceLength = 0;
  return text.split('\n').map(line => {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (!fenced) { fenced = true; fenceCharacter = fence[1][0]; fenceLength = fence[1].length; }
      else if (fence[1][0] === fenceCharacter && fence[1].length >= fenceLength) fenced = false;
      return line;
    }
    if (fenced) return line;
    return line.replace(/(\[[^\]\n]+\])\(([^\s)]+)\)/g, (full, label, target) => {
      if (/^(https?:\/\/|#)/.test(target)) return full;
      const [path, fragment] = target.split('#');
      const resolved = posix.normalize(posix.join(posix.dirname(sourcePath), path));
      const document = documentsByPath.get(resolved);
      if (!document) throw new Error(`Unregistered local link in ${sourcePath}: ${target}`);
      // Resources return full documents; retain the heading hint as visible text.
      return `${label}(${document.uri})${fragment ? ` (section: ${fragment})` : ''}`;
    });
  }).join('\n');
}

export async function loadPackage(root = PACKAGE_ROOT) {
  root = await realpath(root);
  const metadata = JSON.parse(await packagedText(root, resolve(root, 'package.json')));
  const manifest = JSON.parse(await packagedText(root, resolve(root, 'mcp/catalog.json')));
  if (!Array.isArray(manifest.skills) || !manifest.skills.length) throw new Error('Catalog must declare its skills.');
  const skillsRoot = await realpath(resolve(root, 'skills'));
  if (!inside(root, skillsRoot)) throw new Error('Skills directory escapes the package.');
  const skills = new Map();
  const references = new Map();
  const documentsByPath = new Map();
  for (const entry of manifest.skills) {
    if (!entry || typeof entry.name !== 'string' || !NAME.test(entry.name) || entry.name.length > 64 || skills.has(entry.name)) {
      throw new Error(`Invalid or duplicate skill name: ${entry?.name}`);
    }
    if (!Array.isArray(entry.references)) throw new Error(`References must be declared for ${entry.name}`);
    const folder = await realpath(resolve(skillsRoot, entry.name));
    if (!inside(skillsRoot, folder)) throw new Error(`Skill directory escapes skills: ${entry.name}`);
    const sourcePath = `${entry.name}/SKILL.md`;
    const text = await packagedText(folder, resolve(folder, 'SKILL.md'));
    const skill = { ...parseSkill(text, entry.name), sourcePath, rawText: text,
      uri: `visual-engineering://skills/${entry.name}`, references: [] };
    skills.set(skill.name, skill);
    documentsByPath.set(sourcePath, skill);
    for (const path of entry.references) {
      if (typeof path !== 'string' || !REFERENCE.test(path)) throw new Error(`Invalid reference path: ${path}`);
      const id = `${entry.name}/${path}`;
      if (references.has(id)) throw new Error(`Duplicate reference: ${id}`);
      const rawText = await packagedText(folder, resolve(folder, path));
      const title = rawText.match(/^# (.+)$/m)?.[1];
      if (!title || !rawText.trim()) throw new Error(`Reference needs a title: ${id}`);
      const ref = { id, name: id, title, skill: entry.name, sourcePath: id, rawText,
        uri: `visual-engineering://references/${id}` };
      references.set(id, ref);
      documentsByPath.set(id, ref);
      skill.references.push(ref);
    }
  }
  if (!skills.has(SERVER_NAME)) throw new Error('The coordinator skill is missing.');
  const folders = (await readdir(skillsRoot, { withFileTypes: true })).filter(x => x.isDirectory() || x.isSymbolicLink());
  for (const folder of folders) if (!skills.has(folder.name)) throw new Error(`Unregistered skill folder: ${folder.name}`);
  const guidance = 'Load linked skill bodies with visual_engineering_read and linked references with visual_engineering_reference using exact catalog IDs, or use resources/read. Links alone do not load instructions. Apply relevant guidance through the host capabilities and preserve the user scope.';
  for (const doc of documentsByPath.values()) {
    doc.text = `${rewriteLinks(doc.rawText, doc.sourcePath, documentsByPath).trimEnd()}\n\n${guidance}\n`;
  }
  const bundles = new Map();
  if (manifest.bundles !== undefined && !Array.isArray(manifest.bundles)) throw new Error('Bundles must be an array.');
  for (const entry of manifest.bundles ?? []) {
    if (!entry || typeof entry.name !== 'string' || !NAME.test(entry.name) || bundles.has(entry.name) || typeof entry.description !== 'string' || !entry.description.trim()) throw new Error('Invalid or duplicate bundle.');
    if (!Array.isArray(entry.skills) || !entry.skills.length || entry.skills.length > 8 || !Array.isArray(entry.references) || entry.references.length > 12) throw new Error(`Invalid bundle document counts: ${entry.name}`);
    for (const name of entry.skills) if (!skills.has(name)) throw new Error(`Unknown bundle skill: ${name}`);
    for (const id of entry.references) if (!references.has(id)) throw new Error(`Unknown bundle reference: ${id}`);
    bundles.set(entry.name, { ...entry, skills: [...new Set(entry.skills)], references: [...new Set(entry.references)], uri: `visual-engineering://bundles/${entry.name}` });
  }
  return { root, metadata, skills, references, documentsByPath, bundles, guidance };
}

export function bundleDocuments(pkg, name) {
  const bundle = pkg.bundles.get(name);
  if (!bundle) throw new Error(`Unknown bundle: ${name}`);
  return [...bundle.skills.map(name => pkg.skills.get(name)), ...bundle.references.map(id => pkg.references.get(id))];
}

export function bundleText(pkg, name) {
  const documents = bundleDocuments(pkg, name);
  return `# ${name} bundle\n\n${pkg.bundles.get(name).description}\n\nApply the relevant guidance to the user's topic. Additional linked bodies must be retrieved when needed.\n\n` + documents.map(doc => `---\nDocument: ${doc.sourcePath}\nResource: ${doc.uri}\n\n${doc.text}`).join('\n');
}

export function catalogText(pkg, query = '') {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const selected = [...pkg.skills.values()].filter(skill => {
    const searchable = `${skill.name} ${skill.description} ${skill.references.map(r => r.title).join(' ')}`.toLowerCase();
    return terms.every(term => searchable.includes(term));
  });
  const bundleList = [...pkg.bundles.values()].map(bundle => `- ${bundle.name}: ${bundle.description}\n  Resource: ${bundle.uri}`).join('\n');
  return `# Visual Engineering Catalog\n\n${selected.length} of ${pkg.skills.size} skills. ${pkg.references.size} supporting references.\n\n${bundleList ? `Named bundles (read with visual_engineering_bundle):\n${bundleList}\n\n` : ''}` +
    selected.map(skill => `- ${skill.name}: ${skill.description}\n  Resource: ${skill.uri}` +
      skill.references.map(ref => `\n  Reference: ${ref.id} — ${ref.title}`).join('')).join('\n\n') +
    `${selected.length ? '' : 'No matches. Omit query to see the full catalog.'}\n\n${pkg.guidance}\n`;
}

export function startText(pkg, task) {
  return `${task ? `User task:\n${task}\n\n` : ''}Read the coordinator, select the relevant specialists and references, and complete the requested artifact through the host's capabilities.\n\n${pkg.skills.get(SERVER_NAME).text}\n\n${catalogText(pkg)}`;
}
