"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HHMContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Fade in header elements on load
      gsap.fromTo(
        ".gsap-contact-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        }
      );

      // Scroll reveal for cards and form
      gsap.utils.toArray<HTMLElement>(".gsap-contact-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 45, opacity: 0 },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success("Thank you! Your message has been sent successfully.");
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-[#FFF9F0] text-[#332F2C] min-h-screen">
      <main className="w-full max-w-7xl mx-auto px-6 md:px-16 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="gsap-contact-header inline-block font-bold text-xs text-[#6F4E37] uppercase tracking-wider bg-[#f8e4da] px-3.5 py-1.5 rounded-full border border-[#6F4E37]/10 opacity-0">
            Get in Touch
          </span>
          <h1 className="gsap-contact-header font-serif text-4xl md:text-5xl font-bold text-[#984800] opacity-0">
            We&apos;d Love to Hear From You
          </h1>
          <p className="gsap-contact-header text-sm md:text-base text-[#564338] leading-relaxed opacity-0">
            Whether you have questions about our items, want to support our ministries, or just want to share your story, reach out to us below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          {/* Contact Details (Left Side) */}
          <div className="lg:col-span-5 space-y-8 gsap-contact-reveal opacity-0">
            <div className="bg-white rounded-xl p-8 border border-[#6F4E37]/10 shadow-sm space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#6F4E37] border-b border-[#6F4E37]/10 pb-4">
                Our Office
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[#E87D2E] text-2xl shrink-0 mt-0.5">
                    location_on
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-[#332F2C]">Address</h4>
                    <p className="text-xs text-[#564338]/90 leading-relaxed mt-1">
                      15 Hillside Road, Metropolitan Park,<br />
                      Parktown, Johannesburg, 2193
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[#E87D2E] text-2xl shrink-0 mt-0.5">
                    mail
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-[#332F2C]">Email</h4>
                    <p className="text-xs text-[#564338]/90 leading-relaxed mt-1">
                      info@hotelhopeministries.org
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[#E87D2E] text-2xl shrink-0 mt-0.5">
                    call
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-[#332F2C]">Phone</h4>
                    <p className="text-xs text-[#564338]/90 leading-relaxed mt-1">
                      +27 (0)11 484 4000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#feeae0] rounded-xl p-8 border border-[#E87D2E]/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="material-symbols-outlined text-[100px]">volunteer_activism</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#984800] mb-2">
                Charity Shops Intake
              </h3>
              <p className="text-xs text-[#564338] leading-relaxed">
                Want to donate furniture, clothing, or household items? Contact our donation pickup coordinators directly at <strong>intake@hotelhopeministries.org</strong> to schedule a collections vehicle.
              </p>
            </div>
          </div>

          {/* Contact Form (Right Side) */}
          <div className="lg:col-span-7 bg-white rounded-xl p-8 border border-[#6F4E37]/10 shadow-sm gsap-contact-reveal opacity-0">
            <h3 className="font-serif text-2xl font-bold text-[#6F4E37] mb-6">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#564338] uppercase tracking-wider" htmlFor="name">
                  Your Name
                </label>
                <input
                  required
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[#FFF9F0] border border-[#6F4E37]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E87D2E] focus:ring-1 focus:ring-[#E87D2E] transition-colors text-[#332F2C]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#564338] uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <input
                  required
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-[#FFF9F0] border border-[#6F4E37]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E87D2E] focus:ring-1 focus:ring-[#E87D2E] transition-colors text-[#332F2C]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#564338] uppercase tracking-wider" htmlFor="message">
                  Your Message
                </label>
                <textarea
                  required
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full bg-[#FFF9F0] border border-[#6F4E37]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E87D2E] focus:ring-1 focus:ring-[#E87D2E] transition-colors text-[#332F2C]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E87D2E] hover:bg-[#984800] text-white font-bold py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 shadow-sm text-sm uppercase tracking-wider"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Send Message
                    <span className="material-symbols-outlined text-sm">send</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
