"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import Link from "next/link";
import { 
  MoveLeft, Users, Calendar, Clock, MapPin, CheckCircle, 
  Trash2, UserPlus, ListTodo, Plus, Trash, Utensils, 
  Paintbrush, Flower, Loader2, Check, AlertCircle, Menu, X
} from "lucide-react";

export default function EventAdminConsolePage({
  params,
}: {
  params: Promise<{ eventCode: string }>;
}) {
  const resolvedParams = use(params);
  const eventCode = resolvedParams.eventCode.toLowerCase().trim();

  // Convex lookups
  const event = useQuery(api.events.get, { code: eventCode });
  const rsvps = useQuery(api.rsvps.list, { eventCode: eventCode });
  
  const updateEvent = useMutation(api.events.update);
  const submitRsvp = useMutation(api.rsvps.submit);
  const deleteRsvp = useMutation(api.rsvps.remove);

  // Tab state
  const [activeTab, setActiveTab] = useState<"guests" | "programme" | "vendors" | "roadmap">("guests");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Local Form states
  const [guestForm, setGuestForm] = useState({ name: "", email: "", attending: true, guestsCount: 0, dietary: "" });
  const [progForm, setProgForm] = useState({ time: "", title: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vendor edit states (synced when event loads)
  const [cateringEdit, setCateringEdit] = useState({
    source: "internal" as "internal" | "external",
    companyName: "",
    contactPerson: "",
    contactPhone: "",
    menuSelected: "",
    tastingDate: "",
    tastingStatus: "none",
    confirmed: false,
    notes: "",
  });

  const [decorEdit, setDecorEdit] = useState({
    source: "internal" as "internal" | "external",
    companyName: "",
    contactPerson: "",
    contactPhone: "",
    styleSelected: "",
    meetingDate: "",
    meetingStatus: "none",
    confirmed: false,
    notes: "",
  });

  const [flowersEdit, setFlowersEdit] = useState({
    source: "internal" as "internal" | "external",
    companyName: "",
    contactPerson: "",
    contactPhone: "",
    floristStyle: "",
    meetingDate: "",
    meetingStatus: "none",
    confirmed: false,
    notes: "",
  });

  // State sync trackers
  const [vendorStateInitialized, setVendorStateInitialized] = useState(false);

  if (event === undefined || rsvps === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F9F8F6] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/60">Loading Planner Console...</p>
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="mx-auto max-w-xl px-8 py-24 text-center space-y-8 bg-[#F9F8F6] text-[#1A1A1A] min-h-[70vh] flex flex-col justify-center items-center">
        <div className="w-12 h-12 rounded-full border border-red-500/20 flex items-center justify-center text-red-600 bg-red-50 mb-2">
          <AlertCircle className="h-5 w-5" />
        </div>
        <h1 className="font-serif text-3xl font-medium tracking-tight">Event Registry Not Found</h1>
        <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto leading-relaxed">
          The event code "{eventCode}" is not registered in our management database.
        </p>
        <Link
          href="/invited/admin"
          className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-white hover:bg-[#d4af37] transition-all px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] rounded-[4px]"
        >
          Return to Events List
        </Link>
      </div>
    );
  }

  // Initialize vendor editing form values once
  if (!vendorStateInitialized && event) {
    if (event.catering) {
      setCateringEdit({
        source: event.catering.source as "internal" | "external",
        companyName: event.catering.companyName || "",
        contactPerson: event.catering.contactPerson || "",
        contactPhone: event.catering.contactPhone || "",
        menuSelected: event.catering.menuSelected || "",
        tastingDate: event.catering.tastingDate || "",
        tastingStatus: event.catering.tastingStatus || "none",
        confirmed: event.catering.confirmed,
        notes: event.catering.notes || "",
      });
    }
    if (event.decor) {
      setDecorEdit({
        source: event.decor.source as "internal" | "external",
        companyName: event.decor.companyName || "",
        contactPerson: event.decor.contactPerson || "",
        contactPhone: event.decor.contactPhone || "",
        styleSelected: event.decor.styleSelected || "",
        meetingDate: event.decor.meetingDate || "",
        meetingStatus: event.decor.meetingStatus || "none",
        confirmed: event.decor.confirmed,
        notes: event.decor.notes || "",
      });
    }
    if (event.flowers) {
      setFlowersEdit({
        source: event.flowers.source as "internal" | "external",
        companyName: event.flowers.companyName || "",
        contactPerson: event.flowers.contactPerson || "",
        contactPhone: event.flowers.contactPhone || "",
        floristStyle: event.flowers.floristStyle || "",
        meetingDate: event.flowers.meetingDate || "",
        meetingStatus: event.flowers.meetingStatus || "none",
        confirmed: event.flowers.confirmed,
        notes: event.flowers.notes || "",
      });
    }
    setVendorStateInitialized(true);
  }

  // Guest list metrics
  const attendingGuests = rsvps.filter((r) => r.attending).reduce((sum, r) => sum + 1 + r.guestsCount, 0);
  const regretsResponses = rsvps.filter((r) => !r.attending).length;
  const totalResponses = rsvps.length;

  // Manual Guest RSVP Submit
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.name || !guestForm.email) return;

    try {
      await submitRsvp({
        name: guestForm.name,
        email: guestForm.email,
        attending: guestForm.attending,
        guestsCount: Number(guestForm.guestsCount),
        dietaryRestrictions: guestForm.dietary,
        eventCode: event.code,
      });

      toast.success("Guest added to register.");
      setGuestForm({ name: "", email: "", attending: true, guestsCount: 0, dietary: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to add guest");
    }
  };

  // Delete Guest RSVP
  const handleDeleteGuest = async (id: string) => {
    if (!confirm("Are you sure you want to remove this response?")) return;
    try {
      await deleteRsvp({ id });
      toast.success("Guest response removed.");
    } catch (err: any) {
      toast.error("Failed to delete response");
    }
  };

  // Itinerary Item Submit
  const handleAddItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progForm.time || !progForm.title) return;

    const currentProg = event.programme || [];
    const updatedProg = [...currentProg, { ...progForm }].sort((a, b) => a.time.localeCompare(b.time));

    try {
      await updateEvent({
        id: event._id,
        programme: updatedProg,
      });
      toast.success("Programme slot added.");
      setProgForm({ time: "", title: "", description: "" });
    } catch (err: any) {
      toast.error("Failed to update programme");
    }
  };

  // Delete Itinerary Item
  const handleDeleteItinerary = async (index: number) => {
    const currentProg = event.programme || [];
    const updatedProg = currentProg.filter((_: any, idx: number) => idx !== index);

    try {
      await updateEvent({
        id: event._id,
        programme: updatedProg,
      });
      toast.success("Programme slot removed.");
    } catch (err: any) {
      toast.error("Failed to delete programme item");
    }
  };

  // Save Vendor Configurations
  const handleSaveVendors = async (category: "catering" | "decor" | "flowers") => {
    setIsSubmitting(true);
    try {
      if (category === "catering") {
        await updateEvent({
          id: event._id,
          catering: cateringEdit,
        });
      } else if (category === "decor") {
        await updateEvent({
          id: event._id,
          decor: decorEdit,
        });
      } else if (category === "flowers") {
        await updateEvent({
          id: event._id,
          flowers: flowersEdit,
        });
      }
      toast.success(`${category.toUpperCase()} plan updated successfully.`);
    } catch (err: any) {
      toast.error("Failed to update vendor details");
    } finally {
      setIsSubmitting(false);
    }
  };

  // General Checklist Task completion toggle
  const handleToggleTask = async (taskId: string) => {
    const currentList = event.checklist || [];
    const updatedList = currentList.map((task: any) => {
      if (task.id === taskId) {
        return { ...task, status: task.status === "completed" ? "pending" : "completed" };
      }
      return task;
    });

    try {
      await updateEvent({
        id: event._id,
        checklist: updatedList,
      });
    } catch (err: any) {
      toast.error("Failed to toggle task status");
    }
  };

  // Compile Dynamic Vendor Warning Tasks for the Planner Checklist
  const compileRoadmap = () => {
    const databaseTasks = event.checklist || [];
    const derivedTasks = [...databaseTasks];

    // Catering Derived task
    if (event.catering?.source === "external") {
      if (event.catering.tastingStatus === "none") {
        derivedTasks.push({
          id: "derived-catering-tasting",
          task: `🚨 SCHEDULE CATERING TASTING: Contact [${event.catering.companyName || "Vendor Name"}] to schedule tastings.`,
          status: "pending",
          category: "catering",
        });
      } else if (event.catering.tastingStatus === "scheduled" && !event.catering.confirmed) {
        derivedTasks.push({
          id: "derived-catering-confirm",
          task: `🍴 CONDUCT TASTING: Finalize custom menu options on scheduled date (${event.catering.tastingDate || "TBD"}).`,
          status: "pending",
          category: "catering",
        });
      }
    }

    // Decor Derived task
    if (event.decor?.source === "external" && !event.decor.confirmed) {
      derivedTasks.push({
        id: "derived-decor-confirm",
        task: `🏛️ CONFIRM DECOR STYLING: Meet with [${event.decor.companyName || "Decorator"}] to approve fabrics, layouts, and radii guidelines.`,
        status: "pending",
        category: "decor",
      });
    }

    // Flowers Derived task
    if (event.flowers?.source === "external" && !event.flowers.confirmed) {
      derivedTasks.push({
        id: "derived-flowers-confirm",
        task: `🌸 FLORAL DESIGN CHECK: Confirm botanical palette, centerpiece heights, and setups with [${event.flowers.companyName || "Florist"}].`,
        status: "pending",
        category: "flowers",
      });
    }

    return derivedTasks;
  };

  const dynamicRoadmap = compileRoadmap();

  return (
    <div className="mx-auto max-w-7xl px-8 py-12 space-y-10 bg-[#F9F8F6] text-[#1A1A1A]">
      
      {/* Back to admin portal */}
      <Link
        href="/invited/admin"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/60 hover:text-[#d4af37] transition-colors flex items-center gap-1.5 self-start"
      >
        <MoveLeft className="h-4 w-4" /> Back to Console
      </Link>

      {/* Hero Banner */}
      <div className="bg-[#1A1A1A] text-white p-8 rounded-[4px] border border-[#d4af37]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4af37]">Planner Console</span>
          <h2 className="font-serif text-3xl font-semibold leading-tight">{event.title}</h2>
          <div className="flex flex-wrap gap-4 text-xs font-light text-white/70">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-[#d4af37]" /> {event.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[#d4af37]" /> {event.time || "TBD"}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-[#d4af37]" /> {event.location}</span>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-4 rounded text-xs font-light space-y-1">
          <span className="block text-[8px] uppercase font-bold tracking-widest text-[#d4af37]">Public Invite Portal</span>
          <Link
            href={`/invited/e/${event.code}`}
            target="_blank"
            className="hover:underline flex items-center gap-1 text-[#d4af37] font-medium"
          >
            /invited/e/{event.code}
          </Link>
        </div>
      </div>

      {/* Tabs Selection Bar */}
      <div className="hidden md:flex border-b border-[#1A1A1A]/10 gap-8">
        {(["guests", "programme", "vendors", "roadmap"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-semibold uppercase tracking-[0.2em] pb-3 border-b-2 transition-all ${
              activeTab === tab
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
            }`}
          >
            {tab === "guests" ? "Guest Register" : tab === "programme" ? "Itinerary Sequence" : tab === "vendors" ? "Vendor Sourcing" : "Roadmap Checklist"}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}

      {/* TAB 1: GUESTS REGISTER */}
      {activeTab === "guests" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Guest list table (8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Metric Overview */}
            <div className="grid grid-cols-3 gap-4 border-b border-[#1A1A1A]/10 pb-6 text-center">
              <div className="bg-white p-4 border border-[#1A1A1A]/10 rounded shadow-sm">
                <span className="block text-[8px] uppercase tracking-wider text-[#1A1A1A]/50">Guests Confirmed</span>
                <span className="font-serif text-xl font-semibold text-green-600">{attendingGuests}</span>
              </div>
              <div className="bg-white p-4 border border-[#1A1A1A]/10 rounded shadow-sm">
                <span className="block text-[8px] uppercase tracking-wider text-[#1A1A1A]/50">Regrets Responses</span>
                <span className="font-serif text-xl font-semibold text-red-600">{regretsResponses}</span>
              </div>
              <div className="bg-white p-4 border border-[#1A1A1A]/10 rounded shadow-sm">
                <span className="block text-[8px] uppercase tracking-wider text-[#1A1A1A]/50">Total Responses</span>
                <span className="font-serif text-xl font-semibold">{totalResponses}</span>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#1A1A1A]/10 rounded-[4px] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-light">
                  <thead>
                    <tr className="bg-[#F9F8F6] border-b border-[#1A1A1A]/10 font-semibold uppercase tracking-wider text-[9px] text-[#1A1A1A]/60">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Response</th>
                      <th className="p-4">Guests</th>
                      <th className="p-4">Dietary Specifications</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]/10">
                    {rsvps.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[#1A1A1A]/40 font-light">
                          No guest responses cataloged in register.
                        </td>
                      </tr>
                    ) : (
                      rsvps.map((rsvp) => (
                        <tr key={rsvp._id} className="hover:bg-[#F9F8F6]/40 transition-colors">
                          <td className="p-4 font-semibold">{rsvp.name}</td>
                          <td className="p-4">{rsvp.email}</td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded ${
                              rsvp.attending ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                            }`}>
                              {rsvp.attending ? "Attending" : "Declined"}
                            </span>
                          </td>
                          <td className="p-4">{rsvp.attending ? rsvp.guestsCount : "—"}</td>
                          <td className="p-4 text-[#d4af37] font-semibold">{rsvp.dietaryRestrictions || "None"}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteGuest(rsvp._id)}
                              className="text-red-600 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add guest manually (4 columns) */}
          <div className="lg:col-span-4 bg-white p-6 border border-[#1A1A1A]/10 rounded-[4px] shadow-sm space-y-6">
            <h4 className="font-serif text-lg font-medium border-b border-[#1A1A1A]/10 pb-3 flex items-center gap-2">
              <UserPlus className="h-4.5 w-4.5 text-[#d4af37]" /> Log Offline Response
            </h4>

            <form onSubmit={handleAddGuest} className="space-y-4 text-xs font-light">
              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={guestForm.name}
                  onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                  className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={guestForm.email}
                  onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                  className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Attendance Choice</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold uppercase tracking-wider text-[9px]">
                    <input
                      type="radio"
                      checked={guestForm.attending === true}
                      onChange={() => setGuestForm({ ...guestForm, attending: true })}
                      className="accent-[#d4af37]"
                    />
                    Attending
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold uppercase tracking-wider text-[9px]">
                    <input
                      type="radio"
                      checked={guestForm.attending === false}
                      onChange={() => setGuestForm({ ...guestForm, attending: false })}
                      className="accent-[#d4af37]"
                    />
                    Declining
                  </label>
                </div>
              </div>

              {guestForm.attending && (
                <>
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Additional Guests</label>
                    <select
                      value={guestForm.guestsCount}
                      onChange={(e) => setGuestForm({ ...guestForm, guestsCount: Number(e.target.value) })}
                      className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                    >
                      <option value={0}>0 Guests</option>
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Dietary Restrictions</label>
                    <input
                      type="text"
                      placeholder="e.g. Vegetarian, none"
                      value={guestForm.dietary}
                      onChange={(e) => setGuestForm({ ...guestForm, dietary: e.target.value })}
                      className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] text-white hover:bg-[#d4af37] py-2.5 uppercase text-[10px] tracking-wider rounded font-semibold"
              >
                Log Attendance
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: ITINERARY SEQUENCE */}
      {activeTab === "programme" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Current programme list (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            <h4 className="font-serif text-xl font-medium">Itinerary Chronology</h4>
            
            <div className="bg-white border border-[#1A1A1A]/10 rounded-[4px] p-6 shadow-sm space-y-6">
              {(!event.programme || event.programme.length === 0) ? (
                <p className="text-xs text-[#1A1A1A]/60 font-light text-center py-6">
                  Itinerary sequence is empty. Add slots using the builder.
                </p>
              ) : (
                <div className="relative border-l border-[#1A1A1A]/10 pl-6 space-y-8 ml-2 pt-2">
                  {event.programme.map((item: any, index: number) => (
                    <div key={index} className="relative group space-y-1">
                      <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-[#d4af37] ring-4 ring-white" />
                      
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-semibold text-[#d4af37] font-mono tracking-wider">{item.time}</span>
                          <h5 className="font-serif text-sm font-semibold">{item.title}</h5>
                          {item.description && <p className="text-xs text-[#1A1A1A]/70 font-light leading-relaxed">{item.description}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteItinerary(index)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 opacity-0 group-hover:opacity-100"
                          title="Remove time slot"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add time slot (5 columns) */}
          <div className="lg:col-span-5 bg-white p-6 border border-[#1A1A1A]/10 rounded-[4px] shadow-sm space-y-6">
            <h4 className="font-serif text-lg font-medium border-b border-[#1A1A1A]/10 pb-3 flex items-center gap-2">
              <Plus className="h-4.5 w-4.5 text-[#d4af37]" /> Add Programme Slot
            </h4>

            <form onSubmit={handleAddItinerary} className="space-y-4 text-xs font-light">
              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Time (Format: HH:MM)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 19:30"
                  value={progForm.time}
                  onChange={(e) => setProgForm({ ...progForm, time: e.target.value })}
                  className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reception Toast & Dinner"
                  value={progForm.title}
                  onChange={(e) => setProgForm({ ...progForm, title: e.target.value })}
                  className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[10px] text-[#1A1A1A]/60 block">Description (Optional)</label>
                <textarea
                  placeholder="Details, catering notes, location guides..."
                  value={progForm.description}
                  onChange={(e) => setProgForm({ ...progForm, description: e.target.value })}
                  rows={3}
                  className="w-full p-2 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] text-white hover:bg-[#d4af37] py-2.5 uppercase text-[10px] tracking-wider rounded font-semibold"
              >
                Log Itinerary Slot
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: VENDOR SOURCING */}
      {activeTab === "vendors" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Section 1: Catering */}
          <div className="bg-white border border-[#1A1A1A]/10 rounded-[4px] p-6 shadow-sm space-y-6">
            <h4 className="font-serif text-lg font-semibold border-b border-[#1A1A1A]/10 pb-3 flex items-center gap-2">
              <Utensils className="h-4.5 w-4.5 text-[#d4af37]" /> Catering Sourcing
            </h4>

            <div className="space-y-4 text-xs font-light">
              <div className="space-y-1.5">
                <label className="font-bold text-[9px] uppercase tracking-wider block text-[#1A1A1A]/50">Sourcing Model</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={cateringEdit.source === "internal"}
                      onChange={() => setCateringEdit({ ...cateringEdit, source: "internal" })}
                      className="accent-[#d4af37]"
                    />
                    Internal Agency
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={cateringEdit.source === "external"}
                      onChange={() => setCateringEdit({ ...cateringEdit, source: "external" })}
                      className="accent-[#d4af37]"
                    />
                    External Vendor
                  </label>
                </div>
              </div>

              {cateringEdit.source === "external" ? (
                <>
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Caterer Company Name</label>
                    <input
                      type="text"
                      value={cateringEdit.companyName}
                      onChange={(e) => setCateringEdit({ ...cateringEdit, companyName: e.target.value })}
                      className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Contact Person</label>
                      <input
                        type="text"
                        value={cateringEdit.contactPerson}
                        onChange={(e) => setCateringEdit({ ...cateringEdit, contactPerson: e.target.value })}
                        className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Contact Phone</label>
                      <input
                        type="text"
                        value={cateringEdit.contactPhone}
                        onChange={(e) => setCateringEdit({ ...cateringEdit, contactPhone: e.target.value })}
                        className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Menu Selected</label>
                    <input
                      type="text"
                      placeholder="e.g. 5-Course Autumn Truffle Selection"
                      value={cateringEdit.menuSelected}
                      onChange={(e) => setCateringEdit({ ...cateringEdit, menuSelected: e.target.value })}
                      className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Tasting Date</label>
                      <input
                        type="date"
                        value={cateringEdit.tastingDate}
                        onChange={(e) => setCateringEdit({ ...cateringEdit, tastingDate: e.target.value })}
                        className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Tasting Status</label>
                      <select
                        value={cateringEdit.tastingStatus}
                        onChange={(e) => setCateringEdit({ ...cateringEdit, tastingStatus: e.target.value })}
                        className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37] text-xs"
                      >
                        <option value="none">Not Scheduled</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-3 bg-[#F9F8F6] border border-[#1A1A1A]/5 rounded text-[#1A1A1A]/70 text-[11px] leading-relaxed">
                  <p className="font-semibold text-black">Ivory Gastronomy Service</p>
                  Our internal culinary agency manages all course layouts, kitchen details, and culinary operations.
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Catering Notes</label>
                <textarea
                  rows={2}
                  value={cateringEdit.notes}
                  onChange={(e) => setCateringEdit({ ...cateringEdit, notes: e.target.value })}
                  placeholder="Special dietary guidelines, wine pairings, setup..."
                  className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#1A1A1A]/5">
                <input
                  type="checkbox"
                  id="caterConfirm"
                  checked={cateringEdit.confirmed}
                  onChange={(e) => setCateringEdit({ ...cateringEdit, confirmed: e.target.checked })}
                  className="accent-[#d4af37]"
                />
                <label htmlFor="caterConfirm" className="font-semibold text-[10px] uppercase tracking-wider cursor-pointer">
                  Mark Plan Confirmed
                </label>
              </div>

              <button
                type="button"
                onClick={() => handleSaveVendors("catering")}
                disabled={isSubmitting}
                className="w-full bg-[#1A1A1A] text-white hover:bg-[#d4af37] py-2 uppercase text-[9px] tracking-wider rounded font-semibold disabled:opacity-50"
              >
                Save Catering Configuration
              </button>
            </div>
          </div>

          {/* Section 2: Decor */}
          <div className="bg-white border border-[#1A1A1A]/10 rounded-[4px] p-6 shadow-sm space-y-6">
            <h4 className="font-serif text-lg font-semibold border-b border-[#1A1A1A]/10 pb-3 flex items-center gap-2">
              <Paintbrush className="h-4.5 w-4.5 text-[#d4af37]" /> Spatial & Decor
            </h4>

            <div className="space-y-4 text-xs font-light">
              <div className="space-y-1.5">
                <label className="font-bold text-[9px] uppercase tracking-wider block text-[#1A1A1A]/50">Sourcing Model</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={decorEdit.source === "internal"}
                      onChange={() => setDecorEdit({ ...decorEdit, source: "internal" })}
                      className="accent-[#d4af37]"
                    />
                    Internal Agency
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={decorEdit.source === "external"}
                      onChange={() => setDecorEdit({ ...decorEdit, source: "external" })}
                      className="accent-[#d4af37]"
                    />
                    External Vendor
                  </label>
                </div>
              </div>

              {decorEdit.source === "external" ? (
                <>
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Decorator Company Name</label>
                    <input
                      type="text"
                      value={decorEdit.companyName}
                      onChange={(e) => setDecorEdit({ ...decorEdit, companyName: e.target.value })}
                      className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Contact Person</label>
                      <input
                        type="text"
                        value={decorEdit.contactPerson}
                        onChange={(e) => setDecorEdit({ ...decorEdit, contactPerson: e.target.value })}
                        className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Contact Phone</label>
                      <input
                        type="text"
                        value={decorEdit.contactPhone}
                        onChange={(e) => setDecorEdit({ ...decorEdit, contactPhone: e.target.value })}
                        className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Style Theme Selected</label>
                    <input
                      type="text"
                      placeholder="e.g. Asymmetric Glassmorphic Minimalist"
                      value={decorEdit.styleSelected}
                      onChange={(e) => setDecorEdit({ ...decorEdit, styleSelected: e.target.value })}
                      className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Meeting Date</label>
                      <input
                        type="date"
                        value={decorEdit.meetingDate}
                        onChange={(e) => setDecorEdit({ ...decorEdit, meetingDate: e.target.value })}
                        className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Meeting Status</label>
                      <select
                        value={decorEdit.meetingStatus}
                        onChange={(e) => setDecorEdit({ ...decorEdit, meetingStatus: e.target.value })}
                        className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37] text-xs"
                      >
                        <option value="none">Not Scheduled</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-3 bg-[#F9F8F6] border border-[#1A1A1A]/5 rounded text-[#1A1A1A]/70 text-[11px] leading-relaxed">
                  <p className="font-semibold text-black">Ivory Interior Studio</p>
                  Our internal design division manages spatial architectural configurations, candles, glassware, and layout.
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Decor Notes</label>
                <textarea
                  rows={2}
                  value={decorEdit.notes}
                  onChange={(e) => setDecorEdit({ ...decorEdit, notes: e.target.value })}
                  placeholder="Linen layouts, spatial lighting structures..."
                  className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#1A1A1A]/5">
                <input
                  type="checkbox"
                  id="decorConfirm"
                  checked={decorEdit.confirmed}
                  onChange={(e) => setDecorEdit({ ...decorEdit, confirmed: e.target.checked })}
                  className="accent-[#d4af37]"
                />
                <label htmlFor="decorConfirm" className="font-semibold text-[10px] uppercase tracking-wider cursor-pointer">
                  Mark Plan Confirmed
                </label>
              </div>

              <button
                type="button"
                onClick={() => handleSaveVendors("decor")}
                disabled={isSubmitting}
                className="w-full bg-[#1A1A1A] text-white hover:bg-[#d4af37] py-2 uppercase text-[9px] tracking-wider rounded font-semibold disabled:opacity-50"
              >
                Save Decor Configuration
              </button>
            </div>
          </div>

          {/* Section 3: Flowers */}
          <div className="bg-white border border-[#1A1A1A]/10 rounded-[4px] p-6 shadow-sm space-y-6">
            <h4 className="font-serif text-lg font-semibold border-b border-[#1A1A1A]/10 pb-3 flex items-center gap-2">
              <Flower className="h-4.5 w-4.5 text-[#d4af37]" /> Floral & Botanicals
            </h4>

            <div className="space-y-4 text-xs font-light">
              <div className="space-y-1.5">
                <label className="font-bold text-[9px] uppercase tracking-wider block text-[#1A1A1A]/50">Sourcing Model</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={flowersEdit.source === "internal"}
                      onChange={() => setFlowersEdit({ ...flowersEdit, source: "internal" })}
                      className="accent-[#d4af37]"
                    />
                    Internal Agency
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={flowersEdit.source === "external"}
                      onChange={() => setFlowersEdit({ ...flowersEdit, source: "external" })}
                      className="accent-[#d4af37]"
                    />
                    External Vendor
                  </label>
                </div>
              </div>

              {flowersEdit.source === "external" ? (
                <>
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Florist Company Name</label>
                    <input
                      type="text"
                      value={flowersEdit.companyName}
                      onChange={(e) => setFlowersEdit({ ...flowersEdit, companyName: e.target.value })}
                      className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Contact Person</label>
                      <input
                        type="text"
                        value={flowersEdit.contactPerson}
                        onChange={(e) => setFlowersEdit({ ...flowersEdit, contactPerson: e.target.value })}
                        className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Contact Phone</label>
                      <input
                        type="text"
                        value={flowersEdit.contactPhone}
                        onChange={(e) => setFlowersEdit({ ...flowersEdit, contactPhone: e.target.value })}
                        className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Floral Style Theme</label>
                    <input
                      type="text"
                      placeholder="e.g. Alabaster Blooms & Pale Blush Orchids"
                      value={flowersEdit.floristStyle}
                      onChange={(e) => setFlowersEdit({ ...flowersEdit, floristStyle: e.target.value })}
                      className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Meeting Date</label>
                      <input
                        type="date"
                        value={flowersEdit.meetingDate}
                        onChange={(e) => setFlowersEdit({ ...flowersEdit, meetingDate: e.target.value })}
                        className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Meeting Status</label>
                      <select
                        value={flowersEdit.meetingStatus}
                        onChange={(e) => setFlowersEdit({ ...flowersEdit, meetingStatus: e.target.value })}
                        className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37] text-xs"
                      >
                        <option value="none">Not Scheduled</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-3 bg-[#F9F8F6] border border-[#1A1A1A]/5 rounded text-[#1A1A1A]/70 text-[11px] leading-relaxed">
                  <p className="font-semibold text-black">Ivory Botanical Studio</p>
                  Our internal florist team constructs all pale white blush floral installations and structural botany tablescapes.
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold uppercase tracking-[0.1em] text-[9px] text-[#1A1A1A]/60 block">Floral Notes</label>
                <textarea
                  rows={2}
                  value={flowersEdit.notes}
                  onChange={(e) => setFlowersEdit({ ...flowersEdit, notes: e.target.value })}
                  placeholder="Flower selection constraints, centerpieces specs..."
                  className="w-full p-1.5 border border-[#1A1A1A]/20 bg-transparent rounded outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#1A1A1A]/5">
                <input
                  type="checkbox"
                  id="flowersConfirm"
                  checked={flowersEdit.confirmed}
                  onChange={(e) => setFlowersEdit({ ...flowersEdit, confirmed: e.target.checked })}
                  className="accent-[#d4af37]"
                />
                <label htmlFor="flowersConfirm" className="font-semibold text-[10px] uppercase tracking-wider cursor-pointer">
                  Mark Plan Confirmed
                </label>
              </div>

              <button
                type="button"
                onClick={() => handleSaveVendors("flowers")}
                disabled={isSubmitting}
                className="w-full bg-[#1A1A1A] text-white hover:bg-[#d4af37] py-2 uppercase text-[9px] tracking-wider rounded font-semibold disabled:opacity-50"
              >
                Save Flowers Configuration
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: TASK ROADMAP */}
      {activeTab === "roadmap" && (
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4af37] block">Roadmap Checklist</span>
            <h4 className="font-serif text-2xl font-medium">Event Coordination Progress</h4>
            <p className="text-xs text-[#1A1A1A]/60 font-light leading-relaxed">
              Below is the comprehensive task checklist. The assistant automatically compiles dynamic warnings and tasting reminders depending on vendor enlisting actions.
            </p>
          </div>

          <div className="bg-white border border-[#1A1A1A]/10 rounded-[4px] p-6 shadow-sm divide-y divide-[#1A1A1A]/5">
            {dynamicRoadmap.map((task) => {
              const isDerived = task.id.startsWith("derived-");

              return (
                <div 
                  key={task.id} 
                  className={`flex items-start gap-4 py-4 first:pt-0 last:pb-0 ${
                    isDerived ? "bg-amber-50/50 p-3 rounded my-2 border border-amber-500/10" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.status === "completed" || (isDerived && false)} 
                    disabled={isDerived}
                    onChange={() => !isDerived && handleToggleTask(task.id)}
                    className="mt-1 accent-[#d4af37] cursor-pointer"
                  />
                  <div className="flex-1 space-y-1">
                    <p className={`text-xs ${
                      task.status === "completed" ? "line-through text-[#1A1A1A]/40" : "font-medium"
                    }`}>
                      {task.task}
                    </p>
                    <div className="flex gap-2">
                      <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-[#1A1A1A]/40 bg-[#F9F8F6] px-2 py-0.5 rounded">
                        Category: {task.category}
                      </span>
                      {isDerived && (
                        <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-500/20">
                          Dynamic Warning
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Floating Admin Menu Button */}
      <button
        onClick={() => setMobileDrawerOpen(true)}
        className="md:hidden fixed bottom-24 right-6 z-40 bg-[#1A1A1A] text-[#d4af37] border border-[#d4af37]/30 p-3.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition-all"
        title="Open Submenu"
      >
        <Menu className="h-5.5 w-5.5" />
      </button>

      {/* Mobile Admin Drawer Sheet */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop blur overlay */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-full bg-[#F9F8F6] border-l border-[#1A1A1A]/10 h-full p-8 shadow-2xl flex flex-col justify-between z-10">
            <div className="space-y-8">
              {/* Drawer Header */}
              <div className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-4">
                <div>
                  <span className="text-[8px] font-bold text-[#d4af37] uppercase tracking-[0.2em] block">PLANNER</span>
                  <h4 className="font-serif text-lg font-semibold">Console Menu</h4>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors border border-[#1A1A1A]/10 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sub-navigation buttons */}
              <div className="flex flex-col gap-3 font-sans">
                <button
                  onClick={() => {
                    setActiveTab("guests");
                    setMobileDrawerOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded text-xs font-semibold uppercase tracking-[0.15em] transition-all text-left ${
                    activeTab === "guests"
                      ? "bg-[#1A1A1A] text-[#d4af37]"
                      : "bg-white border border-[#1A1A1A]/5 text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Guest Register</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("programme");
                    setMobileDrawerOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded text-xs font-semibold uppercase tracking-[0.15em] transition-all text-left ${
                    activeTab === "programme"
                      ? "bg-[#1A1A1A] text-[#d4af37]"
                      : "bg-white border border-[#1A1A1A]/5 text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Itinerary Sequence</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("vendors");
                    setMobileDrawerOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded text-xs font-semibold uppercase tracking-[0.15em] transition-all text-left ${
                    activeTab === "vendors"
                      ? "bg-[#1A1A1A] text-[#d4af37]"
                      : "bg-white border border-[#1A1A1A]/5 text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  <Utensils className="h-4 w-4" />
                  <span>Vendor Sourcing</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("roadmap");
                    setMobileDrawerOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded text-xs font-semibold uppercase tracking-[0.15em] transition-all text-left ${
                    activeTab === "roadmap"
                      ? "bg-[#1A1A1A] text-[#d4af37]"
                      : "bg-white border border-[#1A1A1A]/5 text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  <ListTodo className="h-4 w-4" />
                  <span>Roadmap Checklist</span>
                </button>
              </div>
            </div>

            {/* Footer inside drawer */}
            <div className="border-t border-[#1A1A1A]/10 pt-4 text-center font-sans">
              <span className="text-[8px] uppercase tracking-widest text-[#1A1A1A]/40 font-semibold block">
                INVITED. SHOWCASE
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
