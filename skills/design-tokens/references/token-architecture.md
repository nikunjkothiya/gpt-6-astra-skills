# Token architecture

The files a premium site needs before any component: a spec, generated tokens, hand-authored semantic additions, and a base stylesheet. Adapt names to the project's conventions; keep the tiers.

## 1. The spec

`tokens.spec.json` is the single source for values that scripts can check:

```json
{
  "name": "Maison Veyr",
  "colors": {
    "ground": "#E8E3EA",
    "surface": "#DCD4E0",
    "ink": "#2A1C14",
    "muted": "#5C4F57",
    "accent": "#8F4F1A",
    "on-accent": "#FFF6EC"
  },
  "pairs": [
    ["ink", "ground", 7],
    ["muted", "ground", 4.5],
    ["ink", "surface", 7],
    ["muted", "surface", 4.5],
    ["on-accent", "accent", 4.5],
    ["accent", "ground", 4.5]
  ],
  "fonts": {
    "display": "\"Fraunces Variable\", \"Fraunces Fallback\", serif",
    "text": "\"Hanken Grotesk Variable\", system-ui, sans-serif"
  },
  "type": { "minSize": 17, "maxSize": 19, "minRatio": 1.2, "maxRatio": 1.333, "steps": [-1, 0, 1, 2, 3, 4, 5, 6] },
  "space": { "minSize": 16, "maxSize": 20 },
  "springs": {
    "snappy": { "stiffness": 320, "damping": 28, "points": 24 },
    "heavy": { "stiffness": 90, "damping": 19, "points": 24 }
  }
}
```

Colors accept `#hex`, `rgb()` and `oklch()`. `type` and `space` accept `minVw` and `maxVw` (defaults 360 and 1440). Set `"motion": false` to omit the default motion tokens.

## 2. Generated tokens

`node scripts/tokens.mjs css tokens.spec.json` prints (excerpt):

```css
:root {
  --color-ground: #E8E3EA;
  --color-ink: #2A1C14;
  --font-display: "Fraunces Variable", "Fraunces Fallback", serif;
  --step-0: clamp(1.0625rem, 1.0208rem + 0.1852vw, 1.1875rem);
  --step-6: clamp(3.1726rem, 2.0094rem + 5.1697vw, 6.6622rem);
  --space-m: clamp(1.5rem, 1.375rem + 0.5556vw, 1.875rem);
  --space-3xl: clamp(6rem, 5.5rem + 2.2222vw, 7.5rem);
  --dur-base: 240ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring-snappy: linear(0, 0.0543, 0.1788, 0.3309, 0.4835, 0.6212, 0.7369, 0.8286, 0.8975, 0.9468, 0.98, 1.0009, 1.0126, 1.018, 1.0193, 1.0181, 1.0156, 1.0127, 1.0097, 1.0071, 1.0049, 1.0032, 1.0019, 1);
  --dur-spring-snappy: 466ms;
}
```

Use a spring as `transition: transform var(--dur-spring-snappy) var(--ease-spring-snappy)`. The duration is part of the curve; do not pair a spring easing with another duration.

## 3. Semantic additions

Hand-authored tokens that reference the generated ones. Keep them in `tokens.css` after the generated block.

```css
:root, [data-theme], .theme-night {
  --color-line: color-mix(in oklch, var(--color-ink) 14%, var(--color-ground));
  --color-line-strong: color-mix(in oklch, var(--color-ink) 28%, var(--color-ground));
  --color-accent-hover: color-mix(in oklch, var(--color-accent), var(--color-ink) 14%);
  --color-accent-pressed: color-mix(in oklch, var(--color-accent), var(--color-ink) 24%);
  --color-selection: color-mix(in oklch, var(--color-accent) 24%, var(--color-ground));

  --shadow-raised:
    0 1px 1px color-mix(in oklch, var(--color-ink) 6%, transparent),
    0 6px 12px -4px color-mix(in oklch, var(--color-ink) 10%, transparent);
  --shadow-overlay:
    0 2px 4px color-mix(in oklch, var(--color-ink) 8%, transparent),
    0 24px 48px -12px color-mix(in oklch, var(--color-ink) 22%, transparent);
  --focus-color: var(--color-ink);
}

:root {
  --color-danger: #9E2A2B;
  --color-success: #2F6B3F;

  --margin: clamp(1.25rem, 5vw, 5rem);
  --gutter: clamp(1rem, 2vw, 1.5rem);
  --content: 72rem;
  --wide: 96rem;
  --measure: 65ch;
  --section-y: clamp(6rem, 12vw, 14rem);
  --header-h: 4.5rem;

  --radius-control: 999px;
  --radius-media: 2px;
  --radius-surface: 6px;

  --z-base: 0;
  --z-raised: 10;
  --z-sticky: 100;
  --z-header: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-cursor: 600;

  --focus-width: 2px;
  --focus-offset: 3px;
  --travel-s: 12px;
  --travel-m: 24px;
  --travel-l: 48px;
  --stagger: 60ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --travel-s: 0px;
    --travel-m: 0px;
    --travel-l: 0px;
    --stagger: 0ms;
    --dur-slow: 200ms;
    --dur-slower: 200ms;
    --dur-cinematic: 200ms;
  }
}
```

Derived color and shadow tokens are redeclared on each theme boundary so they resolve against that theme's inks and surfaces instead of inheriting root-computed values. Status colors are examples; verify each against its surfaces and override per theme where needed. Add actual pairs to the spec.

## 4. Base stylesheet

A reset with premium defaults. It assumes the tokens above.

```css
*, *::before, *::after { box-sizing: border-box; }

html {
  color-scheme: light;
  text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  scrollbar-gutter: stable;
  scroll-padding-top: calc(var(--header-h) + var(--space-s));
}

body {
  margin: 0;
  min-block-size: 100svh;
  background: var(--color-ground);
  color: var(--color-ink);
  font-family: var(--font-text);
  font-size: var(--step-0);
  line-height: 1.6;
  font-synthesis: none;
}

h1, h2, h3, h4 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  line-height: calc(1em + 0.5rem);
  text-wrap: balance;
}

p, li, figcaption { text-wrap: pretty; }
p { margin: 0; max-inline-size: var(--measure); }

img, picture, video, canvas, svg { display: block; max-inline-size: 100%; block-size: auto; }
input, button, textarea, select { font: inherit; color: inherit; }
button { cursor: pointer; }

a {
  color: inherit;
  text-decoration-thickness: from-font;
  text-underline-offset: 0.18em;
}

:focus-visible {
  outline: var(--focus-width) solid var(--focus-color);
  outline-offset: var(--focus-offset);
}

::selection { background: var(--color-selection); color: var(--color-ink); }

[hidden] { display: none !important; }

.visually-hidden:not(:focus):not(:active) {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.skip-link {
  position: absolute;
  inset-inline-start: var(--margin);
  inset-block-start: var(--space-s);
  z-index: var(--z-toast);
  padding: var(--space-2xs) var(--space-s);
  background: var(--color-ink);
  color: var(--color-ground);
  transform: translateY(-200%);
}

.skip-link:focus-visible { transform: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

The last rule makes CSS animations jump to their end states; JavaScript-driven motion (GSAP, Lenis, Motion, WebGL loops) needs its own reduced-motion branch ([motion engineering](../../motion-engineering/SKILL.md)).

## 5. Themes

Themes swap semantic tokens; components stay unchanged. A dark section inside a light page is a scoped theme:

```css
[data-theme="night"], .theme-night {
  color-scheme: dark;
  --color-ground: #16100D;
  --color-surface: #221915;
  --color-ink: #EFE6DC;
  --color-muted: #B5A89C;
  --color-accent: #D99A5B;
  --color-on-accent: #16100D;
  --focus-color: var(--color-ink);
  background: var(--color-ground);
  color: var(--color-ink);
}
```

For a page-wide theme change driven by scroll, toggle `data-theme` on `<body>` when a section becomes active and transition `background-color` and `color` over `var(--dur-slow)` ([scroll patterns](../../motion-engineering/references/scroll-patterns.md)).

## 6. Component tokens

```css
.button {
  --button-bg: var(--color-accent);
  --button-ink: var(--color-on-accent);
  --button-bg-hover: var(--color-accent-hover);
  --button-radius: var(--radius-control);
  --button-pad-block: 0.95em;
  --button-pad-inline: 1.5em;

  background: var(--button-bg);
  color: var(--button-ink);
  border-radius: var(--button-radius);
  padding: var(--button-pad-block) var(--button-pad-inline);
}

.button:hover { --button-bg: var(--button-bg-hover); }
.button[data-variant="quiet"] { --button-bg: transparent; --button-ink: var(--color-ink); }
```

Variants change component tokens, never property declarations scattered across selectors.

## 7. Tailwind CSS v4

In Tailwind v4, theme variables in `@theme` generate utilities (`--color-*` → `bg-*`, `text-*`; `--font-*` → `font-*`; `--text-*` → sizes; `--radius-*`, `--shadow-*`, `--ease-*`, `--breakpoint-*`). Reset the default palette so no default color can appear:

```css
@import "tailwindcss";

@theme {
  --color-*: initial;
  --color-ground: #E8E3EA;
  --color-surface: #DCD4E0;
  --color-ink: #2A1C14;
  --color-muted: #5C4F57;
  --color-accent: #8F4F1A;
  --color-on-accent: #FFF6EC;

  --font-display: "Fraunces Variable", "Fraunces Fallback", serif;
  --font-text: "Hanken Grotesk Variable", system-ui, sans-serif;

  --text-step-0: clamp(1.0625rem, 1.0208rem + 0.1852vw, 1.1875rem);
  --text-step-3: clamp(1.836rem, 1.5104rem + 1.447vw, 2.8127rem);
  --text-step-6: clamp(3.1726rem, 2.0094rem + 5.1697vw, 6.6622rem);

  --radius-media: 2px;
  --radius-control: 999px;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Then `class="bg-ground text-ink font-display text-step-6 ease-out-expo"`. Build class names from a finite map; string-concatenated class names are not discovered by the compiler.
