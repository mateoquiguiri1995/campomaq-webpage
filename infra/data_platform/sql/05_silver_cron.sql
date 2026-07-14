-- Supabase Cron refreshes Silver after the on-prem Bronze ingestion windows.
-- Cron schedules use UTC.

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

CREATE OR REPLACE FUNCTION silver.refresh_fast()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = silver, bronze, public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW silver.sales_detail;
  REFRESH MATERIALIZED VIEW silver.sales;
  REFRESH MATERIALIZED VIEW silver.stock;
END;
$$;

CREATE OR REPLACE FUNCTION silver.refresh_slow()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = silver, bronze, public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW silver.products;
  REFRESH MATERIALIZED VIEW silver.clients;
  REFRESH MATERIALIZED VIEW silver.credit_notes;
  REFRESH MATERIALIZED VIEW silver.kardex;
END;
$$;

-- Bronze runs at :00, :10, :20, ...; Silver runs one minute later.
SELECT cron.schedule(
  'silver-fast-refresh',
  '1-59/10 * * * *',
  'SELECT silver.refresh_fast()'
);

-- Daily at 02:01 UTC. Change this if the daily Bronze ingestion uses another hour.
SELECT cron.schedule(
  'silver-slow-refresh',
  '1 2 * * *',
  'SELECT silver.refresh_slow()'
);
