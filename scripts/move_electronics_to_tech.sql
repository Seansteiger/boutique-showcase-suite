-- Dynamic migration of products from 'Electronics' to 'Tech'

DO $$
DECLARE
    electronics_id UUID;
    tech_id UUID;
BEGIN
    -- Get IDs
    SELECT id INTO electronics_id FROM categories WHERE slug = 'electronics';
    SELECT id INTO tech_id FROM categories WHERE slug = 'tech';

    -- If both exist, migrate products
    IF electronics_id IS NOT NULL AND tech_id IS NOT NULL THEN
        UPDATE products
        SET category_id = tech_id
        WHERE category_id = electronics_id;
        
        -- Delete the old category
        DELETE FROM categories WHERE id = electronics_id;
        
        RAISE NOTICE 'Migrated products from Electronics to Tech and deleted Electronics category.';
    ELSE
        RAISE NOTICE 'Skipping migration. Electronics ID: %, Tech ID: %', electronics_id, tech_id;
    END IF;
END $$;
