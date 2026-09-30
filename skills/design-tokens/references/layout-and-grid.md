# Layout and grid

Grids that produce editorial, asymmetric and still orderly pages. Every pattern uses the layout tokens from [token architecture](token-architecture.md): `--margin`, `--gutter`, `--content`, `--wide`, `--measure`, `--section-y`.

## Breakout page grid

Named lines let any child sit in the reading column, a wider column or full bleed without wrappers:

```css
.page {
  --content-width: min(var(--content), 100% - 2 * var(--margin));
  display: grid;
  grid-template-columns:
    [full-start] minmax(var(--margin), 1fr)
    [wide-start] minmax(0, calc((var(--wide) - var(--content)) / 2))
    [content-start] var(--content-width) [content-end]
    minmax(0, calc((var(--wide) - var(--content)) / 2)) [wide-end]
    minmax(var(--margin), 1fr) [full-end];
}

.page > * { grid-column: content; }
.page > .wide { grid-column: wide; }
.page > .full { grid-column: full; }
```

## Twelve columns with subgrid

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--gutter);
}

.grid-12 > .row {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}
```

Subgrid keeps nested items (captions, prices, buttons) on the parent's rails, which is what makes a page feel engineered.

## Asymmetric compositions

A 5/7 split with a caption hanging on the media's rail:

```css
.split {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--space-l) var(--gutter);
  align-items: end;
}

.split .title { grid-column: 1 / 6; }
.split .media { grid-column: 7 / 13; }
.split .caption { grid-column: 7 / 10; color: var(--color-muted); }

@media (max-width: 48rem) {
  .split :is(.title, .media, .caption) { grid-column: 1 / -1; }
}
```

Title overlapping media, sharing grid rows instead of absolute positioning:

```css
.overlap {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: 1fr auto;
}

.overlap .media { grid-column: 4 / 13; grid-row: 1 / 3; }
.overlap .title { grid-column: 1 / 9; grid-row: 2; z-index: var(--z-raised); padding-block-end: var(--space-l); }
```

Check contrast wherever type crosses the image, at every breakpoint.

## Sticky split

Media stays while text scrolls past; a strong pattern for product stories and process chapters.

```css
.sticky-split {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--gutter);
}

.sticky-split .media {
  position: sticky;
  top: var(--header-h);
  block-size: calc(100svh - var(--header-h));
}

.sticky-split .chapters > * { min-block-size: 80svh; display: grid; align-content: center; }

@media (max-width: 48rem) {
  .sticky-split { grid-template-columns: 1fr; }
  .sticky-split .media { position: relative; top: auto; block-size: 60svh; }
}
```

`position: sticky` fails silently when an ancestor sets `overflow: hidden`; use `overflow: clip` for clipping ancestors.

## Horizontal rail with native scrolling

```css
.rail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min(80%, 26rem);
  gap: var(--gutter);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--margin);
  padding-inline: var(--margin);
  scrollbar-width: thin;
}

.rail > * { scroll-snap-align: start; }
```

Pair it with previous and next buttons that call `scrollBy({ left: ±card width, behavior: 'smooth' })`, and keep every card focusable in order. For a scroll-driven horizontal passage, use [scroll patterns](../../motion-engineering/references/scroll-patterns.md).

## Masonry with a fallback

```css
.masonry {
  columns: 3 18rem;
  column-gap: var(--gutter);
}

.masonry > * {
  break-inside: avoid;
  margin-block-end: var(--gutter);
}

@supports (display: grid-lanes) {
  .masonry {
    display: grid-lanes;
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    gap: var(--gutter);
    columns: auto;
  }

  .masonry > * { margin: 0; }
}
```

`display: grid-lanes` ships in Safari 26.4; columns order items top-to-bottom, so keep meaningful reading order in the DOM.

## Bento, when it fits

Use bento only for heterogeneous items that benefit from side-by-side scanning. Wrap the grid in `.bento-region`; the outer container controls column spans while each tile controls its content layout. Keep source and focus order coherent when using dense packing:

```css
.bento-region { container: bento-region / inline-size; }
.bento {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  grid-auto-flow: dense;
  gap: var(--gutter);
}

.bento > * { container-type: inline-size; }

@container bento-region (width > 36rem) {
  .bento > .feature { grid-column: span 2; grid-row: span 2; }
}

@container (width > 28rem) {
  .tile-body { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-m); }
}
```

## Rhythm

```css
.section { padding-block: var(--section-y); }
.flow > * + * { margin-block-start: var(--flow-space, 1em); }
.flow > :is(h2, h3) { --flow-space: 1.8em; }
.flow > :is(h2, h3) + * { --flow-space: 0.6em; }
```

Space inside a group is always smaller than space between groups. Headings sit closer to the text they introduce than to the text before them.

## Full-height sections

```css
.fullscreen {
  min-block-size: 100svh;
  display: grid;
  align-content: end;
  padding: var(--space-l) var(--margin);
}

@media (max-height: 32rem) and (orientation: landscape) {
  .fullscreen { min-block-size: auto; padding-block: var(--space-2xl); }
}
```

`svh` stays stable while mobile browser bars move; `dvh` follows them and can cause jumps during scroll.

## Media frames

```css
.frame { aspect-ratio: 4 / 5; overflow: clip; border-radius: var(--radius-media); }
.frame > :is(img, video) { inline-size: 100%; block-size: 100%; object-fit: cover; object-position: var(--focus, 50% 50%); }
```

Set `--focus` per image and breakpoint so crops keep the subject.

## ASCII layout library

Starting compositions; choose by content, then adapt.

```text
A. Type-led hero                      B. Full-bleed media hero
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ nav                          │      │ nav (over media, legible)    │
│                              │      │                              │
│ HUGE DISPLAY LINE            │      │        [ media ]             │
│ second line                  │      │                              │
│            short lede · CTA  │      │ Title               CTA      │
└──────────────────────────────┘      └──────────────────────────────┘

C. Split 5/7                          D. Object theatre
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ Title        │               │      │ caption          spec        │
│ lede         │   [ media ]   │      │         ( object )           │
│ CTA          │   caption     │      │ title                  CTA   │
└──────────────────────────────┘      └──────────────────────────────┘

E. Index hero                         F. Collage
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ Studio name                  │      │   [img]      [img]           │
│ ──────────────────────────── │      │ TITLE ACROSS THE COLLAGE     │
│ Project one        2026      │      │        [img]       [img]     │
│ Project two        2025      │      │ lede                 CTA     │
└──────────────────────────────┘      └──────────────────────────────┘

G. Manifesto                          H. Sticky split
┌──────────────────────────────┐      ┌──────────────────────────────┐
│                              │      │ [ media  ] │ chapter one     │
│  A long statement set large, │      │ [ sticky ] │ chapter two     │
│  filling as it scrolls.      │      │ [        ] │ chapter three   │
└──────────────────────────────┘      └──────────────────────────────┘

I. Horizontal passage                 J. Specification sheet
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ title │ [ ] [ ] [ ] [ ] →    │      │ Case        │ 40 mm steel    │
│       │  pinned, scrubbed    │      │ Movement    │ Calibre V-7    │
└──────────────────────────────┘      │ Reserve     │ 70 h           │
                                      └──────────────────────────────┘
K. Gallery mosaic                     L. Closing
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ [ big      ] [s] [s]         │      │  One last line, large.       │
│ [ big      ] [ wide    ]     │      │  [ Primary action ]          │
│ [s] [s] [ tall ]             │      │  footer index · legal        │
└──────────────────────────────┘      └──────────────────────────────┘
```

On phones each composition becomes its own arrangement: re-order by importance, keep the primary action in the thumb zone, and give media full width rather than shrinking the desktop layout.
