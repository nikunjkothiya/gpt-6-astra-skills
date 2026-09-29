# Interface motion, framework integration, and resilience

Use for the semantic interface around the scene and for application lifecycle. **FROM-KNOWLEDGE:** procedures and original recipes below. **ESTIMATED:** durations/distances are initial design parameters; verify them with real content, inputs, and target devices.

## Typography as a timed composition

Resolve typography and line breaks before splitting text. Preserve a readable semantic source; animated duplicates must not cause duplicate announcements or hide links from assistive technology. Animated display copy needs a reading hold; ordinary paragraphs seldom benefit from character-by-character motion.

| Technique | Procedure and quantitative recipe | Anti-pattern | Verification |
| --- | --- | --- | --- |
| Line reveal | Wait for fonts; mask each measured line; translate y 105→0% over .7 s, `power2.out`, line stagger .10 s | Fixed line wrappers that break after resize or clip accents/descenders | Real font loaded, 320 px, 200% text, dynamic copy, reduced-motion visible state |
| Character accent | Split one short heading; y 16→0 px, opacity 0→1, .5 s, .018 s stagger, total cascade ≤.45 s | Splitting paragraphs, letter animation that ruins kerning and language shaping | Heading remains one accessible phrase; test ligatures and target scripts |
| Mask wipe | Clip a decorative title wrapper from inset 100%→0% over .65 s; child held or y 12→0 px | Clipping focusable descendants or using layout height animation unnecessarily | Focus ring and glyph extents at all progress values |
| Kinetic emphasis | Animate a variable font axis within its supported range over .6 s, e.g. weight 450→650; reserve width or choose a stable axis | Large reflow at every frame or unreadable rapid tracking changes | No layout shift of adjacent controls; measured font support |
| Focus reveal | Bring one word/line from blur 5→0 px and opacity .4→1 over .45 s; hold ≥1.2 s | Blur on required body content or synchronized blur across everything | Intermediate contrast and raster cost, static accessible copy |

With a compatible GSAP release, `SplitText.create` supports `autoSplit` and an `onSplit` callback. Create and return the animation in that callback so newly split lines receive it; revert on teardown. Verify the installed [SplitText API](https://gsap.com/docs/v3/Plugins/SplitText/). Plain masks and authored line wrappers can suffice when content/line breaks are intentionally fixed. Do not add a dependency solely to animate two spans.

## Pointer and micro-interaction recipes

Enable decorative pointer effects only for fine pointers with hover, and provide equivalent focus/selected feedback. Preserve the native cursor unless a tested replacement clearly improves the interaction. A follower must be `pointer-events:none` and must never obscure the target or capture clicks.

| Technique | Procedure and starting numbers | Anti-pattern | Verification |
| --- | --- | --- | --- |
| Cursor follower | Track a target point, apply exponential response rate 18 s⁻¹, use a 12 px marker and 0.18 s opacity entry/exit | Fixed per-frame lerp, follower as the only hover feedback | Equal-time behavior at 30/60/120 Hz, viewport exit, reduced motion absent |
| Magnetic element | Translate an inner visual wrapper by normalized pointer displacement ×6 px; return with rate 20 s⁻¹; outer button hit area remains fixed | Moving hit target under pointer or pulling controls away from clicks | Edge click, keyboard focus, touch, rapid enter/exit |
| 3D tilt | Normalize pointer in card rectangle; rotate X/Y by at most ±4°, perspective 900 px, response 14 s⁻¹; reset to 0 | Tilting text-heavy screens, CSS and JS both writing transform | Edges stay in bounds, click/focus intact, no touch tilt |
| Raycast hover | Convert pointer relative to canvas to NDC; raycast semantic pick meshes at most once per render; tween highlight .16 s | Raycasting entire scene on every raw pointer event, stale world matrices | Overlap priorities, empty hit, hidden object, touch selection |
| Pointer light | Move a dedicated light ±.25 subject widths horizontally and ±.15 vertically, damp at 10 s⁻¹; keep base lighting stable | Pointer is the only illumination or shadow generator per move | Product readable at every corner and when pointer leaves |
| Button/card response | Hover visual y 0→−2 px over .18 s `power2.out`; press scale 1→.98 over .08 s and release .16 s | Repeated bounce, transition `all`, delayed click semantics | Rapid press/cancel, disabled state, keyboard activation |

All rates use `alpha=1-exp(-rate*dt)` with dt in seconds. For spring responses requiring velocity continuity or bounded settle, use the [motion reference](../../motion-intelligence/references/timing-and-interruption.md). Keep application state changes immediate; decorative arrival does not decide whether a button click succeeded.

## Page and shared-element transitions

Model navigation as intent → destination readiness → presentation handoff → focus/scroll completion, with cancellation at every asynchronous boundary. A route transition must not wait forever for an asset. Preserve real links, modified clicks, history, and browser navigation semantics.

| Technique | Procedure and numbers | Anti-pattern | Verification |
| --- | --- | --- | --- |
| Shared element / Flip | Capture source geometry, perform one layout/state mutation, animate into destination over .55 s `power2.inOut`; stable IDs identify shared items | Measuring after mutation, duplicating active links, stale destination measurements | Mid-transition cancel, resize, source removed, focus remains logical |
| Curtain | Cover enters over .35 s, destination readiness under cover with a stated timeout, uncover .45 s; reveal useful fallback if destination fails | A fake fixed loader delay or trapped focus under a permanent overlay | Slow/error navigation, back during cover, reduced motion skips curtain |
| WebGL image transition | Keep two ready textures; blend with progress 0→1 over .8 s and ≤.025 UV displacement, return distortion to 0 at endpoints | Sampling an unloaded texture, exposing blank borders, route state owned by shader | Identical endpoints, reverse/cancel, texture disposal, destination DOM parity |
| Simple page transition | Crossfade outgoing/incoming presentation .18/.24 s with explicit focus transfer after new content exists | Animating the entire document for a small content update | Keyboard location, scroll restoration, browser back and no-JS navigation |

[Flip](https://gsap.com/docs/v3/Plugins/Flip/) can record state before a layout change and animate from it afterward. Its active-animation capture behavior needs consideration when retargeting: choose to finish, cancel/revert, or sample a supported current state deliberately. Do not assume automatic velocity continuity. For browser View Transitions, inspect support and the framework's current router integration; retain a normal navigation fallback and treat snapshots as presentation only.

## App UI sequences

Motion should explain a state change and preserve data correctness. Never invent intermediate measurements as business data. Example recipes:

| Technique | Procedure / numeric recipe | Anti-pattern | Verification |
| --- | --- | --- | --- |
| Count-up | Store the true value immediately; interpolate a decorative display over .6 s `power2.out`; format using the same locale and round only display | Announcing every frame, displaying a fake live metric, replaying on every render | Negative/decimal/large values, interrupted updates, accessible final value |
| Chart draw-in | Use a stable path with stroke dash length; offset length→0 in .8 s `power2.inOut`; fade markers .2 s afterward | Changing chart scale during reveal or equating path drawing with a time-series trend | Final data geometry exact, zero/missing values, reduced motion and data table |
| Staggered list | For a newly inserted group, y 8→0 px and opacity 0→1, duration .28 s, stagger .035 s capped to .21 s | Reanimating old rows on every filter or delaying actionable data | Stable keys, sort/reorder, 100-item lists, focus on retained items |
| Skeleton | Reserve final geometry; optional low-contrast shimmer over 1.4 s, stop on hidden/reduced motion; crossfade .15 s when ready | Infinite animation with no status or layout jumping on replacement | Slow load, error/retry, no unnecessary live-region announcements |

Reduced motion generally uses the final useful state or a short opacity change only if acceptable to the brief and user preference. Preserve focus indicators throughout. Loading, error, empty, success, and disabled states need intentional typography and spacing as well as timing.

## Framework boundary and property ownership

Use the existing stack. Choose vanilla Three.js when a focused isolated scene and direct scheduler suit the application; choose React Three Fiber when the app already uses React scene composition or its lifecycle ecosystem materially simplifies the task. R3F is not a visual quality feature, and adding it to a small vanilla page is not required.

In Next.js App Router, keep content/layout server-rendered and place canvas, browser input, and animation setup behind a narrow client boundary. Do not access window/document/WebGL during server evaluation. Pass serializable scene configuration, not live Three.js instances, across that boundary. These boundaries follow [Next.js documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components); confirm behavior against the installed version. Client components may still be prerendered, so browser work belongs in appropriate lifecycle code. A no-SSR dynamic import, if required, must follow the version's supported client-wrapper pattern.

Use TypeScript to make scene state and ownership visible:

```ts
type StoryState = {
  progress: number;
  mode: 'scroll' | 'inspect' | 'reduced';
  selectedId: string | null;
};
type SceneHandle = {
  evaluate: (progress: number) => void;
  resize: (width: number, height: number, dpr: number) => void;
  dispose: () => void;
};
```

Keep per-frame values in refs or the animation engine, not React state at 60 Hz. Semantic selection/loading/error changes may update React. In R3F, use its frame scheduler and invalidation; do not create another renderer loop. Follow [R3F ownership guidance](../../threejs-engineering/references/react-three-fiber.md) for shared cached assets and disposal.

| Property | Owner example | Safe composition |
| --- | --- | --- |
| Story progress | ScrollTrigger master | Camera evaluator reads it |
| Camera base pose | Story rig | Inspection controls acquire ownership after handoff |
| Pointer parallax | Child camera offset rig | Bounded offset after story base pose |
| Product joint rotation | Mixer or authored pose evaluator | Choose one, or use explicit additive hierarchy |
| DOM layout/color | CSS/Tailwind | GSAP owns a dedicated motion wrapper transform |
| Hover transform | CSS transition or GSAP | One owner; nested wrapper for an independent effect |

Tailwind utilities should encode layout/tokens and static state. Avoid dynamic class-name construction that the build cannot discover; use a finite map or CSS variables. Do not put a CSS transform transition on a property GSAP updates every frame. GSAP contexts/media-query scopes must revert on unmount; remove listeners and kill owned timelines, not every animation in the application. [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) supports condition-specific setup and reversion; other resources still need explicit cleanup.

## Runtime resilience

1. **DPR and quality:** cap DPR from the selected tier and actual pixel budget; start 1.5 desktop/1.25 constrained. Update composer targets too. Adapt after sustained measured overload with hysteresis, not every slow frame.
2. **Lifecycle:** abort or ignore stale loads, dispose owned geometries/materials/textures/targets, stop owned mixers, remove event/ticker/observer subscriptions. A shared cached texture must not be disposed by one consumer.
3. **Context loss:** stop rendering, expose poster/status and usable DOM controls. Choose a tested rebuild path on restoration or an explicit reload action. Preserve application selection; do not repeatedly reinitialize in a failure loop.
4. **Hidden/offscreen:** suspend decorative continuous work. On resume, reset timing origin or evaluate current canonical progress. State whether a simulation discards elapsed hidden time.
5. **Touch/browser behavior:** test iOS-style viewport changes, Android-like constrained rendering, pointer cancel, overscroll, orientation change, DPR changes, texture limits and codec support on actual targets when available. Emulation is useful but is not a physical-device measurement.
6. **Reduced motion:** respond when the preference changes during a timeline, cancel owned motion, settle into a valid useful state, release pins if the alternate layout uses normal flow, refresh layout once, and preserve content/focus.

Verify mount→interact→unmount→remount, a missing asset, context loss, route interruption, resize at an intermediate progress, and idle rendering. Keep versions, browser, viewport, device and evidence in the report. A desktop headless pass cannot establish smoothness on a phone.
