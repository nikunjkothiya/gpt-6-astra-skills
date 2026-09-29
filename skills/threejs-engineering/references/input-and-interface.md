# Canvas input and interface integration

Read for product inspection, object selection, dragging, orbit controls, DOM annotations, or a canvas embedded in a scrolling page. Establish the task and semantic states through the interaction specialist before assigning gestures.

## Resolve pointer coordinates in the canvas frame

For an axis-aligned canvas, calculate normalized device coordinates from the canvas's current client rectangle. Window dimensions, drawing-buffer pixels, and event offsets from nested DOM targets are different frames.

```js
export function canvasNdc(event, canvas, out) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;
  out.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  );
  return true;
}
```

Then update camera/object world matrices if querying before the render, call `raycaster.setFromCamera(ndc, camera)`, and intersect the deliberate pick set. Map mesh or instance hits to a stable product part ID. Visual decoration, glass, and labels need an explicit policy about whether they block a selectable subject. A proxy hit shape may enlarge a tiny control without changing its visible geometry. [Raycaster](https://threejs.org/docs/pages/Raycaster.html)

The rectangle formula does not invert an arbitrary CSS rotation or skew. Avoid those transforms on the interactive canvas or convert through the appropriate DOM transform. Treat scissor viewports as their own coordinate allocations.

## Define gesture ownership

Use a small state machine: idle, pending press, object drag, camera gesture, settling. A press becomes a click only if its movement and cancellation conditions remain within the intended threshold. Derive that threshold in CSS pixels for the input and task; a tiny drag must not accidentally activate a purchase or open a panel.

On object drag start, acquire pointer capture and disable competing camera manipulation. Convert pointer motion into a constraint: ray-plane intersection, projected axis, hinge angle, or a surface path. Keep the initial grab offset so the part does not jump to its origin under the pointer. Clamp against functional limits in the part's local frame. For nearly parallel ray-plane or ray-axis configurations, retain the last valid pose or switch to a defined projected control.

Release capture and ownership on pointer up, pointer cancel, lost capture, unmount, and explicit cancellation. Restore the prior camera policy. Avoid treating every capture loss as a successful commit. Specify whether cancellation restores the initial value or keeps the last valid value; update DOM state accordingly. A captured pointer can leave the canvas, so cleanup must remain correct outside its bounds.

Choose touch behavior intentionally. A product viewer in an ordinary page may preserve vertical page scrolling and use explicit rotate controls or a focused inspection mode. A dedicated two-axis manipulation region may own those gestures. Apply `touch-action` only to the region that owns the gesture; do not disable normal scrolling across the whole page to simplify the canvas. Passive versus active event listeners must match whether default behavior is actually prevented.

## Coordinate camera and object motion

Orbit controls own the camera only while permitted. Disable or hand off them during an authored camera transition; update their target coherently before returning control. Configure useful distance and angular bounds from the object and task. Auto-rotation should pause for inspection, respect reduced motion, and resume only under the declared policy. Damping and auto-rotation may require frame updates after pointer release. [OrbitControls](https://threejs.org/docs/pages/OrbitControls.html)

Selection and manipulation are separate operations. A user should be able to select a part without accidentally rotating the assembly. Prefer a stable scene root for the product, functional pivots for articulation, and a distinct presentation group for whole-object orientation.

## Keep the interface meaningful

Represent product configuration, named views, part selection, and assembly progress in semantic DOM controls. Buttons and ranges should drive the same application actions as canvas gestures. Provide a text or image equivalent for essential information; keyboard users need a way to finish the task. Keep the selected item understandable even when the canvas is unavailable.

Project annotations from a known world anchor through the camera, then into the overlay container's CSS coordinates. Account for container offset, canvas inset, and scroll. Hide, clamp, or replace labels behind the camera or outside the useful region. Choose an occlusion policy; a screen-space annotation does not inherently know that another part covers its anchor.

Let decorative overlays pass pointer events while their actual controls receive them. Avoid a broad transparent overlay that steals canvas input. Conversely, DOM controls must not accidentally start a canvas drag through shared event listeners.

Validate press versus drag, drag outside bounds, canceled touch, fast consecutive selection, keyboard operation, a scrolling mobile page, DOM controls over the scene, and camera movement while a part is selected.
