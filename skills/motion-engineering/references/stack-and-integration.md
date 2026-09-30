# Stack and integration

Setup code for the motion stack in [motion engineering](../SKILL.md). The install commands and import map below illustrate a pinned setup, not a claim of current releases. Verify package availability, APIs and licenses before adoption; preserve the project's installed versions where suitable.

## Install

```text
npm i gsap@3.15.0 lenis@1.3.26
npm i @gsap/react@2.1.2 motion@13.4.6
```

Check the installed GSAP package for required plugin imports and verify its current license for the intended use. Use either Lenis or ScrollSmoother, never both.

## Canonical vanilla setup

One module owns smooth scrolling, the ticker and the reduced-motion switch for the whole page.

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

export function initMotion({ smooth = true, lerp = 0.1 } = {}) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lenis = null;
  let destroyed = false;
  let locks = 0;
  let savedOverflow;
  const tick = time => lenis?.raf(time * 1000);

  function start() {
    if (!smooth || reduce.matches) return;
    lenis = new Lenis({ autoRaf: false, lerp, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (locks > 0) lenis.stop();
  }

  function stop() {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  }

  const onPreferenceChange = () => {
    stop();
    start();
    ScrollTrigger.refresh();
  };

  start();
  reduce.addEventListener('change', onPreferenceChange);
  document.fonts.ready.then(() => { if (!destroyed) ScrollTrigger.refresh(); });

  return {
    get lenis() { return lenis; },
    lock() {
      if (destroyed) return;
      if (locks++ === 0) {
        savedOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        lenis?.stop();
      }
    },
    unlock() {
      if (locks === 0 || --locks > 0) return;
      document.documentElement.style.overflow = savedOverflow;
      lenis?.start();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (locks > 0) document.documentElement.style.overflow = savedOverflow;
      locks = 0;
      reduce.removeEventListener('change', onPreferenceChange);
      stop();
    },
  };
}
```

- `lenis.raf` expects milliseconds; the GSAP ticker passes seconds.
- `lagSmoothing(0)` is a page-wide decision; set it once here, not in components.
- Pair each `lock()` with one `unlock()` while a dialog or menu is open. Native overflow is locked too, including when smoothing is disabled. Mark nested scroll areas (menus, dialogs, code blocks, maps) with `data-lenis-prevent`, and verify scroll locking on the target mobile browsers.
- Leave `smooth` off for applications, long reading pages and forms; native scrolling is the better default there.

Component animations then live in their own contexts:

```js
import gsap from 'gsap';

export function initReveals(root = document) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray('[data-reveal]', root).forEach(element => {
      gsap.from(element, {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: element, start: 'top 85%', once: true },
      });
    });
  });
  return () => mm.revert();
}
```

## React and Next.js

Keep content server-rendered and put motion in narrow client components. Per-frame values live in refs or GSAP, never in React state.

```tsx
'use client';

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis, useLenis, type LenisRef } from 'lenis/react';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

const query = '(prefers-reduced-motion: reduce)';

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    notify => {
      const media = window.matchMedia(query);
      media.addEventListener('change', notify);
      return () => media.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => true,
  );
}

function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (reduced) return;
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [reduced]);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1, smoothWheel: !reduced, anchors: reduced ? { immediate: true } : true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
```

Scoped GSAP inside a component, reverted automatically on unmount:

```tsx
'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function RevealGroup({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-reveal]', {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: scope.current, start: 'top 80%', once: true },
      });
    });
    return () => mm.revert();
  }, { scope });
  return <div ref={scope}>{children}</div>;
}
```

For fresh forward navigations where a reset is desired, reset scroll and measurements. Let the router restore back/forward positions and hash targets; do not mount this unconditional example over a router's restoration policy:

```tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';

export function RouteMotionReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    if (!lenis) window.scrollTo(0, 0);
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname, lenis]);
  return null;
}
```

Motion for React covers component-level motion: presence, layout and gestures.

```tsx
'use client';

import { AnimatePresence, MotionConfig, motion } from 'motion/react';

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function Panel({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.42, ease: easeOutExpo } }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.24, ease: [0.5, 0, 0.75, 0] } }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
```

Use `layout` for size and position changes, `layoutId` for shared elements between two components, and `transition={{ type: 'spring', stiffness: 320, damping: 28 }}` for snappy UI springs.

## Astro

With Astro's client router, pages swap without a full reload, so motion must be torn down and re-created per page. Confirm event names against the installed Astro major version.

```astro
<script>
  import { initMotion } from '../scripts/motion.js';
  import { initReveals } from '../scripts/reveals.js';

  let motion;
  let reveals;

  document.addEventListener('astro:page-load', () => {
    motion = initMotion();
    reveals = initReveals();
  });

  document.addEventListener('astro:before-swap', () => {
    reveals?.();
    motion?.destroy();
  });
</script>
```

Without the client router, run the initializers once on load.

## Vue and Nuxt

```js
import { onMounted, onBeforeUnmount, ref } from 'vue';
import gsap from 'gsap';

export function useReveal() {
  const root = ref(null);
  let ctx;
  onMounted(() => {
    ctx = gsap.matchMedia();
    ctx.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-reveal]', { autoAlpha: 0, y: 24, duration: 0.8, ease: 'expo.out', stagger: 0.06 });
    }, root.value);
  });
  onBeforeUnmount(() => ctx?.revert());
  return root;
}
```

Create the Lenis instance in a client-only plugin and destroy it on app unmount.

## Svelte and SvelteKit

```js
import { onMount } from 'svelte';
import { afterNavigate } from '$app/navigation';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initMotion } from '$lib/motion.js';

onMount(() => {
  const motion = initMotion();
  return () => motion.destroy();
});

afterNavigate(() => ScrollTrigger.refresh());
```

## No build step

For a single HTML file, use an import map with pinned versions:

```html
<script type="importmap">
{
  "imports": {
    "gsap": "https://esm.sh/gsap@3.15.0",
    "gsap/ScrollTrigger": "https://esm.sh/gsap@3.15.0/ScrollTrigger",
    "gsap/SplitText": "https://esm.sh/gsap@3.15.0/SplitText",
    "lenis": "https://esm.sh/lenis@1.3.26"
  }
}
</script>
<link rel="stylesheet" href="https://esm.sh/lenis@1.3.26/dist/lenis.css">
<script type="module" src="./motion.js"></script>
```

Self-host the files for production to avoid a third-party dependency at runtime.

## ScrollTrigger essentials

| Setting | When |
| --- | --- |
| `once: true` | Entrances that should not replay |
| `scrub: true` or a number (0.3–0.8) | Scroll-linked progress; a number adds catch-up smoothing |
| `pin: true`, `pinSpacing` (default true) | Pinned stories; keep spacing so following content does not jump |
| `anticipatePin: 1` | Reduces a visible jump when pinning starts on fast scroll |
| `invalidateOnRefresh: true` | Values derived from layout (widths, distances) |
| `fastScrollEnd: true` | Forces active animations to finish when the user flicks past |
| `ScrollTrigger.batch()` | Many similar items entering together |
| `ScrollTrigger.config({ ignoreMobileResize: true })` | Avoid refreshes when mobile browser bars show or hide |
| `markers: true` | Development only |

Create triggers top to bottom in document order, or set `refreshPriority`, so pin spacing is computed in the right sequence.

## Performance

- Promote layers only while animating: set `will-change: transform` just before and remove it after; never on hundreds of elements.
- Use `gsap.quickTo()` or `quickSetter()` for pointer-driven values instead of creating a tween per event.
- Decode images before revealing them (`await image.decode()`), so the reveal never shows a blank frame.
- Long pages: `content-visibility: auto` with `contain-intrinsic-size` on offscreen sections, except where anchors or pinned measurements depend on them.
- Keep scroll handlers free of layout reads; let ScrollTrigger cache positions.
- Test on a mid-range Android phone or a throttled CPU profile; desktop smoothness proves little.

## Cleanup checklist

- [ ] Every `gsap.context()`, `gsap.matchMedia()` and `useGSAP()` scope reverts on unmount or page swap.
- [ ] ScrollTriggers created outside contexts are killed explicitly.
- [ ] SplitText instances are reverted; original text is restored.
- [ ] Lenis is destroyed and removed from the ticker.
- [ ] Observers disconnect; listeners are removed; animation frames are cancelled.
- [ ] Remounting the page twice leaves no duplicate triggers (`ScrollTrigger.getAll().length` stays constant).
