/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ads from "../ads.js";
import type * as carts from "../carts.js";
import type * as coupons from "../coupons.js";
import type * as events from "../events.js";
import type * as orders from "../orders.js";
import type * as otp from "../otp.js";
import type * as products from "../products.js";
import type * as profiles from "../profiles.js";
import type * as reviews from "../reviews.js";
import type * as rsvps from "../rsvps.js";
import type * as seedStore from "../seedStore.js";
import type * as settings from "../settings.js";
import type * as tenants from "../tenants.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ads: typeof ads;
  carts: typeof carts;
  coupons: typeof coupons;
  events: typeof events;
  orders: typeof orders;
  otp: typeof otp;
  products: typeof products;
  profiles: typeof profiles;
  reviews: typeof reviews;
  rsvps: typeof rsvps;
  seedStore: typeof seedStore;
  settings: typeof settings;
  tenants: typeof tenants;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
