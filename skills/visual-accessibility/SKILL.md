---
name: visual-accessibility
description: Design readable contrast, visible focus, input alternatives, text enlargement, and reduced-motion behavior for interfaces, diagrams, animation, and spatial experiences. Use whenever visual treatment affects access to a task or essential information, including new design and visual polish.
---

# Visual Accessibility

Make the intended task and information available without dependence on one sensory cue, input precision, or tolerance for movement. Accessibility changes belong in composition and behavior, not solely in an end-stage checklist.

## Establish the relevant access conditions

Identify required input methods, language and text variation, magnification, sensory alternatives, and motion preferences. If the task specifies formal conformance, establish its applicable criteria and exceptions from the relevant authoritative standard. Do not substitute generic visual heuristics for a conformance assessment.

Preserve the same meaningful task through alternative presentations. Equivalent access does not require identical appearance or an exact recreation of every decorative effect.

Identify the information or operation at risk before changing the aesthetic. Preserve expressive typography in suitable roles while making essential reading robust; retain atmospheric imagery while giving controls a reliably readable background. Correct the relationship causing the barrier while preserving useful visual identity.

## Make information perceptible

Judge contrast between actual adjacent foreground and background in all meaningful states. A token called muted or accessible proves nothing about rendered readability. Changing imagery, transparency, gradients, and overlays can produce weak local contrast even when the average palette appears strong.

Keep subordinate information readable. Express hierarchy through grouping, order, weight, and spacing as well as contrast. Do not use tiny text or near-invisible captions to create a refined appearance.

Preserve text enlargement, meaningful wrapping, and complete essential labels. Allow additional space or a different composition rather than clipping important text. For charts and diagrams, keep units, keys, relationships, and relevant values available in a usable alternative when the graphic is essential.

Communicate critical state through more than color, position, motion, or sound alone. Pair a selected treatment with a recognizable marker or state description. Distinguish unavailable data from zero and pending work from completion.

Consider combinations of states: a selected control can also be focused, pending, or unavailable. Keep each relevant meaning recognizable without one cue obscuring another. Inspect adjacent controls and the actual surrounding surface before increasing emphasis.

## Make interaction operable

Keep target regions distinct, stable, and large enough for the expected precision, with separation appropriate to adjacent actions. Visual glyph size and activation region need not be identical. Avoid moving an action away from the approaching pointer or finger.

Provide a route to essential outcomes without hover or precise dragging. Gestures need discoverability and alternatives where their operation is otherwise inaccessible. Keyboard and sequential navigation should follow a coherent task order and reach a clear exit from temporary modes.

An alternative must support the actual operation and its useful precision. Replacing object rotation with a reset button does not provide inspection of required sides; replacing free drag with unexplained coarse steps may prevent a required placement. Choose named views, direct values, discrete operations, or another control suited to the task.

Keep focus on a visible control in the active interaction layer, with a distinguishable indicator after reflow, content arrival, and text enlargement. A blocking overlay should establish focus within it and prevent interaction with covered background controls. Ordinary detail updates should preserve the user's place. Closing a layer should return focus to an appropriate surviving control or context.

Use persistent names and state descriptions that match visible meaning. Associate instructions and errors with the affected input. Communicate significant asynchronous outcomes without stealing focus or narrating continuous animation.

Use [interaction design](../interaction-design/SKILL.md) when the action or recovery contract is incomplete.

## Reduce motion while preserving meaning

Identify movement with large visual travel, parallax, rotation, abrupt acceleration, persistent oscillation, or competing directions. Replace unnecessary travel with stable states, direct view selection, annotated key views, or restrained nonspatial feedback.

Reducing speed alone can prolong exposure to uncomfortable movement. Reduce distance, intensity, frequency, and simultaneous motion according to the information being communicated. Avoid flashing effects as a visual device; do not treat a maximum tolerated rate as a design target.

Preserve confirmation, progress, selection, and spatial relationships when motion is reduced. Offer pause or stop for persistent optional movement. A changed preference during a transition should resolve to a coherent current state without leaving hidden content or a stuck overlay.

Apply motion preferences independently of device performance. [Motion intelligence](../motion-intelligence/SKILL.md) owns temporal continuity; [visual performance](../visual-performance/SKILL.md) owns capability adaptation.

## Provide spatial equivalents

Identify the information the spatial view contributes: part identity, relative position, connection, configuration, or order. Provide enough description, ordered views, diagrams, data, or direct controls to recover that information and complete the same task.

A generic poster or a list of names is insufficient if the task requires understanding how parts connect. Conversely, decorative atmosphere does not need a detailed nonvisual transcript. Preserve meaningful selection and status across representations.

Carry the alternative's information structure, control sequence, state feedback, and return behavior into the artifact. Pair each reduced-motion choice with the relationship it preserves; a description of an alternative does not make the task accessible.

## Inspect without overstating evidence

Observe the relevant task through alternative input, enlarged text, changed composition, reduced movement, and available assistive presentation. Inspect focus, state meaning, error recovery, and actual contrast. A visual review does not establish assistive behavior, and an automated result does not establish complete usability or conformance.

Use [visual QA](../visual-qa/SKILL.md) to distinguish observed strengths, specific defects, and unobserved conditions. Correct barriers to the primary task before decorative polish.
