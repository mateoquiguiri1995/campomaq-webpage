import sys
import types
from pathlib import Path

import pandas as pd


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

from campomaq_etl.bronze import writers  # noqa: E402


class _Cursor:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False


class _Conn:
    def cursor(self):
        return _Cursor()


def test_upsert_dedupes_duplicate_conflict_keys_before_execute(monkeypatch):
    captured = {}

    def fake_execute_values(cur, sql, rows, page_size):
        captured["rows"] = rows
        captured["sql"] = sql
        captured["page_size"] = page_size

    monkeypatch.setattr(writers, "execute_values", fake_execute_values)

    df = pd.DataFrame(
        [
            {"iedefv_iden": 10, "source_row_hash": "old"},
            {"iedefv_iden": 10, "source_row_hash": "new"},
            {"iedefv_iden": 11, "source_row_hash": "other"},
        ]
    )

    written = writers.write_sales_detail(_Conn(), df)

    assert written == 2
    assert captured["rows"] == [(10, "new"), (11, "other")]
    assert "ON CONFLICT (iedefv_iden) DO UPDATE" in captured["sql"]
    assert captured["page_size"] == 500
