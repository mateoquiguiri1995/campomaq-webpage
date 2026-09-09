# Source Tables

Status: PK candidates and field lists are **TBD — complete in Week 2** after direct SQL Server inspection.

---

## bronze.raw_products

- **Source view/table**: `EMPRESA.dbo.IVDIA_PRODUCTOS_LISTADO`
- **Primary key candidate**: TBD
- **Update frequency**: every 30 min
- **Known issues**: TBD
- **Fields needed**: TBD
- **Notes**: Product master data and current price fields remain together in `silver.products`.

---

## bronze.raw_kardex

- **Source view/table**: `EMPRESA.dbo.IVDIA_STOCK_CORTE_FECHA`
- **Primary key candidate**: TBD (likely product code + date/cut field)
- **Update frequency**: every 10 min
- **Known issues**: TBD
- **Fields needed**: TBD
- **Notes**: Kardex/stock-by-date snapshot. Time-sensitive — drives fast Silver refresh.

---

## bronze.raw_stock

- **Source view/table**: `EMPRESA.dbo.IVDIA_STOCK_POR_CANTIDAD`
- **Primary key candidate**: TBD (likely product code + warehouse)
- **Update frequency**: every 10 min
- **Known issues**: TBD
- **Fields needed**: TBD
- **Notes**: Current stock quantities by location. Time-sensitive — drives fast Silver refresh.

---

## bronze.raw_sales

- **Source view/table**: `EMPRESA.dbo.VEN_CLIENTES_VENTAS`
- **Primary key candidate**: TBD (likely invoice/document number)
- **Update frequency**: every 30 min
- **Known issues**: `feempl_nome` is not the actual invoice seller in this
  source, despite having the same name as the seller field in sales detail.
- **Fields needed**: `emple_vfac` (actual seller name), `emple_cod`, and
  `emple_vcod` (the two actual-seller code systems).
- **Notes**: Invoice-level sales per customer. Header-level (no product detail).
  `emple_reg` and `emple_vfac` currently contain equivalent seller-name values;
  Silver uses `emple_vfac`.

---

## bronze.raw_sales_detail

- **Source view/table**: `EMPRESA.dbo.VEN_VENTAS_CON_DETALLE`
- **Primary key candidate**: TBD (likely invoice number + line item)
- **Update frequency**: every 30 min
- **Known issues**: Seller fields differ semantically from identically named
  fields in the header source.
- **Fields needed**: `feempl_nome` (actual seller name) and `feempl_cedu`
  (seller cédula/authentication mapping key).
- **Notes**: Sales with product-level detail. Joins to raw_sales via invoice
  number. Gold reconciles seller identity with the header using the normalized
  actual-seller name (`feempl_nome` = header `emple_vfac`).

---

## bronze.raw_credit_notes

- **Source view/table**: `EMPRESA.dbo.VEN_NC_DETALLE`
- **Primary key candidate**: TBD (likely credit note number + line item)
- **Update frequency**: every 30 min
- **Known issues**: TBD
- **Fields needed**: TBD
- **Notes**: Credit note detail. Must be reconciled against raw_sales for net revenue calculations in Gold.

---

## Week 2 Action Items

For each table above, connect to SQL Server and run:

```sql
-- Column names and types
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = '<view_name>'
ORDER BY ORDINAL_POSITION;

-- Row count and date range
SELECT COUNT(*), MIN(<date_col>), MAX(<date_col>) FROM EMPRESA.dbo.<view_name>;

-- Sample rows
SELECT TOP 5 * FROM EMPRESA.dbo.<view_name>;
```

Fill in: PK candidate, update/date columns, row count, approximate date range, any NULL patterns or known data quality issues.
