import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. Get Categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// 2. Get Products (Published storefront products)
export const getProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    // Fetch relations (categories and variations) for each product
    const productsWithRelations = await Promise.all(
      products.map(async (p) => {
        // Fetch category
        let category = null;
        if (p.categoryId) {
          category = await ctx.db
            .query("categories")
            .filter((q) => q.or(q.eq(q.field("slug"), p.categoryId), q.eq(q.field("_id"), p.categoryId)))
            .first();
        }

        // Fetch variations
        const variations = await ctx.db
          .query("product_variations")
          .withIndex("by_product", (q) => q.eq("productId", p._id.toString()))
          .collect();

        return {
          ...p,
          id: p._id.toString(),
          categories: category ? { name: category.name, slug: category.slug } : null,
          product_variations: variations.map((v) => ({
            id: v._id.toString(),
            price: v.price,
            stock_quantity: v.stockQuantity,
            image_url: v.imageUrl,
            attributes: v.attributes,
          })),
        };
      })
    );

    return productsWithRelations;
  },
});

// 3. Get All Products (Internal Admin panel query supporting search, filter, and sort)
export const getAllProducts = query({
  args: {
    status: v.optional(v.string()),
    sort: v.optional(v.string()),
    categoryId: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("products");

    // Retrieve all and filter in JS for maximum flexibility (or index as needed)
    let products = await query.collect();

    if (args.status && args.status !== "all") {
      products = products.filter((p) => p.status === args.status);
    }

    if (args.categoryId && args.categoryId !== "all") {
      products = products.filter((p) => p.categoryId === args.categoryId);
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }

    // Map relations
    let productsWithRelations = await Promise.all(
      products.map(async (p) => {
        let category = null;
        if (p.categoryId) {
          category = await ctx.db
            .query("categories")
            .filter((q) => q.or(q.eq(q.field("slug"), p.categoryId), q.eq(q.field("_id"), p.categoryId)))
            .first();
        }

        const variations = await ctx.db
          .query("product_variations")
          .withIndex("by_product", (q) => q.eq("productId", p._id.toString()))
          .collect();

        return {
          ...p,
          id: p._id.toString(),
          categories: category ? { name: category.name, slug: category.slug } : null,
          product_variations: variations.map((v) => ({
            id: v._id.toString(),
            price: v.price,
            stock_quantity: v.stockQuantity,
            image_url: v.imageUrl,
            attributes: v.attributes,
          })),
        };
      })
    );

    // Sort options: "oldest", "newest", "z-a", "a-z"
    const sortOption = args.sort || "a-z";
    switch (sortOption) {
      case "oldest":
        productsWithRelations.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "newest":
        productsWithRelations.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "z-a":
        productsWithRelations.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "a-z":
      default:
        productsWithRelations.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return productsWithRelations;
  },
});

// 4. Get Product By Slug (Storefront details lookup)
export const getProductBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!product) return null;

    let category = null;
    if (product.categoryId) {
      category = await ctx.db
        .query("categories")
        .filter((q) => q.or(q.eq(q.field("slug"), product.categoryId), q.eq(q.field("_id"), product.categoryId)))
        .first();
    }

    const variations = await ctx.db
      .query("product_variations")
      .withIndex("by_product", (q) => q.eq("productId", product._id.toString()))
      .collect();

    const mappedProduct = {
      ...product,
      id: product._id.toString(),
      categories: category ? { name: category.name, slug: category.slug } : null,
      product_variations: variations.map((v) => ({
        id: v._id.toString(),
        price: v.price,
        stock_quantity: v.stockQuantity,
        image_url: v.imageUrl,
        attributes: v.attributes,
      })),
    };

    return {
      product: {
        id: mappedProduct.id,
        name: mappedProduct.title,
        slug: mappedProduct.slug,
        status: mappedProduct.status,
        description: mappedProduct.description || "",
        price: mappedProduct.price,
        salePrice: mappedProduct.salePrice || null,
        category: mappedProduct.categories?.name || "Uncategorized",
        categorySlug: mappedProduct.categories?.slug || "uncategorized",
        image: mappedProduct.imageUrls?.[0] || "https://images.unsplash.com/photo-1550989460-0adf9ea622e2",
        images: mappedProduct.imageUrls || [],
        stock: mappedProduct.stockQuantity,
        features: mappedProduct.features || [],
        brand: mappedProduct.brand || null,
        categoryId: mappedProduct.categoryId,
      },
      variations: variations.map((v) => ({
        id: v._id.toString(),
        attributes: v.attributes,
        price: v.price,
        stock: v.stockQuantity,
        image: v.imageUrl,
      })),
    };
  },
});

// 4.5 Get Product By ID
export const getProductById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const productId = ctx.db.normalizeId("products", args.id);
    if (!productId) return null;
    const product = await ctx.db.get(productId);
    if (!product) return null;

    const variations = await ctx.db
      .query("product_variations")
      .withIndex("by_product", (q) => q.eq("productId", product._id.toString()))
      .collect();

    return {
      ...product,
      id: product._id.toString(),
      category_id: product.categoryId,
      brand: product.brand || "",
      features: product.features || [],
      image_urls: product.imageUrls || [],
      variations: variations.map((v) => ({
        id: v._id.toString(),
        attributes: Array.isArray(v.attributes) 
          ? v.attributes 
          : Object.entries(v.attributes || {}).map(([key, value]) => ({ key: String(key), value: String(value) })),
        price: v.price,
        stock_quantity: v.stockQuantity,
        image_url: v.imageUrl,
      })),
    };
  },
});

// 5. Add or Modify Product (Mutations for admin panel)
export const upsertProduct = mutation({
  args: {
    id: v.optional(v.string()),
    title: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    salePrice: v.optional(v.number()),
    categoryId: v.optional(v.string()),
    imageUrls: v.optional(v.array(v.string())),
    stockQuantity: v.number(),
    isFeatured: v.boolean(),
    features: v.optional(v.array(v.string())),
    brand: v.optional(v.string()),
    status: v.string(),
    variations: v.optional(
      v.array(
        v.object({
          attributes: v.any(),
          price: v.optional(v.number()),
          stockQuantity: v.number(),
          imageUrl: v.optional(v.string()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const productPayload = {
      title: args.title,
      slug: args.slug,
      description: args.description,
      price: args.price,
      salePrice: args.salePrice,
      categoryId: args.categoryId,
      imageUrls: args.imageUrls,
      stockQuantity: args.stockQuantity,
      isFeatured: args.isFeatured,
      features: args.features,
      brand: args.brand,
      status: args.status,
      createdAt: Date.now(),
    };

    let productIdStr = "";

    if (args.id) {
      const existingId = ctx.db.normalizeId("products", args.id);
      if (existingId) {
        await ctx.db.patch(existingId, productPayload);
        productIdStr = args.id;
      }
    }

    if (!productIdStr) {
      const newId = await ctx.db.insert("products", productPayload);
      productIdStr = newId.toString();
    }

    // Cascade upsert variations
    if (args.variations) {
      // First, delete existing variations for this product
      const existingVariations = await ctx.db
        .query("product_variations")
        .withIndex("by_product", (q) => q.eq("productId", productIdStr))
        .collect();
      for (const ev of existingVariations) {
        await ctx.db.delete(ev._id);
      }

      // Insert new variations
      for (const v of args.variations) {
        await ctx.db.insert("product_variations", {
          productId: productIdStr,
          attributes: v.attributes,
          price: v.price,
          stockQuantity: v.stockQuantity,
          imageUrl: v.imageUrl,
          createdAt: Date.now(),
        });
      }
    }

    return productIdStr;
  },
});

// 6. Delete Product
export const deleteProduct = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const productId = ctx.db.normalizeId("products", args.id);
    if (productId) {
      await ctx.db.delete(productId);
      
      // Cascade delete variations
      const variations = await ctx.db
        .query("product_variations")
        .withIndex("by_product", (q) => q.eq("productId", args.id))
        .collect();
      
      for (const variation of variations) {
        await ctx.db.delete(variation._id);
      }
      return true;
    }
    return false;
  },
});

// 7. Add or Modify Category
export const upsertCategory = mutation({
  args: {
    id: v.optional(v.string()),
    name: v.string(),
    slug: v.string(),
    imageUrl: v.optional(v.string()),
    parentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payload = {
      name: args.name,
      slug: args.slug,
      imageUrl: args.imageUrl,
      parentId: args.parentId,
      createdAt: Date.now(),
    };

    if (args.id) {
      const existingId = ctx.db.normalizeId("categories", args.id);
      if (existingId) {
        await ctx.db.patch(existingId, payload);
        return args.id;
      }
    }

    const newId = await ctx.db.insert("categories", payload);
    return newId.toString();
  },
});

// 8. Delete Category
export const deleteCategory = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const categoryId = ctx.db.normalizeId("categories", args.id);
    if (categoryId) {
      await ctx.db.delete(categoryId);
      return true;
    }
    return false;
  },
});
