import os
from dotenv import load_dotenv, find_dotenv
from sqlalchemy import create_engine
import pandas as pd
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson.decimal128 import Decimal128

# Load environment variables
load_dotenv(find_dotenv())

# SQL and MongoDB connections
engine = create_engine(os.environ['SQLSERVER_URI'])
client = MongoClient(os.environ['MONGO_URI'], server_api=ServerApi('1'))
cm_env = os.environ.get('CM_ENV', 'dev')

if cm_env == 'prod':
    collection = client["campomaq"]["cm_productos"]
else:
    collection = client["campomaq_test"]["cm_productos"]


# Read all products from SQL Server
df_products = pd.read_sql("SELECT * FROM CM_PRODUCTOS", engine)

# Ensure product_id is integer (adjust column name as needed)
df_products['product_id'] = df_products['product_id'].astype(int)

# Upsert products into MongoDB efficiently
for record in df_products.to_dict(orient="records"):
    # Use product_id as unique key, update if exists, insert if not
    collection.update_one(
        {"product_id": record["product_id"]},
        {"$set": record},
        upsert=True
    )

print(f"✅ Upserted {len(df_products)} products into MongoDB.")
