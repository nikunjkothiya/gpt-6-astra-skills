# Canonical poses and transform implementation

Read when an articulated or exploded object must return exactly, accept repeated input, or survive regeneration. The relationships are engine independent; the examples use Three.js with positive uniform ancestor scale and default matrix updates.

## Store relationships in their actual frames

For an attachment, let `W_receiver` be the receiver's world transform and `L_attachment` the attachment frame relative to that receiver. The required world frame is `W_receiver * L_attachment`. If the moving part remains under another parent, its local frame is `inverse(W_parent) * W_receiver * L_attachment`. A part's own mating frame may require an additional inverse offset. These matrices compose from right to left for column vectors.

Do not infer the assembled pose from a currently exploded mesh. Capture or derive rest after dimensional construction, before animation. Keep private snapshots or immutable numeric values rather than references to mutable position/quaternion objects. Recompute all dependent rest poses together when construction parameters change.

For a reparent operation that preserves world pose, update ancestor and child matrices first. Three.js `attach` supports this operation but does not support graphs with nonuniformly scaled nodes. An arbitrary local matrix containing shear cannot always be decomposed into a faithful position/quaternion/scale transform. Preserve a full matrix deliberately or revise the hierarchy. [Object3D](https://threejs.org/docs/pages/Object3D.html)

## Use a functional pivot

A small group gives a stable pivot across Three.js revisions. Its origin belongs at the hinge. Offset visible geometry inside it, then rotate the group. Express the axis in the pivot's local frame.

```js
import * as THREE from 'three';

export function createHingedPart(mesh, parent, hingePosition, meshOffset) {
  const pivot = new THREE.Group();
  pivot.position.copy(hingePosition);
  mesh.position.copy(meshOffset);
  pivot.add(mesh);
  parent.add(pivot);
  const rest = pivot.quaternion.clone();
  const axis = new THREE.Vector3(0, 0, 1);
  const turn = new THREE.Quaternion();
  return {
    pivot,
    setAngle(radians) {
      // Caller constrains the angle to the mechanism's valid range.
      turn.setFromAxisAngle(axis, radians);
      pivot.quaternion.copy(rest).multiply(turn);
    },
  };
}
```

Here the caller supplies geometry with the intended local orientation. For a rectangular leaf whose hinge is its left edge, a mesh centered on its geometry may need an offset of half its width along local X. A imported asset's existing origin or transform needs deliberate conversion first. Geometry position, pivot placement, and rest orientation together determine the final placement.

## Derive an exploded pose from rest

This complete module implements one translation track and a reusable interval map. The displacement is in the object's parent frame. It deliberately does not perform collision detection, retarget time, or silently handle a changed parent. Use one track owner for each controlled object.

```js
export function intervalProgress(progress, start, end) {
  if (![progress, start, end].every(Number.isFinite) || !(end > start)) {
    throw new RangeError('Progress must be finite and interval must have positive length');
  }
  return Math.max(0, Math.min(1, (progress - start) / (end - start)));
}

export function createTranslationTrack(object, displacement) {
  const parent = object.parent;
  const rest = {
    position: object.position.clone(),
    quaternion: object.quaternion.clone(),
    scale: object.scale.clone(),
  };
  const offset = displacement.clone();
  return function apply(progress) {
    if (!Number.isFinite(progress)) throw new RangeError('Finite progress required');
    if (object.parent !== parent) throw new Error('Rebuild track after changing parent');
    const p = Math.max(0, Math.min(1, progress));
    object.position.copy(rest.position);
    if (p !== 0) object.position.addScaledVector(offset, p);
    object.quaternion.copy(rest.quaternion);
    object.scale.copy(rest.scale);
  };
}
```

For a removable lid and an internal module, assign intervals so the lid clears the module's path before module movement starts. Each render computes both tracks from the same normalized sequence progress. Backward traversal then restores held and moving poses consistently. Choose the intervals from clearance and explanation requirements, not a generic stagger value.

If a path has an extraction leg followed by a presentation leg, represent both relative to canonical frames and preserve continuity at their boundary. For rotation, ordinary pose blending may use quaternion interpolation; a threaded action must preserve explicit accumulated turns and axial lead. Use the assembly specialist to decide the valid path before choosing interpolation.

## Check invariants with useful tolerances

Compare canonical local position, quaternion orientation, and scale after repeated full cycles. Compare quaternion orientations using `2 * acos(min(1, abs(dot(q1, q2))))` for normalized quaternions; opposite quaternion signs can represent the same orientation. Compare attachment frames in the same space, and define position tolerance relative to object scale and the visual or mechanical claim.

Exercise arbitrary progress in forward and backward order; the same progress should reproduce the same authored pose. Move the receiver parent, repeat the operation, and inspect attached children. Change a dimension and rebuild dependent tracks; stale tracks should be detected or replaced. Tests for canonical return do not establish swept clearance or physical fit, which need separate evidence.
