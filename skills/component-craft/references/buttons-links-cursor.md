# Buttons, links and cursor

The pointer's first contact with the site. Responses must be instant, targets stable, and every hover effect must have a focus and touch equivalent. Snippets use tokens from [token architecture](../../design-tokens/references/token-architecture.md) and `damp()` from the [easing and timing](../../motion-engineering/references/easing-and-timing.md) module.

## Button system

| Variant | Use | Treatment |
| --- | --- | --- |
| Primary | The one main action in a view | Accent fill, on-accent label |
| Outline | Secondary action beside a primary | Transparent, strong line, ink label |
| Quiet | Tertiary and inline actions | Text only with a drawn underline |
| Icon | Compact actions with a visible or accessible label | 44 × 44 px target |

Sizes: 40 px (dense UI), 48 px (default), 56 px (hero and mobile primary). Primary actions go full width on phones inside the thumb zone.

```css
.button {
  --button-bg: var(--color-accent);
  --button-ink: var(--color-on-accent);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  min-block-size: 48px;
  padding-inline: 1.5em;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  background: var(--button-bg);
  color: var(--button-ink);
  font: 500 var(--step-0) / 1 var(--font-text);
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
  isolation: isolate;
  overflow: clip;
  transition:
    background-color var(--dur-base) var(--ease-standard),
    color var(--dur-base) var(--ease-standard),
    transform var(--dur-instant) var(--ease-standard);
}

.button:active { transform: scale(0.98); }
.button[data-variant="outline"] { --button-bg: transparent; --button-ink: var(--color-ink); border-color: var(--color-line-strong); }
.button[data-variant="quiet"] { --button-bg: transparent; --button-ink: var(--color-ink); padding-inline: 0; min-block-size: 44px; }
.button[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; }

@media (hover: hover) and (pointer: fine) {
  .button:hover { --button-bg: var(--color-accent-hover); }
  .button[data-variant]:hover { --button-bg: transparent; }
}
```

## Fill sweep

A fill that enters from the left and leaves to the right.

```css
.button[data-effect="sweep"]::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--color-ink);
  transform: scaleX(0);
  transform-origin: right center;
  transition: transform var(--dur-slow) var(--ease-out-expo);
}

@media (hover: hover) and (pointer: fine) {
  .button[data-effect="sweep"]:hover { color: var(--color-ground); }
  .button[data-effect="sweep"]:hover::before { transform: scaleX(1); transform-origin: left center; }
}

.button[data-effect="sweep"]:focus-visible { color: var(--color-ground); }
.button[data-effect="sweep"]:focus-visible::before { transform: scaleX(1); transform-origin: left center; }
```

Check the label against both fills.

## Text roll

The label slides up and an identical copy rises from below. The copy is presentation only: `content: … / ""` gives it empty alternative text.

```html
<a class="button" href="/fittings"><span class="roll" data-text="Book a fitting"><span>Book a fitting</span></span></a>
```

```css
.roll { display: inline-grid; overflow: clip; }
.roll > span, .roll::after { grid-area: 1 / 1; transition: transform var(--dur-slow) var(--ease-out-expo); }
.roll::after { content: attr(data-text) / ""; transform: translateY(105%); }

@media (hover: hover) and (pointer: fine) {
  :is(a, button):hover .roll > span { transform: translateY(-105%); }
  :is(a, button):hover .roll::after { transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .roll > span, .roll::after { transition: none; }
}
```

## Magnetic target

The visual inner wrapper leans toward the pointer by a few pixels; the hit area never moves.

```js
export function magnetic(target, { strength = 6, rate = 20 } = {}) {
  const allowed = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!allowed) return () => {};
  const inner = target.querySelector('[data-magnetic-inner]') ?? target.firstElementChild;
  if (!inner) return () => {};
  const originalTransform = inner.style.transform;
  const goal = { x: 0, y: 0 };
  const pos = { x: 0, y: 0 };
  let last = 0;
  let frame = 0;
  const loop = now => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    pos.x = damp(pos.x, goal.x, rate, dt);
    pos.y = damp(pos.y, goal.y, rate, dt);
    inner.style.transform = `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0)`;
    const moving = Math.abs(pos.x - goal.x) + Math.abs(pos.y - goal.y) > 0.05;
    frame = moving ? requestAnimationFrame(loop) : 0;
    if (!moving) last = 0;
  };
  const kick = () => { if (!frame) frame = requestAnimationFrame(loop); };
  const onMove = event => {
    const rect = target.getBoundingClientRect();
    goal.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2 * strength;
    goal.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2 * strength;
    kick();
  };
  const onLeave = () => {
    goal.x = 0;
    goal.y = 0;
    kick();
  };
  target.addEventListener('pointermove', onMove);
  target.addEventListener('pointerleave', onLeave);
  return () => {
    target.removeEventListener('pointermove', onMove);
    target.removeEventListener('pointerleave', onLeave);
    cancelAnimationFrame(frame);
    inner.style.transform = originalTransform;
  };
}
```

Use it on one or two signature controls, not every button.

## Loading and success

Keep the width stable, keep focus on the button, and announce the outcome.

```html
<button class="button" type="button" data-state="idle">
  <span class="button-label">Add to bag</span>
  <span class="button-spinner" aria-hidden="true"></span>
</button>
<p class="visually-hidden" aria-live="polite" data-status></p>
```

```css
.button-spinner { position: absolute; inset: 0; margin: auto; inline-size: 18px; block-size: 18px; border: 1.5px solid currentColor; border-inline-end-color: transparent; border-radius: 50%; opacity: 0; }
.button[data-state="loading"] .button-label { opacity: 0; }
.button[data-state="loading"] .button-spinner { opacity: 1; animation: spin 700ms linear infinite; }
@keyframes spin { to { rotate: 1turn; } }
@media (prefers-reduced-motion: reduce) {
  .button[data-state="loading"] .button-spinner { animation: none; }
}
```

```js
export async function runWithStatus(button, action, { live, busyAfter = 300, successLabel = 'Added', holdMs = 1800 } = {}) {
  if (button.getAttribute('aria-disabled') === 'true') return;
  const label = button.querySelector('.button-label');
  const original = label.textContent;
  button.setAttribute('aria-disabled', 'true');
  button.setAttribute('aria-busy', 'true');
  const timer = setTimeout(() => { button.dataset.state = 'loading'; }, busyAfter);
  try {
    await action();
    clearTimeout(timer);
    button.dataset.state = 'success';
    label.textContent = successLabel;
    if (live) live.textContent = successLabel;
    await new Promise(resolve => setTimeout(resolve, holdMs));
    label.textContent = original;
    button.dataset.state = 'idle';
  } catch (error) {
    clearTimeout(timer);
    button.dataset.state = 'error';
    if (live) live.textContent = error.message;
  } finally {
    button.removeAttribute('aria-disabled');
    button.removeAttribute('aria-busy');
  }
}
```

The spinner appears only after 300 ms, so fast actions never flash a loader. Errors carry a specific message from the action ("Only two left in 100 ml; the bag holds one").

## Links

Links inside paragraphs keep a visible underline at rest; color alone does not identify a link. Standalone and navigation links can draw their underline on hover.

```css
a { text-decoration-thickness: from-font; text-underline-offset: 0.18em; text-decoration-skip-ink: auto; }

.link-draw {
  text-decoration: none;
  background: linear-gradient(currentColor, currentColor) no-repeat 100% 100% / 0% 1px;
  transition: background-size var(--dur-slow) var(--ease-out-expo);
}

@media (hover: hover) and (pointer: fine) {
  .link-draw:hover { background-position: 0% 100%; background-size: 100% 1px; }
}

.link-draw:focus-visible, .link-draw[aria-current] { background-size: 100% 1px; }
```

External links that open a new tab say so: a visible icon plus visually hidden text "(opens in a new tab)", and `rel="noopener"`.

## Icon buttons and toggles

```html
<button class="icon-button" type="button" aria-label="Save to wishlist" aria-pressed="false">
  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
</button>
```

```css
.icon-button { display: inline-grid; place-items: center; inline-size: 44px; block-size: 44px; border: 0; border-radius: 50%; background: transparent; color: inherit; }
.icon-button[aria-pressed="true"] svg path { fill: currentColor; }
```

Toggle `aria-pressed` in the click handler; the filled icon is the visual state and the attribute is the announced state.

## Custom cursor

Only when the cursor carries information: "View" over a project, "Drag" over a gallery, "Play" over a film. Never replace the native cursor over text or inputs, and never on touch.

```html
<div class="cursor" aria-hidden="true"></div>
<a href="/work/atelier" data-cursor="view" data-cursor-label="View">Atelier</a>
```

```css
.cursor {
  position: fixed;
  inset: 0 auto auto 0;
  z-index: var(--z-cursor);
  display: grid;
  place-items: center;
  inline-size: 88px;
  block-size: 88px;
  border-radius: 50%;
  background: var(--color-ink);
  color: var(--color-ground);
  font-size: var(--step--1);
  pointer-events: none;
  opacity: 0;
  scale: 0.14;
  transition: opacity var(--dur-fast) var(--ease-standard), scale var(--dur-base) var(--ease-out-expo);
}

.cursor[data-visible] { opacity: 1; }
.cursor[data-visible][data-mode="view"], .cursor[data-visible][data-mode="drag"] { scale: 1; }
```

```js
export function cursorFollower(element, { rate = 18 } = {}) {
  const allowed = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!allowed) return () => {};
  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let last = 0;
  let frame = 0;
  const loop = now => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    x = damp(x, tx, rate, dt);
    y = damp(y, ty, rate, dt);
    element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    const moving = Math.abs(x - tx) + Math.abs(y - ty) > 0.1;
    frame = moving ? requestAnimationFrame(loop) : 0;
    if (!moving) last = 0;
  };
  const onMove = event => {
    tx = event.clientX;
    ty = event.clientY;
    if (!element.hasAttribute('data-visible')) {
      x = tx;
      y = ty;
      element.setAttribute('data-visible', '');
    }
    const target = event.target.closest('[data-cursor]');
    element.dataset.mode = target?.dataset.cursor ?? '';
    element.textContent = target?.dataset.cursorLabel ?? '';
    if (!frame) frame = requestAnimationFrame(loop);
  };
  const onLeave = () => element.removeAttribute('data-visible');
  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  return () => {
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    cancelAnimationFrame(frame);
  };
}
```

The label is decorative; the link keeps its own accessible name. Keep the native cursor visible unless the region is a gallery or film where the follower replaces it, and scope any `cursor: none` to `@media (hover: hover) and (pointer: fine)`. Deeper pointer mapping, masks and tilt: [cursor choreography](../../interactive-motion/references/cursor-choreography.md).

## Tooltips

Short, supplementary information on hover and focus. Essential information never lives only in a tooltip.

```html
<button class="info" type="button" aria-describedby="tip-wear" data-tip="tip-wear">How to wear</button>
<div class="tooltip" id="tip-wear" popover="hint" role="tooltip">Two sprays at the pulse points.</div>
```

```css
.info { anchor-name: --tip-wear; }
.tooltip {
  position-anchor: --tip-wear;
  position-area: top;
  position-try-fallbacks: flip-block;
  margin: 0 0 var(--space-2xs);
  padding: var(--space-2xs) var(--space-xs);
  border: 0;
  background: var(--color-ink);
  color: var(--color-ground);
  font-size: var(--step--1);
}
```

```js
export function tooltip(trigger) {
  const tip = document.getElementById(trigger.dataset.tip);
  if (!tip || typeof tip.showPopover !== 'function') return () => {};
  let timer = 0;
  let overTrigger = false;
  let overTip = false;
  let focused = false;
  let dismissed = false;
  const clear = () => { clearTimeout(timer); timer = 0; };
  const show = () => {
    clear();
    timer = setTimeout(() => {
      if (!dismissed && tip.isConnected && !tip.matches(':popover-open')) tip.showPopover();
    }, 120);
  };
  const hide = () => { clearTimeout(timer); if (tip.matches(':popover-open')) tip.hidePopover(); };
  const sync = () => {
    clear();
    if (overTrigger || overTip || focused) { if (!dismissed) show(); }
    else timer = setTimeout(() => { hide(); dismissed = false; }, 160);
  };
  const onKey = event => { if (event.key === 'Escape') { dismissed = true; hide(); } };
  const events = [
    [trigger, 'pointerenter', () => { overTrigger = true; sync(); }],
    [trigger, 'pointerleave', () => { overTrigger = false; sync(); }],
    [tip, 'pointerenter', () => { overTip = true; sync(); }],
    [tip, 'pointerleave', () => { overTip = false; sync(); }],
    [trigger, 'focus', () => { focused = true; sync(); }],
    [trigger, 'blur', () => { focused = false; sync(); }],
    [document, 'keydown', onKey],
  ];
  events.forEach(([node, name, handler]) => node.addEventListener(name, handler));
  return () => {
    hide();
    events.forEach(([node, name, handler]) => node.removeEventListener(name, handler));
  };
}
```

Browsers without `popover="hint"` but with the Popover API treat it as manual, which this script controls. Keep supplementary text in a visible fallback when the Popover API is unavailable. The pointer can cross into the tooltip, focus keeps it open, and Escape dismisses it, following [WAI guidance](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/).
