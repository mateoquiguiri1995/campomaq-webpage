import os
from functools import wraps

import requests
from flask import Blueprint, current_app, g, jsonify, request

from common import error_response
from db import postgres_cursor


auth_bp = Blueprint("auth", __name__)


class AuthenticationError(Exception):
    pass


class AuthenticationUnavailable(Exception):
    pass


def validate_supabase_token(access_token):
    supabase_url = (os.getenv("SUPABASE_URL") or "").rstrip("/")
    publishable_key = os.getenv("SUPABASE_PUBLISHABLE_KEY")
    if not supabase_url or not publishable_key:
        raise AuthenticationUnavailable("Supabase Auth is not configured")

    try:
        response = requests.get(
            f"{supabase_url}/auth/v1/user",
            headers={
                "apikey": publishable_key,
                "Authorization": f"Bearer {access_token}",
            },
            timeout=float(os.getenv("SUPABASE_AUTH_TIMEOUT_SECONDS", "5")),
        )
    except requests.RequestException as exc:
        raise AuthenticationUnavailable("Supabase Auth request failed") from exc

    if response.status_code in (401, 403):
        raise AuthenticationError("Invalid or expired access token")
    if response.status_code == 429 or response.status_code >= 500:
        raise AuthenticationUnavailable("Supabase Auth is unavailable")
    if response.status_code != 200:
        raise AuthenticationError("Invalid access token")

    try:
        user = response.json()
    except ValueError as exc:
        raise AuthenticationUnavailable("Invalid response from Supabase Auth") from exc

    if not isinstance(user, dict) or not user.get("id"):
        raise AuthenticationUnavailable("Supabase Auth response is missing the user ID")
    return user


def get_seller_profile(user_id):
    with postgres_cursor() as cursor:
        cursor.execute(
            """
            SELECT user_id, full_name, role, active
            FROM public.seller_profiles
            WHERE user_id = %s
            """,
            (user_id,),
        )
        row = cursor.fetchone()

    if row is None:
        return None

    return {
        "user_id": str(row[0]),
        "full_name": row[1],
        "role": row[2],
        "active": row[3],
    }


def _extract_bearer_token():
    authorization = request.headers.get("Authorization", "")
    scheme, separator, token = authorization.partition(" ")
    if separator != " " or scheme.lower() != "bearer" or not token.strip():
        return None
    if any(character.isspace() for character in token.strip()):
        return None
    return token.strip()


def require_active_seller(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        access_token = _extract_bearer_token()
        if access_token is None:
            return error_response("A valid Bearer access token is required", 401)

        try:
            auth_user = validate_supabase_token(access_token)
        except AuthenticationError:
            return error_response("Invalid or expired access token", 401)
        except AuthenticationUnavailable as exc:
            current_app.logger.warning("Authentication service unavailable: %s", exc)
            return error_response("Authentication service unavailable", 503)

        try:
            seller = get_seller_profile(auth_user["id"])
        except Exception as exc:
            current_app.logger.exception("Seller profile lookup failed")
            return error_response("Database unavailable", 503, exc)

        if seller is None or not seller["active"]:
            return error_response("Seller access is not active", 403)

        g.auth_user = auth_user
        g.seller = seller
        return view(*args, **kwargs)

    return wrapped


@auth_bp.get("/auth/me")
@require_active_seller
def get_current_seller():
    return jsonify(
        {
            "id": str(g.auth_user["id"]),
            "name": g.seller["full_name"],
            "email": g.auth_user.get("email"),
            "role": g.seller["role"],
        }
    )
