-- RUN THIS IN SUPABASE SQL EDITOR
-- Fix for "new row violates row-level security policy for table 'categories'"

-- 1. Drop the existing management policy
DROP POLICY IF EXISTS "Admin Manage Categories" ON categories;

-- 2. Create a robust policy that explicitly allows INSERT, UPDATE, and DELETE for admins
-- Using WITH CHECK ensures that the role check is performed against the current user session
-- on every modification attempt.
CREATE POLICY "Admin Manage Categories" ON categories 
  FOR ALL 
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- 3. Verification: Ensure RLS is enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 4. Informational Query
SELECT 'Policies refined for categories table! You should now be able to add subcategories.' as status;
