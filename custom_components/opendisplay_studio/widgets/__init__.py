"""Discover installed widget packages and expose their runtime contracts."""

from __future__ import annotations

import importlib
import importlib.util
import re
import sys
from collections.abc import Iterable
from hashlib import sha256
from pathlib import Path
from typing import Any, Final, Protocol, cast

import yaml  # type: ignore[import-untyped]

BUILTIN_WIDGET_DIRECTORY: Final = Path(__file__).parent
WIDGET_ID_PATTERN: Final = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
VERSION_PATTERN: Final = re.compile(
    r"^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$"
)


class WidgetPackageError(ValueError):
    """An installed widget package is malformed or unsafe to load."""


class DataProvider(Protocol):
    """Runtime interface implemented by reusable and package-owned providers."""

    name: str

    def new_request(self) -> object:
        """Create an empty aggregate request."""
        ...

    def add_request(
        self,
        request: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> None:
        """Add one widget requirement to the aggregate request."""
        ...

    async def async_resolve(
        self, hass: Any, request: object, language: str
    ) -> object:
        """Resolve one aggregate request."""
        ...

    def values(
        self,
        resolved: object,
        sources: list[str],
        config: dict[str, Any],
        requirement: dict[str, Any],
    ) -> list[Any]:
        """Map aggregate data back to one widget requirement."""
        ...


def _safe_package_file(directory: Path, value: object, field: str) -> Path:
    """Resolve a package-local file without permitting path traversal."""
    if not isinstance(value, str) or not value or Path(value).name != value:
        message = f"{field} must name a file in the widget package"
        raise WidgetPackageError(message)
    path = directory / value
    if not path.is_file():
        message = f"Missing widget package file: {value}"
        raise WidgetPackageError(message)
    return path


def _load_provider(path: Path) -> DataProvider:
    """Load a trusted package provider through its stable PROVIDER export."""
    if path.is_relative_to(BUILTIN_WIDGET_DIRECTORY):
        relative_module = path.relative_to(BUILTIN_WIDGET_DIRECTORY).with_suffix("")
        module_name = f"{__package__}.{'.'.join(relative_module.parts)}"
        module = importlib.import_module(module_name)
    else:
        digest = sha256(str(path.resolve()).encode()).hexdigest()[:16]
        module_name = f"opendisplay_studio_widget_provider_{digest}"
        spec = importlib.util.spec_from_file_location(module_name, path)
        if spec is None or spec.loader is None:
            message = f"Could not load provider: {path}"
            raise WidgetPackageError(message)
        module = importlib.util.module_from_spec(spec)
        sys.modules[module_name] = module
        try:
            spec.loader.exec_module(module)
        except Exception:
            sys.modules.pop(module_name, None)
            raise
    provider = getattr(module, "PROVIDER", None)
    if provider is None or not isinstance(getattr(provider, "name", None), str):
        message = f"Provider {path} does not export PROVIDER"
        raise WidgetPackageError(message)
    return cast("DataProvider", provider)


def _load_definition(
    directory: Path,
) -> tuple[dict[str, Any], str, DataProvider | None]:
    """Load and validate one widget package directory."""
    manifest_path = directory / "widget.yml"
    raw = yaml.safe_load(manifest_path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        message = f"Widget manifest must be an object: {manifest_path}"
        raise WidgetPackageError(message)
    widget_id = raw.get("id")
    expected_directory = (
        widget_id.replace("-", "_") if isinstance(widget_id, str) else ""
    )
    if (
        not isinstance(widget_id, str)
        or WIDGET_ID_PATTERN.fullmatch(widget_id) is None
        or expected_directory != directory.name
    ):
        message = (
            "Widget id must be lowercase and match its directory name "
            f"(hyphens map to underscores): {directory.name}"
        )
        raise WidgetPackageError(message)
    for key in ("name", "description", "icon"):
        if not isinstance(raw.get(key), str) or not raw[key]:
            message = f"Widget {widget_id} requires {key}"
            raise WidgetPackageError(message)
    version = raw.get("version")
    if not isinstance(version, str) or VERSION_PATTERN.fullmatch(version) is None:
        message = f"Widget {widget_id} requires a semantic version"
        raise WidgetPackageError(message)
    defaults = raw.get("defaults", {})
    fields = raw.get("fields", [])
    requirements = raw.get("dataRequirements", [])
    if (
        not isinstance(defaults, dict)
        or not isinstance(fields, list)
        or not isinstance(requirements, list)
    ):
        message = f"Widget {widget_id} has an invalid contract"
        raise WidgetPackageError(message)
    if not all(isinstance(item, dict) for item in fields + requirements):
        message = f"Widget {widget_id} fields and requirements must be objects"
        raise WidgetPackageError(message)
    template_path = _safe_package_file(
        directory, raw.get("template", "widget.liquid"), "template"
    )
    definition = {
        key: raw[key] for key in ("id", "name", "description", "icon")
    }
    definition["version"] = version
    definition.update(
        {
            "defaults": defaults,
            "fields": fields,
            "dataRequirements": requirements,
        }
    )
    provider = None
    if provider_name := raw.get("provider"):
        provider = _load_provider(
            _safe_package_file(directory, provider_name, "provider")
        )
    return definition, template_path.read_text(encoding="utf-8"), provider


class WidgetRegistry:
    """All installed widget definitions, templates, and data providers."""

    def __init__(self) -> None:
        """Initialize the reusable provider set."""
        self._definitions: dict[str, dict[str, Any]] = {}
        self._templates: dict[str, str] = {}
        self._providers: dict[tuple[str, str], DataProvider] = {}

    def reload_from_directories(self, roots: Iterable[Path]) -> None:
        """Atomically replace discovered packages while keeping this registry."""
        candidate = self.from_directories(roots)
        definitions, templates, providers = candidate._contents()  # noqa: SLF001
        self._definitions = definitions
        self._templates = templates
        self._providers = providers

    def _contents(
        self,
    ) -> tuple[
        dict[str, dict[str, Any]],
        dict[str, str],
        dict[tuple[str, str], DataProvider],
    ]:
        """Return internal mappings for an atomic same-class replacement."""
        return self._definitions, self._templates, self._providers

    @classmethod
    def from_directories(cls, roots: Iterable[Path]) -> WidgetRegistry:
        """Discover packages; later roots override bundled packages by id."""
        registry = cls()
        for root in roots:
            if not root.is_dir():
                continue
            for directory in sorted(root.iterdir()):
                if not directory.is_dir() or not (directory / "widget.yml").is_file():
                    continue
                definition, template, provider = _load_definition(directory)
                widget_id = definition["id"]
                registry._providers = {
                    key: value
                    for key, value in registry._providers.items()
                    if key[0] != widget_id
                }
                registry._definitions[widget_id] = definition
                registry._templates[widget_id] = template
                if provider is not None:
                    registry._providers[(widget_id, provider.name)] = provider
        for widget_definition in registry._definitions.values():
            for requirement in widget_definition["dataRequirements"]:
                provider_name = requirement.get("provider")
                if (widget_definition["id"], provider_name) not in registry._providers:
                    message = (
                        f"Widget {widget_definition['id']} requires unknown "
                        f"provider {provider_name}"
                    )
                    raise WidgetPackageError(message)
        return registry

    @property
    def definitions(self) -> list[dict[str, Any]]:
        """Return definitions sorted by package id."""
        return [self._definitions[key] for key in sorted(self._definitions)]

    @property
    def templates(self) -> dict[str, str]:
        """Return the immutable-by-convention template mapping."""
        return dict(self._templates)

    @property
    def widget_types(self) -> set[str]:
        """Return every installed widget id."""
        return set(self._definitions)

    def definition(self, widget_type: str) -> dict[str, Any]:
        """Return one installed widget definition."""
        try:
            return self._definitions[widget_type]
        except KeyError as err:
            message = f"Unsupported widget type: {widget_type}"
            raise WidgetPackageError(message) from err

    def template(self, widget_type: str) -> str:
        """Return one installed Liquid template."""
        return self._templates[widget_type]

    def provider(self, widget_type: str, name: str) -> DataProvider:
        """Return a provider scoped to its owning widget package."""
        try:
            return self._providers[(widget_type, name)]
        except KeyError as err:
            message = f"Widget {widget_type} has no data provider named {name}"
            raise WidgetPackageError(message) from err


DEFAULT_REGISTRY: Final = WidgetRegistry.from_directories([BUILTIN_WIDGET_DIRECTORY])
WIDGET_DEFINITIONS: Final = DEFAULT_REGISTRY.definitions
TEMPLATES: Final = DEFAULT_REGISTRY.templates


def definition(
    widget_type: str, registry: WidgetRegistry | None = None
) -> dict[str, Any]:
    """Return one installed definition."""
    return (registry or DEFAULT_REGISTRY).definition(widget_type)


def with_defaults(
    widget_type: str,
    config: dict[str, Any],
    registry: WidgetRegistry | None = None,
) -> dict[str, Any]:
    """Apply package defaults without trusting missing frontend fields."""
    return {**definition(widget_type, registry)["defaults"], **config}
