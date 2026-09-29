---
name: rendering-judgment
description: Refine rendered images and moving scenes for final delivery, and diagnose jagged edges, flicker, washed-out color, muddy shadows, transparency artifacts, noise, and ghosting. Use when a visually constructed result loses clarity, surface identity, or stability in its actual presentation.
---

# Rendering Judgment

Judge the visible output in its intended presentation. Structural validity, successful construction, and a saved image establish different facts from visual clarity, material identity, and temporal quality.

For layered DOM/canvas imagery, CSS blend modes, alpha edges, crossfades, glass or transparent depth artifacts, read [compositing and blending](references/compositing-and-blending.md). It distinguishes pixel compositing from pose blending and provides checks for each rendering boundary.

## Establish a comparable view

Use the intended framing, delivery size, relevant background, display treatment, and representative state. Keep these stable while diagnosing a defect. Inspect at normal size for readability and hierarchy, then use a close crop only to identify the cause.

For moving output, inspect playback and consecutive frames as well as selected stills. A clean frame can coexist with unstable edges, noisy shadows, reflection popping, or smeared moving detail.

Identify what must remain sharp, luminous, quiet, textured, or legible in this particular visual. A cinematic frame need not make every region equally crisp, and an inspection view must not sacrifice essential information for atmosphere. Judge rendering against this intent before maximizing every quality setting.

## Diagnose by responsible layer

| Visible problem | Likely causes to distinguish | First useful correction |
| --- | --- | --- |
| Jagged or shimmering edges | Inadequate spatial or temporal sampling, subpixel detail | Improve sampling or simplify detail that cannot remain stable at delivery scale |
| Surface flicker | Overlapping surfaces, depth precision, unstable evaluation | Resolve overlap or depth relationships before increasing resolution |
| Shadow acne or detached shadow | Self-shadow handling, shadow approximation, contact setup | Balance self-shadow stability with actual contact |
| Floating object | Missing or inconsistent contact and support cues | Repair grounding and illumination |
| Washed-out output | Exposure, repeated display treatment, excessive fill, glare | Isolate global color and tonal handling |
| Black or unreadable reflection | Missing surroundings, wrong orientation, unsuitable response | Establish a useful reflection environment |
| Transparent layers popping | Visibility ordering, intersecting layers, representation limits | Simplify or change the representation while preserving required meaning |
| Waxy or smeared detail | Aggressive noise removal, temporal history, insufficient signal | Preserve important edges and surface information before smoothing |
| Trails after motion or delayed reveal | Stale temporal information, insufficient new surface information, intended motion blur | Restore newly visible surfaces and changing state before increasing smoothing |
| Grain or unstable shadows | Insufficient convergence or unstable illumination | Spend quality on the affected visible region and temporal behavior |
| Halos around cutouts | Edge color, transparency interpretation, background mismatch | Inspect the composite over the actual required backgrounds |
| Banding in gradients | Insufficient tonal precision or compression | Preserve the required tonal range through output |

These are candidate causes, not conclusions. Change one causal group, compare the same view, and retain the correction only if it resolves the observed defect.

Use the defect's extent to narrow the cause: a whole-frame shift suggests global interpretation or exposure; one material suggests response or its inputs; a silhouette-only problem suggests geometry, sampling, or compositing; a problem appearing only after movement suggests temporal handling or changing visibility. These patterns guide isolation without proving the diagnosis. Escalate to the responsible skill only when the defect crosses into its domain.

## Keep color meaning coherent

Distinguish color-bearing imagery from numeric surface data. Apply the intended color interpretation to each; a direction or roughness value should not receive a color transformation merely because it is stored as an image.

Keep light combination and display presentation conceptually separate. The intended display transform should be applied at the correct boundary without accidental duplication. Resolve this relationship before compensating with brighter lights or darker materials.

Judge exposure and tone response together. Preserve meaningful highlight variation, shadow detail, color relationships, and consistency between imagery, rendered objects, and surrounding interface surfaces. A good preview does not guarantee the saved or delivered output uses the same interpretation.

Preserve important colors by their role, not merely their numeric values. Saturated highlights can lose hue as they approach the display's limits; recover material distinction without flattening the entire image. Where exact brand, product, or measured color matters, rely on the supplied reference and agreed viewing conditions rather than claiming accuracy from an uncalibrated preview. A small self-luminous point may intentionally clip; a broad clipped product surface can erase the form.

Inspect transparent edges over light, dark, and actual presentation backgrounds where those conditions are relevant. Correct compositing assumptions rather than covering fringe artifacts with a larger glow.

## Use effects for visible problems

Contact shading can clarify proximity but should not darken every edge uniformly. Reflections can explain material but should agree with the world. Focus blur can direct attention but must not obscure required labels, comparison data, or inspected features.

Use glare around relevant bright features, atmosphere for depth and mood, and motion blur for the intended sense of movement. Preserve feedback and precision. Compare each effect in matched views with and without it; retain it for the information or atmosphere it contributes.

Do not use darkness to hide wrong geometry, blur to hide weak composition, glow to replace illumination, or global processing to disguise indistinct materials. Refer to [lighting design](../lighting-design/SKILL.md), [material reasoning](../material-reasoning/SKILL.md), or [geometric reasoning](../geometric-reasoning/SKILL.md) for the responsible source.

## Preserve quality through time and delivery

Inspect moving highlights, thin edges, fine patterns, translucent overlap, shadow changes, and detail-level transitions. Stable noise can still be objectionable; individually clean frames can still flicker. Compare apparent quality at intended speed before spending effort on defects visible only under extreme magnification.

Treat fine detail below a stable visible size as a representation decision. Simplifying it, averaging its contribution, or increasing its meaningful thickness may preserve appearance better than sharpening it. Keep such changes from altering a factual dimension or creating a false feature in an inspection view. Include starts, stops, newly revealed surfaces, and camera changes when judging temporal quality; smoothing that looks good during steady travel can lag behind an actual state change.

When adapting quality, preserve subject silhouette, state cues, readable text, and control response before low-value effects. Use [visual performance](../visual-performance/SKILL.md) to identify the dominant cost rather than assuming higher resolution improves every defect.

Accept the delivered result when required views preserve hierarchy, edge and surface readability, grounding, color relationships, and temporal stability. If the destination application or playback cannot be inspected, state that limit; an authoring preview alone does not establish delivery quality.

Carry forward the resolved defect and its responsible layer, the presentation conditions actually observed, and any remaining visible compromise that affects the task. Make the delivered visual the primary result; do not substitute a quality claim for the artifact or imply inspection of an unavailable output.
