-- Catalog enrichment maintained outside the accounting source system.

CREATE TABLE IF NOT EXISTS catalog.product_enrichment (
  product_id BIGINT PRIMARY KEY,
  display_name TEXT,
  short_description TEXT,
  description_html TEXT,
  new_product BOOLEAN NOT NULL DEFAULT FALSE,
  show_in_app BOOLEAN NOT NULL DEFAULT FALSE,
  is_spare_part BOOLEAN NOT NULL DEFAULT FALSE,
  discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  main_boost NUMERIC(10, 4) NOT NULL DEFAULT 1,
  brand_logo TEXT,
  attributes JSONB NOT NULL DEFAULT '{}'::JSONB,
  content_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (content_status IN ('draft', 'review', 'ready')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog.product_media (
  media_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id BIGINT NOT NULL,
  url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image',
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, url)
);
