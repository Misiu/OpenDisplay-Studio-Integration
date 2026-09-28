"""Discover semantic widgets and expose their ODL contracts."""

from __future__ import annotations

import importlib
import importlib.util
import re
import sys
from collections.abc import Callable, Iterable
from hashlib import sha256
from pathlib import Path
from typing import Any, Final, Protocol, cast

import yaml  # type: ignore[import-untyped]

from ..odl import WidgetRenderContext

BUILTIN_WIDGET_DIRECTORY: Final = Path(__file__).parent
WIDGET_ID_PATTERN: Final = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
VERSION_PATTERN: Final = re.compile(r"^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$")


class WidgetPackageError(ValueError):
    """An installed widget package is malformed."""


class DataProvider(Protocol):
    """Collect and normalize only the Home Assistant data a widget requests."""

    name: str

    def new_request(self) -> object: ...

    def add_request(
        self,
        request: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> None: ...

    async def async_resolve(
        self, hass: Any, request: object, language: str
    ) -> object: ...

    def values(
        self,
        resolved: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> list[Any]: ...


type WidgetRenderer = Callable[[WidgetRenderContext], list[dict[str, Any]]]


def _safe_file(directory: Path, value: object, field: str) -> Path:
    if not isinstance(value, str) or not value or Path(value).name != value:
        raise WidgetPackageError(f"{field} must name a package-local file")
    path = directory / value
    if not path.is_file():
        raise WidgetPackageError(f"Missing widget package file: {value}")
    return path


def _load_module(path: Path, suffix: str) -> Any:
    if path.is_relative_to(BUILTIN_WIDGET_DIRECTORY):
        relative = path.relative_to(BUILTIN_WIDGET_DIRECTORY).with_suffix("")
        return importlib.import_module(f"{__package__}.{'.'.join(relative.parts)}")
    digest = sha256(str(path.resolve()).encode()).hexdigest()[:16]
    module_name = f"opendisplay_studio_widget_{suffix}_{digest}"
    spec = importlib.util.spec_from_file_location(module_name, path)
    if spec is None or spec.loader is None:
        raise WidgetPackageError(f"Could not load widget module: {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    try:
        spec.loader.exec_module(module)
    except Exception:
        sys.modules.pop(module_name, None)
        raise
    return module


def _load_package(
    directory: Path,
) -> tuple[dict[str, Any], DataProvider | None, WidgetRenderer]:
    raw = yaml.safe_load((directory / "widget.yml").read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raise WidgetPackageError("widget.yml must contain an object")
    widget_id = raw.get("id")
    if (
        not isinstance(widget_id, str)
        or WIDGET_ID_PATTERN.fullmatch(widget_id) is None
        or widget_id.replace("-", "_") != directory.name
    ):
        raise WidgetPackageError(f"Widget id does not match {directory.name}")
    for field in ("name", "description", "icon"):
        if not isinstance(raw.get(field), str) or not raw[field]:
            raise WidgetPackageError(f"Widget {widget_id} requires {field}")
    version = raw.get("version")
    if not isinstance(version, str) or VERSION_PATTERN.fullmatch(version) is None:
        raise WidgetPackageError(f"Widget {widget_id} requires a semantic version")
    defaults = raw.get("defaults", {})
    fields = raw.get("fields", [])
    requirements = raw.get("dataRequirements", [])
    layout = raw.get("layout", {})
    if not all(
        isinstance(value, expected)
        for value, expected in (
            (defaults, dict),
            (fields, list),
            (requirements, list),
            (layout, dict),
        )
    ):
        raise WidgetPackageError(f"Widget {widget_id} has an invalid contract")
    renderer_module = _load_module(
        _safe_file(directory, raw.get("renderer", "renderer.py"), "renderer"),
        "renderer",
    )
    renderer = getattr(renderer_module, "RENDERER", None)
    if not callable(renderer):
        raise WidgetPackageError(
            f"Widget {widget_id} renderer does not export RENDERER"
        )
    provider = None
    if provider_name := raw.get("provider"):
        provider_module = _load_module(
            _safe_file(directory, provider_name, "provider"), "provider"
        )
        provider = getattr(provider_module, "PROVIDER", None)
        if provider is None or not isinstance(getattr(provider, "name", None), str):
            raise WidgetPackageError(f"Widget {widget_id} provider is invalid")
    definition = {
        "id": widget_id,
        "name": raw["name"],
        "description": raw["description"],
        "icon": raw["icon"],
        "version": version,
        "defaults": defaults,
        "fields": fields,
        "dataRequirements": requirements,
        "layout": layout,
    }
    return (
        definition,
        cast("DataProvider | None", provider),
        cast("WidgetRenderer", renderer),
    )


class WidgetRegistry:
    """All installed semantic widget definitions and runtime implementations."""

    def __init__(self) -> None:
        self._definitions: dict[str, dict[str, Any]] = {}
        self._providers: dict[tuple[str, str], DataProvider] = {}
        self._renderers: dict[str, WidgetRenderer] = {}

    @classmethod
    def from_directories(cls, roots: Iterable[Path]) -> WidgetRegistry:
        registry = cls()
        for root in roots:
            if not root.is_dir():
                continue
            for directory in sorted(root.iterdir()):
                manifest = directory / "widget.yml"
                if not directory.is_dir() or not manifest.is_file():
                    continue
                raw = yaml.safe_load(manifest.read_text(encoding="utf-8"))
                if not isinstance(raw, dict) or "renderer" not in raw:
                    continue
                definition, provider, renderer = _load_package(directory)
                widget_id = definition["id"]
                registry._definitions[widget_id] = definition
                registry._renderers[widget_id] = renderer
                registry._providers = {
                    key: value
                    for key, value in registry._providers.items()
                    if key[0] != widget_id
                }
                if provider is not None:
                    registry._providers[(widget_id, provider.name)] = provider
        for definition in registry._definitions.values():
            for requirement in definition["dataRequirements"]:
                key = (definition["id"], requirement.get("provider"))
                if key not in registry._providers:
                    raise WidgetPackageError(
                        f"Widget {definition['id']} requires unknown provider {key[1]}"
                    )
        return registry

    @property
    def definitions(self) -> list[dict[str, Any]]:
        return [self._definitions[key] for key in sorted(self._definitions)]

    @property
    def widget_types(self) -> set[str]:
        return set(self._definitions)

    def definition(self, widget_type: str) -> dict[str, Any]:
        try:
            return self._definitions[widget_type]
        except KeyError as err:
            raise WidgetPackageError(f"Unsupported widget type: {widget_type}") from err

    def provider(self, widget_type: str, name: str) -> DataProvider:
        try:
            return self._providers[(widget_type, name)]
        except KeyError as err:
            raise WidgetPackageError(
                f"Widget {widget_type} has no provider named {name}"
            ) from err

    def renderer(self, widget_type: str) -> WidgetRenderer:
        try:
            return self._renderers[widget_type]
        except KeyError as err:
            raise WidgetPackageError(
                f"Widget {widget_type} has no ODL renderer"
            ) from err


DEFAULT_REGISTRY: Final = WidgetRegistry.from_directories([BUILTIN_WIDGET_DIRECTORY])


def with_defaults(
    widget_type: str, config: dict[str, Any], registry: WidgetRegistry
) -> dict[str, Any]:
    """Apply package defaults before resolving data and compiling ODL."""
    return {**registry.definition(widget_type)["defaults"], **config}
