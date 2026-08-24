"""Tests for normalized Home Assistant widget providers."""

from custom_components.opendisplay_studio.data_providers import EntityStateProvider


def test_entity_provider_returns_normalized_current_state(hass) -> None:
    hass.states.async_set(
        "sensor.office_temperature",
        "22.8",
        {
            "friendly_name": "Office",
            "unit_of_measurement": "°C",
            "device_class": "temperature",
        },
    )

    result = EntityStateProvider(hass).get_many({"sensor.office_temperature"})

    assert result == {
        "sensor.office_temperature": {
            "state": "22.8",
            "unit": "°C",
            "name": "Office",
            "iconPath": (
                "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 "
                "13 5V8H11V5A1 1 0 0 1 12 4Z"
            ),
        }
    }
