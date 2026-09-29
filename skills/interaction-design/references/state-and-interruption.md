# Implementing State, Interruption, and Recovery

Use this reference when the next input can arrive before the current interaction finishes. Define task state first, then make animation and feedback derive from it. The examples illustrate ownership and races; integrate them with the host framework's lifecycle and rendering model.

## Make the contract observable

For a product-part inspector, the compact contract could be:

| Event | Authoritative state | Visible response | Interruption rule |
| --- | --- | --- | --- |
| Select part A | `selectedId = A` | A is marked; its name and pending details appear | A newer selection supersedes A's detail request |
| A details arrive | A remains selected and the request is current | Display A's verified details | Ignore if identity or request generation changed |
| Select part B during loading | `selectedId = B` | Highlight B immediately; remove or explicitly label old details | Abort obsolete work where possible; invalidate it regardless |
| Detail request fails | Selection remains unchanged; status becomes error | Identify the affected part and offer retry | Preserve recoverable configuration and input |
| Close inspector | Inspector is closed | Remove its task region and restore suitable focus | Late data cannot reopen it |
| Resize while inspecting | Identity and configuration stay unchanged | Recompose panel and camera | Replace old layout targets from current state |

Keep loaded data, pending state, and errors associated with identity. Never show B's selected label over unmarked A details. Cached data can remain visible when correctly labeled and its freshness is understood.

## Latest selection wins even if cancellation is ignored

An abort signal reduces obsolete work, but a request or cache layer might already have finished or might not observe that signal. A generation guard also prevents stale commits. The following plain JavaScript example separates data failure from rendering failure and exposes a cleanup boundary:

```js
function createSelectionLoader({ fetchItem, render }) {
  let generation = 0;
  let controller = null;
  let disposed = false;
  let state = { selectedId: null, status: "idle", item: null, error: null };

  function publish(next) {
    state = next;
    render(state); // Adapt to the host's immutable state update mechanism.
  }

  async function select(id) {
    if (disposed) return;
    const ticket = ++generation;
    controller?.abort();
    const request = new AbortController();
    controller = request;
    publish({ selectedId: id, status: "loading", item: null, error: null });

    let item;
    try {
      item = await fetchItem(id, { signal: request.signal });
    } catch (error) {
      if (disposed || ticket !== generation || request.signal.aborted) return;
      controller = null;
      publish({ selectedId: id, status: "error", item: null, error });
      return;
    }

    if (disposed || ticket !== generation || request.signal.aborted) return;
    controller = null;
    publish({ selectedId: id, status: "ready", item, error: null });
  }

  function close() {
    if (disposed) return;
    ++generation;
    controller?.abort();
    controller = null;
    publish({ selectedId: null, status: "idle", item: null, error: null });
  }

  function dispose() {
    disposed = true;
    ++generation;
    controller?.abort();
    controller = null;
  }

  return { select, close, dispose, getState: () => state };
}
```

`fetchItem` is a host adapter: validate HTTP failures and data shape there. `render` should show a usable message from the error, rather than exposing internal error content directly. Read the actual selected identity for retry. Dispose when this owner is removed; recreate the owner if the view is mounted again.

Cancellation applies to supported asynchronous operations; it is not a rollback of a committed server mutation. For a save or purchase, use the backend's actual mutation contract and reconcile confirmed effects. [MDN documents the operations an abort controller can cancel](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).

## Give a transition one owner

Separate a control's stationary hit region from its animated visual child. If CSS hover, a timeline, a spring, and a scene loop all write the same transform, select one owner or put independent transforms on nested elements with explicit roles.

For a short reversible visual response, a CSS transition from a class or state attribute can be sufficient. A scripted choreography needs an explicit interruption policy:

1. Read or evaluate the current presentation before removing the active effect.
2. Determine the new endpoint from current task state and current layout.
3. Replace the old animation from that current presentation.
4. Guard completion with the transition's identity.
5. Make the final underlying style or pose agree with the endpoint, then release the effect.

For Web Animations, cancellation removes the animation's effect; capture any needed presentation before canceling it. Handle cancellation rejection when awaiting `finished`, and only suppress the expected cancellation. See [cancellation semantics](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel) and [completion promises](https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished).

For example, closing a moving details panel should retarget from its current offset. It should not jump to the fully open position and replay a close. Opening it again must invalidate the prior close callback so that callback cannot hide the reopened panel. When removing a blocking panel, coordinate focus and background availability with the actual layer state; do not leave focus inside a hidden subtree.

Choose duration and easing through playback of the actual distance and purpose. Short acknowledgement, a camera reframe, and a multi-part assembly do not share one correct duration. Spring systems may also need velocity continuity when retargeted. Use [motion intelligence](../../motion-intelligence/SKILL.md) for temporal and physical behavior.

Functional state should settle when the real action does. A reduced-motion path can place the panel or object directly at its target while retaining selection, focus, and result announcements. Changing the preference during motion should also settle the current target coherently.

## Direct manipulation has cancellation states

For drag or object rotation, establish which input owns the gesture, the original pose or order, valid constraints, preview state, and the single event that commits. Consider a distance threshold when click and drag share a target, tuned for the product and input conditions.

Use pointer capture where movement should remain associated with the original control outside its bounds. Treat `pointercancel`, lost capture, and owner removal as defined recovery paths. Set `touch-action` deliberately on the interaction surface; preserve page scrolling where it remains part of the experience. [MDN's pointer-events documentation](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) describes capture and cancellation behavior.

Give essential manipulation an equivalent control: increment buttons for an angle, a range input for explosion progress, or move-up/down commands for ordering. Name the affected object and communicate its resulting value. Canvas picking and DOM controls should dispatch into the same task state.

## Verify the races that change the outcome

Use controllable deferred requests rather than hoping a fast network exposes an error. Check these observable outcomes:

- Request A, then B; resolve B first and A last. B remains selected with B's details.
- Request A, close the inspector, then resolve A. The inspector stays closed.
- Request A, remove the owner, then resolve or reject A. No state is published afterward.
- Fail the current request. Selection remains clear, retry is available, and recoverable input remains.
- Open, close, and reopen during movement. No stale completion hides the current view or steals focus.
- Cancel a drag outside its original target. Pose or order returns to the documented state, and no click is accidentally committed.
- Repeat the task with keyboard and reduced motion. Meaning and completion remain equivalent.

Automate state and cleanup invariants where they are fragile. Inspect motion through playback and interaction; a final screenshot cannot demonstrate continuity.
