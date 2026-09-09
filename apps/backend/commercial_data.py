from flask import Blueprint, current_app, jsonify

from auth import require_authenticated_seller
from common import error_response
from db import postgres_cursor


commercial_data_bp = Blueprint("commercial_data", __name__)


def _number(value):
    return float(value) if value is not None else None


def serialize_commercial_data(row):
    return {
        "product_id": int(row[0]),
        "product_code": str(row[1]),
        "stock": _number(row[2]),
        "price_cash": _number(row[3]),
        "price_credit": _number(row[4]),
        "price_card": _number(row[5]),
        "iva": bool(row[6]),
        "last_cost": _number(row[7]),
        "average_cost": _number(row[8]),
    }


def fetch_commercial_data():
    with postgres_cursor() as cursor:
        cursor.execute(
            """
            SELECT
                products.product_id,
                products.product_code,
                stock.stock,
                products.price_cash,
                products.price_credit,
                products.price_card,
                products.iva,
                products.last_cost,
                products.average_cost
            FROM silver.products AS products
            JOIN catalog.product_enrichment AS enrichment
              ON enrichment.product_id = products.product_id
             AND enrichment.show_in_app = TRUE
            LEFT JOIN silver.stock AS stock
              ON stock.product_code = products.product_code
            WHERE products.product_code IS NOT NULL
            ORDER BY products.product_code
            """
        )
        rows = cursor.fetchall()

    return [serialize_commercial_data(row) for row in rows]


@commercial_data_bp.get("/product-commercial-data")
@require_authenticated_seller
def get_commercial_data():
    try:
        products = fetch_commercial_data()
    except Exception as exc:
        current_app.logger.exception("Product commercial data query failed")
        return error_response("Database unavailable", 503, exc)

    return jsonify(products)
