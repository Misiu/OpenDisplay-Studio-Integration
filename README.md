# OpenDisplay Studio Integration

Home Assistant custom integration proving that renderable OpenDisplay Studio
documents can be exposed as dynamic image Media Sources.

The POC exposes:

- `media-source://opendisplay_studio/test`
- `media-source://opendisplay_studio/dashboard`

Every resolution renders fresh HTML through the separate OpenDisplay Studio
Renderer App and exposes the PNG through a short-lived, unguessable Home
Assistant URL. The test screen includes the current Home Assistant-local time.

## Home Assistant OS / Supervised installation

1. Add this integration through HACS or copy `custom_components/opendisplay_studio`.
2. In **Settings > Apps > App store > Repositories**, add exactly:
   `https://github.com/Misiu/OpenDisplay-Studio-App`
3. Add the **OpenDisplay Studio** integration.
4. Confirm **Install Renderer**. The integration uses Home Assistant Core's
   `AddonManager` and config-flow progress UI to install, start, discover, and
   health-check the App.

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
also pass `/health` with API version 1.

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
```

## License

MIT
