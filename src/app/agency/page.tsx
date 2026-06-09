"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, ShieldCheck, Zap, Globe, DollarSign, 
  ArrowRight, Check, MessageSquare, ExternalLink, 
  Smartphone, Award, Palette, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AgencyShowcasePage() {
  const [selectedConcept, setSelectedConcept] = useState("scented");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    concept: "scented",
    customDomain: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const concepts = [
    {
      id: "scented",
      name: "SCENTED",
      niche: "Luxury Botanicals & Olfactory Art",
      description: "Organic aesthetic with deep green and cream HSL tones, asymmetric leaves button-radius, luxury typography, and smooth editorial grid layouts. Perfect for premium perfumes, wellness, skincare, and organic curators.",
      palette: ["#1B3022", "#F9F6F0", "#D4AF37"],
      font: "Playfair Display & Sans-Serif",
      vfx: "Botanical slow breathe-zoom",
      previewUrl: "/?preview=scented"
    },
    {
      id: "slate",
      name: "SLATE & CO",
      niche: "Architectural Tech & Minimalist Gear",
      description: "Crisp architectural interface featuring ultra-precise geometric line alignments, warm/cool slate grays, high-contrast cobalt blue accents, and responsive bento grids. Tailored for tech, EDC gear, premium vapes, and hardware creators.",
      palette: ["#0F172A", "#F1F5F9", "#3B82F6"],
      font: "Hanken Grotesk Geometric",
      vfx: "Elevation hover lifts",
      previewUrl: "/?preview=slate"
    },
    {
      id: "editorial",
      name: "L'ARTELIER",
      niche: "Haute Couture & Fine Jewelry",
      description: "Stark, unapologetic monochrome layout featuring zero-radius sharp edges, bold black-white grid dividers, high contrast borders, and massive cinematic hero headings. Designed to command prestige for premium apparel, designers, and high-jewelry.",
      palette: ["#000000", "#FFFFFF", "#888888"],
      font: "Playfair Display Serif Bold",
      vfx: "High-contrast border focus",
      previewUrl: "/?preview=editorial"
    },
    {
      id: "sandstone",
      name: "OASIS CO",
      niche: "Artisanal Home Decor & Pottery",
      description: "Warm, clay and terracotta styled design featuring a matte noise paper grain overlay texture, slow organic transition states, and warm earthy sandstone themes. Created for handcrafted goods, leather artisans, pottery, and furniture curators.",
      palette: ["#402014", "#FAF8F5", "#D97706"],
      font: "Georgia Serif & Matte Sans",
      vfx: "Matte Grain texture + slow transitions",
      previewUrl: "/?preview=sandstone"
    },
    {
      id: "ocean",
      name: "OCEAN MIST",
      niche: "Coastal Wellness & Fresh Activewear",
      description: "Fluid, vibrant design featuring navy and seafoam light backgrounds, active cyan-mint teal accents, glowing borders, and rounded capsule pill borders. Perfect for organic cosmetics, beach lifestyle, and premium fitness apparel.",
      palette: ["#0C2533", "#F0F9FF", "#14B8A6"],
      font: "Hanken Grotesk Clean",
      vfx: "Glow shadow + cinematic glare flash",
      previewUrl: "/?preview=ocean"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Order request registered! Our lead engineer will WhatsApp you within 2 hours.");
  };

  const activePreset = concepts.find(c => c.id === selectedConcept) || concepts[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white pb-16">
      
      {/* Background decoration grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 text-center z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-xs font-bold tracking-widest uppercase mb-4 animate-fade-in select-none">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Launch in 7 Days
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-[1.1] max-w-4xl mx-auto">
          Breathtaking Online Boutiques Built for Creators.
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-sans leading-relaxed">
          We design and deploy high-conversion, premium e-commerce storefronts tailored to your unique brand. No boilerplate layouts, no technical debt, and zero friction.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          <Button 
            onClick={() => {
              const el = document.getElementById("concepts-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-6 px-8 rounded-xl shadow-xl shadow-orange-950/20 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
          >
            Explore Case Studies
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button 
            onClick={() => {
              const el = document.getElementById("order-form");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            variant="outline" 
            className="border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white py-6 px-8 rounded-xl transition-all"
          >
            Book Launch Slot
          </Button>
        </div>
      </div>

      {/* Trust Metrics Banner */}
      <div className="relative border-y border-slate-900 bg-slate-900/10 backdrop-blur-sm py-8 z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl font-black text-white flex items-center justify-center gap-1">7 <span className="text-orange-500 text-sm">Days</span></div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Guaranteed Launch</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-white flex items-center justify-center gap-1">R5,000</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Fixed Cost Setup</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-white flex items-center justify-center gap-1">100%</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">South African Payment Keys</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-white flex items-center justify-center gap-1">.CO.ZA</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Custom Domain Included</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Showcase */}
      <div id="concepts-section" className="relative max-w-7xl mx-auto px-6 py-24 z-10 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Bespoke Storefront Showcase
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
            Explore active premium stores we created. Click &apos;View Live Store&apos; to instantly boot the live demonstration.
          </p>
        </div>

        {/* Tab List */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto p-1 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
          {concepts.map((concept) => (
            <button
              key={concept.id}
              onClick={() => setSelectedConcept(concept.id)}
              className={`px-5 py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-300 whitespace-nowrap ${
                selectedConcept === concept.id
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-950/20 font-black"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              {concept.name}
            </button>
          ))}
        </div>

        {/* Dynamic Concept Visual Card */}
        <div className="grid lg:grid-cols-5 gap-8 bg-slate-900/40 border border-slate-850 p-6 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          
          {/* Subtle colored glow backdrop */}
          <div 
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] opacity-10 pointer-events-none transition-all duration-700" 
            style={{ backgroundColor: activePreset.palette[2] }} 
          />

          <div className="lg:col-span-3 space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 font-bold text-[10px] uppercase tracking-wider rounded-full font-mono">
                  {activePreset.niche}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 text-[10px] uppercase font-bold tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Concept
                </span>
              </div>

              <h3 className="text-4xl md:text-5xl font-black text-white font-serif tracking-tight">
                {activePreset.name} Store
              </h3>

              <p className="text-slate-400 text-base leading-relaxed">
                {activePreset.description}
              </p>
            </div>

            {/* Design Spec Grid */}
            <div className="grid grid-cols-2 gap-6 py-4 border-t border-slate-800/60">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Typography</div>
                <div className="text-xs font-semibold text-slate-200">{activePreset.font}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Aesthetic Palette</div>
                <div className="flex items-center gap-1.5 mt-1">
                  {activePreset.palette.map((color, idx) => (
                    <span 
                      key={idx} 
                      className="h-4 w-4 rounded-full border border-white/10 shrink-0" 
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  <span className="text-[10px] font-semibold text-slate-400 ml-1 font-mono">{activePreset.palette[0]}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Special VFX Animation</div>
                <div className="text-xs font-semibold text-slate-200">{activePreset.vfx}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Payments Gateway</div>
                <div className="text-xs font-semibold text-slate-200">Yoco / PayFast (Dynamic Hooks)</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href={activePreset.previewUrl}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/20 shrink-0"
              >
                View Live Demo Store
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>

              <Button 
                onClick={() => {
                  setFormData({ ...formData, concept: activePreset.id });
                  const el = document.getElementById("order-form");
                  el?.scrollIntoView({ behavior: "smooth" });
                  toast.success(`Selected ${activePreset.name} preset for your launch query.`);
                }}
                variant="ghost"
                className="text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-950/20 hover:bg-slate-950/40 px-6 rounded-xl text-xs uppercase tracking-wider font-bold py-3.5"
              >
                Order This Concept
              </Button>
            </div>
          </div>

          {/* Interactive Screen Preview Graphics */}
          <div className="lg:col-span-2 flex items-center justify-center relative min-h-[300px] border border-slate-850 bg-slate-950/40 rounded-3xl p-6 select-none shadow-inner">
            <div className="absolute inset-0 flex items-center justify-center opacity-30 text-white font-serif italic text-7xl font-bold tracking-widest select-none pointer-events-none">
              {activePreset.name}
            </div>

            <div className="relative z-10 w-full max-w-xs space-y-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-2xl">
              {/* Fake Nav */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-serif italic text-sm text-white font-bold">{activePreset.name}</span>
                <div className="h-1.5 w-6 rounded-full bg-slate-800" />
              </div>

              {/* Fake Hero */}
              <div 
                className="h-24 rounded-lg flex items-center justify-center text-center p-3 relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${activePreset.palette[0]}, #1e293b)`,
                }}
              >
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-white leading-tight uppercase tracking-wider">Premium Curations.</div>
                  <div className="h-1.5 w-12 bg-white/40 rounded-full mx-auto" />
                </div>
              </div>

              {/* Fake Products Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2 border border-slate-800 bg-slate-950/40 p-2 rounded-xl">
                    <div className="h-14 rounded bg-slate-800" />
                    <div className="h-2 w-10 bg-slate-800 rounded" />
                    <div className="flex items-center justify-between">
                      <div className="h-2.5 w-6 bg-slate-700 rounded" />
                      <div className="h-4 w-4 bg-orange-600 rounded-full shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Package Breakdown section */}
      <div className="relative max-w-5xl mx-auto px-6 py-12 z-10">
        <Card className="bg-slate-900/60 border-slate-850 text-slate-100 overflow-hidden shadow-2xl rounded-3xl relative">
          <div className="absolute top-0 right-0 px-5 py-2 bg-orange-600 text-white font-bold text-[9px] uppercase tracking-widest rounded-bl-2xl shadow-md">
            Most Popular Package
          </div>
          
          <CardHeader className="p-8 md:p-12 pb-6">
            <CardTitle className="text-3xl font-black text-white tracking-tight">The 7-Day Brand Launch System</CardTitle>
            <CardDescription className="text-slate-400 text-sm leading-relaxed max-w-lg mt-1">
              A high-converting, fully customized storefront launched with zero developmental delays. We handle all coding, setups, and connections.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 md:p-12 pt-0 space-y-8">
            <div className="grid md:grid-cols-2 gap-8 py-6 border-y border-slate-800/80">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">What you get upfront (R5,000)</h4>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2.5"><Check className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" /> <span>Available Custom Domain (e.g. `.co.za`) mapped to your store</span></li>
                  <li className="flex items-start gap-2.5"><Check className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" /> <span>Full Dynamic Styling matching your precise color & font choices</span></li>
                  <li className="flex items-start gap-2.5"><Check className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" /> <span>Local Payment Gateways (**Yoco Inline & PayFast**) hooked to your bank</span></li>
                  <li className="flex items-start gap-2.5"><Check className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" /> <span>Initial catalog populated (Up to 100 premium products loaded)</span></li>
                  <li className="flex items-start gap-2.5"><Check className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" /> <span>Full Abandoned Cart Recovery system + Floating WhatsApp Support widgets</span></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Secure Hosting & Support Retainer (R299/mo)</h4>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2.5"><Check className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" /> <span>Ultra-fast Serverless Cloud Hosting (Vercel Core Platforms)</span></li>
                  <li className="flex items-start gap-2.5"><Check className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" /> <span>Automated catalog data backups on the Convex cloud DB</span></li>
                  <li className="flex items-start gap-2.5"><Check className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" /> <span>Free monthly design system updates (change colors/fonts upon request)</span></li>
                  <li className="flex items-start gap-2.5"><Check className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" /> <span>Ongoing security certificates & direct WhatsApp engineer support</span></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
              <div className="space-y-1 self-start">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Pricing Structure</div>
                <div className="text-white text-3xl font-black">R5,000 <span className="text-slate-500 text-sm font-semibold">upfront</span> + R299<span className="text-slate-500 text-sm font-semibold">/month</span></div>
              </div>
              
              <Button 
                onClick={() => {
                  const el = document.getElementById("order-form");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-bold py-6 px-10 rounded-xl tracking-wider text-xs uppercase"
              >
                Book Your Launch Spot
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Form */}
      <div id="order-form" className="relative max-w-xl mx-auto px-6 py-12 z-10">
        <div className="bg-slate-900 border border-slate-850 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-white">Book Your Launch</h3>
            <p className="text-slate-400 text-xs max-w-xs mx-auto">Fill in the brand request below. Our lead engineer will message you directly on WhatsApp to finalize visual specifications.</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Your Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sindi Cele"
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="sindi@celebeauty.co.za"
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">WhatsApp Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+27 82 123 4567"
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Concept Concept</label>
                  <select 
                    name="concept"
                    value={formData.concept}
                    onChange={handleInputChange}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="scented">Scented (Botanicals)</option>
                    <option value="slate">Slate & Co (Minimalist EDC)</option>
                    <option value="editorial">L&apos;Artelier (Monochrome Couture)</option>
                    <option value="sandstone">Oasis Co (Artisanal Clay)</option>
                    <option value="ocean">Ocean Mist (Coastal Wellness)</option>
                  </select>
                </div>
                <div className="grid gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Preferred Custom Domain</label>
                  <input 
                    type="text" 
                    name="customDomain"
                    value={formData.customDomain}
                    onChange={handleInputChange}
                    placeholder="e.g. celebeauty.co.za"
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Brand Vision or Custom Request</label>
                <textarea 
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe what items you are selling and any visual layout preferences..."
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-6 rounded-xl uppercase text-xs tracking-wider"
              >
                Secure Launch Slot (R5,000)
              </Button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white">Application Received!</h4>
                <p className="text-slate-400 text-xs max-w-xs mx-auto">We loaded your chosen theme: <strong className="text-slate-200 uppercase">{formData.concept}</strong>. An engineer will WhatsApp you at <strong className="text-slate-200">{formData.phone}</strong> inside 2 hours.</p>
              </div>
              <Button 
                onClick={() => setSubmitted(false)}
                variant="ghost"
                className="text-xs text-slate-500 hover:text-slate-400"
              >
                Submit another request
              </Button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
