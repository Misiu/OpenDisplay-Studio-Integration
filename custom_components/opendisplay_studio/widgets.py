"""Built-in widget definitions and Liquid templates."""

from __future__ import annotations

from typing import Any, Final

WIDGET_DEFINITIONS: Final[list[dict[str, Any]]] = [
    {
        "id": "entity-state",
        "version": 1,
        "name": "Entity State",
        "description": "Current state of a Home Assistant entity.",
        "icon": "mdi:gauge",
        "defaults": {"entity": "", "title": "", "layout": "large", "showUnit": True},
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
<div class="item"><div class="content flex flex--col flex--center gap--small">
  {% if config.title %}<span class="label">{{ config.title }}</span>{% endif %}
  <span class="value {% if config.layout == 'large' %}value--xxlarge{% else %}value--large{% endif %} value--tnums" data-fit-value="true">{{ data.entity.state }}{% if config.showUnit and data.entity.unit %} {{ data.entity.unit }}{% endif %}</span>
  {% unless config.title %}<span class="label label--small">{{ data.entity.name }}</span>{% endunless %}
</div></div>
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

TEMPLATES: Final = {
    "entity-state": ENTITY_TEMPLATE,
    "calendar": CALENDAR_TEMPLATE,
    "text": TEXT_TEMPLATE,
}


def definition(widget_type: str) -> dict[str, Any]:
    """Return one built-in definition."""
    return next(item for item in WIDGET_DEFINITIONS if item["id"] == widget_type)


def with_defaults(widget_type: str, config: dict[str, Any]) -> dict[str, Any]:
    """Apply definition defaults without trusting missing frontend fields."""
    return {**definition(widget_type)["defaults"], **config}
