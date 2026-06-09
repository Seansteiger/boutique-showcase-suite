"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Plus, Calendar, Users, CheckSquare, XSquare, AlertCircle, ExternalLink, Loader2, ArrowRight, Lock, Unlock, CreditCard, ChevronRight, BookOpen, Check } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function EventsAdminDashboard() {
  const events = useQuery(api.events.list);
  const rsvps = useQuery(api.rsvps.list, {});
  const createEvent = useMutation(api.events.create);

  // Modal open states
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    code: "",
    clientName: "",
    clientEmail: "",
    date: "",
    time: "",
    location: "",
  });

  // Purchase-locked Manual States
  const [purchased, setPurchased] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [activeManualTab, setActiveManualTab] = useState("ch1");
  const [paymentData, setPaymentData] = useState({
    cardholder: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isPurchased = localStorage.getItem("invited_blueprint_purchased") === "true";
      setPurchased(isPurchased);
    }
  }, []);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentData.cardholder || !paymentData.number || !paymentData.expiry || !paymentData.cvv) {
      toast.error("Please fill in all payment details.");
      return;
    }
    setCheckoutLoading(true);
    setTimeout(() => {
      localStorage.setItem("invited_blueprint_purchased", "true");
      setPurchased(true);
      setCheckoutLoading(false);
      setCheckoutModalOpen(false);
      toast.success("Purchase successful! Invited Platform Blueprint is now unlocked.");
    }, 2000);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.code || !newEvent.clientName || !newEvent.clientEmail || !newEvent.location || !newEvent.date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await createEvent({
        title: newEvent.title,
        code: newEvent.code,
        clientName: newEvent.clientName,
        clientEmail: newEvent.clientEmail,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
      });

      toast.success("Event created successfully");
      setModalOpen(false);
      setNewEvent({
        title: "",
        code: "",
        clientName: "",
        clientEmail: "",
        date: "",
        time: "",
        location: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  // Compute analytics
  const totalEvents = events?.length || 0;
  const totalAttending = rsvps
    ? rsvps.filter((r) => r.attending).reduce((sum, r) => sum + 1 + r.guestsCount, 0)
    : 0;
  const totalDeclined = rsvps ? rsvps.filter((r) => !r.attending).length : 0;
  const totalDietary = rsvps ? rsvps.filter((r) => r.attending && r.dietaryRestrictions).length : 0;

  return (
    <div className="mx-auto max-w-7xl px-8 py-16 space-y-12 bg-[#F9F8F6] text-[#1A1A1A]">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1A1A1A]/10 pb-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37] block">
            Console
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-medium">
            Event Management Suite
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all px-5 py-2.5 uppercase text-[10px] font-semibold tracking-[0.15em] rounded-[4px] mt-4 md:mt-0"
        >
          <Plus className="h-3.5 w-3.5" /> Enlist New Event
        </button>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded-[4px] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#d4af37]/10 text-[#d4af37] rounded-full">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Total Events</span>
            <span className="font-serif text-xl font-semibold">{totalEvents} Active</span>
          </div>
        </div>

        <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded-[4px] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Guests Confirmed</span>
            <span className="font-serif text-xl font-semibold">{totalAttending} Attending</span>
          </div>
        </div>

        <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded-[4px] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-full">
            <XSquare className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Regrets Logged</span>
            <span className="font-serif text-xl font-semibold">{totalDeclined} Declined</span>
          </div>
        </div>

        <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded-[4px] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Dietary Needs</span>
            <span className="font-serif text-xl font-semibold">{totalDietary} Flagged</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Events Registry & Operations Manual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Events Registry */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-serif text-xl font-medium">Client Events Registry</h3>
          
          {events === undefined ? (
            <div className="text-center py-16 bg-white border border-[#1A1A1A]/10 rounded-[4px]">
              <Loader2 className="h-6 w-6 animate-spin text-[#d4af37] mx-auto mb-2" />
              <p className="text-xs text-[#1A1A1A]/60 uppercase tracking-widest font-semibold">Loading events list...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[#1A1A1A]/10 rounded-[4px] space-y-4">
              <p className="text-xs text-[#1A1A1A]/60 font-light">No client events logged in registry yet.</p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all px-4 py-2 uppercase text-[10px] font-semibold tracking-[0.15em] rounded-[4px]"
              >
                Enlist Your First Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {events.map((event: any) => {
                // Aggregate event specific RSVPs
                const eventRsvps = rsvps ? rsvps.filter((r) => r.eventCode === event.code) : [];
                const attendingCount = eventRsvps.filter((r) => r.attending).reduce((sum, r) => sum + 1 + r.guestsCount, 0);
                const totalResponses = eventRsvps.length;

                // Check vendor confirmation summary
                const cateringConfirmed = event.catering?.confirmed ? "Confirmed" : "Pending";
                const decorConfirmed = event.decor?.confirmed ? "Confirmed" : "Pending";
                const flowersConfirmed = event.flowers?.confirmed ? "Confirmed" : "Pending";

                return (
                  <div key={event._id} className="bg-white border border-[#1A1A1A]/10 rounded-[4px] p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-serif text-xl font-semibold leading-snug">{event.title}</h4>
                          <span className="text-[10px] font-semibold text-[#d4af37] uppercase tracking-wider block mt-1">
                            Code: {event.code}
                          </span>
                        </div>
                        <Link
                          href={`/invited/e/${event.code}`}
                          target="_blank"
                          className="p-1.5 text-[#1A1A1A]/50 hover:text-[#d4af37] transition-colors border border-[#1A1A1A]/10 rounded-[4px]"
                          title="View Public Invitation Link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs font-light text-[#1A1A1A]/70">
                        <div>
                          <span className="font-bold text-[9px] uppercase tracking-wider block text-[#1A1A1A]/50">Date & Location</span>
                          <p>{event.date} {event.time && `at ${event.time}`}</p>
                          <p className="truncate max-w-[180px]">{event.location}</p>
                        </div>
                        <div>
                          <span className="font-bold text-[9px] uppercase tracking-wider block text-[#1A1A1A]/50">Client Contact</span>
                          <p className="font-semibold text-[#1A1A1A]">{event.clientName}</p>
                          <p className="truncate max-w-[180px]">{event.clientEmail}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-[#1A1A1A]/5 pt-4 text-center">
                        <div className="bg-[#F9F8F6] p-2 rounded">
                          <span className="block text-[8px] uppercase tracking-wider text-[#1A1A1A]/50">RSVP Confirmed</span>
                          <span className="font-semibold text-sm">{attendingCount} Guests</span>
                        </div>
                        <div className="bg-[#F9F8F6] p-2 rounded">
                          <span className="block text-[8px] uppercase tracking-wider text-[#1A1A1A]/50">Total Responses</span>
                          <span className="font-semibold text-sm">{totalResponses} Logged</span>
                        </div>
                        <div className="bg-[#F9F8F6] p-2 rounded">
                          <span className="block text-[8px] uppercase tracking-wider text-[#1A1A1A]/50">Checklist Tasks</span>
                          <span className="font-semibold text-sm">
                            {event.checklist ? event.checklist.filter((c: any) => c.status === "completed").length : 0} / {event.checklist?.length || 0}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-[#1A1A1A]/5 pt-4 flex gap-4 text-[9px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60">
                        <span>Catering: <span className={event.catering?.confirmed ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>{cateringConfirmed}</span></span>
                        <span>Decor: <span className={event.decor?.confirmed ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>{decorConfirmed}</span></span>
                        <span>Flowers: <span className={event.flowers?.confirmed ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>{flowersConfirmed}</span></span>
                      </div>
                    </div>

                    <Link
                      href={`/invited/admin/${event.code}`}
                      className="w-full text-center bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all py-3 uppercase text-[9px] font-semibold tracking-[0.2em] rounded-[4px] flex items-center justify-center gap-1.5"
                    >
                      Open Planner Console <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Platform Operations Manual */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-serif text-xl font-medium font-sans">Operations Manual & Blueprint</h3>
          
          {!purchased ? (
            <div className="relative overflow-hidden rounded-[4px] border border-[#d4af37]/35 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] text-white p-6 shadow-xl flex flex-col justify-between min-h-[480px]">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-[#d4af37] to-[#f3e5ab] text-[#1A1A1A] text-[9px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-bl-[4px] shadow flex items-center gap-1">
                <Lock className="h-3 w-3" /> Locked Blueprint
              </div>

              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-[#d4af37] uppercase tracking-[0.2em] block">
                    Enterprise Operations Manual
                  </span>
                  <h4 className="font-serif text-2xl font-medium leading-tight">
                    The Invited Platform Architecture Guide
                  </h4>
                </div>

                <p className="text-xs text-white/70 leading-relaxed font-light font-sans">
                  For professional planners and developers seeking to customize or deploy their own multi-tenant event suite. Unlocks the complete source implementation handbook.
                </p>

                <div className="space-y-3 pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] block">Manual Chapters:</span>
                  <ul className="space-y-2 text-xs text-white/80 font-light font-sans">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                      <span><strong>Chapter 1:</strong> Dynamic Client Onboarding Architecture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                      <span><strong>Chapter 2:</strong> Convex Database Schema & Validation Triggers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                      <span><strong>Chapter 3:</strong> White-Label Tenant Design Configuration</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-[8px] uppercase tracking-widest text-white/50">Showcase Price</span>
                    <span className="font-serif text-2xl font-medium text-[#d4af37]">$49.00 <span className="text-xs text-white/60">USD</span></span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-white/40 italic font-light font-sans">Lifetime Access</span>
                </div>
                <button
                  onClick={() => setCheckoutModalOpen(true)}
                  className="w-full bg-[#d4af37] text-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] transition-all py-3.5 uppercase text-[10px] font-bold tracking-[0.2em] rounded-[4px] shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-4 w-4" /> Unlock Master Blueprint
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-[4px] border border-[#d4af37]/20 bg-white p-6 shadow-lg flex flex-col min-h-[480px]">
              <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#d4af37]/10 text-[#d4af37] rounded flex items-center justify-center">
                    <Unlock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[#d4af37] uppercase tracking-wider block">SHOWCASE BLUEPRINT</span>
                    <h4 className="font-serif text-base font-semibold">Operations Manual</h4>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-[8px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                  Purchased
                </span>
              </div>

              {/* Chapter Selector Tabs */}
              <div className="flex border-b border-[#1A1A1A]/5 mb-4 text-[9px] uppercase font-semibold tracking-wider">
                <button
                  onClick={() => setActiveManualTab("ch1")}
                  className={`flex-1 pb-2 border-b-2 text-center transition-all ${
                    activeManualTab === "ch1" ? "border-[#d4af37] text-[#1A1A1A]" : "border-transparent text-[#1A1A1A]/40"
                  }`}
                >
                  Ch 1: Onboarding
                </button>
                <button
                  onClick={() => setActiveManualTab("ch2")}
                  className={`flex-1 pb-2 border-b-2 text-center transition-all ${
                    activeManualTab === "ch2" ? "border-[#d4af37] text-[#1A1A1A]" : "border-transparent text-[#1A1A1A]/40"
                  }`}
                >
                  Ch 2: Database
                </button>
                <button
                  onClick={() => setActiveManualTab("ch3")}
                  className={`flex-1 pb-2 border-b-2 text-center transition-all ${
                    activeManualTab === "ch3" ? "border-[#d4af37] text-[#1A1A1A]" : "border-transparent text-[#1A1A1A]/40"
                  }`}
                >
                  Ch 3: Customizing
                </button>
              </div>

              {/* Document Viewport */}
              <div className="flex-grow overflow-y-auto max-h-[300px] text-xs font-light text-[#1A1A1A]/80 space-y-4 font-sans leading-relaxed">
                {activeManualTab === "ch1" && (
                  <div className="space-y-3">
                    <h5 className="font-serif text-sm font-semibold text-[#1A1A1A]">Chapter 1: Dynamic Client Onboarding</h5>
                    <p>
                      The onboarding workflow initializes tenant records by prompting the administrator for basic metadata (title, client contact, venue coordinates). 
                    </p>
                    <p>
                      Upon submission, a unique, url-safe `code` is assigned. The system provisions dynamic routing:
                    </p>
                    <pre className="bg-[#1A1A1A] text-white p-2 rounded text-[10px] overflow-x-auto font-mono">
{`// dynamic routing mapping example
src/app/invited/e/[eventCode]/page.tsx
-> fetch event via query api.events.getByCode
-> resolve layout themes dynamically`}
                    </pre>
                    <p>
                      Guests visiting the public link authenticate using a seamless code handshake. The dynamic onboarding module loads customizable RSVP elements tailored to the client's guest list configuration.
                    </p>
                  </div>
                )}

                {activeManualTab === "ch2" && (
                  <div className="space-y-3">
                    <h5 className="font-serif text-sm font-semibold text-[#1A1A1A]">Chapter 2: Convex Database Schema & Triggers</h5>
                    <p>
                      The database schema relies on Convex's document store, allowing high-performance, real-time subscriptions. The schema defines tables with validation indexes:
                    </p>
                    <pre className="bg-[#1A1A1A] text-white p-2 rounded text-[10px] overflow-x-auto font-mono">
{`// convex/schema.ts structure
defineSchema({
  events: defineTable({
    title: v.string(),
    code: v.string(), // indexed
    clientName: v.string(),
    clientEmail: v.string(),
    location: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    ...
  }).index("by_code", ["code"]),
})`}
                    </pre>
                    <p>
                      <strong>Trigger Functions:</strong> The RSVP mutation runs transactionally, updating guest aggregates and instantly triggering vendor alerts if seating constraints or dietary limits are exceeded.
                    </p>
                  </div>
                )}

                {activeManualTab === "ch3" && (
                  <div className="space-y-3">
                    <h5 className="font-serif text-sm font-semibold text-[#1A1A1A]">Chapter 3: White-Label Customization</h5>
                    <p>
                      White-labeling visual presets are loaded based on the event's design configuration. Standard systems support four core presets:
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Sandstone:</strong> Soft desert warm tones, Bodoni headers, light backgrounds.</li>
                      <li><strong>Ocean:</strong> Deep coastal blues, Montserrat pairings, rich glassmorphism.</li>
                      <li><strong>Slate:</strong> Industrial monochrome, minimal aesthetic, high-contrast borders.</li>
                      <li><strong>Scented:</strong> Romantic floral hues, elegant Serif typographic margins.</li>
                    </ul>
                    <p>
                      To adapt the application, edit the styling variables stored in the dynamic event configuration JSON payload, which injects HSL color tokens onto the layout's root element.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-[#1A1A1A]/10 text-center">
                <button
                  onClick={() => {
                    localStorage.removeItem("invited_blueprint_purchased");
                    setPurchased(false);
                    toast.success("Blueprint locked (simulated logout).");
                  }}
                  className="text-[9px] uppercase tracking-wider text-[#1A1A1A]/40 hover:text-red-600 transition-colors font-semibold"
                >
                  Reset / Lock Manual (Demo State)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enlist Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#1A1A1A]/10 rounded-[4px] max-w-xl w-full p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl font-medium border-b border-[#1A1A1A]/10 pb-4">
              Enlist New Client Event
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs font-light">
              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena & Julian's Gala Reception"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded-[4px] outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Unique Access Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. gala-2026, wedding-rose"
                  value={newEvent.code}
                  onChange={(e) => setNewEvent({ ...newEvent, code: e.target.value })}
                  className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded-[4px] outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Elena Rostova"
                    value={newEvent.clientName}
                    onChange={(e) => setNewEvent({ ...newEvent, clientName: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded-[4px] outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Client Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="elena@rostova.com"
                    value={newEvent.clientEmail}
                    onChange={(e) => setNewEvent({ ...newEvent, clientEmail: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded-[4px] outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded-[4px] outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Event Time (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 18:00"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded-[4px] outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Venue Location Address *</label>
                <input
                  type="text"
                  required
                  placeholder="The Canopy Hall, Highwood Gardens"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded-[4px] outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#1A1A1A]/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 py-3 border border-[#1A1A1A]/20 text-[#1A1A1A] hover:bg-[#F9F8F6] transition-all uppercase text-[10px] font-semibold tracking-wider rounded-[4px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-3 bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all uppercase text-[10px] font-semibold tracking-wider rounded-[4px] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" /> Provisioning...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-[#d4af37]/30 text-white rounded-[4px] max-w-md w-full p-8 shadow-2xl space-y-6 relative">
            
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-[#d4af37] transition-colors"
            >
              <XSquare className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <span className="text-[9px] font-bold text-[#d4af37] uppercase tracking-[0.25em] block">SECURE GATEWAY</span>
              <h3 className="font-serif text-2xl font-medium tracking-tight">Complete Checkout</h3>
              <p className="text-xs text-white/60 font-light font-sans">Enter payment details to unlock the master blueprint</p>
            </div>

            {/* Simulated credit card mockup */}
            <div className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] p-6 rounded-lg text-[#1A1A1A] shadow-lg space-y-6 relative overflow-hidden">
              {/* Card branding */}
              <div className="flex justify-between items-start">
                <span className="font-serif font-bold text-sm tracking-widest uppercase">INVITED PLATINUM</span>
                <span className="text-[8px] uppercase tracking-widest font-bold bg-[#1A1A1A] text-white px-2 py-0.5 rounded">
                  VIP DEBIT
                </span>
              </div>

              {/* Card number mockup */}
              <div className="font-mono text-base tracking-widest text-center py-2">
                {paymentData.number ? paymentData.number : "••••  ••••  ••••  ••••"}
              </div>

              {/* Card holder & expiry */}
              <div className="flex justify-between items-end text-xs uppercase">
                <div className="min-w-0 flex-1 pr-4">
                  <span className="text-[7px] text-[#1A1A1A]/60 block font-sans">Cardholder</span>
                  <span className="font-semibold tracking-wide truncate block">
                    {paymentData.cardholder ? paymentData.cardholder : "VALUED CLIENT"}
                  </span>
                </div>
                <div>
                  <span className="text-[7px] text-[#1A1A1A]/60 block font-sans font-medium">Expires</span>
                  <span className="font-semibold tracking-wider">
                    {paymentData.expiry ? paymentData.expiry : "MM/YY"}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-light text-white/90">
              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-white/60 block">Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  value={paymentData.cardholder}
                  onChange={(e) => setPaymentData({ ...paymentData, cardholder: e.target.value })}
                  className="w-full p-2.5 border border-white/10 bg-white/5 rounded-[4px] outline-none focus:border-[#d4af37] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-white/60 block">Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="4000 1234 5678 9010"
                  value={paymentData.number}
                  onChange={(e) => setPaymentData({ ...paymentData, number: e.target.value })}
                  className="w-full p-2.5 border border-white/10 bg-white/5 rounded-[4px] outline-none focus:border-[#d4af37] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-white/60 block">Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="06/28"
                    value={paymentData.expiry}
                    onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                    className="w-full p-2.5 border border-white/10 bg-white/5 rounded-[4px] outline-none focus:border-[#d4af37] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-white/60 block">Security Code (CVV)</label>
                  <input
                    type="password"
                    required
                    placeholder="•••"
                    maxLength={3}
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                    className="w-full p-2.5 border border-white/10 bg-white/5 rounded-[4px] outline-none focus:border-[#d4af37] text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="w-full py-3.5 bg-[#d4af37] text-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] transition-all uppercase text-[10px] font-bold tracking-widest rounded-[4px] flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Authorization Processing...
                    </>
                  ) : (
                    "Authorize Transaction — $49.00"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
