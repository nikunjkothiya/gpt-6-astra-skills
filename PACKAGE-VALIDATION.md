# Package validation and evidence limits

Version 1.4.0, September 30, 2026. The distribution contains 29 skill entrypoints, 57 supporting references, five bundles and optional token, source-audit and capture helpers. It contains no demonstration websites or packaged visual assets.

## Direct package checks

The package passes **54 Node tests** plus validation of **29 skills, 57 references, five bundles and six package guides**, declared helper availability and distribution inclusion. The skill-creator metadata validator also passes for all 29 skills and the installer. Runtime dependencies remain the MCP packages and Zod; Three.js is used in development tests. Playwright and GSAP are not package dependencies.

`npm run check` validates document inventory, metadata, resolved-path containment and local links. It tests full document/bundle retrieval through a real local stdio MCP connection, resources, prompts, input rejection and clean shutdown. Text export checks require full selected bodies, deduplicate overlapping bundles and reject unknown identifiers. Distribution checks stage a new root child, compare every skill/reference body, validate the staged package and lockfile version, reject overwrites and reject destinations inside source folders before creating them.

Reference tests execute code from the distributed Markdown: real Three.js transforms and exact return cycles; time-based damping and critical springs; pointer coordinate mapping, cancellation and teardown; stale async selection; serial video seeks, segment bounds, metadata deadlines, failures/retry and disposal from status callbacks; sequence index/window bounds and responsive cover-crop math. These require the indicated development dependencies, with no website template or browser dependency in the distribution.

The new tests exercise all 16 palette blocks and 96 declared contrast pairs; unrounded WCAG threshold comparisons; invalid color/spec rejection; OKLCH gamut mapping; fluid scale endpoints; under/critical/over-damped spring settling; CSS generation that refuses failing inputs; scanner limits and exclusions; capture argument validation, overwrite protection and CLS session windows. Additional tests execute the exact dialog, tooltip, background-video, transition and deterministic-canvas examples with controlled inputs. Mocked browser APIs establish those state/lifecycle contracts, not native browser rendering.

The media preparation and image-sequence loader references specify production contracts. Unit tests of their mapping helpers do not prove that a particular clip, conversion, network host or loader implementation is correct. Verify the actual assets and implementation in the target project.

## Findings and corrections in 1.4.0

| Finding | Correction and evidence |
| --- | --- |
| Seven new skills were absent from the catalog; initial validation failed | Registered all skills/references, repaired missing links, added coordinator routes and the `award-ui` bundle; MCP and exports retrieve every registered body |
| Existing token/audit/capture helpers were ignored by Git and omitted from builds | Included helpers and their tests; documented package-root resolution and optional browser dependencies; distribution tests compare declared file contents |
| Award workflow forced fixed concept/review counts and treated missing evidence as failure | Made exploration proportional to scope, preserved useful conventions, and distinguished observed failures from unobserved conditions |
| Static audit and browser metrics could imply more certainty than observed | Made style/motion heuristics advisory, report incomplete scans, use CLS session windows, retain unsupported metrics as null and distinguish capture hints from inspection |
| Specific recipe defects affected ordinary use | Repaired tooltip timer/hover lifetime, dialog padding and scroll locks, background-video lifetime, reduced-motion reveals, scoped color tokens, grid specificity, skipped view transitions and capture/autoplay ownership |
| Product UI lacked focused table guidance | Added table/grid semantics, sorting, selection scope, asynchronous state, mobile comparison and chart alternatives |
| Dated technology tables claimed broad verification | Replaced unsupported release/support certainty with current-source checks and fallback contracts |

An independent read-only forward-use review applied the instructions to an existing React inventory dashboard with a one-day scope and an original ceramics shop with eight owned photos. It produced task-appropriate decisions and found the ceremony, novelty, helper portability and table-coverage issues above. Separate recipe/helper reviews supplied concrete findings and partial fixes before hitting their usage limit; the main audit completed and tested the saved work. The token-helper review completed with 22 passing tests. These observations do not establish equal performance across models.

## Browser observations in 1.4.0

An isolated synthetic fixture used the distributed token spec, generated CSS, layout, line-reveal and dialog recipes in headless Chrome **154.0.8037.58** on Windows. Checks at **320, 390 and 1440 CSS pixels** observed no page overflow, full-width mobile split layout, visible static text under reduced motion, distinct scoped light/night colors, dialog padding that does not dismiss, Escape/focus return and lock release on teardown. These are recipe checks, not an award-level website evaluation.

The actual capture helper also completed against that fixture at **390×844 and 1440×900**, including normal/reduced views, scrolling, focus, contact-sheet output and JSON reporting, with no detected problems. Evidence and the reproducible local smoke harness are in the ignored `artifacts/browser-audit/` directory; they are intentionally excluded from the source distribution. Playwright Core was installed only there for verification, using the installed Chrome channel. No new physical-device, assistive-technology, cross-engine, field-INP or GPU scene validation is claimed.

## Earlier coverage audit in 1.3.0

The [capability map](CAPABILITIES.md) routes the requested UI, typography/color, motion, media, scroll, geometry/assembly, rendering/blending and mobile capabilities to their owning documents. This revision adds visual-language/theme and compositing references plus `premium-ui` and `product-3d` bundles. It clarifies camera coordinate assumptions, zero-travel horizontal layouts, mobile viewport behavior and the limits of sampled-frame evidence.

The earlier 1.3.0 audit completed directly; additional reviewer attempts then produced no findings. Its checks verified package behavior and reference algorithms without new browser/GPU/device validation. The historical observations below retain their original scope and do not certify appearance in an arbitrary project.

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
