# On-Prem Bronze Ingestion — Cron Setup

The bronze ingestion script runs on the Windows machine that has access to the SQL Server.

## Prerequisites

1. Python 3.11 installed
2. ODBC Driver 17 for SQL Server installed
3. Dependencies installed: `pip install -r requirements.txt`
4. `.env` file in `infra/data_platform/` with `SQLSERVER_URI`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`

## Historical Backfill (run once manually)

Run this once from the on-prem machine to load all historical data:

```
cd infra\data_platform
python scripts\bronze_ingestion\run.py --start-date 2023-01-01 --end-date 2026-05-13
```

## Incremental Automation — Windows Task Scheduler

Create two scheduled tasks:

### Task 1: Fast tables (stock + kardex) — every 10 min

- **Name**: `campomaq_bronze_fast`
- **Trigger**: Daily, repeat every 10 minutes indefinitely
- **Action**: `python C:\path\to\campomaq-webpage\infra\data_platform\scripts\bronze_ingestion\run.py`
- **Start in**: `C:\path\to\campomaq-webpage\infra\data_platform`

### Task 2: Slow tables (products, sales, credit notes) — every 30 min

- **Name**: `campomaq_bronze_slow`
- **Trigger**: Daily, repeat every 30 minutes indefinitely
- **Action**: same `run.py` with `--tables products,sales,credit_notes` flag (implement in Week 2)
- **Start in**: same as above

### Task Scheduler via PowerShell

```powershell
$action = New-ScheduledTaskAction -Execute "python" `
  -Argument "C:\path\to\infra\data_platform\scripts\bronze_ingestion\run.py" `
  -WorkingDirectory "C:\path\to\infra\data_platform"

$trigger = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Minutes 10) -Once -At (Get-Date)

Register-ScheduledTask -TaskName "campomaq_bronze_fast" -Action $action -Trigger $trigger -RunLevel Highest
```

## Notes

- The script loads `.env` from the working directory via `python-dotenv`
- Logs go to stdout — redirect to a file for persistence: `>> logs\bronze.log 2>&1`
- If a run fails, the next scheduled run will retry automatically
