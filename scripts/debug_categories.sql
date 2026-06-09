-- Check existing categories and their slugs
SELECT id, name, slug FROM public.categories WHERE name ILIKE '%Game%';

-- Check products and their category links
-- joining products to categories
SELECT 
  p.title, 
  p.slug, 
  c.name as category_name, 
  c.slug as category_slug 
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE c.name ILIKE '%Game%' OR p.alias ILIKE '%Game%';
