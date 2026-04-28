import datetime
import json
import logging
import os
from typing import Optional

import redis

logger = logging.getLogger(__name__)


class _SafeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()
        return super().default(obj)

TTL_POPULAR  = 86_400   # 24 h  — popular keywords
TTL_HOT      = 43_200   # 12 h  — search_count >= 10
TTL_WARM     =  3_600   #  1 h  — search_count 3–9
TTL_COLD     =    300   #  5 m  — search_count 0–2
TTL_COUNTER  = 604_800  #  7 d  — search_count:{q} expiry
TTL_PRODUCTS =  86_400  # 24 h  — products:catalog

POPULAR_KEYWORDS = frozenset({
    "motocultor", "tractor", "fumigadora", "bomba",
    "cosechadora", "maruyama", "husqvarna", "stihl",
    "alzacamas", "annovi", "reberberi", "motosierra",
    "motor", "bomba de fumigación", "bomba de agua"
})

_redis_client: Optional[redis.Redis] = None


def get_redis_client() -> Optional[redis.Redis]:
    global _redis_client

    if _redis_client is not None:
        return _redis_client

    raw_url = os.getenv("REDIS_URL", "")
    password = os.getenv("REDIS_PASSWORD", "")

    if not raw_url or not password:
        logger.warning("Redis credentials not configured — caching disabled")
        return None

    try:
        host, _, port_str = raw_url.partition(":")
        port = int(port_str) if port_str else 6379

        _redis_client = redis.Redis(
            host=host,
            port=port,
            decode_responses=True,
            username="default",
            password=password,
        )
        _redis_client.ping()
        logger.info("Redis connected to %s:%s", host, port)
    except Exception as exc:
        logger.warning("Redis connection failed — caching disabled: %s", exc)
        _redis_client = None

    return _redis_client


# ── Health ────────────────────────────────────────────────────────────────────

def redis_ping() -> str:
    try:
        client = get_redis_client()
        if client is None:
            return "not_configured"
        client.ping()
        return "ok"
    except Exception as exc:
        return str(exc)


# ── Generic low-level helpers ─────────────────────────────────────────────────

def _cache_get(key: str) -> Optional[list]:
    try:
        client = get_redis_client()
        if client is None:
            return None
        raw = client.get(key)
        return json.loads(raw) if raw is not None else None
    except Exception as exc:
        logger.warning("cache_get(%s) failed: %s", key, exc)
        return None


def _cache_set(key: str, value: list, ttl: int) -> bool:
    try:
        client = get_redis_client()
        if client is None:
            return False
        client.setex(key, ttl, json.dumps(value, ensure_ascii=False, cls=_SafeEncoder))
        return True
    except Exception as exc:
        logger.warning("cache_set(%s) failed: %s", key, exc)
        return False


# ── Search counter ────────────────────────────────────────────────────────────

def _increment_search_count(q: str) -> None:
    try:
        client = get_redis_client()
        if client is None:
            return
        pipe = client.pipeline()
        pipe.incr(f"search_count:{q}")
        pipe.expire(f"search_count:{q}", TTL_COUNTER)
        pipe.execute()
    except Exception as exc:
        logger.warning("increment_search_count(%s) failed: %s", q, exc)


def _get_search_count(q: str) -> int:
    try:
        client = get_redis_client()
        if client is None:
            return 0
        raw = client.get(f"search_count:{q}")
        return int(raw) if raw is not None else 0
    except Exception as exc:
        logger.warning("get_search_count(%s) failed: %s", q, exc)
        return 0


def _resolve_search_ttl(q: str) -> int:
    if q in POPULAR_KEYWORDS:
        return TTL_POPULAR
    count = _get_search_count(q)
    if count >= 10:
        return TTL_HOT
    if count >= 3:
        return TTL_WARM
    return TTL_COLD


# ── /search public API ────────────────────────────────────────────────────────

def get_cached_search(q: str, limit: int) -> Optional[list]:
    return _cache_get(f"search:{q.lower()}:{limit}")


def set_cached_search(q: str, limit: int, results: list) -> None:
    normalized = q.lower()
    _increment_search_count(normalized)
    ttl = _resolve_search_ttl(normalized)
    _cache_set(f"search:{normalized}:{limit}", results, ttl)


# ── /products public API ──────────────────────────────────────────────────────

def get_cached_products() -> Optional[list]:
    return _cache_get("products:catalog")


def set_cached_products(results: list) -> None:
    _cache_set("products:catalog", results, TTL_PRODUCTS)


def bust_products_cache() -> bool:
    try:
        client = get_redis_client()
        if client is None:
            return False
        client.delete("products:catalog")
        return True
    except Exception as exc:
        logger.warning("bust_products_cache() failed: %s", exc)
        return False
