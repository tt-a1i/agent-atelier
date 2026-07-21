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
 * History PR/commit detail pages pair zh `/history/pr|c/…` ↔ en `/en/history/pr|c/…`.
 */
export function alternateLocalePath(
  locale: Locale,
  pathname: string,
  search = "",
): string {
  let path = stripBase(pathname || "/");
  if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);

  if (locale === "zh") {
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
  chapterWipTag: string;
  chapterWipBody: string;
  statusWip: string;
  statusDone: string;
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
  draftLabel: string;
  doneLabel: string;
  tocDone: string;
  tocWip: string;
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
  chapterWipTag: "WIP · 章节草稿",
  chapterWipBody:
    "本页仍在对照验收清单推进。§ 导航只表示结构，不表示已完成；请勿当作结业章节。",
  statusWip: "Status · WIP（清单未过）",
  statusDone: "Status · 清单已过",
  specimen: "Specimen · maka-agent",
  layer: "Layer",
  historyTrack: "History track",
  thesisLabel: "Thesis",
  thesisTitle: "本章回答什么",
  outlineLabel: "Outline",
  outlineTitle: "本章骨架",
  outlineLede: "关键图、体量流、演进旁注与 Current / Target 边界的阅读索引。",
  outlineDefaults: [
    "机制主线：用标本讲清 Current 边界",
    "关键图：手写 SVG 开篇图",
    "体量图：≥3 幅流程 / 投影图",
    "演进旁注：稀疏链入 /history（PR-first）",
  ],
  pagerPrev: "上一章",
  pagerNext: "下一章",
  pagerBack: "返回",
  pagerGuide: "导读",
  pagerHistory: "History",
  evolutionAside: "演进旁注",
  draftLabel: "草稿 / Draft",
  doneLabel: "完成",
  tocDone: "完成",
  tocWip: "WIP",
};

const EN: Chrome = {
  brand: "Agent Atelier",
  skipToContent: "Skip to content",
  navGuide: "Guide",
  navHistory: "History",
  footer:
    "Agent Atelier · specimen: Maka · visual tokens adapted from NewsLiquid research reports",
  localeSwitchToZh: "中文",
  localeSwitchToEn: "EN",
  localeSwitchAria: "Switch language",
  chapterWipTag: "WIP · chapter draft",
  chapterWipBody:
    "This page is still advancing against the acceptance checklist. § nav is structure, not completion.",
  statusWip: "Status · WIP (checklist not met)",
  statusDone: "Status · checklist met",
  specimen: "Specimen · maka-agent",
  layer: "Layer",
  historyTrack: "History track",
  thesisLabel: "Thesis",
  thesisTitle: "What this chapter answers",
  outlineLabel: "Outline",
  outlineTitle: "Chapter spine",
  outlineLede: "Index of the keystone, volume flows, evolution aside, and Current / Target boundary.",
  outlineDefaults: [
    "Mechanism spine: teach Current boundaries via the specimen",
    "Keystone: hand SVG opener",
    "Volume diagrams: ≥3 flow/projection figures",
    "Evolution asides: sparse links into /history (PR-first)",
  ],
  pagerPrev: "Previous",
  pagerNext: "Next",
  pagerBack: "Back",
  pagerGuide: "Guide",
  pagerHistory: "History",
  evolutionAside: "Evolution aside",
  draftLabel: "Draft",
  doneLabel: "Complete",
  tocDone: "Done",
  tocWip: "WIP",
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
