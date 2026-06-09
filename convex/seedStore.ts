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
      { name: "Hygiene & Care", slug: "hygiene", parentId: undefined }
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
            : cat.slug === "room-decor"
            ? "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600"
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

      // --- FOOD.CO BRAND PRODUCTS ---
      {
        title: "Volcanic Stone Frying Pan",
        slug: "volcanic-stone-frying-pan",
        description: "Heavy organic iron skillet coated with a triple layer of micro-cracked volcanic stone. Safe, chemical-free non-stick capabilities with perfect thermal distribution.",
        price: 950.00,
        salePrice: 850.00,
        categoryId: "kitchenware",
        stockQuantity: 22,
        isFeatured: true,
        features: ["Natural volcanic stone coating", "PFOA & PTFE-free construction", "Solid cast iron core structure", "Ergonomic oak-accent handle"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600"]
      },
      {
        title: "Ceramic Dutch Oven Pot",
        slug: "ceramic-dutch-oven-pot",
        description: "A gorgeous ceramic-coated dutch oven pot. Perfect for baking rustic sourdough loaves, slow simmering winter stews, and sealing natural nutrient profiles.",
        price: 1550.00,
        salePrice: undefined,
        categoryId: "kitchenware",
        stockQuantity: 15,
        isFeatured: false,
        features: ["Premium ceramic-enameled walls", "Condensed drip spikes inside lid", "High-heat resistant up to 260C", "Extra-wide structural loop handles"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600"]
      },
      {
        title: "Extra Virgin Cold-Pressed Olive Oil",
        slug: "cold-pressed-olive-oil",
        description: "Single-estate Coratina olives, harvested by hand and cold-pressed within 4 hours. Rich in polyphenols, presenting notes of fresh herbs, tomato vines, and peppery finish.",
        price: 320.00,
        salePrice: 280.00,
        categoryId: "pantry",
        stockQuantity: 45,
        isFeatured: false,
        features: ["500ml dark glass bottle protection", "Acidity levels below 0.2%", "Unfiltered, single estate batch", "Rich in heart-healthy polyphenols"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600"]
      },
      {
        title: "Organic Raw Lavender Honey",
        slug: "organic-lavender-honey",
        description: "Pure, cold-extracted honey gathered from organic French lavender fields. Delightfully thick and aromatic with soft floral undertones and a buttery texture.",
        price: 240.00,
        salePrice: undefined,
        categoryId: "pantry",
        stockQuantity: 35,
        isFeatured: false,
        features: ["Raw, unpasteurized honey", "Sourced from wild fields of Provence", "Rich in trace minerals & enzymes", "Sustainable bee-keeper protection"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600"]
      },
      {
        title: "Eco-Friendly Dishwashing Liquid",
        slug: "eco-dishwashing-liquid",
        description: "Highly concentrated plant-derived dish soap. Scented naturally with organic cold-pressed lime and rosemary essential oils. Tough on oils, gentle on skin.",
        price: 120.00,
        salePrice: 95.00,
        categoryId: "hygiene",
        stockQuantity: 50,
        isFeatured: false,
        features: ["100% plant-based surfactants", "Scented with pure essential oils", "Biodegradable, grey-water safe", "Cruelty-free formula"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=600"]
      },
      {
        title: "Unbleached Bamboo Toilet Tissue",
        slug: "bamboo-toilet-tissue",
        description: "Ultra soft, premium 3-ply toilet paper rolls formed from sustainably grown, unbleached organic bamboo. Free of chlorine, dyes, and chemical fragrances.",
        price: 180.00,
        salePrice: undefined,
        categoryId: "hygiene",
        stockQuantity: 40,
        isFeatured: false,
        features: ["100% forest-friendly bamboo", "Chlorine-free unbleached fibers", "3-ply ultra-absorbent texture", "Fully plastic-free packaging"],
        brand: "Food.co",
        status: "published",
        imageUrls: ["https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600"]
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
      { name: "Ocean Mist", subdomain: "ocean", preset: "ocean", sales: [2400, 1800, 3200, 1100, 2900] }
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
