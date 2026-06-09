-- Rename 'Electronics' category to 'Tech'
UPDATE categories
SET name = 'Tech', slug = 'tech'
WHERE slug = 'electronics';

-- Update products that were linked to 'electronics' (if any verify by slug)
UPDATE products
SET category_slug = 'tech'
WHERE category_slug = 'electronics';

-- Verify the change
SELECT * FROM categories WHERE slug = 'tech';
