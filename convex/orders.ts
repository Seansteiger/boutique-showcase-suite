import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. Create a new Order
export const createOrder = mutation({
  args: {
    userId: v.string(),
    total: v.number(),
    shippingAddress: v.any(),
    items: v.array(
      v.object({
        productId: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // 1. Insert base order
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      status: "pending",
      total: args.total,
      shippingAddress: args.shippingAddress,
      createdAt: Date.now(),
    });

    // 2. Insert order items and update product stock
    for (const item of args.items) {
      await ctx.db.insert("order_items", {
        orderId: orderId.toString(),
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      });

      // Attempt to decrement stock in product variations or base product
      const productNorm = ctx.db.normalizeId("products", item.productId);
      if (productNorm) {
        const prodDoc = await ctx.db.get(productNorm);
        if (prodDoc) {
          const newStock = Math.max(0, prodDoc.stockQuantity - item.quantity);
          await ctx.db.patch(productNorm, { stockQuantity: newStock });
        }
      }
    }

    return orderId.toString();
  },
});

// 2. Fetch User Orders
export const getUserOrders = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Attach order items to each order
    const ordersWithItems = await Promise.all(
      orders.map(async (o) => {
        const items = await ctx.db
          .query("order_items")
          .withIndex("by_order", (q) => q.eq("orderId", o._id.toString()))
          .collect();

        return {
          ...o,
          id: o._id.toString(),
          items: items.map((i) => ({
            id: i._id.toString(),
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        };
      })
    );

    return ordersWithItems;
  },
});

// 2.5 Fetch Order By ID
export const getOrderById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const orderId = ctx.db.normalizeId("orders", args.id);
    if (!orderId) return null;
    const order = await ctx.db.get(orderId);
    if (!order) return null;

    const items = await ctx.db
      .query("order_items")
      .withIndex("by_order", (q) => q.eq("orderId", args.id))
      .collect();

    // Fetch product details for each item
    const itemsWithProducts = await Promise.all(
      items.map(async (i) => {
        const prodId = ctx.db.normalizeId("products", i.productId);
        const product = prodId ? await ctx.db.get(prodId) : null;
        return {
          ...i,
          id: i._id.toString(),
          product: product ? { title: product.title, imageUrls: product.imageUrls } : null,
        };
      })
    );

    return {
      ...order,
      id: order._id.toString(),
      items: itemsWithProducts,
    };
  },
});

// 3. Fetch All Orders (Merchant / Store Manager view)
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();

    // Attach order items and user profile details
    const fullOrders = await Promise.all(
      orders.map(async (o) => {
        const items = await ctx.db
          .query("order_items")
          .withIndex("by_order", (q) => q.eq("orderId", o._id.toString()))
          .collect();

        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", o.userId))
          .first();

        // Get details of products in items
        const itemsWithProducts = await Promise.all(
          items.map(async (i) => {
            const prodNorm = ctx.db.normalizeId("products", i.productId);
            const product = prodNorm ? await ctx.db.get(prodNorm) : null;
            return {
              id: i._id.toString(),
              productId: i.productId,
              productTitle: product ? product.title : "Unknown Product",
              productImage: product?.imageUrls?.[0] || "",
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            };
          })
        );

        return {
          ...o,
          id: o._id.toString(),
          customerName: profile ? profile.fullName : "Guest User",
          items: itemsWithProducts,
        };
      })
    );

    // Sort by newest first
    return fullOrders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// 4. Update Order Status & Fulfillment Tracking
export const updateOrderStatus = mutation({
  args: {
    id: v.string(),
    status: v.string(),
    trackingNumber: v.optional(v.string()),
    shippingProvider: v.optional(v.string()),
    paymentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orderId = ctx.db.normalizeId("orders", args.id);
    if (orderId) {
      await ctx.db.patch(orderId, {
        status: args.status,
        trackingNumber: args.trackingNumber,
        shippingProvider: args.shippingProvider,
        paymentId: args.paymentId,
      });
      return true;
    }
    return false;
  },
});
