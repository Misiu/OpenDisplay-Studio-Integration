"""Command line of the widget devkit: serve a live preview or write the pictures."""

from __future__ import annotations

import argparse
import asyncio
from pathlib import Path
from typing import Any

from aiohttp import web

from scripts.widget_devkit.scenario import (
    context_for,
    draw,
    load_preview,
    load_registry,
    load_states,
    png_bytes,
    with_options,
)
from scripts.widget_devkit.server import create_app

DEFAULT_ROOT = Path("custom_components/opendisplay_studio/widgets")
DEFAULT_PORT = 8765


def _parse(arguments: list[str] | None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(prog="widget_devkit", description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)

    serve = commands.add_parser("serve", help="live preview in the browser")
    serve.add_argument("--port", type=int, default=DEFAULT_PORT)

    render = commands.add_parser("render", help="write every state at every size")
    render.add_argument("--out", type=Path, required=True)
    render.add_argument("--widget", help="draw only this widget id")
    render.add_argument("--invert", action="store_true", help="white on black")
    render.add_argument(
        "--no-frame", action="store_true", help="no frame or background"
    )

    for command in (serve, render):
        command.add_argument(
            "--root",
            type=Path,
            default=DEFAULT_ROOT,
            help="folder holding the widget packages",
        )
    return parser.parse_args(arguments)


def _option_overrides(arguments: argparse.Namespace) -> dict[str, Any]:
    overrides: dict[str, Any] = {}
    if arguments.invert:
        overrides["invert"] = True
    if arguments.no_frame:
        overrides["showFrame"] = False
    return overrides


async def _render_all(arguments: argparse.Namespace) -> int:
    registry = load_registry(arguments.root)
    overrides = _option_overrides(arguments)
    written = 0
    for widget_id in sorted(registry.widget_types):
        if arguments.widget and arguments.widget != widget_id:
            continue
        folder = arguments.root / widget_id.replace("-", "_")
        preview = load_preview(folder)
        for state_id, state in load_states(folder).items():
            for size in preview.sizes:
                context = context_for(
                    registry,
                    widget_id,
                    with_options(state, overrides),
                    (size.width, size.height),
                    preview.palette,
                )
                image, _ = await draw(context, registry.renderer(widget_id))
                name = f"{state_id}-{size.name.replace(' ', '-')}.png"
                target = arguments.out / widget_id / name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(png_bytes(image))
                written += 1
    return written


def main(arguments: list[str] | None = None) -> None:
    """Run the command named on the command line."""
    parsed = _parse(arguments)
    if parsed.command == "serve":
        web.run_app(create_app(parsed.root), host="127.0.0.1", port=parsed.port)
        return
    count = asyncio.run(_render_all(parsed))
    print(f"Wrote {count} pictures to {parsed.out}")  # noqa: T201 - a command line tool


if __name__ == "__main__":
    main()
