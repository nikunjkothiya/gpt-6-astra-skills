---
name: procedural-webgl
description: Create premium visual signatures without 3D model files - shader fields, gradients, grain and dithering, SDF and raymarched forms, DOM-synced WebGL image effects, procedural geometry, particles, CSS 3D, SVG filters, canvas generative art and liquid glass - with one render loop, capped cost, static fallbacks and verification. Use when a site needs an atmospheric or interactive visual layer, image hover or scroll distortion, a procedural object, or "3D" feeling with no assets.
---

# Procedural WebGL

Procedural visuals can express a subject without model assets: a field of color, responsive image distortion or lines drawn by code. Evaluate their code, texture and per-frame cost against a still image, SVG or CSS treatment. Budget, provide fallbacks and verify them like any other feature.

## Pick the lightest medium

| Effect | Medium |
| --- | --- |
| Static texture, grain, duotone, displacement on DOM | SVG filters and CSS ([color treatments](../color-system/references/color-science.md)) |
| Line drawings, diagrams, icon and logo motion | SVG paths with stroke animation or GSAP MorphSVG |
| Cheap generative backgrounds: flow lines, dots, grids | Canvas 2D |
| Full-screen color fields, noise, SDF or raymarched forms | WebGL shader; read [shaders and optics](../cinematic-web/references/shaders-and-optics.md) |
| Image distortion synced to DOM layout | Planes aligned to observed layout; read [spatial components](../cinematic-web/references/spatial-components.md) and [input mapping](../threejs-engineering/references/input-and-interface.md) |
| Procedural objects with real materials and light | Three.js with procedural geometry; verify the project's installed version |
| Large particle or compute effects | Evaluate the chosen backend and device; do not assume WebGPU features all have WebGL equivalents |
| Card flips, rings, perspective tilt | CSS 3D transforms |

## Architecture rules

1. **Explicit ownership.** Share a render owner for related effects; do not start competing loops. Choose fixed versus embedded canvases from the composition. See [stack and integration](../motion-engineering/references/stack-and-integration.md) when a shared ticker is needed; native scroll is valid.
2. **DOM stays the source.** Text, links and images remain real DOM; WebGL mirrors them. If WebGL fails, the DOM is the fallback.
3. **Cap the cost.** Device pixel ratio at most 1.5 for full-screen effects (2 for small canvases); render at 0.5–0.75 scale on phones; stop rendering when nothing changes.
4. **Pause what is not seen.** Stop the loop offscreen, in hidden tabs and under reduced motion (draw one still frame instead).
5. **Survive context loss.** Listen for `webglcontextlost`, reveal the DOM or poster fallback, and dispose everything on teardown.
6. **Colors from tokens.** Pass palette colors as uniforms; never hard-code a second palette inside shaders.
7. **Deterministic motion.** Drive shaders with time and progress uniforms; seeded noise only.

## Visual rules

- The field or effect expresses the site's world: diffusion for a perfume house, streamlines for a car, strata for a wine estate. A pretty shader unrelated to the subject is decoration.
- Define drift speed in the shader's actual coordinate units and choose it for the subject. Slow movement is not itself evidence of quality.
- Add dithering only when observed banding warrants it; preserve clean text and accurate imagery.
- Keep text off the busiest region, or give it a scrim, and check the least favorable background across the motion.
- Image effects return exactly to the undistorted image at rest; distortion is a transition, not a permanent state.

## Budgets

| Workload | Desktop | Mid-range phone |
| --- | --- | --- |
| Domain-warped fbm field, 5 octaves | Full resolution, DPR ≤ 1.5 | 0.5–0.75 scale, DPR 1 |
| Raymarched SDF object, ≤ 80 steps | 0.75 scale | 0.5 scale or a pre-rendered loop |
| DOM-synced image planes | ≤ 30 visible planes | ≤ 12 visible planes |
| Particles | ≤ 100k points | ≤ 20k points |
| Draw calls | ≤ 50 | ≤ 25 |
| Texture size | 2048 px | 1024 px |

Measure on the target phone; these are starting limits, not guarantees.

## Verify

- No shader compile or link errors in the console; errors must reveal the fallback.
- Frame timing stays stable during scroll and pointer movement (`node scripts/capture.mjs` reports wheel-scroll intervals; confirm on a real GPU).
- Reduced motion shows a still frame; hidden tabs and offscreen sections stop rendering.
- Simulate context loss with the `WEBGL_lose_context` extension and confirm the fallback.
- Compare the rendered image against the DOM image for color: textures must not look darker or washed out.

## Load next

- [Scene lifecycle](../threejs-engineering/references/scene-lifecycle.md): loading, resize, one loop and disposal.
- [Assets and rendering](../threejs-engineering/references/assets-and-rendering.md): texture/color boundaries, geometry and rendering choices.
- [Shaders and optics](../cinematic-web/references/shaders-and-optics.md): effect selection, coordinate spaces and budgets. This package supplies guidance, not a universal drop-in shader runner.
- Related: [shaders and optics](../cinematic-web/references/shaders-and-optics.md), [spatial components](../cinematic-web/references/spatial-components.md), [Three.js engineering](../threejs-engineering/SKILL.md), [compositing and blending](../rendering-judgment/references/compositing-and-blending.md).
