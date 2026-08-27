"""Tests for self-contained widget package discovery and composition."""

from pathlib import Path
from types import SimpleNamespace

import pytest

from custom_components.opendisplay_studio.composer import async_compose_project
from custom_components.opendisplay_studio.const import DOMAIN
from custom_components.opendisplay_studio.projects import validate_project
from custom_components.opendisplay_studio.widgets import (
    BUILTIN_WIDGET_DIRECTORY,
    WidgetPackageError,
    WidgetRegistry,
)

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


def _write_quote_package(root: Path, *, version: str = "0.5.0") -> Path:
    """Create a complete external widget package for discovery tests."""
    package = root / "quote"
    package.mkdir(parents=True, exist_ok=True)
    (package / "widget.yml").write_text(
        QUOTE_MANIFEST.format(version=version), encoding="utf-8"
    )
    (package / "widget.liquid").write_text(
        '<div class="quote">{{ data.quote.message }}</div>',
        encoding="utf-8",
    )
    (package / "provider.py").write_text(QUOTE_PROVIDER, encoding="utf-8")
    return package


async def test_unknown_package_is_discovered_validated_and_composed(
    hass, tmp_path: Path
) -> None:
    """Adding a package must not require an integration source-code change."""
    _write_quote_package(tmp_path)
    registry = WidgetRegistry.from_directories(
        [BUILTIN_WIDGET_DIRECTORY, tmp_path]
    )
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
