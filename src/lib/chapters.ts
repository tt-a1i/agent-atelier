/** Cognitive-track chapter IA — 1:1 with Maka ARCHITECTURE six chapters. */

export type ChapterId = "01" | "02" | "03" | "04" | "05" | "06";

export interface ChapterMeta {
  id: ChapterId;
  n: number;
  slug: string;
  href: string;
  /** English ARCHITECTURE title (stable slug source). */
  titleEn: string;
  /** Chinese companion title for mastheads / TOC. */
  titleZh: string;
  /** Core question from Maka six-chapter index. */
  questionZh: string;
  questionEn: string;
  /** Short lede for stubs / TOC. */
  ledeZh: string;
  layer: 1 | 2 | 3;
  status: "wip";
}

export const LAYER_LABELS_ZH: Record<1 | 2 | 3, string> = {
  1: "运行事实层",
  2: "长程任务层",
  3: "演化层",
};

export const CHAPTERS: ChapterMeta[] = [
  {
    id: "01",
    n: 1,
    slug: "01-log-is-the-runtime",
    href: "/chapters/01-log-is-the-runtime",
    titleEn: "Log Is the Runtime",
    titleZh: "日志即 Runtime",
    questionZh: "Maka 如何保存并回放一次 Agent Run 的状态空间？",
    questionEn: "How does Maka preserve and replay the state space of an Agent Run?",
    ledeZh: "运行事实进入 append-only log；Session 与上下文都是投影，不是第二套真相。",
    layer: 1,
    status: "wip",
  },
  {
    id: "02",
    n: 2,
    slug: "02-evidence-before-compression",
    href: "/chapters/02-evidence-before-compression",
    titleEn: "Evidence Before Compression",
    titleZh: "压缩前先留证据",
    questionZh: "巨大的 Tool Result 如何留下 Turn 级证据，又不拖垮当前上下文？",
    questionEn:
      "How can a large Tool Result leave Turn-level evidence without exhausting active context?",
    ledeZh: "Prune the context, never prune the evidence——活跃上下文可裁，证据不可删。",
    layer: 1,
    status: "wip",
  },
  {
    id: "03",
    n: 3,
    slug: "03-compaction-is-a-projection",
    href: "/chapters/03-compaction-is-a-projection",
    titleEn: "Compaction Is a Projection",
    titleZh: "压缩是一种投影",
    questionZh: "LLM 如何忘记旧上下文，同时不丢失历史事实？",
    questionEn: "How can the LLM forget old context without losing historical facts?",
    ledeZh: "Compaction 改写的是模型下一轮看见的投影，不是 Event Log 里的事实。",
    layer: 1,
    status: "wip",
  },
  {
    id: "04",
    n: 4,
    slug: "04-the-durable-task-loop",
    href: "/chapters/04-the-durable-task-loop",
    titleEn: "The Durable Task Loop",
    titleZh: "可持久的任务循环",
    questionZh: "一个任务长于 Turn、Run 和进程时，Maka 如何持续推进？",
    questionEn: "How does Maka continue a task that outlives a Turn, Run, or process?",
    ledeZh: "Headless 用独立 Task identity 与 Task Event Log，把进度跨 Attempt 接住。",
    layer: 2,
    status: "wip",
  },
  {
    id: "05",
    n: 5,
    slug: "05-self-check-is-not-self-trust",
    href: "/chapters/05-self-check-is-not-self-trust",
    titleEn: "Self-Check Is Not Self-Trust",
    titleZh: "Self-check 不是自我信任",
    questionZh: "Agent 如何检查和修复自己的工作，而不把自述变成 authority？",
    questionEn:
      "How can an Agent inspect and repair its work without turning self-report into authority?",
    ledeZh: "Self-check 是任务循环内的受限反馈；最终事实权威仍在日志与投影边界上。",
    layer: 2,
    status: "wip",
  },
  {
    id: "06",
    n: 6,
    slug: "06-self-iteration-happens-outside-the-runtime",
    href: "/chapters/06-self-iteration-happens-outside-the-runtime",
    titleEn: "Self-Iteration Happens Outside the Runtime",
    titleZh: "自迭代发生在 Runtime 之外",
    questionZh: "Maka 如何把运行经验变成可证伪、可回滚的系统改进？",
    questionEn:
      "How does Maka turn run experience into falsifiable and reversible system improvement?",
    ledeZh: "AHE 在交互 Runtime 外组织演化证据；改进走受限 change surface 与可回滚谱系。",
    layer: 3,
    status: "wip",
  },
];

export function getChapter(id: ChapterId): ChapterMeta {
  const chapter = CHAPTERS.find((c) => c.id === id);
  if (!chapter) throw new Error(`Unknown chapter: ${id}`);
  return chapter;
}

export function getChapterBySlug(slug: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function adjacentChapters(id: ChapterId): {
  prev: ChapterMeta | null;
  next: ChapterMeta | null;
} {
  const i = CHAPTERS.findIndex((c) => c.id === id);
  return {
    prev: i > 0 ? CHAPTERS[i - 1]! : null,
    next: i >= 0 && i < CHAPTERS.length - 1 ? CHAPTERS[i + 1]! : null,
  };
}

/** Sticky § nav items shared by ReportLayout (compact labels). */
export function chapterNavItems(_activeId?: ChapterId): { href: string; label: string }[] {
  return [
    { href: "/", label: "导读" },
    ...CHAPTERS.map((c) => ({
      href: c.href,
      label: `§${c.id}`,
    })),
    { href: "/history", label: "History" },
  ];
}

export const ARCHITECTURE_SENTENCE_ZH =
  "Maka 是一个 log-first、projection-driven 的 Agent Runtime：运行事实进入 append-only log；Session、模型上下文、TaskRun、Self-check 和演化证据都是这些事实面向不同消费者的投影。";

export const LAYERS_ZH = [
  {
    n: 1 as const,
    title: "运行事实层",
    body: "一次 Agent Run 产生模型消息、Tool Call、Tool Result、权限与终止事实。Runtime Event Log 是交互语义的 canonical source。裁剪与 Compaction 可以改变模型下一轮看见什么，但不能反向改写已经发生的事实。",
    chapters: ["01", "02", "03"] as ChapterId[],
  },
  {
    n: 2 as const,
    title: "长程任务层",
    body: "当任务长于一次 Turn 或一个进程时，Headless 通过独立 Task identity、Task Event Log 与 TaskRun projection 保存跨 Attempt 进度。Self-check 提供受限反馈，但不拥有最终事实 authority。",
    chapters: ["04", "05"] as ChapterId[],
  },
  {
    n: 3 as const,
    title: "演化层",
    body: "AHE 把多次 TaskRun 的结果与 trace 组织成带 target identity 的演化证据。它位于交互 Runtime 外部，通过受限 change surface、可证伪 manifest、candidate evaluation 与 rollback lineage 推进系统改进。",
    chapters: ["06"] as ChapterId[],
  },
];
