"""Lay a widget out with odl-layout: containers in, positioned ODL elements out."""

from __future__ import annotations

from typing import Any

from odl_layout import layout  # type: ignore[import-untyped]

from custom_components.opendisplay_studio.flatten import translate_elements
from custom_components.opendisplay_studio.fonts import DEFAULT_FONT
from custom_components.opendisplay_studio.odl import WidgetContext

from .typeface import with_font


def compose(
    context: WidgetContext, root: dict[str, Any] | list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """
    Return the ODL elements for `root`, laid out inside the box of the widget.

    `root` is a container (`row`, `column`, `stack`, `grid`, `list`) or a list of them
    as odl-layout describes them. It fills the box of the widget, which is laid out at
    its own size and then moved to where it lies on the display. Text is measured with
    the renderer's fonts, in the font the widget has chosen, so the first call reads a
    font file from disk.
    """
    nodes = with_font(
        root if isinstance(root, list) else [root],
        context.options.get("font", DEFAULT_FONT),
    )
    box = context.box
    elements: list[dict[str, Any]] = layout(
        nodes, box.width, box.height, list(context.display.font_dirs)
    )
    return translate_elements(elements, box.x, box.y)
