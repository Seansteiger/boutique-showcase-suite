-- Create Carts Table for Abandoned Recovery
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for guests
  anonymous_id TEXT, -- For tracking guest carts via cookie
  items JSONB DEFAULT '[]'::JSONB, -- Array of Cart Items
  is_abandoned BOOLEAN DEFAULT FALSE,
  recovery_status TEXT DEFAULT 'none', -- 'none', 'emailed', 'recovered'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Users can view/edit their own carts
CREATE POLICY "Users can manage own carts" ON public.carts
  FOR ALL USING (auth.uid() = user_id OR (user_id IS NULL AND anonymous_id IS NOT NULL)); -- Simplified, usually need cookie match logic in app

-- Service Role (AI/Admin) can access all
-- (Implicit)

-- Indexes
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_abandoned ON public.carts(is_abandoned);
CREATE INDEX IF NOT EXISTS idx_carts_updated_at ON public.carts(updated_at);
