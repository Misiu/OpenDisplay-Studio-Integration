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

Files below `assets/` are package-owned and available to Liquid as base64 data
URIs keyed by their POSIX relative path:

```liquid
<img src="{{ assets['icons/logo.svg'] }}" alt="">
```

Supported files are SVG, PNG, JPEG, GIF, WebP, WOFF, and WOFF2. Both an
individual asset and the complete package asset set are limited to 512,000
bytes before base64 encoding. Symbolic links and unsupported executable files
are rejected. Asset data never needs to be copied into the Renderer container.

Packages are local-only by default. A widget that intentionally loads a remote
asset declares each exact HTTP(S) origin in `widget.yml`:

```yaml
permissions:
  network:
    allowedOrigins:
      - https://cdn.example.com
```

Origins cannot contain credentials, paths, queries, or fragments. The
integration rejects undeclared remote asset references and passes only origins
actually used by the composed screen to the Renderer. The declaration is a
package capability, so installing or reviewing a widget does not require
widget-specific integration code.

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

Display-wide presentation is part of the project contract. `theme` maps to
the TRMNL light or dark screen mode, `fontFamily` selects the default, classic,
or TRMNL family, and `textScale` selects small, regular, large, or extra-large
framework typography. These settings must remain outside widget configuration
so every package shares one predictable display environment.

`--screen-w` and `--screen-h` describe the physical device. Responsive widget
decisions use the actual CSS region container dimensions, never names such as
full or half. A package must work for arbitrary device and region sizes.

The CLI and integration follow the shared TRMNL Liquid contract. Published
widgets need contract fixtures covering missing optional nested fields, not
only empty or null values, and must avoid engine-specific undefined-value
behavior.

The Renderer bundles the complete Material Design Icons font. Templates can use
any icon locally with markup such as `<span class="mdi mdi-weather-rainy"></span>`.
Widget-specific files should normally belong in `assets/` and use the Liquid
mapping above. Undeclared HTTP and HTTPS origins are blocked by the Renderer;
remote access is available only through the explicit manifest permission.
Published archives carry their local assets so rendering remains
deterministic. Framework compatibility is also declared by the package and
must be checked rather than silently substituted.
