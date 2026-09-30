# Forms, overlays and feedback

Where visitors commit: signing up, booking, asking, buying. These components decide Usability scores. Keep labels visible, errors specific, focus managed and overlays escapable.

## Text fields

```html
<div class="field">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="email" required aria-describedby="email-hint email-error">
  <p class="field-hint" id="email-hint">Used for your order confirmation only.</p>
  <p class="field-error" id="email-error" hidden></p>
</div>
```

```css
.field { display: grid; gap: var(--space-3xs); }
.field label { font-size: var(--step--1); color: var(--color-muted); }

.field :is(input, select, textarea) {
  min-block-size: 48px;
  padding: 0.7em 0;
  border: 0;
  border-block-end: 1px solid var(--color-line-strong);
  border-radius: 0;
  background: transparent;
  color: var(--color-ink);
  font-size: max(16px, var(--step-0));
  transition: border-color var(--dur-fast) var(--ease-standard);
}

.field :is(input, select, textarea):focus-visible {
  outline: none;
  border-block-end-color: var(--color-ink);
  box-shadow: 0 1px 0 0 var(--color-ink);
}

.field [aria-invalid="true"] { border-block-end-color: var(--color-danger); }
.field-error { margin: 0; color: var(--color-danger); font-size: var(--step--1); }
.field-hint { margin: 0; color: var(--color-muted); font-size: var(--step--1); }
```

- Inputs use at least 16 px text so phones do not zoom on focus.
- The focus style replaces the outline with a clear 2 px bottom edge; check it against the surface at 3:1.
- Set `type`, `autocomplete` and `inputmode` on every field; they decide the keyboard and autofill.
- Placeholders are examples, never labels.

## Validation

Validate on blur and on submit, re-validate while typing only once a field has shown an error, and move focus to the first invalid field.

```js
export function enhanceForm(form, messages = {}) {
  const originalNoValidate = form.noValidate;
  form.noValidate = true;
  const fields = () => [...form.elements].filter(element => element.willValidate);
  const messageFor = field => {
    const custom = messages[field.name] ?? {};
    const key = Object.keys(custom).find(name => field.validity[name]);
    return key ? custom[key] : field.validationMessage;
  };
  const report = field => {
    const valid = field.checkValidity();
    const error = document.getElementById(`${field.id}-error`);
    field.setAttribute('aria-invalid', String(!valid));
    if (error) {
      error.hidden = valid;
      error.textContent = valid ? '' : messageFor(field);
    }
    return valid;
  };
  const onFocusOut = event => {
    if (event.target.willValidate && event.target.value) report(event.target);
  };
  const onInput = event => {
    if (event.target.getAttribute('aria-invalid') === 'true') report(event.target);
  };
  const onSubmit = event => {
    const invalid = fields().filter(field => !report(field));
    if (invalid.length) {
      event.preventDefault();
      invalid[0].focus();
    }
  };
  form.addEventListener('focusout', onFocusOut);
  form.addEventListener('input', onInput);
  form.addEventListener('submit', onSubmit);
  return () => {
    form.noValidate = originalNoValidate;
    form.removeEventListener('focusout', onFocusOut);
    form.removeEventListener('input', onInput);
    form.removeEventListener('submit', onSubmit);
  };
}
```

```js
enhanceForm(document.querySelector('#fitting'), {
  email: {
    valueMissing: 'Enter your email address so we can confirm the fitting.',
    typeMismatch: 'Enter an email address like name@example.com.',
  },
});
```

Write messages that say what happened and how to fix it; never "Invalid input".

## Select

```css
@supports (appearance: base-select) {
  select, ::picker(select) { appearance: base-select; }

  select {
    display: flex;
    align-items: center;
    gap: var(--space-2xs);
    padding-inline: 0;
  }

  ::picker(select) {
    margin-block-start: var(--space-3xs);
    border: 1px solid var(--color-line);
    background: var(--color-ground);
    box-shadow: var(--shadow-overlay);
  }

  option { padding: var(--space-2xs) var(--space-s); }
  option:checked { background: var(--color-surface); }
}
```

Keep the native select usable; feature-detect this enhancement and test the project's supported browsers.

## Checkboxes, radios and switches

The simplest premium result is the native control in the brand color:

```css
input[type="checkbox"], input[type="radio"] {
  accent-color: var(--color-accent);
  inline-size: 1.25rem;
  block-size: 1.25rem;
}
```

A switch is a checkbox with `role="switch"`:

```html
<label class="switch"><input type="checkbox" role="switch"> Sample with every order</label>
```

```css
.switch { display: inline-flex; align-items: center; gap: var(--space-xs); min-block-size: 44px; cursor: pointer; }

.switch input {
  appearance: none;
  position: relative;
  inline-size: 44px;
  block-size: 26px;
  margin: 0;
  border-radius: 999px;
  background: var(--color-line-strong);
  transition: background-color var(--dur-base) var(--ease-standard);
}

.switch input::before {
  content: "";
  position: absolute;
  inset: 3px auto auto 3px;
  inline-size: 20px;
  block-size: 20px;
  border-radius: 50%;
  background: var(--color-ground);
  transition: translate var(--dur-spring-snappy, 240ms) var(--ease-spring-snappy, var(--ease-out-quart));
}

.switch input:checked { background: var(--color-accent); }
.switch input:checked::before { translate: 18px 0; }
.switch input:focus-visible { outline: var(--focus-width) solid var(--focus-color); outline-offset: var(--focus-offset); }
```

Group related radios in a `<fieldset>` with a `<legend>`.

## Textarea that grows

```css
textarea {
  field-sizing: content;
  min-block-size: 4lh;
  max-block-size: 16lh;
  resize: vertical;
}
```

Browsers without `field-sizing` keep the min/max height and manual resizing; test the supported browser matrix.

## Newsletter, contact and booking

| Form | Fields | Finish |
| --- | --- | --- |
| Newsletter | Email only | Inline button, success replaces the form in place ("Check your inbox to confirm"), consent text visible, no pre-ticked boxes |
| Contact | Name, email, topic, message | Topic select routes the request; a hidden honeypot field instead of a puzzle; confirmation states when to expect a reply |
| Booking | Steps: date, time, details, review | Progress list with `aria-current="step"`, data kept when going back, focus moves to each step's heading, a summary before confirming |

## Dialog

```html
<dialog class="modal" id="size-guide" aria-labelledby="size-guide-title" closedby="any">
  <h2 id="size-guide-title">Size guide</h2>
  <div class="modal-body">…</div>
  <button type="button" data-close>Close</button>
</dialog>
```

```css
.modal {
  inline-size: min(40rem, 100% - 2 * var(--margin));
  padding: var(--space-xl);
  border: 0;
  border-radius: var(--radius-surface);
  background: var(--color-ground);
  color: var(--color-ink);
  box-shadow: var(--shadow-overlay);
  opacity: 0;
  translate: 0 12px;
  transition:
    opacity var(--dur-base) var(--ease-out-quart),
    translate var(--dur-slow) var(--ease-out-expo),
    overlay var(--dur-slow) allow-discrete,
    display var(--dur-slow) allow-discrete;
}

.modal[open] { opacity: 1; translate: 0 0; }

@starting-style {
  .modal[open] { opacity: 0; translate: 0 12px; }
}

.modal::backdrop {
  background: color-mix(in oklch, var(--color-ink) 45%, transparent);
  backdrop-filter: blur(4px);
}
```

```js
export function dialogControls(dialog, motion) {
  let locked = false;
  const open = () => {
    if (dialog.open) return;
    dialog.showModal();
    motion?.lock();
    locked = true;
  };
  const onClose = () => {
    if (!locked) return;
    locked = false;
    motion?.unlock();
  };
  const onClick = event => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
    if (event.target.closest('[data-close]') || outside) dialog.close();
  };
  dialog.addEventListener('click', onClick);
  dialog.addEventListener('close', onClose);
  return {
    open,
    destroy() {
      if (dialog.open) dialog.close();
      onClose();
      dialog.removeEventListener('click', onClick);
      dialog.removeEventListener('close', onClose);
    },
  };
}
```

Call `open()` from the trigger. `closedby="any"` enables backdrop and Escape dismissal where supported; the click handler covers other browsers, and Escape always closes a modal dialog. Put `autofocus` on the first useful control; focus returns to the trigger on close.

## Drawer

A side sheet is a dialog positioned at the edge:

```css
.drawer {
  inset: 0 0 0 auto;
  inline-size: min(28rem, 100%);
  block-size: 100dvh;
  max-block-size: none;
  margin: 0;
  translate: 100% 0;
  transition: translate var(--dur-slow) var(--ease-out-expo), overlay var(--dur-slow) allow-discrete, display var(--dur-slow) allow-discrete;
}

.drawer[open] { translate: 0 0; }

@starting-style {
  .drawer[open] { translate: 100% 0; }
}
```

Use it for the bag, filters on phones, and secondary navigation.

## Accordion

Use `<details>` and `<summary>`; the height transition pattern is in [heroes and sections](heroes-and-sections.md). Add `name` to make a group exclusive.

## Tabs

For switching views of the same object (notes, ingredients, care). If the content is long or independent, use separate sections instead.

```html
<div class="tabs">
  <div role="tablist" aria-label="About this fragrance">
    <button type="button" role="tab" id="tab-notes" aria-controls="panel-notes" aria-selected="true">Notes</button>
    <button type="button" role="tab" id="tab-care" aria-controls="panel-care" aria-selected="false" tabindex="-1">Care</button>
  </div>
  <section role="tabpanel" tabindex="0" id="panel-notes" aria-labelledby="tab-notes">…</section>
  <section role="tabpanel" tabindex="0" id="panel-care" aria-labelledby="tab-care" hidden>…</section>
</div>
```

```js
export function tabs(root) {
  const list = root.querySelector('[role="tablist"]');
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = tab => {
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    }
    tab.focus();
  };
  const onClick = event => {
    const tab = event.target.closest('[role="tab"]');
    if (tabs.includes(tab)) select(tab);
  };
  const onKey = event => {
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(tabs[(next + tabs.length) % tabs.length]);
  };
  list.addEventListener('click', onClick);
  list.addEventListener('keydown', onKey);
  return () => {
    list.removeEventListener('click', onClick);
    list.removeEventListener('keydown', onKey);
  };
}
```

Animate the indicator with a stiff leading edge and a softer trailing edge ([easing and timing](../../motion-engineering/references/easing-and-timing.md)).

## Toasts

```html
<div class="toasts" aria-live="polite" aria-atomic="false"></div>
```

```js
export function toast(region, message, { duration = 5000 } = {}) {
  const item = document.createElement('p');
  item.className = 'toast';
  item.textContent = message;
  region.append(item);
  let timer = setTimeout(() => item.remove(), duration);
  const pause = () => clearTimeout(timer);
  const resume = () => { timer = setTimeout(() => item.remove(), duration / 2); };
  item.addEventListener('pointerenter', pause);
  item.addEventListener('pointerleave', resume);
  return () => {
    clearTimeout(timer);
    item.remove();
  };
}
```

Toasts confirm; they never carry errors that need action or the only copy of important information. Place them where they do not cover the primary action (bottom center on phones).

## Loading states

| Wait | Show |
| --- | --- |
| Under 300 ms | Nothing |
| 300 ms – 2 s | Inline indicator in the control, or a skeleton that matches the final layout |
| Over 2 s | Progress with a reason ("Preparing your engraving preview") |
| Known progress | A determinate bar with a percentage |

Skeletons reserve the exact geometry of the content, pulse gently at most (1.4 s cycle), stop under reduced motion, and are replaced with a 150 ms crossfade. Optimistic updates (wishlist, quantity) apply immediately and roll back with a message on failure.

## Empty and error states

- Empty: say what will appear and offer the action that fills it ("Your wishlist is empty. Browse the iris collection").
- Error: say what failed and what to do, in the interface's voice, without apology or blame ("We couldn't reach the bag. Your items are saved; try again").
- Keep the page's structure and typography; an error page is still a designed page.

## Consent banner

A non-modal banner at the bottom, with **Accept** and **Reject** as equal buttons and a link to preferences. It never covers the primary action or the header, never pre-selects optional categories, and remembers the choice. Test it with keyboard and screen reader like any other component.
