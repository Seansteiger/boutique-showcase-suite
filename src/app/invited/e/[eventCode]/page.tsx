"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import Link from "next/link";
import { MoveLeft, Check, Calendar, MapPin, Clock, Loader2, ArrowRight } from "lucide-react";

export default function EventRsvpPage({
  params,
}: {
  params: Promise<{ eventCode: string }>;
}) {
  const resolvedParams = use(params);
  const eventCode = resolvedParams.eventCode.toLowerCase().trim();

  // Convex lookups
  const event = useQuery(api.events.get, { code: eventCode });
  const submitRsvp = useMutation(api.rsvps.submit);
  const createEvent = useMutation(api.events.create);

  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attending: "yes",
    guestsCount: 0,
    dietaryRestrictions: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please provide your name and email");
      return;
    }

    setLoading(true);
    try {
      await submitRsvp({
        name: formData.name,
        email: formData.email,
        attending: formData.attending === "yes",
        guestsCount: Number(formData.guestsCount),
        dietaryRestrictions: formData.dietaryRestrictions,
        eventCode: eventCode,
      });

      setRsvpSubmitted(true);
      toast.success("RSVP registered successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit RSVP");
    } finally {
      setLoading(false);
    }
  };

  // Seeding helper if demo event is missing
  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      await createEvent({
        title: "The Autumn Solstice Gala",
        code: "gala-2026",
        clientName: "Ivory Committee",
        clientEmail: "concierge@invited.com",
        date: "2026-09-19",
        time: "18:00",
        location: "The Canopy Hall, 42 Solstice Boulevard",
      });
      toast.success("Demo event seeded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to seed demo event");
    } finally {
      setSeeding(false);
    }
  };

  // 1. Loading State
  if (event === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4 bg-[#F9F8F6]">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/60">
          Unfolding Invitation...
        </p>
      </div>
    );
  }

  // 2. Event Not Found State
  if (event === null) {
    return (
      <div className="mx-auto max-w-xl px-8 py-24 text-center space-y-8 bg-[#F9F8F6] text-[#1A1A1A] min-h-[70vh] flex flex-col justify-center items-center">
        <div className="w-12 h-12 rounded-full border border-red-500/20 flex items-center justify-center text-red-600 bg-red-50 mb-2">
          <Calendar className="h-5 w-5" />
        </div>
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37] block">
            Access Restricted
          </span>
          <h1 className="font-serif text-3xl font-medium tracking-tight">Invitation Not Found</h1>
          <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto leading-relaxed font-light">
            We could not find an active event associated with the access code <span className="font-semibold text-black">"{eventCode}"</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center">
          <Link
            href="/invited/rsvp"
            className="inline-flex items-center justify-center gap-1.5 border border-[#1A1A1A]/10 bg-white hover:bg-[#F9F8F6] transition-all px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] rounded-[4px]"
          >
            Try Another Code
          </Link>

          {eventCode === "gala-2026" && (
            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              className="inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] rounded-[4px]"
            >
              {seeding ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Seeding...
                </>
              ) : (
                <>
                  Seed Demo Event <ArrowRight className="h-3.5 w-3.5 text-[#d4af37]" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. RSVP Success View
  if (rsvpSubmitted) {
    return (
      <div className="mx-auto max-w-xl px-8 py-24 text-center space-y-8 bg-[#F9F8F6]">
        <div className="mx-auto w-12 h-12 bg-[#1A1A1A] text-white flex items-center justify-center rounded-none border border-[#d4af37]">
          <Check className="h-5 w-5 stroke-[2] text-[#d4af37]" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37] block">
          Response Logged
        </span>
        <h1 className="font-serif text-4xl font-medium tracking-tight">Thank You</h1>
        <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto leading-relaxed font-light">
          Your attendance choice has been cataloged for <span className="font-semibold text-black">{event.title}</span>. The hosts have been notified.
        </p>
        <div className="pt-6">
          <Link
            href="/invited"
            className="inline-block bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all duration-300 px-8 py-4 uppercase text-[10px] font-semibold tracking-[0.2em] rounded-[4px]"
          >
            Return to Invited
          </Link>
        </div>
      </div>
    );
  }

  // 4. Main Invitation Details & Form
  return (
    <div className="flex flex-col bg-[#F9F8F6] text-[#1A1A1A] pb-32">
      
      {/* Decorative Event Header Banner */}
      <section className="relative h-[45vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop')`,
          }}
        />
        <div className="relative z-20 text-center px-6 max-w-3xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
            Personal Invitation
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-white leading-tight">
            {event.title}
          </h1>
          <p className="text-xs text-white/80 font-light tracking-widest uppercase">
            Sourced for {event.clientName}
          </p>
        </div>
      </section>

      {/* Main Grid: Details, Itinerary, RSVP */}
      <section className="mx-auto max-w-7xl px-8 w-full mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Itinerary Details (7 columns) */}
        <div className="lg:col-span-7 space-y-16">
          
          {/* Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-[#1A1A1A]/10 py-10">
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
              <Calendar className="h-5 w-5 text-[#d4af37] stroke-[1.25]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">Date</span>
              <p className="text-xs font-medium">{event.date}</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2 border-y md:border-y-0 md:border-x border-[#1A1A1A]/10 py-6 md:py-0 md:px-6">
              <Clock className="h-5 w-5 text-[#d4af37] stroke-[1.25]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">Time</span>
              <p className="text-xs font-medium">{event.time || "TBD"}</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
              <MapPin className="h-5 w-5 text-[#d4af37] stroke-[1.25]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">Venue</span>
              <p className="text-xs font-medium leading-relaxed max-w-xs">{event.location}</p>
            </div>
          </div>

          {/* Programme/Itinerary */}
          {event.programme && event.programme.length > 0 && (
            <div className="space-y-8">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37] block">
                  The Sequence
                </span>
                <h3 className="font-serif text-2xl font-medium">Event Programme</h3>
              </div>

              <div className="relative border-l border-[#1A1A1A]/10 pl-6 space-y-8 ml-2 pt-2">
                {event.programme.map((item: any, idx: number) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Bullet marker */}
                    <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-[#d4af37] ring-4 ring-[#F9F8F6]" />
                    <span className="text-[10px] font-semibold text-[#d4af37] font-mono tracking-wider">
                      {item.time}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-[#1A1A1A]">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-[#1A1A1A]/70 font-light leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: RSVP Card Form (5 columns) */}
        <div className="lg:col-span-5 bg-white p-8 border border-[#1A1A1A]/10 rounded-[4px] shadow-sm space-y-8 h-fit">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37] block">
              Response Card
            </span>
            <h3 className="font-serif text-2xl font-medium">Submit Your RSVP</h3>
            <div className="w-8 h-[0.5px] bg-[#d4af37] mx-auto mt-2" />
          </div>

          <form onSubmit={handleRsvpSubmit} className="space-y-6 text-xs font-light">
            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-[0.15em] text-[10px] text-[#1A1A1A]/60 block">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pb-1.5 border-b border-[#1A1A1A]/20 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-[0.15em] text-[10px] text-[#1A1A1A]/60 block">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pb-1.5 border-b border-[#1A1A1A]/20 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="font-semibold uppercase tracking-[0.15em] text-[10px] text-[#1A1A1A]/60 block">
                Attendance Choice *
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer font-semibold uppercase tracking-wider text-[9px]">
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    checked={formData.attending === "yes"}
                    onChange={handleInputChange}
                    className="accent-[#d4af37]"
                  />
                  Accepts with pleasure
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold uppercase tracking-wider text-[9px]">
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    checked={formData.attending === "no"}
                    onChange={handleInputChange}
                    className="accent-[#d4af37]"
                  />
                  Declines with regret
                </label>
              </div>
            </div>

            {formData.attending === "yes" && (
              <div className="space-y-2 pt-1">
                <label className="font-semibold uppercase tracking-[0.15em] text-[10px] text-[#1A1A1A]/60 block">
                  Additional Guests Count
                </label>
                <select
                  name="guestsCount"
                  value={formData.guestsCount}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded-none outline-none focus:border-[#d4af37] text-xs"
                >
                  <option value={0}>0 Guests</option>
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                </select>
              </div>
            )}

            {formData.attending === "yes" && (
              <div className="space-y-1 pt-1">
                <label className="font-semibold uppercase tracking-[0.15em] text-[10px] text-[#1A1A1A]/60 block">
                  Dietary Restrictions
                </label>
                <input
                  type="text"
                  placeholder="Vegan, nuts allergy, none, etc."
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                  className="w-full pb-1.5 border-b border-[#1A1A1A]/20 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all py-4 uppercase text-[10px] font-semibold tracking-[0.2em] rounded-[4px] disabled:opacity-50 mt-4"
            >
              {loading ? "Registering..." : "Send Response"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
