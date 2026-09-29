---
name: object-structure
description: Define part identity, transform hierarchy, coordinate frames, functional pivots, constraints, and canonical poses for articulated objects and assemblies. Use when parts inherit movement, rotate around the wrong point, detach, change parents, regenerate, drift across cycles, or must return precisely to an attachment. Pair with geometric reasoning when the physical form also needs construction.
---

# Object Structure

Represent how an object works, not merely which parts are close together. Keep semantic identity, transform inheritance, physical constraints, and assembly prerequisites distinct.

## Define the part contract

For each meaningful part, establish:

| Property | Required meaning |
| --- | --- |
| Identity and role | What the part is and what function it performs |
| Parent and children | Which motion it inherits and which parts follow it |
| Local frame | Origin, orientation, axis directions, and units |
| Rest transform | Canonical position, orientation, and scale relative to its parent |
| Pivot and attachment | Rotation center or axis, mating frame, and contact region |
| Degrees of freedom | Permitted translation, rotation, travel limits, or deformation |
| Dependencies | Connections, obstructions, linked movement, and configuration dependencies |
| Control ownership | Current driver and conditions for transfer, interruption, and cancellation |

Use [geometric reasoning](../geometric-reasoning/SKILL.md) for physical form. Use [assembly choreography](../assembly-choreography/SKILL.md) for release order and movement paths.

## Choose hierarchy by motion inheritance

A shade mounted on a hinged arm should inherit arm movement; its own hinge controls additional articulation. A stationary base and a nearby cable do not necessarily share the shade's parent. A group used for presentation need not redefine the object's physical construction.

Use a tree for transform inheritance where each part has one controlling parent. Describe cross-links and mechanical constraints separately. A closed linkage cannot be modeled correctly by assigning every physical connection as another parent; choose an independent driver and preserve the remaining constraints explicitly.

Keep assembly prerequisites in their own dependency relation. A cover may obstruct a module without being its transform parent. A screw may release a bracket without owning the bracket's motion.

## Make coordinate reasoning explicit

Distinguish object-local, parent-local, world, view, and projected display space whenever a relationship crosses them. Declare units, axis directions, and orientation convention at the object's boundary. An insertion direction belongs to the receiving part's frame; an annotation offset may belong to the display. Positions include an origin; directions do not. Do not mix quantities from incompatible frames.

Choose pivots from function: hinge axis, axle center, sliding guide, contact point, or intended presentation anchor. A shape's geometric center is not automatically its motion pivot. An off-center pivot needs the geometry offset from the pivot while preserving the intended rest placement.

Changing a parent changes local coordinates. To preserve the visible pose, compose the inverse new-parent world transform with the unchanged part world transform. The new parent must be invertible. If the resulting local transform contains shear, position, rotation, and scale alone may not reproduce it; preserve the full transform or revise the hierarchy. Define any intended snap into attachment explicitly.

Transform order affects the result. Nonuniform or mirrored scaling can alter orientation, shading, and inherited movement; rotation under a nonuniformly scaled ancestor can introduce shear. Keep rigid articulation in frames with positive uniform scale where possible. Do not flatten or reset transforms indiscriminately after authoring motion.

## Preserve canonical rest

Store or derive an immutable rest relationship for each supported configuration. Keep a part's attachment frame distinct from its presentation pose: an exploded or inspection offset must not redefine where it belongs. Define animated poses as a function of the rest state, current intent, and explicit progress or simulation state. Do not construct the next cycle by adding another offset to the previous cycle's endpoint.

At the end of an authored transition, assign its canonical endpoint. On interruption, preserve the current visible pose and appropriate velocity before selecting the next target. Reversal should follow a valid path from that state; restarting from the original rest pose causes a jump.

Keep one owner for each controlled degree of freedom at a time. A user drag, scripted transition, constraint, and idle animation must not independently compete for the same transform. Define handoff rules and restore a coherent owner after cancellation.

For physically simulated movement, reproducibility depends on initial conditions, inputs, and integration behavior. Elapsed time alone does not guarantee replay. Where exact reassembly is required, define a constraint or explicit control handoff that reaches the canonical attachment; a near-rest simulation pose is not exact.

## Configuration and regeneration

Keep persistent identity independent of creation order. If a dimension, part count, or attachment changes, recompute the affected rest frames, bounds, and travel constraints together. An animation authored for one hinge location cannot safely retain an obsolete pivot after geometry changes.

Preserve the requested configuration across presentation resets. Resetting the viewpoint or exploded spacing should not silently revert the user's selected product variant.

## Inspect transform integrity

When implementing canonical rest, functional pivots, or reversible tracks, read [canonical poses and transform implementation](references/canonical-poses.md). It provides frame composition, complete Three.js patterns, and numerical invariants. Use [Three.js engineering](../threejs-engineering/SKILL.md) for the surrounding scene and input lifecycle.

Observe parent movement, child articulation, reversal, cancellation, and repeated return to rest. Compare attachment positions, orientations, hierarchy, and scale against their canonical relationships using precision appropriate to the scene and task. Inspect the rendered joins as well as numeric values.

Drift suggests accumulated offsets or inconsistent rest definitions. Orbiting around an unintended point suggests a wrong pivot or frame. A detached child suggests broken inheritance or a handoff error. If the same authored state produces different poses depending on input order, inspect competing transform owners or unmodeled state; a physical mechanism may legitimately depend on its history. Repair the relationship responsible before retuning motion.

Keep the hierarchy and each active part's local frame, attachment, rest pose, allowed movement, control owner, and configuration dependencies with the object. Distinguish canonical relationships from allowed tolerances so motion and assembly can position parts without inferring structure from the visible pose.
