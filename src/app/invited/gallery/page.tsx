"use client";

import { useState } from "react";
import { MoveRight } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  subtitle: string;
  category: "WEDDINGS" | "GALAS" | "EDITORIAL";
  image: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "The Vanderbilt Gala",
    subtitle: "NEW YORK CITY — 2023",
    category: "GALAS",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDb_3IdFc5YRDZltywY5hyhgqiOKMKkuOfUQ0Oy8jfFYBiExKjB0dWwcw2gW2GHbNL6OlwdbuX1JilrR4YdbYeQJ1Ty7Z5_1Xog8B-F7xXylTAy4g_QmO-ofes48f0GNPsYuG8UMOOvDbo0FBvnC-ahNruoU0FJUUDaCmHcmvEhDDVG6EE1Q9SSCjvUAcjBKaDHj1NPW5F8aZFn0pYUyRg_Ln_ketKVXGIrs1HHzj75IOubYgw7o_qxqFcX9EF0eAB75T7HxG3tmTA",
  },
  {
    id: 2,
    title: "Botanical Study",
    subtitle: "FLORAL DESIGN",
    category: "EDITORIAL",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXuLCqfa9J-tV8zkmRwH09LAVhJiRnSZh0fRHFMnPRVUPbsK5aWRApPz2v4n_LPiGBF32HX2EisrGp0a4soHuHZ-RvJx5gV340TkJvuVUHkU0zgYi6djewas1hye7kRJS5-ypH362S3yGTA1MxTWinsD5jUlMAgW0m6CgWWCarddx4otr2_0rlQEkNddl1WKA28u3__KD1KL6S81n7x-QBTJ9M3yNRM7XPKZ43iQstwfd9LOW0OjycEoX2U58M_YkS8fNwW7fwTNo",
  },
  {
    id: 3,
    title: "Modernist Tablescape",
    subtitle: "CATERING & DECOR",
    category: "EDITORIAL",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2TWKAYvqGrPX9exFYHHNNcb0INTsem_gD4ekZsDiZcav_pKBG-ERcFM5lRtfi8J475Hq0rnHut0EOzWAPfLcLW0QYTbOZ0e8BTNXWezvujwWxvBFdh5drL7tIG0enmeH_NUFOkenEv4TZFiDi0D3SAcJ7sQ-HPDf9fb8cLCfUh_QC6oTPtThI4FwXxuQUCMmDHbhPxhSQ9eeUWs4fZxAaFila-JrFgRJsYyv8oXobEtb70ASPPDiCFqP_Wdg-6rnHAb83s-YwS9Y",
  },
  {
    id: 4,
    title: "The Estate Wedding",
    subtitle: "TUSCANY — 2024",
    category: "WEDDINGS",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxbhNfGTBbbP2XpjZeopKFYn_-WFZV7gsHWWbgKYmW0vOULSaA7Yhw7tFks2QJFbFPtc46KFexihLAa_Q0-0NhRoU0InYNMBYc3_rX4GJ-ZwJFJFw0ms-HHzGaN-w_J9BKOQFUtK3u_YKWF7Y5QjWHBAk5tkGZbMVhQ1HxVQs7eE-dm_DzE-z2v4rJZulofbHQiZAUYXjV9Gyj6dGVuOM72ZhOkWChYfG0H88EqFjWHUeRCYLixgRL-izd3h_FcVCj1C8mwVxhP5w",
  },
  {
    id: 5,
    title: "Twilight Reception",
    subtitle: "PROVENCE — 2022",
    category: "WEDDINGS",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDU00qYewu5AzvOWGr1vi4qf6EOG40Q0EAwSwOg9xygx1LCh2y1q2AYSt8wrC6C_b8HmYjTWb6vXmFQCo9kU8LnAnA68MkDULNJvIxwQkgyrv7roE-n6Fy9taYYIUx3N5pWhgRUAAswAC_Z2r-jkxxC031-TmjUmmqhUT1OzOy5EmiLWdVgV34BdLDSrqGujrf-_9S_-zubIickWKYiOceXfWccFIqUzBFplUnxhBdxR_8nhBOMSYXiWTQVblJTjvPhoVpaOOSiYCA",
  },
  {
    id: 6,
    title: "The Toast",
    subtitle: "CURATION",
    category: "GALAS",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD18kTJ5I4Gx-saBQxKRSP638OfmSc4DloZL15Y94kYLNaJDNgecP6sPUagDdq5xkn0OD1rapbwWzMRZFHlgCojRX_tZaBLIe-pTpYZ-EjRtjeMBMcxec9iUKuGGgHFIinYTRdCXOLdIb2-3fHjos87LRHvRiMYwGfVIIZ9MEMkkJ-WhL5ZmBM85PoVt37QSkR6g9GD70j5FV8IkimK1vmdLZ35-h_eylXLuK7bOfocgj62g0XVMExtJZDwBFK9x0X4rgzfsp1MN5E",
  },
];

type FilterType = "ALL" | "WEDDINGS" | "GALAS" | "EDITORIAL";

export default function InvitedGalleryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  const filteredItems = galleryItems.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.category === activeFilter;
  });

  return (
    <div className="flex flex-col space-y-16 pb-32 bg-[#F9F8F6] text-[#1A1A1A]">
      {/* Hero Header Section */}
      <section className="max-w-4xl mx-auto px-6 pt-24 text-center space-y-8">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37] block">
          The Archive
        </span>
        <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight">
          A Curated Perspective
        </h1>
        <div className="w-16 h-[0.5px] bg-[#d4af37] mx-auto" />
        <p className="font-sans text-sm md:text-base leading-relaxed text-[#1A1A1A]/80 max-w-2xl mx-auto font-light tracking-[0.02em]">
          Explore a selection of our most distinctive events. Each frame captures the ephemeral beauty, meticulous design, and profound emotion that define the Invited experience.
        </p>
      </section>

      {/* Filter Tabs */}
      <section className="w-full flex justify-center space-x-8 md:space-x-12 px-6">
        {(["ALL", "WEDDINGS", "GALAS", "EDITORIAL"] as FilterType[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`text-[10px] font-semibold uppercase tracking-[0.2em] pb-2 border-b transition-all duration-300 ${
              activeFilter === filter
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
            }`}
          >
            {filter === "ALL" ? "All Works" : filter}
          </button>
        ))}
      </section>

      {/* Masonry Grid */}
      <section className="mx-auto max-w-7xl px-8 w-full">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 [column-fill:_balance]">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid relative group overflow-hidden bg-[#efeded] border border-[#1A1A1A]/10 rounded-[4px] shadow-sm cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-auto object-cover transform transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-white space-y-2">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d4af37] block">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-xl font-medium tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[10px] tracking-[0.15em] text-white/70 font-light">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Action */}
        <div className="mt-20 flex justify-center">
          <button className="inline-flex items-center gap-2 border-b border-[#1A1A1A] pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#d4af37] hover:border-[#d4af37] transition-all duration-300">
            View More Archives <MoveRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
