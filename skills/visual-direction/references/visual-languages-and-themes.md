# Visual languages, color variations and typography

Use when the identity is open, a design feels generic, or one product needs coherent theme variations. Preserve supplied brand rules first. The families below are candidate relationships, not templates or requirements for particular industries. Choose from the user's content, action and desired perception.

## Give the direction enough range

| Candidate language | Organizing relationship | Type and color behavior | Motion opportunity and limit |
| --- | --- | --- | --- |
| Editorial | Reading sequence, image scale and asymmetric columns | Distinct display/text roles; page, ink and image-derived accent | Page/image reveals with reading holds; avoid delaying long text |
| Sculptural precision | One object's silhouette, joints and material evidence | Controlled labels, aligned measurements, restrained surface/accent hierarchy | Camera inspection or assembly; keep comparison controls stable |
| Architectural | Measured planes, spatial intervals, perspective and light | Strong grid, deliberate empty space, materials informing neutrals | Plan-to-space or depth travel; avoid losing orientation |
| Expressive graphic | Bold type, shape rhythm and intentional color contrast | Confident scale, limited competing accents, expressive but readable headings | Kinetic graphic or typography; reserve quiet task regions |
| Quiet service | Clear tasks, reassurance and predictable status | Readable text, familiar affordances, calm separation and useful density | Immediate feedback, short supporting transitions; atmosphere is optional |
| Technical information | Comparison, alignment, units and data structure | Tabular values, semantic status colors, compact but legible hierarchy | Explain causality or changes; preserve truthful final data |
| Immersive cinematic | Sequence, subject framing, light and timed disclosure | Stable readable overlays against changing scenes | Directed camera/media journey with skip/revisit and a complete static path |

Mix compatible relationships with a clear hierarchy: a cinematic product opening can lead into an editorial explanation and a precise comparison. Carry the same type roles, palette semantics and control language through all three. Do not force a single layout on content with different jobs.

When the choice is consequential and unspecified, compare two directions using the same real heading, subject, action and ordinary content block. Vary composition, imagery and type behavior enough to expose a meaningful choice. Judge product fit, recognition, readability, available assets and implementation cost. Select one with a short reason; routine choices already authorized do not need an approval pause. A small repair should preserve the established language.

## Derive a color system that can vary

Define semantic roles before filling them with color values: page, raised surface, primary text, secondary text, border, accent, accent text, focus, selection and feedback states. Add roles only when the interface needs them. Material and imagery colors can inform the UI without turning every extracted color into a token.

For each supported theme, map every role to an actual value and inspect its pairs in the real layout. A dark theme needs its own surface separation, image treatment and shadows; mechanically inverting the light palette rarely preserves hierarchy. A brand accent may need separate values for text, filled controls and decorative marks. Do not use a more saturated color as the only indicator of an error or selection.

Palette variations should preserve role meaning and information priority. Change warmth, saturation, contrast or material emphasis deliberately; review photographs, cutouts, gradients, rendered objects and translucent overlays as part of the same theme. Use [compositing and blending](../../rendering-judgment/references/compositing-and-blending.md) when backgrounds change the result. Validate relevant contrast using [visual accessibility](../../visual-accessibility/SKILL.md), including focus, disabled/read-only distinctions and intermediate animation states.

If the project supports theme choice, specify system default, explicit user choice, persistence and initial render behavior. Follow the existing framework's server/client boundary to avoid a flash or hydration disagreement. Handle unavailable storage without blocking the page. Listen to system changes only while system mode owns the choice. Do not add a theme switch solely to demonstrate palette options; authored design alternatives can remain project decisions.

## Typography is a working system

Select families from the actual brand, licenses, language coverage and delivery constraints. Define display, section title, body, label and numeric roles using weight, size, line height, measure and spacing. A limited family set can produce substantial range through these relationships. Record concrete values in the project's tokens; use [type, color and layout](../../visual-composition/references/type-color-layout.md) for implementation.

Inspect loaded fonts and fallback fonts with real copy. Font readiness changes wrapping, measured line masks and scene annotation bounds. Keep content visible during loading, reserve plausible metrics, and recompute measurements when fonts or content change. Do not promise pixel matching with a substituted font. Test actual supported weights and variable axes; synthesized styles can change the intended finish.

Use script-aware typography. Letter spacing that suits uppercase Latin labels may break connected scripts. Character motion must preserve grapheme clusters, shaping and the semantic phrase; choose line/word motion or a static heading when splitting damages it. Test the required locale, long translated labels, numeral formatting and direction. Use logical layout properties where appropriate, and decide whether an illustration or chronological sequence should mirror independently of text direction.

For responsive typography, choose minimum readable size, the desired wide size and the width interval that connects them. Verify intermediate wraps and enlarged text; viewport units alone do not guarantee usable scaling. Heading line breaks are an art-direction decision tied to available width and copy, not spaces inserted to fit one screenshot.

## Keep the direction through ordinary states

Carry the language into navigation, detail pages, forms, loading, empty, error, selection, focus and completion. Craft includes how a validation message fits the form and whether the last scroll state supports the primary action. Decorative intensity can decrease in task regions while type roles, alignment and imagery remain recognizable.

Before extending the system, inspect a representative opening, a dense content/task region and the narrow layout. Compare them against the visual thesis using real assets. If only the hero expresses the direction, repair the shared relationships. If everything competes, choose the intended focal element and simplify its neighbors. Deliver a concise record of selected tokens, image rules, motion roles, responsive changes and remaining observations; a family name alone is not an implementation specification.
