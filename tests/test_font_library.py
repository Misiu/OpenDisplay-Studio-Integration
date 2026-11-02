"""Fonts the user installs: what is accepted, what is refused and what is removed."""

from __future__ import annotations

import shutil
from pathlib import Path

import odl_renderer
import pytest

from custom_components.opendisplay_studio.font_usage import (
    dashboards_using,
    fonts_used_by,
)
from custom_components.opendisplay_studio.fonts import (
    BUNDLED_FONTS,
    MAX_FONT_BYTES,
    FontError,
    FontLibrary,
    font_file_name,
)

FONT_FILE = Path(odl_renderer.__file__).parent / "assets" / "rbm.ttf"


@pytest.fixture
def library(tmp_path: Path) -> FontLibrary:
    return FontLibrary(tmp_path / "fonts")


def install(library: FontLibrary, filename: str = "Mono.ttf") -> None:
    library.install(filename, FONT_FILE.read_bytes())


def refusal_of(action: object) -> str:
    """Return the code of the error raised by calling `action`."""
    with pytest.raises(FontError) as raised:
        action()  # type: ignore[operator]
    return raised.value.code


def test_an_installed_font_is_listed_after_the_bundled_ones(
    library: FontLibrary,
) -> None:
    install(library)

    assert library.names() == [*BUNDLED_FONTS, "Mono.ttf"]


def test_a_font_is_described_by_the_family_and_style_it_says_it_has(
    library: FontLibrary,
) -> None:
    install(library)

    mono = library.info("Mono.ttf")

    assert (mono.family, mono.style) == (
        library.info("rbm.ttf").family,
        library.info("rbm.ttf").style,
    )
    assert mono.family
    assert not mono.bundled
    assert library.info("ppb.ttf").bundled


def test_the_folder_is_created_by_the_first_font(library: FontLibrary) -> None:
    install(library)

    assert Path(library.directories[0], "Mono.ttf").is_file()


def test_no_part_of_a_font_is_left_when_it_is_installed(library: FontLibrary) -> None:
    install(library)

    assert [path.name for path in Path(library.directories[0]).iterdir()] == [
        "Mono.ttf"
    ]


@pytest.mark.parametrize(
    ("sent", "kept"),
    [
        ("My Font.ttf", "My Font.ttf"),
        (r"C:\fonts\My Font.TTF", "My Font.TTF"),
        ("../../etc/Evil.otf", "Evil.otf"),
        ("Zażółć gęślą.ttf", "Za_ g_l_.ttf"),
        (".hidden.ttf", "hidden.ttf"),
    ],
)
def test_a_name_loses_its_folders_and_odd_characters(sent: str, kept: str) -> None:
    assert font_file_name(sent) == kept


@pytest.mark.parametrize("sent", ["notes.txt", "font", "font.woff", ".ttf"])
def test_only_ttf_and_otf_files_are_taken(sent: str) -> None:
    assert refusal_of(lambda: font_file_name(sent)) in {
        "unsupported_type",
        "invalid_name",
    }


def test_a_file_that_is_not_a_font_is_refused(library: FontLibrary) -> None:
    code = refusal_of(lambda: library.install("Fake.ttf", b"this is not a font"))

    assert code == "invalid_font"
    assert library.names() == list(BUNDLED_FONTS)


def test_an_empty_or_too_large_file_is_refused(library: FontLibrary) -> None:
    assert refusal_of(lambda: library.install("Empty.ttf", b"")) == "invalid_size"
    huge = b"0" * (MAX_FONT_BYTES + 1)
    assert refusal_of(lambda: library.install("Huge.ttf", huge)) == "invalid_size"


def test_a_font_never_takes_the_place_of_another(library: FontLibrary) -> None:
    install(library)

    assert refusal_of(lambda: install(library)) == "font_exists"


def test_the_fonts_that_come_with_the_renderer_cannot_be_overwritten(
    library: FontLibrary,
) -> None:
    assert refusal_of(lambda: install(library, "ppb.ttf")) == "reserved_name"


def test_a_removed_font_is_gone(library: FontLibrary) -> None:
    install(library)

    library.remove("Mono.ttf")

    assert library.names() == list(BUNDLED_FONTS)


@pytest.mark.parametrize("name", ["ppb.ttf", "rbm.ttf"])
def test_the_bundled_fonts_cannot_be_removed(library: FontLibrary, name: str) -> None:
    assert refusal_of(lambda: library.remove(name)) == "bundled_font"


@pytest.mark.parametrize("name", ["Missing.ttf", "../Mono.ttf", "/etc/passwd"])
def test_only_an_installed_font_can_be_removed(
    library: FontLibrary, tmp_path: Path, name: str
) -> None:
    install(library)
    shutil.copy(FONT_FILE, tmp_path / "Mono.ttf")

    assert refusal_of(lambda: library.remove(name)) == "not_found"
    assert (tmp_path / "Mono.ttf").is_file()


def test_a_font_file_that_cannot_be_read_is_left_out_of_the_list(
    library: FontLibrary,
) -> None:
    install(library)
    Path(library.directories[0], "Broken.ttf").write_text("broken")

    assert [font.name for font in library.infos()] == [*BUNDLED_FONTS, "Mono.ttf"]


def primitive(item_id: str, font: str) -> dict[str, object]:
    return {
        "id": item_id,
        "kind": "primitive",
        "primitive": {"type": "text", "value": "Hi", "font": font},
    }


def widget(item_id: str, font: str) -> dict[str, object]:
    return {
        "id": item_id,
        "kind": "widget",
        "widget": {"type": "agenda", "options": {"font": font}},
    }


def test_the_fonts_of_primitives_and_widgets_in_containers_are_found() -> None:
    items = [
        primitive("a", "One.ttf"),
        {
            "id": "box",
            "kind": "container",
            "children": [widget("b", "Two.ttf"), primitive("c", "ppb.ttf")],
        },
    ]

    assert fonts_used_by(items) == {"One.ttf", "Two.ttf", "ppb.ttf"}


def test_a_primitive_without_a_font_uses_none() -> None:
    item = {"id": "r", "kind": "primitive", "primitive": {"type": "rectangle"}}

    assert fonts_used_by([item]) == set()


def test_the_dashboards_that_use_a_font_are_named() -> None:
    dashboards = [
        {"id": "1", "name": "Kitchen", "items": [primitive("a", "One.ttf")]},
        {"id": "2", "name": "Hall", "items": [widget("b", "One.ttf")]},
        {"id": "3", "name": "Garage", "items": [primitive("c", "Two.ttf")]},
    ]

    assert dashboards_using(dashboards, "One.ttf") == [
        {"id": "1", "name": "Kitchen"},
        {"id": "2", "name": "Hall"},
    ]
    assert dashboards_using(dashboards, "Nothing.ttf") == []
