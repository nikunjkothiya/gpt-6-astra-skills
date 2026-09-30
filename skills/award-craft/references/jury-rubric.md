# Jury rubric

Use this to judge a rendered site before anyone else sees it. Passing automated checks means nothing is broken; it does not mean the site is good. Judge from evidence: screenshots, scroll strips, recordings, measurements and your own look at them.

## Internal studio review

Review Design, Usability, Creativity, Content and Development independently. These dimensions help find weaknesses; they cannot certify a ranking or predict a jury. Award criteria can change: consult the organizer's current [evaluation system](https://www.awwwards.com/about-evaluation/) for an actual submission.

A distinctive site offers a coherent idea and a complete useful experience. In a task-focused application, clarity and comparison may carry the creative value. Do not require decorative interaction, a first-view purchase button or a new identity for every project.

## What a juror sees in the first minute

1. The loading experience: length, honesty of progress, and whether it repeats on every visit.
2. The first view: the subject, the type, and one clear action.
3. The pointer: hover responses, cursor treatment, magnetic or tactile details.
4. The first scroll: control, smoothness, and whether the page responds to their input or ignores it.
5. The first transition between pages or states.
6. Type rendering at real size, and the first long paragraph.
7. The phone version, usually on a real device.
8. A deep page, the menu, the footer and the 404.

## Criteria sub-checks

| Criterion | Earns 8+ when |
| --- | --- |
| Design | A clear hierarchy in every view; a type system with deliberate roles; palette with intent; consistent spacing rhythm; art-directed imagery; finished micro-details; the system holds on inner pages |
| Usability | Navigation is obvious; the primary action is reachable in the first view; loading is fast and truthful; responsive layouts are composed, not squeezed; keyboard, focus, contrast and reduced motion work; feedback for every action |
| Creativity | An original useful relationship tied to the subject, visible in composition, imagery, type, explanation or interaction; it survives ordinary states |
| Content | Real copy and imagery authored with the design; claims sourced; no filler, placeholder or stock clichés |
| Development | Semantic markup and metadata; smooth motion without layout thrash; performance budgets met; responsive and accessible; no console errors |

## Step 1: the defect table

Review relevant rows before scoring. Use PASS, FAIL, UNOBSERVED or NOT APPLICABLE with conditions and evidence. Missing evidence is UNOBSERVED; irrelevant features are NOT APPLICABLE with a reason. A confirmed FAIL caps its listed criteria at 6. Neither missing evidence nor an average can establish readiness.

| # | Defect | Evidence to open | FAIL caps |
| --- | --- | --- | --- |
| D1 | Required primary task unclear or inaccessible in its intended journey | journey inspection | Usability |
| D2 | Text unreadable: body contrast below 4.5:1, large text below 3:1, illegible type at delivery size, or text over busy media | view and scroll screenshots, token check | Design, Usability |
| D3 | Horizontal overflow, clipped or overlapping content at any tested width | all viewports, report overflow | Design |
| D4 | Visible layout shift or font-swap jump; CLS above 0.1 | report, first-view strip | Usability, Development |
| D5 | Observed janky motion: stutter, lost continuity or delayed input; property choice alone is not proof | actual playback, frame intervals, recording | Creativity, Development |
| D6 | Scroll hijack: input ignored, keyboard or anchors broken, back button trapped | manual pass, keyboard pass | Usability |
| D7 | Reduced motion ignored: motion continues, content stays hidden, or pins trap scroll | reduced-motion screenshots, report | Usability, Development |
| D8 | Focus invisible, keyboard trap, or focus order that does not follow the layout | focus screenshots, report | Usability |
| D9 | Unexamined defaults weaken the intended identity or task; use the [anti-generic list](../../visual-direction/references/anti-generic-patterns.md) in context | view screenshots, contact sheet | Design, Creativity |
| D10 | Fabricated or placeholder content: lorem ipsum, invented logos, testimonials, metrics or awards | screenshots, `FACTS.md` | Content |
| D11 | Intro or preloader longer than 2.5 s without real progress, or replayed on every visit | first-view strip, repeat visit | Usability |
| D12 | Unstyled states: broken images, default empty or error states, default 404 | state screenshots | Design |
| D13 | Console errors, failed requests or broken fonts | report | Development |
| D14 | The system drifts between pages: type, spacing or color inconsistencies | contact sheet across pages | Design |
| D15 | Hover-only information with no touch or focus equivalent | phone screenshots, focus pass | Usability |

## Step 2: scores

If scoring helps the requested critique, score observed criteria 1–10 using these internal anchors. Scores are subjective judgments that require observations, not merely confident explanations.

| Score | Meaning |
| --- | --- |
| 9–10 | Distinctive and coherent across tested states, with no observed material defect |
| 8 | Professional and ship-ready; minor notes only |
| 7 | Good but generic in places, or one noticeable weakness |
| 6 | Capped by a FAIL, or several visible weaknesses |
| ≤ 5 | Broken or confusing for a first-time visitor |

Two rules bind every score:

- **Caps.** A criterion capped by a FAIL scores 6 at most, however strong the rest looks.
- **Evidence for every score.** Name the inspected artifact, condition and observation. Leave unobserved criteria unscored; do not assign an invented 7.

Report criteria separately by default. If the user requests a weighted summary, declare its weights, exclude unobserved dimensions and report missing coverage. A score cannot override a blocked task.

Then list the **three worst problems**, worst first, each with its location and a measurable fix. Every FAIL row comes before anything else.

## The loop

1. Capture evidence and run the audit.
2. The reviewer records findings and optional scores. When independent review is available and authorized, supply the rubric, actual brief and evidence without the builder's scores. Otherwise mark self-review.
3. Keep findings and rechecks in existing task context or an optional review log.
4. Fix the FAIL rows and the worst three, rebuild, capture again.

Deliver when material in-scope findings are resolved and observations support acceptance. Repeat review for a remaining finding or a change affecting previous evidence. Timebox optional polish and report unresolved defects and observations. A score change requires new evidence; repeating self-scoring is not improvement.

## Review log format

```markdown
## Round 2
Reviewer: self or independent (record actual method)

| # | Result | Evidence |
| --- | --- | --- |
| D1 action | PASS | 390x844-view.png and 1440x900-view.png: "Book a fitting" visible above the fold |
| D2 legibility | FAIL | 390x844-scroll-03.png: caption over the bright frame of the hero video |
| D5 motion | PASS | recorded playback inspected with reverse input; screenshot strip is supplementary |

| Criterion | Score | Evidence / why |
| --- | --- | --- |
| Design | 8 | contact sheet: consistent rails and type roles on all four pages; no D3/D9/D12/D14 |
| Usability | 6 | capped by D2 |
| Creativity | 8 | 1440x900-scroll-02…05: note descent reads as one continuous gesture |
| Content | unscored | UNOBSERVED: press quote sources have not been supplied |
| Development | 8 | report.json: CLS 0.02, LCP 1.9 s, no console errors |

Worst three:
1. 390x844 scroll 3: caption over bright video → add a scrim band 0.55 opacity behind captions, recheck contrast
2. Product page: size selector labels 13 px on phone → 15 px, 44 px targets
3. Footer: newsletter error state unstyled → error text and field state from tokens

Fixed: 1, 2, 3. Recaptured.
```

## Self-check questions

- Design: If every animation stopped, would the static pages still look designed?
- Usability: Can a first-time visitor on a phone find the primary action in five seconds?
- Creativity: What single sentence will a juror use to describe this site to a colleague?
- Content: Which line of copy could appear on a competitor's site unchanged? Rewrite it.
- Development: What happens on a slow phone, with reduced motion, with JavaScript failing?
