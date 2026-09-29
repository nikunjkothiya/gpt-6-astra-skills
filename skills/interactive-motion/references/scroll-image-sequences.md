# Scroll-controlled JPG, WebP and PNG sequences

Use when scroll must select exact prerecorded frames, including frames extracted from a video. This is a reusable implementation contract, not a page template. Numeric budgets are ESTIMATED starting points. Read [asset preparation](asset-preparation.md) and [media ownership](media-scrubbing.md) first.

## Decide what is changing

- **Continuous recorded action:** ordered frames from one shot; normalized progress selects a frame. Preserve camera, subject scale, exposure and chronology. This can show a rotation, assembly or camera move without a live 3D renderer.
- **Editorial picture changes:** different photographs attached to discrete chapters. Select by chapter boundaries, with deliberate hard cuts or brief opacity transitions. Do not pretend unrelated photographs form a physically continuous motion.
- **Live spatial inspection:** arbitrary viewpoints require suitable geometry or authored multiview assets. A one-dimensional sequence only exposes its recorded views.

Choose a sequence over video when precise random frame access justifies its larger request count and decoded memory. Choose video when compression, continuous playback or a long clip dominates. Determine this from the actual asset and host; file extensions alone do not establish smoothness.

## Manifest and preparation

Create an explicit ordered manifest containing `frames`, `width`, `height`, `poster`, `fps` or per-frame timestamps, content version, crop/focal point and source provenance. Use zero-padded filenames and verify the complete numbered range. Array length is authoritative; do not infer it from nominal duration × fps. JPG has no alpha; choose PNG/WebP or a deliberate matte when transparency matters.

Frame count, resolution and sampling rate are independent quality controls. A 3-second source at 30 fps produces roughly 90 frames; assert the actual result after extraction. Ninety 1280×720 RGBA bitmaps occupy about 316 MiB before browser/decoder/GPU overhead. A small download does not imply a small decoded footprint.

Begin with two simultaneous requests/decodes and a rolling cache of eight 960×540 frames (~16 MiB for cached RGBA pixels). Reserve additional room for in-flight decodes, the canvas backing buffer, poster, browser overhead and any duplicated GPU textures. Select dimensions and cache capacity together. If the minimum useful working set does not fit, use a smaller asset or the poster instead of silently exceeding the budget.

## One canonical progress value

For a native sticky scene, measure its stationary section. Let `startY` be the document position at which its stage reaches the intended sticky offset. Let `endY` be the last position at which the stage can remain there. Set `p=clamp((scrollY-startY)/(endY-startY),0,1)`. For a viewport-high stage with top offset zero, `startY=sectionDocumentTop`, `endY=startY+sectionHeight-viewportHeight`. Account for nonzero top offset and actual stage height; do not reuse that simplified formula blindly.

Use the existing scroller's progress if the project already has GSAP/Lenis. A scroll listener records intent and schedules at most one RAF; a ResizeObserver or layout refresh recomputes bounds after fonts/media change. Avoid remeasuring all frames on every scroll event. Never add wheel interception just to obtain progress.

Guard the travel interval before division. If `endY <= startY`, the section has no usable scrub distance: show the selected static frame in normal flow and keep controls/content usable. Re-evaluate on layout changes; never send NaN or Infinity into the frame mapping. This is particularly relevant when a mobile or enlarged-text layout removes pinning.

For N constant-rate frames use `index=round(p*(N-1))`. Thus p=0 is first and p=1 is last, even for N=1. Variable-rate material needs a timestamp lookup instead. Derive DOM chapter labels, overlays and camera indicators from the same p. Specify whether overlays follow requested p or the last presented frame; labels naming a visible component must follow presentation if decoding lags.

For direct inspection use unsmoothed progress. If an authored catch-up is needed, smooth p once upstream and measure its lag; the loader must still prioritize the latest frame. Frame blending creates double edges on moving objects and is not a substitute for more suitable source sampling.

## Canonical mapping and crop helpers

These pure helpers can be copied into the host's existing module structure. They use CSS-space destination dimensions; the canvas adapter owns DPR. Tests execute these exact functions from this document.

<!-- runtime:start -->
```js
export function sequenceIndex(progress, count) {
  if (!Number.isFinite(progress) || !Number.isInteger(count) || count < 1) throw new RangeError('Invalid sequence position');
  return Math.round(Math.max(0, Math.min(1, progress)) * (count - 1));
}

export function sequenceWindow(target, count, capacity = 8, direction = 1) {
  if (![target, count, capacity].every(Number.isInteger) || count < 1 || target < 0 || target >= count || capacity < 1 || ![-1, 1].includes(direction)) throw new RangeError('Invalid sequence window');
  const order = [target], limit = Math.min(count, capacity);
  for (let distance = 1; order.length < limit; distance++) {
    for (const index of [target + direction * distance, target - direction * distance]) {
      if (index >= 0 && index < count && order.length < limit) order.push(index);
    }
  }
  return order;
}

export function coverRect(imageWidth, imageHeight, viewWidth, viewHeight, focalX = .5, focalY = .5) {
  if (![imageWidth, imageHeight, viewWidth, viewHeight].every(n => Number.isFinite(n) && n > 0) || ![focalX, focalY].every(n => Number.isFinite(n) && n >= 0 && n <= 1)) throw new RangeError('Invalid crop');
  const scale = Math.max(viewWidth / imageWidth, viewHeight / imageHeight);
  const width = imageWidth * scale, height = imageHeight * scale;
  return { x: (viewWidth - width) * focalX, y: (viewHeight - height) * focalY, width, height };
}
```
<!-- runtime:end -->

`sequenceWindow` prioritizes the exact target, then nearby frames with the current direction first. It returns desired work, not permission to launch all requests. Do not mount one DOM image per frame. Draw one decoded bitmap into one persistent canvas, or replace one image only after successful decode.

In `coverRect`, focalX/focalY distribute the overflow like CSS object-position alignment fractions. They are crop alignment controls, not a promise to center a detected subject coordinate. If a source-space point must land at a particular screen location, solve and clamp that offset explicitly.

## Loader state machine

Implement these invariants in the host framework; do not bolt a second loader onto an existing asset manager:

1. Keep `sourceEpoch`, current target, last presented index, enabled/disposed state, cache, failed-index set and in-flight map. Cache keys include source version and index. Each request captures its source epoch and has an AbortController.
2. On progress change, store the latest target and recompute the desired window. On reversal, change look-ahead direction immediately. Draw the exact cached target if available. Otherwise retain the previous valid canvas/poster or explicitly choose the nearest cached frame; avoid blank flashes.
3. Cancel queued work outside the new window. Abort obsolete fetches where useful, but count their slots until their promise actually settles. Non-abortable decodes remain in flight; starting replacements immediately can exceed the decode limit.
4. Fill free slots in desired priority order. Skip cached, already requested and failed indices. Check HTTP success, then decode. Validate decoded dimensions against the selected variant. A timeout or bad frame enters a bounded failure state; it must not retry on every scroll event.
5. On completion, first reject a stale source epoch or disposed owner and close its bitmap. A frame from an old scroll request may still be cached if useful now, but it may commit to the canvas only if it matches the **current** target (or a freshly computed current fallback). Never commit using a captured progress value.
6. Before retaining a new bitmap, evict least-recently-used frames outside the current priority window and call `close()` on them. Keep the presented bitmap while resize redraws may need it, or explicitly preserve only the canvas pixels and retain a poster for resize. Account for this choice in the capacity.
7. On settle, release the request slot and schedule only currently desired work. On explicit retry, clear relevant failures once and requeue the current target. On disable/offscreen, stop new work; on source change, increment epoch, abort and clear; on dispose, also remove observers/listeners and close every owned bitmap. Late completions must still close their resources.

[`createImageBitmap`](https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap) returns a promise for decoded bitmap data; [`ImageBitmap.close()`](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap/close) releases its graphics resources. Feature-detect the APIs. An HTMLImageElement decode adapter is possible, but it needs its own lifetime/error handling and does not provide the same explicit release primitive. Use same-origin assets or valid CORS responses; verify canvas access when capturing pixels.

## Canvas and responsive behavior

Reserve the stage's aspect ratio before loading. Set backing size to rounded CSS dimensions × capped DPR. On resize, changing canvas width/height clears it: immediately redraw the cached presented frame or show the poster until ready. Call `setTransform(dpr,0,0,dpr,0,0)` before a CSS-space `drawImage(bitmap,x,y,width,height)` using `coverRect`; never compound scale on each resize. Avoid reallocating a canvas for every frame.

Choose one resolution variant from actual display size and budget. Change variants at a stable moment with a new source epoch and a retained poster; do not mix different-sized frames in one cache. Mobile may use a shorter normal-flow scene with a handful of keyframes. Reduced motion should skip decorative scrubbing and retain a meaningful complete frame, with ordinary chapter links or a deliberate frame selector where inspection matters.

## Verify the mechanism in the target project

Check first/last frame, N=1, long and short scroll ranges, midpoint resize, reverse, fast jumps, cold cache, missing frame, slow decode, source replacement, disable/dispose during decode, changed preferences and restoration after navigation. Instrument target index, presented index, target age, pending count, cache bytes, evictions and misses. Assert that pending/cached counts stay bounded and late responses cannot overwrite the current target.

Observe real assets while scrolling at ordinary and abrupt speeds. Report request-to-presentation delay and decode failures separately from RAF timing. JPG swapping that passes index arithmetic has not yet established smooth movement. If a target frame repeatedly arrives too late, reduce source size/request work, revise the scroll distance, select video, or simplify the interaction based on measured evidence.
