# Timing, retargeting, and interruption

Read when implementing authored progress, settling, camera movement, direct manipulation, or reversal. Choose the motion's purpose and control owner before adapting these patterns. Values below illustrate parameter meaning; tune them using the product's actual distances, viewport, input rate, and playback.

## Choose a state model before an easing function

| Model | State to preserve | Appropriate use |
| --- | --- | --- |
| Authored duration | Current visible pose, start time, target, duration | A transition with a designed arrival time |
| Spring response | Position, velocity, target, response parameters | Repeated retargeting with continuity |
| Direct progress | Canonical frames and normalized input progress | Scrubbing, reversible assembly, scroll-linked explanation |
| Fixed-step simulation | Initial state, current state, integration accumulator, inputs | Stateful physical interaction |

For a duration tween, retarget from its sampled current pose. Restarting an ease with zero velocity preserves position but may visibly break velocity; choose this intentionally or use a response that preserves velocity. Quaternions describe orientation, while explicit angles and turn counts describe winding. Do not use shortest-path orientation interpolation for several screw turns.

For `lerp(current, target, alpha)` smoothing, a fixed alpha per displayed frame changes speed across frame rates. A time-aware coefficient is `alpha = 1 - exp(-lambda * dt)` for positive response rate `lambda` and elapsed seconds `dt`. Its half-life is `ln(2) / lambda`. Direct dragging generally should track the input without this added lag.

## A continuous critically damped response

This dependency-free JavaScript module advances a scalar response analytically for a constant target during a step. It preserves position and velocity when the caller changes target. `omega` is the response rate in inverse seconds, not a duration. This is useful for unconstrained presentation values; it is not a collision solver or a guarantee against overshoot under arbitrary inherited velocity.

```js
export function stepCritical(state, target, dt, omega) {
  if (![state.x, state.v, target, dt, omega].every(Number.isFinite) || dt < 0 || omega <= 0) {
    throw new RangeError('Finite state, nonnegative dt, and positive omega required');
  }
  const displacement = state.x - target;
  const coefficient = state.v + omega * displacement;
  const decay = Math.exp(-omega * dt);
  return {
    x: target + (displacement + coefficient * dt) * decay,
    v: (state.v - omega * coefficient * dt) * decay,
  };
}

export function settleAtTarget(state, target, positionTolerance, velocityTolerance) {
  if (![state.x, state.v, target, positionTolerance, velocityTolerance].every(Number.isFinite)
      || positionTolerance < 0 || velocityTolerance < 0) {
    throw new RangeError('Finite state and nonnegative tolerances required');
  }
  const done = Math.abs(state.x - target) <= positionTolerance
    && Math.abs(state.v) <= velocityTolerance;
  return done ? { x: target, v: 0, done: true } : { ...state, done: false };
}
```

For example, a small unconstrained inspector offset may start with `omega = 18`, then be tuned by observing arrival and retargeting. Set position tolerance from the smallest visible movement at the intended scale and velocity tolerance in units per second. Do not use that rate or tolerance as a universal preset.

An input event updates the target immediately without resetting `x` and `v`; the next frame advances toward it. A direct drag can acquire ownership and set position to the constrained pointer value; estimate release velocity from recent time-stamped samples if inertia has a purpose. Clamp or resolve hard limits with an explicit boundary policy. Reduced motion can assign the valid target immediately, zero velocity, and render once.

## Evaluate progress from stable references

For a sequence phase `[a, b]`, use `clamp((progress-a)/(b-a), 0, 1)` with `b > a`. Easing transforms that phase progress before applying a canonical pose. Evaluate held poses too; skipping an inactive part can leave a stale transform after an abrupt jump. Reversing or revisiting an authored progress value should reproduce the same state.

Use an explicit event model for irreversible effects. A scrubbed animation crossing a threshold should not repeatedly submit a form or mutate a durable record. Selection and completion belong to application state. A mechanically history-dependent latch or simulation needs its own state and valid return operation rather than a pretend reversible timeline.

## Decide what a pause means

Presentation can freeze while hidden and resume from its visible state. An elapsed-time story may instead jump to its correct absolute progress. Simulation may need bounded fixed steps, catch-up limits, or authoritative reconciliation. Specify the policy and reset the timing origin on the appropriate handoff; a single huge delta is rarely a useful default.

For fixed steps, cap both catch-up work and any interpolation remainder deliberately. Report whether time was discarded. Do not silently claim deterministic playback if step sizes, inputs, or initial conditions differ. A numerical clamp is a stability policy, not proof of accurate physical time.

## Test what a still image misses

Observe initial response, arrival, reversal halfway through movement, rapid alternating commands, a cancel, reduced motion, and return from a long hidden interval. Compare equal elapsed time at different frame partitions for analytic responses. Verify a zero-time retarget does not move the subject, settling assigns the exact endpoint, and no obsolete destination is queued.

For object motion, combine numeric checks with inspection of silhouette, path clearance, and attachments. For camera movement, inspect both object readability and user orientation. For interface motion, keep focus and action availability coherent throughout the transition.
