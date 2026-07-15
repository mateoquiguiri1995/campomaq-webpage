import math
import os

from bson import ObjectId
from flask import Blueprint, current_app, jsonify, request
from pymongo.errors import PyMongoError

from common import clamp_int, error_response
from db import get_collection
from utils.cache import (
    get_cached_products,
    get_cached_search,
    set_cached_products,
    set_cached_search,
)


search_bp = Blueprint("search", __name__)

TEXT_INDEX = "text_search"
POPULARITY_SCALE = 1
RESULT_LIMIT = int(os.getenv("SEARCH_RESULT_LIMIT", "20"))
MAX_PRODUCTS_LIMIT = int(os.getenv("MAX_PRODUCTS_LIMIT", "200"))
MONGO_QUERY_TIMEOUT_MS = int(os.getenv("MONGO_QUERY_TIMEOUT_MS", "8000"))


def serialize_product(product):
    if not product:
        return None

    def fix_value(value):
        if isinstance(value, ObjectId):
            return str(value)
        if isinstance(value, float):
            if math.isnan(value) or math.isinf(value):
                return None
            return value
        if isinstance(value, list):
            return [fix_value(item) for item in value]
        if isinstance(value, dict):
            return {key: fix_value(item) for key, item in value.items()}
        return value

    return {key: fix_value(value) for key, value in product.items()}


def build_text_pipeline(
    query,
    limit=RESULT_LIMIT,
    index_name=TEXT_INDEX,
    popularity_scale=POPULARITY_SCALE,
):
    return [
        {
            "$search": {
                "index": index_name,
                "compound": {
                    "should": [
                        {
                            "text": {
                                "query": query,
                                "path": "product_name",
                                "synonyms": "synonym_mapping",
                                "matchCriteria": "any",
                                "score": {"boost": {"value": 2}},
                            }
                        },
                        {
                            "text": {
                                "query": query,
                                "path": "product_name",
                                "fuzzy": {"maxEdits": 1},
                                "score": {"boost": {"value": 2}},
                            }
                        },
                        {
                            "text": {
                                "query": query,
                                "path": "brand_name",
                                "fuzzy": {"maxEdits": 2},
                                "score": {"boost": {"value": 1.25}},
                            }
                        },
                    ],
                    "minimumShouldMatch": 1,
                },
            }
        },
        {"$match": {"show_in_app": True}},
        {
            "$project": {
                "_id": 0,
                "product_id": 1,
                "product_code": 1,
                "product_name": 1,
                "brand_name": 1,
                "brand_logo": 1,
                "price_cash": 1,
                "description": 1,
                "category_name": 1,
                "link": 1,
                "show_in_app": 1,
                "is_spare_part": 1,
                "new_product": 1,
                "discount": {"$ifNull": ["$discount", 0]},
                "main_boost": 1,
                "low_value_flag": 1,
                "popularity": {"$ifNull": ["$popularity", 1]},
                "score": {"$meta": "searchScore"},
                "final_score": 1,
            }
        },
        {
            "$addFields": {
                "final_score": {
                    "$multiply": [
                        "$score",
                        {"$ifNull": ["$popularity", 1]},
                        popularity_scale,
                        {
                            "$cond": [
                                {"$eq": ["$is_spare_part", False]},
                                1.9,
                                1.0,
                            ]
                        },
                        {
                            "$cond": [
                                {"$gt": ["$discount", 0]},
                                1.15,
                                1.0,
                            ]
                        },
                        {
                            "$cond": [
                                {"$eq": ["$new_product", True]},
                                1.1,
                                1.0,
                            ]
                        },
                    ]
                }
            }
        },
        {"$sort": {"final_score": -1}},
        {"$limit": limit},
    ]


def build_products_pipeline(limit=None, page=1):
    pipeline = [
        {"$match": {"show_in_app": True}},
        {
            "$addFields": {
                "effective_popularity": {"$ifNull": ["$popularity", 1]},
                "final_score": {
                    "$multiply": [
                        {"$ifNull": ["$popularity", 1]},
                        {
                            "$cond": [
                                {"$eq": ["$is_spare_part", False]},
                                9,
                                1.0,
                            ]
                        },
                        {
                            "$cond": [
                                {"$gt": ["$discount", 0]},
                                1.2,
                                1.0,
                            ]
                        },
                        {
                            "$cond": [
                                {"$eq": ["$new_product", True]},
                                1.2,
                                1.0,
                            ]
                        },
                    ]
                },
            }
        },
        {"$sort": {"final_score": -1}},
        {
            "$project": {
                "effective_popularity": 0,
                "final_score": 0,
            }
        },
    ]

    if limit is not None:
        skip = max(0, (page - 1) * limit)
        if skip:
            pipeline.append({"$skip": skip})
        pipeline.append({"$limit": limit})

    return pipeline


@search_bp.get("/search")
def search():
    query = (request.args.get("q") or "").strip()
    limit = clamp_int(request.args.get("limit"), RESULT_LIMIT, 1, RESULT_LIMIT)

    if not query:
        return jsonify([])

    current_app.logger.info("Search query: %s", query)

    cached = get_cached_search(query, limit)
    if cached is not None:
        return jsonify(cached)

    try:
        docs = list(
            get_collection().aggregate(
                build_text_pipeline(query, limit=limit),
                allowDiskUse=True,
                maxTimeMS=MONGO_QUERY_TIMEOUT_MS,
            )
        )
        serialized_products = [serialize_product(product) for product in docs]
        set_cached_search(query, limit, serialized_products)
        return jsonify(serialized_products)
    except (PyMongoError, RuntimeError) as exc:
        current_app.logger.exception("Search failed")
        return error_response("Search request failed", 500, exc)


@search_bp.get("/products")
def get_products():
    limit_param = (request.args.get("limit") or "").strip().lower()
    page_param = request.args.get("page")

    limit = None
    if limit_param:
        if limit_param != "all":
            limit = clamp_int(limit_param, RESULT_LIMIT, 1, MAX_PRODUCTS_LIMIT)
    elif page_param:
        limit = RESULT_LIMIT

    page = clamp_int(page_param, 1, 1)
    use_cache = not limit_param and not page_param

    if use_cache:
        cached = get_cached_products()
        if cached is not None:
            return jsonify(cached)

    try:
        docs = list(
            get_collection().aggregate(
                build_products_pipeline(limit=limit, page=page),
                allowDiskUse=True,
                maxTimeMS=MONGO_QUERY_TIMEOUT_MS,
            )
        )
        serialized_products = [serialize_product(product) for product in docs]
        if use_cache:
            set_cached_products(serialized_products)
        return jsonify(serialized_products)
    except (PyMongoError, RuntimeError) as exc:
        current_app.logger.exception("Products request failed")
        return error_response("Products request failed", 500, exc)
