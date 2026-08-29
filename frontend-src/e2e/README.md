# Editor end-to-end tests

The Playwright suite exercises OpenDisplay Studio through the same development panel used for local frontend work. The harness supplies deterministic Home Assistant projects, entities, widget metadata, preview images, and WebSocket responses.

## Coverage

- display creation, selection, rename, duplication, readiness, deletion, and rail collapse;
- device, resolution, palette, theme, typography, orientation, and grid editing;
- background selection, fit mode, anchor, manual scale, removal, screen padding, and region gap;
- dense 12×8 grid alignment plus region creation and removal;
- region background and border independence;
- assignment and configuration of every bundled widget type;
- keyboard interaction and renderer/bootstrap error states;
- visual baselines for the main widget workspace, dense background layout, transparent bordered region, and narrow inspector.

## Commands

```shell
npm run test:e2e
npm run test:e2e:update
```

Run `test:e2e:update` only after reviewing the intended UI change. Commit the updated PNG files with the code change. CI uploads the Playwright HTML report, screenshots, and traces when a test fails.

Visual baselines are stored separately for Windows and Linux. After an intentional visual change, refresh the Linux baselines in the same container used for verification:

```shell
docker run --rm -v "$PWD:/work" -v odx_frontend_node_modules:/work/frontend-src/node_modules -w /work/frontend-src mcr.microsoft.com/playwright:v1.62.1-noble bash -lc "npm ci && npm run test:e2e:update && npm run test:e2e"
```
