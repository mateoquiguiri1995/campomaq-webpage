import datetime
import decimal

from flask import Blueprint, current_app, g, jsonify

from auth import require_authenticated_seller
from common import error_response
from db import postgres_cursor


sellers_bp = Blueprint("sellers", __name__)


def _json_value(value):
    if isinstance(value, decimal.Decimal):
        return float(value)
    if isinstance(value, (datetime.date, datetime.datetime)):
        return value.isoformat()
    if isinstance(value, dict):
        return {key: _json_value(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_json_value(item) for item in value]
    return value


def fetch_sellers(user_id):
    with postgres_cursor() as cursor:
        cursor.execute(
            """
            SELECT
                sellers.seller_id,
                sellers.seller_type,
                sellers.feempl_nome,
                sellers.feempl_cedu,
                sellers.emple_cod,
                sellers.emple_vcod,
                sellers.monthly_goal,
                sellers.current_month_sales,
                sellers.year_total_sales,
                sellers.year_sales_count,
                sellers.year_average_ticket,
                sellers.sales_by_category,
                sellers.sales_by_brand,
                sellers.top_clients,
                sellers.top_products
            FROM gold.sellers AS sellers
            INNER JOIN public.seller_profiles AS profiles
                ON profiles.seller_id = sellers.seller_id
            WHERE profiles.user_id = %s
              AND profiles.active = TRUE
            ORDER BY sellers.seller_type, sellers.feempl_nome
            """,
            (str(user_id),),
        )
        rows = cursor.fetchall()

    return [
        {
            "sellerId": row[0],
            "sellerType": row[1],
            "sellerName": row[2],
            "sellerDocumentId": row[3],
            "employeeCode": _json_value(row[4]),
            "invoiceSellerCode": _json_value(row[5]),
            "monthlyGoal": _json_value(row[6]),
            "currentMonthSales": _json_value(row[7]),
            "yearTotalSales": _json_value(row[8]),
            "yearSalesCount": row[9],
            "yearAverageTicket": _json_value(row[10]),
            "salesByCategory": _json_value(row[11] or []),
            "salesByBrand": _json_value(row[12] or []),
            "topClients": _json_value(row[13] or []),
            "topProducts": _json_value(row[14] or []),
        }
        for row in rows
    ]


@sellers_bp.get("/sellers")
@require_authenticated_seller
def get_sellers():
    try:
        sellers = fetch_sellers(g.auth_user["id"])
    except Exception as exc:
        current_app.logger.exception("Sellers query failed")
        return error_response("Database unavailable", 503, exc)

    return jsonify(sellers)
