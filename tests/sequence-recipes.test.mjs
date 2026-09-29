import test from 'node:test';
import assert from 'node:assert/strict';
import { importMotionRecipes } from '../scripts/reference-runtime.mjs';
const { sequenceIndex, sequenceWindow, coverRect } = await importMotionRecipes();

test('distributed sequence mapping preserves endpoints, reversal and a bounded priority window', () => {
  for (const count of [1, 2, 90, 121]) {
    assert.equal(sequenceIndex(-10, count), 0);
    assert.equal(sequenceIndex(10, count), count - 1);
    for (const p of [0, .25, .5, .75, 1, .9, .1, .8, .2]) {
      const target = sequenceIndex(p, count);
      for (const direction of [-1, 1]) {
        const window = sequenceWindow(target, count, 8, direction);
        assert.equal(window[0], target);
        assert.equal(window.length, Math.min(count, 8));
        assert.equal(new Set(window).size, window.length);
        assert.ok(window.every(n => n >= 0 && n < count));
      }
    }
  }
  assert.deepEqual(sequenceWindow(4, 10, 5, -1), [4, 3, 5, 2, 6]);
  assert.throws(() => sequenceIndex(NaN, 10));
  assert.throws(() => sequenceIndex(.5, 0));
  assert.throws(() => sequenceWindow(10, 10));
});

test('distributed cover crop preserves aspect, fills the viewport and honors alignment', () => {
  for (const [iw, ih, vw, vh] of [[1920,1080,390,600], [600,900,1440,600], [640,480,320,240]]) {
    for (const focal of [0, .5, 1]) {
      const r = coverRect(iw, ih, vw, vh, focal, focal);
      assert.ok(r.x <= 0 && r.y <= 0);
      assert.ok(r.x + r.width >= vw - 1e-9 && r.y + r.height >= vh - 1e-9);
      assert.ok(Math.abs(r.width / r.height - iw / ih) < 1e-12);
    }
  }
  const aligned = coverRect(100,100,200,100,0,0);
  assert.equal(Math.abs(aligned.x) + Math.abs(aligned.y), 0);
  assert.equal(aligned.width, 200);assert.equal(aligned.height, 200);
  assert.throws(() => coverRect(100,100,0,100));
});
