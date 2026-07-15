from flask import Blueprint, current_app, jsonify, request

from auth import require_authenticated_seller
from common import error_response, parse_positive_int
from db import postgres_cursor


clients_bp = Blueprint("clients", __name__)

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
MAX_SEARCH_LENGTH = 100


def fetch_clients_page(query, page, page_size):
    where_clause = ""
    filter_params = []
    if query:
        where_clause = """
            WHERE client_name ILIKE %s
               OR client_code ILIKE %s
               OR telephone_1 ILIKE %s
               OR telephone_2 ILIKE %s
               OR email ILIKE %s
        """
        pattern = f"%{query}%"
        filter_params = [pattern] * 5

    offset = (page - 1) * page_size

    with postgres_cursor() as cursor:
        cursor.execute(
            f"SELECT COUNT(*) FROM silver.clients {where_clause}",
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
                email
            FROM silver.clients
            {where_clause}
            ORDER BY client_name NULLS LAST, client_code
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
        }
        for row in rows
    ]
    return items, total


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
