-- 1. Rename 'Electronics' to 'Tech'
-- First, ensure 'Tech' doesn't exist to avoid conflict. If it exists and is empty, delete it.
DELETE FROM categories WHERE name = 'Tech' AND NOT EXISTS (SELECT 1 FROM products WHERE category_id = categories.id);

-- Rename Electronics
UPDATE categories 
SET name = 'Tech', slug = 'tech' 
WHERE name = 'Electronics';

-- 2. Consolidate Study Categories
-- Get Target ID
DO $$
DECLARE
    study_id uuid;
    desk_id uuid;
    essentials_id uuid;
BEGIN
    SELECT id INTO study_id FROM categories WHERE name = 'Study';
    SELECT id INTO desk_id FROM categories WHERE name = 'Desk Essentials';
    SELECT id INTO essentials_id FROM categories WHERE name = 'Study Essentials';

    -- Move Products
    IF study_id IS NOT NULL THEN
        IF desk_id IS NOT NULL THEN
            UPDATE products SET category_id = study_id WHERE category_id = desk_id;
            DELETE FROM categories WHERE id = desk_id;
        END IF;

        IF essentials_id IS NOT NULL THEN
            UPDATE products SET category_id = study_id WHERE category_id = essentials_id;
            DELETE FROM categories WHERE id = essentials_id;
        END IF;
    END IF;
END $$;

-- 3. Delete Empty Duplicates
DELETE FROM categories 
WHERE name IN ('Tech & Gadgets', 'Tech Accessories', 'Kitchen Essentials', 'Gamenight', 'Self-care', 'Study Gear')
AND NOT EXISTS (SELECT 1 FROM products WHERE category_id = categories.id);
