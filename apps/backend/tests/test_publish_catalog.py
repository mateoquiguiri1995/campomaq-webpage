from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

import pytest

import publish_catalog


def test_projection_preserves_zero_false_empty_media_and_legacy_fields():
    now = datetime.now(timezone.utc)
    operations, ids = publish_catalog.build_operations([
        {'product_id': 1155, 'price_cash': Decimal('2300.50'),
         'last_cost': Decimal('1800.00'), 'iva': True,
         'discount': Decimal('0'), 'main_boost': Decimal('0'),
         'show_in_app': False, 'description': 'Edited', 'link': []},
    ], now)
    update = operations[0]._doc
    assert ids == [1155]
    assert update['$set']['price_cash'] == 2300.5
    assert update['$set']['iva'] is True
    assert 'last_cost' not in update['$set']
    assert update['$set']['main_boost'] == 0
    assert update['$set']['link'] == []
    assert update['$set']['show_in_app'] is False
    assert 'embedding' not in update['$set']
    assert 'popularity' not in update['$set']
    assert update['$setOnInsert']['popularity'] == 1


@pytest.mark.parametrize('rows', [[], [{'product_id': 1}, {'product_id': 1}],
                                 [{'product_id': 1.5}],
                                 [{'product_id': 1, 'price_cash': float('nan')}],
                                 [{'product_id': 1, 'price_cash': Decimal('Infinity')} ]])
def test_invalid_source_cannot_publish(rows):
    with pytest.raises(ValueError):
        publish_catalog.build_operations(rows, datetime.now(timezone.utc))


def test_preview_never_writes_and_apply_clears_cache(monkeypatch):
    monkeypatch.setenv('API_DATABASE_URL', 'unused')
    monkeypatch.setenv('MONGO_URI', 'unused')
    monkeypatch.setattr(publish_catalog, 'load_dotenv', lambda *_: None)
    connection = MagicMock()
    cursor = connection.cursor.return_value.__enter__.return_value
    cursor.fetchone.return_value = {'acquired': True}
    cursor.fetchall.return_value = [{'product_id': 1155, 'show_in_app': True}]
    monkeypatch.setattr(publish_catalog.psycopg2, 'connect', lambda *a, **k: connection)
    mongo = MagicMock()
    collection = mongo.__enter__.return_value.__getitem__.return_value.__getitem__.return_value
    collection.aggregate.return_value = []
    collection.count_documents.return_value = 1
    collection.bulk_write.return_value.upserted_count = 0
    collection.bulk_write.return_value.modified_count = 1
    collection.update_many.return_value.modified_count = 0
    monkeypatch.setattr(publish_catalog, 'MongoClient', lambda *a, **k: mongo)
    invalidate = MagicMock()
    monkeypatch.setattr(publish_catalog, 'invalidate_catalog_cache', invalidate)
    publish_catalog.publish()
    collection.bulk_write.assert_not_called()
    collection.update_many.assert_not_called()
    invalidate.assert_not_called()
    publish_catalog.publish(apply=True)
    collection.bulk_write.assert_called_once()
    collection.update_many.assert_called_once()
    invalidate.assert_called_once()
    assert connection.close.call_count == 2


def test_failed_bulk_does_not_hide_other_products(monkeypatch):
    monkeypatch.setenv('API_DATABASE_URL', 'unused')
    monkeypatch.setenv('MONGO_URI', 'unused')
    monkeypatch.setattr(publish_catalog, 'load_dotenv', lambda *_: None)
    connection = MagicMock()
    cursor = connection.cursor.return_value.__enter__.return_value
    cursor.fetchone.return_value = {'acquired': True}
    cursor.fetchall.return_value = [{'product_id': 1155, 'show_in_app': True}]
    monkeypatch.setattr(publish_catalog.psycopg2, 'connect', lambda *a, **k: connection)
    mongo = MagicMock()
    collection = mongo.__enter__.return_value.__getitem__.return_value.__getitem__.return_value
    collection.aggregate.return_value = []
    collection.count_documents.return_value = 1
    collection.bulk_write.side_effect = RuntimeError('write failed')
    monkeypatch.setattr(publish_catalog, 'MongoClient', lambda *a, **k: mongo)
    with pytest.raises(RuntimeError, match='write failed'):
        publish_catalog.publish(apply=True)
    collection.update_many.assert_not_called()
    connection.close.assert_called_once()
