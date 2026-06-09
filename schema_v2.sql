-- Enable Extensions (if needed)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Product Variations (Unlimited variables)
CREATE TABLE IF NOT EXISTS product_variations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  attributes JSONB NOT NULL, -- e.g. {"Size": "L", "Color": "Blue"}
  price NUMERIC(10, 2), -- Optional override
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, attributes) -- Prevent duplicate combos
);

-- 2. Coupons
CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(10, 2) DEFAULT 0,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  usage_limit_total INTEGER, -- NULL = unlimited
  usage_limit_per_user INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 3. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Link to Auth User
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Coupon Usage Tracking (to enforce limit per user)
CREATE TABLE IF NOT EXISTS coupon_usages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coupon_code TEXT REFERENCES coupons(code),
  user_id UUID REFERENCES auth.users(id),
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coupon_code, user_id, order_id)
);

-- RLS Policies
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public Read / Admin Write for Variations
CREATE POLICY "Public Read Variations" ON product_variations FOR SELECT USING (true);
-- (Admin write assumed via service role or admin check logic later)

-- Coupons: Public read (to check validity), Admin write
CREATE POLICY "Public Read Coupons" ON coupons FOR SELECT USING (true);

-- Reviews: Public Read, User Write (Own)
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "User Write Reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
