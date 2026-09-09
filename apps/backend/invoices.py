import datetime
import decimal

from flask import Blueprint, current_app, jsonify

from auth import require_authenticated_seller
from common import error_response
from db import postgres_cursor


invoices_bp = Blueprint("invoices", __name__)


def _json_number(value):
    if isinstance(value, decimal.Decimal):
        return float(value)
    return value


def _json_date(value):
    if isinstance(value, (datetime.date, datetime.datetime)):
        return value.isoformat()
    return value


def fetch_invoice(invoice_number):
    with postgres_cursor() as cursor:
        cursor.execute(
            """
            SELECT
                invoice_number,
                invoice_date,
                product_code,
                product_name,
                quantity,
                sale_with_iva,
                credit_note_value
            FROM silver.sales_detail
            WHERE invoice_number = %s
            ORDER BY invoice_item_id
            """,
            (invoice_number,),
        )
        rows = cursor.fetchall()

    if not rows:
        return None

    return {
        "invoiceNumber": _json_number(rows[0][0]),
        "date": _json_date(rows[0][1]),
        "items": [
            {
                "productCode": row[2],
                "productName": row[3],
                "quantity": _json_number(row[4]),
                "saleWithIva": _json_number(row[5]),
                "creditNoteValue": _json_number(row[6]),
            }
            for row in rows
        ],
    }


@invoices_bp.get("/invoices/<int:invoice_number>")
@require_authenticated_seller
def get_invoice(invoice_number):
    try:
        invoice = fetch_invoice(invoice_number)
    except Exception as exc:
        current_app.logger.exception("Invoice detail query failed")
        return error_response("Database unavailable", 503, exc)

    if invoice is None:
        return error_response("Invoice not found", 404)

    return jsonify(invoice)
