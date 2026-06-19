"""
Silver: prices

Source: bronze.raw_products (IVDIA_PRODUCTOS_LISTADO — same source as products)
Target: silver.prices

Intended transformations (TBD Week 2):
- Extract price fields from raw_data JSONB
- Cast prices to NUMERIC, discard zero/negative values
- Normalize currency (verify all prices are in USD or local currency)
- Attach product code as foreign key to silver.products
- Keep price history by ingestion_run_id (or snapshot by date)
"""
from __future__ import annotations
from typing import Optional


def refresh_silver_prices(start_date: Optional[str] = None, end_date: Optional[str] = None) -> None:
    """
    Refresh silver.prices from bronze.raw_products.

    Incremental mode (no dates): reads bronze rows extracted after last successful run.
    Historical mode (dates provided): reads bronze rows in the given date range.
    """
    raise NotImplementedError
