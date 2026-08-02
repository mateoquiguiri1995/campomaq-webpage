-- Supabase Cron orchestration. Cron schedules use UTC.

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- Retire the previous all-materialized Silver orchestration if it still
-- exists. Current Silver objects are normal views except silver.clients.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'silver-fast-refresh') THEN
    PERFORM cron.unschedule('silver-fast-refresh');
  END IF;

  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'silver-slow-refresh') THEN
    PERFORM cron.unschedule('silver-slow-refresh');
  END IF;
END;
$$;

DROP FUNCTION IF EXISTS silver.refresh_fast();
DROP FUNCTION IF EXISTS silver.refresh_slow();

CREATE OR REPLACE FUNCTION silver.refresh_clients()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW silver.clients;
END;
$$;

CREATE OR REPLACE FUNCTION gold.refresh_clients()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gold, silver, public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW gold.clients;
END;
$$;

SELECT cron.schedule(
  'silver-clients-daily',
  '1 2 * * *',
  'SELECT silver.refresh_clients()'
);

SELECT cron.schedule(
  'gold-clients-refresh',
  '3 * * * *',
  'SELECT gold.refresh_clients()'
);
