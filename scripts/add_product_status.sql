-- 1. Add 'status' column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));

-- 2. Update the RPC function to include 'status'
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
        image_urls, 
        features,
        status, -- NEW FIELD
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
        (SELECT array_agg(x) FROM jsonb_array_elements_text(p_product->'image_urls') t(x)),
        (SELECT array_agg(x) FROM jsonb_array_elements_text(p_product->'features') t(x)),
        COALESCE(p_product->>'status', 'published'), -- NEW FIELD DEFAULT
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
        image_urls = EXCLUDED.image_urls,
        features = EXCLUDED.features,
        status = EXCLUDED.status, -- NEW FIELD UPDATE
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
