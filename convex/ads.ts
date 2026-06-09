import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get active ads
export const getAds = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("ads")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get all ads (for Admin view)
export const getAllAds = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("ads").collect();
  },
});

// Upsert promotional ad
export const upsertAd = mutation({
  args: {
    id: v.optional(v.string()),
    title: v.string(),
    subtitle: v.optional(v.string()),
    imageUrl: v.string(),
    link: v.optional(v.string()),
    isActive: v.boolean(),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payload = {
      title: args.title,
      subtitle: args.subtitle,
      imageUrl: args.imageUrl,
      link: args.link,
      isActive: args.isActive,
      type: args.type || "banner",
      createdAt: Date.now(),
    };

    if (args.id) {
      const existingId = ctx.db.normalizeId("ads", args.id);
      if (existingId) {
        await ctx.db.patch(existingId, payload);
        return args.id;
      }
    }

    const newId = await ctx.db.insert("ads", payload);
    return newId.toString();
  },
});

// Delete promotional ad
export const deleteAd = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const adId = ctx.db.normalizeId("ads", args.id);
    if (adId) {
      await ctx.db.delete(adId);
      return true;
    }
    return false;
  },
});
