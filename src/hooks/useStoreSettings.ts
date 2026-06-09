import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { themePresets, ThemeSettings } from "@/lib/themePresets";

export function useStoreSettings() {
  const settings = useQuery(api.settings.get);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };
    setActiveTheme(getCookie("theme_preview") || null);
    
    // Listen for custom theme updates to refresh dynamic UI
    const handleThemeUpdate = () => {
      setActiveTheme(getCookie("theme_preview") || null);
    };
    window.addEventListener("theme_preview_changed", handleThemeUpdate);
    return () => window.removeEventListener("theme_preview_changed", handleThemeUpdate);
  }, []);

  const tenant = useQuery(
    api.tenants.getTenantBySubdomain,
    activeTheme ? { subdomain: activeTheme } : "skip"
  );

  // 1. Resolve preview override immediately if set, even if main settings are loading/offline
  if (activeTheme) {
    // A. Check if database tenant record is resolved
    if (tenant) {
      const presetName = tenant.preset?.toLowerCase() || "scented";
      const preset = themePresets[presetName] || themePresets.scented;
      const overrides = tenant.themeOverrides || {};
      const base = settings || preset;
      return {
        ...base,
        brandName: tenant.name || preset.brandName,
        theme: {
          ...base.theme,
          ...preset.theme,
          ...overrides,
        },
        enabledWidgets: overrides.enabledWidgets || preset.enabledWidgets || base.enabledWidgets,
        layoutOrder: overrides.layoutOrder || preset.layoutOrder || base.layoutOrder,
        customTexts: {
          ...base.customTexts,
          ...preset.customTexts,
          ...(tenant.customTexts || {}),
        },
        footerCopyright: overrides.footerCopyright || preset.footerCopyright || base.footerCopyright,
        freeShippingThreshold: overrides.freeShippingThreshold !== undefined 
          ? overrides.freeShippingThreshold 
          : (preset.freeShippingThreshold !== undefined ? preset.freeShippingThreshold : base.freeShippingThreshold),
        currency: overrides.currency || preset.currency || base.currency,
        currencySymbol: overrides.currencySymbol || preset.currencySymbol || base.currencySymbol,
        currencyMultiplier: overrides.currencyMultiplier !== undefined 
          ? overrides.currencyMultiplier 
          : (preset.currencyMultiplier !== undefined ? preset.currencyMultiplier : base.currencyMultiplier),
      };
    }

    // B. Fallback to static theme preset overrides (while database query resolves or if offline)
    if (themePresets[activeTheme.toLowerCase()]) {
      const preset = themePresets[activeTheme.toLowerCase()];
      const base = settings || preset;
      return {
        ...base,
        brandName: preset.brandName,
        theme: {
          ...base.theme,
          ...preset.theme,
        },
        enabledWidgets: preset.enabledWidgets,
        layoutOrder: preset.layoutOrder,
        customTexts: {
          ...base.customTexts,
          ...preset.customTexts,
        },
        footerCopyright: preset.footerCopyright || base.footerCopyright,
        freeShippingThreshold: preset.freeShippingThreshold !== undefined ? preset.freeShippingThreshold : base.freeShippingThreshold,
        currency: preset.currency || base.currency,
        currencySymbol: preset.currencySymbol || base.currencySymbol,
        currencyMultiplier: preset.currencyMultiplier || base.currencyMultiplier,
      };
    }
  }

  // 2. Default store settings behavior (when not previewing)
  if (!settings) return undefined;
  return settings;
}
