# ROADMAP — OpenDisplay Studio editor

The complete plan for turning the current editor into a clone of the ESPboards
LVGL Designer (https://lvgl.espboards.dev/) that produces OpenDisplay Language.
Phases are ordered; each lists what we add, how it must behave, and how it is
accepted. Rules for *how* to build are in [`CLAUDE.md`](CLAUDE.md).

Tick a step's box in the same change that completes it.

## Starting point (September 2026)

- Lit panel: the `ods-app` shell and one element per area (see 1.1) + Python
  backend rendering with `odl-renderer` 0.5.13. The backend PNG is the canvas image.
- Dashboard gallery, New dashboard dialog, Design/Code views, undo/redo, pan and
  zoom, snap, 8 resize handles, flat layer list with hide/lock/delete/reorder.
- 8 of 16 ODL types (`text`, `rectangle`, `line`, `circle`, `ellipse`, `icon`,
  `qrcode`, `progress_bar`), each with a reduced field set, no expressions.
- One semantic widget (`temperature`).

## Phase overview

| # | Phase | Depends on |
|---|---|---|
| 0 | Vocabulary: Projects → Dashboards | — |
| 1 | Foundations (element split, strings, commands, definitions, document model) | 0 |
| 2 | LVGL shell and density | 1 |
| 3 | Expressions | 1 |
| 4 | All 16 ODL primitives | 1, 3 |
| 5 | Structure tree, containers, groups | 2 |
| 6 | Context menus, clipboard, keyboard shortcuts | 5 |
| 7 | Group scaling and responsive layout | 5, 6 |
| 8 | Widget platform (package format, sources, SDK, dynamic loading) | 1, 2, 3 |
| 9 | Widget catalog (Sensor card, Agenda, Weather, …) | 8 |
| 10 | Finishing | all |

Phases 3 and 5 may run in parallel once phase 2 has landed the inspector shell.
Phase 8 may start in parallel with phases 4–7.

---

## Phase 0 — Vocabulary: Projects → Dashboards (done)

We design and manage **Dashboards**; the old word no longer appears in code,
storage keys, WebSocket commands, tests, or docs (exempt: `pyproject.toml` and
its `[project]` table, `package-lock.json`, `playwright.config.ts`, whose
`projects` key is imposed by Playwright, and the policy files `CLAUDE.md` /
`ROADMAP.md`).

- [x] **0.1 Backend rename.** Module, store, errors, compile and validate
  functions, limits, locals and log messages use `dashboard`.
- [x] **0.2 Storage.** No migration: the dashboard model is pre-release and its
  shape still changes (flat list → tree). New key `opendisplay_studio.dashboards`,
  `STORAGE_VERSION = 1`, document `schemaVersion = 1`. Data saved by earlier
  builds under the old key is never read; it can be deleted from `.storage`.
- [x] **0.3 WebSocket API.** `create_dashboard` / `update_dashboard` /
  `delete_dashboard`, payload keys `dashboard` / `dashboard_id`, bootstrap
  returns `dashboards`, error code `invalid_dashboard`. Backend and frontend
  ship together, no aliases.
- [x] **0.4 Frontend rename.** Type `Dashboard`, state, CSS classes, dev
  harness, e2e specs.
- [x] **0.5 Guard.** `tests/test_vocabulary.py` scans the source tree and file
  names and fails on the forbidden word.

**Accepted when:** the guard test passes and all backend and frontend tests are
green. (Met.)

---

## Phase 1 — Foundations

- [x] **1.1 Split the panel into elements** (behaviour unchanged, existing e2e
  green). Elements, one per file, tag `ods-<name>`: `ods-app` (shell, owns
  dashboards, open dashboard, selection, history, viewport), `ods-gallery`,
  `ods-new-dashboard-dialog`, `ods-header`, `ods-library`, `ods-canvas`,
  `ods-zoom-bar`, `ods-structure`, `ods-inspector`, `ods-property-field`,
  `ods-context-menu`, `ods-code-view`. The panel tag is now `ods-app`
  (`PANEL_WEB_COMPONENT`). Children get data through properties and report
  intent through the typed events in `events.ts`; only `ods-app` changes the
  dashboard. Pure logic moved to framework-free modules with Vitest tests:
  `history.ts`, `geometry.ts`, `pointer-gesture.ts`, `viewport.ts`,
  `dashboard-ops.ts`, `dashboards.ts`, `item-fields.ts`, `item-labels.ts`,
  `math.ts`. New e2e: `e2e/elements.spec.ts`, one group per element.
- [x] **1.2 Strings module** `strings.ts`; all UI text moves there. One entry
  per concept (field labels are shared by the inspector and the forms); text
  with a value is a function. `strings.guard.test.ts` fails on text written
  inline in templates, attributes, labels, errors or conditions; the hardware
  catalogue in `display-profiles.ts` is data and exempt from the last rule.
- [x] **1.3 Command registry** `commands.ts`: `{ id, label, icon, shortcuts,
  isEnabled(ctx), run(ctx, actions) }`. Undo/redo, delete, hide and lock are in
  it. Buttons (canvas history, layer rows) describe themselves from the registry
  (`commandView`) and fire one `command` event; the keyboard handler in
  `ods-app` dispatches through `commandForKey`. `Del`/`Backspace` now delete the
  selected element (with confirmation).
- [x] **1.4 Primitive definitions.** `primitives/<type>.yml` for the 8 existing
  types (current fields only), a loader (`PrimitiveRegistry`), `bootstrap`
  returning them, one generic backend validator (`normalize`) replacing
  `_validate_primitive_item`, and definition-driven new-item defaults, layout
  fields and appearance form in the panel. The dev harness and the unit tests read
  the real YAML files. Renderer deltas: `docs/odl-coverage.md`.
- [ ] **1.5 Document model.** Value model allows expression strings; items
  may be `container` with `children` (empty until phase 5); item `name`
  (editable, defaults to `<type>_<n>`). `schemaVersion` stays 1 and there is no
  migration until the first public release of the dashboard model (see
  Deviations); stored dashboards that no longer validate are dropped.
- [x] **1.6 Renderer bump** to `odl-renderer` 0.5.13; the bound heuristics
  (`len(value) * size * 0.62`, QR version-1 assumption) are replaced by real
  measurement (`measure.py`: `measure_text` and the rendered ink for text, the
  renderer's own QR parameters for QR codes). The panel's overlay and gesture
  maths take the size of text and QR codes from `itemBounds`.

**Accepted when:** all existing tests pass, a new test proves `itemBounds` of
text equals the ink box of the rendered PNG within 1 px.

---

## Phase 2 — LVGL shell and density

Measured on lvgl.espboards.dev at 1280×800. Colors from HA theme tokens only.

- [ ] **2.1 Header** 48 px: brand, breadcrumb `Dashboards / <name>` (name
  editable inline), center segmented control `Design · Code` (track 2 px padding,
  buttons 25 px high, 11 px/500 text, 6 px radius), right: status chip,
  `Set Ready/Draft`, `Save` (primary).
- [ ] **2.2 Library (left)** 256 px, collapsible to a rail. Search 30 px, 12 px
  text, 8 px radius. Uppercase section labels 11 px/600 with collapse chevron:
  `CONTAINERS` (Container), `TEXT` (Text, Multiline), `SHAPES` (Line, Rectangle,
  Rectangle pattern, Polygon, Circle, Ellipse, Arc), `ICONS & MEDIA` (Icon, Icon
  sequence, Image, QR code), `DATA` (Progress bar, Plot), `TOOLS` (Debug grid),
  `WIDGETS` (semantic widgets). Two-column tiles, 34 px high, icon + 12 px/500
  label, 8 px radius, 6 px gap, 1 px border. Click adds at the canvas center of
  the current parent; drag adds at the drop point.
- [ ] **2.3 Canvas area.** Tab row 29 px (single dashboard tab, name). Tool row:
  history icon, undo, redo left; resolution chip (`800×480`, 10 px, 6 px radius)
  and info button right. Floating pill toolbar top-left: `Pan`, `Snap`, `Grid`
  toggles (25 px buttons, 10 px/500). Zoom % chip top-right. Bottom-centered zoom
  bar 31 px: `−`, `0.5×`, `1×`, `2×`, `3×`, `+`, `Reset`, `Fit`. Help button
  bottom-left. Canvas padding 16 px.
- [ ] **2.4 Right panel** 320 px (resizable 286–560, collapsible). Top:
  **Elements** header (uppercase 11 px, info tooltip, total count badge,
  collapse chevron), search 27 px (6 px radius). Rows 30 px, 6 px radius,
  11 px name + 9 px secondary caption, selected row in primary color. Bottom:
  **Properties** (independently scrollable).
- [ ] **2.5 Properties shell.** Header: type icon tile, element name (13 px/600)
  + type caption, `Hidden` switch right; padding 10 × 14 px. Sections are
  accordions: header 38 px, uppercase 11 px/600, letter-spacing ≈ .045em, icon,
  right-aligned `reset` link (section defaults, one undo step), dot marker when
  non-default. Body padding 0 14 px. Order: `Layout` first, type sections from
  the definition, `Visibility` last. With nothing selected: `Canvas` (display,
  palette, background, padding, snap).
- [ ] **2.6 Field element `ods-property-field`.** Short values: 28 px box,
  label inside at left (10 px, secondary), value 12 px monospace, unit suffix
  inside at right, 7 px radius, 1 px border; paired fields in a 2-column grid
  with 6 px gap (X/Y, W/H, start/end). Long values: label above (11 px/500),
  control below — textarea for text, color dropdown with swatch + name limited to
  the dashboard palette plus valid aliases, font dropdown, icon picker with
  search, 3×3 anchor picker, segmented control for short enums, switch for
  booleans. Inline disclosure rows (`> Advanced`) 22 px. The trailing `{}`
  button is added in phase 3.
- [ ] **2.7 Selection overlay.** Drawn in display pixels on a layer above the
  canvas, with every measure divided by the zoom so it keeps its screen size:
  1 px `#2196f3` outline, 8 px white square handles (1 px blue border) at four
  corners and four edge midpoints, 12 px edge hit strips and 20 px corner hit
  areas, dashed hover outline (offset 2 px), size badge under the element
  (`W × H`; `auto`, `W × auto`, `auto × H` for intrinsic size), live during
  gestures. Details: `docs/design/LVGL_CANVAS_BEHAVIOUR.md`.
> **Priority.** 2.8–2.10 are important but not first: do them after the
> element split (1.1) and the shell/properties work (2.1–2.7) are green and
> tested. They only plug into seams the split creates (`snapping.ts`,
> `viewport.ts`, the canvas element).

- [ ] **2.8 Snapping and guides** (`snapping.ts`, pure, Vitest). While moving,
  in this order: grid rounding to the dashboard snap size; edge magnet 8 px with
  sticky release after 12 px; per-axis candidates — siblings 5 px (edges and
  centres), canvas centre lines 8 px (wins ties by 2 px), equal spacing 8 px —
  smallest distance wins; clamp to the working area. Magenta dashed guides for
  every candidate matching the winner; spacing badges when both gaps are equal
  within 3 px. `Ctrl`/`⌘` held, or the `Snap` toggle off, disables all of it.
  Library drops place the element's **top-left** at the drop point.
- [ ] **2.9 Resize and nudge rules.** West/north handles keep the opposite edge
  fixed; `Shift` keeps the aspect ratio (corners follow the larger relative
  change); minimum 10 px; rounding to the snap size unless `Alt`; edge snap 4 px
  to the container with a guide; only the dragged axis gets an explicit size.
  Arrows nudge 1 px, `Shift` by the snap size (lvgl: 5 px), clamped to −size … 2×size; one burst of
  nudges is one history step (300 ms). `Esc` cancels a drag or resize in
  progress and restores the pre-gesture state.
- [ ] **2.10 Viewport** (`viewport.ts`). Zoom 0.25×–5×; wheel pans, `Ctrl`/`⌘` +
  wheel zooms toward the cursor with exponential steps (`Pan` toggle off: wheel
  zooms); pan with middle button, `Space` + drag or `Ctrl` + drag; touch: one
  finger pans, two pinch; `Fit` = 95 % of the available size minus 32 px and
  toggles back to 100 %; overlay sizes divided by zoom.

**Accepted when:** Playwright visual snapshots of the workspace at 1440×900
match the measurements above (checked by element box assertions, not only
pixels), in HA light and dark themes.

---

## Phase 3 — Expressions

- [ ] **3.1 Value model helpers** (`isExpressionValue` TS + Python) and
  validation: literals checked against the shape, expressions only against length.
- [ ] **3.2 Backend resolution** in `expressions.py`: render each expression field
  with `Template(value, hass).async_render(parse_result=True)`, coerce to the
  field shape, skip the element and add a warning (`<name>.<field>: <message>`)
  on failure. Group/container `visible` evaluated once for the subtree.
- [ ] **3.3 Live refresh.** Collect referenced entities from rendered expressions;
  re-compose the preview (debounced 500 ms) when they change; refresh every
  minute when an expression uses `now()`. Media Source always renders fresh.
- [ ] **3.4 Field UX.** Trailing 24 px `{}` button on every field row (tooltip
  "Expression (or type {)", highlighted when active). Typing `{` in a
  literal field switches to expression mode with `{{  }}`. Expression mode shows a
  monospace auto-growing textarea. Commit on blur; clearing the delimiters
  returns to literal; toggling off restores the definition default.
- [ ] **3.5 Locks.** Expression-driven position fields lock drag, nudge, align, and
  moving any container above the item; the overlay shows a lock badge with the
  reason. Expression-driven size fields disable only the handles that would write them.
- [ ] **3.6 Code view** shows raw expressions; inside containers, expression-driven
  coordinates are emitted as `{{ (<expr>) | float(0) + <offset> }}`.

**Accepted when:** a `text` with `value: "{{ states('sensor.t') }}"` renders the
test entity state; a broken expression produces a named warning and no pixels;
the YAML for an expression-driven `x` inside a container at x=40 is valid and evaluates
to the same absolute position in HA's expression engine.

---

## Phase 4 — All 16 ODL primitives

Each step: definition YAML with every documented field + `visible`, validator
coverage, library tile and icon, correct `itemBounds`, pytest render test with
pixel sampling, e2e add-and-edit test, row in `docs/odl-coverage.md`.

- [ ] **4.1 Complete the existing 8.** `text` (+`font`, `anchor`, `max_width`,
  `spacing`, `stroke_width`, `stroke_fill`, `parse_colors`, `truncate`),
  `line` (+`dash_length`, `space_length`), `rectangle` (+`radius`, `corners`),
  `icon` (free `anchor`, `fill` canonical with `color` accepted),
  `progress_bar` (+`font`), percentages on root-level coordinates, `visible`
  on all.
- [ ] **4.2 `multiline`** — `value`, `delimiter`, `x`, `y`, `offset_y`
  (required; authoring default `round(1.3 × size)`), `size`, `font`, `color`,
  `anchor`.
- [ ] **4.3 `arc`** — centre, `radius`, `start_angle`, `end_angle`, `fill`
  (pie) or `outline` + `width` (arc). Resize handles change the radius.
- [ ] **4.4 `polygon`** — `points` editor: list of X/Y pairs with add/remove
  rows; on canvas, move translates all points, point handles move one point.
- [ ] **4.5 `rectangle_pattern`** — `x_start`, `y_start`, `x_size`,
  `y_size`, `x_offset`, `y_offset`, `x_repeat`, `y_repeat`, colors; resize
  changes the cell size.
- [ ] **4.6 `icon_sequence`** — `icons` list editor (icon picker per row,
  reorder), `size`, `direction`, `spacing` (default `size/4`), `fill`, `anchor`.
- [ ] **4.7 `dlimg`** — `url`, `xsize`, `ysize`, `resize_method`, `rotate`.
  Backend resolves `camera.*`/`image.*` entities and `/media/…` paths before
  rendering and passes HA's shared aiohttp session. URL field offers an entity
  picker shortcut.
- [ ] **4.8 `plot`** — bounds, `duration`, `low`, `high`, `round_values`,
  `font`, `size`, `debug`, nested `ylegend`, `yaxis`, `xlegend`, `xaxis`, and a
  `data` series editor (entity picker + per-series color, width, span_gaps,
  smooth, line_style, show_points, point_size, point_color, value_scale).
  Backend implements odl-renderer's `DataProvider` on the HA recorder.
- [ ] **4.9 `debug_grid`** — canvas-wide, no bounds, not draggable, at most one
  per dashboard; listed in the tree, shown/hidden like any item.
- [ ] **4.10 Fonts.** Backend passes `font_dirs` (HA config fonts) and lists
  available fonts in `bootstrap` for the font dropdown.

Out of scope (decided): `diagram`, `rotation`/`mirror`/`pivot`, the flow
cursor (omitted `y`). Every created element has explicit coordinates.

**Accepted when:** all 16 types can be added from the Library, every documented
field is editable and expression-capable, and each renders in preview and Media Source
identically.

---

## Phase 5 — Structure tree, containers, groups

Reference behaviour observed on lvgl.espboards.dev (Sept 2026), adapted to ODL.

### 5.1 Tree panel

- [ ] **5.1.1 Tree rendering.** First row `Root (N widgets)` (N = direct
  children) represents the canvas; selecting it shows Canvas properties.
  Container rows: collapse chevron, type icon, name, id-style caption, child
  count `(n)`, `Group` badge when grouped. Children are indented one level
  (≈ 16 px) with a vertical guide line. Leaf rows: type icon, name, caption.
  The header badge shows the total element count including nested ones.
- [ ] **5.1.2 Row actions** (visible on hover and on the selected row):
  containers — `Make group` (link icon), `Hide`, `Delete`; groups —
  `Enter group`, `Ungroup`, `Hide`, `Delete`; leaves — `Hide`, `Delete`.
  Delete asks for confirmation.
- [ ] **5.1.3 Search** filters rows by name/type, keeping ancestors of matches
  visible.
- [ ] **5.1.4 Selection sync.** Tree ↔ canvas selection is bidirectional;
  selecting a row scrolls it into view and expands its ancestors.
- [ ] **5.1.5 Keyboard.** Arrow Up/Down move selection, Left/Right
  collapse/expand, Enter enters a group (see 5.4), F2 renames.

### 5.2 Containers ("Object" in LVGL)

- [ ] **5.2.1 Container item.** Added from the Library (`CONTAINERS ›
  Container`), default 100 × 100 with white fill and black 1 px outline (the
  optional background compiles to one ODL `rectangle` drawn before its
  children; `fill`, `outline`, `width`, `radius` editable, `none` allowed).
  Properties: `Layout` (X, Y, W, H), `Background`, `Visibility`.
- [ ] **5.2.2 Children are directly selectable** on the canvas; the parent
  container gets a thin outline while a child is selected.
- [ ] **5.2.3 Drop from Library onto a container** makes the new element its
  last child; the drop point becomes its relative position; the container stays
  highlighted as drop target while hovering.
- [ ] **5.2.4 Drag an existing element onto a container** (canvas) re-parents it
  into the deepest container under the pointer on drop; visual position is
  preserved (absolute → relative conversion).
- [ ] **5.2.5 Drag a child outside its container** (canvas) re-parents it to the
  nearest ancestor that contains the drop point (Root if none); visual position
  preserved; it is inserted directly after its former parent.
- [ ] **5.2.6 Tree drag-and-drop.** Row drop zones: upper quarter = before,
  lower quarter = after, middle half of a container row = inside (appended as
  last child). Markers: line for before/after, outlined row for inside.
  Re-parenting via the tree preserves the visual position (LVGL resets to 0,0 —
  deliberate deviation).
- [ ] **5.2.7 Moving a container** moves the whole subtree (only its own X/Y
  change); resizing a plain container does not change children.
- [ ] **5.2.8 Delete container** deletes the subtree after confirmation;
  `Ungroup` (5.3) is the way to keep children.

### 5.3 Groups

- [ ] **5.3.1 Make group / Ungroup.** `Make group` on a container turns it into
  a group: background removed (transparent), `Group` badge in the tree,
  `Grouped` chip in the Properties header. `Ungroup` on a group removes the
  group and moves its children to the group's parent at the same index, with
  preserved visual positions. Both are one undo step.
- [ ] **5.3.2 Group selection.** Clicking any child of a group on the canvas
  selects the **group**; its box shows handles and the hint
  "Enter / double-click to edit".
- [ ] **5.3.3 Enter / exit group.** Enter or double-click enters the selected
  group: the tree shows a breadcrumb bar `Root › <group>` with an `Exit` button,
  the group row is outlined, the group box is dashed, and its children become
  individually selectable. Escape (or `Exit`, or clicking outside the group)
  exits and re-selects the group.
- [ ] **5.3.4 Group resize scales children** — phase 7.

**Accepted when:** e2e covers each 5.x behaviour with real pointer sequences;
pytest proves container offsets and group flattening produce the same PNG as the
equivalent flat absolute ODL list.

---

## Phase 6 — Context menus, clipboard, keyboard shortcuts

All actions are commands in the registry (phase 1.3); menus and shortcuts only
reference command ids. Menus: 8 px radius, 36 px rows, icon + label + shortcut
hint right-aligned, separators between groups, disabled items dimmed. Opening a
menu on an element first selects it.

- [ ] **6.1 Canvas element menu:** Copy `Ctrl+C` · Cut `Ctrl+X` · Paste
  `Ctrl+V` · Duplicate `Ctrl+D` | Delete `Del` | Bring to Front · Send to Back |
  Make group / Ungroup `Ctrl+G` / `Ctrl+Shift+G` (containers and groups only).
- [ ] **6.2 Tree row menu:** Copy · Cut · Paste | Move Up · Move Down | Hide /
  Show · Lock / Unlock | Delete | Make group / Ungroup | Rename `F2`.
- [ ] **6.3 Empty canvas menu:** Paste · Paste Here (at pointer position).
- [ ] **6.4 Clipboard semantics.** Copy/cut store a deep copy of the selected
  subtree in the panel (in memory, also `localStorage` for cross-dashboard
  paste). Paste inserts into the selected container (or the selected item's
  parent, or Root), after the selection, offset +8/+8 px, with new ids and names;
  the pasted item becomes selected. Paste Here places its top-left at the
  pointer. Cut = copy + delete as one undo step.
- [ ] **6.5 Duplicate** inserts a copy right after the source in the same
  parent, offset +8/+8 px, and selects it.
- [ ] **6.6 Order.** Bring to Front / Send to Back move to the last / first
  position among siblings; Move Up / Down swap with the next / previous sibling.
- [ ] **6.7 Keyboard shortcuts** (Ctrl = ⌘ on macOS; ignored while typing in a
  field, except Escape):

  | Action | Keys |
  |---|---|
  | Enter selected group | `Enter` |
  | Exit group / deselect / close menu or dialog | `Esc` |
  | Nudge 1 px | `←` `→` `↑` `↓` |
  | Nudge by snap size | `Shift` + arrows |
  | Delete | `Del` / `Backspace` |
  | Copy / Cut / Paste | `Ctrl+C` / `Ctrl+X` / `Ctrl+V` |
  | Duplicate | `Ctrl+D` |
  | Make group (toggle) / Ungroup | `Ctrl+G` / `Ctrl+Shift+G` |
  | Undo / Redo | `Ctrl+Z` / `Ctrl+Shift+Z`, `Ctrl+Y` |
  | Save dashboard | `Ctrl+S` |
  | Switch to Code view (copy ODL) | `Ctrl+E` |
  | Zoom in / out / reset | `Ctrl+=` / `Ctrl+-` / `Ctrl+0` |
  | Zoom toward cursor | `Ctrl` + wheel |
  | Pan | `Ctrl` + drag, or `Space` + drag |

  Every shortcut is shown in the menus and in a `Keyboard shortcuts` dialog
  opened from the Help button (generated from the registry).

**Accepted when:** e2e triggers every registry command both from its menu and
its shortcut and asserts the resulting document and PNG.

---

## Phase 7 — Group scaling and responsive layout

- [ ] **7.1 Group resize scales children:** geometry fields (coordinates,
  sizes, `radius`, `size`, stroke widths rounded to ≥ 1) scale proportionally
  about the group's fixed edge; `Shift` keeps aspect ratio. Blocked (with a lock
  reason) if any descendant has an expression-driven geometry field.
- [ ] **7.2 Responsive:** below ~900 px wide both side panels collapse to rails;
  Properties becomes a bottom sheet with a drag handle; a floating selection bar
  (`× · <name> · Edit · Delete`) appears at the bottom of the canvas.

---

## Phase 8 — Widget platform

A **widget** is a semantic building block: the user picks *what* to show
(entities, devices, calendars …) and a few options, and the widget decides
*how* to lay it out inside its frame. Widgets compile to ordinary ODL elements,
so preview, Media Source and Code view work exactly as for primitives.

### Current state

- Only `widgets/temperature` is loaded (pure ODL renderer + own
  `entity-state` provider).
- Older widgets exist only in git history (release 0.9.5, commit `8d445f5`):
  `calendar`, `weather`, `hero_weather`, `sensor`, `section_title`, `text`.
  They were rendered through Liquid/TRMNL. **Liquid is dropped for good** — no
  `.liquid` file is ported, read at runtime, or re-created. Only their data
  logic (`provider.py`: calendar events, weather forecast, sensor state) and
  `translations/` are reused, rewritten into the shared providers of 8.2 and
  pure Python ODL renderers.
- `WidgetRegistry.from_directories` already scans the built-in folder and
  `/config/opendisplay_studio/widgets`, but only at setup, and one broken
  package raises and stops the whole integration.
- A dashboard referencing an unknown widget type fails validation and is
  silently dropped on load.
- Providers are keyed per widget, so two different widgets reading the same
  entity fetch it twice.

### 8.1 Package format (widget API v1)

```
<widget_id>/                     # folder name = id with "-" → "_"
├── widget.yml                   # manifest (required)
├── renderer.py                  # pure ODL renderer (required)
├── provider.py                  # optional widget-specific data provider
├── migrations.py                # optional config migrations between versions
├── translations/
│   ├── en.json                  # labels + runtime strings (required: en)
│   └── pl.json
├── preview.png                  # optional Library thumbnail
└── tests/                       # optional fixtures used by the widget test harness
```

`widget.yml`:

```yaml
api: 1                              # widget API version; loader rejects unknown majors
id: agenda                          # kebab-case, unique across all packages
name: Agenda                        # default label (translations may override)
version: 1.0.0                      # semver of the package
description: Upcoming events from one or more calendars on one list.
icon: mdi:calendar-text
category: Calendar                  # Library section inside WIDGETS
author: OpenDisplay Studio

layout:
  defaultSize: { width: 360, height: 240 }
  minSize: { width: 180, height: 90 }

sources:                            # WHAT the user picks — rendered first in Properties
  - key: calendars
    label: Calendars
    selector:                       # any Home Assistant selector
      entity: { filter: { domain: calendar }, multiple: true }
    required: true
    max: 10
    data: calendar_events           # data provider that resolves these sources
    perSource:                      # optional options stored per picked item
      - key: label
        label: Label
        selector: { text: {} }
      - key: color
        label: Color
        selector: { opendisplay_color: {} }

options:                            # HOW — grouped into Properties sections
  - section: Content
    fields:
      - key: maxEvents
        label: Number of events
        default: 5
        selector: { number: { min: 1, max: 20, mode: box } }
      - key: days
        label: Look ahead (days)
        default: 14
        selector: { number: { min: 1, max: 60, mode: box } }
  - section: Presentation
    fields:
      - key: groupByDay
        label: Group by day
        default: true
        selector: { boolean: {} }
      - key: showLocation
        label: Show location
        default: false
        selector: { boolean: {} }

data:                               # provider parameters, may reference options
  calendar_events:
    days: "@options.days"
```

- [ ] **8.1.1 Manifest schema** (voluptuous) with precise error messages
  (`agenda/widget.yml: sources[0].selector: …`). Required: `api`, `id`, `name`,
  `version`, `description`, `icon`, `layout`, `renderer.py`, `translations/en.json`.
- [ ] **8.1.2 Sources.** Selectors support `entity` (single/multiple, domain /
  device_class filters), `device` (single/multiple, integration/manufacturer
  filters), and `area`. `perSource` fields are stored per picked item
  (`{ id: "calendar.kid_1", label: "Ola", color: "red" }`), so a widget can tell
  the items apart on screen.
- [ ] **8.1.3 Options.** Any HA selector; `default` per field; sections map to
  Properties accordions. Colors use `opendisplay_color` (our palette dropdown).
- [ ] **8.1.4 Stored item shape.**
  `{ kind: "widget", widget: { type, version, sources: { <key>: [ {id, …perSource} ] }, options: { … } }, frame, name, hidden, locked, visible }`.
  `visible` accepts an expression like any primitive field.

### 8.2 Data providers

- [ ] **8.2.1 Shared built-in providers** in
  `custom_components/opendisplay_studio/data_providers/`, one per data kind,
  deduplicated across **all** widget instances of a render:

  | Provider | Input | Normalized output (per source) |
  |---|---|---|
  | `entity_state` | entity ids | `id, name, state, display_state, unit, icon, device_class, attributes, last_changed` |
  | `calendar_events` | calendar ids, `days` | events `summary, start, end, all_day, location, description, source` |
  | `weather_forecast` | weather ids, `type` (daily/hourly) | current conditions + forecast list |
  | `todo_items` | todo ids | items `summary, status, due` |
  | `history` | entity ids, `hours` | series for charts (recorder) |
  | `device_entities` | device ids | device `name, model, area` + its entities grouped by domain/device_class, with states |

  Values are already localized (`display_state` uses HA translations for the
  dashboard language; timestamps in HA's time zone).
- [ ] **8.2.2 Widget-specific providers.** A package may ship `provider.py`
  exporting `PROVIDER` (same protocol as today); its name is namespaced as
  `<widget_id>:<name>` so packages cannot collide.
- [ ] **8.2.3 Refresh.** Entities read by providers are registered with the
  preview refresh mechanism from phase 3.3; the preview re-composes when they
  change.

### 8.3 Renderer SDK

```python
from opendisplay_studio.sdk import WidgetContext, odl

def render(ctx: WidgetContext) -> list[dict]:
    events = merge_sorted(ctx.data["calendars"], key="start")[: ctx.options["maxEvents"]]
    ...

RENDERER = render
```

- [ ] **8.3.1 `WidgetContext`**: `box` (content box after padding), `display`
  (size, palette, accent), `language`, `t(key, **values)` (package
  translations), `options`, `sources` (with `perSource` values), `data` (keyed
  by source key; always a list, one entry per picked item, in pick order),
  `now` (aware datetime, fixed per render).
- [ ] **8.3.2 `sdk.odl` helpers** (built on `odl.py`): `text`, `multiline`,
  `icon`, `rectangle`, `line`, `progress_bar`, `plot`; layout helpers `rows`,
  `columns`, `grid`, `inset`; `fit_text` using the renderer's real
  `measure_text`; `truncate`; `format_datetime`, `format_relative_day`
  ("Today", "Tomorrow", weekday) localized; `condition_icon` for weather states;
  `entity_icon` for domain/device_class defaults.
- [ ] **8.3.3 Renderer contract** (update `WIDGET_CONTRACT.md`): pure and
  deterministic; no HA access, I/O, or network; must stay inside `ctx.box`
  (compiler drops elements outside the frame and warns); adapts to the box
  (compact / regular / large); renders a readable placeholder when a required
  source is missing ("Choose calendars"); may return warnings. Time budget per
  render: 50 ms (measured, warning above).
- [ ] **8.3.4 Config migrations.** When the stored `version` is older than the
  package, `migrations.py` (`MIGRATIONS = {"1.x→2.0": fn}`) upgrades the stored
  options before rendering and on save.

### 8.4 Dynamic loading and reload

- [ ] **8.4.1 Two roots.** Built-in: `custom_components/opendisplay_studio/widgets/`.
  User packages: `/config/opendisplay_studio/widgets/<widget_id>/` (created on
  setup). A user package with an id that already exists is rejected with an
  error (to customise a built-in, copy it under a new id).
- [ ] **8.4.2 Isolation.** Each package loads independently; a broken package
  is skipped and reported (`widgetErrors: [{ folder, message }]`), never
  stopping setup or other widgets.
- [ ] **8.4.3 Reload without restart.** Three triggers, one code path:
  a **Reload widgets** button in the Library `WIDGETS` header, the WebSocket
  command `opendisplay_studio/reload_widgets`, and the HA action
  `opendisplay_studio.reload_widgets` (usable in automations; also run on
  integration reload). The registry is rebuilt in the executor and swapped
  atomically; modules get a fresh name per content hash so changed code is
  really re-imported. The panel re-bootstraps the catalog and shows a toast:
  "Widgets reloaded — 9 loaded, 1 failed (details)".
- [ ] **8.4.4 Missing widgets never lose data.** A dashboard item whose widget
  type is not installed is kept as-is, drawn as a hatched placeholder frame with
  the type name, and reported as a warning; it renders again once the package
  returns.
- [ ] **8.4.5 Library.** `WIDGETS` groups tiles by `category`; user packages
  get a small "user" badge; the Library header shows a warning icon when some
  packages failed, opening the error list.
- [ ] **8.4.6 Security note.** Packages are Python code executed inside HA.
  Only files placed by an HA administrator in the config folder are loaded; no
  upload or download from the panel in this phase. The docs say so plainly.

### 8.5 Editor integration

- [ ] **8.5.1 Adding a widget** from the Library creates it at `defaultSize`.
  Properties order: header, **Data sources** (one picker per `sources` entry,
  multi-select as chips, drag to reorder, per-source fields in an expandable
  row under each chip), then option sections, then `Layout`, `Visibility`.
- [ ] **8.5.2 Resize** is limited by `minSize`; the live size badge shows it.
- [ ] **8.5.3 Widgets are leaves** in the structure tree and can live inside
  containers and groups like primitives.
- [ ] **8.5.4 Convert to elements** (context menu, later step): replace a widget
  with a container holding the ODL primitives it currently produces — a static
  snapshot the user can edit freely. Confirm first; undoable.

### 8.6 Tooling

- [ ] **8.6.1 Test harness** `tests/widgets/`: render every built-in widget at
  `minSize`, `defaultSize`, and a large size with fixture data (and with
  missing sources); assert no element leaves the box, no exception, and compare
  against golden PNGs.
- [ ] **8.6.2 `docs/widget-sdk.md`**: how to write, test, install, and reload a
  package, with the Agenda widget as the worked example.
- [ ] **8.6.3 Example user package** in `examples/widgets/hello_world/` used by
  an e2e test: copy into the user folder → reload → tile appears → drop → renders.

**Accepted when:** dropping a new package folder into
`/config/opendisplay_studio/widgets/` and pressing **Reload widgets** shows it
in the Library without restarting HA; a syntax error in one package shows a
clear error and every other widget keeps working.

---

## Phase 9 — Widget catalog

Built-in widgets, each a package following phase 8, with translations `en` and
`pl`, golden-image tests at three sizes, and a Library preview image. Every
renderer is pure Python producing ODL — **no Liquid, no HTML, no browser
rendering**. The 0.9.5 widgets are reference for data handling only.

- [ ] **9.1 Sensor card** (replaces `temperature`). Sources: one or more
  entities (any domain), per-source `label` and `icon` override. Options:
  layout `single | list | grid`, show icon/name/unit, decimals, value size,
  accent color for values out of `min`/`max` thresholds. Single entity = big
  value tile (today's Temperature look); several = aligned list or grid.
  Migration: stored `temperature` items become `sensor-card` with
  `sources.entities = [entity]` and matching options; the `temperature` package
  is removed.
- [ ] **9.2 Agenda.** Sources: one or more calendars with per-source `label`
  and `color`. Options: number of events (default 5), look-ahead days, group by
  day, show time / location / calendar label, 24 h clock, empty-state text.
  Behaviour: events from all picked calendars are merged into **one list**
  sorted by start (all-day events first within a day), the first *N* shown;
  each row carries the source's label/color, so with calendars for two children
  the widget shows the next 5 events of both together, each marked with the
  child's label. Long titles are truncated to the row width.
- [ ] **9.3 Weather.** Source: one weather entity. Options: forecast daily or
  hourly, number of forecast items, show humidity / feels like / wind. Current
  condition icon + temperature, then a forecast row or column depending on the
  frame's aspect ratio.
- [ ] **9.4 Hero weather.** Source: one weather entity. Large current
  temperature, condition icon and text, today's min/max; primary and accent
  colors.
- [ ] **9.5 Section title.** No sources. Options: text (expressions allowed),
  icon, alignment, divider line, size. For headings on dashboards.
- [ ] **9.6 Clock & date.** No sources. Options: format (time, date, both),
  24 h, show weekday, size. Shows the render time — the device shows what was
  true at its last refresh; the Properties panel says so.
- [ ] **9.7 Status list.** Sources: multiple entities (doors, windows, lights,
  locks …) with per-source label. Options: show only "active" states, columns,
  icon on/off per state. Each row: state-aware icon, name, localized state.
- [ ] **9.8 To-do.** Sources: one or more todo lists (per-source label).
  Options: number of items, hide completed, show due date. Merged list like
  Agenda, sorted by due date then list order.
- [ ] **9.9 Battery overview.** Sources: multiple devices or battery sensors.
  Options: warn below X %, sort lowest first, max rows. Each row: name,
  percentage, small progress bar (accent below threshold).
- [ ] **9.10 History chart.** Sources: 1–4 numeric entities (per-source color).
  Options: hours, min/max or auto, legend. Wraps the ODL `plot` primitive with
  sensible axes and legend for the frame size.
- [ ] **9.11 Device card.** Source: one device. Shows the device name and its
  most useful entities (battery, temperature, humidity, power, state) chosen by
  device class, via `device_entities`.

- [ ] **9.12 Week timetable** (school timetable), ported from the
  *OpenDisplay – Weekly school timetable* blueprint (Misiu) — its Jinja payload
  logic becomes a Python renderer; the automation parts (refresh interval,
  quiet hours, `drawcustom` push) are not the widget's job, the dashboard is
  consumed through its Media Source. Source: one calendar (add a second widget
  for a second child). Options: days `Mon–Fri` (or `Mon–Sun`), subject
  aliases (key/value list: full name → short name), text to strip from titles
  (default `[ZASTĘPSTWO]`), highlight color for the lesson in progress (default
  `accent`), show footer, week start behaviour on weekends (keep current week /
  show next week). Behaviour, kept from the blueprint:
  - Fetch the current week's events (`calendar_events`, Monday 00:00 +
    5/7 days); on a weekend keep the current week (or next, per option).
  - Header row: weekday name + localized date; today's column header inverted
    (black fill, white text).
  - Rows = every **distinct start–end pair** of the whole week, sorted, equal
    height; no fixed lesson count; breaks create no gaps. First column shows
    start and end time.
  - A cell lists the lessons of that day and slot; several are joined with
    ` / `; empty cells stay empty.
  - Titles: strip the configured markers, apply aliases (exact,
    case-sensitive), wrap by words, split over-long words, ellipsis on the last
    visible line. Font size steps down with row height.
  - Lesson in progress (`start ≤ now < end`) gets the highlight fill.
  - All-day, multi-day, and invalid events are excluded and counted in the
    footer (`Timetable · 29.09–03.10.2026 · Skipped entries: 2`), render time
    at the right.
  - No lessons → centered "No lessons this week" (translated).
  Improvements over the blueprint: text measured with the real font
  (`sdk.fit_text` / `measure_text`) instead of a hard-coded width table; layout
  scales to any frame instead of fixed 800 × 480 coordinates; palette-aware
  colors.

**Accepted when:** every catalog widget renders correctly at its minimum,
default, and a large size with fixture data, in `bw` and `spectra6` palettes,
and the Temperature → Sensor card migration is covered by a stored-dashboard
fixture.

---

## Phase 10 — Finishing

- [ ] **10.1 Dashboard thumbnails** in the gallery from the last rendered PNG.
- [ ] **10.2 Update `DESIGN_SPECS.md`, `ARCHITECTURE.md`, `WIDGET_CONTRACT.md`,
  `README.md`** to the final behaviour; remove outdated statements (e.g. "Text
  and Rectangle only", "one Temperature widget").

Not planned without a separate decision: editable Code view / YAML import,
multi-select, several screens per dashboard, "From OpenDisplay device" setup,
deployment to devices.

---

## Deviations from LVGL (deliberate)

| LVGL behaviour | Ours | Why |
|---|---|---|
| Dark hard-coded theme | HA theme tokens | Panel lives inside HA and follows the user's theme |
| Children clipped to parent | Not clipped; warning badge | ODL has no clipping |
| Tree re-parent resets position to 0,0 | Visual position preserved | Less surprising; matches canvas re-parenting |
| Reparent to Root inserts at index 0 | Inserted after former parent | Keeps z-order predictable |
| Import YAML (`Ctrl+I`), Export (`Ctrl+E`) | `Ctrl+E` opens Code view; no import | Code view is read-only in this plan |
| Preview mode (`Ctrl+P`) | — | The canvas already is the rendered preview |
| Styles/states, Tabview, Tileview, several screens | — | No ODL equivalent |
| Shift+arrow nudges 10 px | Nudges by the dashboard snap size | Consistent with snap setting |
| Drop from the library centres the element on the pointer | Top-left at the drop point, grid-rounded | Matches lvgl.espboards.dev (measured) |
| Fixed 5 px grid | Grid step is the dashboard `snapSize`; all other thresholds as measured | Displays differ in resolution; user already sets snap size |
| — (not an LVGL matter) | Document `schemaVersion` stays 1 and shape changes ship without migrations until the first public release of the dashboard model | Pre-release; the model changes shape every phase (flat list → tree → containers) |
