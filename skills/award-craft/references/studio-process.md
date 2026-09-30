# Studio process

The phases of [award craft](../SKILL.md) in working detail. Use only phases needed by the brief. Keep decisions in context or an existing project record; separate files, metaphors and numeric scoring are optional. A small repair preserves the system and goes directly to implementation and affected-state verification.

## 1. Brief card

Read everything supplied (repository, copy, brand files, screenshots, URLs, PDFs) before asking anything. Then fill the card. Ask once, in one message, only for what blocks a consequential decision; state defaults for the rest.

| Field | Question | Default when unknown |
| --- | --- | --- |
| Audience | Who arrives, from where, on which device? | Mobile-first visitor from social or search |
| Job | What must they understand or decide? | Understand the offer in 5 s, find proof, act |
| Primary action | One verb: book, buy, enquire, subscribe, apply, download | Enquire |
| Subject | The product, place, person or collection the page is about | Infer from supplied material; clarify if missing and consequential |
| Content inventory | Copy, images, video, data, press, legal | Write real draft copy; mark it for review |
| Assets and rights | Owned, licensed, needs sourcing | Procedural visuals plus licensed stock |
| Identity | Logo, colors, type, tone to keep | Derive from the subject |
| Stack | Existing framework, hosting, CMS | Astro or Vite static build |
| Devices and budgets | Browsers, slowest device, languages | Last two majors of each engine; mid-range Android |

Artifact: the brief card, eight to twelve lines.

## 2. Find the world

A metaphor can connect structure, transitions and imagery on a narrative site. It is one possible organizing device; a strong comparison, photographic point of view or useful information hierarchy can do the same work without metaphor. Body copy stays plain.

Collect a few specific materials, gestures or relationships from the actual subject. Try the most promising idea on a first view, ordinary section and primary action. Keep it when it guides useful visible decisions; drop a metaphor that distorts facts, navigation or feasibility. Test the static composition before adding motion.

| Subject | World | Layout device | Transition | Signature interaction |
| --- | --- | --- | --- | --- |
| Perfume house | Maceration: top, heart, base notes | Vertical descent through three note layers | Liquid diffusion wipe | Scroll through a procedural field whose hue follows the notes |
| Independent watchmaker | The movement | Concentric index, radial captions | Stepped rotation with a tick | Escapement assembling as the user scrolls |
| Architecture studio | The section drawing | Pages cut like building sections, hairline construction lines | Section-cut clip that reveals the photograph | Line drawing traces, then the photo fills the drawing |
| Coffee roaster | The roast curve | A timeline that doubles as navigation | Color-temperature shift per origin | Drag along the curve to taste profiles |
| Fashion atelier | Pattern paper | Pattern pieces overlaid on the grid | Pinned fabric swatch | Cursor-driven cloth distortion over the lookbook |
| Private bank | The ledger | Ruled rails, tabular numerals, marginalia | A quiet vault-iris reveal | Time-horizon slider with clearly labelled example math |
| Boutique hotel | The corridor of doors | Rooms as doors along a horizontal passage | Door-open reveal | Day-to-night light controlled by scroll |
| Wine estate | Soil strata | Stratified sections, sediment rules | Settling layers | Descend through strata to each vintage |
| Electric car | The wind tunnel | Streamlines as dividers | Streamline wipe | Airflow field reacting to the pointer |

Artifact: `World: <metaphor>; layout: …; transition: …; signature: …`.

## 3. Divergent directions when identity is open

Compare concepts with materially different structure, type, imagery or interaction logic, using the same real content. Two or three concise candidates often expose the trade-off; a fixed count is not a requirement. Existing identity or a narrow repair may remove the need for exploration.

```text
DIRECTION A · <name>
Thesis: …
Structure: … (ASCII sketch of the first view)
Type: … Palette: … Imagery: …
Signature: … Motion character: …
Risk: …
```

Score each direction 1–5 on product fit, distinctiveness, feasibility with the real assets, accessibility risk (inverted), performance cost (inverted) and build time (inverted). Choose the highest product fit among feasible options and write one sentence on the trade-off. Then run the **default test**: challenge choices made without reference to the content. Preserve useful conventions and supplied identity.

Artifact: the chosen direction with its reason and rejected alternatives in one line each.

## 4. Copy, content and facts

Write real copy before layout; words decide measure, hierarchy and pacing.

- Headlines communicate the subject at the intended scale; test actual phrase breaks rather than enforcing a word count. Supporting lines say what something is or does.
- A call to action names its outcome: "Book a fitting", not "Submit". The same verb survives the flow: the "Reserve" button produces a "Reserved" confirmation.
- Errors state what happened and how to fix it; empty states invite the next action.
- Sentence case. No filler or hype: avoid "elevate", "unlock", "seamless", "revolutionize", "next-level", "cutting-edge", "game-changer", "welcome to", "discover the power of", "crafted for those who".
- Let readers control time. Reading estimates can inform a storyboard, but scroll distance cannot guarantee seconds of dwell. Keep captions revisitable and avoid auto-advancing essential copy.
- Localization: design for the longest language (plan for +30 % length), keep text out of images, test line breaks per language.

Keep a source record, optionally `FACTS.md`, in the target project: every figure and claim that appears, with its source (file and line, page or URL), its rounding rule and its single display string. Put baselines and periods next to multiples ("vs. 2024 average"). Pair a big number with an honest companion metric on the same scale. Label invented illustrative data on screen as an example.

Artifact: draft copy per section and `FACTS.md`.

## 5. Assets and rights

Priority: the client's own material, then commissioned work, then licensed stock, then procedural or typographic visuals. Weak photography hurts more than no photography; a procedural field or a typographic composition is often the better signature.

| Need | Sources to check (verify the license at time of use) |
| --- | --- |
| Photography | Unsplash, Pexels (their own licenses) |
| Video and music | Mixkit, Pexels video |
| HDRIs, textures, models | Poly Haven (CC0), ambientCG (CC0) |
| 3D-style icons | 3dicons (CC0) |
| Brand logos | svgl, Simple Icons (trademark rules still apply) |
| Fonts | Google Fonts, Fontshare and foundries; check the actual font license and redistribution terms |

Before using any image: view a contact sheet, reject stock clichés, check for private information (house numbers, faces without consent, readable screens), set a focal point and crop per breakpoint, and grade the set to one color temperature. Deliver AVIF or WebP with intrinsic dimensions, and a poster frame for every video.

## 6. Build order

| Step | Share of effort | Done when |
| --- | --- | --- |
| Tokens, fonts, base CSS, grid | 10 % | Contrast passes, scale renders, no layout shift |
| Signature slice | 25–30 % | Smooth and legible at 390 px and 1440 px on real content |
| Page skeleton with real content | 20 % | Squint test shows the intended hierarchy with motion off |
| Components and states | 20 % | Every state reachable and styled |
| Motion pass | 10 % | Load choreography, scroll beats, micro-interactions, reduced motion |
| Critique and polish rounds | 15–20 % | Delivery rule met |

Compose statically first: the page must pass the squint test with every animation disabled. The signature slice is the exception and is built early because it carries the most risk.

## 7. Fast critique tests

| Test | How | Fails when |
| --- | --- | --- |
| Squint | Blur the screenshot or view at 25 % | The intended first, second and third reads are not obvious |
| Swap | Replace the brand name | The page could belong to a competitor |
| Five seconds | Show the first view briefly | A viewer cannot say what it is and what to do |
| Thumb | Phone portrait, one hand | Primary action outside easy reach or smaller than 44 px |
| Keyboard | Tab through the page | Focus invisible, trapped or out of order |
| Reduced motion | Emulate the preference | Content hidden, motion continues, or pins trap scroll |
| Slow network | Throttle to slow 4G | Blank first view, endless loader, shifting layout |
| 200 % text | Browser text zoom | Clipping, overlap or lost actions |
| Remove one accessory | Delete the weakest effect | Only keep it if its absence hurts |

## 8. Full-treatment mode

For flagship launches, or when asked for maximum effort:

1. Record the few rules that materially define this project's identity and motion; avoid a quota of rules.
2. Explore competing concepts within the available time, then choose a coherent direction. Combine elements only when their structural logic works together.
3. Review through relevant specialist perspectives: typography, imagery, interaction, accessibility, performance and facts. Use independent reviewers when available and authorized, or identify self-review honestly.
4. Compare a revision with its predecessor under matched conditions. Repeat when findings justify it; stop optional exploration at the agreed budget. Repair known task blockers before claiming completion.

## 9. Handoff

Deliver the requested artifact, reusable tokens and project records when relevant, run instructions, and a verification record: what was captured and under which conditions, measured numbers, the final defect table and scores, and every unverified item.
