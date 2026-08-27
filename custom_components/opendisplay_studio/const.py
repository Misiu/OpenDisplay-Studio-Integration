"""Constants for OpenDisplay Studio."""

from __future__ import annotations

import logging

DOMAIN = "opendisplay_studio"
NAME = "OpenDisplay Studio"
INTEGRATION_VERSION = "0.5.1"

API_VERSION = 1
MIN_RENDERER_VERSION = "0.5.0"
TRMNL_FRAMEWORK_VERSION = "3.2.0"
DEFAULT_WIDTH = 800
DEFAULT_HEIGHT = 480
DEFAULT_RENDERER_URL = "http://localhost:8099"

CONF_API_VERSION = "api_version"
CONF_AUTH_TOKEN = "auth_token"  # noqa: S105 - config/discovery field name
CONF_INSTANCE_ID = "instance_id"
CONF_INTEGRATION_CREATED_ADDON = "integration_created_addon"
CONF_USE_ADDON = "use_addon"
CONF_ADDON_SLUG = "addon_slug"

APP_REPOSITORY_URL = "https://github.com/Misiu/OpenDisplay-Studio-App"
APP_CONFIG_SLUG = "opendisplay_studio_renderer"
# Current Supervisor source generates custom repository IDs as
# sha1(lowercase(repository URL))[:8], then prefixes each App config slug.
# See supervisor/store/utils.py and supervisor/store/data.py.
APP_REPOSITORY_SLUG = "bd833593"
ADDON_SLUG = f"{APP_REPOSITORY_SLUG}_{APP_CONFIG_SLUG}"
ADDON_NAME = "OpenDisplay Studio Renderer"
DISCOVERY_SERVICE = DOMAIN

RENDER_CACHE_TTL_SECONDS = 300
RENDER_CACHE_MAX_ITEMS = 32
RENDER_HTTP_PATH = "/api/opendisplay_studio/render/{token}.png"

PANEL_URL_PATH = "opendisplay-studio"
PANEL_STATIC_URL = "/opendisplay_studio_frontend"
PANEL_WEB_COMPONENT = "opendisplay-studio-panel"
STORAGE_KEY = f"{DOMAIN}.projects"
STORAGE_VERSION = 1

LOGGER = logging.getLogger(__package__)
