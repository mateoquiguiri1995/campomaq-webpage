-- Public catalog projection. A normal view reflects PIM/ERP commits immediately.
-- Publication is controlled by show_in_app; content_status is editorial only.
CREATE OR REPLACE VIEW gold.catalog_products AS
SELECT
  p.product_id::BIGINT AS product_id,
  p.product_code,
  COALESCE(NULLIF(BTRIM(e.display_name), ''), p.product_name) AS product_name,
  p.category_name,
  p.brand_name,
  p.price_cash,
  p.price_card,
  p.price_credit,
  e.short_description,
  e.description_html AS description,
  COALESCE(e.new_product, FALSE) AS new_product,
  COALESCE(e.show_in_app, FALSE) AS show_in_app,
  COALESCE(e.is_spare_part, FALSE) AS is_spare_part,
  COALESCE(e.discount, 0) AS discount,
  COALESCE(e.main_boost, 1) AS main_boost,
  e.brand_logo,
  COALESCE(e.attributes, '{}'::JSONB) AS attributes,
  COALESCE(e.content_status, 'draft') AS content_status,
  e.created_at,
  e.updated_at,
  COALESCE(media.links, '[]'::JSONB) AS link
FROM silver.products p
LEFT JOIN catalog.product_enrichment e ON e.product_id = p.product_id
LEFT JOIN LATERAL (
  SELECT JSONB_AGG(m.url ORDER BY m.is_primary DESC, m.sort_order, m.media_id) AS links
  FROM catalog.product_media m
  WHERE m.product_id = p.product_id AND m.media_type = 'image'
) media ON TRUE;
