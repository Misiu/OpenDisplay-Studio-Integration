"""Fit text into a width, measured with the renderer's own fonts."""

from __future__ import annotations

from custom_components.opendisplay_studio.measure import text_size

ELLIPSIS = "…"


def text_width(value: str, size: int) -> int:
    """Return how many pixels wide `value` is when drawn at `size`."""
    return text_size(value, size)[0]


def fit_text(value: str, width: int, maximum: int, minimum: int = 10) -> int:
    """
    Return the largest font size between the limits at which `value` fits `width`.

    When even `minimum` is too wide the minimum is returned; use `truncate` to cut
    the text instead.
    """
    low, high = minimum, max(minimum, maximum)
    while low < high:
        middle = (low + high + 1) // 2
        if text_width(value, middle) <= width:
            low = middle
        else:
            high = middle - 1
    return low


def truncate(value: str, width: int, size: int) -> str:
    """Cut `value` with an ellipsis so it is at most `width` pixels wide at `size`."""
    if text_width(value, size) <= width:
        return value
    low, high = 0, len(value)
    while low < high:
        middle = (low + high + 1) // 2
        if text_width(value[:middle].rstrip() + ELLIPSIS, size) <= width:
            low = middle
        else:
            high = middle - 1
    return value[:low].rstrip() + ELLIPSIS if low else ELLIPSIS


def line_height(size: int) -> int:
    """Return the height in pixels of one line of text at `size`."""
    return text_size("Ag", size)[1]
