-- Silver materialized views translated from the on-prem CM_* views.
-- These objects are refreshed by 05_silver_cron.sql.

CREATE MATERIALIZED VIEW IF NOT EXISTS silver.sales_detail AS
SELECT
  iedefv_iden AS invoice_item_id,
  iefave_ser3 AS invoice_number,
  iefave_femi::DATE AS invoice_date,
  ieprod_codp AS product_code,
  RTRIM(ieprod_desp) AS product_name,
  iedefv_cang AS quantity,
  CASE
    WHEN nc_valo IS NULL THEN iedefv_cang * iedefv_vuni - iedefv_dsct
    ELSE iedefv_cang * iedefv_vuni - iedefv_dsct - nc_valo
  END AS sale_without_iva,
  CASE
    WHEN nc_valo IS NULL THEN iedefv_cang * iedefv_vuni - iedefv_dsct + iedefv_viva
    ELSE iedefv_cang * iedefv_vuni - iedefv_dsct + iedefv_viva - nc_valo * iva_de
  END AS sale_with_iva,
  iedefv_viva AS iva_amount,
  iedefv_cang * ieprod_pcos AS total_cost,
  nc_valo AS credit_note_value,
  feclie_apec AS client_name,
  feclie_dirc AS city,
  feempl_nome AS salesperson_name,
  iemarc_nomb AS brand_name,
  iecate_nomc AS category_name
FROM bronze.raw_sales_detail;

CREATE UNIQUE INDEX IF NOT EXISTS idx_silver_sales_detail_id
  ON silver.sales_detail (invoice_item_id);
CREATE INDEX IF NOT EXISTS idx_silver_sales_detail_date
  ON silver.sales_detail (invoice_date DESC);

CREATE MATERIALIZED VIEW IF NOT EXISTS silver.sales AS
WITH credit_notes AS (
  SELECT
    src.*,
    ROW_NUMBER() OVER (
      PARTITION BY src.iefave_ser3
      ORDER BY src.iencrv_ser3 DESC
    ) AS row_number
  FROM bronze.raw_credit_notes AS src
)
SELECT
  sales.iefave_ser3 AS invoice_number,
  sales.iefave_femi::DATE AS invoice_date,
  sales.nombre AS client_name,
  sales.iefave_civa AS iva15_value,
  sales.iefave_siva AS iva0_value,
  sales.iefave_viva AS iva_value,
  sales.iefave_tota AS invoice_total,
  sales.ret_iva AS iva_retention,
  sales.ret_fte AS rent_retention,
  sales.peauxi_nomb AS payment_type,
  credit_notes.nsub15 AS credit_note_base15,
  credit_notes.iencrv_siva AS credit_note_base0
FROM bronze.raw_sales AS sales
LEFT JOIN credit_notes
  ON sales.iefave_ser3 = credit_notes.iefave_ser3
 AND credit_notes.row_number = 1;

CREATE INDEX IF NOT EXISTS idx_silver_sales_invoice
  ON silver.sales (invoice_number);
CREATE INDEX IF NOT EXISTS idx_silver_sales_date
  ON silver.sales (invoice_date DESC);

CREATE MATERIALIZED VIEW IF NOT EXISTS silver.stock AS
SELECT
  ieprod_codp AS product_code,
  RTRIM(ieprod_desp) AS product_name,
  ieprov_empr AS supplier_name,
  iestop_stok AS stock
FROM bronze.raw_stock
WHERE BTRIM(fesucu_noms) = 'Matriz';

CREATE UNIQUE INDEX IF NOT EXISTS idx_silver_stock_product
  ON silver.stock (product_code);

CREATE MATERIALIZED VIEW IF NOT EXISTS silver.products AS
SELECT
  ieprod_iden AS product_id,
  ieprod_codp AS product_code,
  iecate_codc AS category_id,
  iecate_nomc AS category_name,
  RTRIM(ieprod_desp) AS product_name,
  iemarc_iden AS brand_id,
  iemarc_nomb AS brand_name,
  ieprod_obse AS shelf_location,
  ieprod_pcos AS last_cost,
  ieprod_cpro AS average_cost,
  ieprod_pvp1 AS price_cash,
  ieprod_pvpp AS price_credit,
  ieprod_pvp2 AS price_card,
  ieprod_pvp3 AS price_flowers,
  ieprod_tipo AS product_type,
  (UPPER(BTRIM(ieprod_viva)) = 'SI') AS iva
FROM bronze.raw_products;

CREATE UNIQUE INDEX IF NOT EXISTS idx_silver_products_id
  ON silver.products (product_id);
CREATE INDEX IF NOT EXISTS idx_silver_products_code
  ON silver.products (product_code);

-- Temporary client dimension inferred from sales detail until a dedicated client
-- source is added to the on-prem Bronze ingestion.
DROP MATERIALIZED VIEW IF EXISTS silver.clients;

CREATE MATERIALIZED VIEW IF NOT EXISTS silver.clients AS
WITH ranked_clients AS (
  SELECT
    NULLIF(BTRIM(feclie_codc), '') AS client_code,
    NULLIF(
      CONCAT_WS(
        ' ',
        NULLIF(BTRIM(feclie_apec), ''),
        NULLIF(BTRIM(feclie_nomc), '')
      ),
      ''
    ) AS client_name,
    NULLIF(BTRIM(feclie_dirc), '') AS address,
    NULLIF(BTRIM(feclie_telc), '') AS telephone_1,
    NULLIF(BTRIM(feclie_tcec), '') AS telephone_2,
    NULLIF(LOWER(BTRIM(feclie_maic)), '') AS email,
    ROW_NUMBER() OVER (
      PARTITION BY NULLIF(BTRIM(feclie_codc), '')
      ORDER BY iefave_femi DESC NULLS LAST, extracted_at DESC
    ) AS row_number
  FROM bronze.raw_sales_detail
  WHERE NULLIF(BTRIM(feclie_codc), '') IS NOT NULL
)
SELECT
  client_code,
  client_name,
  address,
  telephone_1,
  telephone_2,
  email
FROM ranked_clients
WHERE row_number = 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_silver_clients_code
  ON silver.clients (client_code);

CREATE MATERIALIZED VIEW IF NOT EXISTS silver.credit_notes AS
WITH credit_notes AS (
  SELECT
    src.*,
    ROW_NUMBER() OVER (
      PARTITION BY src.iefave_ser3
      ORDER BY src.iencrv_ser3 DESC
    ) AS row_number
  FROM bronze.raw_credit_notes AS src
)
SELECT
  iencrv_femi AS credit_note_date,
  iencrv_ser3 AS credit_note_number,
  iefave_ser3 AS invoice_number,
  nsub15 AS credit_note_base15,
  iencrv_siva AS credit_note_base0
FROM credit_notes
WHERE row_number = 1;

CREATE INDEX IF NOT EXISTS idx_silver_credit_notes_invoice
  ON silver.credit_notes (invoice_number);

CREATE MATERIALIZED VIEW IF NOT EXISTS silver.kardex AS
SELECT
  ieprod_iden AS product_id,
  ieprod_codp AS product_code,
  RTRIM(ieprod_desp) AS product_name,
  iefave_femi AS movement_date,
  iefave_iden AS invoice_id,
  iedefv_cant AS quantity,
  tipo AS transaction_type,
  tm AS movement_type
FROM bronze.raw_kardex;

CREATE INDEX IF NOT EXISTS idx_silver_kardex_product
  ON silver.kardex (product_id);
CREATE INDEX IF NOT EXISTS idx_silver_kardex_date
  ON silver.kardex (movement_date DESC);
