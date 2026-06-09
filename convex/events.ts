import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. List all events
export const list = query({
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    return events.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// 2. Get a single event by code
export const get = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_code", (q) => q.eq("code", args.code.toLowerCase()))
      .first();
  },
});

// 3. Create a new event
export const create = mutation({
  args: {
    title: v.string(),
    code: v.string(),
    clientName: v.string(),
    clientEmail: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const lowercaseCode = args.code.toLowerCase().trim();

    // Check if event code already exists
    const existing = await ctx.db
      .query("events")
      .withIndex("by_code", (q) => q.eq("code", lowercaseCode))
      .first();

    if (existing) {
      throw new Error("An event with this code already exists.");
    }

    // Default checklist items
    const defaultChecklist = [
      {
        id: "task-1",
        task: "Finalize guest list and invitations",
        status: "pending",
        category: "general",
      },
      {
        id: "task-2",
        task: "Send out digital invitations & RSVP link",
        status: "pending",
        category: "general",
      },
      {
        id: "task-3",
        task: "Review event space and floor guidelines",
        status: "pending",
        category: "general",
      },
    ];

    const eventId = await ctx.db.insert("events", {
      title: args.title,
      code: lowercaseCode,
      clientName: args.clientName,
      clientEmail: args.clientEmail,
      date: args.date,
      time: args.time || "",
      location: args.location,
      programme: [
        { time: "18:00", title: "Arrivals & Welcomes", description: "Champagne service in foyer" },
        { time: "19:30", title: "Main Banquet Dinner", description: "Bespoke seasonal menu dining" },
        { time: "21:00", title: "Chamber Music & Concert", description: "Live performance under canopy" },
      ],
      catering: { source: "internal", confirmed: false },
      decor: { source: "internal", confirmed: false },
      flowers: { source: "internal", confirmed: false },
      checklist: defaultChecklist,
      createdAt: Date.now(),
    });

    return eventId.toString();
  },
});

// 4. Update event details
export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    clientName: v.optional(v.string()),
    clientEmail: v.optional(v.string()),
    programme: v.optional(
      v.array(
        v.object({
          time: v.string(),
          title: v.string(),
          description: v.optional(v.string()),
        })
      )
    ),
    catering: v.optional(
      v.object({
        source: v.union(v.literal("internal"), v.literal("external")),
        companyName: v.optional(v.string()),
        contactPerson: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        menuSelected: v.optional(v.string()),
        tastingDate: v.optional(v.string()),
        tastingStatus: v.optional(v.string()),
        confirmed: v.boolean(),
        notes: v.optional(v.string()),
      })
    ),
    decor: v.optional(
      v.object({
        source: v.union(v.literal("internal"), v.literal("external")),
        companyName: v.optional(v.string()),
        contactPerson: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        styleSelected: v.optional(v.string()),
        meetingDate: v.optional(v.string()),
        meetingStatus: v.optional(v.string()),
        confirmed: v.boolean(),
        notes: v.optional(v.string()),
      })
    ),
    flowers: v.optional(
      v.object({
        source: v.union(v.literal("internal"), v.literal("external")),
        companyName: v.optional(v.string()),
        contactPerson: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        floristStyle: v.optional(v.string()),
        meetingDate: v.optional(v.string()),
        meetingStatus: v.optional(v.string()),
        confirmed: v.boolean(),
        notes: v.optional(v.string()),
      })
    ),
    checklist: v.optional(
      v.array(
        v.object({
          id: v.string(),
          task: v.string(),
          dueDate: v.optional(v.string()),
          status: v.string(),
          category: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return true;
  },
});

// 5. Delete event
export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
