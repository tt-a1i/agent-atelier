# Agent Atelier

用 **Maka** 作教学标本，把 Agent 讲清楚的学习站：研究报告式排版、大量图表与动画（逐步补齐），按**里程碑**演进，而不是把每一次 git commit 摊成目录。

## 为什么选 Astro

- **内容优先**：长文 / MDX 写起来轻，适合「报告体」学习页。
- **按需交互**：静态为主；图表与动画可用 islands（例如 React）局部挂载，不先上整站 SPA。
- **低仪式**：无 auth、无 DB、无 CMS；`npm` + Vite 构建，发布成本低。

> 脚手架来自当前 `create-astro`（Astro 7 + `@astrojs/mdx`）。能力面与当初选型的 Astro 5 一致：MDX 长文 + TypeScript + Vite。

## 本地运行

```sh
npm install
npm run dev
```

浏览器打开终端提示的地址（默认 `http://localhost:4321`）。

```sh
npm run build    # 产出到 dist/
npm run preview  # 预览生产构建
```

## 设计 token

视觉对齐 [NewsLiquid 研究报告](https://watcher.newsliquid.com/reports/ANTHROPIC_deep_research_2026-07-11.html) 的纸质报告感：奶油底、衬线标题、无衬线正文、等宽 § 编号与标签。全局变量见 `src/styles/global.css`：

```css
:root {
  --bg: #fbfaf7;
  --ink: #1a1a1a;
  --accent: #0e6e6e;
  --hair: #e7e3da;
  --mute: #6b6459;
  --bull: #1f9d55;
  --bear: #d6453d;
  --soft: #f4f1ea;
  --softer: #f8f6f1;
  --serif: "Source Serif 4", "Noto Serif SC", Georgia, serif;
  --sans: "Inter", "Noto Sans SC", system-ui, -apple-system, "Segoe UI", sans-serif;
  --mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

字体经由 Google Fonts 加载：Inter、Noto Sans SC、Noto Serif SC、Source Serif 4、JetBrains Mono。

## 内容原则

- **标本**：Maka（`maka-agent`），本站是独立产品，不并入其 monorepo 发版节奏。
- **目录**：按改变认知的里程碑组织（例如 Tool loop → Log-first → Compaction）。
- **不做**：把仓库每一笔 commit 当成 TOC；也不先做 CMS / 账号体系。

## 目录速览

```text
src/
  styles/global.css      # NewsLiquid tokens + report chrome
  layouts/ReportLayout.astro
  components/Section.astro
  pages/index.astro      # 首页报告（§00–§03）
  content/sample-note.mdx
```
