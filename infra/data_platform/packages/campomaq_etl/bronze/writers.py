"""
Supabase upsert functions for each Bronze table.
Expects DataFrames already containing source columns + 5 metadata columns.
"""
from __future__ import annotations
import pandas as pd
from psycopg2.extras import execute_values
from campomaq_etl.bronze.schemas import CONFLICT_TARGETS, UPSERT_ON_CONFLICT
from campomaq_etl.common.logging import get_logger

logger = get_logger(__name__)


def _df_to_rows(df: pd.DataFrame) -> list:
    """Convert DataFrame to list of tuples, replacing NaN/NaT with None."""
    df_clean = df.astype(object).where(pd.notnull(df), None)
    return list(df_clean.itertuples(index=False, name=None))


def _conflict_cols(entity_key: str) -> list[str]:
    return [c.strip() for c in CONFLICT_TARGETS[entity_key].split(",")]


def _dedupe_conflict_rows(df: pd.DataFrame, entity_key: str) -> pd.DataFrame:
    """Postgres cannot update the same conflict target twice in one INSERT."""
    conflict_cols = _conflict_cols(entity_key)
    deduped = df.drop_duplicates(subset=conflict_cols, keep="last")
    dropped = len(df) - len(deduped)
    if dropped:
        logger.warning(
            "Dropped %s duplicate %s rows by conflict key %s before upsert",
            dropped,
            entity_key,
            conflict_cols,
        )
    return deduped


def _upsert(conn, table_name: str, df: pd.DataFrame, entity_key: str) -> int:
    if df.empty:
        return 0

    df = _dedupe_conflict_rows(df, entity_key)
    if df.empty:
        return 0

    cols = list(df.columns)
    quoted_cols = ", ".join(f'"{c}"' for c in cols)
    conflict = CONFLICT_TARGETS[entity_key]

    if UPSERT_ON_CONFLICT[entity_key]:
        conflict_cols = _conflict_cols(entity_key)
        update_cols = [c for c in cols if c not in conflict_cols]
        update_clause = ", ".join(f'"{c}" = EXCLUDED."{c}"' for c in update_cols)
        sql = f"""
            INSERT INTO bronze.{table_name} ({quoted_cols})
            VALUES %s
            ON CONFLICT ({conflict}) DO UPDATE SET {update_clause}
        """
    else:
        sql = f"""
            INSERT INTO bronze.{table_name} ({quoted_cols})
            VALUES %s
            ON CONFLICT ({conflict}) DO NOTHING
        """

    rows = _df_to_rows(df)
    with conn.cursor() as cur:
        execute_values(cur, sql, rows, page_size=500)
    return len(df)


def write_products(conn, df: pd.DataFrame) -> int:
    return _upsert(conn, "raw_products", df, "products")

def write_kardex(conn, df: pd.DataFrame) -> int:
    return _upsert(conn, "raw_kardex", df, "kardex")

def write_stock(conn, df: pd.DataFrame) -> int:
    return _upsert(conn, "raw_stock", df, "stock")

def write_sales(conn, df: pd.DataFrame) -> int:
    return _upsert(conn, "raw_sales", df, "sales")

def write_sales_detail(conn, df: pd.DataFrame) -> int:
    return _upsert(conn, "raw_sales_detail", df, "sales_detail")

def write_credit_notes(conn, df: pd.DataFrame) -> int:
    return _upsert(conn, "raw_credit_notes", df, "credit_notes")
