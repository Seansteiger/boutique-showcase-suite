export interface ThemeSettings {
  brandName: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    buttonRadius: string;
    borderWidth: string;
    shadowStyle: string;
    cardStyle: string;
    navbarStyle: string;
    pageTexture: string;
    hoverEffect: string;
  };
  enabledWidgets: string[];
  layoutOrder: string[];
  currency: string;
  currencySymbol: string;
  currencyMultiplier: number;
  freeShippingThreshold: number;
  footerCopyright: string;
  showPaymentsAccepted: boolean;
  socialInstagram: string;
  socialFacebook: string;
  socialPinterest: string;
  socialWhatsapp: string;
  customTexts: {
    heroTitle: string;
    heroSubtitle: string;
    heroCtaText: string;
    announcementBarText: string;
    whatsappNumber: string;
    whatsappMessage: string;
  };
}

export const themePresets: Record<string, ThemeSettings> = {
  scented: {
    brandName: "SCENTED",
    theme: {
      primaryColor: "141 29% 15%", // Deep botanical green HSL
      secondaryColor: "30 20% 98%", // Soft organic cream HSL
      accentColor: "45 64% 53%", // Champagne gold HSL
      fontFamily: "var(--font-playfair-display), Georgia, serif",
      buttonRadius: "2rem 0.5rem 2rem 0.5rem", // Asymmetric leaf radius
      cardStyle: "asymmetric",
      borderWidth: "1px",
      shadowStyle: "ambient",
      navbarStyle: "glass",
      pageTexture: "flat",
      hoverEffect: "zoom",
    },
    enabledWidgets: [
      "cinematic-hero-loop",
      "bento-category-grid",
      "featured-curations",
      "app-header-blur",
      "native-bottom-nav",
      "magnetic-cart-drawer",
      "haptic-feedback-mock",
      "floating-whatsapp"
    ],
    layoutOrder: [
      "cinematic-hero-loop",
      "bento-category-grid",
      "featured-curations"
    ],
    currency: "ZAR",
    currencySymbol: "R",
    currencyMultiplier: 1.0,
    freeShippingThreshold: 1000,
    footerCopyright: "A tribute to botanical artistry and tactile olfactory balance.",
    showPaymentsAccepted: true,
    socialInstagram: "https://instagram.com/scented.boutique",
    socialFacebook: "",
    socialPinterest: "",
    socialWhatsapp: "+27821234567",
    customTexts: {
      heroTitle: "Atmospheric Elegance.",
      heroSubtitle: "Discover fragrances designed with the precision of nature. A tactile journey through scent, space, and time, crafted for the discerning soul.",
      heroCtaText: "Explore Collection",
      announcementBarText: "Complimentary worldwide shipping on orders over R1000",
      whatsappNumber: "+27821234567",
      whatsappMessage: "Hello! I need support with Scented products.",
    }
  },
  slate: {
    brandName: "SLATE & CO",
    theme: {
      primaryColor: "222 47% 11%", // Deep iron slate HSL
      secondaryColor: "210 40% 96%", // Crisp gray HSL
      accentColor: "221 83% 53%", // Tech cobalt blue HSL
      fontFamily: "var(--font-hanken-grotesk), sans-serif",
      buttonRadius: "8px", // Standard curves
      cardStyle: "curved",
      borderWidth: "1px",
      shadowStyle: "elevation",
      navbarStyle: "minimal",
      pageTexture: "flat",
      hoverEffect: "zoom",
    },
    enabledWidgets: [
      "hero",
      "ticker",
      "categories",
      "onsale",
      "app-header-blur",
      "native-bottom-nav",
      "magnetic-cart-drawer"
    ],
    layoutOrder: [
      "hero",
      "ticker",
      "categories",
      "onsale"
    ],
    currency: "ZAR",
    currencySymbol: "R",
    currencyMultiplier: 1.0,
    freeShippingThreshold: 750,
    footerCopyright: "Slate & Co. High-performance minimal gear for modern creators.",
    showPaymentsAccepted: true,
    socialInstagram: "https://instagram.com/slateandco",
    socialFacebook: "",
    socialPinterest: "",
    socialWhatsapp: "+27821234567",
    customTexts: {
      heroTitle: "Modern Architectural Gear.",
      heroSubtitle: "Engineered for minimalist workflows. Elegant, durable, and highly functional lifestyle items built for the modern lifestyle.",
      heroCtaText: "Shop the Catalog",
      announcementBarText: "Free premium nationwide delivery on all curated items",
      whatsappNumber: "+27821234567",
      whatsappMessage: "Hi, I have a question about Slate & Co gear.",
    }
  },
  editorial: {
    brandName: "L'ARTELIER",
    theme: {
      primaryColor: "0 0% 0%", // Stark high-contrast Black
      secondaryColor: "0 0% 100%", // Pure White HSL
      accentColor: "0 0% 50%", // Neutral Gray HSL
      fontFamily: "var(--font-playfair-display), Georgia, serif",
      buttonRadius: "0px", // Sharp flat edges
      cardStyle: "sharp",
      borderWidth: "2px", // Thick high-fashion borders
      shadowStyle: "none",
      navbarStyle: "editorial",
      pageTexture: "flat",
      hoverEffect: "zoom",
    },
    enabledWidgets: [
      "cinematic-hero-loop",
      "featured-curations",
      "categories",
      "app-header-blur",
      "native-bottom-nav",
      "magnetic-cart-drawer"
    ],
    layoutOrder: [
      "cinematic-hero-loop",
      "featured-curations",
      "categories"
    ],
    currency: "ZAR",
    currencySymbol: "R",
    currencyMultiplier: 1.0,
    freeShippingThreshold: 1500,
    footerCopyright: "L'Artelier © 2026. Unapologetic monochrome design.",
    showPaymentsAccepted: true,
    socialInstagram: "https://instagram.com/lartelier",
    socialFacebook: "",
    socialPinterest: "",
    socialWhatsapp: "",
    customTexts: {
      heroTitle: "Haute Couture Editorial.",
      heroSubtitle: "Monochromatic, bold, and high-fashion. A collection crafted for the uncompromising aesthetic vanguard of today.",
      heroCtaText: "Discover Pieces",
      announcementBarText: "L'Artelier: Exquisite apparel and premium scents",
      whatsappNumber: "",
      whatsappMessage: "",
    }
  },
  sandstone: {
    brandName: "OASIS CO",
    theme: {
      primaryColor: "20 50% 25%", // Terracotta earth HSL
      secondaryColor: "35 40% 96%", // Sandy warm HSL
      accentColor: "25 75% 50%", // Deep clay orange HSL
      fontFamily: "var(--font-playfair-display), Georgia, serif",
      buttonRadius: "8px",
      cardStyle: "curved",
      borderWidth: "1px",
      shadowStyle: "ambient",
      navbarStyle: "glass",
      pageTexture: "grain", // Luxury matte paper grain
      hoverEffect: "zoom",
    },
    enabledWidgets: [
      "cinematic-hero-loop",
      "bento-category-grid",
      "scent-discovery",
      "app-header-blur",
      "native-bottom-nav",
      "magnetic-cart-drawer"
    ],
    layoutOrder: [
      "cinematic-hero-loop",
      "bento-category-grid",
      "scent-discovery"
    ],
    currency: "ZAR",
    currencySymbol: "R",
    currencyMultiplier: 1.0,
    freeShippingThreshold: 1200,
    footerCopyright: "Oasis Co. Shaped by fire, earth, and soul.",
    showPaymentsAccepted: true,
    socialInstagram: "https://instagram.com/oasisco",
    socialFacebook: "",
    socialPinterest: "",
    socialWhatsapp: "+27821234567",
    customTexts: {
      heroTitle: "Sandstone Artisanal Home.",
      heroSubtitle: "Earth-fired pottery, bespoke leather goods, and organic scents shaped by ancient South African landscapes and tactile craftsmanship.",
      heroCtaText: "View Home Curations",
      announcementBarText: "Handcrafted in South Africa. Free shipping on orders over R1200.",
      whatsappNumber: "+27821234567",
      whatsappMessage: "Hello! I am interested in Oasis Co handcrafted products.",
    }
  },
  ocean: {
    brandName: "OCEAN MIST",
    theme: {
      primaryColor: "200 45% 12%", // Deep Navy ocean HSL
      secondaryColor: "190 30% 98%", // Seafoam white HSL
      accentColor: "180 60% 45%", // Mint teal HSL
      fontFamily: "var(--font-hanken-grotesk), sans-serif",
      buttonRadius: "9999px", // Pill shape
      cardStyle: "pill",
      borderWidth: "none",
      shadowStyle: "glow", // Subtle glowing shadows
      navbarStyle: "minimal",
      pageTexture: "mesh", // High-end gradient mesh overlay
      hoverEffect: "flash",
    },
    enabledWidgets: [
      "hero",
      "ticker",
      "onsale",
      "categories",
      "app-header-blur",
      "native-bottom-nav",
      "magnetic-cart-drawer"
    ],
    layoutOrder: [
      "hero",
      "ticker",
      "onsale",
      "categories"
    ],
    currency: "ZAR",
    currencySymbol: "R",
    currencyMultiplier: 1.0,
    freeShippingThreshold: 600,
    footerCopyright: "Ocean Mist. Rejuvenating minds and bodies daily.",
    showPaymentsAccepted: true,
    socialInstagram: "https://instagram.com/oceanmist",
    socialFacebook: "",
    socialPinterest: "",
    socialWhatsapp: "+27821234567",
    customTexts: {
      heroTitle: "Coastal Active & Wellness.",
      heroSubtitle: "Vibrant, clean, and rejuvenating formulas. Fresh activewear and coastal lifestyle curation for natural balance.",
      heroCtaText: "Start Fresh",
      announcementBarText: "Summer Sale: 20% off all coastal curations with code MIST20",
      whatsappNumber: "+27821234567",
      whatsappMessage: "Hi, I need support with Ocean Mist cosmetics.",
    }
  }
};
