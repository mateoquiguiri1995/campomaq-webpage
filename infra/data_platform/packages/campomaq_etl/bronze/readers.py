"""
SQL Server read functions for each Bronze source.
Returns normalized DataFrames: lowercase column names, strings stripped.
"""
from __future__ import annotations
from typing import Optional
import pandas as pd
from campomaq_etl.bronze.schemas import SOURCE_COLUMNS


def _normalize(df: pd.DataFrame, entity_key: str, rename_map: dict = None) -> pd.DataFrame:
    """Lowercase columns, strip char padding, rename special columns, reorder to DDL order."""
    df = df.copy()
    df.columns = df.columns.str.lower()
    if rename_map:
        df.rename(columns=rename_map, inplace=True)
    for col in df.select_dtypes(include="object").columns:
        df[col] = df[col].str.strip().replace("", None)
    # Keep only expected columns in DDL order
    expected = SOURCE_COLUMNS[entity_key]
    return df[expected]


def _date_filter(start_date: Optional[str], end_date: Optional[str], col: str) -> str:
    parts = []
    if start_date:
        parts.append(f"{col} >= '{start_date}'")
    if end_date:
        parts.append(f"{col} < '{end_date}'")
    return (" WHERE " + " AND ".join(parts)) if parts else ""


def read_products(engine) -> pd.DataFrame:
    df = pd.read_sql("SELECT * FROM dbo.IVDIA_PRODUCTOS_LISTADO", engine)
    return _normalize(df, "products")


def read_kardex(engine, start_date: Optional[str] = None, end_date: Optional[str] = None) -> pd.DataFrame:
    sql = "SELECT * FROM dbo.IVDIA_STOCK_CORTE_FECHA" + _date_filter(start_date, end_date, "IEFAVE_FEMI")
    df = pd.read_sql(sql, engine)
    return _normalize(df, "kardex")


def read_stock(engine) -> pd.DataFrame:
    df = pd.read_sql("SELECT * FROM dbo.IVDIA_STOCK_POR_CANTIDAD", engine)
    return _normalize(df, "stock")


def read_sales(engine, start_date: Optional[str] = None, end_date: Optional[str] = None) -> pd.DataFrame:
    sql = "SELECT * FROM dbo.VEN_CLIENTES_VENTAS" + _date_filter(start_date, end_date, "iefave_femi")
    df = pd.read_sql(sql, engine)
    return _normalize(df, "sales")


def read_sales_detail(engine, start_date: Optional[str] = None, end_date: Optional[str] = None) -> pd.DataFrame:
    sql = "SELECT * FROM dbo.VEN_VENTAS_CON_DETALLE" + _date_filter(start_date, end_date, "iefave_femi")
    df = pd.read_sql(sql, engine)
    # Rename ñ column to ascii-safe name
    return _normalize(df, "sales_detail", rename_map={"ieserp_añof": "ieserp_anof"})


def read_credit_notes(engine, start_date: Optional[str] = None, end_date: Optional[str] = None) -> pd.DataFrame:
    sql = "SELECT * FROM dbo.VEN_NC_DETALLE" + _date_filter(start_date, end_date, "IENCRV_FEMI")
    df = pd.read_sql(sql, engine)
    return _normalize(df, "credit_notes")
