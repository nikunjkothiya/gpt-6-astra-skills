---
name: visual-performance
description: Improve visual responsiveness and loading while preserving fidelity in heavy scenes, dense interfaces, animation, large imagery, and expensive effects. Use for stutter, delayed feedback, memory growth, or quality adaptation; avoid speculative simplification of already adequate work.
---

# Visual Performance

Allocate cost by perceptual and task value. Preserve the primary subject, meaningful relationships, legibility, state feedback, and control response before low-value detail.

## Establish the experience budget

Identify the expected delivery conditions, viewing size, interaction frequency, available capabilities, and acceptable response. Distinguish startup, direct manipulation, transitions, idle, and sustained use; each may have a different dominant cost.

Use observed behavior from a representative slice to set budgets. Universal object counts, image sizes, or geometry limits cannot account for material complexity, projected area, simultaneous motion, and delivery conditions. If measurements are unavailable, label estimates as assumptions and prioritize reversible reductions.

Define the smallest complete experience early. The subject, essential information, navigation, and primary action should become available before optional high-detail assets or atmosphere where the task permits it.

Name the perceptual features the budget must protect: the defining silhouette, reflection shape, selected-part separation, comparison alignment, or interaction response. Rank reductions by visible loss at the intended viewing conditions, not by the ease of deleting a feature. A signature effect may deserve more budget than many conventional details that contribute little.

## Find the expensive dimension

| Observation | Likely cost to investigate | Candidate reduction |
| --- | --- | --- |
| Cost grows with independent elements | Per-element evaluation, traversal, submission, or bookkeeping | Reuse shared structure and consolidate equivalent work |
| Cost grows sharply with output area | Per-pixel work, overlapping transparent coverage, broad effects | Reduce affected area, overlap, or secondary render resolution |
| Fine geometry costs more without visible gain | Evaluation and representation beyond projected importance | Simplify distant or small features while preserving silhouette |
| First interaction pauses | Deferred preparation, decoding, compilation, transfer, or initialization | Prepare only the likely critical work before interaction needs it |
| Memory grows during exploration | Retained resources, unbounded history or caches, repeated allocations | Bound ownership and lifetime; reuse or release unneeded resources |
| Hidden or unchanged views remain expensive | Unnecessary presentation updates | Suspend invisible visual work while preserving task time and meaningful simulation state |
| Stalls appear at content updates | Repeated structural recomputation or competing measurements and changes | Consolidate dependent updates and avoid recomputing unchanged structure |

These observations suggest causes to distinguish. Compare behavior after reducing the suspected work while preserving the same task and viewing conditions.

Separate delay before input acknowledgement from cost after input, irregular frame delivery, and slow final convergence. Reducing geometric detail may not improve a delay caused by preparing content. Defer secondary preparation without delaying the acknowledgement or misrepresenting completion.

## Reduce work without changing meaning

Prefer movement mechanisms that avoid unnecessary structural recomputation when the same visual result can be obtained without it. Recompute relationships when content or constraints change, not automatically for every frame of an unrelated effect.

Share repeated geometry, material definitions, and static calculations where their invariants permit it. Keep identity, selection, and required variation distinct even when representation is shared. Avoid rebuilding a static object merely to change its presentation pose.

Choose detail by projected importance, silhouette contribution, inspection distance, and task. An unseen internal component may still be needed for later assembly or correct shadows; reduce it according to actual use, not visibility in one frame alone.

Choose image and surface-detail resolution from delivery scale. Account for decoded size, intermediate surfaces, copies, and simultaneously resident assets; transfer size alone does not describe memory use.

Limit simultaneous animation when attention and update cost grow together. Reduce invisible or subordinate movement before reducing the clarity of the user's active manipulation.

For dense information, stage presentation or disclose detail without losing the user's selection, focus, comparison structure, or access to required content. A faster view that makes the task impossible is not an optimization.

## Design quality adaptation

Define which features survive every useful quality level: subject identity, silhouette, selected state, readable text, control affordance, and the relationships needed for the task. Reduce secondary geometry, fine surface variation, reflection updates, shadow detail, atmosphere, or broad effects according to their measured cost and visible contribution.

Avoid indiscriminate resolution reduction that blurs essential labels along with the scene. Keep presentation layers at the quality their information requires.

Change quality based on sustained evidence, using different thresholds for lowering and restoring quality so small fluctuations do not cause repeated switching. Preserve user choices and avoid repeatedly attempting a higher quality that stalls interaction. Reduced motion is independent of quality level; use [visual accessibility](../visual-accessibility/SKILL.md) for preference-driven changes.

Choose adaptation boundaries that preserve silhouette, landmarks, material identity, and label attachment. An abrupt change of reflection, contour, or apparent size can cost more perceptual continuity than the saved detail was worth. Where a transition cannot remain unobtrusive, make it at a stable task boundary or after explicit user choice.

When a rich representation is unavailable, preserve task identity and outcomes through an appropriate simpler view. Rebuilding the presentation must not reset a selected object, configuration, or recoverable input.

## Judge sustained behavior

Inspect response delay, uneven frame delivery, preparation stalls, and degradation over time rather than average smoothness alone. Include resume after inactivity and repeated entry or exploration when those conditions are part of the task. Do not infer hardware capability from viewport shape or claim real-device behavior from an unrelated environment.

Accept a reduction when it improves the relevant cost while preserving the perceptual and functional invariants. If the main subject loses identity or feedback becomes ambiguous, restore that value and reduce a less consequential cost.

Carry forward the observed bottleneck, protected features, chosen reduction, delivery conditions, and unmeasured assumptions in the current working specification. These decisions are specific to the experience, not a universal budget for other products.
