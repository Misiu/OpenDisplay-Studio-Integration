"""How a widget looks: its ink, its paper, its frame and how round the frame is."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Final

from custom_components.opendisplay_studio.odl import Box, WidgetContext, clamp

BLACK: Final = "black"
WHITE: Final = "white"
DEFAULT_RADIUS: Final = 6


@dataclass(frozen=True, slots=True)
class Look:
    """
    The colors a widget draws with, from its appearance options.

    Ink is the color of everything drawn: text, icons, lines and the frame's outline.
    Paper is what is filled behind the widget when it has a frame; without one the
    widget draws only its content, on whatever lies behind it.
    """

    ink: str
    paper: str
    framed: bool
    radius: int

    @classmethod
    def of(cls, context: WidgetContext) -> Look:
        """Read the look from the options of a widget; the defaults are a plain card."""
        options = context.options
        return cls(
            ink=options.get("color", BLACK),
            paper=options.get("background", WHITE),
            framed=bool(options.get("showFrame", True)),
            radius=int(options.get("cornerRadius", DEFAULT_RADIUS)),
        )

    def frame(self) -> dict[str, Any]:
        """Return the container fields that paint the frame; none when it is off."""
        if not self.framed:
            return {}
        return {
            "background": self.paper,
            "border": self.ink,
            "border_width": 1,
            "radius": self.radius,
        }

    def message(self, box: Box, message: str) -> dict[str, Any]:
        """Return the frame of a widget with one centered line, for a missing source."""
        size = clamp(min(box.height // 5, box.width // 14), 10, 22)
        text = self.text(message, size=size, align="center", truncate=True)
        return {
            "type": "column",
            "justify": "center",
            "padding": 4,
            **self.frame(),
            "children": [text],
        }

    def text(self, value: object, **fields: Any) -> dict[str, Any]:
        """Return a text node in ink unless a color is given."""
        return {"type": "text", "value": str(value), "color": self.ink, **fields}

    def icon(self, name: str, **fields: Any) -> dict[str, Any]:
        """Return an icon node in ink unless a color is given."""
        return {"type": "icon", "value": name, "color": self.ink, **fields}

    def divider(self, **fields: Any) -> dict[str, Any]:
        """Return a thin line across the box it is placed in."""
        return {"type": "line", "fill": self.ink, **fields}

    def vertical_divider(self, height: int, **fields: Any) -> dict[str, Any]:
        """Return a one pixel wide line of `height`, for placing between columns."""
        return {
            "type": "rectangle",
            "w": 1,
            "h": height,
            "fill": self.ink,
            "outline": self.ink,
            "width": 0,
            **fields,
        }
