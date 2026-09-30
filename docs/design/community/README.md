# Community dashboard mockups

Mockups from the community that show what people want to put on an e-paper
dashboard. They are **reference, not a specification**: we realise them over time and
where it fits. The plan and the widgets they call for are in ROADMAP phase 9
(9.13); the rules for using them are below.

| File | What it shows |
|---|---|
| [01](01-design-sheet-grid-library-responsive.webp) | One design sheet: a 12 × 8 grid (800 × 480, 58 px columns, 8 px gutter and margin), a library of reusable widgets with their grid sizes (Hero Weather 3×4, Agenda 3×6, Status Card 3×2, Metric Strip, Section Title 3×1, Icon Value 2×1, Divider), background variants, and the same dashboard composed for 1.54″ to 13″ displays. |
| [02](02-main-dashboard-800x480.webp) | The main 800 × 480 dashboard: date, hero weather over an illustration, a strip of four metrics, an agenda column, and a row of four status cards. |
| [03](03-entity-tile-layouts.webp) | Entity tile (TRMNL): the icon / name / value / unit elements and how they rearrange for square, wide and tall areas, with or without icon and name, and its settings panel. |
| [04](04-progress-and-gauge-tiles.webp) | Progress and gauge tiles: value as a bar or a ring, with min/max, colour thresholds, orientation and compact variants. |
| [05](05-entity-list-tile.webp) | Entity list tile: rows of icon, name, value and unit; separators, maximum rows, sorting, compact two-column variant. |
| [06](06-dark-dashboard-many-widgets.webp) | A dense 1-bit dashboard: clock, weather, energy bar chart, events, room status table, batteries, power table, 24 h temperature chart, device list, room temperatures, monthly consumption bars. |
| [07](07-hero-background-variants.webp) | The hero weather with six optional background images; the rest of the dashboard unchanged. |
| [08](08-entity-state-with-sparkline.webp) | Entity state widget with a history sparkline, four sizes, light and inverted, min/max, updated-ago, chip states, with measured sizes and typography. |

## How we use them

1. **Few widgets, many options — not one widget per block.** Most blocks in these
   mockups are the same few things with different options. A block that is only a
   layout of other blocks is **not** a widget.
2. **Compose with groups.** A block such as "hero weather with a metric strip" is a
   *group* of a background, a weather widget, a few sensor-card widgets and a title.
   A group is moved, duplicated and copied as one (ROADMAP 5.2 and 6), so a
   composition is built once and reused. Saving a group as a reusable *template*
   (ROADMAP 9.13) lets a person share such a composition without code.
3. **Backgrounds are primitives, not widget options.** An illustration behind a
   block is an `image` primitive (ROADMAP phase 4) at the back of a group, so any
   widget can sit on any background ("no forced widget backgrounds" in sheet 01).
4. **Responsive is a property of the widget, not the dashboard.** Widgets adapt to
   the box they are given (compact, regular, large); a dashboard for another display
   is a new dashboard built from the same groups.
5. **Fidelity is not the goal.** The renderer is `odl-renderer`: fonts, icons and
   dithering differ from these illustrations. We take the information design
   (what is shown, in which hierarchy), not the pixels.

## What they ask for

Mapped to the widgets of ROADMAP phase 9 and what is missing. "Options" means an
option of an existing widget, not a new one.

| Need in the mockups | Where it lives |
|---|---|
| Hero weather: big temperature, condition, min/max, illustration | Weather (9.3) with a hero layout, or 9.4; illustration is a background primitive |
| Metric strip / small metrics: icon, label, value, unit in a row | Sensor card, layout `strip` (option), or a group of sensor cards |
| Status card: icon, label, big value, secondary text, min/max range, state colour, "all good" line | Sensor card options: secondary text, sparkline, colour by state |
| Entity tile shapes (square, wide, tall; with/without icon, name, unit) | Already the adaptive Sensor card |
| Entity list (rows, separators, max rows) | Sensor card layout `list` (done) and Status list (9.7) |
| Progress bar and gauge (bar, ring, thresholds, orientation) | New: **Gauge card** (9.13) |
| Agenda / events with icons and "+N more events" | Agenda (9.2), options: category icons, overflow line |
| Clock and date, sunrise / sunset, uptime | Clock & date (9.6) |
| Section title, divider / spacer | Section title (9.5); divider is the `line` primitive |
| History sparkline and 24 h chart with min / max / avg | History chart (9.10), plus a sparkline option on Sensor card |
| Energy bars (per hour), monthly consumption bars | History chart (9.10) bar type; progress list = Gauge card list |
| Table (room status, power by room) | New: **Table** (9.13) |
| Batteries with progress bars | Battery overview (9.9) |
| Device list with state | Status list (9.7) |
| Icon value (2×1) | Sensor card, layout `single` without name |
| Background images | `image` primitive (phase 4), group background |
| 12 × 8 grid with margin and gutter for snapping | Editor grid preset (9.13) |
