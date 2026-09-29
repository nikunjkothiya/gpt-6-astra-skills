---
name: cinematic-web
description: Design and implement cinematic websites and interface sequences with scroll choreography, Three.js, GSAP, shaders, spatial components, and measured motion. Use when a brief calls for a directed visual story, an interactive 3D hero, or film-like transitions across a page; use ordinary interface skills for a simple isolated transition.
---

# Cinematic Web

Make an authored visual story that remains a usable website. Encode the choices, numbers, ownership, and evidence another model needs to reproduce the work. Visual ambition is a brief to implement and verify; it does not establish an award, a model's hidden reasoning, or identical results across models.

## Begin with a storyboard

Before writing cinematic implementation code, produce a motion storyboard. Inspect the existing product, content, framework, assets, target devices, and actual reference material first. For every time or scroll segment, write:

| Required field | Specify |
| --- | --- |
| Range and beat | Start/end progress or seconds; what the viewer should understand or feel |
| Camera | Position, target, vertical FOV, roll, path, units |
| Objects | Canonical start/end transforms, pivots, morphs, visibility |
| Light/material | Start/end intensity, exposure or color, owner |
| DOM | Copy or element, position/opacity/mask endpoints; reading interval |
| Motion | Duration or normalized span, easing, delay, stagger, travel, rotation, scrub/damping |
| Alternative | Reduced motion, touch, low-power, loading and failure behavior |

Derive code from these rows; update the storyboard when an implementation choice changes the sequence. Numeric starting points in the references are **ESTIMATED design proposals**, not observations of a site or promises of performance. Replace them with project-specific measured values as work proceeds. Use explicit zeroes or `not applicable` for motion fields that do not apply.

Choose one dominant movement per beat. Give information a readable hold. Preserve position across ordinary transitions and velocity when the interaction calls for it; avoid threshold-triggered object, light, or camera jumps. Reduced-motion changes, user-requested skips, loading failures, and recovery can resolve immediately to useful stable states.

## Choose the relevant reference

- First, read [storyboard, art direction, and rendering choice](references/storyboard-and-rendering.md). Decide live 3D, baked support, video, image sequence, or hybrid against the actual interaction and delivery budget.
- For scroll pinning, scrubbing, horizontal passages, smoothing, camera paths, reversibility, and asset animation, read [scroll and camera](references/scroll-and-camera.md).
- For gradient mesh, swirl, flame, aurora, halftone, SDF, glass, distortion, and postprocessing, read [shaders and optics](references/shaders-and-optics.md).
- For rings, arcs, fans, spiral/depth/wave galleries, particles, globes, and DOM alignment, read [spatial components](references/spatial-components.md).
- For typography motion, followers, magnetic/tilt interactions, page transitions, app screens, Next.js, and runtime resilience, read [interface and integration](references/interface-and-integration.md).
- When studying a live site or public preview, read [reference study](references/reference-study.md). Every reference claim needs provenance and estimated parameters must be labeled.
- Before implementation choices become completion claims, read [motion verification](references/motion-verification.md). Match checks to the host's real capabilities.

Load only relevant technique references. For deeper resource ownership, use [Three.js engineering](../threejs-engineering/SKILL.md); for exact poses and attachment mechanics, use [object structure](../object-structure/SKILL.md); for retargetable physical responses, use [motion intelligence](../motion-intelligence/SKILL.md). Use [visual composition](../visual-composition/SKILL.md) for typography, spacing, color, and layout decisions.

For topic-based effect selection, cursor tracking, animated graphics or input-controlled GIF/video/sequence presentation, use [interactive motion](../interactive-motion/SKILL.md). It supplies the reusable pointer and video seek controllers, format limitations, and ownership handoffs needed around this cinematic integration.

## Keep the execution contract small and explicit

Maintain one normalized story progress, one rendering scheduler per canvas, and one owner per animated property. Scrubbed state is a function of canonical inputs: the same progress, viewport, assets, and seed must reproduce the same authored state. A stateful simulation needs deterministic replay or a separately documented history-dependent contract.

Declare the host's available capabilities, installed library versions, renderer backend, target frame budget, loading budget, and downgrade policy. A files-only model can produce code and arithmetic checks; it cannot report a rendered or smooth result. Keep content, controls, focus, loading status, and fallback outside the canvas when they carry meaning.

Build the hardest representative beat first after its storyboard exists. Verify it at delivery sizes, then connect adjacent beats and content. Fix silhouette, timing, composition, ownership, and bottlenecks before accumulating effects. Finish by reporting implementation, observed evidence, measurements under stated conditions, and remaining unverified behavior.
