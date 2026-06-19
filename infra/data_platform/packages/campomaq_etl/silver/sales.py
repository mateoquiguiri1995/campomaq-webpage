"""
Silver: sales

Sources: bronze.raw_sales (VEN_CLIENTES_VENTAS)
         bronze.raw_sales_detail (VEN_VENTAS_CON_DETALLE)
         bronze.raw_credit_notes (VEN_NC_DETALLE)
Target: silver.sales, silver.sales_detail, silver.credit_notes

Intended transformations (TBD Week 2):
- Extract and type all fields from raw_data JSONB
- Cast amounts to NUMERIC, dates to DATE/TIMESTAMPTZ
- Normalize customer codes and document numbers
- Handle credit notes: link to original invoice via document number
- Deduplicate by invoice + line number, keeping latest version
"""
from __future__ import annotations
from typing import Optional


def refresh_silver_sales(start_date: Optional[str] = None, end_date: Optional[str] = None) -> None:
    """
    Refresh silver.sales, silver.sales_detail, silver.credit_notes.

    Incremental mode (no dates): reads bronze rows extracted after last successful run.
    Historical mode (dates provided): reads bronze rows in the given date range.
    """
    raise NotImplementedError
