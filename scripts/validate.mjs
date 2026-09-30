#!/usr/bin/env node
import { readdir, readFile, stat, realpath } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { loadPackage, inside } from '../mcp/content.mjs';

try {
  const pkg = await loadPackage();
  if (!Array.isArray(pkg.metadata.files)) throw new Error('Package must declare its distribution files.');
  for (const entry of pkg.metadata.files) {
    const target = await realpath(resolve(pkg.root, entry));
    if (!inside(pkg.root, target)) throw new Error(`Distribution entry escapes the package: ${entry}`);
  }
  // Commands are executable dependencies too, even when they appear in code fences.
  for (const doc of pkg.documentsByPath.values()) {
    for (const match of doc.rawText.matchAll(/\bnode\s+(scripts\/[a-z0-9-]+\.mjs)\b/g)) {
      const helper = match[1];
      const target = await realpath(resolve(pkg.root, helper));
      if (!inside(pkg.root, target) || !(await stat(target)).isFile()) throw new Error(`Missing command helper in ${doc.sourcePath}: ${helper}`);
      if (!pkg.metadata.files.some(entry => helper === entry || helper.startsWith(`${entry}/`))) throw new Error(`Command helper excluded from distribution: ${helper}`);
    }
  }
  async function inspect(folder, prefix) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const id = `${prefix}/${entry.name}`;
      if (entry.isSymbolicLink()) throw new Error(`Validation does not follow reference symlinks: ${id}`);
      if (entry.isDirectory()) await inspect(resolve(folder, entry.name), id);
      else if (entry.name.endsWith('.md') && !pkg.references.has(id)) throw new Error(`Unregistered reference: ${id}`);
    }
  }
  for (const skill of pkg.skills.values()) {
    const entries = await readdir(resolve(pkg.root, 'skills', skill.name));
    if (entries.includes('references')) await inspect(resolve(pkg.root, 'skills', skill.name, 'references'), `${skill.name}/references`);
    for (const ref of skill.references) {
      if (!skill.text.includes(ref.uri)) throw new Error(`Reference lacks a route from its skill: ${ref.id}`);
    }
  }
  async function documentationFiles(folder) {
    const files = [];
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const path = resolve(folder, entry.name);
      if (entry.isDirectory()) files.push(...await documentationFiles(path));
      else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path);
    }
    return files;
  }
  const guides = [resolve(pkg.root, 'README.md'), resolve(pkg.root, 'CAPABILITIES.md'), resolve(pkg.root, 'PACKAGE-VALIDATION.md'), resolve(pkg.root, 'install-visual-engineering/SKILL.md')];
  guides.push(...await documentationFiles(resolve(pkg.root, 'prompts')));
  for (const guide of guides) {
    const source = (await readFile(guide, 'utf8')).replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, '');
    for (const match of source.matchAll(/\[[^\]\n]+\]\(([^\s)]+)\)/g)) {
      const link = match[1];
      if (/^(https?:\/\/|#)/.test(link)) continue;
      const target = await realpath(resolve(dirname(guide), link.split('#')[0]));
      if (!inside(pkg.root, target) || !(await stat(target)).isFile()) throw new Error(`Invalid local guide link in ${guide}: ${link}`);
    }
  }
  process.stdout.write(`Validated ${pkg.skills.size} skills, ${pkg.references.size} references, ${pkg.bundles.size} bundles, distribution helpers, metadata, containment, and ${guides.length} package guides.\n`);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
