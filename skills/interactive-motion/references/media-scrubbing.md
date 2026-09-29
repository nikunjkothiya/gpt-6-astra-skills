# Cursor and scroll control of GIF, video and image sequences

Use when an input controls recorded imagery or its presentation. FROM-KNOWLEDGE original procedures and controller; numeric values are contextual proposals. The critical distinction is which quantity input controls: container transform, mask position, playback state, playback speed, or exact timeline position.

## Select a controllable medium

| Intent | Representation and recipe | Failure / check |
| --- | --- | --- |
| Move/reveal a looping GIF | Ordinary image plus a pointer-owned transform/mask; e.g. ±8 px or 100 px reveal radius | GIF continues on its own clock; a CSS transform does not scrub its frames |
| Cursor chooses GIF frame | Convert an asset you may use to a video or explicit frame sequence; x maps to normalized p | Native `img` GIF/APNG/WebP has no standard frame seek/pause API; resetting src is not a reliable timeline |
| Hover starts a clip | Muted inline video; handle rejected `play()`; pause on leave/offscreen; show poster | Do not promise autoplay; audio requires explicit controls/user intent |
| Cursor/scroll chooses time | Paused finite video, one seek in flight, latest requested p wins; x maps 0–1 to authored segment | Writing currentTime every raw event overwhelms decode; reverse playbackRate is not portable reverse seeking |
| Exact discrete frames | Explicit numbered image frames; `index=round(p*(count−1))`; bounded decoded cache | Large network/GPU memory; use stale-request generation guards and dispose evicted bitmaps |
| 2D cursor chooses view + moment | Two authored view sequences, or live 3D; document x/y mapping and memory | A single flat video does not create real arbitrary parallax or reveal unseen geometry |

For a GIF-to-video conversion, preserve frame delays and disposal/compositing, loop seam, color and alpha; compare the converted clip against the source. Choose MP4/WebM based on target support and transparency needs; do not flatten transparency onto an accidental black background. Keep a still poster. Re-encoding cannot invent missing frames or make a choppy source physically smooth. Never fetch paid assets or republish reference content without the appropriate rights.

## Prepare the asset and mapping

For a short product/graphic scrub, start with 2–4 s at 24/30 fps, no audio, matching poster/crop and a small viewport-appropriate resolution. The [rendering choice reference](../../cinematic-web/references/storyboard-and-rendering.md) covers short-GOP encoding, sequence memory, mobile tiers and cold-load budgets. Verify actual range responses and seeking in the deployed host. A local dev server and a production CDN may behave differently.

Map local pointer x to p; constrain to an authored segment `[inTime,outTime]`, not arbitrary media duration when intro/outro frames are unsuitable. Scroll p must come from the same master as DOM labels. Use one smoothing policy, for example pointer response 14 s⁻¹ **or** scroll scrub .35 s. Do not add a second smoothing layer to the decoder's seek queue. Preserve the latest target while a seek is outstanding.

Assign a mode (`pointer`, `scroll`, `control`, `static`) as the sole progress owner. A keyboard range input acquires control mode; enable pointer mode again through an explicit action or deliberate new hover, with a defined handoff. Reduced motion/offscreen mode retains a useful poster and ordinary controls; disable decorative repeated seeking. User-requested inspection may still choose individual static frames when appropriate.

## Reusable latest-target seek queue

Assumptions: one owner, a finite clip beginning at time zero, and caller-controlled `src`. Instantiate a new controller after a source change, or dispose the old one before replacing the element. This controller queues decoder seeks; it does not smooth input or claim compositor presentation. `onState` is suitable for status/diagnostics, not a live-region announcement every frame.

<!-- runtime:start -->
```js
export function createVideoScrubber(video, {
  fps = 30, timeoutMs = 2000, inTime = 0, outTime = null, onState = () => {},
  scheduleTimeout = (fn, ms) => setTimeout(fn, ms), clearScheduled = id => clearTimeout(id),
} = {}) {
  if (!(fps > 0) || !Number.isFinite(fps) || !(timeoutMs > 0) || !Number.isFinite(timeoutMs)) throw new Error('Invalid media policy');
  if (!Number.isFinite(inTime) || inTime < 0 || (outTime !== null && (!Number.isFinite(outTime) || outTime <= inTime))) throw new Error('Invalid media segment');
  let progress = 0, busy = false, failed = false, disposed = false, enabled = true, timer = null, seeks = 0;
  let targetTime = 0;
  const snapshot = () => ({ progress, targetTime, currentTime: video.currentTime, busy, failed, enabled, seeks });
  const emit = phase => { if (!disposed) onState({ phase, ...snapshot() }); };
  function clearTimer() { if (timer !== null) clearScheduled(timer); timer = null; }
  function fail() { if (disposed) return; clearTimer(); busy = false; failed = true; emit('failed'); }
  function pump() {
    if (disposed || !enabled || failed || busy || video.seeking) return;
    // Loading may fail before this controller attaches its error listener.
    if (video.error) { fail(); return; }
    const duration = video.duration;
    if (video.readyState < 1 || !Number.isFinite(duration) || duration <= 0) {
      if (timer === null) timer = scheduleTimeout(fail, timeoutMs);
      emit('waiting'); return;
    }
    clearTimer(); // Metadata arrived before the deadline; seeking gets its own deadline.
    // Exclude the terminal boundary; actual encoded final-frame time may differ.
    const end = Math.max(0, duration - 1 / fps);
    const start = inTime, stop = Math.min(outTime ?? end, end);
    if (start > stop) { fail(); return; }
    targetTime = start + progress * (stop - start);
    if (Math.abs(video.currentTime - targetTime) <= .5 / fps) { emit('settled'); return; }
    busy = true; seeks++; timer = scheduleTimeout(fail, timeoutMs);
    emit('seeking');
    // Status observers may synchronously unmount or switch to the poster.
    if (disposed || !enabled || failed) { clearTimer(); busy = false; return; }
    try { video.currentTime = targetTime; } catch { fail(); }
  }
  function seeked() { if (disposed || failed) return; clearTimer(); busy = false; emit('seeked'); pump(); }
  function readiness() { pump(); }
  function emptied() { fail(); }
  const listeners = [['loadedmetadata', readiness], ['loadeddata', readiness], ['durationchange', readiness], ['seeked', seeked], ['error', fail], ['emptied', emptied]];
  for (const [name, fn] of listeners) video.addEventListener(name, fn);
  video.pause();
  return {
    snapshot,
    setProgress(value) { if (disposed || !enabled || !Number.isFinite(value)) return; progress = Math.max(0, Math.min(1, value)); pump(); },
    setEnabled(value) { if (disposed) return; enabled = Boolean(value); video.pause(); if (!enabled && !busy) clearTimer(); if (enabled) pump(); },
    retry() { if (disposed) return; failed = false; busy = false; clearTimer(); pump(); },
    dispose() { if (disposed) return; disposed = true; clearTimer(); for (const [name, fn] of listeners) video.removeEventListener(name, fn); video.pause(); },
  };
}
```
<!-- runtime:end -->

Changing [`currentTime`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime) requests a seek. It is not a frame-exact presentation clock. This queue holds the last decoded image while work completes and handles source reset as a failure requiring a new controller or explicit recovery. Disabling stops new work; an already submitted decode may complete. Keep the poster visible in static/failure mode so a late decode does not change the user's displayed fallback. Retry should follow an explicit action after recovery, not loop on every pointer event.

`timeoutMs` bounds each metadata wait and each submitted seek separately. Repeated targets do not extend an active metadata deadline. Tune it to the asset/host and retain a useful poster on timeout; late metadata requires explicit retry after failure. Keep status callbacks observational except for disabling/disposal; synchronous retry or recursive progress changes from every notification can re-enter the controller. Measure cold metadata and actual seek latency separately.

For a chosen segment pass, for example, `{ inTime: .4, outTime: 2.2, fps: 30 }`. It maps p=0 to .4 s and p=1 to 2.2 s, capped at the final safe clip boundary. A segment whose start lies beyond that boundary fails explicitly. Verify the segment after the real metadata loads; an encoded clip may differ from the export's intended duration.

For verification, feature-detect [`requestVideoFrameCallback`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback) and record callback metadata `mediaTime` as presentation evidence. Register before seeking, cancel the callback on teardown, and use a timeout to label unavailable observations. If unsupported, `seeked` plus a captured frame is weaker evidence; disclose it. Do not require a callback for a no-op seek to the already displayed frame. A compositor callback and the seek queue have different jobs.

## Image sequence implementation contract

Use [scroll image sequences](scroll-image-sequences.md) for the complete manifest, progress mapping, crop helpers, bounded loader state machine, resize behavior and verification contract. Use [asset preparation](asset-preparation.md) when deriving frames from a GIF or video.

Use an ordered frame manifest with dimensions, nominal fps, source rights, poster and known duration. Load the poster and nearby frames first; begin with at most four concurrent fetch/decode operations and an LRU cache of 12 frames. A 960×540 RGBA frame uses about 2 MiB before overhead, so this cache is already roughly 24 MiB. Recalculate against the actual asset size.

On each target change increment a generation ID, choose the nearest loaded frame if necessary, and request the exact target plus a bounded look-ahead in the current direction. Completion enters the cache only if still useful; presentation commits only for the current generation/target. Close evicted `ImageBitmap`s. Reverse direction adjusts the look-ahead window. Pause loaders offscreen and abort obsolete fetches when supported. Do not decode the entire sequence on a low-power device just to simplify code.

Preserve `cover` crop explicitly: `scale=max(canvasWidth/imageWidth,canvasHeight/imageHeight)` and center or align to the authored focal point. Size the backing buffer from CSS dimensions × capped DPR; reset transform before drawing. Resize the existing canvas instead of allocating a new decoded set. Missing frames retain a nearby valid frame/poster and truthful status; they do not flash blank or trap scrolling.

## Verification matrix

Test p=0,.25,.5,.75,1 then rapid `.9,.1,.8,.2` before decode completes. Require latest target convergence within an asset-appropriate frame tolerance. Record target, seek-completion time, presented time, dropped/replaced requests and p50/p95 seek latency separately from RAF cadence. Test missing metadata, infinite/live duration, blocked autoplay, a failed request, source replacement, offscreen/hidden, reduced motion, resize/crop, touch/keyboard and disposal during seeking. Test the real codec/host on target browsers before promising smooth cursor scrubbing. A synthetic mocked-video test can prove queue logic only.
