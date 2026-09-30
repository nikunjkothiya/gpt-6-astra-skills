import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, readFile, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';
import { audit, parseArgs as auditArgs } from '../scripts/audit.mjs';
import { capture, installObservers, parseArgs as captureArgs, summary } from '../scripts/capture.mjs';
import { inside, PACKAGE_ROOT } from '../mcp/content.mjs';

async function fixture(t) {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'vei-helpers-')));
  const temp = await realpath(tmpdir());
  t.after(async () => {
    assert.ok(inside(temp, root));
    assert.equal(await realpath(root), root);
    await rm(root, { recursive: true, force: true });
  });
  return root;
}

test('capture rejects invalid URLs, dimensions, duplicate evidence paths and unbounded options', () => {
  for (const args of [[], ['--url', 'https://'], ['--url', 'javascript:alert(1)'],
    ['--url', 'http://localhost', '--viewports', '0x900'],
    ['--url', 'http://localhost', '--viewports', '9000x9000'],
    ['--url', 'http://localhost', '--viewports', '390x844,390x844'],
    ['--url', 'http://localhost', '--timeout', '0'],
    ['--url', 'http://localhost', '--steps', 'Infinity'],
    ['--url', 'http://localhost', '--settle', '1e6'],
    ['--url', 'http://localhost', '--unknown', 'x']]) assert.throws(() => captureArgs(args));
  const options = captureArgs(['--url', 'http://localhost:8000', '--steps', '0', '--tabs', '0', '--viewports', '320x568']);
  assert.deepEqual(options.viewports, [{ width: 320, height: 568 }]);
  assert.equal(options.steps, 0);
});

test('capture refuses existing evidence before launching a browser', async t => {
  const root = await fixture(t);
  await writeFile(join(root, 'report.json'), 'existing evidence');
  let launched = false;
  await assert.rejects(capture({ chromium: { launch() { launched = true; } } }, {
    ...captureArgs(['--url', 'http://localhost']), out: root,
  }), /already exists/);
  assert.equal(launched, false);
  assert.equal(await readFile(join(root, 'report.json'), 'utf8'), 'existing evidence');
});

test('capture metrics use CLS session windows and distinguish unsupported observations', () => {
  const callbacks = new Map();
  class Observer {
    static supportedEntryTypes = ['layout-shift', 'largest-contentful-paint'];
    constructor(callback) { this.callback = callback; }
    observe({ type }) { callbacks.set(type, this.callback); }
  }
  const scope = { window: {}, PerformanceObserver: Observer };
  vm.runInNewContext(`(${installObservers.toString()})()`, scope);
  const shift = entries => callbacks.get('layout-shift')({ getEntries: () => entries });
  shift([{ startTime: 100, value: .1 }, { startTime: 500, value: .15 },
    { startTime: 800, value: .9, hadRecentInput: true }, { startTime: 2200, value: .2 }]);
  assert.equal(scope.window.__veiMetrics.cls, .25);
  assert.equal(scope.window.__veiMetrics.lcp, null);
  assert.equal(scope.window.__veiMetrics.loaf, null);
  callbacks.get('largest-contentful-paint')({ getEntries: () => [{ startTime: 1200.2 }] });
  assert.equal(scope.window.__veiMetrics.lcp, 1200);
  const unsupported = { window: {} };
  vm.runInNewContext(`(${installObservers.toString()})()`, unsupported);
  assert.equal(unsupported.window.__veiMetrics.cls, null);
});

test('audit reports source problems, respects bounds and does not mistake exact limit for truncation', async t => {
  const root = await fixture(t);
  await writeFile(join(root, 'a.html'), '<!doctype html>\n<img src="photo.png">');
  await mkdir(join(root, 'node_modules'));
  await writeFile(join(root, 'node_modules', 'ignored.html'), '<img>');
  const complete = await audit(root, { maxFiles: 1 });
  assert.equal(complete.summary.files, 1);
  assert.equal(complete.truncated, false);
  assert.ok(complete.findings.some(f => f.rule === 'a11y/img-alt' && f.line === 2));
  await writeFile(join(root, 'b.css'), 'body { font-family: system-ui; }');
  assert.equal((await audit(root, { maxFiles: 1 })).truncated, true);
  assert.equal((await audit(root, { maxFiles: 2 })).truncated, false);
  await writeFile(join(root, 'huge.js'), ' '.repeat(1024 * 1024 + 1));
  assert.deepEqual((await audit(root)).skippedOversized, ['huge.js']);
  for (const maxFiles of [0, -1, Infinity, 1.5]) await assert.rejects(audit(root, { maxFiles }));
});

test('audit distinguishes reusable JSX components and common-style notes from confirmed native defects', async t => {
  const root = await fixture(t);
  await writeFile(join(root, 'a.tsx'), '<Image src={photo} />; <img {...imageProps} />;');
  await writeFile(join(root, 'b.css'), 'body { font-family: system-ui; }');
  const result = await audit(root);
  assert.equal(result.findings.some(f => f.rule === 'a11y/img-alt'), false);
  assert.equal(result.summary.errors, 0);
});

test('audit CLI has explicit invalid-input, findings and incomplete-scan outcomes', async t => {
  for (const args of [['a', 'b'], ['--max-files', '0'], ['--max-files', '1e3'], ['--unknown']]) assert.throws(() => auditArgs(args));
  const root = await fixture(t);
  await writeFile(join(root, 'a.html'), '<img src="a.png">');
  await writeFile(join(root, 'b.css'), 'body { color: black; }');
  const run = args => spawnSync(process.execPath, [resolve(PACKAGE_ROOT, 'scripts/audit.mjs'), root, ...args], { encoding: 'utf8' });
  assert.equal(run(['--json']).status, 1);
  assert.equal(run(['--max-files', '1']).status, 2);
  assert.equal(run(['--unknown']).status, 2);
});

test('capture summary keeps missing metrics unobserved and states its evidence limit', () => {
  const text = summary({ out: 'evidence', report: { url: 'http://localhost', browser: 'chromium', problems: [], notes: [], viewports: [{ viewport: '390x844', files: [], facts: { metrics: { lcp: null, cls: null }, horizontalOverflow: 0, fontsLoaded: [] } }] } });
  assert.match(text, /LCP n\/a/);
  assert.match(text, /CLS n\/a/);
  assert.match(text, /INP is not measured/);
});
