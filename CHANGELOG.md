# Changelog

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
