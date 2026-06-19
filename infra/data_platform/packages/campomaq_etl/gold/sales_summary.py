"""
Gold: sales summary

Sources: silver.sales, silver.sales_detail, silver.credit_notes
Target: gold.sales_summary

Intended logic (TBD Week 3):
- Sales aggregated by product, customer, and period (day/week/month)
- Net revenue after credit notes
- Used by dashboard and salesman performance views
"""
from __future__ import annotations
from typing import Optional


def refresh_gold_sales_summary(start_date: Optional[str] = None, end_date: Optional[str] = None) -> None:
    raise NotImplementedError
