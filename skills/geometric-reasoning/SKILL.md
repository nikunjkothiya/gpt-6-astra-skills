---
name: geometric-reasoning
description: Construct or repair dimensional objects and procedural forms through silhouette, proportion, negative space, thickness, curvature, and mating relationships. Use for product geometry, three-dimensional assets, mechanical visualization, parameterized forms, or objects that look distorted, hollow, poorly joined, or unrecognizable. Use visual reconstruction as well when supplied imagery defines the shape.
---

# Geometric Reasoning

Determine relationships before choosing shapes. Construct the form needed by the permitted views, motion, and inspection distance. Fine detail cannot compensate for an incorrect silhouette or implausible structure.

## Establish dimensional intent

Identify the object, its function, required views, moving parts, and whether dimensions are measured, inferred, or intentionally stylized. Choose consistent units, an orientation convention, and recognizable dimensional anchors. Separate fixed dimensions from derived proportions and adjustable presentation choices. A known diameter or attachment spacing can constrain the rest; a single perspective image cannot uniquely establish hidden depth.

Separate visual plausibility from verified engineering fit. Where construction is inferred, keep the assumption explicit and avoid presenting invented internals as measured fact. Use [visual reconstruction](../visual-reconstruction/SKILL.md) when supplied imagery is the dimensional evidence.

## Decompose by function and construction

Map the primary mass, secondary masses, supports, shells, panels, structural members, connectors, fasteners, cavities, openings, and repeated modules. Classify each part as structural, functional, decorative, or moving; a part may have more than one role.

For each meaningful part, identify its dimensional envelope, neighboring parts, contact or clearance relationship, material boundary, and contribution to the silhouette. Distinguish physical parts from merely visible surface regions. Nearby parts need not share movement; use [object structure](../object-structure/SKILL.md) to define parents, local frames, and pivots.

Reason about negative geometry with the same care as solid mass. An opening has depth, rim thickness, an interior boundary, and something visible behind it. A painted dark patch cannot substitute for a cavity when parallax or inspection reveals the difference.

## Pass one: silhouette and proportion

Block out overall width, height, depth, dominant axes, mass distribution, and major voids. Read the form as a flat silhouette and as simple light and dark masses before adding surface detail. Distinguish the primary gesture from supporting shapes; preserve characteristic bends, taper, spacing, and deliberate asymmetry. Compare front, side, and intended presentation views where available. A flattering view can conceal incorrect depth or alignment.

Use ratios between major features to diagnose mismatch: shell thickness relative to span, support width relative to load-bearing mass, joint spacing relative to articulation, or opening size relative to the enclosing body. Resolve whether a mismatch comes from geometry or camera perspective before deforming the object to compensate.

Apply symmetry only to relationships that are actually symmetric. Repeated modules should share an invariant profile and attachment logic while permitting functional variation. Keep supporting forms from creating accidental tangencies or closing identity-defining gaps in the required views; change the presentation pose before distorting an established dimension.

Do not proceed to detailed surface work until the silhouette, primary dimensional relationships, and recognizable identity read at delivery size.

## Pass two: structure and construction

Choose construction from the shape's governing relationship:

| Form | Governing decision |
| --- | --- |
| Constant cross-section | Define the profile and direction or path along which it continues |
| Rotational form | Define the axis and radial profile; inspect the poles and closure |
| Shell | Define outer form, wall thickness, inner form, rim, and openings |
| Curved transition | Decide where position, tangent direction, and curvature must remain continuous |
| Repeated or radial system | Define module, spacing or angular interval, orientation, and seam closure |
| Flexible part | Allocate shape freedom where bending occurs and preserve required contact |
| Connector | Match mating faces, axes, insertion depth, and meaningful clearance |

Define joins as relationships between mating surfaces or frames, not independent coordinates guessed for each part. Derive shared diameters, spacing, and attachment positions from the same dimensional source. Distinguish intended contact, permitted overlap, and required clearance; a visually plausible gap is not evidence of a manufacturable fit.

Thickness follows the local surface relationship; scaling an entire object inward may produce uneven walls, especially around corners and narrow features. Curved offsets can intersect themselves where the thickness exceeds the available bend radius. Resolve those regions deliberately rather than hiding them inside the shell.

Use visible joints, overlaps, and seams to explain how parts connect. Intentional intersections are valid where construction requires them. Accidental coplanar surfaces, floating supports, impossible joins, and parts occupying the same space undermine credibility.

For moving objects, inspect the full range of articulation before detailing. A correct rest pose does not establish clearance through motion. Use [assembly choreography](../assembly-choreography/SKILL.md) when removal, insertion, or exploded presentation is required.

## Pass three: surface and detail

Add bevels and edge treatments according to physical scale, material, and projected size. A bevel should explain an edge through silhouette or highlight response; making every edge equally soft erases construction differences.

Distinguish positional continuity from tangent and curvature continuity. Two surfaces may touch yet create an unintended crease; tangent agreement may still produce a visible change in curvature. Inspect grazing highlights across intended smooth joins. Preserve deliberate hard edges and part boundaries.

Use geometric relief where it changes silhouette, contact, occlusion, shadow, or close inspection. Surface variation can represent finer detail that remains inside the silhouette. Do not add invisible complexity solely because the surface appears simple.

Where the representation has explicit surface topology, inspect unintended holes, duplicate surfaces, zero-area regions, self-intersections, reversed surfaces, and unwanted shading breaks. Require closed solids when volume, fabrication, or physical simulation needs them; intentional open surfaces are valid. Choose connectivity for the required deformation and shading rather than a universal face shape.

Check surface-pattern scale, distortion, seam placement, and orientation. A correct material with stretched grain or inconsistent weave still communicates incorrect construction. Mirrored geometry may need corrected orientation and directional surface treatment.

## Parameterized and repeated form

Expose parameters that describe the object: dimensions, count, spacing, curvature, thickness, and articulation. Define valid combinations and which quantity yields when constraints conflict. More modules may require a larger circumference or narrower module; a smaller enclosure must not silently produce negative interior space. Preserve explicit user dimensions and resolve dependent values instead of silently stretching the entire object.

Handle zero-length paths, coincident control points, closing seams, end caps, and count limits deliberately. Maintain stable part identity, anchors, and pivots when dimensions change. Regeneration must preserve dependent selection and motion relationships or explicitly remap them.

## Preserve form across representations

For procedural construction, choose a representation that expresses the governing shape: an extruded profile for constant sections, a lathed profile for rotational forms, a curve for a cable, repeated shared geometry for identical modules, or an authored asset for complex surfaces. A primitive blockout can establish mass and proportion; refine or replace it when the required silhouette, openings, or close view exceeds what it can represent. Use [Three.js engineering](../threejs-engineering/SKILL.md) when implementing those choices in a browser scene.

Keep construction parameters, semantic hierarchy, and editable source when continued editing is part of the deliverable. Derive simplified presentation geometry without silently discarding the relationships needed for future changes.

When transferring or simplifying a representation, compare a known dimension, axis orientation, part identity, surface orientation, pattern scale, attachment frames, and required articulation. Apply coordinate or scale conversion deliberately once. A structurally valid transferred object can still lose material response, motion, or appearance; inspect it in the intended presentation before claiming parity.

## Diagnose in order

An unrecognizable object needs silhouette or proportion repair. A recognizable but implausible object needs structural and attachment repair. A believable structure with unstable highlights needs surface continuity, orientation, or edge repair. Fix the highest failing level before adding another layer of detail.

Keep resolved dimensions and ratios, part identities, fixed anchors, mating relationships, valid parameter limits, and inferred geometry with the object or existing specification. Articulation, surfacing, and revision should build on these relationships without guessing the form again.
