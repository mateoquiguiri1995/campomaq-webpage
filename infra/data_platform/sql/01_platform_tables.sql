-- ETL run tracking table. Records every bronze/silver/gold job execution.
CREATE TABLE IF NOT EXISTS platform.etl_runs (
  run_id        TEXT        NOT NULL,
  job_name      TEXT        NOT NULL,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at   TIMESTAMPTZ,
  status        TEXT        NOT NULL CHECK (status IN ('running', 'success', 'failed')),
  rows_read     INTEGER,
  rows_written  INTEGER,
  data_start_at TIMESTAMPTZ,
  data_end_at   TIMESTAMPTZ,
  error_message TEXT,
  PRIMARY KEY (run_id, job_name)
);

ALTER TABLE platform.etl_runs
  ADD COLUMN IF NOT EXISTS data_start_at TIMESTAMPTZ;

ALTER TABLE platform.etl_runs
  ADD COLUMN IF NOT EXISTS data_end_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_etl_runs_job_status
  ON platform.etl_runs (job_name, status, finished_at DESC);

CREATE INDEX IF NOT EXISTS idx_etl_runs_job_status_data_end
  ON platform.etl_runs (job_name, status, data_end_at DESC);
