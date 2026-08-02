from contextlib import contextmanager
from decimal import Decimal

import stock


def test_stock_requires_authentication(client):
    response = client.get("/stock")

    assert response.status_code == 401


def test_stock_returns_all_items(client, active_seller, monkeypatch):
    monkeypatch.setattr(
        stock,
        "fetch_stock",
        lambda: [
            {"product_code": "P001", "stock": 12.0},
            {"product_code": "P002", "stock": 0.0},
        ],
    )

    response = client.get("/stock", headers=active_seller)

    assert response.status_code == 200
    assert response.get_json() == [
        {"product_code": "P001", "stock": 12.0},
        {"product_code": "P002", "stock": 0.0},
    ]


def test_fetch_stock_uses_silver_stock_and_returns_json_numbers(monkeypatch):
    class FakeCursor:
        def __init__(self):
            self.statement = None

        def execute(self, statement):
            self.statement = statement

        def fetchall(self):
            return [
                ("P001", Decimal("12")),
                ("P002", Decimal("1.5")),
            ]

    cursor = FakeCursor()

    @contextmanager
    def fake_postgres_cursor():
        yield cursor

    monkeypatch.setattr(stock, "postgres_cursor", fake_postgres_cursor)

    result = stock.fetch_stock()

    assert "FROM silver.stock" in cursor.statement
    assert result == [
        {"product_code": "P001", "stock": 12.0},
        {"product_code": "P002", "stock": 1.5},
    ]


def test_stock_returns_503_when_database_is_unavailable(
    client,
    active_seller,
    monkeypatch,
):
    def raise_database_error():
        raise RuntimeError("database offline")

    monkeypatch.setattr(stock, "fetch_stock", raise_database_error)

    response = client.get("/stock", headers=active_seller)

    assert response.status_code == 503
    assert response.get_json() == {
        "error": "Database unavailable",
        "details": "RuntimeError",
    }


def test_product_stock_requires_authentication(client):
    response = client.get("/stock/P001")

    assert response.status_code == 401


def test_product_stock_returns_one_item(client, active_seller, monkeypatch):
    monkeypatch.setattr(
        stock,
        "fetch_stock_by_product_code",
        lambda product_code: {"product_code": product_code, "stock": 7.0},
    )

    response = client.get("/stock/P001", headers=active_seller)

    assert response.status_code == 200
    assert response.get_json() == {"product_code": "P001", "stock": 7.0}


def test_fetch_product_stock_is_parameterized(monkeypatch):
    class FakeCursor:
        def __init__(self):
            self.statement = None
            self.parameters = None

        def execute(self, statement, parameters):
            self.statement = statement
            self.parameters = parameters

        def fetchone(self):
            return ("P001", Decimal("7.5"))

    cursor = FakeCursor()

    @contextmanager
    def fake_postgres_cursor():
        yield cursor

    monkeypatch.setattr(stock, "postgres_cursor", fake_postgres_cursor)

    result = stock.fetch_stock_by_product_code("P001")

    assert "WHERE product_code = %s" in cursor.statement
    assert cursor.parameters == ("P001",)
    assert result == {"product_code": "P001", "stock": 7.5}


def test_product_stock_returns_404_when_not_found(
    client,
    active_seller,
    monkeypatch,
):
    monkeypatch.setattr(stock, "fetch_stock_by_product_code", lambda _code: None)

    response = client.get("/stock/UNKNOWN", headers=active_seller)

    assert response.status_code == 404
    assert response.get_json() == {"error": "Product stock not found"}


def test_product_stock_returns_503_when_database_is_unavailable(
    client,
    active_seller,
    monkeypatch,
):
    def raise_database_error(_product_code):
        raise RuntimeError("database offline")

    monkeypatch.setattr(stock, "fetch_stock_by_product_code", raise_database_error)

    response = client.get("/stock/P001", headers=active_seller)

    assert response.status_code == 503
    assert response.get_json() == {
        "error": "Database unavailable",
        "details": "RuntimeError",
    }
