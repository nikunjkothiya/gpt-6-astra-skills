#!/usr/bin/env node

import { readFile, readdir, realpath, stat } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SERVER_NAME = 'visual-engineering-intelligence';
const VERSION = '1.0.0';
const SKILL_NAMES = Object.freeze([
  SERVER_NAME,
  'visual-direction',
  'visual-composition',
  'interaction-design',
  'motion-intelligence',
  'geometric-reasoning',
  'object-structure',
  'assembly-choreography',
  'spatial-reasoning',
  'material-reasoning',
  'lighting-design',
  'camera-composition',
  'rendering-judgment',
  'visual-storytelling',
  'responsive-composition',
  'visual-reconstruction',
  'visual-performance',
  'visual-accessibility',
  'visual-qa',
]);
const RETRIEVAL_INSTRUCTION = 'MCP retrieval: Load the full contents of each needed specialist with visual_engineering_read, passing its exact skill name in the names array, or use your host\'s resources/read capability with its visual-engineering://skills/<name> URI. A link does not load its contents. Apply only the relevant guidance to the user\'s requested work using the host\'s available capabilities.';

function isInsideDirectory(directory, candidate) {
  const difference = relative(directory, candidate);
  return difference !== '' && difference !== '..' && !difference.startsWith(`..${sep}`) && !isAbsolute(difference);
}

function parseFrontmatter(source, expectedName) {
  const text = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!frontmatter || !text.slice(frontmatter[0].length).trim()) {
    throw new Error(`Invalid packaged skill ${expectedName}: SKILL.md must contain frontmatter and a nonempty body.`);
  }

  const metadata = {};
  for (const key of ['name', 'description']) {
    const values = [...frontmatter[1].matchAll(new RegExp(`^${key}:[ \\t]*(.*)$`, 'gm'))];
    if (values.length !== 1) {
      throw new Error(`Invalid packaged skill ${expectedName}: expected one ${key} field.`);
    }
    let value = values[0][1].trim();
    if (value.startsWith('"')) {
      try {
        value = JSON.parse(value);
      } catch {
        throw new Error(`Invalid packaged skill ${expectedName}: malformed quoted ${key}.`);
      }
    } else if (value.startsWith("'")) {
      if (!value.endsWith("'") || value.length < 2) {
        throw new Error(`Invalid packaged skill ${expectedName}: malformed quoted ${key}.`);
      }
      value = value.slice(1, -1).replace(/''/g, "'");
    }
    if (typeof value !== 'string' || !value.trim() || /^[>|]/.test(value)) {
      throw new Error(`Invalid packaged skill ${expectedName}: ${key} must be a nonempty, single-line scalar.`);
    }
    metadata[key] = value;
  }
  if (metadata.name !== expectedName) {
    throw new Error(`Invalid packaged skill ${expectedName}: frontmatter name must match its folder.`);
  }
  return { ...metadata, text };
}

async function loadSkills() {
  const packageRoot = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
  let skillsRoot;
  try {
    skillsRoot = await realpath(resolve(packageRoot, 'skills'));
  } catch {
    throw new Error('The packaged skills directory is missing. Keep mcp/server.mjs and skills/ together inside the complete visual-engineering-intelligence package.');
  }
  if (!isInsideDirectory(packageRoot, skillsRoot)) {
    throw new Error('The packaged skills directory must resolve inside the package directory.');
  }

  const entries = await readdir(skillsRoot, { withFileTypes: true });
  const folders = new Set(entries.filter(entry => entry.isDirectory() || entry.isSymbolicLink()).map(entry => entry.name));
  const missing = SKILL_NAMES.filter(name => !folders.has(name));
  if (missing.length > 0) {
    throw new Error(`The skill package is incomplete. Missing skill folders: ${missing.join(', ')}.`);
  }

  const skills = new Map();
  for (const name of SKILL_NAMES) {
    let skillPath;
    try {
      const directory = await realpath(resolve(skillsRoot, name));
      if (!isInsideDirectory(skillsRoot, directory)) {
        throw new Error('The skill folder resolves outside the packaged skills directory.');
      }
      skillPath = await realpath(resolve(directory, 'SKILL.md'));
      if (!isInsideDirectory(skillsRoot, skillPath)) {
        throw new Error('SKILL.md resolves outside the packaged skills directory.');
      }
      if (!(await stat(skillPath)).isFile()) {
        throw new Error('SKILL.md is not a regular file.');
      }
    } catch (error) {
      throw new Error(`Cannot load packaged skill ${name}: ${error.message}`);
    }
    const skill = parseFrontmatter(await readFile(skillPath, 'utf8'), name);
    skills.set(name, { ...skill, uri: `visual-engineering://skills/${name}` });
  }

  for (const skill of skills.values()) {
    skill.text = skill.text.replace(/(\[[^\]\n]+\])\(\.\.\/([a-z0-9]+(?:-[a-z0-9]+)*)\/SKILL\.md\)/g, (link, label, name) => {
      return skills.has(name) ? `${label}(${skills.get(name).uri})` : link;
    });
    skill.text = `${skill.text.trimEnd()}\n\n${RETRIEVAL_INSTRUCTION}\n`;
  }
  return skills;
}

function catalogText(skills, query = '') {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const selected = [...skills.values()].filter(skill => {
    const searchable = `${skill.name} ${skill.description}`.toLowerCase();
    return terms.every(term => searchable.includes(term));
  });
  const entries = selected.map(skill => `- ${skill.name}: ${skill.description}\n  Resource: ${skill.uri}`).join('\n\n');
  return `# Visual Engineering Skill Catalog\n\n${selected.length} of ${skills.size} skills${query ? ` matching ${JSON.stringify(query)}` : ''}.\n\n${entries || 'No matching skills. Omit query to list the complete catalog.'}\n\n${RETRIEVAL_INSTRUCTION}\n`;
}

function startText(skills, task) {
  const taskText = task ? `User task:\n${task}\n\n` : '';
  return `${taskText}Use the coordinator below to select and read the necessary specialists, then carry out the requested work. These skills provide guidance; the host agent supplies file editing, rendering, and other execution capabilities. Preserve the user\'s scope and report material capability limits accurately.\n\n${skills.get(SERVER_NAME).text}\n\n${catalogText(skills)}`;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    process.stdout.write(`Visual Engineering Intelligence ${VERSION}\n\nUsage: node mcp/server.mjs\n\nStarts a read-only MCP server over standard input/output.\nTools: visual_engineering_start, visual_engineering_list, visual_engineering_read\nResources: visual-engineering://catalog and visual-engineering://skills/<name>\nPrompt: visual-engineering (required argument: task)\n\nKeep the complete package together and install its dependencies before starting.\nThe server reads only its 19 packaged SKILL.md files and requires no API keys.\nOptions: --help, --version\n`);
    return;
  }
  if (args.length === 1 && ['--version', '-v'].includes(args[0])) {
    process.stdout.write(`${VERSION}\n`);
    return;
  }
  if (args.length > 0) {
    throw new Error('Unexpected command-line arguments. Use --help for supported options.');
  }

  const skills = await loadSkills();
  let dependencies;
  try {
    dependencies = await Promise.all([
      import('@modelcontextprotocol/server'),
      import('@modelcontextprotocol/server/stdio'),
      import('zod/v4'),
    ]);
  } catch (error) {
    throw new Error(`Cannot load MCP dependencies. Install dependencies in the package directory before starting the server. ${error.message}`);
  }
  const [{ McpServer }, { StdioServerTransport }, z] = dependencies;
  const server = new McpServer({ name: SERVER_NAME, version: VERSION }, {
    instructions: 'For visual design, implementation, redesign, reconstruction, or polish, call visual_engineering_start with the user task, then visual_engineering_read for the relevant specialists. Narrow tasks can load their owning specialist directly. Skill resources and the visual-engineering prompt provide the same guidance. Execute the work through the host agent\'s capabilities and obey the user\'s scope.',
  });
  const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
  const taskSchema = z.string().trim().min(1).max(16000).describe('The user\'s visual task, including relevant constraints and requested outcome.');

  server.registerTool('visual_engineering_start', {
    description: 'Start substantial visual work: designing, building, redesigning, reconstructing, or polishing a website, app, interface, animation, rendered object, or spatial experience. Returns the full coordinator and all 19 skill descriptions so the agent can choose and read relevant specialists before acting.',
    inputSchema: z.object({ task: taskSchema.optional() }).strict(),
    annotations,
  }, async ({ task }) => ({ content: [{ type: 'text', text: startText(skills, task) }] }));

  server.registerTool('visual_engineering_list', {
    description: 'Discover available visual engineering skills by name and activation description. Omit query to list all 19 skills; when supplied, every space-separated query term must occur in the name or description, ignoring case. Returns descriptions and resource URIs; use visual_engineering_read to load full guidance.',
    inputSchema: z.object({ query: z.string().trim().max(200).optional() }).strict(),
    annotations,
  }, async ({ query }) => ({ content: [{ type: 'text', text: catalogText(skills, query) }] }));

  server.registerTool('visual_engineering_read', {
    description: 'Read the complete instructions of 1 to 8 named visual engineering skills. Use exact names from visual_engineering_list or the coordinator. Load each relevant specialist before applying its decisions; names must be packaged skills, never filesystem paths.',
    inputSchema: z.object({ names: z.array(z.enum(SKILL_NAMES)).min(1).max(8) }).strict(),
    annotations,
  }, async ({ names }) => ({
    content: [...new Set(names)].map(name => ({
      type: 'text',
      text: `Skill: ${name}\nResource: ${skills.get(name).uri}\n\n${skills.get(name).text}`,
    })),
  }));

  server.registerResource('visual-engineering-catalog', 'visual-engineering://catalog', {
    description: 'Catalog of all 19 visual engineering skills, including activation descriptions and full-text resource addresses.',
    mimeType: 'text/markdown',
  }, async uri => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: catalogText(skills) }] }));

  for (const skill of skills.values()) {
    server.registerResource(skill.name, skill.uri, {
      description: skill.description,
      mimeType: 'text/markdown',
    }, async uri => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: skill.text }] }));
  }

  server.registerPrompt('visual-engineering', {
    description: 'Apply visual engineering guidance to a visual design or implementation task. Loads the full coordinator and skill catalog and directs the host agent to read relevant specialists and complete the work.',
    argsSchema: z.object({ task: taskSchema }).strict(),
  }, async ({ task }) => ({ messages: [{ role: 'user', content: { type: 'text', text: startText(skills, task) } }] }));

  server.server.onerror = error => process.stderr.write(`[${SERVER_NAME}] ${error.message}\n`);
  await server.connect(new StdioServerTransport());
}

main().catch(error => {
  process.stderr.write(`[${SERVER_NAME}] ${error.message}\n`);
  process.exitCode = 1;
});
