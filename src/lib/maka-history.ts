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
