-- Create analytics table
CREATE TABLE IF NOT EXISTS public.product_metrics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    views INTEGER DEFAULT 0,
    cart_adds INTEGER DEFAULT 0,
    sales INTEGER DEFAULT 0,
    last_updated timestamp with time zone DEFAULT now(),
    CONSTRAINT unique_product_metrics UNIQUE (product_id)
);

-- RLS Policies
ALTER TABLE public.product_metrics ENABLE ROW LEVEL SECURITY;

-- Public can VIEW? No, actually public doesn't need to view these raw stats.
-- Public needs to INCREASE them (via API).
-- Admin needs to VIEW them.

-- 1. Admin Full Access
CREATE POLICY "Admin Full Access Metrics" ON public.product_metrics
    FOR ALL
    USING (public.is_admin());

-- 2. Public / Anon Function Access
-- We will handle increments via a SECURITY DEFINER function or restricted API endpoint
-- so we don't need to expose extensive update policies to the public directly if we use RPC.
-- BUT if we use standard supabase client update:
-- CREATE POLICY "Public Increment Metrics" ... hard to secure "only increment".

-- BETTER APPROACH: RPC function to increment.
CREATE OR REPLACE FUNCTION public.track_product_view(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.product_metrics (product_id, views)
    VALUES (p_id, 1)
    ON CONFLICT (product_id)
    DO UPDATE SET 
        views = product_metrics.views + 1,
        last_updated = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.track_cart_add(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.product_metrics (product_id, cart_adds)
    VALUES (p_id, 1)
    ON CONFLICT (product_id)
    DO UPDATE SET 
        cart_adds = product_metrics.cart_adds + 1,
        last_updated = now();
END;
$$;
