import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, symlink, readFile, access, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, dirname, basename } from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { loadPackage, parseSkill, rewriteLinks, inside, PACKAGE_ROOT, SERVER_NAME } from '../mcp/content.mjs';

test('complete package loads; every document is retrievable and every reference has a route', async () => {
  const pkg = await loadPackage();
  assert.ok(pkg.skills.has('threejs-engineering'));
  assert.equal(pkg.documentsByPath.size, pkg.skills.size + pkg.references.size);
  assert.equal(new Set([...pkg.documentsByPath.values()].map(d => d.uri)).size, pkg.documentsByPath.size);
  for (const skill of pkg.skills.values()) for (const ref of skill.references) assert.ok(skill.text.includes(ref.uri), ref.id);
});

test('frontmatter rejects malformed identity, duplicates, and empty body', () => {
  for (const body of [
    '---\nname: a\ndescription: test\n---\n',
    '---\nname: b\ndescription: test\n---\nBody',
    '---\nname: a\nname: a\ndescription: test\n---\nBody',
    '---\nname: a\ndescription: >\n---\nBody',
    '---\nname: a\ndescription: "bad\n---\nBody',
  ]) assert.throws(() => parseSkill(body, 'a'));
  assert.equal(parseSkill('---\nname: a\ndescription: "Useful instruction"\n---\nBody', 'a').description, 'Useful instruction');
});

test('local links are rewritten across reference depth; examples remain literal', () => {
  const docs = new Map([['a/SKILL.md', { uri: 'visual-engineering://skills/a' }]]);
  assert.equal(rewriteLinks('[A](../SKILL.md)', 'a/references/x.md', docs), '[A](visual-engineering://skills/a)');
  assert.equal(rewriteLinks('```md\n[A](missing.md)\n```', 'a/SKILL.md', docs), '```md\n[A](missing.md)\n```');
  assert.throws(() => rewriteLinks('[Missing](../b/SKILL.md)', 'a/SKILL.md', docs), /Unregistered/);
  assert.equal(inside(resolve('skills'), resolve('skills-other/file')), false);
  assert.equal(inside(resolve('skills'), resolve('skills')), false);
});

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'visual-engineering-test-'));
  t.after(() => removeTemporaryFixture(root));
  await mkdir(join(root, 'mcp'));
  await mkdir(join(root, 'skills', SERVER_NAME, 'references'), { recursive: true });
  await writeFile(join(root, 'package.json'), '{"version":"test"}');
  await writeFile(join(root, 'skills', SERVER_NAME, 'SKILL.md'), `---\nname: ${SERVER_NAME}\ndescription: Test\n---\nBody`);
  const manifest = { skills: [{ name: SERVER_NAME, references: [] }] };
  const save = () => writeFile(join(root, 'mcp', 'catalog.json'), JSON.stringify(manifest));
  await save();
  return { root, manifest, save };
}

async function removeTemporaryFixture(path) {
  const target = resolve(path);
  if (!inside(resolve(tmpdir()), target) || !/^visual-engineering-(test|outside)-/.test(target.split(/[\\/]/).at(-1))) {
    throw new Error('Refusing to remove a directory outside the temporary fixture scope.');
  }
  await rm(target, { recursive: true, force: true });
}

test('inventory rejects missing files, duplicates, arbitrary paths, and oversized references', async t => {
  const { root, manifest, save } = await fixture(t);
  await loadPackage(root);
  manifest.skills[0].references = ['references/missing.md']; await save();
  await assert.rejects(loadPackage(root), /ENOENT/);
  manifest.skills[0].references = ['../../secret.md']; await save();
  await assert.rejects(loadPackage(root), /Invalid reference/);
  manifest.skills[0].references = ['references/large.md']; await save();
  await writeFile(join(root, 'skills', SERVER_NAME, 'references', 'large.md'), '# Large\n' + 'x'.repeat(128 * 1024));
  await assert.rejects(loadPackage(root), /oversized/);
  manifest.skills[0].references = []; manifest.skills.push(manifest.skills[0]); await save();
  await assert.rejects(loadPackage(root), /duplicate/);
});

test('realpath containment rejects a directory junction to outside a skill', async t => {
  const { root, manifest, save } = await fixture(t);
  const outside = await mkdtemp(join(tmpdir(), 'visual-engineering-outside-'));
  t.after(() => removeTemporaryFixture(outside));
  await writeFile(join(outside, 'secret.md'), '# Secret\nDo not expose');
  await symlink(outside, join(root, 'skills', SERVER_NAME, 'references', 'escape'), process.platform === 'win32' ? 'junction' : 'dir');
  manifest.skills[0].references = ['references/escape/secret.md']; await save();
  await assert.rejects(loadPackage(root), /escapes/);
});

test('config JSON and TOML produce absolute local paths; unknown flags fail', () => {
  const run = args => spawnSync(process.execPath, ['mcp/config.mjs', ...args], { cwd: PACKAGE_ROOT, encoding: 'utf8' });
  const json = run([]); assert.equal(json.status, 0);
  const entry = JSON.parse(json.stdout).mcpServers[SERVER_NAME];
  assert.equal(entry.command, process.execPath);
  assert.deepEqual(entry.args, [join(PACKAGE_ROOT, 'mcp', 'server.mjs')]);
  const toml = run(['--format', 'toml']); assert.equal(toml.status, 0);
  assert.ok(toml.stdout.includes(`command = ${JSON.stringify(process.execPath)}`));
  assert.equal(run(['--format', 'invalid']).status, 1);
});

test('text export includes selected full bodies and rejects unknown IDs', async () => {
  const pkg = await loadPackage();
  const id = [...pkg.references.keys()][0];
  const run = args => spawnSync(process.execPath, ['scripts/export.mjs', ...args], { cwd: PACKAGE_ROOT, encoding: 'utf8' });
  const result = run(['--skill', 'threejs-engineering', '--reference', id]);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes(pkg.references.get(id).rawText.split('\n')[0]));
  assert.ok(result.stdout.includes('Document: threejs-engineering/SKILL.md'));
  const bad = run(['--reference', '../package.json']);
  assert.equal(bad.status, 1); assert.equal(bad.stdout, '');
  for (const entry of pkg.bundles.values()) {
    const bundle = run(['--bundle',entry.name]);
    assert.equal(bundle.status,0,bundle.stderr);
    for (const id of entry.references) assert.ok(bundle.stdout.includes(`Document: ${id}`));
  }
  assert.equal(run(['--bundle','missing']).status,1);
  const combined = run(['--bundle', 'premium-ui', '--bundle', 'product-3d', '--bundle', 'premium-ui']);
  assert.equal(combined.status, 0, combined.stderr);
  const expected = new Set([`${SERVER_NAME}/SKILL.md`]);
  for (const name of ['premium-ui', 'product-3d']) {
    const entry = pkg.bundles.get(name);
    entry.skills.forEach(skill => expected.add(`${skill}/SKILL.md`));
    entry.references.forEach(id => expected.add(id));
  }
  const included = [...combined.stdout.matchAll(/^Document: (.+)\r?$/gm)].map(match => match[1].trim());
  assert.equal(included.length, expected.size, 'Combined exports contain each selected body once');
  assert.deepEqual(new Set(included), expected);
});

test('bundle inventory rejects unknown documents and duplicate names', async t => {
  const { root, manifest, save } = await fixture(t);
  manifest.bundles=[{name:'motion',description:'test',skills:[SERVER_NAME],references:['missing/references/a.md']}];await save();
  await assert.rejects(loadPackage(root), /Unknown bundle reference/);
  manifest.bundles[0].references=[];await save();assert.equal((await loadPackage(root)).bundles.size,1);
  manifest.bundles.push(manifest.bundles[0]);await save();await assert.rejects(loadPackage(root),/duplicate bundle/);
});

test('distribution stages in a new root child, preserves content and rejects source destinations', async t => {
  const name = `.package-test-${randomUUID()}`;
  const target = resolve(PACKAGE_ROOT, name);
  t.after(async () => {
    if (dirname(target) !== PACKAGE_ROOT || !basename(target).startsWith('.package-test-')) throw new Error('Unsafe package test cleanup');
    try {
      if (await realpath(target) !== target) throw new Error('Package test target changed location');
      await rm(target, { recursive: true });
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  });
  const run = out => spawnSync(process.execPath, ['scripts/build-package.mjs', '--out', out], { cwd: PACKAGE_ROOT, encoding: 'utf8' });
  const result = run(name);
  assert.equal(result.status, 0, result.stderr);
  const source = await loadPackage();
  const staged = await loadPackage(target);
  assert.deepEqual([...staged.bundles.keys()], [...source.bundles.keys()]);
  for (const [id, doc] of source.documentsByPath) assert.equal(staged.documentsByPath.get(id).rawText, doc.rawText, id);
  const manifest = JSON.parse(await readFile(join(target, 'package.json'), 'utf8'));
  const lock = JSON.parse(await readFile(join(target, 'package-lock.json'), 'utf8'));
  assert.equal(lock.version, manifest.version);
  assert.equal(lock.packages[''].version, manifest.version);
  for (const path of manifest.files) await access(join(target, path));
  for (const path of ['node_modules', 'artifacts', 'examples', '.git']) await assert.rejects(access(join(target, path)), { code: 'ENOENT' });
  assert.equal(run(name).status, 1, 'Existing directory must remain intact');
  for (const folder of ['skills', 'scripts', 'mcp', 'tests']) {
    const rejected = join(folder, name);
    const failure = run(rejected);
    assert.equal(failure.status, 1);
    assert.match(failure.stderr, /outside source/);
    await assert.rejects(access(resolve(PACKAGE_ROOT, rejected)), { code: 'ENOENT' });
  }
  const validation = spawnSync(process.execPath, ['scripts/validate.mjs'], { cwd: target, encoding: 'utf8' });
  assert.equal(validation.status, 0, validation.stderr);
});
