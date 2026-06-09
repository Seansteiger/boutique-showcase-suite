CREATE OR REPLACE FUNCTION place_order(
  p_user_id UUID,
  p_total_amount NUMERIC,
  p_shipping_address JSONB,
  p_items JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
  v_product_id UUID;
  v_quantity INTEGER;
  v_product_price NUMERIC;
  v_current_stock INTEGER;
BEGIN
  -- 1. Create Order
  INSERT INTO orders (user_id, status, total_amount, shipping_address)
  VALUES (p_user_id, 'pending', p_total_amount, p_shipping_address)
  RETURNING id INTO v_order_id;

  -- 2. Process Items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_quantity := (v_item->>'quantity')::INTEGER;
    v_product_price := (v_item->>'unit_price')::NUMERIC;

    -- Check Stock
    SELECT stock_quantity INTO v_current_stock
    FROM products
    WHERE id = v_product_id
    FOR UPDATE;

    IF v_current_stock IS NULL THEN
      RAISE EXCEPTION 'Product % not found', v_product_id;
    END IF;

    IF v_current_stock < v_quantity THEN
      RAISE EXCEPTION 'Insufficient stock for product %', v_product_id;
    END IF;

    -- Deduct Stock
    UPDATE products
    SET stock_quantity = stock_quantity - v_quantity
    WHERE id = v_product_id;

    -- Insert Order Item
    INSERT INTO order_items (order_id, product_id, quantity, unit_price)
    VALUES (v_order_id, v_product_id, v_quantity, v_product_price);
  END LOOP;

  RETURN jsonb_build_object('order_id', v_order_id, 'status', 'success');
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Order processing failed: %', SQLERRM;
END;
$$;
