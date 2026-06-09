-- RUN THIS IN SUPABASE SQL EDITOR
-- ROBUST FIX for Category RLS and Admin Permissions

-- 1. Create a helper function to check if the current user is an admin
-- This avoids repeating subqueries in multiple policies and is more performant.
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (role = 'admin') 
    FROM profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Reset Categories RLS
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
DROP POLICY IF EXISTS "Admin Manage Categories" ON categories;

-- 3. Re-enable and Create Clean Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow everyone (including guests) to see categories
CREATE POLICY "Public Read Categories" ON categories
  FOR SELECT 
  TO public
  USING (true);

-- Allow admins full control over categories
-- We use FOR ALL to cover INSERT, UPDATE, and DELETE
CREATE POLICY "Admin Manage Categories" ON categories
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 4. Verification Check
SELECT 'Admin functions and category policies updated!' as status;
