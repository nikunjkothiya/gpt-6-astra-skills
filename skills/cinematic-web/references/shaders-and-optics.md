# Shaders and optical treatment

Use for a specific material, field, or optical purpose from the storyboard. **FROM-KNOWLEDGE:** original procedures and formulas. **ESTIMATED:** numeric starting values. These recipes need implementation, compilation, visual inspection, and profiling in the selected backend; they are not benchmarked effects.

## Establish the rendering contract

Choose the backend before shader syntax. `ShaderMaterial` and GLSL recipes here target `WebGLRenderer`. WebGPU uses the supported node/TSL material path for that Three.js revision; do not paste GLSL snippets into it and claim compatibility. Match the installed add-ons and renderer release. See [ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html).

Record uniform units: `uTime` in seconds, `uProgress` in [0,1], pointer coordinates in normalized UV, velocity in UV/second or progress/second, resolution in drawing-buffer pixels. Pass a deterministic time and seed in capture mode. Do not call random generators every frame for stable spatial noise. Cap effect resolution independently from the DOM; start at .75 of canvas resolution for a background and compare .5 on constrained devices.

Choose the working/output color pipeline once. Color textures need correct color-space annotation; normal, roughness, metallic, AO and data textures remain data. Author lighting calculations in linear space. A direct custom WebGL fragment may end with the renderer's tone-mapping and color-space chunks; an intermediate linear render target must not be display-encoded prematurely. In a composer, end with one intended output conversion, such as [OutputPass](https://threejs.org/docs/pages/OutputPass.html). Check a neutral patch and product colors with passes disabled/enabled to detect double conversion.

## Small field ingredients

These GLSL functions are ingredients, not a complete shader. Use aspect-correct coordinates when circles should remain circular. `p` below is an aspect-correct local plane coordinate, and `t` is an explicit time in seconds.

```glsl
mat2 rotate2d(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, s, -s, c);
}
float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float valueNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1, 0)), u.x),
             mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x), u.y);
}
float circleSdf(vec2 p, float radius) { return length(p) - radius; }
vec2 swirl(vec2 p, float t) {
  float angle = 0.7 * exp(-2.0 * dot(p, p)) * sin(t * 0.35);
  return rotate2d(angle) * p;
}
```

The hash is inexpensive stylized noise, not a physical fluid model or guaranteed identical across all GPUs. Use fixed inputs and a visual tolerance for cross-device raster comparisons. For anti-aliased SDF edges, use `w=max(fwidth(d),1e-5)` and `1-smoothstep(-w,w,d)` in a supported fragment derivative context. Avoid reversing `smoothstep` edges; their order must be increasing.

## Field and material recipes

Each row is a procedure: construct the field, apply the bounded motion, check its named failure. Begin with one row, then add only what supports the composition.

| Technique | Recipe and starting numbers | Anti-pattern | Verification |
| --- | --- | --- | --- |
| Gradient/mesh field | Place 3–5 color anchors; blend normalized inverse-distance or Gaussian weights with radius .35 UV; move anchors on fixed sinusoids of amplitude .035 UV, frequencies .08/.11 Hz | Random blob positions every frame; unreadable moving backgrounds behind copy | Freeze t=0/2/4 s, check hierarchy and contrast; verify sum of normalized weights and no seam |
| Swirl | Warp centered UV with the function above; map two brand colors through a noise field of scale 2.5 | Rotating an entire page or high angular speed just to show activity | Center remains finite, edges remain covered, reverse explicit time reproduces field |
| Halftone | Use drawing-buffer coordinates divided by 6 px per cell; sample source luminance at each cell center; radius .08–.46 cell according to tone; anti-alias circle edge | UV-based cell size that changes with aspect/DPR, temporal moiré | 1×/2× DPR and .5/.75 effect scales; keep dot size in intended CSS or buffer units |
| Flame | Taper an upward SDF envelope; warp x with 3 octaves of noise at scale 3/6/12 and weights .5/.25/.125; advect y by −.35 units/s; use warm palette in linear space | Claiming an advected 2D field simulates fire or heating the entire text background | Silhouette remains anchored; top fades without a hard edge; no temporal aliasing at 30 fps |
| Aurora | Sum 2–3 sinuous ribbon distances; width .015–.04 UV; noise shifts ribbon by .035 UV at .07 Hz; integrate a few layers only if measured affordable | 64-sample loops without a budget, saturated full-screen glow | Compare static composition, mobile frame cost and text contrast at brightest point |
| Noise and SDF forms | Build circle/rounded-box fields, combine with smooth minimum k=.08; animate centers ≤.08 UV over 3 s | Increasing octaves/resolution to hide an unresolved silhouette | Boundary continuity, bounds, finite output; compare one vs three octaves at delivery size |
| Fresnel rim | Use `pow(1-clamp(dot(normalize(N),normalize(V)),0,1),3)` with N/V in the same space; multiply by .15–.35 accent intensity | Fresnel as a replacement for plausible material/lighting, mixed world/view spaces | Rotate camera through 90° and inspect normal seams; disable rim to check underlying form |
| Liquid metal | Metalness 1, roughness .18–.3, intentional environment strips; displace by noise amplitude .01 object-height at .12 Hz and correct normals | Chrome without an environment; huge vertex waves on a rigid product | Highlights follow surface, silhouette supports intent, no shadow/normal mismatch |
| Glass/refraction | For a closed plausible solid, start physical transmission 1, opacity 1, roughness .08, IOR 1.45, thickness .05 scene units; add environment | Treating opacity as refraction, stacked transparent shells, promising caustics | Inspect behind/inside geometry, edge ordering, background availability and pixel cost |
| Velocity image distortion | Clamp story velocity to ±2 progress/s; apply `uv.y += sin(uv.x*12)*clampedVelocity*.0075`; damp velocity with rate 12 s⁻¹; decay to 0 | Deriving velocity from frame count or using distortion to mask poor frame pacing | Zero speed yields original image; reverse changes direction; peak UV shift ≤.015 |
| Hover ripple/liquid | Store pointer UV and event time; radial wave `sin(30*r-12*age)*exp(-6*r-3*age)` times .008 UV; stop when amplitude <.0001 | Allocating one forever-live uniform/event per move or snapping pointer when it exits | Hover enter/exit/re-enter, texture edges, touch alternative, no NaN at radius 0 |

Glass fields correspond to [MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html); its transmission model and screen-space inputs have limitations. A custom screen-space refraction shader cannot reveal offscreen or occluded information that was never rendered. Use a purpose-built capture, environment, baked treatment, or video when the shot requires it.

For image distortion, aspect-correct `cover` UVs before the effect and clamp or pad sampling intentionally; cover cropping plus displacement needs extra overscan. Feather the effect toward edges if uncovered borders would appear. Keep a DOM image alternative and meaningful alt text; hover cannot be the only route to content.

For nonlinear physical gestures, use [time-aware retargeting](../../motion-intelligence/references/timing-and-interruption.md). `alpha=1-exp(-12*dt)` handles damping with dt in seconds; resetting a fixed `.1` lerp every frame changes response with refresh rate. A velocity-driven effect is history-dependent: deterministic tests must prescribe time and input history, or explicitly bypass it while testing canonical progress state.

## Optical pass design

Treat optical effects as camera/art-direction decisions. Add one, measure its incremental cost, and compare with the neutral shot. Keep semantic DOM text outside blur/chromatic distortion where practical. Starting values below are scene-dependent proposals.

| Effect | Recipe / numbers | Failure / check | Downgrade |
| --- | --- | --- | --- |
| Bloom | HDR highlight threshold 1.1, strength .3, radius .35 in UnrealBloomPass; intentional emissive source | White text or entire materials glow; compare luminance with pass disabled and inspect halos | Reduce resolution, then remove |
| Depth of field | Track focus at subject depth; for a 1-unit subject near 3 units start aperture .002 and maxblur .004, tune after scene scale; rack focus over .6 s with `sine.inOut` | Edge bleeding or unreadable required detail; view alpha/thin geometry and all focal endpoints | Remove first on constrained hardware |
| Grain | Zero-mean luminance noise amplitude .012; change seed at 12 Hz for stylization, or hold seed for static evidence | Flashing dark areas, compression noise, nonrepeatable test frames | Static low-amplitude texture or remove |
| Vignette | Smooth radial attenuation from radius .45→.8 of normalized frame; maximum darkening .10 | Darkening focus indicators or hiding composition errors | Remove; preserve authored light |
| Chromatic aberration | Radial separation 0→.0008 UV at edge, center held; bound during one .45 s transition | Permanent illegible edge color or nausea | Remove |
| Motion blur / velocity distortion | Genuine blur needs correct current/previous transforms and a velocity buffer; start shutter fraction .25, 5 taps, displacement clamp 8 px | Reusing previous camera matrix across resize/cut, ghost trails, calling UV distortion physically correct blur | Prefer bounded distortion or no blur |
| Tone mapping | Select renderer-supported operator, exposure initially 1; light and grade with that fixed pipeline | Animating exposure accidentally to compensate for every camera turn | Keep consistent mapping; simplify other passes |

Bloom controls are defined by [UnrealBloomPass](https://threejs.org/docs/pages/UnrealBloomPass.html). Bokeh focus is distance along the camera look direction in world units; aperture is that shader's parameter, not a photographic f-number. Confirm [BokehPass](https://threejs.org/docs/pages/BokehPass.html) before copying values from differently scaled scenes.

Suggested order for a WebGL composer is scene render → scene-dependent depth/motion effects → bloom → subtle grading/grain as designed → output conversion. Exact pass expectations matter more than this sketch: document whether each pass reads linear or display values, whether it needs depth, and which objects it includes. Resize render targets with the canvas, reset temporal history on resize/teleport, and dispose every owned target/pass. Compare p50/p95/p99 with passes individually enabled; a beautiful screenshot cannot establish acceptable motion cost.
