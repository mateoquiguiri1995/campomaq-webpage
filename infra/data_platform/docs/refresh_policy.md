# Refresh Policy

## Bronze Ingestion (on-prem)

| Table | Source | Trigger | Frequency |
|---|---|---|---|
| `bronze.raw_stock` | `IVDIA_STOCK_POR_CANTIDAD` | Windows Task Scheduler | Every 10 min |
| `bronze.raw_kardex` | `IVDIA_STOCK_CORTE_FECHA` | Windows Task Scheduler | Every 10 min |
| `bronze.raw_products` | `IVDIA_PRODUCTOS_LISTADO` | Windows Task Scheduler | Every 30 min |
| `bronze.raw_sales` | `VEN_CLIENTES_VENTAS` | Windows Task Scheduler | Every 30 min |
| `bronze.raw_sales_detail` | `VEN_VENTAS_CON_DETALLE` | Windows Task Scheduler | Every 30 min |
| `bronze.raw_credit_notes` | `VEN_NC_DETALLE` | Windows Task Scheduler | Every 30 min |

- Responsibility: on-prem `scripts/bronze_ingestion/run.py`
- No transformation — raw data + 5 metadata columns only
- Each run appends new/changed rows (incremental) or a date range (historical)

## Silver Transformations (Supabase Cron)

| WebJob | Tables refreshed | Schedule |
|---|---|---|
| `silver-fast-refresh` | `silver.sales`, `silver.sales_detail`, `silver.stock` | Every 10 min, one minute after Bronze (`1-59/10 * * * *`) |
| `silver-slow-refresh` | `silver.products`, `silver.clients`, `silver.kardex`, `silver.credit_notes` | Daily at 02:01 UTC (`1 2 * * *`) |

- Responsibility: Supabase Cron (`pg_cron`)
- Refreshes the Silver materialized views directly inside Postgres
- Fast Silver runs at minutes `01, 11, 21, 31, 41, 51`, after Bronze's ten-minute ingestion cycle.
- Materialized views are rebuilt from the current Bronze data on each refresh.

## Gold Refresh (Azure WebJob)

| WebJob | Tables refreshed | Schedule |
|---|---|---|
| `gold_refresh` | `gold.product_catalog`, `gold.inventory_summary`, `gold.sales_summary` | Every 30 min at :15/:45 (`0 15 */1 * * *`) |

- Runs hourly at minute 15 and reads the latest completed Silver refresh.
- Reads from Silver, produces business-ready aggregates
- Incremental by default; supports `--start-date` / `--end-date` for local historical runs

## Historical Backfill Mode

Historical runs are executed **locally** by the developer. WebJobs always run in incremental mode.

```bash
# Bronze historical (run on on-prem machine)
python scripts/bronze_ingestion/run.py --start-date 2023-01-01 --end-date 2026-05-13

# Silver historical (run locally, pointing at Supabase)
SELECT silver.refresh_slow();
SELECT silver.refresh_fast();

# Gold historical
python webjobs/gold_refresh/run.py --start-date 2023-01-01 --end-date 2026-05-13
```

## No-Transformation Rule (Bronze)

Bronze tables store the exact rows returned by SQL Server. Prohibited in Bronze:
- Type casting
- NULL handling or substitution
- Field renaming
- Aggregation or filtering
- Deduplication

The only additions are the 5 standard metadata columns: `ingestion_run_id`, `source_system`, `source_object`, `extracted_at`, `source_row_hash`.

## Idempotency

Silver and Gold jobs truncate and reload the target date partition before writing. Running the same job twice for the same date range produces the same result. Historical runs process data in 30-day chunks to stay within memory limits.
