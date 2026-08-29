# Changelog

## Unreleased

## 0.9.5

- Add self-contained Section Title and Hero Weather widgets with English and
  Polish localization, Home Assistant weather data, and palette-aware colors.
- Add palette color selectors whose available choices follow the selected
  display capabilities instead of exposing unsupported colors.
- Add display-level corner radius and optional per-region overrides, applying
  the same clipped geometry in the editor, live preview, and final render.
- Expand unit, editor, and cross-platform visual regression coverage for the
  new widgets, palette selection, and rounded region rendering.

## 0.9.0

- Treat the logical grid as an editor aid and render only explicitly composed
  regions, leaving all inactive cells open to the display background.
- Add independent per-region controls for a transparent or opaque surface and
  an optional border; transparent regions also suppress the widget root
  background.
- Add display-level Screen padding and Region gap controls in native output
  pixels and use the same geometry in Studio previews and final Renderer
  output.

## 0.8.2

- Keep the interactive region-composition grid aligned with the rendered
  region overlay at high grid densities such as 12 × 8.

## 0.8.1

- Keep the selected display background visible while composing regions by
  rendering layout previews without widget surfaces and applying translucent
  editing overlays locally.
- Prevent long Home Assistant Media identifiers from widening the layout
  inspector and show a concise media title when metadata is unavailable.
- Add an accessible collapse control for the saved-display rail to provide
  more working space without changing the display canvas.

## 0.8.0

- Add display backgrounds selected through Home Assistant Media with Stretch,
  Fit, Cover, and natural-size Manual modes plus a nine-point anchor.
- Render layout drafts through the exact Renderer preview so background fit,
  position, and scale match final Media Source images before applying changes.
- Keep background rendering local by validating bounded PNG, JPEG, and WebP
  media and embedding it directly in the composed screen document.

## 0.7.2

- Display widget package labels for Home Assistant selector fields instead of
  exposing raw configuration keys such as `showEntityId` and `showFooter`.
- Restore a theme-independent red selection outline and add keyboard selection
  and focus states for display regions.

## 0.7.1

- Add independent Sensor and Weather options for hiding the entity label or
  the complete footer while preserving entity update timestamps.
- Default new displays to the Seeed Studio 7.5-inch DIY EE04 profile and keep
  the device selector synchronized with the previewed profile.

## 0.7.0

- Replace the bundled Entity State widget with the focused Sensor widget and
  use Home Assistant's native sensor entity selector.
- Resolve sensor names, units, values, timestamps, and Material Design icons
  from Home Assistant, including official device-class icon resources.
- Keep the Sensor data provider, Liquid template, styles, and English/Polish
  translations inside its self-contained widget package.
- Add responsive Sensor compositions for full, wide, tall, quadrant, dense
  3x3, and small displays with the shared Weather-style footer.
- Remove integration-global Entity State presentation CSS so package-owned
  widgets render consistently in CLI previews, Studio previews, and final
  Renderer output.
- Breaking: the widget ID `entity-state` is now `sensor`; existing test
  projects using the old widget must select Sensor again.

## 0.6.1

- Use Supervisor discovery only for Renderer transport details and verify API
  compatibility through the authenticated health endpoint, allowing clean
  upgrades while discovery identity metadata is briefly stale.
- Accept numeric discovery ports serialized as either JSON numbers or strings
  and log sanitized diagnostics when transport data is invalid.

## 0.6.0

- Resolve package-owned files from `widgets/<id>/assets` into bounded `data:`
  URIs exposed to Liquid through the `assets` mapping.
- Replace all Weather network images with locally bundled Material Design Icon
  classes and require Renderer App 0.6.0.
- Add package-level `permissions.network.allowedOrigins`; widgets remain
  local-only by default and only origins actually used by a screen are passed
  to Renderer API v2.

## 0.5.1

- Replace the integration-owned Liquid subset with `trmnl-liquid-py` 0.1.0,
  matching the supported non-I18n TRMNL Liquid 0.8.2 rendering surface.
- Validate every bundled widget template against the shared TRMNL engine and
  cover lax missing-data and inline-template behavior with regression tests.
- Add project-level light and dark TRMNL themes.
- Add project-level default, classic, and TRMNL font families plus four text scales.
- Add a short-wide Weather composition for dense grids such as 800×480 at 3×3.
- Verify bundled Home Assistant brand icon dimensions in CI.

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
