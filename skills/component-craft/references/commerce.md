# Commerce

Luxury commerce sells through calm confidence: accurate product imagery, clear prices, effortless choices and a bag that never loses anything. Motion supports choice and confirmation; it never delays a purchase.

## Product card

```html
<article class="product-card">
  <div class="swap frame">
    <img src="/img/orris-card.avif" width="800" height="1000" alt="Orris Nocturne, 100 ml flacon" loading="lazy">
    <img src="/img/orris-card-alt.avif" width="800" height="1000" alt="" loading="lazy">
  </div>
  <h3 class="product-name"><a href="/fragrances/orris-nocturne">Orris Nocturne</a></h3>
  <p class="product-note">Iris, resin, bergamot</p>
  <p class="product-price"><span class="visually-hidden">Price: </span>€185</p>
  <button class="icon-button product-save" type="button" aria-label="Save Orris Nocturne to wishlist" aria-pressed="false">…</button>
</article>
```

```css
.product-card { position: relative; display: grid; gap: var(--space-2xs); }
.product-card .frame { aspect-ratio: 4 / 5; }
.product-name { font-size: var(--step-1); }
.product-name a { text-decoration: none; }
.product-name a::after { content: ""; position: absolute; inset: 0; }
.product-save { position: absolute; inset: var(--space-xs) var(--space-xs) auto auto; z-index: var(--z-raised); }
.product-note { color: var(--color-muted); }
.product-price { font-variant-numeric: tabular-nums; }
.product-card:focus-within { outline: var(--focus-width) solid var(--focus-color); outline-offset: var(--focus-offset); }
```

- The name link stretches over the card; secondary controls sit above it with a higher z-index.
- Badges only for true states: new, limited edition with a real quantity, sold out.
- Quick add on hover is a desktop enhancement; the product page remains the path on touch.

## Collection grid and filters

```css
.collection { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr)); gap: var(--space-xl) var(--gutter); }
```

- Filters as toggle buttons (`aria-pressed`) or checkboxes in a `<fieldset>`; on phones they live in a drawer with an "Show 24 results" button.
- Announce the result count in a polite live region after each change.
- Keep filter and sort state in the URL so back, refresh and sharing work.
- Prefer a "Load more" button to infinite scroll; move focus to the first new item after loading.

## Product page

```text
Desktop                                   Phone
┌──────────────────────┬───────────────┐   ┌──────────────────────┐
│ gallery (scrolls)    │ name, price   │   │ gallery rail (swipe) │
│ [ image ]            │ variants      │   │ name, price          │
│ [ image ]            │ [Add to bag]  │   │ variants             │
│ [ image ]            │ delivery      │   │ [   Add to bag    ]  │
│                      │ details ▾     │   │ details ▾            │
└──────────────────────┴─ sticky ──────┘   └──────────────────────┘
```

The details column is sticky on desktop (`position: sticky; top: var(--header-h)`). On phones, a compact add-to-bag bar appears once the main button leaves the viewport:

```js
export function stickyBuyBar(button, bar) {
  const observer = new IntersectionObserver(([entry]) => {
    bar.toggleAttribute('data-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
  });
  observer.observe(button);
  return () => observer.disconnect();
}
```

The bar repeats the selected variant and price, and stays within the safe area (`padding-bottom: env(safe-area-inset-bottom)`).

## Variant selectors

Colors and sizes are radio groups: one choice, arrow-key navigation and a legend for free.

```html
<fieldset class="swatches">
  <legend>Finish: <span data-selected-label>Smoked glass</span></legend>
  <label class="swatch" style="--swatch: #3B3431">
    <input type="radio" name="finish" value="smoked" checked>
    <span class="visually-hidden">Smoked glass</span>
  </label>
  <label class="swatch" style="--swatch: #D9D4CC">
    <input type="radio" name="finish" value="frosted">
    <span class="visually-hidden">Frosted glass</span>
  </label>
</fieldset>
```

```css
.swatches { display: flex; flex-wrap: wrap; gap: var(--space-xs); border: 0; padding: 0; margin: 0; }
.swatches legend { margin-block-end: var(--space-xs); }
.swatch { position: relative; display: grid; place-items: center; inline-size: 44px; block-size: 44px; border-radius: 50%; cursor: pointer; }
.swatch::before { content: ""; inline-size: 28px; block-size: 28px; border-radius: 50%; background: var(--swatch); box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--color-ink) 18%, transparent); }
.swatch input { position: absolute; inset: 0; margin: 0; opacity: 0; cursor: pointer; }
.swatch:has(input:checked) { box-shadow: 0 0 0 1.5px var(--color-ink); }
.swatch:has(input:focus-visible) { outline: var(--focus-width) solid var(--focus-color); outline-offset: 2px; }
.swatch:has(input:disabled) { opacity: 0.35; cursor: not-allowed; }
```

- The selected ring is the visual state; the legend repeats the selected name in text, so color is never the only cue.
- Unavailable sizes are disabled with a nearby "Notify me when available" action.
- Changing a variant updates the images, price, availability and URL together.

## Price

```js
export function formatPrice(amount, currency, locale = document.documentElement.lang || undefined) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
```

```html
<p class="price">
  <del><span class="visually-hidden">Original price: </span>€220</del>
  <ins><span class="visually-hidden">Sale price: </span>€185</ins>
</p>
```

Prices come from the commerce system, never hard-coded. State taxes, duties and shipping where the customer decides, in plain words.

## Add to bag and mini cart

1. The button reacts at once and shows progress only after 300 ms ([buttons, links and cursor](buttons-links-cursor.md)).
2. On success, the label confirms with the same verb ("Added"), the bag count updates, and a polite live region announces "Orris Nocturne, 100 ml, added to your bag".
3. Open the mini-cart drawer only when it helps the next step; otherwise let the count and message confirm.
4. An optional flight of the thumbnail into the bag icon (Flip or a View Transition, 500–700 ms) is a desktop delight; skip it under reduced motion.

## Cart and quantity

```html
<div class="quantity" role="group" aria-label="Quantity for Orris Nocturne">
  <button type="button" data-step="-1" aria-label="Decrease quantity">−</button>
  <input type="number" inputmode="numeric" min="1" max="5" value="1" aria-label="Quantity">
  <button type="button" data-step="1" aria-label="Increase quantity">+</button>
</div>
```

```js
export function quantityStepper(group, onChange) {
  const input = group.querySelector('input');
  const clampValue = value => Math.min(Number(input.max) || Infinity, Math.max(Number(input.min) || 0, value));
  const commit = value => {
    input.value = String(clampValue(value));
    onChange?.(Number(input.value));
  };
  const onClick = event => {
    const button = event.target.closest('[data-step]');
    if (button) commit(Number(input.value) + Number(button.dataset.step));
  };
  const onInput = () => commit(Number(input.value) || Number(input.min) || 1);
  group.addEventListener('click', onClick);
  input.addEventListener('change', onInput);
  return () => {
    group.removeEventListener('click', onClick);
    input.removeEventListener('change', onInput);
  };
}
```

- Removing an item offers undo for a few seconds instead of a confirmation dialog.
- A free-shipping progress line is honest and specific ("€15 from free delivery").
- The checkout button names the next step ("Checkout") and keeps the total visible.

## Configurator panel

For engraving, materials, sizes or bespoke builds.

- Steps in a fixed order with the current step marked (`aria-current="step"`) and every previous choice editable.
- The preview updates within 100 ms of each change; heavy renders show the previous state until the new one is ready ([procedural WebGL](../../procedural-webgl/SKILL.md) for live previews).
- A summary with price that updates in a polite live region, debounced so it announces once per change.
- State in the URL for sharing; a reset action; a clear "Add to bag" with the full configuration named.
- Engraving text previews in the real face and checks length limits as the visitor types.

## Wishlist, delivery and trust

- Wishlist is a toggle button with `aria-pressed`; saving works without an account where possible.
- Delivery shows a date range for the visitor's region ("Arrives 3–5 June"), returns in one sentence with a link to the policy.
- Trust comes from specifics (materials, origin, care, warranty, real reviews with dates), not from generic badge rows.
- Payment and security notes appear near the checkout action only.
