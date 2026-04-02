from flask import Flask, Response, jsonify, request, stream_with_context
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import PyMongoError

import json
import math
import os
from bson import ObjectId
from dotenv import find_dotenv, load_dotenv
from openai import OpenAI


os.environ.setdefault("FLASK_ENV", "production")
if os.getenv("FLASK_ENV") == "development":
    load_dotenv(find_dotenv())


app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False
CORS(app, origins=os.getenv("CORS_ORIGINS", "*"))


TEXT_INDEX = "text_search"
POPULARITY_SCALE = 1
RESULT_LIMIT = int(os.getenv("SEARCH_RESULT_LIMIT", "20"))
MAX_PRODUCTS_LIMIT = int(os.getenv("MAX_PRODUCTS_LIMIT", "200"))
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "campomaq")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME", "cm_catalog")
MONGO_CONNECT_TIMEOUT_MS = int(os.getenv("MONGO_CONNECT_TIMEOUT_MS", "3000"))
MONGO_SERVER_SELECTION_TIMEOUT_MS = int(
    os.getenv("MONGO_SERVER_SELECTION_TIMEOUT_MS", "3000")
)
MONGO_SOCKET_TIMEOUT_MS = int(os.getenv("MONGO_SOCKET_TIMEOUT_MS", "10000"))
MONGO_QUERY_TIMEOUT_MS = int(os.getenv("MONGO_QUERY_TIMEOUT_MS", "8000"))
OPENAI_CHAT_MODEL = os.getenv("OPENAI_CHAT_MODEL", "gpt-4o-mini")
OPENAI_TIMEOUT_SECONDS = float(os.getenv("OPENAI_TIMEOUT_SECONDS", "30"))

CHAT_SYSTEM_PROMPT = (
    "Eres MAQUI, el asistente virtual de Campomaq. "
    "Responde en espanol claro, breve y util. "
    "Te especializas en maquinaria agricola, repuestos, implementos, mantenimiento, "
    "recomendaciones de uso y orientacion comercial inicial. "
    "Si falta informacion para recomendar una maquina o repuesto, haz una sola pregunta "
    "de aclaracion y luego orienta. "
    "No inventes stock, precios, garantias, tiempos de entrega ni politicas si no fueron "
    "confirmados. Cuando no sepas algo, dilo con honestidad y sugiere contactar a Campomaq al numero 0996517233."
)

_mongo_client = None
_openai_client = None


def is_development():
    return os.getenv("FLASK_ENV") == "development"


def clamp_int(value, default, min_value=None, max_value=None):
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        parsed = default

    if min_value is not None:
        parsed = max(min_value, parsed)
    if max_value is not None:
        parsed = min(max_value, parsed)
    return parsed


def format_exception_message(exc):
    if is_development():
        return str(exc)
    return exc.__class__.__name__


def error_response(message, status_code=500, exc=None):
    payload = {"error": message}
    if exc is not None:
        payload["details"] = format_exception_message(exc)
    return jsonify(payload), status_code


def get_openai_client():
    global _openai_client

    if _openai_client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY environment variable is required")
        _openai_client = OpenAI(
            api_key=api_key,
            timeout=OPENAI_TIMEOUT_SECONDS,
        )

    return _openai_client


def get_mongo_client():
    global _mongo_client

    if _mongo_client is None:
        mongo_uri = os.getenv("MONGO_URI")
        if not mongo_uri:
            raise RuntimeError("MONGO_URI environment variable is required")
        _mongo_client = MongoClient(
            mongo_uri,
            appname="campomaq-api",
            connect=False,
            connectTimeoutMS=MONGO_CONNECT_TIMEOUT_MS,
            serverSelectionTimeoutMS=MONGO_SERVER_SELECTION_TIMEOUT_MS,
            socketTimeoutMS=MONGO_SOCKET_TIMEOUT_MS,
        )

    return _mongo_client


def get_collection():
    return get_mongo_client()[MONGO_DB_NAME][MONGO_COLLECTION_NAME]


def dependency_status():
    checks = {
        "mongo": "not_checked",
        "openai": "configured" if os.getenv("OPENAI_API_KEY") else "missing_config",
    }
    ready = True

    try:
        get_mongo_client().admin.command("ping")
        checks["mongo"] = "ok"
    except Exception as exc:
        ready = False
        checks["mongo"] = format_exception_message(exc)

    return ready, checks


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
            return [fix_value(v) for v in value]
        if isinstance(value, dict):
            return {k: fix_value(v) for k, v in value.items()}
        return value

    return {k: fix_value(v) for k, v in product.items()}


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
                }
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


def build_chat_messages(user_message):
    return [
        {"role": "system", "content": CHAT_SYSTEM_PROMPT},
        {"role": "user", "content": user_message},
    ]


@app.get("/")
def root():
    return jsonify({"service": "campomaq-api", "status": "ok"})


@app.get("/health/live")
def health_live():
    return jsonify({"status": "alive"})


@app.get("/health/ready")
@app.get("/health")
def health_ready():
    ready, checks = dependency_status()
    status_code = 200 if ready else 503
    return (
        jsonify(
            {
                "status": "ready" if ready else "degraded",
                "service": "campomaq-api",
                "checks": checks,
            }
        ),
        status_code,
    )


@app.get("/search")
def search():
    q = (request.args.get("q") or "").strip()
    limit = clamp_int(request.args.get("limit"), RESULT_LIMIT, 1, RESULT_LIMIT)

    if not q:
        return jsonify([])

    app.logger.info("Search query: %s", q)

    try:
        docs = list(
            get_collection().aggregate(
                build_text_pipeline(q, limit=limit),
                allowDiskUse=True,
                maxTimeMS=MONGO_QUERY_TIMEOUT_MS,
            )
        )
        serialized_products = [serialize_product(product) for product in docs]
        return jsonify(serialized_products)
    except (PyMongoError, RuntimeError) as exc:
        app.logger.exception("Search failed")
        return error_response("Search request failed", 500, exc)


@app.get("/products")
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

    try:
        docs = list(
            get_collection().aggregate(
                build_products_pipeline(limit=limit, page=page),
                allowDiskUse=True,
                maxTimeMS=MONGO_QUERY_TIMEOUT_MS,
            )
        )
        serialized_products = [serialize_product(product) for product in docs]
        return jsonify(serialized_products)
    except (PyMongoError, RuntimeError) as exc:
        app.logger.exception("Products request failed")
        return error_response("Products request failed", 500, exc)


@app.post("/chat")
def chat():
    payload = request.get_json(silent=True) or {}
    user_message = (payload.get("message") or "").strip()

    if not user_message:
        return error_response("No message provided", 400)

    try:
        response = get_openai_client().chat.completions.create(
            model=OPENAI_CHAT_MODEL,
            messages=build_chat_messages(user_message),
            temperature=0.2,
            max_tokens=180,
        )
        reply = (response.choices[0].message.content or "").strip()
        return jsonify({"reply": reply, "model": OPENAI_CHAT_MODEL})
    except Exception as exc:
        app.logger.exception("Chat request failed")
        return error_response("Chat request failed", 500, exc)


@app.post("/chat/stream")
def chat_stream():
    payload = request.get_json(silent=True) or {}
    user_message = (payload.get("message") or "").strip()

    if not user_message:
        return error_response("No message provided", 400)

    @stream_with_context
    def generate():
        full_reply = []

        try:
            stream = get_openai_client().chat.completions.create(
                model=OPENAI_CHAT_MODEL,
                messages=build_chat_messages(user_message),
                temperature=0.2,
                max_tokens=180,
                stream=True,
            )

            for chunk in stream:
                delta = chunk.choices[0].delta.content or ""
                if not delta:
                    continue
                full_reply.append(delta)
                yield f"data: {json.dumps({'delta': delta}, ensure_ascii=False)}\n\n"

            yield (
                "event: done\n"
                f"data: {json.dumps({'reply': ''.join(full_reply)}, ensure_ascii=False)}\n\n"
            )
        except Exception as exc:
            app.logger.exception("Streaming chat request failed")
            yield (
                "event: error\n"
                f"data: {json.dumps({'error': format_exception_message(exc)}, ensure_ascii=False)}\n\n"
            )

    headers = {
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
    }
    return Response(generate(), mimetype="text/event-stream", headers=headers)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = is_development()

    app.logger.info("Starting Flask server on port %s", port)
    app.run(host="0.0.0.0", port=port, debug=debug)
