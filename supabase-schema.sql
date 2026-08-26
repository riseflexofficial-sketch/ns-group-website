-- NS Groups Database Schema (Idempotent)
-- Safe to run multiple times on existing databases
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  color TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock')),
  description TEXT DEFAULT '',
  image_urls TEXT[] DEFAULT '{}',
  is_visible BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SITE SETTINGS TABLE (single row)
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name TEXT DEFAULT 'NS Groups',
  tagline TEXT DEFAULT 'Banarasi Luxury in Every Thread',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  hours TEXT DEFAULT '9:00 AM – 6:00 PM',
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  upi TEXT DEFAULT '',
  map_location TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure single settings row exists
INSERT INTO site_settings (id) VALUES (uuid_generate_v4())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- HOMEPAGE CONTENT TABLE (single row)
-- ============================================
CREATE TABLE IF NOT EXISTS homepage_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_heading TEXT DEFAULT 'Banarasi Luxury<br />in Every Thread',
  hero_subtitle TEXT DEFAULT 'Handcrafted Banarasi, Pashmina and ethnic silk sarees, made with the same care as a mother smoothing pleats before a wedding.',
  hero_primary_btn_text TEXT DEFAULT 'Explore Collection',
  hero_primary_btn_link TEXT DEFAULT '#collections',
  hero_secondary_btn_text TEXT DEFAULT 'Get in Touch',
  hero_secondary_btn_link TEXT DEFAULT '#contact',
  about_heading TEXT DEFAULT 'More Than Fabric',
  about_paragraphs TEXT[] DEFAULT ARRAY[
    'A saree is never just fabric — it''s a mother''s hands smoothing the pleats before a wedding, a grandmother''s silk passed down like a blessing, a first festival, a quiet triumph, a thousand small moments held together by thread.',
    'NS Groups brings together India''s richest weaves — the gold of Banarasi silk, the warmth of Pashmina, the grace of everyday ethnic wear — so every saree we craft carries not just artistry, but heart.',
    '<strong>We don''t just make sarees. We weave stories worth keeping.</strong>'
  ],
  highlight_cards JSONB DEFAULT '[
    {"icon": "🧵", "title": "Handloom Authenticity", "text": "Every saree woven with traditional Banarasi and Pashmina techniques."},
    {"icon": "🚚", "title": "PAN India Delivery", "text": "Shipped safely to your doorstep, anywhere in India."},
    {"icon": "↺", "title": "7-Day Returns", "text": "Easy return or exchange within 7 days of delivery."}
  ]',
  gallery_images TEXT[] DEFAULT '{}',
  gallery_cta_text TEXT DEFAULT 'Follow on Instagram',
  gallery_cta_link TEXT DEFAULT 'https://instagram.com/nsgroupns',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure single homepage content row exists
INSERT INTO homepage_content (id) VALUES (uuid_generate_v4())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables (idempotent)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Helper: Drop policy if exists, then create
DO $$
BEGIN
  -- Categories policies
  DROP POLICY IF EXISTS "Public read categories" ON categories;
  CREATE POLICY "Public read categories" ON categories
    FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Admin full access categories" ON categories;
  CREATE POLICY "Admin full access categories" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

  -- Products policies
  DROP POLICY IF EXISTS "Public read visible products" ON products;
  CREATE POLICY "Public read visible products" ON products
    FOR SELECT USING (is_visible = true);

  DROP POLICY IF EXISTS "Admin full access products" ON products;
  CREATE POLICY "Admin full access products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

  -- Site settings policies
  DROP POLICY IF EXISTS "Public read site settings" ON site_settings;
  CREATE POLICY "Public read site settings" ON site_settings
    FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Admin full access site settings" ON site_settings;
  CREATE POLICY "Admin full access site settings" ON site_settings
    FOR ALL USING (auth.role() = 'authenticated');

  -- Homepage content policies
  DROP POLICY IF EXISTS "Public read homepage content" ON homepage_content;
  CREATE POLICY "Public read homepage content" ON homepage_content
    FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Admin full access homepage content" ON homepage_content;
  CREATE POLICY "Admin full access homepage content" ON homepage_content
    FOR ALL USING (auth.role() = 'authenticated');
END $$;

-- ============================================
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================
-- Create bucket if not exists (run in Storage section of Supabase Dashboard, or via SQL):
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (idempotent)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
  CREATE POLICY "Public read product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

  DROP POLICY IF EXISTS "Admin upload product images" ON storage.objects;
  CREATE POLICY "Admin upload product images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

  DROP POLICY IF EXISTS "Admin update product images" ON storage.objects;
  CREATE POLICY "Admin update product images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

  DROP POLICY IF EXISTS "Admin delete product images" ON storage.objects;
  CREATE POLICY "Admin delete product images" ON storage.objects
    FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
END $$;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_visible ON products(is_visible);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================
-- Function (idempotent with CREATE OR REPLACE)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers (drop if exists, then create)
DO $$
BEGIN
  -- Products trigger
  DROP TRIGGER IF EXISTS update_products_updated_at ON products;
  CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  -- Site settings trigger
  DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
  CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  -- Homepage content trigger
  DROP TRIGGER IF EXISTS update_homepage_content_updated_at ON homepage_content;
  CREATE TRIGGER update_homepage_content_updated_at
    BEFORE UPDATE ON homepage_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- ============================================
-- SEED DATA: CATEGORIES (idempotent)
-- ============================================
INSERT INTO categories (name, slug) VALUES
  ('Banarasi Silk', 'banarasi'),
  ('Pashmina Silk', 'pashmina'),
  ('Ethnic Silk', 'ethnic')
ON CONFLICT (slug) DO NOTHING;