# Missing Components & Tasks for Jozi Student Hub (JSH) Launch

This document outlines the critical components and features required to elevate JSH to a high-level, fully functional e-commerce store ready for customers.

## 1. Feature Additions

### A. Wishlist System (Critical for Student "Window Shopping")
Students often save items for later (payday/allowance).
- **Database**: Create `wishlists` table (user_id, product_id, created_at).
- **UI**: Add "Heart" icon to `ProductCard` and `ProductView`.
- **Page**: Create `/account/wishlist` to view saved items.
- **Logic**: Toggle wishlist state, move to cart.

### B. User Account Enhancements
The current account page is too basic.
- **Order Details View**: Click on an order in history to see valid items, shipping address used, and current status.
- **Address Book**: Allow users to save default delivery addresses (e.g., "Home", "Res", "Campus").
- **Profile Settings**: Edit name, phone number (crucial for delivery), and password.

### C. Advanced Admin Dashboard (`/admin`)
Current dashboard only shows high-level stats.
- **Order Management**:
    - **Enhancement**: The current `AdminOrdersPage` allows status updates but **does not trigger emails**. You must hook `generateOrderConfirmationEmail` (or new templates) into the `updateStatus` function in `src/app/admin/orders/page.tsx`.
    - **Detail View**: Ensure `src/app/admin/orders/[id]/page.tsx` allows entering a **Tracking Number** and Courier Name when status is set to "Shipped".
- **Inventory Management**:
    - Quick-edit stock levels directly from the product list (`/admin/products`).
    - Low stock alerts (visual indicators in the table).
- **Customer View**: List of all registered users and their lifetime value.

### D. Marketing & Engagement
- **Related Products**: In `ProductView.tsx`, display "Students also bought" or "You might like" based on category.
- **Newsletter Signup**: Functional "Subscribe" form in Footer (connect to Resend Audience or similar).
- **Reviews**: detailed review breakdown (5 stars vs 1 star bars) on product pages.

## 2. Notifications & Communication

- **Transactional Emails**:
    - **Shipping Confirmation**: Email triggered when admin updates status to "Shipped" (must include tracking number).
    - **Delivery Confirmation**: Email when status is "Delivered".
- **Abandoned Cart**: (Optional but recommended) Email reminder for items left in cart > 24h.

## 3. SEO & Analytics (Launch Readiness)

- **Structured Data (JSON-LD)**: accessible on Product pages (Schema.org/Product) so Google shows price/stock in search results.
- **Analytics**:
    - **Google Analytics 4 (GA4)**: Track student traffic sources.
    - **Meta Pixel**: Essential for retargeting students on Instagram/Facebook.
- **Sitemap**: Ensure dynamic products are auto-added to `sitemap.xml`.

## 4. Content & Legal

- **FAQ Page**: A dedicated page answering: "How long is delivery to Res?", "Do you deliver to Wits?", "Returns policy".
- **About Us**: Ensure the story of "For students, by students" is compelling.
- **Policy Pages**: content for `src/app/legal` (Privacy, Terms, Returns) must be legally compliant for SA.

## 5. Mobile Polish (App-like Feel)

- **Touch Targets**: Ensure all buttons are at least 44px height for mobile thumbs.
- **PWA Capabilities**: Add `manifest.json` so students can "Install" the site as an app on their home screen.

## Suggested Execution Order
1.  **Wishlist** (High Engagement)
2.  **Order Details & Management** (Critical for Operations)
3.  **Emails** (Critical for Trust)
4.  **Analytics & SEO** (Critical for Growth)
