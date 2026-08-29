"""Tests for self-contained widget package discovery and composition."""

from pathlib import Path
from types import SimpleNamespace

import pytest

from custom_components.opendisplay_studio.composer import async_compose_project
from custom_components.opendisplay_studio.const import DOMAIN
from custom_components.opendisplay_studio.projects import validate_project
from custom_components.opendisplay_studio.widgets import (
    BUILTIN_WIDGET_DIRECTORY,
    DEFAULT_REGISTRY,
    WidgetPackageError,
    WidgetRegistry,
)


def test_new_dashboard_widgets_are_self_contained_packages() -> None:
    section = DEFAULT_REGISTRY.definition("section-title")
    hero = DEFAULT_REGISTRY.definition("hero-weather")

    assert section["fields"][0]["selector"] == {"opendisplay_color": {}}
    assert section["dataRequirements"][0]["provider"] == "section_title"
    assert hero["fields"][0]["selector"]["entity"]["filter"]["domain"] == ("weather")
    assert hero["dataRequirements"][0]["provider"] == "hero_weather"
    assert DEFAULT_REGISTRY.provider("section-title", "section_title")
    assert DEFAULT_REGISTRY.provider("hero-weather", "hero_weather")


QUOTE_MANIFEST = """
id: quote
name: Quote
version: "{version}"
description: A package unknown to the integration source code.
icon: mdi:format-quote-close
template: widget.liquid
provider: provider.py
defaults:
  source: community
fields:
  - key: source
    label: Source
    type: text
dataRequirements:
  - key: quote
    provider: quote_api
    configKey: source
    cardinality: one
    optional: false
"""

QUOTE_PROVIDER = """
class QuoteProvider:
    name = "quote_api"

    def new_request(self):
        return set()

    def add_request(self, request, sources, config, requirement):
        request.update(sources)

    async def async_resolve(self, hass, request, language):
        return {source: {"message": f"Hello {source}"} for source in request}

    def values(self, resolved, sources, config, requirement):
        return [resolved[source] for source in sources]


PROVIDER = QuoteProvider()
"""


def _write_quote_package(
    root: Path,
    *,
    version: str = "0.5.0",
    allowed_origins: tuple[str, ...] = (),
    remote_asset: str | None = None,
) -> Path:
    """Create a complete external widget package for discovery tests."""
    package = root / "quote"
    package.mkdir(parents=True, exist_ok=True)
    manifest = QUOTE_MANIFEST.format(version=version)
    if allowed_origins:
        manifest += "permissions:\n  network:\n    allowedOrigins:\n"
        manifest += "".join(f"      - {origin}\n" for origin in allowed_origins)
    (package / "widget.yml").write_text(manifest, encoding="utf-8")
    asset_source = remote_asset or "{{ assets['icons/quote.svg'] }}"
    (package / "widget.liquid").write_text(
        f'<div class="quote"><img src="{asset_source}">'
        "{{ data.quote.message }}</div>",
        encoding="utf-8",
    )
    (package / "provider.py").write_text(QUOTE_PROVIDER, encoding="utf-8")
    assets = package / "assets" / "icons"
    assets.mkdir(parents=True, exist_ok=True)
    (assets / "quote.svg").write_text(
        '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1v1z"/></svg>',
        encoding="utf-8",
    )
    return package


async def test_unknown_package_is_discovered_validated_and_composed(
    hass, tmp_path: Path
) -> None:
    """Adding a package must not require an integration source-code change."""
    _write_quote_package(tmp_path)
    registry = WidgetRegistry.from_directories([BUILTIN_WIDGET_DIRECTORY, tmp_path])
    project = validate_project(
        {
            "name": "Community widget",
            "status": "draft",
            "language": "en",
            "displayId": "custom",
            "width": 400,
            "height": 300,
            "orientation": "landscape",
            "palette": "bw",
            "grid": {"columns": 1, "rows": 1},
            "regions": [
                {
                    "id": "quote",
                    "row": 1,
                    "column": 1,
                    "rowSpan": 1,
                    "columnSpan": 1,
                    "widget": {
                        "type": "quote",
                        "version": "0.5.0",
                        "config": {"source": "community"},
                    },
                }
            ],
        },
        registry,
    )
    hass.data[DOMAIN] = SimpleNamespace(widgets=registry)

    result = await async_compose_project(hass, project)

    assert registry.definition("quote")["name"] == "Quote"
    assert "Hello community" in result.html
    assert 'src="data:image/svg+xml;base64,' in result.html
    assert registry.assets("quote")["icons/quote.svg"].startswith(
        "data:image/svg+xml;base64,"
    )
    assert result.allowed_asset_origins == ()


async def test_declared_remote_widget_asset_is_passed_to_renderer(
    hass, tmp_path: Path
) -> None:
    _write_quote_package(
        tmp_path,
        allowed_origins=("https://cdn.example.com/",),
        remote_asset="https://cdn.example.com/quote.svg",
    )
    registry = WidgetRegistry.from_directories([tmp_path])
    project = validate_project(
        {
            "name": "Remote widget",
            "status": "draft",
            "language": "en",
            "displayId": "custom",
            "width": 400,
            "height": 300,
            "orientation": "landscape",
            "palette": "bw",
            "grid": {"columns": 1, "rows": 1},
            "regions": [
                {
                    "id": "quote",
                    "row": 1,
                    "column": 1,
                    "rowSpan": 1,
                    "columnSpan": 1,
                    "widget": {
                        "type": "quote",
                        "version": "0.5.0",
                        "config": {"source": "community"},
                    },
                }
            ],
        },
        registry,
    )
    hass.data[DOMAIN] = SimpleNamespace(widgets=registry)

    result = await async_compose_project(hass, project)

    assert registry.definition("quote")["permissions"] == {
        "network": {"allowedOrigins": ["https://cdn.example.com"]}
    }
    assert result.allowed_asset_origins == ("https://cdn.example.com",)


@pytest.mark.parametrize(
    "origin",
    [
        "https://example.com/path",
        "https://user:pass@example.com",
        "file:///tmp/assets",
    ],
)
def test_invalid_widget_network_permissions_are_rejected(
    tmp_path: Path, origin: str
) -> None:
    _write_quote_package(tmp_path, allowed_origins=(origin,))

    with pytest.raises(WidgetPackageError, match="network permission"):
        WidgetRegistry.from_directories([tmp_path])


def test_registry_can_reload_updated_packages_without_replacing_consumers(
    tmp_path: Path,
) -> None:
    """A store installer can refresh the same registry used by ProjectStore."""
    _write_quote_package(tmp_path, version="0.5.0")
    registry = WidgetRegistry.from_directories([tmp_path])

    _write_quote_package(tmp_path, version="0.5.1")
    registry.reload_from_directories([tmp_path])

    assert registry.definition("quote")["version"] == "0.5.1"


def test_package_files_cannot_escape_the_widget_directory(tmp_path: Path) -> None:
    """Manifest file references are strictly package-local."""
    package = tmp_path / "unsafe"
    package.mkdir()
    (package / "widget.yml").write_text(
        """
id: unsafe
name: Unsafe
version: "0.5.0"
description: Invalid traversal fixture.
icon: mdi:alert
template: ../outside.liquid
defaults: {}
fields: []
dataRequirements: []
""",
        encoding="utf-8",
    )

    with pytest.raises(WidgetPackageError, match="package"):
        WidgetRegistry.from_directories([tmp_path])


def test_unsupported_widget_assets_are_rejected(tmp_path: Path) -> None:
    package = _write_quote_package(tmp_path)
    (package / "assets" / "payload.py").write_text("unsafe", encoding="utf-8")

    with pytest.raises(WidgetPackageError, match="Unsupported widget asset type"):
        WidgetRegistry.from_directories([tmp_path])


def test_oversized_widget_assets_are_rejected(tmp_path: Path) -> None:
    package = _write_quote_package(tmp_path)
    (package / "assets" / "large.png").write_bytes(b"0" * 512_001)

    with pytest.raises(WidgetPackageError, match="exceeds 512000 bytes"):
        WidgetRegistry.from_directories([tmp_path])


def test_widget_asset_total_is_bounded(tmp_path: Path) -> None:
    package = _write_quote_package(tmp_path)
    (package / "assets" / "first.png").write_bytes(b"0" * 300_000)
    (package / "assets" / "second.png").write_bytes(b"0" * 300_000)

    with pytest.raises(WidgetPackageError, match="assets exceed 512000 bytes"):
        WidgetRegistry.from_directories([tmp_path])
