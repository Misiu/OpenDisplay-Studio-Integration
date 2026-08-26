"""Built-in widget definitions and Liquid templates."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Final

TEMPLATE_DIRECTORY: Final = Path(__file__).with_name("widget_templates")

WIDGET_DEFINITIONS: Final[list[dict[str, Any]]] = [
    {
        "id": "entity-state",
        "version": 1,
        "name": "Entity State",
        "description": "Current state of a Home Assistant entity.",
        "icon": "mdi:gauge",
        "defaults": {
            "entity": "",
            "title": "",
            "layout": "large",
            "showIcon": True,
            "showName": True,
            "showUnit": True,
        },
        "fields": [
            {"key": "entity", "label": "Entity", "type": "entity", "required": True},
            {"key": "title", "label": "Title", "type": "text"},
            {
                "key": "layout",
                "label": "Layout",
                "type": "select",
                "options": [
                    {"label": "Large value", "value": "large"},
                    {"label": "Compact", "value": "compact"},
                ],
            },
            {"key": "showIcon", "label": "Show icon", "type": "toggle"},
            {"key": "showName", "label": "Show name", "type": "toggle"},
            {"key": "showUnit", "label": "Show unit", "type": "toggle"},
        ],
        "dataRequirements": [
            {
                "key": "entity",
                "provider": "entity_state",
                "configKey": "entity",
                "cardinality": "one",
                "optional": False,
            }
        ],
    },
    {
        "id": "calendar",
        "version": 1,
        "name": "Calendar",
        "description": "Upcoming events from one Home Assistant calendar.",
        "icon": "mdi:calendar",
        "defaults": {
            "calendar": "",
            "title": "Upcoming",
            "days": 7,
            "showLocation": True,
            "showDescription": False,
            "time24h": True,
        },
        "fields": [
            {
                "key": "calendar",
                "label": "Calendar",
                "type": "calendar",
                "required": True,
            },
            {"key": "title", "label": "Title", "type": "text"},
            {"key": "days", "label": "Days", "type": "number", "min": 1, "max": 31},
            {"key": "showLocation", "label": "Show location", "type": "toggle"},
            {"key": "showDescription", "label": "Show description", "type": "toggle"},
            {"key": "time24h", "label": "24-hour time", "type": "toggle"},
        ],
        "dataRequirements": [
            {
                "key": "calendar",
                "provider": "calendar",
                "configKey": "calendar",
                "cardinality": "one",
                "optional": False,
                "rangeConfigKey": "days",
            }
        ],
    },
    {
        "id": "weather",
        "version": 4,
        "name": "Weather",
        "description": "Current conditions and a daily Home Assistant forecast.",
        "icon": "mdi:weather-partly-cloudy",
        "defaults": {
            "weather": "",
            "showHumidity": True,
            "showFeelsLike": True,
            "showForecast": True,
        },
        "fields": [
            {
                "key": "weather",
                "label": "Weather entity",
                "required": True,
                "selector": {
                    "entity": {
                        "filter": {
                            "domain": "weather",
                        }
                    }
                },
            },
            {
                "key": "showHumidity",
                "label": "Show humidity",
                "selector": {"boolean": {}},
            },
            {
                "key": "showFeelsLike",
                "label": "Show feels like",
                "selector": {"boolean": {}},
            },
            {
                "key": "showForecast",
                "label": "Show forecast",
                "selector": {"boolean": {}},
            },
        ],
        "dataRequirements": [
            {
                "key": "weather",
                "provider": "weather_forecast",
                "configKey": "weather",
                "cardinality": "one",
                "optional": False,
                "forecastType": "daily",
            }
        ],
    },
    {
        "id": "text",
        "version": 1,
        "name": "Text",
        "description": "Static heading and body text.",
        "icon": "mdi:text",
        "defaults": {"title": "", "text": "Text", "align": "left"},
        "fields": [
            {"key": "title", "label": "Title", "type": "text"},
            {"key": "text", "label": "Text", "type": "text", "multiline": True},
            {
                "key": "align",
                "label": "Alignment",
                "type": "select",
                "options": [
                    {"label": "Left", "value": "left"},
                    {"label": "Center", "value": "center"},
                    {"label": "Right", "value": "right"},
                ],
            },
        ],
        "dataRequirements": [],
    },
]

ENTITY_TEMPLATE: Final = """
<div class="item studio-entity studio-entity--{{ region.shape }}">
  <div class="content studio-entity__content">
    {% if config.showIcon %}
      <svg class="studio-entity__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="{{ data.entity.iconPath }}"></path></svg>
    {% endif %}
    {% if config.showName %}
      <span class="label studio-entity__name">{{ data.entity.displayName }}</span>
    {% endif %}
    <span class="studio-entity__rule" aria-hidden="true"></span>
    <span class="studio-entity__reading">
      <span class="value value--tnums studio-entity__value" data-fit-value="true">{{ data.entity.state }}</span>
      {% if config.showUnit and data.entity.unit %}<span class="label studio-entity__unit">{{ data.entity.unit }}</span>{% endif %}
    </span>
  </div>
</div>
"""

CALENDAR_TEMPLATE: Final = """
<div class="item"><div class="content layout layout--col gap--small">
  <span class="title">{{ config.title }}</span>
  {% if data.calendar.events.size > 0 %}
  <table class="table table--small" data-table-limit="true"><tbody>
    {% for event in data.calendar.events %}<tr>
      <td><span class="value value--xxsmall value--tnums">{{ event.time }}</span></td>
      <td><span class="label">{{ event.summary }}</span>{% if config.showLocation and event.location %}<span class="description">{{ event.location }}</span>{% endif %}{% if config.showDescription and event.description %}<span class="description">{{ event.description }}</span>{% endif %}</td>
    </tr>{% endfor %}
  </tbody></table>
  {% else %}<span class="label">No upcoming events</span>{% endif %}
</div></div>
"""

TEXT_TEMPLATE: Final = """
<div class="item"><div class="content layout layout--col gap--small" style="text-align: {{ config.align }}; white-space: pre-wrap">
  {% if config.title %}<span class="title">{{ config.title }}</span>{% endif %}
  <span class="description description--large">{{ config.text }}</span>
</div></div>
"""

WEATHER_TEMPLATE: Final = (TEMPLATE_DIRECTORY / "weather.liquid").read_text(
    encoding="utf-8"
)

TEMPLATES: Final = {
    "entity-state": ENTITY_TEMPLATE,
    "calendar": CALENDAR_TEMPLATE,
    "weather": WEATHER_TEMPLATE,
    "text": TEXT_TEMPLATE,
}


def definition(widget_type: str) -> dict[str, Any]:
    """Return one built-in definition."""
    return next(item for item in WIDGET_DEFINITIONS if item["id"] == widget_type)


def with_defaults(widget_type: str, config: dict[str, Any]) -> dict[str, Any]:
    """Apply definition defaults without trusting missing frontend fields."""
    return {**definition(widget_type)["defaults"], **config}
