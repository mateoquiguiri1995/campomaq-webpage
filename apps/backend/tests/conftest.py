import sys
from pathlib import Path

import pytest


BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app import create_app


@pytest.fixture
def app():
    return create_app({"TESTING": True})


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def active_seller(monkeypatch):
    import auth

    monkeypatch.setattr(
        auth,
        "validate_supabase_token",
        lambda _token: {
            "id": "11111111-2222-3333-4444-555555555555",
            "email": "seller@campomaq.ec",
        },
    )
    monkeypatch.setattr(
        auth,
        "get_seller_profile",
        lambda _user_id: {
            "user_id": "11111111-2222-3333-4444-555555555555",
            "full_name": "Vendedor Campo Maq",
            "role": "seller",
            "active": True,
        },
    )
    return {"Authorization": "Bearer valid-test-token"}
