"""Waste collection: when each bin is collected, the nearest dates highlighted."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Final

from custom_components.opendisplay_studio.sdk import (
    Look,
    WidgetContext,
    clamp,
    compose,
    fit_text,
    line_height,
)

MIN_TEXT: Final = 10
MAX_TEXT: Final = 56
LINE_GAP: Final = 2
PADDING: Final = 4
DIVIDER: Final = 3
# Days a due text has to fit, so its size does not depend on how soon a bin is due.
WIDEST_DAYS: Final = 88
# Wide and tall frames line the bins up in a row or a column, not in a square.
WIDE_FOR_TWO: Final = 1.2
WIDE_FOR_THREE: Final = 2.4
TALL_FOR_THREE: Final = 0.7
WIDE_FOR_FOUR: Final = 4.0
TALL_FOR_FOUR: Final = 0.3
ICON_SHARE: Final = 0.9
ICON_WIDTH_SHARE: Final = 0.5
# How much of the disc width texts keep clear: the disc curves away at the corners.
ICON_CLEARANCE: Final = 0.6
MIN_ICON: Final = 24
MAX_ICON: Final = 120
TRASH_SHARE: Final = 0.72
NO_DATE: Final = "--"


@dataclass(frozen=True, slots=True)
class Bin:
    """One bin: its name, days until it is collected and its highlight color."""

    name: str
    days: int | None
    color: str

    def due_soon(self, highlight_days: int) -> bool:
        """Return whether the collection is near enough to be highlighted."""
        return self.days is not None and self.days <= highlight_days


def _days_until(start: datetime | None, today: datetime) -> int | None:
    """Return whole days from today to the start; an event under way counts as today."""
    if start is None:
        return None
    return max(0, (start.date() - today.date()).days)


def _bins(context: WidgetContext) -> list[Bin]:
    found: list[Bin] = []
    for pick, data in zip(context.sources["bins"], context.data["bins"], strict=True):
        found.append(
            Bin(
                name=pick.get("label") or data["name"],
                days=_days_until(data["start"], context.now),
                color=pick.get("color") or context.options["alertColor"],
            )
        )
    return found


def _due_text(context: WidgetContext, days: int | None) -> str:
    """Return when a bin is collected, in the words of the dashboard's language."""
    if days is None:
        return NO_DATE
    if days == 0:
        return context.t("today")
    if days == 1:
        return context.t("tomorrow")
    return context.t("in_days", count=days)


def _shape(count: int, width: int, height: int) -> tuple[int, int]:
    """Return the columns and rows the bins are laid out in for this frame."""
    ratio = width / height
    if count == 1:
        return 1, 1
    if count == 2:
        return (2, 1) if ratio >= WIDE_FOR_TWO else (1, 2)
    if count == 3:
        if ratio >= WIDE_FOR_THREE:
            return 3, 1
        return (1, 3) if ratio <= TALL_FOR_THREE else (2, 2)
    if ratio >= WIDE_FOR_FOUR:
        return 4, 1
    return (1, 4) if ratio <= TALL_FOR_FOUR else (2, 2)


def _tallest_pair(height: int) -> int:
    """Return the largest size at which a name over a date fits `height`."""
    size = MAX_TEXT
    while size > MIN_TEXT and 2 * line_height(size) + LINE_GAP > height:
        size -= 1
    return size


def _icon_side(cell: tuple[int, int]) -> int:
    """Return the width of the disc the bin is drawn on, from the size of a cell."""
    reach = min(cell[1], cell[0] * ICON_WIDTH_SHARE)
    return clamp(round(reach * ICON_SHARE), MIN_ICON, MAX_ICON)


def _text_sizes(
    context: WidgetContext, bins: list[Bin], cell: tuple[int, int], reserved: int
) -> tuple[int, int]:
    """
    Return the size of the names and of the dates, the same for every cell.

    The sizes come from the cell and the longest text there can be, not from the text of
    one bin, so every cell lays out the same however soon its bin is due. `reserved`
    is the width of the disc in the middle, which no text may reach.
    """
    width, height = cell
    room = max(MIN_TEXT, width - 2 * PADDING - reserved)
    ceiling = _tallest_pair(height - 2 * PADDING)
    name_size = min(fit_text(bin_.name, room, ceiling, MIN_TEXT) for bin_ in bins)
    widest = max(
        (_due_text(context, days) for days in (0, 1, WIDEST_DAYS)),
        key=len,
    )
    due_size = fit_text(widest, room, ceiling, MIN_TEXT, steady_digits=True)
    size = min(name_size, due_size)
    return size, size


def _cell(
    context: WidgetContext,
    look: Look,
    bin_: Bin | None,
    sizes: tuple[int, int],
) -> dict[str, Any]:
    """One cell: the name over the date, filled with the highlight when due soon."""
    name_size, due_size = sizes
    soon = bin_ is not None and bin_.due_soon(context.options["highlightDays"])
    ink = look.paper if soon else look.ink
    cell: dict[str, Any] = {
        "type": "column",
        "justify": "center",
        "gap": LINE_GAP,
        "padding": PADDING,
        "background": bin_.color if soon and bin_ else look.paper,
        "children": [],
    }
    if bin_ is None:
        return cell
    cell["children"] = [
        look.text(
            bin_.name,
            size=name_size,
            color=ink,
            align="center",
            truncate=True,
            h=line_height(name_size),
        ),
        look.text(
            _due_text(context, bin_.days),
            size=due_size,
            color=ink,
            align="center",
            h=line_height(due_size),
        ),
    ]
    return cell


def _bin_icon(look: Look, color: str, side: int) -> list[dict[str, Any]]:
    """Return the bin drawn over the crossing of the dividers, on a disc of paper."""
    centered = {"align_self": "center", "valign_self": "center"}
    return [
        look.icon("circle", size=side, color=look.paper, **centered),
        look.icon(
            "trash-can",
            size=round(side * TRASH_SHARE),
            color=color,
            **centered,
        ),
    ]


def render(context: WidgetContext) -> list[dict[str, Any]]:
    """Draw the bins as cells of a grid, or say that no calendar is picked."""
    look = Look.of(context)
    if not context.sources["bins"]:
        return compose(
            context, look.message(context.box, context.t("choose_calendars"))
        )
    bins = _bins(context)
    columns, rows = _shape(len(bins), context.box.width, context.box.height)
    inner_width = context.box.width - 2 * PADDING
    inner_height = context.box.height - 2 * PADDING
    gap = DIVIDER if context.options["showDividers"] else 0
    cell_size = (
        (inner_width - gap * (columns - 1)) // columns,
        (inner_height - gap * (rows - 1)) // rows,
    )
    with_icon = context.options["showIcon"] and (columns, rows) == (2, 2)
    icon_side = _icon_side(cell_size) if with_icon else 0
    sizes = _text_sizes(context, bins, cell_size, round(icon_side * ICON_CLEARANCE))
    cells = [
        _cell(context, look, bin_, sizes)
        for bin_ in [*bins, *[None] * (columns * rows - len(bins))]
    ]
    # Cells of whole pixels: what is left over stays outside the grid, so the color of
    # the dividers never shows along the right and bottom edge.
    grid = {
        "type": "grid",
        "cols": columns,
        "gap": gap,
        "w": cell_size[0] * columns + gap * (columns - 1),
        "h": cell_size[1] * rows + gap * (rows - 1),
        "align_self": "center",
        "valign_self": "center",
        "background": context.options["alertColor"] if gap else look.paper,
        "children": cells,
    }
    layers = [grid]
    if with_icon:
        layers += _bin_icon(look, context.options["alertColor"], icon_side)
    return compose(
        context,
        {
            "type": "column",
            "padding": PADDING,
            **look.frame(),
            "children": [{"type": "stack", "grow": 1, "children": layers}],
        },
    )


RENDERER = render
