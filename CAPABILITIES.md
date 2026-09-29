# Capability map and loading guide

Use this map to select full skill bodies for the user's requirements. It records instruction coverage; the target project's rendered result still needs its own evidence. The [coordinator](skills/visual-engineering-intelligence/SKILL.md) routes broad tasks and preserves decisions between specialties.

## Requirement coverage

| Requirement | Owning skills and detailed guidance | Evidence in the target project |
| --- | --- | --- |
| Different visual tastes and premium identity | [Visual direction](skills/visual-direction/SKILL.md), [visual languages and themes](skills/visual-direction/references/visual-languages-and-themes.md), [luxury editorial direction](skills/visual-direction/references/luxury-editorial-direction.md) | Real subject, copy and action express the chosen thesis across opening, ordinary states and mobile |
| Typography, palette, spacing and hierarchy | [Visual composition](skills/visual-composition/SKILL.md), [type/color/layout](skills/visual-composition/references/type-color-layout.md) | Loaded fonts, meaningful wraps, semantic colors, consistent density and theme contrast |
| Complete UI and interruptions | [Interaction design](skills/interaction-design/SKILL.md), [state and interruption](skills/interaction-design/references/state-and-interruption.md) | Navigation, loading, empty/error/retry, selection, focus and final actions work |
| Motion laws and physical character | [Motion intelligence](skills/motion-intelligence/SKILL.md), [timing and interruption](skills/motion-intelligence/references/timing-and-interruption.md) | Correct units, retargeting, continuity, exact settle and actual playback |
| Motion graphics and kinetic type | [Interactive motion](skills/interactive-motion/SKILL.md), [motion graphics](skills/interactive-motion/references/motion-graphics.md) | Meaningful static frame, timeline endpoints, loop seam, pause and readable type |
| Cursor followers, masks, tilt and reveals | [Cursor choreography](skills/interactive-motion/references/cursor-choreography.md) | Embedded coordinates, stable click targets, bounded movement, cancel, touch/focus equivalents |
| Cursor-controlled real objects | [Object tracking](skills/interactive-motion/references/object-tracking.md), [Three.js input](skills/threejs-engineering/references/input-and-interface.md) | Ray/plane mapping, parent transforms, capture, limits, ownership and exact return |
| GIF/video-driven movement | [Media scrubbing](skills/interactive-motion/references/media-scrubbing.md), [asset preparation](skills/interactive-motion/references/asset-preparation.md) | Real metadata, authored segment, latest seek, decode/presentation, supported codec and fallback |
| Video-to-JPG and scroll frame changes | [Scroll image sequences](skills/interactive-motion/references/scroll-image-sequences.md) | Actual frame inventory, bounded memory/requests, no stale presentation, crop, reverse and missing-frame recovery |
| Scroll, pinning and camera choreography | [Cinematic web](skills/cinematic-web/SKILL.md), [scroll and camera](skills/cinematic-web/references/scroll-and-camera.md) | Numeric storyboard, one progress owner, fast/reverse input, resize, release of pins and final exit |
| Live/baked/sequence selection | [Storyboard and rendering](skills/cinematic-web/references/storyboard-and-rendering.md) | Chosen medium supports the required views, controls, payload and device budget |
| Shaders, particles and 3D UI structures | [Shaders and optics](skills/cinematic-web/references/shaders-and-optics.md), [spatial components](skills/cinematic-web/references/spatial-components.md) | Parameter bounds, correct spaces, deterministic states, legible DOM and measured rendering cost |
| Geometry and construction accuracy | [Geometric reasoning](skills/geometric-reasoning/SKILL.md) | Silhouette, dimensions, topology, joins, normals and appropriate detail at delivery scale |
| Connected objects and articulation | [Object structure](skills/object-structure/SKILL.md), [canonical poses](skills/object-structure/references/canonical-poses.md) | Correct parents/pivots, attachment invariants and repeated exact resets |
| Assembly, disassembly and exploded views | [Assembly choreography](skills/assembly-choreography/SKILL.md) | Valid release order, clearance and paths, maintained attachment, reversible reassembly |
| Space, scale and labels | [Spatial reasoning](skills/spatial-reasoning/SKILL.md) | Orientation, depth, occlusion, reachable controls and equivalent task access |
| Surface identity and material response | [Material reasoning](skills/material-reasoning/SKILL.md) | Correct material scale, texture channels, roughness and response under actual lighting |
| Lighting, grounding and atmosphere | [Lighting design](skills/lighting-design/SKILL.md) | Form separation, contact, highlight control and temporal stability |
| Camera framing and fit | [Camera composition](skills/camera-composition/SKILL.md) | Usable viewport, all required poses, clipping, projection and mobile composition |
| Rendering and blending | [Rendering judgment](skills/rendering-judgment/SKILL.md), [compositing and blending](skills/rendering-judgment/references/compositing-and-blending.md) | Color/output boundaries, alpha edges, crossfade coverage, transparent depth and actual backdrop |
| Three.js runtime and integration | [Three.js engineering](skills/threejs-engineering/SKILL.md), [interface integration](skills/cinematic-web/references/interface-and-integration.md) | Loading, lifecycle, R3F/vanilla ownership, disposal, context loss and framework boundaries |
| Narrative and product explanation | [Visual storytelling](skills/visual-storytelling/SKILL.md) | Intended knowledge at each beat, reading holds, skip/revisit and useful end state |
| Responsive/mobile composition | [Responsive composition](skills/responsive-composition/SKILL.md), [content-driven response](skills/responsive-composition/references/content-driven-responsive.md) | Content-derived breakpoints, short height, enlarged text, dynamic viewport, safe areas and input changes |
| Accessibility and input alternatives | [Visual accessibility](skills/visual-accessibility/SKILL.md) | Meaning, keyboard/focus, contrast, touch, reduced motion and complete fallback |
| Performance and quality tiers | [Visual performance](skills/visual-performance/SKILL.md) | Real device timings, sustained workload, memory, idle work and acceptable downgrade |
| Reference fidelity | [Visual reconstruction](skills/visual-reconstruction/SKILL.md), [matched views](skills/visual-reconstruction/references/matched-view-comparison.md) | Comparable fonts, viewport, crop, state and observed differences with stated tolerances |
| Visual and temporal acceptance | [Visual QA](skills/visual-qa/SKILL.md), [render/playback](skills/visual-qa/references/render-and-playback.md), [motion verification](skills/cinematic-web/references/motion-verification.md) | Inspected captures and playback, relevant invariants, actual measurements and explicit unverified items |

## Select a bundle or load in stages

| Bundle | Use when | Scope |
| --- | --- | --- |
| `premium-ui` | Establishing a complete premium interface across devices | 8 skills and 10 references: direction, visual language, composition, interaction, motion, responsiveness, accessibility and QA |
| `interactive-motion` | Implementing graphics, cursor/scroll or recorded-media behavior | 6 skills and 12 references: medium selection, preparation, controllers, cinematic progress and verification |
| `luxury-cinematic` | Directing a luxury/editorial cinematic experience | 8 skills and 12 references: visual finish, media, live objects and story choreography |
| `product-3d` | Constructing, lighting, assembling or inspecting a real 3D product | 8 skills and 9 references: geometry, structure, assembly, material, light, camera, rendering and Three.js execution |

These are bounded starting selections. The two motion bundles do not include the full responsive/accessibility implementation bodies, and `product-3d` concentrates on the scene. Load the missing owners when the surrounding UI requires them. Combine bundles with repeated `--bundle` flags in the text exporter; it deduplicates documents. MCP hosts retrieve additional bodies as decisions arise. Text-only hosts must receive those bodies explicitly.

For limited context, start with the coordinator and catalog, then load direction/composition for design, the chosen runtime and media references for implementation, and relevant QA references for verification. Carry a compact record of real tokens, dimensions, modes, endpoints, budgets and unresolved evidence between stages. Do not spend the context window on all techniques before understanding the brief.

## Audit scope

The September 29, 2026 audit reviewed skill entrypoints, references, prompts, installer, catalog, MCP loading, exports, package scripts and tests against the requested capabilities. It added detailed visual-language/theme and compositing guidance, focused bundles and corrected packaging/verification guidance. See [package validation](PACKAGE-VALIDATION.md) for checks actually run and their limits. This map establishes retrievable coverage, not universal model ability or award quality.
