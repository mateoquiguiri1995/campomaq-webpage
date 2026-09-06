"""Publish the Supabase catalog projection. Preview by default; --apply writes.

Run from any directory: python apps/backend/publish_catalog.py [--apply]
The deployed App Service WebJob runs it once per hour.
"""
import argparse
import json
import math
import os
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

import psycopg2
from psycopg2.extras import RealDictCursor
from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv


def normalize(value):
    if isinstance(value, Decimal):
        value = float(value)
    if isinstance(value, float) and not math.isfinite(value):
        raise ValueError("Catalog contains a non-finite number")
    if isinstance(value, dict):
        return {key: normalize(item) for key, item in value.items()}
    if isinstance(value, list):
        return [normalize(item) for item in value]
    return value


def build_operations(rows, published_at):
    operations = []
    ids = set()
    for row in rows:
        document = normalize(dict(row))
        product_id = document['product_id']
        if type(product_id) is not int or product_id in ids:
            raise ValueError('Gold must contain unique integer product IDs')
        ids.add(product_id)
        document['catalog_synced_at'] = published_at
        operations.append(UpdateOne(
            {'product_id': product_id},
            {'$set': document,
             # Retain existing embeddings and ranking values during cutover.
             '$setOnInsert': {'popularity': 1, 'low_value_flag': 0}},
            upsert=True,
        ))
    if not operations:
        raise ValueError('Refusing to publish an empty catalog')
    return operations, sorted(ids)


def invalidate_catalog_cache():
    from utils.cache import get_redis_client

    client = get_redis_client()
    if client is None:
        if os.getenv('REDIS_URL'):
            raise RuntimeError('Mongo published, but Redis unavailable; rerun to clear caches')
        return
    client.delete('products:catalog')
    for key in client.scan_iter(match='search:*', count=500):
        client.delete(key)


def publish(apply=False):
    load_dotenv(Path(__file__).resolve().parent / '.env')
    connection = psycopg2.connect(os.environ['API_DATABASE_URL'], connect_timeout=10)
    try:
        # Hold a transaction lock until publishing finishes; also works with
        # Supabase transaction pooling. Closing releases the read transaction.
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute('SELECT pg_try_advisory_xact_lock(73001, 1) AS acquired')
            if not cursor.fetchone()['acquired']:
                raise RuntimeError('Another catalog publisher is running')
            cursor.execute('SELECT * FROM gold.catalog_products ORDER BY product_id')
            rows = cursor.fetchall()
        operations, product_ids = build_operations(rows, datetime.now(timezone.utc))
        with MongoClient(os.environ['MONGO_URI'], serverSelectionTimeoutMS=10000) as mongo:
            collection = mongo[os.getenv('MONGO_DB_NAME', 'campomaq')][
                os.getenv('MONGO_COLLECTION_NAME', 'cm_catalog')]
            duplicates = list(collection.aggregate([
                {'$group': {'_id': '$product_id', 'count': {'$sum': 1}}},
                {'$match': {'$or': [
                    {'_id': None},
                    {'count': {'$gt': 1}},
                ]}},
                {'$limit': 1},
            ]))
            if duplicates:
                raise ValueError('Mongo has duplicate/missing product IDs; reconcile before publishing')
            summary = {
                'gold_products': len(rows),
                'gold_visible': sum(row['show_in_app'] for row in rows),
                'mongo_products': collection.count_documents({}),
                'mongo_visible': collection.count_documents({'show_in_app': True}),
                'orphan_visible_to_hide': collection.count_documents({
                    'product_id': {'$nin': product_ids}, 'show_in_app': True}),
                'apply': apply,
            }
            print(json.dumps(summary))
            if not apply:
                return summary
            result = collection.bulk_write(operations, ordered=True)
            # Keep legacy documents/embeddings for recovery, but unpublish rows
            # absent from ERP. Failed bulk writes never reach this step.
            hidden = collection.update_many(
                {'product_id': {'$nin': product_ids}, 'show_in_app': True},
                {'$set': {'show_in_app': False}},
            )
            invalidate_catalog_cache()
            summary.update(inserted=result.upserted_count, modified=result.modified_count,
                           hidden=hidden.modified_count)
            print(json.dumps(summary))
            return summary
    finally:
        connection.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true', help='Write Mongo and invalidate catalog caches')
    publish(parser.parse_args().apply)
