##### app.py
# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

import os, math
from bson import ObjectId
from bson.errors import InvalidId

import openai
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env if development
os.environ.setdefault('FLASK_ENV', 'development')
if os.getenv('FLASK_ENV') == 'development':
    load_dotenv(find_dotenv())
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable is required")


# Create Flask app
app = Flask(__name__)
CORS(app, origins="*")

# OpenAI client and MongoDB client
openai_client = OpenAI(api_key=openai_api_key)
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise ValueError("MONGO_URI environment variable is required")
client_mongo = MongoClient(mongo_uri)
db = client_mongo["campomaq"]
collection = db["cm_catalog"]

# ---------- Config: change these to match your Atlas indexes & tuning ----------
TEXT_INDEX = "text_search"        # Atlas Search index name (text)
VECTOR_INDEX = "vector_index"    # Atlas Vector Search index name
VECTOR_PATH = "embedding"                 # field with stored vector
POPULARITY_SCALE = 1                   # scale factor applied to popularity when adding it
RESULT_LIMIT = 20
# ------------------------------------------------------------------------------

def serialize_product(product):
    """Convert MongoDB document to JSON serializable format"""
    if not product:
        return None

    def fix_value(value):
        if isinstance(value, ObjectId):
            return str(value)
        elif isinstance(value, float):
            # Replace NaN or inf with None (or 0 if you prefer)
            if math.isnan(value) or math.isinf(value):
                return None
            return value
        elif isinstance(value, list):
            return [fix_value(v) for v in value]
        elif isinstance(value, dict):
            return {k: fix_value(v) for k, v in value.items()}
        else:
            return value

    return {k: fix_value(v) for k, v in product.items()}


def build_text_pipeline(query, limit=RESULT_LIMIT, index_name=TEXT_INDEX, popularity_scale=POPULARITY_SCALE):
    """
    Uses Atlas Search $search (compound/should) with a function score that **adds**
    scaled popularity to Atlas' relevance score.
    """
    pipeline = [
        {
            "$search": {
                "index": index_name,
                "compound": {
                    "should": [
                        # product_name strongly boosted
                        {
                            "text": {
                                "query": query,
                                "path": "product_name",
                                "fuzzy": {"maxEdits": 1},
                                "score": { "boost": { "value": 2 } }
                            }
                        },
                        # brand_name (less boost)
                        {
                            "text": {
                                "query": query,
                                "path": "brand_name",
                                "fuzzy": {"maxEdits": 1},
                                "score": { "boost": { "value": 1.25 } }
                            }
                        },
                    ],
                    # You can add minimumShouldMatch if desired
                    "minimumShouldMatch": 1
                }
            }
        },
        {
            "$match": { "show_in_app": True }
        },
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
                "discount": { "$ifNull": ["$discount", 0] },
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
                    { "$ifNull": ["$popularity", 1] },
                    popularity_scale,
                    # spare part factor
                    {
                    "$cond": [
                        { "$eq": ["$is_spare_part", False] },
                        1.9,   # boost if NOT spare part
                        1.0
                    ]
                    },
                    # discount factor
                    {
                    "$cond": [
                        { "$gt": ["$discount", 0] },
                        1.15,  # boost if discount > 0
                        1.0
                    ]
                    },
                    # new product factor
                    {
                    "$cond": [
                        { "$eq": ["$new_product", True] },
                        1.1,   # boost if new product
                        1.0
                    ]
                    }
                ]
                }
            }
        },

        {
        "$sort": { "final_score": -1 }
        },
        {"$limit": limit}
    ]
    return pipeline

@app.route("/search", methods=["GET"])
def search():
    q = (request.args.get("q") or "").strip()
    # mode = (request.args.get("mode") or "hybrid").lower()   # "text", "semantic", "hybrid"
    # limit = int(request.args.get("limit", RESULT_LIMIT))
    print(f"Search query: '{q}'")
    if not q:
        return jsonify([])

    pipeline = build_text_pipeline(q)
    docs = list(collection.aggregate(pipeline))
    # print(f"Text search pipeline: {docs}")
    serialized_products = [serialize_product(product) for product in docs]

    return jsonify(serialized_products)
    
@app.route("/products", methods=["GET"])
def get_products():
    """
    List products sorted by popularity (descending).
    - Only includes documents with show_in_app=True
    - Supports optional pagination via ?page=1&amp;limit=20
    """
    # # Parse optional pagination parameters
    # limit_default = RESULT_LIMIT
    # try:
    #     limit_param = (request.args.get("limit") or "").strip()
    #     page_param = (request.args.get("page") or "").strip()

    #     limit = int(limit_param) if limit_param.isdigit() else limit_default
    #     # Clamp to a reasonable range
    #     limit = max(1, min(limit, 100))
    #     page = int(page_param) if page_param.isdigit() else 1
    #     page = max(1, page)
    # except Exception:
    #     limit = limit_default
    #     page = 1

    # skip = (page - 1) * limit

    # Build aggregation pipeline to sort by popularity (default to 1 if missing)
    pipeline = [
    {"$match": {"show_in_app": True}},
    {
        "$addFields": {
            "effective_popularity": {"$ifNull": ["$popularity", 1]},
            "final_score": {
                "$multiply": [
                    {"$ifNull": ["$popularity", 1]},
                    # spare part factor
                    {
                        "$cond": [
                            {"$eq": ["$is_spare_part", False]},
                            9,  # boost if NOT spare part
                            1.0
                        ]
                    },
                    # discount factor
                    {
                        "$cond": [
                            {"$gt": ["$discount", 0]},
                            1.2,  # boost if discount > 0
                            1.0
                        ]
                    },
                    # new product factor
                    {
                        "$cond": [
                            {"$eq": ["$new_product", True]},
                            1.2,  # boost if new product
                            1.0
                        ]
                    }
                ]
            }
        }
    },
    {"$sort": {"final_score": -1}},
    {
        "$project": {
            "effective_popularity": 0,
            "final_score": 0  # hide scoring fields from response
        }
    }
]


    # if skip:
    #     pipeline.append({"$skip": skip})
    # pipeline.append({"$limit": limit})

    docs = list(collection.aggregate(pipeline))
    serialized_products = [serialize_product(p) for p in docs]

    return jsonify(serialized_products)

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful agricultural machinery assistant who help with short and concise answers in spanish."},
                {"role": "user", "content": user_message}
            ],
            temperature=0.0,
            max_tokens=100,
        )
        reply = response.choices[0].message.content.strip()
        print(user_message)
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})



if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"Starting Flask server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))