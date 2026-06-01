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
      {
        source: "/.well-known/oauth-authorization-server",
        destination: "/api/oauth-authorization-server",
      },
      {
        source: "/.well-known/oauth-protected-resource",
        destination: "/api/oauth-protected-resource",
      },
      {
        source: "/.well-known/http-message-signatures-directory",
        destination: "/api/http-message-signatures-directory",
      },
      {
        source: "/.well-known/mcp/server-card.json",
        destination: "/api/mcp-server-card",
      },
      {
        source: "/.well-known/agent-skills/index.json",
        destination: "/api/agent-skills-index",
      },
      {
        source: "/.well-known/agent-skills/:slug/SKILL.md",
        destination: "/api/agent-skill/:slug",
      },
    ];
  },
};

export default nextConfig;
