import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "l.icdbcdn.com",
      },
    ],
  },
};

export default nextConfig;
