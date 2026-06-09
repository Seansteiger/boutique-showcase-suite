-- Migration: Add Brand field and Subcategories support

-- 1. Add brand column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT;

-- 2. Add parent_id to categories for hierarchy
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- 3. Update the transactional RPC function to handle brand
CREATE OR REPLACE FUNCTION upsert_product_with_variations(
    p_product jsonb,
    p_variations jsonb[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_product_id uuid;
    v_result jsonb;
    v_variation jsonb;
BEGIN
    -- 1. Upsert Product
    INSERT INTO products (
        id, 
        title, 
        slug, 
        description, 
        price, 
        sale_price, 
        stock_quantity, 
        category_id, 
        brand,
        image_urls, 
        features,
        status,
        updated_at
    )
    VALUES (
        COALESCE((p_product->>'id')::uuid, gen_random_uuid()),
        p_product->>'title',
        p_product->>'slug',
        p_product->>'description',
        (p_product->>'price')::numeric,
        (p_product->>'sale_price')::numeric,
        (p_product->>'stock_quantity')::integer,
        (p_product->>'category_id')::uuid,
        p_product->>'brand',
        (SELECT array_agg(x) FROM jsonb_array_elements_text(p_product->'image_urls') t(x)),
        (SELECT array_agg(x) FROM jsonb_array_elements_text(p_product->'features') t(x)),
        COALESCE(p_product->>'status', 'published'),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        slug = EXCLUDED.slug,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        sale_price = EXCLUDED.sale_price,
        stock_quantity = EXCLUDED.stock_quantity,
        category_id = EXCLUDED.category_id,
        brand = EXCLUDED.brand,
        image_urls = EXCLUDED.image_urls,
        features = EXCLUDED.features,
        status = EXCLUDED.status,
        updated_at = now()
    RETURNING id INTO v_product_id;

    -- 2. Handle Variations
    DELETE FROM product_variations WHERE product_id = v_product_id;

    IF p_variations IS NOT NULL THEN
        FOR v_variation IN SELECT * FROM unnest(p_variations)
        LOOP
            INSERT INTO product_variations (
                product_id,
                attributes,
                price,
                stock_quantity,
                image_url
            )
            VALUES (
                v_product_id,
                v_variation->'attributes',
                (v_variation->>'price')::numeric,
                (v_variation->>'stock_quantity')::integer,
                v_variation->>'image_url'
            );
        END LOOP;
    END IF;

    RETURN jsonb_build_object('id', v_product_id, 'status', 'success');

EXCEPTION WHEN OTHERS THEN
    RAISE;
END;
$$;

-- 4. Seed Beauty & Cosmetics Category and Subcategories
DO $$
DECLARE
    v_beauty_id uuid := 'b0000000-0000-4000-a000-000000000001';
BEGIN
    -- Insert Beauty & Cosmetics
    INSERT INTO public.categories (id, name, slug)
    VALUES (v_beauty_id, 'Beauty & Cosmetics', 'beauty-cosmetics')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_beauty_id;

    -- Insert Subcategories
    INSERT INTO public.categories (id, name, slug, parent_id)
    VALUES 
        (gen_random_uuid(), 'Nails', 'beauty-nails', v_beauty_id),
        (gen_random_uuid(), 'Makeup', 'beauty-makeup', v_beauty_id),
        (gen_random_uuid(), 'Hair', 'beauty-hair', v_beauty_id)
    ON CONFLICT (slug) DO NOTHING;
END $$;
