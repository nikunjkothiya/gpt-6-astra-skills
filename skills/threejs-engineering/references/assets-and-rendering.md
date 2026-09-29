# Product assets and rendering decisions

Read when constructing or importing a product, choosing materials, diagnosing color and surface problems, or introducing shaders and effects. Resolve intended form through geometry and intended appearance through material, lighting, camera, and rendering specialists.

## Choose the representation from the form

| Requirement | Useful construction path | First failure to inspect |
| --- | --- | --- |
| Constant section, manufactured rail, plate | A designed `Shape` and `ExtrudeGeometry` | Wrong outline, bevel scale, holes, cap topology |
| Bottle, knob, turned component | Radial profile and `LatheGeometry` | Pinched poles, discontinuous profile, seam, wall thickness |
| Hose or cable | Curve and tube with resolved endpoints | Excess curvature, wrong tangent, self-intersection |
| Repeated identical fasteners or fins | Shared geometry; `InstancedMesh` when appropriate | Wrong instance transform, bounds, selection ID |
| Complex authored surface or deformation | Appropriate glTF asset and modeling workflow | Units, part identity, topology, animation, licensing |
| Surface microdetail | Material maps or shader variation | Pattern scale, orientation, excessive contrast |

Do not use tiny polygon pieces to approximate every surface when a continuous profile or suitable authored asset carries the form accurately. Establish the silhouette at final size first. For holes visible in parallax, create actual openings with depth and rim structure. Increase segments where curvature or deformation needs them; inspect faceting in the intended view before assigning a global high segment count.

For custom `BufferGeometry`, inspect winding, indexed seams, vertex normals, and UV discontinuities. Recomputing normals cannot infer every desired hard edge from an incorrectly welded mesh. Update relevant bounds after vertex or instance changes. A shader that displaces visible vertices also affects bounds, picking, and shadow geometry; decide how each follows the deformation.

## Acquire assets with an explicit contract

Record source, license, required attribution, units, axes, material assumptions, semantic part names, animation clips, and texture/decode requirements. Inspect a loaded object with a neutral diagnostic camera and light before applying art direction. Keep a source asset and separate product configuration from presentation orientation.

Use `GLTFLoader` from the installed Three.js add-ons. Add Draco, Meshopt, or KTX2 support only when assets require it. Configure decoder/transcoder files and deployment paths, including content security and origin requirements in the host. KTX2 support detection uses the actual renderer before texture loading. Handle a missing decoder as an asset failure. Loader success does not prove that units, materials, or camera framing are correct. [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [KTX2Loader](https://threejs.org/docs/pages/KTX2Loader.html)

Keep texture and geometry sharing explicit. An ordinary object clone may retain shared materials or buffers; modifying a shared material changes all consumers. Skinned assets require a cloning strategy that preserves valid skeleton relationships. Preserve stable semantic IDs even if optimized geometry is merged or instanced.

## Establish a coherent color pipeline

Three.js uses Linear-sRGB for lighting calculations. Color textures such as base color and emission generally need their intended sRGB annotation; normal, roughness, metalness, and other data textures must retain noncolor treatment. glTF loaders normally assign their own intended texture semantics. Avoid blanket reassignment over imported assets. Specify the renderer's output policy and keep tone mapping and output conversion in the correct place when adding postprocessing. `OutputPass` is the conventional Three.js compositor output step; do not apply a second output conversion around it. [Color management](https://threejs.org/manual/pages/color-management.html)

Judge color under the complete pipeline with the actual background and exposure. A DOM brand swatch and a lit physical surface need not produce the same displayed pixel. If a displayed mark must match a reference color, define that treatment intentionally instead of changing every physical material to compensate.

## Diagnose the image before adding effects

| Observed problem | Investigate first |
| --- | --- |
| Metal reads as black or plastic | Reflective environment, roughness scale, material assignment |
| Glass reads as a gray sheet | Thickness, back surface, environment, transmission and overlap limits |
| Product floats | Contact, shadow placement, ground relationship, light direction |
| Highlights wobble | Normals, topology, temporal sampling, shadow bias |
| Surfaces look washed out | Input/output conversions, exposure, light intensity, tone mapping |
| Fine texture shimmers | Projected texel scale, filtering, aliasing, camera distance |
| Transparency changes with view | Sorting, depth policy, intersecting transparent layers |

Use actual material response and shaped lighting for form. Choose environment resolution from reflective detail; high roughness may need less detail than a polished surface. Tighten shadow coverage around the relevant objects before simply increasing map resolution. Tune bias against scale and light angle, checking both acne and detached shadows.

Add bloom, depth of field, particles, screen distortion, and chromatic effects for a stated visual purpose. Inspect text, edges, ordinary states, motion, and lower quality settings with the effects enabled. Preserve sharp intentional focus and avoid masking geometry errors with depth blur.

## Keep backend and budget decisions coherent

WebGL and WebGPU have different custom-material and effect paths. The current WebGPU renderer uses node/TSL workflows; WebGL `ShaderMaterial`, `RawShaderMaterial`, and `onBeforeCompile` modifications are not a portable migration strategy. Verify the installed backend's capabilities before implementing the shader. [WebGPU renderer migration](https://threejs.org/manual/pages/webgpurenderer)

Profile the actual representative view, including transparency, shadows, effects, asset decoding, and movement. Separate CPU cost, GPU work, transfer size, and retained memory. Change pixel ratio, shadows, effects, visible instances, and asset resolution according to the measured bottleneck. A smaller compressed file does not by itself establish lower GPU memory. Preserve recognition, smooth response, and meaningful state across quality levels.
