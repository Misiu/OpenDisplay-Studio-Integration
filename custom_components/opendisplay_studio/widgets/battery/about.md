Shows one battery entity as a battery that fills up in proportion to its charge, with
the percentage beside it (or under it in a tall frame). Pick a battery sensor (a
percentage) or a binary sensor that says whether its battery is low; the second is drawn
nearly empty and marked "Low", or full and marked "OK".

At or below **Low battery at or below** the battery and its text are drawn in the
highlight color of the display. The battery lies down in a wide frame and stands up in a
tall one, or as you choose with **Orientation**. The size of the text comes from the
frame and not from the number, so batteries of one size are laid out alike.

With **Percentage: inside the battery** the number is drawn in the middle of the
battery, which takes less room. It is outlined in the color of the background, whatever
the charge, so it reads on the fill and off it and looks the same at every level.

Turn off the name and the percentage (or put the percentage inside) and the battery fills the
whole widget: make the widget small and put it in a corner of the display to show the
charge of the e-paper display itself. **Style: segments** draws the charge as up to ten
rounded segments of one size, fewer when the battery is short; the segments that are full
follow the charge, rounded to the nearest, and at least one while there is any charge.
