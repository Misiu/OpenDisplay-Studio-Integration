"""How a widget looks: its ink, its paper and whether it has a frame."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Final

from custom_components.opendisplay_studio.odl import WidgetContext

BLACK: Final = "black"
WHITE: Final = "white"
FRAME_RADIUS: Final = 2


@dataclass(frozen=True, slots=True)
class Look:
    """
    The colors a widget draws with, from its `invert` and `showFrame` options.

    Ink is what is drawn on paper: black on white, or white on black when inverted.
    A frame is the paper filled behind the widget with an outline in ink; without
    one the widget draws only its content, on whatever lies behind it.
    """

    ink: str
    paper: str
    framed: bool

    @classmethod
    def of(cls, context: WidgetContext) -> Look:
        """Read the look from the options of a widget; both default to a plain card."""
        inverted = bool(context.options.get("invert", False))
        return cls(
            ink=WHITE if inverted else BLACK,
            paper=BLACK if inverted else WHITE,
            framed=bool(context.options.get("showFrame", True)),
        )

    def frame(self) -> dict[str, Any]:
        """Return the container fields that paint the frame; none when it is off."""
        if not self.framed:
            return {}
        return {
            "background": self.paper,
            "border": self.ink,
            "border_width": 1,
            "radius": FRAME_RADIUS,
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
