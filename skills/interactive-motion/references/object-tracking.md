# Cursor-driven objects and believable motion

Use for DOM, canvas or live 3D objects that respond to pointer movement, drag or focus. Choose the coordinate system and physical constraints before adding smoothing. Pair with [cursor choreography](cursor-choreography.md), [canonical poses](../../object-structure/references/canonical-poses.md) and [timing and interruption](../../motion-intelligence/references/timing-and-interruption.md).

## Select the real interaction

| Requirement | Appropriate mechanism | Boundary |
| --- | --- | --- |
| Decorative card/image depth | Inner DOM layer transform from local u/v | Leaves outer hit target, text and focus geometry stable |
| Product gently follows gaze | Live object's bounded inspection pivot | Does not rotate every joint or independently move attached parts |
| Drag product on a plane | Ray/plane intersection with grab offset | Requires explicit drag ownership and pointer capture |
| Orbit around a product | Existing camera orbit controller | Object transform stays canonical; avoid a second camera writer |
| Scrub recorded rotation | Local x→recorded video/sequence progress | Limited to authored viewpoints; no unseen geometry |
| Follow an actual tracked person/object in video | Vision/tracking pipeline plus coordinate calibration | Ordinary browser pointer tracking does not perform computer vision |

Determine which meaning the brief intends. Do not introduce a vision model for mouse following, or promise arbitrary spatial interaction from a flat clip.

## Spaces, pivots and camera mapping

Normalize client coordinates against the actual canvas/surface rectangle. For Three.js NDC, `x=2u-1` and `y=1-2v`; update world matrices before queries when the camera/parents changed. Use [`Raycaster.setFromCamera`](https://threejs.org/docs/#Raycaster) with the active camera. Test an offset canvas and page scrolling; window-normalized coordinates fail in embedded stages.

For dragging, raycast the selectable object on pointer down, choose a deliberate world plane, and record `grabOffset = objectWorldPosition - hitOnPlane`. Each move computes a new intersection plus that offset. A parallel ray has no valid intersection; retain the previous valid position. Convert the result through the inverse parent world transform before assigning local position. Clamp in the declared space. A scaled/rotated parent makes world and local values different.

For a look response, keep the product's authored rest quaternion and a dedicated inspection pivot. Derive bounded yaw/pitch from canonical normalized input, for example yaw `(u-.5)*16°`, pitch `(.5-v)*10°`. Compose with the rest orientation in the documented local/world order. Do not accumulate Euler increments across frames; that drifts and makes exact reset impossible. If a skeletal or exploded timeline already owns the product, apply optional tracking on a separate parent pivot.

Use [`Quaternion`](https://threejs.org/docs/#Quaternion) operations for orientation interpolation and shortest-path behavior. Do not apply scalar springs to four quaternion components independently. Keep look targets away from degeneracy and bound roll when the art direction requires an upright product. Verify all pointer extremes against the framing and attachment envelope.

## Motion law and ownership

Direct drag should keep the selected point attached to the pointer; long easing on the authoritative drag position causes visible slip. Add inertia after release only if the task benefits, with bounded velocity, collision/limit behavior and an ordinary precise alternative.

For decorative following, use exponential damping `alpha=1-exp(-rate*dt)` and a clamped target. For continuous position and velocity through retargeting, use the tested critical spring in the timing reference; keep state velocity when the target changes. Specify seconds and scene/CSS units. Decide how hidden tabs and long frames settle or reset instead of integrating a giant unobserved step.

One owner writes each property. Define modes such as narrative, inspect, drag, reset and static with handoff rules. New direct input cancels or retargets reset from the actual displayed state. On pointer cancel, lost capture or blur, release the gesture; settle to the chosen rest/held state. Touch-action must preserve scrolling outside the gesture's genuine needs. A decorative response needs hover/fine-pointer gating and equivalent focus/selection behavior.

Believable motion follows the object's structure: rigid links preserve joints, doors rotate around hinges, assembled parts follow their parents, loose pieces have an authored separation path. A spring alone does not supply mass, collision or material truth. Use a physics engine only when actual interacting simulation is required, with timestep/interpolation and deterministic reset specified; a product presentation can use constrained authored kinematics.

## Lifecycle, smoothness and verification

Use the host's single render loop or invalidate/demand mechanism. Stop scheduling when errors and velocity are below stated tolerances; snap to the canonical endpoint once. Pause hidden/offscreen work. Dispose capture, listeners, observers, scheduled frames and owned GPU resources on unmount. Repeated mounts must not multiply loops.

Verify embedded coordinates, parent transforms, hard limits, all view extremes, pointer cancellation, touch scrolling, keyboard alternatives, interrupted reset and repeated exact returns. Log target/displayed position and velocity plus active frame intervals. Inspect the real object in motion for apparent lag, sudden acceleration, pivot drift, clipping and attachment defects. A CSS translation, a baked sequence and physically simulated movement are different capabilities; describe the implemented one accurately.
