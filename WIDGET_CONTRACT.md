# Widget contract (widget API 1)

A widget is a package folder. It lets the user pick *what* to show (entities,
calendars, a weather entity …) and a few options, and decides *how* to lay that out
inside its frame. It compiles to ordinary ODL elements, so preview, Media Source and
Code view treat it like any primitive. How to write one: [`docs/widget-sdk.md`](docs/widget-sdk.md).

```text
<widget_id>/                # folder name = id with "-" replaced by "_"
├── widget.yml              # manifest (required)
├── renderer.py             # pure ODL renderer (required)
├── provider.py             # optional widget-specific data provider
├── translations/
│   ├── en.json             # labels and runtime strings (required)
│   └── pl.json
└── fixtures/               # optional scenarios for previews and tests
```

## Manifest

`widget.yml` is validated with precise errors (`agenda/widget.yml:
sources[0].selector: …`). Required: `api` (must be `1`), `id` (kebab-case), `name`,
`version` (semver), `description`, `icon` and `layout` (`defaultSize`, `minSize`).

| Key | Meaning |
|---|---|
| `category` | Section of the Library the tile appears under. |
| `sources[]` | What the user picks: `key`, `label`, a Home Assistant `selector` (entity, device, area), `required`, `max`, `data` (the data provider that resolves the picks) and `perSource[]` fields stored per pick (`label`, `color`, …). |
| `options[]` | How it looks: sections of fields, each with `key`, `label`, `selector` and `default`. The colour selector is `opendisplay_color`. |
| `data` | Parameters for a provider; `"@options.days"` reads an option. |

## Stored item

```json
{
  "kind": "widget",
  "widget": {
    "type": "agenda",
    "version": "1.0.0",
    "sources": { "calendars": [{ "id": "calendar.ola", "label": "Ola", "color": "red" }] },
    "options": { "maxEvents": 5, "days": 14 }
  },
  "frame": { "x": 20, "y": 20, "width": 360, "height": 240 }
}
```

Options are validated against their selectors and missing ones take their default.
A widget whose package is not installed keeps all it had and is drawn as a hatched
placeholder until the package returns.

## Data

A provider reads Home Assistant and returns plain, localized data. The built-in ones
(`entity_state`, `calendar_events`, `weather_forecast`) are shared: however many widget
instances need the same source with the same parameters, it is fetched once per render.
A package may ship `provider.py` exporting `PROVIDER`; it is named
`<widget_id>:<name>`. The entities a render reads are reported to the panel so the
preview refreshes when one changes.

## Renderer

```python
from opendisplay_studio.sdk import WidgetContext, text

def render(context: WidgetContext) -> list[dict]:
    ...

RENDERER = render
```

`WidgetContext` carries `box` (the frame after padding), `display`, `language`,
`options`, `sources` (the picks, with per-source fields), `data` (`data[key][i]` belongs
to `sources[key][i]`), `now` (fixed for the render) and `t(key, **values)` for the
package's runtime strings.

A renderer must:

- be pure and deterministic: no Home Assistant, storage, network or clock but
  `context.now`;
- stay inside `context.box` (elements starting outside are dropped with a warning);
- adapt to small and large frames;
- draw a readable placeholder when a required source is missing;
- take under 50 ms (longer is reported as a warning).

The backend composes every widget and primitive into one ordered ODL list and renders
the screen once with `odl-renderer`.

## Loading

Built-in packages live in `custom_components/opendisplay_studio/widgets/`. Packages an
administrator installs live in `/config/opendisplay_studio/widgets/<widget_id>/`; an id
that is already taken is rejected. Every package loads on its own: a broken one is
reported in the Library and skipped. **Reload widgets** (Library button, the WebSocket
command `opendisplay_studio/reload_widgets`, or the action
`opendisplay_studio.reload_widgets`) loads them again without restarting Home Assistant.

Packages are Python code that runs inside Home Assistant. Only files an administrator
places in the config folder are loaded; nothing is uploaded or downloaded from the panel.
