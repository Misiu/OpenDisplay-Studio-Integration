"""Where the renderer turns each rotated primitive about, for the editor's frame."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, Final

from .flatten import translate_elements

if TYPE_CHECKING:
    from .rendering import OdlRenderService

# Their ink depends on a download or on recorded history, which is not worth fetching
# only to place a frame; the editor turns these about the middle of their box.
UNMEASURED_TYPES: Final = frozenset({"dlimg", "plot"})


async def async_find_pivots(  # noqa: PLR0913
    renderer: OdlRenderService,
    turned: dict[str, dict[str, Any]],
    *,
    width: int,
    height: int,
    margin: int,
    accent_color: str,
) -> dict[str, dict[str, float]]:
    """
    Return the middle of the ink of each turned primitive, in display coordinates.

    The renderer turns an element about the middle of what it drew, which is not the
    middle of the box the editor measures: a line of text has room above and below its
    letters. The picture has the preview's margin, so what hangs out of the display
    counts the way it does in the editor.
    """
    pivots: dict[str, dict[str, float]] = {}
    for item_id, element in turned.items():
        if element["type"] in UNMEASURED_TYPES:
            continue
        (shifted,) = translate_elements([element], margin, margin)
        ink = await renderer.async_ink_box(
            width=width + 2 * margin,
            height=height + 2 * margin,
            element=shifted,
            accent_color=accent_color,
        )
        if ink is None:
            continue
        left, top, right, bottom = ink
        pivots[item_id] = {
            "x": (left + right) / 2 - margin,
            "y": (top + bottom) / 2 - margin,
        }
    return pivots
