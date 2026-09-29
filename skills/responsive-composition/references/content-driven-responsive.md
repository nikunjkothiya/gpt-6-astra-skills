# Content-Driven Responsive Implementation and Verification

Use this reference when choosing layout transitions or checking a design across changing space. Start from actual content failures and the task's invariants. Device names are useful test labels but do not explain a breakpoint.

## Derive the first layout change

Consider a product inspector with a visual region and a details panel. Suppose trial composition with the real labels requires roughly 28rem for useful object framing, 20rem for readable details, and a 2rem gap. This suggests testing a side-by-side transition near 50rem of module space. It does not establish 50rem as a standard breakpoint.

Use a query container outside the element whose columns change, so the module responds to its allocated width. A surrounding application rail may make it narrow even in a large viewport. The base arrangement remains usable when container queries are unavailable.

```html
<div class="inspector-region">
  <section class="inspector" aria-labelledby="inspector-title">
    <div class="inspector-visual"><!-- Object view and equivalent controls --></div>
    <div class="inspector-details">
      <h2 id="inspector-title">Inspect the current configuration</h2>
      <!-- Selected part, real dimensions, choices, and primary action -->
    </div>
  </section>
</div>
```

```css
.inspector-region {
  container: inspector-region / inline-size;
}

.inspector {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
}

.inspector > * { min-inline-size: 0; }
.inspector-details { overflow-wrap: anywhere; }

@container inspector-region (min-width: 50rem) {
  .inspector {
    grid-template-columns: minmax(0, 1.4fr) minmax(20rem, 1fr);
    gap: 2rem;
  }
}
```

The query changes descendants of the named container. Size containment needs a size supplied by layout context; inspect sizing if using the module in intrinsically sized or shrink-to-fit parents. See [MDN's container-size guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_size_and_style_queries) and [`container-type`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/container-type).

Tune the example with the actual object, loaded font, translated labels, and enclosing padding. The visual region also needs a deliberate height or aspect ratio appropriate to its content. Do not impose a large square canvas if it pushes the only useful action far below a short landscape viewport.

## Preserve reading and task relationships

Write the DOM in a sensible reading order first. A visual split does not justify a disconnected focus sequence. If a narrow view requires details before a large visual, decide the shared source order and positioning deliberately, or use a task-specific presentation whose semantics remain coherent.

For comparisons, test the decision itself: can a person compare the same attribute across candidates without remembering values from distant panels? A compact table with a labeled local horizontal scroll region may preserve that relationship. Announce and visually indicate overflow where needed; avoid hiding the document's overflow to conceal an oversized child.

Give long product names, unbroken identifiers, and user-authored text an explicit treatment. Wrap prose; break identifiers where appropriate; preserve amounts and units; provide access to full meaningful labels. A blanket truncation utility can remove exactly the information needed to distinguish products.

Persistent controls need measured space. Verify that sticky actions do not cover errors, focused fields, or the last content row. Reserve corresponding space when necessary and adapt or release the sticky region when available height is insufficient.

For mobile stages, distinguish a stable small-viewport height (`svh`) from the currently available dynamic height (`dvh`); choose according to whether browser-chrome movement should resize the scene. Keep a usable fallback for unsupported targets. Safe-area insets belong in the measured padding of edge controls. Opening the software keyboard can change the visible region without behaving like an ordinary layout resize: inspect focused fields and release obstructive sticky elements when needed. Recompute scroll bounds after meaningful layout changes, and avoid rebuilding a pinned timeline on every transient chrome movement. See [viewport units](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length#relative_length_units_based_on_viewport), [environment insets](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env) and the [Visual Viewport API](https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API). Test rotation, short landscape height, keyboard open/close and back navigation with preserved selection/progress.

## Account for the actual spatial viewport

Maintain distinct rectangles for the canvas, unobstructed object view, and DOM controls. If a details overlay covers the bottom of a canvas, its pixels still belong to the canvas but are unavailable for meaningful object framing.

For a rectangular scene container, compute a usable region from measured edges and current overlays. Pass that region to camera fitting and annotation placement; do not guess its width from a device label. Account for both dimensions and any deliberately protected visual margin. A tall narrow region and a short wide region can demand different views of the same object.

On resize or panel change:

1. Keep selected identity and configuration in task state.
2. Recompute layout and usable region from actual measurements.
3. Derive camera and annotation targets from that state and region.
4. Retarget any presentation transition from its current pose.

Use [camera composition](../../camera-composition/SKILL.md) for projection and fit. Decreasing rendering resolution is a separate performance choice; it does not repair poor subject framing.

## Use a compact evidence matrix

Choose cases that expose a real constraint. Typical coverage for this inspector is:

| Case | Stress introduced | Evidence to inspect |
| --- | --- | --- |
| Reference wide view | Intended composition | Focal subject, rails, text measure, action location |
| Just below and above the measured transition | Layout handoff | No collision, stranded labels, abrupt loss of subject scale, or changed selection |
| Narrow available region inside a wide shell | Component constraint | Module responds to allocated space |
| Short landscape view with details open | Limited height | Object and essential controls remain reachable |
| Long title and longest supported labels | Content pressure | No hidden distinguishing text or unusable control wrapping |
| Enlarged text and zoom | Readability and reflow | Full task, meaningful order, reachable focus, no unintended document overflow |
| Pointer, keyboard, and touch path | Input differences | Equivalent actions without relying on hover or precise dragging |
| Reduced motion, independently of quality | Motion requirement | Same information and target states with an appropriate transition |

When WCAG 2.2 AA is the target, include text enlargement to 200% and the relevant reflow test at 320 CSS pixels for vertically scrolling content. Content that inherently requires two dimensions has specific exceptions; surrounding controls still need usable reflow. A narrow screenshot alone does not verify text enlargement. See [WCAG 2.2 resize text and reflow](https://www.w3.org/TR/WCAG22/#resize-text) and [W3C's reflow explanation](https://www.w3.org/WAI/WCAG21/Understanding/reflow).

Record viewport, module width, zoom, content case, input, state, and observed result. Capture the failure before changing it when that helps compare. Fix the rule responsible and rerun the affected transition and task. Avoid an exhaustive device matrix when it provides no additional evidence about the design's constraints.
