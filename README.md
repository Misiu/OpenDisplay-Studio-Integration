# OpenDisplay Studio Integration

OpenDisplay Studio is a Home Assistant-native e-paper screen designer. Ready
dashboards are exposed as dynamic image Media Sources rendered from current Home
Assistant data.

[![Open this integration in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Misiu&repository=OpenDisplay-Studio-Integration&category=integration)
[![Add OpenDisplay Studio to Home Assistant](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=opendisplay_studio)

## Version 3 editor

Version 3 removes the separate Renderer App, Chromium, Liquid, and TRMNL. The
integration embeds `odl-renderer` and owns the complete deterministic pipeline:

```text
Home Assistant data
        ↓
semantic dashboard
        ↓
structured ODL elements
        ↓
odl-renderer
        ↓
exact-size PNG
        ↓
designer preview and Media Source
```

The designer uses the backend PNG as visual truth. Its transparent editing
overlay adds selection, movement, resizing, and layer controls without
reimplementing the display renderer in the browser.

The workspace keeps the native display canvas at its exact pixel size and uses
a separate viewport transform for pan and zoom. Use the mouse wheel to pan,
Shift + wheel to zoom, and Alt + wheel to pan horizontally. The bottom toolbar
provides 0.5×, 1×, 2×, 3×, Reset, and Fit controls. Both side panels collapse,
and the Inspector can be resized from its left edge.

The initial POC includes:

- a dashboard list with predefined and custom display profiles;
- E Ink Spectra 6 profiles and its complete black, white, red, yellow, blue,
  and green palette;
- an exact-size freeform canvas with configurable outer padding and pixel snap;
- a searchable element catalog with separate **Widgets** and **Primitives**
  sections;
- built-in widgets — Sensor card, Agenda and Weather — that read real Home Assistant entities, calendars and forecasts, plus widget packages you can add yourself (see `docs/widget-sdk.md`);
- Text and Rectangle ODL primitives;
- direct mouse movement and resizing for widgets and primitives;
- overlapping elements with draggable layer order, visibility, position lock,
  and deletion controls;
- compact display, pixel geometry, and widget padding controls;
- versioned Home Assistant `Store` persistence;
- Draft and Ready dashboard states;
- exact ODL YAML and queue/data/compile/render/encode/pipeline timings in the
  designer;
- dynamic Ready dashboard Media Sources.

Every Ready dashboard has a stable URI based on its immutable server-generated
ID:

```text
media-source://opendisplay_studio/<dashboard-id>
```

## Installation

1. Click **Open this integration in HACS**, download OpenDisplay Studio, and
   restart Home Assistant when requested.
2. Click **Add OpenDisplay Studio to Home Assistant**.
3. Open **OpenDisplay Studio** in the Home Assistant sidebar.

No App repository, add-on, Chromium host, port, or renderer URL is required.
The same installation path works on Home Assistant OS, Supervised, Container,
and Core installations.

## Development

```bash
python -m pip install -r requirements_test.txt
python -m ruff check .
python -m ruff format --check .
python -m mypy custom_components/opendisplay_studio scripts
python -m pytest

cd frontend-src
npm ci
npm test
npm run build
npm run test:e2e
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the render boundary and
[WIDGET_CONTRACT.md](WIDGET_CONTRACT.md) for the semantic widget contract.

## License

MIT
