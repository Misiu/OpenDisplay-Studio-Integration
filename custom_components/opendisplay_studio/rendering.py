"""Bounded in-process ODL rendering shared by every output surface."""

from __future__ import annotations

import asyncio
import json
from dataclasses import dataclass
from io import BytesIO
from time import monotonic
from typing import Any

from aiohttp import ClientSession
from odl_renderer import generate_image  # type: ignore[import-untyped]
from odl_renderer.types import DataProvider  # type: ignore[import-untyped]
from PIL import Image, ImageChops, ImageDraw

# Left, top, right and bottom (exclusive) of what an element draws.
type InkBox = tuple[int, int, int, int]

INK_BOX_CACHE_LIMIT = 256


class OdlRenderError(RuntimeError):
    """ODL could not be converted into an exact-size PNG."""


@dataclass(frozen=True, slots=True)
class OdlRenderResult:
    """PNG bytes and timings measured by the local renderer."""

    png: bytes
    timings: dict[str, float]


def _with_clear_margin(image: Image.Image, margin: int) -> Image.Image:
    """
    Return the picture with the margin around the display see-through where it is empty.

    The renderer paints the background everywhere. In the margin that would hide the
    editor's own backdrop and make the display look larger than it is, so the pixels
    there that still have the background color become transparent; the display itself
    stays opaque.
    """
    rgb = image.convert("RGB")
    background = Image.new("RGB", rgb.size, rgb.getpixel((0, 0)))
    alpha = (
        ImageChops.difference(rgb, background)
        .convert("L")
        .point(lambda value: 255 if value else 0)
    )
    ImageDraw.Draw(alpha).rectangle(
        (margin, margin, rgb.width - margin - 1, rgb.height - margin - 1), fill=255
    )
    rgb.putalpha(alpha)
    return rgb


def _encode_png(image: Image.Image, rotation: int, margin: int = 0) -> bytes:
    if rotation:
        # PIL turns counter-clockwise; the dashboard setting is clockwise.
        image = image.rotate(-rotation, expand=True)
    output = BytesIO()
    if margin:
        _with_clear_margin(image, margin).save(output, format="PNG", optimize=False)
    else:
        image.convert("RGB").save(output, format="PNG", optimize=False)
    return output.getvalue()


class OdlRenderService:
    """Keep local rendering bounded without introducing another process."""

    def __init__(
        self,
        session: ClientSession,
        *,
        concurrency: int = 2,
        font_dirs: list[str] | None = None,
    ) -> None:
        self._session = session
        self._font_dirs = font_dirs or []
        self._semaphore = asyncio.Semaphore(concurrency)
        self._ink_boxes: dict[str, InkBox | None] = {}

    async def async_render(  # noqa: PLR0913
        self,
        *,
        width: int,
        height: int,
        elements: list[dict[str, Any]],
        background: str,
        accent_color: str,
        history: DataProvider | None = None,
        rotation: int = 0,
        margin: int = 0,
    ) -> OdlRenderResult:
        """Render ODL, check the size, then turn the picture clockwise by `rotation`."""
        requested_at = monotonic()
        async with self._semaphore:
            started_at = monotonic()
            try:
                image = await generate_image(
                    width,
                    height,
                    elements,
                    background=background,
                    accent_color=accent_color,
                    session=self._session,
                    data_provider=history,
                    font_dirs=self._font_dirs,
                )
            except (TypeError, ValueError, OSError) as err:
                raise OdlRenderError(str(err)) from err
            rendered_at = monotonic()
            if image.size != (width, height):
                message = (
                    f"ODL renderer returned {image.width}x{image.height}; "
                    f"expected {width}x{height}"
                )
                raise OdlRenderError(message)
            png = await asyncio.to_thread(_encode_png, image, rotation, margin)
            completed_at = monotonic()
        return OdlRenderResult(
            png=png,
            timings={
                "queue": round((started_at - requested_at) * 1000, 2),
                "render": round((rendered_at - started_at) * 1000, 2),
                "encode": round((completed_at - rendered_at) * 1000, 2),
                "total": round((completed_at - requested_at) * 1000, 2),
            },
        )

    async def async_ink_box(
        self,
        *,
        width: int,
        height: int,
        element: dict[str, Any],
        accent_color: str,
    ) -> InkBox | None:
        """
        Return where one element leaves ink, or None when it draws nothing.

        The renderer turns an element about the middle of what it drew, so the editor
        needs that very box. It is drawn on white and on black, because ink of the
        color of one background is plain on the other. Results are kept, because turning
        an element changes neither its ink nor this box.
        """
        key = json.dumps([width, height, accent_color, element], sort_keys=True)
        if key in self._ink_boxes:
            return self._ink_boxes[key]
        boxes = [
            await self._ink_box_on(background, width, height, element, accent_color)
            for background in ("white", "black")
        ]
        found = [box for box in boxes if box is not None]
        ink = (
            (
                min(box[0] for box in found),
                min(box[1] for box in found),
                max(box[2] for box in found),
                max(box[3] for box in found),
            )
            if found
            else None
        )
        if len(self._ink_boxes) >= INK_BOX_CACHE_LIMIT:
            self._ink_boxes.clear()
        self._ink_boxes[key] = ink
        return ink

    async def _ink_box_on(
        self,
        background: str,
        width: int,
        height: int,
        element: dict[str, Any],
        accent_color: str,
    ) -> InkBox | None:
        async with self._semaphore:
            try:
                image = await generate_image(
                    width,
                    height,
                    [element],
                    background=background,
                    accent_color=accent_color,
                    session=self._session,
                    font_dirs=self._font_dirs,
                )
            except TypeError, ValueError, OSError:
                return None
            rgb = image.convert("RGB")
            return ImageChops.difference(
                rgb, Image.new("RGB", rgb.size, background)
            ).getbbox()
