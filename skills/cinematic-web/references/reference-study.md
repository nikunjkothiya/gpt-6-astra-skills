# Public reference study and provenance

Use when the user supplies a site, public preview, video, or a visual reference class such as Scrolltide, Awwwards, FWA, CSSDA, or Codrops. A library name establishes a requested reference class. It does not establish that any specific work has been inspected or how that work is implemented.

## Study technique with explicit evidence

Inspect only publicly viewable pages, preview videos, documentation, and materials the user is entitled to provide. Do not bypass a paywall or access control. Do not reproduce paid prompts, template source, branded copy, assets, or another creator's complete composition. Build an original result that transfers an observed technique and addresses the user's content.

Record URL, title, date inspected, viewport/DPR, input/device mode, and what the host could actually access. A fetched HTML page may reveal text or metadata without showing any animation. A screenshot proves a moment, not temporal behavior. A preview video proves the depicted presentation, not interaction latency or implementation.

Use these labels on every reference claim, including table cells or groups of claims whose shared provenance is clear:

| Label | Meaning | Example |
| --- | --- | --- |
| **OBSERVED** | Directly inspected during this session; identify the evidence | `At video 00:01.0 the object fills roughly half the frame height.` |
| **INFERRED** | A plausible explanation derived from observations; not source-code knowledge | `The object/text separation could be a canvas layer behind DOM.` |
| **FROM-KNOWLEDGE** | General technical reasoning or a proposed original implementation | `A progress-driven camera rig can reproduce this class of move.` |
| **UNVERIFIED** | Not accessible, not inspected, or not tested | `Touch behavior and reverse scroll were not observable in the preview.` |

Add **ESTIMATED** to proposed numeric values. It is a confidence qualifier, not a fifth evidence category: `INFERRED / ESTIMATED: 0.7 s power2.out-like entry`. Never call a curve exactly `power2.out`, a renderer Three.js, or a material physical transmission solely because the image resembles it. Several implementation methods can produce the same frames.

## Technique record template

```text
Reference: public title + URL
Inspection: date, viewport, DPR, browser, input, accessible medium
Evidence: screenshot/recording names or video timestamps

Timed observations [OBSERVED]:
  t=0.0 / scroll=0 px: ...
  t=0.5 / scroll=...: ...
  t=1.0 / scroll=...: ...
  Direction reversal / ending: ... or UNVERIFIED

Layer hypothesis [INFERRED]:
  DOM: ...
  canvas/shader: ...
  video/image sequence: ...
  Ambiguities and alternative explanations: ...

Parameters [INFERRED, ESTIMATED]:
  duration ..., delay ..., stagger ..., ease approximation ...
  travel ... px / % / object-heights, rotation ... degrees
  camera distance ..., target ..., vertical FOV ... degrees
  scrub lag ... seconds, damping ... inverse seconds
  unknown quantities: UNVERIFIED

Transferable original pattern [FROM-KNOWLEDGE]:
  goal, layer ownership, original assets/content, bounded recipe
  where it fails, required fallback

Verification plan [FROM-KNOWLEDGE]:
  matched frames, forward/reverse progress, measured deltas,
  resize/interruption, relevant device and accessibility checks
```

For scroll references, record actual scroll positions and viewport height, then normalize progress over the active region. Sample forward and reverse at the same positions after settling. For video, record timestamps and playback speed; approximate durations between visible landmarks. If inspection is only a screenshot, mark all temporal values unverified and offer a proposed storyboard instead of claiming an observed one.

## Turn observation into an original implementation

1. Identify the perceptual event: e.g. a product rotates while the headline holds, then a detail label enters after the camera settles.
2. Separate measured visual changes from implementation guesses. Estimate one set of parameters with units and a plausible range, not false precision.
3. Choose DOM, live 3D, shader, video, sequence, or hybrid using the project's interactions and budget. The original site may have chosen differently.
4. Make the storyboard with the user's content and an original composition. Keep only the technique that serves its purpose.
5. Build the representative beat and compare its intended timing, hierarchy, readability, and continuity. Do not use similarity as a reason to copy protected artifacts.

Example of a responsible finding: `OBSERVED: the public preview moves from a full object view to a close detail between 00:02 and 00:04. INFERRED / ESTIMATED: a 1.8–2.2 s dolly with a narrowing 40→35° FOV could produce a comparable emphasis. UNVERIFIED: the original lens, renderer, and live input behavior. FROM-KNOWLEDGE: implement our own object, camera curve, and semantic DOM label, then test reverse scrubbing.` This is a hypothetical example of record structure, not an observation of a named site.

If the host cannot open a reference, state the limitation once and continue from supplied images or a clearly labeled original proposal. Do not invent familiarity, awards, implementation details, hidden model processes, or browser evidence. Prefer official API documentation for version-sensitive implementation facts and put source links beside the facts they support.

## Package development inspection record — 2026-09-28

### Public Codrops demonstration

Reference: [public scroll demonstration](https://threejs-journey.com/resources/codrops/threejs-scroll-based-animation/) linked by [the Codrops article](https://tympanus.net/codrops/2022/01/05/crafting-scroll-based-animations-in-three-js/). **OBSERVED:** the article describes Three.js alongside HTML, scroll-following camera movement, and pointer parallax. This is documentation evidence; its implementation versions are historical.

**OBSERVED:** a headless Chrome run at 1200×800 captured the public demo at these times relative to capture start after network idle. Large pale DOM headings alternate left/right on a dark background in viewport-height chapters. A canvas element exists. The inspected captures show no visible 3D objects.

| Capture | Time / scroll Y | Provenance |
| --- | --- | --- |
| Start | 43 ms and 602 ms / 0 px | OBSERVED captured positions/times |
| Middle | 743 ms and 2321 ms / 800 px | OBSERVED captured positions/times |
| End | 3977 ms / 1600 px | OBSERVED captured position/time |
| Return | 5643 ms / 0 px | OBSERVED captured position/time |

**UNVERIFIED:** successful 3D rendering, camera movement, particle motion, physical-device behavior, source easing and performance. A blank canvas in this run must not become a claim that the reference has no 3D effect. These are historical observations; temporary captures were removed during package cleanup. Inspect the current site again before making new claims about its behavior.

**INFERRED:** separating semantic DOM chapters from a persistent canvas is a plausible transferable layering strategy, consistent with the article. **FROM-KNOWLEDGE / ESTIMATED original proposal:** use a .6 s `power2.out` label entry from 16 px below its resting position, 0.10 s evidence stagger, and a camera rig driven by normalized scroll with .35 s catch-up. These are proposed parameters for new work, not measured properties of the demo. **FROM-KNOWLEDGE:** preserve the readable DOM composition if canvas initialization fails and test scroll reversal at equal progress values before claiming temporal continuity.

### Scrolltide

Reference: [Scrolltide](https://scrolltide.co). **OBSERVED:** the public-page fetch returned an internal access/fetch error during this session. **UNVERIFIED:** page presentation, motion, implementation strategy, and numeric parameters. No timed visual observations or extracted effect claims are available. **FROM-KNOWLEDGE:** a future successful public preview inspection can populate the technique template above without accessing paid material.
