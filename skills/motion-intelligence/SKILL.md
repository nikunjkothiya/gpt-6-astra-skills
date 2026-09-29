---
name: motion-intelligence
description: Design and refine interface transitions, direct manipulation, object animation, reveals, loops, and progress-driven choreography. Use when movement must clarify state, feel responsive, convey weight, preserve continuity, or survive interruption and reversal; also use for motion that feels floaty, jerky, delayed, excessive, or disorienting. Pair with assembly choreography for mechanically constrained separation and return.
---

# Motion Intelligence

Treat time as part of the information structure. Motion should reveal a cause, relationship, state, direction, or transformation while preserving the user's control.

## Specify the motion contract

Before tuning appearance, establish the trigger, information communicated, moving subject, start and target states, path, stable anchor, timing, settling, interruption, and reversal. Declare whether time, direct input, narrative progress, or physical state controls the movement. If the purpose is atmosphere or play, make that purpose specific enough to guide amplitude, rhythm, and attention.

Use [interaction design](../interaction-design/SKILL.md) to establish actual task state. Animation presents that state; it must not become the sole source of selection, completion, or failure.

## Choose temporal behavior by control

| Situation | Temporal decision |
| --- | --- |
| Direct manipulation | Track input promptly; avoid cinematic lag between the controlling gesture and the subject |
| Release after manipulation | Continue only meaningful momentum, then settle toward a valid state |
| New local state | Acknowledge immediately; use a brief transition only to clarify correspondence |
| Entry into attention | Deceleration can help establish arrival at a readable destination |
| Departure from attention | A short accelerating exit can communicate leaving without prolonging dismissal |
| Symmetric exchange | Balanced acceleration and deceleration can express equal status |
| Large spatial change | Preserve landmarks, stage the change, or use a cut if continuous travel would disorient |
| Narrative emphasis | Allow enough time to perceive the new information; keep task access and skipping available |

Choose duration from travel distance, visual angle, information complexity, input frequency, and the desired perceived speed. Doubling distance need not double duration, but large jumps at the same duration may feel violent. Tune related movements as a family with a clear order of emphasis. Specify delay, travel, and dwell separately; a reading hold is not slow travel. Where a duration is needed, choose an actual value appropriate to the work instead of handing off only words such as smooth or snappy.

Functional feedback and completed results must appear when available. Do not impose an artificial minimum wait to let decorative motion finish.

## Give physics a specific role

Acceleration communicates how effort begins; deceleration communicates capture or arrival. Overshoot suggests elasticity or stored energy and is unsuitable when it implies crossing a hard mechanical stop or overshooting a precision choice.

A lightly damped response may oscillate; increasing damping suppresses oscillation, while excessive damping can prolong settling. Choose stiffness and damping together against apparent mass, travel, and purpose. For authored settling, define a tolerance and finish at the canonical endpoint; physical simulation needs a valid constraint or control handoff for exact placement. Do not add bounce to every control to imply tactility.

Use anticipation only when preparing the viewer for a meaningful event. It should not delay direct response or move a target away from activation. Secondary follow-through should follow the main cause, stay subordinate, and end without continuous residual wobble.

Define inertia together with bounds, friction or resistance, and a way to arrest movement. A camera or object that continues beyond useful inspection space has lost its semantic constraint, even if the motion looks physically smooth.

## Preserve continuity under interruption

Retarget from the current visible position and, where appropriate, velocity. A new gesture may deliberately stop momentum; an automated reversal should not introduce an unexplained snap. Avoid queuing obsolete destinations after repeated input.

Choose one owner for a moving degree of freedom. Transfer control explicitly between user manipulation, scripted motion, and physical behavior. Preserve canonical endpoints through [object structure](../object-structure/SKILL.md) when repeated or reversible transforms matter.

Make progression independent of the number of displayed frames. Use elapsed time or absolute input progress for authored movement; physical simulation also needs explicit initial conditions and integration behavior. After a long pause, restore a meaningful state instead of applying one enormous motion step. A changed motion preference or unavailable animation mechanism must still leave the task in a valid state.

For rotation, preserve the intended axis and angular path. The shortest rotation is useful for ordinary retargeting, but winding or threaded actions may require explicit turns. Valid endpoints do not make every interpolation valid: mechanically grounded movement must preserve hard stops, attachments, positive physical dimensions, and clearance throughout the path. Seamless loops need compatible pose and velocity; match acceleration when a mismatch creates a visible pulse.

## Choreograph attention

Sequence by causal dependency and comprehension. Let a parent event establish context before children respond. Overlap independent events when their relationship remains readable. Stagger only to express order, grouping, or propagation; the final useful item should not wait through a long decorative cascade.

Keep a stable subject, landmark, or interface anchor. Compose the starting pose, most expressive pose, and settled pose for readable silhouettes and relationships. Avoid losing an important form in overlap during its defining event. When many parts move, coordinate onset, direction, and settling around one dominant event. Contrast active intervals with stillness so emphasis remains perceptible.

For authored progress-driven sequences, derive each state from a stable progress reference and defined intervals. Reverse traversal and abrupt jumps should produce coherent states; history-dependent simulation needs explicit state or a replay strategy. Use [visual storytelling](../visual-storytelling/SKILL.md) when sequence controls what the viewer learns.

## Reduced movement and inspection

For implementation of elapsed-time response, velocity-preserving retargeting, exact settling, and canonical progress, read [timing and interruption](references/timing-and-interruption.md). For browser 3D scheduling and control integration, use [Three.js engineering](../threejs-engineering/SKILL.md).

Design an alternative with stable positions, direct state changes, or restrained nonspatial feedback. Preserve selection, relationship, progress, and completion meaning. Slowing a long camera journey can prolong discomfort; reducing its travel or replacing it may be more appropriate.

Inspect playback at intended speed, repeated input, mid-transition reversal, release, cancellation, and settling. End-state images cannot reveal poor timing, stutter, velocity discontinuities, or attention competition. Fix a delayed response in the interaction contract, a wrong pivot in object structure, and meaningless movement in the motion decision before adjusting easing.

Keep each motion family's trigger, controlling variable, path or key poses, timing or response parameters, endpoint, interruption policy, and reduced-movement equivalent in the existing work. Implementation and revision need these decisions, not aesthetic adjectives alone.
