"""The fonts that come with the integration are drawn, measured and licensed."""

from __future__ import annotations

import pytest
from odl_renderer import generate_image  # type: ignore[import-untyped]

from custom_components.opendisplay_studio import measure
from custom_components.opendisplay_studio.fonts import (
    RENDERER_FONTS,
    STUDIO_FOLDER,
    STUDIO_FONTS,
    FontLibrary,
)

POLISH = "Zażółć gęślą jaźń"
LICENSES = (
    "OFL-Carlito.txt",
    "OFL-AtkinsonHyperlegible.txt",
    "OFL-Inter.txt",
    "OFL-IBMPlexMono.txt",
    "OFL-BarlowCondensed.txt",
)


@pytest.fixture
def library(tmp_path: object) -> FontLibrary:
    return FontLibrary(tmp_path / "fonts")  # type: ignore[operator]


@pytest.fixture(autouse=True)
def search_the_bundled_folder() -> object:
    measure.use_font_directories([str(STUDIO_FOLDER)])
    yield
    measure.use_font_directories([])


@pytest.mark.parametrize("name", STUDIO_FONTS)
def test_each_font_is_there_and_says_what_family_and_style_it_is(
    library: FontLibrary, name: str
) -> None:
    info = library.info(name)

    assert info.bundled
    assert (info.family, info.style) in {
        ("Carlito", "Regular"),
        ("Carlito", "Bold"),
        ("Atkinson Hyperlegible", "Regular"),
        ("Atkinson Hyperlegible", "Bold"),
        ("Inter", "SemiBold"),
        ("IBM Plex Mono", "Medium"),
        ("Barlow Condensed", "Bold"),
    }


def test_the_renderer_fonts_and_ours_are_all_listed_and_none_can_be_removed(
    library: FontLibrary,
) -> None:
    names = library.names()

    assert names[: len(RENDERER_FONTS) + len(STUDIO_FONTS)] == [
        *RENDERER_FONTS,
        *STUDIO_FONTS,
    ]
    for name in names:
        with pytest.raises(Exception, match="cannot be removed"):
            library.remove(name)


@pytest.mark.parametrize("name", STUDIO_FONTS)
async def test_each_font_draws_polish_letters_found_by_name(name: str) -> None:
    text = [{"type": "text", "value": POLISH, "x": 5, "y": 5, "size": 24, "font": name}]

    image = await generate_image(400, 50, text, font_dirs=[str(STUDIO_FOLDER)])

    assert image.convert("L").getextrema()[0] < 128


@pytest.mark.parametrize("name", STUDIO_FONTS)
def test_text_is_measured_in_the_font_it_is_drawn_in(name: str) -> None:
    assert (
        measure.text_size(POLISH, 24, name)[0]
        != measure.text_size(POLISH, 24, "ppb.ttf")[0]
    )


@pytest.mark.parametrize("license_file", LICENSES)
def test_the_license_of_each_family_is_next_to_its_files(license_file: str) -> None:
    text = (STUDIO_FOLDER / license_file).read_text(encoding="utf-8")

    assert "SIL OPEN FONT LICENSE Version 1.1" in text
