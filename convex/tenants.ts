import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. Get all tenants list
export const getAllTenants = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tenants").collect();
  },
});

// 2. Resolve single tenant metadata by subdomain
export const getTenantBySubdomain = query({
  args: { subdomain: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tenants")
      .withIndex("by_subdomain", (q) => q.eq("subdomain", args.subdomain))
      .first();
  },
});

// 3. Create/Provision new tenant store instance
export const createTenant = mutation({
  args: {
    name: v.string(),
    subdomain: v.string(),
    customDomain: v.optional(v.string()),
    preset: v.string(), // "scented" | "slate" | "editorial" | "sandstone" | "ocean"
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tenants")
      .withIndex("by_subdomain", (q) => q.eq("subdomain", args.subdomain))
      .first();

    if (existing) {
      throw new Error(`Subdomain "${args.subdomain}" is already taken.`);
    }

    // Set initial custom settings overrides based on selected preset
    let themeOverrides = {};
    let customTexts = {};

    if (args.preset === "slate") {
      themeOverrides = {
        primaryColor: "215 25% 27%",
        secondaryColor: "210 40% 98%",
        accentColor: "215 16% 47%",
        fontFamily: "var(--font-hanken-grotesk), sans-serif",
        buttonRadius: "8px",
        borderWidth: "1px",
        shadowStyle: "elevation",
        cardStyle: "curved",
        pageTexture: "flat",
      };
      customTexts = {
        heroTitle: "Sleek Modern Performance.",
        heroSubtitle: "Engineered tools and apparel for high-performance productivity.",
        heroCtaText: "Upgrade Setup",
        announcementBarText: "Free shipping nationwide on Slate core packs.",
      };
    } else if (args.preset === "editorial") {
      themeOverrides = {
        primaryColor: "0 0% 0%",
        secondaryColor: "0 0% 100%",
        accentColor: "0 0% 50%",
        fontFamily: "var(--font-playfair-display), Georgia, serif",
        buttonRadius: "0px",
        borderWidth: "2px",
        shadowStyle: "none",
        cardStyle: "sharp",
        pageTexture: "mesh",
      };
      customTexts = {
        heroTitle: "Stark Stark Luxury.",
        heroSubtitle: "Minimalist fashion curation. Defined outlines, bold borders.",
        heroCtaText: "Enter Gallery",
        announcementBarText: "Pre-order L'Artelier Winter collection now.",
      };
    } else if (args.preset === "sandstone") {
      themeOverrides = {
        primaryColor: "24 54% 26%",
        secondaryColor: "35 32% 96%",
        accentColor: "28 67% 44%",
        fontFamily: "var(--font-playfair-display), Georgia, serif",
        buttonRadius: "1.5rem",
        borderWidth: "none",
        shadowStyle: "ambient",
        cardStyle: "curved",
        pageTexture: "grain",
      };
      customTexts = {
        heroTitle: "Warm Earth Artisan.",
        heroSubtitle: "Clayware, custom leathers, and botanical oils shaped with soul.",
        heroCtaText: "Shop Handcrafted",
        announcementBarText: "Complimentary custom calligraphy card with all gifts.",
      };
    } else if (args.preset === "ocean") {
      themeOverrides = {
        primaryColor: "194 45% 24%",
        secondaryColor: "185 30% 97%",
        accentColor: "190 70% 46%",
        fontFamily: "var(--font-hanken-grotesk), sans-serif",
        buttonRadius: "9999px",
        borderWidth: "1px",
        shadowStyle: "ambient",
        cardStyle: "pill",
        pageTexture: "flat",
      };
      customTexts = {
        heroTitle: "Coastal Refresh.",
        heroSubtitle: "Activewear and organic scents inspired by tidal mist.",
        heroCtaText: "Refresh Routine",
        announcementBarText: "Get 15% off during our tidal launch event.",
      };
    } else {
      // Default: Scented
      themeOverrides = {
        primaryColor: "141 29% 15%",
        secondaryColor: "30 20% 98%",
        accentColor: "45 64% 53%",
        fontFamily: "var(--font-playfair-display), Georgia, serif",
        buttonRadius: "2rem 0.5rem 2rem 0.5rem",
        borderWidth: "1px",
        shadowStyle: "ambient",
        cardStyle: "asymmetric",
        pageTexture: "flat",
      };
      customTexts = {
        heroTitle: "Atmospheric Elegance.",
        heroSubtitle: "A sensory awakening through botanical curation.",
        heroCtaText: "Explore Atelier",
        announcementBarText: "Complimentary worldwide botanical shipping on orders over R1000",
      };
    }

    const tenantId = await ctx.db.insert("tenants", {
      name: args.name,
      subdomain: args.subdomain,
      customDomain: args.customDomain,
      preset: args.preset,
      status: "active",
      themeOverrides,
      customTexts,
      createdAt: Date.now(),
    });

    return tenantId.toString();
  },
});

// 4. Update tenant themes/copy from builder
export const updateTenantSettings = mutation({
  args: {
    id: v.id("tenants"),
    name: v.string(),
    customDomain: v.optional(v.string()),
    themeOverrides: v.any(),
    customTexts: v.any(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patchData: any = {
      name: args.name,
      customDomain: args.customDomain,
      themeOverrides: args.themeOverrides,
      customTexts: args.customTexts,
    };
    if (args.status) {
      patchData.status = args.status;
    }
    await ctx.db.patch(args.id, patchData);
    return true;
  },
});

// 5. Toggle tenant active/suspended status
export const toggleTenantStatus = mutation({
  args: { id: v.id("tenants"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return true;
  },
});

// 6. Delete a tenant (clean up)
export const deleteTenant = mutation({
  args: { id: v.id("tenants") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});

// 7. Get Tenant Analytics & Sales (Simulated stats compiler)
export const getTenantAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const tenants = await ctx.db.query("tenants").collect();
    const allOrders = await ctx.db.query("orders").collect();

    // Map metrics for each tenant
    const analytics = tenants.map((tenant) => {
      const tenantOrders = allOrders.filter(
        (o) => o.tenantId === tenant.subdomain || o.tenantId === tenant._id.toString()
      );
      
      const grossRevenue = tenantOrders.reduce((sum, o) => sum + o.total, 0);
      const orderCount = tenantOrders.length;
      const avgOrderValue = orderCount > 0 ? grossRevenue / orderCount : 0;
      
      // Calculate MRR subscription fees generated (R299/mo)
      const mrr = tenant.status === "active" ? 299 : 0;
      
      // Platform Fee yield (let's assume a 1.5% fee on transaction totals)
      const platformFees = grossRevenue * 0.015;

      return {
        tenantId: tenant._id.toString(),
        subdomain: tenant.subdomain,
        name: tenant.name,
        grossRevenue,
        orderCount,
        avgOrderValue,
        mrr,
        platformFees,
      };
    });

    return analytics;
  },
});
