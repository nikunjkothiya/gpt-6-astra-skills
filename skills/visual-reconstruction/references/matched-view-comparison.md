# Matched-View Reconstruction and Discrepancy Diagnosis

Use this reference when “pixel perfect” requires a measurable target, a first implementation drifts from a supplied reference, or repeated local adjustments are no longer improving the match.

## Establish what a match means

Record the reference asset, crop, pixel dimensions, and any known capture conditions. For browser work, distinguish screenshot pixels from CSS viewport size and device scale. Establish browser zoom, route, scroll position, content, loaded fonts, application state, and motion time when known. Do not infer a viewport from image dimensions without accounting for scaling or cropping.

If only one image exists, target its demonstrated state and dimensions first. Responsive behavior, focus states, unseen surfaces, and interaction remain implementation decisions. Mark these as inferred rather than describing them as reconstructed evidence.

Use exact supplied assets, copy, logos, and font files when their use is authorized. If they are missing, make the substitution explicit and identify which kinds of mismatch it limits. Different font metrics or image crops cannot be repaired reliably with unrelated offsets.

## Create a small evidence map

Measure a few stable anchors against the reference. Store pixel coordinates when the viewing conditions are known; otherwise store normalized relationships with the relevant reference bounds.

```text
Illustrative evidence map, not observations from a supplied image:
reference: 1440 x 1000 image; CSS scale unknown
main region: x 72..1368 => about 90% of reference width
title left: x 72; top: y 164
object silhouette: x 690..1320; y 152..802
text measure: x 72..598
observed: title has three lines; object leans toward the text
inferred: display family and hidden rear construction
unknown: pointer behavior, narrow layout, camera focal length
```

Choose landmarks that constrain different hypotheses: outer bounds, an internal feature, a baseline, a shared rail, a contact shadow, and a point of overlap. Measuring only an object's width cannot distinguish scale from viewpoint.

For moving references, add timestamps, visible input evidence, subject position, camera position if inferable, and holds. A recording of a settled loop does not reveal how interruption should work.

## Normalize capture before adjusting design

Use identical content and application state where possible. Wait for the intended fonts and images before capturing; also inspect the loading state separately when it is part of the task. `document.fonts.ready` helps wait for font loading and related layout, but verify that the intended face actually loaded and is used. [MDN documents the document font set](https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts).

For deterministic comparison, fix the animation time, random seed, camera pose, object pose, and any data that changes the view. Capture a natural interactive playback separately so deterministic screenshots do not conceal temporal defects.

Compare at native scale and at reduced scale. Use a side-by-side view for hierarchy and an overlay or difference image for displacement when such tooling is available. Do not rescale one image independently until it appears to match; that can hide a wrong layout width or camera fit.

## Correct shared causes first

| Difference pattern | Plausible shared cause | Discriminating observation |
| --- | --- | --- |
| Neighboring elements share the same shift | Parent position, inset, or scroll state | Their mutual distances agree |
| Each successive text line drifts farther | Font metrics or line height | First line agrees; later baselines diverge |
| Wrap differs and everything below shifts | Content, font, width, or weight | Top anchor agrees until the first different break |
| Whole object is too large with coherent internal ratios | Object scale or camera fit | Silhouette and internal proportions agree after uniform comparison |
| Near parts too large, far parts too small | Perspective or viewpoint | A uniform scale fails to align both near and far landmarks |
| Silhouette agrees but joints do not | Internal proportions or articulation | Camera-supported outer bounds still agree |
| All surfaces shift brightness together | Exposure, tone mapping, background, or capture | Relative material contrasts remain similar |
| Highlight moves while silhouette agrees | Light or reflection environment | Shape landmarks agree but reflection shapes do not |
| Colors disagree only at edges | Antialiasing, resampling, transparency | Solid interiors agree |

Keep multiple explanations open until an independent landmark rules one out. Changing geometry to compensate for perspective can make one frame look closer and break every other view.

Choose the mismatch with the largest effect on intended fidelity, make one causal correction or a tightly related set, and capture again under the same conditions. Resolve region proportions, silhouette, camera, and typography before spending time on tiny decorative differences. In a text-led reference, typography may outrank object detail.

## Use measurements without confusing them with quality

For an anchor at `(x, y)`, record the signed offset between reconstruction and reference. A group of similarly signed offsets often identifies a parent error. Normalize by reference width or height when comparing across scales, and retain the original units so the result is interpretable.

Pixel error metrics can locate changed regions after conditions are aligned. They are sensitive to text antialiasing, capture, compression, and tiny translations; a score alone cannot establish accurate behavior or good design. If masking dynamic regions, record what was excluded and inspect it through appropriate separate evidence.

Agree on practical tolerance from the task: exact supplied layout dimensions may warrant close coordinate checks, while a raster reference with an unavailable font can support a faithful relationship match without a claim of exact pixels. Report remaining differences in concrete terms.

## Recover motion from temporal evidence

Identify start, onset of meaningful movement, turning points, overshoot, contact, hold, and settled endpoint. Compare relative trajectories and sequencing before polishing easing. Sample the same time points and play both sequences at normal speed.

Determine whether motion is time-driven, scroll-linked, directly manipulated, or triggered by a state change only when the evidence supports it. A cinematic camera sequence and an object rotating in place may produce similar single frames; parallax and stationary landmarks help distinguish them.

Implementation should preserve plausible continuity for unseen interruptions, while documenting that behavior as newly designed. Verify reversal, repeated triggering, reduced motion, and layout changes through [interaction design](../../interaction-design/SKILL.md) and [motion intelligence](../../motion-intelligence/SKILL.md).

## Close the loop with evidence

Deliver the matched state, conditions used, principal corrections, remaining approximations, and any unseen behavior that was inferred. For a faithful reconstruction, stop when the requested fidelity is supported. For inspired work, evaluate the translated relationships against the target product's brief rather than optimizing the whole output for similarity.
