"""The font a widget draws with: for the text it measures and the text it draws."""

from __future__ import annotations

from collections.abc import Callable, Iterator
from contextlib import contextmanager
from contextvars import ContextVar
from typing import Any, Final

from custom_components.opendisplay_studio.fonts import DEFAULT_FONT
from custom_components.opendisplay_studio.odl import WidgetContext

TEXT_TYPES: Final = frozenset({"text", "multiline"})

# Widgets measure text in dozens of places, with the font they draw with. It is set
# once for the whole render and read here, instead of being passed to every call.
_FONT: ContextVar[str] = ContextVar("widget_font", default=DEFAULT_FONT)


def current_font() -> str:
    """Return the font the widget being rendered measures its text with."""
    return _FONT.get()


@contextmanager
def measuring_with(font: str) -> Iterator[None]:
    """Measure text with `font` while the block runs."""
    token = _FONT.set(font)
    try:
        yield
    finally:
        _FONT.reset(token)


def with_font(nodes: list[dict[str, Any]], font: str) -> list[dict[str, Any]]:
    """
    Return `nodes` with `font` on every text that names none, containers' children too.

    The default font is left out, so a widget that keeps it gives the same ODL.
    """
    if font == DEFAULT_FONT:
        return nodes
    return [_with_font(node, font) for node in nodes]


def _with_font(node: dict[str, Any], font: str) -> dict[str, Any]:
    result = dict(node)
    if node.get("type") in TEXT_TYPES:
        result.setdefault("font", font)
    if "children" in node:
        result["children"] = with_font(node["children"], font)
    return result


def render_in_font(
    renderer: Callable[[WidgetContext], list[dict[str, Any]]], context: WidgetContext
) -> list[dict[str, Any]]:
    """
    Run a widget's renderer in the font its options choose, as the compiler does.

    Text is measured with the font and the text the renderer leaves without one is
    drawn with it. The devkit that draws the pictures of the docs uses this too.
    """
    font = context.options.get("font", DEFAULT_FONT)
    with measuring_with(font):
        return with_font(renderer(context), font)
