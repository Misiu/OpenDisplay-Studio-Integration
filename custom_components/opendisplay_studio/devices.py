"""The displays of the OpenDisplay integration, as starting points for a dashboard."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, Final

from homeassistant.helpers import device_registry as dr

from .const import DOMAIN, SENT_PREFIX
from .palette import PALETTE_BY_COLOR_SCHEME, PALETTE_COLORS

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

OPENDISPLAY_DOMAIN: Final = "opendisplay"


def _palette(color_scheme: Any) -> str:
    """Return the palette of a colour scheme, an enum member or its number."""
    name = getattr(color_scheme, "name", None)
    return PALETTE_BY_COLOR_SCHEME.get(str(name), "bw")


def _display_device(entry: Any, registry: dr.DeviceRegistry) -> dict[str, Any] | None:
    """Describe the display of a loaded entry, or return `None` if it is not loaded."""
    runtime = getattr(entry, "runtime_data", None)
    if runtime is None:
        return None
    display = runtime.device_config.displays[0]
    devices = dr.async_entries_for_config_entry(registry, entry.entry_id)
    device = devices[0] if devices else None
    palette = _palette(display.color_scheme_enum)
    return {
        "id": device.id if device else entry.entry_id,
        "name": (device and (device.name_by_user or device.name)) or entry.title,
        "manufacturer": device.manufacturer if device else None,
        "model": device.model if device else None,
        "width": int(display.pixel_width),
        "height": int(display.pixel_height),
        "palette": palette,
        "colors": list(PALETTE_COLORS[palette]),
    }


def list_display_devices(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Return every OpenDisplay device that is set up, with its size and colours."""
    registry = dr.async_get(hass)
    described = (
        _display_device(entry, registry)
        for entry in hass.config_entries.async_entries(OPENDISPLAY_DOMAIN)
    )
    return sorted(
        (device for device in described if device is not None),
        key=lambda device: str(device["name"]).casefold(),
    )


async def async_send_to_device(hass: HomeAssistant, device_id: str, png: bytes) -> None:
    """
    Upload a picture to an OpenDisplay device with the integration's own service.

    The service reads its image through the Media Source, so the picture is kept
    in the render cache and named by a `sent-<token>` identifier. It is already
    turned for the display, so the service does not rotate it again.
    """
    token = hass.data[DOMAIN].cache.put(png)
    await hass.services.async_call(
        OPENDISPLAY_DOMAIN,
        "upload_image",
        {
            "device_id": device_id,
            "image": {
                "media_content_id": f"media-source://{DOMAIN}/{SENT_PREFIX}{token}",
                "media_content_type": "image/png",
            },
            "rotation": 0,
        },
        blocking=True,
    )
