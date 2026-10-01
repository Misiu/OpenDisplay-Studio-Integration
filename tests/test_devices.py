"""A new dashboard can start from the display of an OpenDisplay device."""

from __future__ import annotations

from enum import Enum
from types import SimpleNamespace
from typing import TYPE_CHECKING

from homeassistant.helpers import device_registry as dr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.opendisplay_studio.devices import list_display_devices

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


class ColorScheme(Enum):
    """Stands in for the colour scheme enum of the `opendisplay` library."""

    MONO = 0
    BWR = 1
    BWGBRY = 4


def add_device(
    hass: HomeAssistant,
    title: str,
    display: tuple[int, int, ColorScheme] | None,
    custom_name: str | None = None,
) -> None:
    """Set up an entry for a device; without a `display` it is not loaded."""
    entry = MockConfigEntry(domain="opendisplay", title=title, unique_id=title)
    entry.add_to_hass(hass)
    if display is not None:
        width, height, scheme = display
        panel = SimpleNamespace(
            pixel_width=width, pixel_height=height, color_scheme_enum=scheme
        )
        entry.runtime_data = SimpleNamespace(
            device_config=SimpleNamespace(displays=[panel])
        )
    registry = dr.async_get(hass)
    device = registry.async_get_or_create(
        config_entry_id=entry.entry_id,
        connections={(dr.CONNECTION_BLUETOOTH, title)},
        name=title,
        manufacturer="Seeed",
        model='7.5" BWR',
    )
    if custom_name:
        registry.async_update_device(device.id, name_by_user=custom_name)


async def test_every_loaded_device_is_listed_with_its_size_and_colors(
    hass: HomeAssistant,
) -> None:
    add_device(hass, "Hall", (800, 480, ColorScheme.BWR))

    [device] = list_display_devices(hass)

    assert device["name"] == "Hall"
    assert (device["width"], device["height"]) == (800, 480)
    assert device["palette"] == "bwr"
    assert device["colors"] == ["black", "white", "red"]
    assert device["model"] == '7.5" BWR'


async def test_the_name_the_user_gave_the_device_wins(hass: HomeAssistant) -> None:
    add_device(hass, "AA:BB", (296, 128, ColorScheme.MONO), "Kitchen")

    assert list_display_devices(hass)[0]["name"] == "Kitchen"


async def test_devices_are_sorted_by_name_and_unloaded_ones_left_out(
    hass: HomeAssistant,
) -> None:
    add_device(hass, "bedroom", (400, 300, ColorScheme.MONO))
    add_device(hass, "Attic", (1200, 825, ColorScheme.BWGBRY))
    add_device(hass, "Offline", None)

    devices = list_display_devices(hass)

    assert [device["name"] for device in devices] == ["Attic", "bedroom"]
    assert devices[0]["palette"] == "spectra6"
    assert len(devices[0]["colors"]) == 6


async def test_without_the_integration_there_are_no_devices(
    hass: HomeAssistant,
) -> None:
    assert list_display_devices(hass) == []
