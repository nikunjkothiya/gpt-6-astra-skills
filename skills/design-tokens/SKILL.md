---
name: design-tokens
description: Define and generate the token system and CSS foundation for a premium website - primitive, semantic and component tokens for color, type, space, radius, elevation, layers, motion and focus; a base stylesheet; light, dark and section themes; Tailwind v4 theme mapping; editorial grids and layout patterns. Use when starting a site's CSS foundation, replacing magic numbers, theming, or building grids, rhythm and responsive layouts.
---

# Design Tokens

Tokens keep shared decisions consistent across components. Reuse the project's existing system; introduce a token when a repeated value or theme role benefits from shared ownership. A unique local relationship need not become a global variable.

## Tiers

| Tier | Holds | Example |
| --- | --- | --- |
| Primitive | Raw values from the palette, scales and curves | `--orris-100: #E8E3EA`, `--step-3`, `--space-l`, `--ease-out-expo` |
| Semantic | Roles used across the site | `--color-ground`, `--color-ink`, `--font-display`, `--radius-media`, `--dur-base`, `--z-overlay` |
| Component | Decisions local to one component, defaulting to semantics | `--button-bg: var(--color-accent)` |

Name by role, not appearance: `--color-accent`, never `--color-brown`. Keep one naming pattern: `--{category}-{role}[-{variant}]`.

## Generate when useful

Write one spec file with colors, contrast pairs, fonts, type and space scales and springs, then generate the CSS:

```text
node scripts/tokens.mjs check tokens.spec.json
node scripts/tokens.mjs css tokens.spec.json
```

These paths are relative to this package. From the target project, invoke `node "<package-root>/scripts/tokens.mjs"` with its actual absolute path. `css` prints the generated output only after validation passes. Inspect that output before replacing an existing stylesheet; shell redirection would truncate the destination even if generation fails. The format and a complete example are in [token architecture](references/token-architecture.md). Without the helper, maintain values using the project's own token tooling and verify the same pairs and endpoints.

## Scales and policies

| Category | Policy |
| --- | --- |
| Type | Fluid steps from `tokens.mjs type`; hero sizes are named exceptions |
| Space | Fluid steps `3xs`–`4xl` from `tokens.mjs space`; sections use `--section-y`; gaps inside a group are smaller than gaps between groups |
| Layout | `--margin`, `--gutter`, `--content`, `--wide`, `--measure`; grids from [layout and grid](references/layout-and-grid.md) |
| Radius | A policy, not one value: controls, media and surfaces each get a radius role; square is a valid choice |
| Elevation | Tone first; shadows only where layers overlap, layered and tinted by ink |
| Layers | A short z-index scale: base, raised, sticky, header, overlay, modal, toast, cursor |
| Motion | Duration and easing tokens, travel distances, stagger; reduced-motion overrides zero the travel |
| Focus | Width, offset and color tokens used by every interactive element |
| Breakpoints | Content-driven; prefer container queries for components, media queries for page layout |

## Rules

- Shared colors, scales and timings belong in tokens. Keep justified local values local; avoid inventing a token or mandatory decision document for every CSS literal.
- Themes swap semantic tokens only (`[data-theme]` or a section class); components do not change.
- For a new identity, map framework utilities to deliberate semantic roles. Preserve an existing brand palette and avoid unrelated global resets during a focused change.
- Every text pair used in a theme is in the spec's `pairs` list and passes.
- Tokens exist for states too: hover, pressed, disabled, focus, selected, error.

## Load next

- [Token architecture](references/token-architecture.md): spec format, the full semantic token file, base stylesheet, themes, component tokens, Tailwind v4 `@theme` mapping.
- [Layout and grid](references/layout-and-grid.md): breakout page grid, 12-column subgrid, asymmetric compositions, sticky split, rails, masonry, container queries, full-height sections and an ASCII layout library.
- Related: [typography system](../typography-system/SKILL.md), [color system](../color-system/SKILL.md), [motion engineering](../motion-engineering/SKILL.md), [responsive composition](../responsive-composition/SKILL.md).
