"""Localized dates, times and the icons that stand for states."""

from __future__ import annotations

from datetime import date, datetime, timedelta

from custom_components.opendisplay_studio.odl import WidgetContext

from .locale import long_date, weekday_name

_CONDITION_ICONS = {
    "clear-night": "weather-night",
    "cloudy": "weather-cloudy",
    "exceptional": "alert-circle-outline",
    "fog": "weather-fog",
    "hail": "weather-hail",
    "lightning": "weather-lightning",
    "lightning-rainy": "weather-lightning-rainy",
    "partlycloudy": "weather-partly-cloudy",
    "pouring": "weather-pouring",
    "rainy": "weather-rainy",
    "snowy": "weather-snowy",
    "snowy-rainy": "weather-snowy-rainy",
    "sunny": "weather-sunny",
    "windy": "weather-windy",
    "windy-variant": "weather-windy-variant",
}

_DEVICE_CLASS_ICONS = {
    "temperature": "thermometer",
    "humidity": "water-percent",
    "battery": "battery",
    "power": "flash",
    "energy": "lightning-bolt",
    "pressure": "gauge",
    "illuminance": "brightness-5",
    "voltage": "sine-wave",
    "current": "current-ac",
    "co2": "molecule-co2",
    "door": "door",
    "window": "window-closed",
    "motion": "motion-sensor",
}

_DOMAIN_ICONS = {
    "light": "lightbulb",
    "switch": "toggle-switch",
    "lock": "lock",
    "cover": "window-shutter",
    "climate": "thermostat",
    "person": "account",
    "sensor": "eye",
    "binary_sensor": "checkbox-blank-circle-outline",
    "weather": "weather-partly-cloudy",
    "calendar": "calendar",
}


def week_start(today: date, *, next_on_weekend: bool = False) -> date:
    """Return the Monday of `today`'s week; of the next week on a weekend if asked."""
    monday = today - timedelta(days=today.weekday())
    if next_on_weekend and today.weekday() >= 5:
        monday += timedelta(days=7)
    return monday


def format_time(moment: datetime, *, use_24h: bool = True) -> str:
    """Return `moment` as a clock time."""
    if use_24h:
        return moment.strftime("%H:%M")
    hour = moment.hour % 12 or 12
    return f"{hour}:{moment.minute:02d} {'AM' if moment.hour < 12 else 'PM'}"


def format_date(day: date) -> str:
    """Return a day as `day.month`."""
    return f"{day.day}.{day.month:02d}"


def format_long_date(day: date, language: str) -> str:
    """Return a day with its month in words, in the pattern of the language."""
    return long_date(day, language)


def format_relative_day(day: date, today: date, context: WidgetContext) -> str:
    """Return "Today", "Tomorrow" or the weekday and date, as the package words them."""
    delta = (day - today).days
    if delta == 0:
        return context.t("today")
    if delta == 1:
        return context.t("tomorrow")
    return f"{weekday_name(day, context.language)} {format_date(day)}"


def condition_icon(condition: str) -> str:
    """Return the icon for a Home Assistant weather condition."""
    return _CONDITION_ICONS.get(condition, "weather-cloudy")


def entity_icon(entity_id: str, device_class: str | None = None) -> str:
    """Return a default icon from the device class, or else the entity's domain."""
    if device_class in _DEVICE_CLASS_ICONS:
        return _DEVICE_CLASS_ICONS[device_class]
    return _DOMAIN_ICONS.get(entity_id.split(".", 1)[0], "help-circle-outline")
