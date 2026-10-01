# CLAUDE.md — OpenDisplay Studio

Guidelines for AI coding agents working in this repository. Read this file and
[`ROADMAP.md`](ROADMAP.md) before changing code. This file says **how** we
build; `ROADMAP.md` says **what** we build, in which order, and how each feature
must behave. When older docs disagree with these two files, these files win —
update the older doc in the same change.

## Coding guidelines (non-negotiable)

- **Code is written for people to read, and the Home Assistant team will review
  all of it.** Every file we produce — TypeScript, Python, tests, e2e specs,
  config, generated output — is readable and formatted by the project's
  formatter. Never hand in dense, minified, or "clever" code, and never a
  template or query returned as one long string.
  - Formatting is done by tools, not by hand: Prettier with the Home Assistant
    frontend configuration (`frontend-src/prettier.config.js`) and `ruff format`.
    Run `npm run format` / `ruff format .` before finishing; CI fails on
    unformatted code.
  - Lit templates are multi-line, one attribute per line, indented as the
    formatter leaves them. A `render()` method that grows past a screen is split
    into small `render<Part>()` methods, each returning one readable template.
  - Event handlers and callbacks in templates are named private methods
    (`@click=${this.save}`), not inline lambdas that contain logic. A one-line
    delegating arrow (`() => this.select(item)`) is the only inline form.
  - One statement per line. No nested ternaries (use early returns or a helper);
    braces around any multi-line `if`/`else`; lines at most 100 columns,
    comments included. Comments explain *why*, are wrapped, and are not
    decoration banners.
  - Names say what a thing is or does; no abbreviations a reviewer has to decode.
    Functions do one thing and stay short; extract a helper instead of adding a
    comment that narrates a block.
  - The same applies to code you generate through a script or codemod: run the
    formatter over the result and read it before handing it in.
- **Vocabulary: we design and manage Dashboards.** The word "project" /
  "Projects" must not appear anywhere we control: UI text, identifiers, file
  names, WebSocket commands, storage keys, CSS classes, tests, docs, commit
  titles. Use `dashboard` / `Dashboards`. The only exemptions are names imposed
  by tools (`pyproject.toml` and its `[project]` table) and this rule itself.
  Legacy occurrences are removed by ROADMAP phase 0, after which a guard test
  enforces the rule; never add new ones.
- **No Liquid, no TRMNL, no HTML/browser rendering — ever.** Everything that
  reaches a display is ODL rendered by `odl-renderer` in the backend. Widgets
  are Python renderers producing ODL. Do not port, read, or add `.liquid`
  files.
- **Never use IIFEs** in TypeScript. Extract a named helper, method, or element.
- **No `any`**, no `@ts-ignore` / `@ts-expect-error`, no `as` casts except at a
  real external boundary (HA WebSocket result, DOM query). Use `unknown` + type
  guards.
- **DRY, zero tolerance.** Search before writing. Logic used twice becomes a
  helper; a UI pattern used twice becomes an element; a constant is defined once.
  Two "similar but slightly different" implementations are unified into one
  parameterized implementation. If you find duplication, refactor it first.
- **One source of truth per concept.** Primitive definitions, palette colors,
  display profiles, keyboard shortcuts, context-menu actions, and UI strings each
  live in exactly one place (see below). Never re-declare them in another layer.
- **Ask before** creating commits, pushing, bumping versions, tagging, or
  releasing. The user controls every repository-modifying git operation.

## Product overview

**OpenDisplay Studio** is a Home Assistant custom integration (HACS) with a
built-in sidebar panel for designing e-paper screens. The user creates
**Dashboards**. A dashboard is one canvas at the display's exact pixel size,
built from **ODL primitives**, **containers**, and **semantic widgets**. Ready
dashboards are exposed as dynamic image Media Sources
(`media-source://opendisplay_studio/<dashboard-id>`) rendered from live HA data.

**Our model is the ESPboards LVGL Designer — https://lvgl.espboards.dev/.** The
editor is a functional and visual clone of it: layout, sizes, density, structure
tree, containers and groups, context menus, keyboard shortcuts. The difference:
it produces **OpenDisplay Language (ODL)** instead of LVGL YAML. When a
behaviour is not specified in `ROADMAP.md`, check how lvgl.espboards.dev does it
and do the same, unless ODL makes it impossible; record deliberate deviations in
`ROADMAP.md`.

On top of the LVGL model:

1. **All 16 ODL draw types** as primitives with every documented field
   (https://opendisplay.org/protocol/open-display-language.html).
2. **Expressions:** any property can be a literal or an HA Jinja
   expression, with a `{}` toggle next to every field (UX from Schlomo's designer,
   https://github.com/schlomo/odl-drawcustom-designer, ADR-013).

| Source | Take | Do not take |
|---|---|---|
| lvgl.espboards.dev | Everything about the editor: shell, panel widths, control sizes, property sections, tree, containers/groups, context menus, shortcuts, canvas toolbars, zoom bar | Its hard-coded dark palette (we use HA theme tokens), LVGL-only concepts (styles/states, several screens per dashboard, tabview/tileview, component marketplace), YAML import |
| schlomo/odl-drawcustom-designer | Field-shape model, expression toggle UX, locks for expression-driven geometry, ODL gap knowledge, behavior-test policy | React code, client-side Nunjucks, IndexedDB, share links, embed seams |
| `odl-renderer` (pinned in `manifest.json`) | **The rendering truth**: field semantics, defaults, coercion | — |

Schlomo's designer is Apache-2.0, this repo is MIT: port ideas, not files. If
code is ever copied, add attribution under `licenses/` in the same change.

## Repository structure

```
integration/
├── custom_components/opendisplay_studio/   # HA integration (Python)
│   ├── __init__.py, config_flow.py, panel.py, http.py, media_source.py
│   ├── websocket.py      # opendisplay_studio/* WS commands
│   ├── dashboards.py     # dashboard validation, migration, HA Store persistence
│   ├── compiler.py       # dashboard tree → ordered, absolute ODL element list (+ bounds, YAML)
│   ├── expressions.py      # HA Jinja resolution of expression-driven fields
│   ├── rendering.py      # bounded in-process odl-renderer → exact-size PNG
│   ├── odl.py            # typed ODL builders used by widget renderers
│   ├── palette.py        # palettes and colors (backend source of truth)
│   ├── primitives/       # <type>.yml primitive definitions (single source of truth)
│   ├── widgets/          # widget registry, manifest, options + built-in packages (widget.yml + renderer.py [+ provider.py] + translations/)
│   ├── data_providers/   # shared HA data providers used by widgets (entity_state, calendar_events, weather_forecast) + resolver
│   ├── widget_reload.py  # loading packages and reloading them without a restart
│   ├── sdk/              # widget SDK: WidgetContext, ODL + layout + formatting helpers
│   └── frontend/         # BUILD OUTPUT of frontend-src — never edit by hand
├── frontend-src/         # Lit panel (TypeScript, Vite, Vitest, Playwright)
│   ├── src/ods-*.ts      # one custom element per file
│   ├── src/*.ts          # framework-free logic + *.test.ts next to it
│   └── e2e/              # Playwright suite + visual snapshots (linux + win32)
├── docs/design/          # DESIGN_SPECS.md + reference mockups
├── docs/odl-coverage.md  # per-type field coverage and renderer deltas
├── tests/                # pytest (backend)
├── ARCHITECTURE.md, WIDGET_CONTRACT.md, ROADMAP.md
```

(`dashboards.py`, `expressions.py`, `primitives/`, `ods-*.ts` and
`docs/odl-coverage.md` are introduced by ROADMAP phases 0–3; `data_providers/`
and `sdk/` by phase 8. User widget packages live outside the repo in
`/config/opendisplay_studio/widgets/<widget_id>/`.)

## Architecture invariants

```
dashboard document ─▶ validate ─▶ resolve widget data ─▶ resolve expressions ─▶ flatten tree to absolute ODL ─▶ odl-renderer ─▶ PNG
```

- **The backend PNG is the visual truth.** The browser never re-implements ODL
  rendering. The canvas shows the PNG from `compose_preview`; the frontend draws
  only an interaction overlay (selection, handles, container outlines, guides,
  drop targets) from the authoritative `itemBounds` returned by the backend. The
  only local geometry is the optimistic position during an active gesture.
- **Preview and Media Source share one code path.** Anything that works in
  preview but not in the Media Source output is a bug.
- **The dashboard document is the only persisted state** (HA `Store`,
  versioned). No `localStorage`/IndexedDB for dashboards. Per-viewer UI
  conveniences (panel widths, collapsed sections, clipboard) may use memory or
  `localStorage` wrapped in try/catch.
- **Generated ODL YAML is clean and flat.** The Code view contains only valid
  ODL fields with absolute coordinates — no ids, names, locks, containers, or
  other editor metadata.
- **Rendering is bounded** by the semaphore in `rendering.py`; never add a
  second render path, process, or browser.

## Document model rules

- Until the first public release of the dashboard model, `schemaVersion` stays 1
  and stored dashboards that stop validating are dropped (ROADMAP, Deviations).
  After that release, `schemaVersion` changes require an explicit migration in `dashboards.py`,
  tested with a stored fixture of the previous version. Never rely on "records
  that fail validation are skipped".
- TypeScript types and Python validation change together, in one change.
- `items` is a **tree**. Sibling order is z-order: first drawn first; the last
  child is on top. Item kinds: `primitive` (exactly one ODL element), `widget`
  (zero or more ODL elements from its renderer), `container` (editor-side
  parent, LVGL "Object"; optional background compiles to one `rectangle`; with
  `grouped: true` it is a group and has no background). Every item has a `name`
  (default `<type>_<n>`).
- **Children of a container store coordinates relative to the container's
  top-left corner** (as LVGL does). The compiler adds the accumulated offsets
  after expression resolution, so ODL output is always absolute.
- Container geometry (`x`, `y`, `width`, `height`) is literal — never expression-driven.
  Percentage coordinates are allowed only for root-level items.
- Inside a container, expression-driven coordinate fields must be a single `{{ … }}`
  expression, so the Code view can emit `{{ (<expr>) | float(0) + <offset> }}`.
- ODL has no clipping. Children outside their container are still drawn; the
  editor marks them with a warning badge.

Behaviour of the tree, containers, groups, context menus, clipboard, and
shortcuts is specified in `ROADMAP.md` phases 5–6.

## Widgets

A widget lets the user pick *what* to show (entities, devices, calendars …)
and decides *how* to lay it out in its frame. The full contract is ROADMAP
phase 8 and `WIDGET_CONTRACT.md`; the rules:

- **A widget is a package folder**: `widget.yml` (manifest, `api: 1`),
  `renderer.py`, optional `provider.py` / `migrations.py`, `translations/`
  (`en` required, `pl` for built-ins). Built-ins and user packages use the same
  format and loader; nothing in the core may special-case a widget id.
- **Stored shape:** `widget: { type, version, sources: { <key>: [{ id, …perSource }] }, options }`.
- **Sources vs options.** `sources` declare what the user picks via HA
  selectors (entity/device/area, single or multiple, with optional per-source
  fields such as label and color); `options` declare presentation. A widget that
  accepts several sources treats them as one data set (e.g. Agenda merges all
  picked calendars into one sorted list).
- **Data comes from providers, never from the renderer.** Use the shared
  providers in `data_providers/` (deduplicated across all widgets in a render);
  a package-local provider is namespaced `<widget_id>:<name>`. Providers
  return normalized, localized, JSON-serializable data.
- **Renderers are pure**: `RENDERER(ctx) -> list[ODL element]`, no HA, I/O, or
  network; stay inside `ctx.box`; adapt to small and large frames; draw a
  readable placeholder when a required source is missing. Use `sdk` helpers for
  text fitting, layout, and formatting instead of re-implementing them.
- **Loading never breaks the integration.** Each package loads in isolation; a
  broken one is reported and skipped. Reload happens through one code path
  (Library button, `opendisplay_studio/reload_widgets`, HA action
  `opendisplay_studio.reload_widgets`). Dashboards referencing a missing widget
  keep the item and show a placeholder.
- **Versioned config.** Stored widget items carry the package version; breaking
  option changes ship a migration in `migrations.py`.
- **Every built-in widget** has golden-image tests at minimum, default, and a
  large size, from YAML fixtures in `tests/widgets/fixtures/<id>/`, including one
  with missing sources.
- Absolute imports in new Python (`custom_components.opendisplay_studio.…`) —
  ruff's `TID252` forbids `..`; user packages import `opendisplay_studio.sdk`.

## Primitive definitions (single source of truth)

```
custom_components/opendisplay_studio/primitives/<type>.yml
```

Each definition declares `type`, name, icon, description, library category,
`geometry` (`point` | `box` | `line` | `points` | `canvas`), and `fields`; each
field has `key`, `label`, `shape`, `required`, `default`, `section`, and
optional `unit`, `min`, `max`, `options`, `nested`.

Shapes: `number`, `coordinate` (pixels; `%` is a documented gap), `boolean`,
`enum`, `flags` (a comma-separated subset of `options`), `color`, `string`,
`text`, `font`, `points`, `icons`, `object` and `objects` (fields listed in
`nested`). A field may be `optional`: left unset it is omitted from the ODL element,
so the renderer applies its own default.

- `bootstrap` returns the definitions; the inspector renders **generic**
  controls from them. No per-type branches in inspector code, no per-type
  factory switch in TS.
- `dashboards.py` validates primitives **from the same definitions** with one
  generic validator.
- New-item defaults come from the definition.
- Field semantics and defaults follow the pinned `odl-renderer`. If the ODL page
  disagrees, the renderer wins; record the delta in `docs/odl-coverage.md`.

## Expressions

- An item keeps its **literal fields** and an **`expressions` map** beside them
  (`field key → template`, plus `visible` on any item). A template is a string
  containing `{{` or `{%`. The literal stays valid, so switching the `{}` toggle
  off loses nothing. `isExpressionValue` exists once in TS and once in Python
  (`is_expression`); templates are validated only for type and length.
- Templates are stored and exported **verbatim** — never coerced, parsed, or
  reformatted.
- **Evaluation is backend-only** (`expressions.py`), with HA's engine
  (`Template(...).async_render_to_info(parse_result=True)`), then validated
  against the field's shape like any literal. No client-side Jinja.
- On error or wrong result type, the element is skipped and a warning
  `<name>.<field>: <message>` is returned. Never substitute a plausible-looking
  value. A hidden container is not resolved further.
- `compose_preview` returns the entities, domains and clock use the templates
  depend on; the panel composes again 500 ms after such a state changes and every
  minute when the clock is read.
- The Code view keeps unresolved expressions (valid `drawcustom` input). Inside a
  container a coordinate template and any `visible` template must be a single
  `{{ … }}` expression, so it can be emitted as
  `{{ (<expr>) | float(0) + <offset> }}` and combined with the container's own.
- Expression-driven position fields lock dragging for that item; expression-driven
  size fields lock only the handles that would write them (`locks.ts`). Fields
  outside the geometry lock nothing.
- Reference for expression UX and ODL gaps: schlomo/odl-drawcustom-designer
  (ADR-013); the renderer still wins on field semantics.

## UI rules

Sizes and density come from lvgl.espboards.dev; **colors come only from HA
theme variables** (`--primary-color`, `--card-background-color`,
`--primary-background-color`, `--secondary-background-color`,
`--divider-color`, `--primary-text-color`, `--secondary-text-color`,
`--error-color`, …) so the panel follows the user's light/dark theme.
Hard-coded colors are allowed only for display-palette swatches. Concrete
measurements are in `ROADMAP.md` phase 2; `docs/design/DESIGN_SPECS.md` keeps
the information architecture.

- Primitive properties use our compact field elements (`ods-property-field` for numbers,
  `ods-value-field` for every other shape; label inside a 28 px box, unit suffix, `{}`
  toggle). A color is picked from the colors of the display in `ods-color-picker`, an anchor
  in `ods-anchor-picker`, both in an `ods-popover`. Use `ha-form` only for widget
  configuration from `widget.yml` selectors and for nested plot settings; use `ha-icon`,
  `ha-dialog`, `ha-button`, `ha-alert` where they fit.
- **Palettes** are the color schemes of OpenDisplay and live in
  `custom_components/opendisplay_studio/palettes.json`, the one file both the backend and
  the panel read. A stored color is a name the renderer resolves, or a hex where it knows no
  name (grays, orange). Never list colors anywhere else.
- Every icon-only control has `aria-label` and a tooltip; focus stays visible;
  the tree uses `role="tree"` / `treeitem`.
- Never let a panel cause horizontal page scroll. Floating UI (context menus,
  tooltips, dropdowns) stays inside the panel and flips to stay on screen.
- Selecting, editing, or opening a menu never moves the canvas viewport.
- Every document change is one undo step: create, move, resize, property,
  visibility, lock, order, re-parent, group/ungroup, paste, delete.

## Lit rules

- **One custom element per file**: `ods-<name>.ts`, tag `ods-<name>`. The panel
  element owns the dashboard, selection, clipboard, and undo/redo history.
  Children get data through properties and report intent through typed
  `CustomEvent`s (`bubbles: true, composed: true`); they never mutate the
  dashboard.
- **One generic field element** (`ods-property-field`) dispatches on the field
  shape and handles literal/expression mode.
- **Commands are data.** Every user action (copy, paste, group, bring to front,
  nudge, …) is one entry in a command registry with id, label, icon, shortcut,
  `isEnabled(context)`, and `run(context)`. Context menus, the keyboard handler,
  tree row buttons, and toolbars all read that registry. No action is
  implemented twice.
- `@property({ attribute: false })` for objects passed in, `@state()` for
  internal state. Immutable updates only.
- Handlers are named private methods; templates stay declarative (see the
  readability rule above). Conditional and repeated parts of a template are
  their own `render<Part>()` methods with early returns, not nested inline
  expressions.
- `static styles = css` per element; shared tokens/control styles in one shared
  module. No document-level styles — the panel lives in HA's shadow DOM.
- Listeners added to `window`/`document` are removed in `disconnectedCallback`
  or at gesture end; use the shared pointer-gesture helper.
- Keyboard shortcuts are ignored while focus is in an input, textarea, select,
  or contenteditable (except Escape).
- Pure logic (geometry, snapping, tree operations, coordinate conversion,
  expression detection, field coercion, history, commands) lives in
  framework-free modules with Vitest tests, not in element classes.
- `tsconfig.json` `include` is an allow-list; keep `npm run build` at zero
  errors.
- UI strings live in `strings.ts` (English). No inline user-facing literals.

## Python / Home Assistant rules

- Python 3.14, `ruff` with `select = ["ALL"]`, `mypy` strict. New files do not
  get blanket per-file ignores.
- Async everywhere; no blocking I/O in the event loop.
- WebSocket commands are `opendisplay_studio/<noun>/<verb>` or
  `opendisplay_studio/<verb>_<noun>`, with a voluptuous schema,
  `@require_admin`, and stable error codes via `connection.send_error`.
- Validation errors raise `DashboardValidationError` naming item and field.
- Widget renderers stay pure (`WIDGET_CONTRACT.md`).
- Minimum HA version is in `hacs.json`; check HA internals against it.

## Testing (TDD)

Red → green → refactor. No feature or fix without a test that fails before and
passes after.

- **Behavior tests only**: assert what the user or the Media Source sees.
  Good: rendered PNG pixel at a known coordinate, `itemBounds` match the ink
  box, a container move changes every child's rendered position, a v3 fixture
  migrates and renders identically, an expression-driven field renders the mocked entity
  state, Ctrl+D creates a sibling offset by 8 px. Bad: "function was called",
  markup contains a class.
- Backend (`pytest`): per primitive type validate → compile → render through the
  real `odl-renderer` and sample pixels; expression resolution; tree flattening
  and offsets; migrations.
- Frontend unit (`vitest run`): tree ops, coordinate conversion, commands,
  geometry, history, field coercion.
- E2E (`playwright`): real pointer and keyboard sequences — library drop into a
  container, re-parent by dragging out, tree drag, enter/exit group, context
  menus, every shortcut in the registry. Visual snapshots exist for linux and
  win32; update both deliberately and say so in the change summary.
- Parity claims are verified against the pinned `odl-renderer` source or a
  measured render, never against reasoning or docs alone.

## Commands

```bash
# backend (repo root)
python -m pip install -r requirements_test.txt
python -m ruff check . && python -m ruff format --check .
python -m mypy custom_components/opendisplay_studio scripts
python -m pytest

# frontend (frontend-src/)
npm ci
npm run lint          # ESLint (Lit + a11y), Prettier --check, tsc --noEmit
npm run format        # ESLint --fix + Prettier --write
npm test              # vitest run
npm run build         # tsc + vite → custom_components/opendisplay_studio/frontend/
npm run test:e2e      # Playwright, own Vite server on 127.0.0.1:4173
```

All of the above pass before a change is finished. The built bundle
`custom_components/opendisplay_studio/frontend/opendisplay-studio.js` is
committed; rebuild it in the same change as its source.

## Working with the roadmap

- Work phase by phase in `ROADMAP.md` order; a later phase may start only when
  the phases it depends on are done.
- One change = one roadmap step. Tick the step's checkbox in the same change.
- A behaviour decision not covered by the roadmap: follow lvgl.espboards.dev;
  if ODL makes that impossible, ask the user and record the answer in the
  roadmap's "Deviations from LVGL" table.

## Release

The release version is `manifest.json` `version`; `scripts/validate_release.py`
checks the tag against it and `tests/test_release_version.py` checks that
`frontend-src/package.json` matches. Bump both together (`pyproject.toml`
`version` is stale at 2.0.3 — align it at the next release). Releases use
generated notes, so commit titles are the changelog: imperative and
user-meaningful. Never tag or push without explicit approval.
