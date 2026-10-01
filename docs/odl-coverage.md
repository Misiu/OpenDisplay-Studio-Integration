# ODL coverage and renderer deltas

Which ODL draw types the editor offers, and where the editor deliberately
differs from `odl-renderer` (pinned in `manifest.json`, currently 0.5.13). The
renderer is the truth: when its behaviour and the ODL documentation disagree,
this file records the difference.

## Primitives in the editor

The editor offers every ODL draw type except `diagram` (see the gaps below).
Each is one file in `custom_components/opendisplay_studio/primitives/<type>.yml`;
the panel builds its library, fields and new-item defaults from these files and
the backend validates from the same data.

| Type | Geometry | Position and size | Other fields |
|---|---|---|---|
| `text` | point | x, y, size | value, color, anchor, max_width, truncate, font, align, spacing, stroke_width, stroke_fill, parse_colors |
| `multiline` | point | x, y, size, offset_y | value, delimiter, color, anchor, font, align, spacing, stroke_width, stroke_fill, parse_colors |
| `rectangle` | box | x_start, y_start, x_end, y_end | fill, outline, width, radius, corners |
| `rectangle_pattern` | pattern | x_start, y_start, x_size, y_size, x_offset, y_offset, x_repeat, y_repeat | fill, outline, width, radius, corners |
| `line` | line | x_start, y_start, x_end, y_end | fill, width, dashed, dash_length, space_length |
| `polygon` | points | points | fill, outline |
| `circle` | point | x, y, radius | fill, outline, width |
| `arc` | radial | x, y, radius, start_angle, end_angle | fill (pie slice), outline, width |
| `ellipse` | box | x_start, y_start, x_end, y_end | fill, outline, width |
| `icon` | point | x, y, size | value, fill, anchor, stroke_width, stroke_fill |
| `icon_sequence` | point | x, y, size | icons, direction, spacing, fill, anchor, stroke_width, stroke_fill |
| `qrcode` | point | x, y, boxsize | data, border, color, bgcolor |
| `dlimg` | image | x, y, xsize, ysize | url, resize_method, rotate |
| `progress_bar` | box | x_start, y_start, x_end, y_end | progress, direction, background, fill, outline, width, show_percentage, font_name |
| `plot` | box | x_start, y_start, x_end, y_end | data (1-4 series), duration, low, high, round_values, font, debug, ylegend, yaxis, xlegend, xaxis |
| `debug_grid` | canvas | none | spacing, line_color, dashed, dash_length, space_length, show_labels, label_step, label_color, label_font_size, font |

### Not in the editor (yet)

- `diagram`, `rotation`, `mirror` and `pivot`: out of scope (ROADMAP phase 4).
- Percentage coordinates (`"50%"`): every element is created with pixel
  coordinates, and the validator rejects percentages.
- Expressions inside a plot's series and axes: they are edited as literals. A
  template can drive any top-level field.
- `plot.value_scale` (per series).
- The font list holds the two fonts the renderer bundles (`ppb.ttf`, `rbm.ttf`);
  another name is accepted, but the backend does not yet pass `font_dirs`.
- The `points` of a polygon cannot be an expression inside a container: the
  container's offset would have to be added to every point of the result.

## Deltas

### Defaults differ from the renderer's

A new element starts from the definition's default, which the editor chose for
a useful first result. The renderer's own defaults apply only to fields an ODL
document leaves out.

| Field | Editor default | Renderer default |
|---|---|---|
| `text.size` | 32 | 20 |
| `qrcode.boxsize` | 3 | 2 |
| `multiline.offset_y` | 42 (1.3 x the default size) | required, no default |

### Item bounds are measured, not computed

The outline the panel draws comes from the backend (`compose_preview` ->
`itemBounds`). `measure.py` measures every type; most have a size that follows from
their fields. Text and QR codes do not, so the backend measures them with the
renderer's own code paths:

- **Text.** Its height is the font's ascent plus descent for every line
  (`odl_renderer.measure_text`), so it always contains the glyphs. Its width ends
  exactly where the widest line's ink ends: the renderer draws text without
  anti-aliasing, and outline metrics (even for that mode) include spacing after
  the last glyph, so the bitmap is drawn and its ink measured. Colour markup
  (`[red]...[/red]`) is not counted when `parse_colors` is on. The box sits where
  the anchor puts it: the first letter of a Pillow anchor is horizontal (left,
  middle, right), the second vertical (ascender or top, middle, baseline, bottom
  or descender). A multiline box is the union of its lines, `offset_y` apart.
- **QR code.** The renderer builds the code with `version=1` and `fit=True`, so
  the number of modules grows with the data (21 modules for a few bytes, 37 for a
  36-byte address, ...). The side in pixels is
  `(modules + 2 x border) x boxsize`. The measurement uses the same `qrcode`
  parameters. Data beyond what a code can hold at the renderer's error correction
  (1273 bytes) is rejected by validation instead of failing at render time.

The other shapes follow from their fields: an icon sequence covers
`size + spacing` per icon (spacing defaults to a quarter of the size), a pattern
draws each cell one pixel larger than its size, and a debug grid covers the whole
display.

`tests/test_measure.py` renders the elements through the real renderer and
compares the boxes with the ink in the PNG: exact for QR codes, within 1 px on
the right edge for text, and glyph ink always inside the text box.

The panel keeps a local estimate for these two types only until the first preview
arrives, and to move an element smoothly during a drag.

### Images, history and fonts are resolved before the renderer

- **`dlimg`.** The renderer loads absolute file paths and web addresses itself,
  which would read any file the process can and block the event loop. The
  backend (`images.py`) resolves `camera.*` and `image.*` entities, `/local/...`
  and `/media/<source>/...` to bytes (read in the executor, only inside the folders
  Home Assistant serves, at most 16 MB) and leaves `http(s)://` addresses and
  data URIs to the renderer. An image that cannot be loaded is left out and
  reported as a warning; the renderer would fail the whole picture.
- **`plot`.** The renderer asks a `DataProvider` for history while it draws.
  The backend (`history.py`) reads the recorder once per compile, for the longest
  span any plot asks for, and hands the renderer that history. A plot without
  numeric history, or without a running recorder, is left out with a warning
  instead of failing the picture.
- **Fonts.** A font is a file name or family, never a path.

### Palettes

The palettes are the color schemes of the `opendisplay` library (`epaper_dithering.ColorScheme`),
in `palettes.json`: `MONO` (`bw`), `BWR`, `BWY`, `BWRY`, `BWGBRY` and `BWGBRY_SPLIT`
(`spectra6`), `SEVEN_COLOR`, `GRAYSCALE_4`, `GRAYSCALE_8` and `GRAYSCALE_16`. The renderer
names black, white, red, yellow, blue and green; the gray levels (`#555555`, ...) and orange
(`#ff8000`) are stored as hex, because the renderer would draw an unknown name white.
`tests/test_palettes.py` renders every color through the real renderer and compares it with
the hex the panel draws. The accent follows the palette: yellow for `BWY` and `BWRY`, black for
the grays, red otherwise.
