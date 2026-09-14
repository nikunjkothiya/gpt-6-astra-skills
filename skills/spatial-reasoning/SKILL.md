---
name: spatial-reasoning
description: Design and refine 3D scenes, spatial interfaces, product explorers, and interactive environments through scale, depth, occlusion, landmarks, and interaction zones. Use when users must understand, inspect, compare, navigate, or manipulate spatial relationships.
---

# Spatial Reasoning

Use space to express relationships. The presence of a spatial representation does not require all information or actions to live inside it.

## Decide what space contributes

Identify whether users inspect form, compare arrangement, navigate, configure, discover, learn construction, or play. Compare the information gained with a flat diagram, still image, sequence, or aligned collection. A fixed viewpoint and fixed sequence may not need free spatial manipulation.

An explicitly immersive brief can justify atmosphere and exploration. It still needs an understandable entry, meaningful landmarks, legible feedback, and a way to return. Preserve the smallest complete task when optional spatial presentation is unavailable.

## Establish a coherent world

Choose a scale, units or declared relative scale, origin, up and forward directions, and orientation convention. Define which relationships are measured, comparative, or stylized. If object size encodes rank or quantity, keep that encoding consistent and explicit; decorative variation must not imply false data.

Treat known dimensions and observed relationships as constraints; label inferred dimensions as assumptions where they affect interpretation. A perspective reference cannot establish every hidden distance. Preserve relational accuracy without presenting an attractive reconstruction as a measured model.

Place the primary subject first, then related subjects, context, and environment. Define foreground, middle ground, and background by their communicative roles rather than filling every depth layer. Empty space may provide inspection clearance, motion room, or separation.

Use shared axes, contact planes, repeated spacing, and landmarks to make orientation recoverable. Avoid accidental near-tangencies that merge independent objects or tiny gaps that look like rendering errors. A floor or support should establish believable contact where the scene implies gravity.

Establish one dominant spatial relationship: enclosure, alignment, suspension, radial arrangement, stacking, or a deliberate alternative. Let secondary placement reinforce or meaningfully interrupt it. Concentrate density around the important relationship and use quieter intervals to make its shape legible; uniformly distributing objects often makes a rich scene feel arbitrary.

Use [object structure](../object-structure/SKILL.md) for articulated hierarchies and [geometric reasoning](../geometric-reasoning/SKILL.md) for the form itself.

## Compose projected and world relationships together

World-space separation does not guarantee visible separation. Across permitted viewpoints, objects can overlap, reverse apparent order, or collapse along the viewing axis. Inspect the primary relationships in projection before adding environmental detail.

Reserve usable regions for controls, navigation, captions, and detail. An available full scene area is not the same as an unobstructed subject area. Coordinate [camera composition](../camera-composition/SKILL.md) with actual overlays, aspect ratio, and selected state.

Use occlusion to communicate depth where appropriate, but do not hide information required for a comparison or action. If transparency is needed to reveal internals, assess whether a cutaway, separated view, or selected-part isolation communicates the relationship more clearly.

Keep the depth cues mutually intelligible. Size reduction, overlap, perspective, contrast, and parallax should support the intended ordering unless a deliberate illusion is the subject. For metric comparison, align relevant depths or provide an explicit scale reference so a nearer object does not appear to encode a larger value. Do not displace a selected object merely to make it visible when that displacement would imply a false attachment or location; use a clearly connected detail view instead.

## Integrate labels and controls

Anchor a label to a semantic feature such as a joint, selected part, or attachment point. Convert its location through consistent frames after the relevant object and view updates. Projection alone does not establish visibility: consider behind-view positions, clipping, obstruction, label collisions, and distance.

Prioritize selected and task-critical labels. Suppress or disclose secondary labels before shrinking all text. If a label becomes unstable during travel, preserve a stable detail region or simplify its tracking. Do not move every hidden label to the border without a meaningful directional convention.

Use distinct entry and exit thresholds for visibility or placement decisions so tiny viewpoint changes do not cause repeated swapping. Keep leader endpoints attached to the feature when label placement changes. Preserve the selected annotation in a stable detail region when its in-scene position becomes unusable.

Keep identity and state consistent across spatial and nonspatial presentations. Selecting a part through either path should reveal the same part, options, and status. The user must not need to understand the presentation mechanism to complete the task.

## Define interaction zones and ownership

Specify what region supports selection, drag, orbit, travel, or ordinary content navigation. Decorative areas should not consume unrelated input. Distinguish selection from a drag or navigation gesture and provide cancellation.

Transfer control between scripted viewpoint changes and direct manipulation deliberately. Keep orientation cues and reset or return available. If free movement creates dead ends, unreadable views, or misleading relationships, bound it around meaningful exploration instead of exposing unrestricted travel by default.

For spatial play, make the playable action, relevant obstacles, outcome, and restart understandable. Visual richness should support the reading of the playfield rather than conceal it.

## Adapt and diagnose

When space contracts, preserve the primary subject and its required relations. Reduce secondary objects, relocate controls, change viewpoint, or switch to a focused detail composition before uniformly shrinking the world. Use [responsive composition](../responsive-composition/SKILL.md) for these changes and [visual performance](../visual-performance/SKILL.md) for capability constraints.

If the scene feels confusing, identify whether scale, occlusion, viewpoint, labels, or competing interaction zones caused the loss of understanding. Repair the responsible relationship. More depth effects will not explain an unclear selection, and more labels will not fix a viewpoint that hides the important connection.

Carry forward the world convention, known versus inferred scale, dominant relationship, required visible connections, and permitted navigation range. State any view-dependent exception that the camera or interaction work must preserve; keep this handoff in the existing task context.
