# Data Platform Architecture

## Data flow

```text
On-prem SQL Server (EMPRESA.dbo.*)
  │
  │  scripts/bronze_ingestion/run.py
  │  ├── incremental: Windows Task Scheduler, every 10–30 minutes
  │  └── historical: local run with --start-date / --end-date
  ↓
Supabase — bronze.*
  Physical raw tables plus ingestion metadata
  ↓
Supabase — silver.*
  Normal views: credit_notes, sales, sales_detail, stock, products, kardex
  Materialized view: clients
  │
  │  silver-clients-daily — daily at 02:01 UTC
  ↓
Supabase — gold.clients
  Materialized client metrics read model
  │
  │  gold-clients-refresh — hourly at minute 03 UTC
  ↓
Flask API + internal seller app
```

The separate `catalog` schema stores product enrichment and media maintained
outside the accounting source system.

## Layer responsibilities

| Layer | Schema | Responsibility |
|---|---|---|
| Bronze | `bronze` | Exact source rows plus ingestion metadata |
| Silver | `silver` | Cleaning, normalization, and business keys |
| Gold | `gold` | Business-ready aggregates for API reads |
| Catalog | `catalog` | App-managed product content and media |
| Platform | `platform` | Bronze ETL run tracking |

## Execution environments

| Component | Environment | Trigger |
|---|---|---|
| `scripts/bronze_ingestion/run.py` | On-prem Windows machine | Task Scheduler or local manual run |
| Silver normal views | Supabase Postgres | Always reflect current Bronze data |
| `silver.refresh_clients()` | Supabase Cron | Daily at 02:01 UTC |
| `gold.refresh_clients()` | Supabase Cron | Hourly at minute 03 UTC |

## Historical backfill

Bronze scripts accept `--start-date YYYY-MM-DD --end-date YYYY-MM-DD` for local
historical runs. After the Bronze backfill, refresh the two materialized views:

```sql
SELECT silver.refresh_clients();
SELECT gold.refresh_clients();
```
