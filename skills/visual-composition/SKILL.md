---
name: visual-composition
description: Design or improve interface and page layouts through hierarchy, grids, proportion, typography, spacing, imagery, color, and depth. Use when building screens, composing dense information, polishing visual systems, or correcting layouts that feel generic, busy, empty, or unbalanced.
---

# Visual Composition

Make relationships legible at the scale of the whole experience. Individually polished elements can still compete, imply false equivalence, or produce a monotonous whole.

## Assign roles before containers

Identify the primary subject, decision evidence, contextual information, action, status, and navigation. Place evidence near the decision it supports and status near its referent. Keep navigation stable enough to orient users while local priorities change.

Choose representation by the task:

| Task | Useful structure | Failure to avoid |
| --- | --- | --- |
| Compare repeated attributes | Aligned rows and consistent column meanings | Independent boxes that destroy cross-item alignment |
| Choose visually distinct objects | Image-led collection with comparable metadata | Crops and scales that imply unintended differences |
| Resolve exceptions | Prioritized queue with reason, age, and next action | Every item styled as equally urgent |
| Follow an argument | Reading flow with headings, evidence, and captions | Arbitrary containers interrupting continuity |
| Inspect relationships | Diagram or spatial view with explicit encodings | Decorative position, size, or color mistaken for data |
| Act on independent entities | Separate units with their own context and actions | Repeated framing around facts that belong together |

Progressive disclosure should hide optional detail, not information required for a decision. Dense work benefits from stable alignment and economical repetition; increasing whitespace everywhere can make comparison harder.

For analytical graphics, choose an encoding that matches the question: shared positional scales for comparison, ordered time for change, frequency and spread for distributions, and explicit connections for relationships. Keep definitions, units, time periods, comparison bases, and data age visible when they affect interpretation. Do not let smoothing, cropped scales, decorative area, or depth imply a different quantitative relationship. Distinguish measured values from estimates and show uncertainty when consequential.

## Establish visual weight and rhythm

Set alignment anchors from actual content. Let related headings, values, imagery, and controls share visible rails. An intentional offset should establish a new role or focal relationship; near-alignments that serve no purpose look accidental. Use tighter gaps within a relationship than between distinct relationships. Preserve a small coherent spacing vocabulary, with optical corrections for shapes whose perceived edges differ from their bounds.

Control emphasis through order and grouping first, then scale, weight, contrast, color, depth, and motion. Do not make all these channels compete at maximum strength. The highest local contrast can steal attention from a larger intended subject.

Balance perceived mass rather than bounding-box area alone. A dense dark label may outweigh a larger pale image. Use negative space to separate or direct attention; unexplained gaps are not evidence of sophistication. Vary rhythm when the content role changes, while keeping shared relationships recognizable.

Compose imagery with its surrounding text and actions. Choose whether the subject, environment, or detail carries the message, then preserve the relevant silhouette, gaze, or directional space in the crop. Repeated objects need deliberate apparent scale; unrelated crop sizes can imply differences in importance or physical size. Place overlays against the actual range of image tones, not a favorable sample.

Inspect the first view and the whole composition at reduced scale. The main subject and section sequence should remain legible. At normal size, inspect whether grouping and reading order tell the same story.

## Make typography carry information

Define only the roles the content needs: display, heading, reading, label, metadata, and numbers. Distinguish roles with a small set of deliberate size, weight, line-height, and spacing relationships. A new block does not automatically need a new type style.

Choose letterforms for language coverage, actual reading size, content, and identity. Judge body measure by comfortable line tracking in the relevant script; narrow measures cause constant returns, while wide measures make the next line hard to find. Tune line spacing with letterform height and density instead of applying one ratio everywhere.

Inspect long titles, accents, descenders, multiline labels, alternate scripts, and enlarged text. Shape a prominent title's measure and line endings around its phrase structure and neighboring subject; a forced break suited to one view is not a general wrapping rule. Keep essential amounts, errors, and choice labels readable in full. Optional abbreviation needs a discoverable way to recover its meaning.

Align comparable numbers by decimal position or right edge, with consistent baselines and clear units and time periods. Distinguish absent data from zero. Preserve stable widths for rapidly updating values where changing width would distract. Keep reading order coherent independently of visual type size.

## Give color, surfaces, and depth separate jobs

Assign roles for reading ground, grouped surface, overlay, text, accent, action, status, boundary, and focus. Shared values are acceptable when meanings stay distinct. Branding must not make an ordinary selection look like a warning or a confirmed outcome.

Use space or a boundary for separation, a surface shift for grouping, and elevation for actual overlap. A translucent layer needs a readable backing across changing content. Dark and light presentations require independently balanced contrast and surface separation; simple inversion rarely preserves their relationships.

Balance color by area as well as intensity. A small saturated accent and a full-screen field of the same color have different visual weight. Judge accents beside their actual surfaces, then reserve enough contrast for selection, feedback, and focus; decorative emphasis should not exhaust every available distinction.

Reserve expressive gradients, glow, and blur for a defined compositional purpose. Verify state meaning without color alone through [visual accessibility](../visual-accessibility/SKILL.md). Physical surface identity belongs to [material reasoning](../material-reasoning/SKILL.md).

## Diagnose the whole

If the result feels busy, identify which secondary boundary, label, color, or shadow competes with the subject and reduce that channel before increasing spacing. If it feels empty, enlarge or reposition meaningful content before adding ornaments. If repeated elements drift, repair their shared rail, type role, or spacing rule instead of applying unrelated local offsets. If it feels generic despite clear hierarchy, revisit [visual direction](../visual-direction/SKILL.md).

Carry forward the major regions and rails, focal-to-supporting scale relationships, type roles, spacing relationships, image crop intent, and color meanings. Identify which relationships repeat and which intentional exceptions carry emphasis so implementation does not flatten both into identical containers.

The composition is coherent when the primary task, reading order, comparison structure, and focal subject remain understandable with real content and relevant states. Use [responsive composition](../responsive-composition/SKILL.md) when available space changes those relationships.
