# Data Platform Architecture

## Data Flow

```
On-prem SQL Server (EMPRESA.dbo.*)
  │
  │  scripts/bronze_ingestion/run.py
  │  ├── mode: incremental (on-prem Windows Task Scheduler, every 10-30 min)
  │  └── mode: historical  (run locally once with --start-date / --end-date)
  ↓
Supabase — bronze.*
  Raw rows + metadata columns (JSONB). No transformation applied.
  │
  │  Supabase Cron (pg_cron)
  │  silver-fast-refresh  - at :01/:11/... -> sales, sales detail, stock
  │  silver-slow-refresh  - daily         -> products, clients, kardex, credit notes
  ↓
Supabase — silver.*
  Typed, cleaned, deduplicated rows. Business keys resolved.
  │
  │  Azure WebJob (api-campomaq-ec App Service)
  │  webjobs/gold_refresh  — every 30 min at :15/:45
  ↓
Supabase — gold.*
  Business-ready tables/views: product catalog, inventory summary, sales summary.
  │
  ↓
Flask API (apps/backend/) + Dashboard + Salesman app
```

## Layer Responsibilities

| Layer | Schema | What it contains | Transformation rule |
|---|---|---|---|
| Bronze | `bronze` | Raw rows from SQL Server as JSONB + 5 metadata columns | No transformation — exact copy of source |
| Silver | `silver` | Typed columns, nulls handled, deduplication applied, business keys resolved | Cleaning and normalization only — no business aggregation |
| Gold | `gold` | Business-ready aggregates and joined views for product catalog, inventory, and sales | Aggregation, joins across silver tables |
| Platform | `platform` | ETL run tracking (`etl_runs`) | Infrastructure — not business data |

## Execution Environments

| Script | Where it runs | Trigger |
|---|---|---|
| `scripts/bronze_ingestion/run.py` | On-prem Windows machine | Task Scheduler cron / local manual |
| `sql/03_silver_tables.sql`, `sql/05_silver_cron.sql` | Supabase Postgres | Materialized views + pg_cron |
| `webjobs/gold_refresh/run.py` | Azure App Service `api-campomaq-ec` | Azure WebJob triggered schedule |

## Legacy ETL

`infra/data_pipeline/` contains the original manual Jupyter notebook ETL pipeline that syncs SQL Server → MongoDB Atlas. It is kept for reference and is not part of this data platform. The two pipelines are independent.

## Historical Backfill

All scripts accept `--start-date YYYY-MM-DD --end-date YYYY-MM-DD` for historical runs. Historical runs are always executed locally by the developer. WebJobs always run in incremental mode (no date args).
