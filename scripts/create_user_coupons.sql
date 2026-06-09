-- Create user_coupons table
CREATE TABLE IF NOT EXISTS public.user_coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    coupon_code TEXT REFERENCES public.coupons(code) ON DELETE CASCADE NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_read BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, coupon_code)
);

-- Enable RLS
ALTER TABLE public.user_coupons ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own coupons" 
    ON public.user_coupons FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert user coupons" 
    ON public.user_coupons FOR INSERT 
    WITH CHECK (
       EXISTS (
           SELECT 1 FROM public.profiles 
           WHERE id = auth.uid() AND role = 'admin'
       )
    );

-- Add helper function to get available coupons for a user
-- (Filters out ones they've already used up to their limit)
CREATE OR REPLACE FUNCTION public.get_user_available_coupons(p_user_id UUID)
RETURNS TABLE (
    code TEXT,
    discount_type TEXT,
    discount_value NUMERIC,
    min_order_amount NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.code, 
        c.discount_type, 
        c.discount_value, 
        c.min_order_amount
    FROM public.user_coupons uc
    JOIN public.coupons c ON uc.coupon_code = c.code
    WHERE uc.user_id = p_user_id
    AND c.is_active = TRUE
    AND (c.expires_at IS NULL OR c.expires_at > now())
    AND (
        -- Check if user usage limit reached
        c.usage_limit_per_user IS NULL 
        OR 
        (SELECT COUNT(*) FROM public.coupon_usages cu WHERE cu.coupon_code = c.code AND cu.user_id = p_user_id) < c.usage_limit_per_user
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
