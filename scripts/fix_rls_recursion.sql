-- Jozi Student Hub - Fix RLS Infinite Recursion
-- Run this in Supabase SQL Editor

-- 1. Create a Helper Function to check Admin Status (Security Definer Bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- 2. Update Policies to use is_admin()

-- Profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (is_admin());

-- Products
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (is_admin());

-- Categories
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (is_admin());

-- Product Variations
DROP POLICY IF EXISTS "Admins can manage variations" ON public.product_variations;
CREATE POLICY "Admins can manage variations" ON public.product_variations FOR ALL USING (is_admin());

-- Orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (is_admin());

-- Order Items
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (is_admin());

-- Coupons
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL USING (is_admin());

-- Ads
DROP POLICY IF EXISTS "Admins can manage ads" ON public.ads;
CREATE POLICY "Admins can manage ads" ON public.ads FOR ALL USING (is_admin());

-- Carts
DROP POLICY IF EXISTS "Admins view all carts" ON public.carts;
CREATE POLICY "Admins view all carts" ON public.carts FOR SELECT USING (is_admin());

-- Grant execute to auth users
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO anon;
