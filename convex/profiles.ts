import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user profile
export const getProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Get user role dynamically (useful for route guards and UI elements)
export const getUserRole = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    return profile ? profile.role : "customer";
  },
});

// Upsert user profile
export const upsertProfile = mutation({
  args: {
    userId: v.string(),
    fullName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    role: v.optional(v.string()), // "customer" | "staff" | "manager" | "super_admin"
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const payload = {
      userId: args.userId,
      fullName: args.fullName ?? existing?.fullName,
      avatarUrl: args.avatarUrl ?? existing?.avatarUrl,
      role: args.role ?? existing?.role ?? "customer",
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id.toString();
    } else {
      const newId = await ctx.db.insert("profiles", payload);
      return newId.toString();
    }
  },
});

// Get all users (Admin view)
export const getAllProfiles = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("profiles").collect();
  },
});

// Admin command: Update user role directly
export const updateUserRole = mutation({
  args: {
    userId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        role: args.role,
        updatedAt: Date.now(),
      });
      return true;
    } else {
      await ctx.db.insert("profiles", {
        userId: args.userId,
        role: args.role,
        fullName: "New Account",
        updatedAt: Date.now(),
      });
      return true;
    }
  },
});
