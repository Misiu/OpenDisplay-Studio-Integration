"""The school timetable: which rows and cells it draws, and which week it asks for."""

from __future__ import annotations

from datetime import datetime
from itertools import pairwise
from typing import TYPE_CHECKING, Any

import pytest
from homeassistant.util import dt as dt_util

from custom_components.opendisplay_studio.sdk import text_width
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY
from scripts.widget_devkit.scenario import context_for, load_states, with_options
from tests.test_widgets import compile_widget, serve_calendars, widget_item
from tests.widgets.test_catalog import widget_folder

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

WIDGET = "school-timetable"
FULL = (800, 480)


def _elements(
    state_id: str, size: tuple[int, int] = FULL, **options: Any
) -> list[dict[str, Any]]:
    state = with_options(load_states(widget_folder(WIDGET))[state_id], options)
    context = context_for(DEFAULT_REGISTRY, WIDGET, state, size, "bw")
    return DEFAULT_REGISTRY.renderer(WIDGET)(context)


def _texts(elements: list[dict[str, Any]]) -> list[str]:
    return [e["value"].replace("\n", " ") for e in elements if e["type"] == "text"]


def _fills(elements: list[dict[str, Any]], color: str) -> list[dict[str, Any]]:
    return [e for e in elements if e["type"] == "rectangle" and e["fill"] == color]


def test_every_distinct_start_and_end_makes_one_row() -> None:
    written = _texts(_elements("school-week"))

    starts = [text for text in written if text in {"08:00", "08:55", "13:35"}]
    assert starts == ["08:00", "08:55", "13:35"]
    assert written.count("14:20") == 1


def test_the_lessons_of_a_day_and_slot_share_one_cell() -> None:
    written = _texts(_elements("substitution"))

    assert "Matematyka / Świetlica" in written


def test_short_names_replace_full_ones() -> None:
    written = _texts(_elements("school-week"))

    assert "WF" in written
    assert "Wychowanie fizyczne" not in written


def test_markers_are_removed_from_titles() -> None:
    written = _texts(_elements("substitution"))

    assert not any("ZASTĘPSTWO" in text for text in written)
    assert "Język angielski" in written


def test_the_lesson_in_progress_is_filled_with_the_highlight_color() -> None:
    filled = _fills(_elements("school-week", highlightColor="red"), "red")

    assert len(filled) == 1
    assert 280 < filled[0]["x_start"] < 520
    assert 150 < filled[0]["y_start"] < 200


def test_nothing_is_highlighted_outside_lesson_hours() -> None:
    elements = _elements("seven-days", highlightColor="red")

    assert _fills(elements, "red") == []


def test_the_header_of_today_is_inverted() -> None:
    elements = _elements("school-week")

    today = _fills(elements, "black")

    assert len(today) == 1
    assert today[0]["y_start"] < 60


def test_a_highlight_in_the_ink_color_keeps_its_text_readable() -> None:
    elements = _elements("school-week", highlightColor="black")

    lesson = next(
        e
        for e in elements
        if e["type"] == "text" and e["value"] == "Matematyka" and e["color"] == "white"
    )

    assert lesson["color"] == "white"


def test_entries_that_do_not_fit_a_slot_are_counted_in_the_footer() -> None:
    written = _texts(_elements("substitution"))

    assert any(text.endswith("Pominięte wpisy: 2") for text in written)
    assert "Dzień sportu" not in written
    assert "Wycieczka" not in written


def test_seven_days_add_the_weekend_columns() -> None:
    written = _texts(_elements("seven-days"))

    assert "sob." in written
    assert "niedz." in written
    assert "Zajęcia dodatkowe" in written


def test_on_a_weekend_the_next_week_can_be_shown() -> None:
    written = _texts(_elements("weekend"))

    assert any(text.startswith("Timetable · 5.10") for text in written)
    assert "Monday" in written


def test_without_lessons_it_says_so() -> None:
    assert _texts(_elements("empty")) == ["No lessons this week"]


def test_the_footer_and_the_grid_can_be_turned_off() -> None:
    with_both = _elements("school-week")
    without = _elements("school-week", showFooter=False, showGrid=False)

    assert any(text.startswith("Plan lekcji") for text in _texts(with_both))
    assert not any(text.startswith("Plan lekcji") for text in _texts(without))
    assert [e for e in without if e["type"] == "line"] == []
    assert [e for e in with_both if e["type"] == "line"] != []


@pytest.mark.parametrize("size", [(400, 480), (480, 280), (800, 240), (800, 480)])
def test_everything_stays_inside_the_frame(size: tuple[int, int]) -> None:
    for element in _elements("school-week", size):
        x = element.get("x", element.get("x_start"))
        y = element.get("y", element.get("y_start"))
        if x is not None and y is not None:
            assert 0 <= x <= size[0]
            assert 0 <= y <= size[1]


@pytest.mark.parametrize(
    ("now", "weekend", "monday"),
    [
        ("2026-09-30T10:00:00", "current", (2026, 9, 28)),
        ("2026-10-03T10:00:00", "current", (2026, 9, 28)),
        ("2026-10-03T10:00:00", "next", (2026, 10, 5)),
        ("2026-10-04T10:00:00", "next", (2026, 10, 5)),
        ("2026-10-05T10:00:00", "next", (2026, 10, 5)),
    ],
)
async def test_the_calendar_is_asked_for_the_right_week(
    hass: HomeAssistant,
    freezer: Any,
    now: str,
    weekend: str,
    monday: tuple[int, int, int],
) -> None:
    freezer.move_to(datetime.fromisoformat(now).replace(tzinfo=dt_util.UTC))
    calls = serve_calendars(hass, {"calendar.school": []})
    item = widget_item(
        WIDGET,
        sources={"calendars": [{"id": "calendar.school"}]},
        options={"weekend": weekend},
    )

    await compile_widget(hass, item)

    start = calls[0].data["start_date_time"]
    end = calls[0].data["end_date_time"]
    assert (start.year, start.month, start.day) == monday
    assert (start.hour, start.minute) == (0, 0)
    assert (end - start).days == 5


def test_full_day_names_and_dates_are_used_when_they_fit() -> None:
    written = _texts(_elements("school-week"))

    assert "Poniedziałek" in written
    assert "28 września" in written


def test_short_day_names_are_used_in_a_narrow_frame() -> None:
    written = _texts(_elements("school-week", (400, 480)))

    assert "pon." in written
    assert "Poniedziałek" not in written


def test_the_day_names_can_be_forced() -> None:
    short = _texts(_elements("school-week", dayNames="short"))
    full = _texts(_elements("school-week", (400, 480), dayNames="full"))

    assert "pon." in short
    assert "pon." not in full


def test_an_event_without_a_title_is_called_a_lesson() -> None:
    state = load_states(widget_folder(WIDGET))["school-week"]
    state["data"]["calendars"][0]["events"][0]["summary"] = "[ZASTĘPSTWO]"
    context = context_for(DEFAULT_REGISTRY, WIDGET, state, FULL, "bw")

    written = _texts(DEFAULT_REGISTRY.renderer(WIDGET)(context))

    assert "Lesson" in written or "Lekcja" in written


def test_the_footer_shows_the_date_and_time_of_the_picture() -> None:
    assert "30.09  10:00" in _texts(_elements("school-week"))


def test_a_low_row_shows_only_when_the_lesson_starts() -> None:
    tall = _texts(_elements("school-week", (800, 480)))
    low = _texts(_elements("school-week", (800, 200)))

    assert "08:45" in tall
    assert "08:00" in low
    assert "08:45" not in low


@pytest.mark.parametrize("size", [(390, 230), (400, 480), (480, 280), (800, 480)])
def test_no_title_is_wider_than_its_cell(size: tuple[int, int]) -> None:
    elements = _elements("school-week", size, dayNames="short")
    verticals = sorted(
        {
            e["x_start"]
            for e in elements
            if e["type"] == "line" and e["x_start"] == e["x_end"]
        }
    )
    narrowest = min(right - left for left, right in pairwise(verticals))
    header, footer = size[1] // 8, size[1] - 30

    titles = [
        e
        for e in elements
        if e["type"] == "text" and header < e["y"] < footer and e["x"] > verticals[0]
    ]

    assert titles
    for element in titles:
        for line in element["value"].split(chr(10)):
            assert text_width(line, element["size"]) <= narrowest


def test_a_word_that_cannot_fit_is_cut_with_three_dots() -> None:
    written = _texts(_elements("school-week", (390, 230), dayNames="short"))

    assert any(text.endswith("...") for text in written)
    assert not any(text.endswith("…") for text in written)
