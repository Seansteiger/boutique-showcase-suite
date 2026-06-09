-- 1. Reset EVERYONE to customer first
UPDATE public.profiles
SET role = 'customer';

-- 2. Promote ONLY the specific admin user
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'nsdsekatane@gmail.com';

-- 3. Verify the change (for outputlog if possible, or just for safety)
-- We rely on the UPDATEs above.

-- 4. Ensure RLS policies are actually using the role column correctly.
-- (Re-enforcing the is_admin check just in case it was modified)
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
