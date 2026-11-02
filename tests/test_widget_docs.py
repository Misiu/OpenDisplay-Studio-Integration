"""The widgets page in `docs/widgets` describes the widgets as they are now."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

from custom_components.opendisplay_studio.widgets import (
    BUILTIN_WIDGET_DIRECTORY,
    DEFAULT_REGISTRY,
)
from custom_components.opendisplay_studio.widgets.preview import (
    MAX_PREVIEW_SIZE,
    PREVIEW_FILE,
)
from scripts.widget_docs import README, build_markdown

ROOT = Path(__file__).parent.parent


def test_the_widgets_page_is_up_to_date() -> None:
    committed = (ROOT / README).read_text(encoding="utf-8")

    assert committed == build_markdown(), "run: python -m scripts.widget_docs"


def test_the_widgets_page_lists_every_option_of_the_agenda() -> None:
    page = build_markdown()

    for key in ("maxEvents", "groupByDay", "showFrame", "background"):
        assert f"`{key}`" in page


def test_every_built_in_widget_has_its_preview_in_its_own_folder() -> None:
    missing = [
        widget_id
        for widget_id in DEFAULT_REGISTRY.widget_types
        if not (
            BUILTIN_WIDGET_DIRECTORY / widget_id.replace("-", "_") / PREVIEW_FILE
        ).is_file()
    ]

    assert missing == [], "run: python -m scripts.widget_docs"


def test_the_panel_is_given_the_preview_of_every_widget() -> None:
    definitions = DEFAULT_REGISTRY.definitions("en")

    assert all(
        definition["preview"].startswith("data:image/png;base64,")
        for definition in definitions
    )


def test_every_built_in_preview_fits_the_area_a_preview_is_shown_in() -> None:
    too_large = []
    for folder in BUILTIN_WIDGET_DIRECTORY.glob(f"*/{PREVIEW_FILE}"):
        with Image.open(folder) as picture:
            if (
                picture.width > MAX_PREVIEW_SIZE[0]
                or picture.height > MAX_PREVIEW_SIZE[1]
            ):
                too_large.append(folder.parent.name)

    assert too_large == []


def test_every_picture_has_its_title_under_it_and_none_stands_beside_its_caption() -> (
    None
):
    page = build_markdown()

    # A markdown image followed by an italic line puts the caption beside the picture.
    assert "![" not in page
    assert page.count("<br><sub>") == len(
        list((ROOT / "docs/widgets/images").glob("*.png"))
    )


def test_the_page_lists_every_widget_with_a_link_to_its_section() -> None:
    page = build_markdown()

    for definition in DEFAULT_REGISTRY.definitions("en"):
        anchor = definition["name"].lower().replace(" ", "-")
        assert f"(#{anchor})" in page
        assert f"## {definition['name']}" in page


def test_the_options_every_widget_has_are_described_once_at_the_top() -> None:
    page = build_markdown()

    assert page.count("| Show frame |") == 1
    assert page.count("| `showFrame` |") == 1
