"""The palettes are OpenDisplay's, and the renderer draws each color as listed."""

from __future__ import annotations

import json
import re
from pathlib import Path

import pytest
from odl_renderer.colors import ColorResolver

from custom_components.opendisplay_studio.palette import (
    PALETTE_BY_COLOR_SCHEME,
    PALETTE_COLORS,
    SUPPORTED_COLORS,
    accent_color_for_palette,
)
from custom_components.opendisplay_studio.validation import (
    DashboardValidationError,
    color,
)

PALETTES = json.loads(
    (
        Path(__file__).parent.parent
        / "custom_components/opendisplay_studio/palettes.json"
    ).read_text(encoding="utf-8")
)

# The color schemes a device can be configured with (`ColorScheme` of
# opendisplay_structs.h, values 0-8) and their number of colors. `GRAYSCALE_8` is not
# among them: the library keeps it for panels outside OpenDisplay and says never to send
# it to a device.
OPENDISPLAY_SCHEMES = {
    "MONO": 2,
    "BWR": 3,
    "BWY": 3,
    "BWRY": 4,
    "BWGBRY": 6,
    "BWGBRY_SPLIT": 6,
    "SEVEN_COLOR": 7,
    "GRAYSCALE_4": 4,
    "GRAYSCALE_16": 16,
}


def test_every_color_scheme_of_opendisplay_has_a_palette_of_its_size() -> None:
    assert set(PALETTE_BY_COLOR_SCHEME) == set(OPENDISPLAY_SCHEMES)
    for scheme, size in OPENDISPLAY_SCHEMES.items():
        palette = PALETTE_BY_COLOR_SCHEME[scheme]
        assert len(PALETTE_COLORS[palette]) == size, scheme


# The accent `ColorScheme.accent_color` gives the renderer, as the opendisplay
# integration passes it.
OPENDISPLAY_ACCENTS = {
    "MONO": "black",
    "BWR": "red",
    "BWY": "yellow",
    "BWRY": "red",
    "BWGBRY": "red",
    "BWGBRY_SPLIT": "red",
    "SEVEN_COLOR": "red",
    "GRAYSCALE_4": "black",
    "GRAYSCALE_16": "black",
}


def test_every_palette_has_the_accent_the_opendisplay_integration_uses() -> None:
    for scheme, accent in OPENDISPLAY_ACCENTS.items():
        palette = PALETTE_BY_COLOR_SCHEME[scheme]
        assert accent_color_for_palette(palette) == accent, scheme


@pytest.mark.parametrize("palette", sorted(PALETTES))
def test_a_palette_has_black_and_white_and_no_color_twice(palette: str) -> None:
    ids = [entry["id"] for entry in PALETTES[palette]["colors"]]
    values = PALETTE_COLORS[palette]

    assert {"black", "white"} <= set(ids)
    assert len(set(ids)) == len(ids)
    assert len(set(values)) == len(values)
    assert accent_color_for_palette(palette) in {*values, "red", "yellow", "black"}


@pytest.mark.parametrize("palette", sorted(PALETTES))
def test_the_renderer_draws_every_color_as_the_palette_lists_it(palette: str) -> None:
    resolver = ColorResolver(accent_color_for_palette(palette))

    for entry in PALETTES[palette]["colors"]:
        rgb = tuple(int(entry["hex"][i : i + 2], 16) for i in (1, 3, 5))
        assert resolver.resolve(entry["value"])[:3] == rgb, entry["id"]


def test_a_color_the_renderer_does_not_name_is_stored_as_its_hex() -> None:
    for palette in PALETTES.values():
        for entry in palette["colors"]:
            named = re.fullmatch(r"[a-z]+", entry["value"]) is not None
            assert named or entry["value"] == entry["hex"]


def test_gray_levels_and_orange_are_valid_colors() -> None:
    assert color("#555555", "primitive.color") == "#555555"
    assert color("white", "primitive.color") == "white"
    assert "#555555" in SUPPORTED_COLORS


@pytest.mark.parametrize("value", ["#123456", "gray1", "orange", "#fff", 5])
def test_a_color_outside_every_palette_is_rejected(value: object) -> None:
    with pytest.raises(DashboardValidationError):
        color(value, "primitive.color")
