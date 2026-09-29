import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { once } from 'node:events';
import { loadPackage, bundleText, PACKAGE_ROOT } from '../mcp/content.mjs';

test('real stdio MCP: initialize, discovery, every document, validation, prompts, and EOF', { timeout: 30000 }, async t => {
  const root = process.env.VISUAL_TEST_PACKAGE_ROOT || PACKAGE_ROOT;
  const pkg = await loadPackage(root);
  const child = spawn(process.execPath, ['mcp/server.mjs'], { cwd: root, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
  t.after(() => { if (child.exitCode === null) child.kill(); });
  let stderr = '';
  child.stderr.setEncoding('utf8'); child.stderr.on('data', value => { stderr += value; });
  const pending = new Map();
  let sequence = 0;
  const lines = createInterface({ input: child.stdout });
  let invalidOutput = '';
  lines.on('line', line => {
    let message;
    try { message = JSON.parse(line); } catch { invalidOutput += line; return; }
    const handler = pending.get(message.id);
    if (handler) { pending.delete(message.id); handler(message); }
  });
  child.on('exit', () => { for (const handler of pending.values()) handler({ error: { message: stderr || 'Server exited' } }); pending.clear(); });
  function request(method, params = {}) {
    const id = ++sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timeout: ${method}. ${stderr}`)); }, 8000);
      pending.set(id, response => { clearTimeout(timer); resolve(response); });
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    });
  }
  const initialized = await request('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'package-integration-test', version: '1.0' } });
  assert.ok(initialized.result, JSON.stringify(initialized));
  assert.equal(initialized.result.serverInfo.version, pkg.metadata.version);
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
  const tools = (await request('tools/list')).result.tools;
  assert.deepEqual(tools.map(x => x.name).sort(), ['visual_engineering_bundle','visual_engineering_list','visual_engineering_read','visual_engineering_reference','visual_engineering_start']);
  for (const tool of tools) assert.equal(tool.annotations.readOnlyHint, true);
  const catalog = await request('tools/call', { name: 'visual_engineering_list', arguments: {} });
  assert.ok(catalog.result.content[0].text.includes(`${pkg.skills.size} of ${pkg.skills.size}`));
  const query = await request('tools/call', { name: 'visual_engineering_list', arguments: { query: 'three.js lifecycle' } });
  assert.ok(query.result.content[0].text.includes('threejs-engineering'));
  const start = await request('tools/call', { name: 'visual_engineering_start', arguments: { task: 'Build a product explorer' } });
  assert.ok(start.result.content[0].text.includes('Build a product explorer'));
  const resources = (await request('resources/list')).result.resources;
  assert.equal(resources.length, pkg.documentsByPath.size + pkg.bundles.size + 1);
  for (const bundle of pkg.bundles.values()) {
    const read = await request('resources/read', { uri: bundle.uri });
    const called = await request('tools/call', { name: 'visual_engineering_bundle', arguments: { name: bundle.name } });
    assert.equal(read.result.contents[0].text, bundleText(pkg,bundle.name));
    assert.equal(called.result.content[0].text, read.result.contents[0].text);
  }
  for (const doc of pkg.documentsByPath.values()) {
    const read = await request('resources/read', { uri: doc.uri });
    assert.equal(read.result?.contents[0].text, doc.text, JSON.stringify(read));
    const isReference = Boolean(doc.id);
    const called = await request('tools/call', {
      name: isReference ? 'visual_engineering_reference' : 'visual_engineering_read',
      arguments: isReference ? { ids: [doc.id] } : { names: [doc.name] },
    });
    assert.equal(called.result?.content[0].text, doc.text, JSON.stringify(called));
  }
  const duplicate = await request('tools/call', { name: 'visual_engineering_read', arguments: { names: ['threejs-engineering','threejs-engineering'] } });
  assert.equal(duplicate.result.content.length, 1);
  const badRequests = [
    ['visual_engineering_bundle', { name: '../package.json' }],
    ['visual_engineering_bundle', { name: 'interactive-motion', path: 'secret' }],
    ['visual_engineering_read', { names: ['../../package.json'] }],
    ['visual_engineering_read', { names: [] }],
    ['visual_engineering_read', { names: Array(9).fill('threejs-engineering') }],
    ['visual_engineering_reference', { ids: ['threejs-engineering/references/../../../../package.json'] }],
    ['visual_engineering_reference', { ids: [] }],
    ['visual_engineering_list', { query: 'a'.repeat(201) }],
    ['visual_engineering_start', { task: ' ' }],
    ['visual_engineering_start', { task: 'a'.repeat(16001) }],
    ['visual_engineering_list', { path: 'package.json' }],
  ];
  for (const [name, args] of badRequests) {
    const result = await request('tools/call', { name, arguments: args });
    assert.ok(result.error || result.result?.isError, `Accepted invalid input: ${JSON.stringify(args)}`);
  }
  assert.ok((await request('resources/read', { uri: 'visual-engineering://references/../../package.json' })).error);
  assert.equal((await request('prompts/list')).result.prompts.length, 1);
  const prompt = await request('prompts/get', { name: 'visual-engineering', arguments: { task: 'Inspect motion' } });
  assert.ok(prompt.result.messages[0].content.text.includes('Inspect motion'));
  assert.ok((await request('prompts/get', { name: 'visual-engineering', arguments: {} })).error);
  const ended = once(child, 'exit'); child.stdin.end();
  const [code] = await ended;
  assert.equal(code, 0, stderr);
  assert.equal(invalidOutput, '', 'stdout must contain only JSON-RPC');
});
