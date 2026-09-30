# Heroes and sections

The first view earns the scroll; the sections earn the action. Choose each pattern from the content it has to carry, and vary structure by content role so the page reads as authored rather than assembled.

## Hero patterns

Every hero shows the subject, says what it is, and offers one action within the first view on phone and desktop. Load choreography values come from [easing and timing](../../motion-engineering/references/easing-and-timing.md).

| Pattern | Choose when | Anatomy | Load motion | Phone | Pitfalls |
| --- | --- | --- | --- | --- | --- |
| Type-led | The name or idea is the strongest asset; imagery is weak or secondary | Display line at hero scale, short lede, one action, generous margin | Line mask rise, 900 ms, 90 ms stagger; lede and action fade at 600 ms | Display clamps down but stays dominant; action full width | Tiny lede under a huge title; lines that break badly in the real font |
| Full-bleed media | Photography or film is exceptional | Media fills the view, title and action on a calm region, scrim only where needed | Media clip-open with inner scale 1.12 → 1; title rises after 200 ms | Art-directed crop, not a scaled desktop frame | Text over busy frames; autoplay video without poster or pause |
| Split 5/7 | Product plus story, equal importance | Title and action in 5 columns, media in 7, caption hanging on the media rail | Title first, media clip reveal 150 ms later | Media first or title first by importance, never side by side | Dead space when copy is short |
| Object theatre | One object is the product: a bottle, a watch, a chair | The object centered and large, specifications and actions orbiting at the edges | Object settles with a heavy spring; captions fade in by distance from it | Object stays large; captions move below | Object too small; captions competing with it |
| Procedural field | No strong imagery; a concept or material can be expressed as a field | Shader or SVG field behind DOM type ([procedural WebGL](../../procedural-webgl/SKILL.md)) | Field fades up from the ground color over 800 ms while type rises | Lower resolution, capped DPR, static poster under reduced motion | Decoration unrelated to the subject; text contrast over the brightest frame |
| Kinetic type | Culture, events, brands with a strong voice | Type that changes axis, width or arrangement as the one moving element | Axis change or letter sequence once, then holds | Fewer words, same idea | Unreadable motion; animation that never settles |
| Index | Studios and portfolios: the work list is the product | Name and role, then a list of projects with year and discipline, previews on hover and focus | List rows rise with a short stagger; previews follow the pointer | Previews become inline thumbnails | Hover-only previews; lists without dates or disciplines |
| Collage | Fashion, culture, archives with many strong images | Images scattered on a hidden grid, a title crossing them | Images arrive in depth order, title last | Two or three images, not the whole collage | Randomness without an underlying grid |

### Type-led hero

```html
<section class="hero hero-type">
  <h1 class="hero-title reveal" aria-label="Orris Nocturne">
    <span class="line" aria-hidden="true" style="--i: 0"><span>Orris</span></span>
    <span class="line" aria-hidden="true" style="--i: 1"><span>Nocturne</span></span>
  </h1>
  <p class="hero-lede">A powdery iris that warms into resin, distilled in Grasse.</p>
  <a class="button" href="#notes">Explore the notes</a>
  <div data-header-sentinel aria-hidden="true"></div>
</section>
```

```css
.hero-type {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-content: end;
  gap: var(--space-l) var(--gutter);
  min-block-size: 100svh;
  padding: calc(var(--header-h) + var(--space-2xl)) var(--margin) var(--space-2xl);
}

.hero-title {
  grid-column: 1 / -1;
  font-size: clamp(3.5rem, 1.5417rem + 8.7037vw, 9.375rem);
  line-height: 0.92;
  letter-spacing: -0.035em;
}

.hero-lede { grid-column: 1 / 6; font-size: var(--step-1); max-inline-size: 32ch; }
.hero-type .button { grid-column: 1 / 4; justify-self: start; }

@media (max-width: 48rem) {
  .hero-lede, .hero-type .button { grid-column: 1 / -1; }
  .hero-type .button { justify-self: stretch; }
}
```

The line reveal CSS is in [fluid and kinetic type](../../typography-system/references/fluid-and-kinetic-type.md).

## Sections

| Section | Purpose | Structure | Motion | Pitfalls |
| --- | --- | --- | --- | --- |
| Manifesto | State the idea in one paragraph | Large type (step 4–5), measure about 22–28 characters per line at display size | Words fill on scroll, or one line reveal | More than about 60 words; generic claims |
| Feature story | Explain one capability or craft detail | Image and text with a caption rail; alternate structures, not just sides | Clip reveal on the image, text rises once | Identical zig-zag rhythm down the page |
| Specification sheet | Let experts compare facts | Definition list on hairline rules, tabular numerals, units | None, or rows appear together | Tiny gray text; specs as images |
| Process | Show real steps in order | Ordered list or pinned steps with an image per step | Pinned steps or sticky media swap | Numbering things that are not a sequence |
| Proof and press | Support a claim with a sourced voice | Pull quote with name, publication and date; real logos only | Quote rises once | Invented testimonials, logo walls of unknown brands |
| Figures | Make a number concrete | Number with unit, baseline and source line; companion metric at the same scale | Count up once, only for sourced numbers | Unsourced or rounded-up claims |
| Gallery | Show range or atmosphere | Mosaic or rail with consistent grading | Staggered clip reveals by row | Mixed crops and color temperatures |
| FAQ | Remove last doubts before action | `<details>` list with specific questions | Height transition where supported | Questions nobody asks; answers hidden in images |
| Closing action | Ask once more, clearly | One sentence, one primary action, one secondary | Line reveal | A second hero with new promises |
| Contact and location | Make the visit easy | Address, hours in `<time>`, map link, phone, email | None | Map embeds that block scroll on phones |
| Journal index | Invite reading | Date, category and title per entry; one featured story | Rows rise once | Cards without dates; clickbait titles |
| Team | Put faces to the craft | Consistent portrait crops and light; name, role, one line | None or quiet crossfade | Stock portraits; mixed backgrounds |

### Specification sheet

```html
<dl class="spec">
  <div><dt>Concentration</dt><dd>Eau de parfum, 18 %</dd></div>
  <div><dt>Top</dt><dd>Calabrian bergamot</dd></div>
  <div><dt>Heart</dt><dd>Orris butter, Tuscany</dd></div>
  <div><dt>Base</dt><dd>Labdanum, Andalusia</dd></div>
  <div><dt>Sizes</dt><dd>50 ml and 100 ml</dd></div>
</dl>
```

```css
.spec { display: grid; margin: 0; border-block-start: 1px solid var(--color-line); }
.spec > div { display: grid; grid-template-columns: minmax(8rem, 1fr) 2fr; gap: var(--gutter); padding-block: var(--space-s); border-block-end: 1px solid var(--color-line); }
.spec dt { color: var(--color-muted); }
.spec dd { margin: 0; font-variant-numeric: tabular-nums; }
```

### FAQ with a height transition

```css
.faq details { border-block-end: 1px solid var(--color-line); }

.faq summary {
  display: flex;
  justify-content: space-between;
  gap: var(--space-m);
  padding-block: var(--space-m);
  font-size: var(--step-1);
  list-style: none;
  cursor: pointer;
}

.faq summary::-webkit-details-marker { display: none; }
.faq summary::after { content: "+" / ""; transition: rotate var(--dur-base) var(--ease-out-expo); }
.faq details[open] summary::after { rotate: 45deg; }

@supports (interpolate-size: allow-keywords) {
  .faq { interpolate-size: allow-keywords; }
  .faq details::details-content {
    block-size: 0;
    overflow: clip;
    transition: block-size var(--dur-slow) var(--ease-out-expo), content-visibility var(--dur-slow) allow-discrete;
  }
  .faq details[open]::details-content { block-size: auto; }
}
```

Browsers without `interpolate-size` open instantly, which is fine. Use `name="faq"` on the `<details>` elements to make them an exclusive accordion.

## Section rhythm across the page

- Alternate density: a dense section is followed by a quiet one.
- Change structure when the content role changes; repeat structure when content is truly parallel.
- Keep one shared rail visible through the page (a caption column, a left margin line, a consistent title position).
- Theme changes (a dark chapter) mark a change of subject, not decoration ([scroll patterns](../../motion-engineering/references/scroll-patterns.md)).
- End every page with a clear next step; the footer is not the call to action.
