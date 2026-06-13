import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { themePresets, ThemeSettings } from "./themePresets";
import { headers } from "next/headers";

export async function getStoreSettings(previewOverride?: string): Promise<ThemeSettings> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
  
  // 1. Resolve host subdomain if no preview override is active
  let resolvedSubdomain = previewOverride;
  let requestPathname = "";
  try {
    const headersList = await headers();
    if (!resolvedSubdomain) {
      resolvedSubdomain = headersList.get("x-subdomain") || "";
      if (!resolvedSubdomain) {
        const host = headersList.get("host") || "";
        if (host) {
          const parts = host.split(".");
          if (parts.length >= 3) {
            const firstPart = parts[0].toLowerCase();
            if (firstPart !== "www" && firstPart !== "admin" && firstPart !== "super-admin") {
              resolvedSubdomain = firstPart;
            }
          }
        }
      }
    }
    requestPathname = headersList.get("x-pathname") || "";
  } catch (e) {
    // Ignore if headers() is called in a static generation or layout framework shell context
  }

  // 1.5. Detect brand name based on subdomain or pathname path
  let detectedBrandName = "";
  const lowercasePath = requestPathname.toLowerCase();
  const lowercaseSub = (resolvedSubdomain || "").toLowerCase();

  if (lowercasePath.startsWith("/food-co") || lowercaseSub === "foodco" || lowercaseSub === "food-co") {
    detectedBrandName = "Food.co";
  } else if (lowercasePath.startsWith("/furnish") || lowercaseSub === "furnish") {
    detectedBrandName = "Furnish";
  } else if (lowercasePath.startsWith("/home-appliances") || lowercaseSub === "home-appliances") {
    detectedBrandName = "Home Appliances";
  } else if (lowercasePath.startsWith("/invited") || lowercaseSub === "invited") {
    detectedBrandName = "Invited";
  } else if (lowercasePath.startsWith("/scented") || lowercaseSub === "scented") {
    detectedBrandName = "SCENTED";
  } else if (lowercasePath.startsWith("/hhm") || lowercaseSub === "hhm") {
    detectedBrandName = "Hotel Hope Store";
  }

  // 2. Load baseline settings from Convex (so we keep operational values like API keys, currency rules, etc.)
  let dbSettings: any = null;
  try {
    if (convexUrl && convexUrl.startsWith("http")) {
      const convexHttp = new ConvexHttpClient(convexUrl);
      dbSettings = await convexHttp.query(api.settings.get);
    }
  } catch (e) {
    console.error("Failed to load baseline Convex settings:", e);
  }

  // 3. Query tenant from database if subdomain is resolved
  let tenant: any = null;
  if (resolvedSubdomain) {
    try {
      if (convexUrl && convexUrl.startsWith("http")) {
        const convexHttp = new ConvexHttpClient(convexUrl);
        tenant = await convexHttp.query(api.tenants.getTenantBySubdomain, {
          subdomain: resolvedSubdomain.toLowerCase()
        });
      }
    } catch (e) {
      console.error(`Failed to load database settings for tenant "${resolvedSubdomain}":`, e);
    }
  }

  // 4. Build standard baseline fallback
  const baseSettings: ThemeSettings = {
    brandName: detectedBrandName || dbSettings?.brandName || "SCENTED",
    theme: {
      primaryColor: dbSettings?.theme?.primaryColor || "141 29% 15%",
      secondaryColor: dbSettings?.theme?.secondaryColor || "30 20% 98%",
      accentColor: dbSettings?.theme?.accentColor || "45 64% 53%",
      fontFamily: dbSettings?.theme?.fontFamily || "var(--font-playfair-display), Georgia, serif",
      buttonRadius: dbSettings?.theme?.buttonRadius || "2rem 0.5rem 2rem 0.5rem",
      borderWidth: dbSettings?.theme?.borderWidth || "1px",
      shadowStyle: dbSettings?.theme?.shadowStyle || "ambient",
      cardStyle: dbSettings?.theme?.cardStyle || "asymmetric",
      navbarStyle: dbSettings?.theme?.navbarStyle || "glass",
      pageTexture: dbSettings?.theme?.pageTexture || "flat",
      hoverEffect: dbSettings?.theme?.hoverEffect || "zoom",
    },
    enabledWidgets: dbSettings?.enabledWidgets || [
      "cinematic-hero-loop",
      "bento-category-grid",
      "featured-curations",
      "app-header-blur",
      "native-bottom-nav",
      "magnetic-cart-drawer",
      "haptic-feedback-mock",
      "floating-whatsapp"
    ],
    layoutOrder: dbSettings?.layoutOrder || [
      "cinematic-hero-loop",
      "bento-category-grid",
      "featured-curations"
    ],
    currency: dbSettings?.currency || "ZAR",
    currencySymbol: dbSettings?.currencySymbol || "R",
    currencyMultiplier: dbSettings?.currencyMultiplier !== undefined ? dbSettings?.currencyMultiplier : 1.0,
    freeShippingThreshold: dbSettings?.freeShippingThreshold !== undefined ? dbSettings?.freeShippingThreshold : 1000,
    footerCopyright: dbSettings?.footerCopyright || "A tribute to botanical artistry and tactile olfactory balance.",
    showPaymentsAccepted: dbSettings?.showPaymentsAccepted !== false,
    socialInstagram: dbSettings?.socialInstagram || "",
    socialFacebook: dbSettings?.socialFacebook || "",
    socialPinterest: dbSettings?.socialPinterest || "",
    socialWhatsapp: dbSettings?.socialWhatsapp || "",
    customTexts: {
      heroTitle: dbSettings?.customTexts?.heroTitle || "Atmospheric Elegance.",
      heroSubtitle: dbSettings?.customTexts?.heroSubtitle || "Discover fragrances designed with the precision of nature.",
      heroCtaText: dbSettings?.customTexts?.heroCtaText || "Explore Collection",
      announcementBarText: dbSettings?.customTexts?.announcementBarText || "Complimentary worldwide shipping on orders over R1000",
      whatsappNumber: dbSettings?.customTexts?.whatsappNumber || "",
      whatsappMessage: dbSettings?.customTexts?.whatsappMessage || "Hello! I need support.",
    }
  };

  // Keep API credentials in output if they exist
  const finalSettings = {
    ...baseSettings,
    yocoPublicKey: dbSettings?.yocoPublicKey || "",
    yocoSecretKey: dbSettings?.yocoSecretKey || "",
    payfastMerchantId: dbSettings?.payfastMerchantId || "",
  };

  // 5. Apply active tenant database overrides if found
  if (tenant) {
    const presetName = tenant.preset?.toLowerCase() || "scented";
    const preset = themePresets[presetName] || themePresets.scented;
    const overrides = tenant.themeOverrides || {};
    return {
      ...finalSettings,
      brandName: detectedBrandName || tenant.name || preset.brandName,
      theme: {
        ...finalSettings.theme,
        ...preset.theme,
        ...overrides,
      },
      enabledWidgets: overrides.enabledWidgets || preset.enabledWidgets || finalSettings.enabledWidgets,
      layoutOrder: overrides.layoutOrder || preset.layoutOrder || finalSettings.layoutOrder,
      customTexts: {
        ...finalSettings.customTexts,
        ...preset.customTexts,
        ...(tenant.customTexts || {}),
      },
      footerCopyright: overrides.footerCopyright || preset.footerCopyright || finalSettings.footerCopyright,
      freeShippingThreshold: overrides.freeShippingThreshold !== undefined 
        ? overrides.freeShippingThreshold 
        : (preset.freeShippingThreshold !== undefined ? preset.freeShippingThreshold : finalSettings.freeShippingThreshold),
      currency: overrides.currency || preset.currency || finalSettings.currency,
      currencySymbol: overrides.currencySymbol || preset.currencySymbol || finalSettings.currencySymbol,
      currencyMultiplier: overrides.currencyMultiplier !== undefined 
        ? overrides.currencyMultiplier 
        : (preset.currencyMultiplier !== undefined ? preset.currencyMultiplier : finalSettings.currencyMultiplier),
    };
  }

  // 6. Apply active static preset override if requested (fallback)
  if (resolvedSubdomain && themePresets[resolvedSubdomain.toLowerCase()]) {
    const preset = themePresets[resolvedSubdomain.toLowerCase()];
    return {
      ...finalSettings,
      brandName: detectedBrandName || preset.brandName,
      theme: { ...preset.theme },
      enabledWidgets: [...preset.enabledWidgets],
      layoutOrder: [...preset.layoutOrder],
      customTexts: { ...preset.customTexts },
      footerCopyright: preset.footerCopyright,
      freeShippingThreshold: preset.freeShippingThreshold,
      currency: preset.currency || finalSettings.currency,
      currencySymbol: preset.currencySymbol || finalSettings.currencySymbol,
      currencyMultiplier: preset.currencyMultiplier || finalSettings.currencyMultiplier,
    };
  }

  if (detectedBrandName) {
    finalSettings.brandName = detectedBrandName;
  }

  return finalSettings as ThemeSettings;
}
