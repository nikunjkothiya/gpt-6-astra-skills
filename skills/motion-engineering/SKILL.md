---
name: motion-engineering
description: Implement premium web motion with the right tool - CSS transitions, @starting-style, scroll-driven animations and View Transitions first; GSAP with ScrollTrigger and SplitText for timelines and scroll stories; Lenis for wheel smoothing; Motion for React UI; seekable engines for films rendered from code. Covers setup per framework, easing and spring tokens, choreography, scroll patterns, page transitions, cleanup, reduced motion and performance. Use when building or fixing animations, scroll effects, smooth scrolling, page transitions, or motion that feels cheap, janky or excessive.
---

# Motion Engineering

Premium motion is mostly restraint executed precisely: instant feedback, one orchestrated entrance, one signature scroll moment, and transitions that explain where things went. Choose the cheapest tool that achieves the effect, give every animated property one owner, and make every motion interruptible, reversible and optional.

## Motion hierarchy

Budget motion in this order; later layers are optional.

1. **Feedback**: press, hover and focus respond within 100 ms.
2. **State change**: toggles, tabs, accordions, dialogs, drawers explain what changed.
3. **Navigation**: page and route transitions keep the user oriented.
4. **Signature**: one scroll story or interaction that carries the concept ([award craft](../award-craft/SKILL.md)).
5. **Ambient**: slow loops and fields; pause offscreen and under reduced motion.

## Choose the tool

| Need | Use |
| --- | --- |
| Hover, press, focus, small state changes | CSS transitions on tokens ([token architecture](../design-tokens/references/token-architecture.md)) |
| Entry and exit of dialogs, popovers, toggled elements | `@starting-style` with `transition-behavior: allow-discrete` |
| Scroll-linked reveals, progress, parallax | CSS scroll-driven animations behind `@supports`, or GSAP ScrollTrigger when every browser must match or when sequencing is complex |
| Pinned story, scrubbed timeline, split text | GSAP 3 with ScrollTrigger and SplitText |
| Smoothed wheel scrolling on narrative pages | Lenis, one instance, driven by the GSAP ticker |
| React component, layout, gesture and exit animation | Motion for React (`motion/react`) |
| Page and route transitions | View Transitions API; Barba for multi-page sites needing scripted transitions; the framework router's integration |
| Interactive physical values | Closed-form springs and time-based damping from [easing and timing](references/easing-and-timing.md) |
| Hero loops, launch films, share videos rendered from the site | A seekable timeline plus frame capture ([deterministic render](references/deterministic-render.md)) |
| WebGL fields, image effects, procedural 3D | [procedural WebGL](../procedural-webgl/SKILL.md), sharing the same ticker |

## Engineering rules

1. Animate `transform`, `opacity`, `clip-path` and, sparingly, `filter`. Never animate `width`, `height`, `top`, `left` or margins for motion; for height use grid rows or `interpolate-size` where supported.
2. One owner per property. Independent effects go on nested wrappers: the outer element takes scroll translation, the inner takes hover scale.
3. Share one continuous frame loop for coordinated effects. The GSAP ticker can drive Lenis and WebGL; isolated demand-driven components may use a cancellable RAF that stops at rest.
4. Time, not frames. Durations in seconds; damping as `1 − exp(−λ·dt)`; springs in closed form.
5. Start entrance clocks on the first rendered frame after fonts are ready, so a slow first frame cannot eat the opening.
6. Clean up everything you create: `gsap.context()` or `useGSAP()`, `gsap.matchMedia()`, ScrollTriggers, SplitText, Lenis, observers, listeners, animation frames.
7. Reduced motion is a JavaScript branch and a CSS branch. Show final states; no smoothing, pinning, parallax or autoplaying loops; fades of 200 ms or less are fine.
8. Refresh measurements once after fonts, images and dynamic content settle (`ScrollTrigger.refresh()`), never per frame.
9. Pause offscreen and hidden-tab work with `IntersectionObserver` and `visibilitychange`.
10. Never block input. Every animation can be interrupted; scroll always responds to wheel, touch, keyboard, anchors and find-in-page.
11. Measure. No long tasks over 50 ms during interaction; check frame timing in the browser's performance tools and with `node scripts/capture.mjs`.

## Default values

| Role | Duration | Easing |
| --- | --- | --- |
| Press feedback | 80–120 ms | `--ease-standard` or snappy spring |
| Hover in / out | 180–240 ms / 120–160 ms | `--ease-out-quart` |
| Small UI state: toggle, tab, chip | 160–240 ms | snappy spring |
| Panels, drawers, dialogs | 320–480 ms in, 200–280 ms out | `--ease-out-expo` in, `--ease-in-quart` out |
| Text line reveal | 700–1000 ms, 60–90 ms line stagger, cascade ≤ 400 ms | `--ease-out-expo` |
| Image reveal | 900–1300 ms, inner scale 1.08–1.15 → 1 | `--ease-out-quart` |
| Page transition | 500–900 ms total | `--ease-in-out-quart` |
| Scrubbed story | Progress-driven, scrub smoothing 0.3–0.8 s | Linear mapping; eases inside segments |
| Ambient loop | 6 s or longer per cycle | Sine in-out |

UI travel is 12–48 px. Text lines travel their own height inside a mask. Exits take about two thirds of their entrance.

## Choreography

- One load sequence, readable hero within 1.2 s: structure, subject, headline, supporting copy, actions, each overlapping the previous by most of its duration.
- Entrances play once per element; scrolling back up does not replay them unless the section is a scrubbed story.
- Vary the grammar by element type: masks for type, clips and scale for images, springs for objects, short fades for secondary copy. Fading everything in is a generated default.
- Stagger expresses order. Cap the total; use an accelerating stagger (`span × √(i / (n − 1))`) for large sets.
- Tiny overshoot on UI controls only; none on type or large objects.
- Nothing moves linearly except scrubbed progress and marquees.

## Load next

- [Stack and integration](references/stack-and-integration.md): pinned installs, the canonical GSAP + Lenis setup, React and Next.js, Astro, Vue, Svelte, no-build import maps, ScrollTrigger essentials, cleanup and performance.
- [Easing and timing](references/easing-and-timing.md): easing tokens with GSAP and Motion equivalents, springs, staggers, choreography templates, reading holds, and a tested math module (damping, springs, tracks, flood radius, log-space zoom, seeded random).
- [Scroll patterns](references/scroll-patterns.md): seventeen scroll patterns with code, CSS-native alternatives, reduced-motion rules and pitfalls.
- [Page transitions](references/page-transitions.md): cross-document and same-document View Transitions, shared elements, flood reveals, Barba, framework routers, intros and preloaders, focus after navigation.
- [Deterministic render](references/deterministic-render.md): seek-based engines for hero loops and launch films, frame capture, encoding, motion blur, contact sheets and loop checks.
- Deeper choreography: [motion intelligence](../motion-intelligence/SKILL.md), [cinematic web](../cinematic-web/SKILL.md), [interactive motion](../interactive-motion/SKILL.md), [fluid and kinetic type](../typography-system/references/fluid-and-kinetic-type.md).
