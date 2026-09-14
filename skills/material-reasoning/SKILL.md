---
name: material-reasoning
description: Design and refine physical or stylized materials for 3D objects, product imagery, and spatial scenes. Use to establish metal, glass, plastic, fabric, wood, or coated finishes, and to fix surfaces that look plastic, flat, noisy, or inconsistent under light.
---

# Material Reasoning

Describe what a surface is made from and how that identity should become visible. Material quality depends on geometry, illumination, viewing angle, and scale; no single gloss value establishes quality.

## Identify the material and its layers

Separate substrate, coating, exposed edges, transparent volume, wear, and attached surface markings. Painted metal may present a nonmetallic coating over a metal substrate; its intact exterior should not automatically reflect like exposed metal.

Decide which properties carry identity at the intended view: broad reflection, sharp highlight, directional grain, soft scattering, transmission, color, or edge response. Prefer a few perceptually distinct material families over arbitrary per-part variation.

Choose a dominant finish, a supporting contrast, and any focal accent according to the subject rather than making every surface equally expressive. A satin body beside a polished edge can communicate precision through response contrast even with little color variation. Preserve the reference or brief's actual material identity; an attractive highlight alone is insufficient evidence that a surface is metal, coated, or wet.

For stylized work, define which physical cues remain recognizable and which are deliberately exaggerated. Consistent stylization can simplify response without making every material identical.

## Separate response dimensions

| Property | Decision and diagnostic limit |
| --- | --- |
| Base color | Establish the underlying color separately from illumination and display treatment |
| Roughness | Control reflection spread and clarity; it does not replace light placement |
| Reflectivity | Choose response consistent with the material and viewing angle; maximum reflection is not a quality scale |
| Metallic behavior | Distinguish exposed conductive surfaces from nonmetallic surfaces and coatings |
| Coverage and opacity | Distinguish incomplete coverage from light passing through a transparent substance |
| Transmission and refraction | Account for light passing through thickness and changing direction |
| Surface microstructure | Represent grain, weave, pores, or fine relief at meaningful scale |
| Coating | Add a separate surface response only when a distinct layer exists |
| Scattering | Use soft internal light spread where the substance warrants it |
| Emission | Describe apparent self-light separately from illumination cast onto nearby objects |

Changing one dimension to compensate for another often creates a material that fails as the view changes. A dark metal may lack reflected surroundings; brightening its base color may not fix its identity. A transparent object may need visible thickness and edge response rather than lower opacity.

For physical materials, keep reflected, absorbed, and transmitted light consistent rather than increasing each independently. Ordinary uncoated nonmetallic surfaces usually have largely neutral surface reflections over a colored body; exposed metals derive their visible color primarily from reflection. Nonmetallic surface reflection generally becomes stronger toward grazing views. Roughness spreads reflection and changes its apparent concentration; it is not simply a darkness control.

Distinguish a thin transparent sheet from a solid transparent volume. Thickness, interfaces, and viewing angle affect distortion and edge visibility; absorption usually accumulates along the light's path through the substance. Do not add the same dark edge or tint everywhere regardless of thickness. For deliberate stylization, simplify these relationships consistently rather than borrowing contradictory cues from unrelated substances.

## Match material to construction

Align directional grain or brushing with the way the part was formed. Keep texture scale consistent across related parts unless construction explains the difference. A fabric weave larger than its seam allowance or a brushed pattern changing direction arbitrarily destroys scale cues.

Distinguish shading detail from modeled relief. Fine microstructure can affect shading without changing silhouette; deep grooves, edge wear, openings, and visible thickness may require geometry. Use [geometric reasoning](../geometric-reasoning/SKILL.md) where silhouette, contact, or occlusion changes.

Imperfections should follow exposure, handling, manufacturing, or age. Distribute wear near plausible contact or stress, not uniformly over every surface. Preserve intentionally new or minimal finishes when the brief calls for them.

For pattern placement, inspect stretching, seams, repetition, mirrored direction, and the intended viewing range. A higher-resolution pattern does not repair incorrect scale or orientation.

Allocate detail by visible scale: broad response establishes the substance, medium features explain manufacture or handling, and fine structure enriches close views. Fine detail should recede as the object gets smaller rather than becoming glitter or a new false pattern. If an edge must catch light to explain construction, establish its actual radius or thickness before painting on a highlight that will fail under another view.

## Judge with controlled illumination

Establish a readable view and a simple light environment before material refinement. Use a neutral comparison to distinguish geometry problems from response problems. Hold the camera and light arrangement steady while comparing material alternatives.

Then inspect the material under the expected environment and useful viewing angles. Reflections describe the surroundings; an empty or incoherent environment can make a correct reflective surface unreadable. Transparent objects need enough surrounding structure to make transmission and edges visible.

Coordinate [lighting design](../lighting-design/SKILL.md) when highlight placement or shadow contrast hides identity. Use [rendering judgment](../rendering-judgment/SKILL.md) for color interpretation, exposure, transparency artifacts, and output consistency.

## Diagnose and finish

If everything looks plastic, compare reflection character, roughness, coating, and material categories. If the object looks muddy, isolate light and exposure before increasing texture contrast. If material identity disappears at delivery size, strengthen the relevant broad cue rather than adding microscopic detail.

If highlights kink at a join, inspect surface continuity and orientation before altering roughness. If grain swims, shimmers, or changes scale through movement, inspect its coordinate relationship and rendered sampling. If the surface looks plausible only in one shot, determine whether that shot is the complete deliverable or whether the material needs a more robust response.

Accept the material when its intended identity remains readable in required views, its scale and layers agree with construction, and its detail supports the focal hierarchy without producing visual noise.

Carry forward the material families, layers, identifying cues, physical scale, and appearance constraints. Identify cues that depend on reflected surroundings so lighting work can preserve them. State uncertainty about the substance or finish when accuracy matters.
