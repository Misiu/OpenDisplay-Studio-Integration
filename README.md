# OpenDisplay Studio Integration

Home Assistant custom integration with an ODX-derived graphical e-paper
designer. Ready projects are dynamic image Media Sources rendered from current
Home Assistant data.

[![Add the Renderer App repository to Home Assistant](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2FMisiu%2FOpenDisplay-Studio-App)
[![Open this integration in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Misiu&repository=OpenDisplay-Studio-Integration&category=integration)
[![Add OpenDisplay Studio to Home Assistant](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=opendisplay_studio)

Open **OpenDisplay Studio** in the Home Assistant sidebar to create predefined
or custom displays, edit their logical grids, compose rectangular regions, and
assign Entity State, Calendar, or Text widgets. Project configuration is stored
with Home Assistant's versioned `Store`; browser `localStorage` is not used.

Draft projects remain private to the designer. A Ready project is exposed at a
stable URI based on its immutable server-generated ID:

```text
media-source://opendisplay_studio/<project-id>
```

On every resolution the integration deduplicates widget data requirements,
reads current entity states and calendar events, renders widget Liquid
templates, composes one TRMNL Framework document, and sends that final HTML to
the Renderer. The Renderer App still knows only HTML, width, and height.

See [the widget contract](WIDGET_CONTRACT.md) for the schema/data/template
boundary and the planned multi-entity Table and optional-source Weather model.
See [Stage 2 compatibility](STAGE2_COMPATIBILITY.md) for the Liquid/TRMNL
compatibility baseline retained by Stage 3.

## Home Assistant OS / Supervised installation

1. Click **Add the Renderer App repository** above and confirm the pre-filled
   repository URL in Home Assistant.
2. Click **Open this integration in HACS**, download OpenDisplay Studio, and
   restart Home Assistant when HACS asks you to.
3. Click **Add OpenDisplay Studio to Home Assistant**.
4. Confirm **Install Renderer**. The integration uses Home Assistant Core's
   `AddonManager` and config-flow progress UI to install, start, discover, and
   health-check the App.

If a My Home Assistant button is unavailable, use the equivalent manual paths:

- add `https://github.com/Misiu/OpenDisplay-Studio-App` under
  **Settings > Apps > App store > Repositories**;
- add this repository to HACS as an **Integration**;
- open **Settings > Devices & services > Add integration** and select
  **OpenDisplay Studio**.

The integration deliberately does not add the third-party App repository by
itself. Home Assistant Core currently provides `AddonManager` for a known App,
but no official integration pattern for registering an arbitrary third-party
repository.

See [the App-management decision record](ARCHITECTURE.md) for the verified Core
APIs, exact Supervisor slug derivation, and the deliberately deferred
`system_managed` behavior.

## Home Assistant Container

Container installations do not have Supervisor App management. The config
flow therefore asks for an externally hosted renderer URL and optional bearer
token. No LAN port configuration is shown on HA OS/Supervised.

## Runtime recovery and ownership

At every config-entry setup, a managed Renderer is checked through
`AddonManager`. A missing App is scheduled for installation, a stopped App is
scheduled to start, and Home Assistant retries the entry. A running App must
also pass `/health` with API version 1 and report its pinned TRMNL Framework
version.

The entry stores whether OpenDisplay Studio installed the Renderer. Removing
the integration only stops, backs up, and uninstalls a Renderer it created;
an independently installed Renderer is left untouched.

## Development

```bash
python -m pip install -r requirements_test.txt
ruff check .
ruff format --check .
mypy custom_components/opendisplay_studio scripts
pytest

cd frontend-src
npm ci
npm test
npm run build
```

## License

MIT
