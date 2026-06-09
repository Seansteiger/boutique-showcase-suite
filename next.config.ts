import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: "images.unsplash.com" },
      { protocol: 'https', hostname: "jozistudenthub.co.za" },
      { protocol: 'https', hostname: "ik.imagekit.io" }
    ],
  },
  async headers() {
    return [
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Content-Security-Policy
          /* 
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleapis.com https://*.payfast.co.za https://www.payfast.co.za https://js.yoco.com https://*.yoco.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: blob: https://*.unsplash.com https://jozistudenthub.co.za https://*.yoco.com;
              font-src 'self' data: https://fonts.gstatic.com;
              connect-src 'self' https://*.google.com https://*.googleapis.com https://*.payfast.co.za https://*.yoco.com;
              frame-src 'self' https://*.payfast.co.za https://*.google.com https://*.yoco.com https://js.yoco.com;
              object-src 'none';
              base-uri 'self';
            `.replace(/\s{2,}/g, ' ').trim(),
          }
          */
        ],
      },
    ];
  },
};

export default nextConfig;
