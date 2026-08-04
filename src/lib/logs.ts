import { load as parseYaml } from "js-yaml";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export type LogType = "log" | "experiment" | "adr";
export type LogStatus = "In-Progress" | "Resolved" | "Abandoned";

export interface LogFrontmatter {
  title: string;
  date: string;
  type: LogType;
  status: LogStatus;
  pillars: string[];
  tags: string[];
}

export interface LogEntry {
  slug: string;
  frontmatter: LogFrontmatter;
  html: string;
  excerpt: string;
  readingTime: number;
}

const LOG_TYPES: LogType[] = ["log", "experiment", "adr"];
const LOG_STATUSES: LogStatus[] = ["In-Progress", "Resolved", "Abandoned"];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

const rawFiles = import.meta.glob("../../content/logs/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeHighlight)
  .use(rehypeStringify);

function slugFromPath(path: string): string {
  return path.split("/").pop()!.replace(/\.md$/, "");
}

function splitFrontmatter(raw: string, source: string): { data: Record<string, unknown>; content: string } {
  const match = FRONTMATTER_PATTERN.exec(raw);
  if (!match) {
    throw new Error(`${source}: missing YAML frontmatter block (expected leading "---")`);
  }
  const data = (parseYaml(match[1]) ?? {}) as Record<string, unknown>;
  return { data, content: match[2] };
}

function validateFrontmatter(data: Record<string, unknown>, source: string): LogFrontmatter {
  const missing = ["title", "date", "type", "status", "pillars", "tags"].filter(
    (key) => data[key] === undefined
  );
  if (missing.length > 0) {
    throw new Error(`${source}: missing frontmatter field(s): ${missing.join(", ")}`);
  }
  if (typeof data.date !== "string" || !DATE_PATTERN.test(data.date)) {
    throw new Error(`${source}: "date" must be in YYYY-MM-DD format, got ${JSON.stringify(data.date)}`);
  }
  if (!LOG_TYPES.includes(data.type as LogType)) {
    throw new Error(`${source}: "type" must be one of ${LOG_TYPES.join(", ")}, got ${JSON.stringify(data.type)}`);
  }
  if (!LOG_STATUSES.includes(data.status as LogStatus)) {
    throw new Error(`${source}: "status" must be one of ${LOG_STATUSES.join(", ")}, got ${JSON.stringify(data.status)}`);
  }
  if (!Array.isArray(data.pillars) || !Array.isArray(data.tags)) {
    throw new Error(`${source}: "pillars" and "tags" must be arrays`);
  }

  return {
    title: String(data.title),
    date: data.date,
    type: data.type as LogType,
    status: data.status as LogStatus,
    pillars: data.pillars as string[],
    tags: data.tags as string[],
  };
}

function readingTimeFor(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function excerptFor(text: string, maxLength = 180): string {
  const plain = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`~[\]()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > maxLength ? `${plain.slice(0, maxLength).trimEnd()}…` : plain;
}

function parseEntry(path: string, raw: string): LogEntry {
  const { data, content } = splitFrontmatter(raw, path);
  const frontmatter = validateFrontmatter(data, path);
  const html = processor.processSync(content).toString();

  return {
    slug: slugFromPath(path),
    frontmatter,
    html,
    excerpt: excerptFor(content),
    readingTime: readingTimeFor(content),
  };
}

const allLogs: LogEntry[] = Object.entries(rawFiles)
  .map(([path, raw]) => parseEntry(path, raw))
  .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));

export function getAllLogs(): LogEntry[] {
  return allLogs;
}

export function getLogBySlug(slug: string): LogEntry | undefined {
  return allLogs.find((entry) => entry.slug === slug);
}

export function getAllTags(): string[] {
  return Array.from(new Set(allLogs.flatMap((entry) => entry.frontmatter.tags))).sort();
}

export function getAllPillars(): string[] {
  return Array.from(new Set(allLogs.flatMap((entry) => entry.frontmatter.pillars))).sort();
}

export function filterLogs(
  entries: LogEntry[],
  filters: { tag?: string | null; pillar?: string | null }
): LogEntry[] {
  return entries.filter((entry) => {
    if (filters.tag && !entry.frontmatter.tags.includes(filters.tag)) return false;
    if (filters.pillar && !entry.frontmatter.pillars.includes(filters.pillar)) return false;
    return true;
  });
}
