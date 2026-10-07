"""The widgets page in `docs/widgets` describes the widgets as they are now."""

from __future__ import annotations

from pathlib import Path

from scripts.widget_docs import README, build_markdown

ROOT = Path(__file__).parent.parent


def test_the_widgets_page_is_up_to_date() -> None:
    committed = (ROOT / README).read_text(encoding="utf-8")

    assert committed == build_markdown(), "run: python -m scripts.widget_docs"


def test_the_widgets_page_lists_every_option_of_the_agenda() -> None:
    page = build_markdown()

    for key in ("maxEvents", "groupByDay", "showFrame", "invert"):
        assert f"`{key}`" in page
