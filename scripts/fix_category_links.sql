-- Jozi Student Hub - Fix Product Category Links
-- This script migrates products from "Old" categories to the "New" V2 categories based on name matching.

-- 1. Game Night (Migrate from any 'Game%' category to 'game-night')
UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 'game-night' LIMIT 1)
WHERE category_id IN (
    SELECT id FROM public.categories 
    WHERE (name ILIKE '%Game%' OR slug ILIKE '%game%')
    AND slug != 'game-night'
);

-- 2. Room Decor (Migrate from 'Room%' to 'room-decor')
UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 'room-decor' LIMIT 1)
WHERE category_id IN (
    SELECT id FROM public.categories 
    WHERE (name ILIKE '%Room%' OR slug ILIKE '%room%')
    AND slug != 'room-decor'
);

-- 3. Kitchenware (Migrate from 'Kitchen%' to 'kitchenware')
UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 'kitchenware' LIMIT 1)
WHERE category_id IN (
    SELECT id FROM public.categories 
    WHERE (name ILIKE '%Kitchen%' OR slug ILIKE '%kitchen%')
    AND slug != 'kitchenware'
);

-- 4. Lifestyle (Migrate from 'Life%' to 'lifestyle')
UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 'lifestyle' LIMIT 1)
WHERE category_id IN (
    SELECT id FROM public.categories 
    WHERE (name ILIKE '%Life%' OR slug ILIKE '%life%')
    AND slug != 'lifestyle'
);

-- 5. Tech (Migrate from 'Tech%' or 'Gadget%' to 'tech')
UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 'tech' LIMIT 1)
WHERE category_id IN (
    SELECT id FROM public.categories 
    WHERE (name ILIKE '%Tech%' OR name ILIKE '%Gadget%' OR slug ILIKE '%tech%')
    AND slug != 'tech'
);

-- 6. Cleanup (Optional: Delete empty categories that are not the V2 ones)
-- We won't delete automatically to be safe, but you can if you want.
-- DELETE FROM public.categories WHERE id NOT IN (SELECT category_id FROM public.products) AND slug NOT IN ('game-night', 'room-decor', 'kitchenware', 'lifestyle', 'tech');

-- Verify
SELECT p.title, c.name, c.slug 
FROM public.products p 
JOIN public.categories c ON p.category_id = c.id
WHERE c.slug IN ('game-night', 'room-decor', 'kitchenware', 'lifestyle', 'tech');
