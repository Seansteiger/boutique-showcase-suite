import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get store settings
export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("storeSettings").first();
    if (!settings) {
      // Fallback configuration if not seeded yet
      return {
        brandName: "SCENTED",
        theme: {
          primaryColor: "141 29% 15%", // Botanical deep green
          secondaryColor: "30 20% 98%", // Soft cream
          accentColor: "45 64% 53%", // Champagne Gold
          fontFamily: "var(--font-playfair-display), Georgia, serif",
          buttonRadius: "2rem 0.5rem 2rem 0.5rem",
          borderWidth: "1px",
          shadowStyle: "ambient",
          cardStyle: "asymmetric",
          navbarStyle: "glass",
          pageTexture: "flat",
          hoverEffect: "zoom",
        },
        enabledWidgets: ["hero", "ticker", "onsale", "categories", "scent-discovery", "floating-whatsapp", "announcement-bar"],
        layoutOrder: ["hero", "ticker", "onsale", "categories"],
        currency: "ZAR",
        currencySymbol: "R",
        currencyMultiplier: 1,
        freeShippingThreshold: 1000,
        footerCopyright: "A tribute to botanical artistry and tactile olfactory balance.",
        showPaymentsAccepted: true,
        socialInstagram: "",
        socialFacebook: "",
        socialPinterest: "",
        socialWhatsapp: "",
        yocoPublicKey: "",
        yocoSecretKey: "",
        payfastMerchantId: "",
        customTexts: {
          heroTitle: "Atmospheric Elegance.",
          heroSubtitle: "The Awakening of Olfactive Purity",
          heroCtaText: "Explore The Curation",
          announcementBarText: "Complimentary worldwide botanical shipping on orders over R1000",
          whatsappNumber: "",
          whatsappMessage: "Hello, I need support with Scented products!",
        },
      };
    }
    return settings;
  },
});

// Update store settings (requires Super Admin role validation)
export const update = mutation({
  args: {
    brandName: v.string(),
    theme: v.object({
      primaryColor: v.string(),
      secondaryColor: v.string(),
      accentColor: v.optional(v.string()),
      fontFamily: v.string(),
      buttonRadius: v.string(),
      borderWidth: v.optional(v.string()),
      shadowStyle: v.optional(v.string()),
      cardStyle: v.optional(v.string()),
      navbarStyle: v.optional(v.string()),
      pageTexture: v.optional(v.string()),
      hoverEffect: v.optional(v.string()),
    }),
    enabledWidgets: v.array(v.string()),
    layoutOrder: v.array(v.string()),
    currency: v.optional(v.string()),
    currencySymbol: v.optional(v.string()),
    currencyMultiplier: v.optional(v.number()),
    freeShippingThreshold: v.optional(v.number()),
    footerCopyright: v.optional(v.string()),
    showPaymentsAccepted: v.optional(v.boolean()),
    socialInstagram: v.optional(v.string()),
    socialFacebook: v.optional(v.string()),
    socialPinterest: v.optional(v.string()),
    socialWhatsapp: v.optional(v.string()),
    yocoPublicKey: v.optional(v.string()),
    yocoSecretKey: v.optional(v.string()),
    payfastMerchantId: v.optional(v.string()),
    customTexts: v.optional(v.object({
      heroTitle: v.optional(v.string()),
      heroSubtitle: v.optional(v.string()),
      heroCtaText: v.optional(v.string()),
      announcementBarText: v.optional(v.string()),
      whatsappNumber: v.optional(v.string()),
      whatsappMessage: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // 1. Fetch current settings
    const current = await ctx.db.query("storeSettings").first();
    
    const patchData: any = {
      brandName: args.brandName,
      theme: args.theme,
      enabledWidgets: args.enabledWidgets,
      layoutOrder: args.layoutOrder,
      updatedAt: Date.now(),
    };

    if (args.currency) patchData.currency = args.currency;
    if (args.currencySymbol) patchData.currencySymbol = args.currencySymbol;
    if (args.currencyMultiplier) patchData.currencyMultiplier = args.currencyMultiplier;
    if (args.freeShippingThreshold !== undefined) patchData.freeShippingThreshold = args.freeShippingThreshold;
    if (args.footerCopyright !== undefined) patchData.footerCopyright = args.footerCopyright;
    if (args.showPaymentsAccepted !== undefined) patchData.showPaymentsAccepted = args.showPaymentsAccepted;
    if (args.socialInstagram !== undefined) patchData.socialInstagram = args.socialInstagram;
    if (args.socialFacebook !== undefined) patchData.socialFacebook = args.socialFacebook;
    if (args.socialPinterest !== undefined) patchData.socialPinterest = args.socialPinterest;
    if (args.socialWhatsapp !== undefined) patchData.socialWhatsapp = args.socialWhatsapp;
    if (args.yocoPublicKey !== undefined) patchData.yocoPublicKey = args.yocoPublicKey;
    if (args.yocoSecretKey !== undefined) patchData.yocoSecretKey = args.yocoSecretKey;
    if (args.payfastMerchantId !== undefined) patchData.payfastMerchantId = args.payfastMerchantId;
    if (args.customTexts) patchData.customTexts = args.customTexts;

    if (current) {
      await ctx.db.patch(current._id, patchData);
      return current._id;
    } else {
      const newId = await ctx.db.insert("storeSettings", {
        ...patchData,
        currency: args.currency || "ZAR",
        currencySymbol: args.currencySymbol || "R",
        currencyMultiplier: args.currencyMultiplier || 1,
        freeShippingThreshold: args.freeShippingThreshold || 1000,
        footerCopyright: args.footerCopyright || "A tribute to botanical artistry.",
        showPaymentsAccepted: args.showPaymentsAccepted !== undefined ? args.showPaymentsAccepted : true,
        socialInstagram: args.socialInstagram || "",
        socialFacebook: args.socialFacebook || "",
        socialPinterest: args.socialPinterest || "",
        socialWhatsapp: args.socialWhatsapp || "",
        yocoPublicKey: args.yocoPublicKey || "",
        yocoSecretKey: args.yocoSecretKey || "",
        payfastMerchantId: args.payfastMerchantId || "",
        customTexts: args.customTexts || {
          heroTitle: "Atmospheric Elegance.",
          heroSubtitle: "The Awakening of Olfactive Purity",
          heroCtaText: "Explore The Curation",
          announcementBarText: "Complimentary worldwide shipping on orders over R1000",
          whatsappNumber: "",
          whatsappMessage: "Hello, I need support with Scented products!",
        },
      });
      return newId;
    }
  },
});
