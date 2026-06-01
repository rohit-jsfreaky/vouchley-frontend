/**
 * Agent Skills Discovery RFC v0.2.0 — index document.
 * Served at `/.well-known/agent-skills/index.json` via a rewrite in
 * `next.config.ts`.
 *
 * Lists every published skill with its name, type, description, URL,
 * and a sha256 digest. The digest is computed at request time over the
 * exact SKILL.md bytes the per-skill route will serve — so the index
 * and the content are guaranteed to be in sync.
 */
import { createHash } from "node:crypto";

import { AGENT_SKILLS } from "@/lib/agent-skills";
import { SITE } from "@/config/site";

export const runtime = "nodejs";

export async function GET() {
  const body = {
    $schema:
      "https://raw.githubusercontent.com/cloudflare/agent-skills-discovery-rfc/main/schema/v0.2.0.json",
    version: "0.2.0",
    publisher: {
      name: SITE.name,
      url: SITE.url,
    },
    skills: AGENT_SKILLS.map((skill) => ({
      name: skill.name,
      type: skill.type,
      description: skill.description,
      url: `${SITE.url}/.well-known/agent-skills/${skill.slug}/SKILL.md`,
      sha256: createHash("sha256").update(skill.body, "utf8").digest("hex"),
    })),
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
