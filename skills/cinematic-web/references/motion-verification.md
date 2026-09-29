# Verify motion with controlled progress and observed frames

Use for temporal continuity, scroll narratives, camera paths, shader motion, and interruption. Treat numerical limits below as FROM-KNOWLEDGE diagnostic starting points; calibrate to the storyboard and device. Verification results become OBSERVED only after the check runs. Do not infer smoothness from a still, a compiled bundle, or arithmetic alone.

## Establish the evidence tier

| Available tools | Perform | Honest completion claim |
| --- | --- | --- |
| Browser + shell + renderer | Fixed-step captures, contact sheet, real input playback, frame timing, scalar and pixel deltas, responsive/failure checks | Specify browser, viewport, DPR, renderer, sample count, measured results and reviewed captures |
| Browser without shell | Scrub explicit progress, inspect forward/reverse and touch/keyboard, capture available views, read available counters | State which observations were manual and which metrics were unavailable |
| Files / code execution only | Validate storyboard arithmetic, interpolation bounds, exact endpoints, ownership, reverse equality, resize mapping, disposal paths | Implementation and arithmetic verified; appearance, GPU cost and motion unverified |
| Text only | Check intervals, units, handoff overlaps, easing policy, state coverage and budgets | Proposed implementation; execution, appearance and smoothness unverified |

Reduced-motion mode may intentionally use instantaneous state changes and static content. Keep that explicit exception separate from ordinary cinematic transitions. No tool access is permission to bypass reference access controls or use a paid artifact.

## Deterministic evaluation contract

Expose a development-only test adapter that seeks the actual master timeline and reads its derived state. Seeking must pause real scroll/time drivers before changing progress. Seed noise/random assets and use shader time derived from the master. Freeze network-dependent content, viewport, device scale, fonts, environment and renderer. Readiness means assets decoded and a successful first render, not DOMContentLoaded.

1. Capture a neutral still and record viewport/DPR, versions, scene resource counts, asset status and camera.
2. Sample `p=i/120`, i=0..120. In each sample set progress, explicitly render, capture state and pixels before advancing. This sequence is an inspection of equal progress increments, not an assertion that a scroll journey lasts two seconds.
3. Repeat 1→0 and visit a shuffled set such as .1,.9,.49,.51,0,1,.5. Compare state at identical progress to <=1e-6 scene units and camera matrix entries. Compare exact rest matrices where the contract requires exact rest.
4. Export representative frames at 0,.125,.25,.375,.5,.625,.75,.875,1 as a labeled contact sheet. Inspect silhouettes, occlusion, text, camera edges, material flashes and frame-to-frame continuity. Save the full sequence when investigating a defect.
5. Record scalar deltas and image differences. A large difference is a locator for inspection; it is not by itself a failure or proof of a cut. Fast intentional motion and hard lights can produce large deltas.

```js
// Pure diagnostic: input arrays must have matching dimensions/color space.
export function normalizedPixelDelta(before, after) {
  if (before.length !== after.length || before.length % 4) throw new Error('Frame sizes differ');
  let sum = 0, changed = 0;
  for (let i = 0; i < before.length; i += 4) {
    const difference = (Math.abs(after[i] - before[i]) +
      Math.abs(after[i + 1] - before[i + 1]) + Math.abs(after[i + 2] - before[i + 2])) / (3 * 255);
    sum += difference;
    if (difference > .05) changed++;
  }
  const pixels = before.length / 4;
  if (!pixels) return { mean: 0, changedFraction: 0 };
  return { mean: sum / pixels, changedFraction: changed / pixels };
}
```

Composite transparent captures against the same background, or compare alpha separately. Exclude intentional grain/noise or fix its seed. Report median/p95/max delta and the progress interval of the maximum. Inspect a spike exceeding 3× neighboring medians, then confirm whether the storyboard accounts for it. Do not make the diagnostic threshold a universal aesthetic limit. Check DOM and canvas together; raw GPU buffers omit text and overlays. A compiler error or a blank canvas is a failure even if its frame differences are zero.

## Actual playback and timing

Controlled seeks skip the real scrub driver. Also run wheel/touch/keyboard input and repeated scroll targets 0→.85→.2→1→0, with a 120 ms direction change and a settled sample after the specified catch-up duration. A .45 s scrub needs enough wall time to catch up before comparing endpoints. Verify that the latest input wins, the scrollbar retains control, and focus stays meaningful.

Measure at least 120 consecutive active frames per scenario where practical, excluding declared warmup. Report actual sample count if fewer. Sort intervals and report nearest-rank p50/p95/p99, maximum, and count exceeding 16.7/33.3 ms. State whether data are rAF intervals, completed-render intervals, or GPU timer queries. Instrumentation, readPixels, and screenshot capture distort timing: use a separate run without capture. Do not call intervals GPU render duration. Test a real target phone/browser before claiming its budget is met; headless software graphics are not representative.

For 60 Hz target rendering, 16.7 ms is the whole frame budget, not a free allowance for one canvas. Investigate long-tail hitches from shader compilation, decoding, allocations, React renders, and layout. Warm expensive shaders before a reveal when supported; observe again. Keep a conservative quality floor and measured downgrade thresholds with hysteresis, for example p95 >24 ms over 120 active frames twice before dropping a tier; recover only after sustained p95 <14 ms. These values require real-device tuning.

## State stress matrix

| Scenario | Expected evidence |
| --- | --- |
| Resize at .5, including breakpoint | Same narrative progress if the design specifies preservation; dimensions/scroll bounds refreshed; no duplicate pins or owners; camera safe |
| Fast scroll past both ends | Canonical start/end, no late asynchronous tween overriding the target |
| Reverse during asset reveal | No flash, cancellation/generation checks, available fallback; object still has one owner |
| Enable reduced motion during travel | Kill owned motion, settle a useful pose, remove unnecessary scroll distance, show complete content |
| Keyboard/chapter links | Reach every meaning/action; selected state correct; no forced focus into hidden panels |
| Touch/coarse pointer | No essential hover, native scrolling outside owned gestures, no sticky cursor follower |
| Background/resume | No giant dt jump; no hidden render loop; newest state wins |
| WebGL loss/import failure | Poster and full DOM tasks; clearly marked recovery; no silent blank canvas |
| Repeated mount/unmount | No growing render callbacks, ScrollTriggers, observers or owned GPU resources |

Resize inspection must include screenshot review; “no horizontal overflow” does not prove no overlap. Repeat text-enlargement checks with actual computed font growth, and treat browser zoom as a separate condition.

## Award-oriented review

Use the product's visual thesis as the rubric: one dominant motion per beat, planned quiet intervals, legible typography at delivery size, motivated materials and restrained optics. Observe a normal-speed run after frame-level repairs. Check loader, focus, empty, failure and end states with the same care as the hero. A measured stable frame cadence cannot establish originality or award quality. Report what improved, what was measured, and what remains unverified.
