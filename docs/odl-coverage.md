# ODL coverage and renderer deltas

Which ODL draw types the editor offers, and where the editor deliberately
differs from `odl-renderer` (pinned in `manifest.json`, currently 0.5.13). The
renderer is the truth: when its behaviour and the ODL documentation disagree,
this file records the difference.

## Primitives in the editor

The editor offers 8 of the 16 ODL draw types. Each is one file in
`custom_components/opendisplay_studio/primitives/<type>.yml`; the panel builds
its library, fields and new-item defaults from these files and the backend
validates from the same data. The remaining types arrive in ROADMAP phase 4.

| Type | Geometry | Layout fields | Appearance fields |
|---|---|---|---|
| `text` | point | x, y, size | value, color |
| `rectangle` | box | x_start, y_start, x_end, y_end | fill, outline, width |
| `line` | line | x_start, y_start, x_end, y_end | fill, width, dashed |
| `circle` | point | x, y, radius | fill, outline, width |
| `ellipse` | box | x_start, y_start, x_end, y_end | fill, outline, width |
| `icon` | point | x, y, size | value, color |
| `qrcode` | point | x, y, boxsize | data, border, color, bgcolor |
| `progress_bar` | box | x_start, y_start, x_end, y_end | progress, direction, background, fill, outline, width, show_percentage |

## Deltas

### Defaults differ from the renderer's

A new element starts from the definition's default, which the editor chose for
a useful first result. The renderer's own defaults apply only to fields an ODL
document leaves out.

| Field | Editor default | Renderer default |
|---|---|---|
| `text.size` | 32 | 20 |
| `qrcode.boxsize` | 3 | 2 |

### Item bounds are measured, not computed

The outline the panel draws comes from the backend (`compose_preview` →
`itemBounds`). Most primitives have a size that follows from their fields. Two do
not, so the backend measures them with the renderer's own code paths:

- **Text.** The box starts at the text position. Its height is the font's ascent
  plus descent for every line (`odl_renderer.measure_text`), so it always
  contains the glyphs. Its width ends exactly where the widest line's ink ends:
  the renderer draws text without anti-aliasing, and outline metrics (even for
  that mode) include spacing after the last glyph, so the bitmap is drawn and its
  ink measured (`measure.py`). Colour markup (`[red]…[/red]`) is not counted.
- **QR code.** The renderer builds the code with `version=1` and `fit=True`, so
  the number of modules grows with the data (21 modules for a few bytes, 37 for a
  36-byte address, …). The side in pixels is
  `(modules + 2 × border) × boxsize`. The measurement uses the same `qrcode`
  parameters. Data beyond what a code can hold at the renderer's error correction
  (1273 bytes) is rejected by validation instead of failing at render time.

`tests/test_measure.py` renders the elements through the real renderer and
compares the boxes with the ink in the PNG: exact for QR codes, within 1 px on
the right edge for text, and glyph ink always inside the text box.

The panel keeps a local estimate for these two types only until the first preview
arrives, and to move an element smoothly during a drag.
