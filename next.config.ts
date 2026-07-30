import type { NextConfig } from "next";

const rawBackendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const cleanBackendUrl = rawBackendUrl.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${cleanBackendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
