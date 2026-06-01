/**
 * MCP Server Card — SEP-1649 / modelcontextprotocol PR #2127.
 * Served at `/.well-known/mcp/server-card.json` via a rewrite in
 * `next.config.ts`.
 *
 * Honest framing: Vouchley does not yet expose a live MCP server. The
 * card below describes the *planned* MCP surface that wraps the REST API
 * — `verify_signup`, `verify_bulk`, `get_usage`, `get_account` — so that
 * agents discovering this card know what's coming and where the live
 * REST equivalents are today. `metadata.status = "planned"` is the
 * machine-readable signal that the transport is not yet live; the REST
 * endpoints listed under each tool's `x-rest-equivalent` extension can
 * be used in the meantime.
 */
import { SITE } from "@/config/site";

export const runtime = "nodejs";

export async function GET() {
  const body = {
    schemaVersion: "2024-11-05",
    serverInfo: {
      name: "vouchley",
      title: "Vouchley signup verification",
      version: "0.1.0",
      description:
        "Real-time signup verification: scores a signup (email + IP + name + company) and returns a 0–100 trust score with a recommendation — approve, review, or block — in under 1.5 seconds.",
    },
    transport: {
      type: "http",
      endpoint: `https://mcp.vouchley.getrevlio.com/v1`,
      authentication: {
        type: "bearer",
        scheme: "Bearer",
        header: "Authorization",
        documentation: `${SITE.url}/docs/authentication`,
      },
    },
    capabilities: {
      tools: { listChanged: false },
      resources: { listChanged: false, subscribe: false },
      prompts: { listChanged: false },
      logging: {},
    },
    tools: [
      {
        name: "verify_signup",
        description:
          "Score a single signup. Returns a 0–100 trust score, an approve/review/block recommendation, and a breakdown of every signal that fired (email, IP, domain, behavior).",
        inputSchema: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Email address to verify.",
            },
            name: {
              type: "string",
              description:
                "Full name of the person signing up. Improves person-match signals.",
            },
            company_name: {
              type: "string",
              description: "Company name. Enables domain age and company signals.",
            },
            ip_address: {
              type: "string",
              description:
                "Source IP (v4 or v6) of the signup. Enables VPN/Tor/geo signals.",
            },
          },
        },
        "x-rest-equivalent": `POST ${SITE.apiUrl}/v1/verify`,
      },
      {
        name: "verify_bulk",
        description:
          "Submit up to 1,000 signups for asynchronous batch verification. Returns a job_id; poll get_job_status until completed.",
        inputSchema: {
          type: "object",
          required: ["items"],
          properties: {
            items: {
              type: "array",
              minItems: 1,
              maxItems: 1000,
              items: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email" },
                  name: { type: "string" },
                  company_name: { type: "string" },
                  ip_address: { type: "string" },
                },
              },
            },
          },
        },
        "x-rest-equivalent": `POST ${SITE.apiUrl}/v1/verify/bulk`,
      },
      {
        name: "get_job_status",
        description:
          "Poll a bulk verification job. Returns status, progress counts, and (when completed) the per-item results.",
        inputSchema: {
          type: "object",
          required: ["job_id"],
          properties: {
            job_id: {
              type: "string",
              description: "The job_id returned by verify_bulk.",
            },
          },
        },
        "x-rest-equivalent": `GET ${SITE.apiUrl}/v1/jobs/:job_id`,
      },
      {
        name: "get_verification",
        description:
          "Retrieve a previously completed verification by its request_id.",
        inputSchema: {
          type: "object",
          required: ["request_id"],
          properties: {
            request_id: {
              type: "string",
              description: "The request_id returned by verify_signup.",
            },
          },
        },
        "x-rest-equivalent": `GET ${SITE.apiUrl}/v1/verify/:request_id`,
      },
      {
        name: "get_usage",
        description:
          "Retrieve current-month usage statistics and credit balance for the authenticated account.",
        inputSchema: { type: "object", properties: {} },
        "x-rest-equivalent": `GET ${SITE.apiUrl}/v1/usage`,
      },
      {
        name: "get_account",
        description:
          "Retrieve account profile, credit balance, and active subscription info.",
        inputSchema: { type: "object", properties: {} },
        "x-rest-equivalent": `GET ${SITE.apiUrl}/v1/account`,
      },
    ],
    resources: [],
    prompts: [],
    metadata: {
      status: "planned",
      homepage: SITE.url,
      documentation: `${SITE.url}/docs`,
      documentation_markdown: `${SITE.url}/docs.md`,
      openapi: `${SITE.apiUrl}/openapi.json`,
      api_catalog: `${SITE.url}/.well-known/api-catalog`,
      auth_md: `${SITE.url}/auth.md`,
      terms: `${SITE.url}/terms`,
      privacy: `${SITE.url}/privacy`,
      license: "Proprietary",
      contact: "hello@getrevlio.com",
      vendor: {
        name: "Vouchley",
        url: SITE.url,
      },
      note:
        "MCP transport is not yet live. The tools listed describe the planned MCP surface; each tool's x-rest-equivalent points at the live REST endpoint you can call today.",
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
