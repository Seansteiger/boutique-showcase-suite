-- RUN THIS IN SUPABASE SQL EDITOR
-- CRITICAL FIX: Removes infinite recursion in policies

-- =======================
-- 1. DROP ALL EXISTING POLICIES
-- =======================

-- Drop profiles policies (causing recursion)
DROP POLICY IF EXISTS "Users Read Own Profile" ON profiles;
DROP POLICY IF EXISTS "Users Update Own Profile" ON profiles;
DROP POLICY IF EXISTS "Admin Read All Profiles" ON profiles;

-- Drop all other policies to rebuild correctly
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
DROP POLICY IF EXISTS "Admin Manage Categories" ON categories;
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Admin Manage Products" ON products;
DROP POLICY IF EXISTS "Public Read Variations" ON product_variations;
DROP POLICY IF EXISTS "Admin Manage Variations" ON product_variations;
DROP POLICY IF EXISTS "Public Read Ads" ON ads;
DROP POLICY IF EXISTS "Admin Manage Ads" ON ads;
DROP POLICY IF EXISTS "Users Read Own Orders" ON orders;
DROP POLICY IF EXISTS "Admin Read All Orders" ON orders;
DROP POLICY IF EXISTS "Admin Update Orders" ON orders;
DROP POLICY IF EXISTS "Users Read Own Order Items" ON order_items;
DROP POLICY IF EXISTS "Admin Read All Order Items" ON order_items;
DROP POLICY IF EXISTS "Public Read Active Coupons" ON coupons;
DROP POLICY IF EXISTS "Admin Manage Coupons" ON coupons;

-- =======================
-- 2. PROFILES POLICIES (NO RECURSION)
-- =======================

-- Simple policies: users can only access their own profile
-- No admin check here to avoid recursion
CREATE POLICY "Users Read Own Profile" ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users Update Own Profile" ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- =======================
-- 3. PUBLIC READ POLICIES (Categories, Products, Ads)
-- =======================

CREATE POLICY "Public Read Categories" ON categories FOR SELECT 
  TO anon, authenticated USING (true);

CREATE POLICY "Public Read Products" ON products FOR SELECT 
  TO anon, authenticated USING (true);

CREATE POLICY "Public Read Variations" ON product_variations FOR SELECT 
  TO anon, authenticated USING (true);

CREATE POLICY "Public Read Ads" ON ads FOR SELECT 
  TO anon, authenticated USING (true);

-- =======================
-- 4. ADMIN WRITE POLICIES (Using direct role check)
-- =======================

-- For admin policies, we check the role column directly
-- This avoids recursion since we're checking the current user's own profile row

CREATE POLICY "Admin Manage Categories" ON categories FOR ALL 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admin Manage Products" ON products FOR ALL 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admin Manage Variations" ON product_variations FOR ALL 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admin Manage Ads" ON ads FOR ALL 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- =======================
-- 5. ORDERS POLICIES
-- =======================

-- Users can only see their own orders
CREATE POLICY "Users Read Own Orders" ON orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Admins can see all orders (direct role check)
CREATE POLICY "Admin Read All Orders" ON orders FOR SELECT 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admins can update order status
CREATE POLICY "Admin Update Orders" ON orders FOR UPDATE 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Users can only see items from their own orders
CREATE POLICY "Users Read Own Order Items" ON order_items FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Admins can see all order items
CREATE POLICY "Admin Read All Order Items" ON order_items FOR SELECT 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- =======================
-- 6. COUPONS POLICIES
-- =======================

-- Users can only see active coupons
CREATE POLICY "Public Read Active Coupons" ON coupons FOR SELECT 
  TO authenticated 
  USING (is_active = true);

-- Admins have full access to coupons
CREATE POLICY "Admin Manage Coupons" ON coupons FOR ALL 
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- =======================
-- 7. VERIFY SETUP
-- =======================

SELECT 'RLS Policies Fixed - No More Recursion!' as status;
SELECT count(*) as category_count FROM categories;
SELECT count(*) as product_count FROM products;
