"""Tests for normalized Home Assistant widget providers."""

from custom_components.opendisplay_studio.data_providers import EntityStateProvider


def test_entity_provider_returns_normalized_current_state(hass) -> None:
    hass.states.async_set(
        "sensor.office_temperature",
        "22.8",
        {"friendly_name": "Office", "unit_of_measurement": "°C"},
    )

    result = EntityStateProvider(hass).get_many({"sensor.office_temperature"})

    assert result == {
        "sensor.office_temperature": {
            "state": "22.8",
            "unit": "°C",
            "name": "Office",
        }
    }
