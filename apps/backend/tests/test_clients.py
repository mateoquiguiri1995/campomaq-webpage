from contextlib import contextmanager

import clients


def test_clients_requires_authentication(client):
    response = client.get("/clients")

    assert response.status_code == 401


def test_clients_returns_paginated_items(client, active_seller, monkeypatch):
    import auth

    monkeypatch.setattr(
        auth,
        "get_seller_profile",
        lambda _user_id: (_ for _ in ()).throw(
            AssertionError("clients endpoint should not query seller profiles")
        ),
    )
    monkeypatch.setattr(
        clients,
        "fetch_clients_page",
        lambda query, page, page_size: (
            [
                {
                    "id": "C001",
                    "name": "Agricola Uno",
                    "address": None,
                    "phonePrimary": "0999999999",
                    "phoneSecondary": None,
                    "email": "cliente@example.com",
                }
            ],
            1,
        ),
    )

    response = client.get(
        "/clients?q=agricola&page=2&page_size=10",
        headers=active_seller,
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "items": [
            {
                "id": "C001",
                "name": "Agricola Uno",
                "address": None,
                "phonePrimary": "0999999999",
                "phoneSecondary": None,
                "email": "cliente@example.com",
            }
        ],
        "page": 2,
        "pageSize": 10,
        "total": 1,
    }


def test_clients_rejects_invalid_pagination(client, active_seller):
    assert client.get("/clients?page=0", headers=active_seller).status_code == 400
    assert client.get("/clients?page=nope", headers=active_seller).status_code == 400
    assert client.get("/clients?page_size=101", headers=active_seller).status_code == 400


def test_clients_rejects_oversized_search(client, active_seller):
    response = client.get(f"/clients?q={'a' * 101}", headers=active_seller)

    assert response.status_code == 400
    assert response.get_json() == {"error": "q must be at most 100 characters"}


def test_client_query_is_parameterized(monkeypatch):
    malicious_query = "x%' OR 1=1 --"

    class FakeCursor:
        def __init__(self):
            self.calls = []

        def execute(self, statement, parameters):
            self.calls.append((statement, parameters))

        def fetchone(self):
            return (0,)

        def fetchall(self):
            return []

    cursor = FakeCursor()

    @contextmanager
    def fake_postgres_cursor():
        yield cursor

    monkeypatch.setattr(clients, "postgres_cursor", fake_postgres_cursor)

    items, total = clients.fetch_clients_page(malicious_query, page=1, page_size=20)

    assert items == []
    assert total == 0
    assert malicious_query not in cursor.calls[0][0]
    assert f"%{malicious_query}%" in cursor.calls[0][1]
    assert cursor.calls[1][1][-2:] == [20, 0]
