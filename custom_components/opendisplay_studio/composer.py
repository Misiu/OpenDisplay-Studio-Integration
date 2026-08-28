"""Resolve widget data and compose one final TRMNL HTML document."""

from __future__ import annotations

import asyncio
import re
from dataclasses import dataclass
from time import perf_counter
from typing import Any
from urllib.parse import urlsplit

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
  .studio-screen{width:var(--studio-width)!important;height:var(--studio-height)!important;margin:0!important;padding:0!important;overflow:hidden!important;background:var(--framework-semantic-canvas-bg-color,#fff)!important;color:var(--framework-semantic-text-primary-text-color,#000);box-sizing:border-box}
  .studio-screen .view--full{width:100%!important;height:100%!important;margin:0!important;padding:0!important;overflow:hidden!important}
  .studio-grid{display:grid;width:100%;height:100%;padding:var(--studio-gap);gap:var(--studio-gap);box-sizing:border-box}
  .studio-region{position:relative;min-width:0;min-height:0;overflow:hidden;background:var(--framework-semantic-surface-bg-color,transparent);color:inherit;box-sizing:border-box;container-type:size;container-name:od-region}
  .studio-region>.item{width:100%!important;height:100%!important;margin:0!important;padding:0!important}
  .studio-entity,.studio-entity__content{width:100%;height:100%;box-sizing:border-box}
  .studio-entity__content{display:flex!important;align-items:center;justify-content:center;gap:clamp(4px,4cqh,14px);padding:clamp(7px,7cqh,22px)!important;overflow:hidden}
  .studio-entity__icon{display:block;flex:0 0 auto;width:clamp(20px,22cqh,58px);height:clamp(20px,22cqh,58px);fill:currentColor}
  .studio-entity__name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:clamp(9px,7cqh,20px)!important;font-weight:700!important;line-height:1!important;text-transform:none!important}
  .studio-entity__reading{display:flex;min-width:0;align-items:baseline;justify-content:center;gap:.18em;white-space:nowrap}
  .studio-entity__value{font-size:clamp(25px,34cqh,84px)!important;font-weight:500!important;line-height:.9!important;letter-spacing:-.045em!important}
  .studio-entity__unit{font-size:clamp(9px,10cqh,24px)!important;font-weight:700!important;line-height:1!important}
  .studio-entity__rule{display:none;background:currentColor}
  .studio-entity--square .studio-entity__content{flex-direction:column}
  .studio-entity--square .studio-entity__icon{width:clamp(22px,20cqw,64px);height:clamp(22px,20cqw,64px)}
  .studio-entity--square .studio-entity__name{max-width:100%;font-size:clamp(9px,7cqw,19px)!important}
  .studio-entity--square .studio-entity__value{font-size:clamp(25px,27cqw,78px)!important}
  .studio-entity--wide .studio-entity__content{flex-direction:row}
  .studio-entity--wide .studio-entity__name{flex:1 1 auto}
  .studio-entity--wide .studio-entity__rule{display:block;width:1px;height:60%;flex:0 0 1px}
  .studio-entity--wide .studio-entity__reading{flex:0 1 auto;margin-left:auto}
  .studio-entity--tall .studio-entity__content{flex-direction:column}
  .studio-entity--tall .studio-entity__icon{width:clamp(22px,32cqw,62px);height:clamp(22px,32cqw,62px)}
  .studio-entity--tall .studio-entity__name{max-width:100%;font-size:clamp(8px,12cqw,18px)!important}
  .studio-entity--tall .studio-entity__rule{display:block;width:70%;height:1px;flex:0 0 1px}
  .studio-entity--tall .studio-entity__reading{flex-direction:column;align-items:center;gap:2px}
  .studio-entity--tall .studio-entity__value{font-size:clamp(24px,35cqw,66px)!important}
  .studio-entity--tall .studio-entity__unit{font-size:clamp(9px,15cqw,20px)!important}
</style>
"""


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
    project: Project, region: dict[str, Any], *, gap: int
) -> tuple[float, float]:
    """Calculate the physical CSS-pixel size of one grid region."""
    grid = project["grid"]
    project_width = int(project.get("width", 800))
    project_height = int(project.get("height", 480))
    cell_width = (project_width - gap * (grid["columns"] + 1)) / grid["columns"]
    cell_height = (project_height - gap * (grid["rows"] + 1)) / grid["rows"]
    width = cell_width * region["columnSpan"] + gap * (region["columnSpan"] - 1)
    height = cell_height * region["rowSpan"] + gap * (region["rowSpan"] - 1)
    return width, height


def _region_shape(project: Project, region: dict[str, Any], *, gap: int) -> str:
    """Classify a region using its physical aspect ratio, not grid spans alone."""
    width, height = _region_size(project, region, gap=gap)
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
    data_ms = (perf_counter() - started) * 1_000

    liquid_ms, fragments, allowed_asset_origins = _new_composition_state()
    width = int(project.get("width", 800))
    height = int(project.get("height", 480))
    gap = max(3, min(10, round(min(width, height) / 60)))
    grid = project["grid"]
    full_canvas = (
        len(project["regions"]) == 1
        and project["regions"][0]["row"] == 1
        and project["regions"][0]["column"] == 1
        and project["regions"][0]["rowSpan"] == grid["rows"]
        and project["regions"][0]["columnSpan"] == grid["columns"]
    )
    layout_gap = 0 if full_canvas else gap
    for region in project["regions"]:
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
                    region={"shape": _region_shape(project, region, gap=layout_gap)},
                )
            except LiquidError as err:
                message = f"Could not render {widget_type} widget: {err}"
                raise ProjectComposeError(message) from err
            allowed_asset_origins.update(
                _assert_asset_permissions(fragment, widget_type, registry)
            )
            liquid_ms += (perf_counter() - liquid_started) * 1_000
        region_width, region_height = _region_size(project, region, gap=layout_gap)
        ratio = region_width / max(1, region_height)
        style = (
            f"grid-row:{region['row']} / span {region['rowSpan']};"
            f"grid-column:{region['column']} / span {region['columnSpan']};"
            f"--od-region-width:{region_width:.3f};"
            f"--od-region-height:{region_height:.3f};"
            f"--od-region-aspect-ratio:{ratio:.6f};"
        )
        shape = _region_shape(project, region, gap=layout_gap)
        fragments.append(
            f'<section class="studio-region studio-region--{shape}" '
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
        f'--studio-gap:{layout_gap}px">{STUDIO_STYLES}<div class="view view--full">'
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
