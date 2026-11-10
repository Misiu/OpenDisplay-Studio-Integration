"""The layout of a basic dashboard: a grid cut into regions, a widget in each."""

from __future__ import annotations

from typing import Any, Final

from .odl import Box
from .sdk.layout import grid
from .validation import fail, integer, string

MIN_LINES: Final = 1
MAX_LINES: Final = 12
DEFAULT_GAP: Final = 8
MAX_GAP: Final = 64
MAX_ID_LENGTH: Final = 64

type Layout = dict[str, Any]

LAYOUT_LIMITS: Final = {
    "minLines": MIN_LINES,
    "maxLines": MAX_LINES,
    "defaultGap": DEFAULT_GAP,
    "maxGap": MAX_GAP,
}


def working_area(width: int, height: int, padding: int) -> Box:
    """Return what is left of the display inside its padding."""
    return Box(padding, padding, width - 2 * padding, height - 2 * padding)


def grid_cells(area: Box, columns: int, rows: int, gap: int) -> list[Box]:
    """Return the cells of the grid in reading order, laid out by the SDK."""
    return grid(area, columns, rows, gap)


def region_frame(
    cells: list[Box], columns: int, region: dict[str, Any]
) -> dict[str, int]:
    """Return the frame of a region: from its first cell to its last."""
    first = cells[region["row"] * columns + region["column"]]
    last = cells[
        (region["row"] + region["rowSpan"] - 1) * columns
        + region["column"]
        + region["columnSpan"]
        - 1
    ]
    return {
        "x": first.x,
        "y": first.y,
        "width": last.x + last.width - first.x,
        "height": last.y + last.height - first.y,
    }


def _region(value: object, index: int, columns: int, rows: int) -> dict[str, Any]:
    name = f"layout.regions[{index}]"
    if not isinstance(value, dict):
        fail(f"{name} must be an object")
    region: dict[str, Any] = {
        "id": string(value.get("id"), f"{name}.id", MAX_ID_LENGTH),
        "row": integer(value.get("row"), f"{name}.row", 0, rows - 1),
        "column": integer(value.get("column"), f"{name}.column", 0, columns - 1),
        "rowSpan": integer(value.get("rowSpan"), f"{name}.rowSpan", 1, rows),
        "columnSpan": integer(
            value.get("columnSpan"), f"{name}.columnSpan", 1, columns
        ),
    }
    if (
        region["row"] + region["rowSpan"] > rows
        or region["column"] + region["columnSpan"] > columns
    ):
        fail(f"{name} reaches beyond the grid")
    return region


def _check_tiling(regions: list[dict[str, Any]], columns: int, rows: int) -> None:
    """Every cell of the grid belongs to exactly one region."""
    owners = [[0] * columns for _ in range(rows)]
    for region in regions:
        for row in range(region["row"], region["row"] + region["rowSpan"]):
            for column in range(
                region["column"], region["column"] + region["columnSpan"]
            ):
                owners[row][column] += 1
    if any(count != 1 for line in owners for count in line):
        fail("layout.regions must cover every cell of the grid exactly once")


def validate_layout(value: object) -> Layout:
    """Check the grid and its regions and return them in normal form."""
    if not isinstance(value, dict):
        fail("layout is required for a basic dashboard")
    columns = integer(value.get("columns"), "layout.columns", MIN_LINES, MAX_LINES)
    rows = integer(value.get("rows"), "layout.rows", MIN_LINES, MAX_LINES)
    gap = integer(value.get("gap", DEFAULT_GAP), "layout.gap", 0, MAX_GAP)
    raw = value.get("regions")
    if not isinstance(raw, list) or not raw:
        fail("layout.regions must be a list of regions")
    regions = [_region(item, index, columns, rows) for index, item in enumerate(raw)]
    if len({region["id"] for region in regions}) != len(regions):
        fail("layout.regions must have unique ids")
    _check_tiling(regions, columns, rows)
    return {"columns": columns, "rows": rows, "gap": gap, "regions": regions}


def apply_layout(
    items: list[dict[str, Any]], layout: Layout, display: dict[str, int]
) -> None:
    """
    Put each widget of a basic dashboard in the frame of its region.

    A basic dashboard holds widgets only, each in a region of its own. The frame a
    client sent is replaced: the layout is the one place that says where a widget is.
    """
    columns = layout["columns"]
    area = working_area(display["width"], display["height"], display["padding"])
    cells = grid_cells(area, columns, layout["rows"], layout["gap"])
    regions = {region["id"]: region for region in layout["regions"]}
    taken: set[str] = set()
    for item in items:
        if item["kind"] != "widget":
            fail("a basic dashboard holds widgets only")
        region_id = item.get("region")
        if not isinstance(region_id, str) or region_id not in regions:
            fail(f"{item['id']} needs a region of the layout")
        if region_id in taken:
            fail("a region holds one widget")
        taken.add(region_id)
        item["frame"] = region_frame(cells, columns, regions[region_id])
