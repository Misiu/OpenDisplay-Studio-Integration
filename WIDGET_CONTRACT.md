# OpenDisplay Studio widget contract

Each widget definition owns four independent concerns:

```text
identity and version
configuration fields
data requirements
Liquid template
```

Widget packages are declarative and never contain executable Python. A package
can only request provider names registered by OpenDisplay Studio Integration.
This keeps installation reviewable and prevents a downloaded widget from
executing arbitrary code inside Home Assistant.

## Rendering invariant

One widget package has one visual contract across all surfaces:

```text
CLI fixture -> Liquid -> pinned TRMNL Framework -> region container
HA preview  -> HA data -> Liquid -> Renderer App -> PNG
final image -> HA data -> Liquid -> Renderer App -> PNG
```

The Home Assistant preview and final Media Source call the same Renderer API
with the same composed HTML, width, and height. The panel displays the returned
PNG and does not maintain a second browser-only rendering implementation.

`--screen-w` and `--screen-h` always describe the physical device. Responsive
widget decisions use the actual region size through a CSS size container. Grid
span names are editor concepts and must not select a presentation variant.

External assets must never fail silently. The current compatibility layer only
permits fixed TRMNL weather SVG paths, and the Renderer rejects the render if an
image is missing. The package format will carry declared assets inside the ODX
archive so installed community widgets can render deterministically without
arbitrary network access.

An integration release accepts only the TRMNL Framework version reported by
its compatible Renderer App. A widget package declaring another version must
be rejected or installed alongside an explicitly compatible renderer; it must
never be rendered against a silently substituted framework version.

The panel builds controls from `fields`. A field can contain a native Home
Assistant `selector` object, using the same schema as blueprint inputs. The
panel passes that object to `ha-form` without recreating selector behavior.
Legacy built-in fields can continue using the shorthand `type` property while
packages migrate. Configuration stores references, never current values.

```yaml
fields:
  - key: weather
    label: Weather entity
    required: true
    selector:
      entity:
        filter:
          domain: weather
```

Data requirements are declarative. A requirement names its provider, the
configuration key containing its source, whether the source has cardinality
`one` or `many`, and whether it is optional. Range-based providers may name a
second configuration key such as Calendar's `days`.

Example current Entity State requirement:

```json
{
  "key": "entity",
  "provider": "entity_state",
  "configKey": "entity",
  "cardinality": "one",
  "optional": false
}
```

The composer aggregates every region before providers run. Two widgets asking
for the same entity cause one state-machine lookup. Calendar requests for the
same entity use the largest requested range, then each widget receives only its
configured presentation range.

## Future Table

A Table can use ordinary presentation fields plus a multi-entity requirement:

```json
{
  "fields": [
    { "key": "entities", "type": "entities", "label": "Rows" },
    { "key": "nameColumn", "type": "text", "label": "First column" },
    { "key": "valueColumn", "type": "text", "label": "Second column" }
  ],
  "dataRequirements": [
    {
      "key": "rows",
      "provider": "entity_state",
      "configKey": "entities",
      "cardinality": "many",
      "optional": false
    }
  ]
}
```

Its normalized Liquid context can then contain five room-temperature rows
without exposing the full Home Assistant state machine.

## Weather

Weather declares one required entity. The provider combines its current state
with the requested daily forecast at render time:

```json
{
  "dataRequirements": [
    {
      "key": "weather",
      "provider": "weather_forecast",
      "configKey": "weather",
      "cardinality": "one",
      "optional": false,
      "forecastType": "daily"
    }
  ]
}
```

The `weather_forecast` provider belongs to the integration. It uses the selected
entity's state for current conditions and the public `weather.get_forecasts`
action for forecasts, then exposes one normalized Liquid object. Multiple
widgets selecting the same entity share the same collected provider result.
