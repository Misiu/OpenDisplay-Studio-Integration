# The properties panel of the reference designer, measured

Measured on the live editor (a dashboard open, a Label selected, 1440 × 900, dark theme)
with the browser's computed styles. Colors are the editor's own; ours come from the
Home Assistant theme tokens. This is the reference for `ods-property-field`,
`ods-value-field`, `ods-anchor-picker`, `ods-color-picker` and the panel sections.

## Sections

| Part | Measure |
|---|---|
| Panel width | 320 px (the grid inside is 291 px) |
| Section header | 38 px high, padding 0 14 px, gap 8 px; 11 px / 600, letter-spacing 0.045 em, uppercase, secondary color |
| Section body | padding 0 14 px; a 6-column grid with `gap: 10px 8px` |
| Long field | spans 6 columns (the whole row); short number fields span 3 (two per row) |
| Disclosure row (`Padding`, `Align in Parent`, `Advanced`) | 17 px high, 11 px text, 2 px top margin |

## Short numbers (X, Y, W, H)

- A **28 px high box**: padding 0 8 px, gap 6 px, 7 px radius, 0.8 px border at 6 % white,
  background 3 % white. Two per row with a 6 px gap.
- The **label sits inside** at the left (10 px, secondary color), then the value in a
  monospace 12 px input, then the **unit inside** at the right (`px`).
- An empty width or height means "auto" and says so in a hint under the grid.

## Long values

- **Label above**: 11 px / 500, secondary color, 4 px below it the control.
- Text: a textarea, 12 px, padding 8 px, 7 px radius, vertical resize, about 57 px high.
- Color: a **30 px high row** holding a swatch button, the value as 11 px monospace text and a
  14 px clear (×) button at the right. Clearing returns the color to the theme default.
- Choices of two or three words (`Regular | Bold`, `Wrap | Dot | Scroll | Clip | Loop`) are a
  **segmented control**; longer lists are a select.

## The color picker

- A **popover**, fixed, 256 px wide, padding 12 px, 12 px radius, shadow, titled `COLOR`
  (11 px / 600, uppercase) with a close button; its header drags it.
- On an e-paper display the picker lists **panel colours** only: a two-column grid of swatch
  and name buttons, and a `Custom colour…` link for a free color.

## Align in Parent (the model for the anchor picker)

- An inline 3 × 3 grid: nine **24 px** square buttons, `gap: 1px`, in a 5 px rounded
  container with 1 px padding. Each button has a 4 px round dot; the chosen one is lit.
- Buttons are titled `Top Left`, `Top Center`, `Top Right`, … `Bottom Right`.

## What we took, and where we differ

- Taken as measured: the 28 px short boxes with inner label and unit, the 10 px / 8 px grid
  gaps, the 38 px section headers, the 3 × 3 grid with 24 px cells, the popover with a titled
  header and close button, the panel-colours grid, the clear button.
- Different: only the colors of the display can be chosen (no free color), because a
  display cannot show others. The accent is offered as a color of its own. Every field has the
  24 px `{}` expression toggle beside it, which the LVGL editor has no use for.
- The anchor picker is also meant for position editing later ("Align in Parent"): it takes a
  value and reports one of nine places, and does not care what the place is used for.
