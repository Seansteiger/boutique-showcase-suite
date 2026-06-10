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

  // Seeding State
  const seedShowcase = useMutation(api.events.seedShowcase);
  const [seeding, setSeeding] = useState(false);

  const handleSeedShowcase = async () => {
    setSeeding(true);
    try {
      await seedShowcase();
      toast.success("Showcase events and scenarios seeded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to seed showcase events");
    } finally {
      setSeeding(false);
    }
  };

  // Auto-seed if registry is empty or missing showcase scenarios when page loads
  useEffect(() => {
    if (events !== undefined && !seeding) {
      const defaultCodes = ["gala-2026", "aurora-lounge", "elena-julian", "vanguard-vip", "solstice-lunch", "elysian-yacht"];
      const existingCodes = events.map((e: any) => e.code);
      const isMissingAny = defaultCodes.some(code => !existingCodes.includes(code));
      
      if (isMissingAny) {
        const autoSeed = async () => {
          setSeeding(true);
          try {
            await seedShowcase();
            toast.success("Showcase events and scenarios seeded automatically!");
          } catch (err: any) {
            console.error("Auto-seeding failed:", err);
          } finally {
            setSeeding(false);
          }
        };
        autoSeed();
      }
    }
  }, [events, seedShowcase, seeding]);

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
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={handleSeedShowcase}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 border border-[#d4af37] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all px-5 py-2.5 uppercase text-[10px] font-semibold tracking-[0.15em] rounded-[4px] disabled:opacity-50"
          >
            {seeding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Load Showcase Scenarios
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all px-5 py-2.5 uppercase text-[10px] font-semibold tracking-[0.15em] rounded-[4px]"
          >
            <Plus className="h-3.5 w-3.5" /> Enlist New Event
          </button>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded-[4px] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#d4af37]/10 text-[#d4af37] rounded-full">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A]/50">Total Events</span>
            <span className="font-serif text-xl font-semibold">{totalEvents} Active Showcase Events</span>
          </div>
        </div>

        <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded-[4px] shadow-sm flex items-center gap-4 sm:col-span-2">
          <div>
            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#d4af37]">Showcase Mode</span>
            <p className="text-xs text-[#1A1A1A]/70 font-light leading-relaxed mt-1">
              Click "Load Showcase Scenarios" to instantly populate the platform with 6 realistic event profiles (weddings, galas, yacht launches) and simulated client RSVP data.
            </p>
          </div>
        </div>
      </div>

      {/* Client Events Registry Showcase */}
      <div className="space-y-6">
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
              onClick={handleSeedShowcase}
              className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all px-4 py-2 uppercase text-[10px] font-semibold tracking-[0.15em] rounded-[4px]"
            >
              Load Showcase Scenarios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: any) => {
              // Check vendor confirmation summary
              const cateringConfirmed = event.catering?.confirmed ? "Confirmed" : "Pending";
              const decorConfirmed = event.decor?.confirmed ? "Confirmed" : "Pending";
              const flowersConfirmed = event.flowers?.confirmed ? "Confirmed" : "Pending";

              return (
                <div key={event._id} className="bg-white border border-[#1A1A1A]/10 rounded-[4px] p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-serif text-xl font-semibold leading-snug truncate max-w-[200px]">{event.title}</h4>
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

                    <div className="grid grid-cols-1 gap-2 text-xs font-light text-[#1A1A1A]/70">
                      <div>
                        <span className="font-bold text-[9px] uppercase tracking-wider block text-[#1A1A1A]/50">Date & Location</span>
                        <p className="font-medium">{event.date} {event.time && `at ${event.time}`}</p>
                        <p className="truncate">{event.location}</p>
                      </div>
                      <div>
                        <span className="font-bold text-[9px] uppercase tracking-wider block text-[#1A1A1A]/50">Client Contact</span>
                        <p className="font-semibold text-[#1A1A1A]">{event.clientName}</p>
                        <p className="truncate">{event.clientEmail}</p>
                      </div>
                    </div>

                    <div className="bg-[#F9F8F6] p-3 rounded border border-[#1A1A1A]/5">
                      <span className="block text-[8px] uppercase tracking-wider text-[#1A1A1A]/50 font-semibold mb-1">Checklist Tasks</span>
                      <span className="font-semibold text-xs text-[#1A1A1A]">
                        {event.checklist ? event.checklist.filter((c: any) => c.status === "completed").length : 0} / {event.checklist?.length || 0} Tasks Completed
                      </span>
                    </div>

                    <div className="border-t border-[#1A1A1A]/5 pt-4 space-y-1 text-[9px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60">
                      <div className="flex justify-between">
                        <span>Catering:</span>
                        <span className={event.catering?.confirmed ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>{cateringConfirmed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Decor:</span>
                        <span className={event.decor?.confirmed ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>{decorConfirmed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Flowers:</span>
                        <span className={event.flowers?.confirmed ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>{flowersConfirmed}</span>
                      </div>
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
    </div>
  );
}
