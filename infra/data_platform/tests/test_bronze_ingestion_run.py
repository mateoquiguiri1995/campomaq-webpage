import importlib.util
import sys
import types
import pytest
from datetime import datetime
from pathlib import Path


def _load_bronze_run_module():
    data_platform = Path(__file__).resolve().parents[1]
    packages = data_platform / "packages"
    if str(packages) not in sys.path:
        sys.path.insert(0, str(packages))

    if "psycopg2.extras" not in sys.modules:
        psycopg2 = types.ModuleType("psycopg2")
        extras = types.ModuleType("psycopg2.extras")
        extras.execute_values = lambda *args, **kwargs: None
        psycopg2.extras = extras
        sys.modules.setdefault("psycopg2", psycopg2)
        sys.modules["psycopg2.extras"] = extras

    run_path = data_platform / "scripts" / "bronze_ingestion" / "run.py"
    spec = importlib.util.spec_from_file_location("bronze_ingestion_run", run_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_date_chunks_historical_range_uses_30_day_chunks():
    run = _load_bronze_run_module()

    chunks = list(run._date_chunks("2026-01-01", "2026-03-15", chunk_days=30))

    assert chunks == [
        ("2026-01-01", "2026-01-31"),
        ("2026-01-31", "2026-03-02"),
        ("2026-03-02", "2026-03-15"),
    ]


def test_parse_args_accepts_transactional_mode(monkeypatch):
    run = _load_bronze_run_module()
    monkeypatch.setattr(sys, "argv", ["run.py", "--transactional"])

    args = run._parse_args()

    assert args.transactional is True
    assert args.dimension is False


def test_parse_args_accepts_dimension_mode(monkeypatch):
    run = _load_bronze_run_module()
    monkeypatch.setattr(sys, "argv", ["run.py", "--dimension"])

    args = run._parse_args()

    assert args.dimension is True
    assert args.transactional is False


def test_parse_args_rejects_combined_modes(monkeypatch):
    run = _load_bronze_run_module()
    monkeypatch.setattr(sys, "argv", ["run.py", "--transactional", "--dimension"])

    with pytest.raises(SystemExit):
        run._parse_args()


def test_date_chunks_same_day_incremental_preserves_time():
    run = _load_bronze_run_module()

    chunks = list(run._date_chunks(
        "2026-05-18 10:05:00",
        "2026-05-18 10:20:00",
    ))

    assert chunks == [("2026-05-18 10:05:00", "2026-05-18 10:20:00")]


def test_date_chunks_invalid_dates_yield_original_range_once():
    run = _load_bronze_run_module()

    chunks = list(run._date_chunks("not-a-date", "still-not-a-date"))

    assert chunks == [("not-a-date", "still-not-a-date")]


def test_sqlserver_query_range_shifts_incremental_utc_to_local_dates():
    run = _load_bronze_run_module()

    start_str, end_str = run._sqlserver_query_range(
        "2026-06-19 04:29:01",
        "2026-06-19 04:46:49",
        apply_local_offset=True,
    )

    assert start_str == "2026-06-18"
    assert end_str == "2026-06-19"


def test_sqlserver_query_range_queries_full_current_local_day():
    run = _load_bronze_run_module()

    start_str, end_str = run._sqlserver_query_range(
        "2026-06-19 18:34:13",
        "2026-06-19 19:10:10",
        apply_local_offset=True,
    )

    assert start_str == "2026-06-19"
    assert end_str == "2026-06-20"


def test_sqlserver_query_range_leaves_historical_dates_unchanged():
    run = _load_bronze_run_module()

    start_str, end_str = run._sqlserver_query_range(
        "2023-01-01",
        "2026-01-01",
        apply_local_offset=False,
    )

    assert start_str == "2023-01-01"
    assert end_str == "2026-01-01"


def test_resolve_date_range_uses_last_data_end_with_safety_window(monkeypatch):
    run = _load_bronze_run_module()
    monkeypatch.setattr(
        run,
        "get_last_successful_data_end_time",
        lambda job_name: datetime(2026, 5, 18, 10, 20, 0),
    )

    start_str, end_str = run._resolve_date_range(None, None)

    assert start_str == "2026-05-18 10:15:00"
    assert len(end_str) == len("YYYY-MM-DD HH:MM:SS")


def test_resolve_date_range_falls_back_to_default_history_start(monkeypatch):
    run = _load_bronze_run_module()
    monkeypatch.setattr(run, "get_last_successful_data_end_time", lambda job_name: None)

    start_str, end_str = run._resolve_date_range(None, None)

    assert start_str == "2022-01-01 00:00:00"
    assert len(end_str) == len("YYYY-MM-DD HH:MM:SS")
