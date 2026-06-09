"use client";

import { useState } from "react";
import { MoveRight, Loader2, Check } from "lucide-react";

export default function InvitedContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate luxury API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        eventType: "",
        message: "",
      });

      // Clear success notification after 5s
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="flex flex-col space-y-16 pb-32 bg-[#F9F8F6] text-[#1A1A1A]">
      {/* Hero Header Section */}
      <section className="max-w-4xl mx-auto px-6 pt-24 text-center space-y-8">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37] block">
          The Concierge
        </span>
        <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight">
          Curate Your <span className="italic font-light text-[#1A1A1A]/70">Experience</span>
        </h1>
        <div className="w-16 h-[0.5px] bg-[#d4af37] mx-auto" />
        <p className="font-sans text-sm md:text-base leading-relaxed text-[#1A1A1A]/80 max-w-2xl mx-auto font-light tracking-[0.02em]">
          Every remarkable event begins with a conversation. Share your vision with our dedicated concierge team, and allow us to orchestrate an experience that transcends the ordinary.
        </p>
      </section>

      {/* Asymmetric Split Layout */}
      <section className="mx-auto max-w-7xl px-8 w-full pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Address details */}
          <div className="lg:col-span-5 flex flex-col space-y-16">
            <div className="relative aspect-[16/10] rounded-[4px] overflow-hidden border border-[#1A1A1A]/10 shadow-md">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvMptx2S_zl2Rdn1gmejDlF8bfOWCDRvl7EzYU_UWTwphT8eMtJw8Mv3pUv6IBxRvmS8A57YtL9Jn63F8sFG4yFRuPLhAjHWhA9VmXm1nROxJYUA2hSCM1BVjroe6umCGYcOlKjdLVylTxh4BQAQWBwATBh-h9wG0J-yeYq9fQYFTjhmpMDXsqrbHQtNkRxXw14Gr6fagrMfyLn_KIe9lF7Xj2-I77BWtOPgk-vAnA-kG7x4mSJwjJ2IS2UyZBj-d_62cHeYdEoU4"
                alt="Table detail setup"
                className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="space-y-12">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#1A1A1A] mb-3">London Office</h3>
                <div className="text-xs font-light leading-relaxed text-[#1A1A1A]/70 space-y-1">
                  <p>14 Curzon Street</p>
                  <p>Mayfair, London W1J 5HN</p>
                  <p className="pt-2">
                    <a href="mailto:london@invited.com" className="hover:text-[#d4af37] transition-colors underline underline-offset-4">
                      london@invited.com
                    </a>
                  </p>
                  <p>+44 (0) 20 7499 9000</p>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-medium text-[#1A1A1A] mb-3">New York Office</h3>
                <div className="text-xs font-light leading-relaxed text-[#1A1A1A]/70 space-y-1">
                  <p>730 5th Avenue</p>
                  <p>New York, NY 10019</p>
                  <p className="pt-2">
                    <a href="mailto:newyork@invited.com" className="hover:text-[#d4af37] transition-colors underline underline-offset-4">
                      newyork@invited.com
                    </a>
                  </p>
                  <p>+1 212 555 0199</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37] mb-4">Connect</p>
              <div className="flex space-x-6 text-xs font-medium">
                <a href="#" className="hover:text-[#d4af37] transition-colors">Instagram</a>
                <a href="#" className="hover:text-[#d4af37] transition-colors">Pinterest</a>
                <a href="#" className="hover:text-[#d4af37] transition-colors">Journal</a>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-[#F4F3F0] border border-[#1A1A1A]/5 p-8 md:p-12 relative rounded-[4px] shadow-sm">
            {/* Subtle inner border */}
            <div className="absolute inset-2 border border-[#1A1A1A]/5 pointer-events-none rounded-[2px]" />
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/60 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-transparent border-0 border-b border-[#1A1A1A]/20 px-0 py-3 text-xs tracking-[0.02em] text-[#1A1A1A] focus:ring-0 focus:border-[#d4af37] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/60 block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-transparent border-0 border-b border-[#1A1A1A]/20 px-0 py-3 text-xs tracking-[0.02em] text-[#1A1A1A] focus:ring-0 focus:border-[#d4af37] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/60 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-0 border-b border-[#1A1A1A]/20 px-0 py-3 text-xs tracking-[0.02em] text-[#1A1A1A] focus:ring-0 focus:border-[#d4af37] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/60 block">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-0 border-b border-[#1A1A1A]/20 px-0 py-3 text-xs tracking-[0.02em] text-[#1A1A1A] focus:ring-0 focus:border-[#d4af37] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="eventType" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/60 block">
                  Nature of the Event
                </label>
                <select
                  id="eventType"
                  required
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full bg-transparent border-0 border-b border-[#1A1A1A]/20 px-0 py-3 text-xs text-[#1A1A1A] focus:ring-0 focus:border-[#d4af37] transition-colors appearance-none cursor-pointer rounded-none"
                >
                  <option value="" disabled>Select an occasion</option>
                  <option value="wedding">Wedding Celebration</option>
                  <option value="gala">Charity Gala</option>
                  <option value="corporate">Corporate Summit</option>
                  <option value="private">Private Dinner</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/60 block">
                  Your Vision
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe the atmosphere, scale, and intended dates..."
                  className="w-full bg-transparent border-0 border-b border-[#1A1A1A]/20 px-0 py-3 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:ring-0 focus:border-[#d4af37] transition-colors resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all duration-350 px-10 py-5 uppercase text-[10px] font-semibold tracking-[0.2em] rounded-[4px] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting...
                    </>
                  ) : formSubmitted ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-400" /> Inquiry Received
                    </>
                  ) : (
                    <>
                      Submit Inquiry <MoveRight className="h-3.5 w-3.5 text-[#d4af37]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
