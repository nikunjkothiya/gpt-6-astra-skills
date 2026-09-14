---
name: lighting-design
description: Design and refine lighting for 3D scenes, product renders, spatial experiences, and visual storytelling. Use to reveal form and material, direct attention, establish atmosphere, or fix flat illumination, muddy shadows, weak separation, and floating objects.
---

# Lighting Design

Start with the information light must reveal. A significant illumination contribution should explain form, recover needed detail, separate subjects, establish environment, or support the intended atmosphere.

## Diagnose before adding light

Establish the intended camera and inspect major geometry with a neutral surface response. Identify unreadable planes, merged silhouettes, lost cavities, distracting highlights, and ambiguous contact. If the silhouette or structure is wrong, repair it through [geometric reasoning](../geometric-reasoning/SKILL.md).

Distinguish insufficient illumination from an exposure or material problem. Increasing all illumination can preserve the same flat ratios while washing out the result. Use [rendering judgment](../rendering-judgment/SKILL.md) when clipping or color inconsistency affects the entire scene.

## Assign roles, not a mandatory light count

| Role | Intended contribution | When to reduce it |
| --- | --- | --- |
| Key | Reveal dominant form and establish direction | When frontal illumination erases useful plane differences |
| Fill | Recover information in shadow | When the subject loses modeling and every plane reads equally |
| Separation | Distinguish a silhouette from its surroundings | When an outline looks detached or competes with the subject |
| Environment | Explain surrounding illumination and reflections | When its direction or character contradicts the visible world |
| Practical source | Connect a visible emitter with local illumination | When it draws attention away from the intended focus |
| Contact contribution | Clarify support, proximity, and grounding | When dark halos replace plausible contact |

One source can serve several roles, and some roles may be unnecessary. Add the smallest contribution that resolves an observed deficit.

Choose a lighting character tied to the subject: a precise sweep across a machined edge, a broad gradient around a soft volume, or a localized pool that organizes a larger scene. Let that relationship lead. A bold lighting concept can remain clear when secondary contributions support its direction instead of introducing unrelated accents.

## Shape contrast and highlights

Choose direction to reveal plane changes, curvature, thickness, and openings. A grazing direction may reveal relief but exaggerate surface defects; frontal illumination may preserve markings while flattening shape. Select the balance required by the task.

Consider the apparent size of the source from the subject. Broad sources generally produce broad reflection shapes and softer shadow transitions; small sources produce concentrated cues. Tune the actual rendered result rather than assuming a physical description guarantees a particular appearance.

Place highlights to describe curvature and guide attention. On a reflective object, changing the reflected source's shape or position may reveal form more effectively than changing material roughness. Preserve readable highlight structure instead of clipping it into an undifferentiated white region.

Shape the dark reflected regions as deliberately as the bright ones. A polished object surrounded by uniform brightness loses readable curvature; a controlled dark interval can separate adjacent reflection bands. Reducing unwanted fill or removing a reflected bright area may reveal the form more effectively than another source. Avoid reflection breaks that suggest a dent or seam where none exists.

Judge key-to-shadow relationships by visible information. Keep enough contrast to describe volume and enough shadow detail to understand required features. Darkness may support atmosphere, but it should not conceal inaccurate construction or necessary controls.

Concentrate the strongest contrast around the feature that matters. Keep labels and color-critical surfaces readable when a dramatic reflection crosses them. Global exposure shifts overall brightness; light direction, source size, and relative contributions determine whether the form is revealed. Change the responsible relationship first.

## Establish depth and grounding

Use coherent shadow direction and contact to connect objects with support surfaces. Shadow softness, offset, and contact sharpness should agree with the intended scale and illumination. A uniformly blurred detached shadow can make a heavy object float.

With a broad source, a cast shadow generally becomes softer as the separation between blocker and receiving surface increases. Preserve the tighter contact cue where they meet. Multiple sources may produce multiple shadows, but unexplained duplicate directions or an emitter with no plausible local influence weaken the scene's declared world.

Coordinate background value, surface response, and edge separation. If a silhouette merges, adjusting the background or camera may be simpler than adding a strong rim. Keep foreground and background contributions subordinate to the primary subject unless the scene's meaning calls for another hierarchy.

For a deliberate floating or abstract scene, avoid accidental contact cues that imply a missing support. The world should follow its own declared visual rules consistently.

## Control temperature and atmosphere

Choose warm-cool relationships to support material distinction and the visual thesis. Avoid coloring every region differently without a source or compositional reason. Preserve important color distinctions and markings under the chosen illumination.

Atmosphere can separate depth or reveal light paths, but excessive haze reduces contrast everywhere. Glow should follow selected luminous features; it does not establish the underlying illumination or explain a weak shape.

Use [material reasoning](../material-reasoning/SKILL.md) for response and [camera composition](../camera-composition/SKILL.md) for view-dependent highlight and shadow relationships.

## Inspect the relevant range

Observe required viewpoints, articulated poses, and motion. A light that reveals one pose can cast another into unreadable shadow. For sequences, maintain enough directional continuity to preserve orientation and avoid unexplained intensity changes.

If the object is flat, revise direction and contrast. If it floats, repair contact. If its edge looks pasted on, reduce or reposition separation. If its finish is indistinct, shape the reflected environment. If the entire output is washed out, investigate the rendering path before adding more lights.

Carry forward the dominant direction and character, intended highlight path, detail that must remain visible in shadow, grounding cue, and any pose that needs special treatment. Describe contributions by their visible purpose so the project can reproduce the lighting intent with its chosen means.
