# Campomaq Data Platform

Python ETL jobs for moving SQL Server data into Supabase bronze/silver/gold
schemas.

## Layout

- `packages/campomaq_etl/`: shared ETL code imported by local scripts and Azure
  WebJobs.
- `scripts/bronze_ingestion/`: on-prem SQL Server ingestion entrypoint.
- `webjobs/`: Azure WebJob wrappers plus per-job `requirements.txt` and
  `settings.job` schedules.
- `sql/`: Supabase schema/table setup scripts.
- `tests/`: focused unit and smoke tests.

The WebJob folders are deployment wrappers. Keep silver/gold implementation code
inside `packages/campomaq_etl/` so it can be tested and reused without copying
logic between WebJobs.

## Local Checks

```bash
PYTHONPATH=packages uv run pytest tests/
```
