# Choose motion from the user's topic

Use before selecting an effect for a new page or UI. The patterns and numerical proposals here are FROM-KNOWLEDGE; they are starting designs, not observations of award winners. A topic name alone is insufficient: a museum's scholarly archive and its children's exhibit need different behavior.

## Convert the brief into a usable contract

Extract: subject; audience and expertise; primary action; evidence needed to trust that action; actual copy/data; brand assets; viewing context; device/network constraints; media availability and rights. Inspect the repository's visual rules before introducing a new language. If the task simply says “a website for coffee,” infer an ordinary browsing/purchase goal and state it; clarify only when a consequential choice remains unclear.

Then write five decisions:

1. **Visual thesis:** one specific sentence, e.g. “A roaster's tasting journal where a bean-to-cup diagram explains the blend.”
2. **Hierarchy:** the primary message/action, supporting proof and secondary navigation; name the quiet regions where reading happens.
3. **Visual vocabulary:** typography roles, palette roles, spacing/grid, object/illustration style and image treatment. Reuse visual-composition rather than treating motion as a substitute for layout.
4. **Motion vocabulary:** one dominant event in a section plus supporting feedback as needed; assign ownership and reading holds. Use zero motion for states where movement adds no value.
5. **Delivery contract:** responsive layouts, input alternatives, media budget, lifecycle and tests that establish the intended result.

## Contextual pattern palette

These are options to evaluate against the five decisions, not category stereotypes. Every row needs adaptation to actual content and user intent.

| Topic / viewing task | Candidate visual + motion idea | Numeric starting recipe | Controls, failure and check |
| --- | --- | --- | --- |
| Physical product / compare construction | Product silhouette plus a reversible exploded detail; pointer controls inspection only inside its stage | 25° yaw range, 12° pitch; response 12 s⁻¹; scroll reveal .25–.65 progress; static finish swatches | Touch/keyboard angle control; preserve dimensions and attachment; compare silhouettes at extremes |
| Apparel / browse editorial imagery | Large art-directed images with a subtle local video reveal on deliberate hover/focus | Opacity 0→1 in .22 s; visual offset ≤8 px; 4 s muted loop | Poster on coarse pointer/reduced motion; no hover-only purchase info; pause offscreen |
| Architecture / explore a place | Plan-to-space diagram or a short baked camera sequence with fixed editorial labels | 72–120 frames, 160–240 vh scroll span; direct progress, label entry .4 s after framing holds | Complete static floor plan; verify compression, reverse frame access and memory |
| SaaS / understand a workflow | Original process diagram and genuine UI states responding to selection | 3 steps over 1.6 s on explicit play; list entry .24 s with .04 s stagger capped .2 s | Controls/data work immediately; diagram has text equivalent; animation never fabricates status |
| Finance / inspect numerical evidence | Stable data typography with a bounded chart reveal after data arrives | Path length→0 over .65 s; number display .4 s; no looping changes | Exact final data, table/labels, no deceptive interim numbers or delayed controls |
| Healthcare / understand and book | Calm information hierarchy; optional anatomy/explanation diagram | 8 px reveal over .24 s; 0 stagger for booking controls; explicit diagram steps | Content/focus first; static diagram; verify full form and error states |
| Travel / choose a destination | Cinematic landscape video or illustrated map with pointer-local depth | 5 s loop or 2 s scrub range; parallax ±10 px, response 10 s⁻¹ | Dimensioned poster, captions if meaningful audio, usable search; test cold load/mobile |
| Creative studio / judge craft | Kinetic lettering and cursor-local project preview tied to actual work | Type reveal .6 s; line stagger .08 s; preview follows at 18 s⁻¹ with 20 px offset | Bounded preview cannot cover links; focus reveals same project; one accent moment per section |
| Education / understand cause and effect | Directly manipulable motion graphic with labeled intermediate states | Slider 0–100%, no input delay; optional playback 3 s then stop | Keyboard range and text explanation; compare endpoints and intermediate meaning |
| Entertainment / explore a fictional world | Spatial gallery or shader atmosphere around legible navigation | Ring selection .55 s; background .08 Hz; one bounded distortion ≤.015 UV | Touch/keyboard list, reduced static view, measure fill rate and motion intensity |

Choose a coherent typography and palette from the topic's materials, brand and content. Do not default every technical product to neon, every luxury product to gold, or every healthcare site to pale blue. Explore two credible directions when identity is open; choose with a short reason linked to audience/task. Do not present arbitrary options when the brief already supplies an identity.

## Effect selection and composition rules

Assign each effect a job: reveal structure, show causality, confirm input, connect sections, direct attention or create a stated atmosphere. Prefer the smallest implementation that performs that job. If a hero has a moving product, keep its main copy and primary button stable during the key beat. If type is the hero, keep the background quiet enough to read it. Use 1–2 dominant easing families with explicit exceptions for physical behavior; do not distribute identical staggers across every element.

Choose input by expected control: scroll for narrative traversal, pointer for local inspection, explicit play for a demonstration, a slider for exact temporal exploration. A drag or scrub must have an obvious target and an ordinary alternative. Continuous pointer input should not remap the whole page unless the requested experience actually calls for that behavior.

Example selection record:

```text
Topic: sustainable kettle; primary action: compare/choose finish
Thesis: sculpted object with an explained heat path
Hero: live 3D inspection, bounded pointer yaw ±20°, response 12 s^-1
Second section: SVG heat-path explanation over p=.2–.7 scroll
Supporting motion: .18 s focus/hover color response, zero stagger on controls
Typography/palette: warm paper, charcoal copy, copper only for heat/selection
Owners: hero mode owns yaw; scroll owns diagram p; CSS owns button color
Assets: real model if supplied; original simplified geometry otherwise, disclosed
Fallback: dimensioned product poster and three labeled static diagram steps
Verification: silhouettes, exact finish state, reverse diagram, keyboard, 390px
```

## Complete the UI around the effect

Resolve navigation, loading, media failure, empty/filter results, forms, selected/disabled state, focus and final scroll exit. Content must be useful before animation initializes. For an ordinary informational page, preserve native page scrolling and link behavior. Test real copy and text enlargement; a poster that looks good in isolation can still hide a CTA in the final composition.

Evaluate the result against its thesis and primary action: intentional type wrapping, color hierarchy, subject framing, rhythm, restraint, input response and resilience. Record specific defects and fixes. “Award worthy” is an ambition; a truthful delivery describes actual behavior and evidence, not a guaranteed award or model-equivalent result.
