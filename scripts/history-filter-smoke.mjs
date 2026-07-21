/**
 * Minimal check for PR filter helpers (mirrors src/lib/maka-history.ts logic).
 * Run: node scripts/history-filter-smoke.mjs
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "data", "maka-history");
const prs = readFileSync(join(dir, "prs.ndjson"), "utf8")
  .trim()
  .split("\n")
  .map((l) => JSON.parse(l));
const commits = readFileSync(join(dir, "commits.ndjson"), "utf8")
  .trim()
  .split("\n")
  .map((l) => JSON.parse(l));
const bySha = new Map(commits.map((c) => [c.sha, c]));

function prAreas(pr) {
  const set = new Set();
  for (const sha of pr.commitShas) {
    const c = bySha.get(sha);
    if (!c) continue;
    for (const p of c.pathPrefixes) set.add(p);
  }
  return [...set];
}

function filterPrs(list, { area, author, range, q }) {
  const start =
    range === "30d"
      ? Date.now() - 30 * 864e5
      : range === "90d"
        ? Date.now() - 90 * 864e5
        : range === "year"
          ? Date.now() - 365 * 864e5
          : null;
  const qq = (q || "").toLowerCase();
  return list.filter((pr) => {
    if (author && pr.author !== author) return false;
    if (area && !prAreas(pr).includes(area)) return false;
    if (start != null && Date.parse(pr.mergedAt) < start) return false;
    if (qq && !`${pr.title} #${pr.number}`.toLowerCase().includes(qq)) return false;
    return true;
  });
}

const byAuthor = filterPrs(prs, { author: prs[0].author });
assert.ok(byAuthor.length >= 1);
assert.ok(byAuthor.every((p) => p.author === prs[0].author));

const docs = filterPrs(prs, { q: "architecture chapter" });
assert.ok(docs.some((p) => p.number === 768));

const runtimeArea = filterPrs(prs, { area: "packages/runtime" });
assert.ok(runtimeArea.length > 0);

console.log("history-filter-smoke: ok", {
  total: prs.length,
  byAuthor: byAuthor.length,
  docs: docs.length,
  runtimeArea: runtimeArea.length,
});
