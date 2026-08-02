from flask import Blueprint, current_app, jsonify

from auth import require_authenticated_seller
from common import error_response
from db import postgres_cursor


stock_bp = Blueprint("stock", __name__)


def serialize_stock(row):
    return {
        "product_code": str(row[0]),
        "stock": float(row[1]) if row[1] is not None else None,
    }


def fetch_stock():
    with postgres_cursor() as cursor:
        cursor.execute(
            """
            SELECT product_code, stock
            FROM silver.stock
            WHERE product_code IS NOT NULL
            ORDER BY product_code
            """
        )
        rows = cursor.fetchall()

    return [serialize_stock(row) for row in rows]


def fetch_stock_by_product_code(product_code):
    with postgres_cursor() as cursor:
        cursor.execute(
            """
            SELECT product_code, stock
            FROM silver.stock
            WHERE product_code = %s
            """,
            (product_code,),
        )
        row = cursor.fetchone()

    return serialize_stock(row) if row is not None else None


@stock_bp.get("/stock")
@require_authenticated_seller
def get_stock():
    try:
        stock = fetch_stock()
    except Exception as exc:
        current_app.logger.exception("Stock query failed")
        return error_response("Database unavailable", 503, exc)

    return jsonify(stock)


@stock_bp.get("/stock/<string:product_code>")
@require_authenticated_seller
def get_stock_by_product_code(product_code):
    try:
        stock = fetch_stock_by_product_code(product_code)
    except Exception as exc:
        current_app.logger.exception("Product stock query failed")
        return error_response("Database unavailable", 503, exc)

    if stock is None:
        return error_response("Product stock not found", 404)

    return jsonify(stock)
