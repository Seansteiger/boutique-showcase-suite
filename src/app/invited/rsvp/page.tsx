"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoveLeft, Search, Loader2 } from "lucide-react";

export default function RsvpLookupPage() {
  const router = useRouter();
  const [eventCode, setEventCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventCode.trim()) {
      toast.error("Please enter your invitation code");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const codeClean = eventCode.toLowerCase().trim();

    try {
      // We perform client-side routing since Next.js can resolve parameters,
      // and the dynamic route page will handle fetching of event details.
      // For immediate verification, we route to the page, and if it's not found there, it handles fallback.
      router.push(`/invited/e/${codeClean}`);
    } catch (err) {
      toast.error("Error looking up event");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-8 py-20 space-y-12 bg-[#F9F8F6] text-[#1A1A1A] min-h-[70vh] flex flex-col justify-center">
      <Link
        href="/invited"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/60 hover:text-[#d4af37] transition-colors flex items-center gap-1.5 self-start"
      >
        <MoveLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37] block">
          Event Concierge
        </span>
        <h1 className="font-serif text-4xl font-medium tracking-tight">
          Enter Invitation Code
        </h1>
        <div className="w-12 h-[0.5px] bg-[#d4af37] mx-auto mt-4" />
        <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto leading-relaxed font-light pt-2">
          Please enter the custom event access code printed on the bottom of your digital or physical invitation card.
        </p>
      </div>

      {/* Lookup Card Form */}
      <form onSubmit={handleLookup} className="bg-white p-8 md:p-12 border border-[#1A1A1A]/10 rounded-[4px] shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/60 block">
            Access Code
          </label>
          <div className="relative flex items-center border-b border-[#1A1A1A]/20 focus-within:border-[#d4af37] transition-colors pb-1">
            <Search className="absolute left-0 h-4 w-4 text-[#1A1A1A]/40" />
            <input
              type="text"
              required
              placeholder="e.g. gala-2026, wedding-rose"
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value)}
              className="w-full pl-7 py-2 bg-transparent text-sm font-medium outline-none rounded-none border-none focus:ring-0"
            />
          </div>
        </div>

        {errorMsg && (
          <p className="text-red-600 text-xs font-medium">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all duration-400 py-4 uppercase text-[10px] font-semibold tracking-[0.2em] rounded-[4px] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> Verifying Access...
            </>
          ) : (
            "Access Invitation"
          )}
        </button>

        <div className="pt-4 border-t border-[#1A1A1A]/5 text-center space-y-2">
          <p className="text-[10px] text-[#1A1A1A]/50">
            Don't have a code? Use our demo event code below:
          </p>
          <button
            type="button"
            onClick={() => setEventCode("gala-2026")}
            className="text-xs font-semibold text-[#d4af37] hover:underline"
          >
            gala-2026
          </button>
        </div>
      </form>
    </div>
  );
}
