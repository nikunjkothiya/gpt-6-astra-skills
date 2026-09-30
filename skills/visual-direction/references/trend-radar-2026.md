# Trend radar 2026

A design calibration snapshot maintained in September 2026. The labels below are editorial judgments, not a measured survey or a browser-support certification. Trends explain what visitors already recognise; they never replace a subject-specific direction. Status: **rising** (distinctive now), **peak** (expected on award sites; needs a fresh angle), **saturated** (reads as a default unless the subject demands it). Check platform and library support at implementation time; a date on this document does not establish compatibility.

## Design and motion trends

| Trend | Status | Use it well | Risk |
| --- | --- | --- | --- |
| Kinetic and variable typography: weight, width and optical size responding to scroll, hover or load | Peak | Tie the axis change to meaning (emphasis, time, pressure); keep reading text still | Reflow and layout shift; unreadable motion on body copy |
| Bold color and color blocking replacing muted minimalism | Rising | One saturated field per section with inks tuned for contrast | Accessibility on saturated grounds; brand mismatch |
| Return of visual personality against AI sameness: hand-made marks, authentic photography, visible process | Rising | Real material from the subject; imperfect, specific details | Faux-handmade clichés |
| Broken grids and editorial asymmetry | Peak | Asymmetry anchored to shared rails; one intentional offset per view | Chaos without anchors; mobile collapse |
| Bento grids | Saturated | Only for heterogeneous items that benefit from side-by-side scanning | The generated SaaS look |
| Pinned scroll storytelling with 3D or procedural scenes | Peak | One story section with clear entry and exit, readable holds, reduced-motion layers | Scroll hijack, long pins on mobile |
| Procedural WebGL: shader fields, DOM-synced image effects, particles; WebGPU and TSL arriving in Three.js | Rising | A field or effect that expresses the subject, capped DPR, static fallback | GPU cost on mid-range phones; decoration without meaning |
| Refraction and "liquid glass" surfaces after Apple's 2025 design language | Peak | Small, functional overlays on live media; readable backing | Chromium-only SVG backdrop refraction; contrast failures; instant cliché |
| Grain, dithering, halftone and print textures | Peak | Low opacity, tied to a print or film identity | Muddy photos, banding, heavy full-screen overlays |
| Tactile micro-interactions: magnetic targets, spring physics, press states | Peak | Response under 100 ms, stationary hit areas, physical mass per role | Everything wobbling; moving targets |
| Native page transitions with the View Transitions API | Rising | Shared elements and route crossfades with normal navigation as fallback | Firefox lacks cross-document transitions; snapshot flashes |
| Scroll-driven CSS animations replacing scroll listeners | Rising | Progress bars, reveals, parallax as progressive enhancement | Firefox does not enable them by default yet |
| Custom cursors | Saturated | Only when the cursor carries information (view, drag, play) | Portfolio cliché; hidden native cursor |
| Preloaders with counters | Saturated | Real asset progress for heavy WebGL, skipped on repeat visits | Fake progress, delayed content |
| Experimental navigation: index-first, radial, command menus | Rising | A familiar fallback always one step away | Lost users; keyboard traps |
| Maximalism and collage in fashion and culture | Rising | Controlled density with a clear reading path | Accessibility and performance debt |
| Performance and accessibility as visible quality | Rising | Instant first view, perfect focus states, fast interaction | Treating them as a final checklist |
| Opt-in sound design | Niche | User-initiated, with a persistent toggle | Autoplay sound; loud defaults |

## Verify the platform before choosing an effect

Inspect the project's installed versions and lockfile first. Select dependencies only when the required behavior justifies them; preserve an established stack. Read the API and license for the chosen version rather than copying a dated release number from a trend list.

| Decision | Primary source | Verification in the target project |
| --- | --- | --- |
| GSAP timelines, cleanup and plugins | [GSAP documentation](https://gsap.com/docs/v3/) | Imports exist in the installed version; scopes revert; plugins and license match use |
| Smooth scroll | [Lenis project](https://github.com/darkroomengineering/lenis) | One scroll owner, native anchors, keyboard, nested scroll and reduced-motion behavior |
| React motion | [Motion documentation](https://motion.dev/docs/react) | Correct framework API, interruption and route cleanup |
| WebGL/WebGPU rendering | [Three.js documentation](https://threejs.org/docs/) | Required backend and shader features work on the target device; fallback is complete |
| CSS/API feature support | [MDN web platform documentation](https://developer.mozilla.org/en-US/docs/Web) | Browser matrix, feature detection and actual behavior, including older supported releases |

For example, [Interop 2026](https://web.dev/blog/interop-2026) includes work on anchor positioning, container style queries, dialogs/popovers, scroll-driven animations and view transitions. Inclusion in Interop is a work priority, not proof that all versions implement a feature.

## Enhancement contracts

| Feature family | Baseline experience to keep |
| --- | --- |
| Scroll-driven CSS, view transitions | Visible normal-flow content and working navigation; opt in with feature detection |
| Dialog, popover, anchors | Named reachable controls, correct focus/dismissal and a positioned fallback when needed |
| Relative colors, contrast-color, wide gamut | Explicit readable sRGB roles and verified foreground/background pairs |
| Text fitting, trimming and wrapping | Real text with usable intrinsic layout under zoom and missing fonts |
| Masonry, new carousel controls, shape effects | Logical source order, reachable controls and a simple grid/scroll-snap alternative |
| WebGPU, glass/refraction, shader fields | Complete DOM content and a useful static view after initialization or context failure |

Record the browser/version, date, source and observed fallback beside a consequential experimental choice. If support cannot be checked, use the reliable baseline and describe the enhancement as unverified. Trends may suggest an opportunity; the brief and the rendered result decide whether it belongs.
