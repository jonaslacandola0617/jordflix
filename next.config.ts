import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TMDB already serves appropriately sized assets (w342/w500/w780/original).
    // Serve them directly so Jordflix does not depend on Vercel's optimized-image
    // request quota, which can otherwise turn poster requests into HTTP 402s.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" },
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
