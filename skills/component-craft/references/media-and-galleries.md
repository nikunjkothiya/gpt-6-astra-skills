# Media and galleries

Imagery carries most premium sites. Serve it fast, crop it deliberately, and make every gallery work with a keyboard, a thumb and reduced motion. Snippets use `damp()` from the [easing and timing](../../motion-engineering/references/easing-and-timing.md) module.

## Responsive images

```html
<picture>
  <source media="(max-width: 48rem)" type="image/avif" srcset="/img/orris-portrait-800.avif 800w, /img/orris-portrait-1200.avif 1200w" sizes="100vw">
  <source type="image/avif" srcset="/img/orris-1200.avif 1200w, /img/orris-2000.avif 2000w, /img/orris-2800.avif 2800w" sizes="(min-width: 64rem) 58vw, 100vw">
  <img src="/img/orris-2000.jpg" width="2000" height="1333" alt="Orris Nocturne flacon on gray stone, lit from above" fetchpriority="high" decoding="async">
</picture>
```

- The hero image loads eagerly with `fetchpriority="high"`; every other image uses `loading="lazy"`.
- Intrinsic `width` and `height` reserve space; the frame's `aspect-ratio` and `object-fit: cover` handle crops.
- Art-direct crops per breakpoint with `<source media>` rather than letting a landscape image shrink on phones.
- Grade the set to one color temperature and one light direction; mixed grading reads as stock.

## Image swap on hover

A product card or project tile reveals a second image; touch shows it on the detail page instead.

```css
.swap { display: grid; overflow: clip; }
.swap > img { grid-area: 1 / 1; inline-size: 100%; block-size: 100%; object-fit: cover; }
.swap > img + img { opacity: 0; scale: 1.04; transition: opacity var(--dur-slow) var(--ease-standard), scale var(--dur-slower) var(--ease-out-quart); }

@media (hover: hover) and (pointer: fine) {
  :is(a, .card, .product-card):hover .swap > img + img { opacity: 1; scale: 1; }
}

:is(a, .card, .product-card):focus-within .swap > img + img { opacity: 1; scale: 1; }
```

The second image is decorative (`alt=""`) when the first already describes the item.

## Project list with a floating preview

A text index where the hovered or focused project's image follows the pointer.

```html
<ul class="index">
  <li><a href="/work/atelier" data-preview="/img/atelier.avif">Atelier Veyr <span>2026</span></a></li>
  <li><a href="/work/vesper" data-preview="/img/vesper.avif">Vesper <span>2025</span></a></li>
</ul>
<img class="index-preview" alt="" aria-hidden="true">
```

```css
.index-preview {
  position: fixed;
  inset: 0 auto auto 0;
  z-index: var(--z-raised);
  inline-size: 22rem;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-standard);
}

.index-preview[data-visible] { opacity: 1; }

@media (hover: none) {
  .index-preview { display: none; }
}
```

```js
export function indexPreview(list, preview, { rate = 14 } = {}) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let last = 0;
  let frame = 0;
  const place = () => { preview.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`; };
  const loop = now => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    x = damp(x, tx, rate, dt);
    y = damp(y, ty, rate, dt);
    place();
    const moving = Math.abs(x - tx) + Math.abs(y - ty) > 0.1;
    frame = moving ? requestAnimationFrame(loop) : 0;
    if (!moving) last = 0;
  };
  const show = link => {
    if (preview.getAttribute('src') !== link.dataset.preview) preview.src = link.dataset.preview;
    preview.setAttribute('data-visible', '');
  };
  const onMove = event => {
    const link = event.target.closest('a[data-preview]');
    if (!link) return;
    tx = event.clientX + 40;
    ty = event.clientY;
    if (!preview.hasAttribute('data-visible')) { x = tx; y = ty; }
    show(link);
    if (still) { x = tx; y = ty; place(); } else if (!frame) frame = requestAnimationFrame(loop);
  };
  const onFocus = event => {
    const link = event.target.closest('a[data-preview]');
    if (!link) return;
    const rect = link.getBoundingClientRect();
    x = tx = rect.right - rect.width * 0.25;
    y = ty = rect.top + rect.height / 2;
    place();
    show(link);
  };
  const hide = () => preview.removeAttribute('data-visible');
  list.addEventListener('pointermove', onMove);
  list.addEventListener('pointerleave', hide);
  list.addEventListener('focusin', onFocus);
  list.addEventListener('focusout', hide);
  return () => {
    list.removeEventListener('pointermove', onMove);
    list.removeEventListener('pointerleave', hide);
    list.removeEventListener('focusin', onFocus);
    list.removeEventListener('focusout', hide);
    cancelAnimationFrame(frame);
  };
}
```

Preload only likely preview images within the asset budget, keeping a visible fallback until decoding succeeds. For a WebGL enhancement, combine [camera composition](../../camera-composition/SKILL.md) with [shader and optics guidance](../../cinematic-web/references/shaders-and-optics.md); retain the DOM image as the fallback.

## Carousel

Native scroll snapping gives touch, trackpad and keyboard scrolling for free. Add buttons and a position readout; skip autoplay unless there is a visible pause control.

```html
<section class="carousel" aria-roledescription="carousel" aria-label="Iris collection">
  <div class="carousel-track" tabindex="0">
    <article class="slide" aria-roledescription="slide" aria-label="1 of 4">…</article>
    <article class="slide" aria-roledescription="slide" aria-label="2 of 4">…</article>
  </div>
  <div class="carousel-controls">
    <button type="button" data-dir="-1" aria-label="Previous">Previous</button>
    <p class="carousel-status" aria-live="polite">1 of 4</p>
    <button type="button" data-dir="1" aria-label="Next">Next</button>
  </div>
</section>
```

```css
.carousel-track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min(82%, 30rem);
  gap: var(--gutter);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--margin);
  padding-inline: var(--margin);
  scrollbar-width: none;
}

.slide { scroll-snap-align: start; }
```

```js
export function carousel(root) {
  const track = root.querySelector('.carousel-track');
  const slides = [...track.children];
  const status = root.querySelector('.carousel-status');
  const step = direction => {
    const width = slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
    track.scrollBy({ left: direction * width, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const onClick = event => {
    const button = event.target.closest('[data-dir]');
    if (button) step(Number(button.dataset.dir));
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) status.textContent = `${slides.indexOf(entry.target) + 1} of ${slides.length}`;
    }
  }, { root: track, threshold: 0.6 });
  slides.forEach(slide => observer.observe(slide));
  root.addEventListener('click', onClick);
  return () => {
    root.removeEventListener('click', onClick);
    observer.disconnect();
  };
}
```

Chromium's `::scroll-marker` and `::scroll-button()` can generate dots and buttons in CSS as an enhancement; keep the scripted controls as the baseline. Embla Carousel is a solid library when loops, alignment variants or plugins are required.

## Draggable gallery with inertia

For image-led exploration. The pointer drags, release carries momentum, arrows and buttons provide the same movement.

```js
export function dragGallery(viewport, track, { friction = 4.5 } = {}) {
  let offset = 0;
  let velocity = 0;
  let dragging = false;
  let lastX = 0;
  let lastT = 0;
  let frame = 0;
  const bounds = () => Math.min(0, viewport.clientWidth - track.scrollWidth);
  const clampOffset = value => Math.max(bounds(), Math.min(0, value));
  const render = () => { track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`; };
  const glide = now => {
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    velocity *= Math.exp(-friction * dt);
    offset = clampOffset(offset + velocity * dt);
    render();
    frame = Math.abs(velocity) > 5 && !dragging ? requestAnimationFrame(glide) : 0;
  };
  const onDown = event => {
    dragging = true;
    viewport.setPointerCapture(event.pointerId);
    cancelAnimationFrame(frame);
    velocity = 0;
    lastX = event.clientX;
    lastT = performance.now();
  };
  const onMove = event => {
    if (!dragging) return;
    const now = performance.now();
    const dx = event.clientX - lastX;
    const dt = Math.max(1, now - lastT) / 1000;
    velocity = dx / dt;
    offset = clampOffset(offset + dx);
    lastX = event.clientX;
    lastT = now;
    render();
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    lastT = performance.now();
    frame = requestAnimationFrame(glide);
  };
  const onKey = event => {
    const move = { ArrowRight: -1, ArrowLeft: 1 }[event.key];
    if (!move) return;
    event.preventDefault();
    offset = clampOffset(offset + move * viewport.clientWidth * 0.6);
    render();
  };
  viewport.addEventListener('pointerdown', onDown);
  viewport.addEventListener('pointermove', onMove);
  viewport.addEventListener('pointerup', onUp);
  viewport.addEventListener('pointercancel', onUp);
  viewport.addEventListener('keydown', onKey);
  return () => {
    viewport.removeEventListener('pointerdown', onDown);
    viewport.removeEventListener('pointermove', onMove);
    viewport.removeEventListener('pointerup', onUp);
    viewport.removeEventListener('pointercancel', onUp);
    viewport.removeEventListener('keydown', onKey);
    cancelAnimationFrame(frame);
  };
}
```

Give the viewport `tabindex="0"`, `touch-action: pan-y`, an accessible label, and `cursor: grab`. Distinguish a click from a drag with a movement threshold of about 6 px before following a link inside it.

## Lightbox

```html
<button class="thumb" type="button" data-lightbox="/img/orris-2800.avif" data-alt="Orris root drying on linen">
  <img src="/img/orris-thumb.avif" width="600" height="750" alt="Orris root drying on linen">
</button>
<dialog class="lightbox" aria-label="Image viewer">
  <img alt="">
  <button type="button" data-close>Close</button>
</dialog>
```

```js
export function lightbox(dialog) {
  const image = dialog.querySelector('img');
  let disposed = false;
  let pending = false;
  let transition;
  const onClick = async event => {
    const trigger = event.target.closest('[data-lightbox]');
    if (trigger && !pending && !dialog.open) {
      pending = true;
      image.src = trigger.dataset.lightbox;
      image.alt = trigger.dataset.alt ?? '';
      const thumbnail = trigger.querySelector('img');
      const oldThumbName = thumbnail?.style.viewTransitionName;
      const oldImageName = image.style.viewTransitionName;
      try {
        await image.decode();
        if (disposed || !dialog.isConnected) return;
        const open = () => { if (!disposed && !dialog.open) dialog.showModal(); };
        if (thumbnail && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          thumbnail.style.viewTransitionName = 'lightbox-image';
          transition = document.startViewTransition(() => {
            thumbnail.style.viewTransitionName = oldThumbName;
            image.style.viewTransitionName = 'lightbox-image';
            open();
          });
          await transition.finished;
        } else open();
      } catch (error) {
        // Keep the thumbnail usable; surface a product-specific load error here.
        console.error('Unable to open the image viewer', error);
      } finally {
        if (thumbnail) thumbnail.style.viewTransitionName = oldThumbName;
        image.style.viewTransitionName = oldImageName;
        pending = false;
        transition = undefined;
      }
    }
    const rect = dialog.getBoundingClientRect();
    const outside = event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
    if ((dialog.contains(event.target) && event.target.closest('[data-close]')) || outside) dialog.close();
  };
  document.addEventListener('click', onClick);
  return () => {
    disposed = true;
    transition?.skipTransition();
    if (dialog.open) dialog.close();
    document.removeEventListener('click', onClick);
  };
}
```

The shared name moves from the thumbnail to the large image inside the transition, so the image appears to grow into the viewer. Only clicks outside the dialog's bounds dismiss the backdrop; padding inside it stays usable. Reserve this transition name for one mounted viewer, and use the dialog scroll-lock integration when the surrounding page requires it.

## Video

Background loops are atmosphere; they must never cost the visitor data, battery or comfort.

```html
<video class="bg-video" muted playsinline loop preload="none" poster="/img/atelier-poster.avif" aria-hidden="true">
  <source src="/video/atelier-1280.webm" type="video/webm">
  <source src="/video/atelier-1280.mp4" type="video/mp4">
</video>
<button class="video-toggle" type="button">Play background video</button>
```

```js
export function backgroundVideo(video, toggle) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = reduce.matches;
  let visible = false;
  let disposed = false;
  const label = () => { toggle.textContent = video.paused ? 'Play background video' : 'Pause background video'; };
  const sync = () => {
    if (visible && !document.hidden && !userPaused && !disposed) {
      video.play().then(() => {
        if (disposed || !visible || document.hidden || userPaused) video.pause();
        label();
      }).catch(() => { userPaused = true; label(); });
    }
    else video.pause();
    label();
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
    sync();
  }, { threshold: 0.25 });
  const onToggle = () => {
    userPaused = !userPaused;
    sync();
  };
  const onPreference = () => { if (reduce.matches) userPaused = true; sync(); };
  observer.observe(video);
  toggle.addEventListener('click', onToggle);
  reduce.addEventListener('change', onPreference);
  document.addEventListener('visibilitychange', sync);
  video.addEventListener('play', label);
  video.addEventListener('pause', label);
  label();
  return () => {
    disposed = true;
    video.pause();
    observer.disconnect();
    toggle.removeEventListener('click', onToggle);
    reduce.removeEventListener('change', onPreference);
    document.removeEventListener('visibilitychange', sync);
    video.removeEventListener('play', label);
    video.removeEventListener('pause', label);
  };
}
```

Under reduced motion the poster stays until the visitor chooses to play. Films with content need captions (`<track kind="captions">`), visible controls and a transcript; scroll-scrubbed video uses [media scrubbing](../../interactive-motion/references/media-scrubbing.md).

## Before and after comparison

A range input is the accessible control; the clip follows its value.

```html
<figure class="compare" style="--pos: 50%">
  <img src="/img/before.avif" alt="Leather before restoration" width="1600" height="1000">
  <img class="compare-after" src="/img/after.avif" alt="Leather after restoration" width="1600" height="1000">
  <input type="range" min="0" max="100" value="50" aria-label="Reveal the restored leather">
</figure>
```

```css
.compare { position: relative; display: grid; }
.compare > img { grid-area: 1 / 1; inline-size: 100%; }
.compare-after { clip-path: inset(0 calc(100% - var(--pos)) 0 0); }
.compare input { position: absolute; inset: 0; inline-size: 100%; block-size: 100%; opacity: 0; cursor: ew-resize; }
.compare:focus-within { outline: var(--focus-width) solid var(--focus-color); outline-offset: var(--focus-offset); }
```

```js
export function compareSlider(figure) {
  const input = figure.querySelector('input[type="range"]');
  const update = () => figure.style.setProperty('--pos', `${input.value}%`);
  input.addEventListener('input', update);
  update();
  return () => input.removeEventListener('input', update);
}
```

Draw a visible divider and handle at `--pos` so sighted users can see what to drag.
