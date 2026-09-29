# Scene lifecycle and resource ownership

Read when implementing a canvas, replacing a loaded product, or investigating stale renders, duplicate loops, resize problems, and resource growth. The patterns below target a browser using ES modules and a `WebGLRenderer`; adapt them to the installed revision. React Three Fiber owns its own loop and must use its separate integration reference.

## Allocate by ownership

A mounted viewer owns its renderer, controls, observers, listeners, animation work, and resources created exclusively for that viewer. A shared asset cache owns shared textures and geometries. Removing a mesh from a scene does not dispose its buffers. Disposing a material does not dispose its textures. Detach consumers before releasing resources whose last owner has gone away. [Three.js cleanup](https://threejs.org/manual/pages/cleanup.html)

Prefer an explicit resource set or asset handle with `release()` to an indiscriminate traversal that disposes every reachable texture. Count ownership of cached resources, shared material maps, render targets, skeleton resources, decoders, and environment preprocessing. Close owned image bitmaps only when no live texture or CPU task needs them. Dispose controls and remove observers and listeners as well as GPU objects.

Stop rendering and invalidate pending async results before teardown. A response that arrives after unmount must release its acquired asset handle rather than attach itself to an abandoned scene. For replacement requests, use a generation counter; only the latest generation may commit. Loading cancellation and stale-result rejection are separate responsibilities. Each failed or superseded acquisition must have one release path.

## Size from the allocated layout

Let CSS size the canvas and its parent. Observe that allocation with `ResizeObserver`; use width and height in CSS pixels for camera aspect. Set a deliberate pixel ratio separately, so a high device pixel ratio does not silently multiply the workload. `setSize(width, height, false)` preserves the CSS layout. Skip drawing while either dimension is zero. Update the perspective camera projection or orthographic extents when the allocation changes. [Three.js responsive design](https://threejs.org/manual/pages/responsive.html)

Fit the object to the useful region remaining around UI, not simply the entire window. Keep zoom and selected inspection state through layout changes unless preserving them would clip the subject. Size render targets and postprocessing consistently with the renderer. Recheck the device pixel ratio after zoom or display changes as well as layout changes.

## Demand rendering with a continuous-motion escape hatch

The following module owns a non-XR demand loop. Its `update(dt)` callback returns whether another frame is needed; a discrete state change calls `invalidate()`. It avoids elapsed time accumulated during a long idle interval. CSS controls size, and `resize()` updates the camera and drawing buffer and returns whether drawing is possible. It contains no scene-specific disposal logic.

```js
export function createDemandLoop({ render, update, resize }) {
  let frame = null;
  let previous = null;
  let disposed = false;

  function invalidate() {
    if (!disposed && frame === null) frame = requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = null;
    if (disposed) return;
    if (!resize()) { previous = null; return; }
    // Paused time is deliberately discarded for this presentation loop.
    const dt = previous === null ? 0 : Math.min((now - previous) / 1000, 0.05);
    previous = now;
    const active = update(dt);
    render();
    if (active) invalidate();
    else previous = null;
  }

  return {
    invalidate,
    dispose() {
      disposed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previous = null;
    },
  };
}
```

Invalidate on asset completion, resize, a changed setting, and control input. Damped controls need continued updates until their motion settles; inspect the installed controls' update semantics. Always request the final settled frame. An `invalidate()` scheduled inside `update` is safe and should not cause a second simultaneous callback.

For sustained simulation, video, XR, or continuous movement, prefer the renderer's `setAnimationLoop(callback)` and stop it with `setAnimationLoop(null)` during teardown. Do not run it alongside another renderer loop. The renderer documentation recommends this path for general animation and XR compatibility. A demand loop is a deliberate non-XR scheduling choice. [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html)

Elapsed time policy is a product decision. The example pauses presentation across idle or long stalls. A clock, synchronized experience, or deterministic replay needs its own absolute time policy. Use bounded fixed steps for simulation when required; decide whether excess elapsed time is discarded, caught up, or reconciled to authoritative state.

## Observe failure and recovery

Keep useful DOM content or a representative image present until the first usable render. Model loading and GPU initialization may finish at different times. A failed renderer or lost context needs a visible alternative and deliberate recovery path; the rest of the product remains usable. Reapply scene state on recovery, and inspect release of the previous resources.

Test two rapid asset replacements, unmount while loading, remount, hidden-to-visible layout, a long background pause, and cleanup after an active gesture. Compare resource counts over equivalent warmed-up cycles and inspect detached DOM/listeners as well as GPU counts.
