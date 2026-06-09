-- Jozi Student Hub - Comprehensive Security Audit & Fix Script
-- Run this in Supabase SQL Editor to enforce "State of the Art" Security

-- 1. Enable RLS on ALL Tables
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cart_items ENABLE ROW LEVEL SECURITY;

-- 2. Profiles (Users)
-- Users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 3. Products & Categories (Public Read, Admin Write)
-- Public Read
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view variations" ON public.product_variations;
CREATE POLICY "Public can view variations" ON public.product_variations FOR SELECT USING (true);

-- Admin Write (Insert, Update, Delete)
-- Helper function to check admin role (optional, but cleaner used inline above)
-- We will use the subquery method for robustness

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

DROP POLICY IF EXISTS "Admins can manage variations" ON public.product_variations;
CREATE POLICY "Admins can manage variations" ON public.product_variations FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 4. Orders (User Specific)
-- Users see their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Admins see all orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Service Role / Admin can insert orders (handled by backend usually, but for client-side inserts if any)
-- Assuming orders are created via RPC or Server Action with Service Role, this policy might strictly limit client-side creation
-- But if we use client-side supabase, we need INSERT policy for auth users
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Order Items
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 6. Coupons (Public Read, Admin Write)
DROP POLICY IF EXISTS "Public can view active coupons" ON public.coupons;
CREATE POLICY "Public can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Coupon Usage
DROP POLICY IF EXISTS "Users can view own usage" ON public.coupon_usages;
CREATE POLICY "Users can view own usage" ON public.coupon_usages FOR SELECT USING (auth.uid() = user_id);

-- 7. Ads (Public Read, Admin Write)
DROP POLICY IF EXISTS "Public can view ads" ON public.ads;
CREATE POLICY "Public can view ads" ON public.ads FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage ads" ON public.ads;
CREATE POLICY "Admins can manage ads" ON public.ads FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 8. Storage (Images)
-- Ensure buckets are private by default but policies allow public read
-- This is handled via Storage API but RLS policies on storage.objects are tricky via SQL script if not superuser
-- We already fixed this in the previous script.

-- 9. Carts (Abandoned Recovery)
CREATE TABLE IF NOT EXISTS public.carts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    status text NOT NULL DEFAULT 'open', -- open, abandoned, recovered
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT carts_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    cart_id uuid REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id),
    quantity integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT cart_items_pkey PRIMARY KEY (id)
);

DROP POLICY IF EXISTS "Users view own carts" ON public.carts;
CREATE POLICY "Users view own carts" ON public.carts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own carts" ON public.carts;
CREATE POLICY "Users manage own carts" ON public.carts FOR ALL USING (auth.uid() = user_id);

-- Admins view all carts
DROP POLICY IF EXISTS "Admins view all carts" ON public.carts;
CREATE POLICY "Admins view all carts" ON public.carts FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Cart Items
DROP POLICY IF EXISTS "Users view own cart items" ON public.cart_items;
CREATE POLICY "Users view own cart items" ON public.cart_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users manage own cart items" ON public.cart_items;
CREATE POLICY "Users manage own cart items" ON public.cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);

-- End of Audit Script
