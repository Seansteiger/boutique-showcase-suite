"use client";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function WhatsAppWidget() {
  const settings = useStoreSettings();

  // If settings not loaded or widget not enabled, do not render
  const isEnabled = settings?.enabledWidgets?.includes("floating-whatsapp");
  const whatsappNumber = settings?.customTexts?.whatsappNumber;
  const whatsappMessage = settings?.customTexts?.whatsappMessage || "Hello! I need support with Scented products.";

  if (!isEnabled || !whatsappNumber) return null;

  // Clean formatting for number (strip spaces/plus/dashes)
  const cleanNumber = whatsappNumber.replace(/[^\d]/g, "");
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  const btnRadiusClass = settings?.theme?.buttonRadius === "0px"
      ? "rounded-none"
      : settings?.theme?.buttonRadius === "4px"
          ? "rounded-sm"
          : settings?.theme?.buttonRadius === "8px"
              ? "rounded-lg"
              : settings?.theme?.buttonRadius === "9999px"
                  ? "rounded-full"
                  : "rounded-[2rem_0.5rem_2rem_0.5rem]"; // default Scented

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-24 md:bottom-8 right-6 z-[48]"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-3.5 px-5 py-4 border border-border/10 bg-background/95 backdrop-blur-xl hover:bg-secondary/40 text-primary font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-xl shadow-black/10 select-none cursor-pointer group hover:-translate-y-1 hover:border-accent/40 ambient-glow",
            btnRadiusClass
          )}
        >
          <div className="relative">
            <MessageCircle className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
          </div>
          <span>Support Chat</span>
        </a>
      </motion.div>
    </AnimatePresence>
  );
}
