import datetime
import decimal

from flask import Blueprint, current_app, jsonify, request

from auth import require_authenticated_seller
from common import error_response, parse_positive_int
from db import postgres_cursor


clients_bp = Blueprint("clients", __name__)

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
MAX_SEARCH_LENGTH = 100
MAX_DAYS_SINCE_LAST_PURCHASE = 365


def fetch_clients_page(query, page, page_size):
    where_clause = "WHERE days_since_last_purchase < %s"
    filter_params = [MAX_DAYS_SINCE_LAST_PURCHASE]
    if query:
        where_clause += """
            AND (
                   client_name ILIKE %s
                OR client_code ILIKE %s
                OR telephone_1 ILIKE %s
                OR telephone_2 ILIKE %s
                OR email ILIKE %s
            )
        """
        pattern = f"%{query}%"
        filter_params.extend([pattern] * 5)

    offset = (page - 1) * page_size

    with postgres_cursor() as cursor:
        cursor.execute(
            f"SELECT COUNT(*) FROM gold.clients {where_clause}",
            filter_params,
        )
        total = cursor.fetchone()[0]

        cursor.execute(
            f"""
            SELECT
                client_code,
                client_name,
                address,
                telephone_1,
                telephone_2,
                email,
                total_sales_last_6_months,
                sales_count_last_6_months,
                purchase_months_last_6_months,
                frequency_classification,
                last_purchase_date,
                days_since_last_purchase,
                recency_status,
                recent_invoices
            FROM gold.clients
            {where_clause}
            ORDER BY
                total_sales_last_6_months DESC,
                sales_count_last_6_months DESC,
                days_since_last_purchase ASC,
                client_name NULLS LAST,
                client_code
            LIMIT %s OFFSET %s
            """,
            [*filter_params, page_size, offset],
        )
        rows = cursor.fetchall()

    items = [
        {
            "id": row[0],
            "name": row[1],
            "address": row[2],
            "phonePrimary": row[3],
            "phoneSecondary": row[4],
            "email": row[5],
            "totalSalesLast6Months": _json_number(row[6]),
            "salesCountLast6Months": row[7],
            "purchaseMonthsLast6Months": row[8],
            "frequencyClassification": row[9],
            "lastPurchaseDate": _json_date(row[10]),
            "daysSinceLastPurchase": row[11],
            "recencyStatus": row[12],
            "recentInvoices": row[13] or [],
        }
        for row in rows
    ]
    return items, total


def _json_number(value):
    if isinstance(value, decimal.Decimal):
        return float(value)
    return value


def _json_date(value):
    if isinstance(value, (datetime.date, datetime.datetime)):
        return value.isoformat()
    return value


@clients_bp.get("/clients")
@require_authenticated_seller
def get_clients():
    query = (request.args.get("q") or "").strip()
    if len(query) > MAX_SEARCH_LENGTH:
        return error_response(
            f"q must be at most {MAX_SEARCH_LENGTH} characters",
            400,
        )

    try:
        page = parse_positive_int(request.args.get("page"), 1, "page")
        page_size = parse_positive_int(
            request.args.get("page_size"),
            DEFAULT_PAGE_SIZE,
            "page_size",
            max_value=MAX_PAGE_SIZE,
        )
    except ValueError as exc:
        return error_response(str(exc), 400)

    try:
        items, total = fetch_clients_page(query, page, page_size)
    except Exception as exc:
        current_app.logger.exception("Clients query failed")
        return error_response("Database unavailable", 503, exc)

    return jsonify(
        {
            "items": items,
            "page": page,
            "pageSize": page_size,
            "total": total,
        }
    )
