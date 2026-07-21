/**
 * Build-time loader for the pinned Maka history snapshot.
 * Spec: docs/research/maka-history-ingest.md
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export interface MakaHistoryMeta {
  schemaVersion: number;
  source: {
    owner: string;
    repo: string;
    defaultBranch: string;
    rootSha: string;
    sourceSha: string;
    sourceShort: string;
    clonePathHint?: string;
  };
  extractedAt: string;
  counts: {
    commits: number;
    prs: number;
    firstParent: number;
    cloneCommitCount?: number;
    cloneFirstParent?: number;
  };
  caps?: Record<string, unknown>;
  status: string;
}

export interface MakaCommit {
  sha: string;
  short: string;
  parents: string[];
  subject: string;
  body: string;
  author: { name: string; email: string; date: string };
  committer: { name: string; email: string; date: string };
  prNumbers: number[];
  pathPrefixes: string[];
  stats: { files: number; additions: number; deletions: number };
}

export interface MakaPr {
  number: number;
  title: string;
  url: string;
  author: string;
  mergedAt: string;
  baseRef: string;
  headRef: string;
  mergeCommitSha: string | null;
  labels: string[];
  commitShas: string[];
}

export interface MakaHistoryIndex {
  shaToPrs: Record<string, number[]>;
  prToShas: Record<string, string[]>;
  shortToSha: Record<string, string>;
}

const DATA_DIR = join(process.cwd(), "data", "maka-history");

function readText(name: string): string {
  return readFileSync(join(DATA_DIR, name), "utf8");
}

function parseNdjson<T>(text: string): T[] {
  const rows: T[] = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    rows.push(JSON.parse(line) as T);
  }
  return rows;
}

let cachedMeta: MakaHistoryMeta | null = null;
let cachedPrs: MakaPr[] | null = null;
let cachedCommits: MakaCommit[] | null = null;
let cachedIndex: MakaHistoryIndex | null = null;
let commitsBySha: Map<string, MakaCommit> | null = null;
let prsByNumber: Map<number, MakaPr> | null = null;

export function hasMakaHistorySnapshot(): boolean {
  return existsSync(join(DATA_DIR, "meta.json"));
}

export function loadMeta(): MakaHistoryMeta {
  if (!cachedMeta) cachedMeta = JSON.parse(readText("meta.json")) as MakaHistoryMeta;
  return cachedMeta;
}

export function loadPrs(): MakaPr[] {
  if (!cachedPrs) cachedPrs = parseNdjson<MakaPr>(readText("prs.ndjson"));
  return cachedPrs;
}

export function loadCommits(): MakaCommit[] {
  if (!cachedCommits) {
    cachedCommits = parseNdjson<MakaCommit>(readText("commits.ndjson"));
  }
  return cachedCommits;
}

export function loadIndex(): MakaHistoryIndex {
  if (!cachedIndex) {
    cachedIndex = JSON.parse(readText("index.json")) as MakaHistoryIndex;
  }
  return cachedIndex;
}

export function getCommitBySha(sha: string): MakaCommit | undefined {
  if (!commitsBySha) {
    commitsBySha = new Map(loadCommits().map((c) => [c.sha, c]));
  }
  return commitsBySha.get(sha);
}

export function getCommitByShort(short: string): MakaCommit | undefined {
  const sha = loadIndex().shortToSha[short];
  return sha ? getCommitBySha(sha) : undefined;
}

export function getPr(number: number): MakaPr | undefined {
  if (!prsByNumber) {
    prsByNumber = new Map(loadPrs().map((p) => [p.number, p]));
  }
  return prsByNumber.get(number);
}

export function githubCommitUrl(sha: string): string {
  const m = loadMeta();
  return `https://github.com/${m.source.owner}/${m.source.repo}/commit/${sha}`;
}

export function areaChips(pathPrefixes: string[], limit = 3): string[] {
  return pathPrefixes.slice(0, limit);
}

export function prAreaChips(pr: MakaPr, limit = 3): string[] {
  const set = new Set<string>();
  for (const sha of pr.commitShas) {
    const c = getCommitBySha(sha);
    if (!c) continue;
    for (const p of c.pathPrefixes) set.add(p);
  }
  return [...set].sort().slice(0, limit);
}

export const HISTORY_PAGE_SIZE = 50;

export type HistoryTimeRange = "30d" | "90d" | "year" | "all";

export interface HistoryPrFilters {
  area?: string;
  author?: string;
  range?: HistoryTimeRange;
  q?: string;
}

function prAreas(pr: MakaPr): string[] {
  const set = new Set<string>();
  for (const sha of pr.commitShas) {
    const c = getCommitBySha(sha);
    if (!c) continue;
    for (const p of c.pathPrefixes) set.add(p);
  }
  return [...set];
}

export function listPrAuthors(prs = loadPrs()): string[] {
  return [...new Set(prs.map((p) => p.author).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function listPrAreas(prs = loadPrs()): string[] {
  const set = new Set<string>();
  for (const pr of prs) {
    for (const a of prAreas(pr)) set.add(a);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

function rangeStartMs(range: HistoryTimeRange | undefined, now = Date.now()): number | null {
  if (!range || range === "all") return null;
  const day = 24 * 60 * 60 * 1000;
  if (range === "30d") return now - 30 * day;
  if (range === "90d") return now - 90 * day;
  if (range === "year") return now - 365 * day;
  return null;
}

export function filterPrs(prs: MakaPr[], filters: HistoryPrFilters): MakaPr[] {
  const area = filters.area?.trim() || "";
  const author = filters.author?.trim() || "";
  const q = filters.q?.trim().toLowerCase() || "";
  const start = rangeStartMs(filters.range);

  return prs.filter((pr) => {
    if (author && pr.author !== author) return false;
    if (area && !prAreas(pr).includes(area)) return false;
    if (start != null) {
      const t = Date.parse(pr.mergedAt);
      if (!Number.isFinite(t) || t < start) return false;
    }
    if (q) {
      const hay = `${pr.title} #${pr.number} ${pr.author}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function parseHistoryFilters(params: URLSearchParams): HistoryPrFilters {
  const rangeRaw = params.get("range") ?? "all";
  const range: HistoryTimeRange =
    rangeRaw === "30d" || rangeRaw === "90d" || rangeRaw === "year" || rangeRaw === "all"
      ? rangeRaw
      : "all";
  return {
    area: params.get("area") ?? undefined,
    author: params.get("author") ?? undefined,
    range,
    q: params.get("q") ?? undefined,
  };
}

export function historyFilterQuery(filters: HistoryPrFilters, page?: number): string {
  const sp = new URLSearchParams();
  if (filters.area) sp.set("area", filters.area);
  if (filters.author) sp.set("author", filters.author);
  if (filters.range && filters.range !== "all") sp.set("range", filters.range);
  if (filters.q) sp.set("q", filters.q);
  if (page && page > 1) sp.set("page", String(page));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** Compact PR row for client-side PR-first index (static-hosting safe). */
export type HistoryPrRow = {
  n: number;
  t: string;
  a: string;
  m: string;
  areas: string[];
  /** Nested member commits: short + subject. */
  cs: { s: string; sub: string }[];
};

/** Compact commit row for client-side advanced modes (static-hosting safe). */
export type HistoryCommitRow = {
  s: string;
  sub: string;
  a: string;
  d: string;
  areas: string[];
  /** True when commit has more than one parent. */
  m: boolean;
  /** Parent short shas (≤2) for DAG chrome. */
  p: string[];
  /** True when commit has no associated merged PR in the pin. */
  o: boolean;
};

function shortByShaMap(): Map<string, string> {
  return new Map(loadCommits().map((x) => [x.sha, x.short]));
}

export function buildHistoryPrIndex(): HistoryPrRow[] {
  return loadPrs().map((pr) => ({
    n: pr.number,
    t: pr.title,
    a: pr.author,
    m: pr.mergedAt,
    areas: prAreaChips(pr, 12),
    cs: pr.commitShas
      .map((sha) => getCommitBySha(sha))
      .filter((c): c is MakaCommit => Boolean(c))
      .map((c) => ({ s: c.short, sub: c.subject })),
  }));
}

export function buildHistoryCommitIndex(): {
  commits: HistoryCommitRow[];
  /** First-parent short shas, tip → root (newest first). */
  firstParent: string[];
} {
  const all = loadCommits();
  const shorts = shortByShaMap();
  const commits = all.map((c) => ({
    s: c.short,
    sub: c.subject,
    a: c.author.name,
    d: c.committer.date || c.author.date,
    areas: areaChips(c.pathPrefixes, 3),
    m: c.parents.length > 1,
    p: c.parents.slice(0, 2).map((sha) => shorts.get(sha) || sha.slice(0, 8)),
    o: c.prNumbers.length === 0,
  }));

  const bySha = new Map(all.map((c) => [c.sha, c]));
  const firstParent: string[] = [];
  const seen = new Set<string>();
  let sha: string | undefined = loadMeta().source.sourceSha;
  while (sha && bySha.has(sha) && !seen.has(sha)) {
    seen.add(sha);
    const c = bySha.get(sha)!;
    firstParent.push(c.short);
    sha = c.parents[0];
  }

  return { commits, firstParent };
}

export function listCommitAuthors(commits = loadCommits()): string[] {
  return [...new Set(commits.map((c) => c.author.name).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function listCommitAreas(commits = loadCommits()): string[] {
  const set = new Set<string>();
  for (const c of commits) {
    for (const p of c.pathPrefixes) set.add(p);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}
