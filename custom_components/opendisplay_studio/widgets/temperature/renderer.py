"""Pure ODL renderer for the Temperature widget."""

from __future__ import annotations

from typing import Any

from ...odl import WidgetRenderContext, clamp, rectangle, text


def _fit_single_line(value: str, width: int, maximum: int) -> int:
    """Estimate a PPB font size that keeps one line inside the available width."""
    weighted_length = sum(0.38 if character.isspace() else 0.62 for character in value)
    return clamp(int(width / max(1.0, weighted_length)), 12, maximum)


def render_temperature(context: WidgetRenderContext) -> list[dict[str, Any]]:
    """Produce a readable temperature tile for any supported pixel frame."""
    box = context.box.inset(3)
    raw_data = context.data.get("entity", {})
    data = raw_data if isinstance(raw_data, dict) else {}
    config = context.config
    title = str(config.get("title") or data.get("name") or "Temperature")
    value = str(data.get("state", "—"))
    unit = str(data.get("unit", "")) if config.get("showUnit", True) else ""
    accent = str(config.get("accent", "black"))
    inset = clamp(min(box.width, box.height) // 14, 8, 18)
    title_size = clamp(min(box.height // 7, box.width // 12), 12, 24)
    title_x = box.x + box.width // 2
    title_y = box.y + inset
    show_name = bool(config.get("showName", True))
    show_icon = bool(config.get("showIcon", True))
    reading = f"{value}{(' ' + unit) if unit else ''}"

    content_top = title_y + title_size + (6 if show_name else 0)
    content_bottom = box.bottom - inset
    center_y = content_top + max(1, content_bottom - content_top) // 2
    icon_size = clamp(min(box.height // 3, box.width // 6), 20, 52)
    icon_slot = icon_size + clamp(box.width // 30, 6, 14) if show_icon else 0
    content_width = max(24, box.width - inset * 2)
    reading_width = max(24, content_width - icon_slot)
    value_size = min(
        _fit_single_line(reading, reading_width, 78),
        clamp(max(1, content_bottom - content_top), 12, 78),
    )
    group_left = box.x + inset
    icon_x = group_left + icon_size // 2
    value_left = group_left + icon_slot
    value_x = value_left + reading_width // 2
    elements: list[dict[str, Any]] = [
        rectangle(box, fill="white", outline="black", width=1, radius=2),
    ]
    if show_icon:
        elements.append(
            {
                "type": "icon",
                "value": "thermometer",
                "x": icon_x,
                "y": center_y,
                "size": icon_size,
                "color": accent,
                "anchor": "mm",
            }
        )
    if show_name:
        elements.append(
            text(
                title,
                x=title_x,
                y=title_y,
                size=title_size,
                color=accent,
                anchor="mt",
                max_width=max(24, box.width - inset * 2),
                truncate=True,
            )
        )
    elements.append(
        text(
            reading,
            x=value_x,
            y=center_y,
            size=value_size,
            color="black",
            anchor="mm",
        )
    )
    return elements


RENDERER = render_temperature
