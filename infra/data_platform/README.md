# Campomaq Data Platform

Python ETL jobs for moving SQL Server data into Supabase bronze/silver/gold
schemas.

## Layout

- `packages/campomaq_etl/`: shared Bronze ingestion code.
- `scripts/bronze_ingestion/`: on-prem SQL Server ingestion entrypoint.
- `sql/`: Supabase schema, materialized-view, and Cron setup scripts.
- `tests/`: focused unit and smoke tests.

## Local Checks

```bash
PYTHONPATH=packages uv run pytest tests/
```
