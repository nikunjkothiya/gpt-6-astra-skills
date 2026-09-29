# Scroll, camera, and asset choreography

Use after the storyboard exists. **FROM-KNOWLEDGE:** procedures and original recipes below. **ESTIMATED:** all proposed distances, durations, and budgets. Check installed versions before adopting APIs; reading documentation does not establish that a recipe has run in the user's application.

## One progress pipeline

The normal pipeline is scroll position → normalized target progress → one chosen smoothing policy → master story state → camera, objects, lights, DOM → render. Do not combine a strong smooth scroller, a long numeric scrub, and another per-object damping layer: accumulated lag makes control and reversal ambiguous. Define one story timeline; subordinate timelines consume its state instead of acquiring independent scroll owners.

Start with native scrolling and `scrub: 0.45` seconds for a cinematic narrative, or `scrub: true` for direct manipulation and deterministic comparisons. With numeric scrub, drive scene updates from the timeline's `onUpdate`, because the timeline can keep catching up after the scroll event stops. Numeric scrub describes catch-up behavior; timeline durations establish relative scroll allocation. Confirm this against the installed [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

Original integration sketch; `evaluateStory` implements the authored storyboard and `invalidate` requests a render from the existing scheduler:

```js
gsap.registerPlugin(ScrollTrigger);
const state = { p: 0 };
const context = gsap.context(() => {
  const story = gsap.timeline({
    defaults: { ease: 'none' },
    onUpdate() {
      evaluateStory(state.p);
      invalidate();
    },
    scrollTrigger: {
      trigger: section,
      pin: stage,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * 3)}`,
      scrub: 0.45,
      invalidateOnRefresh: true,
    },
  });
  story.fromTo(state, { p: 0 }, { p: 1, duration: 1, immediateRender: false }, 0);
}, section);
// On teardown: context.revert(); remove observers/listeners you own separately.
```

Keep the pinned stage separate from transformed children. Avoid a transformed ancestor that unexpectedly changes fixed positioning. Refresh after fonts, relevant images, layout changes, or asynchronous content settle; debounce layout-triggered refresh and do not call it every frame. Measure the canvas's own dimensions, refresh geometry-derived layout, then evaluate the current progress again. Choose whether a resize preserves normalized story progress or absolute document position; test and document the chosen policy. Never reset the story to its beginning during resize.

### Scroll systems recipe table

| Technique | Procedure and numeric recipe | Anti-pattern | Verification |
| --- | --- | --- | --- |
| Smooth scroll integration | If useful, use one installed Lenis instance with `autoRaf:false`, `lerp:.12`, `anchors:true`; hook its scroll event to `ScrollTrigger.update`, its `raf(time*1000)` to one GSAP ticker callback, and use direct scrub | Two RAF drivers, seconds passed to a milliseconds API, global ticker policy changed inside one component | Native keyboard/anchor/back navigation, modal scroll, rapid reverse and teardown; compare DOM/canvas position |
| Pinning | Begin with a 300 vh story span and one stage; retain pin spacing; place content and exit after it | Nested pins without a layout model or disabling spacing to conceal a jump | Enter/exit forward and reverse, page end, mobile browser chrome changes |
| Horizontal section | Calculate `distance=max(0, track.scrollWidth-viewport.clientWidth)`; animate x from 0 to `-distance`, linear progress, vertical travel `distance` or a stated multiple. At zero distance use normal flow without pinning; re-evaluate after resize | A fixed `-300vw` that ignores real item widths or an invisible last card | 320/768/1440 px, dynamic copy, first and final item's focusability |
| Snap | Only for meaningful discrete scenes; points `[0,.33,.67,1]`, delay .18 s, duration .2–.45 s; disable if it obstructs reading or reduced motion | Snap on every wheel tick or snap + CSS snap + independent scroller correction | Stop between points, interrupt snap by touch/keyboard, verify no forced return |
| Refresh/resize | Recompute travel and camera aspect from layout; coalesce resize work into RAF, refresh after font/image readiness; keep a recorded progress policy | Rebuilding every pointer move or measuring transformed values as canonical layout | Resize at p=.37 and .72; compare intended pose, focus and document location |

The Lenis API sketch follows its [official integration guidance](https://github.com/darkroomengineering/lenis). Keep ticker callbacks as named references for removal; unsubscribe and destroy the owned scroller on teardown. Its documented global lag-smoothing recommendation is a root application decision, not a local component side effect. A custom transformed scroller may need `scrollerProxy`; native scroll implementations do not require it automatically. Check the scroller's version-specific contract.

For a horizontal track controlled by a master animation, nested ScrollTriggers with `containerAnimation` have additional constraints: the container motion must remain linear, and pin/snap belongs to the outer controller. Prefer deriving subordinate states from normalized master progress when this avoids unnecessary trigger machinery.

## Camera as a directed rig

Block the shot with a neutral material. Establish the subject's bounds and all supported viewports before decorating. For a hero roughly 1 unit tall, a starting lens is vertical FOV 35–45 degrees and camera distance 2–3 units; derive a fit from the object's bounds instead of assuming those numbers frame any asset. Near/far planes should cover actual motion with limited depth range, for example .01/30 units for that scale.

Author position and target independently. A `CatmullRomCurve3` with centripetal parameterization can describe a dolly arc; `getPointAt(u)` maps by approximate arc length, whereas `getPoint(u)` maps its native parameter. Use a single eased progress to avoid abrupt speed changes. Confirm the [curve API](https://threejs.org/docs/pages/CatmullRomCurve3.html) and inspect for overshoot around every obstacle.

```js
// Create curves/vectors once, outside the frame callback.
const cameraPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.6, 3),
  new THREE.Vector3(0.8, 0.7, 2.6),
  new THREE.Vector3(1.4, 0.8, 2.2),
], false, 'centripetal');
const targetStart = new THREE.Vector3(0, 0.4, 0);
const targetEnd = new THREE.Vector3(0, 0.55, 0);
const target = new THREE.Vector3();
const localForward = new THREE.Vector3(0, 0, -1);
const rollQuaternion = new THREE.Quaternion();
function evaluateCamera(p) {
  const u = THREE.MathUtils.clamp(p, 0, 1);
  const e = 0.5 - 0.5 * Math.cos(Math.PI * u);
  cameraPath.getPointAt(e, camera.position);
  target.lerpVectors(targetStart, targetEnd, e);
  camera.lookAt(target);
  rollQuaternion.setFromAxisAngle(localForward, Math.sin(Math.PI * u) * 0.01745);
  camera.quaternion.multiply(rollQuaternion);
  camera.fov = THREE.MathUtils.lerp(40, 36, e);
  camera.updateProjectionMatrix();
}
```

This is a one-shot rig with approximately 1-degree roll at its midpoint. Repeated calls do not accumulate roll because `lookAt` establishes orientation first. This recipe treats path points and look-at targets as world coordinates: use a camera parent with an identity world transform, including zero translation, or convert path points to camera-parent space while retaining world-space look-at targets. Avoid a target coincident with camera position and avoid crossing a look-at pole; use authored quaternions with slerp when a stable roll path matters. Multi-turn rotation requires explicit turn counts, not shortest-path slerp.

| Move | Numeric recipe | Failure to avoid | Verify |
| --- | --- | --- | --- |
| Target blend | Shift target .1 subject-heights over .18 progress, camera held or coherently moving | Camera jerks when `lookAt` switches targets at a threshold | Sample target and angular velocity around both endpoints |
| Dolly/FOV | Dolly 3→2.4 units, FOV 40→36° over .25 progress using `sine.inOut` | Accidental scale explosion or hidden CTA | Projected subject bounds and text-safe area across the entire interval |
| Constant-size dolly zoom | Solve `d2=d1*tan(fov1/2)/tan(fov2/2)` for a planar subject at target depth | Assuming all 3D depths preserve size | Track the chosen reference plane and inspect perspective distortion |
| Scroll-mapped orbit | 30° yaw around a fixed target over .3 progress; vertical elevation 10→16° | Allowing orbit controls to write the same pose during the story | Drag takeover releases story ownership; rejoin from visible pose over .45 s |

Use a separate transform layer if pointer parallax is intentional: story owns rig position/orientation, pointer owns a bounded child offset, e.g. ±.02 units with response rate 12 s⁻¹. Include both layers in the framing envelope. Do not let controls call `update()` on the same camera while the story writes it.

## Asset preparation and reveal

Inspect axes, scale, pivots, normals, material slots, animation clips, and bounds on import. Remove unseen geometry; preserve required contact edges and silhouette. Choose Draco or Meshopt for supported geometry compression based on actual decode and transfer measurements. Configure KTX2 only with its matching transcoder and renderer support detection. Keep decoder assets locally versioned with the loader. A model using both compression families needs the appropriate decoders; blindly attaching every decoder adds cost without benefit. See [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html) and [KTX2Loader](https://threejs.org/docs/pages/KTX2Loader.html).

Starting budget for a single object: 100k visible triangles, 30 draw calls, 2 MB compressed model/texture transfer, largest color texture 2048² desktop or 1024² mobile. Log measured geometry, texture, draw-call, decode, first-render, and transfer costs separately. Inspect tangents/normal seams and mip behavior after compression; inspect transparent overlap and motion at production exposure.

For an authored clip controlled by scroll, one mixer owns its animated properties. Activate a single action with `LoopOnce` and clamp at the endpoint; evaluate absolute time instead of adding frame deltas:

```js
const mixer = new THREE.AnimationMixer(gltf.scene);
const clip = gltf.animations[0];
const action = mixer.clipAction(clip);
action.setLoop(THREE.LoopOnce, 1);
action.clampWhenFinished = true;
action.play();
mixer.timeScale = 1;
function scrubClip(p) {
  // Re-enable after endpoint clamping so reverse seeks evaluate again.
  action.enabled = true;
  action.paused = false;
  mixer.setTime(THREE.MathUtils.clamp(p, 0, 1) * clip.duration);
}
```

This recipe assumes one scrubbed clip, no competing crossfade, and a positive duration. An absent clip is a handled asset condition. `setTime` uses mixer timeScale, so keep it explicit. See [AnimationMixer](https://threejs.org/docs/pages/AnimationMixer.html). Verify p `[0,.5,1,.2,1,0]`, especially reverse after the endpoint; stop actions and uncache owned roots on teardown.

For a morph reveal, assign weights directly from canonical progress, e.g. `w=smoothstep(.35,.65,p)`, with legal range 0–1 and all other weights explicitly authored. Do not have the animation mixer and GSAP own the same morph array element. Verify endpoints, reverse, finite bounds, normals, and whether the asset supports the expected morph semantics.

Reveal a loaded product over 0.45 s after decoding and first usable render: crossfade a color-matched poster, then begin camera motion after a 0.15 s reading beat. Warm required shaders if the renderer/version provides a supported compilation path and measure it; do not hide indefinitely behind fake percentage loading. Report actual bytes when known, otherwise show a truthful indeterminate state. On failure, retain a useful poster and retry action. Test a delayed model, a missing texture, a navigation away during load, and reduced motion.
