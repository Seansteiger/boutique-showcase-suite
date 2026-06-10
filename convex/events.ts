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

// 6. Seed Showcase events and RSVPs
export const seedShowcase = mutation({
  args: {},
  handler: async (ctx) => {
    const eventsList = [
      {
        title: "The Ivory Gala 2026",
        code: "gala-2026",
        clientName: "Ivory Committee",
        clientEmail: "concierge@invited.com",
        date: "2026-06-25",
        time: "18:00",
        location: "The Canopy Hall, Highwood Gardens",
        programme: [
          { time: "18:00", title: "Arrivals & Welcomes", description: "Champagne service in foyer" },
          { time: "19:30", title: "Main Banquet Dinner", description: "Bespoke seasonal menu dining" },
          { time: "21:00", title: "Chamber Music & Concert", description: "Live performance under canopy" },
        ],
        catering: { source: "internal", confirmed: true, notes: "Gourmet truffle menu selected." },
        decor: { source: "internal", confirmed: true, notes: "Sandstone warming tone guidelines." },
        flowers: { source: "internal", confirmed: true, notes: "White orchids and neutral roses." },
        checklist: [
          { id: "task-1", task: "Finalize guest list and invitations", status: "completed", category: "general" },
          { id: "task-2", task: "Send out digital invitations & RSVP link", status: "completed", category: "general" },
          { id: "task-3", task: "Review event space and floor guidelines", status: "completed", category: "general" }
        ]
      },
      {
        title: "Aurora Fashion Week Lounge",
        code: "aurora-lounge",
        clientName: "Aurora Creative",
        clientEmail: "events@aurora-fashion.com",
        date: "2026-09-12",
        time: "20:00",
        location: "Skylight Gallery, Room D",
        programme: [
          { time: "20:00", title: "VIP Cocktail Reception", description: "Liquid nitrogen drinks bar" },
          { time: "21:00", title: "Designer Q&A Session", description: "Moderated talk on sustainable chic" },
          { time: "22:00", title: "Late Night DJ Set", description: "Deep house session" },
        ],
        catering: { source: "internal", confirmed: true, notes: "Bespoke vegan finger bites." },
        decor: { source: "external", companyName: "Sleek Spaces Ltd", contactPerson: "Sarah Jenkins", contactPhone: "+27 82 555 0192", styleSelected: "Slate Industrial Minimalist", meetingDate: "2026-08-10", meetingStatus: "completed", confirmed: true, notes: "Brushed metal bars and low neon styling." },
        flowers: { source: "internal", confirmed: true, notes: "Minimalist geometric arrangements." },
        checklist: [
          { id: "task-1", task: "Approve lighting schema with gallery crew", status: "pending", category: "general" },
          { id: "task-2", task: "Register press lists & backstage passes", status: "pending", category: "general" }
        ]
      },
      {
        title: "Elena & Julian's Nuptials",
        code: "elena-julian",
        clientName: "Elena Rostova",
        clientEmail: "elena@rostova.com",
        date: "2026-10-18",
        time: "15:30",
        location: "Cliffside Pavilion, Coastal Point",
        programme: [
          { time: "15:30", title: "Sunset Vows Ceremony", description: "Conducted overlooking the ocean" },
          { time: "17:00", title: "Coastal Aperitif hour", description: "Bespoke cocktails & seafood platters" },
          { time: "19:00", title: "Candlelit Seafood Dinner", description: "Reception banquet and dancing" },
        ],
        catering: { source: "internal", confirmed: false, notes: "Seafood option selected. Tasting scheduled." },
        decor: { source: "internal", confirmed: true, notes: "Soft ocean blues and crystal glassware." },
        flowers: { source: "external", companyName: "Wild Botanics", contactPerson: "Flora Thorne", contactPhone: "+27 71 555 4930", floristStyle: "Coastal Wildflowers", meetingDate: "2026-07-22", meetingStatus: "scheduled", confirmed: false, notes: "External florist warning: confirm final counts by July 15." },
        checklist: [
          { id: "task-1", task: "Review tides calendar for sunset coordinates", status: "completed", category: "general" },
          { id: "task-2", task: "Coordinate boat logistics for guest arrivals", status: "pending", category: "general" }
        ]
      },
      {
        title: "Vanguard Tech Summit VIP Dinner",
        code: "vanguard-vip",
        clientName: "Vanguard Systems Ltd",
        clientEmail: "summit@vanguard.co.za",
        date: "2026-11-05",
        time: "19:00",
        location: "Highwood Manor Library",
        programme: [
          { time: "19:00", title: "Executive Welcome Drinks", description: "Single malt tasting bar" },
          { time: "20:00", title: "Keynote Banquet Dinner", description: "Roundtable discussion on AI integration" },
          { time: "22:00", title: "Digestifs & Networking", description: "Cognac and cigar terrace" },
        ],
        catering: { source: "external", companyName: "Fine Dining Co", contactPerson: "Marc Du Preez", contactPhone: "+27 83 555 9010", menuSelected: "Organic Vegan Menu Preset", tastingDate: "2026-10-01", tastingStatus: "completed", confirmed: true, notes: "Strict vegan meal profiles for all guests." },
        decor: { source: "internal", confirmed: true, notes: "Mahogany tones and antique books styling." },
        flowers: { source: "internal", confirmed: true, notes: "Simple white lilies." },
        checklist: [
          { id: "task-1", task: "Secure NDA agreements for keynote speakers", status: "completed", category: "general" },
          { id: "task-2", task: "Double check audio recording equipment", status: "completed", category: "general" }
        ]
      },
      {
        title: "Solstice Botanical Luncheon",
        code: "solstice-lunch",
        clientName: "Solstice Magazine",
        clientEmail: "editorial@solsticesociety.com",
        date: "2026-07-20",
        time: "12:00",
        location: "The Garden Conservatory, Rosewood",
        programme: [
          { time: "12:00", title: "Botanical Garden Walkthrough", description: "Curated orchid tour with chief florist" },
          { time: "13:30", title: "Organic Garden Luncheon", description: "Table-to-plate dining" },
          { time: "15:00", title: "Bespoke Perfume Blending Session", description: "Guided workshop using botanical oils" },
        ],
        catering: { source: "internal", confirmed: true, notes: "Fresh garden-to-table organic luncheon." },
        decor: { source: "internal", confirmed: true, notes: "Fresh linens and herb-based placeholders." },
        flowers: { source: "external", companyName: "Rosewood Florals", contactPerson: "Lily Bloom", contactPhone: "+27 60 555 1234", floristStyle: "Classic English Roses", meetingDate: "2026-06-30", meetingStatus: "scheduled", confirmed: false, notes: "Florist needs rose counts by June 20." },
        checklist: [
          { id: "task-1", task: "Assemble custom botanical oil gift boxes", status: "pending", category: "general" },
          { id: "task-2", task: "Review ventilation inside the glass conservatory", status: "pending", category: "general" }
        ]
      },
      {
        title: "Elysian Yacht Launch",
        code: "elysian-yacht",
        clientName: "Elysian Marine Group",
        clientEmail: "brokerage@elysianyachts.com",
        date: "2026-08-08",
        time: "17:00",
        location: "Slip 14, Marina Harbour",
        programme: [
          { time: "17:00", title: "Boarding & Ship Walkthrough", description: "VIP inspection of master staterooms" },
          { time: "18:30", title: "Christening Champagne Ceremony", description: "Bottle smash and ribbon cutting" },
          { time: "19:00", title: "Live Jazz Cocktail Reception", description: "Sailing in calm bay waters" },
        ],
        catering: { source: "internal", confirmed: true, notes: "High-end caviar and sushi stations." },
        decor: { source: "internal", confirmed: true, notes: "Nautical luxury: white leather and gold trimmings." },
        flowers: { source: "internal", confirmed: true, notes: "Stunning blue delphiniums and white hydrangeas." },
        checklist: [
          { id: "task-1", task: "Obtain coast guard harbor clearance permit", status: "completed", category: "general" },
          { id: "task-2", task: "Finalize guest lists & life vest manifests", status: "completed", category: "general" }
        ]
      }
    ];

    for (const ev of eventsList) {
      const existing = await ctx.db
        .query("events")
        .withIndex("by_code", (q) => q.eq("code", ev.code))
        .first();

      if (!existing) {
        await ctx.db.insert("events", {
          title: ev.title,
          code: ev.code,
          clientName: ev.clientName,
          clientEmail: ev.clientEmail,
          date: ev.date,
          time: ev.time,
          location: ev.location,
          programme: ev.programme,
          catering: {
            ...ev.catering,
            source: ev.catering.source as "internal" | "external",
          },
          decor: {
            ...ev.decor,
            source: ev.decor.source as "internal" | "external",
          },
          flowers: {
            ...ev.flowers,
            source: ev.flowers.source as "internal" | "external",
          },
          checklist: ev.checklist,
          createdAt: Date.now(),
        });
      }
    }

    const rsvpsList = [
      // gala-2026
      { eventCode: "gala-2026", name: "Lord Sterling", email: "lord@sterling.com", attending: true, guestsCount: 1, dietaryRestrictions: "Gluten Free" },
      { eventCode: "gala-2026", name: "Duchess Amelia", email: "amelia@duchy.org", attending: true, guestsCount: 0, dietaryRestrictions: "None" },
      { eventCode: "gala-2026", name: "Sir Thomas", email: "thomas@parliament.gov", attending: false, guestsCount: 0, dietaryRestrictions: "" },
      // aurora-lounge
      { eventCode: "aurora-lounge", name: "Bella Hadid", email: "bella@hadid.model", attending: true, guestsCount: 0, dietaryRestrictions: "Vegan" },
      { eventCode: "aurora-lounge", name: "Kendall Jenner", email: "kendall@jenner.model", attending: true, guestsCount: 0, dietaryRestrictions: "Organic Diet" },
      // elena-julian
      { eventCode: "elena-julian", name: "Rostova Family", email: "father@rostov.ru", attending: true, guestsCount: 2, dietaryRestrictions: "No Shellfish" },
      { eventCode: "elena-julian", name: "Alexander Drake", email: "alex@drakelaw.com", attending: true, guestsCount: 1, dietaryRestrictions: "None" },
      // vanguard-vip
      { eventCode: "vanguard-vip", name: "Dr. Aris Thorne", email: "aris@vanguard.co.za", attending: true, guestsCount: 0, dietaryRestrictions: "Strict Vegan" },
      { eventCode: "vanguard-vip", name: "Sophia Chen", email: "sophia@chencap.com", attending: true, guestsCount: 1, dietaryRestrictions: "Strict Vegan" },
      // solstice-lunch
      { eventCode: "solstice-lunch", name: "Lady Beatrice", email: "beatrice@botany.org", attending: true, guestsCount: 0, dietaryRestrictions: "Nut Allergy" },
      // elysian-yacht
      { eventCode: "elysian-yacht", name: "Commodore Nelson", email: "nelson@harbourclub.com", attending: true, guestsCount: 3, dietaryRestrictions: "None" }
    ];

    for (const r of rsvpsList) {
      const existing = await ctx.db
        .query("rsvps")
        .filter((q) => q.and(q.eq(q.field("eventCode"), r.eventCode), q.eq(q.field("email"), r.email)))
        .first();

      if (!existing) {
        await ctx.db.insert("rsvps", {
          eventCode: r.eventCode,
          name: r.name,
          email: r.email,
          attending: r.attending,
          guestsCount: r.guestsCount,
          dietaryRestrictions: r.dietaryRestrictions,
          createdAt: Date.now(),
        });
      }
    }

    return true;
  }
});
