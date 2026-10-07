"""Text sizes of a calendar view, scaled to the height of its frame."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Final

from custom_components.opendisplay_studio.sdk import clamp

ZOOM: Final = 1.25


@dataclass(frozen=True, slots=True)
class Sizes:
    """The font sizes a view draws with."""

    heading: int
    title: int
    small: int


def sizes_for(height: int, *, zoom: bool) -> Sizes:
    """Return the sizes for a frame `height` pixels high, larger when `zoom`."""
    scale = ZOOM if zoom else 1.0
    return Sizes(
        heading=clamp(round(height / 27 * scale), 12, 28),
        title=clamp(round(height / 30 * scale), 11, 26),
        small=clamp(round(height / 38 * scale), 10, 20),
    )
