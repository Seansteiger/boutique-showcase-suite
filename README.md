# Jozi Student Hub (JSH) - Next.js E-commerce

Jozi Student Hub is a premium e-commerce platform built for students in Johannesburg, featuring localized shipping, PayFast integration, and a comprehensive Admin Dashboard.

## 🚀 Features

- **Storefront**: Modern, responsive UI with "Vibe" aesthetic.
- **Products**: Variations (Colors), Search, Categories, and "On Sale" logic.
- **Cart & Checkout**:
  - Abandoned Cart Recovery (SQL ready).
  - Zone-based Shipping (UJ Campus, JHB, Nationwide).
  - Coupon Management (Fixed & Percentage).
- **Payments**: PayFast Integration (Secure Signature Generation).
- **Admin Dashboard**:
  - URL: `/admin` (Protected Route).
  - Manage Products, Orders, Coupons, and Ads.
  - Analytics Overview.
- **Authentication**: Supabase Auth (Email/Password + Google OAuth).
- **Tech Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase (Postgres + Storage).

## 🛠️ Setup & Installation

1.  **Clone & Install**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env.local` file with the following:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

    # Payments (PayFast)
    PAYFAST_MERCHANT_ID=your_id
    PAYFAST_MERCHANT_KEY=your_key
    PAYFAST_PASSPHRASE=your_passphrase
    PAYFAST_MODE=production # or sandbox

    # Email (Resend)
    RESEND_API_KEY=re_123...
    ```

3.  **Run Locally**:
    ```bash
    npm run dev
    ```

## 📦 Deployment (Vercel)

1.  Push code to GitHub.
2.  Import project into Vercel.
3.  Add all Environment Variables in Vercel Project Settings.
4.  **Important**: Ensure `next.config.ts` has the correct `hostname` for your Supabase Storage bucket.

## 🛡️ Admin Access

1.  Sign up as a normal user.
2.  In Supabase Table `profiles`, find your user and set `role` to `'admin'`.
3.  Log in again to access `/admin`.

## 🗃️ Database Scripts

Migration scripts are located in `/scripts`.
- `apply_carts_v2.sql`: **Required** for Cart & Checkout features.
- `schema_v2.sql`: Full schema definition.

## 🧪 Testing

- **Checkout**: Use a PayFast Sandbox account to test payments.
- **Coupons**: Create a coupon in Admin > Coupons and test it at checkout.
- **Google Auth**: Verify redirects work (requires Production URL in Google Cloud Console).

