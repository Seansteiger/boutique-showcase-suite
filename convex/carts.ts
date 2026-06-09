import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user or guest cart
export const getCart = query({
  args: {
    userId: v.optional(v.string()),
    anonymousId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.userId) {
      const cart = await ctx.db
        .query("carts")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .first();
      if (cart) return cart;
    }

    if (args.anonymousId) {
      const cart = await ctx.db
        .query("carts")
        .withIndex("by_anonymous", (q) => q.eq("anonymousId", args.anonymousId))
        .first();
      return cart;
    }

    return null;
  },
});

// Update or insert cart
export const updateCart = mutation({
  args: {
    userId: v.optional(v.string()),
    anonymousId: v.optional(v.string()),
    items: v.any(), // JSON array of items
    isAbandoned: v.optional(v.boolean()),
    recoveryStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let existingCart = null;

    if (args.userId) {
      existingCart = await ctx.db
        .query("carts")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .first();
    }

    if (!existingCart && args.anonymousId) {
      existingCart = await ctx.db
        .query("carts")
        .withIndex("by_anonymous", (q) => q.eq("anonymousId", args.anonymousId))
        .first();
    }

    const payload = {
      userId: args.userId,
      anonymousId: args.anonymousId,
      items: args.items,
      isAbandoned: args.isAbandoned ?? false,
      recoveryStatus: args.recoveryStatus ?? "none",
      updatedAt: Date.now(),
    };

    if (existingCart) {
      await ctx.db.patch(existingCart._id, payload);
      return existingCart._id.toString();
    } else {
      const newId = await ctx.db.insert("carts", {
        ...payload,
        createdAt: Date.now(),
      });
      return newId.toString();
    }
  },
});

// Get all carts (Cron/Admin recovery view)
export const getAllCarts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("carts").collect();
  },
});

// Get cart by ID (for recovery hydration)
export const getCartById = query({
  args: { cartId: v.id("carts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.cartId);
  },
});
