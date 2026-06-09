"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Layout, Palette, Shield, Sliders, CheckSquare, 
  ArrowUp, ArrowDown, Sparkles, MessageCircle, 
  Eye, RefreshCw, Landmark, Type, Instagram, Facebook, Pin, Truck, Settings
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";

export default function SuperAdminPage() {
  const settings = useQuery(api.settings.get);
  const updateSettings = useMutation(api.settings.update);

  // 1. Identity & Copywriting
  const [brandName, setBrandName] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroCtaText, setHeroCtaText] = useState("");
  const [announcementBarText, setAnnouncementBarText] = useState("");
  const [footerCopyright, setFooterCopyright] = useState("");

  // 2. Styling System
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [fontFamily, setFontFamily] = useState("");
  const [buttonRadius, setButtonRadius] = useState("");
  const [borderWidth, setBorderWidth] = useState("");
  const [shadowStyle, setShadowStyle] = useState("");
  const [cardStyle, setCardStyle] = useState("");
  const [navbarStyle, setNavbarStyle] = useState("");
  const [pageTexture, setPageTexture] = useState("flat");
  const [hoverEffect, setHoverEffect] = useState("zoom");

  // 3. Currency & Shipping Thresholds
  const [currency, setCurrency] = useState("ZAR");
  const [currencySymbol, setCurrencySymbol] = useState("R");
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1.0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000);

  // 4. Widgets, Toggles, & Support Connectors
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [showPaymentsAccepted, setShowPaymentsAccepted] = useState(true);

  // 5. Social URLs
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialPinterest, setSocialPinterest] = useState("");
  const [socialWhatsapp, setSocialWhatsapp] = useState("");

  // 6. Payment Keys
  const [yocoPublicKey, setYocoPublicKey] = useState("");
  const [yocoSecretKey, setYocoSecretKey] = useState("");
  const [payfastMerchantId, setPayfastMerchantId] = useState("");

  // 7. Layout Sequences
  const [layoutOrder, setLayoutOrder] = useState<string[]>([]);
  
  // Navigation Tabs inside customizer
  const [activeTab, setActiveTab] = useState("identity");

  // Sync state once data loads from Convex
  useEffect(() => {
    if (settings) {
      setBrandName(settings.brandName || "SCENTED");
      setHeroTitle(settings.customTexts?.heroTitle || "Atmospheric Elegance.");
      setHeroSubtitle(settings.customTexts?.heroSubtitle || "Discover fragrances designed with the precision of nature. A tactile journey through scent, space, and time, crafted for the discerning soul.");
      setHeroCtaText(settings.customTexts?.heroCtaText || "Explore Collection");
      setAnnouncementBarText(settings.customTexts?.announcementBarText || "Complimentary worldwide shipping on orders over R1000");
      setFooterCopyright(settings.footerCopyright || "A tribute to botanical artistry and tactile olfactory balance.");

      setPrimaryColor(settings.theme?.primaryColor || "141 29% 15%");
      setSecondaryColor(settings.theme?.secondaryColor || "30 20% 98%");
      setAccentColor(settings.theme?.accentColor || "45 64% 53%");
      setFontFamily(settings.theme?.fontFamily || "var(--font-playfair-display), Georgia, serif");
      setButtonRadius(settings.theme?.buttonRadius || "2rem 0.5rem 2rem 0.5rem");
      setBorderWidth(settings.theme?.borderWidth || "1px");
      setShadowStyle(settings.theme?.shadowStyle || "ambient");
      setCardStyle(settings.theme?.cardStyle || "asymmetric");
      setNavbarStyle(settings.theme?.navbarStyle || "glass");
      setPageTexture(settings.theme?.pageTexture || "flat");
      setHoverEffect(settings.theme?.hoverEffect || "zoom");

      setCurrency(settings.currency || "ZAR");
      setCurrencySymbol(settings.currencySymbol || "R");
      setCurrencyMultiplier(settings.currencyMultiplier || 1.0);
      setFreeShippingThreshold(settings.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : 1000);

      setEnabledWidgets(settings.enabledWidgets || []);
      setWhatsappNumber(settings.customTexts?.whatsappNumber || "");
      setWhatsappMessage(settings.customTexts?.whatsappMessage || "Hello! I need support with Scented products.");
      setShowPaymentsAccepted(settings.showPaymentsAccepted !== false);

      setSocialInstagram(settings.socialInstagram || "");
      setSocialFacebook(settings.socialFacebook || "");
      setSocialPinterest(settings.socialPinterest || "");
      setSocialWhatsapp(settings.socialWhatsapp || "");

      setYocoPublicKey(settings.yocoPublicKey || "");
      setYocoSecretKey(settings.yocoSecretKey || "");
      setPayfastMerchantId(settings.payfastMerchantId || "");
      
      setLayoutOrder(settings.layoutOrder || []);
    }
  }, [settings]);

  // Adjust currency details automatically on currency code change
  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    if (value === "ZAR") {
      setCurrencySymbol("R");
      setCurrencyMultiplier(1.0);
    } else if (value === "USD") {
      setCurrencySymbol("$");
      setCurrencyMultiplier(0.052);
    } else if (value === "EUR") {
      setCurrencySymbol("€");
      setCurrencyMultiplier(0.048);
    } else if (value === "GBP") {
      setCurrencySymbol("£");
      setCurrencyMultiplier(0.041);
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
          <p className="text-slate-400 font-medium">Hydrating Platform Customizer configurations...</p>
        </div>
      </div>
    );
  }

  // Toggle active widgets
  const toggleWidget = (widget: string) => {
    if (enabledWidgets.includes(widget)) {
      setEnabledWidgets(enabledWidgets.filter((w) => w !== widget));
    } else {
      setEnabledWidgets([...enabledWidgets, widget]);
    }
  };

  // Reorder homepage sequences
  const moveItem = (index: number, direction: "up" | "down") => {
    const newOrder = [...layoutOrder];
    if (direction === "up" && index > 0) {
      const temp = newOrder[index - 1];
      newOrder[index - 1] = newOrder[index];
      newOrder[index] = temp;
    } else if (direction === "down" && index < newOrder.length - 1) {
      const temp = newOrder[index + 1];
      newOrder[index + 1] = newOrder[index];
      newOrder[index] = temp;
    }
    setLayoutOrder(newOrder);
  };

  // Deploy configuration mutations to Convex
  const handleSave = async () => {
    try {
      await updateSettings({
        brandName,
        theme: {
          primaryColor,
          secondaryColor,
          accentColor,
          fontFamily,
          buttonRadius,
          borderWidth,
          shadowStyle,
          cardStyle,
          navbarStyle,
          pageTexture,
          hoverEffect,
        },
        enabledWidgets,
        layoutOrder,
        currency,
        currencySymbol,
        currencyMultiplier,
        freeShippingThreshold,
        footerCopyright,
        showPaymentsAccepted,
        socialInstagram,
        socialFacebook,
        socialPinterest,
        socialWhatsapp,
        yocoPublicKey,
        yocoSecretKey,
        payfastMerchantId,
        customTexts: {
          heroTitle,
          heroSubtitle,
          heroCtaText,
          announcementBarText,
          whatsappNumber,
          whatsappMessage,
        },
      });
      toast.success("Settings deployed and updated instantly across all dynamic templates!");
    } catch (e: any) {
      toast.error(`Configuration deploy failed: ${e.message}`);
    }
  };

  // Quick select presets (highly expanded)
  const applyPreset = (preset: "scented" | "slate" | "editorial" | "sandstone" | "ocean") => {
    if (preset === "scented") {
      setBrandName("SCENTED");
      setPrimaryColor("141 29% 15%"); // Deep Green
      setSecondaryColor("30 20% 98%"); // Cream
      setAccentColor("45 64% 53%"); // Gold
      setFontFamily("var(--font-playfair-display), Georgia, serif");
      setButtonRadius("2rem 0.5rem 2rem 0.5rem");
      setCardStyle("asymmetric");
      setBorderWidth("1px");
      setShadowStyle("ambient");
      setNavbarStyle("glass");
      setPageTexture("flat");
      setHoverEffect("zoom");
      toast.success("Loaded Scented luxury botanical preset!");
    } else if (preset === "slate") {
      setBrandName("SLATE & CO");
      setPrimaryColor("222.2 47.4% 11.2%");
      setSecondaryColor("210 40% 96.1%");
      setAccentColor("221.2 83.2% 53.3%");
      setFontFamily("var(--font-hanken-grotesk), sans-serif");
      setButtonRadius("8px");
      setCardStyle("curved");
      setBorderWidth("1px");
      setShadowStyle("elevation");
      setNavbarStyle("minimal");
      setPageTexture("flat");
      setHoverEffect("zoom");
      toast.success("Loaded Modern Minimalist Slate preset!");
    } else if (preset === "editorial") {
      setBrandName("L'ARTELIER");
      setPrimaryColor("0 0% 0%");
      setSecondaryColor("0 0% 100%");
      setAccentColor("0 0% 50%");
      setFontFamily("var(--font-playfair-display), Georgia, serif");
      setButtonRadius("0px");
      setCardStyle("sharp");
      setBorderWidth("2px");
      setShadowStyle("none");
      setNavbarStyle("editorial");
      setPageTexture("flat");
      setHoverEffect("zoom");
      toast.success("Loaded Editorial Monochrome preset!");
    } else if (preset === "sandstone") {
      setBrandName("OASIS CO");
      setPrimaryColor("20 50% 25%"); // Terracotta Earth
      setSecondaryColor("35 40% 96%"); // Sandy warm bg
      setAccentColor("25 75% 50%"); // Deep Clay accent
      setFontFamily("var(--font-playfair-display), Georgia, serif");
      setButtonRadius("8px");
      setCardStyle("curved");
      setBorderWidth("1px");
      setShadowStyle("ambient");
      setPageTexture("grain");
      setHoverEffect("zoom");
      toast.success("Loaded Sandstone Oasis organic preset!");
    } else if (preset === "ocean") {
      setBrandName("OCEAN MIST");
      setPrimaryColor("200 45% 12%"); // Navy Sea
      setSecondaryColor("190 30% 98%"); // Cyan Light bg
      setAccentColor("180 60% 45%"); // Mint Teal accent
      setFontFamily("var(--font-hanken-grotesk), sans-serif");
      setButtonRadius("9999px");
      setCardStyle("pill");
      setBorderWidth("none");
      setShadowStyle("glow");
      setPageTexture("mesh");
      setHoverEffect("flash");
      toast.success("Loaded Ocean Mist fresh pill preset!");
    }
  };

  // Mocked sandbox styling calculations
  const sandboxCardRadius = cardStyle === "sharp" 
    ? "0px" 
    : cardStyle === "pill" 
      ? "2rem" 
      : cardStyle === "curved" 
        ? "1rem" 
        : "1.5rem 0.35rem 1.5rem 0.35rem"; // asymmetric

  const sandboxBtnRadius = buttonRadius === "0px"
    ? "0px"
    : buttonRadius === "4px"
      ? "4px"
      : buttonRadius === "8px"
        ? "8px"
        : buttonRadius === "9999px"
          ? "9999px"
          : "1.5rem 0.35rem 1.5rem 0.35rem"; // asymmetric

  const sandboxBorder = borderWidth === "none" ? "none" : `${borderWidth} solid rgba(255,255,255,0.1)`;
  const sandboxShadow = shadowStyle === "none"
    ? "none"
    : shadowStyle === "glow"
      ? "0 10px 25px 0px rgba(212, 175, 55, 0.25)"
      : shadowStyle === "elevation"
        ? "0 10px 15px -3px rgba(0,0,0,0.3)"
        : "0 12px 20px -5px rgba(27, 48, 34, 0.2)"; // ambient

  const mockPrice = 1650;
  const mockCartSubtotal = 750;
  const remainingShipping = Math.max(freeShippingThreshold - mockCartSubtotal, 0);
  const progressPercent = Math.min((mockCartSubtotal / freeShippingThreshold) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans select-none selection:bg-orange-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Control Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-orange-500 font-bold tracking-widest text-xs uppercase">
              <Shield className="h-4 w-4" /> Multi-Instance Visual Customizer
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Super Admin Core Customizer
            </h1>
            <p className="text-slate-400 text-sm">
              Transform visual themes, textures, shipping metrics, footers, layout sequences, and floating widgets instantly.
            </p>
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/super-admin/builder"} 
                className="border-slate-850 bg-slate-900 text-[10px] font-bold uppercase tracking-widest text-slate-200 hover:bg-slate-800/80 hover:text-white rounded-xl py-4"
              >
                🎨 Open Live Page Builder
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/super-admin/saas"} 
                className="border-slate-850 bg-slate-900 text-[10px] font-bold uppercase tracking-widest text-slate-200 hover:bg-slate-800/80 hover:text-white rounded-xl py-4"
              >
                🏢 SaaS Command Tower
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Presets dropdown */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 px-2">Presets:</span>
              <Button size="sm" variant="ghost" className="h-7 text-xs rounded-lg px-2 text-slate-300 hover:text-white" onClick={() => applyPreset("scented")}>Scented</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs rounded-lg px-2 text-slate-300 hover:text-white" onClick={() => applyPreset("slate")}>Slate</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs rounded-lg px-2 text-slate-300 hover:text-white" onClick={() => applyPreset("editorial")}>Editorial</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs rounded-lg px-2 text-slate-300 hover:text-white" onClick={() => applyPreset("sandstone")}>Oasis</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs rounded-lg px-2 text-slate-300 hover:text-white" onClick={() => applyPreset("ocean")}>Mist</Button>
            </div>

            <Button 
              onClick={handleSave} 
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 shadow-lg shadow-orange-950/40 rounded-xl transition-all hover:scale-105 active:scale-95 py-5 text-sm"
            >
              <Sparkles className="mr-2 h-4 w-4" /> Deploy Configuration
            </Button>
          </div>
        </div>

        {/* Core Layout Grid: Settings Inputs vs Live Sandbox Preview */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Customizer Option Inputs column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Design Sidebar Selector tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800/40 pb-2">
              {[
                { id: "identity", label: "🏢 Branding & Footers" },
                { id: "typography", label: "📐 Typography & VFX" },
                { id: "colors", label: "🎨 Accent Colors & Shadows" },
                { id: "finance", label: "🪙 Shipping & Currency" },
                { id: "widgets", label: "💬 Widget Connectors" },
                { id: "sequence", label: "📂 Homepage Sequencer" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-300 border-b-2 rounded-t-lg ${
                    activeTab === tab.id 
                      ? "text-orange-500 border-orange-500 bg-orange-500/5 font-black" 
                      : "text-slate-400 border-transparent hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Identity & Footer Texts */}
            {activeTab === "identity" && (
              <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    🏢 Branding, Announcement & Footer Copyrights
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Control global brand naming, dynamic copywriting alerts, and footer copyright signatures.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-slate-300 font-semibold">Instance Brand Name</Label>
                    <Input 
                      value={brandName} 
                      onChange={(e) => setBrandName(e.target.value)} 
                      placeholder="e.g. SCENTED"
                      className="bg-slate-850 border-slate-700 text-white rounded-lg"
                    />
                  </div>
                  
                  <div className="h-[1px] bg-slate-800/50 my-4" />

                  <div className="grid gap-2">
                    <Label className="text-slate-300 font-semibold">Announcement Alert Bar Banner Text</Label>
                    <Input 
                      value={announcementBarText} 
                      onChange={(e) => setAnnouncementBarText(e.target.value)} 
                      placeholder="e.g. Complimentary worldwide botanical shipping..."
                      className="bg-slate-850 border-slate-700 text-white rounded-lg"
                    />
                  </div>

                  <div className="h-[1px] bg-slate-800/50 my-4" />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Hero Cinematic Heading Title</Label>
                      <Input 
                        value={heroTitle} 
                        onChange={(e) => setHeroTitle(e.target.value)} 
                        placeholder="e.g. Atmospheric Elegance."
                        className="bg-slate-850 border-slate-700 text-white rounded-lg"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Hero CTA Button Label</Label>
                      <Input 
                        value={heroCtaText} 
                        onChange={(e) => setHeroCtaText(e.target.value)} 
                        placeholder="e.g. Explore The Collection"
                        className="bg-slate-850 border-slate-700 text-white rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-slate-300 font-semibold">Hero Description Paragraph</Label>
                    <textarea 
                      value={heroSubtitle} 
                      onChange={(e) => setHeroSubtitle(e.target.value)} 
                      placeholder="Describe the collection sensory theme..."
                      rows={2}
                      className="w-full bg-slate-850 border border-slate-700 text-white rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="h-[1px] bg-slate-800/50 my-4" />

                  <div className="grid gap-2">
                    <Label className="text-slate-300 font-semibold">Footer Copyright Text Notice</Label>
                    <Input 
                      value={footerCopyright} 
                      onChange={(e) => setFooterCopyright(e.target.value)} 
                      placeholder="e.g. A tribute to botanical artistry and tactile balance."
                      className="bg-slate-850 border-slate-700 text-white rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tab 2: Typography & VFX */}
            {activeTab === "typography" && (
              <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    📐 Pairable Typography, Background Textures & Hover VFX
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Control typography families, dynamic page backgrounds, button shapes, and hover visual effects.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Font Pairings */}
                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold flex items-center gap-1.5"><Type className="h-4 w-4 text-orange-500"/> Font Pairing Profiles</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger className="bg-slate-850 border-slate-700 text-white rounded-lg">
                          <SelectValue placeholder="Select typography pairing..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-850 border-slate-750 text-white">
                          <SelectItem value="var(--font-playfair-display), Georgia, serif">Elegant Display (Playfair Serif + Hanken Sans)</SelectItem>
                          <SelectItem value="var(--font-hanken-grotesk), sans-serif">Clean Geometric (Hanken Sans + Sans-Serif)</SelectItem>
                          <SelectItem value="Courier New, Courier, monospace">Modern Tech (Monospace Minimalist)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Page Background Textures */}
                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Background Surface Texture Overlay</Label>
                      <Select value={pageTexture} onValueChange={setPageTexture}>
                        <SelectTrigger className="bg-slate-850 border-slate-700 text-white rounded-lg">
                          <SelectValue placeholder="Select background texture..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-850 border-slate-750 text-white">
                          <SelectItem value="flat">Standard Flat Background Surface</SelectItem>
                          <SelectItem value="mesh">Luxury Mesh Grid Overlays (High-Fashion lines)</SelectItem>
                          <SelectItem value="grain">Organic Fine Paper Noise Grain (Luxury Matte)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Hover visual animations */}
                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Interactive Card Hover Visual Effect (VFX)</Label>
                      <Select value={hoverEffect} onValueChange={setHoverEffect}>
                        <SelectTrigger className="bg-slate-850 border-slate-700 text-white rounded-lg">
                          <SelectValue placeholder="Select hover animation..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-850 border-slate-750 text-white">
                          <SelectItem value="zoom">Standard Smooth Image Zoom (luxury Editorial)</SelectItem>
                          <SelectItem value="pulse">Organic Slow Botanical Breathe Pulse (Slow Grow)</SelectItem>
                          <SelectItem value="flash">Cinematic Angled Glass Glare Flash (Dynamic shimmer)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Navbar Layout Header style */}
                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Navbar Header Layout Preset</Label>
                      <Select value={navbarStyle} onValueChange={setNavbarStyle}>
                        <SelectTrigger className="bg-slate-850 border-slate-700 text-white rounded-lg">
                          <SelectValue placeholder="Select navbar layout..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-850 border-slate-750 text-white">
                          <SelectItem value="glass">Translucent iOS Glassmorphism (Centered Logo)</SelectItem>
                          <SelectItem value="editorial">Bold Editorial List Layout (Left Logo, Thick Borders)</SelectItem>
                          <SelectItem value="minimal">Inline Minimalist Badge (Compact Inline Links)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Button Curve Radius */}
                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Button Curve Radius</Label>
                      <Select value={buttonRadius} onValueChange={setButtonRadius}>
                        <SelectTrigger className="bg-slate-850 border-slate-700 text-white rounded-lg">
                          <SelectValue placeholder="Select radius..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-850 border-slate-750 text-white">
                          <SelectItem value="0px">Sharp Flat Edges (0px)</SelectItem>
                          <SelectItem value="4px">Subtle Curved Corners (4px)</SelectItem>
                          <SelectItem value="8px">Standard Curved Corners (8px)</SelectItem>
                          <SelectItem value="9999px">Capsule Pill Rounded (Capsule)</SelectItem>
                          <SelectItem value="2rem 0.5rem 2rem 0.5rem">Scented Organic Asymmetric Outline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Card Curve Radius */}
                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Bento Card Curvatures</Label>
                      <Select value={cardStyle} onValueChange={setCardStyle}>
                        <SelectTrigger className="bg-slate-850 border-slate-700 text-white rounded-lg">
                          <SelectValue placeholder="Select card style..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-850 border-slate-750 text-white">
                          <SelectItem value="sharp">Sharp Flat (0px)</SelectItem>
                          <SelectItem value="curved">Standard Rounded Curves (rounded-xl)</SelectItem>
                          <SelectItem value="pill">High Rounded Pill (rounded-[2rem])</SelectItem>
                          <SelectItem value="asymmetric">Scented Organic Asymmetric Curvature</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Border line width */}
                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Border Line Thickness</Label>
                      <Select value={borderWidth} onValueChange={setBorderWidth}>
                        <SelectTrigger className="bg-slate-850 border-slate-700 text-white rounded-lg">
                          <SelectValue placeholder="Select thickness..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-850 border-slate-750 text-white">
                          <SelectItem value="none">Borderless Elegant Grid</SelectItem>
                          <SelectItem value="1px">Thin Minimalist Lines (1px)</SelectItem>
                          <SelectItem value="2px">Bold High-Contrast Outlines (2px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tab 3: Colors & Shadows */}
            {activeTab === "colors" && (
              <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    🎨 Color Palette & Drop Shadow Schemes
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Adjust primary, secondary, and accent colors in HSL space and select shadow glow types.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Primary Theme (HSL)</Label>
                      <Input 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)} 
                        placeholder="e.g. 141 29% 15%"
                        className="bg-slate-850 border-slate-700 text-white rounded-lg"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Secondary Surface (HSL)</Label>
                      <Input 
                        value={secondaryColor} 
                        onChange={(e) => setSecondaryColor(e.target.value)} 
                        placeholder="e.g. 30 20% 98%"
                        className="bg-slate-850 border-slate-700 text-white rounded-lg"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Interactive Accent (HSL)</Label>
                      <Input 
                        value={accentColor} 
                        onChange={(e) => setAccentColor(e.target.value)} 
                        placeholder="e.g. 45 64% 53%"
                        className="bg-slate-850 border-slate-700 text-white rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-800/50 my-4" />

                  <div className="grid gap-2">
                    <Label className="text-slate-300 font-semibold">Dynamic Drop Shadow Glow Scheme</Label>
                    <Select value={shadowStyle} onValueChange={setShadowStyle}>
                      <SelectTrigger className="bg-slate-850 border-slate-700 text-white rounded-lg">
                        <SelectValue placeholder="Select shadow theme..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-850 border-slate-750 text-white">
                        <SelectItem value="none">Flat Minimalist Look (0 shadow)</SelectItem>
                        <SelectItem value="ambient">Ambient Botanical Green Glow (Luxury Subtle)</SelectItem>
                        <SelectItem value="glow">Golden Champagne Radiance Glow (Dynamic Accentuator)</SelectItem>
                        <SelectItem value="elevation">Classic Editorial Lift Shadow (Card Elevation)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tab 4: Local Currency & Shipping thresholds */}
            {activeTab === "finance" && (
              <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    🪙 Local Currency & Free Shipping thresholds
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Define the currency conversions and progress triggers for active cart elements.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold flex items-center gap-1.5"><Landmark className="h-4 w-4 text-orange-500"/> Select Currency Region</Label>
                      <Select value={currency} onValueChange={handleCurrencyChange}>
                        <SelectTrigger className="bg-slate-850 border-slate-700 text-white rounded-lg">
                          <SelectValue placeholder="Select currency region..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-850 border-slate-750 text-white">
                          <SelectItem value="ZAR">South African Rand (ZAR - R)</SelectItem>
                          <SelectItem value="USD">United States Dollar (USD - $)</SelectItem>
                          <SelectItem value="EUR">Euro Zone (EUR - €)</SelectItem>
                          <SelectItem value="GBP">Great Britain Pound (GBP - £)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Active Currency Symbol</Label>
                      <Input 
                        value={currencySymbol} 
                        onChange={(e) => setCurrencySymbol(e.target.value)} 
                        placeholder="e.g. R"
                        className="bg-slate-850 border-slate-700 text-white rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">Exchange Rate Multiplier</Label>
                      <Input 
                        type="number"
                        step="any"
                        value={currencyMultiplier} 
                        onChange={(e) => setCurrencyMultiplier(parseFloat(e.target.value) || 1.0)} 
                        placeholder="e.g. 1.0"
                        className="bg-slate-850 border-slate-700 text-white rounded-lg"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold flex items-center gap-1.5"><Truck className="h-4 w-4 text-accent" /> Free Shipping Threshold (Base Currency)</Label>
                      <Input 
                        type="number"
                        value={freeShippingThreshold} 
                        onChange={(e) => setFreeShippingThreshold(parseInt(e.target.value) || 1000)} 
                        placeholder="e.g. 1000"
                        className="bg-slate-850 border-slate-700 text-white rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-800/50 my-4" />

                  {/* Payment Gateway Keys Inputs */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Landmark className="h-4.5 w-4.5 text-accent" /> Pluggable Payments Merchant APIs
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-slate-300 font-semibold">Yoco Live Public Key</Label>
                        <Input 
                          value={yocoPublicKey} 
                          onChange={(e) => setYocoPublicKey(e.target.value)} 
                          placeholder="e.g. pk_live_..."
                          className="bg-slate-850 border-slate-700 text-white rounded-lg text-xs"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label className="text-slate-300 font-semibold">Yoco Live Secret Key</Label>
                        <Input 
                          type="password"
                          value={yocoSecretKey} 
                          onChange={(e) => setYocoSecretKey(e.target.value)} 
                          placeholder="e.g. sk_live_..."
                          className="bg-slate-850 border-slate-700 text-white rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-slate-300 font-semibold">PayFast Merchant ID</Label>
                      <Input 
                        value={payfastMerchantId} 
                        onChange={(e) => setPayfastMerchantId(e.target.value)} 
                        placeholder="e.g. 10024987"
                        className="bg-slate-850 border-slate-700 text-white rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tab 5: Dynamic Widgets & Social connectors */}
            {activeTab === "widgets" && (
              <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    💬 Dynamic Widgets, Footer Toggles & Social connectors
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Enable active floating widgets and configure footer secure payments and social link badges.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Widget toggles grid */}
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { id: "announcement-bar", label: "Announcement Alert Bar Banner" },
                      { id: "floating-whatsapp", label: "Floating WhatsApp Chat bubble" },
                      { id: "app-header-blur", label: "iOS Translucent Mobile Header" },
                      { id: "native-bottom-nav", label: "Mobile Sticky Bottom Navigation" }
                    ].map((widget) => {
                      const isEnabled = enabledWidgets.includes(widget.id);
                      return (
                        <div 
                          key={widget.id} 
                          onClick={() => toggleWidget(widget.id)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isEnabled 
                              ? "bg-orange-500/10 border-orange-500/30 text-white" 
                              : "bg-slate-850 border-slate-800 text-slate-400"
                          }`}
                        >
                          <span className="font-bold text-xs uppercase tracking-wider">{widget.label}</span>
                          <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center ${
                            isEnabled ? "bg-orange-500 border-orange-600 text-white" : "border-slate-600"
                          }`}>
                            {isEnabled && <span className="text-[10px] font-black">✓</span>}
                          </div>
                        </div>
                      );
                    })}

                    {/* Footer Payment Accepted Toggle */}
                    <div 
                      onClick={() => setShowPaymentsAccepted(!showPaymentsAccepted)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        showPaymentsAccepted 
                          ? "bg-orange-500/10 border-orange-500/30 text-white" 
                          : "bg-slate-850 border-slate-800 text-slate-400"
                      }`}
                    >
                      <span className="font-bold text-xs uppercase tracking-wider">Show Footer Payment Icons</span>
                      <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center ${
                        showPaymentsAccepted ? "bg-orange-500 border-orange-600 text-white" : "border-slate-600"
                      }`}>
                        {showPaymentsAccepted && <span className="text-[10px] font-black">✓</span>}
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-800/50 my-4" />

                  {/* Social media links input */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-200">Footer Connect Social Media links</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-slate-300 font-semibold">Instagram Profile URL</Label>
                        <Input 
                          value={socialInstagram} 
                          onChange={(e) => setSocialInstagram(e.target.value)} 
                          placeholder="e.g. https://instagram.com/scented"
                          className="bg-slate-850 border-slate-700 text-white rounded-lg text-xs"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label className="text-slate-300 font-semibold">Facebook Page URL</Label>
                        <Input 
                          value={socialFacebook} 
                          onChange={(e) => setSocialFacebook(e.target.value)} 
                          placeholder="e.g. https://facebook.com/scented"
                          className="bg-slate-850 border-slate-700 text-white rounded-lg text-xs"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label className="text-slate-300 font-semibold">Pinterest Board URL</Label>
                        <Input 
                          value={socialPinterest} 
                          onChange={(e) => setSocialPinterest(e.target.value)} 
                          placeholder="e.g. https://pinterest.com/scented"
                          className="bg-slate-850 border-slate-700 text-white rounded-lg text-xs"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label className="text-slate-300 font-semibold">WhatsApp Direct Number Link</Label>
                        <Input 
                          value={socialWhatsapp} 
                          onChange={(e) => setSocialWhatsapp(e.target.value)} 
                          placeholder="e.g. +27821234567"
                          className="bg-slate-850 border-slate-700 text-white rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-800/50 my-4" />

                  {/* WhatsApp Support float configurations */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <MessageCircle className="h-4.5 w-4.5 text-accent" /> WhatsApp Support Bubble settings
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-slate-300 font-semibold">WhatsApp Business Phone Number</Label>
                        <Input 
                          value={whatsappNumber} 
                          onChange={(e) => setWhatsappNumber(e.target.value)} 
                          placeholder="e.g. +27821234567"
                          className="bg-slate-850 border-slate-700 text-white rounded-lg"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label className="text-slate-300 font-semibold">Prefilled User Support Message</Label>
                        <Input 
                          value={whatsappMessage} 
                          onChange={(e) => setWhatsappMessage(e.target.value)} 
                          placeholder="e.g. Hello, I need support with Scented products!"
                          className="bg-slate-850 border-slate-700 text-white rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tab 6: Layout Order Sequences */}
            {activeTab === "sequence" && (
              <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    📂 Section sequencing and Visibilities
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Determine the sorting and visibility of active homepage blocks dynamically.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Active homepage sections sequencer */}
                  <div className="space-y-3">
                    <Label className="text-slate-300 font-semibold block mb-2">Homepage Block Layout Sequence</Label>
                    {layoutOrder.map((section, idx) => (
                      <div key={section} className="flex items-center justify-between p-3.5 bg-slate-850 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-lg bg-orange-500/10 flex items-center justify-center text-xs font-bold text-orange-500">{idx + 1}</div>
                          <span className="capitalize font-black text-xs tracking-widest uppercase">
                            {section === "cinematic-hero-loop" ? "Cinematic Hero Loop" : section === "bento-category-grid" ? "Bento Categories Grid" : section === "featured-curations" ? "Featured Curations List" : section === "scent-discovery" ? "Scent Discovery Quiz" : section}
                          </span>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => moveItem(idx, "up")}
                            disabled={idx === 0}
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-white"
                          >
                            <ArrowUp className="h-4.5 w-4.5" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => moveItem(idx, "down")}
                            disabled={idx === layoutOrder.length - 1}
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-white"
                          >
                            <ArrowDown className="h-4.5 w-4.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-[1px] bg-slate-800/50 my-4" />

                  {/* layout section visibilities widgets toggle */}
                  <div className="space-y-3">
                    <Label className="text-slate-300 font-semibold block">Section Visibilities</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        { id: "cinematic-hero-loop", label: "Cinematic Hero Loop" },
                        { id: "bento-category-grid", label: "Bento Categories Grid" },
                        { id: "featured-curations", label: "Featured Curations List" },
                        { id: "scent-discovery", label: "Scent Discovery Quiz" }
                      ].map((sec) => {
                        const isEnabled = enabledWidgets.includes(sec.id);
                        return (
                          <div 
                            key={sec.id} 
                            onClick={() => {
                              toggleWidget(sec.id);
                              // Make sure it is also inside layoutOrder if enabled
                              if (!enabledWidgets.includes(sec.id) && !layoutOrder.includes(sec.id)) {
                                setLayoutOrder([...layoutOrder, sec.id]);
                              }
                            }}
                            className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                              isEnabled 
                                ? "bg-orange-500/10 border-orange-500/30 text-white" 
                                : "bg-slate-850 border-slate-800 text-slate-400"
                            }`}
                          >
                            <span className="font-bold text-xs uppercase tracking-wider">{sec.label}</span>
                            <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center ${
                              isEnabled ? "bg-orange-500 border-orange-600 text-white" : "border-slate-600"
                            }`}>
                              {isEnabled && <span className="text-[10px] font-black">✓</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </CardContent>
              </Card>
            )}

          </div>

          {/* Sandbox Real-Time Visual Preview column */}
          <div className="space-y-6">
            
            <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl overflow-hidden sticky top-8">
              <CardHeader className="border-b border-slate-800 pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                    <Eye className="h-4 w-4 text-orange-500" /> Sandbox Live Preview
                  </CardTitle>
                  <CardDescription className="text-[10px] text-slate-500">
                    Simulates active designs in real-time.
                  </CardDescription>
                </div>
                <RefreshCw className="h-4 w-4 text-slate-600 animate-spin" />
              </CardHeader>
              
              <CardContent className="p-4 space-y-6 bg-slate-950/60 font-sans relative overflow-hidden">
                
                {/* Simulated Background pageTexture */}
                <div className={cn(
                  "absolute inset-0 pointer-events-none opacity-20 z-0",
                  pageTexture === "mesh" ? "mesh-bg" : pageTexture === "grain" ? "grain-bg" : ""
                )} />

                <div className="space-y-6 relative z-10">
                  {/* 1. Sandbox Announcement Bar preview */}
                  {enabledWidgets.includes("announcement-bar") && announcementBarText && (
                    <div className="w-full bg-orange-500/20 text-orange-400 border border-orange-500/20 py-1.5 px-3 rounded-lg text-center text-[9px] tracking-widest uppercase font-bold">
                      {announcementBarText}
                    </div>
                  )}

                  {/* 2. Sandbox Header preview */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    {navbarStyle === "glass" && (
                      <>
                        <div className="flex gap-2 text-[9px] uppercase tracking-wider text-slate-400">
                          <span>Shop</span>
                        </div>
                        <span className="font-serif italic font-bold text-accent">{brandName}</span>
                        <div className="h-2 w-2 rounded-full bg-accent" />
                      </>
                    )}
                    {navbarStyle === "editorial" && (
                      <>
                        <span className="font-serif font-black tracking-wide border-b border-accent">{brandName}.</span>
                        <div className="flex gap-2 text-[9px] uppercase tracking-wider text-slate-400">
                          <span>Shop</span>
                        </div>
                      </>
                    )}
                    {navbarStyle === "minimal" && (
                      <>
                        <span className="font-sans font-black tracking-tighter text-slate-200">{brandName}</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      </>
                    )}
                  </div>

                  {/* 3. Sandbox Cinematic Hero heading preview */}
                  <div className="space-y-2 p-3 bg-slate-900/30 border border-slate-800/40 rounded-xl">
                    <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-accent block">The Awakening</span>
                    <h3 className="text-xl font-serif text-slate-200 tracking-tight leading-tight">
                      {heroTitle}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-light line-clamp-2 leading-relaxed">
                      {heroSubtitle}
                    </p>
                    
                    {/* Hero button preview */}
                    <div className="pt-1.5">
                      <button
                        className="px-4 py-2 border border-slate-200 text-slate-200 text-[8px] tracking-[0.2em] font-semibold uppercase transition-colors"
                        style={{ borderRadius: sandboxBtnRadius }}
                      >
                        {heroCtaText}
                      </button>
                    </div>
                  </div>

                  {/* 4. Sandbox Free Shipping progress bar preview */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <Truck className="h-3.5 w-3.5 text-accent shrink-0" />
                      {remainingShipping > 0 ? (
                        <span className="text-slate-300">
                          Add <strong>{formatPrice(remainingShipping, { currencySymbol, currencyMultiplier })}</strong> more for <strong>free shipping</strong>!
                        </span>
                      ) : (
                        <span className="font-bold text-accent">Free Shipping Unlocked!</span>
                      )}
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>

                  {/* 5. Sandbox Product Card preview */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase block">Product Card & Hover VFX</span>
                    
                    <div 
                      className={cn(
                        "bg-slate-900 overflow-hidden relative transition-all",
                        hoverEffect === "pulse" ? "hover-vfx-pulse" : "",
                        hoverEffect === "flash" ? "hover-vfx-flash" : ""
                      )}
                      style={{ 
                        borderRadius: sandboxCardRadius,
                        border: sandboxBorder,
                        boxShadow: sandboxShadow
                      }}
                    >
                      {/* Mock Image container */}
                      <div className="aspect-[3/4] w-full bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center text-slate-600 text-xs">
                        <div className="text-center space-y-1">
                          <span className="text-[9px] uppercase tracking-widest font-black text-slate-500">Ratio 1.0 EDP</span>
                        </div>
                        <span className="absolute top-2 right-2 bg-accent text-black text-[8px] font-black px-2 py-0.5 tracking-widest uppercase rounded">Sale</span>
                      </div>

                      {/* Content */}
                      <div className="p-3 space-y-1 bg-slate-900">
                        <div>
                          <span className="text-[8px] font-semibold text-accent uppercase tracking-[0.2em]">SCENTED</span>
                          <h4 className="font-serif text-xs text-slate-200 uppercase line-clamp-1">Ratio 1.0 Eau de Parfum</h4>
                        </div>
                        
                        <div className="flex items-center justify-between pt-0.5">
                          <span className="text-xs font-bold text-slate-200">
                            {formatPrice(mockPrice, { currencySymbol, currencyMultiplier })}
                          </span>
                          <div className="h-6 w-6 rounded-full bg-slate-850 flex items-center justify-center text-[10px] text-accent font-black">✓</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 6. Sandbox Footer copyright & social badges preview */}
                  <div className="p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl text-center space-y-3">
                    <p className="text-[9px] text-slate-400 leading-normal">
                      © {new Date().getFullYear()} {brandName}. {footerCopyright}
                    </p>
                    
                    {/* Social badges mockup */}
                    <div className="flex justify-center gap-2 pt-1">
                      {socialInstagram && <Instagram className="h-3.5 w-3.5 text-slate-400" />}
                      {socialFacebook && <Facebook className="h-3.5 w-3.5 text-slate-400" />}
                      {socialPinterest && <Pin className="h-3.5 w-3.5 text-slate-400" />}
                      {socialWhatsapp && <MessageCircle className="h-3.5 w-3.5 text-slate-400" />}
                    </div>
                  </div>

                </div>

              </CardContent>
            </Card>

          </div>

        </div>

      </div>
    </div>
  );
}
