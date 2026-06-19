"""
Silver: products

Source: bronze.raw_products (IVDIA_PRODUCTOS_LISTADO)
Target: silver.products

Intended transformations (TBD Week 2):
- Extract typed columns from raw_data JSONB
- Cast product code to TEXT, trim whitespace
- Normalize product name (strip leading/trailing spaces, upper-case)
- Handle NULLs in optional fields
- Deduplicate by product code, keeping latest extracted_at
"""
from __future__ import annotations
from typing import Optional


def refresh_silver_products(start_date: Optional[str] = None, end_date: Optional[str] = None) -> None:
    """
    Refresh silver.products from bronze.raw_products.

    Incremental mode (no dates): reads bronze rows extracted after last successful run.
    Historical mode (dates provided): reads bronze rows in the given date range.
    """
    raise NotImplementedError
