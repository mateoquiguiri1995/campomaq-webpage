from types import SimpleNamespace

import chat
import health
import search


def test_root_and_live_health_remain_public(client):
    root = client.get("/")
    live = client.get("/health/live")

    assert root.status_code == 200
    assert root.get_json() == {"service": "campomaq-api", "status": "ok"}
    assert live.status_code == 200
    assert live.get_json() == {"status": "alive"}


def test_ready_health_preserves_response_shape(client, monkeypatch):
    checks = {
        "mongo": "ok",
        "postgres": "ok",
        "openai": "configured",
        "redis": "ok",
        "supabase_auth": "configured",
    }
    monkeypatch.setattr(health, "dependency_status", lambda: (True, checks))

    response = client.get("/health")

    assert response.status_code == 200
    assert response.get_json() == {
        "status": "ready",
        "service": "campomaq-api",
        "checks": checks,
    }


def test_products_remains_public_and_uses_cache(client, monkeypatch):
    products = [{"product_id": 1, "product_name": "Motocultor"}]
    monkeypatch.setattr(search, "get_cached_products", lambda: products)

    response = client.get("/products")

    assert response.status_code == 200
    assert response.get_json() == products


def test_search_remains_public_and_uses_cache(client, monkeypatch):
    products = [{"product_id": 1, "product_name": "Tractor"}]
    monkeypatch.setattr(search, "get_cached_search", lambda query, limit: products)

    response = client.get("/search?q=tractor")

    assert response.status_code == 200
    assert response.get_json() == products


def test_chat_remains_public(client, monkeypatch):
    completion = SimpleNamespace(
        choices=[SimpleNamespace(message=SimpleNamespace(content="Hola"))]
    )
    fake_client = SimpleNamespace(
        chat=SimpleNamespace(
            completions=SimpleNamespace(create=lambda **_kwargs: completion)
        )
    )
    monkeypatch.setattr(chat, "get_openai_client", lambda: fake_client)

    response = client.post("/chat", json={"message": "Hola"})

    assert response.status_code == 200
    assert response.get_json() == {"reply": "Hola", "model": chat.OPENAI_CHAT_MODEL}


def test_streaming_chat_remains_public(client, monkeypatch):
    chunk = SimpleNamespace(
        choices=[SimpleNamespace(delta=SimpleNamespace(content="Hola"))]
    )
    fake_client = SimpleNamespace(
        chat=SimpleNamespace(
            completions=SimpleNamespace(create=lambda **_kwargs: [chunk])
        )
    )
    monkeypatch.setattr(chat, "get_openai_client", lambda: fake_client)

    response = client.post("/chat/stream", json={"message": "Hola"})

    assert response.status_code == 200
    assert response.mimetype == "text/event-stream"
    assert b'"delta": "Hola"' in response.data
    assert b"event: done" in response.data
