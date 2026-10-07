# Writing a widget

A widget is a folder with a manifest, a renderer and translations. The rules it must
follow are in [`WIDGET_CONTRACT.md`](../WIDGET_CONTRACT.md); this page shows how to
write one, with the built-in **Agenda** as the worked example.

## 1. Start from the example

Copy `examples/widgets/hello_world/` and rename the folder and the `id` (the folder
name is the id with `-` replaced by `_`). It is the smallest package that works:

```yaml
# widget.yml
api: 1
id: hello-world
name: Hello world
version: 1.0.0
description: Greets someone.
icon: mdi:hand-wave
layout:
  defaultSize: { width: 240, height: 100 }
  minSize: { width: 120, height: 50 }
options:
  - section: content
    fields:
      - key: who
        label: Who to greet
        default: world
        selector: { text: {} }
```

```python
# renderer.py
from opendisplay_studio.sdk import Look, WidgetContext, compose, fit_text


def render(context: WidgetContext) -> list[dict]:
    look = Look.of(context)
    box = context.box
    greeting = context.t("greeting", who=context.options["who"])
    size = fit_text(greeting, box.width - 32, maximum=box.height // 2)
    return compose(
        context,
        {
            "type": "column",
            "justify": "center",
            "padding": 8,
            **look.frame(),
            "children": [look.text(greeting, size=size, align="center")],
        },
    )


RENDERER = render
```

A renderer does not place elements by hand. It describes a **layout** — rows, columns,
grids and stacks of text, icons and shapes — and `compose` lets
[`odl-layout`](https://github.com/OpenDisplay/odl-layout) turn it into ODL elements
inside the widget's box. `Look` carries the two options every widget offers,
**Show frame**, **Corner radius**, **Color** and **Background** (`showFrame`,
`cornerRadius`, `color` and `background` in the
`appearance` section): `look.frame()` is the frame and white background (or nothing),
`look.text()`, `look.icon()` and `look.divider()` draw in black, or in white when the
color and background are picked. Declare the four options in `widget.yml` like the
example does.

`translations/en.json` holds the labels the panel shows (`name`, `description`,
`options.<key>`, `sections.<section>`, `sources.<key>`) and the strings the renderer
uses, prefixed `runtime.` (`t("greeting")` reads `runtime.greeting`). Add `pl.json`
(or any language) for the rest; English fills what is missing.

## 2. Say what the user picks: sources

Agenda picks calendars. A **source** names the selector, the data provider that
resolves the picks and the fields kept per pick:

```yaml
sources:
  - key: calendars
    label: Calendars
    selector:
      entity: { filter: { domain: calendar }, multiple: true }
    required: true
    max: 10
    data: calendar_events
    perSource:
      - { key: label, label: Label, selector: { text: {} } }
      - { key: color, label: Color, selector: { opendisplay_color: {} } }

data:
  calendar_events:
    days: "@options.days"     # a provider parameter that reads an option
```

The renderer receives the picks in `context.sources["calendars"]` (each with its `id`,
`label`, `color`) and what the provider returned in `context.data["calendars"]`, one
entry per pick in the same order.

## 3. Draw inside the box

```python
for pick, data in zip(
    context.sources["calendars"], context.data["calendars"], strict=True
):
    for event in data["events"]:
        ...
```

Agenda merges the events of every calendar, drops finished ones, sorts them (all-day
first within a day), keeps the first *N* and draws one row each, marked with the
calendar's label and colour. Use the SDK instead of measuring by hand:

| Helper | Use |
|---|---|
| `compose(context, layout)` | Lay a row/column/grid/stack description out inside the box with `odl-layout`. |
| `Look.of(context)` | The ink and paper colors, the frame and its corner radius, from the appearance options. |
| `text`, `icon`, `rectangle`, `line`, `progress_bar` | Build single ODL elements. |
| `fit_text(value, width, maximum)` | Largest font size at which `value` fits, measured with the renderer's own fonts. |
| `truncate(value, width, size)` | Cut with an ellipsis. |
| `rows`, `columns`, `grid`, `inset` | Split the box into numbers, to size things before they are laid out. |
| `format_time`, `format_relative_day`, `weekday_name` | Localized times and days. |
| `condition_icon`, `entity_icon` | Icons for weather conditions and entity kinds. |

Draw a readable message when a required source is missing (`context.t("choose_calendars")`)
and design for the smallest and a large frame, not only the default.

## 4. Install and reload

Copy the folder to `/config/opendisplay_studio/widgets/`, then press **Reload widgets**
in the Library (or call the action `opendisplay_studio.reload_widgets`). The widget
appears under its category with a *user* badge. A package that fails to load is listed
with the reason under the Library's warning; the others keep working.

## 5. Preview it with simulated states

A widget looks different with ten calendar entries, with two and with none. Put those
situations in `states.yml`, next to `widget.yml`; each is one scenario:

```yaml
# states.yml
two-children:
  name: Two children's calendars merged
  language: en
  now: "2026-09-30T08:30:00+02:00"
  options: { showLocation: true }
  sources:
    calendars:
      - { id: calendar.ola, label: Ola, color: red }
  data:
    calendars:
      - id: calendar.ola
        events:
          - { summary: Swimming, start: "2026-09-30T16:00:00+02:00",
              end: "2026-09-30T17:00:00+02:00", all_day: false, location: City pool }

empty:
  name: Nothing planned
  language: en
  now: "2026-09-30T08:30:00+02:00"
  options: {}
  sources:
    calendars: [{ id: calendar.ola }]
  data:
    calendars: [{ id: calendar.ola, events: [] }]
```

`data` is what each source's data provider would return, so no Home Assistant is
needed. Add a state called `missing-sources` as well: the widget must draw a readable
message when nothing is picked. The sizes to draw are listed in `preview.yml`
(by default the TRMNL-like full, half and quadrant sizes of an 800×480 display):

```yaml
# preview.yml
palette: bw
sizes:
  - { name: full, width: 800, height: 480 }
  - { name: quadrant, width: 400, height: 240 }
  - { name: small, width: 296, height: 128 }
```

Start the preview from the repository root:

```bash
python -m scripts.widget_devkit serve --root examples/widgets
```

and open <http://127.0.0.1:8765>. The page draws the chosen state at every size through
the real `odl-renderer`. Save `renderer.py`, `widget.yml`, a translation, `states.yml`
or `preview.yml` and the page refreshes by itself. In the page you can switch the
state, change any option, switch the palette and edit the state's data as JSON to
try another situation; a mistake in the renderer is shown as the error it raised.
Leave out `--root` to preview the built-in widgets.

`python -m scripts.widget_devkit render --out pictures` writes a PNG per state and
size instead (`--option showFrame=false` sets an option; repeat it for more).

## 6. Test it

Built-in widgets are drawn from their `states.yml` at their minimum, default and a
large size, through the real `odl-renderer`, and compared with golden images. A state
that cannot be drawn without leaving the frame fails the test. Run
`UPDATE_GOLDEN=1 python -m pytest tests/widgets`, look at the PNGs, and commit them
with the widget.

For the documentation, add a `docs` list to `preview.yml` (title, state, size and
options of each picture) and run `python -m scripts.widget_docs`: it writes
[`docs/widgets/README.md`](widgets/README.md), the list of every widget with its
sources, options and pictures.
