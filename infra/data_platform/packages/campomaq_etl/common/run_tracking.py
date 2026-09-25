from datetime import datetime, timezone
from hashlib import sha256
from typing import Optional, Union


def generate_run_id() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")


def generate_row_hash(fields: list) -> str:
    """SHA-256 of pipe-joined field values, truncated to 16 hex chars."""
    raw = "|".join(str(f) for f in fields)
    return sha256(raw.encode()).hexdigest()[:16]


def _get_conn():
    from campomaq_etl.common.db import get_supabase_connection
    return get_supabase_connection()


def start_run(job_name: str, run_id: str) -> None:
    conn = _get_conn()
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO platform.etl_runs (run_id, job_name, started_at, status)
            VALUES (%s, %s, %s, 'running')
            ON CONFLICT (run_id, job_name) DO NOTHING
            """,
            (run_id, job_name, datetime.now(timezone.utc)),
        )
    conn.commit()


def complete_run(
    job_name: str,
    run_id: str,
    rows_read: int,
    rows_written: int,
    data_start_at: Optional[Union[datetime, str]] = None,
    data_end_at: Optional[Union[datetime, str]] = None,
) -> None:
    conn = _get_conn()
    with conn.cursor() as cur:
        cur.execute(
            """
            UPDATE platform.etl_runs
            SET status = 'success',
                finished_at = %s,
                rows_read = %s,
                rows_written = %s,
                data_start_at = %s,
                data_end_at = %s
            WHERE run_id = %s AND job_name = %s
            """,
            (
                datetime.now(timezone.utc),
                rows_read,
                rows_written,
                data_start_at,
                data_end_at,
                run_id,
                job_name,
            ),
        )
    conn.commit()


def fail_run(job_name: str, run_id: str, error_message: str) -> None:
    try:
        conn = _get_conn()
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE platform.etl_runs
                SET status = 'failed', finished_at = %s, error_message = %s
                WHERE run_id = %s AND job_name = %s
                """,
                (datetime.now(timezone.utc), error_message[:2000], run_id, job_name),
            )
        conn.commit()
    except Exception:
        pass  # don't let tracking failure mask the original error


def get_last_successful_run_time(job_name: str) -> Optional[datetime]:
    conn = _get_conn()
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT MAX(finished_at) FROM platform.etl_runs
            WHERE job_name = %s AND status = 'success'
            """,
            (job_name,),
        )
        row = cur.fetchone()
    return row[0] if row and row[0] else None


def get_last_successful_data_end_time(job_name: str) -> Optional[datetime]:
    """Return the latest successful source-data watermark for a job.

    Legacy rows created before data_end_at existed fall back to finished_at.
    """
    conn = _get_conn()
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT COALESCE(data_end_at, finished_at)
            FROM platform.etl_runs
            WHERE job_name = %s AND status = 'success'
            ORDER BY finished_at DESC
            LIMIT 1
            """,
            (job_name,),
        )
        row = cur.fetchone()
    return row[0] if row and row[0] else None
