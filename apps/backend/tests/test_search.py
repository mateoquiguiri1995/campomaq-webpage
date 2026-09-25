import search


def test_text_pipeline_prioritizes_literal_name_matches_alphabetically():
    pipeline = search.build_text_pipeline("420", limit=15)

    wildcard = pipeline[0]["$search"]["compound"]["should"][0]["wildcard"]
    assert wildcard == {
        "query": "*420*",
        "path": "product_name",
        "allowAnalyzedField": True,
        "score": {"boost": {"value": 5}},
    }
    assert pipeline[-3]["$sort"] == {
        "name_match_rank": 1,
        "product_name": 1,
        "product_id": 1,
    }
    assert pipeline[-2] == {"$limit": 15}
    assert pipeline[-1] == {"$project": {"name_match_rank": 0}}


def test_text_pipeline_uses_a_valid_inclusion_projection():
    pipeline = search.build_text_pipeline("china")
    projection = pipeline[2]["$project"]

    excluded_fields = {
        field
        for field, value in projection.items()
        if value == 0 and field != "_id"
    }
    assert excluded_fields == set()
    assert projection["brand_logo"] == 1
    assert projection["description"] == 1


def test_atlas_contains_query_escapes_wildcard_characters():
    assert search._atlas_contains_query(r"40*?") == r"*40\*\?*"


def test_search_uses_spanish_case_insensitive_collation(client, monkeypatch):
    aggregate_calls = []

    class Collection:
        def aggregate(self, pipeline, **kwargs):
            aggregate_calls.append((pipeline, kwargs))
            return []

    monkeypatch.setattr(search, "get_cached_search", lambda _query, _limit: None)
    monkeypatch.setattr(search, "set_cached_search", lambda *_args: None)
    monkeypatch.setattr(search, "get_collection", lambda: Collection())

    response = client.get("/search?q=china")

    assert response.status_code == 200
    assert aggregate_calls[0][1]["collation"] == {"locale": "es", "strength": 1}


def test_web_pipeline_requires_an_image_and_sorts_by_commercial_score():
    pipeline = search.build_web_text_pipeline("tractor", limit=12)

    assert pipeline[1] == {
        "$match": {
            "show_in_app": True,
            "link": {"$exists": True, "$ne": None},
            "$expr": {
                "$cond": [
                    {"$isArray": "$link"},
                    {"$gt": [{"$size": "$link"}, 0]},
                    {"$ne": ["$link", ""]},
                ]
            },
        }
    }
    assert pipeline[-2] == {
        "$sort": {"final_score": -1, "product_name": 1}
    }
    assert pipeline[-1] == {"$limit": 12}


def test_web_search_uses_its_own_cache_and_pipeline(client, monkeypatch):
    products = [{"product_id": 7, "product_name": "Tractor"}]

    monkeypatch.setattr(
        search,
        "get_cached_web_search",
        lambda query, limit: products if (query, limit) == ("tractor", 20) else None,
    )

    response = client.get("/search/web?q=tractor")

    assert response.status_code == 200
    assert response.get_json() == products


def test_web_products_pipeline_requires_an_image():
    pipeline = search.build_products_pipeline(require_image=True)

    assert pipeline[0] == {
        "$match": {
            "show_in_app": True,
            "link": {"$exists": True, "$ne": None},
            "$expr": {
                "$cond": [
                    {"$isArray": "$link"},
                    {"$gt": [{"$size": "$link"}, 0]},
                    {"$ne": ["$link", ""]},
                ]
            },
        }
    }


def test_web_products_uses_its_own_cache(client, monkeypatch):
    products = [{"product_id": 8, "product_name": "Motocultor", "link": ["x"]}]
    monkeypatch.setattr(search, "get_cached_web_products", lambda: products)

    response = client.get("/products/web")

    assert response.status_code == 200
    assert response.get_json() == products
