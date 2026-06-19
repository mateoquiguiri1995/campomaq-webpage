"""
Gold: product catalog

Sources: silver.products, silver.prices, silver.stock
Target: gold.product_catalog

Intended logic (TBD Week 3):
- Join product master + current price + current stock quantity
- Filter to active/sellable products only
- This table replaces MongoDB cm_catalog as the source for the Flask API
"""
from __future__ import annotations
from typing import Optional


def refresh_gold_product_catalog(start_date: Optional[str] = None, end_date: Optional[str] = None) -> None:
    raise NotImplementedError
