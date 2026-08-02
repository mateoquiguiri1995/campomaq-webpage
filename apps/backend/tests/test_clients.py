from contextlib import contextmanager
from datetime import date
from decimal import Decimal

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
                    "totalSalesLast6Months": 1250.75,
                    "salesCountLast6Months": 4,
                    "purchaseMonthsLast6Months": 3,
                    "frequencyClassification": "Occasional",
                    "lastPurchaseDate": "2026-07-15",
                    "daysSinceLastPurchase": 18,
                    "recencyStatus": "Active",
                    "recentInvoices": [],
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
                "totalSalesLast6Months": 1250.75,
                "salesCountLast6Months": 4,
                "purchaseMonthsLast6Months": 3,
                "frequencyClassification": "Occasional",
                "lastPurchaseDate": "2026-07-15",
                "daysSinceLastPurchase": 18,
                "recencyStatus": "Active",
                "recentInvoices": [],
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
    assert "FROM gold.clients" in cursor.calls[0][0]
    assert "FROM gold.clients" in cursor.calls[1][0]


def test_clients_maps_gold_metrics(monkeypatch):
    class FakeCursor:
        def __init__(self):
            self.call_count = 0

        def execute(self, _statement, _parameters):
            self.call_count += 1

        def fetchone(self):
            return (1,)

        def fetchall(self):
            return [
                (
                    "C001",
                    "Agricola Uno",
                    "Quito",
                    "022222222",
                    None,
                    "cliente@example.com",
                    Decimal("1250.75"),
                    4,
                    3,
                    "Occasional",
                    date(2026, 7, 15),
                    18,
                    "Active",
                    [
                        {
                            "invoiceNumber": 123,
                            "paymentType": "EFECTIVO",
                            "itemCount": 2,
                        }
                    ],
                )
            ]

    cursor = FakeCursor()

    @contextmanager
    def fake_postgres_cursor():
        yield cursor

    monkeypatch.setattr(clients, "postgres_cursor", fake_postgres_cursor)

    items, total = clients.fetch_clients_page("", page=1, page_size=20)

    assert total == 1
    assert items == [
        {
            "id": "C001",
            "name": "Agricola Uno",
            "address": "Quito",
            "phonePrimary": "022222222",
            "phoneSecondary": None,
            "email": "cliente@example.com",
            "totalSalesLast6Months": 1250.75,
            "salesCountLast6Months": 4,
            "purchaseMonthsLast6Months": 3,
            "frequencyClassification": "Occasional",
            "lastPurchaseDate": "2026-07-15",
            "daysSinceLastPurchase": 18,
            "recencyStatus": "Active",
            "recentInvoices": [
                {
                    "invoiceNumber": 123,
                    "paymentType": "EFECTIVO",
                    "itemCount": 2,
                }
            ],
        }
    ]
