-- Gold tables — business-ready aggregates and joined views.

-- ============================================================
-- Clients
--
-- Silver exposes the client business key and tax-inclusive credit-note total
-- on sales, plus the historical last purchase on clients. Gold can therefore
-- limit its sales work to six months and its invoice-line work to three months.
-- ============================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS gold.clients AS
WITH six_month_sales AS (
  SELECT
    client_code,
    CAST(invoice_number AS BIGINT) AS invoice_number,
    invoice_date,
    payment_type,
    COALESCE(invoice_total, 0)
      - COALESCE(credit_note_total, 0) AS net_sales
  FROM silver.sales
  WHERE client_code IS NOT NULL
    AND invoice_date >= CURRENT_DATE - INTERVAL '6 months'
),
recent_invoice_items AS (
  SELECT
    CAST(invoice_number AS BIGINT) AS invoice_number,
    COUNT(invoice_item_id) AS item_count
  FROM silver.sales_detail
  WHERE invoice_number IS NOT NULL
    AND invoice_date >= CURRENT_DATE - INTERVAL '3 months'
  GROUP BY CAST(invoice_number AS BIGINT)
),
client_metrics AS (
  SELECT
    sales.client_code,
    COALESCE(SUM(sales.net_sales), 0) AS total_sales_last_6_months,
    COUNT(*) AS sales_count_last_6_months,
    COUNT(DISTINCT DATE_TRUNC('month', sales.invoice_date))
      AS purchase_months_last_6_months,
    COALESCE(
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'invoiceNumber', sales.invoice_number,
          'invoiceDate', sales.invoice_date,
          'paymentType', sales.payment_type,
          'itemCount', COALESCE(items.item_count, 0),
          'total', sales.net_sales
        )
        ORDER BY sales.invoice_date DESC, sales.invoice_number DESC
      ) FILTER (
        WHERE sales.invoice_date >= CURRENT_DATE - INTERVAL '3 months'
      ),
      '[]'::JSONB
    ) AS recent_invoices
  FROM six_month_sales AS sales
  LEFT JOIN recent_invoice_items AS items
    ON items.invoice_number = sales.invoice_number
  GROUP BY sales.client_code
)
SELECT
  clients.client_code,
  clients.client_name,
  clients.address,
  clients.telephone_1,
  clients.telephone_2,
  clients.email,
  COALESCE(metrics.total_sales_last_6_months, 0) AS total_sales_last_6_months,
  COALESCE(metrics.sales_count_last_6_months, 0) AS sales_count_last_6_months,
  COALESCE(metrics.purchase_months_last_6_months, 0)
    AS purchase_months_last_6_months,
  CASE
    WHEN COALESCE(metrics.purchase_months_last_6_months, 0) >= 6
      THEN 'Highly recurrent'
    WHEN COALESCE(metrics.purchase_months_last_6_months, 0) BETWEEN 4 AND 5
      THEN 'Recurrent'
    WHEN COALESCE(metrics.purchase_months_last_6_months, 0) BETWEEN 2 AND 3
      THEN 'Occasional'
    WHEN COALESCE(metrics.purchase_months_last_6_months, 0) = 1
      THEN 'One-time'
    ELSE 'Inactive'
  END AS frequency_classification,
  clients.last_purchase_date,
  CASE
    WHEN clients.last_purchase_date IS NULL THEN NULL
    ELSE CURRENT_DATE - clients.last_purchase_date
  END AS days_since_last_purchase,
  CASE
    WHEN clients.last_purchase_date IS NULL THEN 'Inactive'
    WHEN CURRENT_DATE - clients.last_purchase_date <= 45 THEN 'Active'
    WHEN CURRENT_DATE - clients.last_purchase_date <= 90 THEN 'At risk'
    ELSE 'Inactive'
  END AS recency_status,
  COALESCE(metrics.recent_invoices, '[]'::JSONB) AS recent_invoices
FROM silver.clients AS clients
LEFT JOIN client_metrics AS metrics
  ON metrics.client_code = clients.client_code;

CREATE UNIQUE INDEX IF NOT EXISTS idx_gold_clients_code
  ON gold.clients (client_code);
CREATE INDEX IF NOT EXISTS idx_gold_clients_name
  ON gold.clients (client_name);
