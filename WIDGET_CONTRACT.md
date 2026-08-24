# OpenDisplay Studio widget contract

Each widget definition owns four independent concerns:

```text
identity and version
configuration fields
data requirements
Liquid template
```

The panel builds controls from `fields`. Home Assistant-aware field types
currently include `entity` and `calendar`; the contract already represents an
`entities` multi-selector for future widgets. Configuration stores references,
never current values.

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

## Future Weather

Weather can declare a required forecast source and a second optional current
temperature sensor. Both are resolved at render time:

```json
{
  "dataRequirements": [
    {
      "key": "forecast",
      "provider": "weather_forecast",
      "configKey": "weather",
      "cardinality": "one",
      "optional": false
    },
    {
      "key": "externalTemperature",
      "provider": "entity_state",
      "configKey": "temperatureEntity",
      "cardinality": "one",
      "optional": true
    }
  ]
}
```

Adding that widget requires a `WeatherProvider` and its definition/template;
it does not change project storage, Media Source identity, the frontend/backend
transport, or the Renderer API.
