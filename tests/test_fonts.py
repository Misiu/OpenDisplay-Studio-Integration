"""Fonts the user installs next to the ones the renderer ships with."""

from __future__ import annotations

import shutil
from pathlib import Path
from typing import TYPE_CHECKING

import odl_renderer
import pytest
from odl_renderer import generate_image  # type: ignore[import-untyped]
from PIL import ImageChops

from custom_components.opendisplay_studio import measure
from custom_components.opendisplay_studio.fonts import (
    BUNDLED_FONTS,
    available_fonts,
    with_font_options,
)
from custom_components.opendisplay_studio.primitives import DEFAULT_PRIMITIVES

if TYPE_CHECKING:
    from collections.abc import Iterator

BUNDLED_FONT_FILE = Path(odl_renderer.__file__).parent / "assets" / "rbm.ttf"


@pytest.fixture
def font_folder(tmp_path: Path) -> Iterator[Path]:
    """A folder with `Mono.ttf`, a copy of a bundled font, and a text file."""
    shutil.copy(BUNDLED_FONT_FILE, tmp_path / "Mono.ttf")
    (tmp_path / "notes.txt").write_text("not a font")
    yield tmp_path
    measure.use_font_directories([])


def test_installed_fonts_follow_the_bundled_ones(font_folder: Path) -> None:
    assert available_fonts([str(font_folder), str(font_folder / "missing")]) == [
        *BUNDLED_FONTS,
        "Mono.ttf",
    ]


def test_without_a_folder_only_the_bundled_fonts_are_listed(tmp_path: Path) -> None:
    assert available_fonts([str(tmp_path / "missing")]) == list(BUNDLED_FONTS)


def test_every_font_field_offers_the_available_fonts() -> None:
    fonts = [*BUNDLED_FONTS, "Mono.ttf"]

    definitions = with_font_options(DEFAULT_PRIMITIVES.definitions, fonts)

    font_fields = [
        field
        for definition in definitions
        for field in definition["fields"]
        if field["shape"] == "font"
    ]
    assert font_fields
    assert all(field["options"] == fonts for field in font_fields)


async def test_an_installed_font_is_drawn_and_measured_like_the_one_it_copies(
    font_folder: Path,
) -> None:
    measure.use_font_directories([str(font_folder)])

    def text(font: str) -> list[dict[str, object]]:
        return [
            {"type": "text", "value": "Hello", "x": 5, "y": 5, "size": 24, "font": font}
        ]

    installed = await generate_image(
        120, 50, text("Mono.ttf"), font_dirs=[str(font_folder)]
    )
    bundled = await generate_image(120, 50, text("rbm.ttf"))

    assert installed.getbbox() == bundled.getbbox()
    assert (
        ImageChops.difference(
            installed.convert("RGB"), bundled.convert("RGB")
        ).getbbox()
        is None
    )
    assert measure.text_size("Hello", 24, "Mono.ttf") == measure.text_size(
        "Hello", 24, "rbm.ttf"
    )
