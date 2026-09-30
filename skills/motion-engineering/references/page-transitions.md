# Page transitions

Transitions keep the visitor oriented between pages and states. They must never make navigation slower, break the back button, or hide the destination behind a loader. Start from the platform, add scripting only where it earns its cost.

## Choose the mechanism

| Site | Mechanism | Browser reach (September 2026) |
| --- | --- | --- |
| Multi-page site (Astro static, WordPress, plain HTML) | Cross-document View Transitions in CSS | Chrome 126+, Safari 18.2+; other browsers navigate normally |
| Single-page app or client router | Same-document View Transitions (`document.startViewTransition`) | Baseline |
| Multi-page site that needs a scripted, identical transition everywhere | Barba with GSAP | All browsers; costs a JavaScript router |
| React with Next.js | The framework's View Transition integration, or Motion's `AnimatePresence` for in-page presence | Check the installed versions |
| Astro | The client router with `transition:name` and `transition:animate` | Built in |

## Cross-document View Transitions

Opt in on every page of the same origin:

```css
@view-transition { navigation: auto; }

@keyframes vt-leave { to { opacity: 0; transform: translateY(-1.5%); } }
@keyframes vt-enter { from { opacity: 0; transform: translateY(1.5%); } }

::view-transition-old(root) { animation: vt-leave 260ms cubic-bezier(0.5, 0, 0.75, 0) both; }
::view-transition-new(root) { animation: vt-enter 520ms cubic-bezier(0.16, 1, 0.3, 1) both; }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none !important; }
}
```

Shared elements morph between pages when both pages give them the same `view-transition-name`:

```css
.product-card[data-slug="orris-nocturne"] img,
.product-hero img { view-transition-name: product-orris-nocturne; }

::view-transition-group(product-orris-nocturne) {
  animation-duration: 640ms;
  animation-timing-function: cubic-bezier(0.76, 0, 0.24, 1);
}
```

Names must be unique on each page. For lists, set the name only on the clicked item just before navigating, or generate one name per item as above. `view-transition-class` applies one set of styles to many named groups.

The `pageswap` and `pagereveal` events expose the transition to scripts, for example to set a direction:

```js
window.addEventListener('pagereveal', event => {
  if (!event.viewTransition) return;
  const from = window.navigation?.activation?.from?.url;
  if (from && new URL(from).pathname.split('/').length > location.pathname.split('/').length) {
    event.viewTransition.types?.add('back');
  }
});
```

```css
@keyframes vt-enter-back { from { opacity: 0; transform: translateX(-2%); } }

html:active-view-transition-type(back)::view-transition-new(root) {
  animation-name: vt-enter-back;
}
```

Keep pages fast: a cross-document transition waits for the new page's first render, so a slow page makes the transition feel slow.

## Same-document transitions

A helper that feature-detects, respects reduced motion, and falls back to the callback-only form in browsers without transition types:

```js
export async function withTransition(update, { types = [] } = {}) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce) {
    return await update();
  }
  let transition;
  try {
    transition = document.startViewTransition(types.length ? { update, types } : update);
  } catch {
    transition = document.startViewTransition(update);
  }
  // Snapshot animation can be skipped while the DOM update succeeds.
  transition.ready.catch(() => {});
  return transition.finished;
}
```

Use it for filter changes, tab panels, theme toggles and list-to-detail views. The DOM update runs inside `update`; everything else is snapshot presentation.

## Flood reveal from the click point

A circle grows from where the visitor clicked until it covers the farthest corner (the `floodRadius` rule from [easing and timing](easing-and-timing.md)).

```js
export async function floodTo(update, x, y, { duration = 560 } = {}) {
  if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return await update();
  }
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) * 1.05;
  const transition = document.startViewTransition(update);
  try {
    await transition.ready;
  } catch {
    // A skipped animation still runs the update. Propagate only an update failure.
    return await transition.finished;
  }
  document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
    { duration, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' },
  );
  await transition.finished;
}
```

```css
::view-transition-old(root),
::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
```

## Barba for scripted multi-page transitions

```html
<body data-barba="wrapper">
  <div class="curtain" aria-hidden="true"></div>
  <main data-barba="container" data-barba-namespace="home">…</main>
</body>
```

```js
import barba from '@barba/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initMotion } from './motion.js';

let motion = initMotion();
const curtain = document.querySelector('.curtain');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

barba.hooks.beforeLeave(() => motion.destroy());
barba.hooks.after(({ next }) => {
  window.scrollTo(0, 0);
  motion = initMotion();
  ScrollTrigger.refresh();
  const heading = next.container.querySelector('h1');
  heading?.setAttribute('tabindex', '-1');
  heading?.focus({ preventScroll: true });
});

barba.init({
  preventRunning: true,
  transitions: [{
    name: 'curtain',
    async leave() {
      if (reduce.matches) return;
      await gsap.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: 'power3.inOut' });
    },
    async enter() {
      if (reduce.matches) { gsap.set(curtain, { yPercent: -100 }); return; }
      await gsap.to(curtain, { yPercent: -100, duration: 0.55, ease: 'power3.inOut' });
    },
  }],
});
```

Position the curtain fixed over the viewport, initialize it below the viewport, and set `pointer-events: none`. Keep real links (`<a href>`), let modified clicks open new tabs, and update the document title. This minimal skeleton resets scroll on every navigation; before shipping, integrate history scroll restoration and tear down/re-create the page's animation contexts as well as `initMotion()`.

## Framework routers

- **Next.js:** React's `<ViewTransition>` component is exposed through Next.js's view-transition support; enable it as the installed version's documentation describes (it began behind `experimental.viewTransition`). Without it, animate in-page presence with Motion's `AnimatePresence` and keep route changes instant.
- **Astro:** add `<ClientRouter />` from `astro:transitions` to the layout; name shared elements with `transition:name`, and pick `transition:animate="fade"` or a custom animation. Re-initialize scripts on `astro:page-load` ([stack and integration](stack-and-integration.md)).
- **SvelteKit:** call `document.startViewTransition` inside `onNavigate` and resolve it when the navigation completes.

## Intros and preloaders

Most pages need no preloader. Use one only when the first view depends on heavy WebGL or media that cannot progressively enhance.

- Show real progress from the asset loader; never a timer that counts to 100.
- Cap the intro at about 2.5 s, and let the visitor skip it.
- Play it once per session (`sessionStorage`), not on every navigation.
- Keep the content in the DOM underneath for crawlers, link previews and assistive technology.
- Under reduced motion, remove the intro entirely.

```js
export async function loadWithProgress(urls, onProgress) {
  if (urls.length === 0) { onProgress?.(1); return; }
  let done = 0;
  const report = () => onProgress?.(++done / urls.length);
  await Promise.all(urls.map(async url => {
    const image = new Image();
    image.src = url;
    try { await image.decode(); } finally { report(); }
  }));
}
```

## After every navigation

- Move focus to the new page's main heading (`tabindex="-1"`) or the main landmark, without scrolling it again.
- Announce the new page title in a polite live region for single-page apps.
- Restore scroll position on back and forward navigation.
- Refresh ScrollTrigger once the new content has fonts and images.
- Test: back during a transition, rapid double clicks, a slow destination, a failed request, keyboard-only navigation, reduced motion.
