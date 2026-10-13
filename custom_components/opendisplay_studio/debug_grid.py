"""The debug grid, drawn over the display and not over the editor's margin."""

from __future__ import annotations

from typing import Any, Final

DEBUG_GRID: Final = "debug_grid"

# The renderer's own defaults for the fields of a debug grid element.
DEFAULT_SPACING: Final = 20
DEFAULT_DASH_LENGTH: Final = 2
DEFAULT_SPACE_LENGTH: Final = 4
DEFAULT_LABEL_SIZE: Final = 12
DEFAULT_FONT: Final = "ppb.ttf"
LABEL_INSET: Final = 2


def expand_debug_grids(
    elements: list[dict[str, Any]], width: int, height: int
) -> list[dict[str, Any]]:
    """
    Return the elements with every debug grid replaced by the lines and labels it draws.

    The renderer draws a debug grid over the whole picture from its top-left corner.
    The editor's picture is larger than the display by a margin, so the grid would start
    outside the display and its labels would not be the display's coordinates. As lines
    and text the grid covers the display only and can be moved into the margin with the
    other elements.
    """
    expanded: list[dict[str, Any]] = []
    for element in elements:
        if element.get("type") == DEBUG_GRID:
            expanded.extend(grid_elements(element, width, height))
        else:
            expanded.append(element)
    return expanded


def grid_elements(
    grid: dict[str, Any], width: int, height: int
) -> list[dict[str, Any]]:
    """Return the lines and labels of a debug grid over a display of the given size."""
    spacing = grid.get("spacing", DEFAULT_SPACING)
    label_step = grid.get("label_step", spacing * 2)
    show_labels = grid.get("show_labels", True)

    elements: list[dict[str, Any]] = []
    for y in range(0, height, spacing):
        elements.append(grid_line(grid, (0, y), (width, y)))
        if show_labels and y % label_step == 0:
            elements.append(grid_label(grid, str(y), LABEL_INSET, y + LABEL_INSET))
    for x in range(0, width, spacing):
        elements.append(grid_line(grid, (x, 0), (x, height)))
        if show_labels and x % label_step == 0:
            elements.append(grid_label(grid, str(x), x + LABEL_INSET, LABEL_INSET))
    return elements


def grid_line(
    grid: dict[str, Any], start: tuple[int, int], end: tuple[int, int]
) -> dict[str, Any]:
    """Return one line of the grid, dashed as the grid asks."""
    line: dict[str, Any] = {
        "type": "line",
        "x_start": start[0],
        "y_start": start[1],
        "x_end": end[0],
        "y_end": end[1],
        "fill": grid.get("line_color", "black"),
        "width": 1,
    }
    if grid.get("dashed", True):
        line["dashed"] = True
        line["dash_length"] = grid.get("dash_length", DEFAULT_DASH_LENGTH)
        line["space_length"] = grid.get("space_length", DEFAULT_SPACE_LENGTH)
    return line


def grid_label(grid: dict[str, Any], value: str, x: int, y: int) -> dict[str, Any]:
    """Return the coordinate label drawn at the top-left of its position."""
    return {
        "type": "text",
        "value": value,
        "x": x,
        "y": y,
        "anchor": "la",
        "size": grid.get("label_font_size", DEFAULT_LABEL_SIZE),
        "font": grid.get("font", DEFAULT_FONT),
        "color": grid.get("label_color", "black"),
    }
