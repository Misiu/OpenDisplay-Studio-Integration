# OpenDisplay Studio v3 architecture

The project document is the only persisted source of truth. It contains display
settings, a pixel-based working area, semantic widgets, and raw ODL primitives.
The ordered item array is also the rendering layer order. Items may overlap and
carry persistent visibility and position-lock flags.

The frontend edits that document through Home Assistant WebSocket commands. It
does not persist projects in `localStorage` and does not render widgets with a
parallel HTML/CSS implementation.

For both preview and Media Source resolution, the backend performs the same
steps:

1. validate the v3 project;
2. collect and deduplicate widget data requirements;
3. resolve normalized Home Assistant data;
4. use the persisted absolute pixel frames and primitive coordinates;
5. compile widgets and primitives into one ordered ODL element list;
6. render the list with the pinned `odl-renderer` package;
7. validate exact PNG dimensions and publish a short-lived token URL.

The frontend receives the PNG, generated YAML, authoritative item bounds,
warnings, and timings. The editing overlay uses those bounds for selection and
only applies an optimistic local position while a pointer gesture is active.

Rendering is protected by a bounded semaphore. Timings cover queue wait, data
resolution, compilation, ODL rendering, PNG encoding, and the complete
pipeline. No separate Renderer App or browser process is involved.
