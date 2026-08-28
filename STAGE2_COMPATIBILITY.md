# Stage 2 compatibility report

## Component boundary

Liquid runs only in the Home Assistant integration. It produces final HTML and
records `liquid_ms`; the Renderer App receives only final HTML, dimensions, and
the request-scoped asset origin allowlist. The App has no Liquid dependency or
template API.

## Liquid engine

The integration pins
[`trmnl-liquid-py==0.1.0`](https://github.com/Misiu/trmnl-liquid-py). The package
targets byte-for-byte compatibility with the supported non-I18n surface of Ruby
`trmnl-liquid` 0.8.2. Its differential corpus currently matches all 574 covered
Ruby outputs and maps all 73 upstream RSpec examples.

The shared package supplies the standard Liquid language, TRMNL's inline
`{% template %}` tag, Ruby-compatible lax syntax and runtime behavior, Markdown,
QR generation, and the supported TRMNL filters. Rendering intentionally follows
TRMNL's unescaped, lax semantics; missing provider fields become empty Liquid
values instead of failing an otherwise renderable display. Each widget fragment
uses a fresh in-memory environment, so inline template definitions cannot leak
between installed widgets and Liquid has no filesystem fallback.

Rails/ActionView behavior and full I18n implementations of `l_word` and `l_date`
remain outside the package's 0.1.0 compatibility target. Widget-owned translation
files and Home Assistant localization handle OpenDisplay Studio presentation
language independently of those Rails helpers.

## TRMNL Liquid Components

The stat/item, table, and progress structures were adapted from the MIT-licensed
`usetrmnl/trmnl-liquid-components` repository at commit
`77445360fb10b0d9edd2b28ffe574574ae563417`. Installed widgets may now use the
same `{% template %}` and `{% render %}` primitives as TRMNL. The resulting HTML
uses the public Framework classes and renders as one DOM and one screenshot.

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
and CC BY notices plus Material Design Icons 7.4.47 under Apache-2.0. It
contains no Highcharts distribution or plugin image bundle. The integration's
`trmnl-liquid-py` dependency and the adapted Liquid Components source are MIT
licensed. Rendered widgets use only local MDI or package-owned data URIs, and
the Renderer blocks undeclared HTTP and HTTPS origins and scopes declared
widget origins to the individual render request.
