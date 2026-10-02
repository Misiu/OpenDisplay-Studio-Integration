"""
Turn the image sources of `dlimg` elements into bytes the renderer can draw.

The renderer loads absolute file paths and web addresses itself. Both are unsafe
inside Home Assistant (an arbitrary file, blocking reads in the event loop), and it
knows nothing about camera entities or Home Assistant's `/local` and `/media` paths,
so every source is resolved here.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import TYPE_CHECKING, Any, Final

from homeassistant.exceptions import HomeAssistantError

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

ENTITY_PATTERN: Final = re.compile(r"^(camera|image)\.[a-z0-9_]+$")
LOCAL_PREFIX: Final = "/local/"
MEDIA_PREFIX: Final = "/media/"
MEDIA_SOURCE_PREFIX: Final = "media-source://"
MAX_IMAGE_BYTES: Final = 16 * 1024 * 1024


class ImageSourceError(Exception):
    """An image source could not be turned into image data."""


async def async_load_images(
    hass: HomeAssistant, elements: list[dict[str, Any]], warnings: list[str]
) -> list[dict[str, Any]]:
    """
    Return `elements` with every `dlimg` source replaced by the image bytes.

    An image that cannot be loaded is left out and reported, so one missing file
    never turns the whole dashboard into an error.
    """
    loaded: list[dict[str, Any]] = []
    for element in elements:
        if element.get("type") != "dlimg":
            loaded.append(element)
            continue
        try:
            source = await _async_load(hass, str(element["url"]))
        except ImageSourceError as err:
            warnings.append(f"Image {element['url']}: {err}")
            continue
        loaded.append({**element, "url": source})
    return loaded


async def _async_load(hass: HomeAssistant, url: str) -> str | bytes:
    """Return image bytes, or `url` itself when the renderer can fetch it safely."""
    if url.startswith(("http://", "https://", "data:")):
        return url
    if ENTITY_PATTERN.fullmatch(url):
        return await _async_entity_image(hass, url)
    if url.startswith(MEDIA_SOURCE_PREFIX):
        path = await _async_media_source_path(hass, url)
    else:
        path = _local_path(hass, url)
    return await hass.async_add_executor_job(_read, path)


async def _async_media_source_path(hass: HomeAssistant, uri: str) -> Path:
    """
    Resolve a media source of any kind (local media, Image upload, …) to its file.

    Only a source that is a file on this machine can be drawn: a stream or a
    service on the internet has nothing the renderer can read.
    """
    # Imported here: a dashboard without images never needs the media source component.
    from homeassistant.components import media_source  # noqa: PLC0415

    try:
        playable = await media_source.async_resolve_media(hass, uri, None)
    except media_source.Unresolvable as err:
        raise ImageSourceError(str(err)) from err
    if playable.path is None:
        message = "this media source gives no file Home Assistant can read"
        raise ImageSourceError(message)
    if not hass.config.is_allowed_path(str(playable.path)):
        message = "the file is outside the folders Home Assistant serves"
        raise ImageSourceError(message)
    return playable.path


async def _async_entity_image(hass: HomeAssistant, entity_id: str) -> bytes:
    # Imported here: the camera component pulls in image libraries that a
    # dashboard without a camera picture never needs.
    from homeassistant.components import camera, image  # noqa: PLC0415

    fetch = (
        camera.async_get_image
        if entity_id.startswith("camera.")
        else image.async_get_image
    )
    try:
        return bytes((await fetch(hass, entity_id)).content)
    except HomeAssistantError as err:
        raise ImageSourceError(str(err)) from err


def _local_path(hass: HomeAssistant, url: str) -> Path:
    """Map `/local/...` and `/media/<source>/...` to a file Home Assistant may serve."""
    if url.startswith(LOCAL_PREFIX):
        root = Path(hass.config.path("www"))
        relative = url.removeprefix(LOCAL_PREFIX)
    elif url.startswith(MEDIA_PREFIX):
        source, _, relative = url.removeprefix(MEDIA_PREFIX).partition("/")
        directory = hass.config.media_dirs.get(source)
        if directory is None:
            message = f"unknown media source {source!r}"
            raise ImageSourceError(message)
        root = Path(directory)
    else:
        raise ImageSourceError(
            "use a web address, a camera or image entity, a media source, "
            "/local/… or /media/…"
        )
    path = (root / relative).resolve()
    if not path.is_relative_to(root.resolve()) or not hass.config.is_allowed_path(
        str(path)
    ):
        raise ImageSourceError("the file is outside the folders Home Assistant serves")
    return path


def _read(path: Path) -> bytes:
    try:
        if path.stat().st_size > MAX_IMAGE_BYTES:
            raise ImageSourceError("the file is larger than 16 MB")
        return path.read_bytes()
    except OSError as err:
        message = f"the file cannot be read ({err.strerror})"
        raise ImageSourceError(message) from err
