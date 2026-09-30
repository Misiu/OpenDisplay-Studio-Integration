"""Constants for OpenDisplay Studio."""

from __future__ import annotations

import logging

DOMAIN = "opendisplay_studio"
NAME = "OpenDisplay Studio"
INTEGRATION_VERSION = "3.0.6"

DEFAULT_WIDTH = 800
DEFAULT_HEIGHT = 480
RENDER_CACHE_TTL_SECONDS = 300
RENDER_CACHE_MAX_ITEMS = 32
RENDER_HTTP_PATH = "/api/opendisplay_studio/render/{token}.png"
RENDER_CONCURRENCY = 2

PANEL_URL_PATH = "opendisplay-studio"
PANEL_STATIC_URL = "/opendisplay_studio_frontend"
PANEL_WEB_COMPONENT = "ods-app"
STORAGE_KEY = f"{DOMAIN}.dashboards"
STORAGE_VERSION = 1
SCHEMA_VERSION = 1

LOGGER = logging.getLogger(__package__)
