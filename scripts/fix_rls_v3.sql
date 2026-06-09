-- 1. Create is_admin() helper (Security Definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- 2. Cleanup Old Policies (Drop implementation specifics to avoid conflicts)
DROP POLICY IF EXISTS "Admin Delete Products" ON products;
DROP POLICY IF EXISTS "Admin Insert Products" ON products;
DROP POLICY IF EXISTS "Admin Update Products" ON products;
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;

DROP POLICY IF EXISTS "Admin Delete Categories" ON categories;
DROP POLICY IF EXISTS "Admin Insert Categories" ON categories;
DROP POLICY IF EXISTS "Admin Update Categories" ON categories;
DROP POLICY IF EXISTS "Public Read Categories" ON categories;

DROP POLICY IF EXISTS "Public Read Variations" ON product_variations;
DROP POLICY IF EXISTS "Admin Insert Variations" ON product_variations;
DROP POLICY IF EXISTS "Admin Update Variations" ON product_variations;
DROP POLICY IF EXISTS "Admin Delete Variations" ON product_variations;

-- 3. Unified Policies for Catalog (Products, Categories, Variations)
-- Products
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin Manage Products" ON products FOR ALL USING (is_admin());

-- Categories
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin Manage Categories" ON categories FOR ALL USING (is_admin());

-- Variations
CREATE POLICY "Public Read Variations" ON product_variations FOR SELECT USING (true);
CREATE POLICY "Admin Manage Variations" ON product_variations FOR ALL USING (is_admin());

-- 4. Storage Policies (Products Bucket)
-- Note: Storage policies are on storage.objects
DROP POLICY IF EXISTS "Public Access Products" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Products" ON storage.objects;
DROP POLICY IF EXISTS "Owner Mod Products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Insert products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete products" ON storage.objects;
DROP POLICY IF EXISTS "Public Select products" ON storage.objects;

CREATE POLICY "Public Read Products Bucket" ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Admin Manage Products Bucket" ON storage.objects FOR ALL
USING (bucket_id = 'products' AND is_admin())
WITH CHECK (bucket_id = 'products' AND is_admin());

-- 5. Orders & Profiles
-- Profiles: Users see own, Admin sees all
DROP POLICY IF EXISTS "Public Read Profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users Read Own Profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin Read All Profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Users Update Own Profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin Update All Profiles" ON profiles FOR UPDATE USING (is_admin());
CREATE POLICY "Public Read Basic Profiles" ON profiles FOR SELECT USING (true); -- Optional: IF we want public profiles (e.g. reviews). Let's keep it restricted for now? 
-- Wait, reviews need author name. So Public Read is likely needed.
-- Let's re-add "Public Read Profiles" but maybe restrict columns? No, Supabase RLS row-level only.
-- We'll allow Public Read for now to support UI needs (Avatars etc).
DROP POLICY "Users Read Own Profile" ON profiles; -- Redundant if we do Public Read
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);

-- Orders
DROP POLICY IF EXISTS "Admin Read Orders" ON orders;
DROP POLICY IF EXISTS "User View Own Orders" ON orders;
DROP POLICY IF EXISTS "User Create Orders" ON orders;

CREATE POLICY "User Manage Own Orders" ON orders FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin Manage All Orders" ON orders FOR ALL
USING (is_admin());

-- 6. Ads & Coupons
DROP POLICY IF EXISTS "Public Read Ads" ON ads;
CREATE POLICY "Public Read Ads" ON ads FOR SELECT USING (true);
CREATE POLICY "Admin Manage Ads" ON ads FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Public Read Coupons" ON coupons;
CREATE POLICY "Public Read Coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Admin Manage Coupons" ON coupons FOR ALL USING (is_admin());
