# Compositing, transparency and blending

Use when DOM, imagery, canvas or live 3D must share a coherent visual surface. Establish the layer order, alpha convention, color pipeline and intended background before tuning effects. These are implementation decisions; verify the final composition in the target browser.

## Choose the operation by its purpose

| Intended result | Mechanism | Check before committing |
| --- | --- | --- |
| Place a cutout over a background | Source-over alpha compositing | Soft edges survive both light and dark backgrounds |
| Tint or combine decorative imagery | CSS background blending, isolated element blending, or a shader | The intended backdrop participates; text and controls keep stable contrast |
| Replace one photograph with another | Opaque base plus one incoming layer, or shader interpolation | Matching crop, ready assets, correct endpoints, no background flash |
| Show a glass object | Physical transmission with suitable geometry and lighting | Thickness, reflections, overlap and renderer limits at the required angles |
| Dissolve a mesh or reveal a cutout | Deliberate transparency, alpha test or another supported coverage technique | Depth, sorting, silhouette and cost through the whole move |
| Combine animated poses | Pose weights, interpolation and transform ownership | Attachment, normalized weights, interruption and canonical return |

Pose blending does not composite pixels. Follow [object structure](../../object-structure/references/canonical-poses.md) and [motion timing](../../motion-intelligence/references/timing-and-interruption.md) for transforms. A visual crossfade never decides which application state is committed.

## DOM layers and a reliable reading surface

Keep decorative layers in a named local group. `mix-blend-mode` combines an element with its backdrop; `background-blend-mode` combines that element's background layers. An `isolation:isolate` ancestor establishes a blending boundary. Choose that boundary around the imagery that should interact. Putting the blend layer outside it changes the result. See [MDN blend modes](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mix-blend-mode) and [isolation](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/isolation).

The compositing contract should identify background, media, decorative overlays, readable content and controls, in order. Keep the reading surface outside decorative blending when its contrast must remain predictable. Set decorative overlays to ignore pointer events. A new stacking context from a transform or isolation can change local ordering; inspect the actual ancestors before escalating z-index values.

Choose a stable background/scrim when copy crosses changing imagery. Sample the brightest and darkest moving regions under each label, including intermediate fades. Difference blending can disappear against some colors; it is unsuitable as the sole contrast guarantee for a primary action. A glass-like panel needs a readable fallback when backdrop filtering is unavailable or too expensive. Do not animate large blurred regions without measuring paint/composite cost.

## Alpha and crossfade mechanics

For normalized straight source color Cs, backdrop Cb and alpha As/Ab, source-over gives `Ao = As + Ab*(1-As)` and premultiplied output `Co = Cs*As + Cb*Ab*(1-As)`. Divide Co by Ao only when converting back to straight color and Ao is nonzero. Perform custom color arithmetic in the declared working color space. Browser and GPU pipelines may have different conversions; compare the delivered output instead of assuming numeric equivalence.

Declare whether decoded textures, render targets, shader output and the page compositor expect straight or premultiplied alpha. Multiplying twice darkens edges; treating straight data as premultiplied can produce bright fringes. A colored matte already baked into a cutout needs asset correction. Check the real edge over black, white and the actual theme. Prefer the renderer's documented pipeline; do not toggle unrelated alpha settings until one image looks acceptable.

Two opacity tracks with `outgoing=1-p` and `incoming=p` are not a constant-coverage dissolve under source-over: opaque source images cover only 75% at p=.5 and expose 25% of the backdrop. For opaque full-frame imagery, keep the base at opacity 1 and fade the ready incoming image over it; replace the base when committed. Match crop and geometry first. Transparent imagery needs a deliberate premultiplied crossfade in a common buffer or an accepted backdrop contribution. Preserve one semantic copy of labels and controls during the overlap.

For Canvas 2D, explicitly restore `globalAlpha`, `globalCompositeOperation` and transforms between layers, or use balanced save/restore. Clear the buffer in the correct coordinate system before a new transparent frame; otherwise old pixels become accidental trails. An intentional trail needs a defined decay, reset on resize/source change, and static alternative. See the [canvas compositing guide](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing).

## Three.js transparency and depth

For ordinary alpha blending, use an appropriate transparent material and inspect depth writes: keeping `depthTest` while disabling `depthWrite` can suit layered translucent effects, but does not fix all ordering. Use `alphaTest` for deliberate cutouts; judge threshold aliasing against the subject. These properties control different operations. See [Material](https://threejs.org/docs/pages/Material.html).

Object sorting cannot correctly order every triangle of intersecting translucent meshes. `renderOrder` chooses ordering; it cannot solve cyclic overlap. Reproduce the defect without postprocessing, orbit to the failing view, then consider separating surfaces, changing geometry, choosing cutout coverage or adopting a renderer-supported transparency technique. Disabling depth tests globally makes occluded geometry show through. Test transparent double-sided geometry and overlapping surfaces in the installed renderer; additional passes and overdraw affect cost.

For transmissive physical material, retain opacity 1 and tune transmission, thickness, roughness, attenuation and lighting for the object. Transmission represents optical behavior beyond a simple opacity fade. Nested glass and background capture have renderer-specific limitations; prove the required view before extending the effect. See [MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html) and the project's installed version.

Read [assets and rendering](../../threejs-engineering/references/assets-and-rendering.md) and [shaders and optics](../../cinematic-web/references/shaders-and-optics.md) for texture color roles and the output transform. Apply tone/display conversion at the intended boundary once; a second conversion or a color transform on data textures can resemble a blending defect. Check whether postprocessing preserves the desired canvas alpha and whether bloom spills over the DOM background.

## Handoff and acceptance

Keep requested state, decoded/loaded readiness and displayed state distinct. Preserve the last valid layer until its replacement is ready; ignore obsolete completion. Retarget from the displayed blend on interruption or explicitly settle according to the interaction contract. A reduced-motion or failed-render path must leave a complete readable state.

Inspect endpoints and overlap at p=.25,.5,.75, forward and reverse, with the real background, light/dark themes when supported, resize, enlarged text and missing media. Check fringes, coverage dips, ghosted subjects, depth inversions, label contrast and focus. Observe normal playback separately from frame captures, then measure large filters/transparency on the target device. Record the layer responsible for a defect and the change that fixed it.
