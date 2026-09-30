# Palette library

Starting palettes for premium archetypes. Pick by subject, then adjust from the real imagery and brand; a palette copied unchanged is a template. Every block below is machine-checked: `node scripts/tokens.mjs palettes skills/color-system/references/palette-library.md` verifies each listed pair, and the package tests run the same check.

Roles:

| Role | Job |
| --- | --- |
| ground | Page background |
| surface | Grouped areas, cards, panels, inputs |
| ink | Primary text and icons |
| muted | Secondary text: captions, metadata, placeholders never carry essential information |
| accent | Actions, links, selection, focus when it passes 3:1 |
| on-accent | Text and icons on accent fills |

Pair minimums in each block: ink on ground and surface 7:1, muted on ground and surface 4.5:1, on-accent on accent 4.5:1, accent on ground 4.5:1 when it colors link text, 3:1 when it is used only for large type, fills and UI parts.

Derive the rest instead of adding hand-picked colors:

```css
:root {
  --color-line: color-mix(in oklch, var(--color-ink) 14%, var(--color-ground));
  --color-line-strong: color-mix(in oklch, var(--color-ink) 28%, var(--color-ground));
  --color-accent-hover: color-mix(in oklch, var(--color-accent), var(--color-ink) 14%);
  --color-accent-pressed: color-mix(in oklch, var(--color-accent), var(--color-ink) 24%);
  --color-scrim: color-mix(in oklch, var(--color-ink) 55%, transparent);
  --color-focus: var(--color-accent);
}
```

Check derived colors that carry text with `node scripts/tokens.mjs contrast`.

## Orris & Resin

Fragrance, skincare, tea, soft luxury. Light lavender-gray from orris root, resin-brown ink, labdanum accent. Avoid for technical products.

```json palette
{"name":"Orris & Resin","colors":{"ground":"#E8E3EA","surface":"#DCD4E0","ink":"#2A1C14","muted":"#5C4F57","accent":"#8F4F1A","on-accent":"#FFF6EC"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Graphite Atelier

Watches, jewelry, leather goods. Blue-graphite ground, warm paper ink, champagne accent from metal. Keep the accent for actions; gold everywhere becomes a cliché.

```json palette
{"name":"Graphite Atelier","colors":{"ground":"#11151B","surface":"#1A2029","ink":"#ECE7DD","muted":"#A7A196","accent":"#C8A46A","on-accent":"#16120B"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Midnight Chrome

Automotive, aviation, performance hardware. Cold near-black with a signal accent; dark text on the accent keeps contrast high.

```json palette
{"name":"Midnight Chrome","colors":{"ground":"#0B0E13","surface":"#151A22","ink":"#E9EDF2","muted":"#9BA5B3","accent":"#FF5A3C","on-accent":"#0B0E13"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Ink & Paper Mono

Studios, portfolios, architecture, editorial. Warm paper, true ink and one orange accent for actions and selection. The accent passes 3:1 on the ground, so it colors large type and fills only; links use ink with an underline.

```json palette
{"name":"Ink & Paper Mono","colors":{"ground":"#F3F2EE","surface":"#E7E5DF","ink":"#1B1A17","muted":"#5E5B55","accent":"#D93A0F","on-accent":"#FFFFFF"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",3]]}
```

## Pastel Lab

Playful beauty, wellness, consumer brands. Blush ground with an electric blue that keeps the pastel from turning sweet.

```json palette
{"name":"Pastel Lab","colors":{"ground":"#F7E9EC","surface":"#EFD8DE","ink":"#2B1A21","muted":"#6B5560","accent":"#3246E8","on-accent":"#FFFFFF"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Travertine

Architecture, interiors, real estate. Stone ground, near-black ink and a patina green accent; the photographs supply the rest of the color.

```json palette
{"name":"Travertine","colors":{"ground":"#E6E0D6","surface":"#D8CFC2","ink":"#1F1D1A","muted":"#5A544C","accent":"#3E5A49","on-accent":"#F2EFE8"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Forest Lodge

Mountain hotels, lodges, outdoor hospitality. Deep forest ground with an ember accent.

```json palette
{"name":"Forest Lodge","colors":{"ground":"#1C2620","surface":"#26332B","ink":"#EEE7D8","muted":"#B3AD9E","accent":"#D98B4A","on-accent":"#1C1510"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Sand Dune

Resorts, wellness retreats, coastal residences. Sand ground and a lagoon accent.

```json palette
{"name":"Sand Dune","colors":{"ground":"#E9DDC9","surface":"#DDCDB4","ink":"#2A231B","muted":"#5E5243","accent":"#2B6A6E","on-accent":"#F7F2EA"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Glacier

Premium technology, health technology, research. Cool pale ground and a deep teal accent instead of the default indigo.

```json palette
{"name":"Glacier","colors":{"ground":"#EEF3F6","surface":"#DEE7EE","ink":"#0E1A25","muted":"#4A5A68","accent":"#0B6E7A","on-accent":"#FFFFFF"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Oxblood & Bone

Wine, heritage houses, leather, law. Bone ground and oxblood ink and accent.

```json palette
{"name":"Oxblood & Bone","colors":{"ground":"#ECE4D8","surface":"#DFD4C4","ink":"#2A0F13","muted":"#634B4B","accent":"#7C1D2A","on-accent":"#F7EEE6"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Moss & Brass

Whisky, spirits, members' clubs. Deep moss ground with a brass accent.

```json palette
{"name":"Moss & Brass","colors":{"ground":"#1B2019","surface":"#262D23","ink":"#ECE6D3","muted":"#ADA891","accent":"#C9A45B","on-accent":"#1B1810"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Olive Grove

Olive oil, Mediterranean food, farms, natural products. Olive-tinted light ground and an olive accent.

```json palette
{"name":"Olive Grove","colors":{"ground":"#E6E7D5","surface":"#D8DAC3","ink":"#1E2215","muted":"#555C43","accent":"#5D6B1E","on-accent":"#F6F6EC"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Emerald Private Bank

Private banking, wealth, family offices. Deep emerald with pale brass; stable and quiet.

```json palette
{"name":"Emerald Private Bank","colors":{"ground":"#0F2621","surface":"#173530","ink":"#F1EDE2","muted":"#B7C2B8","accent":"#D9C08A","on-accent":"#13201B"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Ultramarine Gallery

Galleries, museums, publishers. Neutral white ground with an ultramarine accent that holds its own beside artworks.

```json palette
{"name":"Ultramarine Gallery","colors":{"ground":"#F4F4F1","surface":"#E7E7E3","ink":"#15151A","muted":"#55565E","accent":"#2231D6","on-accent":"#FFFFFF"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Cobalt & Porcelain

Ceramics, design objects, cultural institutions. Cool porcelain white and cobalt ink.

```json palette
{"name":"Cobalt & Porcelain","colors":{"ground":"#F5F6F8","surface":"#E6EAF0","ink":"#0E1A3A","muted":"#48546E","accent":"#2447C6","on-accent":"#FFFFFF"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Neon Night

Nightlife, music, festivals, gaming events only. A near-black with one acid accent is a known generated default for every other subject.

```json palette
{"name":"Neon Night","colors":{"ground":"#0B0A12","surface":"#171528","ink":"#F3F1FF","muted":"#A9A5C4","accent":"#C8FF3D","on-accent":"#0B0A12"},"pairs":[["ink","ground",7],["muted","ground",4.5],["ink","surface",7],["muted","surface",4.5],["on-accent","accent",4.5],["accent","ground",4.5]]}
```

## Turning a block into tokens

Save one block's JSON as `palette.json` and generate CSS; the command refuses to print tokens when a pair fails:

```text
node scripts/tokens.mjs css palette.json
```

Add `type`, `space` and `springs` keys to the same file to generate the full token set ([design tokens](../../design-tokens/SKILL.md)).
