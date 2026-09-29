# Storyboard, art direction, and rendering choice

Use this before coding a cinematic sequence. These are **FROM-KNOWLEDGE procedures** and **ESTIMATED starting parameters** unless a project record identifies actual observations or measurements. No example is an analysis of an award site.

## Resolve a visual proposition

Write the product's purpose, visitor action, dominant object or message, three visual attributes, and one signature moment. Translate attributes into decisions: `precision` might mean a stable horizon, restrained 6-degree object reveal, narrow spacing rhythm, and one copper highlight. It does not imply a universal dark theme.

Choose type by the actual content and license. Establish a display/body/utility hierarchy and test real titles, numerals, punctuation, long labels, and mobile wrapping. A possible editorial starting scale is 80/48/24/16 CSS px at desktop and 44/32/22/16 at mobile, implemented with accessible relative units and content-driven bounds. Establish ink, background, surface, muted text, action, and focus roles before gradients. Check contrast in the rendered state through overlays, materials, and animation.

Allocate one hero moment per section. Hold a quiet frame after it. Start with 48–96 px desktop section gutters and 20–24 px mobile gutters only when the content allows; use a coherent grid and optical alignment, not these numbers as a style. Key art should remain recognizable with all postprocessing disabled.

## An original storyboard example

Assume a 0.4 m sculpture centered near `(0, 0.2, 0)`, +Y up, +Z toward the initial camera. This is an original four-beat product story. Numeric coordinates, colors, and timing are proposals; test framing against the actual mesh and viewport. `p` is normalized master progress, not elapsed seconds. For a preview of 8 seconds, each 0.25 span is 2 seconds. For scroll, the same spans describe proportional travel and users control elapsed time.

| p / preview time | Camera position → target; vertical FOV; roll | Object transform | Lighting/material | DOM | Ease / timing | Beat |
| --- | --- | --- | --- | --- | --- | --- |
| 0–.25 / 0–2 s | `(0,.32,1.5)` → `(0,.20,0)`, dolly to `(0,.30,1.2)`; 38→38°; 0° | yaw −12→0°; y 0; scale 1 | key 2→2.6 project units; exposure 1 | title y 20→0 px, opacity 0→1 over p .02–.12; subtitle follows .04 later | camera `sine.inOut`; title `power2.out`; no stagger | Recognize silhouette |
| .25–.50 / 2–4 s | curve to `(.65,.36,.95)`; target `(0,.22,0)`; 38→34°; 0→1° | yaw 0→18° | rim .5→1; roughness held .3 | title fades over .25–.30; detail label enters .35–.42 by 12 px | camera `sine.inOut`; 0.05 p reading hold before next beat | Notice craftsmanship |
| .50–.75 / 4–6 s | curve to `(.38,.48,.72)`; target `(0,.25,0)`; FOV 34°; roll 1→0° | upper part local y 0→.045 m, base held | key held 2.6; no hue change | specification lines reveal 18 px over .56–.65; 0.02 p stagger | parts `power2.inOut`; camera arrives .58, parts dominate .58–.70 | Understand assembly |
| .75–1 / 6–8 s | return to `(0,.32,1.2)`; target `(0,.20,0)`; 34→38°; 0° | reassemble y .045→0 m; yaw 18→0° | rim 1→.5 | CTA opacity 0→1 at .85–.92; hold through 1 | parts `power2.inOut`; camera `sine.inOut`; no overshoot | Resolve and act |

Every property holds its last authored value between intervals. Adjacent camera endpoints match. If velocity should continue through a boundary, use a continuous curve with a single time map or match endpoint derivatives; easing every segment to rest creates a deliberate stop. State whether that stop serves the beat.

For touch, a possible adaptation is a two-beat 160 vh story, 20-degree maximum orbit, and a persistent skip link. For reduced motion, present useful static views with ordinary document scrolling; no simulated dolly or parallax. Do not conceal content waiting for scroll JavaScript to initialize.

### A bounded physical motion phrase

Choose physical language from the subject. A damped lever may justify anticipation and follow-through; a rigid product inspection often needs a direct controlled move. An **ESTIMATED** original lever phrase can use: anticipation 0→−2° over 0–.10 s; principal motion −2→23° over .10–.48 s; settle 23→22° over .48–.64 s. Use `sine.inOut` for anticipation, `power2.inOut` for the principal move, and `power2.out` for settling. A secondary flexible detail can begin at .16 s, reach 8.5° at .54 s and settle to 8° at .72 s, creating 60 ms overlap delay and a longer follow-through. Hold the main part after .64 s. Delay unrelated DOM entry until .54 s; enter by 12 px over .30 s with `power2.out`.

Author those transforms around actual pivots with contact and angular limits respected. The recipe deliberately stops at phase boundaries; use a continuous velocity-preserving response if a stop is inappropriate. For scroll, map all phases into one normalized interval and evaluate absolute poses; for retargetable gestures, use state plus velocity and time-aware damping. Do not layer an independent spring on a scrubbed joint. Verify at 30/60/120 Hz presentation, midway reversal, hard-limit clearance, exact endpoints, and reduced-motion resolution. An attached rigid part must not lag behind its mount just to suggest flexibility.

## Select the rendering method

Write the decision with the hardest required interaction, visual property, weakest target device, total transfer, decoded memory, and fallback. The following budgets are **ESTIMATED initial constraints for a small marketing hero**, not web standards or capability guarantees. Adjust them with measurement and the delivery brief.

| Method | Choose when / recipe | Initial budget and delivery | Main failure / verification |
| --- | --- | --- | --- |
| Real-time 3D | User must inspect arbitrary angles, configure parts, or affect spatial state; build a constrained PBR scene | 2–4 MB compressed hero assets; 80–200k visible triangles; <100 draw calls; DPR cap 1.5 desktop / 1.25 mobile | Thermal, overdraw, compilation, and texture memory; profile worst view on target hardware and verify interaction |
| Real-time with baked support | Geometry must remain interactive but lighting is mostly fixed; bake AO/lightmaps and use a compact HDR environment | Similar geometry budget; start 1k–2k textures and 512–1k environment; account for decoder/runtime transfer | Baked highlights/shadows contradict moving parts; rotate object and change every supported configuration |
| Pre-rendered video | Offline light transport, complex deformation, dense particles, or a fixed camera defines the shot; DOM carries actions | Start 6–10 s, 24/30 fps, 720p mobile/1080p desktop; target 2–6 MB mobile and 4–10 MB desktop | Seek latency, codec support, download and decode cost; test cold load and bidirectional seeks on actual mobile |
| Canvas image sequence | Exact reversible frame seeking matters more than payload; offline shot is short | Start 90–150 frames at 960 px wide, average 25–60 KB/frame; transfer roughly 2.3–9 MB; bounded decoded window | Decoded RGBA memory is `w*h*4*frames`, far larger than transfer; test cache eviction, reverse scrubs and incomplete windows |
| Hybrid | A fixed film shot establishes atmosphere, live geometry handles meaningful inspection, DOM carries narrative | Share palette/lens composition; include both payloads in one route budget; load the next layer near need | Handoff looks like a different object or exposure; match overlapping frames, camera, silhouette, and color |

Example memory arithmetic: 120 decoded 960×540 RGBA frames consume about 237 MiB before other allocations. A 12-frame window is about 24 MiB. An uncompressed 2048² RGBA texture uses 16 MiB at its base level, about 21.3 MiB with a full mip chain. Transport compression does not prove runtime memory savings; GPU block compression changes the latter.

### Scrubbable video recipe

Encode a representative 2-second sample before exporting the full shot. Begin with MP4/H.264 `yuv420p`, fast-start metadata, constant 30 fps, and a short GOP such as 6 frames; compare to all-intra if bidirectional seeks remain too slow. An example FFmpeg option set is `-c:v libx264 -pix_fmt yuv420p -r 30 -g 6 -keyint_min 6 -sc_threshold 0 -movflags +faststart -an`. Confirm encoder support against [FFmpeg codec documentation](https://ffmpeg.org/ffmpeg-codecs.html#libx264_002c-libx264rgb), then inspect actual output and resulting size. Short GOPs trade larger files for less decode work per random seek; they do not guarantee browser seek speed. Add another codec only after testing its supported target browsers and total delivery benefit.

Wait for metadata before mapping `targetTime = p * duration`; clamp to a decodable final frame. Coalesce input and keep at most one seek in flight: retain the newest requested time, use `seeked` to schedule the next, and show the last decoded frame meanwhile. Where supported, use [requestVideoFrameCallback](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback) to observe presentation; feature-detect it. Do not mistake a `currentTime` assignment for a displayed frame. Avoid `fastSeek` for exact frame matching. Test muted/playsInline behavior, range requests, background resume, and touch browser restrictions.

Keep a dimensioned poster and meaningful text visible immediately. If loading exceeds the agreed window, seeking fails, or the user chooses reduced motion/data, retain the poster and ordinary content. For image sequences, load the poster plus neighboring frames first, cap outstanding decodes (for example 4), close evicted `ImageBitmap`s, and use a stable nearest available frame. Never accumulate all frames merely because a desktop development machine allows it.

### Tier the result by capability

- **Baseline:** semantic content, controls, poster or static geometry; no required motion.
- **Constrained:** DPR 1–1.25, smaller textures, baked shadows, short camera travel; remove DOF, velocity blur and aberration.
- **Standard:** DPR up to 1.5, one controlled shadow, modest bloom if measured affordable.
- **Enhanced:** additional optical passes only after sustained measured headroom; preserve the same story and contrast.

Choose a initial tier conservatively, then adapt from measured sustained frame cost with hysteresis. Do not infer a GPU budget from screen width or user-agent alone. A possible policy downgrades after p95 exceeds 24 ms for three 2-second windows, upgrades only after ten windows below 14 ms, and changes one tier at a stable beat. Record the measurement method; requestAnimationFrame spacing includes scheduling and is not GPU execution time.

## Replace common synthetic-looking choices with decisions

| Symptom | Specific correction | Check |
| --- | --- | --- |
| Default ease on unrelated actions | Assign a role: `power2.out` for entries, `sine.inOut` for camera, direct linear progress for scrubbing; document exceptions | Compare a contact sheet and velocity trace around beat boundaries |
| Uniform stagger everywhere | Group by meaning; e.g. heading at 0 ms, evidence at 160 ms, CTA at 420 ms; omit decorative stagger | Main message is readable before secondary content competes |
| Generic gradient blobs | Derive a field from the product's geometry or lighting; use two role colors and one accent; bound speed/amplitude | Still frame has intentional focal point and accessible text |
| Three centered cards regardless of content | Choose hierarchy from content length and priority: lead story, comparison, list, editorial grid | Real copy and 200% text fit without lost meaning |
| Glass on every surface | Reserve transmission for a material or spatial purpose; make text surfaces stable and opaque enough | Contrast and boundaries survive every background frame |
| Unmotivated bounce | Use overshoot only for a compressible/tactile metaphor; start ≤3% displacement and ≤140 ms settle | Rigid objects keep attachments and don't cross hard limits |
| Neon-on-black by default | Choose palette from brand, audience, lighting, and product; test a neutral proof first | Visual hierarchy works without glow |
| Constant visual activity | Insert 0.15–0.25 normalized reading holds in long stories; pause ambient effects offscreen | Visitor can read and act without chasing moving controls |

Check loaders, focus, hover, empty/error states, return navigation, and the final scroll exit at the same craft level as the opening frame. Performance and access are part of the authored experience. No checklist establishes an award or a monetary brand valuation.
