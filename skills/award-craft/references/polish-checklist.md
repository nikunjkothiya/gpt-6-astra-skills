# Polish checklist

The details jurors notice after the first impression. Run this after the page is complete and before the final critique round. Each line is a check with a pass condition; skip lines that do not apply and say so.

## Global

- [ ] `<html lang>` set; one `<h1>` per page naming its subject; landmarks `header`, `nav`, `main`, `footer`.
- [ ] Skip link is the first focusable element and becomes visible on focus.
- [ ] Selection color set with `::selection` in brand colors and readable contrast.
- [ ] Focus ring from tokens on every interactive element: ≥ 2 px, offset, ≥ 3:1 against its surroundings.
- [ ] Scrollbar considered: `scrollbar-gutter: stable` where overlays toggle; `scrollbar-color` on dark themes.
- [ ] `color-scheme` declared, so form controls and scrollbars match light or dark themes.
- [ ] `-webkit-tap-highlight-color: transparent` only when a visible pressed state replaces it.
- [ ] No unintended page overflow at delivery widths. Necessary local table/diagram scrolling is labeled and usable.
- [ ] Cursor styles: pointer only on actions; text cursor preserved on text and inputs.
- [ ] Print styles for legal and product pages hide motion layers and chrome.

## Typography

- [ ] Web fonts preloaded (one or two files), `font-display` set, metric-matched fallback to avoid a jump.
- [ ] `text-wrap: balance` on headings and `pretty` on paragraphs; no single-word last lines in display type.
- [ ] Display tracking tightened (−0.01 to −0.04 em); small labels opened slightly; body at 0.
- [ ] Real typographic characters: curly quotes, apostrophes, en dashes in ranges, ×, non-breaking spaces before units.
- [ ] Tabular numerals in prices, tables and counters; oldstyle numerals only where the face and tone suit them.
- [ ] Hanging punctuation or optical margin alignment for large pull quotes where supported.
- [ ] Measure 45–75 characters for body copy; line height 1.5–1.7 for text, 0.9–1.1 for display.
- [ ] No faux bold or italic: `font-synthesis: none` when every needed style is loaded.
- [ ] Headings stay readable at 200 % zoom and in the longest translation.

## Color and surfaces

- [ ] Every text/background pair verified, including the least favorable image, video and gradient region behind the actual text.
- [ ] Hover, active and disabled colors derived from tokens, not hand-picked per component.
- [ ] Borders and dividers at a consistent opacity or token; no competing grays.
- [ ] Dark sections rebalanced independently, not inverted.
- [ ] Grain or noise overlays under 6 % opacity and pointer-events none; no banding in large gradients.
- [ ] Brand-accurate product colors in commerce imagery.

## Layout and rhythm

- [ ] Shared rails: headings, captions and media align to the same grid lines.
- [ ] Section spacing follows the scale; intentional exceptions only.
- [ ] Media frames reserve their aspect ratio; no layout jump on load.
- [ ] Sticky elements never cover focused content (`scroll-padding-top` matches the header).
- [ ] Safe areas respected on notched phones (`env(safe-area-inset-*)`).
- [ ] Full-height sections use `svh`/`dvh` and hold up at short landscape heights.

## Motion

- [ ] Useful content and controls available promptly; any entrance sequence serves the chosen direction.
- [ ] Entrances only on first appearance; nothing re-animates while scrolling back up unless it is a scrubbed story.
- [ ] Repeated entrances reinforce rhythm where useful; avoid monotonous or competing effects.
- [ ] Timing and easing fit the content; physical overshoot and linear motion require a deliberate purpose.
- [ ] Hover and focus feedback remains responsive during rapid entry, exit and interruption.
- [ ] Interrupting any animation (hover out, scroll back, click during a transition) resolves to a valid state.
- [ ] Offscreen and hidden-tab animation paused; WebGL loops stop when not visible.
- [ ] Reduced motion: no parallax, pins, smoothing or autoplay; final states visible; opacity fades ≤ 200 ms allowed.
- [ ] Lenis (if used) stops while dialogs are open; nested scroll areas marked `data-lenis-prevent`.

## Interaction

- [ ] Every hover has a focus-visible twin and a touch equivalent.
- [ ] Press feedback within 100 ms on every control.
- [ ] Buttons keep their width through loading and success states.
- [ ] Links open where expected; external links marked; no empty `href="#"`.
- [ ] Forms: labels always visible, errors specific and associated, input types and `autocomplete` set, submit disabled only while sending.
- [ ] Dialogs trap focus, close on Esc, restore focus to the trigger, and lock background scroll.
- [ ] Custom cursor (if any) only for fine pointers, never hides the native cursor over inputs, and follows without lag on click targets.

## Media

- [ ] AVIF/WebP with `srcset` and `sizes`; hero image eager with `fetchpriority="high"`; everything below lazy.
- [ ] Every video has a poster, `muted playsinline` when autoplaying, a pause control, and a reduced-motion poster.
- [ ] Alt text written for meaning; decorative images `alt=""`.
- [ ] Image focal points set per breakpoint (`object-position`).
- [ ] No text baked into images unless also present as HTML.

## Performance

- [ ] LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 on a mid-range phone profile.
- [ ] JavaScript split by route; motion libraries loaded once; WebGL loaded after the first view is usable.
- [ ] DPR capped for canvases (1.5–2); textures sized to display size.
- [ ] Fonts subset to the languages used; icon sprites or inline SVG rather than icon fonts.
- [ ] `content-visibility: auto` on long offscreen sections where it does not break anchors or find-in-page.

## SEO and sharing

- [ ] Unique title and meta description per page.
- [ ] Open Graph and Twitter images at 1200×630 that carry the visual identity; `og:title`, `og:description`, `og:url`.
- [ ] Canonical URL, `robots` policy, sitemap, structured data where relevant (Organization, Product, Article, Event).
- [ ] Favicon set: SVG favicon, 32 px PNG, 180 px Apple touch icon, web manifest with theme color.
- [ ] Content present in HTML without JavaScript for crawlers and link previews.

## States and edges

- [ ] 404 page designed in the site's voice with a way back.
- [ ] Empty, loading, error and success states designed for every data-driven component.
- [ ] Offline or failed media shows a poster and a retry.
- [ ] Very long names, prices and translations do not break components.
- [ ] Cookie or consent UI does not cover the primary action and offers equal choices.
- [ ] Legal pages share the typographic system.
