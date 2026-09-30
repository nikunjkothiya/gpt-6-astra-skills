# Scroll patterns

Seventeen scroll patterns with implementation, a reduced-motion rule and the pitfalls that make them feel cheap. JavaScript snippets assume `gsap` and `ScrollTrigger` are imported and registered, and smooth scrolling is set up once, as in [stack and integration](stack-and-integration.md). Pick one or two patterns per page; a page that uses all of them has no signature.

General rules:

- Content is visible without JavaScript. Apply hidden entrance states only inside the initializer after its observer or animation is ready; a global `js` class alone does not prove that a component mounted successfully.
- Scroll-driven CSS (`animation-timeline`) is scrubbed: it reverses when the user scrolls back. Use it for progress, parallax and continuous effects, not for one-time entrances.
- Every pattern has a reduced-motion state that shows the final content in normal flow.

## 1. Reveal once on enter

Use for section intros and supporting blocks. Vary the grammar by element type rather than fading everything.

```js
export function revealOnce(selector = '[data-reveal]') {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = [...document.querySelectorAll(selector)];
  if (reduce.matches) return () => {};
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
  elements.forEach(element => {
    element.classList.add('reveal-pending');
    observer.observe(element);
  });
  const revealAll = () => {
    if (!reduce.matches) return;
    observer.disconnect();
    elements.forEach(element => element.classList.remove('reveal-pending'));
  };
  reduce.addEventListener('change', revealAll);
  return () => {
    observer.disconnect();
    reduce.removeEventListener('change', revealAll);
    elements.forEach(element => element.classList.remove('reveal-pending'));
  };
}
```

```css
[data-reveal].reveal-pending {
  opacity: 0;
  transform: translateY(var(--travel-m));
  transition: opacity var(--dur-slow) var(--ease-out-quart), transform var(--dur-slower) var(--ease-out-expo);
}

[data-reveal].reveal-pending.is-revealed { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  [data-reveal].reveal-pending { opacity: 1; transform: none; transition: none; }
}
```

Pitfalls: revealing every section the same way; thresholds so late that content appears after the user has scrolled past it.

## 2. Image clip reveal with inner scale

The frame opens while the image inside settles, which reads as a camera rather than a fade.

```js
export function clipReveal(frame) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const media = frame.querySelector('img, video');
    gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', end: 'top 35%', scrub: 0.5 } })
      .fromTo(frame, { clipPath: 'inset(18% 12% 18% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
      .fromTo(media, { scale: 1.15 }, { scale: 1, ease: 'none' }, 0);
  });
  return () => mm.revert();
}
```

The frame needs `overflow: clip`. Pitfalls: revealing an undecoded image (call `image.decode()` first), clip ranges that cut faces in the crop.

## 3. Bounded parallax

One or two depth layers, ±8–15 % of their height. The media is scaled up slightly inside a clipping frame so edges never show.

```css
.parallax-frame { overflow: clip; }
.parallax-frame > img { scale: 1.2; }

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .parallax-frame > img {
      animation: parallax-drift linear both;
      animation-timeline: view();
    }
  }
}

@keyframes parallax-drift {
  from { transform: translateY(-8%); }
  to { transform: translateY(8%); }
}
```

GSAP equivalent for browsers without scroll timelines:

```js
export function parallax(frame, amount = 8) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(frame.firstElementChild, { yPercent: -amount }, {
      yPercent: amount,
      ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  return () => mm.revert();
}
```

Pitfalls: parallax on text, on every image, or at large distances; it causes discomfort and reads as a template.

## 4. Pinned story with steps

The signature pattern for explaining a product, a process or a place. Steps overlap in one stage; scroll moves between them.

```css
@media (prefers-reduced-motion: no-preference) {
  .story-stage[data-pinned] { display: grid; min-block-size: 100svh; place-items: center; }
  .story-stage[data-pinned] > [data-step] { grid-area: 1 / 1; }
}
```

```js
export function pinnedSteps(section, { viewports = 3, onProgress } = {}) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const steps = gsap.utils.toArray('[data-step]', section);
    if (steps.length < 2) return;
    const stage = section.querySelector('.story-stage') ?? section;
    stage.setAttribute('data-pinned', '');
    gsap.set(steps.slice(1), { autoAlpha: 0 });
    const span = 1 / steps.length;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * viewports}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
      onUpdate: () => onProgress?.(tl.progress()),
    });
    steps.forEach((step, i) => {
      if (i > 0) tl.fromTo(step, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, i * span);
      if (i < steps.length - 1) tl.to(step, { autoAlpha: 0, y: -24, duration: 0.05, ease: 'power2.in' }, (i + 1) * span - 0.05);
    });
    tl.set({}, {}, 1);
    return () => stage.removeAttribute('data-pinned');
  });
  return () => mm.revert();
}
```

Give each step a reading hold ([easing and timing](easing-and-timing.md)). Under reduced motion the steps render in normal flow. Pitfalls: pins longer than the content deserves, pins on phones taller than their hold, no visible way to skip past.

## 5. Horizontal passage

Vertical scroll drives a horizontal track. Compute the real distance; never hard-code `-300vw`.

```js
export function horizontalPassage(section, track) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 48rem)', () => {
    const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
    if (distance() === 0) return;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.4, invalidateOnRefresh: true },
    });
    gsap.utils.toArray('[data-panel-media]', track).forEach(media => {
      gsap.fromTo(media, { xPercent: -8 }, {
        xPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: media, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      });
    });
    const onFocus = event => {
      const panel = event.target.closest('[data-panel]');
      const trigger = tween.scrollTrigger;
      if (!panel || !trigger) return;
      const panelLeft = panel.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const progress = Math.max(0, Math.min(1, panelLeft / Math.max(1, distance())));
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'instant' });
    };
    track.addEventListener('focusin', onFocus);
    return () => track.removeEventListener('focusin', onFocus);
  });
  return () => mm.revert();
}
```

On phones and under reduced motion the track becomes a native scroll-snap rail ([layout and grid](../../design-tokens/references/layout-and-grid.md)). The focus handler scrolls keyboard users to the focused panel.

## 6. Stacking cards

Cards stick and the previous one recedes as the next arrives.

```css
.stack > .card {
  position: relative;
  top: calc(var(--header-h) + var(--i, 0) * 1.25rem);
  overflow: clip;
}

@media (prefers-reduced-motion: no-preference) {
  .stack > .card { position: sticky; }
}

.card-dim {
  position: absolute;
  inset: 0;
  background: var(--color-ink);
  opacity: 0;
  pointer-events: none;
}
```

```js
export function stackingCards(stack) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const cards = gsap.utils.toArray('.card', stack);
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.timeline({ scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } })
        .to(card, { scale: 0.92, ease: 'none' }, 0)
        .to(card.querySelector('.card-dim'), { opacity: 0.35, ease: 'none' }, 0);
    });
  });
  return () => mm.revert();
}
```

Dim with an overlay's opacity rather than `filter`, which repaints every frame. Pitfall: stacks taller than the viewport on phones.

## 7. Expand to full bleed

A framed image opens to the full viewport as it reaches the top: an inexpensive "zoom through".

```js
export function expandToFull(frame) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(frame, { clipPath: 'inset(12% 22% round 16px)' }, {
      clipPath: 'inset(0% 0% round 0px)',
      ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top 75%', end: 'top top', scrub: 0.4 },
    });
  });
  return () => mm.revert();
}
```

The frame is full-bleed in layout and only clipped visually, so there is no reflow.

## 8. Theme change by section

The page's ground and ink change as a dark section becomes active.

```js
export function themeSections(selector = '[data-section-theme]') {
  const triggers = gsap.utils.toArray(selector).map(section => ScrollTrigger.create({
    trigger: section,
    start: 'top 55%',
    end: 'bottom 55%',
    onToggle: self => {
      if (self.isActive) document.body.dataset.theme = section.dataset.sectionTheme;
    },
  }));
  return () => triggers.forEach(trigger => trigger.kill());
}
```

```css
body { transition: background-color var(--dur-slow) var(--ease-standard), color var(--dur-slow) var(--ease-standard); }
```

Theme tokens come from [token architecture](../../design-tokens/references/token-architecture.md). Check contrast for every element that stays visible during the change.

## 9. Words that fill as they scroll

A manifesto paragraph brightening word by word: see [fluid and kinetic type](../../typography-system/references/fluid-and-kinetic-type.md).

## 10. Progress indicator

```css
.progress {
  position: fixed;
  inset: 0 0 auto;
  block-size: 2px;
  background: var(--color-accent);
  transform-origin: 0 50%;
  transform: scaleX(0);
  z-index: var(--z-header);
}

@supports (animation-timeline: scroll()) {
  .progress {
    animation: progress-grow linear both;
    animation-timeline: scroll(root block);
  }
}

@keyframes progress-grow { to { transform: scaleX(1); } }
```

```js
export function progressFallback(bar) {
  if (CSS.supports('animation-timeline: scroll()')) return () => {};
  let frame = 0;
  const update = () => {
    frame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
  return () => {
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(frame);
  };
}
```

Progress is direct feedback and may stay on under reduced motion.

## 11. Sticky media swap

Media stays in place and crossfades as chapters of text pass the middle of the viewport. Pairs with the sticky split layout.

```js
export function stickyMediaSwap(section) {
  const chapters = [...section.querySelectorAll('[data-chapter]')];
  const media = [...section.querySelectorAll('[data-chapter-media]')];
  const show = id => media.forEach(item => item.toggleAttribute('data-active', item.dataset.chapterMedia === id));
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) show(entry.target.dataset.chapter);
  }, { rootMargin: '-45% 0px -45% 0px' });
  chapters.forEach(chapter => observer.observe(chapter));
  show(chapters[0]?.dataset.chapter);
  return () => observer.disconnect();
}
```

```css
.chapter-media { display: grid; }
.chapter-media > [data-chapter-media] { grid-area: 1 / 1; opacity: 0; transition: opacity var(--dur-slow) var(--ease-standard); }
.chapter-media > [data-chapter-media][data-active] { opacity: 1; }
```

## 12. Velocity-reactive marquee

See the marquee recipe in [fluid and kinetic type](../../typography-system/references/fluid-and-kinetic-type.md). Pause it offscreen and under reduced motion.

## 13. Scrubbed image sequence or video

For product rotations and recorded camera moves, use the tested controllers in [scroll image sequences](../../interactive-motion/references/scroll-image-sequences.md) and [media scrubbing](../../interactive-motion/references/media-scrubbing.md).

## 14. Sheet over a sticky hero

The next section slides over a sticky hero like a sheet; the hero recedes.

```css
.hero-sticky { position: sticky; top: 0; }
.sheet { position: relative; z-index: var(--z-raised); background: var(--color-ground); border-radius: 2rem 2rem 0 0; }
```

```js
export function sheetOverlap(hero, sheet) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.timeline({ scrollTrigger: { trigger: sheet, start: 'top bottom', end: 'top top', scrub: true } })
      .to(hero, { scale: 0.94, autoAlpha: 0.6, ease: 'none' }, 0)
      .fromTo(sheet, { borderRadius: '32px 32px 0px 0px' }, { borderRadius: '0px 0px 0px 0px', ease: 'none' }, 0);
  });
  return () => mm.revert();
}
```

## 15. Footer curtain

The footer waits behind the page and is revealed as the content scrolls away.

```css
main { position: relative; z-index: var(--z-raised); background: var(--color-ground); }
.site-footer { position: sticky; bottom: 0; z-index: var(--z-base); }

@media (max-height: 40rem) {
  .site-footer { position: static; }
}
```

The footer must fit within the viewport height, or its lower part becomes unreachable.

## 16. Snap chapters

```css
.chapters { scroll-snap-type: y proximity; }
.chapters > section { scroll-snap-align: start; min-block-size: 100svh; }
```

Use `proximity`, not `mandatory`, whenever a chapter can be taller than the viewport, and do not combine CSS snapping with a smooth-scroll library.

## 17. Counting up true numbers

```js
export function countUp(element, { duration = 1.2 } = {}) {
  const target = Number(element.dataset.value);
  const format = new Intl.NumberFormat(document.documentElement.lang || undefined, {
    maximumFractionDigits: Number(element.dataset.decimals ?? 0),
  });
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = format.format(target);
    return () => {};
  }
  const state = { value: 0 };
  element.textContent = format.format(0);
  const tween = gsap.to(state, {
    value: target,
    duration,
    ease: 'expo.out',
    scrollTrigger: { trigger: element, start: 'top 85%', once: true },
    onUpdate: () => { element.textContent = format.format(state.value); },
  });
  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    element.textContent = format.format(target);
  };
}
```

Render the final value in the HTML, put the animated copy in an `aria-hidden` span with the real value in visually hidden text beside it, and only count numbers that are sourced in `FACTS.md`.
