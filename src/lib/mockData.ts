export const MOCK_SETTINGS = {
  brandName: "SCENTED",
  primaryColor: "#1b3022",
  secondaryColor: "#fbf9f8",
  accentColor: "#d4af37",
  fontFamily: "var(--font-hanken-grotesk), sans-serif",
  buttonRadius: "rounded-[2rem_0.5rem_2rem_0.5rem]",
  enabledWidgets: [
    "app-header-blur",
    "native-bottom-nav",
    "cinematic-hero-loop",
    "bento-category-grid",
    "magnetic-cart-drawer",
    "haptic-feedback-mock"
  ],
  layoutOrder: [
    "cinematic-hero-loop",
    "bento-category-grid",
    "featured-curations"
  ]
};

export const MOCK_CATEGORIES = [
  // Fragrance categories
  {
    id: "les-parfums",
    name: "Les Parfums",
    slug: "les-parfums",
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600",
    parentId: null,
    createdAt: Date.now()
  },
  {
    id: "bougies",
    name: "Bougies Parfumées",
    slug: "bougies",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600",
    parentId: null,
    createdAt: Date.now()
  },
  {
    id: "huiles",
    name: "Huiles Rituelles",
    slug: "huiles",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
    parentId: null,
    createdAt: Date.now()
  },
  {
    id: "brumes",
    name: "Brumes Corporelles",
    slug: "brumes",
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600",
    parentId: null,
    createdAt: Date.now()
  },
  // Home. & Food.co categories
  {
    id: "kitchenware",
    name: "Kitchenware",
    slug: "kitchenware",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600",
    parentId: null,
    createdAt: Date.now()
  },
  // Furnish. categories
  {
    id: "room-decor",
    name: "Room Decor",
    slug: "room-decor",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600",
    parentId: null,
    createdAt: Date.now()
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    slug: "lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600",
    parentId: null,
    createdAt: Date.now()
  },
  // Food.co additional categories
  {
    id: "pantry",
    name: "Artisanal Pantry",
    slug: "pantry",
    imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=600",
    parentId: null,
    createdAt: Date.now()
  },
  {
    id: "hygiene",
    name: "Hygiene & Care",
    slug: "hygiene",
    imageUrl: "https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=600",
    parentId: null,
    createdAt: Date.now()
  }
];

export const MOCK_PRODUCTS = [
  // --- SCENTED BRAND PRODUCTS (Perfumes/Candles/Mists) ---
  {
    id: "ratio-1-0",
    name: "Ratio 1.0 Eau de Parfum",
    title: "Ratio 1.0 Eau de Parfum",
    slug: "ratio-1-0",
    status: "published",
    description: "An exquisite, minimalist composition featuring notes of refreshing Italian Bergamot, pure White Tea, and warm earthy Oakmoss. Inspired by natural botanical balance.",
    price: 1850.00,
    salePrice: 1650.00,
    category: "Les Parfums",
    categorySlug: "les-parfums",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7zgen8w3OqE9kK1qVkGjkaWKrKZcz7Z2tEBcJGAQbcoSPJTtjTxuuZ8mbCmlaBxuo9rxa750Neihex2thoQByfUJET9MJ6BgdB44P0Fkn_M1aohIyZgy6XduOy2OWRsJ0aro1JUcwCAUE-wsoh_3NQy9MIaxN8-w-vODBFiYFAuHOmWys8ElMFYhL6jBUv9lOyk11m8fSsor_Cuk7kP36i6sbsgkaTvg2w-ik8JFK__EIZ-g03fmg33Y_mHuFZY5Uirk1xXLMc_PE",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7zgen8w3OqE9kK1qVkGjkaWKrKZcz7Z2tEBcJGAQbcoSPJTtjTxuuZ8mbCmlaBxuo9rxa750Neihex2thoQByfUJET9MJ6BgdB44P0Fkn_M1aohIyZgy6XduOy2OWRsJ0aro1JUcwCAUE-wsoh_3NQy9MIaxN8-w-vODBFiYFAuHOmWys8ElMFYhL6jBUv9lOyk11m8fSsor_Cuk7kP36i6sbsgkaTvg2w-ik8JFK__EIZ-g03fmg33Y_mHuFZY5Uirk1xXLMc_PE",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600"
    ],
    imageUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7zgen8w3OqE9kK1qVkGjkaWKrKZcz7Z2tEBcJGAQbcoSPJTtjTxuuZ8mbCmlaBxuo9rxa750Neihex2thoQByfUJET9MJ6BgdB44P0Fkn_M1aohIyZgy6XduOy2OWRsJ0aro1JUcwCAUE-wsoh_3NQy9MIaxN8-w-vODBFiYFAuHOmWys8ElMFYhL6jBUv9lOyk11m8fSsor_Cuk7kP36i6sbsgkaTvg2w-ik8JFK__EIZ-g03fmg33Y_mHuFZY5Uirk1xXLMc_PE",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600"
    ],
    stock: 25,
    features: ["100ml / 3.4 FL.OZ.", "High-concentration Extrait de Parfum", "Hand-labeled in Grasse, France", "Premium organic minimalist bottle"],
    brand: "SCENTED",
    categoryId: "les-parfums"
  },
  {
    id: "ratio-1-1",
    name: "Ratio 1.1 Vetiver Cœur Eau de Parfum",
    title: "Ratio 1.1 Vetiver Cœur Eau de Parfum",
    slug: "ratio-1-1-vetiver-coeur",
    status: "published",
    description: "An earthy, sharp essence constructed around Haitian vetiver, crushed pink peppercorns, dry cedar logs, and fresh green lemon leaves.",
    price: 1950.00,
    salePrice: null,
    category: "Les Parfums",
    categorySlug: "les-parfums",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600"
    ],
    imageUrls: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600"
    ],
    stock: 20,
    features: ["100ml / 3.4 FL.OZ.", "Rich wood-peppercorn fusion", "Distilled rosewood and cedar oil extract"],
    brand: "SCENTED",
    categoryId: "les-parfums"
  },
  {
    id: "ratio-3-4",
    name: "Ratio 3.4 Botanical Candle",
    title: "Ratio 3.4 Botanical Candle",
    slug: "ratio-3-4-candle",
    status: "published",
    description: "An elegant, comforting candle presenting earthy Spiced Cedarwood, fresh Siberian Pine needles, and dynamic warm Clove notes. Perfect for evening atmospheres.",
    price: 680.00,
    salePrice: null,
    category: "Bougies Parfumées",
    categorySlug: "bougies",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600"
    ],
    imageUrls: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600"
    ],
    stock: 45,
    features: ["220g / 7.8 OZ.", "100% natural soy and coconut wax blend", "Staggered double cotton wick", "50+ hours clean burning time"],
    brand: "SCENTED",
    categoryId: "bougies"
  },

  // --- HOME. BRAND PRODUCTS (Premium Kitchen Appliances) ---
  {
    id: "home-espresso-maker",
    name: "Architectural Espresso Maker",
    title: "Architectural Espresso Maker",
    slug: "architectural-espresso-maker",
    status: "published",
    description: "Multi-stage thermal PID controller and pressure gauge embedded inside a solid volcanic stone chassis. Acoustic-dampened rotary pump runs silently under 35dB.",
    price: 4200.00,
    salePrice: 3800.00,
    category: "Kitchenware",
    categorySlug: "kitchenware",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600"],
    stock: 12,
    features: ["Whisper-quiet rotary pump", "Dual boiler system", "Matte volcanic stone exterior", "PID temperature stability"],
    brand: "Home.",
    categoryId: "kitchenware"
  },
  {
    id: "home-precision-kettle",
    name: "Precision Gooseneck Kettle",
    title: "Precision Gooseneck Kettle",
    slug: "precision-gooseneck-kettle",
    status: "published",
    description: "An elegant, counterbalanced gooseneck kettle engineered for premium coffee and tea brewing. High-diffusion steel shell with precise 1-degree temp selections.",
    price: 1850.00,
    salePrice: null,
    category: "Kitchenware",
    categorySlug: "kitchenware",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600"],
    stock: 18,
    features: ["LCD temperature screen", "1200 Watts fast boiling", "60-minute heat hold", "Grade-304 food stainless steel"],
    brand: "Home.",
    categoryId: "kitchenware"
  },
  {
    id: "home-minimal-blender",
    name: "Minimalist Smart Blender",
    title: "Minimalist Smart Blender",
    slug: "minimalist-smart-blender",
    status: "published",
    description: "Seamless cylindrical blender with haptic touch interface and soundproof enclosure dome. High-torque 1400W motor processes inputs smoothly.",
    price: 2450.00,
    salePrice: 2100.00,
    category: "Kitchenware",
    categorySlug: "kitchenware",
    image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1578643463396-0997cb5328c1?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1578643463396-0997cb5328c1?q=80&w=600"],
    stock: 15,
    features: ["Noise insulation dome cover", "Laser-cut steel blades", "10-speed touch dial slide", "Self-cleaning program cycle"],
    brand: "Home.",
    categoryId: "kitchenware"
  },
  {
    id: "home-cast-cooker",
    name: "Cast Iron Multi-Cooker",
    title: "Cast Iron Multi-Cooker",
    slug: "cast-iron-multi-cooker",
    status: "published",
    description: "A heavy-duty slow cooker combining architectural design with volcanic enamel-coated heavy cast iron. Retains optimal moisture levels via drip-spikes.",
    price: 3200.00,
    salePrice: null,
    category: "Kitchenware",
    categorySlug: "kitchenware",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600"],
    stock: 8,
    features: ["Heavy enamel-coated cast iron", "Intelligent PID heat element", "12-hour timer program", "Sealed airtight silicone gasket"],
    brand: "Home.",
    categoryId: "kitchenware"
  },

  // --- FURNISH. BRAND PRODUCTS (Luxury Sculptural Furniture) ---
  {
    id: "furnish-boucle-sofa",
    name: "Minimalist Bouclé Sofa",
    title: "Minimalist Bouclé Sofa",
    slug: "minimalist-boucle-sofa",
    status: "published",
    description: "Architectural low-profile sofa upholstered in luxurious custom Belgian bouclé fabric. Supported by raw oak wood block feet and reinforced double-dowel wood joinery.",
    price: 18500.00,
    salePrice: 16500.00,
    category: "Room Decor",
    categorySlug: "room-decor",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600"],
    stock: 5,
    features: ["Heavy Belgian bouclé weave", "Solid kiln-dried oak frame", "High-density structural core foam", "0px sharp visual perimeter edges"],
    brand: "Furnish.",
    categoryId: "room-decor"
  },
  {
    id: "furnish-lounge-chair",
    name: "Solid Oak Lounge Chair",
    title: "Solid Oak Lounge Chair",
    slug: "solid-oak-lounge-chair",
    status: "published",
    description: "A sculptural, hand-finished lounge chair showcasing raw solid oak and natural matte finishings. Perfectly angled for ergonomic relaxation.",
    price: 8500.00,
    salePrice: null,
    category: "Room Decor",
    categorySlug: "room-decor",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600"],
    stock: 7,
    features: ["Handcrafted in solid white oak", "Mortise and tenon joinery", "Organic wax protective coating", "Asymmetric architectural profile"],
    brand: "Furnish.",
    categoryId: "room-decor"
  },
  {
    id: "furnish-floor-lamp",
    name: "Brushed Brass Floor Lamp",
    title: "Brushed Brass Floor Lamp",
    slug: "brushed-brass-floor-lamp",
    status: "published",
    description: "Minimalist slender lighting fixture made from brushed champagne brass. Fitted with a translucent organic paper shade to emit a warm, diffused, architectural glow.",
    price: 2900.00,
    salePrice: 2500.00,
    category: "Room Decor",
    categorySlug: "room-decor",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600"],
    stock: 14,
    features: ["Brushed solid brass stem", "Hand-folded mulberry paper shade", "Weighted travertine stone base", "Foot-pedal dimmer toggle"],
    brand: "Furnish.",
    categoryId: "room-decor"
  },
  {
    id: "furnish-wool-rug",
    name: "Hand-Woven Wool Rug",
    title: "Hand-Woven Wool Rug",
    slug: "hand-woven-wool-rug",
    status: "published",
    description: "A heavy, double-woven rug in undyed organic wool. Features a high-texture, structural ribbed weave to ground open-plan architectural spaces.",
    price: 5800.00,
    salePrice: null,
    category: "Lifestyle",
    categorySlug: "lifestyle",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=600"],
    stock: 10,
    features: ["100% natural organic wool", "Double-thick flatweave weave", "Undyed, chemical-free processing", "Ethically sourced from high-altitude farms"],
    brand: "Furnish.",
    categoryId: "lifestyle"
  },
  {
    id: "furnish-linen-cushion",
    name: "Organic Linen Cushion",
    title: "Organic Linen Cushion",
    slug: "organic-linen-cushion",
    status: "published",
    description: "Heavyweight Belgian flax linen cushion filled with premium down feathers. Hand-finished with raw edges to emphasize organic materiality.",
    price: 650.00,
    salePrice: 550.00,
    category: "Lifestyle",
    categorySlug: "lifestyle",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600"],
    stock: 30,
    features: ["100% organic Belgian flax linen", "Filled with ethical down feathers", "Invisible bottom zipper closure", "Breathable, high-density weave"],
    brand: "Furnish.",
    categoryId: "lifestyle"
  },

  // --- FOOD.CO BRAND PRODUCTS (Artisanal Kitchenware & Organic Pantry) ---
  {
    id: "food-frying-pan",
    name: "Volcanic Stone Frying Pan",
    title: "Volcanic Stone Frying Pan",
    slug: "volcanic-stone-frying-pan",
    status: "published",
    description: "Heavy organic iron skillet coated with a triple layer of micro-cracked volcanic stone. Safe, chemical-free non-stick capabilities with perfect thermal distribution.",
    price: 950.00,
    salePrice: 850.00,
    category: "Kitchenware",
    categorySlug: "kitchenware",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600"],
    stock: 22,
    features: ["Natural volcanic stone coating", "PFOA & PTFE-free construction", "Solid cast iron core structure", "Ergonomic oak-accent handle"],
    brand: "Food.co",
    categoryId: "kitchenware"
  },
  {
    id: "food-dutch-oven",
    name: "Ceramic Dutch Oven Pot",
    title: "Ceramic Dutch Oven Pot",
    slug: "ceramic-dutch-oven-pot",
    status: "published",
    description: "A gorgeous ceramic-coated dutch oven pot. Perfect for baking rustic sourdough loaves, slow simmering winter stews, and sealing natural nutrient profiles.",
    price: 1550.00,
    salePrice: null,
    category: "Kitchenware",
    categorySlug: "kitchenware",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600"],
    stock: 15,
    features: ["Premium ceramic-enameled walls", "Condensed drip spikes inside lid", "High-heat resistant up to 260C", "Extra-wide structural loop handles"],
    brand: "Food.co",
    categoryId: "kitchenware"
  },
  {
    id: "food-olive-oil",
    name: "Extra Virgin Cold-Pressed Olive Oil",
    title: "Extra Virgin Cold-Pressed Olive Oil",
    slug: "cold-pressed-olive-oil",
    status: "published",
    description: "Single-estate Coratina olives, harvested by hand and cold-pressed within 4 hours. Rich in polyphenols, presenting notes of fresh herbs, tomato vines, and peppery finish.",
    price: 320.00,
    salePrice: 280.00,
    category: "Pantry",
    categorySlug: "pantry",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600"],
    stock: 45,
    features: ["500ml dark glass bottle protection", "Acidity levels below 0.2%", "Unfiltered, single estate batch", "Rich in heart-healthy polyphenols"],
    brand: "Food.co",
    categoryId: "pantry"
  },
  {
    id: "food-lavender-honey",
    name: "Organic Raw Lavender Honey",
    title: "Organic Raw Lavender Honey",
    slug: "organic-lavender-honey",
    status: "published",
    description: "Pure, cold-extracted honey gathered from organic French lavender fields. Delightfully thick and aromatic with soft floral undertones and a buttery texture.",
    price: 240.00,
    salePrice: null,
    category: "Pantry",
    categorySlug: "pantry",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600"],
    stock: 35,
    features: ["Raw, unpasteurized honey", "Sourced from wild fields of Provence", "Rich in trace minerals & enzymes", "Sustainable bee-keeper protection"],
    brand: "Food.co",
    categoryId: "pantry"
  },
  {
    id: "food-washing-liquid",
    name: "Eco-Friendly Dishwashing Liquid",
    title: "Eco-Friendly Dishwashing Liquid",
    slug: "eco-dishwashing-liquid",
    status: "published",
    description: "Highly concentrated plant-derived dish soap. Scented naturally with organic cold-pressed lime and rosemary essential oils. Tough on oils, gentle on skin.",
    price: 120.00,
    salePrice: 95.00,
    category: "Hygiene",
    categorySlug: "hygiene",
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=600"],
    stock: 50,
    features: ["100% plant-based surfactants", "Scented with pure essential oils", "Biodegradable, grey-water safe", "Cruelty-free botanical formula"],
    brand: "Food.co",
    categoryId: "hygiene"
  },
  {
    id: "food-toilet-tissue",
    name: "Unbleached Bamboo Toilet Tissue",
    title: "Unbleached Bamboo Toilet Tissue",
    slug: "bamboo-toilet-tissue",
    status: "published",
    description: "Ultra soft, premium 3-ply toilet paper rolls formed from sustainably grown, unbleached organic bamboo. Free of chlorine, dyes, and chemical fragrances.",
    price: 180.00,
    salePrice: null,
    category: "Hygiene",
    categorySlug: "hygiene",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600",
    images: ["https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600"],
    imageUrls: ["https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600"],
    stock: 40,
    features: ["100% forest-friendly bamboo", "Chlorine-free unbleached fibers", "3-ply ultra-absorbent texture", "Fully plastic-free packaging"],
    brand: "Food.co",
    categoryId: "hygiene"
  }
];

export const MOCK_ADS = [
  {
    id: "banner-1",
    title: "LES PARFUMS D'EXCEPTION",
    subtitle: "Experience rare olfactive moments and bespoke perfume extraits curated by world-renowned French noses. Free premium delivery on all orders.",
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000",
    link: "/shop",
    isActive: true,
    type: "banner",
    createdAt: Date.now()
  }
];
