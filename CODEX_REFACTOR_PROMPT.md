# Shipwright v6 升级提示词（投给 Codex）

> 给 Codex / Claude Code Agent 用的一次性提示词。目的：在不破坏现有功能、不换框架、不改配色的前提下，把下半部分从「卡片墙」升级成「Launch QA 验收台」的连续体验。

---

## 1. 项目上下文（必须先读懂）

- **线上**: https://shipwright.com.cn/
- **仓库**: https://github.com/aimonj0729-ai/shipwright
- **部署**: GitHub Pages，源目录 `site/`，推 `main` 自动触发 `.github/workflows/pages.yml`
- **技术栈**: 纯静态三件套（零依赖、零构建工具）
  - `site/index.html` (~1350 行) — 单页 DOM
  - `site/styles.css` (~7600 行) — 4 层视觉叠加 + v5 动效层
  - `site/app.js` (~4570 行) — 所有交互逻辑

## 2. 任务边界

**在 `site/` 三个既有文件里做就地升级，不允许重写或换框架。**

| 允许 | 不允许 |
|---|---|
| 现有 section 内增删 DOM | 删除/重写整个文件 |
| CSS 末尾追加新模块、修改既有规则 | 引入 React/Vue/Svelte/Astro |
| JS 末尾追加 `initXxx()` 函数 | 引入 Vite/Webpack/Tailwind 构建 |
| 新增 1 个 `site/styles-v6.css` 引入 index.html | 任何 npm 依赖 |
| 重排既有 section 的子模块结构 | 改 GitHub Pages 部署方式 |

## 3. 必须保留的功能（破坏 = 不算完成）

- 主题切换 `#themeToggle` + `data-theme` 体系（dark/light 双向可切）
- 语言切换 `#langToggle` + i18n 文案数据
- **Brand wizard** 完整流程 (`#brand-check`)：5 步问卷 + AI 流式生成报告 + Markdown 渲染
- **Launch console** 完整流程 (`#launch-console`)：Pre-flight → AI 一次性生成 Release Notes / Twitter / Reddit → GitHub PAT 推 draft release
- **Audit analyzer** (`#analyzer`)：Doctor 输入（GitHub/URL/README）+ AI "Explain with AI"
- 浮动 AI chat (`#aiChatFab`)
- BYOK 配置弹窗（右下齿轮：AI key / base URL / model）
- 现有 9+ 个 IntersectionObserver 入场动画

## 4. 必须保留的 v5 动效层（最近迭代成果）

- Hero `shipwright` 颗粒带（`#heroParticles` canvas，已是 grid 下方 ~80px 细带，60fps 弹簧物理 + 鼠标排斥）
- 自定义 cursor (`#swCursorRing` / `#swCursorDot` / `#swCursorTrail`) + 磁性 hover
- Inspection Radar 数据流粒子（径向流入 + 节点 ping）
- Launch ignition 火粒子（点击 INITIATE 时喷发）
- Brand-check printer head 动效（流式生成时跳动 LED）
- 彩蛋：长按 logo → ASCII 船航行；Konami code → Captain's Log 模式 8s
- `motionController` 全局调度器（visibilitychange / prefers-reduced-motion 全覆盖）

## 5. 必须保留的品牌

- **颜色一个也不许动**：背景、文字、按钮、边框、强调色全部不变；只允许微调 alpha / shadow / border / z-index
- 字体三件套：Epilogue（正文）/ Azeret Mono（代码、数据）/ Caveat（手写点缀）
- 既有 4 层视觉叠加层级（Mission Control 深控制台 / Apple frosted glass / Light cream / Handwritten）
- 语气：简洁、克制、审计验收感
- 不能动的文案：`"Before you ship the AI-built app, make it survive first contact."`、`"ship-ready, not slide-ready"`、`"no fake green checks"`、signal-strip 三个数据
- 不能动的核心定位：给 AI-built / vibe-coded 项目做 Launch QA 的工具

## 6. 已被否决的方向（不要走偏）

企业 SaaS 官网 / 大公司风 / AI Operating System / business stacks / 海洋造船厂 / 赛博朋克 / 游戏 UI / 艺术展海报 / 重渐变 / emoji 当主视觉 / stock photo / 泛科技渐变球 / 浮夸入场动画 / 3D 立方体 / 霓虹边框

## 7. 升级目标（按优先级，时间不够先做 P0）

### P0 — 4 个核心区，必做

| # | Section | 升级方向 |
|---|---|---|
| 1 | `#inspection-radar` | **本页最强记忆点**。保留 Intake / Browser / Install / Claims / Release 五个 waypoint。每个 waypoint 显示 risk / evidence required / patch signal。这是 "Shipwright 是什么" 的视觉答案 |
| 2 | `#analyzer` | 强化「真实验收台」结构。Report 按 Critical findings / Quick wins / Coverage / Metadata / Next patch 分块，状态面板感 |
| 3 | `#skills-catalog` | 从目录列表 → installable workflow grid，分 Discovery / Planning / QA / Launch / Meta 五组。保留 10 个 skill 名：`github-radar` `trend-to-product` `idea-to-prd` `prd-to-issues` `launch-readiness` `browser-launch-audit` `readme-install-audit` `agent-output-review` `github-release-checklist` `workflow-to-skill`。视觉像工具箱/检查套件 |
| 4 | `#workflow` | 改成「from agent claim to proof」证据链：Agent output review → Browser launch audit → README install audit → GitHub release checklist。每步显示输入 / 检查动作 / 输出 artifact |

### P1 — 应做

5. `#mission-control` "Choose the job" — 4 入口 → launch intake switchboard，每个附状态/输入类型/输出/适用场景
6. `#pain-grid` "The pain" — 3 点 → failure modes 检查清单，编号 + 风险等级 + 证据缺口 + 修复信号
7. `#brand-check` — 表单 → 轻量 diagnosis wizard（Project → Audience → Goal → Vibe → Feels），右侧 diagnosis preview。**JS 逻辑不动**
8. `#launch-console` — 强化 T-minus 仪式感，Pre-flight → Manifest → Release notes → X thread → Reddit → GitHub。**PAT/AI 调用逻辑不动**

### P2 — 可做

9. `#guide` — 三步 → "demo mode vs real audit mode" 对照
10. `#audience` — 改成 builder profiles（Vibe coders / Indie hackers / OSS maintainers / AI skill authors），每个配具体 launch risk + Shipwright 抓到什么
11. Final CTA — 改成 final launch gate（No fake green checks → Evidence required → Next patch → Ready to ship）

## 8. 视觉语言

| 用 | 不用 |
|---|---|
| 检查表 / 审计报告版式 | SaaS 三栏卡片墙 |
| 证据链 / 路线图 / 状态 LED | 五颜六色 |
| 编号 (01/02/03) / 风险标签 (P0/P1/P2) | emoji 主视觉 |
| 输出 artifact 列表 | stock photo |
| 单色细线 / 极简线框图标 | 科技渐变球 |
| 雷达 / 信号 / 月相视觉 | 3D 立方体 / 霓虹 |

## 9. 交互规范

- 克制 hover：颜色变化 + 最多 1–2px 位移
- 入场动画：复用既有 IntersectionObserver 模式
- 不做 scroll-driven 大动画（既有 v5 motion controller 已经够了）
- waypoint hover 高亮、active 状态切换、preview 状态变化
- 所有交互服务理解，不为炫技
- 移动端 ≤ 768px：检查路线变纵向 / skills grid 变分组列表 / 表单不拥挤

## 10. 输出与命名约定

- 改动只能落在 `site/index.html` / `site/styles.css` / `site/app.js`（必要时 `site/styles-v6.css`）
- 保留所有现有 CSS 选择器命名空间，不重命名 class
- 新增 CSS 模块加 `/* v6 — <section> */` 注释起头
- 新增 JS 函数用 `initV6Xxx()` 前缀 + 末尾追加 init 调用
- 新增 DOM 用 `data-v6` 或 `v6-` 前缀类名以便回滚定位
- 缓存破坏：把 `index.html` 里 `?v=20260516-v5f` 升到 `?v=20260520-v6`

## 11. 自检清单（收尾前每项都要能答 yes）

- [ ] 颜色体系一个色值也没改？
- [ ] BYOK 配置、Brand wizard、Launch console、Audit analyzer、AI chat 五个功能全部仍可用？
- [ ] 主题切换 + 语言切换仍工作？
- [ ] v5 颗粒带 + 自定义 cursor + Inspection Radar 数据流 + Launch sparks + Brand printer + 两个彩蛋全部没破坏？
- [ ] 没新增任何 npm / 构建工具 / 框架？
- [ ] 没新增任何 emoji 主视觉 / stock photo / 渐变球？
- [ ] 内容架构家长（用户）一眼能认得？
- [ ] 移动端 360–768px 没有横向滚动条？

## 12. 提交前必跑

```bash
node --check site/app.js
# 起本地 server，手动验证：主题切换、语言切换、Brand wizard 全流程、Launch console 全流程、Audit analyzer、AI chat
python3 -m http.server 4173 --directory site
# 命中 smoke 字符串（CI 也会跑这条）
curl -s http://127.0.0.1:4173/ | grep -q "Analyze launch risk"
```

DevTools Performance：滚动 FPS ≥ 55，idle CPU < 5%。

---

**最终效果验收口径**：刷新页面后用户应该感到——这不是普通 landing page，而是一台为 AI-built projects 准备的发布前验收仪器：严肃但不沉闷，锋利但不复杂，有作者感但仍然可用。
