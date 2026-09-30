---
name: award-craft
description: Develop distinctive website concepts and refine their implementation through art direction, real content, a representative design slice and evidence-based critique. Use for original flagship, editorial, portfolio or launch sites and substantial creative redesigns; preserve the existing system for narrow UI repairs.
---

# Award Craft

Apply the complementary judgments of a creative director, designer, engineer, UX writer and QA reviewer. Make an idea visible in the actual artifact, then test whether it helps the audience. These are review perspectives; a single model can apply them. Neither role-play nor a numeric score establishes award quality.

Scale the process to the request. An original flagship can benefit from competing concepts and several refinement passes. A local repair should preserve identity and test the affected journey. A signature can be an excellent comparison, an image crop or a typographic relationship; motion, 3D and a literal metaphor are optional.

## Quality floor

Never trade these for effect.

1. **Real subject first.** Use the actual product, copy, imagery and actions. Clarify a missing subject when it changes the work; invent one only for an authorized concept exercise. Never invent testimonials, clients, logos, awards, metrics or scarcity. Label illustrative data as an example.
2. **A coherent organizing idea.** Concentrate expression in a relationship the subject can support. Let ordinary sections and states reinforce it without repeating an effect everywhere.
3. **Typography carries identity.** Choose a face deliberately, not the default you would use anywhere; set a fluid scale, body 16–20 px, measure 45–75 characters.
4. **Palette by role, contrast verified.** Text ≥ 4.5:1, large text and UI parts ≥ 3:1. Check pairs with `node scripts/tokens.mjs contrast <fg> <bg>`.
5. **Motion with a job.** Animate transform, opacity and clip-path; one owner per property; a complete reduced-motion path. Smooth scrolling never breaks keyboard, anchors, find-in-page or back navigation.
6. **Performance is design.** Use LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1 as starting goals, then state measurement conditions. Lab observations are not field-percentile results. Keep useful content available while assets load.
7. **Mobile is its own composition.** Design 320–1920 px and beyond, use dynamic viewport units, and give every hover a touch and focus equivalent.
8. **Every state designed.** Hover, focus-visible, active, disabled, loading, empty, error, success and failed media.
9. **Accessible by construction.** Landmarks, skip link, logical focus order, alt text, labels, targets ≥ 24 px (44 px for primary touch), usable at 200 % text size.
10. **Finished details in scope.** For a complete site, review favicon, share image, 404 and metadata using the [polish checklist](references/polish-checklist.md). A component repair does not require adding pages.
11. **Verified in a browser.** Judge rendered pages and playback, not code. Report what was observed and what was not.

## Operating procedure

Each gate is a check you perform, not a pause for approval, unless the user asked to review a stage.

| Phase | Output (keep in context unless a file is requested) | Gate |
| --- | --- | --- |
| 1 Brief | Brief card: audience, their job, primary action, subject, content inventory, assets and rights, stack, devices | Ask once, together, for missing essentials; fill routine gaps with stated defaults |
| 2 Organizing idea | A relationship from the subject: comparison, imagery, type, structure or an optional metaphor | It guides visible choices and helps the audience; body copy stays plain |
| 3 Directions | Where identity is open, compare a few meaningfully different concepts using real content | Select for fit, distinctiveness, feasibility and scope; retain useful conventions |
| 4 Design plan | Relevant fields from the template below, with real values | Use [anti-generic patterns](../visual-direction/references/anti-generic-patterns.md) to challenge unsupported defaults, not supplied brand choices |
| 5 Foundation | Tokens, fonts, grid, base elements, motion setup with a reduced-motion branch | Contrast pairs pass, fonts load with metric fallbacks, no layout shift |
| 6 Representative slice | The opening, one ordinary content unit and the primary action; include the risky signature if relevant | Coherent on phone and desktop before extending the same decisions |
| 7 Complete | Every section and component in all states | No unapproved placeholder remains |
| 8 Critique loop | Evidence, defect table, scores, three worst problems, fixes | Delivery rule below |

When work spans sessions, keep a short `DECISIONS.md` in the target project with settled names, numbers, colors and approved copy, so a later pass does not "improve" them back. Keep claims and numbers in `FACTS.md` with their sources ([studio process](references/studio-process.md)).

## Decide the style axes from the subject

Infer each axis from subject, audience and brand, and state the result as one line at the top of the plan: "Style: … because …". A supplied brand guide or reference wins over inference.

| Axis | Options | Decide from |
| --- | --- | --- |
| Brightness | light, dark, mid-tone, color block per section | context of use, brand, imagery |
| Texture | flat, grain, paper fibre, halftone, glass, noise field | the material of the subject |
| Chrome | none, masthead, page counter, technical HUD | corner coordinates and HUD labels only for genuinely technical subjects |
| Type voice | editorial serif, grotesque, condensed, wide, rounded, mono accents | formal, precise, declarative or warm voice |
| Entrance grammar | mask rise, clip reveal, spring in, type-on, crossfade | energy; vary by element type |
| Easing family | expo or quart out, springs (snappy, default, heavy) | mass: heavy for luxury objects and type, snappy for UI |
| Transition family | curtain, shared element, flood, crossfade, wipe | the same world as the chrome |
| Sound | none (default), opt-in ambience, UI ticks | pages start silent; sound is always user-initiated |
| Palette structure | one ground, two inks, one or two accents; or color blocks | subject materials and imagery |

## Design plan template

```text
DESIGN PLAN · <project>
Style: <one line> because <reason>
Audience / job / primary action:
Organizing idea: <subject-specific relationship; metaphor optional>; appears in: <visible decisions>
Thesis: <product> as <organizing idea>, so that <user benefit>.
Signature moment: <what, where, input, scroll range or duration, fallback>
Directions, if identity is open: <alternatives> → chosen <X> because <…>
Palette: ground … surface … ink … ink-muted … accent … on-accent … focus … (pairs checked: …)
Type: display <face, weights/axes, tracking> · text <face> · numerals/labels <feature or face>
      scale <ratio mobile → desktop> · body <px> · measure <ch>
Grid & space: columns, margin clamp, gutter, section rhythm, radius policy, elevation policy
Motion: easing tokens, durations, load choreography (readable hero ≤ 1.2 s), scroll beats,
        micro-interaction rules, reduced-motion plan
Imagery / 3D: art direction (crop, light, grade), formats, procedural elements
Components: <list, with the states each needs>
Layouts: ASCII wireframes, desktop and mobile, for the hero and two key sections
Budgets: LCP, INP, CLS, JS, image and font bytes; devices to test
Risks: the largest uncertainty and how the signature slice will test it
```

## Default stack

Keep the project's stack when one exists. For a new build choose by need, then read [motion engineering](../motion-engineering/SKILL.md) for setup code.

| Need | Default |
| --- | --- |
| Marketing, editorial or portfolio site | Astro or Vite; Next.js when the product already uses React. CSS custom properties or Tailwind v4 `@theme` |
| Scroll stories, split text, timelines | GSAP with ScrollTrigger and SplitText when needed; verify installed APIs and license. Lenis only when wheel smoothing improves the narrative |
| React UI transitions, layout and gestures | Motion for React |
| Simple reveals, progress, page transitions | CSS first: transitions, `@starting-style`, scroll-driven animations, View Transitions |
| A visual signature without model files | Shader fields, DOM-synced WebGL planes, SVG filters, procedural geometry: [procedural WebGL](../procedural-webgl/SKILL.md) |

## Critique loop and delivery rule

Builders overrate their own first pass. Review as a harsh creative director, not a proud author, using the [jury rubric](references/jury-rubric.md).

1. **Capture evidence.** Use the host's browser or the optional package helpers described below. Inspect the images and actual interactions; a screenshot strip cannot prove smooth playback.
2. **Review independently when useful.** If delegation is available and authorized, give a reviewer the brief, rubric and evidence without your scores. Otherwise record `Reviewer: self`. Do not require agents for ordinary work.
3. **Defects first.** Record PASS, FAIL, UNOBSERVED or NOT APPLICABLE with conditions and evidence. Missing tools create an evidence limit, not an invented defect or pass.
4. **Judge the idea and execution separately.** Explain what is distinctive and useful. Optional 1–10 scores apply only to observed criteria; they are internal judgments, not predicted award results.
5. **Fix the most consequential findings**, then inspect the affected states again. If the concept itself is weak, revisit the organizing idea instead of layering effects onto it.
6. **Deliver** when the requested task works and material findings are resolved. Additional rounds need a remaining finding or changed requirement. For open-ended flagship polish, timebox optional exploration; disclose outstanding observations and defects.

## Optional package helpers

Commands using `scripts/` are relative to this package, not the target application. Resolve the package location first. From the target project use `node "<package-root>/scripts/tokens.mjs" contrast "#111111" "#ffffff"` or `node "<package-root>/scripts/audit.mjs" .`. The token helper checks declared pairs; the audit reports source heuristics, including false positives, rather than certifying accessibility or aesthetics.

`node "<package-root>/scripts/capture.mjs" --url <url> --out <new-evidence-directory>` uses Playwright and a browser supplied by the host/project. Read `--help`; optional axe checks also require axe-core. These dependencies are not installed by the skills package. Without them, use available browser tools or mark the relevant checks unobserved. MCP serves instructions and does not execute these helpers.

## Load next

- [Studio process](references/studio-process.md): brief card, finding the world, divergent directions, copy and facts, asset sourcing, build order, full-treatment mode.
- [Jury rubric](references/jury-rubric.md): criteria, the defect table, scoring bands and the review log.
- [Polish checklist](references/polish-checklist.md): finishing details that separate winners from honorable mentions.
- [Worked example](references/worked-example.md): a complete plan, storyboard and verification record for a fictional fragrance house.
- Direction: [visual direction](../visual-direction/SKILL.md), [site archetypes](../visual-direction/references/site-archetypes.md), [trend radar 2026](../visual-direction/references/trend-radar-2026.md).
- Values: [typography system](../typography-system/SKILL.md), [color system](../color-system/SKILL.md), [design tokens](../design-tokens/SKILL.md).
- Build: [component craft](../component-craft/SKILL.md), [motion engineering](../motion-engineering/SKILL.md), [procedural WebGL](../procedural-webgl/SKILL.md).
- Finish: [visual accessibility](../visual-accessibility/SKILL.md), [visual QA](../visual-qa/SKILL.md).

With a small context window, load this skill with typography-system, color-system, motion-engineering and component-craft, and open references only when a decision needs them.

The critique protocol, style axes, world metaphor and facts ledger adapt ideas from the MIT-licensed [motion-graphic-skill](https://github.com/JakeB-5/motion-graphic-skill) and [claude-motion-design](https://github.com/howseen-ai/claude-motion-design) to websites.
