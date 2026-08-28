"""Resolve widget data and compose one final TRMNL HTML document."""

from __future__ import annotations

import asyncio
import base64
import re
from dataclasses import dataclass
from pathlib import Path
from time import perf_counter
from typing import Any
from urllib.parse import urlsplit

from homeassistant.components.media_source import async_resolve_media
from homeassistant.components.media_source.error import MediaSourceError
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from liquid.exceptions import LiquidError
from trmnl_liquid import render as render_liquid

from .const import DOMAIN
from .projects import Project
from .widgets import DEFAULT_REGISTRY, WidgetRegistry, definition, with_defaults


@dataclass(frozen=True, slots=True)
class ComposedProject:
    """Final renderer input and integration-side timing."""

    html: str
    data_ms: float
    liquid_ms: float
    compose_ms: float
    allowed_asset_origins: tuple[str, ...] = ()


class ProjectComposeError(Exception):
    """Raised when widget data or markup cannot be composed safely."""


REMOTE_ASSET_PATTERNS = (
    re.compile(
        r"\b(?:src|srcset)\s*=\s*[\"']([^\"']*https?://[^\"']+)[\"']",
        re.IGNORECASE,
    ),
    re.compile(r"\burl\(\s*[\"']?(https?://[^\"')\s]+)[\"']?\s*\)", re.IGNORECASE),
    re.compile(
        r"<link\b[^>]*\bhref\s*=\s*[\"'](https?://[^\"']+)[\"']",
        re.IGNORECASE,
    ),
    re.compile(
        r"@import\s+(?:url\(\s*)?[\"']?(https?://[^\"')\s;]+)[\"']?\s*\)?",
        re.IGNORECASE,
    ),
    re.compile(
        r"<(?:image|use)\b[^>]*\bhref\s*=\s*[\"'](https?://[^\"']+)[\"']",
        re.IGNORECASE,
    ),
    re.compile(
        r"<object\b[^>]*\bdata\s*=\s*[\"'](https?://[^\"']+)[\"']",
        re.IGNORECASE,
    ),
)
REMOTE_URL_PATTERN = re.compile(r"https?://[^\s,\"']+", re.IGNORECASE)
MAX_BACKGROUND_BYTES = 5 * 1024 * 1024
BACKGROUND_MIME_SIGNATURES = {
    "image/jpeg": (b"\xff\xd8\xff",),
    "image/png": (b"\x89PNG\r\n\x1a\n",),
    "image/webp": (b"RIFF",),
}
BACKGROUND_ANCHOR_STYLES = {
    "top-left": ("flex-start", "flex-start", "left top"),
    "top-center": ("center", "flex-start", "center top"),
    "top-right": ("flex-end", "flex-start", "right top"),
    "center-left": ("flex-start", "center", "left center"),
    "center": ("center", "center", "center center"),
    "center-right": ("flex-end", "center", "right center"),
    "bottom-left": ("flex-start", "flex-end", "left bottom"),
    "bottom-center": ("center", "flex-end", "center bottom"),
    "bottom-right": ("flex-end", "flex-end", "right bottom"),
}


def _assert_asset_permissions(
    fragment: str, widget_type: str, registry: WidgetRegistry
) -> set[str]:
    """Return used, declared origins and reject undeclared remote assets."""
    allowed = set(
        definition(widget_type, registry)["permissions"]["network"]["allowedOrigins"]
    )
    used: set[str] = set()
    for pattern in REMOTE_ASSET_PATTERNS:
        for match in pattern.finditer(fragment):
            for remote in REMOTE_URL_PATTERN.findall(match.group(1)):
                parsed = urlsplit(remote)
                port = parsed.port
                host = parsed.hostname or ""
                host_literal = f"[{host}]" if ":" in host else host
                default_port = (parsed.scheme == "http" and port == 80) or (
                    parsed.scheme == "https" and port == 443
                )
                port_suffix = (
                    f":{port}" if port is not None and not default_port else ""
                )
                origin = f"{parsed.scheme}://{host_literal}{port_suffix}"
                if origin not in allowed:
                    message = (
                        f"{widget_type} widget uses undeclared remote asset "
                        f"origin: {origin}"
                    )
                    raise ProjectComposeError(message)
                used.add(origin)
    return used


def _new_composition_state() -> tuple[float, list[str], set[str]]:
    """Create typed mutable accumulators for one screen composition."""
    return 0.0, [], set()


STUDIO_STYLES = """
<style>
  .studio-screen{position:relative;width:var(--studio-width)!important;height:var(--studio-height)!important;margin:0!important;padding:0!important;overflow:hidden!important;background:var(--framework-semantic-canvas-bg-color,#fff)!important;color:var(--framework-semantic-text-primary-text-color,#000);box-sizing:border-box}
  .studio-screen .view--full{position:relative;z-index:1;width:100%!important;height:100%!important;margin:0!important;padding:0!important;overflow:hidden!important}
  .studio-background-layer{position:absolute;inset:0;z-index:0;display:flex;justify-content:var(--studio-background-x);align-items:var(--studio-background-y);overflow:hidden;pointer-events:none}
  .studio-background{display:block;flex:none;object-position:var(--studio-background-position)}
  .studio-background-layer:not(.studio-background-layer--manual) .studio-background{width:100%;height:100%;object-fit:var(--studio-background-fit)}
  .studio-background-layer--manual .studio-background{width:auto!important;height:auto!important;max-width:none!important;max-height:none!important;transform:scale(var(--studio-background-scale));transform-origin:var(--studio-background-position)}
  .studio-grid{display:grid;width:100%;height:100%;padding:var(--studio-screen-padding);gap:var(--studio-region-gap);box-sizing:border-box}
  .studio-region{position:relative;min-width:0;min-height:0;overflow:hidden;background:var(--framework-semantic-surface-bg-color,transparent);color:inherit;box-sizing:border-box;container-type:size;container-name:od-region}
  .studio-region--transparent{background:transparent!important}
  .studio-region--transparent>.item{background:transparent!important}
  .studio-region--bordered{border:1px solid currentColor}
  .studio-region>.item{width:100%!important;height:100%!important;margin:0!important;padding:0!important}
</style>
"""


def _read_background(path: Path) -> bytes:
    """Read one bounded local media file without blocking the event loop."""
    if not path.is_file():
        raise ProjectComposeError("Selected background media file is unavailable")
    if path.stat().st_size > MAX_BACKGROUND_BYTES:
        raise ProjectComposeError("Selected background image exceeds 5 MB")
    content = path.read_bytes()
    if len(content) > MAX_BACKGROUND_BYTES:
        raise ProjectComposeError("Selected background image exceeds 5 MB")
    return content


def _validate_background_content(content: bytes, mime_type: str) -> None:
    """Reject unsupported or mislabeled display background content."""
    signatures = BACKGROUND_MIME_SIGNATURES.get(mime_type)
    if signatures is None:
        raise ProjectComposeError(
            "Selected background must be a PNG, JPEG, or WebP image"
        )
    if mime_type == "image/webp":
        valid = content.startswith(b"RIFF") and content[8:12] == b"WEBP"
    else:
        valid = any(content.startswith(signature) for signature in signatures)
    if not valid:
        raise ProjectComposeError("Selected background image content is invalid")


async def _async_resolve_background(
    hass: HomeAssistant, project: Project
) -> str | None:
    """Resolve a Home Assistant Media Source image to a local data URI."""
    background = project.get("background")
    if not isinstance(background, dict):
        return None
    media = background["media"]
    try:
        resolved = await async_resolve_media(hass, str(media["media_content_id"]), None)
    except MediaSourceError as err:
        raise ProjectComposeError("Selected background media is unavailable") from err
    if resolved.path is None:
        raise ProjectComposeError(
            "Selected background must be stored in local Home Assistant media"
        )
    mime_type = resolved.mime_type.lower().split(";", maxsplit=1)[0].strip()
    try:
        content = await hass.async_add_executor_job(
            _read_background, Path(resolved.path)
        )
    except OSError as err:
        raise ProjectComposeError(
            "Selected background media file could not be read"
        ) from err
    _validate_background_content(content, mime_type)
    encoded = base64.b64encode(content).decode("ascii")
    return f"data:{mime_type};base64,{encoded}"


def _background_markup(project: Project, data_uri: str | None) -> str:
    """Create the deterministic screen background layer."""
    background = project.get("background")
    if data_uri is None or not isinstance(background, dict):
        return ""
    mode = str(background["mode"])
    anchor = str(background["anchor"])
    horizontal, vertical, position = BACKGROUND_ANCHOR_STYLES[anchor]
    object_fit = {"stretch": "fill", "contain": "contain", "cover": "cover"}.get(
        mode, "contain"
    )
    scale = int(background["scale"]) / 100
    manual_class = " studio-background-layer--manual" if mode == "manual" else ""
    return (
        f'<div class="studio-background-layer{manual_class}" aria-hidden="true" '
        f'style="--studio-background-x:{horizontal};'
        f"--studio-background-y:{vertical};"
        f"--studio-background-position:{position};"
        f"--studio-background-fit:{object_fit};"
        f'--studio-background-scale:{scale:g}">'
        f'<img class="studio-background" src="{data_uri}" alt=""></div>'
    )


def _screen_size(width: int, height: int) -> str:
    """Map arbitrary display dimensions to the nearest TRMNL size tier."""
    longest = max(width, height)
    if longest <= 400:
        return "screen--sm"
    if longest >= 1_000:
        return "screen--lg"
    return "screen--md"


def _screen_preferences(project: Project) -> str:
    """Map persisted display preferences to TRMNL screen classes."""
    classes: list[str] = []
    if project.get("theme", "light") == "dark":
        classes.append("screen--dark-mode")
    font_family = project.get("fontFamily", "default")
    if font_family in {"classic", "trmnl"}:
        classes.append(f"screen--fonts-{font_family}")
    text_scale = project.get("textScale", "regular")
    if text_scale in {"small", "large", "xlarge"}:
        classes.append(f"screen--text-scale-{text_scale}")
    return " ".join(classes)


def _region_size(
    project: Project, region: dict[str, Any], *, gap: int, padding: int | None = None
) -> tuple[float, float]:
    """Calculate the physical CSS-pixel size of one grid region."""
    grid = project["grid"]
    project_width = int(project.get("width", 800))
    project_height = int(project.get("height", 480))
    screen_padding = gap if padding is None else padding
    cell_width = (
        project_width - 2 * screen_padding - gap * (grid["columns"] - 1)
    ) / grid["columns"]
    cell_height = (
        project_height - 2 * screen_padding - gap * (grid["rows"] - 1)
    ) / grid["rows"]
    width = cell_width * region["columnSpan"] + gap * (region["columnSpan"] - 1)
    height = cell_height * region["rowSpan"] + gap * (region["rowSpan"] - 1)
    return width, height


def _region_shape(
    project: Project, region: dict[str, Any], *, gap: int, padding: int | None = None
) -> str:
    """Classify a region using its physical aspect ratio, not grid spans alone."""
    width, height = _region_size(project, region, gap=gap, padding=padding)
    ratio = width / max(1, height)
    if ratio >= 1.55:
        return "wide"
    if ratio <= 0.72:
        return "tall"
    return "square"


def _requirement_sources(
    config: dict[str, Any], requirement: dict[str, Any]
) -> list[str]:
    """Read one or many configured provider source IDs."""
    value = config.get(requirement["configKey"])
    if requirement.get("cardinality") == "many":
        return [str(item) for item in value] if isinstance(value, list) else []
    return [str(value)] if value else []


def _collect_requirements(
    project: Project, registry: WidgetRegistry
) -> dict[tuple[str, str], object]:
    """Compile widget declarations into one deduplicated screen request."""
    requests: dict[tuple[str, str], object] = {}
    for region in project["regions"]:
        widget = region.get("widget")
        if widget is None:
            continue
        config = with_defaults(widget["type"], widget["config"], registry)
        for requirement in definition(widget["type"], registry)["dataRequirements"]:
            sources = _requirement_sources(config, requirement)
            provider_name = requirement["provider"]
            provider = registry.provider(widget["type"], provider_name)
            provider_key = (widget["type"], provider_name)
            request = requests.setdefault(provider_key, provider.new_request())
            provider.add_request(request, sources, config, requirement)
    return requests


def _resolve_widget_data(
    widget_type: str,
    config: dict[str, Any],
    resolved: dict[tuple[str, str], object],
    registry: WidgetRegistry,
) -> dict[str, Any]:
    """Hydrate declared requirements with normalized provider values."""
    data: dict[str, Any] = {}
    for requirement in definition(widget_type, registry)["dataRequirements"]:
        sources = _requirement_sources(config, requirement)
        provider_name = requirement["provider"]
        provider = registry.provider(widget_type, provider_name)
        values = provider.values(
            resolved[(widget_type, provider_name)], sources, config, requirement
        )
        data[requirement["key"]] = (
            values
            if requirement.get("cardinality") == "many"
            else values[0]
            if values
            else None
        )
    return data


def _active_regions(project: Project) -> list[dict[str, Any]]:
    """Return only regions explicitly composed on the logical grid."""
    return [
        region
        for region in project["regions"]
        if region.get("label")
        or region.get("widget")
        or region["rowSpan"] > 1
        or region["columnSpan"] > 1
    ]


def _layout_spacing(
    project: Project, active_regions: list[dict[str, Any]], width: int, height: int
) -> tuple[int, int]:
    """Resolve independent edge padding and inter-region gap values."""
    grid = project["grid"]
    full_canvas = (
        len(active_regions) == 1
        and active_regions[0]["row"] == 1
        and active_regions[0]["column"] == 1
        and active_regions[0]["rowSpan"] == grid["rows"]
        and active_regions[0]["columnSpan"] == grid["columns"]
    )
    default_spacing = (
        0 if full_canvas else max(3, min(10, round(min(width, height) / 60)))
    )
    return (
        int(project.get("screenPadding", default_spacing)),
        int(project.get("regionGap", default_spacing)),
    )


def _region_classes(region: dict[str, Any], shape: str) -> str:
    """Build renderer-owned region surface classes."""
    appearance = region.get("appearance", {})
    classes = [f"studio-region studio-region--{shape}"]
    if not appearance.get("showBackground", False):
        classes.append("studio-region--transparent")
    if appearance.get("showBorder", False):
        classes.append("studio-region--bordered")
    return " ".join(classes)


async def async_compose_project(
    hass: HomeAssistant, project: Project
) -> ComposedProject:
    """Collect requirements once, render fragments, and create one screen."""
    started = perf_counter()
    domain_data = hass.data.get(DOMAIN)
    registry = getattr(domain_data, "widgets", DEFAULT_REGISTRY)
    requests = _collect_requirements(project, registry)
    language = str(project.get("language", "system"))
    if language == "system":
        language = hass.config.language
    try:
        provider_keys = list(requests)
        provider_values = await asyncio.gather(
            *(
                registry.provider(*key).async_resolve(hass, requests[key], language)
                for key in provider_keys
            )
        )
    except HomeAssistantError as err:
        raise ProjectComposeError("Could not resolve widget data") from err
    resolved = dict(zip(provider_keys, provider_values, strict=True))
    background_data_uri = await _async_resolve_background(hass, project)
    data_ms = (perf_counter() - started) * 1_000

    liquid_ms, fragments, allowed_asset_origins = _new_composition_state()
    width = int(project.get("width", 800))
    height = int(project.get("height", 480))
    grid = project["grid"]
    active_regions = _active_regions(project)
    screen_padding, region_gap = _layout_spacing(project, active_regions, width, height)
    for region in active_regions:
        widget = region.get("widget")
        fragment = ""
        if widget is not None:
            widget_type = widget["type"]
            config = with_defaults(widget_type, widget["config"], registry)
            data = _resolve_widget_data(
                widget_type,
                config,
                resolved,
                registry,
            )
            liquid_started = perf_counter()
            try:
                fragment = render_liquid(
                    registry.template(widget_type),
                    config=config,
                    data=data,
                    assets=registry.assets(widget_type),
                    region={
                        "shape": _region_shape(
                            project, region, gap=region_gap, padding=screen_padding
                        )
                    },
                )
            except LiquidError as err:
                message = f"Could not render {widget_type} widget: {err}"
                raise ProjectComposeError(message) from err
            allowed_asset_origins.update(
                _assert_asset_permissions(fragment, widget_type, registry)
            )
            liquid_ms += (perf_counter() - liquid_started) * 1_000
        region_width, region_height = _region_size(
            project, region, gap=region_gap, padding=screen_padding
        )
        ratio = region_width / max(1, region_height)
        style = (
            f"grid-row:{region['row']} / span {region['rowSpan']};"
            f"grid-column:{region['column']} / span {region['columnSpan']};"
            f"--od-region-width:{region_width:.3f};"
            f"--od-region-height:{region_height:.3f};"
            f"--od-region-aspect-ratio:{ratio:.6f};"
        )
        shape = _region_shape(project, region, gap=region_gap, padding=screen_padding)
        region_classes = _region_classes(region, shape)
        fragments.append(
            f'<section class="{region_classes}" '
            f'data-region-width="{region_width:.3f}" '
            f'data-region-height="{region_height:.3f}" '
            f'data-region-aspect-ratio="{ratio:.6f}" '
            f'style="{style}">{fragment}</section>'
        )

    mode = {
        "bwr": "screen--color-3bwr",
        "bwy": "screen--color-3bwr",
        "bwry": "screen--color-4bwry",
        "spectra6": "screen--color-4bwry",
    }.get(project["palette"], "screen--1bit")
    body = "".join(fragments)
    size = _screen_size(width, height)
    portrait = " screen--portrait" if height > width else ""
    preferences = _screen_preferences(project)
    preference_classes = f" {preferences}" if preferences else ""
    html = (
        f'<main class="screen {mode} {size}{portrait}{preference_classes} studio-screen" '
        f'style="--studio-width:{width}px;--studio-height:{height}px;'
        f"--screen-w:{width}px;--screen-h:{height}px;"
        f"--studio-screen-padding:{screen_padding}px;"
        f'--studio-region-gap:{region_gap}px">{STUDIO_STYLES}'
        f"{_background_markup(project, background_data_uri)}"
        f'<div class="view view--full">'
        f'<div class="studio-grid" style="grid-template-columns:'
        f"repeat({grid['columns']},minmax(0,1fr));grid-template-rows:"
        f'repeat({grid["rows"]},minmax(0,1fr))">'
        f"{body}</div></div></main>"
    )
    compose_ms = (perf_counter() - started) * 1_000
    return ComposedProject(
        html,
        data_ms,
        liquid_ms,
        compose_ms,
        tuple(sorted(allowed_asset_origins)),
    )
