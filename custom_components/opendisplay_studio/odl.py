"""Small typed helpers for producing OpenDisplay Language elements."""

from __future__ import annotations

from dataclasses import dataclass
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


@dataclass(frozen=True, slots=True)
class WidgetRenderContext:
    """Pure input supplied to a widget ODL renderer."""

    instance_id: str
    box: Box
    display: DisplayContext
    language: str
    config: dict[str, Any]
    data: dict[str, Any]


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
