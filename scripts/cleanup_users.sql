-- ⚠️ CRITICAL: This script deletes ALL non-admin users.
-- Run this in the Supabase SQL Editor.

-- 1. Delete Users from Auth (Cascades to Profiles usually)
-- We keep only users who have 'admin' role in their profile.
DELETE FROM auth.users
WHERE id NOT IN (
    SELECT id 
    FROM public.profiles 
    WHERE role = 'admin'
);

-- 2. Cleanup Orphaned Data (Safety Net in case Cascade fails)
-- Delete orders belonging to deleted users
DELETE FROM public.orders 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Delete orphaned profiles (if any remained)
DELETE FROM public.profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- 3. Verify Result
SELECT * FROM public.profiles;
