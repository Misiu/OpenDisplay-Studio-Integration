"""The picture of a widget: `preview.png` in its folder, for the list of widgets."""

from __future__ import annotations

from base64 import b64encode
from io import BytesIO
from pathlib import Path
from typing import Final

from PIL import Image, UnidentifiedImageError

from custom_components.opendisplay_studio.const import LOGGER

PREVIEW_FILE: Final = "preview.png"
# Every picture is shown in the same area, so none may be larger than it.
MAX_PREVIEW_SIZE: Final = (400, 240)
MAX_PREVIEW_BYTES: Final = 200 * 1024


def _problem_with(data: bytes) -> str | None:
    """Return why `data` cannot be a preview, or None when it can."""
    if len(data) > MAX_PREVIEW_BYTES:
        return f"it is larger than {MAX_PREVIEW_BYTES // 1024} KB"
    try:
        with Image.open(BytesIO(data)) as image:
            picture_format, size = image.format, image.size
    except UnidentifiedImageError, OSError:
        return "it is not a picture"
    if picture_format != "PNG":
        return "it is not a PNG"
    if size[0] > MAX_PREVIEW_SIZE[0] or size[1] > MAX_PREVIEW_SIZE[1]:
        return f"it is larger than {MAX_PREVIEW_SIZE[0]} x {MAX_PREVIEW_SIZE[1]} pixels"
    return None


def read_preview(directory: Path) -> str | None:
    """
    Return the preview of the widget in `directory` as a data URL.

    A widget without a preview, or with one that does not fit the area it is shown in,
    has none; the widget itself still loads. Reads the disk: call it in an executor.
    """
    path = directory / PREVIEW_FILE
    if not path.is_file():
        return None
    data = path.read_bytes()
    problem = _problem_with(data)
    if problem:
        LOGGER.warning("%s/%s is not used: %s", directory.name, PREVIEW_FILE, problem)
        return None
    return "data:image/png;base64," + b64encode(data).decode("ascii")
