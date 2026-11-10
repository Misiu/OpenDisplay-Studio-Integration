"""A band of a dial ends along the radius, as the tick line of its value does."""

from __future__ import annotations

from math import atan2, degrees

import pytest
from odl_renderer import generate_image

from custom_components.opendisplay_studio.sdk.dial import Dial, band

CENTER = 100
RADIUS = 80
THICKNESS = 8
TOLERANCE = 1.0  # degrees: a pixel at the inner edge is about a degree wide
RED = (255, 0, 0)


async def angles_drawn(first: float, last: float) -> tuple[float, float]:
    """Return the first and last angle, from the center, that a band leaves ink at."""
    dial = Dial(CENTER, CENTER, RADIUS, 0, 360, 0, 360)
    elements = band(dial, first, last, thickness=THICKNESS, color="red")
    image = await generate_image(
        2 * CENTER, 2 * CENTER, elements, background="white", accent_color="red"
    )
    rgb = image.convert("RGB")
    seen = [
        # Measured from the start, so a band that crosses 0 degrees is not split in two.
        (degrees(atan2(y - CENTER, x - CENTER)) - first) % 360
        for y in range(rgb.height)
        for x in range(rgb.width)
        if rgb.getpixel((x, y)) == RED
    ]
    inside = [angle for angle in seen if angle <= (last - first) + 5]
    return first + min(inside), first + max(inside)


@pytest.mark.parametrize(
    ("first", "last"),
    [
        (200, 250),  # across the top left, a slanted cut
        (170, 215),
        (95, 175),  # the lower left
        (20, 60),
        (370, 390),  # near three o'clock, where the radius is nearly level
        (255, 285),  # around the top, where the radius is nearly upright
    ],
)
async def test_the_ends_of_a_band_lie_along_the_radius(
    first: float, last: float
) -> None:
    start, end = await angles_drawn(first, last)

    assert start == pytest.approx(first, abs=TOLERANCE)
    assert end == pytest.approx(last, abs=TOLERANCE)
