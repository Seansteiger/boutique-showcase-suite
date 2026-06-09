"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  ArrowLeft, Eye, EyeOff, ArrowUp, ArrowDown, Sparkles, Paintbrush, 
  Layers, Type, Monitor, Tablet, Smartphone, Save, Check, Grid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function VisualPageBuilder() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subdomainParam = searchParams.get("subdomain") || "scented";

  // Fetch tenant info
  const tenant = useQuery(api.tenants.getTenantBySubdomain, { subdomain: subdomainParam });
  const updateTenantSettings = useMutation(api.tenants.updateTenantSettings);

  // Layout editor states
  const [name, setName] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "phone">("desktop");
  const [activeTab, setActiveTab] = useState<"sections" | "colors" | "texts">("sections");
  
  // Visual Theme States
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [fontFamily, setFontFamily] = useState("");
  const [buttonRadius, setButtonRadius] = useState("");
  const [borderWidth, setBorderWidth] = useState("1px");
  const [cardStyle, setCardStyle] = useState("asymmetric");
  const [pageTexture, setPageTexture] = useState("flat");
  const [hoverEffect, setHoverEffect] = useState("zoom");

  // Copywriting States
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroCtaText, setHeroCtaText] = useState("");
  const [announcementBarText, setAnnouncementBarText] = useState("");

  // Home layout sequencer sections
  const [sections, setSections] = useState<Array<{ id: string; label: string; visible: boolean }>>([
    { id: "announcement", label: "Announcement Banner", visible: true },
    { id: "hero", label: "Cinematic Hero", visible: true },
    { id: "categories", label: "Bento Categories", visible: true },
    { id: "featured", label: "Featured Curations", visible: true },
    { id: "quiz", label: "Olfactive Scent Quiz", visible: true }
  ]);

  const [selectedSection, setSelectedSection] = useState<string | null>("hero");

  // Load configuration from database
  useEffect(() => {
    if (tenant) {
      setName(tenant.name);
      setCustomDomain(tenant.customDomain || "");
      
      const theme = tenant.themeOverrides || {};
      setPrimaryColor(theme.primaryColor || "141 29% 15%");
      setSecondaryColor(theme.secondaryColor || "30 20% 98%");
      setAccentColor(theme.accentColor || "45 64% 53%");
      setFontFamily(theme.fontFamily || "var(--font-playfair-display), Georgia, serif");
      setButtonRadius(theme.buttonRadius || "2rem 0.5rem 2rem 0.5rem");
      setBorderWidth(theme.borderWidth || "1px");
      setCardStyle(theme.cardStyle || "asymmetric");
      setPageTexture(theme.pageTexture || "flat");
      setHoverEffect(theme.hoverEffect || "zoom");

      const texts = tenant.customTexts || {};
      setHeroTitle(texts.heroTitle || "Atmospheric Elegance.");
      setHeroSubtitle(texts.heroSubtitle || "A sensory awakening through botanical curation.");
      setHeroCtaText(texts.heroCtaText || "Explore Atelier");
      setAnnouncementBarText(texts.announcementBarText || "Complimentary worldwide shipping on orders over R1000");

      if (theme.layoutOrder && Array.isArray(theme.layoutOrder)) {
        // Hydrate layout sections matching list
        // (Just fallback if unconfigured)
      }
    }
  }, [tenant]);

  // Section position swappers
  const moveSection = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sections.length) return;
    
    const reordered = [...sections];
    const temp = reordered[index];
    reordered[index] = reordered[nextIndex];
    reordered[nextIndex] = temp;
    setSections(reordered);
    toast.success("Section layout sequence updated locally.");
  };

  const toggleVisibility = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  // Push updates to Convex database
  const handleDeployChanges = async () => {
    if (!tenant) return;

    try {
      const themeOverrides = {
        primaryColor,
        secondaryColor,
        accentColor,
        fontFamily,
        buttonRadius,
        borderWidth,
        cardStyle,
        pageTexture,
        hoverEffect,
        layoutOrder: sections.filter(s => s.visible).map(s => s.id)
      };

      const customTexts = {
        heroTitle,
        heroSubtitle,
        heroCtaText,
        announcementBarText
      };

      await updateTenantSettings({
        id: tenant._id,
        name,
        customDomain: customDomain || undefined,
        themeOverrides,
        customTexts
      });

      toast.success("Bespoke styling parameters deployed successfully to production!");
    } catch (err: any) {
      toast.error(err.message || "Failed to deploy overrides.");
    }
  };

  if (!tenant) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Dynamic values mapping for builder rendering
  const activeRadClass = cardStyle === "sharp" 
    ? "rounded-none" 
    : cardStyle === "pill" 
      ? "rounded-[2.5rem]" 
      : cardStyle === "curved" 
        ? "rounded-2xl" 
        : "rounded-[2rem_0.5rem_2rem_0.5rem]";

  const activeBtnRad = buttonRadius === "0px" 
    ? "rounded-none" 
    : buttonRadius === "4px" 
      ? "rounded-sm" 
      : buttonRadius === "8px" 
        ? "rounded-lg" 
        : buttonRadius === "9999px" 
          ? "rounded-full" 
          : "rounded-[2rem_0.5rem_2rem_0.5rem]";

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] -m-6 overflow-hidden bg-secondary/20 font-sans text-xs">
      
      {/* Visual Editor Workspace Header */}
      <div className="h-16 bg-card border-b border-border/10 flex justify-between items-center px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/super-admin/saas")} className="h-8 w-8 p-0 rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-serif text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
              Bespoke Design Studio <span className="text-xs text-accent">/ {tenant.name}</span>
            </h1>
            <p className="text-[10px] text-muted-foreground">Modify color palettes, texts, and sections live</p>
          </div>
        </div>

        {/* Viewport Toggles */}
        <div className="flex border border-border/10 rounded-full p-1 bg-secondary/35 shrink-0 select-none">
          <button 
            onClick={() => setViewport("desktop")}
            className={cn("p-1.5 rounded-full transition-all", viewport === "desktop" ? "bg-primary text-secondary shadow-md" : "text-muted-foreground")}
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => setViewport("tablet")}
            className={cn("p-1.5 rounded-full transition-all", viewport === "tablet" ? "bg-primary text-secondary shadow-md" : "text-muted-foreground")}
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => setViewport("phone")}
            className={cn("p-1.5 rounded-full transition-all", viewport === "phone" ? "bg-primary text-secondary shadow-md" : "text-muted-foreground")}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        <Button 
          onClick={handleDeployChanges}
          className="rounded-[2rem_0.5rem_2rem_0.5rem] bg-primary text-secondary hover:bg-accent font-bold uppercase tracking-wider text-[10px] px-6 py-4 flex items-center gap-1.5 shadow-md"
        >
          <Save className="h-3.5 w-3.5" /> Deploy Customization
        </Button>
      </div>

      {/* Editor Body Panels */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Layout & styling Controls sidebar */}
        <div className="w-80 bg-card border-r border-border/10 flex flex-col shrink-0 overflow-y-auto">
          
          {/* Tab Selector */}
          <div className="grid grid-cols-3 border-b border-border/10 p-2 text-center bg-secondary/10">
            <button 
              onClick={() => setActiveTab("sections")}
              className={cn("py-2 text-[9px] uppercase tracking-wider font-bold rounded-lg transition-colors", activeTab === "sections" ? "bg-secondary text-primary" : "text-muted-foreground")}
            >
              <Layers className="h-3.5 w-3.5 mx-auto mb-1" /> Sections
            </button>
            <button 
              onClick={() => setActiveTab("colors")}
              className={cn("py-2 text-[9px] uppercase tracking-wider font-bold rounded-lg transition-colors", activeTab === "colors" ? "bg-secondary text-primary" : "text-muted-foreground")}
            >
              <Paintbrush className="h-3.5 w-3.5 mx-auto mb-1" /> Styles
            </button>
            <button 
              onClick={() => setActiveTab("texts")}
              className={cn("py-2 text-[9px] uppercase tracking-wider font-bold rounded-lg transition-colors", activeTab === "texts" ? "bg-secondary text-primary" : "text-muted-foreground")}
            >
              <Type className="h-3.5 w-3.5 mx-auto mb-1" /> Custom Copy
            </button>
          </div>

          <div className="p-4 space-y-6">
            
            {/* Sections editor tab */}
            {activeTab === "sections" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-xs font-semibold uppercase text-primary">Homepage Sequence</h3>
                  <p className="text-[10px] text-muted-foreground">Adjust display visibility and section sequencing</p>
                </div>

                <div className="space-y-3">
                  {sections.map((sec, idx) => (
                    <div 
                      key={sec.id} 
                      onClick={() => setSelectedSection(sec.id)}
                      className={cn(
                        "flex items-center justify-between p-3 border rounded-xl transition-all cursor-pointer",
                        selectedSection === sec.id 
                          ? "border-accent bg-accent/5 shadow-sm" 
                          : "border-border/10 bg-secondary/15 hover:bg-secondary/30"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Grid className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="font-bold text-[10px] tracking-wide text-foreground uppercase">{sec.label}</span>
                      </div>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => moveSection(idx, "up")} 
                          disabled={idx === 0}
                          className="p-1 hover:bg-secondary rounded text-muted-foreground disabled:opacity-35"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => moveSection(idx, "down")} 
                          disabled={idx === sections.length - 1}
                          className="p-1 hover:bg-secondary rounded text-muted-foreground disabled:opacity-35"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => toggleVisibility(sec.id)} 
                          className="p-1 hover:bg-secondary rounded text-muted-foreground"
                        >
                          {sec.visible ? <Eye className="h-3.5 w-3.5 text-accent" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Styling tab */}
            {activeTab === "colors" && (
              <div className="space-y-4 font-sans">
                <div className="space-y-1">
                  <h3 className="font-serif text-xs font-semibold uppercase text-primary">Global Styles Tokens</h3>
                  <p className="text-[10px] text-muted-foreground">Customize HSL color spectrums and curvatures</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Primary Brand Tone (HSL)</Label>
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="bg-secondary/20 border-border/10 font-mono text-[10px]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Secondary Surface Tone (HSL)</Label>
                    <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="bg-secondary/20 border-border/10 font-mono text-[10px]" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Interactive Accent Tone (HSL)</Label>
                    <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="bg-secondary/20 border-border/10 font-mono text-[10px]" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Button Border Radius</Label>
                    <select
                      value={buttonRadius}
                      onChange={(e) => setButtonRadius(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-border/10 bg-secondary/20 px-3 py-2 text-xs"
                    >
                      <option value="0px">0px (Stark Editorial)</option>
                      <option value="4px">4px (Sleek Modern)</option>
                      <option value="8px">8px (Standard Curved)</option>
                      <option value="9999px">9999px (Pill Shape)</option>
                      <option value="2rem 0.5rem 2rem 0.5rem">Asymmetrical (Golden ratio custom)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Card Style Outlines</Label>
                    <select
                      value={cardStyle}
                      onChange={(e) => setCardStyle(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-border/10 bg-secondary/20 px-3 py-2 text-xs"
                    >
                      <option value="sharp">Sharp Stark Edges</option>
                      <option value="curved">Organic Curved Edges</option>
                      <option value="pill">Pill Rounded Edges</option>
                      <option value="asymmetric">Asymmetrical Organic Silhouette</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Background Textures</Label>
                    <select
                      value={pageTexture}
                      onChange={(e) => setPageTexture(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-border/10 bg-secondary/20 px-3 py-2 text-xs"
                    >
                      <option value="flat">Flat Translucent</option>
                      <option value="mesh">Sleek Editorial Gridlines</option>
                      <option value="grain">Premium Textured Grain Paper</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Custom copy tab */}
            {activeTab === "texts" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-xs font-semibold uppercase text-primary">Configure Store Metadata</h3>
                  <p className="text-[10px] text-muted-foreground">Edit dynamic storefront copy and domains</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Store Client Instance Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary/20 border-border/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Custom Hostname Domain</Label>
                    <Input value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} placeholder="www.mybrand.co.za" className="bg-secondary/20 border-border/10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Announcement Bar Text</Label>
                    <Input value={announcementBarText} onChange={(e) => setAnnouncementBarText(e.target.value)} className="bg-secondary/20 border-border/10" />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Center: Live Interactive Viewport Preview */}
        <div className="flex-1 p-8 flex justify-center items-start overflow-y-auto">
          <div 
            className={cn(
              "bg-background border border-border/10 shadow-2xl transition-all duration-300 relative shrink-0",
              viewport === "desktop" ? "w-full max-w-5xl aspect-video rounded-2xl" : "",
              viewport === "tablet" ? "w-[768px] h-[1024px] rounded-2xl" : "",
              viewport === "phone" ? "w-[390px] h-[844px] rounded-3xl" : ""
            )}
            style={{
              "--primary-color": primaryColor,
              "--secondary-color": secondaryColor,
              "--accent-color": accentColor,
            } as any}
          >
            {/* Viewport Frame Bezels */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-36 h-4 bg-muted rounded-full z-10 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
            </div>

            {/* Viewport Inner Content */}
            <div className="w-full h-full overflow-y-auto pt-8 pb-12 px-6 flex flex-col justify-start relative font-sans text-xs">
              
              {/* Dynamic announcement bar block */}
              {sections.find(s => s.id === "announcement")?.visible && (
                <div 
                  onClick={() => setSelectedSection("announcement")}
                  className={cn(
                    "w-full text-center py-2 text-[9px] font-semibold uppercase tracking-wider cursor-pointer border border-transparent transition-all",
                    selectedSection === "announcement" ? "border-dashed border-accent bg-accent/10" : "hover:border-dashed hover:border-accent/40"
                  )}
                  style={{ backgroundColor: `hsl(${accentColor})`, color: `hsl(${secondaryColor})` }}
                >
                  ✨ {announcementBarText}
                </div>
              )}

              {/* Dynamic navigation bar block */}
              <div className="h-14 border-b border-border/10 flex justify-between items-center px-4 shrink-0 font-serif font-medium uppercase tracking-widest text-primary">
                <span>{name}</span>
                <div className="flex gap-4 text-[9px] font-sans">
                  <span>Shop</span>
                  <span>Quiz</span>
                  <span>Support</span>
                </div>
              </div>

              {/* Home Layout Sequencer Loop */}
              {sections.map((section) => {
                if (!section.visible) return null;

                if (section.id === "hero") {
                  return (
                    <div 
                      key="hero"
                      onClick={() => setSelectedSection("hero")}
                      className={cn(
                        "py-16 px-4 text-center space-y-4 cursor-pointer border border-transparent transition-all my-4",
                        selectedSection === "hero" ? "border-dashed border-accent bg-accent/10" : "hover:border-dashed hover:border-accent/40"
                      )}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-accent flex items-center justify-center gap-1">
                        <Sparkles className="h-3 w-3" /> Signature Curation
                      </span>
                      <h2 className="text-3xl font-serif font-medium uppercase text-primary leading-tight max-w-md mx-auto">
                        {heroTitle}
                      </h2>
                      <p className="text-muted-foreground max-w-sm mx-auto text-[10px] leading-relaxed">
                        {heroSubtitle}
                      </p>
                      <Button className={cn("mx-auto uppercase font-bold tracking-widest text-[9px] px-6 py-4 mt-2", activeBtnRad)}>
                        {heroCtaText}
                      </Button>
                    </div>
                  );
                }

                if (section.id === "categories") {
                  return (
                    <div 
                      key="categories"
                      onClick={() => setSelectedSection("categories")}
                      className={cn(
                        "p-6 cursor-pointer border border-transparent transition-all my-4",
                        selectedSection === "categories" ? "border-dashed border-accent bg-accent/10" : "hover:border-dashed hover:border-accent/40"
                      )}
                    >
                      <h3 className="font-serif text-center uppercase tracking-widest text-primary mb-4">Bento Categories</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={cn("aspect-[4/3] bg-secondary flex items-center justify-center font-bold text-[10px] uppercase text-primary", activeRadClass)}>
                          Les Parfums
                        </div>
                        <div className={cn("aspect-[4/3] bg-secondary flex items-center justify-center font-bold text-[10px] uppercase text-primary", activeRadClass)}>
                          Les Bougies
                        </div>
                      </div>
                    </div>
                  );
                }

                if (section.id === "featured") {
                  return (
                    <div 
                      key="featured"
                      onClick={() => setSelectedSection("featured")}
                      className={cn(
                        "p-6 cursor-pointer border border-transparent transition-all my-4",
                        selectedSection === "featured" ? "border-dashed border-accent bg-accent/10" : "hover:border-dashed hover:border-accent/40"
                      )}
                    >
                      <h3 className="font-serif text-center uppercase tracking-widest text-primary mb-4">Featured Catalogue</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={cn("border p-3 space-y-2 bg-card", activeRadClass)}>
                          <div className="aspect-[3/4] bg-secondary/30 rounded-lg flex items-center justify-center text-[10px] text-muted-foreground">Product Card Image</div>
                          <div className="font-serif uppercase font-bold text-[10px] text-primary truncate">Ratio 1.0</div>
                          <div className="text-[10px] font-bold text-accent">R1,450.00</div>
                        </div>
                        <div className={cn("border p-3 space-y-2 bg-card", activeRadClass)}>
                          <div className="aspect-[3/4] bg-secondary/30 rounded-lg flex items-center justify-center text-[10px] text-muted-foreground">Product Card Image</div>
                          <div className="font-serif uppercase font-bold text-[10px] text-primary truncate">Ratio 1.6</div>
                          <div className="text-[10px] font-bold text-accent">R1,650.00</div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (section.id === "quiz") {
                  return (
                    <div 
                      key="quiz"
                      onClick={() => setSelectedSection("quiz")}
                      className={cn(
                        "p-6 text-center bg-secondary/15 rounded-xl cursor-pointer border border-transparent transition-all my-4",
                        selectedSection === "quiz" ? "border-dashed border-accent bg-accent/10" : "hover:border-dashed hover:border-accent/40"
                      )}
                    >
                      <h3 className="font-serif uppercase tracking-widest text-primary text-sm">Discover Your Formula</h3>
                      <p className="text-muted-foreground text-[10px] my-2 max-w-xs mx-auto">Find your bespoke ratio formulation.</p>
                      <Button variant="outline" className="text-[8px] uppercase tracking-wider font-bold">Start Discovery</Button>
                    </div>
                  );
                }

                return null;
              })}

            </div>
          </div>
        </div>

        {/* Right Side: Contextual Edit Fields Panel */}
        <div className="w-80 bg-card border-l border-border/10 p-4 flex flex-col shrink-0 overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-serif text-xs font-semibold uppercase text-primary">Context Inspector</h3>
              <p className="text-[10px] text-muted-foreground">Edit active selected item properties</p>
            </div>

            {selectedSection === "announcement" && (
              <div className="space-y-3">
                <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Announcement Text</Label>
                <Input value={announcementBarText} onChange={(e) => setAnnouncementBarText(e.target.value)} />
              </div>
            )}

            {selectedSection === "hero" && (
              <div className="space-y-3 font-sans">
                <div className="space-y-1">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Hero Title Heading</Label>
                  <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Hero Subtitle</Label>
                  <Textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={4} className="text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">CTA Action Text</Label>
                  <Input value={heroCtaText} onChange={(e) => setHeroCtaText(e.target.value)} />
                </div>
              </div>
            )}

            {!selectedSection && (
              <div className="text-center p-8 text-muted-foreground">
                <p>Click on any section frame in the live viewport to inspect its properties.</p>
              </div>
            )}

            {selectedSection && selectedSection !== "hero" && selectedSection !== "announcement" && (
              <div className="space-y-2 text-center p-6 border border-dashed rounded-xl bg-secondary/15">
                <Grid className="h-6 w-6 text-accent mx-auto mb-1 opacity-70" />
                <h4 className="font-bold text-[10px] uppercase tracking-wider text-primary">{selectedSection} block</h4>
                <p className="text-[10px] text-muted-foreground">This section fetches catalogue details dynamically from the database.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
