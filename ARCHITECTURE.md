# Renderer App management decision record

Verified against the Home Assistant Core `dev` branch and Supervisor source on
2026-08-24. The source, rather than the illustrative API in the POC brief, is
the compatibility baseline.

## Core APIs used

- Supervisor detection uses `homeassistant.helpers.hassio.is_hassio`.
- App management uses `homeassistant.components.hassio.AddonManager` with
  `(hass, logger, addon_name, addon_slug)`.
- Store state, installation, startup, discovery, backup, and removal use only
  `AddonManager` methods.
- Installation and startup use the callback scheduling methods and await the
  returned tasks inside config-flow progress tasks, matching Z-Wave JS.
- Runtime recovery schedules work with `catch_error=True` and raises
  `ConfigEntryNotReady`, matching Matter's retry-oriented setup pattern.

References:

- [Core AddonManager](https://github.com/home-assistant/core/blob/dev/homeassistant/components/hassio/addon_manager.py)
- [Z-Wave JS config flow](https://github.com/home-assistant/core/blob/dev/homeassistant/components/zwave_js/config_flow.py)
- [Matter runtime setup](https://github.com/home-assistant/core/blob/dev/homeassistant/components/matter/__init__.py)

## Third-party repository boundary

No current Home Assistant Core integration was found that registers an
arbitrary third-party App repository through a supported Core abstraction.
The POC therefore requires the user to add
`https://github.com/Misiu/OpenDisplay-Studio-App` once. After Supervisor knows
that repository, all Renderer installation and lifecycle work is automatic.

The current Supervisor source derives a custom repository identifier as
`sha1(lowercase(repository URL))[:8]` and prefixes the App configuration slug.
For the exact URL above, the full slug passed to `AddonManager` is:

```text
bd833593_opendisplay_studio_renderer
```

References:

- [Supervisor store utilities](https://github.com/home-assistant/supervisor/blob/main/supervisor/store/utils.py)
- [Supervisor store slug construction](https://github.com/home-assistant/supervisor/blob/main/supervisor/store/data.py)
- [Supervisor endpoints](https://developers.home-assistant.io/docs/api/supervisor/endpoints/)

## Deferred `system_managed`

The config entry records whether this integration installed the App. It does
not yet use `system_managed` or `system_managed_config_entry`; Core issue
[#174919](https://github.com/home-assistant/core/issues/174919) still tracks
complete `AddonManager` support. The stored ownership flag leaves a migration
path without making the POC depend on incomplete behavior.
