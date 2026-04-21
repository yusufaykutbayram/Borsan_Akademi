import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.borsan.com.tr',
      },
    ],
  },
};

export default nextConfig;
