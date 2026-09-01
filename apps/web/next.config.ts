import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "test-videos.co.uk" },
      { protocol: "https", hostname: "commondatastorage.googleapis.com" },
      { protocol: "https", hostname: "cdn.veilwick.com" },
      // R2 public bucket via custom domain or r2.dev (posters: posters/series/{id}/cover.jpg 720x1280)
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.r2.dev" },
      // Wavespeed output CDN (generated poster source before R2 upload)
      { protocol: "https", hostname: "cdn.wavespeed.ai" },
      { protocol: "https", hostname: "*.wavespeed.ai" },
    ],
  },
  // Note: /prototype-scenes is served via app/prototype-scenes/page.tsx (10 pairs, 720x1280, generate-one button).
  // Static wireframe remains at /prototype-scenes.html (public/prototype-scenes.html).
  // OpenNext on Cloudflare requires these
  experimental: {
    // Minify for worker bundle size
    optimizePackageImports: ["better-auth", "drizzle-orm"],
  },
};

export default nextConfig;
