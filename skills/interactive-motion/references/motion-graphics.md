# Motion graphics for web interfaces

Use for authored graphic movement: diagrams, typography, shapes, paths, editorial transitions and abstract marks. FROM-KNOWLEDGE procedures; ESTIMATED numerical starting values. Choose a clear static keyframe first. Each moving element should explain a relationship or contribute to the stated visual identity.

## Choose a representation

| Representation | Use and bounded recipe | Failure to avoid | Verify |
| --- | --- | --- | --- |
| DOM/CSS or WAAPI/GSAP | Type, panels, masks, 2D transforms; entry .45 s, 16 px, ease power2.out; one transform wrapper | Animating layout for hundreds of nodes or two writers on transform | Keyboard, actual font, interruptions, final computed style |
| SVG | Diagram with ≤150 visible shapes; path draw .7 s, node reveal .2 s; semantic text separate | Animated path data with incompatible command topology; per-frame filters everywhere | ViewBox scaling, stroke/marker shape, labels, matching morph topology |
| Canvas 2D | Many graphic marks/lines; e.g. 300 seeded dots with .04 units oscillation at .15 Hz | Canvas-only essential text or allocating particles each frame | Deterministic seed, DPR and overdraw, complete text alternative |
| Lottie | Existing authored vector clip with supported features; segment 0–60 over 2 s at source 30 fps | Assuming After Effects features/export render identically; endless decorative autoplay | Chosen renderer, masks/fonts, load failure, segment endpoints, pause/destroy |
| Rive | Existing interactive vector asset with named state-machine inputs; drive input 0–100 by normalized p | Inventing state/input names or mixing autoplay state with manual frame ownership | Actual asset input names, renderer support, keyboard path, cleanup |
| Three.js/shader | Genuine depth, lighting or pixel fields; use existing cinematic/Three.js references | WebGL merely to animate an ordinary caption | Same progress produces same scene; GPU budget and DOM alternative |
| Baked video/sequence | Complex offline graphics with a fixed camera and authored render | Pretending a recorded effect offers arbitrary live geometry | Seek/presentation latency, codec and memory; read media-scrubbing |

Use the installed runtime documentation for version-sensitive Lottie/Rive APIs and supplied asset metadata. These alternatives do not require installing both runtimes. Prefer the existing application stack. A reusable instruction must distinguish a procedural graphic from an imported animation asset.

## Author a beat, not unrelated tweens

For an original three-node process diagram, use an explicit master timeline:

| Master p | Graphic | Caption | Timing purpose |
| --- | --- | --- | --- |
| 0–.15 | Source node scales .92→1 and opacity 0→1 | Source label fades in | Establish origin |
| .15–.45 | Connection stroke offset full length→0; moving signal follows path | Hold source | Show transfer |
| .45–.65 | Destination ring expands radius 12→18 px, opacity .7→0 | Destination label appears over .12 p | Confirm arrival |
| .65–1 | All informative geometry fixed | Full result readable | Quiet hold |

Original DOM/SVG recipe; path must exist and scene dimensions must be stable before measuring. Time and scroll use the same evaluator.

```js
const span = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
const smooth = p => p * p * (3 - 2 * p);
const length = path.getTotalLength();
path.style.strokeDasharray = String(length);
function evaluateDiagram(p) {
  const enter = smooth(span(p, 0, .15));
  const travel = span(p, .15, .45);
  const arrive = smooth(span(p, .45, .65));
  source.style.opacity = String(enter);
  source.style.transform = `scale(${.92 + .08 * enter})`;
  path.style.strokeDashoffset = String(length * (1 - travel));
  const point = path.getPointAtLength(length * travel);
  signal.setAttribute('cx', String(point.x));
  signal.setAttribute('cy', String(point.y));
  ring.setAttribute('r', String(12 + 6 * arrive));
  ring.style.opacity = String(.7 * (1 - arrive) * travel);
}
```

Set the source's SVG transform origin deliberately (`transform-box:fill-box; transform-origin:center` when supported by the chosen browser). Position signals in the path's coordinate system; transform coordinates if they have different parents. Keep labels as ordinary text and provide a complete description. On reduced motion evaluate a useful complete diagram; no long artificial scroll distance is needed.

For kinetic lettering, use measured line masks or supported vector outlines and preserve the original semantic phrase. For looped graphics, choose a periodic function whose value and derivative match at the seam: `phase=2π*t/period`, `x=A*sin(phase)`, period 4 s, A=12 px. Modulo-restarting a nonperiodic ramp causes a cut. An orbiting accent can use `(cos phase,sin phase)` and inherit a stable center. Use seeded randomness for particle layouts; don't generate new positions each frame.

## Delivery and inspection

Specify start/end/loop/hold behavior, input ownership, viewport fit, contrast, DPR, maximum marks/paths, and whether the graphic runs offscreen. Stop at rest, on page hide, offscreen and when reduced motion applies. A continuous decorative loop also needs a pause option when applicable to the experience. User-triggered playback must be interruptible; resuming starts from a declared state.

Verify at p=0,.15,.45,.65,1 and in reverse, sample around every boundary, and inspect real playback without screenshot overhead. Inspect line joins, aliasing, abrupt visibility changes, text overlap, masking and loop seams. A late asset load must not replay an old intent. Keep disposal paired with construction. Exported vector/video assets require their own visual validation; package recipes do not validate arbitrary third-party files.
