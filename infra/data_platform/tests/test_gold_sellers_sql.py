from pathlib import Path


SQL_ROOT = Path(__file__).resolve().parents[1] / "sql"


def test_silver_sales_exposes_salesperson_name():
    sql = (SQL_ROOT / "03_silver_tables.sql").read_text()

    assert "NULLIF(BTRIM(sales.emple_vfac), '') AS salesperson_name" in sql
    assert "sales.emple_cod AS salesperson_employee_code" in sql
    assert "sales.emple_vcod AS salesperson_invoice_code" in sql
    assert "NULLIF(BTRIM(feempl_nome), '') AS salesperson_name" in sql
    assert "NULLIF(BTRIM(feempl_cedu), '') AS salesperson_document_id" in sql


def test_gold_sellers_contains_dashboard_metrics():
    sql = (SQL_ROOT / "04_gold_tables.sql").read_text()

    assert "DROP MATERIALIZED VIEW IF EXISTS gold.sellers" in sql
    assert "CREATE MATERIALIZED VIEW gold.sellers" in sql
    assert "80000.00::NUMERIC(12, 2) AS monthly_goal" in sql
    assert "current_month_sales" in sql
    assert "year_total_sales" in sql
    assert "year_sales_count" in sql
    assert "year_average_ticket" in sql
    assert "sales_by_category" in sql
    assert "sales_by_brand" in sql
    assert "top_clients" in sql
    assert "top_products" in sql
    assert "WHERE client_rank <= 10" in sql
    assert "WHERE product_rank <= 10" in sql


def test_gold_sellers_contains_actual_identity_and_general_scope():
    sql = (SQL_ROOT / "04_gold_tables.sql").read_text()

    assert "AS feempl_nome" in sql
    assert "AS feempl_cedu" in sql
    assert "AS emple_cod" in sql
    assert "AS emple_vcod" in sql
    assert "'9999999999'::TEXT AS seller_id" in sql
    assert "'general'::TEXT AS seller_type" in sql
    assert "'GENERAL' AS seller_key" in sql
    assert "scoped_year_sales AS" in sql
    assert "scoped_year_sales_detail AS" in sql


def test_gold_sellers_uses_current_month_and_current_year_bounds():
    sql = (SQL_ROOT / "04_gold_tables.sql").read_text()

    assert "DATE_TRUNC('month', CURRENT_DATE)::DATE AS month_start" in sql
    assert "DATE_TRUNC('year', CURRENT_DATE)::DATE AS year_start" in sql
    assert "sales.invoice_date >= bounds.month_start" in sql
    assert "sales.invoice_date >= bounds.year_start" in sql
    assert "detail.invoice_date >= bounds.year_start" in sql


def test_gold_sellers_refresh_is_scheduled_hourly():
    sql = (SQL_ROOT / "06_supabase_cron.sql").read_text()

    assert "CREATE OR REPLACE FUNCTION gold.refresh_sellers()" in sql
    assert "REFRESH MATERIALIZED VIEW gold.sellers" in sql
    assert "gold-sellers-refresh" in sql
    assert "'4 * * * *'" in sql
