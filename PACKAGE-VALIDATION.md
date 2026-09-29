# Package validation and evidence limits

Version 1.3.0, September 29, 2026. The distribution is a reusable skills package with 22 skill entrypoints, 32 references and four named bundles. It contains no demonstration websites or packaged visual assets.

## Direct package checks

The skills-only package passed **19 Node tests** and validation of **22 skills, 32 references, four bundles and six package guides**. Its development install uses four packages (three for MCP plus Three.js for reference verification); it has no Playwright/GSAP dependency.

`npm run check` validates document inventory, metadata, resolved-path containment and local links. It tests full document/bundle retrieval through a real local stdio MCP connection, resources, prompts, input rejection and clean shutdown. Text export checks require full selected bodies, deduplicate overlapping bundles and reject unknown identifiers. Distribution checks stage a new root child, compare every skill/reference body, validate the staged package and lockfile version, reject overwrites and reject destinations inside source folders before creating them.

Reference tests execute code from the distributed Markdown: real Three.js transforms and exact return cycles; time-based damping and critical springs; pointer coordinate mapping, cancellation and teardown; stale async selection; serial video seeks, segment bounds, metadata deadlines, failures/retry and disposal from status callbacks; sequence index/window bounds and responsive cover-crop math. These require the indicated development dependencies, with no website template or browser dependency in the distribution.

The media preparation and image-sequence loader references specify production contracts. Unit tests of their mapping helpers do not prove that a particular clip, conversion, network host or loader implementation is correct. Verify the actual assets and implementation in the target project.

## Coverage audit in 1.3.0

The [capability map](CAPABILITIES.md) routes the requested UI, typography/color, motion, media, scroll, geometry/assembly, rendering/blending and mobile capabilities to their owning documents. This revision adds visual-language/theme and compositing references plus `premium-ui` and `product-3d` bundles. It clarifies camera coordinate assumptions, zero-travel horizontal layouts, mobile viewport behavior and the limits of sampled-frame evidence.

The audit was completed directly. Additional independent reviewer attempts reached their usage limit and produced no review findings for this revision. New checks verify package behavior and reference algorithms; no new browser, GPU or physical-device visual validation was performed in this audit. The development observations below describe earlier work and do not certify the new guidance's appearance in an arbitrary project.

## Development observations

Before the distribution was narrowed to skills only, the pointer/video recipes were exercised in headless Chrome 153 on Windows with an original 640×480 VP8 clip. Six browser groups passed, including real decoding, forward/reverse seeking, pointer/control/scroll ownership, idle stopping, preference changes, 320/390 px layouts, 200% text, touch policy and blocked-media recovery. This found and corrected a startup error-listener race. Those development sites and media are excluded from the package.

The broader development work also exercised a Three.js articulated product and a GSAP cinematic sequence. These observations establish specific implementation behavior under their recorded conditions, not a universal design or performance result. The temporary sites, fixtures, captures and detailed development reports were removed during package cleanup; this summary preserves their scope and limitations.

Independent forward-use reviews applied the skill to textile and luxury-architecture briefs. They found a missing authored video-segment option and an undefined nonpositive scroll interval. The segment option is now implemented and tested; the sequence guidance explicitly uses a static normal-flow fallback when its interval is invalid. Review is a usability check of the instructions, not proof of identical execution by every model.

## What the target project must establish

- Actual fonts, copy, palette, imagery, geometry and layout at delivery sizes.
- Real scroll/cursor interactions, measured presentation and sustained resource use.
- Sequence/video encoding, color/alpha, frame count, decoding, hosting and failures.
- Touch, keyboard, focus, reduced motion, text enlargement and device/browser support.
- Source rights, accurate product content and complete user actions.

The package does not establish award quality, cross-model equality, private model reasoning, reference-level pixel accuracy or physical-device smoothness by itself. Host capabilities and observable results determine what can be verified.
