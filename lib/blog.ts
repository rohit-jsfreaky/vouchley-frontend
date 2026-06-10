/**
 * Blog content loader.
 *
 * Posts are stored as markdown files with YAML frontmatter at
 * `content/blog/<slug>.md`. The index file `content/blog/index.json` is the
 * canonical list used by the blog list page and the sitemap — the automation
 * pipeline appends to it on every new post.
 *
 * All functions are server-only (read the filesystem), so they must only be
 * called from Server Components or build-time code (sitemap.ts, etc.).
 */
import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

export interface BlogIndexEntry {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO 8601
  category: string;
  author: string;
  image: string; // /blog/<file>.jpg
  tags: string[];
  keywords: string[];
  readingTime: number; // minutes
  featured?: boolean;
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogHowToStep {
  name: string;
  text: string;
  url?: string;
}

export interface BlogHowTo {
  name: string;
  description?: string;
  totalTime?: string; // ISO 8601 duration, e.g. "PT30M"
  steps: BlogHowToStep[];
}

export interface BlogAuthorBio {
  name: string;
  title?: string;
  bio?: string;
  links?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface BlogPost extends BlogIndexEntry {
  content: string; // raw markdown body
  updatedAt?: string;
  /** Optional FAQ block — renders below the post body and emits FAQPage schema. */
  faq?: BlogFaqItem[];
  /** Optional HowTo block — emits HowTo schema. */
  howTo?: BlogHowTo;
  /** Optional rich author bio — overrides the default bio block. */
  authorBio?: BlogAuthorBio;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const INDEX_PATH = path.join(CONTENT_DIR, "index.json");

export function getAllPosts(): BlogIndexEntry[] {
  if (!fs.existsSync(INDEX_PATH)) return [];
  const raw = fs.readFileSync(INDEX_PATH, "utf-8");
  const json = JSON.parse(raw) as { posts: BlogIndexEntry[] };
  return json.posts
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedPost(): BlogIndexEntry | null {
  const posts = getAllPosts();
  return posts.find((p) => p.featured) ?? posts[0] ?? null;
}

export function getPostsByCategory(category: string | null): BlogIndexEntry[] {
  const posts = getAllPosts();
  if (!category || category.toLowerCase() === "all") return posts;
  return posts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase(),
  );
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const set = new Set(posts.map((p) => p.category));
  return Array.from(set).sort();
}

export function getPost(slug: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? "",
    excerpt: data.excerpt ?? "",
    date: data.date ?? "",
    category: data.category ?? "Engineering",
    author: data.author ?? "Rohit",
    image: data.image ?? "",
    tags: data.tags ?? [],
    keywords: data.keywords ?? [],
    readingTime: data.readingTime ?? estimateReadingTime(content),
    featured: data.featured ?? false,
    updatedAt: data.updatedAt,
    faq: Array.isArray(data.faq) ? (data.faq as BlogFaqItem[]) : undefined,
    howTo: data.howTo as BlogHowTo | undefined,
    authorBio: data.authorBio as BlogAuthorBio | undefined,
    content,
  };
}

export function getRelatedPosts(
  slug: string,
  limit: number = 3,
): BlogIndexEntry[] {
  const current = getPost(slug);
  const all = getAllPosts().filter((p) => p.slug !== slug);
  if (!current) return all.slice(0, limit);
  // Prefer same category, fall back to most recent.
  const sameCategory = all.filter((p) => p.category === current.category);
  const combined = [...sameCategory, ...all];
  const seen = new Set<string>();
  return combined
    .filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    })
    .slice(0, limit);
}

function estimateReadingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
