import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { PACKAGE_ROOT } from '../mcp/content.mjs';
import { resolve } from 'node:path';
import * as THREE from 'three';

test('reference code: real transforms, 1000 rest cycles, motion continuity, and demand-loop lifetime', async t => {
  const originalRequest = globalThis.requestAnimationFrame;
  const originalCancel = globalThis.cancelAnimationFrame;
  t.after(() => { globalThis.requestAnimationFrame = originalRequest; globalThis.cancelAnimationFrame = originalCancel; });
  const references = [
    'skills/threejs-engineering/references/scene-lifecycle.md',
    'skills/threejs-engineering/references/input-and-interface.md',
    'skills/object-structure/references/canonical-poses.md',
    'skills/motion-intelligence/references/timing-and-interruption.md',
  ];
  const modules = new Map();
  let count = 0;
  for (const path of references) {
    const source = await readFile(resolve(PACKAGE_ROOT, path), 'utf8');
    for (const match of source.matchAll(/```js\r?\n([\s\S]*?)```/g)) {
      const code = match[1];
      count++;
      const resolved = code.replace("from 'three'", `from ${JSON.stringify(import.meta.resolve('three'))}`);
      const loaded = await import(`data:text/javascript;base64,${Buffer.from(resolved).toString('base64')}`);
      for (const [name, fn] of Object.entries(loaded)) modules.set(name, fn);
    }
  }

  const stepCritical = modules.get('stepCritical');
  const settleAtTarget = modules.get('settleAtTarget');
  const original = { x: -2, v: 3 };
  const whole = stepCritical(original, 4, 1, 18);
  let divided = { ...original };
  for (let i = 0; i < 60; i++) divided = stepCritical(divided, 4, 1 / 60, 18);
  assert.ok(Math.abs(whole.x - divided.x) < 1e-12);
  assert.ok(Math.abs(whole.v - divided.v) < 1e-12);
  const mid = stepCritical(original, 4, 0.15, 18);
  const retarget = stepCritical(mid, -8, 0, 18);
  assert.ok(Math.abs(retarget.x - mid.x) < 1e-12);
  assert.equal(retarget.v, mid.v);
  assert.deepEqual(settleAtTarget({ x: 0.9999, v: 0.00001 }, 1, 0.001, 0.001), { x: 1, v: 0, done: true });
  assert.throws(() => stepCritical(original, 1, -1, 18), RangeError);
  assert.throws(() => stepCritical(original, 1, 1, 0), RangeError);
  assert.deepEqual(original, { x: -2, v: 3 });

  const intervalProgress = modules.get('intervalProgress');
  assert.equal(intervalProgress(0.1, 0.2, 0.6), 0);
  assert.equal(intervalProgress(0.8, 0.2, 0.6), 1);
  assert.ok(Math.abs(intervalProgress(0.4, 0.2, 0.6) - 0.5) < 1e-12);
  assert.throws(() => intervalProgress(0, 1, 1), RangeError);

  const canvasNdc = modules.get('canvasNdc');
  const out = { set(x, y) { this.x = x; this.y = y; } };
  const canvas = { getBoundingClientRect: () => ({ left: 100, top: 200, width: 300, height: 150 }) };
  assert.equal(canvasNdc({ clientX: 250, clientY: 275 }, canvas, out), true);
  assert.equal(out.x, 0); assert.equal(out.y, 0);
  canvasNdc({ clientX: 100, clientY: 200 }, canvas, out);
  assert.equal(out.x, -1); assert.equal(out.y, 1);

  const frames = new Map();
  let sequence = 0;
  globalThis.requestAnimationFrame = callback => { frames.set(++sequence, callback); return sequence; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  const dts = [];
  let rendered = 0;
  let drawable = true;
  const loop = modules.get('createDemandLoop')({
    render() { rendered++; },
    update(dt) { dts.push(dt); return dts.length < 3; },
    resize() { return drawable; },
  });
  function frame(now) {
    assert.equal(frames.size, 1);
    const [id, callback] = frames.entries().next().value;
    frames.delete(id);
    callback(now);
  }
  loop.invalidate(); loop.invalidate();
  frame(1000); frame(1016); frame(1032);
  assert.equal(frames.size, 0);
  assert.deepEqual(dts, [0, 0.016, 0.016]);
  loop.invalidate(); frame(10000);
  assert.equal(dts.at(-1), 0);
  assert.equal(rendered, 4);
  drawable = false; loop.invalidate(); frame(11000);
  assert.equal(rendered, 4);
  drawable = true; loop.invalidate(); loop.dispose();
  assert.equal(frames.size, 0);
  loop.invalidate(); assert.equal(frames.size, 0);

  const parent = new THREE.Group();
  parent.position.set(10, -4, 3);
  parent.rotation.z = 0.3;
  const part = new THREE.Object3D();
  part.position.set(1, 2, -3);
  part.rotation.set(0.2, -0.3, 0.5);
  parent.add(part);
  const restPosition = part.position.clone();
  const restQuaternion = part.quaternion.clone();
  const restScale = part.scale.clone();
  const offset = new THREE.Vector3(0, 2, 0);
  const applyTrack = modules.get('createTranslationTrack')(part, offset);
  offset.set(100, 100, 100);
  for (let i = 0; i < 1000; i++) {
    applyTrack(0.75); applyTrack(0.1); applyTrack(1); applyTrack(0);
    assert.ok(part.position.equals(restPosition));
    assert.ok(part.quaternion.equals(restQuaternion));
    assert.ok(part.scale.equals(restScale));
  }
  applyTrack(0.5);
  assert.ok(part.position.equals(restPosition.clone().add(new THREE.Vector3(0, 1, 0))));
  parent.position.x += 3;
  applyTrack(0);
  parent.updateMatrixWorld(true);
  const expectedWorld = restPosition.clone().applyMatrix4(parent.matrixWorld);
  assert.ok(part.getWorldPosition(new THREE.Vector3()).distanceTo(expectedWorld) < 1e-12);
  new THREE.Group().add(part);
  assert.throws(() => applyTrack(0), /Rebuild track/);

  const hingeParent = new THREE.Group();
  const hingedMesh = new THREE.Object3D();
  const hinged = modules.get('createHingedPart')(
    hingedMesh, hingeParent, new THREE.Vector3(2, 0, 0), new THREE.Vector3(1, 0, 0),
  );
  hinged.setAngle(Math.PI / 2);
  hingeParent.updateMatrixWorld(true);
  assert.ok(hingedMesh.getWorldPosition(new THREE.Vector3()).distanceTo(new THREE.Vector3(2, 1, 0)) < 1e-12);
  hinged.setAngle(0);
  hingeParent.updateMatrixWorld(true);
  assert.ok(hingedMesh.getWorldPosition(new THREE.Vector3()).equals(new THREE.Vector3(3, 0, 0)));

  assert.equal(count, 5);

});
