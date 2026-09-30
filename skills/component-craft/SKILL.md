---
name: component-craft
description: Build every interface component of a premium website to award-level finish - navigation, menus, buttons, links, cursors, tooltips, heroes, content sections, galleries, carousels, media, forms, dialogs, drawers, accordions, tabs, toasts, loading and empty states, and commerce flows - with anatomy, states, motion values, accessibility and code. Use when building, polishing or reviewing components, or when components look like a default UI kit.
---

# Component Craft

Jurors judge components in seconds: the feel of a button press, the menu opening, a form error, a product image changing. Build each component from native elements, give it every state, time its motion from tokens, and make it look like it belongs to this subject rather than to a kit.

## Quality bar

A component is finished when every line holds:

- [ ] **Native first.** `<button>`, `<a href>`, `<dialog>`, `popover`, `<details>`, real inputs and labels. ARIA only fills gaps native elements cannot.
- [ ] **All states designed.** The matrix below, including the unhappy ones.
- [ ] **Keyboard complete.** Reachable in visual order, operable with Enter, Space, Escape and arrows where expected, focus visible and never trapped.
- [ ] **Screen-reader truthful.** Names, roles and state (`aria-expanded`, `aria-pressed`, `aria-current`, `aria-invalid`) match what is visible.
- [ ] **Touch-ready.** Targets at least 24 × 24 px, 44 × 44 px for primary actions on phones; hover information has a tap or focus equivalent.
- [ ] **Motion from tokens.** Response under 100 ms; durations and easings from [motion engineering](../motion-engineering/SKILL.md); reduced motion keeps meaning.
- [ ] **Content extremes survive.** Long names, translations, 200 % text, missing images, zero and huge numbers.
- [ ] **Shared decisions.** Repeated colors, space, type and motion use the project's [design tokens](../design-tokens/SKILL.md); preserve an established system.
- [ ] **Coherent finish.** Match the site's hierarchy and identity. Familiar controls can stay quiet; each component does not need its own signature effect.

## State matrix

Fill one row per component before styling it.

| State | Visual change | Motion | Announced |
| --- | --- | --- | --- |
| Default | — | — | Name and role |
| Hover (fine pointers) | Reveal or emphasis tied to meaning | 180–240 ms in, 120–160 ms out | — |
| Focus-visible | Token focus ring, never removed | Instant | Focus moves |
| Active or pressed | Scale 0.97–0.98 or tone step | 80–120 ms | — |
| Selected, current, checked | Persistent marker beyond color | 160–240 ms | `aria-current`, `aria-pressed`, `aria-selected` or native |
| Disabled | Lower contrast plus a reason nearby | — | Native `disabled` or `aria-disabled` with explanation |
| Loading | Width-stable label swap or inline progress | Indicator only after 300 ms | Busy state or live region |
| Success | Confirmation in the component's own voice | 240–400 ms | Polite live region |
| Error | Specific message next to the cause | Short shake only if brand-appropriate, never loops | `aria-invalid`, `aria-describedby` |
| Empty | Invitation to act | — | Visible text |

## Principles for a premium feel

- **Fewer, larger, calmer controls.** One primary action per view; secondary actions quieter by tone, not smaller than usable.
- **Type-led controls.** Buttons and links carry the typographic voice; icons support words instead of replacing them.
- **Separation by tone and space.** Avoid one radius and one shadow on everything; follow the radius and elevation policies.
- **Instant response, considered arrival.** The press reacts immediately; the result can arrive with a crafted transition.
- **Stable geometry.** Hit areas never move with decorative motion; layout never jumps when state changes.
- **Honest content.** Real product data, real prices, real availability; no invented urgency.

## Load by component

| Reference | Components |
| --- | --- |
| [Navigation](references/navigation.md) | Header that hides and returns, full-screen menu, menu icon, mega menu, language and currency switch, skip link, chapter index with scroll spy, footer |
| [Buttons, links and cursor](references/buttons-links-cursor.md) | Button system, fill sweep, text roll, magnetic, loading and success, links with drawn underlines, icon buttons, toggles, custom cursor, tooltips |
| [Heroes and sections](references/heroes-and-sections.md) | Eight hero patterns, manifesto, feature story, specification sheet, process, proof and press, figures, gallery section, FAQ, closing call to action, contact and location |
| [Media and galleries](references/media-and-galleries.md) | Responsive images, hover image swaps, project list with floating preview, carousels, draggable gallery, lightbox, background and player video, before-after comparison |
| [Forms, overlays and feedback](references/forms-overlays-feedback.md) | Fields, validation, selects, checkboxes, radios and switches, auto-growing textareas, newsletter, contact, booking steps, dialogs, drawers, menus, accordions, tabs, toasts, loading, skeletons, empty and error states, consent |
| [Commerce](references/commerce.md) | Product card, collection grid and filters, product page, variant selectors, price, add to bag, mini cart, cart, configurator panel, wishlist, delivery and returns |
| [Data tables and dense UI](references/data-tables.md) | Comparison tables, sorting, filters, selection scope, row actions, chart alternatives and responsive density |

Related: [interaction design](../interaction-design/SKILL.md) for state contracts and interruption, [visual accessibility](../visual-accessibility/SKILL.md), [responsive composition](../responsive-composition/SKILL.md), [cursor choreography](../interactive-motion/references/cursor-choreography.md).
