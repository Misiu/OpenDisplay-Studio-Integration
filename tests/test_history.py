"""A history plot is drawn from recorded states, and left out when there are none."""

from __future__ import annotations

from datetime import timedelta
from typing import TYPE_CHECKING, Any
from unittest.mock import patch

from homeassistant.util import dt as dt_util
from odl_renderer import generate_image  # type: ignore[import-untyped]
from pytest_homeassistant_custom_component.components.recorder.common import (
    async_wait_recording_done,
)

from custom_components.opendisplay_studio.history import (
    RecordedHistory,
    async_prefetch_history,
)

from .test_measure import HEIGHT, WIDTH, ink_box

if TYPE_CHECKING:
    from homeassistant.components.recorder import Recorder
    from homeassistant.core import HomeAssistant

FETCH = "custom_components.opendisplay_studio.history._async_fetch"


def plot_element(entity: str = "sensor.temperature") -> dict[str, Any]:
    return {
        "type": "plot",
        "x_start": 20,
        "y_start": 20,
        "x_end": 300,
        "y_end": 200,
        "duration": 3600,
        "data": [{"entity": entity, "color": "black", "width": 3}],
    }


def record(minutes_ago: int, state: str) -> dict[str, str]:
    moment = dt_util.utcnow() - timedelta(minutes=minutes_ago)
    return {"state": state, "last_changed": moment.isoformat()}


async def test_a_plot_is_drawn_from_the_history_it_was_given(
    hass: HomeAssistant,
) -> None:
    history = {
        "sensor.temperature": [
            record(50, "18"),
            record(35, "23"),
            record(20, "19"),
            record(5, "25"),
        ]
    }
    warnings: list[str] = []
    with patch(FETCH, return_value=history):
        elements, provider = await async_prefetch_history(
            hass, [plot_element()], warnings
        )

    image = await generate_image(
        WIDTH, HEIGHT, elements, background="white", data_provider=provider
    )

    assert warnings == []
    left, top, right, bottom = ink_box(image.convert("RGB"))
    assert 20 <= left <= right <= 301
    assert 20 <= top <= bottom <= 201


async def test_a_plot_without_a_recorder_is_left_out_with_a_warning(
    hass: HomeAssistant,
) -> None:
    warnings: list[str] = []

    elements, _ = await async_prefetch_history(hass, [plot_element()], warnings)

    assert elements == []
    assert warnings == ["History plot: the recorder is not running"]


async def test_a_plot_of_entities_that_never_had_a_number_is_left_out(
    hass: HomeAssistant,
) -> None:
    history = {"sensor.temperature": [record(10, "unavailable"), record(5, "unknown")]}
    warnings: list[str] = []

    with patch(FETCH, return_value=history):
        elements, _ = await async_prefetch_history(hass, [plot_element()], warnings)

    assert elements == []
    assert "sensor.temperature" in warnings[0]


async def test_other_elements_are_kept_and_need_no_history(
    hass: HomeAssistant,
) -> None:
    text = {"type": "text", "value": "a", "x": 1, "y": 2}

    elements, provider = await async_prefetch_history(hass, [text], [])

    assert elements == [text]
    assert provider is None


async def test_the_state_in_force_at_the_start_opens_the_plot() -> None:
    old = record(120, "10")
    recent = record(10, "20")
    history = RecordedHistory({"sensor.temperature": [old, recent]})
    end = dt_util.utcnow()
    start = end - timedelta(hours=1)

    records = (await history.get_history(["sensor.temperature"], start, end))[
        "sensor.temperature"
    ]

    assert [item["state"] for item in records] == ["10", "20"]
    assert records[0]["last_changed"] == start.isoformat()


async def test_a_plot_is_drawn_from_what_a_real_recorder_stored(
    recorder_mock: Recorder, hass: HomeAssistant
) -> None:
    hass.states.async_set("sensor.temperature", "10")
    hass.states.async_set("sensor.temperature", "20")
    hass.states.async_set("sensor.mode", "eco")
    await async_wait_recording_done(hass)
    warnings: list[str] = []

    kept, history = await async_prefetch_history(
        hass,
        [plot_element("sensor.temperature"), plot_element("sensor.mode")],
        warnings,
    )

    assert [element["data"][0]["entity"] for element in kept] == ["sensor.temperature"]
    assert warnings == ["History plot: no numeric history for sensor.mode"]
    assert history is not None
    end = dt_util.utcnow()
    stored = await history.get_history(
        ["sensor.temperature"], end - timedelta(hours=1), end
    )
    assert [record["state"] for record in stored["sensor.temperature"]] == ["10", "20"]
