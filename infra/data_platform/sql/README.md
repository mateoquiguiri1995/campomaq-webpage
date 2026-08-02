# Supabase SQL

These scripts describe the current Supabase schemas, tables, views,
materialized views, and Cron orchestration.

## Apply order

Run the files in numeric order:

1. `00_schemas.sql`
2. `01_platform_tables.sql`
3. `02_bronze_tables.sql`
4. `03_silver_tables.sql`
5. `04_gold_tables.sql`
6. `05_catalog_tables.sql`
7. `06_supabase_cron.sql`

Using `psql`:

```bash
export SUPABASE_DB_URL="postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres"

for file in sql/0*.sql; do
  psql "$SUPABASE_DB_URL" --set ON_ERROR_STOP=1 --file "$file"
done
```

## Current object model

- Bronze contains physical raw tables populated by the on-prem ingestion job.
- Silver uses normal views for credit notes, sales, sales detail, stock,
  products, and kardex.
- `silver.clients` is materialized and refreshed daily because it ranks the
  complete client history.
- `gold.clients` is materialized and refreshed hourly.
- Catalog enrichment and media are physical tables in the `catalog` schema.
- Supabase Cron is the only Silver/Gold orchestration mechanism.

The scripts are the canonical definitions for bootstrapping an environment.
Changes to existing materialized-view definitions require an explicit
drop/recreate migration; `IF NOT EXISTS` does not replace them.
