-- 1. Grant Admin Role (Corrected to look up ID from auth.users)
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'nsdsekatane@gmail.com'
);

-- 2. Ensure is_admin() function exists and is secure
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

-- 3. Reset Product Policies to allow Admin FULL Access
DROP POLICY IF EXISTS "Admin Manage Products" ON products;
DROP POLICY IF EXISTS "Public Read Products" ON products;

CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin Manage Products" ON products FOR ALL USING (is_admin());

-- 4. Reset Variation Policies
DROP POLICY IF EXISTS "Admin Manage Variations" ON product_variations;
DROP POLICY IF EXISTS "Public Read Variations" ON product_variations;

CREATE POLICY "Public Read Variations" ON product_variations FOR SELECT USING (true);
CREATE POLICY "Admin Manage Variations" ON product_variations FOR ALL USING (is_admin());

-- 5. Storage Policies (Critical for Image Uploads)
DROP POLICY IF EXISTS "Admin Manage Products Bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Products Bucket" ON storage.objects;

CREATE POLICY "Public Read Products Bucket" ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Admin Manage Products Bucket" ON storage.objects FOR ALL
USING (bucket_id = 'products' AND is_admin())
WITH CHECK (bucket_id = 'products' AND is_admin());
