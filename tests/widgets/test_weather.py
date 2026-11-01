"""The weather widget writes temperatures as reported, or to the places picked."""

from __future__ import annotations

from copy import deepcopy
from typing import Any

import pytest

from custom_components.opendisplay_studio.widgets import (
    BUILTIN_WIDGET_DIRECTORY,
    DEFAULT_REGISTRY,
)
from scripts.widget_devkit.scenario import context_for, draw, load_states, with_options

WIDGET = "weather"
STATES = load_states(BUILTIN_WIDGET_DIRECTORY / WIDGET)
SIZE = (360, 200)


async def words_of(state: dict[str, Any]) -> list[str]:
    context = context_for(DEFAULT_REGISTRY, WIDGET, state, SIZE, "bwr")
    _, elements = await draw(context, DEFAULT_REGISTRY.renderer(WIDGET))
    return [element["value"] for element in elements if element["type"] == "text"]


def with_temperatures(**options: Any) -> dict[str, Any]:
    state = with_options(deepcopy(STATES["daily"]), options)
    data = state["data"]["weather"][0]
    data["temperature"] = 18.46
    data["apparent_temperature"] = 16.04
    return state


@pytest.mark.parametrize(
    ("decimals", "temperature"),
    [("auto", "18.46°C"), ("0", "18°C"), ("1", "18.5°C"), ("2", "18.46°C")],
)
async def test_the_temperature_has_the_places_the_user_picks(
    decimals: str, temperature: str
) -> None:
    words = await words_of(with_temperatures(decimals=decimals))

    assert temperature in words


async def test_the_feels_like_temperature_has_the_same_places() -> None:
    words = await words_of(with_temperatures(decimals="1", showFeelsLike=True))

    assert any("16.0°C" in word for word in words)


async def test_the_forecast_has_the_same_places() -> None:
    state = with_temperatures(decimals="1")
    state["data"]["weather"][0]["forecast"][0]["temperature"] = 21.26

    words = await words_of(state)

    assert any(word.startswith("21.3°/") for word in words)


async def test_temperatures_are_written_as_reported_by_default() -> None:
    words = await words_of(with_options(deepcopy(STATES["daily"]), {}))

    assert "18.4°C" in words
