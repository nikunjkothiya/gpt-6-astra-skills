# Deterministic render

Some deliverables are rendered rather than played live: a hero loop video, a launch film cut from the real site, a share video, a GIF for a press kit, an Open Graph clip. Render them from code so every frame is repeatable and any scene can be fixed without touching the rest. The method adapts the seek-based pipelines of the MIT-licensed [claude-motion-design](https://github.com/howseen-ai/claude-motion-design), [motion-graphic-skill](https://github.com/JakeB-5/motion-graphic-skill) and [launch-film](https://github.com/SkylarKitchen/skills) projects to this package.

## Engine rules

1. The whole film is one function: `render(t)` draws the frame at time `t` in seconds. No accumulated state, no CSS transitions, no timers.
2. Randomness comes from `mulberry32(seed)` or `hash(i)` ([easing and timing](easing-and-timing.md)); never `Math.random()` or `Date.now()`.
3. Movement uses closed-form springs (`springAt`, `track`) or eases of `inv(a, b, t)`; zoom interpolates in log space.
4. Declare every constant before the first render, then set `window.ready = true` after fonts and images load.
5. Expose `window.seek(t)` and `window.duration`; support `?t=12.5` to freeze a frame for review.
6. Time scenes on a beat grid when there is music (beat length = 60 / BPM); place the key visual moment on the drop.
7. Every on-screen number is sourced; illustrative data is labelled on screen.

```html
<canvas id="film" width="1920" height="1080"></canvas>
<script type="module">
  import { inv, lerp, springAt, mulberry32 } from './motion-math.js';

  const canvas = document.getElementById('film');
  const ctx = canvas.getContext('2d');
  const DURATION = 12;
  const rng = mulberry32(7);
  const dots = Array.from({ length: 120 }, () => ({ x: rng() * 1920, y: rng() * 1080, r: 1 + rng() * 2 }));

  function render(t) {
    ctx.fillStyle = '#16100D';
    ctx.fillRect(0, 0, 1920, 1080);
    for (const dot of dots) {
      ctx.globalAlpha = 0.25 + 0.5 * inv(0, 2, t);
      ctx.fillStyle = '#D99A5B';
      ctx.beginPath();
      ctx.arc(dot.x, dot.y + Math.sin(t * 0.6 + dot.x) * 6, dot.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const rise = springAt(t - 0.4, 90, 19);
    ctx.fillStyle = '#EFE6DC';
    ctx.font = '300 140px Fraunces, serif';
    ctx.fillText('Orris Nocturne', 140, lerp(700, 560, rise));
  }

  window.duration = DURATION;
  let frame = 0;
  window.seek = async t => {
    cancelAnimationFrame(frame);
    frame = 0;
    render(t);
  };
  await document.fonts.load('300 140px Fraunces');
  const frozen = new URLSearchParams(location.search).get('t');
  if (frozen !== null) {
    render(Number(frozen));
  } else if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    render(2);
  } else {
    let start;
    const loop = now => {
      start ??= now;
      render(((now - start) / 1000) % DURATION);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
  }
  window.ready = true;
</script>
```

`motion-math.js` is the math module from [easing and timing](easing-and-timing.md), saved as a file.

## Seekable libraries

| Library | How to seek |
| --- | --- |
| GSAP | Build timelines with `paused: true`; call `timeline.seek(t)` or `timeline.progress(p)` from `window.seek` |
| anime.js 4 | Create with `autoplay: false`; call `animation.seek(ms)` |
| Theatre.js | Remove the Studio in the render build; set `sheet.sequence.position = t` |
| CSS and Web Animations | `document.getAnimations().forEach(a => { a.pause(); a.currentTime = t * 1000; })` |
| Video elements | Set `currentTime` and await the `seeked` event before capturing |

Libraries that only animate in real time (smooth scrollers, physics without a fixed step, live spring runtimes, embedded third-party scenes) drift between frames; drive them through a seekable equivalent or pre-render them.

## Capture frames

Node with Playwright, one screenshot per frame:

```js
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const [url, fps = '60', out = 'frames'] = process.argv.slice(2);
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const captureUrl = new URL(url);
captureUrl.searchParams.set('t', '0');
await page.goto(captureUrl.href);
await page.waitForFunction(() => window.ready === true);
const duration = await page.evaluate(() => window.duration);
const total = Math.round(duration * Number(fps));
for (let frame = 0; frame < total; frame++) {
  await page.evaluate(t => window.seek(t), frame / Number(fps));
  await page.screenshot({ path: `${out}/frame_${String(frame).padStart(5, '0')}.png` });
}
await browser.close();
```

Headless WebGL may use software rendering or an available GPU, depending on the browser and launch environment. Record the actual renderer, compare representative frames on the target GPU, and limit concurrent capture sessions to available GPU and memory capacity.

## Encode

```text
ffmpeg -framerate 60 -i frames/frame_%05d.png -c:v libx264 -preset slow -crf 18 -vf "scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p" -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -movflags +faststart film.mp4
```

- Motion blur: capture 6–8 subframes per output frame (at `fps × N`), then average them: `-vf "tmix=frames=8,fps=60"` before the scale filter. Four subframes tends to look like ghosting.
- A web hero loop also needs a smaller encode (for example CRF 26 at 1280 px wide), a WebM or AV1 alternative, and a poster frame.
- Normalize music to about −14 LUFS for social platforms, and place each sound effect on its measured peak. Web pages start silent.

## Review before delivery

```text
ffmpeg -i film.mp4 -vf "fps=2,scale=320:-1,tile=6x5" -frames:v 1 contact.png
ffmpeg -ss 4.9 -i film.mp4 -vf "scale=320:-1,tile=12x1" -frames:v 1 strip-5s.png
ffmpeg -i film.mp4 -vf "fps=1,scale=360:-1,tile=5x3" -frames:v 1 phone.png
```

Open every sheet and check:

| Check | Pass when |
| --- | --- |
| Hook | Something striking and readable is on screen by 2 s |
| Pace | Something new every 2–4 s; no two stills of a scene look the same |
| Motion | No element pops in fully formed or slides at constant speed; springs settle |
| Cuts | Twelve-frame strips around every cut show no flash of the old scene, blank frames or jumps |
| Readability | Every message line is readable at phone width (360 px) |
| Determinism | Rendering the same time twice gives identical frames |
| Loop seam | For loops, the last frame flows into the first with matching position and velocity |
| Honesty | Captions and numbers match their sources; illustrative data is labelled |

Then score and fix with the critique loop in [award craft](../../award-craft/SKILL.md).

## Formats

Write scenes against a layout function and render 16:9, 1:1, 4:5 and 9:16 from the same timeline, recomposing type and framing for each format instead of cropping. Social platforms autoplay muted: the story must read without sound.
