---
name: interaction-design
description: Design controls, navigation, forms, dialogs, selection, loading, feedback, drag interactions, and micro-interactions. Use when building interactive visual experiences or fixing unclear affordances, misleading states, layout jumps, lost context, and interrupted actions; coordinate expressive motion without delaying the task.
---

# Interaction Design

Define what the user changes, what acknowledges input, what establishes the result, and what remains stable. Visual feedback must describe the actual state of the task.

## Establish the action contract

For each consequential interaction, define the trigger, affected scope, immediate response, pending state, confirmed outcome, failure recovery, stable anchor, and action that replaces or cancels it. Omit what does not apply and settle behavior before choosing the visual transition. A response acknowledges input; an animated highlight cannot prove a value was saved.

Separate durable task state from temporary hover, press, drag, and animation progress. Selection, identity, eligibility, and confirmed outcomes must agree across lists, details, spatial views, and alternative presentations. A late result must not replace a newer selection or reopen a dismissed view.

Specify only applicable states. Distinguish pressed, selected, current location, unavailable, pending, success, partial success, failure, empty account, and no matching results. Each carries a different meaning; one generic spinner or blank panel cannot express them all.

If a reversible change appears before confirmation, retain enough prior state to recover and show unresolved status where it matters. On failure, reconcile the visible result with the actual outcome and explain what remains changed. Do not replay an obsolete confirmation after the user has reversed or superseded the action.

## Make controls discoverable

Use labels that predict the outcome. Place actions near the affected object and distinguish navigation from changes to data. Show the current scope of search, filters, sorting, pagination, and bulk selection. A count should make clear whether it describes visible items or all matching items.

Keep interactive areas stable and separated. A visual press effect may compress the surface while its activation region remains fixed. Hover can reinforce an affordance, but essential actions need visible and non-hover paths. If a control is unavailable, explain the reason or how to become eligible when that affects the next decision.

Make the entire intended target behave consistently. If a row opens detail while an embedded action modifies the object, separate their activation and feedback so one gesture cannot accidentally perform both. State styling should distinguish a current choice from a temporary hover even when both occur together.

Preserve familiar activation behavior even when the visual treatment is distinctive. Use [visual accessibility](../visual-accessibility/SKILL.md) for equivalent input, focus, names, and nonvisual state communication.

## Design micro-interactions by consequence

| Interaction | Immediate response | Stable outcome or recovery |
| --- | --- | --- |
| Hover or focus | Emphasize the same actionable region | No layout jump; focus remains distinguishable from hover |
| Press or activation | Acknowledge contact without moving the target away | Release or cancellation restores the correct current state |
| Selection or switching | Show the selected identity immediately | All dependent content resolves to that identity; obsolete work cannot overwrite it |
| Opening or closing | Indicate the destination or dismissed layer | Preserve context and restore focus appropriately |
| Loading | Retain action context and show pending status | Success, failure, or partial completion appears when known |
| Progress | Show actual completed work when measurable | Unknown totals remain indeterminate; changed totals are explained |
| Confirmation | Associate success with the affected object and action | The resulting state remains inspectable after feedback fades |
| Rejection | Identify the unmet condition near the action | Preserve recoverable input and offer the relevant correction |
| Form correction | Show requirements before commitment and actionable errors when meaningful | Preserve values, associate each error with its field, and clear errors when resolved |
| Drag or reorder | Show the dragged object and valid destination | Commit once on valid release; cancellation restores a defined state |
| Object inspection | Mark the inspected part and reveal related detail | Return restores useful context without losing task selection |

Secondary animation may support these responses but must not delay them. Use [motion intelligence](../motion-intelligence/SKILL.md) only for the temporal behavior that improves comprehension.

For incomplete input, distinguish a requirement the user has not yet reached from an invalid completed value. Avoid presenting a fresh field as failed before meaningful input; after submission, expose unresolved requirements and guide correction without repeatedly interrupting typing.

## Preserve anchors through change

Decide which element moves, which remains fixed, and which reveals new information. Keep a recognizable anchor such as the selected row, page title, object, destination marker, or primary control. Avoid moving the subject, surrounding content, controls, and viewpoint simultaneously unless their relationship remains obvious.

Reserve useful space for arriving content so pending, success, and error states do not displace the active control. Do not reserve so much empty area that context disappears. If a panel must reframe a subject, coordinate the two around one clear event.

Opening a blocking layer should establish orientation and a usable focus path. Closing should return to its trigger or a sensible surviving location. Background updates should preserve focus and explain significant changes without announcing every visual frame.

## Handle interruption and recovery

Determine the outcome of repeated activation, a newer selection while work is pending, cancellation during a transition, navigation away, and resumption after interruption. Replace obsolete intent instead of queuing stale presentations. Functional completion cannot depend solely on decorative motion reaching its endpoint.

For reversible local changes, make undo useful. For consequential changes, make actual effects clear within the established commitment flow; do not add habitual confirmation to every action. Retain inputs after recoverable failure and distinguish what remains saved from what must be retried.

If users cannot tell whether an action registered, strengthen acknowledgement at its target. If they repeat a pending action accidentally, keep the in-progress state visible and define what repeated activation does. If success vanishes with a transient message, expose the durable result on the affected object. If a panel change loses orientation, restore the selected identity, stable anchor, or return path before adding a transition.
