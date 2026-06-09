import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. Submit Guest RSVP
export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    attending: v.boolean(),
    guestsCount: v.number(),
    dietaryRestrictions: v.optional(v.string()),
    eventCode: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate guest count is non-negative
    if (args.guestsCount < 0) {
      throw new Error("Guests count cannot be negative");
    }

    const rsvpId = await ctx.db.insert("rsvps", {
      name: args.name,
      email: args.email,
      attending: args.attending,
      guestsCount: args.guestsCount,
      dietaryRestrictions: args.dietaryRestrictions || "",
      eventCode: args.eventCode,
      createdAt: Date.now(),
    });

    return rsvpId.toString();
  },
});

// 2. List RSVPs by Event Code
export const list = query({
  args: { eventCode: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const code = args.eventCode;
    if (code) {
      return await ctx.db
        .query("rsvps")
        .withIndex("by_event", (q) => q.eq("eventCode", code))
        .collect();
    }
    
    // Otherwise list all RSVPs sorted by newest first
    const rsvps = await ctx.db.query("rsvps").collect();
    return rsvps.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// 3. Clear/Delete RSVP
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const idNorm = ctx.db.normalizeId("rsvps", args.id);
    if (!idNorm) {
      throw new Error("Invalid RSVP ID");
    }
    await ctx.db.delete(idNorm);
    return true;
  },
});
