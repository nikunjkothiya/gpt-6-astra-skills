---
name: assembly-choreography
description: Design assembly, disassembly, teardown, exploded views, and reversible part inspection from attachment dependencies, release mechanisms, insertion axes, swept clearance, and canonical return states. Use when revealing construction, separating or reconnecting parts, sequencing mechanical movement, or repairing implausible scatter and reassembly. Use motion intelligence alone for general transitions without assembly logic.
---

# Assembly Choreography

Make movement reveal how an object is constructed. An exploded view is a staged explanation of relationships, not a radial scatter of disconnected parts.

## Establish what the sequence claims

Determine whether the task requires physically feasible assembly, an explanatory exploded diagram, or an intentionally stylized transformation. Preserve known mechanical relationships when explaining construction. Keep exaggerated spacing, impossible paths, or shape changes distinguishable from actual operation.

Begin with the semantic parts, local frames, pivots, constraints, and canonical rest poses from [object structure](../object-structure/SKILL.md). Where evidence for a joint or internal structure is missing, identify the assumption; do not invent a certified assembly procedure from exterior appearance.

## Build the dependency relation

For each moving part or subassembly, establish the mating component, connection type, release condition, removal axis, engagement distance, permitted rotation, obstructing geometry, and prerequisites. Record which support carries it after release and whether cables or flexible links remain connected. Grounded demonstrations should not leave a freed mass suspended without support; floating parts are an explanatory presentation choice.

Separate three questions: what holds the part, what blocks its path, and what must remain attached to it. They can have different answers. Group a subassembly when its internal relationships should remain intact during the current explanation.

Order removal by prerequisites. If removing one part requires a second part to move first, encode that constraint explicitly. Independent branches may overlap in time only when their paths and attention demands remain compatible.

A dependency cycle can indicate an incorrect assumption, a hidden release step, required deformation, or a subassembly that should move together. Resolve the cause before inventing an order. Transform parenting alone does not supply the assembly sequence.

## Respect the release mechanism

| Connection | Initial motion to explain |
| --- | --- |
| Threaded fastener | Rotation about its thread axis; axial travel follows thread lead per turn and handedness while engaged |
| Pin or straight insertion | Translation along the insertion axis until engagement clears |
| Cover or shell | Release restraints, then separate along an unobstructed opening direction |
| Hinged panel | Rotation about the hinge with clearance through its swept region |
| Sliding module | Follow its guides until retaining features and surrounding walls clear |
| Snap connection | Show latch release or compliant movement before withdrawal when mechanically relevant |
| Cable or flexible link | Preserve endpoints, slack, and bend limits or show a deliberate disconnection |

In a mechanically grounded sequence, do not translate a cover through a protruding shaft or remove a module through a closed wall. A collision-free start and end do not establish a clear path between them.

## Separate mechanical clearance from presentation spacing

Plan an initial path that disengages the connection and clears obstructions. Evaluate the swept volume of the moving part, including rotating extremities and attached children. Close fits may need more precise inspection than a broad envelope provides.

When showing removal, disengage parts before arranging them for explanation. A fastener may withdraw along its axis and then move to a readable position; that second leg should not be mistaken for its insertion direction.

Choose exploded distance from projected separation, label space, part size, and preserved correspondence. Too little spacing hides construction; too much makes the original attachment impossible to infer. Compose groups around the assembly's dominant axis and preserve recognizable silhouettes, consistent orientation, and readable negative space. Keep repeated fasteners grouped or ordered by their mating locations. Where projected paths cross, change staging or viewpoint instead of leaving attachment correspondence ambiguous.

## Choreograph knowledge and attention

Use rest, release, separation, exploded arrangement, inspection, return, reattachment, and rest as applicable phases. Each phase should reveal a new relationship. Remove phases that add waiting without information.

Keep an anchor such as the base, main housing, or assembly axis stable. Reveal the enclosure opening before the internal part becomes the next subject. Give small release events enough emphasis to explain why larger movement is now possible, without making every fastener a separate cinematic event.

Coordinate [camera composition](../camera-composition/SKILL.md) and [motion intelligence](../motion-intelligence/SKILL.md) around the active relationship. If object and camera motion obscure the removal direction, hold the camera or separate their events. A deliberate viewpoint change can replace excessive part travel.

## Plan return as an operation

Reassembly often reverses the dependency order, but it is not automatically a valid reversal of every removal action. Latches, guides, gravity-dependent placement, and temporary supports can require a distinct insertion path. Verify approach, alignment, engagement, and locking in the appropriate order.

Use canonical attachment states as exact endpoints. Maintain one control owner for each moving part and derive poses from stable references. Repeated expand and collapse operations must not accumulate position, scale, or orientation error.

For a reversible explanatory sequence, define each part's active progress interval, held poses outside that interval, and release and engagement boundaries. Evaluate the whole pose from stable progress and canonical frames so revisiting a progress value restores the same configuration. A history-dependent physical mechanism needs explicit engagement state or a separate return branch; forcing it into a reversible pose sequence can misrepresent its operation.

For free part inspection, define a return-to-sequence handoff before dependent parts move. A new command should retarget from the current pose along a valid path or finish the minimum release needed for the next operation. A direct jump may establish a valid destination immediately; animating that jump still requires clearance along the connecting path.

## Acceptance and repair

Inspect the assembled view, release moments, path extrema, exploded view, inspection handoffs, and full return in motion. Confirm clear connections, readable correspondences, preserved linked parts, unobstructed paths, and exact endpoint relationships.

If parts appear to burst outward, restore insertion axes and dependency phases. If the view becomes a cloud of fragments, preserve subassemblies and reduce simultaneous events. If reassembly nearly fits, repair transform integrity. If users cannot infer the construction, improve the active relationship's framing and sequence before adding labels or more motion.

Keep the prerequisite order and each moving group's release condition, path frame, required clearance, progress interval or event boundary, exploded pose, and engagement endpoint in the existing sequence specification. Distinguish physical facts, explanatory spacing, and inferred mechanisms for subsequent motion and camera work.
