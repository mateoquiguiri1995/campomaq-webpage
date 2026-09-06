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
8. `07_catalog_products.sql`

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
- `gold.sellers` is materialized and refreshed hourly. It contains one row per
  actual salesperson plus a company-wide General row, with month-to-date goal
  data and year-to-date dashboard metrics.
- Catalog enrichment and media are physical tables in the `catalog` schema.
- `gold.catalog_products` is a normal view joining Silver products with catalog
  enrichment and ordered image links. Apply `07_catalog_products.sql` alone to
  add it to an existing project after the catalog tables exist.
- Supabase Cron is the only Silver/Gold orchestration mechanism.

Catalog publication to Mongo is a separate Python worker command, not a
Supabase refresh job. See [PIM handoff](../docs/pim_handoff.md) for verified
state, field ownership, and activation instructions.

The scripts are the canonical definitions for bootstrapping an environment.
Changes to existing materialized-view definitions require an explicit
drop/recreate migration; `IF NOT EXISTS` does not replace them.

## Add sellers to an existing Supabase project

Run these files in the Supabase SQL editor, in order:

1. `03_silver_tables.sql` exposes the actual seller identity from both sales
   sources.
2. `04_gold_tables.sql` drops and recreates `gold.sellers` with individual and
   General rows, then recreates its indexes.
3. `06_supabase_cron.sql` creates `gold.refresh_sellers()` and schedules
   `gold-sellers-refresh` for minute 04 of every hour (UTC).

Then populate the materialized view immediately instead of waiting for Cron:

```sql
SELECT gold.refresh_sellers();
```

Inspect the generated identities before configuring authentication mappings:

```sql
SELECT
  seller_id,
  seller_type,
  feempl_nome,
  feempl_cedu,
  emple_cod,
  emple_vcod
FROM gold.sellers
ORDER BY seller_type, feempl_nome;
```

Map each normal user to the appropriate cédula. Map the admin to the reserved
General ID. `seller_id` is a text column, so numeric-looking values remain in
quotes:

```sql
UPDATE public.seller_profiles
SET seller_id = '<seller feempl_cedu>'
WHERE user_id = '<seller auth user UUID>'::UUID;

UPDATE public.seller_profiles
SET seller_id = '9999999999'
WHERE user_id = '<admin auth user UUID>'::UUID;
```

The seller view uses `CURRENT_DATE` in the Supabase database. Its
`current_month_sales` is month-to-date for the current calendar month; all
other calculated metrics use the current calendar year through today.
