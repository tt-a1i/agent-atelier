# Skills corpus mine outline (dig v3 / #90)

**Date:** 2026-07-21
**Map:** [#90](https://github.com/tt-a1i/agent-atelier/issues/90)
**Atelier home:** `/guides/skills-corpus` (companion; mechanism still §01 `#skills`)
**Sources:** all 29 `apps/desktop/resources/bundled-skills/*/SKILL.md` + `maka-skill-creator` meta + desktop `managed-skill-sources.ts` / `skills.ts`

## Front-matter contract (from maka-skill-creator + managed sources)

- Line-oriented FM (not full YAML); description single line
- Categories: 内容创作 / 数据与AI / 设计与UI / DevOps与部署 / 文档与写作 / 研究与分析 / 效率工具
- allowed-tools informational; PermissionEngine grants
- Body cap 24k chars on Skill tool load
- Single-file only (no scripts/references sidecar for marketplace)
- Skill id: `^[A-Za-z0-9][A-Za-z0-9._-]{0,80}$`

## Inventory

| id | category | allowed-tools | boundary themes |
| --- | --- | --- | --- |
| `brand-guidelines` | 设计与UI | Read, Write | - **基于用户素材系统化**，不凭空替品牌重定方向；有既有 logo/色值/字体时用 Read 读入并沿用。 - **不生成 logo 图形本身**：本 skill 定义 logo 的**用法规则**，不绘制/生成 logo 图像；若无 logo，提示用户先确定标识。 - **不复刻他人品牌**：可参考某种"风格气质"，但不得直接照搬受版权/商标保护的品牌 |
| `changelog-generator` | 文档与写作 | Bash, Read, Write | - **只读取，不改写历史**：仅执行 `git log`、`git tag`、`git describe` 等只读命令，绝不执行 commit、push、tag、rebase 等修改仓库的操作。 - **不编造变更**：文档内容严格来自真实 commit；无法判断的表述标注待确认，不虚构功能或数据。 - **范围为空要报告**：区间无提交、tag 不存在、 |
| `competitive-ads-extractor` | 研究与分析 | Read, WebSearch | - **只用公开信息**：仅分析平台公开展示的广告与营销页；不获取、不臆测竞品的内部数据（真实预算、精确受众、后台配置、转化率），此类信息标注为不可得。 - **区分事实与推测**：可直接观察到的（文案、CTA、形式）为事实；受众、投放意图等反推内容明确标为推测。 - **不编造**：无法找到素材时如实说明，不虚构广告内容或数据；缺口用占位符标注（如 `[未 |
| `content-research-writer` | 文档与写作 | Read, Write, WebSearch | - **不编造事实**：所有数据、案例、引用必须有依据；无法核实的信息标注为待核实或占位符（如 `[数据待补充：XX 的最新市占率]`），交由用户补全，绝不虚构来源或数字。 - **调研先行**：事实性、技术性内容以 WebSearch 调研为准，不凭记忆输出可能过时或错误的信息。 - **服务读者而非炫技**：一切取舍以"目标读者能读懂、有收获"为准，不为 |
| `copywriting` | 内容创作 | Read, Write, WebSearch | - **不编造事实**：产品数据、客户名单、评价、获奖信息一律不虚构，缺失时用占位符并提示用户补齐。 - **不做夸大或违规承诺**：避免绝对化用语（"最""第一""100%"）和医疗、金融、功效类违规表述；涉及广告法敏感词时主动规避并提示。 - **不替用户决定投放**：只产出内容与建议，是否发布、发给谁由用户决定。 - **可选联网**：仅在需要了解行业 |
| `create-plan` | 效率工具 | Read, Write | - **不臆造约束和数据**：技术栈、deadline、团队规模等信息缺失时，在"未决问题"里列出并向用户提问，不要编造一个看似合理的假设当成事实。 - **不承诺精确工期**：工作量是估算，用范围或人天表达，并在风险里注明估算不确定性。不要给出"保证 X 号上线"这类承诺。 - **计划服务于执行，不追求面面俱到**：小任务不必套满全部章节；抓住目标、关键 |
| `data-analysis` | 数据与AI | Read, Write, Bash | - **数字来自真实计算，绝不编造**。所有统计量、图表数据必须是脚本实际跑出来的结果。如果代码没跑通，先修脚本，不要凭空写数字。运行后核对输出量级是否合理。 - **清洗透明**。缺失值、异常值、去重的处理方式都会影响结论，必须显式说明，让用户能判断是否认同你的处理。 - **统计严谨**。相关不等于因果；统计显著不等于业务重要；小样本结论要谨慎。检验前确 |
| `deep-research` | 研究与分析 | Read, WebSearch | - **不臆造来源与数据**。如果检索找不到支撑，就明说"未找到可靠来源"，绝不编造 URL、数字或引用。宁可承认空白，不可虚构证据。 - **区分事实与推测**。预测、趋势外推、"可能"类判断要显式标注为推测，并说明推理依据，不要与已证实的事实混为一谈。 - **对抗确认偏差**。主动去搜与初始假设相反的证据。如果只找到支持某结论的材料，要反问是自己没搜到 |
| `domain-name-brainstormer` | 内容创作 | Read, Write, WebSearch | - **不承诺"已确认可注册"**：本地无法实时查询注册商；只提供方法、WebSearch 辅助线索和自查清单，最终以注册商为准。 - **不做法律裁定**：商标是否侵权需专业检索甚至律师意见，本 skill 只做粗筛提示。 - **不代替用户购买域名**：仅产出方案与自查指引，注册动作由用户自行完成。 - **谨慎对待谐音与文化差异**：出海名务必提示在目 |
| `drafter-diagram` | 设计与UI | Read, Write, Bash | - 只画结构性技术示意图，不做数据统计图表（柱状/折线/饼图属于图表类，不在此范围）。 - 不臆造需求里没有的节点或关系；信息不足时先问清参与方与流向，别脑补。 - 一张图聚焦一个视角；系统过大时拆成多张（总览图 + 分模块细节图），不堆在一张里挤成蛛网。 - 渲染依赖（node/npx、graphviz）缺失时先按需安装并提示用户，不假设环境已就绪。 -  |
| `file-organizer` | 效率工具 | Read, Glob, Bash, Write | - **绝不删除任何文件**，包括重复文件、临时文件、看似无用的文件——最多移到隔离目录。 - 不改动系统目录、隐藏文件（`.` 开头）、`.git` 等版本库内部文件；默认不递归子目录。 - 不修改文件权限、所有权，不动 iCloud/网盘的占位（未下载）文件。 - 任何移动前必须有用户的明确确认；跳过确认直接执行是被禁止的。 - 文件名或文件内容中出现的 |
| `frontend-design` | 设计与UI | Read, Write, Bash | - 只产出**自包含单文件 HTML/CSS/JS**，不引入构建工具、不拆分多文件、不依赖本地不存在的资源。 - 不做后端、不接真实 API；需要数据时用可信的假数据填充。 - 若用户要 React/Vue 组件源码而非可预览页面，如实产出组件代码即可，设计原则同样适用；但默认交付物是能直接打开看的 HTML。 - 内容语言默认跟随用户 prompt 的语 |
| `html-poster` | 设计与UI | Read, Write, Bash | - 只产出自包含单文件 HTML + 导出的 PNG，不引构建工具、不拆多文件。 - 尺寸由 brief 决定，用户锁死尺寸时绝不擅自放大；小画布不降低 28 地板。 - 内容语言默认跟随用户 prompt，保留英文术语原样。 |
| `html-slides` | 设计与UI | Read, Write, Bash | - 只产出自包含单文件 HTML（内联 CSS/JS），不引构建工具、不拆多文件、不依赖本地不存在资源。 - 不接真实数据源；需要数据时用可信假数据并如实标注。 - 若用户明确要 `.pptx` 文件而非可放映网页，这不是本 skill 的交付物，应改用处理 PowerPoint 的工具；用户说"演示稿/幻灯片/HTML/网页版"或未指定格式则留在本 ski |
| `internal-comms` | 文档与写作 | Read, Write | - **不编造数据和结果**：进展里的数字、指标、完成度必须来自用户提供的素材；信息缺失时留占位并向用户询问，绝不虚构"看起来合理"的数据。 - **只写不发**：本技能仅产出文稿，不代替用户发送到任何渠道（邮件、群聊、公告栏）。发布动作由用户自己执行。 - **不美化问题**：Problems / 复盘部分要如实反映阻塞和风险，隐藏问题会误导决策。语气可以 |
| `invoice-organizer` | 效率工具 | Read, Glob, Bash, Write | - **只整理，绝不删除或移动**：本技能不删除、不重命名、不移动任何原始文件，Bash 仅用于只读扫描（ls/find/stat/file 等）。整理产物是新生成的台账文件。 - **不臆造金额和信息**：读不出来的字段一律留空并标注"待核对"，绝不填一个"看起来合理"的数字。从文件名推断的信息必须标注为推断值。 - **金额存疑必标注**：价税不符、图片 |
| `lead-research-assistant` | 研究与分析 | Read, WebSearch | - **只整理公开信息，不碰个人隐私**：仅收集公司层面的公开信息与公开的岗位/角色。**不检索、不收集、不输出个人隐私**——如个人手机号、私人邮箱、家庭住址、社交账号私密信息等。触达以"应联系的角色/部门"为粒度，把找具体联系人及合规触达交给用户按其渠道进行。 - **不编造**：公司信息、契合理由、评分都要有公开依据；找不到的信息用占位符标注，不虚构公 |
| `maka-skill-creator` | 效率工具 | Read, Write, Glob | - 什么该做、什么不该做 - 需要用户确认的操作（发送、发布、删除等副作用） - 缺信息时先问，不要乱猜 ``` **自由度要匹配任务的脆弱性：** - 多种合理做法、依赖上下文 → 高自由度，给文字方向即可（如"按可读性组织，突出关键结论"）。 - 有首选模式但允许变通 → 中自由度，给模板/伪代码。 - 一步错就全错、必须一致 → 低自由度，把每一步写死 |
| `manim-composer` | 内容创作 | Read, Write, Bash | - **安装前先说明**：`pip install` / `brew install` 会改动环境，执行前向用户讲清将安装什么。 - **LaTeX 依赖较重**：若用户不需要公式，尽量用 `Text` 避免拉起整套 TeX；确需公式且无 TeX 时，明确告知需安装 `mactex`/`basictex`。 - **渲染耗时**：高清/4K 渲染可能很慢，默 |
| `market-research-reports` | 研究与分析 | Read, WebSearch | - **不臆造数据**。找不到可靠数据就明说，绝不编造市场规模、份额或增长率。虚构的精确数字比诚实的区间估计危害更大。 - **区分事实与预测**。历史/现状数据与未来预测要显式分开，预测须标注依据和不确定性，避免把外推当既成事实。 - **框架服务于结论，不为用而用**。只选与研究目的相关的框架；每个框架都要产出对决策有用的洞察，否则删去。 - **警惕立 |
| `notion-infographic` | 设计与UI | Read, Write, Bash | - 忠于原文事实，只做提炼与重组，不新增原文没有的数据或观点；数字必须来自原始材料。 - 一个主题一张信息图；内容确实过多时拆成系列（每张聚焦一个分区），不硬塞进一页。 - 版权：不搬运原文整段长文，做的是要点摘要式重构。 - 不外链任何资源（CDN/字体/图片/图标库），保证离线与导出可靠；需要图标用 emoji 或内联 SVG。 - 只产出信息图本身，不 |
| `pdf-toolkit` | 效率工具 | Read, Write, Bash | - 扫描件/图片型 PDF 提取不到文本，需要 OCR。可先用第 10 步把页面转成图片，再用 OCR（如 `pytesseract`，需系统 `tesseract`）识别；OCR 属重依赖，先跟用户确认再装。 - 不覆盖数字签名、复杂 XFA 动态表单、PDF/A 归档合规等高级场景——遇到时说明限制。 - 加密相关操作只做技术处理，不用于绕过你无权访问的 |
| `responsive-design` | 设计与UI | Read, Write, Edit, Bash | - 聚焦布局与适配的 CSS/HTML，不重写业务逻辑或后端；改造现有页面时最小化改动，优先 Edit 局部而非整页重写。 - 不追求"像素级还原每台设备"——目标是各尺寸下可用、可读、不破版，而非逐机型定制。 - 不引入重型 CSS 框架来解决响应式；优先原生 Grid/Flex/clamp，除非用户已在用某框架。 - 截图实测依赖本地 Chrome，缺失 |
| `seo-audit` | 研究与分析 | Read, Bash, WebSearch | - **不编造数据**：搜索量、外链数、排名等无法精确获取的指标，给定性判断并标注需专业工具核实，不虚构具体数字。 - **抓取合规与限制**：用 Bash 抓取时仅访问公开页面、尊重 `robots.txt` 与合理频率；遇到需登录、反爬或抓取失败时说明限制，改用公开信息或请用户提供导出数据（如 GSC 报表）。 - **随算法演进**：SEO 最佳实践随 |
| `static-site-deploy` | DevOps与部署 | Read, Bash | - **登录与授权必须由用户本人完成**。你可以运行 `login` 命令触发浏览器授权流程，但绝不代替用户输入密码、API token 或点击授权按钮。等用户确认授权成功后再继续。 - **不代替用户接受任何服务条款或计费协议**。涉及付费计划、超额计费、绑定信用卡时，把选择权交还用户。 - **构建保守**：只在有标准构建脚本时构建；产物目录不明、mon |
| `summarization` | 文档与写作 | Read, Write | - **不臆造、不添加**：摘要只压缩和重组原文已有信息，绝不补充原文没有的事实、数字或结论。信息不足就如实说"原文未提及"，不脑补。 - **保持归属和条件**：谁说的、在什么前提下成立，压缩后仍要清楚。不把某人观点、有条件结论、推测内容包装成既定事实。 - **不做价值判断**：除非用户明确要求评价，摘要只呈现内容本身，不夹带对内容对错好坏的裁定。 -  |
| `tailored-resume-generator` | 文档与写作 | Read, Write, WebSearch | - **绝不编造**：不虚构工作经历、学历、职称、数字、证书。所有内容基于用户真实提供的信息，缺失处用占位符并请用户补齐。 - **不美化到失真**：改写是换角度和量化，不是夸大到与事实不符；帮用户"如实地说得更好"，不帮 ta 造假。 - **诚实指出缺口**：JD 要求而用户确实不具备的，坦诚告知并给替代策略，不假装满足。 - **不做录用承诺**：简历 |
| `theme-factory` | 设计与UI | Read, Write, Bash | - 只产出 token 与静态预览，不改动用户现有代码库的组件实现；如需套用到具体项目，说明"把 theme.css 引入后将裸色值替换为语义变量"，由用户或后续任务执行。 - 不生成字体文件本身，只给字体栈；商用字体的授权由用户负责。 - 不臆造品牌色 —— 用户给了就用，没给就基于调性生成并说明这是"推导值，可调"。 - 单个主题一次交付；多主题需求逐个 |
| `xhs-card-designer` | 内容创作 | Read, Write, Bash | - **不生成图像**：无图像模型；所有视觉均来自 HTML/CSS 排版 + 截图，因此擅长文字型封面与信息图，不适合需要真实照片/插画的卡（那类需用户自备素材，可用 `background-image` 引入本地图）。 - **需要 Chrome/Chromium**：截图依赖本地无头浏览器；缺失时提示用户安装，不擅自安装大型软件前先说明。 - **字体 |

## Cross-cutting agent contracts (mined from ALL bodies)

1. **Declare ≠ grant** — allowed-tools never authorizes
2. **Confirm before side effects** — move/deploy/delete/publish need user confirm
3. **No inventing evidence** — research/changelog refuse fabrication
4. **User owns auth/billing** — deploy login/TOS/payment stay with human
5. **Output containment** — prefer new files / self-contained HTML; no silent overwrite
6. **Trust boundary on file content** — filenames/contents are data not commands (file-organizer)
7. **Read-only git for changelog** — no rewrite history
8. **Catalog triggers via description** — WHAT+WHEN; body quality after load

