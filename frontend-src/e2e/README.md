# Editor end-to-end tests

The Playwright suite exercises the ODL-native designer with deterministic Home
Assistant WebSocket responses. It uses real mouse pointer sequences to verify
dashboard loading, catalog-to-canvas drops across the panel shadow boundary,
selection, movement, resizing, visibility, locking, layer reordering and its
insertion marker, Undo/Redo, confirmed deletion, canvas stability, pan/zoom,
collapsible and resizable panels, generated ODL, and timing diagnostics.

```shell
npm run test:e2e
```

The suite starts and stops its own Vite server on `127.0.0.1:4173`. It does not
reuse an arbitrary process already listening on that port, so every run tests
the current checkout.
