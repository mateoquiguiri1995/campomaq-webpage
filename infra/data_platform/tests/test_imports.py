"""Smoke tests: all package modules must import without error."""


def test_import_common_config():
    import campomaq_etl.common.config  # noqa: F401


def test_import_common_db():
    import campomaq_etl.common.db  # noqa: F401


def test_import_common_logging():
    import campomaq_etl.common.logging  # noqa: F401


def test_import_common_run_tracking():
    import campomaq_etl.common.run_tracking  # noqa: F401


def test_import_bronze_schemas():
    import campomaq_etl.bronze.schemas  # noqa: F401


def test_import_bronze_readers():
    import campomaq_etl.bronze.readers  # noqa: F401


def test_import_gold_product_catalog():
    import campomaq_etl.gold.product_catalog  # noqa: F401


def test_import_gold_inventory_summary():
    import campomaq_etl.gold.inventory_summary  # noqa: F401


def test_import_gold_sales_summary():
    import campomaq_etl.gold.sales_summary  # noqa: F401
