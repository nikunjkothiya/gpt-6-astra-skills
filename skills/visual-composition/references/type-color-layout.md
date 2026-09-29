# Implementing Typography, Color, and Layout Relationships

Use this reference after deciding what should lead and what should support it. The values below illustrate one restrained product specimen treatment. Derive values from the actual font, content, identity, and space; these are not universal premium-design tokens.

## Turn roles into a small working system

Start with the main title, a paragraph, a control, a caption, and a numeric comparison. Load the intended font before judging wraps. A type sample should include the real long title and applicable language, punctuation, figures, and units. Confirm supplied font rights and files; choose an available alternative when an exact face is unavailable.

For an editorial instrument catalog, display type can carry character while controls remain familiar. A dense operational tool may use one family throughout and establish hierarchy through weight, width, and alignment instead.

```css
.catalog {
  --paper: #f7f3e8;
  --ink: #151b1f;
  --muted: #535b61;
  --accent: #b33c25;
  --rule: #ded6c8;
  --display-font: Georgia, "Times New Roman", serif;
  --reading-font: system-ui, sans-serif;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--reading-font);
}

.catalog-title {
  margin: 0;
  max-inline-size: 15ch;
  font-family: var(--display-font);
  font-size: clamp(2.4rem, 1.5rem + 4vw, 5.5rem);
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: -0.025em;
}

.catalog-copy {
  max-inline-size: 62ch;
  font-size: 1.0625rem;
  line-height: 1.6;
}

.catalog-caption {
  color: var(--muted);
  font-size: 0.875rem;
  line-height: 1.45;
}

.catalog-value {
  font-variant-numeric: lining-nums tabular-nums;
  text-align: end;
}
```

The title's tight line height and tracking suit this particular large Latin display treatment; verify descenders, accents, and the real face before retaining them. Different scripts or a longer title can require looser spacing and a different measure. `ch` is a font-relative measure, not an exact count of arbitrary characters.

Bound fluid type with readable limits and verify enlargement; a formula containing viewport units still needs a real zoom and text-size check. If the title's type treatment loses readable hierarchy at constrained sizes, use a simpler size rule there. [MDN documents `clamp()` bounds and accessibility considerations](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp).

Keep source text intact. Use a semantic phrase wrapper or conditional line break only when the phrase must remain together and the narrow version is verified. Do not shrink a long product name repeatedly until it fits an arbitrary box. Give its region more space or revise the composition.

## Choose color by its job and its area

For the catalog above, warm paper softens the field, near-black anchors reading, and a small red-orange accent marks action. This palette would be a poor automatic choice for an established blue technical brand or a full-screen immersive night scene.

Build and inspect a palette in its intended proportions: page ground, object or image, paragraph, button, selected control, focus, and error. A set of equally sized swatches conceals how dominant a field color becomes.

```css
.catalog-action {
  border: 1px solid var(--accent);
  border-radius: 0.25rem;
  padding: 0.75rem 1rem;
  background: var(--accent);
  color: #fff;
  font: inherit;
}

.catalog-action:focus-visible {
  outline: 3px solid var(--ink);
  outline-offset: 3px;
}

.catalog-choice[aria-pressed="true"] {
  border-color: var(--ink);
  box-shadow: inset 0 0 0 1px var(--ink);
  font-weight: 650;
}
```

Use `aria-pressed` only for a genuine toggle button; use the correct selection semantics for radios, tabs, or other controls. A selected swatch also needs a visible label or mark, especially when its fill is the product color. Define errors and pending states separately from brand expression.

Measure the actual rendered foreground/background combinations, including hover, focus, overlays, and image variation. A subdued decorative rule may be suitable between already grouped paragraphs and insufficient as the only visible boundary of a control. See [visual accessibility](../../visual-accessibility/SKILL.md) for the applicable criteria. Do not apply low opacity to the whole control to create a quieter text role.

For a dark presentation, rebalance field, text, surfaces, and accent independently. Inspect saturated accents at their actual area and reduce visual competition from nearby highlights. Treat a material highlight as illumination evidence rather than copying it directly into a UI token.

## Preserve relationships in implementation

Use a shared layout parent for rails that must agree. Reserve local offsets for justified optical adjustments after the parent geometry is correct.

```css
.catalog-shell {
  inline-size: min(100%, 88rem);
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 4rem);
  box-sizing: border-box;
}

.catalog-stack > * + * { margin-block-start: 1.25rem; }
.catalog-stack > .catalog-caption { margin-block-start: 0.5rem; }

.catalog-specifications {
  margin: 0;
}

.catalog-specification {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.75rem 1.5rem;
  padding-block: 0.875rem;
  border-block-end: 1px solid var(--rule);
}

.catalog-specification > * { margin: 0; min-inline-size: 0; }
.catalog-specification dd { text-align: end; overflow-wrap: anywhere; }
```

This definition-list pattern supports label/value facts. Use a table when several products must be compared along shared attributes. At a width where the actual value labels become awkward, change the row treatment or disclose optional prose; avoid silently removing decision evidence. [Responsive composition](../../responsive-composition/SKILL.md) owns these adaptations.

Use `object-fit: contain` when the full object silhouette is necessary. Use `cover` when a photographic crop is intentional, choose its focal position from the actual image, and inspect both short and tall frames. Set source image dimensions or an intentional aspect ratio to make loading behavior predictable. A blurred low-resolution placeholder does not establish the quality of the final asset.

Choose SVG for scalable diagrams with explicit geometry, HTML for readable and interactive text, and canvas or WebGL for workloads that need their rendering behavior. Match stroke scale and annotation weight at the intended display size. In a quantitative figure, decoration must preserve units, scale, uncertainty, and comparison meaning.

## Diagnose by cause

| Observed defect | First inspection | Repair to try |
| --- | --- | --- |
| Title dominates but says little | Actual content and relation to the subject | Improve the message or reduce its share of visual weight |
| Text wraps differently from the approved view | Font load, text, weight, measure, then tracking | Fix the first differing cause before moving neighboring regions |
| Layout seems busy despite generous gaps | Repeated borders, saturated labels, shadows | Quiet the competing channel while retaining grouping |
| Layout seems empty | Useful subject scale and evidence placement | Enlarge or reposition meaningful content |
| Repeated values drift | Shared column parent, units, type features | Repair shared alignment instead of per-row padding |
| Image overlay is readable only sometimes | Entire image tone range and loading fallback | Provide a stable backing or move text into its own region |
| Palette looks unrelated to the object | Relative area, illumination, image treatment | Rebalance field and accent against the real subject |

Inspect the whole page at reduced scale for mass and rhythm, then at normal scale for reading and control states. A coherent static image is one checkpoint; the composition also needs to survive loading, errors, selection changes, and responsive conditions.
