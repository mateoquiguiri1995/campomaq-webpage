from contextlib import contextmanager

import requests

import auth


class FakeResponse:
    def __init__(self, status_code, payload=None):
        self.status_code = status_code
        self._payload = payload

    def json(self):
        if isinstance(self._payload, Exception):
            raise self._payload
        return self._payload


def test_auth_me_requires_bearer_token(client):
    response = client.get("/auth/me")

    assert response.status_code == 401
    assert response.get_json() == {"error": "A valid Bearer access token is required"}


def test_auth_me_rejects_malformed_bearer_token(client):
    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer token with spaces"},
    )

    assert response.status_code == 401


def test_auth_me_rejects_invalid_supabase_token(client, monkeypatch):
    monkeypatch.setenv("SUPABASE_URL", "https://project.supabase.co")
    monkeypatch.setenv("SUPABASE_PUBLISHABLE_KEY", "publishable-key")
    monkeypatch.setattr(
        auth.requests,
        "get",
        lambda *_args, **_kwargs: FakeResponse(401),
    )

    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer expired-token"},
    )

    assert response.status_code == 401
    assert response.get_json() == {"error": "Invalid or expired access token"}


def test_supabase_validation_uses_user_endpoint_and_required_headers(monkeypatch):
    monkeypatch.setenv("SUPABASE_URL", "https://project.supabase.co/")
    monkeypatch.setenv("SUPABASE_PUBLISHABLE_KEY", "publishable-key")
    captured = {}

    def fake_get(url, headers, timeout):
        captured.update({"url": url, "headers": headers, "timeout": timeout})
        return FakeResponse(200, {"id": "user-id", "email": "seller@campomaq.ec"})

    monkeypatch.setattr(auth.requests, "get", fake_get)

    user = auth.validate_supabase_token("access-token")

    assert user["id"] == "user-id"
    assert captured == {
        "url": "https://project.supabase.co/auth/v1/user",
        "headers": {
            "apikey": "publishable-key",
            "Authorization": "Bearer access-token",
        },
        "timeout": 5.0,
    }


def test_auth_me_returns_503_when_supabase_times_out(client, monkeypatch):
    monkeypatch.setenv("SUPABASE_URL", "https://project.supabase.co")
    monkeypatch.setenv("SUPABASE_PUBLISHABLE_KEY", "publishable-key")

    def raise_timeout(*_args, **_kwargs):
        raise requests.Timeout("timed out")

    monkeypatch.setattr(auth.requests, "get", raise_timeout)

    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer test-token"},
    )

    assert response.status_code == 503
    assert response.get_json() == {"error": "Authentication service unavailable"}


def test_auth_me_returns_503_when_supabase_is_unavailable(client, monkeypatch):
    monkeypatch.setenv("SUPABASE_URL", "https://project.supabase.co")
    monkeypatch.setenv("SUPABASE_PUBLISHABLE_KEY", "publishable-key")
    monkeypatch.setattr(
        auth.requests,
        "get",
        lambda *_args, **_kwargs: FakeResponse(500),
    )

    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer test-token"},
    )

    assert response.status_code == 503
    assert response.get_json() == {"error": "Authentication service unavailable"}


def test_auth_me_uses_email_when_seller_profile_is_missing(client, monkeypatch):
    monkeypatch.setattr(
        auth,
        "validate_supabase_token",
        lambda _token: {"id": "user-id", "email": "seller@campomaq.ec"},
    )
    monkeypatch.setattr(auth, "get_seller_profile", lambda _user_id: None)

    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer valid-token"},
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "id": "user-id",
        "name": "seller@campomaq.ec",
        "email": "seller@campomaq.ec",
        "role": "seller",
    }


def test_auth_me_does_not_check_active_profile_flag(client, monkeypatch):
    monkeypatch.setattr(
        auth,
        "validate_supabase_token",
        lambda _token: {"id": "user-id", "email": "seller@campomaq.ec"},
    )
    monkeypatch.setattr(
        auth,
        "get_seller_profile",
        lambda _user_id: {
            "user_id": "user-id",
            "full_name": "Inactive Seller",
            "role": "seller",
            "active": False,
        },
    )

    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer valid-token"},
    )

    assert response.status_code == 200
    assert response.get_json()["name"] == "Inactive Seller"


def test_auth_me_returns_verified_seller(client, active_seller):
    response = client.get("/auth/me", headers=active_seller)

    assert response.status_code == 200
    assert response.get_json() == {
        "id": "11111111-2222-3333-4444-555555555555",
        "name": "Vendedor Campo Maq",
        "email": "seller@campomaq.ec",
        "role": "seller",
    }


def test_seller_profile_is_loaded_by_supabase_user_id(monkeypatch):
    class FakeCursor:
        def __init__(self):
            self.statement = None
            self.parameters = None

        def execute(self, statement, parameters):
            self.statement = statement
            self.parameters = parameters

        def fetchone(self):
            return ("user-id", "Seller Name", "seller", True)

    cursor = FakeCursor()

    @contextmanager
    def fake_postgres_cursor():
        yield cursor

    monkeypatch.setattr(auth, "postgres_cursor", fake_postgres_cursor)

    seller = auth.get_seller_profile("user-id")

    assert seller == {
        "user_id": "user-id",
        "full_name": "Seller Name",
        "role": "seller",
        "active": True,
    }
    assert "public.seller_profiles" in cursor.statement
    assert cursor.parameters == ("user-id",)
