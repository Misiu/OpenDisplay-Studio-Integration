"""Small typed helpers for producing OpenDisplay Language elements."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass(frozen=True, slots=True)
class Box:
    """A pixel-aligned rectangle using an exclusive right and bottom edge."""

    x: int
    y: int
    width: int
    height: int

    @property
    def right(self) -> int:
        """Return the exclusive right edge."""
        return self.x + self.width

    @property
    def bottom(self) -> int:
        """Return the exclusive bottom edge."""
        return self.y + self.height

    def inset(self, amount: int) -> Box:
        """Return a clamped inset box."""
        amount = max(0, min(amount, (min(self.width, self.height) - 1) // 2))
        return Box(
            self.x + amount,
            self.y + amount,
            max(1, self.width - amount * 2),
            max(1, self.height - amount * 2),
        )

    def moved(self, dx: int, dy: int) -> Box:
        """Return the box shifted by the offset."""
        return Box(self.x + dx, self.y + dy, self.width, self.height)

    def as_dict(self) -> dict[str, int]:
        """Return the frontend transport representation."""
        return {"x": self.x, "y": self.y, "width": self.width, "height": self.height}


@dataclass(frozen=True, slots=True)
class DisplayContext:
    """Stable renderer-facing display settings."""

    width: int
    height: int
    palette: str
    background: str
    accent_color: str
    # Folders searched for a font by name, the same the renderer is given.
    font_dirs: tuple[str, ...] = ()


@dataclass(frozen=True, slots=True)
class WidgetContext:
    """
    Pure input supplied to a widget's ODL renderer.

    `sources` holds what the user picked for each source key, in pick order, with
    its per-source fields; `data` holds what the provider resolved for the same
    picks, so `data[key][i]` belongs to `sources[key][i]`.
    """

    instance_id: str
    box: Box
    display: DisplayContext
    language: str
    options: dict[str, Any]
    sources: dict[str, list[dict[str, Any]]]
    data: dict[str, list[Any]]
    now: datetime
    strings: dict[str, str] = field(default_factory=dict)

    def t(self, key: str, **values: object) -> str:
        """Return the package's runtime string for the dashboard language."""
        template = self.strings.get(key, key)
        return template.format(**values) if values else template


def clamp(value: int, minimum: int, maximum: int) -> int:
    """Clamp one integer to an inclusive range."""
    return max(minimum, min(value, maximum))


def text(
    value: object,
    *,
    x: int,
    y: int,
    size: int = 20,
    color: str = "black",
    anchor: str = "lt",
    max_width: int | None = None,
    truncate: bool = False,
) -> dict[str, Any]:
    """Build one ODL text element."""
    element: dict[str, Any] = {
        "type": "text",
        "value": str(value),
        "x": x,
        "y": y,
        "size": size,
        "color": color,
        "anchor": anchor,
    }
    if max_width is not None:
        element["max_width"] = max_width
        element["truncate"] = truncate
    return element


def rectangle(
    box: Box,
    *,
    fill: str | None = None,
    outline: str = "black",
    width: int = 1,
    radius: int = 0,
) -> dict[str, Any]:
    """Build one ODL rectangle element."""
    return {
        "type": "rectangle",
        "x_start": box.x,
        "y_start": box.y,
        "x_end": box.right - 1,
        "y_end": box.bottom - 1,
        "fill": fill,
        "outline": outline,
        "width": width,
        "radius": radius,
    }


def icon(
    name: str,
    *,
    x: int,
    y: int,
    size: int,
    color: str = "black",
    anchor: str = "lt",
) -> dict[str, Any]:
    """Build one ODL icon element; `name` is a Material Design Icons name."""
    return {
        "type": "icon",
        "value": name,
        "x": x,
        "y": y,
        "size": size,
        "color": color,
        "anchor": anchor,
    }


def line(
    start: tuple[int, int],
    end: tuple[int, int],
    *,
    color: str = "black",
    width: int = 1,
) -> dict[str, Any]:
    """Build one ODL line element between two points."""
    return {
        "type": "line",
        "x_start": start[0],
        "y_start": start[1],
        "x_end": end[0],
        "y_end": end[1],
        "fill": color,
        "width": width,
    }


def progress_bar(
    box: Box,
    *,
    progress: int,
    fill: str = "black",
    background: str = "white",
    outline: str = "black",
) -> dict[str, Any]:
    """Build one ODL progress bar filling `box` to `progress` percent."""
    return {
        "type": "progress_bar",
        "x_start": box.x,
        "y_start": box.y,
        "x_end": box.right - 1,
        "y_end": box.bottom - 1,
        "progress": clamp(progress, 0, 100),
        "direction": "right",
        "fill": fill,
        "background": background,
        "outline": outline,
        "width": 1,
        "show_percentage": False,
    }
