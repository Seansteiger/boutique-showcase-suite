-- 1. Fix Orders Table (Missing total_amount)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS total_amount NUMERIC NOT NULL DEFAULT 0;

-- 2. Fix Storage RLS (Images not loading)
-- Ensure the 'product-images' bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow Public Read Access
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow Authenticated Users to Upload (Admins)
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
CREATE POLICY "Auth Upload" ON storage.objects
  FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'product-images');

-- 3. Fix Variable Products Price (Optional DB side fix, but we can do it in code too)
-- We will handle the "smallest price" logic in the application code as requested.
