-- 1. Fix default value on the table
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer';

-- 2. Update existing users who are NOT likely admins
-- We assume real admins have 'admin' or 'jozistudenthub' in their email.
-- Everyone else should be 'customer'.
UPDATE public.profiles
SET role = 'customer'
WHERE role = 'admin'
  AND email NOT ILIKE '%jozistudenthub%'
  AND email NOT ILIKE '%admin%';

-- 3. Ensure the Trigger Function enforces 'customer' role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'),
    'customer' -- Force customer role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = COALESCE(profiles.role, 'customer'); -- Keep existing role if valid, else customer
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Verify Trigger exists (just to be safe, though this just replaces function)
-- We assume trigger 'on_auth_user_created' exists and calls this function.
-- If not, create it:
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
