"""Names of days and months and state words come from files, one per language."""

from __future__ import annotations

import ast
import json
from datetime import date
from pathlib import Path

import pytest

from custom_components.opendisplay_studio.sdk.locale import (
    DEFAULT_LANGUAGE,
    LOCALE_DIRECTORY,
    day_heading,
    locale,
    long_date,
    month_name,
    month_year,
    short_date,
    state_word,
    weekday_name,
)

WEDNESDAY = date(2026, 8, 12)
FILES = sorted(LOCALE_DIRECTORY.glob("*.json"))
ENGLISH = json.loads((LOCALE_DIRECTORY / f"{DEFAULT_LANGUAGE}.json").read_text("utf-8"))


def _shape(value: object) -> object:
    """Describe a nested structure by its keys and the lengths of its lists."""
    if isinstance(value, dict):
        return {key: _shape(item) for key, item in value.items()}
    if isinstance(value, list):
        return len(value)
    return None


@pytest.mark.parametrize("path", FILES, ids=lambda path: path.stem)
def test_every_language_file_has_what_english_has(path: object) -> None:
    words = json.loads(path.read_text("utf-8"))  # type: ignore[attr-defined]

    assert _shape(words) == _shape(ENGLISH)


@pytest.mark.parametrize("path", FILES, ids=lambda path: path.stem)
def test_every_language_has_seven_weekdays_and_twelve_months(path: object) -> None:
    words = json.loads(path.read_text("utf-8"))  # type: ignore[attr-defined]

    assert len(words["weekday"]["short"]) == len(words["weekday"]["full"]) == 7
    assert all(len(forms) == 12 for forms in words["month"].values())


@pytest.mark.parametrize("path", FILES, ids=lambda path: path.stem)
def test_every_pattern_uses_only_fields_the_code_fills(path: object) -> None:
    words = json.loads(path.read_text("utf-8"))  # type: ignore[attr-defined]
    fields = {"weekday": "Wed", "day": 12, "month": "Aug", "year": 2026}

    for pattern in words["format"].values():
        assert pattern.format(**fields)


def test_english_names_a_day_in_three_styles() -> None:
    assert day_heading(WEDNESDAY, "en", "short") == "Wed, Aug 12"
    assert day_heading(WEDNESDAY, "en", "full") == "Wednesday, 12 August"
    assert day_heading(WEDNESDAY, "en", "numeric") == "12.08"


def test_polish_names_a_day_in_three_styles() -> None:
    assert day_heading(WEDNESDAY, "pl", "short") == "śr., 12 sie"
    assert day_heading(WEDNESDAY, "pl", "full") == "Środa, 12 sierpnia"
    assert day_heading(WEDNESDAY, "pl", "numeric") == "12.08"


def test_german_puts_a_dot_after_the_day() -> None:
    assert day_heading(WEDNESDAY, "de", "short") == "Mi, 12. Aug"
    assert day_heading(WEDNESDAY, "de", "full") == "Mittwoch, 12. August"


def test_dates_and_months_follow_the_pattern_of_the_language() -> None:
    assert short_date(date(2026, 9, 1), "en") == "Sep 1"
    assert short_date(date(2026, 9, 1), "pl") == "1 wrz"
    assert long_date(date(2026, 9, 28), "pl") == "28 września"
    assert long_date(date(2026, 9, 28), "de") == "28. September"
    assert month_year(date(2026, 10, 3), "pl") == "październik 2026"
    assert month_name(2, "pl", "of") == "lutego"
    assert month_name(2, "pl") == "luty"


def test_a_region_uses_the_language_and_an_unknown_language_english() -> None:
    assert weekday_name(WEDNESDAY, "pl-PL") == "śr."
    assert weekday_name(WEDNESDAY, "fr") == "Wed"
    assert locale("xx") == locale(DEFAULT_LANGUAGE)


def test_weekday_names_come_in_a_short_and_a_full_form() -> None:
    assert weekday_name(WEDNESDAY, "en", full=True) == "Wednesday"
    assert [weekday_name(date(2026, 8, 10 + n), "en") for n in range(7)] == [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
    ]


def test_state_words_are_translated_and_unknown_states_are_left_alone() -> None:
    assert state_word("on", "pl") == "Włączony"
    assert state_word("home", "de") == "Zuhause"
    assert state_word("not_a_state", "en") is None


def _every_name() -> set[str]:
    names: set[str] = set()
    for path in FILES:
        words = json.loads(path.read_text("utf-8"))
        for group in (*words["weekday"].values(), *words["month"].values()):
            names.update(name for name in group if len(name) > 3)
        names.update(words["states"].values())
    return names


def test_no_python_module_spells_out_a_day_a_month_or_a_state() -> None:
    root = Path(__file__).parent.parent / "custom_components" / "opendisplay_studio"
    names = _every_name()

    for path in root.rglob("*.py"):
        tree = ast.parse(path.read_text(encoding="utf-8"))
        spelled = {
            node.value
            for node in ast.walk(tree)
            if isinstance(node, ast.Constant) and isinstance(node.value, str)
        } & names
        assert not spelled, f"{path.name}: {sorted(spelled)}"
