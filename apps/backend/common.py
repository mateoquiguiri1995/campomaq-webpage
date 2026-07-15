import os

from flask import jsonify


def is_development():
    return os.getenv("FLASK_ENV") == "development"


def clamp_int(value, default, min_value=None, max_value=None):
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        parsed = default

    if min_value is not None:
        parsed = max(min_value, parsed)
    if max_value is not None:
        parsed = min(max_value, parsed)
    return parsed


def parse_positive_int(value, default, name, max_value=None):
    if value is None or value == "":
        return default

    try:
        parsed = int(value)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{name} must be a positive integer") from exc

    if parsed < 1:
        raise ValueError(f"{name} must be a positive integer")
    if max_value is not None and parsed > max_value:
        raise ValueError(f"{name} must be at most {max_value}")
    return parsed


def format_exception_message(exc):
    if is_development():
        return str(exc)
    return exc.__class__.__name__


def error_response(message, status_code=500, exc=None):
    payload = {"error": message}
    if exc is not None:
        payload["details"] = format_exception_message(exc)
    return jsonify(payload), status_code
