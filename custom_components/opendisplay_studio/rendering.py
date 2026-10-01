"""Bounded in-process ODL rendering shared by every output surface."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from io import BytesIO
from time import monotonic
from typing import Any

from aiohttp import ClientSession
from odl_renderer import generate_image  # type: ignore[import-untyped]
from odl_renderer.types import DataProvider  # type: ignore[import-untyped]
from PIL import Image


class OdlRenderError(RuntimeError):
    """ODL could not be converted into an exact-size PNG."""


@dataclass(frozen=True, slots=True)
class OdlRenderResult:
    """PNG bytes and timings measured by the local renderer."""

    png: bytes
    timings: dict[str, float]


def _encode_png(image: Image.Image, rotation: int) -> bytes:
    if rotation:
        # PIL turns counter-clockwise; the dashboard setting is clockwise.
        image = image.rotate(-rotation, expand=True)
    output = BytesIO()
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
            png = await asyncio.to_thread(_encode_png, image, rotation)
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
