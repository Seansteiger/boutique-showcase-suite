"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HHMStoriesPage() {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initial fade in for hero elements
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-fade-in-up",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        }
      );

      // Scroll reveals for sections and items
      gsap.utils.toArray<HTMLElement>(".gsap-scroll-reveal").forEach((element) => {
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

      // Timeline path animation or stagger reveal
      gsap.fromTo(
        ".gsap-timeline-node",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".gsap-timeline-container",
            start: "top 75%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#FFF9F0] text-[#332F2C] min-h-screen">
      {/* Section 1: The Hands Behind the Hope */}
      <section className="py-16 md:py-24 px-6 md:px-16 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-6 gsap-fade-in-up">
            <span className="inline-block font-bold text-xs text-[#6F4E37] uppercase tracking-wider bg-[#f8e4da] px-3.5 py-1.5 rounded-full border border-[#6F4E37]/10">
              The Why
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#984800]">
              The Hands Behind the Hope
            </h1>
            <p className="text-base md:text-lg text-[#564338] leading-relaxed">
              At Hotel Hope Ministries, every act of kindness becomes a stepping stone toward a brighter future. We exist to transform vulnerable lives with compassion, stability, and opportunity.
            </p>
            <p className="text-sm text-[#564338]/90 leading-relaxed">
              From caring for abandoned and at-risk babies to empowering mothers in crisis and sustaining our mission through community-run charity shops, we believe that hope is not just given, it’s created together.
            </p>
          </div>
          <div className="lg:col-span-7 relative mt-12 lg:mt-0 gsap-fade-in-up">
            <div className="relative z-10 w-4/5 ml-auto">
              <img
                alt="Caregiver and child"
                className="w-full h-auto rounded-xl shadow-md object-cover aspect-[4/3]"
                src="https://lh3.googleusercontent.com/aida/AP1WRLtg49CaxpodIL1AbcnyXj7Ye5ImNWKFzp24GlWx7jhEPMv2_Eh9C-7jF7UGPqUPArrOSMgYJbUg1qpO4ZT5lnV0w0kvPozCGzhk18pK-pse2vr9ARJ_v1EKILmXywI0JPTROdp_ykb5tQVomgsL_fJH3Qbb_SExyDrxcp6J1WXleba6O_4TdeXW541Kqros-d2he9eEmrjn4ouxRrShCfQwREaxIV-arm_okN9-XXnE54pQgSp2lyMORQYH"
              />
            </div>
            <div className="absolute bottom-[-10%] left-0 w-3/5 z-20">
              <div className="bg-white p-2.5 rounded-xl shadow-lg border border-[#E87D2E]/10">
                <img
                  alt="Community support"
                  className="w-full h-auto rounded-lg object-cover aspect-square"
                  src="https://lh3.googleusercontent.com/aida/AP1WRLubq3zo7q7GUFCUUJuHy2gla5Q7Mk7fe4Efk6uN3Z77Cn4HXMMphXm3bZwkJoORJSbvlqJioXh5ejCwPl9KQKsSoST7rr6dQW8O_yhVnHJ85uzzbil8XuYYgsZ3KI7CuJ7ZoYwLdjRo1oTOr1UFH-whfsxhHZT_C-TvqWM_nW0qmzcaZ9vCOkviQXbZ5sqV0WYrFwDVWBZh9poeD51SQs8QkTXeoBIBqab4xdTS2TXfZLc-Smll1y5sDop8"
                />
              </div>
            </div>
            {/* Decorative Blob */}
            <div
              className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-[#f8e4da] z-0 opacity-40 blur-xl pointer-events-none"
              style={{
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
              }}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Timeline */}
      <section className="py-20 bg-white px-6 md:px-16 border-y border-[#6F4E37]/10">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-16 gsap-scroll-reveal">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#984800] mb-4">
              A Journey of Restoration
            </h2>
            <p className="text-sm md:text-base text-[#564338]">
              Tracing the path from vulnerability to a secure, loving environment.
            </p>
          </div>

          <div className="relative space-y-16 gsap-timeline-container pb-4">
            {/* The vertical timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#6F4E37]/20 -translate-x-1/2 z-0" />

            {/* Node 1 */}
            <div className="relative w-full md:w-1/2 pr-0 md:pr-12 md:mr-auto md:text-right pl-12 md:pl-0 gsap-timeline-node z-10 group">
              <div className="absolute left-6 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-1/2 top-1.5 w-5 h-5 bg-[#E87D2E] rounded-full ring-4 ring-[#FFF9F0] group-hover:scale-125 transition-transform duration-300" />
              <h3 className="font-serif text-xl font-bold text-[#332F2C] mb-2">
                Immediate Safety
              </h3>
              <p className="text-sm text-[#564338] leading-relaxed">
                Providing safe, loving care for abandoned and surrendered infants, ensuring they receive immediate support and stability.
              </p>
            </div>

            {/* Node 2 */}
            <div className="relative w-full md:w-1/2 pl-12 md:pl-12 md:ml-auto md:text-left gsap-timeline-node z-10 group">
              <div className="absolute left-6 -translate-x-1/2 md:left-0 md:-translate-x-1/2 top-1.5 w-5 h-5 bg-[#f8e4da] border-2 border-[#6F4E37] rounded-full ring-4 ring-[#FFF9F0] group-hover:scale-125 transition-transform duration-300" />
              <h3 className="font-serif text-xl font-bold text-[#332F2C] mb-2">
                Nurture & Development
              </h3>
              <p className="text-sm text-[#564338] leading-relaxed">
                Our on-site Montessori creates a calm, child-centred environment where little ones explore, grow, and build confidence.
              </p>
            </div>

            {/* Node 3 */}
            <div className="relative w-full md:w-1/2 pr-0 md:pr-12 md:mr-auto md:text-right pl-12 md:pl-0 gsap-timeline-node z-10 group">
              <div className="absolute left-6 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-1/2 top-1.5 w-5 h-5 bg-[#f8e4da] border-2 border-[#6F4E37] rounded-full ring-4 ring-[#FFF9F0] group-hover:scale-125 transition-transform duration-300" />
              <h3 className="font-serif text-xl font-bold text-[#332F2C] mb-2">
                A Forever Family
              </h3>
              <p className="text-sm text-[#564338] leading-relaxed">
                Working tirelessly towards long-term solutions, rewriting stories by placing children in permanent, loving families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Testimonials */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="mb-16 gsap-scroll-reveal">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#984800]">
            Voices of Resilience
          </h2>
          <p className="text-sm md:text-base text-[#564338]/90 mt-2">
            Walking alongside mothers in crisis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Testimonial Card 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-[#6F4E37]/10 relative overflow-hidden gsap-scroll-reveal group hover:shadow-md transition-shadow">
            <span
              className="material-symbols-outlined text-[48px] text-[#f8e4da] absolute top-4 left-4 opacity-50"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>
            <div className="relative z-10 space-y-6">
              <p className="font-serif text-lg md:text-xl italic text-[#332F2C] leading-relaxed">
                &ldquo;They didn&apos;t just offer me things; they offered me dignity when I felt I had none left. I was able to make informed decisions for my baby&apos;s future.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f8e4da] flex items-center justify-center text-[#6F4E37] font-bold text-sm">
                  S.M
                </div>
                <div>
                  <p className="font-bold text-sm text-[#984800]">Supported Mother</p>
                  <p className="text-xs text-[#564338]">Counselling Program</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Card 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-[#6F4E37]/10 relative overflow-hidden gsap-scroll-reveal group hover:shadow-md transition-shadow">
            <span
              className="material-symbols-outlined text-[48px] text-[#f8e4da] absolute top-4 left-4 opacity-50"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>
            <div className="relative z-10 space-y-6">
              <p className="font-serif text-lg md:text-xl italic text-[#332F2C] leading-relaxed">
                &ldquo;The support group helped me realise I wasn&apos;t alone. Today, my family is stronger, and we have a secure foundation to build upon.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f8e4da] flex items-center justify-center text-[#6F4E37] font-bold text-sm">
                  A.T
                </div>
                <div>
                  <p className="font-bold text-sm text-[#984800]">Community Member</p>
                  <p className="text-xs text-[#564338]">Family Strengthening</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Call to Action */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto gsap-scroll-reveal">
        <div className="max-w-4xl mx-auto bg-[#feeae0] rounded-2xl p-12 text-center border border-[#6F4E37]/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 p-8 opacity-5">
            <span className="material-symbols-outlined text-[120px]">favorite</span>
          </div>
          <span
            className="material-symbols-outlined text-[#E87D2E] text-[48px] mb-6"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#984800] mb-4">
            Your purchase rewrites this story.
          </h2>
          <p className="text-base text-[#564338] mb-8 max-w-2xl mx-auto leading-relaxed">
            Every item from Hotel Hope Interiors gives goods a second life and vulnerable families a second chance. Ready to help another?
          </p>
          <Link
            className="inline-flex items-center justify-center px-8 py-4 bg-[#E87D2E] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#984800] transition-colors shadow-sm gap-2"
            href="/hhm/shop"
          >
            Shop with Purpose
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
