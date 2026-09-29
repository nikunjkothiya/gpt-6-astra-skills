# Render and Playback Checks

Use this reference when fidelity depends on a supplied reference, a repair changes shared visual rules, or behavior cannot be judged from stills.

## Make the comparison meaningful

Record the artifact revision, route or scene, viewport in CSS pixels, device pixel ratio, zoom, browser, fonts, content, selected state, scroll position, and rendering quality. Keep conditions equal between comparison captures. Wait for fonts and required assets, and deliberately select the intended state; an arbitrary timeout can capture loading or a transition.

Confirm that an accessibility test actually changes the condition it claims to test. For example, increasing the root font size does not enlarge descendant text sized in fixed pixels. Compare a representative control's computed font size and its visible appearance before checking reflow. Record browser zoom, text-only enlargement, and a narrower viewport as distinct conditions; one does not automatically establish the others.

For a supplied still, identify its crop and likely viewport before treating it as a whole page. Separate fixed evidence from unknown conditions. If the reference uses an unavailable font, document the substitution and expect different wrapping. A reference with no device information supports composition analysis more confidently than exact pixel measurement.

Observe the actual images at intended size. Use a reduced view to judge mass and rhythm, then inspect visible joins at higher magnification. A capture operation succeeding does not mean someone inspected its result.

## Compare from shared causes to local symptoms

1. Align the reference and candidate to the same visible region without stretching either image. Identify anchors such as content bounds, heading baseline, subject silhouette, section boundary, and control location.
2. Compare layout, negative space, subject size, crop or camera, and type wrapping. These often explain many downstream differences at once.
3. Compare color roles, surface appearance, illumination, contrast, spacing, and edge treatment. Keep any intentional variation explicit.
4. Use an overlay or image difference to locate displaced edges. Return to the ordinary image to judge importance. Font antialiasing and rendering differences can create many changed pixels without a meaningful design failure.
5. Repair the responsible rule, then recapture the affected view and a nearby condition influenced by that rule.

Do not optimize a single aggregate pixel score at the expense of readable text, usable controls, or required behavior. For an exact reconstruction, establish positional and color tolerances before inspection; their appropriate size depends on matched fonts, renderer, and capture conditions. For an original design, evaluate its explicit relationships rather than similarity to an unrelated screenshot.

Example: if three text blocks wrap early and all following sections sit too low, inspect font loading, content width, weight, and tracking before adding per-section negative margins. If every object part appears too shallow, inspect projection and view angle before remodeling each part.

## Observe the full motion event

Capture or watch the trigger, onset, travel, overlap with other motion, and settlement. Check playback at normal speed for perceptual quality; slow playback helps locate a defect but can exaggerate harmless transitions. Sample frames to inspect spatial continuity and diagnose defects. They do not replace intended-speed playback; mark temporal appearance unobserved when playback is unavailable.

Exercise applicable cases:

| Event | Observable contract |
| --- | --- |
| Repeated input before settlement | The newest valid intent takes effect without a jump, duplicate commitment, or growing animation queue. |
| Reverse during travel | Position remains continuous; any change in velocity is intentional and fits the physical or graphic model. |
| Cancel or leave the view | The control and application state remain truthful; no orphan effect resumes unexpectedly. |
| Resize or orientation change | Framing and layout update without losing the selected subject or current task. |
| Resume after an inactive tab | Elapsed time is handled deliberately; no excessive simulation step or stale success state occurs. |
| Drag while scripted motion runs | Ownership changes explicitly; the object does not fight the pointer. |
| Repeated return to rest | Parts regain their canonical relationships; small transform errors do not accumulate. |
| Reduced motion | The task and state change remain clear with appropriate immediate or restrained feedback. |
| A loop boundary | Position, pose, opacity, and velocity follow the intended seam; a purposeful cut is distinguishable from a pop. |

## Assert relationships that a screenshot cannot prove

Use the project's real scene, state, or DOM interface to check consequential invariants. Select tolerances in relation to object scale and numerical precision; a tolerance in world units has no meaning without the unit definition.

- A committed selection agrees between the accessible control, application state, and displayed object.
- A connected child attachment, transformed to world coordinates, meets its parent attachment within the declared tolerance through valid articulation.
- Reassembly restores the canonical local transform after repeated cycles and interrupted sequences. Compare orientation without treating equivalent quaternion signs as different rotations.
- A joint stays within its declared range and moving parts preserve required clearance along the path, rather than only at endpoints.
- Mounting and leaving an experience repeatedly returns owned listeners and graphics resources to the expected baseline. Deliberate caches must have known ownership and bounded growth.

Check function and appearance together. Exact transforms do not prove believable material, and a convincing still does not prove valid attachments throughout movement.

## Diagnose performance without inventing measurements

Specify device, viewport, quality level, workload, warmup, and observation duration before reporting results. Separate initial load, steady interaction, shader or asset preparation, and repeated navigation. Record frame timing or profiler evidence when claiming a rate; describe visible hesitation as an observation when instrumentation is unavailable.

For a locally declared 60 Hz target, a 16.7 ms frame budget is a planning constraint, not proof that each frame meets it. Report the actual interval distribution and visible stalls under the tested workload. Compare quality changes under the same conditions and check that the defining silhouette, readability, and controls survive.
