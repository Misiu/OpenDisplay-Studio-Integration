"""Fit text into a width, measured with the renderer's own fonts."""

from __future__ import annotations

from custom_components.opendisplay_studio.measure import text_size

ELLIPSIS = "…"
DIGITS = "0123456789"


def text_width(value: str, size: int) -> int:
    """Return how many pixels wide `value` is when drawn at `size`."""
    return text_size(value, size)[0]


def widest_digits(value: str, size: int) -> str:
    """
    Return `value` with every digit written as the widest digit of the font at `size`.

    The digits of a font are not equally wide, so 24.1 and 25.4 are not equally wide
    either. A size chosen for this text fits whatever digits `value` has.
    """
    widest = max(DIGITS, key=lambda digit: text_width(digit, size))
    return "".join(widest if character.isdigit() else character for character in value)


def fit_text(
    value: str,
    width: int,
    maximum: int,
    minimum: int = 10,
    *,
    steady_digits: bool = False,
) -> int:
    """
    Return the largest font size between the limits at which `value` fits `width`.

    When even `minimum` is too wide the minimum is returned; use `truncate` to cut
    the text instead. With `steady_digits` the size depends on how long the value is
    and not on which digits it has, so cards showing 24.1 and 25.4 get the same size.
    """
    low, high = minimum, max(minimum, maximum)
    while low < high:
        middle = (low + high + 1) // 2
        measured = widest_digits(value, middle) if steady_digits else value
        if text_width(measured, middle) <= width:
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
