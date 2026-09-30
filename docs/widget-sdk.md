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
from opendisplay_studio.sdk import WidgetContext, fit_text, text


def render(context: WidgetContext) -> list[dict]:
    box = context.box
    greeting = context.t("greeting", who=context.options["who"])
    size = fit_text(greeting, box.width - 16, maximum=box.height // 2)
    return [text(greeting, x=box.x + box.width // 2, y=box.y + box.height // 2,
                 size=size, anchor="mm")]


RENDERER = render
```

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
for pick, data in zip(context.sources["calendars"], context.data["calendars"], strict=True):
    for event in data["events"]:
        ...
```

Agenda merges the events of every calendar, drops finished ones, sorts them (all-day
first within a day), keeps the first *N* and draws one row each, marked with the
calendar's label and colour. Use the SDK instead of measuring by hand:

| Helper | Use |
|---|---|
| `text`, `icon`, `rectangle`, `line`, `progress_bar` | Build ODL elements. |
| `fit_text(value, width, maximum)` | Largest font size at which `value` fits, measured with the renderer's own fonts. |
| `truncate(value, width, size)` | Cut with an ellipsis. |
| `rows`, `columns`, `grid`, `inset` | Split the box. |
| `format_time`, `format_relative_day`, `weekday_name` | Localized times and days. |
| `condition_icon`, `entity_icon` | Icons for weather conditions and entity kinds. |

Draw a readable message when a required source is missing (`context.t("choose_calendars")`)
and design for the smallest and a large frame, not only the default.

## 4. Install and reload

Copy the folder to `/config/opendisplay_studio/widgets/`, then press **Reload widgets**
in the Library (or call the action `opendisplay_studio.reload_widgets`). The widget
appears under its category with a *user* badge. A package that fails to load is listed
with the reason under the Library's warning; the others keep working.

## 5. Test it

Built-in widgets are rendered from YAML fixtures in `tests/widgets/fixtures/<id>/` at
their minimum, default and a large size, through the real `odl-renderer`, and compared
with golden images. A fixture is one scenario:

```yaml
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
```

Add a `missing-sources.yml` fixture too. Run `UPDATE_GOLDEN=1 python -m pytest
tests/widgets`, look at the PNGs, and commit them with the widget.

A local preview tool that renders every fixture of a package as you edit is planned
(ROADMAP 10.3).
