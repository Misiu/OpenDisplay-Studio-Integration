"""The picture of a widget is the `preview.png` in its folder, whoever installed it."""

from __future__ import annotations

from io import BytesIO
from typing import TYPE_CHECKING

import pytest
from PIL import Image

from custom_components.opendisplay_studio.widgets.preview import (
    MAX_PREVIEW_BYTES,
    MAX_PREVIEW_SIZE,
    PREVIEW_FILE,
    read_preview,
)

if TYPE_CHECKING:
    from pathlib import Path

DATA_URL = "data:image/png;base64,"


def png(size: tuple[int, int], picture_format: str = "PNG") -> bytes:
    output = BytesIO()
    Image.new("RGB", size, "white").save(output, format=picture_format)
    return output.getvalue()


def test_a_widget_without_a_preview_has_none(tmp_path: Path) -> None:
    assert read_preview(tmp_path) is None


def test_a_preview_in_the_folder_is_given_as_a_data_url(tmp_path: Path) -> None:
    (tmp_path / PREVIEW_FILE).write_bytes(png((200, 100)))

    assert (read_preview(tmp_path) or "").startswith(DATA_URL)


def test_a_preview_as_large_as_the_area_is_accepted(tmp_path: Path) -> None:
    (tmp_path / PREVIEW_FILE).write_bytes(png(MAX_PREVIEW_SIZE))

    assert read_preview(tmp_path) is not None


@pytest.mark.parametrize(
    "picture",
    [
        png((MAX_PREVIEW_SIZE[0] + 1, 100)),
        png((100, MAX_PREVIEW_SIZE[1] + 1)),
        png((100, 100), "JPEG"),
        b"this is not a picture",
        b"0" * (MAX_PREVIEW_BYTES + 1),
    ],
    ids=["too wide", "too tall", "not a PNG", "not a picture", "too heavy"],
)
def test_a_preview_that_does_not_fit_is_left_out(
    tmp_path: Path, picture: bytes
) -> None:
    (tmp_path / PREVIEW_FILE).write_bytes(picture)

    assert read_preview(tmp_path) is None
