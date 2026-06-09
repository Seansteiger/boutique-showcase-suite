"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ShoppingBag } from "lucide-react";
import { useStoreSettings } from "@/hooks/useStoreSettings";

export function PreviewBadge() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const settings = useStoreSettings();

  // Helper to read cookie
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  useEffect(() => {
    setMounted(true);

    // 1. Intercept URL search params for preview theme triggers
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const previewTrigger = params.get("preview") || params.get("theme");

      if (previewTrigger) {
        const selected = previewTrigger.toLowerCase();
        // Commit cookie for 1 hour session browsing
        document.cookie = `theme_preview=${selected}; path=/; max-age=3600; SameSite=Lax`;
        
        // Dispatch custom event to notify useStoreSettings hook instantly
        window.dispatchEvent(new Event("theme_preview_changed"));
        setActiveTheme(selected);

        // Strip the query parameter for a ultra-clean, pristine URL experience
        params.delete("preview");
        params.delete("theme");
        const newSearch = params.toString();
        const newUrl = pathname + (newSearch ? `?${newSearch}` : "");
        window.history.replaceState({ ...window.history.state }, "", newUrl);

        // Instantly refresh the Next.js server components with the newly set cookie
        router.refresh();
      } else {
        // Hydrate from existing cookie
        setActiveTheme(getCookie("theme_preview"));
      }
    }
  }, [pathname, router]);

  const handleReset = () => {
    // Delete the preview cookie by expiring it
    document.cookie = "theme_preview=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.dispatchEvent(new Event("theme_preview_changed"));
    setActiveTheme(null);
    router.refresh();
  };

  const handleOrderRedirect = () => {
    router.push("/agency");
  };

  if (!mounted || !activeTheme || !settings) return null;

  const conceptName = settings.brandName;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 left-6 z-[50] max-w-sm select-none"
      >
        <div className="flex items-center gap-3.5 p-1.5 pl-4 pr-3 border border-white/10 bg-slate-950/80 backdrop-blur-xl rounded-full shadow-2xl shadow-black/40 text-slate-100">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider text-slate-300 font-sans uppercase">
              Bespoke Store: <strong className="text-white font-bold">{conceptName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleOrderRedirect}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] tracking-wider uppercase rounded-full transition-all duration-300 shadow-md shadow-orange-950/20 active:scale-95 whitespace-nowrap"
            >
              <ShoppingBag className="h-3 w-3" />
              Order This Store
            </button>

            <button
              onClick={handleReset}
              title="Reset Concept Preview"
              className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-colors active:scale-90 shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
