import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import vm from 'node:vm';
import { PACKAGE_ROOT } from '../mcp/content.mjs';

async function blocks(path, language = 'js') {
  const text = (await readFile(resolve(PACKAGE_ROOT, 'skills', path), 'utf8')).replace(/\r\n/g, '\n');
  return [...text.matchAll(new RegExp('```' + language + '\\n([\\s\\S]*?)\\n```', 'g'))].map(m => m[1]);
}
async function recipe(path, name, globals = {}) {
  const source = (await blocks(path)).find(b => b.includes(`export function ${name}(`) || b.includes(`export async function ${name}(`));
  assert.ok(source, `${path} exports ${name}`);
  return vm.runInNewContext(`${source.replace(/^export /gm, '')}\n${name}`, globals);
}
class Node {
  listeners = new Map();
  attributes = new Map();
  style = {};
  dataset = {};
  isConnected = true;
  textContent = '';
  addEventListener(type, fn) { if (!this.listeners.has(type)) this.listeners.set(type, new Set()); this.listeners.get(type).add(fn); }
  removeEventListener(type, fn) { this.listeners.get(type)?.delete(fn); }
  emit(type, fields = {}) { for (const fn of this.listeners.get(type) ?? []) fn({ target: this, ...fields }); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
  closest() { return null; }
}
function timers() {
  let id = 0;
  const jobs = new Map();
  return { setTimeout(fn) { jobs.set(++id, fn); return id; }, clearTimeout(key) { jobs.delete(key); },
    flush() { const ready = [...jobs.values()]; jobs.clear(); ready.forEach(fn => fn()); }, jobs };
}

test('distributed motion math preserves damping, spring continuity, fade endpoints and seeded results', async () => {
  const source = (await blocks('motion-engineering/references/easing-and-timing.md')).find(b => b.includes('export function springAt'));
  const m = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  assert.ok(Math.abs(m.damp(m.damp(0, 10, 8, .1), 10, 8, .1) - m.damp(0, 10, 8, .2)) < 1e-12);
  for (const damping of [10, 20, 40]) { assert.equal(m.springAt(0, 100, damping), 0); assert.ok(Math.abs(m.springAt(20, 100, damping) - 1) < 1e-6); }
  const keys = [[0, 0], [1, 10], [2, -5]];
  assert.ok(Math.abs(m.track(2 - 1e-7, keys) - m.track(2 + 1e-7, keys)) < 1e-4);
  assert.equal(m.swapAlpha(1, 0), 1);
  assert.equal(m.swapAlpha(3, 0, 2), 0);
  const a = m.mulberry32(17), b = m.mulberry32(17);
  for (let i = 0; i < 100; i++) assert.equal(a(), b());
  assert.deepEqual(m.staggerOffsets(0, 1), []);
  assert.deepEqual(m.staggerOffsets(1, 1), [0]);
});

test('dialog sample preserves inside clicks and releases its lock on close and disposal', async () => {
  const controls = await recipe('component-craft/references/forms-overlays-feedback.md', 'dialogControls');
  const dialog = new Node();
  dialog.open = false;
  dialog.getBoundingClientRect = () => ({ left: 10, right: 200, top: 10, bottom: 200 });
  dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => { dialog.open = false; dialog.emit('close'); };
  let locks = 0;
  const api = controls(dialog, { lock() { locks++; }, unlock() { locks--; } });
  api.open(); api.open(); assert.equal(locks, 1);
  dialog.emit('click', { clientX: 20, clientY: 20 }); assert.equal(dialog.open, true);
  dialog.emit('click', { clientX: 0, clientY: 0 }); assert.equal(dialog.open, false); assert.equal(locks, 0);
  api.open(); api.destroy(); api.destroy(); assert.equal(locks, 0); assert.equal(dialog.open, false);
});

test('tooltip sample supports pointer transfer, Escape and pending-timer disposal', async () => {
  const clock = timers();
  const trigger = new Node(), tip = new Node(), document = new Node();
  trigger.dataset.tip = 'tip';
  document.getElementById = () => tip;
  let open = false;
  tip.matches = () => open;
  tip.showPopover = () => { open = true; };
  tip.hidePopover = () => { open = false; };
  const tooltip = await recipe('component-craft/references/buttons-links-cursor.md', 'tooltip', { document, ...clock });
  const dispose = tooltip(trigger);
  trigger.emit('pointerenter'); clock.flush(); assert.equal(open, true);
  trigger.emit('pointerleave'); tip.emit('pointerenter'); clock.flush(); assert.equal(open, true);
  document.emit('keydown', { key: 'Escape' }); assert.equal(open, false);
  tip.emit('pointerleave'); clock.flush(); trigger.emit('focus');
  dispose(); clock.flush(); assert.equal(open, false); assert.equal(clock.jobs.size, 0);
});

test('background-video sample respects visibility, changed preference and late playback after disposal', async () => {
  const preference = new Node(); preference.matches = false;
  const document = new Node(); document.hidden = false;
  let intersection, disconnected = false, resolvePlay;
  class Observer { constructor(callback) { intersection = callback; } observe() {} disconnect() { disconnected = true; } }
  const video = new Node(), toggle = new Node(); video.paused = true;
  video.play = () => { video.paused = false; return new Promise(resolve => { resolvePlay = resolve; }); };
  video.pause = () => { video.paused = true; };
  const init = await recipe('component-craft/references/media-and-galleries.md', 'backgroundVideo', { window: { matchMedia: () => preference }, document, IntersectionObserver: Observer });
  const dispose = init(video, toggle);
  intersection([{ isIntersecting: true, intersectionRatio: 1 }]); assert.equal(video.paused, false);
  document.hidden = true; document.emit('visibilitychange'); assert.equal(video.paused, true);
  resolvePlay(); await Promise.resolve(); assert.equal(video.paused, true);
  document.hidden = false; preference.matches = true; preference.emit('change'); assert.equal(video.paused, true);
  toggle.emit('click'); assert.equal(video.paused, false);
  dispose(); resolvePlay(); await Promise.resolve(); assert.equal(video.paused, true); assert.equal(disconnected, true);
});

test('deterministic canvas example freezes capture and seeking cancels autoplay', async () => {
  const mathSource = (await blocks('motion-engineering/references/easing-and-timing.md')).find(b => b.includes('export function springAt'));
  const math = await import(`data:text/javascript;base64,${Buffer.from(mathSource).toString('base64')}`);
  const html = (await blocks('motion-engineering/references/deterministic-render.md', 'html'))[0];
  const script = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1].replace(/^\s*import .+;$/m, '');
  for (const search of ['?t=0', '']) {
    const pending = new Map(); let id = 0;
    const draw = [];
    const ctx = Object.fromEntries(['fillRect', 'beginPath', 'arc', 'fill', 'fillText'].map(name => [name, (...args) => draw.push([name, ...args])]));
    const scope = { ...math, window: {}, URLSearchParams, location: { search }, matchMedia: () => ({ matches: false }), document: { getElementById: () => ({ getContext: () => ctx }), fonts: { load: async () => [] } }, requestAnimationFrame(fn) { pending.set(++id, fn); return id; }, cancelAnimationFrame(key) { pending.delete(key); } };
    await vm.runInNewContext(`(async () => {${script}})()`, scope);
    assert.equal(scope.window.ready, true);
    assert.equal(pending.size, search ? 0 : 1);
    draw.length = 0; await scope.window.seek(3); const expected = JSON.stringify(draw);
    await scope.window.seek(7); draw.length = 0; await scope.window.seek(3);
    assert.equal(JSON.stringify(draw), expected);
    assert.equal(pending.size, 0);
  }
});

test('view transition helper tolerates a skipped snapshot while propagating update failure', async () => {
  let updates = 0;
  const withTransition = await recipe('motion-engineering/references/page-transitions.md', 'withTransition', {
    window: { matchMedia: () => ({ matches: false }) },
    document: { startViewTransition(update) {
      return { ready: Promise.reject(new Error('snapshot skipped')), finished: Promise.resolve().then(update) };
    } },
  });
  await withTransition(() => { updates++; });
  assert.equal(updates, 1);
  await assert.rejects(withTransition(() => { throw new Error('update failed'); }), /update failed/);
});
