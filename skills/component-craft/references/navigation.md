# Navigation

Navigation is the most-used component and the first thing a juror tests. It must be obvious, fast and consistent; its personality comes from type, timing and the menu reveal, never from hiding where things are.

## Header that steps aside

Transparent over the hero, solid once the hero leaves, hidden while reading down and back as soon as the reader scrolls up.

```html
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-state="top">
  <a class="wordmark" href="/">Maison Veyr</a>
  <nav aria-label="Primary">
    <ul class="nav-list">
      <li><a href="/fragrances" aria-current="page">Fragrances</a></li>
      <li><a href="/atelier">Atelier</a></li>
      <li><a href="/journal">Journal</a></li>
    </ul>
  </nav>
  <a class="nav-bag" href="/bag">Bag <span class="nav-count">2<span class="visually-hidden"> items</span></span></a>
  <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-menu" aria-haspopup="dialog">
    <span class="menu-icon" aria-hidden="true"></span><span class="menu-label">Menu</span>
  </button>
</header>
<main id="main">
  <section class="hero">…<div data-header-sentinel aria-hidden="true"></div></section>
</main>
```

```css
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: var(--z-header);
  display: flex;
  align-items: center;
  gap: var(--space-m);
  block-size: var(--header-h);
  padding-inline: var(--margin);
  transition:
    transform var(--dur-base) var(--ease-out-quart),
    background-color var(--dur-base) var(--ease-standard),
    color var(--dur-base) var(--ease-standard);
}

.site-header[data-state="solid"] {
  background: color-mix(in oklch, var(--color-ground) 92%, transparent);
  backdrop-filter: blur(12px);
}

.site-header[data-hidden] { transform: translateY(-100%); }

.nav-list { display: flex; gap: var(--space-m); list-style: none; margin: 0; padding: 0; }
.nav-list a { text-decoration: none; }
.nav-list a[aria-current="page"] { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.35em; }
```

```js
export function smartHeader(header, { threshold = 8, sentinel = document.querySelector('[data-header-sentinel]') } = {}) {
  let lastY = window.scrollY;
  let frame = 0;
  const update = () => {
    frame = 0;
    const y = window.scrollY;
    if (y <= header.offsetHeight) {
      header.removeAttribute('data-hidden');
      lastY = y;
      return;
    }
    const delta = y - lastY;
    if (Math.abs(delta) < threshold) return;
    const busy = header.contains(document.activeElement) || document.documentElement.hasAttribute('data-menu-open');
    if (!busy) header.toggleAttribute('data-hidden', delta > 0);
    lastY = y;
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
  const onFocus = () => header.removeAttribute('data-hidden');
  const observer = sentinel
    ? new IntersectionObserver(([entry]) => { header.dataset.state = entry.isIntersecting ? 'top' : 'solid'; })
    : null;
  window.addEventListener('scroll', onScroll, { passive: true });
  header.addEventListener('focusin', onFocus);
  observer?.observe(sentinel);
  return () => {
    window.removeEventListener('scroll', onScroll);
    header.removeEventListener('focusin', onFocus);
    observer?.disconnect();
    cancelAnimationFrame(frame);
  };
}
```

- The header never hides while focus is inside it or a menu is open, and it returns on any upward scroll.
- Over photography, guarantee contrast with a short top scrim on the hero rather than a heavy header background.
- Set `scroll-padding-top` to the header height so anchored headings are not covered.

## Full-screen menu

A modal `<dialog>` gives focus containment, Escape to close, inert background and focus return for free.

```html
<dialog class="menu" id="site-menu" aria-label="Menu">
  <nav aria-label="Menu">
    <ul class="menu-list">
      <li style="--i: 0"><a href="/fragrances">Fragrances</a></li>
      <li style="--i: 1"><a href="/atelier">Atelier</a></li>
      <li style="--i: 2"><a href="/journal">Journal</a></li>
      <li style="--i: 3"><a href="/stores">Stores</a></li>
    </ul>
  </nav>
  <button class="menu-close" type="button" data-close>Close</button>
</dialog>
```

```css
.menu {
  inset: 0;
  inline-size: 100%;
  max-inline-size: none;
  block-size: 100dvh;
  max-block-size: none;
  margin: 0;
  padding: var(--space-2xl) var(--margin);
  border: 0;
  background: var(--color-ink);
  color: var(--color-ground);
  opacity: 0;
  transform: translateY(-2%);
  transition:
    opacity var(--dur-slow) var(--ease-out-quart),
    transform var(--dur-slow) var(--ease-out-expo),
    overlay var(--dur-slow) allow-discrete,
    display var(--dur-slow) allow-discrete;
}

.menu[open] { opacity: 1; transform: none; }

@starting-style {
  .menu[open] { opacity: 0; transform: translateY(-2%); }
}

.menu::backdrop { background: transparent; }

.menu-list { list-style: none; margin: 0; padding: 0; }

.menu-list a {
  display: block;
  font-family: var(--font-display);
  font-size: var(--step-6);
  line-height: 1.05;
  text-decoration: none;
}

.menu[open] .menu-list li {
  animation: menu-line 700ms var(--ease-out-expo) both;
  animation-delay: calc(120ms + var(--i, 0) * 60ms);
}

@keyframes menu-line { from { opacity: 0; transform: translateY(40%); } }

@media (prefers-reduced-motion: reduce) {
  .menu { transition-duration: 1ms; }
  .menu[open] .menu-list li { animation: none; }
}
```

```js
export function menuDialog(button, dialog, motion) {
  let locked = false;
  const open = () => {
    if (dialog.open) return;
    dialog.showModal();
    button.setAttribute('aria-expanded', 'true');
    document.documentElement.setAttribute('data-menu-open', '');
    motion?.lock();
    locked = true;
  };
  const onClose = () => {
    button.setAttribute('aria-expanded', 'false');
    document.documentElement.removeAttribute('data-menu-open');
    if (locked) motion?.unlock();
    locked = false;
  };
  const onClick = event => {
    if (event.target.closest('[data-close], a')) dialog.close();
  };
  button.addEventListener('click', open);
  dialog.addEventListener('close', onClose);
  dialog.addEventListener('click', onClick);
  return () => {
    if (dialog.open) dialog.close();
    onClose();
    button.removeEventListener('click', open);
    dialog.removeEventListener('close', onClose);
    dialog.removeEventListener('click', onClick);
  };
}
```

`motion` is the object returned by `initMotion()` ([stack and integration](../../motion-engineering/references/stack-and-integration.md)); locking stops smooth scrolling behind the dialog. Exit transitions of top-layer elements rely on `overlay` and `display` with `allow-discrete`; browsers without them close instantly, which is acceptable. An image preview beside the links (one image per hovered or focused link, crossfaded) is a strong luxury detail; keep it decorative with `alt=""`.

## Menu icon

```css
.menu-button { display: inline-flex; align-items: center; gap: var(--space-2xs); min-block-size: 44px; padding-inline: var(--space-2xs); background: none; border: 0; }
.menu-icon { position: relative; inline-size: 22px; block-size: 12px; }

.menu-icon::before,
.menu-icon::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  inset-block-start: calc(50% - 0.75px);
  block-size: 1.5px;
  background: currentColor;
  transition: transform var(--dur-base) var(--ease-out-expo);
}

.menu-icon::before { transform: translateY(-4px); }
.menu-icon::after { transform: translateY(4px); }
[aria-expanded="true"] .menu-icon::before { transform: rotate(45deg); }
[aria-expanded="true"] .menu-icon::after { transform: rotate(-45deg); }
```

Keep the visible word "Menu" when space allows; an icon alone is harder to find.

## Mega menu with popover and anchor positioning

```html
<button class="nav-trigger" type="button" popovertarget="collections">Collections</button>
<div class="mega" id="collections" popover>
  <ul>
    <li><a href="/collections/iris">Iris</a></li>
    <li><a href="/collections/resins">Resins</a></li>
  </ul>
</div>
```

```css
.nav-trigger { anchor-name: --collections; }

.mega {
  position-anchor: --collections;
  position-area: bottom span-right;
  margin: var(--space-xs) 0 0;
  padding: var(--space-l);
  border: 1px solid var(--color-line);
  background: var(--color-ground);
  box-shadow: var(--shadow-overlay);
  opacity: 0;
  translate: 0 -6px;
  transition: opacity var(--dur-base) var(--ease-out-quart), translate var(--dur-base) var(--ease-out-quart), overlay var(--dur-base) allow-discrete, display var(--dur-base) allow-discrete;
}

.mega:popover-open { opacity: 1; translate: 0 0; }

@starting-style {
  .mega:popover-open { opacity: 0; translate: 0 -6px; }
}
```

The popover handles light dismiss, Escape and `aria-expanded` on its trigger. Open on click; hover-to-open needs intent delays (about 150 ms in, 300 ms out) and must never be the only way in.

## Language and region

```html
<nav aria-label="Language">
  <ul class="lang-list">
    <li><a href="/en/" hreflang="en" lang="en" aria-current="true">English</a></li>
    <li><a href="/fr/" hreflang="fr" lang="fr">Français</a></li>
    <li><a href="/ja/" hreflang="ja" lang="ja">日本語</a></li>
  </ul>
</nav>
```

Name languages in their own language, never redirect automatically by location, and keep the visitor on the equivalent page.

## Chapter index with scroll spy

For long product stories and editorial pages.

```js
export function chapterIndex(nav) {
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => {
    try { return document.getElementById(decodeURIComponent(link.hash.slice(1))); }
    catch { return null; }
  }).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of links) {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
  return () => observer.disconnect();
}
```

`aria-current` needs a value such as `location`; an empty attribute means false.

## Breadcrumbs

```html
<nav aria-label="Breadcrumb">
  <ol class="breadcrumbs">
    <li><a href="/">Home</a></li>
    <li><a href="/fragrances">Fragrances</a></li>
    <li><a href="/fragrances/orris-nocturne" aria-current="page">Orris Nocturne</a></li>
  </ol>
</nav>
```

## Footer

The footer is the last impression and a second navigation. A premium footer usually has a large wordmark or closing line, a small sitemap, contact and store details, newsletter signup, social links, legal links and a way back to the top.

```css
.site-footer { display: grid; gap: var(--space-2xl); padding: var(--space-3xl) var(--margin) var(--space-l); background: var(--color-ink); color: var(--color-ground); }
.footer-wordmark { inline-size: 100%; block-size: auto; }
.footer-columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: var(--space-l); }
.footer-legal { display: flex; flex-wrap: wrap; gap: var(--space-s) var(--space-m); font-size: var(--step--1); color: color-mix(in oklch, var(--color-ground) 72%, var(--color-ink)); }
```

An SVG wordmark scaled to the full width (`viewBox` with `inline-size: 100%`) carries identity without an image request; give it `role="img"` and an accessible name, or hide it if the brand name appears as text nearby. The curtain reveal pattern is in [scroll patterns](../../motion-engineering/references/scroll-patterns.md).
