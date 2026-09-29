---
name: threejs-engineering
description: Implement browser 3D experiences with Three.js or an existing React Three Fiber stack. Use for scene lifecycle, asset loading, canvas and DOM integration, picking, animation loops, rendering configuration, and GPU resource ownership. Pair with the relevant visual specialist for geometry, motion, materials, lighting, or composition decisions.
---

# Three.js Engineering

Turn a resolved visual and interaction intention into a working browser experience. Keep scene state, application state, rendering, input ownership, and resource lifetime explicit enough to survive resize, interruption, navigation, failed assets, and repeated mounting.

## Establish the implementation boundary

Inspect the host framework, installed `three` revision, renderer backend, add-ons, asset pipeline, browser targets, and existing component conventions. Use the project's supported stack. Check version-matched official documentation or installed source before adopting an API; the live documentation and React Three Fiber's `/next/` branch may describe a different major version. Record versions actually exercised.

Choose Three.js when depth, inspection, lighting, geometry, or spatial interaction contribute to the task. Use DOM for semantic interface controls and readable content. A 3D hero still needs useful loading, failure, keyboard, touch, and reduced-motion states.

For uncertain form, use [geometric reasoning](../geometric-reasoning/SKILL.md); for hierarchy and pivots, [object structure](../object-structure/SKILL.md); for appearance, [material reasoning](../material-reasoning/SKILL.md) and [lighting design](../lighting-design/SKILL.md). These skills define the visual relationships. This skill owns their browser implementation.

## Establish one coherent scene contract

Keep the scene's units, axes, semantic part IDs, attachment frames, canonical poses, configurable dimensions, assets, and control owners together in the existing project structure. Place construction parameters in one source. Resolve application intent into scene state; avoid deriving selected product variants or completed tasks from animation callbacks alone.

Use one renderer loop per canvas and one owner per animated degree of freedom. Distinguish changes that require rebuilding geometry from those that only change a transform or uniform. Release the previous owner before handing a camera or part to direct manipulation, a timeline, or simulation.

Build the representative object and its hardest interaction early. Check its silhouette, surface response, legibility, manipulation, and performance at the actual delivery size before expanding the scene. Keep meaningful structure and editable parameters through iteration.

## Load the relevant implementation reference

- For mounting, resizing, demand rendering, async races, teardown, and resource ownership, read [scene lifecycle](references/scene-lifecycle.md).
- For selecting, dragging, camera control, touch boundaries, semantic alternatives, or aligning DOM overlays, read [input and interface integration](references/input-and-interface.md).
- For choosing geometry, loading products, color spaces, material diagnostics, shadows, shaders, and rendering budgets, read [assets and rendering](references/assets-and-rendering.md).
- When the project already uses React Three Fiber, read [React Three Fiber integration](references/react-three-fiber.md). Use its scheduler and lifecycle conventions.
- For canonical transforms or reversible assemblies, read the [object structure implementation reference](../object-structure/references/canonical-poses.md).
- For retargeting, elapsed time, settling, or progress-driven movement, read the [motion implementation reference](../motion-intelligence/references/timing-and-interruption.md).

## Verify the integrated experience

Inspect actual renders at the intended sizes and observe motion playback. Verify initial presentation, complete loading, an asset failure, input during movement, interrupted gestures, resize, reduced motion, and navigation away and back when these apply. Exercise ordinary controls alongside the canvas.

For a resting scene, confirm that rendering settles according to its chosen policy. For continuous scenes, profile representative motion and expensive views. Use measured bottlenecks to choose quality reductions; keep essential silhouette, readable labels, input response, and selection meaning.

Inspect console errors and compare resources across repeated mount/unmount or product replacement. Expect stable retained resources after warmup, accounting for documented caches; a single nonzero memory count does not establish a leak. Numerical transform checks complement visible joins and motion inspection.

Report the renderer and versions, observable behaviors checked, visual captures or recordings, performance conditions, and any unavailable validation. A compilable scene establishes implementation validity only; rendered evidence establishes its appearance.
