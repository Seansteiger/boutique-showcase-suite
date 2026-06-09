import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get coupon by code (validity check)
export const getCouponByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (!coupon || !coupon.isActive) return null;

    // Check expiry
    if (coupon.expiresAt) {
      const expiry = new Date(coupon.expiresAt).getTime();
      if (Date.now() > expiry) return null;
    }

    // Check total limit
    if (coupon.usageLimitTotal && coupon.usedCount >= coupon.usageLimitTotal) {
      return null;
    }

    return coupon;
  },
});

// Get user available coupons
export const getUserAvailableCoupons = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userCoupons = await ctx.db
      .query("user_coupons")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const activeCoupons = [];
    for (const uc of userCoupons) {
      const coupon = await ctx.db
        .query("coupons")
        .withIndex("by_code", (q) => q.eq("code", uc.couponCode.toUpperCase()))
        .first();

      if (coupon && coupon.isActive) {
        if (coupon.expiresAt && Date.now() > new Date(coupon.expiresAt).getTime()) {
          continue;
        }
        activeCoupons.push({
          code: coupon.code,
          discount_type: coupon.discountType,
          discount_value: coupon.discountValue,
          min_order_amount: coupon.minOrderAmount,
        });
      }
    }
    return activeCoupons;
  },
});

// Get all coupons (Admin panel view)
export const getAllCoupons = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("coupons").collect();
  },
});

// Upsert coupon code
export const upsertCoupon = mutation({
  args: {
    code: v.string(),
    discountType: v.union(v.literal("percentage"), v.literal("fixed")),
    discountValue: v.number(),
    minOrderAmount: v.number(),
    startDate: v.string(),
    expiresAt: v.optional(v.string()),
    usageLimitTotal: v.optional(v.number()),
    usageLimitPerUser: v.optional(v.number()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const formattedCode = args.code.toUpperCase();
    const existing = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", formattedCode))
      .first();

    const payload = {
      code: formattedCode,
      discountType: args.discountType,
      discountValue: args.discountValue,
      minOrderAmount: args.minOrderAmount,
      startDate: args.startDate,
      expiresAt: args.expiresAt,
      usageLimitTotal: args.usageLimitTotal,
      usageLimitPerUser: args.usageLimitPerUser,
      isActive: args.isActive,
      usedCount: existing ? existing.usedCount : 0,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id.toString();
    } else {
      const newId = await ctx.db.insert("coupons", payload);
      return newId.toString();
    }
  },
});

// Delete coupon code
export const deleteCoupon = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return true;
    }
    return false;
  },
});

// Record coupon usage
export const useCoupon = mutation({
  args: {
    code: v.string(),
    userId: v.string(),
    orderId: v.string(),
  },
  handler: async (ctx, args) => {
    const formattedCode = args.code.toUpperCase();
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", formattedCode))
      .first();

    if (!coupon) throw new Error("Coupon not found");

    // Increment used count
    await ctx.db.patch(coupon._id, {
      usedCount: coupon.usedCount + 1,
    });

    // Record usage log
    await ctx.db.insert("coupon_usages", {
      couponCode: formattedCode,
      userId: args.userId,
      orderId: args.orderId,
      createdAt: Date.now(),
    });

    return true;
  },
});
