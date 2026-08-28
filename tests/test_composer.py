"""Tests for render-time data aggregation and one-page composition."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.exceptions import HomeAssistantError
from liquid.exceptions import LiquidSyntaxError

from custom_components.opendisplay_studio.composer import (
    MAX_BACKGROUND_BYTES,
    ProjectComposeError,
    _read_background,
    _region_shape,
    _requirement_sources,
    async_compose_project,
)
from custom_components.opendisplay_studio.widgets import DEFAULT_REGISTRY, definition
from custom_components.opendisplay_studio.widgets.weather.provider import (
    WeatherLocalizer,
)


def test_requirement_contract_supports_many_and_optional_sources() -> None:
    requirement = {
        "key": "rows",
        "provider": "sensor",
        "configKey": "entities",
        "cardinality": "many",
        "optional": False,
    }
    assert _requirement_sources(
        {"entities": ["sensor.office", "sensor.kitchen"]}, requirement
    ) == ["sensor.office", "sensor.kitchen"]
    assert definition("text")["dataRequirements"] == []
    sensor = definition("sensor")
    assert sensor["fields"][0]["selector"]["entity"]["filter"]["domain"] == "sensor"
    assert sensor["dataRequirements"][0]["optional"] is False
    weather = definition("weather")
    assert weather["fields"][0]["selector"]["entity"]["filter"]["domain"] == ("weather")
    assert weather["dataRequirements"][0]["provider"] == "weather_forecast"


def test_entity_tile_shape_uses_physical_region_ratio() -> None:
    project = {"width": 800, "height": 480, "grid": {"columns": 3, "rows": 2}}
    assert (
        _region_shape(
            project,
            {"columnSpan": 2, "rowSpan": 1},
            gap=8,
        )
        == "wide"
    )
    assert (
        _region_shape(
            project,
            {"columnSpan": 1, "rowSpan": 2},
            gap=8,
        )
        == "tall"
    )


async def test_composer_skips_inactive_cells_and_applies_region_appearance(
    hass,
) -> None:
    project = {
        "palette": "bw",
        "width": 800,
        "height": 480,
        "screenPadding": 20,
        "regionGap": 12,
        "grid": {"columns": 2, "rows": 1},
        "regions": [
            {
                "id": "active",
                "label": "A",
                "row": 1,
                "column": 1,
                "rowSpan": 1,
                "columnSpan": 1,
                "appearance": {"showBackground": False, "showBorder": True},
            },
            {
                "id": "inactive",
                "row": 1,
                "column": 2,
                "rowSpan": 1,
                "columnSpan": 1,
            },
        ],
    }

    result = await async_compose_project(hass, project)

    assert "studio-region--transparent studio-region--bordered" in result.html
    assert (
        ".studio-region--transparent>.item{background:transparent!important}"
        in result.html
    )
    assert 'data-region-width="374.000"' in result.html
    assert "inactive" not in result.html
    assert "--studio-screen-padding:20px" in result.html
    assert "--studio-region-gap:12px" in result.html


def test_background_size_is_bounded_for_renderer_payload(tmp_path) -> None:
    image_path = tmp_path / "oversized.png"
    with image_path.open("wb") as file_handle:
        file_handle.truncate(MAX_BACKGROUND_BYTES + 1)

    with pytest.raises(ProjectComposeError, match="exceeds 5 MB"):
        _read_background(image_path)


async def test_sensor_requirements_are_deduplicated(hass) -> None:
    widget = {
        "type": "sensor",
        "version": "0.6.0",
        "config": {"entity": "sensor.office"},
    }
    project = {
        "palette": "bw",
        "grid": {"columns": 2, "rows": 1},
        "regions": [
            {
                "id": "a",
                "row": 1,
                "column": 1,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": widget,
            },
            {
                "id": "b",
                "row": 1,
                "column": 2,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": widget,
            },
        ],
    }
    resolve = AsyncMock(
        return_value={
            "values": {
                "sensor.office": {
                    "entity_id": "sensor.office",
                    "state": "22.8",
                    "unit": "°C",
                    "name": "Office",
                    "icon": "mdi-thermometer",
                    "updated_at": "08:15",
                }
            },
            "labels": {
                "choose_sensor": "Choose a sensor",
                "unavailable": "Unavailable",
                "unknown": "Unknown",
            },
        }
    )
    with (
        patch.object(
            DEFAULT_REGISTRY.provider("sensor", "sensor"),
            "async_resolve",
            resolve,
        ),
    ):
        result = await async_compose_project(hass, project)

    resolve.assert_awaited_once_with(hass, {"sensor.office"}, hass.config.language)
    assert result.html.count("22.8") == 2
    assert result.html.startswith(
        '<main class="screen screen--1bit screen--md studio-screen"'
    )
    assert result.html.count("mdi-thermometer od-sensor__icon") == 2
    assert result.html.count('class="od-sensor"') == 2
    assert result.html.count(">Office</h2>") == 2
    assert result.html.count(">08:15</h1>") == 2
    assert result.html.count(">sensor.office</span>") == 2
    assert "--studio-width:800px;--studio-height:480px" in result.html
    assert "--screen-w:800px;--screen-h:480px" in result.html
    assert (
        'class="studio-region studio-region--square studio-region--bordered"'
        not in result.html
    )
    assert 'data-region-width="388.000"' in result.html


async def test_display_preferences_become_trmnl_screen_classes(hass) -> None:
    project = {
        "theme": "dark",
        "fontFamily": "classic",
        "textScale": "small",
        "palette": "bw",
        "width": 400,
        "height": 300,
        "grid": {"columns": 1, "rows": 1},
        "regions": [],
    }

    result = await async_compose_project(hass, project)

    assert "screen--dark-mode" in result.html
    assert "screen--fonts-classic" in result.html
    assert "screen--text-scale-small" in result.html
    assert "var(--framework-semantic-canvas-bg-color,#fff)" in result.html


async def test_manual_background_uses_natural_image_scale_and_anchor(
    hass, tmp_path
) -> None:
    image_path = tmp_path / "mountains.png"
    image_path.write_bytes(b"\x89PNG\r\n\x1a\nlocal-image")
    project = {
        "palette": "bw",
        "width": 800,
        "height": 480,
        "background": {
            "media": {
                "media_content_id": "media-source://media_source/local/mountains.png",
                "media_content_type": "image/png",
            },
            "mode": "manual",
            "anchor": "bottom-right",
            "scale": 50,
        },
        "grid": {"columns": 1, "rows": 1},
        "regions": [],
    }

    with patch(
        "custom_components.opendisplay_studio.composer.async_resolve_media",
        AsyncMock(
            return_value=SimpleNamespace(
                path=image_path,
                mime_type="image/png",
            )
        ),
    ):
        result = await async_compose_project(hass, project)

    assert "data:image/png;base64," in result.html
    assert "studio-background-layer--manual" in result.html
    assert "--studio-background-scale:0.5" in result.html
    assert "--studio-background-x:flex-end" in result.html
    assert "--studio-background-y:flex-end" in result.html
    assert "--studio-background-position:right bottom" in result.html
    assert "width:auto!important;height:auto!important" in result.html


@pytest.mark.parametrize(
    ("mode", "object_fit"),
    [("stretch", "fill"), ("contain", "contain"), ("cover", "cover")],
)
async def test_fitted_background_modes_map_to_css_object_fit(
    hass, tmp_path, mode: str, object_fit: str
) -> None:
    image_path = tmp_path / "background.jpg"
    image_path.write_bytes(b"\xff\xd8\xfflocal-image")
    project = {
        "palette": "bw",
        "background": {
            "media": {
                "media_content_id": "media-source://media_source/local/background.jpg",
                "media_content_type": "image/jpeg",
            },
            "mode": mode,
            "anchor": "top-left",
            "scale": 100,
        },
        "grid": {"columns": 1, "rows": 1},
        "regions": [],
    }

    with patch(
        "custom_components.opendisplay_studio.composer.async_resolve_media",
        AsyncMock(
            return_value=SimpleNamespace(path=image_path, mime_type="image/jpeg")
        ),
    ):
        result = await async_compose_project(hass, project)

    assert '<div class="studio-background-layer" aria-hidden="true"' in result.html
    assert f"--studio-background-fit:{object_fit}" in result.html


async def test_background_requires_local_media_path(hass) -> None:
    project = {
        "palette": "bw",
        "background": {
            "media": {
                "media_content_id": "media-source://remote/image.png",
                "media_content_type": "image/png",
            },
            "mode": "contain",
            "anchor": "center",
            "scale": 100,
        },
        "grid": {"columns": 1, "rows": 1},
        "regions": [],
    }

    with (
        patch(
            "custom_components.opendisplay_studio.composer.async_resolve_media",
            AsyncMock(return_value=SimpleNamespace(path=None, mime_type="image/png")),
        ),
        pytest.raises(ProjectComposeError, match="local Home Assistant media"),
    ):
        await async_compose_project(hass, project)


async def test_background_rejects_mislabeled_content(hass, tmp_path) -> None:
    image_path = tmp_path / "invalid.png"
    image_path.write_bytes(b"not-a-png")
    project = {
        "palette": "bw",
        "background": {
            "media": {
                "media_content_id": "media-source://media_source/local/invalid.png",
                "media_content_type": "image/png",
            },
            "mode": "contain",
            "anchor": "center",
            "scale": 100,
        },
        "grid": {"columns": 1, "rows": 1},
        "regions": [],
    }

    with (
        patch(
            "custom_components.opendisplay_studio.composer.async_resolve_media",
            AsyncMock(
                return_value=SimpleNamespace(path=image_path, mime_type="image/png")
            ),
        ),
        pytest.raises(ProjectComposeError, match="content is invalid"),
    ):
        await async_compose_project(hass, project)


async def test_provider_error_is_exposed_as_compose_error(hass) -> None:
    project = {
        "palette": "bw",
        "grid": {"columns": 1, "rows": 1},
        "regions": [
            {
                "id": "entity",
                "row": 1,
                "column": 1,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": {
                    "type": "sensor",
                    "version": "0.6.0",
                    "config": {"entity": "sensor.office"},
                },
            }
        ],
    }
    with (
        patch.object(
            DEFAULT_REGISTRY.provider("sensor", "sensor"),
            "async_resolve",
            AsyncMock(side_effect=HomeAssistantError("calendar unavailable")),
        ),
        pytest.raises(ProjectComposeError),
    ):
        await async_compose_project(hass, project)


async def test_liquid_syntax_error_is_exposed_as_compose_error(hass) -> None:
    project = {
        "palette": "bw",
        "grid": {"columns": 1, "rows": 1},
        "regions": [
            {
                "id": "text",
                "row": 1,
                "column": 1,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": {
                    "type": "text",
                    "version": "0.5.0",
                    "config": {"text": "Broken"},
                },
            }
        ],
    }

    with (
        patch(
            "custom_components.opendisplay_studio.composer.render_liquid",
            side_effect=LiquidSyntaxError("broken template", token=None),
        ),
        pytest.raises(ProjectComposeError, match="Could not render text widget"),
    ):
        await async_compose_project(hass, project)


async def test_remote_widget_asset_is_rejected_before_renderer(hass) -> None:
    project = {
        "palette": "bw",
        "grid": {"columns": 1, "rows": 1},
        "regions": [
            {
                "id": "text",
                "row": 1,
                "column": 1,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": {
                    "type": "text",
                    "version": "0.5.0",
                    "config": {"text": "Remote"},
                },
            }
        ],
    }

    with (
        patch.object(
            DEFAULT_REGISTRY,
            "template",
            return_value='<img src="https://example.com/remote.svg">',
        ),
        pytest.raises(
            ProjectComposeError,
            match="text widget uses undeclared remote asset origin",
        ),
    ):
        await async_compose_project(hass, project)


async def test_weather_widget_renders_normalized_home_assistant_data(hass) -> None:
    project = {
        "palette": "bw",
        "width": 190,
        "height": 228,
        "grid": {"columns": 1, "rows": 1},
        "regions": [
            {
                "id": "weather",
                "row": 1,
                "column": 1,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": {
                    "type": "weather",
                    "version": "0.5.0",
                    "config": {"weather": "weather.home"},
                },
            }
        ],
    }
    weather = {
        "weather.home": {
            "entity_id": "weather.home",
            "name": "Home",
            "condition": "rainy",
            "condition_label": "Rain",
            "icon": "mdi-weather-rainy",
            "temperature": 12,
            "temperature_unit": "°C",
            "apparent_temperature": 9,
            "humidity": 88,
            "updated_at": "08:15",
        }
    }

    resolve = AsyncMock(
        return_value=SimpleNamespace(
            values=weather, localizer=WeatherLocalizer.english()
        )
    )
    with patch.object(
        DEFAULT_REGISTRY.provider("weather", "weather_forecast"),
        "async_resolve",
        resolve,
    ):
        result = await async_compose_project(hass, project)

    resolve.assert_awaited_once_with(hass, {"weather.home"}, hass.config.language)
    assert "od-weather" in result.html
    assert "12°" in result.html
    assert "08:15" in result.html
    assert "--studio-screen-padding:0px" in result.html
    assert "--studio-region-gap:0px" in result.html
    assert 'data-region-width="190.000"' in result.html
    assert 'data-region-height="228.000"' in result.html


async def test_weather_widget_renders_placeholder_before_entity_selection(hass) -> None:
    """A newly added Weather widget must render before its selector is configured."""
    project = {
        "palette": "bw",
        "width": 400,
        "height": 300,
        "grid": {"columns": 1, "rows": 1},
        "regions": [
            {
                "id": "weather",
                "row": 1,
                "column": 1,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": {
                    "type": "weather",
                    "version": "0.5.0",
                    "config": {"weather": "", "showForecast": False},
                },
            }
        ],
    }

    resolve = AsyncMock(
        return_value=SimpleNamespace(values={}, localizer=WeatherLocalizer.english())
    )
    with patch.object(
        DEFAULT_REGISTRY.provider("weather", "weather_forecast"),
        "async_resolve",
        resolve,
    ):
        result = await async_compose_project(hass, project)

    resolve.assert_awaited_once_with(hass, set(), hass.config.language)
    assert "Choose a weather entity" in result.html
    assert "—°" in result.html


async def test_weather_widget_uses_project_language_for_every_render_surface(
    hass,
) -> None:
    project = {
        "language": "pl",
        "palette": "bw",
        "width": 400,
        "height": 300,
        "grid": {"columns": 1, "rows": 1},
        "regions": [
            {
                "id": "weather",
                "row": 1,
                "column": 1,
                "rowSpan": 1,
                "columnSpan": 1,
                "widget": {
                    "type": "weather",
                    "version": "0.5.0",
                    "config": {"weather": "weather.home"},
                },
            }
        ],
    }
    labels = {
        **WeatherLocalizer.english().labels,
        "weather": "Pogoda",
        "temperature": "Temperatura",
        "apparent_temperature": "Odczuwalna temperatura",
        "humidity": "Wilgotność",
        "right_now": "Teraz",
        "uv_moderate": "Umiarkowane",
    }
    localizer = WeatherLocalizer(
        language="pl",
        labels=labels,
        condition_labels={"sunny": "słonecznie"},
    )
    weather = {
        "weather.home": {
            "entity_id": "weather.home",
            "name": "OpenWeatherMap",
            "condition": "sunny",
            "condition_label": "słonecznie",
            "icon": "mdi-white-balance-sunny",
            "temperature": 11,
            "temperature_unit": "°C",
            "apparent_temperature": 10,
            "humidity": 93,
            "updated_at": "06:02",
            "forecast": [],
        }
    }
    resolve = AsyncMock(
        return_value=SimpleNamespace(values=weather, localizer=localizer)
    )
    with patch.object(
        DEFAULT_REGISTRY.provider("weather", "weather_forecast"),
        "async_resolve",
        resolve,
    ):
        result = await async_compose_project(hass, project)

    resolve.assert_awaited_once_with(hass, {"weather.home"}, "pl")
    assert "słonecznie" in result.html
    assert "Temperatura" in result.html
    assert "Odczuwalna temperatura" in result.html
    assert "Wilgotność" in result.html
    assert "Teraz" in result.html
