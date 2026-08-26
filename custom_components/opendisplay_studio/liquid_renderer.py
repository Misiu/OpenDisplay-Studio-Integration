"""Bounded Liquid rendering for OpenDisplay Studio documents."""

from __future__ import annotations

import json
import re
from collections.abc import Iterable, Mapping
from dataclasses import dataclass
from time import perf_counter
from typing import Any

from liquid import Environment
from liquid.exceptions import LiquidError
from liquid.undefined import StrictDefaultUndefined

MAX_LIQUID_OUTPUT_BYTES = 1_000_000


class TemplateRenderError(Exception):
    """A Liquid document could not be parsed or rendered safely."""


@dataclass(frozen=True, slots=True)
class LiquidResult:
    """Rendered HTML and measured template processing time."""

    html: str
    milliseconds: float


def _number_with_delimiter(
    value: object, delimiter: str = ",", separator: str = "."
) -> str:
    try:
        raw = str(value)
        whole, dot, fraction = raw.partition(".")
        parsed = int(whole)
    except TypeError, ValueError:
        return str(value)
    grouped = f"{parsed:,}".replace(",", delimiter)
    return f"{grouped}{separator}{fraction}" if dot else grouped


def _json(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def _parse_json(value: object) -> object:
    return json.loads(str(value))


def _map_to_i(values: Iterable[object]) -> list[int]:
    converted: list[int] = []
    for value in values:
        match = re.match(r"\s*([+-]?\d+)", str(value))
        converted.append(int(match.group(1)) if match else 0)
    return converted


def _group_by(values: Iterable[object], key: str) -> dict[Any, list[object]]:
    groups: dict[Any, list[object]] = {}
    for value in values:
        group = value.get(key) if isinstance(value, Mapping) else None
        groups.setdefault(group, []).append(value)
    return groups


def _find_by(
    values: Iterable[object], key: str, expected: object, fallback: object = None
) -> object:
    return next(
        (
            value
            for value in values
            if isinstance(value, Mapping) and value.get(key) == expected
        ),
        fallback,
    )


class _BoundedEnvironment(Environment):
    context_depth_limit = 20
    loop_iteration_limit = 5_000
    local_namespace_limit = 10_000
    output_stream_limit = MAX_LIQUID_OUTPUT_BYTES


class TrmnlLiquidRenderer:
    """Render a compatibility-focused subset of TRMNL Liquid in memory."""

    def __init__(self) -> None:
        """Initialize a strict in-memory environment with resource limits."""
        environment = _BoundedEnvironment(
            undefined=StrictDefaultUndefined,
            strict_filters=True,
            autoescape=True,
        )
        environment.add_filter("number_with_delimiter", _number_with_delimiter)
        environment.add_filter("json", _json)
        environment.add_filter("parse_json", _parse_json)
        environment.add_filter("map_to_i", _map_to_i)
        environment.add_filter("group_by", _group_by)
        environment.add_filter("find_by", _find_by)
        self._environment = environment

    def render(self, source: str, data: Mapping[str, Any]) -> LiquidResult:
        """Parse and render one template without filesystem or network access."""
        started = perf_counter()
        try:
            template = self._environment.from_string(source)
            html = template.render(dict(data))
        except (LiquidError, TypeError, ValueError, json.JSONDecodeError) as err:
            raise TemplateRenderError(str(err)) from err
        if len(html.encode()) > MAX_LIQUID_OUTPUT_BYTES:
            raise TemplateRenderError("Liquid output exceeds the configured limit")
        return LiquidResult(
            html=html,
            milliseconds=(perf_counter() - started) * 1_000,
        )


LIQUID = TrmnlLiquidRenderer()
