# Anti-generic patterns

Generated interfaces cluster around a small set of defaults. Viewers and jurors recognise them within a second, and the page stops feeling made for its subject. Every pattern below is legitimate for some brief; the failure is reaching for it when nothing in the subject asked for it. Where the brief pins down a look, follow the brief exactly.

Run this review on the design plan before building, and again on the contact sheet before delivery.

## Layout

| Pattern | Why it reads as generated | Instead | Legitimate when |
| --- | --- | --- | --- |
| Centered hero: small pill badge, headline, subline, two buttons, product screenshot in a glowing frame | The universal SaaS opener | Open on the most characteristic thing in the subject's world: an object, an image, a live demo, a sentence set as the composition | A developer tool whose screenshot is the product |
| Big number, small label, gradient accent as the hero | The default "impressive stat" treatment | A sourced number set in context, with its baseline, inside the story where it matters | The number is the news |
| Three or six identical feature cards with icons | Content chopped to fit a kit | Structure from the content: a sequence, a comparison, a single demonstrated feature, an annotated object | A true set of parallel, equal items |
| The SaaS card kit: one radius on everything, the same soft gray shadow, gradient washes | No hierarchy of surfaces | Radius and elevation as a policy with roles; separate by tone, rules or space | A dense product dashboard with a defined system |
| Bento grid for unrelated content | A container fashion, not an information structure | Group by relationship; vary scale by importance | Genuinely heterogeneous items that benefit from side-by-side scanning |
| Alternating image/text zig-zag with identical rhythm | Monotony disguised as variety | Vary structure by content role: a full-bleed image, a caption rail, a quiet comparison | A short, truly repeating catalog |
| Broadsheet default: hairlines, zero radius, dense newspaper columns | An "editorial" costume | Editorial structure only where there is editorial content | Magazines, journals, newsrooms |
| Logo wall, testimonial carousel, stats row | Placeholder trust | Real, sourced proof placed next to the claim it supports | Real clients and quotes with permission |

## Typography

| Pattern | Why | Instead | Legitimate when |
| --- | --- | --- | --- |
| Inter, Roboto or system UI everywhere | The zero-decision default | Choose a face for the subject's voice ([typography system](../../typography-system/SKILL.md)) | An existing product system uses it |
| Space Grotesk, Clash Display or Satoshi as the "creative" default; Playfair or Cormorant as the "luxury" default | Category defaults that many generated pages share | Pick from the subject's world; consider optical sizes, widths and less common families | The brand already owns the face |
| A tracked all-caps eyebrow above every heading | Template chrome | Use labels only when they carry information | A true taxonomy or index |
| Monospace small labels everywhere | "Technical" costume | Mono only for code, data and measured values | Developer or data products |
| 01 / 02 / 03 markers on content that is not a sequence | Decoration pretending to be structure | Number only real steps, chapters or timelines | A process, a timeline, a ranked list |
| Meta strings joined with middle dots; "WORD — fragment" labels; an arrow appended to every link | Generated microcopy rhythm | Plain labels; arrows only where direction or navigation matters | A deliberate typographic system that uses them consistently |
| One word of the headline accented in italic, color or gradient | The commonest generated headline tell | Let the whole line carry the voice, or restructure the sentence | A brand word that the identity always sets that way |
| Gradient text on headings | Borrowed shine | Solid ink; color only with meaning | A brand whose mark is a gradient |

## Color

| Pattern | Why | Instead | Legitimate when |
| --- | --- | --- | --- |
| Purple or indigo to blue gradients on white; neon purple dark mode | The signature of generated SaaS pages | Derive color from the subject's materials and imagery ([color system](../../color-system/SKILL.md)) | The brand color really is violet |
| Warm cream (near #F4F1EA) with a high-contrast serif and a terracotta accent (near #D97757) | A frequent generated "tasteful" default; the accent is also a well-known AI product color | A ground and accent sampled from the subject | The subject is literally clay, paper or terracotta |
| Near-black with one acid-green or vermilion accent | The generated "bold" default | A dark palette with its own temperature, and accents with roles | Nightlife, music, sport, festival brands |
| #0B0B0B or #111 standing in for black | Unexamined ink | Tint dark tones from the palette's hue, or use true black deliberately | A system that defines it |
| Glow blobs and aurora gradients unrelated to the subject | Atmosphere without meaning | Light or fields that reveal the subject; flat grounds are allowed | The glow is a light source in the story |

## Surfaces and effects

| Pattern | Why | Instead | Legitimate when |
| --- | --- | --- | --- |
| Glassmorphism on every card | A trend applied as a finish | Transparency only where layers overlap for a reason, with a readable backing | Overlays on live media or maps |
| Glow on buttons, cards and borders | Chrome competing with content | Flat fills, tone steps, solid underlines | A lit object, a beam, a light source |
| Border beams, shimmer text, spotlight cards, animated beams, orbiting icons, sparkles | The component-library effect kit of recent years | One tactile detail that belongs to the world | A deliberate, restrained use tied to the concept |
| Particle bursts, confetti, generic starfields | Energy without a subject | One object from the story that reacts | A celebration moment in a product flow |
| Corner brackets, coordinates, timecodes, fake system labels on a non-technical subject | "Instrument screen" costume | A masthead, a page counter, or nothing | Space, aviation, scientific, security subjects |
| Grain above 6 % opacity everywhere | Hiding weak imagery | Real texture from the subject, or clean surfaces | Print-inspired identities, used with restraint |
| Emoji or generic icons in circles as feature icons | Placeholder iconography | Custom marks, real product details, or no icons | Casual consumer products with an emoji voice |

## Motion

| Pattern | Why | Instead | Legitimate when |
| --- | --- | --- | --- |
| Fade-and-slide-up on every section; everything fading in | The generated default for "animated" | One orchestrated entrance; vary grammar by element type: masks for type, clips for images, springs for objects | Never as a blanket rule |
| Hover lift and shadow on every card | Motion without information | Hover responses that reveal something: a second image, a price, a direction | Cards that are genuinely actionable units |
| Long staggered cascades | Waiting for decoration | Stagger only to express order; cap the cascade | A list whose order is the message |
| Parallax on everything; slowed or hijacked scroll | Motion sickness and lost control | Parallax on one or two depth layers; native-feeling scroll | A pinned story section with clear exits |
| A preloader counting to 100 without real progress | Fake loading | An instant first view; progressive enhancement for heavy assets | Real, measured WebGL asset loading on repeat-less visits |
| A blob cursor with difference blending on every site | A portfolio cliché | Native cursor, or a cursor that carries information (view, drag, play) | Creative portfolios with a reason |
| Word or logo marquees by default | Filler motion | Static proof, or a marquee that responds to scroll with purpose | Real press or partner lists |

## Copy

Replace hype and filler with specific statements: "elevate", "unlock", "seamless", "revolutionize", "empower", "next-level", "cutting-edge", "game-changer", "welcome to", "discover the power of". Never ship lorem ipsum, invented metrics, invented logos or invented testimonials.

## Review procedure

1. **Swap test.** Replace the brand name with a competitor's. If the page still fits, strengthen the subject-specific structure.
2. **Default test.** Identify decisions made without reference to the content. Revise those that weaken identity or the task; retain established brand choices and useful conventions such as recognizable navigation, readable system fonts or aligned comparison tables. Novelty alone is not a reason to change them.
3. **Device test.** For each prominent device, name its job: hierarchy, identity, comprehension, feedback, story, focus or atmosphere. Remove it and look again; keep it only if its absence hurts ([visual direction](../SKILL.md)).
4. **Hierarchy test.** Identify what leads and what supports it in the first view. Reduce competing emphasis when it obscures that hierarchy; the number of expressive choices alone does not decide quality.

This calibration list builds on observations in Anthropic's public frontend-design skill and the banned-defaults list of the MIT-licensed motion-graphic-skill, adapted to websites.
