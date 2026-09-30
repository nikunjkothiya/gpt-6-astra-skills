---
name: typography-system
description: Choose, pair, scale, load and animate typefaces for premium websites - voice-led font selection, pairings, fluid type scales, line height, tracking, measure, OpenType features, variable axes, font loading without layout shift, and accessible kinetic type. Use when choosing fonts, building or repairing a type scale, fixing type that looks generic, cramped or unbalanced, or animating headlines.
---

# Typography System

Typography carries most of a premium site's identity and nearly all of its content. Choose faces for the subject's voice, set a small system of roles, and make every role hold at every size, language and zoom level. Treat display type as an active part of the composition, not a neutral container for words.

The optional `scripts/tokens.mjs` commands below run from this package root. From a target project, use `node "<package-root>/scripts/tokens.mjs"` with the resolved absolute path. If only Markdown is available, use the scale math in the references or the project's existing tooling; do not claim to have run the helper.

## Procedure

1. **Define roles.** Display, heading, text, label, numeric and, when needed, code. Use one family with range, or two clearly distinct families, plus a mono only for code or measured data.
2. **Choose the voice.** Match the subject's voice to structural traits (table below), then pick candidates from the [font library](references/font-library.md). Avoid the default you would use for any project.
3. **Test with real words.** Set the actual headline, a paragraph, a price, a button and a caption at delivery sizes, in every target language. Check accents, currency symbols, figures, italics and the weights you need.
4. **Pair by contrast and kinship.** Contrast structure (serif and sans, width, weight) while matching proportions (x-height, aperture, rhythm). Two faces that look alike but are not the same read as a mistake.
5. **Build the scale.** Generate fluid steps with `node scripts/tokens.mjs type`; choose ratios from the table below. Name hero display sizes as explicit exceptions outside the scale.
6. **Set rhythm.** Line height and tracking by size, measure 45–75 characters, more space above a heading than below it.
7. **Finish the details.** OpenType features, numerals, punctuation, wrapping and optical alignment: see [fluid and kinetic type](references/fluid-and-kinetic-type.md).
8. **Load without shifting.** Self-host WOFF2, subset, preload one or two files, use `font-display`, and match fallback metrics.
9. **Animate with restraint.** Mask reveals for display lines, one kinetic moment per view, real text always present for assistive technology.
10. **Verify.** Squint at the page, zoom text to 200 %, test the longest language, check contrast and layout shift, and view the loaded fonts in screenshots.

## Voice to structure

| Voice | Structural traits | Free options | Licensed options |
| --- | --- | --- | --- |
| Heritage, craft | Old-style or transitional serif, moderate contrast | EB Garamond, Libre Caslon, Newsreader | Tiempos, Publico |
| Precision, engineering | Grotesque or neo-grotesque, even color, tabular figures | Schibsted Grotesk, Hanken Grotesk, Geist | Suisse Int'l, ABC Diatype, GT America |
| Fashion, statement | High-contrast didone or sharp display serif, extreme sizes | Bodoni Moda, Italiana | PP Editorial New, Canela, GT Sectra |
| Warmth, hospitality | Soft or rounded serif, generous curves | Fraunces with SOFT, Gloock, Young Serif, Zodiak | Canela |
| Energy, culture | Variable width display, condensed or extended | Anybody, Archivo, Big Shoulders Display, Bricolage Grotesque, Unbounded | ABC Monument Grotesk, Druk, ABC Whyte |
| Clarity, technology | Open humanist or geometric sans | Instrument Sans, Onest, Figtree | Söhne |
| Experimental, art | Idiosyncratic libre display faces | Karrik, Basteleur, Sligoil | Foundry specials |

## Starting values

Replace with measured values for the chosen faces; x-height and width change what "large" means.

| Role | Size | Line height | Tracking | Weight |
| --- | --- | --- | --- | --- |
| Hero display | Named exception, e.g. `clamp(3.5rem, 1.54rem + 8.7vw, 9.4rem)` | 0.9–1.0 | −0.02 to −0.045 em | Serif light to regular; grotesque medium to bold |
| H1 | step 5–6 | 1.0–1.1 | −0.02 em | By voice |
| H2 | step 3–4 | 1.1–1.2 | −0.01 em | By voice |
| H3 | step 1–2 | 1.2–1.3 | 0 | Medium |
| Body | step 0: 16–20 px | 1.5–1.7 (serif text slightly more) | 0 | Regular |
| Small, caption | step −1: 13–15 px, never below 12 px | 1.4–1.5 | +0.01 em | Regular |
| Uppercase label (when it carries information) | 12–14 px | 1.2 | +0.06 to +0.12 em | Medium |
| Numbers in tables and prices | as context | as context | 0 | `font-variant-numeric: tabular-nums` |

A fluid heading line height that tightens as size grows: `line-height: calc(1em + 0.5rem)` (1.5 at 16 px, 1.25 at 32 px, 1.08 at 96 px).

| Context | Ratio at 360 px | Ratio at 1440 px |
| --- | --- | --- |
| Dense product UI | 1.125 | 1.2 |
| Marketing and portfolio | 1.2 | 1.25–1.333 |
| Editorial and luxury | 1.2 | 1.333–1.414, with hero exceptions |

## Rules that separate premium from generic

- Expression lives in display type; reading text stays calm and comfortable.
- Headline line breaks are authored: `text-wrap: balance`, then check each break against phrase structure in the actual font.
- Never fake styles: load the italic and weights you use and set `font-synthesis: none`.
- Real typographic characters: curly quotes, en dashes in ranges, ×, non-breaking spaces before units.
- Avoid template tells: an all-caps tracked eyebrow above every heading, one accented word per headline, monospace labels as decoration.
- Fluid sizes always include a `rem` term so text zoom works; never size text with `vw` alone.
- Kinetic type never hides content from assistive technology and never delays reading beyond one short entrance.

## Load next

- [Font library](references/font-library.md): curated free and licensed faces by voice, overused defaults, twenty pairings with settings, loading snippets.
- [Fluid and kinetic type](references/fluid-and-kinetic-type.md): scale math, container-fitted display, micro-typography CSS, split-text reveals, scroll-scrubbed axes, marquees, accessibility rules.
- Related: [type, color and layout implementation](../visual-composition/references/type-color-layout.md), [design tokens](../design-tokens/SKILL.md), [motion engineering](../motion-engineering/SKILL.md).
