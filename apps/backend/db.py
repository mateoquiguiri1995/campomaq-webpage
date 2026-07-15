import os
from contextlib import contextmanager

from psycopg2.pool import ThreadedConnectionPool
from pymongo import MongoClient


MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "campomaq")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME", "cm_catalog")
MONGO_CONNECT_TIMEOUT_MS = int(os.getenv("MONGO_CONNECT_TIMEOUT_MS", "3000"))
MONGO_SERVER_SELECTION_TIMEOUT_MS = int(
    os.getenv("MONGO_SERVER_SELECTION_TIMEOUT_MS", "3000")
)
MONGO_SOCKET_TIMEOUT_MS = int(os.getenv("MONGO_SOCKET_TIMEOUT_MS", "10000"))

_mongo_client = None
_postgres_pool = None


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


def get_postgres_pool():
    global _postgres_pool

    if _postgres_pool is None:
        database_url = os.getenv("API_DATABASE_URL")
        if not database_url:
            raise RuntimeError("API_DATABASE_URL environment variable is required")

        min_connections = int(os.getenv("POSTGRES_POOL_MIN", "1"))
        max_connections = int(os.getenv("POSTGRES_POOL_MAX", "5"))
        if min_connections < 1 or max_connections < min_connections:
            raise RuntimeError("Invalid Postgres pool configuration")

        _postgres_pool = ThreadedConnectionPool(
            min_connections,
            max_connections,
            dsn=database_url,
            connect_timeout=int(os.getenv("POSTGRES_CONNECT_TIMEOUT_SECONDS", "5")),
        )

    return _postgres_pool


@contextmanager
def postgres_cursor():
    pool = get_postgres_pool()
    connection = pool.getconn()
    try:
        with connection.cursor() as cursor:
            yield cursor
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        pool.putconn(connection)
