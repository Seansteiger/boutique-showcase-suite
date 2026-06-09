import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. Get Reviews for a Product
export const getReviews = query({
  args: { productId: v.string() },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    // Sort by newest first
    return reviews.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// 2. Add Review for a Product
export const addReview = mutation({
  args: {
    productId: v.string(),
    userId: v.optional(v.string()),
    rating: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Basic verification of product
    const productNorm = ctx.db.normalizeId("products", args.productId);
    if (productNorm) {
      const product = await ctx.db.get(productNorm);
      if (!product) {
        throw new Error("Product not found");
      }
    }

    const reviewId = await ctx.db.insert("reviews", {
      productId: args.productId,
      userId: args.userId,
      rating: args.rating,
      comment: args.comment,
      createdAt: Date.now(),
    });

    return reviewId.toString();
  },
});
