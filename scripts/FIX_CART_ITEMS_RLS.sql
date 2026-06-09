-- Fix: Enable RLS on cart_items table
-- Policies already exist ("Users manage own cart items", "Users view own cart items")
-- but RLS was never enabled on the table itself.
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
