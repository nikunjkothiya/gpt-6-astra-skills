---
name: visual-reconstruction
description: Reconstruct interfaces or scenes from screenshots, images, recordings, or sketches. Use for faithful reproduction, measured discrepancy correction, or reference-based adaptation while distinguishing observations from inference.
---

# Visual Reconstruction

Recover the visual relationships that produce the reference's effect. Match the requested fidelity: faithful reconstruction and inspired adaptation require different decisions.

For a measured match or a stalled comparison loop, load [matched-view comparison](references/matched-view-comparison.md) to normalize capture conditions, record landmarks, isolate shared causes, and evaluate motion from temporal evidence.

## Inspect actual evidence

View the supplied material with available inspection capabilities. Establish its dimensions, crop, state, and any known viewing or capture conditions. If material is unavailable, identify what has not been seen and avoid claims about its appearance.

Identify whether the user wants a match, an adaptation, or improvement of particular weaknesses. For a match, reference fidelity governs the visible choices even when another treatment might be more fashionable. Use available original assets, text, and type resources before approximating their appearance.

Separate observation from inference. An image can reveal visible placement, proportion, color relationships, silhouette, and apparent lighting. It cannot by itself establish exact hidden geometry, interactive states, motion, typeface identity, physical dimensions, or implementation technology.

A recording adds temporal evidence, but it does not prove how unseen input or interruption behaves. Identify observed triggers, trajectories, sequencing, holds, and camera changes without inventing hidden states.

## Recover structure in priority order

1. Identify the whole composition, dominant subject, large regions, alignment anchors, and negative space.
2. Estimate proportions and scale relationships against known bounds. Distinguish the reference crop from the full intended composition.
3. Establish focal and information hierarchy through order, size, contrast, grouping, and density.
4. Decompose visible geometry into primary masses, profiles, voids, attachments, and repeated structures.
5. Infer perspective and viewpoint using overlap, convergence, foreshortening, and near-far scale, while retaining uncertainty.
6. Identify illumination direction, shadow relationships, reflection shapes, and exposure character.
7. Recover typography roles, measure, line breaks, weight relationships, and optical alignment.
8. Distinguish surface identity from illumination, texture scale, and global color treatment.
9. Analyze observed motion, continuity, timing, and changing viewpoint when temporal evidence exists.
10. Add edge treatment, microstructure, icons, and other detail after the larger relationships agree.

Use [geometric reasoning](../geometric-reasoning/SKILL.md), [camera composition](../camera-composition/SKILL.md), or [material reasoning](../material-reasoning/SKILL.md) only where the relevant uncertainty affects the task.

Carry forward a compact evidence map: composition bounds, major anchors and proportional measurements, typography and asset matches, observed state, and consequential unknowns. Express positions and sizes relative to stable bounds when absolute dimensions are unknown; retain absolute values when the reference or task establishes them.

## Constrain ambiguous interpretations

Use multiple independent landmarks rather than one convenient measurement. A subject appearing too wide could reflect the geometry, viewpoint, crop, or perspective. Correct the layer supported by evidence instead of deforming form to compensate for the wrong camera.

Use discrepancy patterns to locate the cause. A shared displacement across neighboring elements suggests a parent region or anchor; progressively drifting text suggests type metrics or wrapping; a correct silhouette with displaced internal landmarks suggests perspective or internal proportions. Correct the shared explanation before introducing many compensating offsets.

Prefer a simple explanation that accounts for all observed views. Do not add hidden complexity that no required view or behavior needs. Keep inferred internals distinguishable from observed structure.

For typography, prioritize role, proportion, density, and wrapping when exact identity is unknown. Do not claim an exact match based solely on resemblance. Preserve supplied assets and content within their intended use; invented endorsements or marks are not a valid way to mimic visual authority.

Treat sampled color as the displayed result of surface, illumination, transparency, background, and capture treatment. Match the relevant visible relationship without assuming one sampled highlight is the base material color. Keep unresolved material and lighting hypotheses open until shape and view agree.

## Translate or reproduce deliberately

For faithful work, preserve reference structure, state, crops, proportions, and recognizable visual choices at matched viewing conditions. Do not impose novelty when the requested outcome is accurate reproduction.

A single fixed view does not establish responsive behavior. Preserve its demonstrated relationships at the reference dimensions, then make the smallest adaptation required by the content and task through [responsive composition](../responsive-composition/SKILL.md). Keep unseen layouts and interactions distinct from reproduced evidence.

For inspired work, identify what makes an observed feature effective, how it serves the target product, and where the translation could fail. A reference's large object presentation may express concentrated attention; an information-dense target may need that hierarchy without its expansive empty space.

When using multiple references, assign each a role such as hierarchy, imagery, material, density, or motion. Resolve competing signatures through the target product's thesis using [visual direction](../visual-direction/SKILL.md). Do not average incompatible references into a collage.

## Compare by largest discrepancy

Compare the rendered result at equivalent dimensions, crop, state, and content where possible. First inspect the global silhouette and region proportions, then hierarchy and scale, then geometry and viewpoint, then light, type, materials, motion, and detail.

Use an overlay or matched views when available to locate displacement, but interpret differences in context. Different content or a changed state can produce legitimate differences. A high pixel similarity does not establish correct hidden behavior, and matching decoration does not establish matching composition.

Repair the most consequential mismatch and compare again under the same conditions. If large regions or silhouettes still disagree, defer decorative detail. If text wrapping differs, resolve content, available measure, and type metrics before adjusting surrounding spacing. If color differs globally, inspect background, exposure, and capture treatment before recoloring every surface. Stop at the requested fidelity and supported evidence; do not claim reconstruction of unseen behavior.
