import re
import logging
from campomaq_etl.common.run_tracking import generate_run_id, generate_row_hash
from campomaq_etl.common.logging import get_logger


def test_generate_run_id_format():
    run_id = generate_run_id()
    assert re.match(r"^\d{8}_\d{6}$", run_id), f"Unexpected run_id format: {run_id}"


def test_generate_run_id_is_string():
    assert isinstance(generate_run_id(), str)


def test_generate_row_hash_length():
    h = generate_row_hash(["ABC123", "Product Name", "100.00", "50"])
    assert len(h) == 16, f"Expected 16 chars, got {len(h)}"


def test_generate_row_hash_is_hex():
    h = generate_row_hash(["ABC123", "Product Name", "100.00"])
    assert all(c in "0123456789abcdef" for c in h), f"Non-hex char in hash: {h}"


def test_generate_row_hash_deterministic():
    fields = ["CODE1", "Some Product", "99.99"]
    assert generate_row_hash(fields) == generate_row_hash(fields)


def test_generate_row_hash_different_inputs():
    h1 = generate_row_hash(["A", "B"])
    h2 = generate_row_hash(["A", "C"])
    assert h1 != h2


def test_generate_row_hash_empty_fields():
    h = generate_row_hash([])
    assert len(h) == 16


def test_get_logger_emits_info_when_configured(monkeypatch, capsys):
    logger_name = "test_etl_progress_logger"
    logger = logging.getLogger(logger_name)
    logger.handlers.clear()

    monkeypatch.setenv("ETL_LOG_LEVEL", "INFO")

    logger = get_logger(logger_name)
    logger.info("chunk progress visible")

    captured = capsys.readouterr()
    assert "INFO test_etl_progress_logger chunk progress visible" in captured.err
