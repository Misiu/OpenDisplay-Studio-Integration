"""The calendar widget: events, the range it asks for and what its three views draw."""

from __future__ import annotations

import copy
from datetime import date, datetime, timedelta
from typing import TYPE_CHECKING, Any

import pytest
from homeassistant.util import dt as dt_util

from custom_components.opendisplay_studio.sdk import text_width
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY
from custom_components.opendisplay_studio.widgets.calendar.events import (
    Event,
    group_by_day,
    week_floor,
)
from custom_components.opendisplay_studio.widgets.calendar.provider import (
    fetch_range,
)
from custom_components.opendisplay_studio.widgets.calendar.text import (
    clip,
    one_line,
    wrap,
)
from scripts.widget_devkit.scenario import context_for, load_states, with_options
from tests.test_widgets import compile_widget, serve_calendars, widget_item
from tests.widgets.test_catalog import widget_folder

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

WIDGET = "calendar"
FULL = (800, 480)
SIZES = [(800, 480), (800, 240), (400, 480), (400, 240), (296, 128)]
ZONE = "+02:00"
DAY_NAMES = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"}


def _state(state_id: str = "upcoming") -> dict[str, Any]:
    return copy.deepcopy(load_states(widget_folder(WIDGET))[state_id])


def _draw(
    state: dict[str, Any], size: tuple[int, int] = FULL, **options: Any
) -> list[dict[str, Any]]:
    state = with_options(state, options)
    context = context_for(DEFAULT_REGISTRY, WIDGET, state, size, "bw")
    return DEFAULT_REGISTRY.renderer(WIDGET)(context)


def _elements(
    state_id: str = "upcoming", size: tuple[int, int] = FULL, **options: Any
) -> list[dict[str, Any]]:
    return _draw(_state(state_id), size, **options)


def _texts(elements: list[dict[str, Any]]) -> list[str]:
    return [e["value"].replace("\n", " ") for e in elements if e["type"] == "text"]


def _text(elements: list[dict[str, Any]], value: str) -> dict[str, Any]:
    return next(e for e in elements if e["type"] == "text" and e["value"] == value)


def _raw_event(
    title: str, start: str, end: str, *, all_day: bool = False, **extra: str
) -> dict[str, Any]:
    event = {
        "summary": title,
        "start": start,
        "end": end,
        "all_day": all_day,
        "location": "",
        "description": "",
        "source": "calendar.work",
    }
    return event | extra


def _with_events(
    events: list[dict[str, Any]], state_id: str = "upcoming"
) -> dict[str, Any]:
    state = _state(state_id)
    state["data"]["calendars"][0]["events"] = events
    return state


def _day(day: int, clock: str = "00:00") -> str:
    return f"2026-08-{day:02d}T{clock}:00{ZONE}"


def _event(
    start: str = "2026-08-12T10:00:00+02:00",
    end: str = "2026-08-12T11:00:00+02:00",
    *,
    all_day: bool = False,
    title: str = "Meeting",
) -> Event:
    return Event(
        title=title,
        description="",
        location="",
        start=datetime.fromisoformat(start),
        end=datetime.fromisoformat(end),
        all_day=all_day,
        label="",
        color="black",
        icon="calendar",
    )


# ---------------------------------------------------------------- events


@pytest.mark.parametrize(
    ("first", "expected"),
    [
        ("monday", date(2026, 8, 10)),
        ("tuesday", date(2026, 8, 11)),
        ("wednesday", date(2026, 8, 12)),
        ("thursday", date(2026, 8, 6)),
        ("friday", date(2026, 8, 7)),
        ("saturday", date(2026, 8, 8)),
        ("sunday", date(2026, 8, 9)),
    ],
)
def test_a_week_starts_on_the_chosen_day(first: str, expected: date) -> None:
    assert week_floor(date(2026, 8, 12), first) == expected


def test_a_day_that_is_the_first_day_starts_its_own_week() -> None:
    assert week_floor(date(2026, 8, 10), "monday") == date(2026, 8, 10)


def test_an_all_day_event_ends_the_day_before_its_exclusive_end() -> None:
    event = _event(
        "2026-08-13T00:00:00+02:00", "2026-08-16T00:00:00+02:00", all_day=True
    )

    assert (event.first_day, event.last_day) == (date(2026, 8, 13), date(2026, 8, 15))
    assert event.spans_days
    assert event.is_bar


def test_a_single_all_day_event_is_a_bar_that_spans_one_day() -> None:
    event = _event(
        "2026-08-13T00:00:00+02:00", "2026-08-14T00:00:00+02:00", all_day=True
    )

    assert not event.spans_days
    assert event.is_bar


def test_an_event_ending_at_midnight_belongs_to_the_day_it_started() -> None:
    event = _event("2026-08-12T22:00:00+02:00", "2026-08-13T00:00:00+02:00")

    assert event.last_day == date(2026, 8, 12)
    assert not event.is_bar


def test_an_event_running_past_midnight_is_a_bar() -> None:
    event = _event("2026-08-12T22:00:00+02:00", "2026-08-13T02:00:00+02:00")

    assert event.last_day == date(2026, 8, 13)
    assert event.is_bar


def test_a_running_event_is_listed_under_today() -> None:
    running = _event(
        "2026-08-10T00:00:00+02:00", "2026-08-15T00:00:00+02:00", all_day=True
    )
    later = _event("2026-08-13T10:00:00+02:00", "2026-08-13T11:00:00+02:00")

    groups = group_by_day([later, running], date(2026, 8, 12))

    assert [day for day, _ in groups] == [date(2026, 8, 12), date(2026, 8, 13)]
    assert groups[0][1] == [running]


# ---------------------------------------------------------------- text


def test_a_word_longer_than_the_line_is_cut_with_three_dots() -> None:
    lines = wrap("Supercalifragilisticexpialidocious", 80, 14)

    assert len(lines) == 1
    assert lines[0].endswith("...")
    assert text_width(lines[0], 14) <= 80


def test_text_is_broken_at_words_and_the_last_line_ends_in_dots() -> None:
    lines = clip("one two three four five six seven eight nine ten", 70, 12, 2)

    assert len(lines) == 2
    assert lines[1].endswith("...")
    assert all(text_width(line, 12) <= 70 for line in lines)


def test_text_that_fits_is_left_alone() -> None:
    assert clip("Lunch Break", 400, 12, 3) == ["Lunch Break"]
    assert one_line("Lunch   Break", 400, 12) == "Lunch Break"


def test_a_single_line_is_cut_with_dots_to_its_width() -> None:
    line = one_line("A description that is much too long for the room", 100, 12)

    assert line.endswith("...")
    assert text_width(line, 12) <= 100


# ---------------------------------------------------------------- provider range


NOW = datetime.fromisoformat("2026-08-12T10:15:00+02:00")


def test_a_list_starts_today_and_looks_ahead() -> None:
    start, days = fetch_range({"view": "upcoming", "lookahead": 9}, NOW)

    assert (start.year, start.month, start.day, start.hour) == (2026, 8, 12, 0)
    assert days == 9


def test_the_agenda_uses_the_same_range_as_the_upcoming_view() -> None:
    assert fetch_range({"view": "agenda", "lookahead": 5}, NOW)[1] == 5


@pytest.mark.parametrize(
    ("first", "monday"),
    [("monday", 10), ("sunday", 9), ("wednesday", 12), ("thursday", 6)],
)
def test_the_weeks_view_starts_on_the_first_day_of_the_week(
    first: str, monday: int
) -> None:
    params = {"view": "weeks", "monthMode": "rolling", "firstDay": first}

    start, days = fetch_range(params, NOW)

    assert start.day == monday
    assert days == 42


def test_the_weeks_view_can_start_from_the_first_of_the_month() -> None:
    params = {"view": "weeks", "monthMode": "month", "firstDay": "monday"}

    start, _ = fetch_range(params, NOW)

    assert (start.month, start.day) == (7, 27)


async def test_the_provider_asks_the_calendar_for_the_range_of_the_view(
    hass: HomeAssistant, freezer: Any
) -> None:
    freezer.move_to(datetime(2026, 8, 12, 8, 15, tzinfo=dt_util.UTC))
    calls = serve_calendars(hass, {"calendar.work": []})
    item = widget_item(
        WIDGET,
        sources={"calendars": [{"id": "calendar.work"}]},
        options={"view": "weeks", "firstDay": "sunday"},
    )

    await compile_widget(hass, item)

    start = calls[0].data["start_date_time"]
    end = calls[0].data["end_date_time"]
    assert (start.month, start.day) == (8, 9)
    assert (end - start).days == 42


async def test_the_provider_merges_calendars_and_survives_a_failing_one(
    hass: HomeAssistant, freezer: Any
) -> None:
    freezer.move_to(datetime(2026, 8, 12, 8, 15, tzinfo=dt_util.UTC))
    serve_calendars(
        hass,
        {
            "calendar.work": [
                {
                    "summary": "Standup",
                    "start": "2026-08-12T11:30:00+02:00",
                    "end": "2026-08-12T11:45:00+02:00",
                }
            ],
            "calendar.home": [
                {
                    "summary": "Dinner",
                    "start": "2026-08-12T19:00:00+02:00",
                    "end": "2026-08-12T20:00:00+02:00",
                }
            ],
        },
    )
    picks = [{"id": "calendar.work"}, {"id": "calendar.home"}, {"id": "calendar.gone"}]
    item = widget_item(WIDGET, sources={"calendars": picks})

    compiled = await compile_widget(hass, item)

    written = [e["value"] for e in compiled.elements if e["type"] == "text"]
    assert "Standup" in written
    assert "Dinner" in written


# ---------------------------------------------------------------- filters


def test_events_that_have_ended_are_hidden_unless_asked_for() -> None:
    assert "Morning Run" not in _texts(_elements("upcoming"))
    assert "Morning Run" in _texts(_elements("upcoming", hidePast=False))


def test_an_event_running_now_is_still_shown() -> None:
    assert "Monthly Catchup with Dev Team" in " ".join(_texts(_elements("upcoming")))


def test_phrases_hide_events_by_title_or_description_in_any_case() -> None:
    written = _texts(_elements("upcoming", ignore="lunch\nTRIAGE", hidePast=False))

    assert "Lunch Break" not in written
    assert "Email Triage" not in written
    assert "Team Standup" in written


def test_a_phrase_also_matches_the_description() -> None:
    written = _texts(_elements("upcoming", ignore="Heads-down", hidePast=False))

    assert "Deep Work Block" not in written


def test_exact_names_hide_only_events_named_just_so() -> None:
    written = _texts(_elements("upcoming", ignoreExact="Bath", hidePast=False))

    assert "Bath" not in written
    assert "Team Standup" in written


def test_an_event_without_a_title_is_called_busy() -> None:
    state = _with_events([_raw_event("", _day(12, "14:00"), _day(12, "15:00"))])

    assert "Busy" in _texts(_draw(state))


def test_identical_events_of_two_calendars_are_shown_once() -> None:
    event = _raw_event("Standup", _day(12, "14:00"), _day(12, "15:00"))
    state = _with_events([event, dict(event)])
    state["sources"]["calendars"].append({"id": "calendar.home"})
    state["data"]["calendars"].append(
        {
            "id": "calendar.home",
            "missing": False,
            "name": "Home",
            "events": [dict(event)],
        }
    )

    assert _texts(_draw(state)).count("Standup") == 1


# ---------------------------------------------------------------- upcoming


def test_the_upcoming_view_names_each_day_and_numbers_the_events() -> None:
    written = _texts(_elements("upcoming"))

    assert written[0] == "Wed, Aug 12"
    assert "Thu, Aug 13" in written
    assert "Fri, Aug 14" in written
    numbers = [text for text in written if text.isdigit()]
    assert numbers == [str(n) for n in range(1, len(numbers) + 1)]


def test_an_all_day_event_has_a_hash_and_no_number_or_time() -> None:
    written = _texts(_elements("upcoming"))

    assert "#" in written
    assert "Security Audit" in written
    assert written[written.index("Security Audit") + 1] != "Security Audit"


def test_the_time_of_an_event_is_written_from_start_to_end() -> None:
    assert "10:00 - 11:00" in _texts(_elements("upcoming"))


def test_the_clock_can_be_twelve_hours() -> None:
    written = _texts(_elements("upcoming", use24h=False))

    assert "10:00 AM - 11:00 AM" in written


def test_times_descriptions_and_places_can_be_turned_off_or_on() -> None:
    state = _state()
    state["data"]["calendars"][0]["events"][3]["location"] = "Room 4"
    plain = _texts(_draw(state, includeTime=False, includeDescription=False))
    placed = _texts(_draw(state, showLocation=True))

    assert "10:00 - 11:00" not in plain
    assert "Quick bite and recharge" not in plain
    assert "Room 4" in placed


def test_the_number_of_days_can_be_limited_and_today_alone_chosen() -> None:
    one = _texts(_elements("upcoming", days=1))
    today = _texts(_elements("upcoming", todayOnly=True))

    assert "Thu, Aug 13" not in one
    assert "Wed, Aug 12" in one
    assert "Thu, Aug 13" not in today


def test_the_date_format_can_be_full_or_numeric() -> None:
    assert "Wednesday, 12 August" in _texts(_elements("upcoming", dateFormat="full"))
    assert "12.08" in _texts(_elements("upcoming", dateFormat="numeric"))


def test_the_dates_follow_the_language_of_the_dashboard() -> None:
    written = _texts(_elements("polish"))

    assert "śr., 12 sie" in written
    assert "Nadchodzące wydarzenia" in written


def test_today_has_a_filled_heading_that_can_be_turned_off() -> None:
    filled = _elements("upcoming")
    plain = _elements("upcoming", highlightToday=False)

    black = [e for e in filled if e["type"] == "rectangle" and e["fill"] == "black"]
    assert len(black) >= 1
    assert black[0]["y_start"] < 40
    first = _text(plain, "Wed, Aug 12")
    assert first["color"] == "black"


def test_a_wide_frame_pours_the_days_into_three_columns() -> None:
    elements = _elements("upcoming")
    labels = {"Wed, Aug 12", "Thu, Aug 13", "Fri, Aug 14"}

    columns = {
        round(e["x"] / 100)
        for e in elements
        if e["type"] == "text" and e["value"] in labels
    }

    assert len(columns) == 3


@pytest.mark.parametrize(("setting", "columns"), [("1", 1), ("2", 2), ("3", 3)])
def test_the_columns_can_be_chosen(setting: str, columns: int) -> None:
    elements = _elements("upcoming", columns=setting, days=7)

    starts = {
        e["x"]
        for e in elements
        if e["type"] == "text" and e["value"].endswith(("Aug 12", "Aug 13", "Aug 14"))
    }

    assert len(starts) <= columns


def test_what_does_not_fit_is_counted_at_the_end_of_the_last_column() -> None:
    crowded = _elements("upcoming", (400, 240))
    spacious = _elements("upcoming", columns="3", days=1)

    assert any(text.startswith("+") and "more" in text for text in _texts(crowded))
    assert not any("more" in text for text in _texts(spacious))


def test_the_title_bar_names_the_view_and_the_calendars() -> None:
    written = _texts(_elements("three-calendars"))

    assert "Upcoming events" in written
    assert "Work, Kids, Home" in written


def test_the_title_bar_can_be_renamed_or_removed() -> None:
    renamed = _texts(_elements("upcoming", titleBarText="Family"))
    removed = _texts(_elements("upcoming", showTitleBar=False))

    assert "Family" in renamed
    assert "Upcoming events" not in removed


def test_the_title_bar_is_left_out_of_a_frame_too_low_for_it() -> None:
    assert "Upcoming events" not in _texts(_elements("upcoming", (296, 128)))


def test_the_numbers_can_be_left_out() -> None:
    written = _texts(_elements("upcoming", showIndex=False))

    assert not [text for text in written if text.isdigit()]


def test_the_content_can_sit_at_the_bottom() -> None:
    top = _text(_elements("sparse"), "Dentist")
    bottom = _text(_elements("sparse", alignment="bottom"), "Dentist")

    assert bottom["y"] > top["y"] + 50


def test_larger_text_makes_the_titles_bigger() -> None:
    normal = _text(_elements("sparse"), "Dentist")
    zoomed = _text(_elements("sparse", zoom=True), "Dentist")

    assert zoomed["size"] > normal["size"]


def test_an_empty_calendar_says_so() -> None:
    assert "No upcoming events" in _texts(_elements("empty"))
    assert "No events today" in _texts(_elements("empty", todayOnly=True))


def test_no_calendar_chosen_says_so() -> None:
    assert _texts(_elements("missing-sources")) == ["Choose calendars"]


def test_events_of_calendars_have_the_color_of_their_calendar() -> None:
    elements = _elements("three-calendars")

    colors = {
        e["border"] for e in elements if e.get("border") and e["type"] != "rectangle"
    }
    fills = {e["fill"] for e in elements if e["type"] == "rectangle"}

    assert colors or fills
    assert any(e.get("border") == "red" or e.get("fill") == "red" for e in elements)


def test_long_titles_are_cut_with_three_dots_inside_their_column() -> None:
    elements = _elements("long-titles", (400, 480))

    for element in elements:
        if element["type"] != "text":
            continue
        for line in element["value"].split("\n"):
            assert text_width(line, element["size"]) <= 400


def test_a_title_too_long_for_its_lines_ends_in_three_dots() -> None:
    written = _texts(_elements("long-titles", (400, 480)))

    assert any(text.endswith("...") for text in written)


# ---------------------------------------------------------------- agenda


def test_the_agenda_has_a_bar_for_each_day() -> None:
    written = _texts(_elements("agenda"))

    assert [t for t in written if t.endswith(("Aug 12", "Aug 13", "Aug 14"))] == [
        "Wed, Aug 12",
        "Thu, Aug 13",
        "Fri, Aug 14",
    ]


def test_each_agenda_line_has_the_start_and_the_end_of_the_event() -> None:
    written = _texts(_elements("agenda"))

    assert "10:00" in written
    assert "11:00" in written
    assert "Monthly Catchup with Dev Team" in written


def test_an_all_day_line_has_a_hash_and_no_end() -> None:
    written = _texts(_elements("agenda"))

    assert "#" in written


def test_the_agenda_without_times_has_no_pills_for_timed_events() -> None:
    written = _texts(_elements("agenda", includeTime=False))

    assert "10:00" not in written
    assert "#" in written


def test_the_description_follows_the_title_when_there_is_room() -> None:
    elements = _elements("agenda")

    title = _text(elements, "Lunch Break")
    detail = _text(elements, "Quick bite and recharge")

    assert detail["x"] > title["x"] + text_width("Lunch Break", title["size"])
    assert detail["y"] <= title["y"] + title["size"]


def test_the_description_is_dropped_when_there_is_no_room_for_it() -> None:
    written = _texts(_elements("agenda", (296, 128), includeDescription=True))

    assert "Quick bite and recharge" not in written


def test_places_join_the_description() -> None:
    state = _state("agenda")
    state["data"]["calendars"][0]["events"][4]["location"] = "Room 4"

    written = _texts(_draw(state, showLocation=True))

    assert any("Room 4" in text for text in written)


def test_the_agenda_counts_what_it_cannot_fit() -> None:
    assert any("more" in text for text in _texts(_elements("agenda", (400, 240))))


def test_the_agenda_of_an_empty_calendar_says_so() -> None:
    assert "No upcoming events" in _texts(_elements("empty", view="agenda"))


def test_today_has_a_black_bar_in_the_agenda() -> None:
    black = [
        e
        for e in _elements("agenda")
        if e["type"] == "rectangle" and e["fill"] == "black" and e["y_start"] < 40
    ]

    assert black


def test_the_agenda_times_are_in_the_colors_of_the_calendars() -> None:
    elements = _elements("three-calendars", view="agenda")

    assert any(e["type"] == "rectangle" and e["fill"] == "red" for e in elements)


# ---------------------------------------------------------------- weeks


def _weeks(**options: Any) -> list[dict[str, Any]]:
    return _elements("weeks", **options)


def _horizontals(elements: list[dict[str, Any]]) -> int:
    """Count the horizontal grid lines."""
    return len(
        {
            e["y_start"]
            for e in elements
            if e["type"] == "line" and e["y_start"] == e["y_end"]
        }
    )


def _rectangles(elements: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [e for e in elements if e["type"] == "rectangle"]


def test_the_columns_are_named_from_the_first_day_of_the_week() -> None:
    state = _state("weeks")
    for data in state["data"]["calendars"]:
        data["range_start"] = "2026-07-26"
    monday = [t for t in _texts(_weeks()) if t in DAY_NAMES]
    sunday = [t for t in _texts(_draw(state)) if t in DAY_NAMES]

    assert monday == ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    assert sunday == ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


def test_the_column_of_today_is_inverted() -> None:
    header = [
        e for e in _rectangles(_weeks()) if e["fill"] == "black" and e["y_start"] < 10
    ]

    assert len(header) == 1
    assert 220 < header[0]["x_start"] < 240


def test_the_pill_of_today_holds_its_day_number() -> None:
    elements = _weeks()
    number = next(e for e in elements if e["type"] == "text" and e["value"] == "12")

    assert number["color"] == "white"


def test_highlighting_today_can_be_turned_off() -> None:
    elements = _weeks(highlightToday=False)

    assert not [
        e for e in _rectangles(elements) if e["fill"] == "black" and e["y_start"] < 40
    ]


def test_the_first_of_a_month_carries_the_month() -> None:
    assert "Sep 1" in _texts(_elements("weeks", weeks="6"))


def test_the_grid_has_as_many_rows_as_asked() -> None:
    assert _horizontals(_weeks(weeks="2")) == 3
    assert _horizontals(_weeks(weeks="5")) == 6


def test_rows_that_fit_the_frame_are_chosen_when_the_weeks_are_automatic() -> None:
    auto = {"weeks": "auto", "monthMode": "rolling"}
    tall = _horizontals(_elements("weeks", (800, 480), **auto))
    low = _horizontals(_elements("weeks", (800, 240), **auto))

    assert tall > low >= 2


def test_the_month_mode_starts_the_grid_in_the_week_of_the_first() -> None:
    state = _state("weeks")
    for data in state["data"]["calendars"]:
        data["range_start"] = "2026-07-27"

    written = _texts(_draw(state, monthMode="month", weeks="auto"))

    assert "27" in written
    assert "Aug 1" in written


def test_week_numbers_are_the_iso_weeks() -> None:
    written = _texts(_weeks(weekNumbers=True, weeks="5"))

    assert "33" in written
    assert "34" in written


def test_the_month_can_head_the_grid() -> None:
    assert "August 2026" in _texts(_weeks(monthHeader=True))
    assert "August 2026" not in _texts(_weeks())


def test_weekends_are_dotted_and_can_be_left_plain() -> None:
    shaded = [e for e in _weeks() if e["type"] == "rectangle_pattern"]
    plain = [e for e in _weeks(shadeWeekends=False) if e["type"] == "rectangle_pattern"]

    assert len(shaded) == 2 * 4
    assert plain == []


def test_the_dots_stay_inside_their_cells() -> None:
    for pattern in (e for e in _weeks() if e["type"] == "rectangle_pattern"):
        step = pattern["x_size"] + pattern["x_offset"]
        assert pattern["x_start"] + pattern["x_repeat"] * step <= 800


def test_an_all_day_event_over_three_days_is_one_bar_over_three_columns() -> None:
    bars = [
        e
        for e in _rectangles(_weeks())
        if e.get("radius") == 3 and e["x_end"] - e["x_start"] > 300
    ]
    one_column = 800 / 7

    assert any(
        2.5 * one_column < e["x_end"] - e["x_start"] < 3.2 * one_column for e in bars
    )


def test_a_bar_that_crosses_a_week_is_drawn_in_both_rows() -> None:
    state = _with_events(
        [_raw_event("Conference", _day(20), _day(26), all_day=True)], "weeks"
    )

    drawn = _draw(state, weeks="6")
    bars = [e for e in _rectangles(drawn) if e.get("radius") == 3]

    assert len(bars) == 2
    assert bars[0]["y_start"] != bars[1]["y_start"]


def test_bars_that_overlap_are_stacked_in_lanes() -> None:
    state = _with_events(
        [
            _raw_event("Alpha", _day(12), _day(15), all_day=True),
            _raw_event("Beta", _day(13), _day(16), all_day=True),
        ],
        "weeks",
    )

    bars = sorted(
        (e for e in _rectangles(_draw(state)) if e.get("radius") == 3),
        key=lambda e: e["y_start"],
    )

    assert len(bars) == 2
    assert bars[0]["y_end"] < bars[1]["y_start"]


def test_non_overlapping_bars_share_a_lane() -> None:
    state = _with_events(
        [
            _raw_event("Alpha", _day(10), _day(11), all_day=True),
            _raw_event("Beta", _day(13), _day(14), all_day=True),
        ],
        "weeks",
    )

    bars = [e for e in _rectangles(_draw(state)) if e.get("radius") == 3]

    assert len({e["y_start"] for e in bars}) == 1


def test_a_timed_event_is_written_in_its_day_with_its_start() -> None:
    written = _texts(_weeks())

    assert "06:30" in written
    assert any(text.startswith("Morning") for text in written)


def test_times_can_be_left_out_of_the_cells() -> None:
    assert "06:30" not in _texts(_weeks(includeTime=False))


def test_a_day_with_too_many_events_counts_the_rest() -> None:
    written = _texts(_weeks())

    assert any(text.startswith("+") for text in written)


def test_the_grid_shows_days_that_are_over() -> None:
    assert any(text.startswith("Planning") for text in _texts(_weeks()))


def test_the_weeks_view_of_an_empty_calendar_is_an_empty_grid() -> None:
    written = _texts(_elements("empty", view="weeks"))

    assert "Mon" in written
    assert "12" in written


def test_a_calendar_color_fills_its_bar() -> None:
    state = _with_events(
        [_raw_event("Trip", _day(12), _day(14), all_day=True)], "weeks"
    )
    state["sources"]["calendars"][0]["color"] = "red"

    bars = [e for e in _rectangles(_draw(state)) if e.get("radius") == 3]

    assert bars[0]["fill"] == "red"


# ---------------------------------------------------------------- all views


@pytest.mark.parametrize("view", ["upcoming", "agenda", "weeks"])
@pytest.mark.parametrize("size", SIZES)
def test_nothing_is_drawn_outside_the_frame(view: str, size: tuple[int, int]) -> None:
    for element in _elements(view, size):
        for x_key, y_key in (("x", "y"), ("x_start", "y_start")):
            if x_key in element and y_key in element:
                assert -1 <= element[x_key] <= size[0]
                assert -1 <= element[y_key] <= size[1]
        for key in ("x_end", "y_end"):
            if key in element:
                assert element[key] <= max(size)


@pytest.mark.parametrize("view", ["upcoming", "agenda", "weeks"])
@pytest.mark.parametrize("size", SIZES)
def test_no_line_of_text_is_wider_than_the_frame(
    view: str, size: tuple[int, int]
) -> None:
    for element in _elements(view, size):
        if element["type"] != "text":
            continue
        for line in element["value"].split("\n"):
            assert text_width(line, element["size"]) <= size[0]


@pytest.mark.parametrize("view", ["upcoming", "agenda", "weeks"])
@pytest.mark.parametrize("language", ["en", "pl", "de"])
def test_every_view_draws_in_every_language(view: str, language: str) -> None:
    state = _state(view)
    state["language"] = language

    assert _texts(_draw(state))


@pytest.mark.parametrize("view", ["upcoming", "agenda", "weeks"])
def test_the_options_of_the_look_apply_to_every_view(view: str) -> None:
    framed = _elements(view)
    bare = _elements(view, showFrame=False)

    assert framed[0]["type"] == "rectangle"
    assert not bare or bare[0].get("fill") != "white" or bare[0]["type"] != "rectangle"


def test_the_clock_of_a_pill_follows_the_twelve_hour_option() -> None:
    assert "10:00 AM" in _texts(_elements("agenda", use24h=False))


def test_a_week_of_seven_days_is_the_widest_a_grid_gets() -> None:
    elements = _weeks()
    verticals = {
        e["x_start"]
        for e in elements
        if e["type"] == "line" and e["x_start"] == e["x_end"]
    }

    assert len(verticals) == 6


def test_the_range_of_a_week_covers_six_weeks() -> None:
    _, days = fetch_range(
        {"view": "weeks", "monthMode": "rolling", "firstDay": "monday"}, NOW
    )

    assert days == 6 * 7
    assert timedelta(days=days).days == 42


@pytest.mark.parametrize("view", ["upcoming", "agenda", "weeks"])
@pytest.mark.parametrize("size", SIZES)
@pytest.mark.parametrize(
    "state_id",
    ["upcoming", "polish", "three-calendars", "sparse", "all-day-only", "long-titles"],
)
def test_the_layout_never_overflows(
    caplog: pytest.LogCaptureFixture,
    view: str,
    size: tuple[int, int],
    state_id: str,
) -> None:
    caplog.set_level("WARNING")

    _elements(state_id, size, view=view)

    assert "overflow" not in caplog.text
