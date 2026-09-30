# Canvas behaviour of lvgl.espboards.dev

Measured on the live editor (v1.4.0, September 2026) by using it and by reading
the behaviour of its public bundle. This is a **specification of behaviour**:
constants, rules, and order of operations. No code is copied; we implement our
own versions in framework-free modules with Vitest tests (`snapping.ts`,
`geometry.ts`, `viewport.ts`). Where we deliberately differ, the change is
listed in the "Deviations" table of `ROADMAP.md`.

## 1. Coordinate model

- The device is one element of the real display size (e.g. 320 × 240 px). Pan
  and zoom are a single CSS `transform: translate(panX, panY) scale(zoom)` on
  it, transform-origin centre. Everything drawn on it (widgets, overlay) lives in
  **display pixels**, not percentages.
- The overlay layer sits on top (`z-index: 100`, `pointer-events: none`); only
  handles and hit strips re-enable pointer events.
- Every overlay measure is divided by `zoom` so it keeps its **screen size**:
  outline `1/zoom` px, handle `8/zoom` px, chip font `9/zoom` px, chip offset
  `9/zoom` px.
- Pointer → display coordinates: `(clientX − canvasRect.left) / zoom`.
- Zoom range **0.25×–5×**.

## 2. Selection overlay

| Part | Measure |
|---|---|
| Outline | 1 px solid `#2196f3`, offset 0, hugging the true bounds |
| Hover outline | 1 px **dashed** `rgba(33,150,243,.6)`, offset 2 px |
| Handles | 8 white squares 8 px, 1 px `#2196f3` border, 1 px radius, soft shadow; 4 corners + 4 edge midpoints |
| Hit areas | edges: full-length strips 12 px thick centred on the edge; corners: 20 × 20 px centred on the corner |
| Size chip | pill under the element, `top: calc(100% + 9px)`, 9 px / 600, tabular numbers, dark translucent background, 0.5 px blue border |
| Group chip | `Enter / double-click to edit`, 24 px below a selected group |

Size chip text: `W × H` when both sizes are explicit; for elements with an
intrinsic size (label, icon, checkbox) `auto`, `W × auto`, or `auto × H`;
no chip for other types. Text and icons start as `auto` (sized to their content)
and only get explicit sizes once a resize handle is dragged. In ODL terms:
element size derives from the renderer's measured ink box (ROADMAP 1.6) until the
user sets a size.

## 3. Placing from the library

- Drag from the library: the element's **top-left corner lands at the drop
  point**, grid-rounded (not centred), clamped into the working area, and snapped
  to a canvas edge within 4 px.
- Click adds at a default position of the current parent.

## 4. Moving

Per pointer-move, in this order, all in display pixels:

1. `position = pointer − grabOffset` (offset taken at pointer-down).
2. **Grid rounding** to 5 px. If snapping is off, or **Ctrl/Cmd is held**, the
   step is 1 px and *no other snapping* happens for that move.
3. **Edge magnet** (canvas bounds inset by padding): within **8 px** of an edge
   the item snaps to it and *sticks* while the pointer stays within that range.
   Moving away releases it; pushing further into the wall accumulates and
   releases after **12 px**. X and Y are independent.
4. **Alignment candidates**, X and Y independently, each yielding a snapped
   value, a distance and guide lines:
   - *Siblings* (threshold **5 px**): own left/right/centre-X against every
     other sibling's left/right/centre-X (left↔left, right↔right, left↔right,
     right↔left, centre↔centre); same for Y with top/bottom/centre-Y. Only
     siblings intersecting the visible canvas count. The guide spans from the
     nearest to the farthest of the two elements.
   - *Canvas centre* (threshold **8 px**): own centre against the canvas centre
     lines; guide spans the whole canvas. Its distance is reduced by 2 so it wins
     ties against siblings.
   - *Equal spacing* (threshold **8 px**, needs ≥ 2 siblings): position that
     centres the item in a gap between two neighbours (gap ≥ item size), or
     continues an existing gap to the left/right / above/below. No guide line.
   The candidate with the smallest distance wins per axis; every guide whose
   snapped value equals the winner (±0.5 px) is drawn.
5. **Clamp** into the working area (`padding … size − item − padding`).
6. **Spacing badges** (≥ 2 siblings): when the gap on both sides of the item
   equals within 3 px, draw both distances as small labels between elements.

Guides are **magenta dashed** lines (see the reference screenshot): a vertical
line through the canvas centre and a horizontal line through a sibling's centre.

Dragging outside the parent re-parents into the container under the pointer
(phase 5). Alt-less drag past a container edge leaves it.

## 5. Resizing

- Handle drag delta / `zoom`. West/north handles move the origin so the
  **opposite edge stays fixed**.
- **Shift** keeps the aspect ratio: corner handles follow the axis with the
  larger relative change; edge handles derive the other dimension.
- Minimum **10 px**; maximum up to the container edge (for W/N handles up to the
  original opposite edge).
- Sizes round to **5 px** unless **Alt** is held.
- Edge snap to container bounds within **4 px** with a guide on the edge; off
  with Shift or Alt, and in flex/grid parents.
- Only the dragged axis becomes explicit; the other stays `auto` unless Shift
  ties them.
- Icons scale their glyph size by the mean of both scale factors, clamped 8–48.
- Groups scale their children proportionally (phase 7).
- The gesture is one history step, labelled `resize`.

## 6. Keyboard

Ignored while focus is in an input/textarea/contenteditable.

| Key | Action |
|---|---|
| Arrows | nudge 1 px; **Shift** 5 px; result clamped to −size … 2×size (may leave the canvas); a burst of nudges is **one history step** (300 ms debounce) |
| `Esc` | cancels a drag/resize in progress; exits group; deselects |
| `Enter` | enters the selected group |
| `Del`/`Backspace` | delete |
| `Ctrl+C/X/V/D` | copy, cut, paste, duplicate |
| `Ctrl+G` / `Ctrl+Shift+G` | group / ungroup |
| `Ctrl+Z`, `Ctrl+Shift+Z` / `Ctrl+Y` | undo, redo |
| `Ctrl+S`, `Ctrl+E`, `Ctrl+I`, `Ctrl+P` | save, export, import, preview |
| `Ctrl` + `+` / `-` / `0` | zoom in / out / fit-or-100 |

## 7. Viewport

- **Wheel pans** by default (`deltaX`, `deltaY`); **Ctrl/Cmd + wheel zooms**
  toward the cursor. When the `Pan` toggle is off, the wheel zooms.
- Zoom step per wheel event is exponential: `exp(−deltaY · k)` with
  `k = 0.0032 · (1 + min(1.2, |deltaY| / 120))`; line/page delta modes are
  normalised. The point under the cursor stays fixed.
- Pan by **middle button**, **Space + drag**, or **Ctrl + drag**; with the `Pan`
  toggle off, plain left-drag on empty space also pans. Touch: one finger pans,
  two fingers pinch-zoom around the midpoint.
- Zoom buttons: `−` ÷1.2, `+` ×1.2, presets 0.5 / 1 / 2 / 3, `Reset` (1×, no
  pan), `Fit` (`0.95 × min((viewW − 32) / W, (viewH − 32) / H)`; pressing it
  again when already fitted returns to 100 %).

## 8. Toolbar toggles

`Pan`, `Snap`, `Dots`. `Snap` switches grid rounding **and** all guide snapping;
`Dots` only draws the grid dots (drawn on the display, one dot per snap step).

## 9. History

Every completed gesture is one step with a semantic label (`moved button`,
`resized`, `set radius`); a dropdown next to undo/redo lists them and jumps.

## 10. What we keep different

- Grid step is the dashboard's `snapSize` (configurable), not a fixed 5 px.
- Guide colours use theme tokens except the magenta guides, which stay fixed for
  contrast on any canvas colour.
- Sizes are ODL element sizes; `auto` comes from `odl-renderer` measurement.
