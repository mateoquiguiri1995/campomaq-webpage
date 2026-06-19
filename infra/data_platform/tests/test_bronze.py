from campomaq_etl.bronze.schemas import (
    BRONZE_METADATA_COLUMNS,
    SOURCE_OBJECTS,
    SOURCE_SYSTEM,
    HASH_FIELDS,
)


def test_metadata_columns_count():
    assert len(BRONZE_METADATA_COLUMNS) == 5


def test_metadata_columns_required_names():
    required = {"ingestion_run_id", "source_system", "source_object", "extracted_at", "source_row_hash"}
    assert required == set(BRONZE_METADATA_COLUMNS)


def test_source_objects_count():
    assert len(SOURCE_OBJECTS) == 6


def test_source_objects_keys():
    expected = {"products", "kardex", "stock", "sales", "sales_detail", "credit_notes"}
    assert expected == set(SOURCE_OBJECTS.keys())


def test_source_system_constant():
    assert SOURCE_SYSTEM == "on_prem_sql_server"


def test_hash_fields_keys_match_source_objects():
    assert set(HASH_FIELDS.keys()) == set(SOURCE_OBJECTS.keys())
