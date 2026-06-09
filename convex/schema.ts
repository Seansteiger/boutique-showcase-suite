import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Products collection
  products: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    salePrice: v.optional(v.number()),
    categoryId: v.optional(v.string()), // string reference to category slug or Convex ID
    imageUrls: v.optional(v.array(v.string())),
    stockQuantity: v.number(),
    isFeatured: v.boolean(),
    features: v.optional(v.array(v.string())),
    brand: v.optional(v.string()),
    status: v.string(), // "published" | "draft"
    createdAt: v.float64(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_category", ["categoryId"]),

  // 2. Categories collection
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    imageUrl: v.optional(v.string()),
    parentId: v.optional(v.string()),
    createdAt: v.float64(),
  })
    .index("by_slug", ["slug"]),

  // 3. Product Variations
  product_variations: defineTable({
    productId: v.string(), // Can map to product ID or product slug
    attributes: v.any(), // JSON object like {"Size": "L", "Color": "Blue"}
    price: v.optional(v.number()), // Price override
    stockQuantity: v.number(),
    imageUrl: v.optional(v.string()),
    createdAt: v.float64(),
  }).index("by_product", ["productId"]),

  // 4. Coupons
  coupons: defineTable({
    code: v.string(),
    discountType: v.union(v.literal("percentage"), v.literal("fixed")),
    discountValue: v.number(),
    minOrderAmount: v.number(),
    startDate: v.string(),
    expiresAt: v.optional(v.string()),
    usageLimitTotal: v.optional(v.number()),
    usageLimitPerUser: v.optional(v.number()),
    usedCount: v.number(),
    isActive: v.boolean(),
  }).index("by_code", ["code"]),

  // 5. Coupon Usages
  coupon_usages: defineTable({
    couponCode: v.string(),
    userId: v.string(),
    orderId: v.string(),
    createdAt: v.float64(),
  }).index("by_user", ["userId"]),

  // 6. Reviews
  reviews: defineTable({
    productId: v.string(),
    userId: v.optional(v.string()),
    rating: v.number(), // 1 to 5
    comment: v.optional(v.string()),
    createdAt: v.float64(),
  }).index("by_product", ["productId"]),

  // 7. Orders
  orders: defineTable({
    userId: v.string(),
    tenantId: v.optional(v.string()),
    status: v.string(), // "pending" | "processing" | "completed" | "cancelled"
    total: v.number(),
    shippingAddress: v.any(), // JSON object
    trackingNumber: v.optional(v.string()),
    shippingProvider: v.optional(v.string()),
    paymentId: v.optional(v.string()),
    createdAt: v.float64(),
  })
    .index("by_user", ["userId"])
    .index("by_tenant", ["tenantId"]),

  // 8. Order Items
  order_items: defineTable({
    orderId: v.string(),
    productId: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),
  }).index("by_order", ["orderId"]),

  // 9. Ads
  ads: defineTable({
    title: v.string(),
    subtitle: v.optional(v.string()),
    imageUrl: v.string(),
    link: v.optional(v.string()),
    isActive: v.boolean(),
    type: v.optional(v.string()),
    createdAt: v.float64(),
  }),

  // 10. User Coupons
  user_coupons: defineTable({
    userId: v.string(),
    couponCode: v.string(),
    assignedAt: v.string(),
    isRead: v.boolean(),
  }).index("by_user", ["userId"]),

  // 11. Profiles
  profiles: defineTable({
    userId: v.string(), // Auth identifier
    role: v.string(), // "customer" | "staff" | "manager" | "super_admin"
    fullName: v.optional(v.string()),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    updatedAt: v.float64(),
  })
    .index("by_user", ["userId"])
    .index("by_phone", ["phone"]),

  // 11B. OTP codes for WhatsApp authentication
  otp_codes: defineTable({
    phone: v.string(),
    code: v.string(),
    expiresAt: v.float64(),
  }).index("by_phone", ["phone"]),

  // 12. Carts (Abandoned recovery support)
  carts: defineTable({
    userId: v.optional(v.string()),
    anonymousId: v.optional(v.string()),
    items: v.any(), // Array of items
    isAbandoned: v.boolean(),
    recoveryStatus: v.string(), // "none" | "emailed" | "recovered"
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("by_user", ["userId"])
    .index("by_anonymous", ["anonymousId"]),

  // 13. Store Settings (Visual styling and widgets configuration for White-Labeling)
  storeSettings: defineTable({
    brandName: v.string(),
    theme: v.object({
      primaryColor: v.string(),
      secondaryColor: v.string(),
      accentColor: v.optional(v.string()),
      fontFamily: v.string(),
      buttonRadius: v.string(),
      borderWidth: v.optional(v.string()),
      shadowStyle: v.optional(v.string()),
      cardStyle: v.optional(v.string()),
      navbarStyle: v.optional(v.string()),
      pageTexture: v.optional(v.string()),
      hoverEffect: v.optional(v.string()),
    }),
    enabledWidgets: v.array(v.string()), // e.g. ["hero-carousel", "newsletter", "reviews"]
    layoutOrder: v.array(v.string()), // e.g. ["hero", "ticker", "onsale", "categories"]
    currency: v.optional(v.string()),
    currencySymbol: v.optional(v.string()),
    currencyMultiplier: v.optional(v.number()),
    freeShippingThreshold: v.optional(v.number()),
    footerCopyright: v.optional(v.string()),
    showPaymentsAccepted: v.optional(v.boolean()),
    socialInstagram: v.optional(v.string()),
    socialFacebook: v.optional(v.string()),
    socialPinterest: v.optional(v.string()),
    socialWhatsapp: v.optional(v.string()),
    yocoPublicKey: v.optional(v.string()),
    yocoSecretKey: v.optional(v.string()),
    payfastMerchantId: v.optional(v.string()),
    customTexts: v.optional(v.object({
      heroTitle: v.optional(v.string()),
      heroSubtitle: v.optional(v.string()),
      heroCtaText: v.optional(v.string()),
      announcementBarText: v.optional(v.string()),
      whatsappNumber: v.optional(v.string()),
      whatsappMessage: v.optional(v.string()),
    })),
    updatedAt: v.float64(),
  }),

  // 14. Tenants (Multi-Store dynamic SaaS instances)
  tenants: defineTable({
    name: v.string(),
    subdomain: v.string(),
    customDomain: v.optional(v.string()),
    preset: v.string(),
    status: v.string(), // "active" | "suspended" | "provisioning"
    themeOverrides: v.optional(v.any()),
    customTexts: v.optional(v.any()),
    createdAt: v.float64(),
  })
    .index("by_subdomain", ["subdomain"])
    .index("by_status", ["status"]),

  // 15. RSVPs (For Invited Event Suite)
  rsvps: defineTable({
    name: v.string(),
    email: v.string(),
    attending: v.boolean(),
    guestsCount: v.number(),
    dietaryRestrictions: v.optional(v.string()),
    eventCode: v.string(), // e.g. "GALA-2026", "WEDDING"
    createdAt: v.float64(),
  }).index("by_event", ["eventCode"]),

  // 16. Events (Multi-Event Invited Suite)
  events: defineTable({
    title: v.string(),
    code: v.string(), // slug identifier (e.g. "gala-2026")
    clientName: v.string(),
    clientEmail: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    location: v.string(),
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
        tastingStatus: v.optional(v.string()), // "scheduled" | "completed" | "none"
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
        meetingStatus: v.optional(v.string()), // "scheduled" | "completed" | "none"
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
        meetingStatus: v.optional(v.string()), // "scheduled" | "completed" | "none"
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
          status: v.string(), // "pending" | "completed"
          category: v.string(), // "general" | "catering" | "decor" | "flowers"
        })
      )
    ),
    createdAt: v.float64(),
  }).index("by_code", ["code"]),
});
