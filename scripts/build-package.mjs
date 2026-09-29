#!/usr/bin/env node
// Stage a portable, skills-only distribution. No examples or generated media.
import { cp, mkdir, readFile, writeFile, realpath } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { PACKAGE_ROOT, inside, loadPackage } from '../mcp/content.mjs';

const selected = [
  'README.md', 'CAPABILITIES.md', 'PACKAGE-VALIDATION.md', 'package-lock.json',
  'install-visual-engineering', 'skills', 'mcp', 'prompts',
  'scripts/export.mjs', 'scripts/validate.mjs', 'scripts/reference-runtime.mjs', 'scripts/build-package.mjs',
  'tests/content.test.mjs', 'tests/mcp.test.mjs', 'tests/reference-code.test.mjs',
  'tests/interaction-code.test.mjs', 'tests/interactive-motion.test.mjs', 'tests/sequence-recipes.test.mjs',
];
try {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== '--out') throw new Error('Usage: node scripts/build-package.mjs --out PATH_WITHIN_WORKSPACE (new directory)');
  const pkg = await loadPackage();
  const target = resolve(PACKAGE_ROOT, args[1]);
  if (!inside(PACKAGE_ROOT, target) || target === PACKAGE_ROOT) throw new Error('Distribution must be inside a new workspace subdirectory.');
  // Resolve the parent before writing, including any pre-existing junctions.
  const parent = await realpath(dirname(target));
  if (parent !== PACKAGE_ROOT && !inside(PACKAGE_ROOT, parent)) throw new Error('Distribution parent escapes the workspace.');
  // Never copy the source tree into one of its own descendants. Check the
  // resolved location as well, so an existing junction cannot bypass this rule.
  const physicalTarget = resolve(parent, basename(target));
  const protectedRoots = ['skills', 'mcp', 'prompts', 'scripts', 'tests', 'install-visual-engineering', 'node_modules', '.git', '.agents', '.codex'];
  for (const folder of protectedRoots) {
    const source = resolve(PACKAGE_ROOT, folder);
    if ([target, physicalTarget].some(path => path === source || inside(source, path))) {
      throw new Error('Distribution must be outside source and dependency directories.');
    }
  }
  await mkdir(target); // Refuse to overwrite an old build or user's directory.
  for (const path of selected) {
    await mkdir(dirname(resolve(target, path)), { recursive: true });
    await cp(resolve(PACKAGE_ROOT, path), resolve(target, path), { recursive: true, dereference: false });
  }
  const metadata = JSON.parse(await readFile(resolve(PACKAGE_ROOT, 'package.json'), 'utf8'));
  metadata.scripts = { start: 'node mcp/server.mjs', config: 'node mcp/config.mjs', validate: 'node scripts/validate.mjs', export: 'node scripts/export.mjs', test: 'node --test tests/*.test.mjs', check: 'npm run validate && npm test', 'build:package': 'node scripts/build-package.mjs' };
  metadata.devDependencies = { three: metadata.devDependencies.three };
  metadata.files = ['README.md','CAPABILITIES.md','PACKAGE-VALIDATION.md','install-visual-engineering','skills','mcp','prompts','scripts','tests','package-lock.json'];
  await writeFile(resolve(target,'package.json'), JSON.stringify(metadata,null,2)+'\n');
  process.stdout.write(`Staged ${pkg.skills.size} skills, ${pkg.references.size} references and ${pkg.bundles.size} bundles at ${target}\nReady for validation or archiving; dependencies and generated artifacts are excluded.\n`);
} catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
