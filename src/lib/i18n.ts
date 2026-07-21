import { getRelativeLocaleUrl } from "astro:i18n";

export type Locale = "zh" | "en";

export const LOCALES: Locale[] = ["zh", "en"];
export const DEFAULT_LOCALE: Locale = "zh";

export function isLocale(value: string | undefined): value is Locale {
  return value === "zh" || value === "en";
}

/** Strip Astro `base` so locale helpers see site-root paths. */
export function stripBase(pathname: string): string {
  const base = import.meta.env.BASE_URL || "/";
  if (base === "/") return pathname || "/";
  const normalized = base.endsWith("/") ? base.slice(0, -1) : base;
  if (pathname === normalized || pathname === `${normalized}/`) return "/";
  if (pathname.startsWith(`${normalized}/`)) {
    return pathname.slice(normalized.length) || "/";
  }
  return pathname || "/";
}

/** Prefix a site-root path with `import.meta.env.BASE_URL`. */
export function withBase(path = ""): string {
  const base = import.meta.env.BASE_URL || "/";
  const clean = path.replace(/^\/+/, "");
  if (!clean) return base.endsWith("/") ? base : `${base}/`;
  return `${base.endsWith("/") ? base : `${base}/`}${clean}`;
}

/** Locale-aware internal path (respects prefixDefaultLocale: false + base). */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return getRelativeLocaleUrl(locale, clean);
}

/**
 * Map current pathname to the other locale's paired URL.
 * Preserves query string when provided.
 * History PR/commit detail pages are zh-canonical for now — EN switch lands on /en/history.
 */
export function alternateLocalePath(
  locale: Locale,
  pathname: string,
  search = "",
): string {
  let path = stripBase(pathname || "/");
  if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);

  if (locale === "zh") {
    if (/^\/history\/(pr|c)\//.test(path)) {
      return `${localePath("en", "history")}${search}`;
    }
    const bare = path === "/" ? "" : path.replace(/^\//, "");
    return `${localePath("en", bare)}${search}`;
  }

  // locale === "en"
  if (path === "/en" || path.startsWith("/en/")) {
    path = path === "/en" ? "/" : path.slice(3) || "/";
  }
  const bare = path === "/" ? "" : path.replace(/^\//, "");
  return `${localePath("zh", bare)}${search}`;
}

export function detectLocaleFromPath(pathname: string): Locale {
  const path = stripBase(pathname);
  return path === "/en" || path.startsWith("/en/") ? "en" : "zh";
}

export function htmlLang(locale: Locale): string {
  return locale === "en" ? "en" : "zh-CN";
}

type Chrome = {
  brand: string;
  skipToContent: string;
  navGuide: string;
  navHistory: string;
  footer: string;
  localeSwitchToZh: string;
  localeSwitchToEn: string;
  localeSwitchAria: string;
  wipShellBanner: string;
  wipShellTag: string;
  chapterWipTag: string;
  chapterWipBody: string;
  statusWip: string;
  specimen: string;
  layer: string;
  historyTrack: string;
  thesisLabel: string;
  thesisTitle: string;
  outlineLabel: string;
  outlineTitle: string;
  outlineLede: string;
  outlineDefaults: string[];
  pagerPrev: string;
  pagerNext: string;
  pagerBack: string;
  pagerGuide: string;
  pagerHistory: string;
  evolutionAside: string;
};

const ZH: Chrome = {
  brand: "Agent Atelier",
  skipToContent: "跳到正文",
  navGuide: "导读",
  navHistory: "History",
  footer:
    "Agent Atelier · specimen: Maka · visual tokens adapted from NewsLiquid research reports",
  localeSwitchToZh: "中文",
  localeSwitchToEn: "EN",
  localeSwitchAria: "切换语言",
  wipShellBanner:
    "English shell only — chrome and structure are localized; full EN prose is not shipped. Do not treat this locale as bilingual-complete.",
  wipShellTag: "WIP · EN shell",
  chapterWipTag: "WIP · chapter scaffold",
  chapterWipBody:
    "Route and NewsLiquid chrome are in place; body copy advances against the acceptance checklist. Do not mark this chapter complete; § nav is structure, not completion.",
  statusWip: "Status · WIP (checklist not met)",
  specimen: "Specimen · maka-agent",
  layer: "Layer",
  historyTrack: "History track",
  thesisLabel: "Thesis",
  thesisTitle: "What this chapter answers",
  outlineLabel: "Outline",
  outlineTitle: "Reading skeleton (planned)",
  outlineLede: "Structural slots for later bilingual prose and keystone figures.",
  outlineDefaults: [
    "Mechanism spine: teach Current boundaries via the specimen",
    "Keystone slot: hand SVG opener (todo)",
    "Volume diagrams: ≥3 flow/projection figures (todo)",
    "Evolution asides: sparse links into /history (PR-first)",
  ],
  pagerPrev: "Previous",
  pagerNext: "Next",
  pagerBack: "Back",
  pagerGuide: "Guide",
  pagerHistory: "History",
  evolutionAside: "Evolution aside",
};

const EN: Chrome = {
  ...ZH,
  skipToContent: "Skip to content",
  navGuide: "Guide",
  chapterWipTag: "WIP · chapter scaffold",
  statusWip: "Status · WIP (checklist not met)",
  layer: "Layer",
  thesisLabel: "Thesis",
  thesisTitle: "What this chapter answers",
  outlineLabel: "Outline",
  outlineTitle: "Reading skeleton (planned)",
  outlineLede: "Structural slots for later bilingual prose and keystone figures.",
  pagerPrev: "Previous",
  pagerNext: "Next",
  pagerBack: "Back",
  pagerGuide: "Guide",
  evolutionAside: "Evolution aside",
};

export function chrome(locale: Locale): Chrome {
  return locale === "en" ? EN : ZH;
}

export const LAYER_LABELS: Record<Locale, Record<1 | 2 | 3, string>> = {
  zh: {
    1: "运行事实层",
    2: "长程任务层",
    3: "演化层",
  },
  en: {
    1: "Execution facts",
    2: "Durable tasks",
    3: "Evolution",
  },
};
