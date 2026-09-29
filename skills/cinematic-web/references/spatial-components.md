# Spatial components, particles, and DOM alignment

Use when a spatial arrangement contributes to browsing, comparing, selecting, or understanding content. **FROM-KNOWLEDGE:** original layout procedures. **ESTIMATED:** the numbers are starting proposals for a scene with cards roughly 1 unit wide, +Y up and camera toward −Z. They require actual rendering and input testing.

## Establish the component contract

Keep item identity, selection, focus, and route data in application state. Geometry presents that state. Preserve a semantic DOM list, labels, previous/next controls, and a selected-item link or action. Support keyboard arrows where conventional, normal Tab access, and touch drag without preventing ordinary vertical document scrolling. Announce settled selection when useful; do not announce every animation frame.

Record the cardinality, visible count, selected index, canonical layout function, allowed travel, perspective, opacity policy, and interruption rule. Drive all cards from one continuous selection coordinate `q`; integer values identify settled selections. For a commanded next item, start with a .55 s `power2.inOut` transition. A retargetable critically damped response at 14 s⁻¹ can preserve velocity when input arrives repeatedly. Direct dragging follows the pointer; apply damping after release, not while the pointer expects contact.

## Parametric layout recipes

Let `k=i-q`, `s=.34` rad, and `a=k*s`. The expressions describe position/orientation for item `i`; use canonical transforms every evaluation. These layouts are alternatives chosen by the content, not effects to stack in one gallery.

| Layout | Procedure and numeric recipe | Anti-pattern | Verification |
| --- | --- | --- | --- |
| Ring | For N≥5, angle `a=2π*(i-q)/N`; radius 2.4; `x=R*sin(a)`, `z=R*cos(a)`, yaw a; camera outside ring near z=6 | All cards equally legible behind the ring, wrong-facing cards, selection wraps by a visible teleport | 0→N→0, front/back face policy, stable selected identity, narrow viewport |
| Arc | Use a limited 5-card arc, `a=clamp(k,-2,2)*.28`; x=`2.6*sin(a)`, z=`2.6*(cos(a)-1)`; yaw a | Clamping many visible items to the same endpoint or unrelated fade threshold | Fade/offscreen policy for nonvisible items, selected centering, endpoint buttons |
| Spiral | Angle `.65*k`, radius `1.6+.08*k` within finite visible range k∈[−3,3], y=`.22*k`; aim planes toward a defined viewing direction | Unbounded radius or height as index grows; unreadable overlapping labels | All finite ranges and selected item's minimum screen area |
| Fan | x=`.52*k`, y=`−.06*k*k`, z=`−.06*abs(k)`, roll=`−6*k` degrees; active card roll 0 | Fan overlap blocks every inactive hit target or reverses semantic order | Pointer hits, keyboard focus, occlusion and long labels |
| Depth stack | x=`.12*k`, y=`−.06*abs(k)`, z=`−.5*abs(k)`; active scale 1; fade only distant decorative layers | Tiny perspective scaling used to conceal essential text | Selected content readable without canvas; far-plane and transparent ordering |
| Wave gallery | x=`1.15*k`, y=`.14*sin(.8*k+.5*p)`; yaw=`4*sin(.8*k)` degrees; keep temporal phase from storyboard | Every image oscillates forever with no reading hold | Same p returns same pose; motion stops on settled reading state |

For finite arcs/fans/stacks, render a bounded window of items; move recycled content only while its opacity is zero or it is outside the visible area. Derive opacity continuously, for example fade over `abs(k)=2.2→2.7`, and ensure stale links do not remain focusable in hidden duplicates. Ring loops can use continuous angle without resetting the transform; compute selected labels modulo N separately. A visible cut at an index wrap is a defect.

### Ring evaluation core

```js
function evaluateRing(cards, q, radius = 2.4) {
  const count = cards.length;
  if (count < 1 || !Number.isFinite(q) || !(radius > 0)) return;
  for (let i = 0; i < count; i++) {
    const angle = 2 * Math.PI * (i - q) / count;
    cards[i].position.set(radius * Math.sin(angle), 0, radius * Math.cos(angle));
    cards[i].rotation.set(0, angle, 0);
  }
}
```

This places every card on the ring and faces its +Z normal outward. It does not choose backside visibility, keyboard behavior, opacity, camera fit, or resource lifecycle. Add those according to the component contract. Test 0/1/2 items separately rather than forcing a ring formula onto an unsuitable collection.

For drag, map 160 CSS px to one card as an initial proposal, clamp release velocity to 4 cards/s, and settle to a valid item over approximately .35–.65 s. Preserve native scrolling until horizontal intent is clear (for example after 8 px with horizontal travel 1.4 times vertical travel), and use appropriate `touch-action` on the actual gesture surface. Pointer capture begins only when the component owns the drag. Release on up/cancel and restore a valid selection; never depend on hover on touch.

## DOM and WebGL synchronization

Choose which representation owns layout. For editorial galleries, DOM commonly owns the item rectangle and the WebGL plane mirrors it; semantic content stays useful before the canvas loads. Measure each relevant rectangle once in a batched layout phase after fonts/images settle. Keep viewport coordinates relative to the actual canvas rectangle, not the window. Cache geometry and update transforms; avoid React state updates and fresh geometries every frame.

For an unrotated perspective camera viewing a plane at constant distance `d`, visible height is `2*d*tan(verticalFov/2)` and visible width is height times canvas aspect. A DOM rectangle can map from its normalized canvas coordinates to that plane. For arbitrary rigs, cast rays through rectangle corners and intersect the intended plane; a fixed FOV scale formula cannot account for a tilted surface.

World-to-DOM labels use the camera projection and canvas rectangle:

```js
// Reuse projectedVector; canvasRect is in CSS pixels.
projectedVector.copy(worldAnchor).project(camera);
const x = canvasRect.left + (projectedVector.x + 1) * canvasRect.width / 2;
const y = canvasRect.top + (1 - projectedVector.y) * canvasRect.height / 2;
label.style.transform = `translate3d(${x}px, ${y}px, 0)`;
```

This example assumes the label uses fixed viewport positioning; subtract the containing block offset for a positioned local container. Update scene/camera matrices before projecting. A projected x/y does not prove visibility: check clip depth, camera-facing position, occlusion where necessary, and text-safe margins. Use a controlled .18 s opacity fade for decorative labels leaving a valid view; required labels retain a DOM list alternative.

Do not render one image in both layers at full opacity. Match crop, border radius, color processing, dimensions, and a .2 s crossfade when handing presentation to WebGL. Compare DOM-only and canvas screenshots at fixed positions and DPR. Test page scroll, nested scroll, browser zoom, resize during movement, loading fonts, and a failed texture. If the WebGL effect fails, the DOM source must remain visible.

## Particles and globes

Choose the simplest representation that satisfies the shot. A particle effect with 10,000 points can be cheaper than 100 overlapping transparent quads, depending on size and shading. Measure fill rate and overdraw as well as count.

| Technique | Procedure and numeric recipe | Anti-pattern | Verification |
| --- | --- | --- | --- |
| Points | One `BufferGeometry`, seeded positions/attributes; start 8k particles and 1–3 CSS px apparent size; motion from explicit time with amplitude .03 units | Thousands of individual Mesh objects or giant alpha sprites | Draw calls, visible density, point-size limits, overdraw at worst camera |
| Instancing | One geometry/material with per-instance matrix/color; start 1k low-poly instances; update changed attributes and mark buffers dirty once | New instance buffers per frame; no bounds updates after motion | Instance bounds/frustum behavior, matrix correctness, picking ID maps |
| GPGPU/FBO | For interacting particles, store position and velocity in ping-pong textures; start 128² particles, fixed dt 1/120 s, max 4 catch-up steps; declare discarded-time policy | Reading and writing the same attachment, unsupported float formats, negative-dt reverse pretending to undo a simulation | Capability detection, initialization errors, deterministic replay, pause/resume, teardown |
| Particle globe | Fibonacci-distribute 6k points on radius 1; rotation 4°/s only while visible; geographic data uses explicit latitude/longitude convention | Random clustering, misleading geographic placement, cursor spin hiding labels | Pole/seam distribution, known geographic anchors, pause and keyboard selection |
| Globe connections | Great-circle interpolation between unit endpoints; raise arc radius by `.12*sin(π*t)`; reveal over .8 s with `power2.inOut` | Linear chords through the earth or every route flashing at once | Antipodal/identical endpoints, occlusion, motion-reduced static route |

Original stable sphere distribution, for `i` from 0 to N−1:

```js
const y = 1 - 2 * (i + 0.5) / count;
const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
const angle = i * Math.PI * (3 - Math.sqrt(5));
const x = radiusAtY * Math.cos(angle);
const z = radiusAtY * Math.sin(angle);
// Multiply (x,y,z) by the authored globe radius.
```

For geographic positioning use a documented convention, e.g. latitude φ and longitude λ in radians: `(cosφ*cosλ, sinφ, -cosφ*sinλ) * R`; rotate the globe to choose its initial meridian. Great-circle interpolation needs a separate chosen plane for antipodal endpoints and a direct hold for identical endpoints. Do not let numerical normalization of a near-zero cross product choose an arbitrary route.

The WebGL [GPUComputationRenderer](https://threejs.org/docs/pages/GPUComputationRenderer.html) provides a version-specific ping-pong helper. Verify renderable texture formats and initialization errors on the target device. Two RGBA32F variables with two 256² render targets each cost about 4 MiB before initial textures and other allocations. GPGPU capability and cost are separate questions.

A simulation is not inherently reversible under scroll. For an exact reversible story, prefer seeded analytic positions as a function of p, bake a sequence, or replay a fixed-step simulation from a checkpoint with recorded inputs. Capture equal inputs at 30/60/120 Hz presentation rates and compare state. Reduced motion holds an informative distribution; constrained tiers reduce count, sprite area, and shader complexity before sacrificing the main silhouette.
