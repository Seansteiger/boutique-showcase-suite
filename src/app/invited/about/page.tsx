import Link from "next/link";
import { Sparkles, MoveRight } from "lucide-react";

export default function InvitedAboutPage() {
  return (
    <div className="flex flex-col space-y-32 pb-32 bg-[#F9F8F6] text-[#1A1A1A]">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-8 z-10">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37] block animate-fade-in">
              The Philosophy
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight leading-tight">
              The Art of<br />Gathering.
            </h1>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[#1A1A1A]/80 max-w-md font-light tracking-[0.02em]">
              We believe that true luxury lies in the details. It is the invisible thread that connects a breathtaking venue to a perfectly timed culinary experience.
            </p>
            <div className="pt-4">
              <Link
                href="/invited/rsvp"
                className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all duration-350 px-8 py-4 uppercase text-[10px] font-semibold tracking-[0.2em] rounded-[4px]"
              >
                Inquire With Us <MoveRight className="h-4 w-4 text-[#d4af37]" />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 relative h-[400px] md:h-[600px] rounded-[4px] overflow-hidden border border-[#1A1A1A]/10 shadow-lg">
            <img
              alt="Elegant event setup"
              className="w-full h-full object-cover grayscale-[20%] transition-transform duration-700 hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvLzylU4S3vtfxhZSqPTINvY-SbPz58buyjR8F8tTPLdAW9DqlQXNKnZMKuy9-PyNvqaNdwpMaZbU5wyGMxwpzYA9WH_VjqnnpZFv-wxMVVk8aTeuoYos4re5ZgXp6uvuqdTVZUJrKIpuBxVLizdB8DHv1hmCfcN7v4CNtURqCXkSCZaR0VycwnUSQSiPIVs4vxBTRoXeL1JKckVuVeOSDHcGOybw49yR5mhEQCI0Ib-OH3srK1C3Ppvo9bL1QN5cmlNvOonWUyJE"
            />
          </div>
        </div>
      </section>

      {/* Asymmetric Philosophy Section */}
      <section className="bg-[#1A1A1A] text-white py-24 border-y border-[#1A1A1A]/10">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4 lg:col-start-2 space-y-6 pt-6 lg:pt-0">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                Our Philosophy
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
                Curated<br />Excellence.
              </h2>
              <p className="font-sans text-xs md:text-sm text-white/70 leading-relaxed font-light">
                Every event is a bespoke narrative. We do not use templates; we use insight. By understanding the essence of our clients, we translate their vision into immersive, tactile environments.
              </p>
              <p className="font-sans text-xs md:text-sm text-white/70 leading-relaxed font-light">
                Our process is meticulous, grounded in a deep appreciation for craftsmanship, from custom stationery to spatial design.
              </p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 relative mt-12 lg:mt-0">
              <div className="relative aspect-[4/3] rounded-[4px] overflow-hidden border border-white/10 shadow-2xl">
                <img
                  alt="Detail of floral arrangement"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbhch0TbGYC61mOVnChJszFP6aruoX1C2PCOWFkK-c02iiSoAkIyZAksb0cT-IOZDwWJ8mpgrYW_jwwq0b6nOAGvtLj5sHLTL1I9Ssy7VDgnjQvlUuzq4kpWvYk1hyNGRGiVs6zgdoOm718GqOQ1kayCaZx9EGrkbmfNb73s3E4znXp_TOdVTfPVTlQG4QvIFZdiH4qZN5k2iamVbW_sQkXWXxt-VEJdDgg-NvPd97zUE8CtbEq1qYL5SxdJw3NrTLGhUzjt8ysGI"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-60 bg-[#F9F8F6] text-[#1A1A1A] p-6 shadow-2xl border border-[#1A1A1A]/10 hidden md:block rounded-[4px]">
                <Sparkles className="text-[#d4af37] h-6 w-6 mb-3 stroke-[1.25]" />
                <h4 className="font-serif text-sm font-semibold tracking-tight uppercase mb-1">Uncompromising Standards</h4>
                <p className="text-[10px] text-[#1A1A1A]/70 leading-relaxed font-light">
                  Executing timelines, catering menus, and bespoke styling setups without absolute compromise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Bento Grid */}
      <section className="mx-auto max-w-7xl px-8 w-full">
        <div className="text-center mb-20 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
            The Artisans
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight">
            Meet the Team
          </h2>
          <div className="w-12 h-[0.5px] bg-[#d4af37] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Team Member 1 */}
          <div className="group flex flex-col space-y-4">
            <div className="relative aspect-[3/4] rounded-[4px] overflow-hidden border border-[#1A1A1A]/10 shadow-md">
              <img
                alt="Elena Rostova Portrait"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS_2CIfo--lh3McLdybHwaoaJttyBC5_R5xCOND0vNeqorRsOzh1a9ClTMcxhDXCy6U2ryBpis43dgNYhIiy17z-Bs4_eDmBS8iU6UFXK-XzujDAdfnpZN5sLE3Oax8G56qTy_HvwzIsN54s8Nn0AYPWsR__UOFJx-wrLwFzoeBWEjjuWcL3XiT7t53bf_JEm8TAyYJWMvwCuums-Dx-FlTqqx2JIv5Hz0RUyb4KqRdgYGaIbenpDSv00H2P1zxdwdNB2eRHxMAWo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent opacity-60" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A1A]">Elena Rostova</h3>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37] mt-1">
                Founder & Creative Director
              </p>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="group flex flex-col space-y-4 md:-translate-y-8 transition-transform duration-500">
            <div className="relative aspect-[3/4] rounded-[4px] overflow-hidden border border-[#1A1A1A]/10 shadow-md">
              <img
                alt="Julian Vance Portrait"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6zjvgNcSHtGFzHSRwZtKdqIIlYzv5LIDXHLJfWr9v8awhkKTWMb1Bpc_4cqsb_ftqq7vPSI6AUBfh53DdwD8KAsuAq_rjXaIksyog2ajY0nbcEtQjrJzZudL6LaM3i1RHKLljnDpFT_n6_LVA06B56nZ1AbUb9TovqstBTPL8UzdYAadbXEt4DMjCg8QjhbUkIS10Q70SdS98moXQYNBATeKRnZYwFETgugvWt0KLOcFruLli56Ik_8BDkb5aZOlZsXoiVMvm76c"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent opacity-60" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A1A]">Julian Vance</h3>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37] mt-1">
                Head of Operations
              </p>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="group flex flex-col space-y-4">
            <div className="relative aspect-[3/4] rounded-[4px] overflow-hidden border border-[#1A1A1A]/10 shadow-md">
              <img
                alt="Sophie Laurent Portrait"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8_Eu88xVjSIwhH_ppe2MeEJU810CMXD-isUCVf7YEmaCToTxP7piAwZGSV4mdeN_z6s7jUOFwo0nRNeeCte8S05Ql-PAGDfEtjupk2Am9lzjnH2UQO0Aj9_qgIf3pTK_wl_6MRhgPr0S-ogy--DoXhV1cRBfNlLJN0cR1-VdA7Uk8yeXg_p12IVoMEUQd2dDFnUenYyt1TgvWNj-_CwW1w8Lf2J7kpTlginvmBUH3YtHBYtALOPKqouy8IuamPPIp2ebTjKmJjfE"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent opacity-60" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-serif text-xl font-semibold text-[#1A1A1A]">Sophie Laurent</h3>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37] mt-1">
                Culinary Director
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
