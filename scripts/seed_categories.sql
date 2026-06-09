-- Jozi Student Hub - Seed Categories with Cool Images
-- Run this in Supabase SQL Editor

-- Upsert Categories (Update if slug exists, Insert if not)
INSERT INTO public.categories (name, slug, image_url)
VALUES 
    ('Study Gear', 'study-gear', '/categories-v2/study_gear.png'),
    ('Tech & Gadgets', 'tech-gadgets', '/categories-v2/tech_gadgets.png'),
    ('Room Decor', 'room-decor', '/categories-v2/room_decor.png'),
    ('Kitchen Essentials', 'kitchen-essentials', '/categories-v2/kitchen_essentials.png')
ON CONFLICT (slug) 
DO UPDATE SET 
    image_url = EXCLUDED.image_url;

-- Verify
SELECT * FROM public.categories WHERE slug IN ('study-gear', 'tech-gadgets', 'room-decor', 'kitchen-essentials');
