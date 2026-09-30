---
name: color-system
description: Build palettes for premium websites from the subject - role-based palettes in OKLCH, colors sampled from photography, light and dark themes, state and status colors, gradients without muddy midpoints, grain, and verified WCAG contrast. Use when choosing or repairing colors, creating themes, fixing low contrast, muddy dark modes, generic gradients, or brand colors that fight the imagery.
---

# Color System

Color should come from the subject: its materials, places, products and photography. Assign every color a job, verify every text pair, and let one accent do the work in any given view.

## Procedure

1. **Collect evidence.** Brand colors, product colors that must stay accurate, photography, materials, the context of use (bright shop floor, dark bar, phone in sunlight).
2. **Sample from imagery.** Take the brightest lit patch that is free of glare, away from corners and shadows, then lift it toward the material's own color: a shaded sample renders far darker than the surface really is. Name every swatch after its source ("Orris gray", "Labdanum") so the palette stays tied to the subject.
3. **Choose a structure.** Tonal (one hue family and an accent), monochrome with one accent, complementary accent, per-section color blocks, or duotone imagery. Start from the closest entry in the [palette library](references/palette-library.md) when the brand has no palette.
4. **Assign roles.** ground, surface, ink, muted, line, accent, on-accent, focus, and status colors (success, warning, danger, info). The accent marks actions and selection; decoration does not borrow it.
5. **Build in OKLCH.** Lightness steps are approximately perceptually uniform; lower chroma toward very light and dark steps, and verify contrast separately. Keep colors in sRGB unless a P3 enhancement is deliberate ([color science](references/color-science.md)).
6. **Verify contrast.** Use the package's `scripts/tokens.mjs contrast <fg> <bg>` or a palette file with `check`. Resolve the helper from the package root; it may not exist in a target project's working directory. For images/video, check the lowest-contrast background behind the actual text throughout relevant frames: bright regions challenge light text, dark regions challenge dark text.
7. **Tune the dark theme separately.** Never invert. See the rules below.
8. **Derive states** with `color-mix()` from the roles instead of picking new colors per component.
9. **Grade the imagery** to the palette's temperature so photographs and interface feel like one world.

## Contrast targets (WCAG 2.2)

| Content | Minimum (AA) | Enhanced (AAA) |
| --- | --- | --- |
| Body and small text | 4.5:1 | 7:1 |
| Large text: at least 24 px, or 18.66 px bold | 3:1 | 4.5:1 |
| UI component boundaries, icons, focus indicators, meaningful graphics | 3:1 | — |

Premium sites target 7:1 for body text; muted text never drops below 4.5:1. Placeholder text is not a label. APCA, the candidate method for WCAG 3, is useful as an advisory second opinion; WCAG 2 ratios remain the conformance test.

## Roles and starting lightness

| Role | Light theme (OKLCH L) | Dark theme (OKLCH L) | Notes |
| --- | --- | --- | --- |
| ground | 0.93–0.98 | 0.14–0.22 | A little chroma from the subject beats neutral gray |
| surface | ground − 0.03 to 0.06 | ground + 0.03 to 0.06 | Separate by tone, not shadow, in dark themes |
| ink | 0.15–0.28 | 0.90–0.95 | Avoid pure white text on pure black for long reading |
| muted | 0.40–0.50 | 0.70–0.78 | Verify 4.5:1 on every surface it sits on |
| line | mix ink 12–16 % into ground | mix ink 14–20 % into ground | Borders, dividers, input outlines (3:1 when they identify a control) |
| accent | by brand; 4.5:1 on ground for link text | lower chroma or lightness to avoid vibration | One accent per view |
| on-accent | usually ground or white | usually ground or near-black | 4.5:1 on accent |
| focus | accent or ink | accent or ink | 3:1 against adjacent colors, 2 px or more |

## Dark themes

- Lift surfaces by lightness steps of 0.03–0.05 per elevation level; shadows barely read on dark grounds.
- Tune text brightness and weight in the loaded font. Do not automatically reduce thin strokes: verify that small text and display hairlines remain legible on actual screens.
- Desaturate large dark areas; saturated accents at full chroma vibrate against near-black.
- Keep product colors in photographs untouched; adjust the interface around them.
- Use `color-scheme: dark` so scrollbars and form controls follow.

## Gradients, grain and imagery

- Interpolate in OKLCH to avoid gray midpoints: `linear-gradient(in oklch, var(--a), var(--b))`. Keep gradients between neighboring hues, or give the transition a reason (sky, heat, time).
- Add 2–4 % grain or dithering to large gradients to prevent banding.
- Text over imagery needs a readable backing: a scrim gradient, a solid band, or a crop that places text over a calm region. Measure the lowest-contrast area behind every line.
- Duotone or tinted imagery is a strong unifier for weak or mixed photography.

## Load next

- [Palette library](references/palette-library.md): sixteen verified palettes with roles, use cases and derived state tokens.
- [Color science](references/color-science.md): OKLCH ramps, relative colors, `color-mix()`, `light-dark()`, `contrast-color()`, P3, contrast math, grain, color-vision checks and measuring rendered colors.
- Related: [typography system](../typography-system/SKILL.md), [design tokens](../design-tokens/SKILL.md), [visual accessibility](../visual-accessibility/SKILL.md), [compositing and blending](../rendering-judgment/references/compositing-and-blending.md).
