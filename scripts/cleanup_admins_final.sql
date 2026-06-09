-- Jozi Student Hub - Admin Cleanup Script
-- This script ensures ONLY 'nsdsekatane@gmail.com' is an admin.
-- All other current admins will be demoted to 'customer'.

UPDATE public.profiles
SET role = 'customer'
FROM auth.users
WHERE public.profiles.id = auth.users.id
  AND public.profiles.role = 'admin'
  AND auth.users.email != 'nsdsekatane@gmail.com';

-- Verify the result
SELECT auth.users.email, public.profiles.role 
FROM public.profiles
JOIN auth.users ON public.profiles.id = auth.users.id
WHERE public.profiles.role = 'admin';
