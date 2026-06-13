import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { getCategories } from "@/lib/products";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/components/cart-provider";
import { AIAssistant } from "@/components/AIAssistant";
import { CartSync } from "@/components/CartSync";
import { CartSheet } from "@/components/CartSheet";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { StoreLayout } from "@/components/StoreLayout";
import { Analytics } from "@vercel/analytics/next";
import { Playfair_Display, Hanken_Grotesk } from "next/font/google";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";

// Convex imports for Server-Side configurations
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { cookies, headers } from "next/headers";
import { getStoreSettings } from "@/lib/settings";
import { PreviewBadge } from "@/components/PreviewBadge";


export const dynamic = "force-dynamic";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// 1. Dynamic Server-Side Meta Generation
export async function generateMetadata(): Promise<Metadata> {
  let brandName = "White-Label Store";
  
  try {
    const settings = await getStoreSettings();
    if (settings) {
      brandName = settings.brandName;
    }
  } catch (e) {
    // Fallback if not configured
  }

  const defaultTitle = brandName === "Invited"
    ? "Invited | Exclusive Events & RSVPs"
    : `${brandName} | Quality Essentials`;

  const defaultDesc = brandName === "Invited"
    ? "Exclusive digital suites for bespoke events. Seamlessly planning attendance, seating codes, and guest registries."
    : `Shop the best home and room essentials at ${brandName}. Top quality selection delivered to your door.`;

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${brandName}`,
    },
    description: defaultDesc,
    keywords: brandName === "Invited"
      ? ["event planning", "bespoke RSVPs", "Ivory Committee", "guest registries", "digital invitations"]
      : ["online shopping", brandName, "store essentials", "appliances", "lifestyle catalog"],
    authors: [{ name: brandName }],
    creator: brandName,
    icons: {
      icon: "/images/logo.png",
      shortcut: "/images/logo.png",
      apple: "/images/logo.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  // Fetch headers to resolve the server-side request pathname and subdomain
  const headersList = await headers();
  const requestPathname = headersList.get("x-pathname") || "";
  const requestSubdomain = headersList.get("x-subdomain") || "";

  // 2. Fetch Convex Settings on the server and resolve active preview override
  const cookieStore = await cookies();
  const preview = cookieStore.get("theme_preview")?.value;
  const settings = await getStoreSettings(preview);

  // Map visual shadow style settings
  const shadowValue = (settings.theme as any).shadowStyle === "none"
    ? "none"
    : (settings.theme as any).shadowStyle === "glow"
      ? "0 15px 35px 2px rgba(212, 175, 55, 0.18)"
      : (settings.theme as any).shadowStyle === "elevation"
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
        : "0 20px 40px -5px rgba(27, 48, 34, 0.08)"; // default ambient

  // Helper to safely format raw HSL space variables from the database/settings into valid HSL CSS colors
  const formatColor = (val: string | undefined, fallback: string) => {
    if (!val) return fallback;
    return val.includes(" ") && !val.startsWith("hsl") ? `hsl(${val})` : val;
  };

  return (
    <html 
      lang="en" 
      className={cn("h-full", playfairDisplay.variable, hankenGrotesk.variable)}
      suppressHydrationWarning
      style={{
        "--primary": formatColor(settings.theme.primaryColor, "#0F0F11"),
        "--secondary": formatColor(settings.theme.secondaryColor, "#F5F5F7"),
        "--accent": formatColor((settings.theme as any).accentColor, "#D4AF37"),
        "--radius": settings.theme.buttonRadius || "8px",
        "--font-sans": settings.theme.fontFamily,
        "--border-width": (settings.theme as any).borderWidth || "1px",
        "--shadow-glow": shadowValue,
      } as React.CSSProperties}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={cn(
        "min-h-full bg-background font-sans antialiased flex flex-col",
        (settings.theme as any).pageTexture === "mesh"
          ? "mesh-bg"
          : (settings.theme as any).pageTexture === "grain"
            ? "grain-bg"
            : ""
      )}>
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <CartSync />
              <AnalyticsTracker />
              <StoreLayout hideOnCheckout pathname={requestPathname} subdomain={requestSubdomain}>
                <Navbar initialCategories={categories} />
              </StoreLayout>
              <div className="flex-grow pb-24 md:pb-0">
                {children}
              </div>
              <StoreLayout showOnlyOnHome pathname={requestPathname} subdomain={requestSubdomain}>
                <Footer />
              </StoreLayout>
              <StoreLayout hideOnCheckout pathname={requestPathname} subdomain={requestSubdomain}>
                <BottomNav />
                <AIAssistant />
                <WhatsAppWidget />
              </StoreLayout>
              <PreviewBadge />
              <StoreLayout hideOnCheckout pathname={requestPathname} subdomain={requestSubdomain}>
                <CartSheet />
              </StoreLayout>
              <Toaster />
              <Analytics />
            </CartProvider>
          </ThemeProvider>
        </ConvexClientProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: settings.brandName,
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://universal-engine.store",
              logo: "/images/logo.png",
              address: {
                "@type": "PostalAddress",
                addressCountry: "ZA"
              },
              description: `Shop the best home and room essentials at ${settings.brandName}.`
            })
          }}
        />
      </body>
    </html >
  );
}
