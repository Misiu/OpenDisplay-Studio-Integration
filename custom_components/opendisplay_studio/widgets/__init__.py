"""Discover widget packages and expose their manifests, renderers and providers."""

from __future__ import annotations

import importlib
import json
import sys
import types
from collections.abc import Callable
from copy import deepcopy
from dataclasses import dataclass
from hashlib import sha256
from pathlib import Path
from typing import Any, Final, cast

import yaml  # type: ignore[import-untyped]

from custom_components.opendisplay_studio.data_providers import (
    DataProvider,
    built_in_providers,
)
from custom_components.opendisplay_studio.odl import WidgetContext

from .manifest import ManifestError, parse_manifest
from .options import option_defaults

BUILTIN_WIDGET_DIRECTORY: Final = Path(__file__).parent
DEFAULT_LANGUAGE: Final = "en"
SDK_ALIAS: Final = "opendisplay_studio"

type WidgetRenderer = Callable[[WidgetContext], list[dict[str, Any]]]


class WidgetPackageError(ValueError):
    """An installed widget package is malformed or missing."""


@dataclass(frozen=True, slots=True)
class WidgetPackage:
    """One loaded widget: its manifest, code and translations."""

    manifest: dict[str, Any]
    renderer: WidgetRenderer
    providers: dict[str, DataProvider]
    translations: dict[str, dict[str, str]]
    builtin: bool
    folder: str


@dataclass(frozen=True, slots=True)
class LoadError:
    """A package that could not be loaded, and why."""

    folder: str
    message: str

    def as_dict(self) -> dict[str, str]:
        """Return the transport representation."""
        return {"folder": self.folder, "message": self.message}


def _expose_sdk() -> None:
    """Let user packages write `from opendisplay_studio.sdk import ...`."""
    package = importlib.import_module(__package__.rsplit(".", 1)[0])
    sys.modules.setdefault(SDK_ALIAS, package)
    for name in ("sdk", "odl", "data_providers"):
        module = importlib.import_module(f"{package.__name__}.{name}")
        sys.modules.setdefault(f"{SDK_ALIAS}.{name}", module)


def _package_digest(directory: Path) -> str:
    """Hash every source file, so changed code is imported under a new name."""
    digest = sha256()
    for path in sorted(directory.glob("*.py")):
        digest.update(path.name.encode())
        digest.update(path.read_bytes())
    return digest.hexdigest()[:16]


def _load_module(directory: Path, file_name: str, *, builtin: bool) -> Any:
    path = directory / file_name
    if not path.is_file():
        message = f"Missing widget package file: {file_name}"
        raise WidgetPackageError(message)
    if builtin:
        return importlib.import_module(f"{__package__}.{directory.name}.{path.stem}")
    digest = _package_digest(directory)
    name = f"opendisplay_studio_widget_{directory.name}_{path.stem}_{digest}"
    # Executed from source, not through the import system: its bytecode cache is
    # keyed on modification time and would keep serving code the user just changed.
    module = types.ModuleType(name)
    module.__file__ = str(path)
    sys.modules[name] = module
    try:
        code = compile(path.read_text(encoding="utf-8"), str(path), "exec")
        exec(code, module.__dict__)  # noqa: S102 - packages are code an administrator installed
    except Exception:
        sys.modules.pop(name, None)
        raise
    return module


def _load_translations(directory: Path) -> dict[str, dict[str, str]]:
    folder = directory / "translations"
    translations: dict[str, dict[str, str]] = {}
    for path in sorted(folder.glob("*.json")) if folder.is_dir() else []:
        translations[path.stem] = json.loads(path.read_text(encoding="utf-8"))
    if DEFAULT_LANGUAGE not in translations:
        message = f"Missing translations/{DEFAULT_LANGUAGE}.json"
        raise WidgetPackageError(message)
    return translations


def _load_provider(
    directory: Path, manifest: dict[str, Any], *, builtin: bool
) -> dict[str, DataProvider]:
    file_name = manifest.get("provider")
    if file_name is None:
        return {}
    provider = getattr(
        _load_module(directory, file_name, builtin=builtin), "PROVIDER", None
    )
    if not isinstance(provider, DataProvider):
        message = f"{file_name} must export PROVIDER, a DataProvider"
        raise WidgetPackageError(message)
    return {f"{manifest['id']}:{provider.name}": provider}


def _load_package(directory: Path, *, builtin: bool) -> WidgetPackage:
    raw = yaml.safe_load((directory / "widget.yml").read_text(encoding="utf-8"))
    manifest = parse_manifest(raw, directory.name)
    if manifest["id"].replace("-", "_") != directory.name:
        message = f"{directory.name}/widget.yml: id: must match the folder name"
        raise ManifestError(message)
    _expose_sdk()
    renderer = getattr(
        _load_module(directory, manifest["renderer"], builtin=builtin),
        "RENDERER",
        None,
    )
    if not callable(renderer):
        message = f"{manifest['renderer']} must export RENDERER"
        raise WidgetPackageError(message)
    return WidgetPackage(
        manifest=manifest,
        renderer=cast("WidgetRenderer", renderer),
        providers=_load_provider(directory, manifest, builtin=builtin),
        translations=_load_translations(directory),
        builtin=builtin,
        folder=directory.name,
    )


def _translate(
    translations: dict[str, dict[str, str]], language: str, key: str, fallback: str
) -> str:
    for code in (language, language.split("-", maxsplit=1)[0], DEFAULT_LANGUAGE):
        value = translations.get(code, {}).get(key)
        if value is not None:
            return value
    return fallback


def _label_choices(option: dict[str, Any], label: Callable[[str, str], str]) -> None:
    """Give the choices of a select their translated labels, keeping their values."""
    config = option["selector"].get("select")
    if not isinstance(config, dict):
        return
    config["options"] = [
        {
            "value": str(choice["value"] if isinstance(choice, dict) else choice),
            "label": label(f"options.{option['key']}.{choice}", str(choice)),
        }
        for choice in config.get("options", [])
    ]


class WidgetRegistry:
    """All installed widgets, loaded independently so one bad package harms no other."""

    def __init__(self) -> None:
        self._packages: dict[str, WidgetPackage] = {}
        self.errors: list[LoadError] = []
        self.providers: dict[str, DataProvider] = built_in_providers()

    @classmethod
    def from_directories(
        cls, builtin_root: Path, user_root: Path | None = None
    ) -> WidgetRegistry:
        """Load the built-in packages, then those an administrator installed."""
        registry = cls()
        registry._load_root(builtin_root, builtin=True)
        if user_root is not None:
            registry._load_root(user_root, builtin=False)
        return registry

    def _load_root(self, root: Path, *, builtin: bool) -> None:
        if not root.is_dir():
            return
        for directory in sorted(root.iterdir()):
            if directory.is_dir() and (directory / "widget.yml").is_file():
                self._add(directory, builtin=builtin)

    def _add(self, directory: Path, *, builtin: bool) -> None:
        try:
            package = _load_package(directory, builtin=builtin)
            self._check_providers(package)
        except Exception as err:  # noqa: BLE001 - one broken package must not stop the rest
            self._report(directory.name, err)
            return
        widget_id = package.manifest["id"]
        if widget_id in self._packages:
            duplicate = WidgetPackageError(
                f"id {widget_id} is already installed; "
                "copy a package under a new id to customise it"
            )
            self._report(directory.name, duplicate)
            return
        self._packages[widget_id] = package
        self.providers.update(package.providers)

    def _report(self, folder: str, error: Exception) -> None:
        self.errors.append(LoadError(folder, str(error) or type(error).__name__))

    def _check_providers(self, package: WidgetPackage) -> None:
        """Reject a package that reads data through a provider nobody offers."""
        offered = self.providers.keys() | package.providers.keys()
        wanted = {
            source["data"] for source in package.manifest["sources"] if "data" in source
        }
        missing = sorted(wanted - offered)
        if missing:
            message = (
                f"{package.folder}/widget.yml: sources: "
                f"unknown data provider {missing[0]}"
            )
            raise ManifestError(message)

    @property
    def widget_types(self) -> set[str]:
        """Return the ids of every installed widget."""
        return set(self._packages)

    def package(self, widget_type: str) -> WidgetPackage:
        """Return an installed package; raises `WidgetPackageError` if missing."""
        try:
            return self._packages[widget_type]
        except KeyError as err:
            message = f"Unsupported widget type: {widget_type}"
            raise WidgetPackageError(message) from err

    def definition(self, widget_type: str) -> dict[str, Any]:
        """Return the manifest of an installed widget."""
        return self.package(widget_type).manifest

    def renderer(self, widget_type: str) -> WidgetRenderer:
        """Return the ODL renderer of an installed widget."""
        return self.package(widget_type).renderer

    def strings(self, widget_type: str, language: str) -> dict[str, str]:
        """Return a widget's runtime strings for a language; English fills gaps."""
        translations = self.package(widget_type).translations
        merged = dict(translations[DEFAULT_LANGUAGE])
        merged.update(translations.get(language.split("-", maxsplit=1)[0], {}))
        merged.update(translations.get(language, {}))
        prefix = "runtime."
        return {
            key.removeprefix(prefix): value
            for key, value in merged.items()
            if key.startswith(prefix)
        }

    def definitions(self, language: str = DEFAULT_LANGUAGE) -> list[dict[str, Any]]:
        """Return every widget as the panel needs it, with labels in `language`."""
        return [
            self._localized(package, language)
            for _, package in sorted(self._packages.items())
        ]

    def _localized(self, package: WidgetPackage, language: str) -> dict[str, Any]:
        manifest = deepcopy(package.manifest)

        def label(key: str, fallback: str) -> str:
            return _translate(package.translations, language, key, fallback)

        for source in manifest["sources"]:
            prefix = f"sources.{source['key']}"
            source["label"] = label(prefix, source["label"])
            for extra in source["perSource"]:
                extra["label"] = label(f"{prefix}.{extra['key']}", extra["label"])
        for section in manifest["options"]:
            section["section"] = label(
                f"sections.{section['section']}", section["section"]
            )
            for option in section["fields"]:
                option["label"] = label(f"options.{option['key']}", option["label"])
                _label_choices(option, label)
                option["default"] = option_defaults(
                    {**manifest, "options": [{"fields": [option]}]}
                )[option["key"]]
        return {
            "id": manifest["id"],
            "version": manifest["version"],
            "name": label("name", manifest["name"]),
            "description": label("description", manifest["description"]),
            "icon": manifest["icon"],
            "category": label(
                f"categories.{manifest['category']}", manifest["category"]
            ),
            "author": manifest["author"],
            "builtin": package.builtin,
            "layout": manifest["layout"],
            "sources": manifest["sources"],
            "options": manifest["options"],
        }


DEFAULT_REGISTRY: Final = WidgetRegistry.from_directories(BUILTIN_WIDGET_DIRECTORY)
