
INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    '3D Moon Lamp',
    '3d-moon-lamp',
    'Key Features:\n• Realistic 3D-printed lunar surface• 16 colour options — warm white, cool white, RGB tones• Touch control + remote included• Adjustable brightness levels• USB rechargeable (no wires while it shines)• Battery life: 6–8 hours on a full charge• Includes wooden stand for display• Eco-friendly PLA material• Size: approx. 16cm height x 11cm diameter• Perfect for desks, bedside tables, or gifting someone you moon over',
    139,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/4_17-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_30-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2_28-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4_17-2.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-1.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Condere Cordless Kettle',
    'condere-cordless-kettle',
    'Features:\n- 2-litre capacity.\n- Cordless design with 360-degree rotational base.\n- Rapid boiling with a powerful 2200W heating element.\n- Automatic shut-off and boil-dry protection.\n- Easy-grip handle and power indicator light.\nMaterial: Stainless Steel',
    165,
    'bee65c00-35c4-4296-a1ed-38ddcbd35e0c',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1-1-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-1.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-2.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy cushions - Grey',
    'fluffy-cushions-grey',
    'Key Features:\n• Ultra-soft faux fur or plush velvet material• Size: ~40x40cm (standard)• Lightweight inner filling for cloud-like comfort• Zipper or stitched closure (model dependent)• Fade-resistant fabric — stays vibrant and clean• Available in neutral and pastel tones to match any space• Machine washable cover (check label)• Perfect for dorms, couches, beds, and IG selfies',
    69,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy cushions - Red',
    'fluffy-cushions-red',
    'Key Features:\n• Ultra-soft faux fur or plush velvet material• Size: ~40x40cm (standard)• Lightweight inner filling for cloud-like comfort• Zipper or stitched closure (model dependent)• Fade-resistant fabric — stays vibrant and clean• Available in neutral and pastel tones to match any space• Machine washable cover (check label)• Perfect for dorms, couches, beds, and IG selfies',
    69,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy cushions - Pink',
    'fluffy-cushions-pink',
    'Key Features:\n• Ultra-soft faux fur or plush velvet material• Size: ~40x40cm (standard)• Lightweight inner filling for cloud-like comfort• Zipper or stitched closure (model dependent)• Fade-resistant fabric — stays vibrant and clean• Available in neutral and pastel tones to match any space• Machine washable cover (check label)• Perfect for dorms, couches, beds, and IG selfies',
    69,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy cushions - White',
    'fluffy-cushions-white',
    'Key Features:\n• Ultra-soft faux fur or plush velvet material• Size: ~40x40cm (standard)• Lightweight inner filling for cloud-like comfort• Zipper or stitched closure (model dependent)• Fade-resistant fabric — stays vibrant and clean• Available in neutral and pastel tones to match any space• Machine washable cover (check label)• Perfect for dorms, couches, beds, and IG selfies',
    69,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy cushions - Black',
    'fluffy-cushions-black',
    'Key Features:\n• Ultra-soft faux fur or plush velvet material• Size: ~40x40cm (standard)• Lightweight inner filling for cloud-like comfort• Zipper or stitched closure (model dependent)• Fade-resistant fabric — stays vibrant and clean• Available in neutral and pastel tones to match any space• Machine washable cover (check label)• Perfect for dorms, couches, beds, and IG selfies',
    69,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy cushions - Brown',
    'fluffy-cushions-brown',
    'Key Features:\n• Ultra-soft faux fur or plush velvet material• Size: ~40x40cm (standard)• Lightweight inner filling for cloud-like comfort• Zipper or stitched closure (model dependent)• Fade-resistant fabric — stays vibrant and clean• Available in neutral and pastel tones to match any space• Machine washable cover (check label)• Perfect for dorms, couches, beds, and IG selfies',
    69,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy cushions - Orange',
    'fluffy-cushions-orange',
    'Key Features:\n• Ultra-soft faux fur or plush velvet material• Size: ~40x40cm (standard)• Lightweight inner filling for cloud-like comfort• Zipper or stitched closure (model dependent)• Fade-resistant fabric — stays vibrant and clean• Available in neutral and pastel tones to match any space• Machine washable cover (check label)• Perfect for dorms, couches, beds, and IG selfies',
    69,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy cushions - Blue',
    'fluffy-cushions-blue',
    'Key Features:\n• Ultra-soft faux fur or plush velvet material• Size: ~40x40cm (standard)• Lightweight inner filling for cloud-like comfort• Zipper or stitched closure (model dependent)• Fade-resistant fabric — stays vibrant and clean• Available in neutral and pastel tones to match any space• Machine washable cover (check label)• Perfect for dorms, couches, beds, and IG selfies',
    69,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy cushions - Green',
    'fluffy-cushions-green',
    'Key Features:\n• Ultra-soft faux fur or plush velvet material• Size: ~40x40cm (standard)• Lightweight inner filling for cloud-like comfort• Zipper or stitched closure (model dependent)• Fade-resistant fabric — stays vibrant and clean• Available in neutral and pastel tones to match any space• Machine washable cover (check label)• Perfect for dorms, couches, beds, and IG selfies',
    69,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy cushions - Dusty pink',
    'fluffy-cushions-dusty-pink',
    'Key Features:\n• Ultra-soft faux fur or plush velvet material• Size: ~40x40cm (standard)• Lightweight inner filling for cloud-like comfort• Zipper or stitched closure (model dependent)• Fade-resistant fabric — stays vibrant and clean• Available in neutral and pastel tones to match any space• Machine washable cover (check label)• Perfect for dorms, couches, beds, and IG selfies',
    69,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Frosted Cushions - Grey',
    'frosted-cushions-grey',
    'Features:\n- Faux fur or boucle texture\n- Available in various colors\n- Typically 100% polyester\n- Standard size: 45cm x 45cm',
    99,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Frosted Cushions - Blue',
    'frosted-cushions-blue',
    'Features:\n- Faux fur or boucle texture\n- Available in various colors\n- Typically 100% polyester\n- Standard size: 45cm x 45cm',
    99,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Frosted Cushions - Orange',
    'frosted-cushions-orange',
    'Features:\n- Faux fur or boucle texture\n- Available in various colors\n- Typically 100% polyester\n- Standard size: 45cm x 45cm',
    99,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Frosted Cushions - Pink',
    'frosted-cushions-pink',
    'Features:\n- Faux fur or boucle texture\n- Available in various colors\n- Typically 100% polyester\n- Standard size: 45cm x 45cm',
    99,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Frosted Cushions - Purple',
    'frosted-cushions-purple',
    'Features:\n- Faux fur or boucle texture\n- Available in various colors\n- Typically 100% polyester\n- Standard size: 45cm x 45cm',
    99,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Golden Cushions - Black',
    'golden-cushions-black',
    'Features:\n- Shaggy, sequin, or crushed velvet styles\n- Embedded with glitter or metallic threads\n- Adds a glamorous touch\n- Standard size: 45cm x 45cm\nMaterials: Polyester, Faux Fur, Velvet, Satin',
    114,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Golden Cushions - Beige',
    'golden-cushions-beige',
    'Features:\n- Shaggy, sequin, or crushed velvet styles\n- Embedded with glitter or metallic threads\n- Adds a glamorous touch\n- Standard size: 45cm x 45cm\nMaterials: Polyester, Faux Fur, Velvet, Satin',
    114,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Golden Cushions - Brown',
    'golden-cushions-brown',
    'Features:\n- Shaggy, sequin, or crushed velvet styles\n- Embedded with glitter or metallic threads\n- Adds a glamorous touch\n- Standard size: 45cm x 45cm\nMaterials: Polyester, Faux Fur, Velvet, Satin',
    114,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Golden Cushions - Cream',
    'golden-cushions-cream',
    'Features:\n- Shaggy, sequin, or crushed velvet styles\n- Embedded with glitter or metallic threads\n- Adds a glamorous touch\n- Standard size: 45cm x 45cm\nMaterials: Polyester, Faux Fur, Velvet, Satin',
    114,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Golden Cushions - Dusty Pink',
    'golden-cushions-dusty-pink',
    'Features:\n- Shaggy, sequin, or crushed velvet styles\n- Embedded with glitter or metallic threads\n- Adds a glamorous touch\n- Standard size: 45cm x 45cm\nMaterials: Polyester, Faux Fur, Velvet, Satin',
    114,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Golden Cushions - Grey',
    'golden-cushions-grey',
    'Features:\n- Shaggy, sequin, or crushed velvet styles\n- Embedded with glitter or metallic threads\n- Adds a glamorous touch\n- Standard size: 45cm x 45cm\nMaterials: Polyester, Faux Fur, Velvet, Satin',
    114,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Golden Cushions - Maroon',
    'golden-cushions-maroon',
    'Features:\n- Shaggy, sequin, or crushed velvet styles\n- Embedded with glitter or metallic threads\n- Adds a glamorous touch\n- Standard size: 45cm x 45cm\nMaterials: Polyester, Faux Fur, Velvet, Satin',
    114,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Golden Cushions - Red',
    'golden-cushions-red',
    'Features:\n- Shaggy, sequin, or crushed velvet styles\n- Embedded with glitter or metallic threads\n- Adds a glamorous touch\n- Standard size: 45cm x 45cm\nMaterials: Polyester, Faux Fur, Velvet, Satin',
    114,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Golden Cushions - White',
    'golden-cushions-white',
    'Features:\n- Shaggy, sequin, or crushed velvet styles\n- Embedded with glitter or metallic threads\n- Adds a glamorous touch\n- Standard size: 45cm x 45cm\nMaterials: Polyester, Faux Fur, Velvet, Satin',
    114,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fast Wireless Charging Stand',
    'fast-wireless-charging-stand',
    'Features:\n- Up to 15W of power for fast charging.\n- Charges in portrait or landscape mode.\n- Universal compatibility with Qi-enabled devices.\n- LED indicator light for charging status.\n- Can charge through lightweight cases (up to 3mm).\n- 2-coil\nCompatibility: Qi-enabled devices (iPhones, Android phones, etc.)',
    198,
    '92881287-b294-466d-8377-1dc6a8efb6e5',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_28-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2.webp','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3.webp','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4.webp','https://jozistudenthub.co.za/wp-content/uploads/2025/07/6.webp','https://jozistudenthub.co.za/wp-content/uploads/2025/07/5.webp'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy Rug - Black',
    'fluffy-rug-black',
    'Features:\n- Deep, plush pile for a soft and comfortable feel.\n- Adds warmth and insulation to floors.\n- Helps to reduce noise.\n- Non-slip backing for safety.\nMaterials: Faux fur, Polyester\nSizes: 120cm x 180cm',
    150,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy Rug - Grey',
    'fluffy-rug-grey',
    'Features:\n- Deep, plush pile for a soft and comfortable feel.\n- Adds warmth and insulation to floors.\n- Helps to reduce noise.\n- Non-slip backing for safety.\nMaterials: Faux fur, Polyester\nSizes: 120cm x 180cm',
    150,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy Rug - Blue',
    'fluffy-rug-blue',
    'Features:\n- Deep, plush pile for a soft and comfortable feel.\n- Adds warmth and insulation to floors.\n- Helps to reduce noise.\n- Non-slip backing for safety.\nMaterials: Faux fur, Polyester\nSizes: 120cm x 180cm',
    150,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy Rug - White',
    'fluffy-rug-white',
    'Features:\n- Deep, plush pile for a soft and comfortable feel.\n- Adds warmth and insulation to floors.\n- Helps to reduce noise.\n- Non-slip backing for safety.\nMaterials: Faux fur, Polyester\nSizes: 120cm x 180cm',
    150,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy Rug - Brown',
    'fluffy-rug-brown',
    'Features:\n- Deep, plush pile for a soft and comfortable feel.\n- Adds warmth and insulation to floors.\n- Helps to reduce noise.\n- Non-slip backing for safety.\nMaterials: Faux fur, Polyester\nSizes: 120cm x 180cm',
    150,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fluffy Rug - Pink',
    'fluffy-rug-pink',
    'Features:\n- Deep, plush pile for a soft and comfortable feel.\n- Adds warmth and insulation to floors.\n- Helps to reduce noise.\n- Non-slip backing for safety.\nMaterials: Faux fur, Polyester\nSizes: 120cm x 180cm',
    150,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Foldable Phone Stand',
    'foldable-phone-stand',
    'Features:\n- Foldable and portable design.\n- Adjustable viewing angle to reduce neck strain.\n- Non-slip silicone pads to protect your device.\n- Universal compatibility with most smartphones.\n- Cutout for charging cable.\nMaterials: Aluminum alloy, ABS plastic',
    44,
    '92881287-b294-466d-8377-1dc6a8efb6e5',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/3_20-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/1-2.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-2.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-1.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/5-1.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Tabletop Air Hockey',
    'tabletop-air-hockey',
    'Features:\n- Portable and lightweight design.\n- Battery-powered fan for puck gliding action.\n- Includes two paddles and two pucks.\n- Sliding scorers to keep track of the score.\nPlayers: 2',
    449,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_8-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-3.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Connect 4 Spin',
    'connect-4-spin',
    'Features:\n- Spinning game grid.\n- Includes a weighted disc for strategic play.\n- Two game modes: Beginner and Expert.\nPlayers: 2\nAges: 8+',
    155,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_5-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-2.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-4.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Do or Drink',
    'do-or-drink',
    'Features:\n- 350 cards with a variety of dares and challenges.\n- Simple to learn and play.\n- Perfect for parties and game nights.\nPlayers: 2+\nAges: 21+ (Keep the kids away;)',
    124,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_18-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-5.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-5.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'LED Mood Lights',
    'led-mood-lights',
    'Key Features:\n• Length: 5 meters• Control: Bluetooth app for Android & iOS, and a remote as well.• Colours: 16 million RGB colour options• Modes: Static, strobe, fade, dynamic, and music sync• Brightness & speed adjustable from app• Music sync feature using phone microphone• USB-powered or 12V adapter compatible• Flexible, cuttable, and easy to mount with adhesive backing• Energy-efficient and long-lasting LEDs• Works great for res, bedrooms, TVs, desks, and headboards',
    149,
    'fbf1a69c-8894-40aa-b026-429e152aba72',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-6.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/1-6.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-6.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Neon Strip Lights',
    'neon-strip-lights',
    'Key Features:• Length: 5 meters of flexible neon-style strip• Waterproof (IP65 rating) — safe for bathrooms or outdoor use• Ultra-bright SMD 5050 RGB LEDs• Works with 12V power supply• Bendable silicone coating for easy shaping• Neon glow with no harsh LED dots• Remote control or app-controlled (depending on model)• Multiple lighting modes: static, strobe, fade, music sync• Easy peel-and-stick adhesive back• Cuttable every few inches for custom installs',
    219,
    'fbf1a69c-8894-40aa-b026-429e152aba72',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/5-3.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/7.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/6.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/10.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/9.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-3.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-7.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/1-7.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Dominoes (Double Six, Colour Dot)',
    'dominoes-double-six-colour-dot',
    'Key Features:\n\n\n 	\n28 precision-crafted tiles with eye-catching coloured dots for instant recognition\n\n 	\n2-4 player capacity – ideal for dorm rooms and small gatherings\n\n 	\nCompact storage box fits perfectly in any backpack or study space\n\n 	\nDurable resin construction survives countless epic battles\n\n 	\nMemory & strategy boost – sharpen your mind while having fun\n\n',
    86,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_1-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-8.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-8.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Custom Leather Notebook - A4',
    'custom-leather-notebook-a4',
    'Whether you''re taking notes, planning your day, or sketching ideas, this stylish leather journal adds a touch of class to every page. Wrapped in a stylish faux leather hardcover, it combines practicality with timeless design. The notebook includes includes an outer leather cover, making it perfect for long-term use. Great for journaling, note-taking, or as a thoughtful gift.',
    0,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Custom Leather Notebook - A5',
    'custom-leather-notebook-a5',
    'Whether you''re taking notes, planning your day, or sketching ideas, this stylish leather journal adds a touch of class to every page. Wrapped in a stylish faux leather hardcover, it combines practicality with timeless design. The notebook includes includes an outer leather cover, making it perfect for long-term use. Great for journaling, note-taking, or as a thoughtful gift.',
    0,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Custom Leather Notebook - A6',
    'custom-leather-notebook-a6',
    'Whether you''re taking notes, planning your day, or sketching ideas, this stylish leather journal adds a touch of class to every page. Wrapped in a stylish faux leather hardcover, it combines practicality with timeless design. The notebook includes includes an outer leather cover, making it perfect for long-term use. Great for journaling, note-taking, or as a thoughtful gift.',
    0,
    '4901dbf0-ad73-4f73-a23d-4f04473bc467',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Sandwich Maker',
    'sandwich-maker',
    'Features:\n\n\n 	\nNon-stick coated plates for easy cleaning.\n\n 	\nHeats up quickly for fast meal prep.\n\n 	\nCompact design with upright storage option.\n\n 	\nPower and ready indicator lights.\n\n 	\nCool-touch handle for safe operation.\n\n',
    185,
    'bee65c00-35c4-4296-a1ed-38ddcbd35e0c',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1-1.webp','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-1.webp','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-1.webp'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Electric Coffee Pot',
    'electric-coffee-pot',
    'Features:\n\n\n 	\nFast and efficient electric brewing.\n\n 	\nIdeal for Turkish or stovetop-style coffee.\n\n 	\nErgonomic heat-resistant handle.\n\n 	\nPrecision spout for drip-free pouring.\n\n 	\nPower indicator light and easy one-button operation.\n\n\nCapacity: 0.5LPower: 600WMaterial: Heat-resistant plastic and stainless steel heating plate',
    229,
    'bee65c00-35c4-4296-a1ed-38ddcbd35e0c',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/6-1.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/1-9.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-9.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-9.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-4.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/5-4.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Luminous Mouse Pad',
    'luminous-mouse-pad',
    'Features:\n\n\n 	\nVibrant RGB lighting with multiple color modes\n\n 	\nOne-touch button to cycle through effects (wave, breathing, static, etc.)\n\n 	\nLarge surface fits keyboard and mouse\n\n 	\nSmooth micro-textured surface for precision and speed\n\n 	\nAnti-slip rubber base for grip on any desk\n\n 	\nUSB powered — plug and play, no software needed\n\n\nSize: 80cm x 30cmCable: Detachable USB, approx. 1.8m',
    185,
    '92881287-b294-466d-8377-1dc6a8efb6e5',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_27-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/5-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-10.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-10.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4.png'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Jiageng JG758 Mini DC UPS',
    'jiageng-jg758-mini-dc-ups',
    'Features:\n\n\n 	\nRobust 8 800 mAh lithium battery — plenty of juice for your essentials\n\n 	\nSelectable DC output (5 V, 9 V, 12 V, 15 V, 24 V) + POE port — versatile for routers, modems, cams\n\n 	\nUSB port to charge your phone or tablet\n\n 	\nSmart circuit protection: over‑charge, short‑circuit safeguards\n\n 	\nInput voltage 100–240 V AC — works anywhere\n\n 	\nSilent operation—no annoying buzz during study time\n\n\nSpecs:\n\n\n 	\nCapacity: 8 800 mAh\n\n 	\nOutputs: DC (5/9/12/15/24 V), POE, USB\n\n 	\nWeight/Size: Mini form-factor—easily slides next to your router or under your monitor\n\n',
    290,
    'fbf1a69c-8894-40aa-b026-429e152aba72',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_29-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-11.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Do You Really Know Your Family?',
    'do-you-really-know-your-family',
    'Features:\n\n\n 	\n200+ thought-provoking and fun question/challenge cards\n\n 	\nMix of conversation starters, dares, and “who’s most likely” vibes\n\n 	\nQuick to set up, easy to play — no learning curve\n\n 	\nGreat for bonding with family or resmates\n\n 	\nEncourages laughter, storytelling, and surprising reveals\n\n',
    109,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_13-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-5.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-11.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-12.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Do You Really Know Your Friends?',
    'do-you-really-know-your-friends',
    'Features:\n\n\n 	\nQuick setup and intuitive play—jump right into the fun\n\n 	\nTrivia + interactive challenges keep energy levels high\n\n 	\nHilarious prompts that uncover quirky facts or hidden truths\n\n 	\nCompact card set easily stored in your backpack\n\n 	\nSuitable for teens and adults—roomies included\n\n',
    115,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_15-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/5-5.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-13.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-12.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-6.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Drinking Roulette Set (16‑Shot Spinner)',
    'drinking-roulette-set-16shot-spinner',
    'Features:\n\n\n 	\nFull roulette set: wooden/plastic wheel, two steel balls, and 16 shot glasses in red and black.\n\n 	\nSimple rules: match the number, take the shot, and spin again.\n\n 	\nDesigned for groups of 2–8 players—great for roommate seshes or pre‑night-out warm‑ups\n\n 	\nCompact footprint (~30 cm diameter) fits snugly on res desktops or dorm tables.\n\n 	\nNo assembly—just fill, spin, sip, and go.\n\n\nSpecs:\n\n\n 	\nShot Glasses: 16 pieces, numbered\n\n 	\nWheel Diameter: approx. 30 cm\n\n 	\nMaterial: mix of glass (shot glasses), plastic/wood (wheel), and metal.\n\n 	\nDesigned for beverages of choice—sip responsibly.\n\n',
    169,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/3_14-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-7.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'I Should’ve Known That!',
    'i-shouldve-known-that',
    'Features:\n\n\n 	\n110 sturdy cards with 400+ questions on basic but surprising facts\n\n 	\nUnique scoring: lose points for wrong answers, not gain them\n\n 	\nQuick setup—jump in within seconds\n\n 	\nNo batteries or extra gear—just pure trivia fun\n\n',
    77,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_12-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-14.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-8.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-14.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Let''s Get Deep - Friends Edition',
    'lets-get-deep-friends-edition',
    'Features:\n\n\n 	\n300 beautifully illustrated prompt cards, grouped into three levels of depth\n\n 	\nMix of lighthearted and thoughtful questions—grow from basic chit-chat to meaningful convos\n\n 	\nCompact, sturdy box ideal for tossing in your backpack\n\n 	\nFast gameplay: pick a level, draw a card, answer—repeat\n\n\nPlayers: 2+Ages: 14+ / teens & Uni crowdPlaytime: 20–60 mins, depending on squad energy',
    173,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1-2-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-9.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/5-6.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Live Laugh Lose',
    'live-laugh-lose',
    'Features:\n\n\n 	\n300 Joke Cards packed with cheesy, cringe-ready one-liners\n\n 	\n100 Delivery Cards that add hilarious twists: Siri voice, whisper, over-the-top drama, and more\n\n 	\nEasy rules: draw, joke, deliver, and watch the reactions fly\n\n 	\nSupports 2–20 players, so it’s great for squads or larger res parties\n\n',
    99,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_14-1.png'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Never Have I Ever',
    'never-have-i-ever',
    'Ready to spill all your funniest, wildest, or most cringeworthy life experiences? Never Have I Ever is the classic drinking or storytelling game that gets honest truths flowing. Each prompt starts with "Never have I ever…", and anyone who has done it takes a sip—or shares the story. Perfect for res living rooms, flatmate game nights, or braais with your squad. It’s equal parts hilarious confession, memory lane, and truth serum—all packed into one card box.',
    0,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Risk It Or Drink It',
    'risk-it-or-drink-it',
    'Features:\n\n\n 	\n150+ challenge cards across four escalating difficulty levels\n\n 	\nDraw a card, complete the dare—or drink if you chicken out\n\n 	\nSimple rules, fast setup—play starts instantly\n\n 	\nDesigned for groups: 2–10 players fits any res corridor or lounge\n\n 	\nCompact deck, easy to stash in a backpack or res drawer\n\n\nPlayers: 2+Ages: 18+ (some dares may be a bit extreme)Playtime: 15–45 minutes, depending on crew energy',
    85,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_9-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-16.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-16.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-10.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Sh*t Happens',
    'sht-happens',
    'Features:\n\n\n 	\n200 irreverent and witty "Situation Cards"\n\n 	\nMisery Index rankings from 1–100, all vetted by professional counselors—yes, really\n\n 	\nEasy-to-follow gameplay: guess the ranking, win cards—first to 10 wins\n\n 	\nSupports 2+ players, ages 18+\n\n 	\nCompact box (approx. 16 cm × 11 cm) that’s easy to stash in a backpack or dorm drawer\n\n',
    110,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/2_3-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-17.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Spank The Yeti',
    'spank-the-yeti',
    'Features:\n\n\n 	\nHuge deck: 436 cards (Action + Object) plus ABC/123 guess cards\n\n 	\nEasy setup, intuitive play—no app, no fuss\n\n 	\nFor 2–10 players, adults only (17+)\n\n 	\nHilarious combinations: endless replay potential\n\n',
    170,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/2_6-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-18.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'These Cards Will Get You Drunk Too',
    'these-cards-will-get-you-drunk-too',
    'Features:\n\n 	\n100 unique challenge cards—screw your mates or get screwed\n\n 	\nCompact, portable deck fits easily in res drawers or backpacks\n\n 	\nFast-paced play: no setup, no app, just raw fun\n\n 	\nSupports 2–8 players, ages 21+—great for squad hangouts\n\n 	\nCan be played alone or paired with the original deck\n\n',
    65,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_17-1.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-19.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Things They Didn''t Teach You In School',
    'things-they-didnt-teach-you-in-school',
    'Features:\n\n 	\n110 cards packed with over 400 trivia questions and answers\n\n 	\nQuick and easy gameplay—no app, no setup, instant fun\n\n 	\nCompact and bag-friendly: 14.5 cm square by 4.5 cm thick\n\n 	\n2+ players—great for squad nights or family gatherings\n\n',
    76,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/2_11-1.png'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Top Of Mind',
    'top-of-mind',
    'Features:\n\n 	\n110 prompt cards that each include multiple categories (400+ possible topics)\n\n 	\nSimultaneous answering—no one sits out\n\n 	\nSimple mechanics—pick a category, write an answer, compare—and bam, you’re in the game\n\n 	\nGame rounds last 15–45 minutes, great for tight res schedules\n\n 	\nIdeal for groups of 3 to 99 players (more minds, more matches!)\n\n 	\nCompact size (~14.5 cm square box), perfect for tossing into your backpack or stash spot\n\n',
    49,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1_10-1.png'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Twister',
    'twister',
    'Features:\n\n 	\nLarge vinyl Twister mat with iconic red, blue, yellow, and green circles\n\n 	\nClassic spinner board with easy-to-follow instructions\n\n 	\nFor 2 or more players—no limit if your res crew wants to rotate in\n\n 	\nFolds up neatly for storage under a bed, in a cupboard, or in your backpack\n\n 	\nGreat for icebreakers, pre-games, or flexing your yoga skills (or lack thereof)\n\n',
    135,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1-21.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-11.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'What Do You Meme?',
    'what-do-you-meme',
    'Features:\n\n 	\n435 premium cards: 75 Photo Cards + 360 Caption Cards\n\n 	\nDurable gloss-finish cards and display easel included\n\n 	\nFast rules—only minutes to learn, hours of meme battles\n\n 	\nSupports 3 to 20 players, ages 17+\n\n 	\nPerfect for squad game nights, party preludes, or post-exam relaxation\n\n',
    137,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-19.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-22.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/4-12.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/1-22.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'You Laugh You Drink',
    'you-laugh-you-drink',
    'Features:\n\n• 150 hilarious action cards\n• Fast-paced gameplay for 3+ players• Perfect for pre-games, afters, and res parties• No complicated rules — read, act, laugh, drink• Ages 21+ (or whenever you''re vibing with soft drinks)• Portable deck size — take it anywhere• Combine with other card games for an ultimate party night',
    79,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1-23.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'You Lie You Drink',
    'you-lie-you-drink',
    'Features:\n\n 	\n150 prompt cards invite you to share real stories or bluff creatively (e.g., “I once kissed a celebrity” or “I’ve never broken a bone”)\n\n 	\nSimple turn-based gameplay: pick a card, make your statement, face the verdict—no setup hassles\n\n 	\nFor 3+ players, suitable for ages 21+—guaranteed laugh fuel for adult groups\n\n 	\nBox includes prompt deck and clear “truth/lies” voting cards to keep everyone in the game flow\n\n',
    69,
    '56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/1-24.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/2-23.jpg','https://jozistudenthub.co.za/wp-content/uploads/2025/07/3-20.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Non-stick Frying Pan - 24cm',
    'non-stick-frying-pan-24cm',
    'Features:\n\n 	\nMarble-textured non-stick coating lets you cook with minimal oil—and scrubbing is nearly a thing of the past.\n\n 	\nThick forged base ensures even heat distribution and lowers risk of burnt food or hotspot disasters.\n\n 	\nWooden handle stays cool under pressure, so no oven mitts or burns.\n\n 	\nLightweight and compact—slides under the res-room bed or stacks with other pans easily.\n\n\nSpecs:\n\n 	Material: Forged aluminum with marble non-stick coating; wood‑style handle (heat-resistant)\n 	\nCare: Best hand-washed to preserve coating (recommend silicone/nylon utensils only)\n\n',
    105,
    'bee65c00-35c4-4296-a1ed-38ddcbd35e0c',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Non-stick Frying Pan - 26cm',
    'non-stick-frying-pan-26cm',
    'Features:\n\n 	\nMarble-textured non-stick coating lets you cook with minimal oil—and scrubbing is nearly a thing of the past.\n\n 	\nThick forged base ensures even heat distribution and lowers risk of burnt food or hotspot disasters.\n\n 	\nWooden handle stays cool under pressure, so no oven mitts or burns.\n\n 	\nLightweight and compact—slides under the res-room bed or stacks with other pans easily.\n\n\nSpecs:\n\n 	Material: Forged aluminum with marble non-stick coating; wood‑style handle (heat-resistant)\n 	\nCare: Best hand-washed to preserve coating (recommend silicone/nylon utensils only)\n\n',
    120,
    'bee65c00-35c4-4296-a1ed-38ddcbd35e0c',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Non-stick Frying Pan - 28cm',
    'non-stick-frying-pan-28cm',
    'Features:\n\n 	\nMarble-textured non-stick coating lets you cook with minimal oil—and scrubbing is nearly a thing of the past.\n\n 	\nThick forged base ensures even heat distribution and lowers risk of burnt food or hotspot disasters.\n\n 	\nWooden handle stays cool under pressure, so no oven mitts or burns.\n\n 	\nLightweight and compact—slides under the res-room bed or stacks with other pans easily.\n\n\nSpecs:\n\n 	Material: Forged aluminum with marble non-stick coating; wood‑style handle (heat-resistant)\n 	\nCare: Best hand-washed to preserve coating (recommend silicone/nylon utensils only)\n\n',
    140,
    'bee65c00-35c4-4296-a1ed-38ddcbd35e0c',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Nova Luxury Soft - Toilet Tissue',
    'nova-luxury-soft-toilet-tissue',
    'Features:\n\n 	\nUltra-soft double-ply tissue for comfort without sacrificing durability\n\n 	\n350 sheets per roll (9-roll pack) for long-lasting use\n\n 	\nMade from FSC‑certified sugarcane waste fibre using chlorine-free processing\n\n 	\nBiodegradable and recyclable—kind to the planet and your conscience\n\n',
    59,
    'd3eb742f-8a3a-4fd9-9ebe-19438ed053d6',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/IMG_20250730_130058.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/IMG_20250730_130108.png'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Perfecto Dishwashing Liquid - 400ml, Lemon',
    'perfecto-dishwashing-liquid-400ml-lemon',
    'Features:\n\n 	\nPowerful degreasing action easily breaks down oil and stuck-on food\n\n 	\nRefreshing scent that leaves dishes sparkling and your kitchen smelling clean\n\n 	\nHand-friendly formula—won’t dry out your skin after dish duty\n\n 	\nCompact bottle size—great for tight res cupboards or shelf space\n\n 	\nBudget-friendly—big value in one smart purchase\n\n',
    19,
    'd3eb742f-8a3a-4fd9-9ebe-19438ed053d6',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Perfecto Dishwashing Liquid - 400ml, Exotic Berries',
    'perfecto-dishwashing-liquid-400ml-exotic-berries',
    'Features:\n\n 	\nPowerful degreasing action easily breaks down oil and stuck-on food\n\n 	\nRefreshing scent that leaves dishes sparkling and your kitchen smelling clean\n\n 	\nHand-friendly formula—won’t dry out your skin after dish duty\n\n 	\nCompact bottle size—great for tight res cupboards or shelf space\n\n 	\nBudget-friendly—big value in one smart purchase\n\n',
    19,
    'd3eb742f-8a3a-4fd9-9ebe-19438ed053d6',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Perfecto Dishwashing Liquid - 750ml, Lemon',
    'perfecto-dishwashing-liquid-750ml-lemon',
    'Features:\n\n 	\nPowerful degreasing action easily breaks down oil and stuck-on food\n\n 	\nRefreshing scent that leaves dishes sparkling and your kitchen smelling clean\n\n 	\nHand-friendly formula—won’t dry out your skin after dish duty\n\n 	\nCompact bottle size—great for tight res cupboards or shelf space\n\n 	\nBudget-friendly—big value in one smart purchase\n\n',
    24,
    'd3eb742f-8a3a-4fd9-9ebe-19438ed053d6',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Perfecto Dishwashing Liquid - 750ml, Exotic Berries',
    'perfecto-dishwashing-liquid-750ml-exotic-berries',
    'Features:\n\n 	\nPowerful degreasing action easily breaks down oil and stuck-on food\n\n 	\nRefreshing scent that leaves dishes sparkling and your kitchen smelling clean\n\n 	\nHand-friendly formula—won’t dry out your skin after dish duty\n\n 	\nCompact bottle size—great for tight res cupboards or shelf space\n\n 	\nBudget-friendly—big value in one smart purchase\n\n',
    24,
    'd3eb742f-8a3a-4fd9-9ebe-19438ed053d6',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Perfecto Dishwashing Liquid - 1.5l, Lemon',
    'perfecto-dishwashing-liquid-15l-lemon',
    'Features:\n\n 	\nPowerful degreasing action easily breaks down oil and stuck-on food\n\n 	\nRefreshing scent that leaves dishes sparkling and your kitchen smelling clean\n\n 	\nHand-friendly formula—won’t dry out your skin after dish duty\n\n 	\nCompact bottle size—great for tight res cupboards or shelf space\n\n 	\nBudget-friendly—big value in one smart purchase\n\n',
    39,
    'd3eb742f-8a3a-4fd9-9ebe-19438ed053d6',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Perfecto Dishwashing Liquid - 1.5l, Exotic Berries',
    'perfecto-dishwashing-liquid-15l-exotic-berries',
    'Features:\n\n 	\nPowerful degreasing action easily breaks down oil and stuck-on food\n\n 	\nRefreshing scent that leaves dishes sparkling and your kitchen smelling clean\n\n 	\nHand-friendly formula—won’t dry out your skin after dish duty\n\n 	\nCompact bottle size—great for tight res cupboards or shelf space\n\n 	\nBudget-friendly—big value in one smart purchase\n\n',
    39,
    'd3eb742f-8a3a-4fd9-9ebe-19438ed053d6',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Donut Pan (12‑Hole)',
    'donut-pan-12hole',
    'Features:\n\n 	\nHolds 12 donut cavities—perfect for sharing or single‑batch runs\n\n 	\nNon‑stick carbon steel means donuts pop out easily and cleaning is quick\n\n 	\nSturdy construction—designed to take repeated oven use without warping\n\n 	\nSlim profile (~40 cm x 28 cm footprint with ~2 cm depth) so it tucks into cabinets or res-room draws effortlessly\n\n 	\nMulti-use: double as muffin pan, cake pops tray, mini quiche mould—perfect for crowd cooking\n\n',
    119,
    'bee65c00-35c4-4296-a1ed-38ddcbd35e0c',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/IMG_20250730_125807.png'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Spy x Family Tote Bag - White',
    'spy-x-family-tote-bag-white',
    'Features:\n\n 	\nBold design featuring the Forger family in full color\n\n 	\nDurable 100% polyester shell or heavyweight canvas options available\n\n 	\nWide cotton straps (approx. 2.5 cm) — comfy on the shoulder, even when top‑heavy with books or a laptop\n\n 	\nAvailable in multiple sizes, from compact (21″ strap) to extra large (29″ strap), so you pick what works for your daily haul\n\n 	\nEasy-care, machine-wash light cycle—just air dry or tumble low\n\n',
    0,
    'cd4a59bd-11c5-44b6-9b45-d68d471e3c29',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Spy x Family Tote Bag - Black',
    'spy-x-family-tote-bag-black',
    'Features:\n\n 	\nBold design featuring the Forger family in full color\n\n 	\nDurable 100% polyester shell or heavyweight canvas options available\n\n 	\nWide cotton straps (approx. 2.5 cm) — comfy on the shoulder, even when top‑heavy with books or a laptop\n\n 	\nAvailable in multiple sizes, from compact (21″ strap) to extra large (29″ strap), so you pick what works for your daily haul\n\n 	\nEasy-care, machine-wash light cycle—just air dry or tumble low\n\n',
    150,
    'cd4a59bd-11c5-44b6-9b45-d68d471e3c29',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Spy x Family Tote Bag - Beige',
    'spy-x-family-tote-bag-beige',
    'Features:\n\n 	\nBold design featuring the Forger family in full color\n\n 	\nDurable 100% polyester shell or heavyweight canvas options available\n\n 	\nWide cotton straps (approx. 2.5 cm) — comfy on the shoulder, even when top‑heavy with books or a laptop\n\n 	\nAvailable in multiple sizes, from compact (21″ strap) to extra large (29″ strap), so you pick what works for your daily haul\n\n 	\nEasy-care, machine-wash light cycle—just air dry or tumble low\n\n',
    150,
    'cd4a59bd-11c5-44b6-9b45-d68d471e3c29',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Inflatable Sofa - Single, One piece',
    'inflatable-sofa-single-one-piece',
    'Features:\n\n 	\nSoft flocked surface for added comfort when seated or napping\n\n 	\nMultiple inflation/deflation valves (fast fill and release)\n\n 	\nIntegrated backrest and armrests: lounge vibe guaranteed\n\n 	\nFolds down flat—easy to stash under beds or in cupboards when not in use \n\n',
    399,
    'cd4a59bd-11c5-44b6-9b45-d68d471e3c29',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Inflatable Sofa - Single, Two piece',
    'inflatable-sofa-single-two-piece',
    'Features:\n\n 	\nSoft flocked surface for added comfort when seated or napping\n\n 	\nMultiple inflation/deflation valves (fast fill and release)\n\n 	\nIntegrated backrest and armrests: lounge vibe guaranteed\n\n 	\nFolds down flat—easy to stash under beds or in cupboards when not in use \n\n',
    369,
    'cd4a59bd-11c5-44b6-9b45-d68d471e3c29',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Inflatable Sofa - Multifunctional, One piece',
    'inflatable-sofa-multifunctional-one-piece',
    'Features:\n\n 	\nSoft flocked surface for added comfort when seated or napping\n\n 	\nMultiple inflation/deflation valves (fast fill and release)\n\n 	\nIntegrated backrest and armrests: lounge vibe guaranteed\n\n 	\nFolds down flat—easy to stash under beds or in cupboards when not in use \n\n',
    465,
    'cd4a59bd-11c5-44b6-9b45-d68d471e3c29',
    NULL,
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();

INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    'Fast-Charge Cable',
    'fast-charge-cable',
    'Features:\n\n 	\nLightning Fast charging support up to 2.4 A with 480 Mbps data transfer speed — quicker than most campus café USB ports.\n\n 	\nHigh-quality construction: anti-oxidation aluminum alloy heads and high-density braided nylon body resist fraying and tangling.\n\n 	Wattage: 12W fast charging\n 	\n1 m length gives you just enough reach for desk setup or bedside charging without the clutter.\n\n 	\nSleek & tough: light yet sturdy (~25 g), packed compactly for easy tuck into bags.\n\n',
    59,
    'fbf1a69c-8894-40aa-b026-429e152aba72',
    ARRAY['https://jozistudenthub.co.za/wp-content/uploads/2025/07/IMG_20250719_132627.png','https://jozistudenthub.co.za/wp-content/uploads/2025/07/ba75275ab42ba555a92271314659690b.jpg'],
    50,
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();
