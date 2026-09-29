# Luxury and editorial art direction

Use when the brief calls for a premium, luxury, highly crafted, cinematic or editorial experience. These are original design decision methods, not a guaranteed award formula or an imitation of one brand. Begin with [the real brief](brief-to-design-decisions.md), then use the existing identity if it is supplied.

## Define what deserves attention

Identify the value visitors should perceive through evidence: craft, provenance, precision, service, rarity when factual, material, place, expertise or creative expression. Choose the authentic object, detail, story or service interaction that communicates that value. Avoid unsupported exclusivity, invented testimonials and vague prestige copy.

Write a visual thesis that names subject, composition and user benefit. It must determine later decisions: where the subject sits, how much space it receives, how typography relates to it, which motion reveals useful detail, and how users act. A minimal design, a colorful editorial treatment and a theatrical spatial experience can all fit a premium brief; choose through the audience, content and assets.

## Compose the whole journey

Give the opening a clear subject and a useful primary action. Carry one recognizable relationship into product/detail views, information, navigation, forms, errors and the ending. Make long content feel authored through varied but related composition: a dominant image, a precise caption rail, a detail crop, a quiet comparison, a full reading section. Select these from the available content; do not fabricate a fixed sequence of sections.

For each delivery viewport specify outer margins, column/rail alignment, maximum reading width, subject scale and safe regions for copy/actions. Use deliberate asymmetry with stable alignment anchors. Judge negative space by what it separates or emphasizes. Empty area that only pushes the action away needs a reason tied to the story.

Evaluate three scales: full-page rhythm, section hierarchy and component finish. View the page with real copy and loaded fonts. A successful hero is insufficient if navigation spacing, product variants, form errors or mobile crops are unfinished.

## Typography and color as a system

Choose type by letterforms, actual words, density, language coverage, licensing and available weights. Define display, reading, label and numeric roles; reuse faces when one family can fulfill them. Inspect real title line breaks, punctuation, italic behavior, cap height, weight and optical size. Adjust tracking by role. Avoid tiny captions or reduced contrast as an automatic signal of sophistication.

Use fluid sizing with rem-aware bounds; inspect 200% text enlargement and long/localized content. Solve orphans through editorial line breaks, optional break opportunities, measure and spacing while preserving the word and its accessible reading order. Do not fix overflow by shrinking user-enlarged text back to the original size.

Choose palette roles from the product and art direction: ground, primary ink, secondary ink, accent, selection and semantic status. Establish contrast on the actual moving background, including the brightest/darkest frames. Put text on a stable backing where needed. A warm neutral, black surface or gold accent is a possible choice, never the definition of luxury.

Use [type, color and layout](../../visual-composition/references/type-color-layout.md) to resolve implementation values and accessible states. Export chosen roles into the host's existing design tokens, with explicit exceptions for expressive scenes.

## Image, material and object discipline

Art-direct focal point, crop, subject scale, light direction, background, color treatment and detail level consistently across the content. Preserve accurate product color where selection or purchase depends on it. Let genuine texture and geometry carry the subject instead of hiding weak assets under grain, blur or glow.

For live 3D verify silhouette, scale, joins, pivots, materials, light and camera before postprocessing. For baked media choose frames that reveal the same qualities. Declare the limitation when an asset only provides recorded viewpoints. Keep captions and product data accurate to the selected object or frame.

## Motion character

Choose motion for a stated role: reveal workmanship, connect sections, guide attention, demonstrate a mechanism or acknowledge input. Separate direct response from narrative pacing. Cursor tracking should feel attached to input; a slow camera move can still have readable holds. A slow button response feels unresponsive regardless of brand character.

Suggested starting bands, to revise against the project:

| Role | Initial proposal | Decision to verify |
| --- | --- | --- |
| Hover/focus feedback | 120–220 ms; no delay | Immediate selection/affordance remains clear |
| Local object tracking | ±4–12 px or ±4–12°; response 12–20 s⁻¹ | Subject stays framed; input does not drag copy or purchase controls |
| Editorial reveal | 350–650 ms, 12–32 px travel | Text is accessible and readable without waiting through a long stagger |
| Scene transition | 700–1400 ms if directed by time | Camera/object velocity joins coherently; interruption has a defined result |
| Scroll sequence | Explicit p intervals and reading holds | Reversal, fast scroll and final exit remain meaningful |

These are not a preset to stamp onto every site. A rigid crafted object usually needs precise pivots and restrained settling; elastic overshoot needs a suitable material or interaction metaphor. Preserve attachment and mass cues. Prefer one memorable motion event per attention region, with quiet surrounding content. Use [interactive motion](../../interactive-motion/SKILL.md) to choose the implementation.

## Approve through visible evidence

The agent can select and refine routine design decisions within the user's scope. Do not insert approval stops simply because the work is described as premium. Compare directions when evidence leaves a consequential choice, then state the chosen rationale and continue.

Review actual subject recognition, information/action hierarchy, title wrapping, crop, contrast, rhythm, state completeness, input response and mobile behavior. For each defect identify its location, observable effect, change and recheck. Compare a representative still before/after and observe the full motion in real playback when tools permit. Test the final exit and return navigation as carefully as the opening.

Deliver the design system and implemented behavior that the target project needs, with measured performance and stated evidence limits. Do not use an aesthetic score as proof of correctness or claim “pixel perfect” without a supplied reference, matched viewport/fonts/assets and an actual comparison.
