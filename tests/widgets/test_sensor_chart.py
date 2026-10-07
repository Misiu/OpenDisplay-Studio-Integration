"""The sensor chart: what it draws from the history it is given, and how it gets it."""

from __future__ import annotations

from datetime import timedelta
from typing import TYPE_CHECKING, Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.util import dt as dt_util

from custom_components.opendisplay_studio.data_providers.entity_history import (
    MAX_POINTS,
    normalize_points,
)
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY
from scripts.widget_devkit.scenario import context_for, load_states, with_options
from tests.test_widgets import compile_widget, widget_item
from tests.widgets.test_catalog import widget_folder

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

WIDGET = "sensor-chart"


def _elements(
    state_id: str, size: tuple[int, int], **options: Any
) -> list[dict[str, Any]]:
    state = with_options(load_states(widget_folder(WIDGET))[state_id], options)
    context = context_for(DEFAULT_REGISTRY, WIDGET, state, size, "bw")
    return DEFAULT_REGISTRY.renderer(WIDGET)(context)


def _lines(elements: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [element for element in elements if element["type"] == "line"]


def _texts(elements: list[dict[str, Any]]) -> list[str]:
    return [e["value"] for e in elements if e["type"] == "text"]


def _record(moment: str, state: str) -> dict[str, str]:
    return {"state": state, "last_changed": moment}


def test_only_numeric_states_become_points() -> None:
    records = [
        _record("2026-09-30T08:00:00+00:00", "20.5"),
        _record("2026-09-30T08:10:00+00:00", "unavailable"),
        _record("2026-09-30T08:20:00+00:00", "21.5"),
    ]

    points = normalize_points(records)

    assert [point["value"] for point in points] == [20.5, 21.5]


def test_a_long_history_is_averaged_down_in_order() -> None:
    start = dt_util.parse_datetime("2026-09-30T00:00:00+00:00")
    assert start is not None
    records = [
        _record((start + timedelta(minutes=index)).isoformat(), str(index))
        for index in range(MAX_POINTS * 3)
    ]

    points = normalize_points(records)

    moments = [point["datetime"] for point in points]
    assert len(points) <= MAX_POINTS
    assert moments == sorted(moments)
    assert points[0]["value"] < points[-1]["value"]


def test_one_line_joins_each_pair_of_neighbouring_points() -> None:
    state = load_states(widget_folder(WIDGET))["temperature"]
    points = state["data"]["entities"][0]["points"]

    lines = _lines(_elements("temperature", (385, 225)))

    assert len(lines) == len(points) - 1


def test_the_history_runs_from_the_left_of_the_chart_to_its_right() -> None:
    lines = _lines(_elements("temperature", (385, 225)))

    assert lines[0]["x_start"] < 30
    assert lines[-1]["x_end"] > 385 - 30
    assert [line["x_start"] for line in lines] == sorted(
        line["x_start"] for line in lines
    )


def test_a_higher_value_is_drawn_higher() -> None:
    state = load_states(widget_folder(WIDGET))["temperature"]
    values = [p["value"] for p in state["data"]["entities"][0]["points"]]
    lines = _lines(_elements("temperature", (385, 225), smoothing=False))

    highest = values.index(max(values))
    lowest = values.index(min(values))

    top = lines[highest - 1]["y_end"]
    bottom = lines[lowest - 1]["y_end"]
    assert top < bottom


def test_the_extremes_and_the_span_are_written_under_the_chart() -> None:
    written = _texts(_elements("temperature", (385, 460)))

    assert "Min 18.4 °C" in written
    assert "Max 23.6 °C" in written
    assert "Last 24 hours" in written


def test_the_span_follows_the_hours_and_the_language() -> None:
    written = _texts(_elements("week", (385, 460)))

    assert "Ostatnie 7 dni" in written


def test_the_time_of_the_last_update_is_relative_to_now() -> None:
    assert "Updated 5 min ago" in _texts(_elements("temperature", (385, 460)))


def test_the_details_can_be_turned_off() -> None:
    written = _texts(
        _elements(
            "temperature",
            (385, 460),
            showChip=False,
            showEntityId=False,
            showUpdated=False,
            showMinMax=False,
        )
    )

    assert "SENSOR" not in written
    assert "sensor.living_room_temperature" not in written
    assert not any(text.startswith("Updated") for text in written)
    assert not any(text.startswith(("Min", "Max")) for text in written)


def test_an_entity_without_history_says_so_and_draws_no_line() -> None:
    elements = _elements("no-history", (385, 225))

    assert _lines(elements) == []
    assert "No history yet" in _texts(elements)


def test_a_value_that_never_changed_is_a_straight_line() -> None:
    lines = _lines(_elements("flat", (385, 225)))

    assert len({line["y_start"] for line in lines}) == 1


def test_a_wide_frame_puts_the_chart_beside_the_value() -> None:
    wide = _lines(_elements("temperature", (780, 225)))
    tall = _lines(_elements("temperature", (385, 460)))

    assert wide[0]["x_start"] > 780 * 0.35
    assert tall[0]["x_start"] < 385 * 0.1


@pytest.mark.parametrize("size", [(200, 120), (296, 128), (385, 225), (780, 450)])
def test_everything_stays_inside_the_frame(size: tuple[int, int]) -> None:
    elements = _elements("temperature", size)

    for element in elements:
        x = element.get("x", element.get("x_start"))
        y = element.get("y", element.get("y_start"))
        if x is not None and y is not None:
            assert 0 <= x <= size[0]
            assert 0 <= y <= size[1]


async def test_the_chart_reads_the_recorded_history(hass: HomeAssistant) -> None:
    hass.states.async_set(
        "sensor.kitchen",
        "21.5",
        {"friendly_name": "Kitchen", "unit_of_measurement": "°C"},
    )
    now = dt_util.utcnow()
    records = {
        "sensor.kitchen": [
            _record((now - timedelta(hours=hours)).isoformat(), str(value))
            for hours, value in ((20, 18), (15, 19), (10, 22), (5, 20), (1, 21))
        ]
    }
    item = widget_item(
        WIDGET,
        sources={"entities": [{"id": "sensor.kitchen"}]},
        frame={"x": 0, "y": 0, "width": 385, "height": 225},
    )

    with patch(
        "custom_components.opendisplay_studio.data_providers.entity_history"
        ".async_fetch_records",
        AsyncMock(return_value=records),
    ) as fetch:
        compiled = await compile_widget(hass, item)

    assert fetch.await_args.args[2] == 24 * 3600
    assert len(_lines(compiled.elements)) == 4
    assert "Min 18 °C" in _texts(compiled.elements)


async def test_without_a_recorder_the_chart_still_shows_the_value(
    hass: HomeAssistant,
) -> None:
    hass.states.async_set("sensor.kitchen", "21.5", {"friendly_name": "Kitchen"})
    item = widget_item(WIDGET, sources={"entities": [{"id": "sensor.kitchen"}]})

    compiled = await compile_widget(hass, item)

    assert "21.5" in _texts(compiled.elements)
    assert "No history yet" in _texts(compiled.elements)
