"""Ranges say where each color of a scale starts; the next one ends it."""

from __future__ import annotations

import pytest

from custom_components.opendisplay_studio.dashboards import validate_dashboard
from custom_components.opendisplay_studio.sdk import Span, spans_of
from custom_components.opendisplay_studio.validation import DashboardValidationError
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY
from tests.test_items import dashboard as dashboard_with


def entry(start: float | None, color: str) -> dict[str, object]:
    return {"from": start, "color": color}


def test_no_ranges_leave_the_scale_without_color() -> None:
    assert spans_of([], 0, 100) == []


def test_each_range_lasts_until_the_next_one_starts() -> None:
    ranges = [entry(None, "green"), entry(40, "yellow"), entry(80, "red")]

    assert spans_of(ranges, 0, 100) == [
        Span(0, 40, "green"),
        Span(40, 80, "yellow"),
        Span(80, 100, "red"),
    ]


def test_ranges_are_put_in_order_whatever_order_they_were_written() -> None:
    ranges = [entry(80, "red"), entry(None, "green"), entry(40, "yellow")]

    assert [span.color for span in spans_of(ranges, 0, 100)] == [
        "green",
        "yellow",
        "red",
    ]


def test_the_scale_has_no_color_before_the_first_range_when_it_starts_later() -> None:
    assert spans_of([entry(40, "yellow")], 0, 100) == [Span(40, 100, "yellow")]


def test_a_range_that_starts_at_or_below_the_lowest_value_starts_at_it() -> None:
    assert spans_of([entry(-50, "blue")], 0, 100) == [Span(0, 100, "blue")]
    assert spans_of([entry(0, "blue")], 0, 100) == [Span(0, 100, "blue")]


def test_a_range_that_starts_at_or_beyond_the_highest_value_is_left_out() -> None:
    ranges = [entry(None, "green"), entry(100, "red"), entry(150, "blue")]

    assert spans_of(ranges, 0, 100) == [Span(0, 100, "green")]


def test_of_two_ranges_with_the_same_start_the_later_one_wins() -> None:
    ranges = [entry(40, "yellow"), entry(40, "red")]

    assert spans_of(ranges, 0, 100) == [Span(40, 100, "red")]


def test_the_ranges_work_on_a_scale_of_fractions_and_of_negative_numbers() -> None:
    assert spans_of([entry(None, "a"), entry(0.4, "b")], 0, 1) == [
        Span(0, 0.4, "a"),
        Span(0.4, 1, "b"),
    ]
    assert spans_of([entry(None, "a"), entry(0, "b")], -10, 10) == [
        Span(-10, 0, "a"),
        Span(0, 10, "b"),
    ]


def widget_with(ranges: object) -> dict[str, object]:
    return {
        "id": "g",
        "kind": "widget",
        "name": "gauge_1",
        "locked": False,
        "hidden": False,
        "frame": {"x": 0, "y": 0, "width": 240, "height": 160},
        "widget": {
            "type": "gauge",
            "version": "1.0.0",
            "sources": {"entities": [{"id": "sensor.cpu"}]},
            "options": {"ranges": ranges},
        },
    }


def stored(ranges: object) -> object:
    value = validate_dashboard(dashboard_with([widget_with(ranges)]), DEFAULT_REGISTRY)
    return value["items"][0]["widget"]["options"]["ranges"]


def test_a_new_widget_has_no_ranges() -> None:
    assert stored([]) == []


def test_ranges_are_kept_as_they_were_written() -> None:
    ranges = [entry(None, "green"), entry(0.4, "yellow")]

    assert stored(ranges) == ranges


@pytest.mark.parametrize(
    "ranges",
    [
        "green",
        [{"color": "green", "from": "soon"}],
        [{"from": 1, "color": "chartreuse"}],
        [{"from": 1}],
        [{"from": 1, "color": "red", "extra": 1}],
        [entry(index, "red") for index in range(9)],
        [5],
    ],
)
def test_ranges_that_make_no_sense_are_refused(ranges: object) -> None:
    with pytest.raises(DashboardValidationError):
        stored(ranges)
