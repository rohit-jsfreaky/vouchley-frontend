/**
 * Resolves a URL pathname to the matching agent-friendly markdown file.
 *
 * Two content sources:
 *   - `content/blog/<slug>.md`         — already-authored blog posts
 *   - `content/agent-md/<path>.md`     — hand-authored markdown of every
 *                                        other public page, mirroring URLs
 *
 * Special cases:
 *   - `/`                              → `agent-md/index.md`
 *   - `/blog`                          → `agent-md/blog.md`
 *   - `/blog/<slug>`                   → `content/blog/<slug>.md`
 *
 * Returns null if no markdown exists for the path. Callers should respond
 * with 404 in that case.
 */
import fs from "node:fs";
import path from "node:path";

const AGENT_MD_DIR = path.join(process.cwd(), "content", "agent-md");
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function loadAgentMarkdown(pathname: string): string | null {
  const cleaned = normalizePath(pathname);
  const candidates = resolveCandidates(cleaned);
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (!fs.existsSync(candidate)) continue;
    try {
      return fs.readFileSync(candidate, "utf-8");
    } catch {
      continue;
    }
  }
  return null;
}

function normalizePath(pathname: string): string {
  let p = pathname.trim();
  if (p.endsWith(".md")) p = p.slice(0, -3);
  if (p.startsWith("/")) p = p.slice(1);
  if (p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

function resolveCandidates(cleaned: string): (string | null)[] {
  if (cleaned === "") {
    return [path.join(AGENT_MD_DIR, "index.md")];
  }

  if (cleaned === "blog") {
    return [
      path.join(AGENT_MD_DIR, "blog.md"),
      path.join(AGENT_MD_DIR, "blog", "index.md"),
    ];
  }

  if (cleaned.startsWith("blog/")) {
    const slug = cleaned.slice("blog/".length);
    if (!isSafeSlug(slug)) return [];
    return [path.join(BLOG_DIR, `${slug}.md`)];
  }

  if (!isSafePath(cleaned)) return [];
  // Prefer `<path>.md`, fall back to `<path>/index.md` for folder-style
  // routes like `/docs` → `docs/index.md`.
  return [
    path.join(AGENT_MD_DIR, `${cleaned}.md`),
    path.join(AGENT_MD_DIR, cleaned, "index.md"),
  ];
}

function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/.test(slug);
}

function isSafePath(p: string): boolean {
  if (p.includes("..")) return false;
  if (p.startsWith("/") || p.includes("\\")) return false;
  return /^[a-z0-9][a-z0-9/-]*$/.test(p);
}
