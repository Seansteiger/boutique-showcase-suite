import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Seeding engine to instantly hydrate dynamic SaaS instances
export default mutation({
  args: {
    brandName: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    secondaryColor: v.optional(v.string()),
    accentColor: v.optional(v.string()),
    fontFamily: v.optional(v.string()),
    buttonRadius: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Default to SCENTED parameters for the Flagship Store
    const brand = args.brandName ?? "SCENTED";
    const primary = args.primaryColor ?? "#1b3022";
    const secondary = args.secondaryColor ?? "#fbf9f8";
    const accent = args.accentColor ?? "#d4af37";
    const font = args.fontFamily ?? "var(--font-hanken-grotesk), sans-serif";
    const radius = args.buttonRadius ?? "rounded-[2rem_0.5rem_2rem_0.5rem]";

    console.log(`Starting dynamic database hydration engine for luxury instance: "${brand}"...`);

    // 1. Seed Store settings
    const existingSettings = await ctx.db.query("storeSettings").first();
    const settingsPayload = {
      brandName: brand,
      theme: {
        primaryColor: primary,
        secondaryColor: secondary,
        accentColor: accent,
        fontFamily: font,
        buttonRadius: radius,
      },
      enabledWidgets: [
        "app-header-blur",
        "native-bottom-nav",
        "cinematic-hero-loop",
        "bento-category-grid",
        "interactive-fragrance-finder",
        "magnetic-cart-drawer",
        "haptic-feedback-mock"
      ],
      layoutOrder: [
        "cinematic-hero-loop",
        "bento-category-grid",
        "featured-curations"
      ],
      updatedAt: Date.now(),
    };

    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, settingsPayload);
      console.log("Updated existing store settings.");
    } else {
      await ctx.db.insert("storeSettings", settingsPayload);
      console.log("Seeded new visual configuration settings.");
    }

    // 2. Seed Luxury & Boutique Categories
    const categoriesList = [
      { name: "Les Parfums", slug: "les-parfums", parentId: undefined },
      { name: "Bougies Parfumées", slug: "bougies", parentId: undefined },
      { name: "Huiles Rituelles", slug: "huiles", parentId: undefined },
      { name: "Brumes Corporelles", slug: "brumes", parentId: undefined },
      { name: "Kitchenware", slug: "kitchenware", parentId: undefined },
      { name: "Room Decor", slug: "room-decor", parentId: undefined },
      { name: "Lifestyle", slug: "lifestyle", parentId: undefined },
      { name: "Artisanal Pantry", slug: "pantry", parentId: undefined },
      { name: "Hygiene & Care", slug: "hygiene", parentId: undefined },
      { name: "Fresh Produce", slug: "produce", parentId: undefined },
      { name: "Artisanal Bakery", slug: "bakery", parentId: undefined },
      { name: "Organic Dairy", slug: "dairy", parentId: undefined },
      { name: "Beverages", slug: "beverages", parentId: undefined },
      { name: "Furniture", slug: "furniture", parentId: undefined },
      { name: "Decor", slug: "decor", parentId: undefined },
      { name: "Books", slug: "books", parentId: undefined },
      { name: "Donation", slug: "donation", parentId: undefined }
    ];

    const slugToCategoryId: Record<string, string> = {};

    for (const cat of categoriesList) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", cat.slug))
        .first();

      if (existing) {
        slugToCategoryId[cat.slug] = existing._id.toString();
        console.log(`Category "${cat.name}" already exists.`);
      } else {
        const id = await ctx.db.insert("categories", {
          name: cat.name,
          slug: cat.slug,
          parentId: cat.parentId,
          imageUrl: cat.slug === "les-parfums" 
            ? "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600"
            : cat.slug === "kitchenware"
            ? "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600"
            : cat.slug === "room-decor" || cat.slug === "furniture"
            ? "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600"
            : cat.slug === "produce"
            ? "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600"
            : cat.slug === "bakery"
            ? "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600"
            : cat.slug === "dairy"
            ? "https://images.unsplash.com/photo-1528750901443-e9c17cc97604?q=80&w=600"
            : cat.slug === "beverages"
            ? "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600"
            : cat.slug === "pantry"
            ? "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600"
            : cat.slug === "decor"
            ? "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600"
            : cat.slug === "books"
            ? "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600"
            : cat.slug === "donation"
            ? "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=600"
            : "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600",
          createdAt: Date.now()
        });
        slugToCategoryId[cat.slug] = id.toString();
        console.log(`Seeded category: "${cat.name}"`);
      }
    }

    // 3. Clear existing catalog to prevent legacy clutter
    const existingProds = await ctx.db.query("products").collect();
    for (const p of existingProds) {
      await ctx.db.delete(p._id);
    }
    const existingVars = await ctx.db.query("product_variations").collect();
    for (const v of existingVars) {
      await ctx.db.delete(v._id);
    }

    // 4. Seed Multi-Boutique Products
    const productsList = [
      // --- SCENTED BRAND PRODUCTS ---
      {
        title: "Ratio 1.0 Eau de Parfum",
        slug: "ratio-1-0",
        description: "An exquisite, minimalist composition featuring notes of refreshing Italian Bergamot, pure White Tea, and warm earthy Oakmoss. Inspired by natural botanical balance.",
        price: 1850.00,
        salePrice: 1650.00,
        categoryId: "les-parfums",
        stockQuantity: 25,
        isFeatured: true,
        features: ["100ml / 3.4 FL.OZ.", "High-concentration Extrait de Parfum", "Hand-labeled in Grasse, France", "Premium organic minimalist bottle"],
        brand: "SCENTED",
        status: "published",
        imageUrls: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD7zgen8w3OqE9kK1qVkGjkaWKrKZcz7Z2tEBcJGAQbcoSPJTtjTxuuZ8mbCmlaBxuo9rxa750Neihex2thoQByfUJET9MJ6BgdB44P0Fkn_M1aohIyZgy6XduOy2OWRsJ0aro1JUcwCAUE-wsoh_3NQy9MIaxN8-w-vODBFiYFAuHOmWys8ElMFYhL6jBUv9lOyk11m8fSsor_Cuk7kP36i6sbsgkaTvg2w-ik8JFK__EIZ-g03fmg33Y_mHuFZY5Uirk1xXLMc_PE",
          "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600"
        ]
      },
      {
        title: "Ratio 1.1 Vetiver Cœur Eau de Parfum",
        slug: "ratio-1-1-vetiver-coeur",
        description: "An earthy, sharp essence constructed around Haitian vetiver, crushed pink peppercorns, dry cedar logs, and fresh green lemon leaves.",
        price: 1950.00,
        salePrice: undefined,
        categoryId: "les-parfums",
        stockQuantity: 20,
        isFeatured: false,
        features: ["100ml / 3.4 FL.OZ.", "Rich wood-peppercorn fusion", "Distilled rosewood and cedar oil extract"],
        brand: "SCENTED",
        status: "published",
        imageUrls: [
          "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600"
        ]
      },
      {
        title: "Ratio 3.4 Botanical Candle",
        slug: "ratio-3-4-candle",
        description: "Elevate your sensory space with our hand-poured coconut wax candle. Warm sandalwood, dry cedarwood, leather accord, and organic cotton wick.",
        price: 950.00,
        salePrice: 850.00,
        categoryId: "bougies",
        stockQuantity: 50,
        isFeatured: true,
        features: ["300g / 10.5 OZ.", "60+ hours clean burn time", "Soy-coconut eco-wax blend", "Obsidian glass container"],
        brand: "SCENTED",
        status: "published",
        imageUrls: [
          "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600"
        ]
      },

      // --- HOME. BRAND PRODUCTS ---
      {
        title: "Architectural Espresso Maker",
        slug: "architectural-espresso-maker",
        description: "Multi-stage thermal PID controller and pressure gauge embedded inside a solid volcanic stone chassis. Acoustic-dampened rotary pump runs silently under 35dB.",
        price: 4200.00,
        salePrice: 3800.00,
        categoryId: "kitchenware",
        stockQuantity: 12,
        isFeatured: true,
        features: ["Whisper-quiet rotary pump", "Dual boiler system", "Matte volcanic stone exterior", "PID temperature stability"],
        brand: "Home.",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600"]
      },
      {
        title: "Precision Gooseneck Kettle",
        slug: "precision-gooseneck-kettle",
        description: "An elegant, counterbalanced gooseneck kettle engineered for premium coffee and tea brewing. High-diffusion steel shell with precise 1-degree temp selections.",
        price: 1850.00,
        salePrice: undefined,
        categoryId: "kitchenware",
        stockQuantity: 18,
        isFeatured: false,
        features: ["LCD temperature screen", "1200 Watts fast boiling", "60-minute heat hold", "Grade-304 food stainless steel"],
        brand: "Home.",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600"]
      },
      {
        title: "Minimalist Smart Blender",
        slug: "minimalist-smart-blender",
        description: "Seamless cylindrical blender with haptic touch interface and soundproof enclosure dome. High-torque 1400W motor processes inputs smoothly.",
        price: 2450.00,
        salePrice: 2100.00,
        categoryId: "kitchenware",
        stockQuantity: 15,
        isFeatured: false,
        features: ["Noise insulation dome cover", "Laser-cut steel blades", "10-speed touch dial slide", "Self-cleaning program cycle"],
        brand: "Home.",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1578643463396-0997cb5328c1?q=80&w=600"]
      },
      {
        title: "Cast Iron Multi-Cooker",
        slug: "cast-iron-multi-cooker",
        description: "A heavy-duty slow cooker combining architectural design with volcanic enamel-coated heavy cast iron. Retains optimal moisture levels via drip-spikes.",
        price: 3200.00,
        salePrice: undefined,
        categoryId: "kitchenware",
        stockQuantity: 8,
        isFeatured: false,
        features: ["Heavy enamel-coated cast iron", "Intelligent PID heat element", "12-hour timer program", "Sealed airtight silicone gasket"],
        brand: "Home.",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600"]
      },

      // --- FURNISH. BRAND PRODUCTS ---
      {
        title: "Minimalist Bouclé Sofa",
        slug: "minimalist-boucle-sofa",
        description: "Architectural low-profile sofa upholstered in luxurious custom Belgian bouclé fabric. Supported by raw oak wood block feet and reinforced double-dowel wood joinery.",
        price: 18500.00,
        salePrice: 16500.00,
        categoryId: "room-decor",
        stockQuantity: 5,
        isFeatured: true,
        features: ["Heavy Belgian bouclé weave", "Solid kiln-dried oak frame", "High-density structural core foam", "0px sharp perimeter edges"],
        brand: "Furnish.",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600"]
      },
      {
        title: "Solid Oak Lounge Chair",
        slug: "solid-oak-lounge-chair",
        description: "A sculptural, hand-finished lounge chair showcasing raw solid oak and natural matte finishings. Perfectly angled for ergonomic relaxation.",
        price: 8500.00,
        salePrice: undefined,
        categoryId: "room-decor",
        stockQuantity: 7,
        isFeatured: false,
        features: ["Handcrafted in solid white oak", "Mortise and tenon joinery", "Organic wax protective coating", "Asymmetric architectural profile"],
        brand: "Furnish.",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600"]
      },
      {
        title: "Brushed Brass Floor Lamp",
        slug: "brushed-brass-floor-lamp",
        description: "Minimalist slender lighting fixture made from brushed champagne brass. Fitted with a translucent organic paper shade to emit a warm, diffused, architectural glow.",
        price: 2900.00,
        salePrice: 2500.00,
        categoryId: "room-decor",
        stockQuantity: 14,
        isFeatured: false,
        features: ["Brushed solid brass stem", "Hand-folded mulberry paper shade", "Weighted travertine base", "Foot-pedal dimmer toggle"],
        brand: "Furnish.",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600"]
      },
      {
        title: "Hand-Woven Wool Rug",
        slug: "hand-woven-wool-rug",
        description: "A heavy, double-woven rug in undyed organic wool. Features a high-texture, structural ribbed weave to ground open-plan architectural spaces.",
        price: 5800.00,
        salePrice: undefined,
        categoryId: "lifestyle",
        stockQuantity: 10,
        isFeatured: false,
        features: ["100% natural organic wool", "Double-thick flatweave weave", "Undyed, chemical-free processing", "Ethically sourced from high-altitude farms"],
        brand: "Furnish.",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=600"]
      },
      {
        title: "Organic Linen Cushion",
        slug: "organic-linen-cushion",
        description: "Heavyweight Belgian flax linen cushion filled with premium down feathers. Hand-finished with raw edges to emphasize organic materiality.",
        price: 650.00,
        salePrice: 550.00,
        categoryId: "lifestyle",
        stockQuantity: 30,
        isFeatured: false,
        features: ["100% organic Belgian flax linen", "Filled with ethical down feathers", "Invisible bottom zipper closure", "Breathable, high-density weave"],
        brand: "Furnish.",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600"]
      },

      // --- FOOD.CO BRAND PRODUCTS (30 Grocery Items) ---
      {
        title: "Cold-Pressed Extra Virgin Olive Oil",
        slug: "cold-pressed-olive-oil",
        description: "Premium single-estate Coratina olives, cold-pressed within hours of harvest. Exceptionally low acidity with a vibrant, peppery finish.",
        price: 320.00,
        salePrice: 280.00,
        categoryId: "pantry",
        stockQuantity: 45,
        isFeatured: true,
        features: ["500ml dark glass bottle", "Acidity below 0.2%", "Rich in antioxidants"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600"]
      },
      {
        title: "Raw Wildflower Blossom Honey",
        slug: "raw-wildflower-honey",
        description: "100% pure, unfiltered and cold-extracted honey gathered from local organic wildflower fields. Thick, aromatic, and naturally sweet.",
        price: 195.00,
        salePrice: undefined,
        categoryId: "pantry",
        stockQuantity: 35,
        isFeatured: true,
        features: ["350g glass jar", "Raw & unpasteurized", "Sourced from local apiaries"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600"]
      },
      {
        title: "Aged Balsamic Vinegar of Modena",
        slug: "aged-balsamic-vinegar",
        description: "Authentic balsamic vinegar matured in oak casks. Rich, syrup-like density with a complex balance of sweet and tangy wood notes.",
        price: 240.00,
        salePrice: undefined,
        categoryId: "pantry",
        stockQuantity: 28,
        isFeatured: false,
        features: ["250ml bottle", "Aged for 12 years", "Modena IGP certified"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1620980753066-e82201b17b2b?q=80&w=600"]
      },
      {
        title: "Organic White Truffle Oil",
        slug: "organic-white-truffle-oil",
        description: "Fragrant extra virgin olive oil infused with the intense essence of rare white truffles. Perfect for finishing pasta, risottos, and fries.",
        price: 450.00,
        salePrice: 380.00,
        categoryId: "pantry",
        stockQuantity: 15,
        isFeatured: true,
        features: ["100ml bottle", "Infused with real white truffles", "Bespoke culinary grade"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=600"]
      },
      {
        title: "Fleur de Sel Sea Salt Flakes",
        slug: "fleur-de-sel-salt",
        description: "Delicate, hand-harvested sea salt crystals from coastal salt pans. Adds a clean, crunchy texture and mineral-rich finishing touch.",
        price: 85.00,
        salePrice: undefined,
        categoryId: "pantry",
        stockQuantity: 60,
        isFeatured: false,
        features: ["150g linen pouch", "100% natural finishing salt", "Rich in trace minerals"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1604838604753-f4c9700d4809?q=80&w=600"]
      },
      {
        title: "Organic Maple Syrup Grade A",
        slug: "organic-maple-syrup",
        description: "Pure dark maple syrup harvested from Canadian maple forests. Rich, robust flavour that perfectly sweetens pancakes and desserts.",
        price: 180.00,
        salePrice: 155.00,
        categoryId: "pantry",
        stockQuantity: 30,
        isFeatured: false,
        features: ["250ml glass bottle", "100% pure maple sap", "Grade A Dark Robust"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=600"]
      },
      {
        title: "Artisanal Sourdough Boule",
        slug: "artisanal-sourdough-boule",
        description: "Naturally fermented sourdough loaf baked on stone deck ovens. Crisp, blistered crust with a soft, open crumb and classic tangy crumb.",
        price: 70.00,
        salePrice: undefined,
        categoryId: "bakery",
        stockQuantity: 20,
        isFeatured: true,
        features: ["800g freshly baked loaf", "24-hour slow fermentation", "Stone-ground flour"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600"]
      },
      {
        title: "All-Butter French Croissants",
        slug: "butter-french-croissants",
        description: "Traditional flaky croissants laminated with premium cultured butter. Crispy on the outside, light and airy on the inside.",
        price: 85.00,
        salePrice: 75.00,
        categoryId: "bakery",
        stockQuantity: 25,
        isFeatured: true,
        features: ["Pack of 4 croissants", "Laminated with 84% butter fat", "Baked daily"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600"]
      },
      {
        title: "Sourdough Cinnamon Rolls",
        slug: "sourdough-cinnamon-rolls",
        description: "Soft cinnamon buns crafted from enriched sweet sourdough, loaded with Ceylon cinnamon, and finished with a light vanilla glaze.",
        price: 90.00,
        salePrice: undefined,
        categoryId: "bakery",
        stockQuantity: 18,
        isFeatured: false,
        features: ["Pack of 2 large rolls", "Rich organic glaze", "Wild yeast dough"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600"]
      },
      {
        title: "Gluten-Free Seeded Loaf",
        slug: "gluten-free-seeded-loaf",
        description: "A dense, nutrient-packed gluten-free bread loaded with organic pumpkin, sunflower, and flax seeds for a rich, nutty flavor.",
        price: 80.00,
        salePrice: undefined,
        categoryId: "bakery",
        stockQuantity: 15,
        isFeatured: false,
        features: ["500g sliced loaf", "Gluten-free certified", "High in dietary fiber"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600"]
      },
      {
        title: "Heirloom Tomato Selection",
        slug: "heirloom-tomato-selection",
        description: "A colorful medley of vine-ripened organic heirloom tomatoes. Exceptionally sweet, juicy, and perfect for salads and caprese.",
        price: 65.00,
        salePrice: 55.00,
        categoryId: "produce",
        stockQuantity: 40,
        isFeatured: true,
        features: ["500g mixed pack", "Locally grown & organic", "Hand-harvested at peak ripeness"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1595855759920-86582396756a?q=80&w=600"]
      },
      {
        title: "Organic Haas Avocados",
        slug: "organic-haas-avocados",
        description: "Premium buttery Haas avocados. Perfectly creamy texture, ideal for making fresh guacamole or spreading on sourdough toast.",
        price: 75.00,
        salePrice: undefined,
        categoryId: "produce",
        stockQuantity: 30,
        isFeatured: true,
        features: ["Pack of 3 avocados", "Certified organic", "Rich in healthy monounsaturated fats"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=600"]
      },
      {
        title: "Fresh Wild Blueberries",
        slug: "fresh-wild-blueberries",
        description: "Plump, sweet wild blueberries packed with antioxidants. Great for breakfast bowls, smoothies, or baking pies.",
        price: 60.00,
        salePrice: undefined,
        categoryId: "produce",
        stockQuantity: 35,
        isFeatured: false,
        features: ["150g punnet", "Antioxidant-rich superfood", "Sourced from eco-friendly growers"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=80&w=600"]
      },
      {
        title: "Organic Sweet Baby Spinach",
        slug: "organic-baby-spinach",
        description: "Tender, pre-washed organic baby spinach leaves. Perfect base for healthy green smoothies, salads, or quick pan sautés.",
        price: 40.00,
        salePrice: 32.00,
        categoryId: "produce",
        stockQuantity: 50,
        isFeatured: false,
        features: ["200g bag", "Triple-washed & ready to eat", "High in iron and vitamins"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=600"]
      },
      {
        title: "Gala Apple Variety",
        slug: "gala-apple-variety",
        description: "Crisp, sweet organic Gala apples. Mild flavor with thin skin, making them the perfect fresh snack for any time of the day.",
        price: 45.00,
        salePrice: undefined,
        categoryId: "produce",
        stockQuantity: 45,
        isFeatured: false,
        features: ["1kg bag (approx. 6 apples)", "Grown in organic orchards", "Excellent source of fiber"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600"]
      },
      {
        title: "Organic Unsweetened Almond Milk",
        slug: "organic-almond-milk",
        description: "Creamy plant-based milk made from organic sprouted almonds. Absolutely free of gums, thickeners, or added sweeteners.",
        price: 55.00,
        salePrice: undefined,
        categoryId: "dairy",
        stockQuantity: 40,
        isFeatured: false,
        features: ["1L carton", "Zero additives or stabilizers", "Dairy-free & vegan friendly"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1568651343853-2198ec004909?q=80&w=600"]
      },
      {
        title: "Aged Grass-Fed Cheddar Cheese",
        slug: "aged-grassfed-cheddar",
        description: "Sharp cheddar cheese aged for 18 months, made from pasture-raised grass-fed cows. Exceptional depth of rich dairy flavor.",
        price: 110.00,
        salePrice: 95.00,
        categoryId: "dairy",
        stockQuantity: 25,
        isFeatured: true,
        features: ["250g block", "18-month slow aging", "Pasture-raised milk source"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1618164435735-413d3b066c9a?q=80&w=600"]
      },
      {
        title: "Salted Pasture Butter",
        slug: "salted-pasture-butter",
        description: "Rich, creamy butter churned from fresh pasture cream and sprinkled with delicate sea salt. Elevates any piece of warm toast.",
        price: 65.00,
        salePrice: undefined,
        categoryId: "dairy",
        stockQuantity: 35,
        isFeatured: false,
        features: ["250g block", "Minimum 82% milk fat", "Sprinkled with sea salt flakes"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=600"]
      },
      {
        title: "Organic Greek Yogurt 1kg",
        slug: "organic-greek-yogurt",
        description: "Thick, strained organic Greek yogurt with live active cultures. Rich in protein and probiotics with a deliciously smooth taste.",
        price: 75.00,
        salePrice: 65.00,
        categoryId: "dairy",
        stockQuantity: 30,
        isFeatured: false,
        features: ["1kg tub", "Double-strained for extra thickness", "Live bacterial probiotics"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600"]
      },
      {
        title: "Single-Origin Espresso Roast",
        slug: "single-origin-espresso",
        description: "Light-medium roast espresso beans sourced from organic Colombian high-altitude farms. Notes of cocoa, brown sugar, and orange peel.",
        price: 195.00,
        salePrice: undefined,
        categoryId: "beverages",
        stockQuantity: 40,
        isFeatured: true,
        features: ["500g whole beans", "High-altitude Arabica variety", "Direct trade sourcing"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600"]
      },
      {
        title: "Ceremonial Grade Matcha Powder",
        slug: "ceremonial-matcha-powder",
        description: "Pure stone-ground green tea leaves sourced from Uji, Kyoto. Extremely rich in L-theanine for calm, sustained daytime focus.",
        price: 290.00,
        salePrice: 260.00,
        categoryId: "beverages",
        stockQuantity: 20,
        isFeatured: true,
        features: ["30g tin", "First-harvest young tea leaves", "Vibrant emerald green color"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600"]
      },
      {
        title: "Cold Brew Coffee Concentrate",
        slug: "coldbrew-coffee-concentrate",
        description: "Slow-steeped organic coffee concentrate. Incredibly smooth and low-acid, perfect for mixing with water or milk over ice.",
        price: 135.00,
        salePrice: undefined,
        categoryId: "beverages",
        stockQuantity: 24,
        isFeatured: false,
        features: ["750ml glass bottle", "Steeped for 18 hours", "100% organic beans"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600"]
      },
      {
        title: "Premium Loose Leaf Earl Grey",
        slug: "premium-earl-grey",
        description: "Whole-leaf organic black tea scented with oil of Italian bergamot. A robust tea blend that offers a classic citrus fragrance.",
        price: 95.00,
        salePrice: undefined,
        categoryId: "beverages",
        stockQuantity: 30,
        isFeatured: false,
        features: ["100g loose leaf tin", "Cold-pressed bergamot oil", "Rich in natural flavonoids"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600"]
      },
      {
        title: "Sparkling Apple Cider",
        slug: "sparkling-apple-cider",
        description: "Non-alcoholic sparkling cider pressed from organic honeycrisp apples. Crisp, bubbly, and festive without any added sugar.",
        price: 90.00,
        salePrice: 80.00,
        categoryId: "beverages",
        stockQuantity: 28,
        isFeatured: false,
        features: ["750ml bottle", "No sugar added", "100% organic apples"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1608885898957-a599fb15653c?q=80&w=600"]
      },
      {
        title: "Organic Quinoa Grain 1kg",
        slug: "organic-quinoa-grain",
        description: "Triple-rinsed organic white quinoa grains. A complete plant protein that cooks up light and fluffy in just 15 minutes.",
        price: 80.00,
        salePrice: undefined,
        categoryId: "pantry",
        stockQuantity: 35,
        isFeatured: false,
        features: ["1kg pouch", "Saponin-free pre-washed", "Complete vegan amino acid profile"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600"]
      },
      {
        title: "Bronze-Cut Spaghetti Pasta",
        slug: "bronze-cut-spaghetti",
        description: "Artisanal pasta extruded through traditional bronze dies to create a rough texture that holds onto pasta sauces beautifully.",
        price: 45.00,
        salePrice: undefined,
        categoryId: "pantry",
        stockQuantity: 50,
        isFeatured: false,
        features: ["500g bag", "100% durum semolina flour", "Slow-dried at low heat"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=600"]
      },
      {
        title: "Raw Unsalted Almonds",
        slug: "raw-unsalted-almonds",
        description: "Crunchy, premium raw almonds harvested from local organic almond orchards. A nutritious and healthy high-protein snack.",
        price: 120.00,
        salePrice: 105.00,
        categoryId: "pantry",
        stockQuantity: 40,
        isFeatured: false,
        features: ["500g pack", "100% raw and natural", "Heart-healthy vitamin E"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1508061461508-cb18c242f556?q=80&w=600"]
      },
      {
        title: "Organic Extra Virgin Coconut Oil",
        slug: "organic-coconut-oil",
        description: "Cold-pressed organic virgin coconut oil. Offers a fresh coconut aroma and taste, perfect for healthy baking and cooking.",
        price: 130.00,
        salePrice: undefined,
        categoryId: "pantry",
        stockQuantity: 32,
        isFeatured: false,
        features: ["500ml jar", "Unrefined & cold-pressed", "Made from fresh organic coconuts"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?q=80&w=600"]
      },
      {
        title: "Artisanal Seed & Oat Crackers",
        slug: "seed-oat-crackers",
        description: "Crisp, stone-baked oat crackers loaded with sunflower, sesame, and poppy seeds. Perfectly complements cheese boards.",
        price: 55.00,
        salePrice: undefined,
        categoryId: "bakery",
        stockQuantity: 30,
        isFeatured: false,
        features: ["200g box", "Stone-baked grain base", "Loaded with super-seeds"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=600"]
      },
      {
        title: "Dark Chocolate Sea Salt Bars",
        slug: "dark-chocolate-sea-salt",
        description: "Rich 70% dark Belgian chocolate blended with crispy sea salt crystals. An elegant, balanced treat for dark chocolate lovers.",
        price: 70.00,
        salePrice: 60.00,
        categoryId: "pantry",
        stockQuantity: 45,
        isFeatured: false,
        features: ["Pack of 3 bars (80g each)", "70% single-origin cacao", "Sprinkled with sea salt"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1549007994-cb92ca47fe46?q=80&w=600"]
      },
      {
        title: "Vintage Oak Sideboard",
        slug: "vintage-oak-sideboard",
        description: "Beautifully restored mid-century oak sideboard with brass hardware.",
        price: 450.00,
        salePrice: undefined,
        categoryId: "furniture",
        stockQuantity: 5,
        isFeatured: true,
        features: ["Restored mid-century solid oak", "Brass hardware accents", "Two storage cabinets and three drawers"],
        brand: "Hotel Hope",
        status: "published",
        imageUrls: ["https://lh3.googleusercontent.com/aida/AP1WRLuT9IYxmrBcH1G7VXNvkYHNErdL8enk7WAN2gpAT3_Shu66GifxEdF3UVW3ZxbnYz_wOwvfas7aG5CxuWAr1vMW5pKij21mY_v9HPSsBZ0fZHAoxeIC3jUMTcxA6k_db67XA12RD_-ZED2kSCKOOLQJC3tE9G0uxQKLNOriEWw_Tj-81r98xP9I3j3gxrM7XkLSjvy95ymHy8im00YSDUy7swEuI7zsnDEMYIggUFK1CFHucdhruQ6HxIlC"]
      },
      {
        title: "Handwoven Throw Blanket",
        slug: "handwoven-throw-blanket",
        description: "Locally sourced, organic cotton throw in warm earth tones.",
        price: 65.00,
        salePrice: undefined,
        categoryId: "decor",
        stockQuantity: 15,
        isFeatured: true,
        features: ["100% organic cotton", "Naturally dyed fibers", "Tassel edges"],
        brand: "Hotel Hope",
        status: "published",
        imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDn81XAIw6ATdHS8W2yRzO9sLhcEhgrcRRf-8XV0xLqW4QcdbOGqouA42dseEBiTwn-rwDu6yghOqH_42kD7ooi8gDHOaUBEuXRoHf04aniF7qx3yVHkySba8EhA4w42ImbqIt2bREMHGHuZyd4PKF33CZAIPbzgqT7Y0uJ_CDujaV04KYll9kEW0V-QR2RghfD40jtDBXJ_3gep6LOi_46AkelNGCFEXccdxE0tEU9y1oZ0co_NQMc1ADfLwEsYms5vThRcOjkHYTK"]
      },
      {
        title: "Antique Classic Literature Set",
        slug: "antique-literature-set",
        description: "A beautiful 5-piece collection of classic literature with leather bindings.",
        price: 120.00,
        salePrice: undefined,
        categoryId: "books",
        stockQuantity: 2,
        isFeatured: false,
        features: ["Leather-bound hardcovers", "Gold foil design detail", "Collectible classics"],
        brand: "Hotel Hope",
        status: "published",
        imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBFo_1VkwivgNOKeTVjVq1T2zd4X33FiPm8tqJj5U9xXNzropcwVXkslW3H-q0gxpqWtuG4_dNsZPIx1SItPmw22RFWpn0-4YFbU89KNL2oSdvHWUgieX0rUPqIasOtVhWucvetLXUVfEQdMjOSREG_Fv11m-of-Dz3bli4CeEPjhtzi7xc19MWtbgpHElD3X_jApM_bwdGOU98LWl4PtFZtYolTmiCbeawE_bBSlM7umSCI7yydTInbiIZCFUIybPK2wvDqC8E7yZ2"]
      },
      {
        title: "Ceramic Table Lamp",
        slug: "ceramic-table-lamp",
        description: "Hand-glazed ceramic lamp providing a warm, ambient glow.",
        price: 85.00,
        salePrice: undefined,
        categoryId: "decor",
        stockQuantity: 8,
        isFeatured: false,
        features: ["Hand-glazed stoneware", "Travertine cream style finish", "Linen shade included"],
        brand: "Hotel Hope",
        status: "published",
        imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDFv2gfLRvdQ9K-bFkM1rpXDc3mUZreZoJTWibOz5cDEAnUdTICq_IgzJVMkwRe8zjgF1x7RfCsO1rsTCYchDLHpvPf0v6uhR0J4OPXWR3PFdSMWdlCgxys0mWI5inzzZcsI_wmm_Q3VNtlyUgrArG7IoXLPowEWbgdu055Vw5h4fJH6h-SpX2GSvgXux0cqiwd-QpxdgvyoYlFVCp7APdu5d5cDOHmVNCqSgC18wVw5jfKFT_9-tsdOakEmaPImoBzNeObQopaZa97"]
      },
      {
        title: "Handwoven Storage Basket",
        slug: "handwoven-storage-basket",
        description: "Empowering mothers in crisis through local artisanal weaving.",
        price: 350.00,
        salePrice: undefined,
        categoryId: "decor",
        stockQuantity: 20,
        isFeatured: false,
        features: ["Handcrafted from elephant grass", "Durable handles", "Direct community support product"],
        brand: "Hotel Hope",
        status: "published",
        imageUrls: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCoJVbnrnP4IkRHh_ySbGb9lWbbYvRs8wU_qa5JIMwTibsT9rS_DrwtKE9pNiV8FL_1PB3GVZ9zdzLit9TYecQlO5iM2-y2eU3T_fD9SMkWdwsZG-O9xjhXUETVv5jcr44WWBu7IH7RgMf6sjRZCop7YjMO0luUunWwi6c0NrIn0eTuKMEO93fiborcHxq-XFcIRrlDzTN7a65GoaVfoU-8-MZqbm6bPW1z8GbERD0wANn0dhGYFvfxJ8S81RNDtTHoEm33lYfj7Ji3"]
      },
      {
        title: "Provide a Week of Formula",
        slug: "donation-week-of-formula",
        description: "Direct support for abandoned babies to cover critical early feeding needs.",
        price: 200.00,
        salePrice: undefined,
        categoryId: "donation",
        stockQuantity: 9999,
        isFeatured: false,
        features: ["Provides formula for one baby for 7 days", "Purchase goes 100% directly to Nursery program"],
        brand: "Hotel Hope",
        status: "published",
        imageUrls: []
      }
    ];

    for (const prod of productsList) {
      const categoryRef = slugToCategoryId[prod.categoryId] || prod.categoryId;
      const productId = await ctx.db.insert("products", {
        title: prod.title,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        salePrice: prod.salePrice,
        categoryId: categoryRef,
        imageUrls: prod.imageUrls,
        stockQuantity: prod.stockQuantity,
        isFeatured: prod.isFeatured,
        features: prod.features,
        brand: prod.brand,
        status: prod.status,
        createdAt: Date.now()
      });

      // Seed variations for products
      await ctx.db.insert("product_variations", {
        productId: productId.toString(),
        attributes: { "Size": "Standard" },
        price: prod.price,
        stockQuantity: prod.stockQuantity,
        createdAt: Date.now()
      });
      console.log(`Seeded product: "${prod.title}" for brand: "${prod.brand}"`);
    }

    // 5. Seed Default Active Ads (Luxury fragrance-themed)
    const existingAds = await ctx.db.query("ads").collect();
    for (const ad of existingAds) {
      await ctx.db.delete(ad._id);
    }
    await ctx.db.insert("ads", {
      title: "LES PARFUMS D'EXCEPTION",
      subtitle: "Experience rare olfactive moments and bespoke perfume extraits curated by world-renowned French noses. Free premium delivery on all orders.",
      imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000",
      link: "/shop",
      isActive: true,
      type: "banner",
      createdAt: Date.now()
    });
    console.log("Seeded luxury sensory promotion banner ads.");

    // 6. Seed default admin accounts mapping in Profiles
    const existingProfiles = await ctx.db.query("profiles").collect();
    if (existingProfiles.length === 0) {
      await ctx.db.insert("profiles", {
        userId: "admin-user-id-12345",
        fullName: "Aura Director (Super Admin)",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        role: "super_admin",
        updatedAt: Date.now()
      });
      await ctx.db.insert("profiles", {
        userId: "manager-user-id-67890",
        fullName: "Boutique Manager (Store Manager)",
        avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
        role: "manager",
        updatedAt: Date.now()
      });
      console.log("Seeded luxury Boutique managers and Director profiles.");
    }

    // 7. Seed SaaS Multi-Store Tenants & Tenant Orders
    const existingTenants = await ctx.db.query("tenants").collect();
    for (const t of existingTenants) {
      await ctx.db.delete(t._id);
    }

    const tenantPresets = [
      { name: "Scented Flagship", subdomain: "scented", preset: "scented", sales: [1800, 2400, 1100, 4300, 1500] },
      { name: "Slate & Co", subdomain: "slate", preset: "slate", sales: [3400, 1200, 5600, 2100, 4800, 1900] },
      { name: "L'Artelier Boutique", subdomain: "editorial", preset: "editorial", sales: [8500, 12000, 6500, 9300] },
      { name: "Oasis Co", subdomain: "sandstone", preset: "sandstone", sales: [1200, 2300, 1500, 3100, 900] },
      { name: "Ocean Mist", subdomain: "ocean", preset: "ocean", sales: [2400, 1800, 3200, 1100, 2900] },
      { name: "Hotel Hope Store", subdomain: "hhm", preset: "hhm", sales: [450, 120, 630, 350, 200] }
    ];

    for (const tp of tenantPresets) {
      const themeOverrides = tp.preset === "slate" ? {
        primaryColor: "215 25% 27%",
        secondaryColor: "210 40% 98%",
        accentColor: "215 16% 47%",
        fontFamily: "var(--font-hanken-grotesk), sans-serif",
        buttonRadius: "8px",
        borderWidth: "1px",
        shadowStyle: "elevation",
        cardStyle: "curved",
        pageTexture: "flat"
      } : tp.preset === "editorial" ? {
        primaryColor: "0 0% 0%",
        secondaryColor: "0 0% 100%",
        accentColor: "0 0% 50%",
        fontFamily: "var(--font-playfair-display), Georgia, serif",
        buttonRadius: "0px",
        borderWidth: "2px",
        shadowStyle: "none",
        cardStyle: "sharp",
        pageTexture: "mesh"
      } : tp.preset === "sandstone" ? {
        primaryColor: "24 54% 26%",
        secondaryColor: "35 32% 96%",
        accentColor: "28 67% 44%",
        fontFamily: "var(--font-playfair-display), Georgia, serif",
        buttonRadius: "1.5rem",
        borderWidth: "none",
        shadowStyle: "ambient",
        cardStyle: "curved",
        pageTexture: "grain"
      } : tp.preset === "ocean" ? {
        primaryColor: "194 45% 24%",
        secondaryColor: "185 30% 97%",
        accentColor: "190 70% 46%",
        fontFamily: "var(--font-hanken-grotesk), sans-serif",
        buttonRadius: "9999px",
        borderWidth: "1px",
        shadowStyle: "ambient",
        cardStyle: "pill",
        pageTexture: "flat"
      } : tp.preset === "hhm" ? {
        primaryColor: "#984800",
        secondaryColor: "#FFF9F0",
        accentColor: "#E87D2E",
        fontFamily: "var(--font-libre-caslon-text), serif",
        buttonRadius: "9999px",
        borderWidth: "1px",
        shadowStyle: "ambient",
        cardStyle: "curved",
        pageTexture: "flat"
      } : {
        primaryColor: "141 29% 15%",
        secondaryColor: "30 20% 98%",
        accentColor: "45 64% 53%",
        fontFamily: "var(--font-playfair-display), Georgia, serif",
        buttonRadius: "2rem 0.5rem 2rem 0.5rem",
        borderWidth: "1px",
        shadowStyle: "ambient",
        cardStyle: "asymmetric",
        pageTexture: "flat"
      };

      await ctx.db.insert("tenants", {
        name: tp.name,
        subdomain: tp.subdomain,
        preset: tp.preset,
        status: "active",
        themeOverrides,
        customTexts: {
          heroTitle: tp.name + " Collection",
          heroSubtitle: "Experience our handcrafted visual preset design customizer details."
        },
        createdAt: Date.now()
      });

      // Seed orders for this tenant to populate charts
      for (let i = 0; i < tp.sales.length; i++) {
        await ctx.db.insert("orders", {
          userId: "customer-otp-seed-" + i,
          tenantId: tp.subdomain,
          status: "completed",
          total: tp.sales[i],
          shippingAddress: {
            firstName: "SaaS Client",
            lastName: "Buyer " + i,
            email: "client" + i + "@example.com",
            address: "123 Seed Street, Johannesburg",
            phone: "+2782123456" + i
          },
          createdAt: Date.now() - (tp.sales.length - i) * 24 * 60 * 60 * 1000
        });
      }
    }
    console.log("Seeded SaaS Multi-Store tenant accounts and simulated historical order analytics.");
    console.log("Convex automated database hydration completed successfully.");
    return { success: true };
  },
});
