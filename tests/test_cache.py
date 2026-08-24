"""Tests for the temporary render cache."""

from custom_components.opendisplay_studio.cache import RenderCache


def test_cache_returns_png_by_unguessable_token() -> None:
    cache = RenderCache(ttl_seconds=300, max_items=2)
    token = cache.put(b"png-one")

    assert len(token) >= 32
    assert cache.get(token) == b"png-one"
    assert cache.get("not-a-token") is None


def test_cache_is_count_bounded() -> None:
    cache = RenderCache(ttl_seconds=300, max_items=2)
    first = cache.put(b"one")
    second = cache.put(b"two")
    third = cache.put(b"three")

    assert cache.get(first) is None
    assert cache.get(second) == b"two"
    assert cache.get(third) == b"three"
