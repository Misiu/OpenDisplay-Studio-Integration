# OpenDisplay Studio widget package contract

A widget is a self-contained, independently versioned package. The integration
core does not contain widget IDs, widget-specific data normalization, labels,
or rendering branches.

## Package layout

Installed packages live below `opendisplay_studio/widgets`:

```text
widgets/
  weather/
    widget.yml
    widget.liquid
    provider.py
    translations/
      en.json
      pl.json
    assets/
```

`widget.yml` declares identity, version, configuration selectors, defaults,
data requirements, the Liquid template, and the optional provider module.
`provider.py` and `translations` belong to that widget. A static widget such as
Text does not need a provider.

The integration ships built-in packages in
`custom_components/opendisplay_studio/widgets`. Independently installed
packages use `/config/opendisplay_studio/widgets`. The registry scans both
locations; an installed package with the same widget ID replaces the bundled
version. The registry can be reloaded in place, so an installer or Store update
does not require a new integration release.

## Provider boundary

The core knows only the provider protocol:

```text
new_request -> add_request -> async_resolve -> values
```

Providers are scoped to their owning widget package. Identical provider names
in two community packages cannot overwrite or share state with each other.
Requests from multiple regions using the same widget are aggregated before the
provider runs, allowing deduplication within that package.

Examples of package-owned behavior:

- `widgets/weather/provider.py` reads a Weather entity, calls
  `weather.get_forecasts`, normalizes the result, and localizes it.
- `widgets/calendar/provider.py` reads calendar events and applies the
  widget's date range and time format.
- `widgets/entity_state/provider.py` normalizes an entity state and selects the
  icon used by that widget.

None of these behaviors belongs in the integration composer or a central
provider table.

Provider modules are executable Python inside the Home Assistant process.
Packages copied into the local config directory are therefore trusted code.
A public Store must verify package provenance and signatures before installing
or updating a provider-bearing package; downloading arbitrary unsigned Python
must never be an implicit background action.

## Configuration and data requirements

Fields can contain native Home Assistant selector schemas. The panel passes a
selector to `ha-form` instead of reimplementing its behavior:

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

A requirement maps a configuration source to a key in the Liquid context:

```yaml
dataRequirements:
  - key: weather
    provider: weather_forecast
    configKey: weather
    cardinality: one
    optional: false
```

The provider name above resolves only inside the Weather package. Configuration
stores references such as entity IDs, never snapshots of Home Assistant state.

## Localization

Language is selected per project so preview, Media Source, and the physical
display render the same pixels. New projects use the current Home Assistant
language and legacy projects pin the Home Assistant system language when they
are loaded.

Widget-specific vocabulary lives in that widget's `translations` directory.
A provider may additionally reuse official Home Assistant translations for the
domain it reads. Weather, for example, obtains condition and attribute names
from Home Assistant and presentation terms from
`widgets/weather/translations`. English is the package fallback.

Liquid templates receive localized labels and normalized values. They must not
contain user-facing language-specific strings. CLI fixtures carry the same
complete data contract, including `labels`, so standalone design remains
deterministic.

## Rendering invariant

One package has one visual path across every surface:

```text
CLI fixture -> Liquid -> pinned TRMNL Framework -> region container
HA preview  -> provider -> Liquid -> Renderer App -> PNG
Media Source / physical display -> provider -> Liquid -> Renderer App -> PNG
```

The panel displays the PNG returned by the same renderer used for Media Source.
Its local widget component is only a temporary loading fallback; it is not a
second authoritative renderer.

`--screen-w` and `--screen-h` describe the physical device. Responsive widget
decisions use the actual CSS region container dimensions, never names such as
full or half. A package must work for arbitrary device and region sizes.

The CLI and integration use bounded Liquid engines. Published widgets need
contract fixtures covering missing optional nested fields, not only empty or
null values, and must avoid engine-specific undefined-value behavior.

External assets cannot fail silently. Published archives will carry declared
assets so rendering remains deterministic. Framework compatibility is also
declared by the package and must be checked rather than silently substituted.
