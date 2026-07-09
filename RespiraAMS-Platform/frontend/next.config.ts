import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/1.0/:path*",
        destination: `${process.env.GATEWAY_URL || "http://gateway"}/api/1.0/:path*`,
      },
    ];
  },

};

export default nextConfig;
