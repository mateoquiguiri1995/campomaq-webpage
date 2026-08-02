-- Current Silver layout used in Supabase.
-- Most Silver objects are normal views over Bronze and are always current.
-- silver.clients remains materialized because it ranks the full sales history.

-- ============================================================
-- Credit notes
-- ============================================================

CREATE OR REPLACE VIEW silver.credit_notes AS
SELECT DISTINCT ON (src.iefave_ser3)
  src.iencrv_femi::DATE AS credit_note_date,
  src.iencrv_ser3 AS credit_note_number,
  CAST(src.iefave_ser3 AS INTEGER) AS invoice_number,
  src.iencrv_civa AS credit_note_base15,
  src.iencrv_siva AS credit_note_base0,
  src.iencrv_tota AS credit_note_total
FROM bronze.raw_credit_notes AS src
ORDER BY src.iefave_ser3, src.iencrv_ser3 DESC;

-- ============================================================
-- Sales
-- ============================================================

CREATE OR REPLACE VIEW silver.sales AS
SELECT
  CAST(sales.iefave_ser3 AS INTEGER) AS invoice_number,
  sales.iefave_femi::DATE AS invoice_date,
  sales.nombre AS client_name,
  NULLIF(BTRIM(sales.feclie_codc), '') AS client_code,
  sales.iefave_civa AS iva15_value,
  sales.iefave_siva AS iva0_value,
  sales.iefave_viva AS iva_value,
  sales.iefave_tota AS invoice_total,
  sales.ret_iva AS iva_retention,
  sales.ret_fte AS rent_retention,
  sales.peauxi_nomb AS payment_type,
  credit_notes.credit_note_base15,
  credit_notes.credit_note_base0,
  credit_notes.credit_note_total
FROM bronze.raw_sales AS sales
LEFT JOIN silver.credit_notes AS credit_notes
  ON CAST(sales.iefave_ser3 AS INTEGER) = credit_notes.invoice_number;

-- ============================================================
-- Sales detail
-- ============================================================

CREATE OR REPLACE VIEW silver.sales_detail AS
SELECT
  iedefv_iden AS invoice_item_id,
  CAST(iefave_ser3 AS INTEGER) AS invoice_number,
  iefave_femi::DATE AS invoice_date,
  NULLIF(BTRIM(ieprod_codp), '') AS product_code,
  NULLIF(RTRIM(ieprod_desp), '') AS product_name,
  iedefv_cang AS quantity,
  CASE
    WHEN nc_valo IS NULL THEN
      iedefv_cang * iedefv_vuni - iedefv_dsct
    ELSE
      iedefv_cang * iedefv_vuni - iedefv_dsct - nc_valo
  END AS sale_without_iva,
  CASE
    WHEN nc_valo IS NULL THEN
      iedefv_cang * iedefv_vuni - iedefv_dsct + iedefv_viva
    ELSE
      iedefv_cang * iedefv_vuni - iedefv_dsct + iedefv_viva
        - nc_valo * iva_de
  END AS sale_with_iva,
  iedefv_viva AS iva_amount,
  iedefv_cang * ieprod_pcos AS total_cost,
  nc_valo AS credit_note_value,
  NULLIF(BTRIM(feclie_apec), '') AS client_name,
  NULLIF(BTRIM(feclie_codc), '') AS client_code,
  NULLIF(BTRIM(feclie_dirc), '') AS address,
  NULLIF(BTRIM(feempl_nome), '') AS salesperson_name,
  NULLIF(BTRIM(iemarc_nomb), '') AS brand_name,
  NULLIF(BTRIM(iecate_nomc), '') AS category_name
FROM bronze.raw_sales_detail;

-- ============================================================
-- Stock
-- ============================================================

CREATE OR REPLACE VIEW silver.stock AS
SELECT
  NULLIF(BTRIM(ieprod_codp), '') AS product_code,
  NULLIF(RTRIM(ieprod_desp), '') AS product_name,
  NULLIF(BTRIM(ieprov_empr), '') AS supplier_name,
  iestop_stok AS stock
FROM bronze.raw_stock
WHERE BTRIM(fesucu_noms) = 'Matriz';

-- ============================================================
-- Products
-- ============================================================

CREATE OR REPLACE VIEW silver.products AS
SELECT
  ieprod_iden AS product_id,
  NULLIF(BTRIM(ieprod_codp), '') AS product_code,
  iecate_codc AS category_id,
  NULLIF(BTRIM(iecate_nomc), '') AS category_name,
  NULLIF(RTRIM(ieprod_desp), '') AS product_name,
  iemarc_iden AS brand_id,
  NULLIF(BTRIM(iemarc_nomb), '') AS brand_name,
  NULLIF(BTRIM(ieprod_obse), '') AS shelf_location,
  ieprod_pcos AS last_cost,
  ieprod_cpro AS average_cost,
  ieprod_pvp1 AS price_cash,
  ieprod_pvpp AS price_credit,
  ieprod_pvp2 AS price_card,
  ieprod_pvp3 AS price_flowers,
  ieprod_tipo AS product_type,
  UPPER(BTRIM(ieprod_viva)) = 'SI' AS iva
FROM bronze.raw_products;

-- ============================================================
-- Kardex
-- ============================================================

CREATE OR REPLACE VIEW silver.kardex AS
SELECT
  ieprod_iden AS product_id,
  NULLIF(BTRIM(ieprod_codp), '') AS product_code,
  NULLIF(RTRIM(ieprod_desp), '') AS product_name,
  iefave_femi AS movement_date,
  iefave_iden AS invoice_id,
  iedefv_cant AS quantity,
  tipo AS transaction_type,
  tm AS movement_type
FROM bronze.raw_kardex;

-- ============================================================
-- Clients
--
-- Materialized because it ranks the complete sales-detail history to select
-- each client's most recent record.
-- ============================================================

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
    iefave_femi::DATE AS last_purchase_date,
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
  email,
  last_purchase_date
FROM ranked_clients
WHERE row_number = 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_silver_clients_code
  ON silver.clients (client_code);
