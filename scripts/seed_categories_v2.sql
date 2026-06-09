-- Jozi Student Hub - Updated Categories (Gamenight, Lifestyle, etc.)
-- Run this in Supabase SQL Editor

-- 1. Game Night
INSERT INTO public.categories (name, slug, image_url)
VALUES ('Game Night', 'game-night', '/categories-v2/gamenight.png')
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 2. Room Decor
INSERT INTO public.categories (name, slug, image_url)
VALUES ('Room Decor', 'room-decor', '/categories-v2/room_decor.png')
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 3. Kitchenware (Assuming existing is 'kitchen-essentials', let's rename or create new alias)
-- If we want to rename 'Kitchen Essentials' to 'Kitchenware' we should update name.
-- Let's try to update existing if exists, or insert new.
INSERT INTO public.categories (name, slug, image_url)
VALUES ('Kitchenware', 'kitchenware', '/categories-v2/kitchen_essentials.png')
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url, name = 'Kitchenware';

-- 4. Lifestyle
INSERT INTO public.categories (name, slug, image_url)
VALUES ('Lifestyle', 'lifestyle', '/categories-v2/lifestyle.png')
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 5. Tech (Mapped to Tech & Gadgets image)
INSERT INTO public.categories (name, slug, image_url)
VALUES ('Tech', 'tech', '/categories-v2/tech_gadgets.png')
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url, name = 'Tech';

-- Verify
SELECT * FROM public.categories WHERE slug IN ('game-night', 'room-decor', 'kitchenware', 'lifestyle', 'tech');
