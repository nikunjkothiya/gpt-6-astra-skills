# React Three Fiber integration

Read only when the host uses React Three Fiber. Check the installed React, Fiber, Drei, and Three.js versions and their peer requirements. The published stable and `/next/` documentation can differ in scheduling, event behavior, and renderer lifecycle; follow the branch matching the package lockfile.

## Divide declarative and continuous state

Use React state for product intent and discrete UI state. Use scene refs and the Fiber frame callback for continuous transforms. Keep one owner for each property: a JSX position prop, drag handler, and independent animation library must not all write the same position. Subscribe to only the state needed by a component and reuse vectors in hot paths.

`useFrame` participates in Fiber's rendering loop. Do not create an additional renderer animation loop inside a child. React rerenders are inappropriate as a per-frame animation mechanism. A custom rendering callback that takes over rendering also owns the full render pipeline it replaces. Check the installed `useFrame` signature and priority semantics. [Fiber hooks](https://r3f.docs.pmnd.rs/api/hooks)

## Make demand rendering complete

For scenes that settle, use `frameloop="demand"`. Mutating a Three.js object imperatively does not itself notify React. Call `invalidate()` when input or a loaded asset changes the scene and request further frames while a transition remains active. Fiber coalesces invalidations; they request a future frame rather than rendering synchronously. Controls and external animation libraries must participate in this scheduling. Drei controls may already provide the needed invalidation. [Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)

For an animation started from a long idle interval, establish its initial visible pose and time origin deliberately. Do not let a stale clock delta jump past the first meaningful movement. Ensure the exact endpoint is rendered before becoming idle. Reduced motion should reach the valid application state and still invalidate that final render.

## Respect event semantics

Fiber raycasting can send a pointer event to more than one intersected object. Use `stopPropagation()` when the selected interaction should exclude objects behind it. Pointer capture is accessed through the event target, and its semantics differ from DOM capture; verify multi-pointer support in the installed major version. [Fiber events](https://r3f.docs.pmnd.rs/api/events)

Handle release, cancel, lost capture, and unmount. If object dragging owns the gesture, coordinate camera controls accordingly. Shared DOM/canvas event sources need consistent coordinate computation; a nested overlay can change `offsetX`/`offsetY`. Prefer client coordinates relative to the canvas region when appropriate, as described in the input reference.

## Respect cache and disposal ownership

Declaratively created scene resources generally follow Fiber's disposal lifecycle. A `primitive` carrying an external object needs an explicit owner; do not assume it disposes that object on unmount. A Three.js object can have only one parent, so render multiple instances through suitable clones or instancing. Shared cached geometries and materials still need a common lifetime policy. Use `dispose={null}` only when a separate owner actually manages those resources. [Objects and disposal](https://r3f.docs.pmnd.rs/api/objects)

Treat cached loader results as shared. Clone the material for a per-instance appearance change, preserving an owner that later disposes it. Do not dispose a cache entry while another live instance uses it. Effects that construct controls, listeners, or subscriptions must clean them up correctly through repeated mount/cleanup cycles.

Use Suspense/loading feedback and an error boundary at a useful product boundary. Keep the DOM's essential content available while assets load. Handle unsupported rendering and recovery without trapping the user in an empty canvas. Confirm custom renderer ownership against the installed Canvas API. [Canvas configuration](https://r3f.docs.pmnd.rs/api/canvas)

Verify a prop change during animation, rapid selection, multiple instances of a cached asset, remount, a decoder failure, idle settling, and the host's development lifecycle. Observe actual rendering after an imperative update; a correct value in a ref does not establish that a new frame appeared.
