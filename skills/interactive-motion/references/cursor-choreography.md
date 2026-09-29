# Cursor tracking, masks and local motion

Use for pointer-driven presentation. FROM-KNOWLEDGE original recipes; values are ESTIMATED starting designs. Coordinate conversion, ownership and stopping conditions determine whether an effect stays attached to the user's intent.

## Declare input ownership

Measure the stationary interaction surface in viewport CSS pixels. Convert `clientX/clientY` against its `getBoundingClientRect()`, then clamp normalized x/y to [0,1]. Do not divide by window size for a smaller card or mix page coordinates with viewport bounds. For a rotated/perspective surface this rectangular mapping is only an approximation; use the inverse transform or ray/plane intersection for exact contact. Sample layout on input/resize, not from the moving visual wrapper.

Use a fine pointer with hover for decorative tracking. Keep equivalent focus, selected or explicit controls for keyboard/touch. A follower uses `pointer-events:none`; keep native cursor feedback. A drag is a different contract: capture only once horizontal or spatial gesture ownership is established, handle up/cancel/lost capture, and preserve normal page scroll with the appropriate touch-action. The browser can cancel a pointer stream; see [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).

| Pattern | Mapping and numbers | Failure / verification |
| --- | --- | --- |
| Follower / preview | Render local x/y or viewport position plus 20 px offset; response 18 s⁻¹; .16 s opacity; clamp a 160×100 px preview inside viewport | Target stays clickable, no overflow, exits cleanly, stops at rest |
| Magnetic visual | Inner visual x/y = `(u−.5)*12` px; response 20 s⁻¹; neutral on leave | Outer hit target/focus ring stays stationary; edge click and press/cancel work |
| Parallax layer | Offset `(u−.5)*24` px; independent depths .3/.6/1; response 12 s⁻¹ | Overscan covers 12 px travel on all edges; text/CTA remain stable |
| Tilt | X=`(.5−v)*8°`, Y=`(u−.5)*8°`; perspective 900 px | Keep a wrapper for tilt; unrelated GSAP transform owns another wrapper; inspect corners |
| Spotlight / mask | CSS radial mask centered at `(100u%,100v%)`, radius 120 px, feather 32 px | Base image/text readable without mask; focus reveals equivalent content; watch repaint cost |
| Image/video reveal | Pointer sets mask position; underlying media may play independently, or x owns time through media-scrubbing | Do not confuse spatial reveal with temporal scrubbing; inspect crop and edges |
| Shader ripple | UV center from real canvas; amplitude .008 UV, decay 3 s⁻¹, radial frequency 30 | Resolve texture cover UV before effect; no growing ripple list; touch alternative |

## Reusable controller

This module owns only normalized pointer state and one demand-based RAF chain. `onChange` writes a dedicated visual layer. It ignores touch, resets on cancel/blur, and releases every listener on dispose. A real drag needs the additional capture contract above. The host owns media-query/visibility policy via `setEnabled`.

<!-- runtime:start -->
```js
export function pointerUnit(clientX, clientY, rect) {
  if (![clientX, clientY, rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) || rect.width <= 0 || rect.height <= 0) return null;
  const clamp = n => Math.max(0, Math.min(1, n));
  return { x: clamp((clientX - rect.left) / rect.width), y: clamp((clientY - rect.top) / rect.height) };
}

export function damp(current, target, rate, dt) {
  if (![current, target, rate, dt].every(Number.isFinite) || rate <= 0 || dt < 0) throw new Error('Invalid damping input');
  return target + (current - target) * Math.exp(-rate * dt);
}

export function createPointerDriver(surface, onChange, {
  rate = 18, leave = 'center',
  requestFrame = callback => requestAnimationFrame(callback),
  cancelFrame = id => cancelAnimationFrame(id),
  eventRoot = globalThis,
} = {}) {
  if (!(rate > 0) || !Number.isFinite(rate) || !['center', 'hold'].includes(leave)) throw new Error('Invalid pointer policy');
  let x = .5, y = .5, target = { x, y }, active = false, enabled = true, disposed = false;
  let frame = null, last = null;
  const snapshot = () => ({ x, y, active, enabled, pending: frame !== null });
  const emit = () => onChange(snapshot());
  function stop() { if (frame !== null) cancelFrame(frame); frame = null; last = null; }
  function tick(time) {
    frame = null;
    if (disposed || !enabled) return;
    const dt = last === null ? 0 : Math.max(0, Math.min(.05, (time - last) / 1000));
    last = time;
    x = damp(x, target.x, rate, dt); y = damp(y, target.y, rate, dt);
    const moving = Math.max(Math.abs(x - target.x), Math.abs(y - target.y)) > .0001;
    if (!moving) { x = target.x; y = target.y; last = null; }
    emit();
    if (moving && !disposed && enabled) frame = requestFrame(tick);
  }
  function wake() { if (frame === null && enabled && !disposed) frame = requestFrame(tick); }
  function move(event) {
    if (!enabled || disposed || event.pointerType === 'touch') return;
    const point = pointerUnit(event.clientX, event.clientY, surface.getBoundingClientRect());
    if (!point) return;
    target = point; active = true; wake();
  }
  function leaveSurface() { active = false; if (leave === 'center') target = { x: .5, y: .5 }; wake(); }
  function reset() { stop(); active = false; x = y = .5; target = { x, y }; if (!disposed) emit(); }
  const listeners = [['pointerenter', move], ['pointermove', move], ['pointerleave', leaveSurface], ['pointercancel', reset]];
  for (const [type, fn] of listeners) surface.addEventListener(type, fn, { passive: true });
  eventRoot.addEventListener?.('blur', reset);
  return {
    snapshot,
    setEnabled(value) { if (disposed) return; enabled = Boolean(value); if (!enabled) reset(); },
    reset,
    dispose() { if (disposed) return; disposed = true; stop(); for (const [type, fn] of listeners) surface.removeEventListener(type, fn); eventRoot.removeEventListener?.('blur', reset); },
  };
}
```
<!-- runtime:end -->

The analytic `damp` has equal-time behavior across different frame partitions for a fixed target. The controller deliberately caps a foreground step at 50 ms, so an unexpected scheduling gap slows the return instead of jumping. Disable/reset on hidden documents, then resume from neutral; do not claim that capped late-frame behavior is identical to uninterrupted simulation. If position and velocity must both be continuous, use the existing critical spring recipe instead.

Example callback for a dedicated transform child: `visual.style.transform = translate3d((x-.5)*12px,(y-.5)*12px,0)`. Use actual template-string syntax in code. A mask can use CSS custom properties `--pointer-x` / `--pointer-y`, assigned as percentages. If CSS owns an opacity transition, JS may set its target opacity, while this driver owns transform; avoid a CSS transform transition on the same child.

## Verify the response

Check equal-time damping at 30/60/120 Hz; real element offsets and scrolled position; zero-sized surface; repeated enter/leave; cancellation; blur; preference changes while moving; final exact settle; idle RAF count; dispose while a callback is queued. Test touch without hover and keyboard without a pointer. Record travel/rate and actual frame cadence separately. Inspect the complete rendered page for overlap, pointer lag and overscan, not just the formula.
