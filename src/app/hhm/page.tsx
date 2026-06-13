"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HHMHomePage() {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero Anim
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-hero-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.2,
        }
      );

      // Scroll Reveals
      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-[#FFF9F0]">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden py-20 border-b border-[#6F4E37]/10">
        {/* CSS Organic Outline Blob Background */}
        <div className="absolute right-[40%] top-1/2 -translate-y-1/2 w-[450px] h-[450px] pointer-events-none opacity-25 select-none hidden md:block z-0">
          <div 
            className="absolute inset-0 border-2 border-dashed border-[#6F4E37]/30 animate-[spin_50s_linear_infinite]" 
            style={{ borderRadius: "50% 50% 50% 50% / 60% 40% 60% 40%" }}
          />
          <div 
            className="absolute inset-6 border border-[#E87D2E]/20 animate-[spin_35s_linear_infinite_reverse]" 
            style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
          />
          <div 
            className="absolute inset-12 bg-[#feeae0]/40 blur-2xl animate-[pulse_6s_ease-in-out_infinite]" 
            style={{ borderRadius: "50% 50% 50% 50% / 60% 40% 60% 40%" }}
          />
        </div>

        {/* Soft gradient overlay to ensure text legibility */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#FFF9F0] via-[#FFF9F0]/80 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 lg:col-span-6 flex flex-col justify-center items-start text-left">
            <span className="gsap-hero-item inline-block px-4 py-1.5 rounded-full bg-[#f8e4da] text-[#6F4E37] font-semibold text-xs uppercase tracking-wider mb-6 border border-[#6F4E37]/10">
              Hope lives here
            </span>
            <h1 className="gsap-hero-item font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#332F2C] leading-tight mb-6">
              Shopping with a <span className="text-[#E87D2E] italic">Story.</span>
            </h1>
            <p className="gsap-hero-item text-base md:text-lg text-[#564338] mb-10 max-w-lg leading-relaxed">
              Every item in our shop creates a second chance for abandoned babies and at-risk mothers. Welcome to a place where love becomes action.
            </p>
            <div className="gsap-hero-item flex flex-wrap gap-4">
              <Link
                className="inline-flex items-center justify-center bg-[#E87D2E] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#984800] transition-colors shadow-lg shadow-[#E87D2E]/20 hover:-translate-y-1 duration-300"
                href="/hhm/shop"
              >
                Shop the Collection
                <span className="material-symbols-outlined ml-2 text-[20px]">
                  arrow_forward
                </span>
              </Link>
              <Link
                className="inline-flex items-center justify-center bg-transparent border-2 border-[#6F4E37]/30 text-[#6F4E37] px-8 py-4 rounded-full font-bold text-sm hover:border-[#6F4E37] hover:bg-[#6F4E37]/5 transition-all duration-300"
                href="/hhm/stories"
              >
                Our Mission
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-6 relative mt-12 md:mt-0 hidden md:block">
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              {/* Decorative blob behind image */}
              <div
                className="absolute inset-0 bg-[#f8e4da] scale-105 opacity-50 blur-xl"
                style={{
                  borderRadius: "50% 50% 50% 50% / 60% 40% 60% 40%",
                }}
              />
              <div
                className="absolute inset-0 bg-[#E87D2E]/10 transform rotate-12 scale-95"
                style={{
                  borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
                }}
              />
              <div
                className="relative h-full w-full overflow-hidden border-4 border-white shadow-xl"
                style={{
                  borderRadius: "50% 50% 50% 50% / 60% 40% 60% 40%",
                }}
              >
                <img
                  alt="Cozy interior room setting featuring warm sunlight, a plush cream armchair, and an earthy textured rug"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC11bHzEoN3P0p55LUZ0cqotvSvYAZdKSpjklqhtVnfNlf_edevCkEt2ojjWBHNIOYC6Z3F3mZ5mSh15o-EOatnd7a7dScBtnaJBzliCFwHiZEp-5lAqHBNGUX13EVq_hAWonPS-i6xOBoNCYyQOKQDRz3m6GgwUzo-LlgQCwBb_JbCAJuXrW5Ef23U5m_szMHgRUQeZQv8ck61SDB5ttmc6klyyzWUoG3jeAjYYZVPLdwAfmBQzRyLpEt65Cz_mXeaGpciNcKT3SsI"
                />
              </div>

              {/* Floating Glass Badge */}
              <div
                className="absolute -bottom-6 -left-6 bg-white/85 backdrop-blur-md border border-[#6F4E37]/10 p-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <div className="bg-[#E19BB9]/20 p-2 rounded-full text-[#E19BB9]">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    volunteer_activism
                  </span>
                </div>
                <div>
                  <p className="font-bold text-xs text-[#6F4E37] leading-tight">
                    100% Proceeds
                  </p>
                  <p className="text-[10px] text-[#564338]">Go to our mission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-[#f8e4da] relative border-y border-[#6F4E37]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#6F4E37]/20 text-center">
            <div className="p-6 gsap-reveal flex flex-col items-center">
              <span className="material-symbols-outlined text-[40px] text-[#E87D2E] mb-4" style={{ fontVariationSettings: '"FILL" 1' }}>
                child_care
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#332F2C] mb-2">
                300+
              </h3>
              <p className="font-semibold text-sm text-[#6F4E37]">
                Little Lives Transformed
              </p>
            </div>
            <div className="p-6 pt-10 md:pt-6 gsap-reveal flex flex-col items-center">
              <span
                className="material-symbols-outlined text-[40px] text-[#E87D2E] mb-4"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                diversity_1
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#332F2C] mb-2">
                50+
              </h3>
              <p className="font-semibold text-sm text-[#6F4E37]">
                Families Restored
              </p>
            </div>
            <div className="p-6 pt-10 md:pt-6 gsap-reveal flex flex-col items-center">
              <span
                className="material-symbols-outlined text-[40px] text-[#E87D2E] mb-4"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                potted_plant
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#332F2C] mb-2">
                100%
              </h3>
              <p className="font-semibold text-sm text-[#6F4E37]">
                Dedicated to Renewal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections (Bento Grid) */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16 gsap-reveal">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#332F2C] mb-4">
            Curated for a Cause
          </h2>
          <p className="text-sm md:text-base text-[#564338] max-w-2xl mx-auto leading-relaxed">
            Discover unique finds that give items a second life and vulnerable families a second chance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Large Feature */}
          <Link
            className="group block md:col-span-8 relative rounded-2xl overflow-hidden shadow-md h-[400px] md:h-[550px] gsap-reveal"
            href="/hhm/shop"
          >
            <img
              alt="Handpicked Furniture"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AP1WRLuT9IYxmrBcH1G7VXNvkYHNErdL8enk7WAN2gpAT3_Shu66GifxEdF3UVW3ZxbnYz_wOwvfas7aG5CxuWAr1vMW5pKij21mY_v9HPSsBZ0fZHAoxeIC3jUMTcxA6k_db67XA12RD_-ZED2kSCKOOLQJC3tE9G0uxQKLNOriEWw_Tj-81r98xP9I3j3gxrM7XkLSjvy95ymHy8im00YSDUy7swEuI7zsnDEMYIggUFK1CFHucdhruQ6HxIlC"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex justify-between items-end">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full mb-3 border border-white/30 uppercase tracking-wider">
                    Top Category
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">
                    Handpicked Furniture
                  </h3>
                  <p className="text-white/80 text-sm font-sans">
                    Quality pieces looking for a new home.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-full text-[#E87D2E] group-hover:bg-[#E87D2E] group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-2">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Side Stack */}
          <div className="md:col-span-4 flex flex-col gap-6 h-auto">
            <Link
              className="group block relative rounded-2xl overflow-hidden shadow-md flex-1 min-h-[200px]"
              href="/hhm/shop"
            >
              <img
                alt="Curated Home Decor items"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuATSt8bVP7uGAwnQCnr6w-QCmIrWp7ntVKa5QMEaD98diO9j4ucXD2Nu7tZIrGloitvO4ItXVfvtoOPYZP0Cya4N6mkwBwPXnVAYZgT9fSgC2BH46SUw9Aj3PadvVUXJNW2SD3ORhs_F99G-v2ncamJGE0NCvYx4pGhGYMrCKjqohUzNWFgSwkwO2cYFuptHdYatP-p0GQNRn9D7Cd8awmvOp4Hhj4A74MErDEOZRApYyJDkJjxpF18HialLir-mvYcQf4ka0J09Xmt"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-1">
                  Curated Decor
                </h3>
                <p className="text-white/80 text-xs font-semibold group-hover:underline">
                  Shop Now
                </p>
              </div>
            </Link>

            <Link
              className="group block relative rounded-2xl overflow-hidden shadow-md bg-[#f8e4da] p-6 flex flex-col justify-between flex-1 min-h-[200px]"
              href="/hhm/donate"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#6F4E37] w-2/3 leading-tight">
                  Gifts of Hope
                </h3>
                <span
                  className="material-symbols-outlined text-[#E87D2E] text-3xl"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  redeem
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[#564338] text-xs leading-relaxed mb-4">
                  Meaningful gifts that support our on-site Montessori and mothers in crisis.
                </p>
                <span className="inline-flex items-center text-[#E87D2E] font-bold text-xs uppercase tracking-wider group-hover:gap-2 transition-all">
                  Explore
                  <span className="material-symbols-outlined text-sm ml-1">
                    chevron_right
                  </span>
                </span>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-10 -right-10 bg-[#E87D2E]/10 w-32 h-32 rounded-full blur-2xl pointer-events-none" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
