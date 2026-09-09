# Refresh Policy

## Bronze ingestion

| Table | Source | Frequency |
|---|---|---|
| `bronze.raw_stock` | `IVDIA_STOCK_POR_CANTIDAD` | Every 10 minutes |
| `bronze.raw_kardex` | `IVDIA_STOCK_CORTE_FECHA` | Every 10 minutes |
| `bronze.raw_products` | `IVDIA_PRODUCTOS_LISTADO` | Every 30 minutes |
| `bronze.raw_sales` | `VEN_CLIENTES_VENTAS` | Every 30 minutes |
| `bronze.raw_sales_detail` | `VEN_VENTAS_CON_DETALLE` | Every 30 minutes |
| `bronze.raw_credit_notes` | `VEN_NC_DETALLE` | Every 30 minutes |

Bronze is populated by the on-prem ingestion script. It keeps exact source
values plus `ingestion_run_id`, `source_system`, `source_object`,
`extracted_at`, and `source_row_hash`.

## Silver

Credit notes, sales, sales detail, stock, products, and kardex are normal views;
they require no refresh job and immediately reflect committed Bronze changes.

| Cron job | Object | Schedule |
|---|---|---|
| `silver-clients-daily` | `silver.clients` | Daily at 02:01 UTC (`1 2 * * *`) |

`silver.clients` remains materialized because it ranks the complete
sales-detail history to select each client's latest record.

## Gold

| Cron job | Object | Schedule |
|---|---|---|
| `gold-clients-refresh` | `gold.clients` | Hourly at minute 03 (`3 * * * *`) |
| `gold-sellers-refresh` | `gold.sellers` | Hourly at minute 04 (`4 * * * *`) |

Gold runs entirely in Supabase, reads only from Silver, and produces the client
and seller dashboard read models consumed by the API.

## Historical backfill

```bash
python scripts/bronze_ingestion/run.py \
  --start-date 2023-01-01 \
  --end-date 2026-05-13
```

After Bronze finishes:

```sql
SELECT silver.refresh_clients();
SELECT gold.refresh_clients();
SELECT gold.refresh_sellers();
```

Bronze writes are idempotent through their configured conflict targets. Normal
Silver views need no rebuild; materialized Silver and Gold views are replaced
by `REFRESH MATERIALIZED VIEW`.
