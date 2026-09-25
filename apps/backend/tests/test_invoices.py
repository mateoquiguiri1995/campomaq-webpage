from contextlib import contextmanager
from datetime import date
from decimal import Decimal

import invoices


def test_invoice_requires_authentication(client):
    response = client.get("/invoices/123")

    assert response.status_code == 401


def test_invoice_returns_details(client, active_seller, monkeypatch):
    monkeypatch.setattr(
        invoices,
        "fetch_invoice",
        lambda invoice_number: {
            "invoiceNumber": invoice_number,
            "date": "2026-07-15",
            "items": [
                {
                    "productCode": "P001",
                    "productName": "Motocultor",
                    "quantity": 2.0,
                    "saleWithIva": 500.0,
                    "creditNoteValue": None,
                }
            ],
        },
    )

    response = client.get("/invoices/123", headers=active_seller)

    assert response.status_code == 200
    assert response.get_json() == {
        "invoiceNumber": 123,
        "date": "2026-07-15",
        "items": [
            {
                "productCode": "P001",
                "productName": "Motocultor",
                "quantity": 2.0,
                "saleWithIva": 500.0,
                "creditNoteValue": None,
            }
        ],
    }


def test_fetch_invoice_is_parameterized_and_maps_database_types(monkeypatch):
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
                    Decimal("123"),
                    date(2026, 7, 15),
                    "P001",
                    "Motocultor",
                    Decimal("2"),
                    Decimal("500.25"),
                    Decimal("25.50"),
                )
            ]

    cursor = FakeCursor()

    @contextmanager
    def fake_postgres_cursor():
        yield cursor

    monkeypatch.setattr(invoices, "postgres_cursor", fake_postgres_cursor)

    result = invoices.fetch_invoice(123)

    assert "FROM silver.sales_detail" in cursor.statement
    assert cursor.parameters == (123,)
    assert result == {
        "invoiceNumber": 123,
        "date": "2026-07-15",
        "items": [
            {
                "productCode": "P001",
                "productName": "Motocultor",
                "quantity": 2.0,
                "saleWithIva": 500.25,
                "creditNoteValue": 25.5,
            }
        ],
    }


def test_invoice_returns_404_when_not_found(client, active_seller, monkeypatch):
    monkeypatch.setattr(invoices, "fetch_invoice", lambda _invoice_number: None)

    response = client.get("/invoices/999", headers=active_seller)

    assert response.status_code == 404
    assert response.get_json() == {"error": "Invoice not found"}


def test_invoice_returns_503_when_database_is_unavailable(
    client,
    active_seller,
    monkeypatch,
):
    def raise_database_error(_invoice_number):
        raise RuntimeError("database offline")

    monkeypatch.setattr(invoices, "fetch_invoice", raise_database_error)

    response = client.get("/invoices/123", headers=active_seller)

    assert response.status_code == 503
    assert response.get_json() == {
        "error": "Database unavailable",
        "details": "RuntimeError",
    }
