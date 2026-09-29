---
name: interactive-motion
description: Select and implement topic-appropriate motion graphics, cursor tracking, hover reveals, scroll animation, and pointer-controlled video or image sequences. Use for animated website/UI briefs and interactive media; combine with cinematic-web for a directed multisection story.
---

# Interactive Motion

Translate the user's subject, audience and primary action into a small coherent motion system. Include the requested techniques in the available vocabulary; choose the ones that help this interface. A library of effects does not require all effects on each page. Strong composition, typography, meaningful content and complete interaction remain the foundation.

## Resolve the design from the topic

Read [topic and motion selection](references/topic-and-motion.md) before an original motion-heavy interface. Infer a concrete visual concept from the product, content, brand and viewing task. Record the most consequential assumptions. Pick a dominant visual event, supporting feedback, readable holds and a static alternative. Existing identity and explicit user requirements take precedence over the suggested topic patterns.

Specify each selected behavior numerically: trigger, bounds, input mapping, start/end values, duration or response rate, ease, ownership, interruption, exit, reduced motion, touch/keyboard equivalent, loading/failure and evidence. For a scroll narrative, produce the [cinematic storyboard](../cinematic-web/references/storyboard-and-rendering.md) before code. A simple follower needs a concise behavior contract, not a full film storyboard.

## Load by implementation

- For cursor followers, parallax, masks, tilt, magnetic visuals and coordinate mapping, read [cursor choreography](references/cursor-choreography.md).
- For cursor/scroll-controlled video, GIF alternatives, queued seeking, image sequences and media fallbacks, read [media scrubbing](references/media-scrubbing.md).
- For video-to-JPG preparation, alpha/color/timing, posters and encoding delivery, read [asset preparation](references/asset-preparation.md). For scroll-selected JPG/WebP/PNG frames, bounded decoding, stale requests and responsive canvas, read [scroll image sequences](references/scroll-image-sequences.md).
- For real object follow/drag, camera coordinates, pivots, springs and physical constraints, read [object tracking](references/object-tracking.md).
- For animated diagrams, kinetic graphics, SVG/canvas scenes and vector animation delivery, read [motion graphics](references/motion-graphics.md).
- For GSAP pinning, horizontal scroll, smoothing and camera travel, read [scroll and camera](../cinematic-web/references/scroll-and-camera.md). For procedural fields and pointer distortion, read [shaders and optics](../cinematic-web/references/shaders-and-optics.md).

One property has one writer. A pointer, scroll, keyboard slider and autoplay loop must acquire/release ownership explicitly when they affect the same progress. Keep input targets stationary when decorative children move. DOM focus, selection, labels and task state remain authoritative even if presentation uses canvas or video.

Build a representative beat and inspect it before extending the page. Read [motion verification](../cinematic-web/references/motion-verification.md) for deterministic sampling and real input checks. Add media-specific evidence: target time versus decoded/presented frame, seek latency, interrupted seek, source failure, and readiness. State missing observations. A successful seek assignment, a marketing preview, or a still image does not establish smooth playback or live 3D.

## Portable bundle

The `interactive-motion` named bundle contains this skill, the coordinator, cinematic integration, composition/direction and QA guidance plus selected references. MCP hosts can retrieve it with `visual_engineering_bundle`; text hosts can use `node scripts/export.mjs --bundle interactive-motion`. Load further catalog references when needed. Use the existing framework and host capabilities; these instructions do not provide missing assets, render tools or model ability.
