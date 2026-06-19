"""
Bronze ingestion: SQL Server → Supabase bronze tables.

Usage:
  python run.py                                            # incremental (last run + 15 min safety)
  python run.py --start-date 2022-01-01 --end-date 2026-05-14  # historical backfill
  python run.py --transactional                            # date-filtered tables only
  python run.py --dimension                                # full-extract tables only
"""
import argparse
import sys
from datetime import datetime, timezone, timedelta
from hashlib import sha256

import pandas as pd

from campomaq_etl.common.db import get_sqlserver_engine, get_supabase_connection
from campomaq_etl.common.logging import get_logger
from campomaq_etl.common.run_tracking import (
    generate_run_id, get_last_successful_data_end_time,
    start_run, complete_run, fail_run,
)
from campomaq_etl.bronze import readers, writers
from campomaq_etl.bronze.schemas import (
    SOURCE_SYSTEM, SOURCE_OBJECTS, HASH_FIELDS, SOURCE_COLUMNS, BRONZE_METADATA_COLUMNS,
)

logger = get_logger("bronze_ingestion")
JOB_NAME = "bronze_ingestion"
DIMENSION_JOB_NAME = "bronze_ingestion_dimension"
CHUNK_DAYS = 30
INCREMENTAL_SAFETY_MINUTES = 5
DEFAULT_HISTORY_START = "2022-01-01"
SQLSERVER_LOCAL_OFFSET_HOURS = -5


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--start-date", default=None, help="Historical start YYYY-MM-DD")
    p.add_argument("--end-date",   default=None, help="Historical end   YYYY-MM-DD (exclusive)")
    mode = p.add_mutually_exclusive_group()
    mode.add_argument("--transactional", action="store_true", help="Run date-filtered tables only")
    mode.add_argument("--dimension", action="store_true", help="Run full-extract tables only")
    return p.parse_args()


def _resolve_date_range(start_arg, end_arg):
    """Return (start_str, end_str) for date-filtered tables."""
    if start_arg and end_arg:
        logger.info(f"Historical mode: {start_arg} → {end_arg}")
        return start_arg, end_arg

    last_data_end = get_last_successful_data_end_time(JOB_NAME)
    if last_data_end:
        start_dt = last_data_end - timedelta(minutes=INCREMENTAL_SAFETY_MINUTES)
    else:
        start_dt = datetime.fromisoformat(DEFAULT_HISTORY_START)
        logger.warning(f"No previous successful run found; reading from {DEFAULT_HISTORY_START}")

    end_dt = datetime.now(timezone.utc)
    logger.info(f"Incremental mode: {start_dt} → {end_dt}")
    return start_dt.strftime("%Y-%m-%d %H:%M:%S"), end_dt.strftime("%Y-%m-%d %H:%M:%S")


def _date_chunks(start_str, end_str, chunk_days=CHUNK_DAYS):
    """Yield (chunk_start, chunk_end) string pairs for large date ranges."""
    date_fmt = "%Y-%m-%d"
    dt_fmt = "%Y-%m-%d %H:%M:%S"
    has_time = len(start_str) > 10 or len(end_str) > 10
    fmt = dt_fmt if has_time else date_fmt

    try:
        start = datetime.fromisoformat(start_str)
        end   = datetime.fromisoformat(end_str)
    except ValueError:
        yield start_str, end_str
        return

    current = start
    while current < end:
        chunk_end = min(current + timedelta(days=chunk_days), end)
        yield current.strftime(fmt), chunk_end.strftime(fmt)
        current = chunk_end


def _shift_datetime_string(value: str, hours: int) -> str:
    try:
        dt = datetime.fromisoformat(value)
    except ValueError:
        return value

    fmt = "%Y-%m-%d %H:%M:%S" if len(value) > 10 else "%Y-%m-%d"
    return (dt + timedelta(hours=hours)).strftime(fmt)


def _sqlserver_query_range(start_str: str, end_str: str, apply_local_offset: bool) -> tuple[str, str]:
    if not apply_local_offset:
        return start_str, end_str

    query_start = _shift_datetime_string(start_str, SQLSERVER_LOCAL_OFFSET_HOURS)
    query_end = _shift_datetime_string(end_str, SQLSERVER_LOCAL_OFFSET_HOURS)
    logger.info(f"SQL Server query window (UTC-5 local): {query_start} → {query_end}")
    return query_start, query_end


def _compute_hash_col(df: pd.DataFrame, entity_key: str) -> pd.Series:
    cols = HASH_FIELDS[entity_key]
    combined = df[cols].astype(str).apply("|".join, axis=1)
    return combined.map(lambda s: sha256(s.encode()).hexdigest()[:16])


def _add_metadata(df: pd.DataFrame, entity_key: str, run_id: str, extracted_at: datetime) -> pd.DataFrame:
    df = df.copy()
    df["source_row_hash"]  = _compute_hash_col(df, entity_key)
    df["ingestion_run_id"] = run_id
    df["source_system"]    = SOURCE_SYSTEM
    df["source_object"]    = SOURCE_OBJECTS[entity_key]
    df["extracted_at"]     = extracted_at
    return df


# ---------------------------------------------------------------------------
# Per-entity ingest (read → metadata → write)
# ---------------------------------------------------------------------------

def _ingest_full(engine, conn, entity_key, read_fn, write_fn, run_id, extracted_at):
    """Full extract (no date filter): products, stock."""
    logger.info(f"Reading {entity_key} (full extract)...")
    df = read_fn(engine)
    logger.info(f"  {len(df)} rows read")
    df = _add_metadata(df, entity_key, run_id, extracted_at)
    written = write_fn(conn, df)
    conn.commit()
    logger.info(f"  {written} rows upserted")
    return len(df), written


def _ingest_date_range(engine, conn, entity_key, read_fn, write_fn,
                       run_id, extracted_at, start_str, end_str):
    """Date-filtered ingest, chunked: kardex, sales, sales_detail, credit_notes."""
    total_read = total_written = 0
    for chunk_start, chunk_end in _date_chunks(start_str, end_str):
        logger.info(f"  chunk {chunk_start} → {chunk_end}")
        df = read_fn(engine, start_date=chunk_start, end_date=chunk_end)
        if df.empty:
            logger.info("    0 read, 0 upserted")
            continue
        df = _add_metadata(df, entity_key, run_id, extracted_at)
        written = write_fn(conn, df)
        conn.commit()
        total_read   += len(df)
        total_written += written
        logger.info(f"    {len(df)} read, {written} upserted")
    return total_read, total_written


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    args = _parse_args()
    tracking_job_name = DIMENSION_JOB_NAME if args.dimension else JOB_NAME
    run_id = generate_run_id()
    extracted_at = datetime.now(timezone.utc)

    logger.info(f"Bronze ingestion run {run_id} starting")
    start_run(tracking_job_name, run_id)

    try:
        engine = get_sqlserver_engine()
        conn   = get_supabase_connection()

        total_read = total_written = 0
        start_str = end_str = None

        # ── Full-extract tables (no date column) ──────────────────────────
        if not args.transactional:
            r, w = _ingest_full(engine, conn, "products",
                                readers.read_products, writers.write_products,
                                run_id, extracted_at)
            total_read += r; total_written += w

            r, w = _ingest_full(engine, conn, "stock",
                                readers.read_stock, writers.write_stock,
                                run_id, extracted_at)
            total_read += r; total_written += w

        # ── Date-filtered tables ──────────────────────────────────────────
        if not args.dimension:
            start_str, end_str = _resolve_date_range(args.start_date, args.end_date)
            query_start_str, query_end_str = _sqlserver_query_range(
                start_str,
                end_str,
                apply_local_offset=not (args.start_date and args.end_date),
            )

            for entity_key, read_fn, write_fn in [
                ("kardex",       readers.read_kardex,       writers.write_kardex),
                ("sales",        readers.read_sales,        writers.write_sales),
                ("sales_detail", readers.read_sales_detail, writers.write_sales_detail),
                ("credit_notes", readers.read_credit_notes, writers.write_credit_notes),
            ]:
                logger.info(f"Reading {entity_key}...")
                r, w = _ingest_date_range(engine, conn, entity_key, read_fn, write_fn,
                                          run_id, extracted_at, query_start_str, query_end_str)
                total_read += r; total_written += w

        complete_run(
            tracking_job_name,
            run_id,
            total_read,
            total_written,
            data_start_at=start_str,
            data_end_at=end_str,
        )
        logger.info(f"Run {run_id} complete — {total_read} read, {total_written} upserted")

    except Exception as e:
        logger.error(f"Run {run_id} failed: {e}", exc_info=True)
        fail_run(tracking_job_name, run_id, str(e))
        sys.exit(1)


if __name__ == "__main__":
    main()
