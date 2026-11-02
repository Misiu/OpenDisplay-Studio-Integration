"""The fonts a dashboard can use: the renderer's own and the ones the user installed."""

from __future__ import annotations

import re
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path, PurePath
from typing import TYPE_CHECKING, Any, Final

import odl_renderer  # type: ignore[import-untyped]
from PIL import ImageFont

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

# The font every text is drawn with unless another is chosen, and the one a missing
# font is replaced by.
DEFAULT_FONT: Final = "ppb.ttf"
# Fonts the renderer ships with, and the ones this integration adds in `bundled_fonts/`.
# Every other name must be found in the user's folder.
RENDERER_FONTS: Final = (DEFAULT_FONT, "rbm.ttf")
STUDIO_FONTS: Final = (
    "Carlito-Regular.ttf",
    "Carlito-Bold.ttf",
    "AtkinsonHyperlegible-Regular.ttf",
    "AtkinsonHyperlegible-Bold.ttf",
    "Inter-SemiBold.ttf",
    "IBMPlexMono-Medium.ttf",
    "BarlowCondensed-Bold.ttf",
)
BUNDLED_FONTS: Final = (*RENDERER_FONTS, *STUDIO_FONTS)
RENDERER_FOLDER: Final = Path(odl_renderer.__file__).parent / "assets"
STUDIO_FOLDER: Final = Path(__file__).parent / "bundled_fonts"
FONT_EXTENSIONS: Final = frozenset({".ttf", ".otf"})
FONT_FOLDER: Final = ("opendisplay_studio", "fonts")
FONT_PATTERN: Final = re.compile(r"^[A-Za-z0-9][A-Za-z0-9 _.\-]{0,127}$")
# Home Assistant carries the file inside one WebSocket message, which is limited.
MAX_FONT_BYTES: Final = 2 * 1024 * 1024
_NOT_A_NAME: Final = re.compile(r"[^A-Za-z0-9 _.\-]+")
_SAMPLE_SIZE: Final = 16


class FontError(Exception):
    """A font cannot be installed or removed; `code` names the reason."""

    def __init__(self, code: str, message: str) -> None:
        """Say what went wrong in `message`, and give it a stable `code`."""
        super().__init__(message)
        self.code = code


@dataclass(frozen=True, slots=True)
class FontInfo:
    """What the panel shows of a font file."""

    name: str
    family: str
    style: str
    bundled: bool
    size: int
    modified: int

    def as_dict(self) -> dict[str, Any]:
        """Return the fields the panel is sent."""
        return {
            "name": self.name,
            "family": self.family,
            "style": self.style,
            "bundled": self.bundled,
            "size": self.size,
            # Changes with the file, so a browser asks again when the font is replaced.
            "version": self.modified,
        }


def font_directories(hass: HomeAssistant) -> list[str]:
    """Return the folders searched for a font: the user's, then our own fonts."""
    return [hass.config.path(*FONT_FOLDER), str(STUDIO_FOLDER)]


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


def font_file_name(filename: str) -> str:
    """
    Return `filename` as a name the renderer can look up: no folders, no odd characters.

    A name that cannot be made one, or that is not a font file, raises `FontError`.
    """
    name = _NOT_A_NAME.sub("_", PurePath(filename.replace("\\", "/")).name).lstrip(
        " ._-"
    )
    if Path(name).suffix.lower() not in FONT_EXTENSIONS:
        message = "Only .ttf and .otf font files can be installed"
        raise FontError("unsupported_type", message)
    if FONT_PATTERN.fullmatch(name) is None:
        message = f"{filename} cannot be used as the name of a font file"
        raise FontError("invalid_name", message)
    return name


def _family_and_style(source: str | BytesIO, fallback: str) -> tuple[str, str]:
    """Read the family and style a font file says it has."""
    try:
        font = ImageFont.truetype(source, _SAMPLE_SIZE)
    except OSError as err:
        message = f"{fallback} is not a font file the renderer can read"
        raise FontError("invalid_font", message) from err
    family, style = font.getname()
    return family or Path(fallback).stem, style or ""


class FontLibrary:
    """
    The fonts of the renderer and the folder where the user's fonts are kept.

    Every method reads or writes the disk: call them from an executor job.
    """

    def __init__(self, directory: Path) -> None:
        """Keep the fonts of the user in `directory`."""
        self._directory = directory

    @property
    def directories(self) -> list[str]:
        """Return the folders searched for a font: the user's, then our own."""
        return [str(self._directory), str(STUDIO_FOLDER)]

    def create_directory(self) -> None:
        """Make the folder for the user's fonts, so that dropping a file in it works."""
        self._directory.mkdir(parents=True, exist_ok=True)

    def names(self) -> list[str]:
        """List the file names of the bundled fonts, then of the installed ones."""
        return available_fonts(self.directories)

    def infos(self) -> list[FontInfo]:
        """Describe every font; a file that cannot be read is left out."""
        infos = []
        for name in self.names():
            try:
                infos.append(self.info(name))
            except FontError:
                continue
        return infos

    def path_of(self, name: str) -> Path:
        """Return the file of the font `name`, bundled or installed."""
        folder = self._directory
        if name in RENDERER_FONTS:
            folder = RENDERER_FOLDER
        elif name in STUDIO_FONTS:
            folder = STUDIO_FOLDER
        path = folder / name
        if FONT_PATTERN.fullmatch(name) is None or not path.is_file():
            raise FontError("not_found", f"There is no font {name}")
        return path

    def info(self, name: str) -> FontInfo:
        """Describe the font file `name`."""
        path = self.path_of(name)
        bundled = name in BUNDLED_FONTS
        family, style = _family_and_style(str(path), name)
        stat = path.stat()
        return FontInfo(name, family, style, bundled, stat.st_size, stat.st_mtime_ns)

    def install(self, filename: str, data: bytes) -> FontInfo:
        """Check a font file and keep it in the folder, never over another font."""
        name = font_file_name(filename)
        if name in BUNDLED_FONTS:
            message = f"{name} is one of the fonts that come with the renderer"
            raise FontError("reserved_name", message)
        if not data or len(data) > MAX_FONT_BYTES:
            message = (
                f"A font file must be between 1 byte and {MAX_FONT_BYTES // 1024} KB"
            )
            raise FontError("invalid_size", message)
        _family_and_style(BytesIO(data), name)
        target = self._directory / name
        if target.exists():
            raise FontError("font_exists", f"A font {name} is already installed")
        self.create_directory()
        partial = target.with_suffix(target.suffix + ".part")
        partial.write_bytes(data)
        partial.replace(target)
        return self.info(name)

    def remove(self, name: str) -> None:
        """Delete an installed font; the fonts of the renderer cannot be removed."""
        if name in BUNDLED_FONTS:
            message = f"{name} comes with the renderer and cannot be removed"
            raise FontError("bundled_font", message)
        path = self._directory / name
        if FONT_PATTERN.fullmatch(name) is None or not path.is_file():
            raise FontError("not_found", f"There is no installed font {name}")
        path.unlink()
