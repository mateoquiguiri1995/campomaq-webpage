"""
Silver: stock

Sources: bronze.raw_stock (IVDIA_STOCK_POR_CANTIDAD)
         bronze.raw_kardex (IVDIA_STOCK_CORTE_FECHA)
Target: silver.stock

Intended transformations (TBD Week 2):
- Extract quantity fields from raw_data JSONB
- Cast quantities to INTEGER or NUMERIC
- Attach product code as foreign key to silver.products
- Handle warehouse/location field normalization
- Deduplicate by product + warehouse + date, keeping latest snapshot
"""
from __future__ import annotations
from typing import Optional


def refresh_silver_stock(start_date: Optional[str] = None, end_date: Optional[str] = None) -> None:
    """
    Refresh silver.stock from bronze.raw_stock and bronze.raw_kardex.

    This is the fast-refresh Silver job (runs every 10 min).
    Incremental mode (no dates): reads bronze rows extracted after last successful run.
    Historical mode (dates provided): reads bronze rows in the given date range.
    """
    raise NotImplementedError
