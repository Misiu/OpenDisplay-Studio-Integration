"""Typed client for the OpenDisplay Studio Renderer API."""

from __future__ import annotations

import json
from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any, TypedDict

from aiohttp import ClientError, ClientSession, ClientTimeout
from yarl import URL

from .const import API_VERSION


class RendererHealth(TypedDict):
    """Validated Renderer health data."""

    status: str
    version: str
    apiVersion: int


@dataclass(frozen=True, slots=True)
class RenderResult:
    """Raw PNG and App-provided timing measurements."""

    png: bytes
    timings: dict[str, float]


class RendererError(Exception):
    """Base Renderer client error."""


class RendererConnectionError(RendererError):
    """Renderer could not be reached."""


class RendererAuthenticationError(RendererError):
    """Renderer rejected its bearer token."""


class RendererResponseError(RendererError):
    """Renderer returned an invalid or unsuccessful response."""


class RendererIncompatibleError(RendererError):
    """Renderer API version is incompatible."""


class RendererClient:
    """Small client for health and HTML-to-PNG operations."""

    def __init__(
        self, session: ClientSession, base_url: str, auth_token: str = ""
    ) -> None:
        """Initialize a Renderer client."""
        url = URL(base_url)
        if url.scheme not in {"http", "https"} or not url.host:
            raise ValueError("Renderer URL must be an absolute HTTP(S) URL")
        self._session = session
        self._base_url = url.with_path("").with_query(None).with_fragment(None)
        self._headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}

    async def async_health(self) -> RendererHealth:
        """Return validated health and compatibility data."""
        try:
            async with self._session.get(
                self._base_url.with_path("/health"),
                timeout=ClientTimeout(total=10),
            ) as response:
                if response.status != 200:
                    message = f"Renderer health returned HTTP {response.status}"
                    raise RendererResponseError(message)
                try:
                    payload: Any = await response.json(content_type=None)
                except (json.JSONDecodeError, UnicodeDecodeError) as err:
                    raise RendererResponseError(
                        "Renderer returned invalid health JSON"
                    ) from err
        except RendererError:
            raise
        except (ClientError, TimeoutError) as err:
            raise RendererConnectionError("Could not connect to Renderer") from err

        if not isinstance(payload, Mapping):
            raise RendererResponseError("Renderer health is not an object")
        status = payload.get("status")
        version = payload.get("version")
        api_version = payload.get("apiVersion")
        if (
            status != "ok"
            or not isinstance(version, str)
            or not isinstance(api_version, int)
            or isinstance(api_version, bool)
        ):
            raise RendererResponseError("Renderer health fields are invalid")
        if api_version != API_VERSION:
            message = (
                f"Renderer API {api_version} is incompatible with API {API_VERSION}"
            )
            raise RendererIncompatibleError(message)
        return RendererHealth(
            status=status,
            version=version,
            apiVersion=api_version,
        )

    async def async_render(self, *, html: str, width: int, height: int) -> RenderResult:
        """Render HTML and return raw PNG data and timing response headers."""
        try:
            async with self._session.post(
                self._base_url.with_path("/render"),
                headers=self._headers,
                json={"html": html, "width": width, "height": height},
                timeout=ClientTimeout(total=30),
            ) as response:
                if response.status == 401:
                    raise RendererAuthenticationError(
                        "Renderer rejected its discovery token"
                    )
                if response.status != 200:
                    message = f"Renderer returned HTTP {response.status}"
                    raise RendererResponseError(message)
                if response.content_type != "image/png":
                    raise RendererResponseError("Renderer did not return image/png")
                png = await response.read()
                if not png.startswith(b"\x89PNG\r\n\x1a\n"):
                    raise RendererResponseError("Renderer returned invalid PNG data")
                timings = {
                    name: value
                    for name, header in {
                        "queue": "X-ODX-Queue-Time",
                        "dom": "X-ODX-DOM-Time",
                        "layout": "X-ODX-Layout-Time",
                        "screenshot": "X-ODX-Screenshot-Time",
                        "total": "X-ODX-Render-Time",
                    }.items()
                    if (value := _float_header(response.headers.get(header)))
                    is not None
                }
        except RendererError:
            raise
        except (ClientError, TimeoutError) as err:
            raise RendererConnectionError("Could not connect to Renderer") from err
        return RenderResult(png=png, timings=timings)


def _float_header(value: str | None) -> float | None:
    """Parse a finite, non-negative millisecond response header."""
    if value is None:
        return None
    try:
        parsed = float(value)
    except ValueError:
        return None
    return parsed if 0 <= parsed < float("inf") else None
