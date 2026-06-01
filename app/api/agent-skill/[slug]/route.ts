/**
 * Per-skill SKILL.md endpoint.
 * Served at `/.well-known/agent-skills/<slug>/SKILL.md` via a rewrite in
 * `next.config.ts`.
 *
 * Each SKILL.md body is defined in `lib/agent-skills.ts` so the index
 * digests and the served content stay in sync.
 */
import { getSkill } from "@/lib/agent-skills";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const skill = getSkill(slug);

  if (!skill) {
    return new Response(
      `# 404\n\nNo agent skill is published with slug \`${slug}\`.\n`,
      {
        status: 404,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      },
    );
  }

  return new Response(skill.body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
