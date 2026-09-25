from pathlib import Path


SQL_ROOT = Path(__file__).resolve().parents[1] / "sql"


def test_gold_clients_contains_required_metrics():
    sql = (SQL_ROOT / "04_gold_tables.sql").read_text()

    assert "CREATE MATERIALIZED VIEW IF NOT EXISTS gold.clients" in sql
    assert "total_sales_last_6_months" in sql
    assert "sales_count_last_6_months" in sql
    assert "purchase_months_last_6_months" in sql
    assert "frequency_classification" in sql
    assert "days_since_last_purchase" in sql
    assert "recency_status" in sql
    assert "recent_invoices" in sql
    assert "'invoiceDate', sales.invoice_date" in sql
    assert "'total', sales.net_sales" in sql
    assert "COALESCE(credit_note_total, 0) AS net_sales" in sql
    assert "FROM bronze." not in sql


def test_silver_exposes_client_code_and_credit_note_total():
    sql = (SQL_ROOT / "03_silver_tables.sql").read_text()

    assert "NULLIF(BTRIM(feclie_codc), '') AS client_code" in sql
    assert "NULLIF(BTRIM(sales.feclie_codc), '') AS client_code" in sql
    assert "src.iencrv_tota AS credit_note_total" in sql
    assert "iefave_femi::DATE AS last_purchase_date" in sql
    assert "CREATE OR REPLACE VIEW silver.sales" in sql
    assert "CREATE OR REPLACE VIEW silver.sales_detail" in sql
    assert "CREATE OR REPLACE VIEW silver.stock" in sql


def test_gold_filters_before_aggregating():
    sql = (SQL_ROOT / "04_gold_tables.sql").read_text()

    six_month_sales = sql.index("WITH six_month_sales AS")
    six_month_filter = sql.index("INTERVAL '6 months'", six_month_sales)
    client_metrics = sql.index("client_metrics AS")
    assert six_month_sales < six_month_filter < client_metrics

    recent_items = sql.index("recent_invoice_items AS")
    three_month_filter = sql.index("INTERVAL '3 months'", recent_items)
    assert recent_items < three_month_filter < client_metrics


def test_gold_clients_refresh_is_scheduled_after_silver():
    sql = (SQL_ROOT / "06_supabase_cron.sql").read_text()

    assert "CREATE OR REPLACE FUNCTION gold.refresh_clients()" in sql
    assert "REFRESH MATERIALIZED VIEW gold.clients" in sql
    assert "gold-clients-refresh" in sql
    assert "'3 * * * *'" in sql
    assert "silver-clients-daily" in sql
    assert "'1 2 * * *'" in sql
    assert "silver-fast-refresh" in sql
    assert "silver-slow-refresh" in sql


def test_catalog_tables_match_supabase_layout():
    schemas = (SQL_ROOT / "00_schemas.sql").read_text()
    catalog = (SQL_ROOT / "05_catalog_tables.sql").read_text()

    assert "CREATE SCHEMA IF NOT EXISTS catalog" in schemas
    assert "CREATE TABLE IF NOT EXISTS catalog.product_enrichment" in catalog
    assert "CREATE TABLE IF NOT EXISTS catalog.product_media" in catalog
