-- Idempotent Cart Setup Script
-- Tables
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id TEXT,
  items JSONB DEFAULT '[]'::JSONB,
  is_abandoned BOOLEAN DEFAULT FALSE,
  recovery_status TEXT DEFAULT 'none',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes (IF NOT EXISTS is not standard in valid postgres index creation for some versions, but standard in 9.5+)
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_abandoned ON public.carts(is_abandoned);
CREATE INDEX IF NOT EXISTS idx_carts_updated_at ON public.carts(updated_at);

-- RLS
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Policies (Drop first to avoid "already exists" error)
DROP POLICY IF EXISTS "Users can manage own carts" ON public.carts;

CREATE POLICY "Users can manage own carts" ON public.carts
  FOR ALL USING (auth.uid() = user_id OR (user_id IS NULL AND anonymous_id IS NOT NULL));

-- Fix for Products Sorting (If not applied via code, we can ensure indexes exists)
-- CREATE INDEX IF NOT EXISTS idx_products_title ON public.products(title);
-- CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);
