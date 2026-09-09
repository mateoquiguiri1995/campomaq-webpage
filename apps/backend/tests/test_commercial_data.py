from unittest.mock import MagicMock

import commercial_data


def test_commercial_data_requires_authentication(client):
    response = client.get("/product-commercial-data")
    assert response.status_code == 401


def test_commercial_data_returns_all_items(client, active_seller, monkeypatch):
    products = [{
        "product_id": 1155,
        "product_code": "P001",
        "stock": 3.0,
        "price_cash": 100.0,
        "price_credit": 110.0,
        "price_card": 120.0,
        "iva": True,
        "last_cost": 70.0,
        "average_cost": 65.0,
    }]
    monkeypatch.setattr(commercial_data, "fetch_commercial_data", lambda: products)

    response = client.get("/product-commercial-data", headers=active_seller)

    assert response.status_code == 200
    assert response.get_json() == products


def test_fetch_commercial_data_uses_silver_views(monkeypatch):
    cursor = MagicMock()
    cursor.fetchall.return_value = [
        (1155, "P001", 3, 100, 110, 120, True, 70, 65),
    ]
    context = MagicMock()
    context.__enter__.return_value = cursor
    monkeypatch.setattr(commercial_data, "postgres_cursor", lambda: context)

    result = commercial_data.fetch_commercial_data()

    assert "FROM silver.products" in cursor.execute.call_args.args[0]
    assert "LEFT JOIN silver.stock" in cursor.execute.call_args.args[0]
    assert result == [{
        "product_id": 1155,
        "product_code": "P001",
        "stock": 3.0,
        "price_cash": 100.0,
        "price_credit": 110.0,
        "price_card": 120.0,
        "iva": True,
        "last_cost": 70.0,
        "average_cost": 65.0,
    }]


def test_commercial_data_returns_503_when_database_is_unavailable(
    client, active_seller, monkeypatch
):
    def fail():
        raise RuntimeError("database down")

    monkeypatch.setattr(commercial_data, "fetch_commercial_data", fail)
    response = client.get("/product-commercial-data", headers=active_seller)

    assert response.status_code == 503
