# Changelog

## Unreleased

## 0.5.0

- Introduce self-contained widget packages under `opendisplay_studio/widgets`.
  Templates, selectors, translations, and optional Python data providers now
  ship with their owning widget and can be updated independently.
- Discover locally installed widget packages without hardcoded widget IDs and
  expose backend-only community widgets in the Studio picker.
- Scope providers to their owning package, preventing name collisions between
  independently installed community widgets.
- Use the project language across live preview, Media Source, and physical
  output. Weather reuses Home Assistant condition translations and carries its
  own English and Polish presentation vocabulary.
- Require Renderer App 0.5.0 so the public suite has one compatible release
  line for exact previews and final images.

- Make the Weather data contract total: current conditions render when the
  entity is not selected, forecast data is absent, or `weather.get_forecasts`
  fails.
- Fix successful unsaved previews crashing in diagnostic logging when the
  normalized project has no `id`.
- Use the corrected Home Assistant discovery service name.

## 0.3.5

- Restore display creation when Home Assistant is served from a context where
  `crypto.randomUUID()` is unavailable.
- Store one shared Renderer client for both designer previews and final Media
  Source images, avoiding config-entry state timing races.
- Preserve Home Assistant WebSocket error messages in the panel and add
  backend exception diagnostics for failed live previews.

## 0.3.4

- Render the designer preview through the configured Renderer App, making the
  preview and final Media Source PNG use the same pipeline.
- Preserve physical device dimensions independently from responsive region
  dimensions and remove editor-only region borders from rendered output.
- Report Renderer and total pipeline timings and surface preview failures
  instead of falling back to a misleading local approximation.

## 0.3.3

- Add the adaptive Weather widget with a native Home Assistant weather entity
  selector and live designer preview.
- Resolve current conditions from entity state and daily forecasts through
  `weather.get_forecasts`, deduplicated across regions.
- Allow widget packages to provide native Home Assistant selector schemas while
  keeping executable provider code inside the integration.

## 0.3.2

- Make the designer preview use the live Liquid/TRMNL HTML composed by the
  integration instead of separate frontend sample values.
- Rebuild Entity State as an adaptive square, wide, or tall tile with current
  Home Assistant state, unit, friendly name, and a local device-class icon.
- Add Entity State controls for icon/name visibility and preserve their
  defaults for projects created with earlier versions.
- Add the missing TRMNL screen-size classes and verify the 800 × 480 output in
  the persistent Renderer App at 178.5 ms warm render time.

## 0.3.1

- Stop bundling and registering a private WebAwesome copy in the Home Assistant
  panel; use the host-provided `ha-button` component like the Matter and ZHA
  panels do.
- Add a release regression check that rejects bundled `wa-*` and `ha-*`
  component registrations.
- Validate the integration test suite against Home Assistant 2026.8.2.

## 0.3.0

- Move the accepted ODX designer into an admin-only Home Assistant panel.
- Add server-owned project IDs, versioned HA storage, Draft/Ready lifecycle,
  predefined/custom displays, editable grids, and graphical regions.
- Add schema-driven Entity State, Calendar, and Text widget configuration with
  Home Assistant entity selectors.
- Add declarative one/many/optional data requirements, deduplicated Entity State
  and Calendar providers, normalized widget data, and one-page Liquid/TRMNL
  composition.
- Expose every Ready project at a stable dynamic Media Source URI.
- Add frontend CI, TypeScript checks, Vitest coverage, and committed local panel
  bundle verification.

## 0.2.0

- Add bounded Liquid processing before the Renderer call with separate timing.
- Add ten Stage 2 TRMNL documents across three dimensions and BW/BWR/BWRY modes.
- Add Polish glyph, missing/empty data, malformed template, resource-limit, and
  dynamic timestamp coverage.
- Require Renderer health to expose its pinned TRMNL Framework version.

## 0.1.0

- Add managed Renderer App installation/start/recovery through Core AddonManager.
- Add two dynamic image Media Sources and a short-lived PNG endpoint.
- Add renderer health/API compatibility checks and render timing logging.
- Add HACS validation and semantic release CI/CD.
