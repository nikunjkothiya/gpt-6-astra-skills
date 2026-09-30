# Color science for interfaces

Implementation details for the [color system](../SKILL.md).

## OKLCH in one paragraph

`oklch(L C H)` describes lightness (0–1, perceptually even), chroma (0 to about 0.37 in practice; sRGB holds less at most hues) and hue in degrees. Equal changes of L look like equal changes of lightness, which HSL does not provide: HSL yellow and HSL blue at the same "lightness" look nothing alike. Build ramps, states and themes by moving L and C while holding H, and convert or check any value with:

```text
node scripts/tokens.mjs convert "#8F4F1A" "oklch(0.72 0.12 60)"
```

The tool reports the sRGB hex and notes when chroma had to be reduced to fit sRGB.

## A ramp from one brand color

A useful 11-step ramp holds hue, peaks chroma in the middle and falls toward both ends:

| Step | L | Chroma factor | Typical use |
| --- | --- | --- | --- |
| 50 | 0.98 | 0.15 | Ground tint |
| 100 | 0.95 | 0.25 | Surface tint |
| 200 | 0.90 | 0.45 | Hover surface |
| 300 | 0.82 | 0.70 | Borders on tinted areas |
| 400 | 0.72 | 0.90 | Large decorative type |
| 500 | 0.62 | 1.00 | Accent on dark grounds |
| 600 | 0.52 | 1.00 | Accent on light grounds |
| 700 | 0.43 | 0.90 | Pressed state, links on tints |
| 800 | 0.34 | 0.75 | Dark accents |
| 900 | 0.25 | 0.55 | Ink tint |
| 950 | 0.18 | 0.40 | Dark ground tint |

With relative color syntax the ramp follows a single token:

```css
:root {
  --brand: oklch(0.52 0.14 55);
  --brand-50: oklch(from var(--brand) 0.98 calc(c * 0.15) h);
  --brand-100: oklch(from var(--brand) 0.95 calc(c * 0.25) h);
  --brand-200: oklch(from var(--brand) 0.90 calc(c * 0.45) h);
  --brand-700: oklch(from var(--brand) 0.43 calc(c * 0.9) h);
  --brand-900: oklch(from var(--brand) 0.25 calc(c * 0.55) h);
}
```

A slight hue shift toward warm in dark steps and toward cool in light steps often looks more natural than a fixed hue; verify each step used for text.

## Mixing, themes and automatic text color

```css
:root {
  color-scheme: light dark;
  --ground: light-dark(oklch(0.96 0.01 80), oklch(0.18 0.012 60));
  --ink: light-dark(oklch(0.22 0.02 60), oklch(0.93 0.012 80));
  --accent: light-dark(oklch(0.50 0.12 55), oklch(0.74 0.11 62));
  --hover: color-mix(in oklch, var(--accent), var(--ink) 14%);
}

[data-theme="light"] { color-scheme: light; }
[data-theme="dark"] { color-scheme: dark; }

.badge {
  background: var(--accent);
  color: var(--on-accent, white);
}

@supports (color: contrast-color(red)) {
  .badge { color: contrast-color(var(--accent)); }
}
```

`light-dark()` follows the used `color-scheme`, so a theme toggle can change `color-scheme`. `contrast-color()` selects black or white; verify the result against the intended text size and enhanced contrast target. Feature-detect it and check [current browser support](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/contrast-color) for the project's browser matrix.

Wide gamut as an enhancement:

```css
@media (color-gamut: p3) {
  :root { --accent-vivid: oklch(0.64 0.24 30); }
}
```

Keep the sRGB value as the default and use P3 only for accents and imagery where the extra saturation is part of the identity.

## Contrast math

WCAG 2 relative luminance converts each sRGB channel to linear light (`c ≤ 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ^ 2.4`), weights them `0.2126 R + 0.7152 G + 0.0722 B`, and compares two luminances as `(L1 + 0.05) / (L2 + 0.05)`. The package tool implements exactly this; transparent colors must be composited over their real backdrop first.

Related WCAG 2.2 criteria: 1.4.3 text contrast (AA), 1.4.6 enhanced contrast (AAA), 1.4.11 non-text contrast (AA: 3:1 for control boundaries, icons, focus indicators), 2.4.11 focus not obscured (AA), 2.4.13 focus appearance (AAA). Formal conformance needs manual testing with assistive technology and an expert review.

## Text over images and video

1. Choose the crop so text sits over a calm region at every breakpoint (`object-position` per breakpoint).
2. Add a scrim sized to the text block, not a full-screen darkening:

```css
.media-caption {
  background: linear-gradient(to top, color-mix(in oklch, var(--ink) 62%, transparent), transparent);
  padding-block: 6rem 1.5rem;
}
```

3. Measure contrast at the least favorable background behind each line across relevant video or slideshow frames: brightest for light text, darkest for dark text. Use computed foreground colors rather than antialiased glyph-edge pixels.
4. Under `prefers-reduced-transparency: reduce`, replace translucent panels with solid ones.

## Grain and dithering

A static grain overlay from an inline SVG turbulence filter adds texture without an image request:

```css
.grain::after {
  content: "";
  position: fixed;
  inset: -50%;
  pointer-events: none;
  z-index: var(--z-grain, 2);
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}
```

Use only enough texture to support the image; verify that it does not dirty text or alter product color. Animated grain stops under reduced motion and when hidden. For WebGL gradients, consider dithering as described in [shaders and optics](../../cinematic-web/references/shaders-and-optics.md).

## Duotone imagery

An SVG filter maps an image's luminance onto two palette colors, unifying mixed photography:

```html
<svg width="0" height="0" aria-hidden="true" focusable="false">
  <filter id="duotone" color-interpolation-filters="sRGB">
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer>
      <feFuncR type="table" tableValues="0.165 0.910"/>
      <feFuncG type="table" tableValues="0.110 0.890"/>
      <feFuncB type="table" tableValues="0.078 0.918"/>
    </feComponentTransfer>
  </filter>
</svg>
```

```css
.duotone { filter: url(#duotone); }
```

Each `tableValues` pair is the shadow and highlight channel in 0–1 (here ink #2A1C14 to ground #E8E3EA). Never apply it to product images whose color must be accurate.

## Color vision and meaning

- Never carry state by hue alone: pair color with an icon, label, pattern or position.
- Check designs with the browser's vision-deficiency emulation (Chrome DevTools rendering panel) for protanopia, deuteranopia, tritanopia and achromatopsia.
- Red and green for bad and good need a second cue; so do chart series.

## Measuring rendered color

Tokens can drift once light, blending or grading is applied. Compare a flat rendered swatch with the intended token under matched color-management and capture conditions. Sample multiple flat regions; single pixels may include noise and antialiasing. A perceptual distance can flag differences, but a universal threshold cannot certify product color accuracy across lighting, displays and profiles.

The contrast thresholds and unrounded pass/fail comparison follow [WCAG text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Token checks establish declared opaque color pairs only; inspect composited backgrounds, states and actual legibility separately.
