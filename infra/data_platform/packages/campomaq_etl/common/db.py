from __future__ import annotations
from campomaq_etl.common.config import load_config

_sqlserver_engine = None
_supabase_conn = None


def get_sqlserver_engine():
    global _sqlserver_engine
    if _sqlserver_engine is None:
        from sqlalchemy import create_engine
        config = load_config()
        _sqlserver_engine = create_engine(config.sqlserver_uri)
    return _sqlserver_engine


def get_supabase_connection():
    """Direct Postgres connection to Supabase via psycopg2 (DATABASE_URL)."""
    import psycopg2
    global _supabase_conn
    if _supabase_conn is None or _supabase_conn.closed:
        config = load_config()
        _supabase_conn = psycopg2.connect(config.supabase_db_url)
    return _supabase_conn
