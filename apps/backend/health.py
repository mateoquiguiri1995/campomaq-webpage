import os

from flask import Blueprint, jsonify

from common import format_exception_message
from db import get_mongo_client, postgres_cursor
from utils.cache import redis_ping


health_bp = Blueprint("health", __name__)


def dependency_status():
    supabase_auth_configured = bool(
        os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_PUBLISHABLE_KEY")
    )
    checks = {
        "mongo": "not_checked",
        "postgres": "not_checked",
        "openai": "configured" if os.getenv("OPENAI_API_KEY") else "missing_config",
        "redis": redis_ping(),
        "supabase_auth": (
            "configured" if supabase_auth_configured else "missing_config"
        ),
    }
    ready = supabase_auth_configured

    try:
        get_mongo_client().admin.command("ping")
        checks["mongo"] = "ok"
    except Exception as exc:
        ready = False
        checks["mongo"] = format_exception_message(exc)

    try:
        with postgres_cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        checks["postgres"] = "ok"
    except Exception as exc:
        ready = False
        checks["postgres"] = format_exception_message(exc)

    return ready, checks


@health_bp.get("/")
def root():
    return jsonify({"service": "campomaq-api", "status": "ok"})


@health_bp.get("/health/live")
def health_live():
    return jsonify({"status": "alive"})


@health_bp.get("/health/ready")
@health_bp.get("/health")
def health_ready():
    ready, checks = dependency_status()
    status_code = 200 if ready else 503
    return (
        jsonify(
            {
                "status": "ready" if ready else "degraded",
                "service": "campomaq-api",
                "checks": checks,
            }
        ),
        status_code,
    )
