from contextlib import contextmanager
from decimal import Decimal

import sellers


def test_sellers_requires_authentication(client):
    response = client.get("/sellers")

    assert response.status_code == 401


def test_sellers_returns_dashboard_metrics(client, active_seller, monkeypatch):
    seller_rows = [
        {
            "sellerId": "1717171717",
            "sellerType": "seller",
            "sellerName": "Ana Vendedora",
            "sellerDocumentId": "1717171717",
            "employeeCode": 12.0,
            "invoiceSellerCode": 34.0,
            "monthlyGoal": 80000.0,
            "currentMonthSales": 21500.5,
            "yearTotalSales": 182000.75,
            "yearSalesCount": 40,
            "yearAverageTicket": 4550.01875,
            "salesByCategory": [],
            "salesByBrand": [],
            "topClients": [],
            "topProducts": [],
        }
    ]
    captured = {}

    def fake_fetch_sellers(user_id):
        captured["user_id"] = user_id
        return seller_rows

    monkeypatch.setattr(sellers, "fetch_sellers", fake_fetch_sellers)

    response = client.get("/sellers", headers=active_seller)

    assert response.status_code == 200
    assert response.get_json() == seller_rows
    assert captured["user_id"] == "11111111-2222-3333-4444-555555555555"


def test_sellers_maps_gold_rows_and_nested_decimals(monkeypatch):
    class FakeCursor:
        def __init__(self):
            self.statement = None
            self.parameters = None

        def execute(self, statement, parameters):
            self.statement = statement
            self.parameters = parameters

        def fetchall(self):
            return [
                (
                    "1717171717",
                    "seller",
                    "Ana Vendedora",
                    "1717171717",
                    Decimal("12"),
                    Decimal("34"),
                    Decimal("80000.00"),
                    Decimal("21500.50"),
                    Decimal("182000.75"),
                    40,
                    Decimal("4550.01875"),
                    [{"categoryName": "Maquinaria", "totalValue": Decimal("90000")}],
                    [{"brandName": "STIHL", "totalValue": Decimal("80000")}],
                    [{"clientCode": "C001", "totalValue": Decimal("50000")}],
                    [
                        {
                            "productCode": "P001",
                            "quantity": Decimal("12"),
                            "totalValue": Decimal("30000"),
                        }
                    ],
                )
            ]

    cursor = FakeCursor()

    @contextmanager
    def fake_postgres_cursor():
        yield cursor

    monkeypatch.setattr(sellers, "postgres_cursor", fake_postgres_cursor)

    result = sellers.fetch_sellers("auth-user-id")

    assert "FROM gold.sellers AS sellers" in cursor.statement
    assert "public.seller_profiles AS profiles" in cursor.statement
    assert "profiles.seller_id = sellers.seller_id" in cursor.statement
    assert "profiles.user_id = %s" in cursor.statement
    assert "profiles.active = TRUE" in cursor.statement
    assert cursor.parameters == ("auth-user-id",)
    assert result == [
        {
            "sellerId": "1717171717",
            "sellerType": "seller",
            "sellerName": "Ana Vendedora",
            "sellerDocumentId": "1717171717",
            "employeeCode": 12.0,
            "invoiceSellerCode": 34.0,
            "monthlyGoal": 80000.0,
            "currentMonthSales": 21500.5,
            "yearTotalSales": 182000.75,
            "yearSalesCount": 40,
            "yearAverageTicket": 4550.01875,
            "salesByCategory": [
                {"categoryName": "Maquinaria", "totalValue": 90000.0}
            ],
            "salesByBrand": [{"brandName": "STIHL", "totalValue": 80000.0}],
            "topClients": [{"clientCode": "C001", "totalValue": 50000.0}],
            "topProducts": [
                {"productCode": "P001", "quantity": 12.0, "totalValue": 30000.0}
            ],
        }
    ]


def test_sellers_returns_no_rows_without_an_active_profile_mapping(monkeypatch):
    class FakeCursor:
        def execute(self, _statement, _parameters):
            pass

        def fetchall(self):
            return []

    @contextmanager
    def fake_postgres_cursor():
        yield FakeCursor()

    monkeypatch.setattr(sellers, "postgres_cursor", fake_postgres_cursor)

    assert sellers.fetch_sellers("unmapped-user-id") == []


def test_sellers_returns_503_when_database_fails(
    client,
    active_seller,
    monkeypatch,
):
    def raise_database_error(_user_id):
        raise RuntimeError("database unavailable")

    monkeypatch.setattr(sellers, "fetch_sellers", raise_database_error)

    response = client.get("/sellers", headers=active_seller)

    assert response.status_code == 503
    assert response.get_json() == {
        "error": "Database unavailable",
        "details": "RuntimeError",
    }
