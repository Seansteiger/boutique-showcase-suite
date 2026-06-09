-- RUN THIS IN SUPABASE SQL EDITOR
-- This ensures comprehensive security policies for all tables

-- =======================
-- 1. PUBLIC READ POLICIES (Categories, Products, Ads)
-- =======================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Categories" ON categories;
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Public Read Variations" ON product_variations;
DROP POLICY IF EXISTS "Public Read Ads" ON ads;

CREATE POLICY "Public Read Categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Variations" ON product_variations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Ads" ON ads FOR SELECT TO anon, authenticated USING (true);

-- =======================
-- 2. ORDERS POLICIES
-- =======================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users Read Own Orders" ON orders;
DROP POLICY IF EXISTS "Admin Read All Orders" ON orders;
DROP POLICY IF EXISTS "Users Read Own Order Items" ON order_items;
DROP POLICY IF EXISTS "Admin Read All Order Items" ON order_items;

-- Users can only see their own orders
CREATE POLICY "Users Read Own Orders" ON orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Admins can see all orders
CREATE POLICY "Admin Read All Orders" ON orders FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Users can only see items from their own orders
CREATE POLICY "Users Read Own Order Items" ON order_items FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Admins can see all order items
CREATE POLICY "Admin Read All Order Items" ON order_items FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update order status
DROP POLICY IF EXISTS "Admin Update Orders" ON orders;
CREATE POLICY "Admin Update Orders" ON orders FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =======================
-- 3. COUPONS POLICIES
-- =======================

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Active Coupons" ON coupons;
DROP POLICY IF EXISTS "Admin Manage Coupons" ON coupons;

-- Users can only see active coupons
CREATE POLICY "Public Read Active Coupons" ON coupons FOR SELECT 
  TO authenticated 
  USING (is_active = true);

-- Admins have full access to coupons
CREATE POLICY "Admin Manage Coupons" ON coupons FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =======================
-- 4. ADMIN FULL ACCESS (Products, Categories, Ads)
-- =======================

DROP POLICY IF EXISTS "Admin Manage Products" ON products;
DROP POLICY IF EXISTS "Admin Manage Categories" ON categories;
DROP POLICY IF EXISTS "Admin Manage Ads" ON ads;
DROP POLICY IF EXISTS "Admin Manage Variations" ON product_variations;

CREATE POLICY "Admin Manage Products" ON products FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin Manage Categories" ON categories FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin Manage Ads" ON ads FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin Manage Variations" ON product_variations FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =======================
-- 5. PROFILES POLICIES
-- =======================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users Read Own Profile" ON profiles;
DROP POLICY IF EXISTS "Users Update Own Profile" ON profiles;
DROP POLICY IF EXISTS "Admin Read All Profiles" ON profiles;

CREATE POLICY "Users Read Own Profile" ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users Update Own Profile" ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admin Read All Profiles" ON profiles FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =======================
-- 6. VERIFY POLICIES
-- =======================

SELECT 'RLS Setup Complete!' as status;
SELECT count(*) as category_count FROM categories;
SELECT count(*) as product_count FROM products;
