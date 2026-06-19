# Applying SQL Migrations to Supabase

Run these files in order against the `campomaq` Supabase project. The project is empty — all schemas and tables need to be created.

## Option A: Supabase SQL Editor (easiest)

1. Go to Supabase dashboard → SQL Editor
2. Open and run each file in order:
   - `00_schemas.sql`
   - `01_platform_tables.sql`
   - `02_bronze_tables.sql`
   - `03_silver_tables.sql` (placeholder — no-op until Week 2)
   - `04_gold_tables.sql` (placeholder — no-op until Week 2)

## Option B: psql CLI

Requires `SUPABASE_DB_URL` from `docs/environment_variables.md`.

```bash
export SUPABASE_DB_URL="postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres"

psql $SUPABASE_DB_URL < sql/00_schemas.sql
psql $SUPABASE_DB_URL < sql/01_platform_tables.sql
psql $SUPABASE_DB_URL < sql/02_bronze_tables.sql
psql $SUPABASE_DB_URL < sql/03_silver_tables.sql
psql $SUPABASE_DB_URL < sql/04_gold_tables.sql
```

## Notes

- All `CREATE TABLE` statements use `IF NOT EXISTS` — safe to re-run.
- `03_silver_tables.sql` and `04_gold_tables.sql` are placeholders in Week 1. They will gain actual column definitions in Week 2 after source PK discovery.
- Do not apply migrations on prod before testing on dev.
