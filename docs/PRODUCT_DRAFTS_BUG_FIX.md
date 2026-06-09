# Resolution of Draft Products Visible in Storefront

## Issue Description
New products created with a `status` of `draft` (such as the "Sidia Beast Vape") were incorrectly appearing in the public catalog, including category pages and featured sections.

## Root Cause
The database queries in the storefront library were retrieving all records from the `products` table without filtering for the `status` field. By default, any newly created row in the Supabase `products` table was being mapped to the app's `Product` type and displayed, regardless of its intended visibility status.

## Steps Taken to Fix
The following improvements were implemented to ensure strict isolation between drafts and published products:

1.  **Uniform Filtering**: Added `.eq('status', 'published')` to the following core fetch functions in `src/lib/products.ts`:
    - `getProducts()`
    - `getFeaturedProducts()`
    - `getOnSaleProducts()`
2.  **Type Mapping**: Updated the `mapToAppProduct` helper to correctly handle the `status` field, ensuring that any logic relying on the product object has access to its current state.
3.  **Sanity Checks**: Verified that common storefront entry points now respect the `published` status requirement.

## Future Prevention
- Always include `.eq('status', 'published')` when adding new public-facing data fetching functions.
- For admin-only views, use the `getAllProducts()` function with an explicit status filter or no filter, but never expose `getAllProducts()` directly to the public API without proper authorization checks.
