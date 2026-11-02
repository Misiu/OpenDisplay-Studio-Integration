"""The panel lists, installs and removes fonts through WebSocket commands."""

from __future__ import annotations

from base64 import b64encode
from pathlib import Path
from typing import TYPE_CHECKING, Any

import odl_renderer
import pytest

from custom_components.opendisplay_studio import OpenDisplayStudioData
from custom_components.opendisplay_studio.fonts import BUNDLED_FONTS

from .test_items import dashboard, text

if TYPE_CHECKING:
    type Client = Any

FONT_FILE = Path(odl_renderer.__file__).parent / "assets" / "rbm.ttf"
FONT_DATA = b64encode(FONT_FILE.read_bytes()).decode("ascii")


def names_in(response: dict[str, Any]) -> list[str]:
    return [font["name"] for font in response["result"]["fonts"]]


async def test_the_bundled_fonts_are_listed_with_the_version_of_each_file(
    call: Any,
) -> None:
    response = await call("list_fonts")

    fonts = response["result"]["fonts"]
    assert [font["name"] for font in fonts] == list(BUNDLED_FONTS)
    assert all(font["bundled"] and font["usedBy"] == [] for font in fonts)
    assert all(font["version"] for font in fonts)


async def test_an_installed_font_is_listed_with_its_family_and_version(
    call: Any,
) -> None:
    response = await call("install_font", filename="Mono.ttf", data=FONT_DATA)

    assert response["success"]
    mono = response["result"]["fonts"][-1]
    assert mono["name"] == "Mono.ttf"
    assert mono["family"]
    assert not mono["bundled"]
    assert mono["version"]
    assert names_in(await call("list_fonts")) == [
        *BUNDLED_FONTS,
        "Mono.ttf",
    ]


@pytest.mark.parametrize(
    ("fields", "code"),
    [
        (
            {"filename": "Fake.ttf", "data": b64encode(b"not a font").decode()},
            "invalid_font",
        ),
        ({"filename": "Mono.ttf", "data": "%%%"}, "invalid_font"),
        ({"filename": "Mono.txt", "data": FONT_DATA}, "unsupported_type"),
        ({"filename": "ppb.ttf", "data": FONT_DATA}, "reserved_name"),
    ],
)
async def test_a_font_that_is_not_accepted_says_why(
    call: Any, fields: dict[str, str], code: str
) -> None:
    response = await call("install_font", **fields)

    assert not response["success"]
    assert response["error"]["code"] == code
    assert names_in(await call("list_fonts")) == list(BUNDLED_FONTS)


async def test_the_same_font_cannot_be_installed_twice(call: Any) -> None:
    await call("install_font", filename="Mono.ttf", data=FONT_DATA)

    response = await call("install_font", filename="Mono.ttf", data=FONT_DATA)

    assert response["error"]["code"] == "font_exists"


async def test_a_font_nobody_uses_is_removed(call: Any) -> None:
    await call("install_font", filename="Mono.ttf", data=FONT_DATA)

    response = await call("delete_font", name="Mono.ttf")

    assert names_in(response) == list(BUNDLED_FONTS)


async def test_the_bundled_fonts_cannot_be_removed(call: Any) -> None:
    response = await call("delete_font", name="ppb.ttf", force=True)

    assert response["error"]["code"] == "bundled_font"


async def use_mono(studio: OpenDisplayStudioData, name: str) -> None:
    await studio.dashboards.async_create(
        {**dashboard([text(font="Mono.ttf")]), "name": name}
    )


async def test_the_dashboards_that_use_a_font_are_named_in_the_list(
    call: Any, studio: OpenDisplayStudioData
) -> None:
    await call("install_font", filename="Mono.ttf", data=FONT_DATA)
    await use_mono(studio, "Kitchen")
    await use_mono(studio, "Hall")

    response = await call("list_fonts")

    mono = response["result"]["fonts"][-1]
    assert sorted(entry["name"] for entry in mono["usedBy"]) == ["Hall", "Kitchen"]


async def test_a_font_in_use_is_kept_unless_removing_it_is_forced(
    call: Any, studio: OpenDisplayStudioData
) -> None:
    await call("install_font", filename="Mono.ttf", data=FONT_DATA)
    await use_mono(studio, "Kitchen")

    refused = await call("delete_font", name="Mono.ttf")
    forced = await call("delete_font", name="Mono.ttf", force=True)

    assert refused["error"]["code"] == "font_in_use"
    assert names_in(forced) == list(BUNDLED_FONTS)
    # The dashboard keeps its choice and is drawn with the default font meanwhile.
    assert studio.dashboards.list()[0]["items"][0]["primitive"]["font"] == "Mono.ttf"


async def test_the_panel_gets_the_fonts_with_everything_else_at_start(
    call: Any,
) -> None:
    response = await call("bootstrap", language="en")

    assert [font["name"] for font in response["result"]["fonts"]] == list(BUNDLED_FONTS)
