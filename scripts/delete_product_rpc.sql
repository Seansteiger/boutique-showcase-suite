DROP FUNCTION IF EXISTS delete_product(uuid);

CREATE OR REPLACE FUNCTION delete_product(p_product_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER -- Bypasses RLS policies
SET search_path = public
AS $$
DECLARE
    has_orders BOOLEAN;
BEGIN
    -- Check if there are order items referencing this product
    SELECT EXISTS (
        SELECT 1 FROM order_items WHERE product_id = p_product_id
    ) INTO has_orders;

    IF has_orders THEN
        -- Soft delete / archive the product instead
        UPDATE products SET status = 'archived' WHERE id = p_product_id;
        RETURN 'archived';
    ELSE
        -- Permanently delete
        DELETE FROM product_variations WHERE product_id = p_product_id;
        DELETE FROM reviews WHERE product_id = p_product_id;
        DELETE FROM product_metrics WHERE product_id = p_product_id;
        DELETE FROM products WHERE id = p_product_id;
        RETURN 'deleted';
    END IF;
END;
$$;

