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

## Silver Transformations (Azure WebJob)

| WebJob | Tables refreshed | Schedule |
|---|---|---|
| `silver_fast_refresh` | `silver.stock`, `silver.kardex` | Every 10 min (`0 */10 * * * *`) |
| `silver_slow_refresh` | `silver.products`, `silver.prices`, `silver.sales` | Every 30 min (`0 */30 * * * *`) |

- Responsibility: Azure WebJob inside `api-campomaq-ec` App Service
- Reads from Bronze, applies cleaning/normalization, writes to Silver
- Incremental by default; supports `--start-date` / `--end-date` for local historical runs

## Gold Refresh (Azure WebJob)

| WebJob | Tables refreshed | Schedule |
|---|---|---|
| `gold_refresh` | `gold.product_catalog`, `gold.inventory_summary`, `gold.sales_summary` | Every 30 min at :15/:45 (`0 15 */1 * * *`) |

- Runs 15 min after the Silver slow refresh to ensure Silver is complete
- Reads from Silver, produces business-ready aggregates
- Incremental by default; supports `--start-date` / `--end-date` for local historical runs

## Historical Backfill Mode

Historical runs are executed **locally** by the developer. WebJobs always run in incremental mode.

```bash
# Bronze historical (run on on-prem machine)
python scripts/bronze_ingestion/run.py --start-date 2023-01-01 --end-date 2026-05-13

# Silver historical (run locally, pointing at Supabase)
python webjobs/silver_slow_refresh/run.py --start-date 2023-01-01 --end-date 2026-05-13
python webjobs/silver_fast_refresh/run.py --start-date 2023-01-01 --end-date 2026-05-13

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
