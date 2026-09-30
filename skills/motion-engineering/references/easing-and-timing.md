# Easing and timing

Motion values for [motion engineering](../SKILL.md): tokens, springs, staggers, choreography and a small tested math module. Durations and curves are starting points; tune them in playback on real content.

## Easing tokens

| Token | CSS | GSAP | Motion | Use |
| --- | --- | --- | --- | --- |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | `power2.out` (close) | `[0.2, 0, 0, 1]` | Small UI changes, color and opacity |
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | `power3.out` | `[0.25, 1, 0.5, 1]` | Hover, images, panels |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | `expo.out` | `[0.16, 1, 0.3, 1]` | Text reveals, arrivals, luxury entrances |
| `--ease-in-quart` | `cubic-bezier(0.5, 0, 0.75, 0)` | `power3.in` | `[0.5, 0, 0.75, 0]` | Exits and dismissals |
| `--ease-in-out-quart` | `cubic-bezier(0.76, 0, 0.24, 1)` | `power3.inOut` | `[0.76, 0, 0.24, 1]` | Page transitions, curtains, symmetric moves |
| `--ease-in-out-expo` | `cubic-bezier(0.87, 0, 0.13, 1)` | `expo.inOut` | `[0.87, 0, 0.13, 1]` | Dramatic wipes, floods |
| `--ease-emphasized` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | CustomEase | `[0.05, 0.7, 0.1, 1]` | Large surfaces entering |

For an exact match in GSAP, register the curve once: `CustomEase.create('outExpo', '0.16,1,0.3,1')`. GSAP's power names map to polynomial orders: `power1` quad, `power2` cubic, `power3` quart, `power4` quint.

## Springs

Springs give motion mass without choosing an end time. The presets below are closed-form damped springs (stiffness, damping, mass 1):

| Preset | Stiffness, damping | Behavior | Use |
| --- | --- | --- | --- |
| snappy | 320, 28 | About 2 % overshoot, settles in about 0.47 s | Buttons, toggles, chips, indicators |
| default | 170, 26 | No visible overshoot, about 0.7 s | Cards, panels, camera moves |
| heavy | 90, 19 | No overshoot, about 1 s | Large type, logos, luxury objects |
| playful | 220, 16 | About 13 % overshoot | Stickers, mascots, playful brands only |

Tiny overshoot on UI, none on type. Use them per runtime:

- CSS: `node scripts/tokens.mjs spring --stiffness 320 --damping 28 --name snappy` prints a `linear()` curve and its duration.
- Motion: `transition={{ type: 'spring', stiffness: 320, damping: 28 }}`.
- GSAP: pass a function as the ease, for example `ease: t => springAt(t * 0.47, 320, 28)` with the settle time as the tween duration, or keep GSAP eases for timelines and use springs for pointer-driven values.
- Canvas and WebGL: `springAt()` and `track()` from the module below, as pure functions of time.

## Duration from distance

Doubling distance should not double duration. A useful rule for UI travel:

```text
duration = clamp(120 ms, 160 ms + 20 ms × √distancePx, 900 ms)
```

24 px moves take about 260 ms; 400 px moves about 560 ms. Scale down for frequent interactions, up for large rare ones.

## Staggers

- Linear stagger per item: `min(60 ms, 400 ms / (n − 1))`, so the cascade never exceeds 400 ms.
- Accelerating stagger for large sets: offsets `span × √(i / (n − 1))` have wider gaps initially and shorter gaps near the end; use zero offset for a single item.
- Grids: `stagger: { grid: 'auto', from: 'center', amount: 0.6 }` in GSAP.
- Stagger only items whose order means something; animate unordered groups together.

## Load choreography template

| Time | Element | Motion |
| --- | --- | --- |
| 0 ms | Ground, header, fonts ready | No preloader for normal pages |
| 60–120 ms | Headline lines | Mask rise, 800–1000 ms, `--ease-out-expo`, 60–90 ms line stagger |
| 150–250 ms | Hero media | Clip reveal plus inner scale, 900–1300 ms, `--ease-out-quart` |
| 500–700 ms | Supporting copy and actions | Fade or 12 px rise, 300–400 ms |
| ≤ 1.2 s | Hero readable and actionable | Everything interactive before its entrance finishes |

## Reading holds

Reading-time estimates are rough storyboard inputs, not universal language-specific limits. Scroll distance cannot guarantee dwell time. Let visitors pause and revisit captions, and verify comprehension at their own pace. The `readingTime()` helper below is an illustrative estimate only; it must not auto-advance essential content.

## Interruption

- CSS transitions retarget from the current value automatically; keep them for hover and focus.
- GSAP: `overwrite: 'auto'` for competing tweens, `quickTo()` for continuously retargeted values.
- Canvas and WebGL: `track()` below adds one spring per target change, so motion stays continuous when targets change mid-flight.
- Stretching indicators (tabs, underlines) look physical when the leading edge uses a stiffer spring than the trailing edge.

## Math module

Framework-neutral helpers used by the recipes in this package. They are pure functions of their inputs; the package tests execute this block.

<!-- runtime:start -->
```js
export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const inv = (a, b, value) => (a === b ? (value >= b ? 1 : 0) : clamp((value - a) / (b - a)));
export const mapRange = (value, inMin, inMax, outMin, outMax) => lerp(outMin, outMax, inv(inMin, inMax, value));
export const smoothstep = (a, b, value) => {
  const t = inv(a, b, value);
  return t * t * (3 - 2 * t);
};

export function damp(current, target, lambda, dt) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export const SPRINGS = { snappy: [320, 28], default: [170, 26], heavy: [90, 19], playful: [220, 16] };

export function springAt(t, stiffness = 170, damping = 26, mass = 1) {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (Math.abs(zeta - 1) < 1e-6) return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
  }
  const root = Math.sqrt(zeta * zeta - 1);
  const r1 = -w0 * (zeta - root);
  const r2 = -w0 * (zeta + root);
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

export function track(t, keys, stiffness = 170, damping = 26) {
  let value = keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    value += (keys[i][1] - keys[i - 1][1]) * springAt(t - keys[i][0], stiffness, damping);
  }
  return value;
}

export function swapAlpha(t, tIn, tOut = Infinity, fade = 0.12) {
  return Math.min(inv(tIn, tIn + fade, t), 1 - inv(tOut - fade, tOut, t));
}

export const logLerp = (a, b, t) => a * Math.pow(b / a, t);

export function floodRadius(x, y, width, height, margin = 1.05) {
  return Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) * margin;
}

export function staggerOffsets(count, span, curve = 'sqrt') {
  if (!Number.isInteger(count) || count < 0) throw new RangeError('count must be a non-negative integer');
  if (count === 0) return [];
  if (count === 1) return [0];
  return Array.from({ length: count }, (_, i) => {
    const u = i / (count - 1);
    return span * (curve === 'sqrt' ? Math.sqrt(u) : u);
  });
}

export function durationFor(distancePx, { base = 160, perRoot = 20, min = 120, max = 900 } = {}) {
  return clamp(base + perRoot * Math.sqrt(Math.max(0, distancePx)), min, max);
}

export function readingTime({ words = 0, cjkCharacters = 0 } = {}) {
  return words * 0.3 + cjkCharacters * 0.08 + (words || cjkCharacters ? 1 : 0);
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
```
<!-- runtime:end -->

- `damp()` is frame-rate independent: two half steps equal one full step, so motion feels the same at 30, 60 and 120 Hz.
- `springAt()` starts at 0 with zero velocity and settles at 1; multiply by the distance to travel.
- `track(t, [[t0, v0], [t1, v1], …])` keeps a value continuous as it retargets; before the second key it holds the first value.
- `swapAlpha()` fades text in after `tIn` and out before `tOut`, so labels inside a morphing container never overlap.
- `logLerp()` interpolates zoom and scale in log space so each doubling takes equal time; never zoom in and out back to back.
- `floodRadius()` gives the circle radius that covers the viewport from a click point, for flood and iris transitions.
- `mulberry32()` and `hash()` replace `Math.random()` wherever frames must be reproducible.
