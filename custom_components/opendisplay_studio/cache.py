"""Bounded in-memory cache for short-lived rendered PNG endpoints."""

from __future__ import annotations

from dataclasses import dataclass
from secrets import token_urlsafe
from time import monotonic


@dataclass(frozen=True, slots=True)
class CachedRender:
    """One rendered PNG and its expiry time."""

    png: bytes
    expires_at: float


class RenderCache:
    """Small TTL and count bounded cache."""

    def __init__(self, *, ttl_seconds: int, max_items: int) -> None:
        """Initialize cache bounds."""
        self._ttl_seconds = ttl_seconds
        self._max_items = max_items
        self._items: dict[str, CachedRender] = {}

    def put(self, png: bytes) -> str:
        """Store PNG and return an unguessable endpoint token."""
        now = monotonic()
        self._remove_expired(now)
        while len(self._items) >= self._max_items:
            oldest = min(self._items, key=lambda key: self._items[key].expires_at)
            self._items.pop(oldest)
        token = token_urlsafe(32)
        self._items[token] = CachedRender(png, now + self._ttl_seconds)
        return token

    def get(self, token: str) -> bytes | None:
        """Return a non-expired PNG without consuming it."""
        now = monotonic()
        self._remove_expired(now)
        item = self._items.get(token)
        return item.png if item else None

    def _remove_expired(self, now: float) -> None:
        """Remove expired entries."""
        for token in [
            token for token, item in self._items.items() if item.expires_at <= now
        ]:
            self._items.pop(token, None)
