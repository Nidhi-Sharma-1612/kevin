import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "l.icdbcdn.com",
      },
      // Images uploaded through the admin panel are served from its
      // /api/media proxy.
      {
        protocol: "https",
        hostname: "admin.weblaucher.com",
        pathname: "/api/media/**",
      },
    ],
  },
};

export default nextConfig;
