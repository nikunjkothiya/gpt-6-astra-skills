---
name: responsive-composition
description: Adapt layouts, controls, and spatial views to available space, enlarged text, and input conditions. Use for responsive implementation or overflow, crowded controls, lost comparisons, and poor object framing.
---

# Responsive Composition

Preserve identity, task intent, and required information across conditions. The same relationships may need different placements, framing, or navigation when available space changes.

When implementing or validating adaptation, load [content-driven responsive verification](references/content-driven-responsive.md) for a container-based layout example, usable-region accounting, and a compact matrix that exposes intermediate failures.

## Identify invariants and freedoms

Keep the primary task, selected identity, content meaning, status, essential comparisons, and recovery available. Determine which visual relationships define identity: typography character, dominant subject, color roles, rhythm, or a recognizable grouping.

Allow column count, panel placement, content disclosure, image crop, viewpoint, motion distance, and secondary detail to change. Do not preserve identical coordinates at the expense of readability or useful subject scale.

Inspect actual constraints: usable width and height, text enlargement, language and reading direction, content length, overlays, input precision, and space reserved for system UI. Viewport shape does not reliably indicate input method or device capability.

## Locate composition failures

Find where labels collide, comparison loses alignment, line lengths become awkward, controls crowd, important content leaves the visible region, or the subject becomes too small. Choose transitions around those failures using established project conventions where they remain sound. Let a module respond to the space it actually receives; a wide overall view can still contain a narrow panel.

Inspect both sides of a composition transition and meaningful intermediate conditions. A wide and a narrow endpoint can both look acceptable while the intervening composition fails.

Use real or representative long content and relevant states while deciding fit. Short placeholder labels can hide the exact failure the layout must solve.

At generous widths, decide what should grow and what should stop growing. Preserve readable measures and useful comparison distances; assign surplus space to subject scale, context, or deliberate margins rather than stretching every gap and text region.

## Recompose by information role

| Element | Adaptation decision |
| --- | --- |
| Primary subject | Preserve recognizable scale and feature visibility; choose a new crop or view without cutting off the feature that carries meaning |
| Decision evidence | Keep essential facts near the action; disclose secondary context |
| Navigation | Preserve labels, current location, and a clear return while changing arrangement |
| Comparison | Retain shared attributes, units, and item identity; when local overflow is necessary, make the continuation discoverable and preserve useful row context |
| Reading | Adjust measure and hierarchy without reducing essential text to unreadable size |
| Controls | Preserve distinct activation regions and meaningful labels across input modes |
| Overlays | Fit available height, allow internal scrolling when needed, and keep dismissal, focused content, and the action needed to complete the task reachable |
| Persistent action | Keep its context while preventing it from covering errors, content, or focus |
| Motion | Reduce travel or simplify sequencing when the original movement no longer explains a relationship |

Do not convert every dense comparison into isolated cards. If users compare values across records, retaining a compact shared structure may be more useful. Do not conceal unintended overflow globally; identify the element and give its excess content a usable treatment.

Keep visual, reading, and focus order coherent. Moving controls visually without updating the navigational relationship can make the experience appear coherent while behaving unpredictably.

For each consequential layout change, retain the reason it was needed, revised arrangement, information that stays visible, and context that survives. Define transitions from actual content requirements rather than naming a device and assuming its dimensions.

## Adapt spatial views deliberately

Calculate the region that remains after controls and details. Reframe the subject around that region, considering both width and height. Change its apparent center, inspection angle, surrounding context, or presentation mode before uniformly shrinking the entire scene.

A short landscape view may need a different arrangement from a tall narrow view. A detail sheet may make a once-useful camera path impossible. Coordinate panel and camera decisions through [camera composition](../camera-composition/SKILL.md).

Keep selected identity, configuration, and inspection context through a layout change. If a transition is in progress, derive the new presentation from the current state and replace obsolete offsets or conflicting transitions.

## Respect input and capability independently

Make essential actions usable without hover, precision dragging, or one assumed grip. Keep enlarged text and the primary task compatible. Account for an on-screen input surface or other temporary reduction in available height when relevant.

Reduced movement is a user requirement, while lower visual quality is a capability adaptation. Apply them independently through [visual accessibility](../visual-accessibility/SKILL.md) and [visual performance](../visual-performance/SKILL.md). A large display can be slow, and a small display can support rich rendering.

## Acceptance and repair

If the result feels like a miniature wide view, give priority content and actions their own usable space before shrinking secondary regions. If it becomes an endless stack, restore meaningful grouping and disclose optional material without hiding decision evidence. If a comparison requires remembering values from distant regions, preserve shared labels and nearer comparisons. If controls or subjects disappear under overlays, repair usable-space accounting. If resizing changes the selected object or discards input, repair continuity of task state before polishing the rearrangement.
