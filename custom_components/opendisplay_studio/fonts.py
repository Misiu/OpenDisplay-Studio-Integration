"""The fonts a dashboard can use: the renderer's own and the ones the user installed."""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING, Any, Final

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

# Fonts the renderer ships with; every other name must be found in the user's folder.
BUNDLED_FONTS: Final = ("ppb.ttf", "rbm.ttf")
FONT_EXTENSIONS: Final = frozenset({".ttf", ".otf"})
FONT_FOLDER: Final = ("opendisplay_studio", "fonts")


def font_directories(hass: HomeAssistant) -> list[str]:
    """Return the folders searched for a font: `<config>/opendisplay_studio/fonts`."""
    return [hass.config.path(*FONT_FOLDER)]


def available_fonts(directories: list[str]) -> list[str]:
    """
    List the bundled fonts, then the font files found in `directories`.

    Reads the disk: call it from an executor job.
    """
    installed = {
        path.name
        for directory in directories
        if Path(directory).is_dir()
        for path in Path(directory).iterdir()
        if path.suffix.lower() in FONT_EXTENSIONS and path.is_file()
    }
    return [*BUNDLED_FONTS, *sorted(installed - set(BUNDLED_FONTS), key=str.lower)]


def with_font_options(
    definitions: list[dict[str, Any]], fonts: list[str]
) -> list[dict[str, Any]]:
    """Give every `font` field, nested ones too, the list of `fonts` as its options."""

    def apply(fields: list[dict[str, Any]]) -> None:
        for field in fields:
            if field["shape"] == "font":
                field["options"] = list(fonts)
            apply(field.get("nested", []))

    for definition in definitions:
        apply(definition["fields"])
    return definitions
