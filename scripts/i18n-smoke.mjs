/**
 * Minimal check: locale path helpers + alternate mapping.
 * Run: node scripts/i18n-smoke.mjs
 */
import assert from "node:assert/strict";

// Mirror of src/lib/i18n alternate rules without astro:i18n (prefixDefaultLocale: false).
function localePath(locale, path = "") {
  const clean = path.replace(/^\/+/, "");
  if (locale === "zh") return clean ? `/${clean}` : "/";
  return clean ? `/en/${clean}` : "/en";
}

function alternateLocalePath(locale, pathname, search = "") {
  let path = pathname || "/";
  if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);

  if (locale === "zh") {
    if (/^\/history\/(pr|c)\//.test(path)) {
      return `${localePath("en", "history")}${search}`;
    }
    const bare = path === "/" ? "" : path.replace(/^\//, "");
    return `${localePath("en", bare)}${search}`;
  }

  if (path === "/en" || path.startsWith("/en/")) {
    path = path === "/en" ? "/" : path.slice(3) || "/";
  }
  const bare = path === "/" ? "" : path.replace(/^\//, "");
  return `${localePath("zh", bare)}${search}`;
}

assert.equal(localePath("zh", ""), "/");
assert.equal(localePath("en", ""), "/en");
assert.equal(localePath("zh", "chapters/01-log-is-the-runtime"), "/chapters/01-log-is-the-runtime");
assert.equal(
  localePath("en", "chapters/01-log-is-the-runtime"),
  "/en/chapters/01-log-is-the-runtime",
);
assert.equal(alternateLocalePath("zh", "/"), "/en");
assert.equal(alternateLocalePath("en", "/en"), "/");
assert.equal(
  alternateLocalePath("zh", "/chapters/02-evidence-before-compression"),
  "/en/chapters/02-evidence-before-compression",
);
assert.equal(alternateLocalePath("zh", "/history/pr/768"), "/en/history");
assert.equal(alternateLocalePath("zh", "/history?page=2".split("?")[0], "?page=2"), "/en/history?page=2");

console.log("i18n-smoke: ok");
