# Worked example: Maison Veyr

An illustrative project that runs the [award craft](../SKILL.md) procedure end to end. The brand, copy and figures are invented to show the method; every value must be replaced by the real brief. The palette pairs below were checked with `node scripts/tokens.mjs check`.

## 1. Brief card

```text
Audience: fragrance collectors and gift buyers, 60 % on phones, arriving from Instagram and press
Job: understand what makes each scent distinct, choose one, buy a full size or a discovery set
Primary action: Add to bag (secondary: order the discovery set)
Subject: three new eaux de parfum distilled in Grasse; ingredient provenance is the proof
Content: product photography on grey seamless, ingredient macro shots, perfumer notes, prices
Assets: owned photography; no video; no 3D files
Identity: wordmark only; no palette or type established
Stack: Astro, Shopify Storefront API for cart
Devices: iPhone 13 class, mid-range Android, desktop 1440
```

## 2. World

A perfume unfolds in time: top notes in the first minutes, the heart over hours, the base for the rest of the day. The world is **maceration**: descending through layers.

- Layout: each fragrance page descends through three note layers instead of a feature grid.
- Transition: a slow liquid diffusion between layers and pages.
- Signature: scrolling moves the visitor down through a procedural field whose color follows the notes.

## 3. Directions

| Direction | Thesis | Type | Palette | Signature | Scores (fit / distinct / feasible) |
| --- | --- | --- | --- | --- | --- |
| A · Laboratory | Perfume as precise chemistry | Condensed grotesque, mono data | Cool white, cobalt | Molecular diagram assembling | 3 / 3 / 5 |
| B · Descent | Perfume as time, top to base | Soft optical-size serif with a warm grotesque | Orris grey, resin brown, labdanum amber | Scroll through a color field that follows the notes | 5 / 4 / 4 |
| C · Herbarium | Perfume as botany | Classic book serif | Paper, pressed-flower greens | Specimen sheets flipping | 4 / 2 / 5 |

Chosen **B**: it expresses the one thing this product has that others do not show (the evolution of a scent over time) and needs no 3D asset. Rejected A: accurate but cold for gift buyers. Rejected C: close to the herbarium look many botanical brands use.

Default test: a generic luxury perfume page would use a didone headline, cream background and gold accents. The plan replaces each: optical-size soft serif, orris-grey ground derived from the ingredient, amber from labdanum resin used only for actions.

## 4. Design plan

```text
DESIGN PLAN · Maison Veyr
Style: light orris ground, paper grain 3 %, no chrome, soft serif + warm grotesque, mask-rise entrances,
       heavy springs for type and objects, liquid transitions, silent - because the product is slow,
       tactile and sensory, and the photography is pale grey
World metaphor: maceration; appears in: note layers (layout), diffusion (transition), the descent (signature)
Thesis: three eaux de parfum as a descent through time, so buyers can feel how each scent changes before choosing
Signature: pinned descent on each fragrance page; 300 % viewport scroll; field color follows top → heart → base;
           fallback: three static layers with gradient posters
Palette: ground #E8E3EA · surface #DCD4E0 · ink #2A1C14 · ink-muted #5C4F57 · accent #8F4F1A · on-accent #FFF6EC
         night #16100D · night-ink #EFE6DC · night-muted #B5A89C · night-accent #D99A5B
         pairs: ink/ground 13.02 · muted/ground 6.12 · ink/surface 11.40 · muted/surface 5.36
                on-accent/accent 5.95 · accent/ground 5.03 · night-ink/night 15.27 · night-muted/night 8.11
                night-accent/night 7.83
Type: display Fraunces (opsz auto, wght 300, SOFT 100, WONK 0, tracking -0.03em)
      text Hanken Grotesk 400/500 · prices Hanken Grotesk tabular-nums
      scale 1.2 at 360 px → 1.333 at 1440 px, body 17 → 19 px, measure 62ch
      hero display clamp(3.5rem, 1.5417rem + 8.7037vw, 9.375rem)
Grid & space: 12 columns, margin clamp(1.25rem, 5vw, 5rem), gutter 1.5rem, section rhythm space-3xl/4xl,
              radius 2px on media only, no shadows; separation by tone
Motion: ease-out-expo for entrances, heavy spring [90, 19] for type and bottles, 160/240/480 ms UI durations,
        readable hero at 0.6 s, complete load at 1.3 s, reduced motion = static layers + 200 ms fades
Imagery: bottles on seamless grey, top light; ingredient macros graded to one warm temperature; AVIF
Components: header (hide on scroll down), menu dialog, fragrance index, note layer, size selector (radio group),
            add-to-bag with drawer, discovery set banner, newsletter, footer wordmark
Budgets: LCP ≤ 2.0 s on mid-range Android over 4G, CLS ≤ 0.05, INP ≤ 150 ms, initial JS ≤ 120 KB gzip
Risks: shader cost on mid-range phones → signature slice tested first at 390 px with DPR 1.5 cap
```

## 5. Layouts

Desktop fragrance page, first view:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ MAISON VEYR                                         Fragrances  Journal  Bag │
│                                                                            │
│  Orris                          ┌───────────────────────┐                  │
│  Nocturne                       │                       │   Eau de parfum  │
│                                 │        bottle         │   50 ml  100 ml  │
│  A powdery iris that            │     (cols 6–10)       │   €185           │
│  warms into resin.              │                       │   [ Add to bag ] │
│                                 └───────────────────────┘                  │
│  cols 1–5, display step-6                                   cols 11–12     │
│                        ↓ descend through the notes                         │
└────────────────────────────────────────────────────────────────────────────┘
```

Mobile, same view:

```text
┌──────────────────────┐
│ MAISON VEYR      Bag │
│ Orris                │
│ Nocturne             │
│ ┌──────────────────┐ │
│ │      bottle      │ │
│ └──────────────────┘ │
│ 50 ml · 100 ml  €185 │
│ [   Add to bag    ]  │  ← full-width, 52 px tall, thumb zone
└──────────────────────┘
```

The descent layer, desktop: the field fills the viewport; the note name sits large at columns 1–7, provenance caption at 9–12, the bottle fixed at columns 6–10 and dimmed to 35 % so type leads.

## 6. Signature storyboard

Progress `p` covers 300 % of the viewport height while the section is pinned. Scrub smoothing 0.6 s.

| p range | Beat | Field | Type | Object | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| 0–0.06 | Enter | Palette top: #F2EDD3 → #D9C46A, warp 0.12 | "Bergamot" rises, yPercent 12 → 0, alpha 0 → 1 | Bottle scale 1 → 0.92, alpha 1 → 0.35 | Static layer 1, gradient poster |
| 0.06–0.30 | Top note hold | Drift 0.035 UV/s | Caption "The first ten minutes" + provenance line | Held | Visible, no motion |
| 0.25–0.40 | Into the heart | Palette mixes to orris #E8E3EA → #9C8AA8, warp 0.12 → 0.16 | Bergamot fades up and out; "Orris" rises | Held | Next static layer |
| 0.40–0.63 | Heart hold | Pointer swirl radius 0.25, strength 0.06, damped 6 s⁻¹ | Caption "Hours two to six" | Held | Visible |
| 0.60–0.73 | Into the base | Palette mixes to labdanum #3A2417 → #D99A5B, page switches to night tokens | "Labdanum" rises | Bottle alpha 0.35 → 0.6 | Next static layer |
| 0.73–1 | Base hold and exit | Warp eases to 0.1 | Caption "Into the evening"; section CTA "Add to bag" | Bottle returns to scale 1 at 0.95–1 | Visible CTA |

Holds follow reading time: each caption is 12–16 words, about 5 s of reading, which is roughly 0.2 of progress at typical scroll speed; the storyboard gives 0.23–0.27.

## 7. Load choreography

| Time | Element | Motion |
| --- | --- | --- |
| 0 ms | Ground, header, fonts (preloaded) | No preloader |
| 80 ms | Display lines | Mask rise yPercent 105 → 0, 900 ms, `cubic-bezier(0.16, 1, 0.3, 1)`, 90 ms line stagger |
| 200 ms | Bottle image | `clip-path: inset(18% 12%)` → `inset(0)`, 1100 ms quart out; inner scale 1.12 → 1 |
| 700 ms | Price, sizes, action | Opacity 0 → 1, 300 ms |
| 1.3 s | Complete | Hero readable from 0.6 s |

## 8. Implementation excerpt

The descent timeline, with a reduced-motion branch and one owner for progress. `field` is a project-provided adapter exposing `setProgress(p)`; it is not a shipped shader module. Follow [procedural WebGL](../../procedural-webgl/SKILL.md) for medium selection and lifecycle. The adapter must independently stop time-driven work under reduced motion and when hidden. Static CSS must show all note layers in normal flow when `is-static` is present.

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initDescent(section, field) {
  const mm = gsap.matchMedia();
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
    if (context.conditions.reduce) {
      section.classList.add('is-static');
      field.setProgress(0.5);
      return () => section.classList.remove('is-static');
    }
    const notes = gsap.utils.toArray('.note', section);
    const span = 1 / notes.length;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: section, start: 'top top', end: '+=300%', pin: true, scrub: 0.6, invalidateOnRefresh: true },
      onUpdate: () => field.setProgress(tl.progress()),
    });
    notes.forEach((note, i) => {
      tl.fromTo(note, { autoAlpha: 0, yPercent: 12 }, { autoAlpha: 1, yPercent: 0, duration: 0.1, ease: 'power2.out' }, i * span + 0.02);
      if (i < notes.length - 1) tl.to(note, { autoAlpha: 0, yPercent: -8, duration: 0.08, ease: 'power2.in' }, (i + 1) * span - 0.08);
    });
    tl.set({}, {}, 1);
  });
  return () => mm.revert();
}
```

`DECISIONS.md` after the first review:

```markdown
- Names: "Orris Nocturne", "Bergamot Vesper", "Labdanum Heure" (approved)
- Prices from Shopify only; never hard-coded
- Accent #8F4F1A used for actions and links only, never for decoration
- Descent length 300 % viewport; do not shorten below 240 % (captions need their holds)
```

## 9. Verification record (format example)

The values below show the format of a record; they are not measurements.

| # | Result | Evidence |
| --- | --- | --- |
| D1 action | PASS | 390x844-view.png: "Add to bag" in thumb zone; 1440x900-view.png: right rail |
| D2 legibility | FAIL | 390x844-scroll-04.png: provenance caption over the brightest part of the base palette |
| D5 motion | PASS | scroll strip: continuous field, no dropped frames noted; wheel p95 17 ms (headless indicator) |
| D7 reduced motion | PASS | 390x844-reduced-view.png and reduced-scroll-mid.png: static layers, no idle motion |
| D9 generic | PASS | contact sheet: no card grid, no gradient washes, type and palette derived from ingredients |

| Criterion | Score | Evidence / why |
| --- | --- | --- |
| Design | 8 | contact sheet: shared rails and type roles across index, product and journal |
| Usability | 6 | capped by D2 |
| Creativity | 8 | scroll-02…05: the descent reads as one gesture tied to the product |
| Content | 7 | journal excerpt lacks a source for the harvest date in FACTS.md |
| Development | 8 | report.json: CLS 0.01, LCP 1.7 s, zero console errors |

Worst three and fixes: (1) caption scrim at 55 % night on the base layer, contrast rechecked at 7.8:1; (2) harvest date sourced to the perfumer's note, added to `FACTS.md`; (3) size radio labels raised to 15 px with 44 px targets. Round 2 re-captured every viewport before scoring again.
