# Fluid and kinetic type

Implementation for the [typography system](../SKILL.md): scale math, display fitting, micro-typography, and moving type that stays readable and accessible.

## Fluid scale

A fluid step interpolates linearly between a minimum size at a small viewport and a maximum size at a large one:

```text
slope     = (maxPx − minPx) / (maxVw − minVw)
intercept = minPx − slope × minVw
size      = clamp(minPx/16 rem, intercept/16 rem + slope × 100 vw, maxPx/16 rem)
```

Generate a whole scale, with a different ratio at each end, using the package tool:

```text
node scripts/tokens.mjs type --min-size 17 --max-size 19 --min-ratio 1.2 --max-ratio 1.333 --steps -1..6
```

Keep a `rem` term in every fluid value; `vw` alone ignores the user's text size and fails text resizing. Test at 200 % browser text zoom: headings may wrap more, but nothing may clip or overlap.

## Display type fitted to its container

For a display line that should span its column, size it with container query units so it follows the component, not the window:

```css
.hero-title-frame {
  container-type: inline-size;
}

.hero-title {
  font-size: clamp(3rem, 1rem + 11cqi, 12rem);
  line-height: 0.92;
  letter-spacing: -0.04em;
  text-wrap: balance;
}
```

Tune the `cqi` factor with the real word in the loaded font. `text-fit: grow` (Chromium 150+) can fit a line exactly as an enhancement; keep the `clamp()` value as the baseline.

## Micro-typography

```css
:root {
  font-synthesis: none;
  font-optical-sizing: auto;
  hanging-punctuation: first allow-end last;
}

h1, h2, h3 {
  text-rendering: optimizeLegibility;
  text-wrap: balance;
  line-height: calc(1em + 0.5rem);
  text-box: trim-both cap alphabetic;
}

p, li, figcaption {
  text-wrap: pretty;
  max-inline-size: 65ch;
  hyphens: auto;
  hyphenate-limit-chars: 7 3 3;
}

.price, td, .counter {
  font-variant-numeric: tabular-nums lining-nums;
}

.prose {
  font-variant-numeric: oldstyle-nums proportional-nums;
  font-kerning: normal;
}

abbr, .smallcaps {
  font-variant-caps: all-small-caps;
  letter-spacing: 0.02em;
}
```

- `text-box: trim-both cap alphabetic`, where supported, trims the space above capitals and below the baseline, so text centres optically in buttons and aligns to the top of adjacent images.
- `hanging-punctuation` is supported in Safari; other browsers ignore it harmlessly.
- `hyphens: auto` needs the correct `lang` attribute.
- Use real small caps only when the face includes them; synthesized small caps look thin.

## Kinetic type rules

1. The real text stays in the DOM, readable by assistive technology and search. Split copies are `aria-hidden`; the container keeps an accessible name.
2. Split only display lines and short phrases. Never split paragraphs by characters.
3. Resolve fonts and final line breaks before splitting; re-split on resize.
4. One kinetic moment per view. The entrance ends within about 1.2 s; the text then holds still long enough to read.
5. Under reduced motion, show the final state or use a fade of 200 ms or less.
6. Animate transforms and opacity. Animating weight or width reflows text: isolate it on a display line with reserved space.

## Recipes

### Line mask reveal with SplitText

GSAP 3.13 and later ship a rewritten SplitText with built-in masking, automatic re-splitting and screen-reader handling.

```js
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

export function revealLines(element, { delay = 0 } = {}) {
  let disposed = false;
  const mm = gsap.matchMedia();
  document.fonts.ready.then(() => {
    if (disposed) return;
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const originalWrap = element.style.textWrap;
      element.style.textWrap = 'wrap';
      SplitText.create(element, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, { yPercent: 105, duration: 0.9, ease: 'expo.out', stagger: { amount: Math.min(0.3, Math.max(0, self.lines.length - 1) * 0.08) }, delay });
        },
      });
      return () => { element.style.textWrap = originalWrap; };
    });
  });
  return () => { disposed = true; mm.revert(); };
}
```

Returning the tween from `onSplit` lets SplitText carry progress across re-splits. The helper waits for fonts, skips disposed components, and scopes splitting to the motion preference. SplitText currently advises against `text-wrap: balance`; the helper temporarily uses normal wrapping. Split only plain display text: the automatic accessible name does not preserve nested links or other interactive semantics. [SplitText documentation](https://gsap.com/docs/v3/Plugins/SplitText/).

### CSS-only line reveal for authored lines

When line breaks are authored per breakpoint, no library is needed:

```html
<h1 class="reveal" aria-label="Orris Nocturne">
  <span class="line" aria-hidden="true" style="--i: 0"><span>Orris</span></span>
  <span class="line" aria-hidden="true" style="--i: 1"><span>Nocturne</span></span>
</h1>
```

```css
.reveal .line {
  display: block;
  overflow: clip;
  overflow-clip-margin: 0.12em;
}

.reveal .line > span {
  display: block;
  animation: line-rise 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(80ms + var(--i) * 90ms);
}

@keyframes line-rise {
  from { transform: translateY(105%); }
}

@media (prefers-reduced-motion: reduce) {
  .reveal .line > span { animation: none; }
}
```

`overflow-clip-margin` keeps descenders and accents from being cut by the mask.

### Words that fill as they scroll

A manifesto paragraph whose words brighten as it passes through the viewport. The final text is fully opaque and the paragraph stays one accessible block.

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function scrollFill(element) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    SplitText.create(element, {
      type: 'words',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.words, {
          opacity: 0.18,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: element, start: 'top 80%', end: 'bottom 45%', scrub: true },
        });
      },
    });
  });
  return () => mm.revert();
}
```

### Variable axis scrubbed by scroll, in CSS

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .axis-scrub {
      animation: axis-grow linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 50%;
    }
  }
}

@keyframes axis-grow {
  from { font-variation-settings: "wght" 300, "wdth" 75; }
  to { font-variation-settings: "wght" 800, "wdth" 125; }
}
```

List every axis you animate in both keyframes; `font-variation-settings` interpolates only matching axes. Browsers without scroll timelines show the static style.

### Velocity-reactive marquee

A row of words that drifts and speeds up with scroll velocity. Duplicate the content once for a seamless loop and hide the copy from assistive technology.

```html
<div class="marquee">
  <p class="visually-hidden">Grasse, Florence, Kyoto, Oaxaca</p>
  <div class="marquee-track" aria-hidden="true">
    <span>Grasse · Florence · Kyoto · Oaxaca ·</span>
    <span>Grasse · Florence · Kyoto · Oaxaca ·</span>
  </div>
  <button type="button" data-marquee-pause>Pause marquee</button>
</div>
```

```css
.marquee { overflow: clip; }
.marquee-track { display: flex; inline-size: max-content; }
.marquee-track > span { flex: none; padding-inline-end: 1em; }
@media (prefers-reduced-motion: reduce) {
  .marquee-track { inline-size: auto; }
  .marquee-track > span { flex: 1; }
  .marquee-track > span + span { display: none; }
}
```

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function marquee(track, { secondsPerLoop = 24, pauseButton = track.parentElement.querySelector('[data-marquee-pause]') } = {}) {
  // Leave the content still unless the visitor can stop its automatic motion.
  if (!pauseButton) return () => {};
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    let userPaused = false;
    const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: secondsPerLoop, repeat: -1, paused: true });
    const sync = () => loop.paused(userPaused || document.hidden || !trigger.isActive);
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: self => loop.paused(userPaused || document.hidden || !self.isActive),
      onUpdate: self => {
        const boost = 1 + Math.min(4, Math.abs(self.getVelocity()) / 800);
        gsap.to(loop, {
          timeScale: boost,
          duration: 0.2,
          overwrite: true,
          onComplete: () => gsap.to(loop, { timeScale: 1, duration: 1.2, ease: 'power2.out' }),
        });
      },
    });
    const toggle = () => {
      userPaused = !userPaused;
      pauseButton.textContent = userPaused ? 'Play marquee' : 'Pause marquee';
      sync();
    };
    document.addEventListener('visibilitychange', sync);
    pauseButton.addEventListener('click', toggle);
    sync();
    return () => {
      document.removeEventListener('visibilitychange', sync);
      pauseButton.removeEventListener('click', toggle);
      gsap.killTweensOf(loop);
      loop.kill();
    };
  });
  return () => mm.revert();
}
```

The loop pauses offscreen and in hidden tabs, and returns to its base speed when scrolling stops. Keep the pause control for automatically moving content; remove or disable it while reduced motion makes the row static.

### Text on a path

```html
<svg viewBox="0 0 800 200" role="img" aria-label="Distilled in Grasse since 1924">
  <path id="arc" d="M 40 180 Q 400 -40 760 180" fill="none"/>
  <text font-size="44"><textPath href="#arc" startOffset="0%">Distilled in Grasse since 1924</textPath></text>
</svg>
```

Animate `startOffset` from 0 % to a small positive value on scroll for a gentle drift; keep the phrase short.

### Image or video inside letters

`background-clip: text` with a still image or a paused video poster can carry a campaign image through a word. Always set a solid `color` fallback, check contrast against the page behind the letters, and keep the word large (above about 80 px) so the image reads.
