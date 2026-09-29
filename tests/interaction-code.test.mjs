import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('published selection example rejects stale results, close/unmount commits, and permits retry', async () => {
  const text = await readFile(new URL('../skills/interaction-design/references/state-and-interruption.md', import.meta.url), 'utf8');
  const code = text.match(/```js\r?\n([\s\S]*?)```/)[1];
  const module = await import(`data:text/javascript;base64,${Buffer.from(code + '\nexport { createSelectionLoader };').toString('base64')}`);
  const requests = [];
  const renders = [];
  const loader = module.createSelectionLoader({
    fetchItem(id, options) { return new Promise((resolve, reject) => requests.push({ id, options, resolve, reject })); },
    render(state) { renders.push(state); },
  });
  const a = loader.select('A'); const b = loader.select('B');
  assert.equal(requests[0].options.signal.aborted, true);
  requests[1].resolve({ id: 'B' }); await b;
  requests[0].resolve({ id: 'A' }); await a;
  assert.equal(loader.getState().item.id, 'B');
  const c = loader.select('C'); loader.close(); requests[2].resolve({ id: 'C' }); await c;
  assert.equal(loader.getState().status, 'idle');
  const d = loader.select('D'); requests[3].reject(new Error('Network failure')); await d;
  assert.equal(loader.getState().status, 'error'); assert.equal(loader.getState().selectedId, 'D');
  const retry = loader.select('D'); requests[4].resolve({ id: 'D' }); await retry;
  assert.equal(loader.getState().status, 'ready');
  const e = loader.select('E'); const count = renders.length; loader.dispose();
  requests[5].resolve({ id: 'E' }); await e;
  await loader.select('F'); assert.equal(requests.length, 6); assert.equal(renders.length, count);
});
