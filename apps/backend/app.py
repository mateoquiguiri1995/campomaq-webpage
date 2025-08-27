##### app.py
# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

import os
import openai
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env
load_dotenv(find_dotenv())
openai.api_key = os.environ['OPENAI_API_KEY']


# Create Flask app
app = Flask(__name__)
CORS(app)

# OpenAI client and MongoDB client
openai_client = OpenAI()
mongo_uri = os.getenv("MONGO_URI")
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
                "product_name": 1,
                "brand_name": 1,
                "description": 1,
                "category_name": 1,
                "link": 1,
                "show_in_app": 1,
                "main_boost": 1,
                "low_value_flag": 1,
                "popularity": {"$ifNull": ["$popularity", 0]},
                "score": {"$meta": "searchScore"},
                "final_score": 1

            }
        },
                {
            "$addFields": {
                "final_score": {
                    "$multiply": [
                        "$score",
                        { "$ifNull": ["$popularity", 0] },
                        popularity_scale
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

    if not q:
        return jsonify([])

    # TEXT mode: Atlas $search with function boosting popularity
    pipeline = build_text_pipeline(q)
    docs = list(collection.aggregate(pipeline))
    # print(f"Text search pipeline: {docs}")
    for x in docs:
        x["product_name"] = x["product_name"].strip()
    return jsonify(docs)
    
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



# if __name__ == '__main__':
#     app.run(debug=True)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))