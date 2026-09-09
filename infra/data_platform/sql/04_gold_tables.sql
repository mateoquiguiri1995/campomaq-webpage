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

-- ============================================================
-- Sellers
--
-- One row per actual salesperson plus one General company row. The seller name
-- and document ID come from sales detail; emple_cod and emple_vcod come from
-- sales headers. Both sources are matched by their normalized actual-seller
-- name (sales.emple_vfac = sales_detail.feempl_nome).
--
-- Invoice-level values are used for sales totals, counts, average ticket, and
-- client rankings so invoices are not duplicated by their product lines.
-- Sales detail supplies category, brand, and product breakdowns. All metrics
-- are year-to-date except current_month_sales.
-- ============================================================

DROP MATERIALIZED VIEW IF EXISTS gold.sellers;

CREATE MATERIALIZED VIEW gold.sellers AS
WITH date_bounds AS (
  SELECT
    DATE_TRUNC('month', CURRENT_DATE)::DATE AS month_start,
    (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::DATE
      AS next_month_start,
    DATE_TRUNC('year', CURRENT_DATE)::DATE AS year_start,
    (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year')::DATE
      AS next_year_start,
    CURRENT_DATE + 1 AS tomorrow
),
year_sales AS (
  SELECT
    UPPER(BTRIM(sales.salesperson_name)) AS seller_key,
    sales.salesperson_name,
    sales.salesperson_employee_code,
    sales.salesperson_invoice_code,
    sales.invoice_number,
    sales.invoice_date,
    sales.client_code,
    sales.client_name,
    COALESCE(sales.invoice_total, 0)
      - COALESCE(sales.credit_note_total, 0) AS net_sales
  FROM silver.sales AS sales
  CROSS JOIN date_bounds AS bounds
  WHERE sales.salesperson_name IS NOT NULL
    AND sales.invoice_date >= bounds.year_start
    AND sales.invoice_date < bounds.next_year_start
    AND sales.invoice_date < bounds.tomorrow
),
year_sales_detail AS (
  SELECT
    UPPER(BTRIM(detail.salesperson_name)) AS seller_key,
    detail.salesperson_name,
    detail.salesperson_document_id,
    detail.product_code,
    detail.product_name,
    COALESCE(detail.brand_name, 'Uncategorized') AS brand_name,
    COALESCE(detail.category_name, 'Uncategorized') AS category_name,
    COALESCE(detail.quantity, 0) AS quantity,
    COALESCE(detail.sale_with_iva, 0) AS line_sales
  FROM silver.sales_detail AS detail
  CROSS JOIN date_bounds AS bounds
  WHERE detail.salesperson_name IS NOT NULL
    AND detail.invoice_date >= bounds.year_start
    AND detail.invoice_date < bounds.next_year_start
    AND detail.invoice_date < bounds.tomorrow
),
header_identities AS (
  SELECT
    seller_key,
    MAX(salesperson_name) AS salesperson_name,
    MAX(salesperson_employee_code) AS salesperson_employee_code,
    MAX(salesperson_invoice_code) AS salesperson_invoice_code
  FROM year_sales
  GROUP BY seller_key
),
detail_identities AS (
  SELECT
    seller_key,
    MAX(salesperson_name) AS salesperson_name,
    MAX(salesperson_document_id) AS salesperson_document_id
  FROM year_sales_detail
  GROUP BY seller_key
),
seller_identities AS (
  SELECT
    COALESCE(details.seller_key, headers.seller_key) AS seller_key,
    COALESCE(details.salesperson_name, headers.salesperson_name)
      AS salesperson_name,
    details.salesperson_document_id,
    headers.salesperson_employee_code,
    headers.salesperson_invoice_code
  FROM detail_identities AS details
  FULL OUTER JOIN header_identities AS headers
    ON headers.seller_key = details.seller_key
),
seller_scopes AS (
  SELECT
    seller_key,
    salesperson_document_id AS seller_id,
    'seller'::TEXT AS seller_type,
    salesperson_name,
    salesperson_document_id,
    salesperson_employee_code,
    salesperson_invoice_code
  FROM seller_identities

  UNION ALL

  SELECT
    'GENERAL'::TEXT AS seller_key,
    '9999999999'::TEXT AS seller_id,
    'general'::TEXT AS seller_type,
    'General'::TEXT AS salesperson_name,
    '9999999999'::TEXT AS salesperson_document_id,
    NULL::NUMERIC AS salesperson_employee_code,
    NULL::NUMERIC AS salesperson_invoice_code
),
scoped_year_sales AS (
  SELECT seller_key, invoice_date, client_code, client_name, net_sales
  FROM year_sales

  UNION ALL

  SELECT
    'GENERAL' AS seller_key,
    invoice_date,
    client_code,
    client_name,
    net_sales
  FROM year_sales
),
scoped_year_sales_detail AS (
  SELECT
    seller_key,
    product_code,
    product_name,
    brand_name,
    category_name,
    quantity,
    line_sales
  FROM year_sales_detail

  UNION ALL

  SELECT
    'GENERAL' AS seller_key,
    product_code,
    product_name,
    brand_name,
    category_name,
    quantity,
    line_sales
  FROM year_sales_detail
),
seller_totals AS (
  SELECT
    sales.seller_key,
    COALESCE(
      SUM(sales.net_sales) FILTER (
        WHERE sales.invoice_date >= bounds.month_start
          AND sales.invoice_date < bounds.next_month_start
      ),
      0
    ) AS current_month_sales,
    COALESCE(SUM(sales.net_sales), 0) AS year_total_sales,
    COUNT(*) AS year_sales_count,
    COALESCE(AVG(sales.net_sales), 0) AS year_average_ticket
  FROM scoped_year_sales AS sales
  CROSS JOIN date_bounds AS bounds
  GROUP BY sales.seller_key
),
category_totals AS (
  SELECT
    seller_key,
    category_name,
    SUM(line_sales) AS total_value
  FROM scoped_year_sales_detail
  GROUP BY seller_key, category_name
),
category_breakdowns AS (
  SELECT
    seller_key,
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'categoryName', category_name,
        'totalValue', total_value
      )
      ORDER BY total_value DESC, category_name
    ) AS sales_by_category
  FROM category_totals
  GROUP BY seller_key
),
brand_totals AS (
  SELECT
    seller_key,
    brand_name,
    SUM(line_sales) AS total_value
  FROM scoped_year_sales_detail
  GROUP BY seller_key, brand_name
),
brand_breakdowns AS (
  SELECT
    seller_key,
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'brandName', brand_name,
        'totalValue', total_value
      )
      ORDER BY total_value DESC, brand_name
    ) AS sales_by_brand
  FROM brand_totals
  GROUP BY seller_key
),
client_totals AS (
  SELECT
    seller_key,
    client_code,
    MAX(client_name) AS client_name,
    SUM(net_sales) AS total_value
  FROM scoped_year_sales
  WHERE client_code IS NOT NULL
  GROUP BY seller_key, client_code
),
ranked_clients AS (
  SELECT
    client_totals.*,
    ROW_NUMBER() OVER (
      PARTITION BY seller_key
      ORDER BY total_value DESC, client_name NULLS LAST, client_code NULLS LAST
    ) AS client_rank
  FROM client_totals
),
top_client_lists AS (
  SELECT
    seller_key,
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'clientCode', client_code,
        'clientName', client_name,
        'totalValue', total_value
      )
      ORDER BY client_rank
    ) AS top_clients
  FROM ranked_clients
  WHERE client_rank <= 10
  GROUP BY seller_key
),
product_totals AS (
  SELECT
    seller_key,
    product_code,
    MAX(product_name) AS product_name,
    SUM(quantity) AS quantity,
    SUM(line_sales) AS total_value
  FROM scoped_year_sales_detail
  WHERE product_code IS NOT NULL
  GROUP BY seller_key, product_code
),
ranked_products AS (
  SELECT
    product_totals.*,
    ROW_NUMBER() OVER (
      PARTITION BY seller_key
      ORDER BY total_value DESC, product_name NULLS LAST, product_code NULLS LAST
    ) AS product_rank
  FROM product_totals
),
top_product_lists AS (
  SELECT
    seller_key,
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'productCode', product_code,
        'productName', product_name,
        'quantity', quantity,
        'totalValue', total_value
      )
      ORDER BY product_rank
    ) AS top_products
  FROM ranked_products
  WHERE product_rank <= 10
  GROUP BY seller_key
)
SELECT
  sellers.seller_id,
  sellers.seller_type,
  sellers.seller_key,
  sellers.salesperson_name AS feempl_nome,
  sellers.salesperson_document_id AS feempl_cedu,
  sellers.salesperson_employee_code AS emple_cod,
  sellers.salesperson_invoice_code AS emple_vcod,
  80000.00::NUMERIC(12, 2) AS monthly_goal,
  COALESCE(totals.current_month_sales, 0) AS current_month_sales,
  COALESCE(totals.year_total_sales, 0) AS year_total_sales,
  COALESCE(totals.year_sales_count, 0) AS year_sales_count,
  COALESCE(totals.year_average_ticket, 0) AS year_average_ticket,
  COALESCE(categories.sales_by_category, '[]'::JSONB) AS sales_by_category,
  COALESCE(brands.sales_by_brand, '[]'::JSONB) AS sales_by_brand,
  COALESCE(clients.top_clients, '[]'::JSONB) AS top_clients,
  COALESCE(products.top_products, '[]'::JSONB) AS top_products
FROM seller_scopes AS sellers
LEFT JOIN seller_totals AS totals
  ON totals.seller_key = sellers.seller_key
LEFT JOIN category_breakdowns AS categories
  ON categories.seller_key = sellers.seller_key
LEFT JOIN brand_breakdowns AS brands
  ON brands.seller_key = sellers.seller_key
LEFT JOIN top_client_lists AS clients
  ON clients.seller_key = sellers.seller_key
LEFT JOIN top_product_lists AS products
  ON products.seller_key = sellers.seller_key;

CREATE UNIQUE INDEX idx_gold_sellers_key
  ON gold.sellers (seller_key);
CREATE INDEX idx_gold_sellers_id
  ON gold.sellers (seller_id);
CREATE INDEX IF NOT EXISTS idx_gold_sellers_year_sales
  ON gold.sellers (year_total_sales DESC);
