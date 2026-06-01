import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Next.js dislikes app-router directories that start with a dot, so we
    // serve `/.well-known/api-catalog` via an internal rewrite to a regular
    // route handler at `/api/api-catalog`.
    return [
      {
        source: "/.well-known/api-catalog",
        destination: "/api/api-catalog",
      },
    ];
  },
};

export default nextConfig;
