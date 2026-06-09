-- RUN THIS IN SUPABASE SQL EDITOR
-- Add missing INSERT policies for orders and order_items

-- =======================
-- FIX: Add INSERT policies for orders
-- =======================

-- Allow RPC functions to insert orders (for place_order function)
DROP POLICY IF EXISTS "Service Role Insert Orders" ON orders;
CREATE POLICY "Service Role Insert Orders" ON orders FOR INSERT 
  WITH CHECK (true);

-- Allow RPC functions to insert order items
DROP POLICY IF EXISTS "Service Role Insert Order Items" ON order_items;
CREATE POLICY "Service Role Insert Order Items" ON order_items FOR INSERT 
  WITH CHECK (true);

-- Verify
SELECT 'Order INSERT policies added!' as status;
