# Stage 2 compatibility report

## Component boundary

Liquid runs only in the Home Assistant integration. It produces final HTML and
records `liquid_ms`; the Renderer App receives only final HTML, width, and
height. The App has no Liquid dependency or template API.

## Liquid engine

The integration pins `python-liquid==2.3.1`, a Python implementation tested
against Shopify's Golden Liquid suite. It runs in strict mode, has no filesystem
loader, auto-escapes variables, and applies limits for block depth, context
depth, loop iterations, local variables, and output bytes.

Supported in the POC:

- variables and nested mapping/list access;
- `assign`, `capture`, `if`/`elsif`/`else`, `unless`, `case`, `for`, `break`,
  `continue`, and standard Shopify filters supplied by Python Liquid;
- selected TRMNL filters ported from `trmnl-liquid` 0.8.2:
  `number_with_delimiter`, `json`, `parse_json`, `map_to_i`, `group_by`, and
  `find_by`.

Not yet ported:

- TRMNL's custom `{% template %}` tag;
- `where_exp`, QR code, Markdown, locale/Rails helpers, currency, ordinal, and
  timezone-specific filters;
- arbitrary user templates or Home Assistant entity bindings.

The official `usetrmnl/byos_node_lite` reference does not use Ruby either. It
uses LiquidJS with strict filters and variables inside its Node server. That is
useful compatibility evidence, but moving Liquid into this project's App would
violate the renderer-only boundary. A fuller Python port can become a separate
integration-side package after the POC.

## TRMNL Liquid Components

The stat/item, table, and progress structures were adapted from the MIT-licensed
`usetrmnl/trmnl-liquid-components` repository at commit
`77445360fb10b0d9edd2b28ffe574574ae563417`. Its custom `{% template %}` wrapper
was deliberately removed because that tag is outside the current subset. The
resulting HTML uses the same public Framework classes and renders as one DOM and
one screenshot.

## Display profiles and palettes

The POC validates exact PNG dimensions at 296 x 128, 800 x 480, and 1200 x 825.
ODX includes real 128 x 296 and 800 x 480 display profiles; 296 x 128 is their
landscape orientation. TRMNL Framework 3.2.0 has no native 296 x 128 device
profile, so the local adapter sets `--screen-w` and `--screen-h` from the exact
viewport. Framework structure, typography, layout, runtime, and 1-bit paint are
still used.

Palette tests use the official Framework classes `screen--1bit`,
`screen--color-3bwr`, and `screen--color-4bwry`. This validates CSS rendering,
not final e-paper quantization or dithering by OpenDisplay.

## Licenses and offline assets

The App bundles TRMNL Framework 3.2.0 CSS/JS and fonts with upstream MIT, OFL,
and CC BY notices. It contains no Highcharts distribution or plugin image
bundle. The integration's Python Liquid dependency and the adapted Liquid
Components source are MIT licensed. No render path requires Internet access.
