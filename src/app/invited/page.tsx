import Link from "next/link";
import { MoveRight, ArrowDown } from "lucide-react";

export default function InvitedPage() {
  return (
    <div className="flex flex-col bg-[#F9F8F6] text-[#1A1A1A]">
      {/* Parallax Hero Section */}
      <header className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Dark translucent overlay */}
        <div className="absolute inset-0 bg-black/35 z-10" />
        
        {/* Background Image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2400&auto=format&fit=crop')`,
            backgroundAttachment: "fixed"
          }}
        />

        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center mt-20 space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/90 block">
            The Art of Celebration
          </span>
          <div className="w-16 h-[0.5px] bg-[#d4af37] mx-auto" />
          <h1 className="font-serif text-5xl md:text-8xl font-medium tracking-tight text-white leading-none">
            Curated Excellence<br />
            <span className="italic font-light text-white/90">for the Extraordinary</span>
          </h1>
          <p className="font-sans text-sm md:text-lg leading-relaxed text-white/90 max-w-2xl mx-auto font-light tracking-[0.02em] pt-4">
            We design and produce exclusive, high-end events tailored to the world's most discerning clientele. Your vision, executed with uncompromising precision.
          </p>

          <div className="pt-10">
            <a 
              href="#explore"
              className="group inline-flex flex-col items-center gap-3 text-white hover:text-[#d4af37] transition-colors duration-300"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">Explore</span>
              <ArrowDown className="h-4 w-4 animate-bounce text-[#d4af37]" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Contents */}
      <main id="explore" className="py-32 space-y-32">
        {/* Intro Statement Section */}
        <section className="mx-auto max-w-7xl px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight">
                Mastering<br />the Moment.
              </h2>
              <div className="w-16 h-[1.5px] bg-[#d4af37]" />
            </div>
            <div className="lg:col-span-7">
              <p className="font-sans text-sm md:text-base leading-relaxed text-[#1A1A1A]/80 font-light tracking-[0.02em]">
                Every event we touch is treated as a unique piece of art. From intimate gatherings to grand galas, our approach marries structural elegance with fluid, intuitive hospitality. We don't just plan events; we architect unforgettable atmospheres steeped in luxury and intent.
              </p>
            </div>
          </div>
        </section>

        {/* Bento Signature Services Grid */}
        <section className="mx-auto max-w-7xl px-8 w-full space-y-12">
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-6">
            <h3 className="font-serif text-3xl font-medium">Signature Services</h3>
            <Link
              href="/invited/gallery"
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37] hover:text-[#1A1A1A] transition-colors flex items-center gap-1.5"
            >
              View All <MoveRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Weddings (Large Card) */}
            <Link 
              href="/invited/gallery" 
              className="group relative lg:col-span-8 h-[400px] overflow-hidden rounded-[4px] border border-[#1A1A1A]/10 block shadow-md"
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-500 z-10" />
              <div 
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCU5EgrVafnPE9mlqEiUnMM9bOwHOSp5l_QlXY5DC_IFNufdQ7exMhoh6Ow0D62nqCuEKpAL28sNTVC3DntJh1aBPrnq6Zvn_s8OBxW8a30vQvBdYnD7Tthed2-7uoXfBAVmJhKq-HktXJUlyQOEMSUcgsZO6W9pXktYVQEranyaRPVxc9Du7Dq83Mnck3AbYAk42QLJ4sGF8lRzyweCyIB6MG1r3FxECL4knZhTtmPU5MkttFLu_2DtQBWmB-uTrHvGuMYL344cXs')` }}
              />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full flex items-end justify-between text-white">
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-white text-[#1A1A1A] font-sans text-[9px] font-semibold uppercase tracking-widest rounded-full shadow-sm">
                    Weddings
                  </span>
                  <h4 className="font-serif text-3xl font-medium tracking-tight">Bespoke Nuptials</h4>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#1A1A1A] transition-all duration-500 ease-out transform group-hover:scale-110">
                  <MoveRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </div>
            </Link>

            {/* Private Dining (Tall Card) */}
            <Link 
              href="/invited/gallery" 
              className="group relative lg:col-span-4 lg:row-span-2 min-h-[400px] lg:h-auto overflow-hidden rounded-[4px] border border-[#1A1A1A]/10 block shadow-md"
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-500 z-10" />
              <div 
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQWn87MOs24vz9GzL1pbgC6Qu0sXPkt0SpwY8x681-MQl_uSLg1EpHvbjzJdZPq4zw4eAOF7DS79H-3GTmM5hz_AUVe1h3Wz8wg065VN2Ej9QrTUxotB9QvaEwdgWKuIHLhzBDfWgeyIiRfuXNVRj6Y56uJYwqjy3S3ENz0rxzYZ_CrVoGIyXw8btb_yGtdbHCAw8Uc1thuEOT63MKnEFE9Uay_qkrs5JKoEFKyELpjdMOcWSgSoWWrc_hcb5Ac97MtUbNEGh7198')` }}
              />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full text-white space-y-4">
                <span className="inline-block px-3 py-1 bg-white text-[#1A1A1A] font-sans text-[9px] font-semibold uppercase tracking-widest rounded-full shadow-sm">
                  Culinary
                </span>
                <h4 className="font-serif text-3xl font-medium tracking-tight">Curated Dining</h4>
                <p className="font-sans text-xs text-white/80 font-light leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  World-class chefs crafting menus tailored to your palate and theme.
                </p>
              </div>
            </Link>

            {/* Corporate Galas (Wide Card) */}
            <Link 
              href="/invited/gallery" 
              className="group relative lg:col-span-8 h-[400px] overflow-hidden rounded-[4px] border border-[#1A1A1A]/10 block shadow-md"
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-500 z-10" />
              <div 
                className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBKGdl3gVV6zBWqGsz2eeStwMIIGOdVTsJ5A1QdetLMX-2Kt-eIHk15UmzPhEoFI8fIl17hyEUf8X0WgMRIqahYgrmPHmyxFg6uRChnobxq3FsUETe2sOBsD5_donDL7O0BjvwUrpTZIGg37JkAOscjoiB2TYvT0chN248KwgIi1DMWkY9NyNHXbGJ-5RCwl3k7ZafMBUZl54ii_hDPXMlMxZW-6nHpOuy_jKVJbFrbVMui0BPvS6m14gFSecvb3ouxT8LX0R0TId4')` }}
              />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full flex items-end justify-between text-white">
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-white text-[#1A1A1A] font-sans text-[9px] font-semibold uppercase tracking-widest rounded-full shadow-sm">
                    Corporate
                  </span>
                  <h4 className="font-serif text-3xl font-medium tracking-tight">Grand Galas</h4>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#1A1A1A] transition-all duration-500 ease-out transform group-hover:scale-110">
                  <MoveRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
