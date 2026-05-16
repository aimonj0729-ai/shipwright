const storedTheme = localStorage.getItem("shipwright-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
document.documentElement.setAttribute("data-theme", initialTheme);

document.querySelector("#themeToggle")?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("shipwright-theme", next);
});

/* ── Language toggle (English / Simplified Chinese) ── */

const LANGUAGE_STORAGE_KEY = "shipwright-lang";

const normalizeCopy = (value = "") => String(value).replace(/\s+/g, " ").trim();

const ZH_TEXT = {
  "Skip to analyzer": "跳到审查区",
  "Audit": "审查",
  "Planner": "规划器",
  "Guide": "指南",
  "Who": "适合谁",
  "Workflow": "工作流",
  "Launch QA for": "上线前检查",
  "projects": "项目",
  "ship-ready, not slide-ready": "先检查，再上线",
  "Paste a GitHub repo or demo URL. Shipwright generates a launch-readiness report in seconds — browser health, README friction, fake-complete features, and the next fixes that matter.": "粘贴仓库或演示地址，马上看到上线前该修什么。",
  "Analyze": "开始检查",
  "Try a sample:": "试试示例：",
  "Web app": "网页应用",
  "Skill pack": "技能包",
  "MCP server": "MCP 服务",
  "CLI tool": "CLI 工具",
  "Read the guide": "阅读指南",
  "View on GitHub": "查看 GitHub",
  "reusable skills": "可复用技能",
  "first report target": "首份报告",
  "fake green checks": "不做假通过",
  "Inspection 042": "检查 042",
  "Almost ready": "基本就绪",
  "CTA works, but no error state.": "CTA 能点，但无错误态。",
  "README omits required env keys.": "README 漏了环境变量。",
  "Mobile nav clips below 390px.": "小屏导航会裁切。",
  "SHIP READY": "准备上线",
  "no fake green checks": "不做假通过",
  "written for indie builders": "为独立开发者而写",
  "10 SKILLS · 4 INPUT MODES": "10 技能 · 4 入口",
  "browser, README, repo, idea": "浏览器 · README · 仓库 · 想法",
  "paste & analyze": "粘贴并分析",
  "Plan": "规划",
  "Skills": "技能",
  "Choose the job": "选择任务",
  "Four doors. One clean launch path.": "四个入口，完成上线检查。",
  "Shipwright is no longer just a pretty audit page. Pick the work you need now: shape an idea, inspect a project, install reusable skills, or run the full agent workflow.": "按任务进入：整理想法、检查项目、安装技能，或跑完整 Agent 流程。",
  "Plan from a rough idea": "把想法整理成方案",
  "Let the AI Planner ask follow-up questions and turn a vague website concept into a buildable plan.": "AI Planner 会继续追问，把模糊想法整理成可执行方案。",
  "Start with an idea": "从想法开始",
  "Audit a repo or demo": "审查仓库或演示站",
  "Paste a GitHub URL or live demo and get a launch-readiness report with the next patch.": "粘贴仓库或演示站，拿到上线体检和下一步修复。",
  "Run launch QA": "开始检查",
  "Install the workflow": "安装工作流",
  "Use the open-source skills inside Codex or Claude Code for evidence-backed local checks.": "在 Codex / Claude Code 里跑本地证据检查。",
  "Browse skills": "浏览技能",
  "Ship with a sequence": "按步骤发布",
  "Move from agent claims to browser proof, install proof, release copy, and public launch.": "把 Agent 的“已完成”，变成浏览器、安装和发布证据。",
  "See workflow": "查看流程",
  "The pain": "常见问题",
  "AI agents are great at producing finished-looking work.": "AI 很会做“像完成了”的东西。",
  "The README lies by omission.": "README 常常漏掉关键一步。",
  "It says \"npm install\" but forgets env vars, version constraints, and what success looks like.": "写了 npm install，却没说环境变量、版本和成功样子。",
  "The browser was never opened.": "浏览器也许根本没被打开。",
  "Console errors, broken routes, missing assets, and mobile overflow hide behind a clean diff.": "控制台、坏路由、缺资源和小屏溢出，都能躲在干净 diff 后面。",
  "The launch page has no sharp promise.": "发布页说不清价值。",
  "Strangers need a quickstart, proof, limitations, and GitHub metadata before they trust it.": "陌生人只看快速开始、证据、限制和 GitHub 信息。",
  "Try it now": "现在试用",
  "Generate a launch QA report.": "生成上线检查报告。",
  "live data, not a demo": "真实数据，不只是演示",
  "Paste any GitHub repo URL or owner/repo. Doctor calls the GitHub public API directly from your browser, analyzes the README, and produces a fix plan you can paste into Claude Code or Codex. Nothing is sent to any server.": "粘贴 GitHub 仓库。Doctor 会读取公开信息和 README，生成修复计划。",
  "Repository or demo URL": "仓库 / 演示地址",
  "Enter a GitHub repo URL, owner/repo, or http(s) demo URL.": "请输入仓库、owner/repo 或演示网址。",
  "Project type": "项目类型",
  "Web app / landing page": "网页应用 / 落地页",
  "CLI / developer tool": "CLI / 开发者工具",
  "Template repo": "模板仓库",
  "Launch channel": "发布渠道",
  "Analyze launch risk": "检查上线风险",
  "Detecting mode…": "正在检测模式…",
  "Enhanced mode · backend reachable": "增强模式 · 后端可访问",
  "Browser-only mode · backend unreachable": "浏览器模式 · 后端不可访问",
  "Enhanced mode runs richer GitHub checks via the Doctor backend (CI/CD, SECURITY, package.json, URL probe). If the backend is unreachable from your network it falls back to in-browser checks automatically.": "增强模式检查 CI、安全、package 和 URL；网络不通时自动回退。",
  "Paste a repo URL and click": "粘贴仓库 URL 并点击",
  "to generate your launch QA report.": "生成你的上线检查报告。",
  "Launch verdict": "检查结果",
  "Critical findings": "关键问题",
  "Quick wins": "快速修复",
  "Audit coverage": "审查覆盖",
  "Launch metadata": "发布元数据",
  "Next patch": "下一步修复",
  "Copy report": "复制报告",
  "Download .md": "下载 .md",
  "What does Shipwright actually check?": "Shipwright 实际检查什么？",
  "Agent output review": "Agent 输出审查",
  "Hallucinated feature claims": "幻觉式功能声明",
  "Fake buttons and dead links": "假按钮和死链接",
  "TODO / FIXME / placeholder strings": "TODO / FIXME / 占位文本",
  "Unverified integration references": "未验证的集成引用",
  "Browser launch audit": "浏览器上线审查",
  "Console errors and warnings": "控制台错误和警告",
  "Network 4xx/5xx failures": "网络 4xx/5xx 失败",
  "Interactive element functionality": "交互元素可用性",
  "Mobile layout at 390px and 768px": "390px 和 768px 移动布局",
  "README install audit": "README 安装审查",
  "Missing env vars or API keys": "缺少环境变量或 API Key",
  "Version constraint gaps": "版本约束缺口",
  "Expected output not shown": "未展示预期输出",
  "First-run path ambiguity": "首次运行路径不清晰",
  "GitHub release checklist": "GitHub 发布清单",
  "Repo topics and description": "仓库 topics 和描述",
  "Release notes completeness": "发布说明完整度",
  "Launch post copy quality": "上线帖子文案质量",
  "Contributor-facing next issues": "面向贡献者的后续 issue",
  "Beyond the code check": "不止检查代码",
  "Does your site match what you actually want?": "网站是否符合你的目标？",
  "answer 5 things, get a brand-fit report": "答 5 个问题，生成品牌诊断",
  "The Audit on the left tells you whether the code ships. This wizard tells you whether the vibe, content, and audience match what you're really building. Uses your AI Planner key — runs in your browser.": "Audit 看项目能否上线；这里看风格、内容和受众是否匹配。",
  "Wizard progress": "向导进度",
  "Project": "项目",
  "Audience": "受众",
  "Goal": "目标",
  "Vibe": "风格",
  "Feels": "感受",
  "What are you building?": "你要做什么？",
  "Your live URL or repo (optional, but recommended)": "线上 URL / 仓库（推荐）",
  "Landing page": "落地页",
  "Web app / SaaS": "网页应用 / SaaS",
  "Developer tool": "开发者工具",
  "Docs / Content": "文档 / 内容",
  "Portfolio": "作品集",
  "Community / Forum": "社区 / 论坛",
  "E-commerce": "电商",
  "Other": "其他",
  "Stage": "阶段",
  "Just an idea": "只是一个想法",
  "Building MVP": "正在做 MVP",
  "Pre-launch": "上线前",
  "Live, few users": "已上线，少量用户",
  "Live, iterating": "已上线，正在迭代",
  "Who is this for?": "这是给谁用的？",
  "Primary audience (pick all that apply)": "主要受众（可多选）",
  "Developers": "开发者",
  "Designers": "设计师",
  "Indie hackers": "独立开发者",
  "Startup founders": "创业者",
  "B2B buyers / PMs": "B2B 买家 / 产品经理",
  "Content creators": "内容创作者",
  "Students / Learners": "学生 / 学习者",
  "General consumers": "普通消费者",
  "How technical are they?": "他们的技术背景如何？",
  "Very technical": "技术很强",
  "Mixed": "混合人群",
  "Non-technical": "非技术用户",
  "Anything else about them? (free text, optional)": "补充受众信息（可选）",
  "What's the primary goal of this site?": "网站最重要的目标是什么？",
  "Pick the single most important outcome": "只选一个核心结果",
  "Email / waitlist signup": "邮箱 / 候补名单注册",
  "Free trial → paid": "免费试用 → 付费",
  "One-time purchase": "一次性购买",
  "GitHub stars / installs": "GitHub Star / 安装量",
  "Book a demo": "预约演示",
  "Join the community": "加入社区",
  "Awareness / Education": "认知 / 教育",
  "What does success look like in 90 days? (free text)": "90 天后怎样算成功？",
  "What should it feel like?": "希望它是什么风格？",
  "Brand vibes (pick 1–3)": "品牌风格（选 1–3 个）",
  "Trustworthy / Enterprise": "可信赖 / 企业级",
  "Edgy / Bold": "大胆 / 有冲击力",
  "Playful / Indie": "有趣 / 独立",
  "Calm / Zen": "平静 / 禅意",
  "Futuristic / Tech": "未来感 / 技术感",
  "Crafted / Artisan": "精心打磨 / 手作感",
  "Editorial / Magazine": "编辑部 / 杂志感",
  "Raw / Brutalist": "粗粝 / 野兽派",
  "Sites you admire (URLs or names, comma-separated, optional)": "喜欢的网站（可选）",
  "How does it feel right now?": "现在的问题是什么？",
  "What's working that you'd never throw away?": "哪些必须保留？",
  "What frustrates you about the current site?": "现在最卡的点？",
  "← Back": "← 上一步",
  "Next →": "下一步 →",
  "Generate report": "生成报告",
  "5 questions · ~60 seconds": "5 个问题 · 约 60 秒",
  "Brand & audience report": "品牌和受众报告",
  "Your custom diagnosis": "诊断结果",
  "Restart wizard": "重新开始",
  "Usage guide": "怎么使用",
  "Use Shipwright in two modes.": "Shipwright 有两种用法。",
  "The website is the product demo and report builder. The installed skills are the real agent workflow for evidence-backed browser, README, and release audits.": "网站生成报告；安装 skills 后，在本地做完整检查。",
  "Website usage steps": "网站使用步骤",
  "Paste the thing you want to ship.": "粘贴要发布的项目。",
  "Generate the launch risk report.": "生成上线风险报告。",
  "Turn findings into the next patch.": "把问题变成修复任务。",
  "Real audit mode": "真实审查模式",
  "For a real audit, install the skills and ask your agent to run the checks against your local repo or URL.": "真实审查请安装 skills，让 Agent 检查本地仓库或 URL。",
  "Example prompt": "示例提示词",
  "The hosted demo does not clone repos or run browser automation yet. That honesty is part of the product: no fake green checks.": "托管演示暂不克隆仓库、不跑真浏览器，所以不会给你假通过。",
  "Who is this for": "适合谁",
  "Built for builders who ship fast and want it to actually work.": "给快速上线、但希望真的能用的人。",
  "Vibe coders": "氛围编程者",
  "Indie hackers": "独立开发者",
  "Open source maintainers": "开源维护者",
  "AI skill / MCP authors": "AI Skill / MCP 作者",
  "Inspection radar": "检查雷达",
  "Plot the launch route before the public countdown.": "公开发布前，先把风险查清楚。",
  "A quiet control-room view of the checks Shipwright runs: each waypoint maps to a launch risk, the evidence it needs, and the fix signal a builder should trust.": "每个节点对应一类上线风险、需要的证据和建议修复。",
  "Launch Map 04": "上线地图 04",
  "Signal: evidence required": "信号：需要证据",
  "Launch route with inspection waypoints": "上线检查路线",
  "Intake": "录入",
  "Browser": "浏览器",
  "Install": "安装",
  "Claims": "声明",
  "Release": "发布",
  "Green": "正常",
  "Watch": "注意",
  "Clear": "就绪",
  "Repo intake": "仓库录入",
  "Browser proof": "浏览器取证",
  "README friction": "README 摩擦点",
  "Agent claim audit": "Agent 声明审查",
  "Release package": "发布打包",
  "Confirm the target is real, parse the project type, and refuse vague launch claims before the audit begins.": "先确认目标真实，再拒绝模糊上线声明。",
  "If the target is vague, every later green check becomes theatre instead of proof.": "如果目标本身含糊，后面的绿灯都只是表演，不是证据。",
  "GitHub URL, project type, and one concrete launch surface to inspect.": "GitHub URL、项目类型，以及一个明确要检查的上线界面。",
  "Normalize the target, lock the audit mode, and reject hand-wavy claims.": "先标准化目标、锁定审查模式，并拒绝模糊表述。",
  "A clean diff can still ship broken routes, console noise, and clipped mobile UI.": "再干净的 diff，也可能把坏路由、控制台报错和移动端裁切一起发出去。",
  "Opened URL, console state, network health, and proof of CTA, loading, empty, and error states.": "已打开的 URL、控制台状态、网络健康度，以及 CTA、加载、空态、错误态的证据。",
  "Fix visible breakage first, then re-run at 390px and 768px.": "先修可见损坏，再回到 390px 和 768px 复跑。",
  "README confidence collapses when the first real install asks for undocumented setup.": "第一次真实安装一旦碰到文档外步骤，README 的可信度就会崩掉。",
  "Env keys, version floor, exact commands, and the first successful output.": "环境变量、最低版本、准确命令，以及第一次成功输出。",
  "Add missing setup steps, expected output, and rollback notes before launch.": "发布前补上缺失步骤、预期输出和回滚说明。",
  "AI-generated 'done' claims drift away from the real product faster than teams notice.": "AI 生成的“已完成”声明，往往比团队意识到得更快偏离真实产品。",
  "Working UI path, file references, no TODO placeholders, and verified integrations.": "真实可走通的 UI 路径、文件引用、无 TODO 占位，以及已验证的集成。",
  "Cut fake claims, mark placeholders, and trim unfinished surfaces.": "删掉假声明、标出占位，并裁掉未完成界面。",
  "Solid code still stalls if packaging, proof, and the next action are missing.": "代码本身没问题，也会因为打包、证据和下一步动作缺失而卡住发布。",
  "Repo topics, release notes, launch post, and contributor-ready next patch.": "仓库 topics、发布说明、上线帖子，以及贡献者可接手的下一补丁。",
  "Ship one proof-led release package, not a vague announcement.": "发布时拿出一套有证据的材料，而不是一段空泛公告。",
  "Click a waypoint to preload the analyzer with a matching audit scenario.": "点击节点，加载对应检查场景。",
  "Waypoint loaded into the analyzer. Review the report or run the demo audit.": "节点已加载到审查台。查看报告，或继续跑演示审查。",
  "Evidence": "证据",
  "Every green light needs an observed browser state, command output, or file reference.": "每个通过结果都要有证据。",
  "Evidence required": "需要的证据",
  "Risk": "风险",
  "Markers call out launch blockers before they become public support requests.": "提前发现会卡住用户的问题。",
  "Patch": "修复",
  "Patch signal": "修复信号",
  "The route ends with the smallest next fix, not a vague quality score.": "最后给出下一步该修什么。",
  "How it becomes real": "它如何落地",
  "From agent claim to proof.": "从 Agent 声称完成，到真正拿到证据。",
  "From static demo to agent-powered launch gate.": "从页面演示，到 Agent 上线检查。",
  "Claim": "声明",
  "Open": "打开",
  "Package": "打包",
  "Input": "输入",
  "Check": "检查动作",
  "Output artifact": "输出产物",
  "Repo, README, live URL, and the agent's finished-sounding claims.": "仓库、README、线上 URL，以及 Agent 那些听起来像做完了的声明。",
  "Catch hallucinated claims, fake buttons, TODOs, and unverified integrations.": "找出假功能、假按钮、TODO 和没验证的集成。",
  "P0/P1 findings list, dead-link inventory, and stripped fake-complete claims.": "P0/P1 问题清单、死链接清单，以及剔除后的假完成声明。",
  "Live URL, primary CTA path, and the viewport widths people actually use.": "线上 URL、主 CTA 路径，以及用户真实会用到的视口宽度。",
  "Open the app, check console/network health, interactions, mobile layout, and trust gaps.": "打开页面，检查报错、网络、交互、移动端和信任问题。",
  "Console proof, viewport notes, broken-state screenshots, and the next browser fix.": "控制台证据、视口备注、坏状态截图，以及下一步浏览器修复。",
  "Public quickstart, env setup, version requirements, and first-run commands.": "公开 quickstart、环境配置、版本要求，以及首次运行命令。",
  "Follow the public install path like a stranger and record exactly where adoption breaks.": "按新用户视角走安装流程，记录哪里卡住。",
  "Missing-step log, expected output block, and a smaller patchable quickstart.": "缺失步骤日志、预期输出块，以及更小可补丁化的 quickstart。",
  "Fixed findings, product promise, release diff, and one proof-led screenshot or report.": "已修问题、产品承诺、发布 diff，以及一张带证据的截图或报告。",
  "Generate topics, description, release notes, launch post, and next contributor issues.": "生成 topics、描述、发布说明、上线文案和后续 issue。",
  "Release package, launch copy, contributor-facing issues, and a clean next patch.": "发布材料、上线文案、面向贡献者的 issues，以及干净的下一补丁。",
  "Honest status": "真实状态",
  "What this demo does and does not do.": "这个演示能做什么。",
  "This demo does": "这个演示会",
  "This demo does not": "这个演示不会",
  "Generate a structured launch QA report based on project type": "按项目类型生成上线报告",
  "Show the exact audit categories the real skills check": "展示真实 skills 的检查项",
  "Produce a copyable/downloadable Markdown report for your agent": "导出给 Agent 的 Markdown",
  "Offer AI-powered website planning (BYOK — bring your own API key)": "提供 BYOK AI 网站规划",
  "Clone your GitHub repository or read its files": "克隆仓库或读取文件",
  "Open a real browser to check console errors or mobile layout": "打开真浏览器检查页面",
  "Store your API key on any server (key stays in your browser only)": "把 API Key 存到服务器",
  "Make requests without your explicit API key configuration": "未经配置就发起请求",
  "For real, evidence-backed audits, install the": "要做真实、有证据的审查，请安装",
  "open-source skills": "开源 skills",
  "and run them locally with Claude Code or Codex.": "并在 Claude Code 或 Codex 中本地运行。",
  "All 10 skills": "全部 10 个技能",
  "From trend discovery to launch.": "从趋势发现到正式发布。",
  "Install the workflow, not just the promise.": "安装整套工作流，而不只是相信一句承诺。",
  "Discovery": "发现",
  "Planning": "规划",
  "Launch": "发布",
  "Meta": "元工作流",
  "Find what is worth building before you waste a launch slot.": "先找到真正值得做的东西，再决定把发布机会押在哪。",
  "Turn rough ideas into scoped work that can survive implementation.": "把粗糙想法整理成真正能落地、能交付的范围。",
  "Run the checks that turn agent confidence into evidence.": "把 Agent 的自信，变成可验证的证据。",
  "Package the public release so the proof survives outside your repo.": "把公开发布材料整理好，让证据在仓库外也站得住。",
  "Turn one repeated launch ritual into an installable tool of your own.": "把一套重复的发布动作，变成你自己的可安装工具。",
  "Scan GitHub Trending and separate tools, opportunities, and hype traps.": "扫描 GitHub Trending，区分工具、机会和炒作陷阱。",
  "Turn a hot repo or trend into a differentiated product opportunity.": "把热门仓库或趋势转成有差异化的产品机会。",
  "Convert a rough idea into a lean PRD with scope and acceptance criteria.": "把粗略想法转成带范围和验收标准的精简 PRD。",
  "Break a PRD into GitHub-ready issues ordered by delivery sequence.": "把 PRD 拆成可直接放进 GitHub、按交付顺序排列的 issues。",
  "Audit a project for README, install, demo, trust, and conversion gaps.": "审查项目在 README、安装、演示、信任和转化上的缺口。",
  "Verify a web app in a real browser before shipping.": "上线前在真实浏览器中验证网页应用。",
  "Test if a first-time user can install from the README alone.": "测试新用户是否只靠 README 就能完成安装。",
  "Catch hallucinated or fake-complete AI-generated work.": "捕捉幻觉式或假完成的 AI 生成工作。",
  "Package a repo for public release with metadata and launch copy.": "为公开发布打包仓库元数据和上线文案。",
  "Turn a repeated workflow into a clean, installable skill.": "把重复工作流转成干净、可安装的 skill。",
  "AI-powered planning": "AI 驱动规划",
  "Start messy. Leave with a build brief.": "输入想法，生成建站方案。",
  "Tell the AI Planner your website idea. It asks targeted questions about users, features, proof, stack, and visual direction, then turns the answers into a complete website creation plan.": "告诉 AI Planner 你的想法，它会追问并整理成建站方案。",
  "Start AI Planner": "启动 AI Planner",
  "BYOK — key stays in localStorage and only calls your chosen API endpoint.": "自带 API Key，只保存在浏览器。",
  "AI planner workflow": "AI 规划工作流",
  "Ask": "追问",
  "Clarify the real user": "明确用户是谁",
  "Audience, pain, proof, constraints, and what the first visit must accomplish.": "受众、痛点、证据、限制和首屏任务。",
  "Shape": "成型",
  "Turn answers into scope": "整理功能范围",
  "MVP features, page map, content blocks, design direction, and launch risks.": "MVP、页面、内容、视觉和风险。",
  "Review": "复查",
  "Send it through Shipwright": "用 Shipwright 再检查",
  "Use the generated brief as the input, then audit the finished site before sharing.": "用简报开工，上线前再审一次。",
  "Open source first": "开源优先",
  "Ship fewer beautiful half-products.": "别把半成品发出去。",
  "Start with the skills today. Turn this website into the hosted version when the workflow proves people keep coming back before every launch.": "先用 skills 跑起来；等这个流程被反复使用，再做完整托管版。",
  "Try the demo": "试用演示",
  "Built for Claude Code, Codex, and builders who actually open the browser.": "给 Claude Code、Codex 和认真检查上线的人。",
  "© 2026 Shipwright. MIT License.": "© 2026 Shipwright. MIT 许可证。",
  "Open AI Planner": "打开 AI Planner",
  "AI Website Planner": "AI 网站规划器",
  "AI Settings": "AI 设置",
  "Settings": "设置",
  "Close chat": "关闭聊天",
  "API Key": "API Key",
  "API Base URL": "API Base URL",
  "Model": "模型",
  "Your API key is stored in your browser only (localStorage). It is never sent to any server other than the API endpoint you specify above.": "API Key 只存在浏览器，只发往你指定的 API 端点。",
  "Cancel": "取消",
  "Save": "保存",
  "Back to top": "回顶部",
  "Copied!": "已复制！",
  "Copy failed": "复制失败",
  "Checking…": "检查中…",
  "Analyzing…": "分析中…",
  "Generating…": "生成中…",
  "Explaining…": "解释中…",
  "Explain with AI": "用 AI 解释",
  "Review with Shipwright": "用 Shipwright 审查",
  "No critical patches needed. Ship it.": "没有关键修复项。可以发布。",
  "Idea-mode guidance only": "仅想法模式建议",
  "No P0/P1 findings — looking good.": "没有 P0/P1 问题，看起来不错。",
  "Launch ready": "可以上线",
  "Needs work": "需要改进",
  "Not ready": "尚未就绪",
  "Major gaps": "存在明显缺口"
};

const ZH_ATTRIBUTES = {
  "Primary navigation": "主导航",
  "Switch to Chinese": "切换到中文",
  "Switch to English": "Switch to English",
  "Toggle dark mode": "切换深色模式",
  "Repository or demo URL": "仓库或演示网址",
  "owner/repo or https://github.com/user/project": "owner/repo 或 https://github.com/user/project",
  "https://github.com/user/project or user/project": "https://github.com/user/project 或 user/project",
  "https://yoursite.com or https://github.com/user/repo": "站点 URL 或 GitHub 仓库",
  "e.g., burned out from PPT-style landing pages; spend most time on X/Twitter; care about privacy": "例如：讨厌 PPT 风；重视隐私；常用 X",
  "e.g., 500 weekly active users; 50 paying customers; 1k GitHub stars": "例如：500 周活；50 付费；1k Stars",
  "e.g., linear.app, vercel.com, are.na": "例如：linear.app、vercel.com、are.na",
  "e.g., the dark hero is on-brand; the analyzer demo gets shares; the workflow diagram explains it fast": "例如：深色首屏好；演示易传播；流程图清楚",
  "e.g., feels too PPT-like; nobody understands what we do in 10s; CTAs feel generic; we have no real social proof": "例如：太像 PPT；10 秒讲不清；CTA 太泛",
  "Describe your website idea": "描述网站想法",
  "Describe your website idea...": "描述网站想法...",
  "Send message": "发送消息",
  "sk-...": "sk-...",
  "https://api.openai.com": "https://api.openai.com",
  "gpt-4.1-mini or your model name": "模型名，如 gpt-4.1-mini",
  "Back to top": "回顶部"
};

const LANGUAGE_META = {
  en: {
    title: "Shipwright - Launch QA for AI-built projects",
    description:
      "Shipwright checks AI-built projects before launch: browser QA, README install friction, fake-complete agent output, and GitHub release packaging.",
    twitterDescription:
      "10 reusable skills that audit AI-built projects before launch. Browser QA, README install paths, agent output review, and GitHub release packaging.",
  },
  zh: {
    title: "Shipwright - AI 项目上线前检查",
    description:
      "Shipwright 帮你在 AI 项目上线前检查浏览器、README、假功能和发布信息。",
    twitterDescription:
      "10 个可复用 skills，检查 AI 项目的浏览器、README、Agent 输出和发布信息。",
  },
};

const HERO_HEADLINE = {
  en: "Before you ship the AI-built app, make it survive first contact.",
  zh: "AI 做的项目，上线前先检查。",
};

const HERO_CYCLE_WORDS = {
  en: "vibe-coded|AI-built|weekend|indie|side-project",
  zh: "氛围编程|AI 生成|周末作品|独立产品|副业实验",
};

const textNodeSources = new WeakMap();
const attributeSources = new WeakMap();
let activeLanguage = (document.documentElement.getAttribute("data-lang") || "en") === "zh" ? "zh" : "en";

const translateLiteral = (value) => {
  if (activeLanguage !== "zh") return value;
  return ZH_TEXT[normalizeCopy(value)] || ZH_ATTRIBUTES[normalizeCopy(value)] || value;
};

const shouldSkipTranslationNode = (node) => {
  const parent = node.parentElement;
  if (!parent) return true;
  return Boolean(parent.closest("script, style, noscript, svg, code, pre, .hero h1, .cycle-word, .h1-letter, .cursor-follower"));
};

const withOriginalWhitespace = (source, replacement) => {
  const leading = source.match(/^\s*/)?.[0] || "";
  const trailing = source.match(/\s*$/)?.[0] || "";
  return `${leading}${replacement}${trailing}`;
};

const translateTextNodes = (root = document.body) => {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    if (shouldSkipTranslationNode(node)) return;
    if (!textNodeSources.has(node)) {
      textNodeSources.set(node, node.nodeValue || "");
    }

    const source = textNodeSources.get(node) || "";
    const key = normalizeCopy(source);
    if (!key) return;

    if (activeLanguage === "zh" && ZH_TEXT[key]) {
      node.nodeValue = withOriginalWhitespace(source, ZH_TEXT[key]);
    } else {
      node.nodeValue = source;
    }
  });
};

const translateAttributes = (root = document.body) => {
  const attrs = ["placeholder", "aria-label", "title"];
  root.querySelectorAll("*").forEach((element) => {
    attrs.forEach((attr) => {
      if (!element.hasAttribute(attr)) return;
      let sourceByAttr = attributeSources.get(element);
      if (!sourceByAttr) {
        sourceByAttr = {};
        attributeSources.set(element, sourceByAttr);
      }
      if (!sourceByAttr[attr]) {
        sourceByAttr[attr] = element.getAttribute(attr) || "";
      }
      const source = sourceByAttr[attr];
      const key = normalizeCopy(source);
      element.setAttribute(attr, activeLanguage === "zh" && ZH_ATTRIBUTES[key] ? ZH_ATTRIBUTES[key] : source);
    });
  });
};

const updateDocumentMeta = () => {
  const meta = LANGUAGE_META[activeLanguage] || LANGUAGE_META.en;
  document.title = meta.title;
  document.querySelector("meta[name='description']")?.setAttribute("content", meta.description);
  document.querySelector("meta[property='og:title']")?.setAttribute("content", meta.title);
  document.querySelector("meta[property='og:description']")?.setAttribute("content", meta.description);
  document.querySelector("meta[name='twitter:title']")?.setAttribute("content", meta.title);
  document.querySelector("meta[name='twitter:description']")?.setAttribute("content", meta.twitterDescription);
};

const updateLanguageToggle = () => {
  const button = document.querySelector("#langToggle");
  if (!button) return;
  button.setAttribute("aria-label", activeLanguage === "zh" ? "Switch to English" : "Switch to Chinese");
  button.setAttribute("aria-pressed", activeLanguage === "zh" ? "true" : "false");
};

const syncHeroLanguage = ({ animateHero = false } = {}) => {
  const h1 = document.querySelector(".hero h1");
  if (h1) {
    h1.classList.remove("is-letters-in");
    h1.removeAttribute("data-split");
    h1.textContent = HERO_HEADLINE[activeLanguage] || HERO_HEADLINE.en;
    if (animateHero && typeof initHeroSplitH1 === "function" && !prefersReduced) {
      initHeroSplitH1();
    }
  }

  const cycleWord = document.querySelector(".cycle-word");
  if (cycleWord) {
    cycleWord.dataset.words = HERO_CYCLE_WORDS[activeLanguage] || HERO_CYCLE_WORDS.en;
    cycleWord.textContent = (cycleWord.dataset.words || "").split("|")[0] || "";
    if (animateHero && typeof initCycleWords === "function" && !prefersReduced) {
      initCycleWords();
    }
  }
};

const applyLanguage = (language, options = {}) => {
  const { persist = true, animateHero = false, syncHero = true } = options;
  activeLanguage = language === "zh" ? "zh" : "en";
  document.documentElement.setAttribute("lang", activeLanguage === "zh" ? "zh-CN" : "en");
  document.documentElement.setAttribute("data-lang", activeLanguage);
  if (persist) localStorage.setItem(LANGUAGE_STORAGE_KEY, activeLanguage);
  if (syncHero) syncHeroLanguage({ animateHero });
  updateDocumentMeta();
  translateTextNodes();
  translateAttributes();
  updateLanguageToggle();
  if (typeof updateModeBadge === "function") updateModeBadge();
};

const refreshLocalizedContent = () => {
  translateTextNodes();
  translateAttributes();
};

const syncReportModeMirror = () => {
  const source = document.getElementById("modeBadge");
  const mirror = document.getElementById("reportModeMirror");
  if (!source || !mirror) return;
  mirror.textContent = source.textContent || translateLiteral("Detecting mode…");
  mirror.dataset.mode = source.dataset.mode || "detecting";
};

const initLanguageToggle = () => {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  applyLanguage(stored === "zh" ? "zh" : "en", { persist: false, animateHero: false });

  document.querySelector("#langToggle")?.addEventListener("click", () => {
    const next = activeLanguage === "zh" ? "en" : "zh";
    applyLanguage(next, { animateHero: true });
  });
};

/* ── Text scramble effect ── */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

const scrambleText = (element, finalText, duration = 1200) => {
  const length = finalText.length;
  const startTime = performance.now();

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const revealed = Math.floor(progress * length);

    let output = "";
    for (let i = 0; i < length; i++) {
      if (finalText[i] === " ") {
        output += " ";
      } else if (i < revealed) {
        output += finalText[i];
      } else {
        output += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }

    element.textContent = output;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = finalText;
    }
  };

  requestAnimationFrame(step);
};

/* ── Hero text word-by-word reveal ── */

const initHeroReveal = () => {
  const h1 = document.querySelector(".hero-copy h1");
  if (h1 && h1.dataset.split !== "true") {
    const text = h1.textContent;
    const words = text.split(" ");
    h1.innerHTML = words
      .map((word) => `<span class="hero-word"><span class="hero-word-inner">${word}</span></span>`)
      .join(" ");
    h1.querySelectorAll(".hero-word-inner").forEach((el, i) => {
      el.style.animationDelay = `${i * 80 + 200}ms`;
    });
  }

  const eyebrow = document.querySelector(".hero-copy .eyebrow");
  if (eyebrow && !eyebrow.querySelector(".cycle-word")) {
    const eyebrowText = eyebrow.textContent;
    eyebrow.textContent = "";
    eyebrow.style.opacity = "1";
    window.setTimeout(() => scrambleText(eyebrow, eyebrowText, 1000), 100);
  } else if (eyebrow) {
    eyebrow.style.opacity = "1";
  }
};

/* ── 3D tilt on inspection card ── */

const initCardTilt = () => {
  const card = document.querySelector(".inspection-card");
  if (!card) return;

  const hero = document.querySelector(".hero");

  hero.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;

    const rotateY = deltaX * 8;
    const rotateX = -deltaY * 6;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  hero.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
  });
};

/* ── Animated gradient blobs in hero ── */

const initHeroBlobs = () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const blobContainer = document.createElement("div");
  blobContainer.className = "hero-blobs";
  blobContainer.setAttribute("aria-hidden", "true");

  blobContainer.innerHTML = `
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  `;

  hero.style.position = "relative";
  hero.prepend(blobContainer);
};

/* ── Counter animation for signal strip ── */

const animateCounter = (element, target, duration = 1200) => {
  const isNumeric = !isNaN(target);
  if (!isNumeric) return;

  const startTime = performance.now();

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  element.textContent = "0";
  requestAnimationFrame(step);
};

const initCounters = () => {
  const strip = document.querySelector(".signal-strip");
  if (!strip) return;

  const dts = strip.querySelectorAll("dt");
  let fired = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          dts.forEach((dt) => {
            const text = dt.textContent.trim();
            const num = parseInt(text, 10);
            if (!isNaN(num) && text === String(num)) {
              animateCounter(dt, num, 1400);
            }
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(strip);
};

/* ── Staggered card entrance ── */

const initStaggeredCards = () => {
  const groups = document.querySelectorAll(
    ".mission-grid, .pain-cards, .audience-cards, .workflow-steps, .guide-steps, .radar-checklist, .planner-steps"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll("article");
          cards.forEach((card, i) => {
            card.style.opacity = "0";
            card.style.transform = "translateY(30px)";
            window.setTimeout(() => {
              card.style.transition = "opacity 500ms ease, transform 500ms ease";
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, i * 120);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  groups.forEach((group) => observer.observe(group));
};

/* ── Cursor glow on hero ── */

const initCursorGlow = () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");
  hero.append(glow);

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    glow.style.left = `${e.clientX - rect.left}px`;
    glow.style.top = `${e.clientY - rect.top}px`;
    glow.style.opacity = "1";
  });

  hero.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
};

/* ── Magnetic button effect ── */

const initMagneticButtons = () => {
  const buttons = document.querySelectorAll(".button.primary");

  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
};

/* ── Floating inspection list items ── */

const initFloatingFindings = () => {
  const items = document.querySelectorAll(".inspection-list li");
  items.forEach((li, i) => {
    li.style.animationDelay = `${i * 0.6}s`;
  });
};

/* ── Project profiles & analyzer (unchanged data) ── */

const projectProfiles = {
  web: {
    label: "Web app",
    verdict: "Almost ready",
    baseScore: 74,
    findings: [
      {
        severity: "P1",
        title: "Primary path needs browser proof",
        detail: "Open the demo URL and verify the CTA, empty state, loading state, and error state before launch.",
      },
      {
        severity: "P1",
        title: "Mobile layout is a trust risk",
        detail: "Check 390px and 768px widths for clipped nav, overflowing cards, and unreadable form controls.",
      },
      {
        severity: "P1",
        title: "Console errors undermine first impressions",
        detail: "Check DevTools for hydration mismatches, failed network requests, and unhandled promise rejections.",
      },
      {
        severity: "P2",
        title: "README should show expected output",
        detail: "Add the first successful terminal output or screenshot so users know the app is working.",
      },
      {
        severity: "P2",
        title: "Empty states need design, not blank space",
        detail: "New users with zero data should see a helpful message and CTA, not an empty table.",
      },
    ],
    quickWins: [
      "Add a verified screenshot to the README showing the app running.",
      "Set a proper page title and meta description for link previews.",
      "Add a favicon and og:image so shared links look professional.",
    ],
    nextPatch:
      "Run the browser-launch-audit skill on the demo URL, then add one verified screenshot and a README section showing the first successful run.",
  },
  skill: {
    label: "Skill pack",
    verdict: "Ready with polish",
    baseScore: 82,
    findings: [
      {
        severity: "P1",
        title: "Trigger descriptions need real user phrases",
        detail: "Each skill should explain when an agent should invoke it, including common words users actually type.",
      },
      {
        severity: "P1",
        title: "Example outputs prove value faster than docs",
        detail: "Include at least one sample report per skill so users can preview what they get before installing.",
      },
      {
        severity: "P2",
        title: "Install path needs a restart reminder",
        detail: "Tell Claude Code and Codex users exactly where skills are linked and when to restart the agent.",
      },
      {
        severity: "P2",
        title: "Example prompts are the fastest proof",
        detail: "Add one copy-paste prompt per skill and a sample report for the full workflow.",
      },
    ],
    quickWins: [
      "Add a chained-use example showing skills piped together in sequence.",
      "Include a sample output file for at least one core skill.",
      "Add badges for compatible agents (Claude Code, Codex) at the top of README.",
    ],
    nextPatch:
      "Add one Launch QA sample report, then run readme-install-audit from a clean checkout to prove the install path.",
  },
  mcp: {
    label: "MCP server",
    verdict: "Not ready",
    baseScore: 61,
    findings: [
      {
        severity: "P0",
        title: "Security boundary is not explicit",
        detail: "Document what the server can read, write, call, and log before asking users to install it.",
      },
      {
        severity: "P1",
        title: "Client setup is probably underexplained",
        detail: "Provide config snippets for Claude Code, Codex, and Cursor instead of a single generic command.",
      },
      {
        severity: "P1",
        title: "Error handling needs user-facing messages",
        detail: "When tool calls fail, return structured errors that help the LLM retry or explain the failure to the user.",
      },
      {
        severity: "P1",
        title: "Tool listing should show realistic examples",
        detail: "Document each tool with a realistic input, expected output, and failure scenario.",
      },
      {
        severity: "P2",
        title: "Tool examples need before/after output",
        detail: "Show one realistic request, the tool call shape, and the resulting output.",
      },
    ],
    quickWins: [
      "Add a permissions table showing what the server reads, writes, and calls.",
      "Include a one-command test that verifies the server starts and responds.",
      "Add a troubleshooting section for common connection errors.",
    ],
    nextPatch:
      "Write the security and permissions section first, then add client-specific config snippets before public launch.",
  },
  cli: {
    label: "CLI / developer tool",
    verdict: "Almost ready",
    baseScore: 72,
    findings: [
      {
        severity: "P1",
        title: "First command must prove value",
        detail: "The quickstart should run one command that produces useful output in under ten minutes.",
      },
      {
        severity: "P1",
        title: "Failure states need friendlier output",
        detail: "Check missing config, invalid paths, network errors, and permission errors for actionable messages.",
      },
      {
        severity: "P2",
        title: "Install choices need a recommended path",
        detail: "If npm, brew, uv, or curl are possible, pick one default and move alternatives below.",
      },
      {
        severity: "P2",
        title: "Version and help flags should exist",
        detail: "Users expect --version and --help to work. Missing flags signal an unfinished tool.",
      },
    ],
    quickWins: [
      "Add expected terminal output after the quickstart command in the README.",
      "Document the minimum runtime version (Node, Python, Go, etc.).",
      "Add a --help screenshot or output block to the README.",
    ],
    nextPatch:
      "Make the README quickstart a three-command path: install, run sample, inspect expected output.",
  },
  template: {
    label: "Template repo",
    verdict: "Almost ready",
    baseScore: 70,
    findings: [
      {
        severity: "P1",
        title: "The template needs an opinionated first change",
        detail: "Show exactly what users should customize first and what they should not touch yet.",
      },
      {
        severity: "P1",
        title: "Generated placeholders can look like product gaps",
        detail: "Mark demo data, fake credentials, and example copy clearly so users do not ship them by accident.",
      },
      {
        severity: "P2",
        title: "Roadmap should be scoped",
        detail: "Separate starter-template goals from full SaaS platform ambitions.",
      },
      {
        severity: "P2",
        title: "License and attribution need clarity",
        detail: "State whether forks should keep the original license or can relicense freely.",
      },
    ],
    quickWins: [
      "Add a 'Customize this first' checklist at the top of the README.",
      "Replace placeholder text with clearly marked TODO comments.",
      "Include a 'Use This Template' button setup guide for GitHub.",
    ],
    nextPatch:
      "Add a 'Customize this first' section and run agent-output-review against all template placeholder claims.",
  },
};

const coverageItems = [
  "Agent output review for fake-complete claims",
  "Browser health checklist for console, network, and responsive layout",
  "README install path from a first-time user perspective",
  "GitHub release package: topics, description, release notes, and launch copy",
];

const metadataByChannel = {
  GitHub: "GitHub topics, repo description, release title",
  X: "Short launch post and proof-oriented hook",
  "Product Hunt": "Tagline, maker comment, and demo proof",
};

const form = document.querySelector("#auditForm");
const targetInput = document.querySelector("#targetInput");
const projectType = document.querySelector("#projectType");
const verdictTitle = document.querySelector("#verdictTitle");
const scoreValue = document.querySelector("#scoreValue");
const targetBadge = document.querySelector("#targetBadge");
const typeBadge = document.querySelector("#typeBadge");
const findingsList = document.querySelector("#findingsList");
const coverageList = document.querySelector("#coverageList");
const metadataList = document.querySelector("#metadataList");
const nextPatch = document.querySelector("#nextPatch");
const copyReport = document.querySelector("#copyReport");
const downloadReport = document.querySelector("#downloadReport");
const reportPanel = document.querySelector("#reportPanel");
const scoreRing = document.querySelector("#scoreRing");
const targetError = document.querySelector("#targetError");
const analyzeBtn = document.querySelector("#analyzeBtn");
const btnText = analyzeBtn.querySelector(".btn-text");
const btnSpinner = analyzeBtn.querySelector(".btn-spinner");

let currentMarkdown = "";

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });

const reportEmpty = document.querySelector("#reportEmpty");
const reportContent = document.querySelector("#reportContent");

const targetPattern = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;

const parseTarget = (target) => {
  const trimmed = target.trim();

  if (!trimmed) {
    return {
      error: "Paste a GitHub repository, owner/repo, or http(s) demo URL before analyzing.",
      valid: false,
    };
  }

  if (targetPattern.test(trimmed)) {
    return { display: trimmed, valid: true };
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return {
      error: "Use owner/repo, a GitHub URL, or a full http(s) URL. Shipwright should not invent a target.",
      valid: false,
    };
  }

  try {
    const url = new URL(trimmed);
    const githubMatch = url.hostname === "github.com" && url.pathname.split("/").filter(Boolean).length >= 2;

    if (githubMatch) {
      const [owner, repo] = url.pathname.split("/").filter(Boolean);
      return { display: `${owner}/${repo}`, valid: true };
    }

    return { display: url.hostname.replace(/^www\./, ""), valid: true };
  } catch {
    return {
      error: "That URL could not be parsed. Use a complete http(s) URL or owner/repo.",
      valid: false,
    };
  }
};

const setTargetError = (message = "") => {
  targetError.textContent = message;
  targetError.hidden = !message;
  targetInput.setAttribute("aria-invalid", message ? "true" : "false");
};

const scoreOffset = (target) => {
  const total = [...target].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return (total % 9) - 4;
};

const detectProjectType = (url) => {
  const lower = url.toLowerCase();
  if (/mcp|server/.test(lower)) return "mcp";
  if (/template|starter|boilerplate/.test(lower)) return "template";
  if (/skill|command|agent/.test(lower)) return "skill";
  if (/cli|sdk|tool|api/.test(lower)) return "cli";
  return "web";
};

const showReport = () => {
  if (reportEmpty) reportEmpty.hidden = true;
  if (reportContent) reportContent.hidden = false;
};

const selectedChannels = () =>
  [...document.querySelectorAll("input[name='channels']:checked")].map((input) => input.value);

const findingTemplate = (finding) => `
  <li>
    <span class="severity ${finding.severity.toLowerCase()}">${finding.severity}</span>
    <div>
      <strong>${escapeHtml(finding.title)}</strong>
      <p>${escapeHtml(finding.detail)}</p>
    </div>
  </li>
`;

const simpleListTemplate = (items) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

const extractRepoName = (target) => {
  if (target.includes("/")) {
    const parts = target.split("/");
    return parts[parts.length - 1];
  }
  return target;
};

const buildMarkdown = ({ target, profile, score, channels }) => {
  const repoName = extractRepoName(target);
  const findings = profile.findings
    .map((finding) => `- **${finding.severity}**: ${finding.title} — ${finding.detail}`)
    .join("\n");
  const quickWins = (profile.quickWins || [])
    .map((item) => `- [ ] ${item}`)
    .join("\n");
  const metadata = channels.map((channel) => `- ${metadataByChannel[channel]}`).join("\n");
  const timestamp = new Date().toISOString().split("T")[0];

  return `# Shipwright Launch QA Report

## Verdict

**${profile.verdict}** (${score}/100) for **${repoName}**

## Target

- **Project:** ${target}
- **Type:** ${profile.label}
- **Channels:** ${channels.join(", ") || "GitHub"}

## Critical Findings

${findings}
${quickWins ? `\n## Quick Wins\n\n${quickWins}\n` : ""}
## Audit Coverage

${coverageItems.map((item) => `- ${item}`).join("\n")}

## Launch Metadata

${metadata || "- GitHub topics, repo description, release title"}

## Next Patch

${profile.nextPatch}

---

> Generated by Shipwright v0.3.0 on ${timestamp}
> This is a static demo report. Run the open-source skills locally for evidence-backed audits.
> https://github.com/aimonj0729-ai/shipwright
`;
};

const animateScore = (target) => {
  const start = 0;
  const duration = 600;
  const startTime = performance.now();

  scoreRing.classList.remove("pulse");
  void scoreRing.offsetWidth;
  scoreRing.classList.add("pulse");

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    scoreValue.textContent = String(Math.round(start + (target - start) * eased));
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const renderReport = () => {
  const parsedTarget = parseTarget(targetInput.value);

  if (!parsedTarget.valid) {
    setTargetError(parsedTarget.error);
    targetInput.focus();
    return false;
  }

  setTargetError();

  const target = parsedTarget.display;
  const profile = projectProfiles[projectType.value] ?? projectProfiles.web;
  const channels = selectedChannels();
  const score = Math.max(42, Math.min(94, profile.baseScore + scoreOffset(target)));

  const repoName = extractRepoName(target);

  verdictTitle.textContent = profile.verdict;
  scoreRing.setAttribute("aria-label", `Launch score ${score} out of 100`);
  targetBadge.textContent = target;
  typeBadge.textContent = profile.label;
  findingsList.innerHTML = profile.findings.map(findingTemplate).join("");

  const quickWinsList = document.querySelector("#quickWinsList");
  const quickWinsSection = document.querySelector("#quickWinsSection");
  if (quickWinsList && quickWinsSection && profile.quickWins && profile.quickWins.length > 0) {
    quickWinsSection.hidden = false;
    quickWinsList.innerHTML = profile.quickWins.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  } else if (quickWinsSection) {
    quickWinsSection.hidden = true;
  }

  coverageList.innerHTML = simpleListTemplate(coverageItems);
  metadataList.innerHTML = simpleListTemplate(
    (channels.length ? channels : ["GitHub"]).map((channel) => metadataByChannel[channel])
  );
  nextPatch.textContent = profile.nextPatch.replace(/the project|this project/gi, repoName);

  animateScore(score);
  showReport();

  currentMarkdown = buildMarkdown({ target, profile, score, channels });
  refreshLocalizedContent();
  return true;
};

/* ─────────────────────────────────────────────────────────────
 * Hybrid Doctor: tries Vercel backend first (enhanced checks),
 * falls back to in-browser checks if the backend is unreachable
 * (e.g., from networks that block *.vercel.app).
 * ───────────────────────────────────────────────────────────── */

const GITHUB_API = "https://api.github.com";
const BACKEND_BASE = "https://shipwright-topaz.vercel.app";
const BACKEND_PROBE_TIMEOUT_MS = 3000;
let BACKEND_AVAILABLE = null; // null = unknown, true/false once probed

const probeBackend = async () => {
  if (BACKEND_AVAILABLE !== null) return BACKEND_AVAILABLE;
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), BACKEND_PROBE_TIMEOUT_MS);
    const res = await fetch(`${BACKEND_BASE}/api/health`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    window.clearTimeout(timer);
    BACKEND_AVAILABLE = res.ok;
  } catch {
    BACKEND_AVAILABLE = false;
  }
  updateModeBadge();
  return BACKEND_AVAILABLE;
};

const updateModeBadge = () => {
  const el = document.getElementById("modeBadge");
  if (!el) return;
  if (BACKEND_AVAILABLE === null) {
    el.textContent = translateLiteral("Detecting mode…");
    el.dataset.mode = "detecting";
  } else if (BACKEND_AVAILABLE) {
    el.textContent = translateLiteral("Enhanced mode · backend reachable");
    el.dataset.mode = "enhanced";
  } else {
    el.textContent = translateLiteral("Browser-only mode · backend unreachable");
    el.dataset.mode = "browser";
  }
  syncReportModeMirror();
};

const severityLabel = {
  P0: "P0 · Launch blocker",
  P1: "P1 · Critical",
  P2: "P2 · Improvement",
  P3: "P3 · Suggestion",
};

const parseGitHubUrl = (input) => {
  const cleaned = String(input).trim()
    .replace(/\.git$/i, "")
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "");
  let m = cleaned.match(/github\.com\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)/);
  if (m) return { owner: m[1], repo: m[2] };
  m = cleaned.match(/^([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)$/);
  if (m) return { owner: m[1], repo: m[2] };
  return null;
};

const decodeBase64Utf8 = (b64) => {
  const cleaned = b64.replace(/\s/g, "");
  const binary = atob(cleaned);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
};

const ghFindings = (repoData) => {
  const findings = [];
  if (repoData.archived) {
    findings.push({ id: "github-archived", title: "Repository is archived", severity: "P0", category: "GitHub",
      description: "Marked as archived — no new contributions accepted.",
      evidence: "GitHub API: archived = true",
      impact: "Users will assume the project is abandoned.",
      fix: "Unarchive the repo if it's still actively maintained." });
  }
  if (!repoData.description) {
    findings.push({ id: "github-no-description", title: "Repository has no description", severity: "P1", category: "GitHub",
      description: "The repo has no description on GitHub.",
      evidence: "GitHub API: description = null",
      impact: "Appears low-effort in search results and social shares.",
      fix: "Add a one-line description in repo settings." });
  }
  if (!repoData.topics || repoData.topics.length === 0) {
    findings.push({ id: "github-no-topics", title: "No topics/tags set", severity: "P2", category: "GitHub",
      description: "Repository has no topics set.", evidence: "GitHub API: topics = []",
      impact: "Harder to discover via GitHub search and explore.",
      fix: "Add 3-5 relevant topics in repo settings." });
  }
  if (!repoData.license) {
    findings.push({ id: "github-no-license", title: "No license file detected", severity: "P1", category: "GitHub",
      description: "GitHub did not detect a license for this repository.",
      evidence: "GitHub API: license = null",
      impact: "Without a license, others legally cannot use or contribute to the code.",
      fix: "Add a LICENSE file. MIT or Apache-2.0 are common." });
  }
  const days = Math.floor((Date.now() - new Date(repoData.pushed_at).getTime()) / 86400000);
  if (days > 180) {
    findings.push({ id: "github-stale", title: "Repository appears stale", severity: "P2", category: "GitHub",
      description: `Last push was ${days} days ago.`, evidence: `pushed_at: ${repoData.pushed_at}`,
      impact: "Users may perceive the project as unmaintained.",
      fix: "Push an update, even if just documentation improvements." });
  }
  return findings;
};

const readmeFindings = (content) => {
  const findings = [];
  const hasTitle = /^#\s+\S/.test(content);
  const firstNewline = content.indexOf("\n");
  const afterTitle = firstNewline === -1 ? "" : content.slice(firstNewline + 1);
  const nextHeadingIdx = afterTitle.search(/^#{1,6}\s/m);
  const preamble = nextHeadingIdx === -1 ? afterTitle.slice(0, 500) : afterTitle.slice(0, nextHeadingIdx);
  const preambleWords = preamble.trim().split(/\s+/).filter(Boolean);
  const hasDescription = preambleWords.length >= 8;
  const hasInstallation = /^#{1,3}\s*(install|getting\s*started|setup|quick\s*start)/im.test(content);
  const hasUsage = /^#{1,3}\s*(usage|how\s*to\s*use|examples?|demo)/im.test(content);
  const hasLicense = /^#{1,3}\s*license/im.test(content);
  const hasBadges = /\[!\[.*?\]\(.*?\)\]/.test(content);
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  if (!hasTitle) findings.push({ id: "readme-no-title", title: "README missing title", severity: "P1", category: "README",
    description: "README does not start with a heading.", evidence: "No '# Title' on first line",
    impact: "Visitors cannot immediately identify what this project is.",
    fix: "Add a `# Project Name` heading as the first line." });
  if (!hasDescription) findings.push({ id: "readme-no-description", title: "README missing description", severity: "P1", category: "README",
    description: "No substantive description after the title.", evidence: `Preamble word count: ${preambleWords.length}`,
    impact: "Visitors won't understand what this project does in the first 10 seconds.",
    fix: "Add 1-2 sentences below the title explaining what the project does and who it's for." });
  if (!hasInstallation) findings.push({ id: "readme-no-install", title: "README missing installation instructions", severity: "P0", category: "README",
    description: "No installation or setup section found.", evidence: "No install/setup/getting-started heading",
    impact: "Users cannot figure out how to run the project.",
    fix: "Add a ## Installation section with step-by-step commands.",
    claudePrompt: "Add a ## Getting Started section to README.md with installation commands." });
  if (!hasUsage) findings.push({ id: "readme-no-usage", title: "README missing usage examples", severity: "P1", category: "README",
    description: "No usage or examples section found.", evidence: "No usage/examples/demo heading",
    impact: "Users won't know how to actually use the project after installing.",
    fix: "Add a ## Usage section with code examples or screenshots." });
  if (!hasLicense) findings.push({ id: "readme-no-license", title: "README missing license section", severity: "P2", category: "README",
    description: "No license section in README.", evidence: "No ## License heading detected.",
    impact: "Users may avoid using the project due to unclear licensing.",
    fix: "Add a ## License section referencing your LICENSE file." });
  if (!hasBadges) findings.push({ id: "readme-no-badges", title: "No badges in README", severity: "P3", category: "README",
    description: "README has no status badges.", evidence: "No badge markdown pattern found.",
    impact: "Project appears less professional at a glance.",
    fix: "Add badges for build status, version, or license." });
  if (wordCount < 50) findings.push({ id: "readme-too-short", title: "README is very short", severity: "P1", category: "README",
    description: `README has only ${wordCount} words.`, evidence: `Word count: ${wordCount}`,
    impact: "Insufficient documentation.",
    fix: "Expand the README with description, installation, usage, and examples." });

  return { findings, wordCount };
};

const computeScore = (findings) => {
  const dd = { P0: 25, P1: 15, P2: 8, P3: 3 };
  let s = 100;
  for (const f of findings) s -= dd[f.severity] || 0;
  return Math.max(0, Math.min(100, s));
};

const computeGrade = (s) => s >= 90 ? "A" : s >= 75 ? "B" : s >= 60 ? "C" : s >= 40 ? "D" : "F";

const dedupe = (findings) => {
  const seen = new Set();
  return findings.filter((f) => seen.has(f.id) ? false : seen.add(f.id));
};

const runDoctorInBrowser = async (rawInput) => {
  const githubParsed = parseGitHubUrl(rawInput);
  if (githubParsed) {
    const { owner, repo } = githubParsed;
    const repoRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`);
    if (repoRes.status === 404) {
      return { ok: false, error: `Repository ${owner}/${repo} not found or private.` };
    }
    if (repoRes.status === 403) {
      return { ok: false, error: "GitHub rate limit hit (60 req/hr per IP). Wait an hour or use a different network." };
    }
    if (!repoRes.ok) {
      return { ok: false, error: `GitHub API error: ${repoRes.status}` };
    }
    const repoData = await repoRes.json();

    let readmeContent = null;
    try {
      const readmeRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`);
      if (readmeRes.ok) {
        const r = await readmeRes.json();
        readmeContent = decodeBase64Utf8(r.content);
      }
    } catch {}

    const gh = ghFindings(repoData);
    if (!readmeContent) {
      gh.push({ id: "github-no-readme", title: "No README file", severity: "P0", category: "GitHub",
        description: "Repository has no README.", evidence: "GitHub /readme returned 404",
        impact: "Visitors have no idea what this project is.",
        fix: "Create a README.md with description, install, and usage." });
    }
    const rd = readmeContent ? readmeFindings(readmeContent) : { findings: [], wordCount: 0 };
    const all = dedupe([...gh, ...rd.findings]);
    const score = computeScore(all);
    return {
      ok: true,
      report: {
        score, grade: computeGrade(score), inputType: "github", inputValue: `${owner}/${repo}`,
        timestamp: new Date().toISOString(),
        findings: all,
        summary: {
          launchBlockers: all.filter((f) => f.severity === "P0").length,
          criticalIssues: all.filter((f) => f.severity === "P1").length,
          improvements: all.filter((f) => f.severity === "P2").length,
          suggestions: all.filter((f) => f.severity === "P3").length,
          quickWins: all.filter((f) => f.severity === "P2" || f.severity === "P3").slice(0, 3),
        },
        checks: {
          github: { name: repoData.name, stars: repoData.stargazers_count, license: repoData.license?.spdx_id, topics: repoData.topics },
          readme: readmeContent ? { wordCount: rd.wordCount, score: 100 - rd.findings.length * 10 } : null,
        },
      },
    };
  }

  if (/^https?:\/\//i.test(rawInput)) {
    return {
      ok: false,
      error: "Browser-only mode can't probe arbitrary URLs (CORS). Paste a GitHub repo URL instead — that runs full checks.",
    };
  }

  return { ok: false, error: "Enter a GitHub repo URL (https://github.com/owner/repo) or owner/repo." };
};

const renderLiveReport = (report) => {
  const target = report.inputValue;
  const score = report.score;
  const verdict =
    score >= 90 ? "Launch ready" :
    score >= 75 ? "Almost ready" :
    score >= 60 ? "Needs work" :
    score >= 40 ? "Not ready" : "Major gaps";

  verdictTitle.textContent = verdict;
  scoreRing.setAttribute("aria-label", `Launch score ${score} out of 100`);
  targetBadge.textContent = report.checks?.github?.name || target;
  typeBadge.textContent = `${report.grade} grade · ${report.inputType}`;

  const aiButton = (id) =>
    BACKEND_AVAILABLE
      ? `<button type="button" class="ai-explain-btn" data-finding-id="${escapeHtml(id)}">Explain with AI</button>`
      : "";
  const findingsHtml = (report.findings || [])
    .filter((f) => f.severity === "P0" || f.severity === "P1")
    .slice(0, 6)
    .map(
      (f) => `
        <li class="finding-item" data-finding-id="${escapeHtml(f.id)}">
          <div class="finding-head">
            <span class="finding-severity sev-${f.severity}">${severityLabel[f.severity] || f.severity}</span>
            <strong>${escapeHtml(f.title)}</strong>
            ${aiButton(f.id)}
          </div>
          <p class="finding-body">${escapeHtml(f.description)}</p>
          <p class="finding-fix"><strong>Fix:</strong> ${escapeHtml(f.fix)}</p>
          <div class="ai-explain-output" hidden></div>
        </li>`
    )
    .join("");
  findingsList.innerHTML = findingsHtml || "<li class=\"finding-item\"><strong>No P0/P1 findings — looking good.</strong></li>";

  window.__lastFindings = report.findings || [];

  const quickWinsList = document.querySelector("#quickWinsList");
  const quickWinsSection = document.querySelector("#quickWinsSection");
  const quickWins = report.summary?.quickWins || [];
  if (quickWinsList && quickWinsSection && quickWins.length > 0) {
    quickWinsSection.hidden = false;
    quickWinsList.innerHTML = quickWins.map((q) => `<li>${escapeHtml(q.title)} — ${escapeHtml(q.fix)}</li>`).join("");
  } else if (quickWinsSection) {
    quickWinsSection.hidden = true;
  }

  const coverage = [];
  if (report.checks?.github) coverage.push(`GitHub repo (${report.checks.github.stars ?? 0} stars, ${report.checks.github.license || "no license"})`);
  if (report.checks?.readme) coverage.push(`README analyzed (${report.checks.readme.wordCount} words, score ${report.checks.readme.score}/100)`);
  if (report.checks?.browser) coverage.push(`Live URL ${report.checks.browser.reachable ? "reachable" : "unreachable"}${report.checks.browser.statusCode ? ` (HTTP ${report.checks.browser.statusCode})` : ""}`);
  if (coverage.length === 0) coverage.push("Idea-mode guidance only");
  coverageList.innerHTML = simpleListTemplate(coverage);

  const meta = [
    `Score: ${report.score}/100 (${report.grade})`,
    `Launch blockers: ${report.summary.launchBlockers}`,
    `Critical issues: ${report.summary.criticalIssues}`,
    `Checked at: ${new Date(report.timestamp).toLocaleString()}`,
  ];
  if (report.actionPlan) {
    meta.splice(
      3,
      0,
      `Action plan: ${report.actionPlan.immediate?.length || 0} must-fix · ${report.actionPlan.quickWins?.length || 0} quick wins`
    );
  }
  metadataList.innerHTML = simpleListTemplate(meta);

  const topFinding = report.findings[0];
  nextPatch.textContent = topFinding
    ? `${topFinding.title} — ${topFinding.fix}`
    : "No critical patches needed. Ship it.";

  animateScore(score);
  showReport();

  const mdLines = [
    `# Shipwright Doctor Report`,
    ``,
    `**Target:** ${target}`,
    `**Score:** ${score}/100 (${report.grade})`,
    `**Verdict:** ${verdict}`,
    `**Checked:** ${new Date(report.timestamp).toISOString()}`,
    ``,
    `## Summary`,
    `- Launch blockers: ${report.summary.launchBlockers}`,
    `- Critical issues: ${report.summary.criticalIssues}`,
    `- Improvements: ${report.summary.improvements}`,
    `- Suggestions: ${report.summary.suggestions}`,
    ``,
    `## Findings`,
    ...(report.findings || []).map((f) => `### [${f.severity}] ${f.title}\n\n- **Description:** ${f.description}\n- **Evidence:** ${f.evidence}\n- **Impact:** ${f.impact}\n- **Fix:** ${f.fix}${f.claudePrompt ? `\n- **Claude prompt:** \`${f.claudePrompt}\`` : ""}`),
  ];
  currentMarkdown = report.reportMarkdown || mdLines.join("\n");
  refreshLocalizedContent();
};

const detectBackendInputType = (raw) => {
  const v = raw.trim();
  if (/^https?:\/\/(www\.)?github\.com\//i.test(v)) return "github";
  if (/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(v)) return "github";
  if (/^https?:\/\//i.test(v)) return "url";
  if (/^#\s+/.test(v) || v.split("\n").length > 3) return "readme";
  return "github";
};

const runDoctorViaBackend = async (raw) => {
  const type = detectBackendInputType(raw);
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${BACKEND_BASE}/api/doctor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value: raw }),
      signal: controller.signal,
    });
    window.clearTimeout(timer);
    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      return { ok: false, error: errBody?.error || `Backend error ${res.status}` };
    }
    return { ok: true, report: await res.json() };
  } catch (err) {
    window.clearTimeout(timer);
    return { ok: false, error: err && err.message ? err.message : "Backend unreachable" };
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const raw = targetInput.value.trim();
  if (!raw) {
    setTargetError("Enter a GitHub repo URL, owner/repo, live URL, or README text.");
    targetInput.focus();
    return;
  }
  setTargetError();

  btnText.textContent = translateLiteral("Checking…");
  btnSpinner.hidden = false;
  analyzeBtn.disabled = true;
  reportPanel.classList.add("is-loading");

  try {
    let result = null;
    if (BACKEND_AVAILABLE === null) {
      await probeBackend();
    }
    if (BACKEND_AVAILABLE) {
      result = await runDoctorViaBackend(raw);
      if (!result.ok) {
        BACKEND_AVAILABLE = false;
        updateModeBadge();
        result = null;
      }
    }
    if (!result) {
      result = await runDoctorInBrowser(raw);
    }
    if (!result.ok) {
      setTargetError(result.error);
      return;
    }
    renderLiveReport(result.report);
    reportPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => reportPanel.focus({ preventScroll: true }), 220);
  } catch (err) {
    setTargetError(err && err.message ? err.message : "Unexpected error — please try again.");
  } finally {
    btnText.textContent = translateLiteral("Analyze launch risk");
    btnSpinner.hidden = true;
    analyzeBtn.disabled = false;
    reportPanel.classList.remove("is-loading");
  }
});

const findingById = (id) =>
  (window.__lastFindings || []).find((f) => f.id === id) || null;

const explainFindingWithAI = async (button) => {
  const id = button.dataset.findingId;
  const finding = findingById(id);
  if (!finding) {
    return;
  }

  const item = button.closest(".finding-item");
  const output = item ? item.querySelector(".ai-explain-output") : null;
  if (!output) return;

  if (typeof getAIConfig !== "function" || !hasAIKey()) {
    output.hidden = false;
    output.textContent = "Set your API key in the AI Planner settings (gear icon, bottom-right) first — Explain reuses that key locally.";
    return;
  }

  const cfg = getAIConfig();
  button.disabled = true;
  const originalLabel = button.textContent;
  button.textContent = "Explaining…";
  output.hidden = false;
  output.textContent = "";

  try {
    const res = await fetch(`${BACKEND_BASE}/api/ai-explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        finding,
        apiKey: cfg.key,
        apiBase: cfg.base,
        model: cfg.model,
      }),
    });

    if (!res.ok || !res.body) {
      const err = await res.json().catch(() => null);
      output.textContent = err && err.error ? `Error: ${err.error}` : `Error: ${res.status}`;
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let full = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") continue;
        try {
          const parsed = JSON.parse(payload);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            full += delta;
            output.textContent = full;
          }
        } catch {
          /* skip malformed lines */
        }
      }
    }
  } catch (err) {
    output.textContent = `Error: ${err && err.message ? err.message : err}`;
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
  }
};

if (findingsList) {
  findingsList.addEventListener("click", (event) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (target && target.classList.contains("ai-explain-btn")) {
      explainFindingWithAI(target);
    }
  });
}

probeBackend();

const setButtonStatus = (button, message, resetMessage) => {
  button.textContent = translateLiteral(message);
  button.disabled = true;
  window.setTimeout(() => {
    button.textContent = translateLiteral(resetMessage);
    button.disabled = false;
  }, 1600);
};

const copyText = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();

  if (!copied) {
    throw new Error("Clipboard copy failed");
  }
};

copyReport.addEventListener("click", async () => {
  if (!currentMarkdown) {
    return;
  }
  try {
    await copyText(currentMarkdown);
    setButtonStatus(copyReport, "Copied!", "Copy report");
  } catch {
    setButtonStatus(copyReport, "Copy failed", "Copy report");
  }
});

downloadReport.addEventListener("click", () => {
  if (!currentMarkdown) {
    return;
  }
  const blob = new Blob([currentMarkdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "shipwright-launch-qa-report.md";
  link.click();
  URL.revokeObjectURL(url);
});

document.querySelectorAll(".sample-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    targetInput.value = btn.dataset.url;
    projectType.value = btn.dataset.type || detectProjectType(btn.dataset.url);
    setTargetError();
    targetInput.focus();
  });
});

/* ── Hero quick-start form ── */

const heroQuickForm = document.querySelector("#heroQuickForm");
const quickInput = document.querySelector("#quickInput");
const quickError = document.querySelector("#quickError");

const setQuickError = (message = "") => {
  if (!quickInput || !quickError) return;

  quickError.textContent = message;
  quickError.hidden = !message;
  quickInput.setAttribute("aria-invalid", message ? "true" : "false");
};

if (heroQuickForm && quickInput) {
  const submitHeroForm = (url, type) => {
    const parsed = parseTarget(url);

    if (!parsed.valid) {
      setQuickError(parsed.error);
      quickInput.focus();
      return;
    }

    setQuickError();
    targetInput.value = url;
    if (type && projectProfiles[type]) {
      projectType.value = type;
    } else {
      projectType.value = detectProjectType(url);
    }
    setTargetError();

    btnText.textContent = "Analyzing…";
    btnSpinner.hidden = false;
    analyzeBtn.disabled = true;
    reportPanel.classList.add("is-loading");

    const analyzerSection = document.querySelector("#analyzer");
    if (analyzerSection) {
      analyzerSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    window.setTimeout(() => {
      const rendered = renderReport();
      btnText.textContent = "Analyze launch risk";
      btnSpinner.hidden = true;
      analyzeBtn.disabled = false;
      reportPanel.classList.remove("is-loading");

      if (rendered) {
        window.setTimeout(() => reportPanel.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
      }
    }, 800);
  };

  heroQuickForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const url = quickInput.value.trim();
    if (!url) {
      setQuickError("Paste a GitHub repository, owner/repo, or http(s) demo URL before analyzing.");
      quickInput.focus();
      return;
    }
    submitHeroForm(url);
  });

  quickInput.addEventListener("input", () => setQuickError());

  document.querySelectorAll(".quick-sample").forEach((btn) => {
    btn.addEventListener("click", () => {
      quickInput.value = btn.dataset.url;
      submitHeroForm(btn.dataset.url, btn.dataset.type);
    });
  });
}

/* ── Inspection radar waypoint details ── */

const initInspectionRadar = () => {
  const radar = document.querySelector("#inspection-radar");
  if (!radar) return;

  const nodes = [...radar.querySelectorAll(".radar-node")];
  const detailCard = radar.querySelector(".radar-detail-card");
  const code = radar.querySelector("#radarCode");
  const status = radar.querySelector("#radarStatus");
  const title = radar.querySelector("#radarTitle");
  const detail = radar.querySelector("#radarDetail");
  const risk = radar.querySelector("#radarRisk");
  const evidence = radar.querySelector("#radarEvidence");
  const patch = radar.querySelector("#radarPatch");
  const actionNote = radar.querySelector("#radarActionNote");

  if (!nodes.length || !detailCard || !code || !status || !title || !detail || !risk || !evidence || !patch) {
    return;
  }

  const setActiveNode = (node, options = {}) => {
    const { applyToAnalyzer = false } = options;

    nodes.forEach((candidate) => {
      const isActive = candidate === node;
      candidate.classList.toggle("is-active", isActive);
      candidate.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    code.textContent = node.dataset.code || "";
    status.textContent = translateLiteral(node.dataset.status || "");
    title.textContent = translateLiteral(node.dataset.title || "");
    detail.textContent = translateLiteral(node.dataset.detail || "");
    risk.textContent = translateLiteral(node.dataset.risk || "");
    evidence.textContent = translateLiteral(node.dataset.evidence || "");
    patch.textContent = translateLiteral(node.dataset.patch || "");
    detailCard.dataset.status = node.dataset.status || "";

    if (applyToAnalyzer) {
      if (node.dataset.target) {
        targetInput.value = node.dataset.target;
      }

      if (node.dataset.type && projectProfiles[node.dataset.type]) {
        projectType.value = node.dataset.type;
      }

      setTargetError();
      renderReport();

      if (actionNote) {
        actionNote.textContent = translateLiteral("Waypoint loaded into the analyzer. Review the report or run the demo audit.");
      }
    }
  };

  nodes.forEach((node) => {
    node.addEventListener("click", () => setActiveNode(node, { applyToAnalyzer: true }));
    node.addEventListener("pointerenter", () => setActiveNode(node));
    node.addEventListener("focus", () => setActiveNode(node));
  });

  setActiveNode(nodes.find((node) => node.classList.contains("is-active")) || nodes[0]);
};

const revealVariants = {
  "mission-control": "reveal-scale",
  "pain-grid": "reveal-left",
  "audience": "reveal",
  "usage-guide": "reveal",
  "inspection-radar": "reveal",
  "analyzer": "reveal",
  "ai-chat-section": "reveal-left",
  "workflow": "reveal-bounce",
  "honesty": "reveal",
  "skills-catalog": "reveal-scale",
  "cta": "reveal",
};

const initReveal = () => {
  const sections = document.querySelectorAll(
    ".mission-control, .pain-grid, .audience, .usage-guide, .inspection-radar, .analyzer, .ai-chat-section, .workflow, .honesty, .skills-catalog, .cta"
  );

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    return;
  }

  sections.forEach((section) => {
    const variant = Object.entries(revealVariants).find(([cls]) => section.classList.contains(cls));
    section.classList.add(variant ? variant[1] : "reveal");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  sections.forEach((section) => observer.observe(section));
};

/* ── Scroll progress bar ── */

const initScrollProgress = () => {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${percent}%`;

    const hue = 30 + (percent / 100) * 220;
    bar.style.background = `linear-gradient(90deg, hsl(${hue - 30}, 72%, 52%), hsl(${hue}, 60%, 48%), hsl(${hue + 30}, 55%, 55%))`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
};

/* ── Wave divider reveal ── */

const initDividers = () => {
  const dividers = document.querySelectorAll(".wave-divider");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  dividers.forEach((d) => observer.observe(d));
};

/* ── Text highlight on scroll ── */

const initTextHighlight = () => {
  const elements = document.querySelectorAll(".highlight-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => entry.target.classList.add("is-highlighted"), 300);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  elements.forEach((el) => observer.observe(el));
};

/* ── Parallax on scroll ── */

const initParallax = () => {
  const targets = [
    { el: document.querySelector(".pain-grid > div:first-child"), speed: 0.05 },
    { el: document.querySelector(".inspection-card"), speed: -0.03 },
  ].filter((t) => t.el);

  if (targets.length === 0) return;

  const update = () => {
    const scrollY = window.scrollY;
    targets.forEach(({ el, speed }) => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const offset = (center - viewCenter) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  };

  window.addEventListener("scroll", update, { passive: true });
};

/* ── Horizontal slide-in for workflow steps ── */

const initWorkflowSlides = () => {
  const steps = document.querySelectorAll(".workflow-steps article");
  if (steps.length === 0) return;

  steps.forEach((step, i) => {
    step.classList.add(i % 2 === 0 ? "slide-from-left" : "slide-from-right");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const articles = entry.target.querySelectorAll("article");
          articles.forEach((a, i) => {
            window.setTimeout(() => a.classList.add("is-slid"), i * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const wrapper = document.querySelector(".workflow-steps");
  if (wrapper) observer.observe(wrapper);
};

const initV6WorkflowState = () => {
  const steps = [...document.querySelectorAll(".workflow-step")];
  if (steps.length === 0) return;

  const setActiveStep = (current) => {
    steps.forEach((step) => {
      step.classList.toggle("is-active", step === current);
    });
  };

  steps.forEach((step) => {
    step.addEventListener("pointerenter", () => setActiveStep(step));
    step.addEventListener("focusin", () => setActiveStep(step));
    step.addEventListener("click", () => setActiveStep(step));
  });
};

/* ── Audience icon pop-in ── */

const initIconPop = () => {
  const icons = document.querySelectorAll(".audience-icon");
  icons.forEach((icon) => icon.classList.add("icon-pop"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pops = entry.target.querySelectorAll(".icon-pop");
          pops.forEach((p, i) => {
            window.setTimeout(() => p.classList.add("is-popped"), i * 120 + 200);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const section = document.querySelector(".audience-cards");
  if (section) observer.observe(section);
};

/* ── Eyebrow reveal on scroll ── */

const initEyebrowReveal = () => {
  const eyebrows = document.querySelectorAll(
    ".mission-control .eyebrow, .pain-grid .eyebrow, .audience .eyebrow, .usage-guide .eyebrow, .inspection-radar .eyebrow, .analyzer .eyebrow, .ai-chat-section .eyebrow, .workflow .eyebrow, .honesty .eyebrow, .skills-catalog .eyebrow, .cta .eyebrow"
  );

  eyebrows.forEach((eb) => eb.classList.add("eyebrow-reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.8 }
  );

  eyebrows.forEach((eb) => observer.observe(eb));
};

/* ── Back to top button ── */

const initBackToTop = () => {
  const btn = document.querySelector("#backToTop");
  if (!btn) return;

  const toggle = () => {
    const shouldShow = window.scrollY > window.innerHeight;
    if (shouldShow && btn.hidden) {
      btn.hidden = false;
    }
    btn.classList.toggle("is-visible", shouldShow);

    if (!shouldShow) {
      window.setTimeout(() => {
        if (!btn.classList.contains("is-visible")) {
          btn.hidden = true;
        }
      }, 220);
    }
  };

  window.addEventListener("scroll", toggle, { passive: true });
  toggle();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

/* ── AI Chat — BYOK (Bring Your Own Key) ── */

const AI_STORAGE_KEY = "shipwright-api-key";
const AI_STORAGE_BASE = "shipwright-api-base";
const AI_STORAGE_MODEL = "shipwright-api-model";
const AI_DEFAULT_BASE = "https://api.openai.com";
const AI_DEFAULT_MODEL = "gpt-4.1-mini";

const AI_SYSTEM_PROMPT = `You are Shipwright AI Planner, an expert website planning assistant. When a user describes a website idea, your job is to ask smart follow-up questions to clarify:
- Target users and their main pain point
- Core features (MVP scope)
- Tech stack preferences
- Design style and branding direction
- Content strategy

Ask 1-2 questions at a time. Be concise and actionable. When you have enough information (usually after 3-4 exchanges), produce a structured website creation plan with these sections:
1. Project Overview
2. Target Audience
3. Core Features (prioritized)
4. Tech Stack Recommendation
5. Page Structure
6. Design Direction
7. MVP Timeline Estimate
8. Next Steps

Write the plan in Markdown format.`;

const buildDemoPlannerResponse = (idea) => {
  const trimmedIdea = idea.trim();
  const ideaLabel = trimmedIdea.length > 120 ? `${trimmedIdea.slice(0, 120)}...` : trimmedIdea;

  return `## Website Creation Plan

### 1. Project Overview
Build a focused website around: **${ideaLabel || "your idea"}**. The first version should prove one clear promise instead of trying to become a full platform.

### 2. Target Audience To Confirm
- Who has this problem today?
- What are they using instead?
- What would make them trust the site in the first 30 seconds?

### 3. MVP Scope
- One sharp landing page with a clear hero promise
- A guided intake form or demo flow
- Proof section: example output, testimonial, screenshot, or before/after
- Simple CTA: waitlist, GitHub, contact, or demo request

### 4. Design Direction
Use an editorial product style: strong headline, clear functional zones, restrained animation, and one memorable visual metaphor tied to the user's problem.

### 5. Shipwright Review Path
After building the first version, run Shipwright on the live URL and check mobile layout, broken CTAs, README/setup clarity, fake-complete features, and launch metadata.

### 6. Next Questions
1. Who is the exact first user?
2. What action should they take after reading the first screen?
3. What proof can you show immediately?`;
};

let aiChatHistory = [];
let aiStreamController = null;

const getAIConfig = () => ({
  key: localStorage.getItem(AI_STORAGE_KEY) || "",
  base: localStorage.getItem(AI_STORAGE_BASE) || AI_DEFAULT_BASE,
  model: localStorage.getItem(AI_STORAGE_MODEL) || AI_DEFAULT_MODEL,
});

const hasAIKey = () => {
  const { key } = getAIConfig();
  return key.length > 5;
};

const simpleMarkdown = (text) =>
  escapeHtml(text)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 style="margin:12px 0 6px;font-size:1rem;">$1</h3>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, (match) => `<ul style="margin:6px 0;padding-left:18px;">${match}</ul>`)
    .replace(/\n{2,}/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');

const addMessage = (role, content, isDemo) => {
  const messagesEl = document.querySelector("#aiChatMessages");
  if (!messagesEl) return;

  const msg = document.createElement("div");
  msg.className = `ai-msg ${role}${isDemo ? " demo-tag" : ""}`;
  msg.innerHTML = role === "assistant" ? simpleMarkdown(content) : escapeHtml(content);

  if (role === "assistant" && content.includes("## ")) {
    const reviewBtn = document.createElement("button");
    reviewBtn.className = "ai-review-btn";
    reviewBtn.textContent = "Review with Shipwright";
    reviewBtn.addEventListener("click", () => {
      const analyzerSection = document.querySelector("#analyzer");
      if (analyzerSection) analyzerSection.scrollIntoView({ behavior: "smooth" });
    });
    msg.append(reviewBtn);
  }

  messagesEl.append(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
};

const showTypingIndicator = () => {
  const messagesEl = document.querySelector("#aiChatMessages");
  if (!messagesEl) return;

  const typing = document.createElement("div");
  typing.className = "ai-msg-typing";
  typing.id = "aiTyping";
  typing.innerHTML = "<span></span><span></span><span></span>";
  messagesEl.append(typing);
  messagesEl.scrollTop = messagesEl.scrollHeight;
};

const removeTypingIndicator = () => {
  const typing = document.querySelector("#aiTyping");
  if (typing) typing.remove();
};

const showDemoNotice = () => {
  const messagesEl = document.querySelector("#aiChatMessages");
  if (!messagesEl || document.querySelector("#openSettingsFromDemo")) return;

  const notice = document.createElement("div");
  notice.className = "ai-demo-notice";
  notice.innerHTML = 'Demo mode used no API key. <a id="openSettingsFromDemo">Configure your API key</a> for live planning.';
  messagesEl.append(notice);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  document.querySelector("#openSettingsFromDemo")?.addEventListener("click", () => {
    document.querySelector("#aiSettingsDialog")?.showModal();
  });
};

const sendAIMessage = async (userMessage) => {
  if (!hasAIKey()) {
    addMessage("user", userMessage, true);
    showTypingIndicator();
    await new Promise((r) => setTimeout(r, 650));
    removeTypingIndicator();
    addMessage("assistant", buildDemoPlannerResponse(userMessage), true);
    showDemoNotice();
    return;
  }

  const { key, base, model } = getAIConfig();
  const normalizedBase = base.replace(/\/+$/, "");

  aiChatHistory.push({ role: "user", content: userMessage });
  addMessage("user", userMessage, false);
  showTypingIndicator();

  const sendBtn = document.querySelector(".ai-send-btn");
  if (sendBtn) sendBtn.disabled = true;

  try {
    aiStreamController = new AbortController();

    const response = await fetch(`${normalizedBase}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: AI_SYSTEM_PROMPT },
          ...aiChatHistory,
        ],
        stream: true,
        max_tokens: 2048,
      }),
      signal: aiStreamController.signal,
    });

    if (!response.ok) {
      removeTypingIndicator();
      const errText = await response.text().catch(() => "Unknown error");
      addMessage("assistant", `API Error (${response.status}): ${errText}\n\nCheck your API key and base URL in Settings.`, false);
      if (sendBtn) sendBtn.disabled = false;
      return;
    }

    removeTypingIndicator();

    const messagesEl = document.querySelector("#aiChatMessages");
    const msgEl = document.createElement("div");
    msgEl.className = "ai-msg assistant";
    messagesEl.append(msgEl);

    let fullContent = "";
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") break;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            fullContent += delta;
            msgEl.innerHTML = simpleMarkdown(fullContent);
            messagesEl.scrollTop = messagesEl.scrollHeight;
          }
        } catch {
          // skip malformed chunks
        }
      }
    }

    if (fullContent && fullContent.includes("## ")) {
      const reviewBtn = document.createElement("button");
      reviewBtn.className = "ai-review-btn";
      reviewBtn.textContent = "Review with Shipwright";
      reviewBtn.addEventListener("click", () => {
        const analyzerSection = document.querySelector("#analyzer");
        if (analyzerSection) analyzerSection.scrollIntoView({ behavior: "smooth" });
      });
      msgEl.append(reviewBtn);
    }

    aiChatHistory.push({ role: "assistant", content: fullContent });
  } catch (err) {
    removeTypingIndicator();
    if (err.name !== "AbortError") {
      addMessage("assistant", `Connection error: ${err.message}\n\nCheck your API base URL and network connection.`, false);
    }
  } finally {
    if (sendBtn) sendBtn.disabled = false;
    aiStreamController = null;
  }
};

const initAIChatDrag = () => {
  const panel = document.querySelector("#aiChatPanel");
  const header = panel ? panel.querySelector(".ai-chat-header") : null;
  if (!panel || !header) return;

  const STORAGE_KEY = "shipwright-ai-chat-pos";
  const MOBILE_BREAKPOINT = 768;
  const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;
  let activePointerId = null;

  const clampPosition = (left, top) => {
    const maxLeft = Math.max(0, window.innerWidth - panel.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - panel.offsetHeight);
    return {
      left: Math.max(0, Math.min(left, maxLeft)),
      top: Math.max(0, Math.min(top, maxTop)),
    };
  };

  const applyPosition = (left, top) => {
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    panel.style.right = "auto";
    panel.style.bottom = "auto";
  };

  const resetToDefault = () => {
    panel.style.left = "";
    panel.style.top = "";
    panel.style.right = "";
    panel.style.bottom = "";
  };

  const restorePosition = () => {
    if (isMobile()) {
      resetToDefault();
      return;
    }
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      saved = null;
    }
    if (!saved || typeof saved.left !== "number" || typeof saved.top !== "number") return;
    const { left, top } = clampPosition(saved.left, saved.top);
    applyPosition(left, top);
  };

  const persistPosition = () => {
    const rect = panel.getBoundingClientRect();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ left: rect.left, top: rect.top }));
    } catch {
      /* localStorage may be blocked */
    }
  };

  const onPointerDown = (event) => {
    if (isMobile()) return;
    const target = event.target;
    if (target instanceof Element && target.closest("button, a, input, textarea, select")) return;
    isDragging = true;
    activePointerId = event.pointerId;
    const rect = panel.getBoundingClientRect();
    applyPosition(rect.left, rect.top);
    startX = event.clientX;
    startY = event.clientY;
    startLeft = rect.left;
    startTop = rect.top;
    header.classList.add("is-dragging");
    panel.classList.add("is-dragging");
    try {
      header.setPointerCapture(event.pointerId);
    } catch {
      /* not all browsers support pointer capture cleanly */
    }
    event.preventDefault();
  };

  const onPointerMove = (event) => {
    if (!isDragging || event.pointerId !== activePointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    const { left, top } = clampPosition(startLeft + dx, startTop + dy);
    applyPosition(left, top);
  };

  const finishDrag = (event) => {
    if (!isDragging) return;
    if (event && event.pointerId !== activePointerId) return;
    isDragging = false;
    activePointerId = null;
    header.classList.remove("is-dragging");
    panel.classList.remove("is-dragging");
    try {
      if (event && event.pointerId !== undefined) header.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    persistPosition();
  };

  header.addEventListener("pointerdown", onPointerDown);
  header.addEventListener("pointermove", onPointerMove);
  header.addEventListener("pointerup", finishDrag);
  header.addEventListener("pointercancel", finishDrag);

  header.addEventListener("dblclick", (event) => {
    if (event.target instanceof Element && event.target.closest("button")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    resetToDefault();
  });

  const observer = new MutationObserver(() => {
    if (!panel.hasAttribute("hidden")) restorePosition();
  });
  observer.observe(panel, { attributes: true, attributeFilter: ["hidden"] });

  window.addEventListener("resize", () => {
    if (panel.hasAttribute("hidden")) return;
    if (isMobile()) {
      resetToDefault();
      return;
    }
    const rect = panel.getBoundingClientRect();
    const { left, top } = clampPosition(rect.left, rect.top);
    applyPosition(left, top);
  });

  if (!panel.hasAttribute("hidden")) restorePosition();
};

const initAIChat = () => {
  const fab = document.querySelector("#aiChatFab");
  const panel = document.querySelector("#aiChatPanel");
  const closeBtn = document.querySelector("#aiChatClose");
  const settingsBtn = document.querySelector("#aiSettingsBtn");
  const dialog = document.querySelector("#aiSettingsDialog");
  const chatForm = document.querySelector("#aiChatForm");
  const chatInput = document.querySelector("#aiChatInput");
  const sectionBtn = document.querySelector("#openAiChatFromSection");
  const cancelBtn = document.querySelector("#aiSettingsCancel");

  if (!fab || !panel) return;

  const openPanel = () => {
    panel.hidden = false;
    fab.style.display = "none";
    fab.setAttribute("aria-expanded", "true");
    sectionBtn?.setAttribute("aria-expanded", "true");
    chatInput?.focus();

    if (!document.querySelector("#aiChatMessages")?.children.length) {
      if (hasAIKey()) {
        addMessage("assistant", "Hi! I'm Shipwright AI Planner. Tell me about the website you want to build, and I'll ask the right questions to help you create a complete plan.\n\nWhat's your idea?", false);
      } else {
        addMessage("assistant", "Describe the website you want to build. Demo mode will turn your idea into a starter plan without using an API key. Add your own key in Settings when you want live follow-up questions.", true);
      }
    }
  };

  const closePanel = () => {
    panel.hidden = true;
    fab.style.display = "";
    fab.setAttribute("aria-expanded", "false");
    sectionBtn?.setAttribute("aria-expanded", "false");
    toggleFabVisibility();
  };

  const toggleFabVisibility = () => {
    const nearTopOnMobile = window.innerWidth <= 680 && window.scrollY < window.innerHeight * 0.55;
    fab.classList.toggle("is-suppressed", nearTopOnMobile && panel.hidden);
  };

  fab.addEventListener("click", openPanel);
  closeBtn?.addEventListener("click", closePanel);
  sectionBtn?.addEventListener("click", openPanel);
  fab.setAttribute("aria-controls", "aiChatPanel");
  fab.setAttribute("aria-expanded", "false");
  sectionBtn?.setAttribute("aria-controls", "aiChatPanel");
  sectionBtn?.setAttribute("aria-expanded", "false");

  window.addEventListener("scroll", toggleFabVisibility, { passive: true });
  window.addEventListener("resize", toggleFabVisibility);
  toggleFabVisibility();

  settingsBtn?.addEventListener("click", () => dialog?.showModal());
  cancelBtn?.addEventListener("click", () => dialog?.close());

  const apiKeyInput = document.querySelector("#aiApiKey");
  const baseUrlInput = document.querySelector("#aiBaseUrl");
  const modelInput = document.querySelector("#aiModel");

  if (dialog) {
    dialog.addEventListener("close", () => {});

    const saveBtn = document.querySelector("#aiSettingsSave");
    saveBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const key = apiKeyInput?.value.trim() || "";
      const base = baseUrlInput?.value.trim() || AI_DEFAULT_BASE;
      const model = modelInput?.value.trim() || AI_DEFAULT_MODEL;

      if (key) localStorage.setItem(AI_STORAGE_KEY, key);
      else localStorage.removeItem(AI_STORAGE_KEY);

      localStorage.setItem(AI_STORAGE_BASE, base);
      localStorage.setItem(AI_STORAGE_MODEL, model);
      dialog.close();

      const messagesEl = document.querySelector("#aiChatMessages");
      if (messagesEl) {
        messagesEl.innerHTML = "";
        aiChatHistory = [];
        if (hasAIKey()) {
          addMessage("assistant", "Settings saved! Tell me about the website you want to build.", false);
        }
      }
    });

    const config = getAIConfig();
    if (apiKeyInput) apiKeyInput.value = config.key;
    if (baseUrlInput) baseUrlInput.value = config.base;
    if (modelInput) modelInput.value = config.model;
  }

  chatForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = chatInput?.value.trim();
    if (!message) return;
    chatInput.value = "";
    chatInput.style.height = "auto";
    sendAIMessage(message);
  });

  chatInput?.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
  });

  chatInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm?.requestSubmit();
    }
  });
};

/* ── Feature navigation with active tracking ── */

const initFeatureNav = () => {
  const nav = document.querySelector("#featureNav");
  if (!nav) return;

  const buttons = [...nav.querySelectorAll(".feature-nav-btn")];
  const sectionIds = buttons.map((btn) => btn.dataset.target).filter(Boolean);
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  if (sections.length === 0) return;

  const centerActiveButton = (button) => {
    const navRect = nav.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const currentLeft = nav.scrollLeft;
    const buttonCenter = buttonRect.left - navRect.left + currentLeft + buttonRect.width / 2;
    const targetLeft = buttonCenter - nav.clientWidth / 2;

    nav.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          buttons.forEach((btn) => {
            btn.classList.toggle("is-active", btn.dataset.target === id);
          });

          if (window.innerWidth <= 680) {
            const activeBtn = buttons.find((btn) => btn.dataset.target === id);
            if (activeBtn) {
              centerActiveButton(activeBtn);
            }
          }
        }
      });
    },
    { threshold: 0.2, rootMargin: "-80px 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
};

/* ═══════════════════════════════════════════════════════════════
 *  v4.0 — Font variety + richer interactions
 * ═══════════════════════════════════════════════════════════════ */

/* Split-letter hero h1 reveal. Wraps each word in .h1-word, each
 * non-space character in .h1-letter, then toggles .is-letters-in
 * to trigger the staggered transition (via transition-delay). */
const initHeroSplitH1 = () => {
  const h1 = document.querySelector(".hero h1");
  if (!h1 || h1.dataset.split === "true") return;
  const original = h1.textContent || "";
  h1.textContent = "";

  const accentWordIndex = Math.floor(Math.random() * 3); // randomize which "word" gets italic accent on each load
  const words = original.split(/\s+/);
  let letterIdx = 0;

  words.forEach((word, wIdx) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "h1-word";
    if (wIdx === Math.max(2, accentWordIndex + 2)) wordSpan.classList.add("h1-word--accent");
    for (const ch of word) {
      const letter = document.createElement("span");
      letter.className = "h1-letter";
      if (wordSpan.classList.contains("h1-word--accent")) letter.classList.add("accent");
      letter.style.transitionDelay = `${30 + letterIdx * 22}ms`;
      letter.textContent = ch;
      wordSpan.appendChild(letter);
      letterIdx++;
    }
    h1.appendChild(wordSpan);
  });

  h1.dataset.split = "true";

  // kick the animation on the next frame so styles apply
  requestAnimationFrame(() => {
    requestAnimationFrame(() => h1.classList.add("is-letters-in"));
  });
};

/* Word cycling — element with data-words="a|b|c" rotates through
 * each option with a flip animation. */
const initCycleWords = () => {
  const nodes = document.querySelectorAll(".cycle-word[data-words]");
  nodes.forEach((node) => {
    if (node.dataset.cycleTimer) {
      window.clearInterval(Number(node.dataset.cycleTimer));
    }
    const words = String(node.dataset.words || "").split("|").map((w) => w.trim()).filter(Boolean);
    if (words.length < 2) return;
    let i = 0;
    node.textContent = words[i];
    const tick = () => {
      node.classList.add("is-swapping");
      window.setTimeout(() => {
        i = (i + 1) % words.length;
        node.textContent = words[i];
      }, 190);
      window.setTimeout(() => node.classList.remove("is-swapping"), 380);
    };
    node.dataset.cycleTimer = String(window.setInterval(tick, 2400));
  });
};

/* Custom cursor follower (desktop only). Grows on interactive elements,
 * morphs into a beam on text fields. */
const initCursorFollower = () => {
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
  const follower = document.createElement("div");
  follower.className = "cursor-follower";
  follower.setAttribute("aria-hidden", "true");
  document.body.appendChild(follower);

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  const onMove = (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    follower.classList.add("is-active");
  };
  const onLeave = () => follower.classList.remove("is-active");

  window.addEventListener("pointermove", onMove);
  document.addEventListener("pointerleave", onLeave);
  window.addEventListener("blur", onLeave);

  const tick = () => {
    currentX += (targetX - currentX) * 0.22;
    currentY += (targetY - currentY) * 0.22;
    follower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const INTERACTIVE = "a, button, .feature-nav-btn, .quick-sample, .sample-btn, .button, .ai-explain-btn, .skill-card, .skill-tile, .mission-card, summary, [role='button']";
  const TEXT_INPUT = "input[type='text'], input[type='url'], input[type='email'], input[type='password'], textarea";

  document.addEventListener("pointerover", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    follower.classList.remove("is-pointer", "is-text");
    if (target.closest(TEXT_INPUT)) {
      follower.classList.add("is-text");
    } else if (target.closest(INTERACTIVE)) {
      follower.classList.add("is-pointer");
    }
  });
};

/* Section number badges — animate the bar/number on enter. */
const initSectionNumbers = () => {
  const nums = document.querySelectorAll(".section-num");
  if (!nums.length || !("IntersectionObserver" in window)) {
    nums.forEach((n) => n.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  nums.forEach((n) => observer.observe(n));
};

/* Apply magnetic effect to every primary CTA, not just hero. The
 * existing initMagneticButtons() targets .button.primary — broaden
 * its reach. */
const initMagneticEverywhere = () => {
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
  const targets = document.querySelectorAll(".button.primary, .quick-sample, .feature-nav-btn, .ai-chat-fab, .ai-explain-btn");
  targets.forEach((el) => {
    if (el.dataset.magneticBound === "true") return;
    el.dataset.magneticBound = "true";
    let rafId = 0;
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.setProperty("--magnetic-x", `${x * 0.25}px`);
        el.style.setProperty("--magnetic-y", `${y * 0.25}px`);
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
    });
    el.addEventListener("pointerleave", () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transform = "";
    });
  });
};

/* ═══════════════════════════════════════════════════════════════
 *  Brand & audience wizard — questionnaire that combines user
 *  goals + current state + 2026 trends and asks the AI to produce
 *  a structured diagnostic report. Uses the existing AI Planner
 *  BYOK config from localStorage. Streams the response.
 * ═══════════════════════════════════════════════════════════════ */

const BRAND_VIBE_LABELS = {
  trust: "Trustworthy / Enterprise",
  edgy: "Edgy / Bold",
  playful: "Playful / Indie",
  zen: "Calm / Zen",
  tech: "Futuristic / Tech",
  craft: "Crafted / Artisan",
  editorial: "Editorial / Magazine",
  raw: "Raw / Brutalist",
};
const BRAND_GOAL_LABELS = {
  signup: "Email / waitlist signup",
  trial: "Free trial → paid conversion",
  purchase: "One-time purchase",
  github: "GitHub stars / installs",
  demo: "Book a demo",
  community: "Join the community",
  awareness: "Awareness / Education",
};
const BRAND_PROJECT_LABELS = {
  landing: "Landing page",
  webapp: "Web app / SaaS",
  tool: "Developer tool",
  docs: "Docs / Content site",
  portfolio: "Portfolio",
  community: "Community / Forum",
  ecommerce: "E-commerce",
  other: "Other",
};
const BRAND_STAGE_LABELS = {
  idea: "Just an idea",
  building: "Building MVP",
  prelaunch: "Pre-launch",
  live: "Live with a few users",
  iterating: "Live, actively iterating",
};
const BRAND_AUDIENCE_LABELS = {
  developers: "Developers",
  designers: "Designers",
  indie: "Indie hackers",
  founders: "Startup founders",
  b2b: "B2B buyers / PMs",
  creators: "Content creators",
  students: "Students / Learners",
  general: "General consumers",
};
const BRAND_TECH_LABELS = {
  technical: "Very technical",
  mixed: "Mixed",
  "non-technical": "Non-technical",
};

const BRAND_WIZARD_TOTAL_STEPS = 5;

const initBrandWizard = () => {
  const wizard = document.querySelector("#brandWizard");
  if (!wizard) return;

  const progress = wizard.querySelector("#brandWizardProgress");
  const stepsContainer = wizard.querySelector("#brandWizardSteps");
  const allSteps = wizard.querySelectorAll(".brand-step");
  const backBtn = wizard.querySelector("#bwBack");
  const nextBtn = wizard.querySelector("#bwNext");
  const submitBtn = wizard.querySelector("#bwSubmit");
  const note = wizard.querySelector("#bwNote");
  const report = wizard.querySelector("#brandReport");
  const reportBody = wizard.querySelector("#brandReportBody");
  const restartBtn = wizard.querySelector("#bwRestart");
  const copyBtn = wizard.querySelector("#bwCopy");
  const downloadBtn = wizard.querySelector("#bwDownload");

  let currentStep = 1;
  const state = {
    url: "",
    projectType: "",
    stage: "",
    audience: [],
    techLevel: "",
    audienceNotes: "",
    goal: "",
    success: "",
    vibes: [],
    references: "",
    working: "",
    frustration: "",
  };

  /* ─── chip group selection logic ─── */
  wizard.querySelectorAll(".chip-group").forEach((group) => {
    const name = group.dataset.name;
    const mode = group.dataset.mode || "single";
    const max = group.dataset.max ? parseInt(group.dataset.max, 10) : Infinity;
    group.addEventListener("click", (event) => {
      const target = event.target instanceof HTMLElement ? event.target.closest(".chip") : null;
      if (!target) return;
      const value = target.dataset.value;
      if (mode === "single") {
        group.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("is-selected"));
        target.classList.add("is-selected");
        state[name] = value;
      } else {
        const list = Array.isArray(state[name]) ? state[name] : [];
        if (target.classList.contains("is-selected")) {
          target.classList.remove("is-selected");
          state[name] = list.filter((v) => v !== value);
        } else if (list.length >= max) {
          // bump first selection to make room
          const first = group.querySelector(".chip.is-selected");
          if (first) first.classList.remove("is-selected");
          state[name] = list.slice(1).concat(value);
          target.classList.add("is-selected");
        } else {
          target.classList.add("is-selected");
          state[name] = list.concat(value);
        }
      }
    });
  });

  /* ─── free-text inputs sync ─── */
  const bindText = (id, key) => {
    const el = wizard.querySelector(id);
    if (!el) return;
    el.addEventListener("input", () => { state[key] = el.value; });
  };
  bindText("#bwUrl", "url");
  bindText("#bwAudienceNotes", "audienceNotes");
  bindText("#bwSuccess", "success");
  bindText("#bwReferences", "references");
  bindText("#bwWorking", "working");
  bindText("#bwFrustration", "frustration");

  /* ─── validation per step ─── */
  const validateStep = (step) => {
    switch (step) {
      case 1: return state.projectType && state.stage;
      case 2: return state.audience.length > 0 && state.techLevel;
      case 3: return !!state.goal;
      case 4: return state.vibes.length > 0;
      case 5: return true; // free text optional
      default: return true;
    }
  };

  const showStepError = (msg) => {
    note.textContent = msg;
    note.style.color = "var(--copper, #c86b3c)";
    window.setTimeout(() => {
      note.style.color = "";
      updateNote();
    }, 2400);
  };

  /* ─── step navigation ─── */
  const goToStep = (step) => {
    currentStep = Math.max(1, Math.min(BRAND_WIZARD_TOTAL_STEPS, step));
    allSteps.forEach((s) => {
      s.classList.toggle("is-active", parseInt(s.dataset.step, 10) === currentStep);
    });
    progress.querySelectorAll("li").forEach((li) => {
      const n = parseInt(li.dataset.step, 10);
      li.classList.remove("is-active", "is-done");
      if (n < currentStep) li.classList.add("is-done");
      else if (n === currentStep) li.classList.add("is-active");
    });
    backBtn.hidden = currentStep === 1;
    nextBtn.hidden = currentStep === BRAND_WIZARD_TOTAL_STEPS;
    submitBtn.hidden = currentStep !== BRAND_WIZARD_TOTAL_STEPS;
    updateNote();
  };

  const updateNote = () => {
    if (currentStep === BRAND_WIZARD_TOTAL_STEPS) {
      note.textContent = hasAIKey()
        ? "ready to generate — uses your AI Planner key"
        : "you'll need an AI key (gear icon, bottom-right)";
    } else {
      note.textContent = `step ${currentStep} of ${BRAND_WIZARD_TOTAL_STEPS}`;
    }
  };

  nextBtn.addEventListener("click", () => {
    if (!validateStep(currentStep)) {
      showStepError("pick at least one option before moving on");
      return;
    }
    goToStep(currentStep + 1);
  });
  backBtn.addEventListener("click", () => goToStep(currentStep - 1));

  /* ─── prompt builder ─── */
  const buildPrompt = () => {
    const lookup = (map, val) => map[val] || val || "(not specified)";
    const audList = state.audience.map((a) => lookup(BRAND_AUDIENCE_LABELS, a)).join(", ") || "(not specified)";
    const vibesList = state.vibes.map((v) => lookup(BRAND_VIBE_LABELS, v)).join(", ") || "(not specified)";

    return [
      `# User intake`,
      ``,
      `**Project URL / repo:** ${state.url || "(not provided)"}`,
      `**Project type:** ${lookup(BRAND_PROJECT_LABELS, state.projectType)}`,
      `**Stage:** ${lookup(BRAND_STAGE_LABELS, state.stage)}`,
      ``,
      `**Audience:** ${audList}`,
      `**Tech level:** ${lookup(BRAND_TECH_LABELS, state.techLevel)}`,
      state.audienceNotes ? `**Audience notes:** ${state.audienceNotes}` : "",
      ``,
      `**Primary goal:** ${lookup(BRAND_GOAL_LABELS, state.goal)}`,
      state.success ? `**Success in 90 days:** ${state.success}` : "",
      ``,
      `**Desired vibes:** ${vibesList}`,
      state.references ? `**Reference sites:** ${state.references}` : "",
      ``,
      state.working ? `**What's working (preserve):** ${state.working}` : "",
      state.frustration ? `**Current frustrations:** ${state.frustration}` : "",
    ].filter(Boolean).join("\n");
  };

  const SYSTEM_PROMPT = `You are Shipwright's senior product strategist. You combine the eye of a brand designer, the discipline of a conversion-focused product manager, and current 2026 web design literacy (Awwwards, Mobbin, indie hackers, Linear-style minimalism, editorial brutalism, AI-first product surfaces).

The user has just answered a 5-step intake. Produce a customized diagnostic report in **Chinese (Simplified)** using GitHub-flavored Markdown. Be SPECIFIC, not generic — quote actual headlines, CTAs, section names, and copy you would write for this user. Use the user's stated goal and audience to anchor every recommendation.

Output MUST use this structure (with these exact section headings, but you may add subheadings within each):

## 1. 受众契合度 (Audience Fit) — Score X/10
- One short sentence diagnosing the gap between stated audience and likely current site
- 3 SPECIFIC mismatches — for each give a copy-paste fix (concrete headline, button copy, or section)

## 2. 风格匹配 (Vibe Alignment) — Score X/10
- Compare desired vibes vs likely current state
- 3 concrete visual/copy moves to shift the vibe (e.g., "swap Bodoni for Söhne", "replace abstract hero illustration with a single product screenshot")
- Call out which elements should be kept

## 3. 2026 趋势对齐 (Current Trends)
Pick 3 trends from 2026 web design relevant to this project type & audience. For each:
- What the trend is in 1 sentence
- Whether the user is likely doing it
- One specific implementation step

## 4. 内容建议 (Content Additions)
List 5–7 specific content sections/pages/features to add or rework. For each:
- **Section title** (the actual name to use)
- Why this matters for their audience & goal
- Sample copy (1–2 lines, ready to paste)

## 5. 创新方向 (Innovation Bets)
3 differentiation moves that match this project's audience & vibe. For each:
- The bet in one sentence
- First implementation step (24 hours of work)
- Risk / reward

## 6. 技术与维护优先级 (Tech & Maintenance)
3 technical priorities that COMPLEMENT the content changes above. Brief, actionable.

Rules:
- No filler ("In conclusion...", "Hope this helps").
- No generic advice ("be authentic", "know your user"). Always be specific.
- Address the user as 你.
- Use the user's audience vocabulary. If they said "indie hackers", say "indie hackers", not "users".
- Keep total output under 1200 Chinese characters worth of substance.`;

  /* ─── AI streaming call ─── */
  submitBtn.addEventListener("click", async () => {
    if (!validateStep(5)) return;
    if (!hasAIKey()) {
      showStepError("配置你的 API key（右下角齿轮）后再试");
      return;
    }

    const cfg = getAIConfig();
    const userMessage = buildPrompt();

    wizard.classList.add("is-generating");
    submitBtn.disabled = true;
    submitBtn.textContent = translateLiteral("Generating…");
    report.hidden = false;
    reportBody.innerHTML = "<p class=\"brand-report-loading\">Generating</p>";
    report.scrollIntoView({ behavior: "smooth", block: "start" });

    let accumulated = "";
    try {
      const res = await fetch(`${cfg.base.replace(/\/+$/, "")}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cfg.key}`,
        },
        body: JSON.stringify({
          model: cfg.model,
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
        }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 400)}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              reportBody.innerHTML = simpleMarkdown(accumulated) + "<span class=\"brand-report-loading\"></span>";
            }
          } catch { /* skip malformed lines */ }
        }
      }

      reportBody.innerHTML = simpleMarkdown(accumulated);
      wizard.dataset.lastReport = accumulated;
    } catch (err) {
      reportBody.innerHTML = `<p class="brand-report-empty">报错了：${escapeHtml(err && err.message ? err.message : String(err))}<br><br>检查右下角齿轮里的 API key / Base URL / Model 是否正确，然后再试一次。</p>`;
    } finally {
      wizard.classList.remove("is-generating");
      submitBtn.disabled = false;
      submitBtn.textContent = translateLiteral("Generate report");
    }
  });

  /* ─── restart / copy / download ─── */
  restartBtn?.addEventListener("click", () => {
    report.hidden = true;
    reportBody.innerHTML = "";
    goToStep(1);
  });

  copyBtn?.addEventListener("click", async () => {
    const text = wizard.dataset.lastReport || reportBody.textContent || "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = translateLiteral("Copied!");
      window.setTimeout(() => (copyBtn.textContent = translateLiteral("Copy report")), 1600);
    } catch {
      copyBtn.textContent = translateLiteral("Copy failed");
      window.setTimeout(() => (copyBtn.textContent = translateLiteral("Copy report")), 1600);
    }
  });

  downloadBtn?.addEventListener("click", () => {
    const text = wizard.dataset.lastReport || "";
    if (!text) return;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shipwright-brand-report.md";
    a.click();
    URL.revokeObjectURL(url);
  });

  /* initial state */
  goToStep(1);
};

/* ═══════════════════════════════════════════════════════════════
 *  Launch Console — turn the Doctor + Brand wizard reports into
 *  ready-to-ship release notes, Twitter thread, and Reddit draft;
 *  optional one-click GitHub draft release via user-supplied PAT.
 *  Reuses simpleMarkdown / escapeHtml / getAIConfig / hasAIKey.
 * ═══════════════════════════════════════════════════════════════ */

const LC_STORAGE_GITHUB_PAT = "shipwright-github-pat";
const LC_SUB_REDDIT_DEFAULT = "SideProject";

const LC_SYSTEM_PROMPT = `You are Shipwright's Launch Communications Officer. You write ship-ready launch copy for indie / AI-built projects.

The user will give you launch context (project URL, audience, vibe, goal, doctor findings count, version, tone). Produce a SINGLE response with FOUR sections separated by these exact markers (and nothing else between them — no preamble, no closing remarks):

===RELEASE_NOTES===
A GitHub Markdown release notes document. Structure:
## What's new
- 3-6 bullets, action-first, concrete
## Fixes & polish
- 0-4 bullets if relevant, derived from the doctor findings count
## Try it
A short paragraph with the project URL.
## What's next
- 2-3 bullets, briefly

===TWITTER_THREAD===
A JSON array of 3-5 strings. Each string is ONE tweet, max 270 characters (count carefully). First tweet is a hook (no link). Last tweet ends with a clear CTA and the project URL on its own line. Don't number the tweets in the text — the order is implicit. Output the JSON array directly, e.g. ["first tweet", "second tweet", "..."].

===REDDIT_TITLE===
Single line, max 200 characters. Match Reddit r/SideProject and r/indiehackers culture (honest, specific, not hypey unless the user picked the "hype" tone).

===REDDIT_BODY===
Markdown body, 300-500 words. Sections:
**What it is** (2-3 sentences)
**Why I built it** (motivation, audience-specific)
**How it works / tech stack** (concrete, brief)
**What I'd love feedback on** (specific questions)
End with the project URL on its own line.

Rules:
- Match the user's stated tone exactly.
- Use the user's audience vocabulary.
- No filler phrases.
- Do NOT wrap the four sections in code fences.
- The four markers MUST appear exactly as shown, on their own line, in this order.`;

const initLaunchConsole = () => {
  const root = document.querySelector("#launch-console");
  if (!root) return;

  /* ─── DOM lookups ─── */
  const launchBtn   = root.querySelector("#lcLaunchBtn");
  const launchLabel = root.querySelector("#lcLaunchLabel");
  const launchSub   = root.querySelector("#lcLaunchSub");
  const launchNote  = root.querySelector("#lcLaunchNote");
  const mainLed     = root.querySelector("#lcMainLed");
  const mainLabel   = root.querySelector("#lcMainLabel");
  const mainMeta    = root.querySelector("#lcMainMeta");
  const checklist   = root.querySelector("#lcChecklist");

  const urlInput     = root.querySelector("#lcUrl");
  const versionInput = root.querySelector("#lcVersion");
  const titleInput   = root.querySelector("#lcTitle");

  const tabs  = root.querySelectorAll(".lc-tab");
  const panes = root.querySelectorAll(".lc-tab-pane");

  const releaseEmpty   = root.querySelector("#lcReleaseEmpty");
  const releaseBody    = root.querySelector("#lcReleaseBody");
  const releaseActions = root.querySelector("#lcReleaseActions");
  const githubPushBtn  = root.querySelector("#lcGithubPushBtn");

  const twitterEmpty   = root.querySelector("#lcTwitterEmpty");
  const tweetList      = root.querySelector("#lcTweetList");
  const twitterActions = root.querySelector("#lcTwitterActions");
  const twitterIntent  = root.querySelector("#lcTwitterIntent");

  const redditEmpty   = root.querySelector("#lcRedditEmpty");
  const redditBody    = root.querySelector("#lcRedditBody");
  const redditActions = root.querySelector("#lcRedditActions");
  const subGroup      = root.querySelector(".lc-sub-group");
  const subCustomWrap = root.querySelector("#lcSubCustomWrap");
  const subCustom     = root.querySelector("#lcSubCustom");
  const redditTitleEl = root.querySelector("#lcRedditTitle");
  const redditBodyEl  = root.querySelector("#lcRedditBodyText");
  const redditIntent  = root.querySelector("#lcRedditIntent");

  /* GitHub dialog */
  const dialog          = root.querySelector("#lcGithubDialog");
  const dialogClose     = root.querySelector("#lcGithubDialogClose");
  const dialogCancel    = root.querySelector("#lcGithubCancel");
  const dialogConfirm   = root.querySelector("#lcGithubConfirm");
  const patInput        = root.querySelector("#lcGithubPat");
  const repoInput       = root.querySelector("#lcGithubRepo");
  const dialogStatus    = root.querySelector("#lcGithubStatus");

  /* ─── state ─── */
  const state = {
    tone: "professional",
    subreddit: LC_SUB_REDDIT_DEFAULT,
    parsed: null,
    lastRaw: "",
  };

  /* ─── tone / subreddit chip groups ─── */
  root.querySelectorAll(".lc-tone-group").forEach((group) => {
    const name = group.dataset.name;
    group.addEventListener("click", (event) => {
      const chip = event.target instanceof Element ? event.target.closest(".lc-tone-chip") : null;
      if (!chip) return;
      group.querySelectorAll(".lc-tone-chip").forEach((c) => c.classList.remove("is-selected"));
      chip.classList.add("is-selected");
      state[name] = chip.dataset.value;
      if (name === "subreddit") {
        if (subCustomWrap) subCustomWrap.hidden = chip.dataset.value !== "custom";
      }
    });
  });

  /* ─── tab switching ─── */
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.tab;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      panes.forEach((p) => p.classList.toggle("is-active", p.dataset.pane === id));
    });
  });

  /* ─── pre-flight checklist ─── */
  const setCheck = (key, ok, text) => {
    const li = checklist.querySelector(`[data-key="${key}"]`);
    if (!li) return;
    li.classList.toggle("is-ok", ok);
    li.classList.toggle("is-empty", !ok);
    const valueEl = li.querySelector(".lc-check-value");
    if (valueEl) {
      valueEl.textContent = ok && text ? text : (valueEl.dataset.emptyText || "—");
    }
  };

  const refreshChecklist = () => {
    const url = (urlInput && urlInput.value) ||
      (document.querySelector("#bwUrl") && document.querySelector("#bwUrl").value) ||
      (document.querySelector("#targetInput") && document.querySelector("#targetInput").value) ||
      "";
    setCheck("repo", Boolean(url.trim()), url.trim().slice(0, 36));

    setCheck("ai", typeof hasAIKey === "function" && hasAIKey(), "configured");

    const findings = Array.isArray(window.__lastFindings) ? window.__lastFindings : null;
    if (findings) {
      const deduct = { P0: 25, P1: 15, P2: 8, P3: 3 };
      let s = 100;
      for (const f of findings) s -= deduct[f.severity] || 0;
      s = Math.max(0, Math.min(100, s));
      const grade = s >= 90 ? "A" : s >= 75 ? "B" : s >= 60 ? "C" : s >= 40 ? "D" : "F";
      setCheck("audit", true, `${s}/100 · ${grade}`);
    } else {
      setCheck("audit", false);
    }

    const brandWizard = document.querySelector("#brandWizard");
    const brandDone = brandWizard && brandWizard.dataset.lastReport;
    setCheck("brand", Boolean(brandDone), brandDone ? "completed" : "");
  };

  /* keep checklist in sync when inputs / external events change */
  refreshChecklist();
  ["#bwUrl", "#targetInput", "#lcUrl"].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) el.addEventListener("input", refreshChecklist);
  });
  window.addEventListener("storage", refreshChecklist);
  document.addEventListener("shipwright:ai-config-updated", refreshChecklist);
  document.addEventListener("shipwright:doctor-finished", refreshChecklist);
  document.addEventListener("shipwright:brand-finished", refreshChecklist);

  /* auto-fill the manifest URL from earlier inputs if user hasn't typed */
  const seedUrl = () => {
    if (urlInput && !urlInput.value) {
      const bw = document.querySelector("#bwUrl");
      const ti = document.querySelector("#targetInput");
      const seed = (bw && bw.value) || (ti && ti.value) || "";
      if (seed) urlInput.value = seed;
    }
  };
  seedUrl();
  if (urlInput) urlInput.addEventListener("focus", seedUrl);

  /* ─── helpers: GitHub URL parse, copy, download ─── */
  const parseRepoFromAnything = (raw) => {
    if (!raw) return null;
    const cleaned = String(raw).trim().replace(/\.git$/i, "").replace(/[?#].*$/, "").replace(/\/+$/, "");
    let m = cleaned.match(/github\.com\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)/);
    if (m) return { owner: m[1], repo: m[2] };
    m = cleaned.match(/^([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)$/);
    if (m) return { owner: m[1], repo: m[2] };
    return null;
  };

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  };

  const flashAction = (btn, msg) => {
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = msg;
    window.setTimeout(() => (btn.textContent = orig), 1500);
  };

  const downloadMd = (filename, contents) => {
    const blob = new Blob([contents], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ─── parser: split AI raw output by ===KEY=== markers ─── */
  const parseLaunchOutput = (raw) => {
    const out = { releaseNotes: "", tweets: [], redditTitle: "", redditBody: "", rawLeftover: "" };
    const MARKERS = ["RELEASE_NOTES", "TWITTER_THREAD", "REDDIT_TITLE", "REDDIT_BODY"];
    const blocks = {};

    for (let i = 0; i < MARKERS.length; i++) {
      const key = MARKERS[i];
      const startIdx = raw.indexOf(`===${key}===`);
      if (startIdx === -1) continue;
      const contentStart = startIdx + key.length + 6; // === is 3 + 3
      let contentEnd;
      if (i + 1 < MARKERS.length) {
        contentEnd = raw.indexOf(`===${MARKERS[i + 1]}===`, contentStart);
        if (contentEnd === -1) contentEnd = raw.length;
      } else {
        contentEnd = raw.length;
      }
      blocks[key] = raw.slice(contentStart, contentEnd).trim();
    }

    out.releaseNotes = blocks.RELEASE_NOTES || "";
    const tweetsBlock = blocks.TWITTER_THREAD || "";
    if (tweetsBlock) {
      const stripped = tweetsBlock.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
      try {
        const arr = JSON.parse(stripped);
        if (Array.isArray(arr)) out.tweets = arr.map((s) => String(s));
      } catch {
        out.tweets = stripped.split(/\n{2,}/).map((s) => s.replace(/^\d+[\.)]\s*/, "").trim()).filter(Boolean);
      }
    }
    out.redditTitle = blocks.REDDIT_TITLE || "";
    out.redditBody  = blocks.REDDIT_BODY  || "";
    if (!out.releaseNotes && !out.tweets.length && !out.redditTitle && !out.redditBody) {
      out.rawLeftover = raw;
    }
    return out;
  };

  /* ─── pre-flight summary for the AI prompt ─── */
  const buildLaunchPrompt = () => {
    const url = (urlInput && urlInput.value.trim()) || "";
    const version = (versionInput && versionInput.value.trim()) || "v1.0.0";
    const title = (titleInput && titleInput.value.trim()) || "Launch";

    const findings = Array.isArray(window.__lastFindings) ? window.__lastFindings : [];
    const counts = findings.reduce((acc, f) => {
      acc[f.severity] = (acc[f.severity] || 0) + 1;
      return acc;
    }, {});

    const brandWizard = document.querySelector("#brandWizard");
    const brandReport = brandWizard && brandWizard.dataset.lastReport;
    const brandSummary = brandReport ? brandReport.slice(0, 1200) : "(brand wizard not completed; infer reasonable defaults)";

    return [
      "## Launch context",
      `- Project URL / repo: ${url || "(not provided)"}`,
      `- Version tag: ${version}`,
      `- Release title: ${title}`,
      `- Tone: ${state.tone}`,
      "",
      "## Doctor findings count",
      `- P0 (launch blockers): ${counts.P0 || 0}`,
      `- P1 (critical): ${counts.P1 || 0}`,
      `- P2 (improvements): ${counts.P2 || 0}`,
      `- P3 (suggestions): ${counts.P3 || 0}`,
      "",
      "## Brand fit report (summary, may be empty)",
      brandSummary,
    ].join("\n");
  };

  /* ─── countdown animation + abort guard ─── */
  let isLaunching = false;

  const animateCountdown = async () => {
    launchBtn.disabled = true;
    launchBtn.classList.add("is-counting");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const steps = reducedMotion ? ["IGNITION"] : ["T-3", "T-2", "T-1", "IGNITION"];
    for (const s of steps) {
      launchLabel.textContent = s;
      launchSub.textContent = s === "IGNITION" ? "stream incoming" : "stand by";
      await new Promise((r) => window.setTimeout(r, reducedMotion ? 80 : 360));
    }
  };

  const resetLaunchBtn = () => {
    launchBtn.classList.remove("is-counting");
    launchBtn.disabled = false;
    launchLabel.textContent = "Initiate Launch Sequence";
    launchSub.textContent = "ready to re-run";
  };

  const setNote = (msg, kind) => {
    launchNote.textContent = msg;
    launchNote.classList.toggle("is-error", kind === "error");
  };

  /* ─── render results into the right panel ─── */
  const renderTweet = (text, idx, total) => {
    const li = document.createElement("li");
    li.className = "lc-tweet";
    const safeText = escapeHtml(text);
    const count = text.length;
    const over = count > 280;
    li.innerHTML = `
      <span class="lc-tweet-num">${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span>
      <span class="lc-tweet-text">${safeText}</span>
      <span class="lc-tweet-meta">
        <span class="lc-tweet-count${over ? " is-over" : ""}">${count} / 280</span>
        <button type="button" class="lc-tweet-copy" data-idx="${idx}">⧉ copy</button>
      </span>`;
    return li;
  };

  const renderResults = (parsed) => {
    /* release notes */
    if (parsed.releaseNotes) {
      releaseEmpty.hidden = true;
      releaseBody.hidden = false;
      releaseActions.hidden = false;
      releaseBody.innerHTML = (typeof simpleMarkdown === "function") ? simpleMarkdown(parsed.releaseNotes) : escapeHtml(parsed.releaseNotes);
    }
    /* tweets */
    if (parsed.tweets && parsed.tweets.length) {
      twitterEmpty.hidden = true;
      tweetList.hidden = false;
      twitterActions.hidden = false;
      tweetList.innerHTML = "";
      parsed.tweets.forEach((t, i) => tweetList.appendChild(renderTweet(t, i, parsed.tweets.length)));
    }
    /* reddit */
    if (parsed.redditTitle || parsed.redditBody) {
      redditEmpty.hidden = true;
      redditBody.hidden = false;
      redditActions.hidden = false;
      if (redditTitleEl) redditTitleEl.value = parsed.redditTitle || "";
      if (redditBodyEl)  redditBodyEl.value  = parsed.redditBody  || "";
    }
    /* fallback: dump raw into release pane */
    if (parsed.rawLeftover) {
      releaseEmpty.hidden = true;
      releaseBody.hidden = false;
      releaseActions.hidden = false;
      releaseBody.innerHTML = `<p><em>Parsing failed — raw AI output below.</em></p><pre>${escapeHtml(parsed.rawLeftover)}</pre>`;
    }
  };

  /* ─── streaming AI call (mirrors initBrandWizard pattern) ─── */
  const runLaunchSequence = async () => {
    if (isLaunching) return;
    if (typeof hasAIKey !== "function" || !hasAIKey()) {
      setNote("Configure your AI key first (gear icon, bottom-right).", "error");
      mainLed.className = "mc-led mc-led--red";
      mainLabel.textContent = "Aborted — no AI key";
      return;
    }
    isLaunching = true;

    /* reset panes to "in-flight" state */
    [releaseBody, releaseActions, tweetList, twitterActions, redditBody, redditActions].forEach((n) => { if (n) n.hidden = true; });
    [releaseEmpty, twitterEmpty, redditEmpty].forEach((n) => { if (n) n.hidden = false; });
    panes.forEach((p) => p.classList.add("is-loading"));
    mainLed.className = "mc-led mc-led--amber";
    mainLabel.textContent = "Generating launch kit…";
    mainMeta.textContent = "";
    setNote("Generating release notes · Twitter thread · Reddit body…", "");

    await animateCountdown();
    /* v5: ignition sparks burst from the launch button right at IGNITION */
    try { emitLaunchSparks(launchBtn); } catch { /* swallow */ }

    const cfg = getAIConfig();
    const base = String(cfg.base || "https://api.openai.com").replace(/\/+$/, "");
    let accumulated = "";

    try {
      const res = await fetch(`${base}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cfg.key}`,
        },
        body: JSON.stringify({
          model: cfg.model,
          stream: true,
          messages: [
            { role: "system", content: LC_SYSTEM_PROMPT },
            { role: "user", content: buildLaunchPrompt() },
          ],
        }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${errText.slice(0, 300)}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content;
            if (delta) {
              accumulated += delta;
              mainMeta.textContent = `${accumulated.length} chars`;
            }
          } catch { /* skip malformed */ }
        }
      }

      state.lastRaw = accumulated;
      state.parsed = parseLaunchOutput(accumulated);
      renderResults(state.parsed);

      mainLed.className = "mc-led mc-led--green";
      mainLabel.textContent = "Ready";
      setNote("All artifacts generated. Review tabs above and push when ready.", "");
    } catch (err) {
      mainLed.className = "mc-led mc-led--red";
      mainLabel.textContent = "Failed to generate";
      const msg = (err && err.message) || String(err);
      setNote(`Error: ${msg}`, "error");
      console.error("LaunchConsole stream error:", err);
    } finally {
      panes.forEach((p) => p.classList.remove("is-loading"));
      resetLaunchBtn();
      isLaunching = false;
    }
  };

  launchBtn.addEventListener("click", runLaunchSequence);

  /* ─── per-pane action handlers (copy / download / intent) ─── */
  const getReleaseMd = () => state.parsed ? state.parsed.releaseNotes : "";
  const getTweetThreadText = () => {
    if (!state.parsed || !state.parsed.tweets) return "";
    return state.parsed.tweets.map((t, i) => `${i + 1}/ ${t}`).join("\n\n");
  };
  const getRedditTitle = () => (redditTitleEl && redditTitleEl.value) || "";
  const getRedditBodyText = () => (redditBodyEl && redditBodyEl.value) || "";

  root.querySelectorAll(".lc-action[data-action]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const action = btn.dataset.action;
      const target = btn.dataset.target;
      if (action === "copy") {
        let text = "";
        if (target === "release") text = getReleaseMd();
        if (target === "twitter") text = getTweetThreadText();
        if (target === "reddit")  text = `# ${getRedditTitle()}\n\n${getRedditBodyText()}`;
        if (!text) return;
        const ok = await copyText(text);
        flashAction(btn, ok ? "Copied ✓" : "Failed");
      } else if (action === "download") {
        if (target === "release" && state.parsed && state.parsed.releaseNotes) {
          downloadMd("shipwright-release-notes.md", state.parsed.releaseNotes);
          flashAction(btn, "Downloaded");
        }
      }
    });
  });

  /* tweet-level copy */
  tweetList.addEventListener("click", async (event) => {
    const btn = event.target instanceof Element ? event.target.closest(".lc-tweet-copy") : null;
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx, 10);
    if (state.parsed && state.parsed.tweets[idx]) {
      const ok = await copyText(state.parsed.tweets[idx]);
      flashAction(btn, ok ? "copied ✓" : "fail");
    }
  });

  /* ─── share intent URLs ─── */
  const openTwitterIntent = () => {
    if (!state.parsed || !state.parsed.tweets || !state.parsed.tweets.length) return;
    const first = state.parsed.tweets[0];
    const url = urlInput.value.trim();
    let intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(first)}`;
    if (url) intent += `&url=${encodeURIComponent(url)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  };
  twitterIntent.addEventListener("click", openTwitterIntent);

  const openRedditIntent = () => {
    let sub = state.subreddit || LC_SUB_REDDIT_DEFAULT;
    if (sub === "custom") {
      sub = (subCustom && subCustom.value.trim()) || LC_SUB_REDDIT_DEFAULT;
      sub = sub.replace(/^r\//i, "").replace(/\s+/g, "");
    }
    const title = getRedditTitle();
    const body = getRedditBodyText();
    const url = `https://www.reddit.com/r/${encodeURIComponent(sub)}/submit?title=${encodeURIComponent(title)}&text=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  redditIntent.addEventListener("click", openRedditIntent);

  /* ─── GitHub PAT dialog + Release API ─── */
  const setDialogStatus = (msg, kind) => {
    if (!dialogStatus) return;
    dialogStatus.hidden = false;
    dialogStatus.className = "lc-dialog-status is-" + (kind || "info");
    dialogStatus.innerHTML = msg;
  };

  const openGithubDialog = () => {
    if (!dialog) return;
    if (!state.parsed || !state.parsed.releaseNotes) {
      setNote("Generate release notes first (INITIATE LAUNCH SEQUENCE).", "error");
      return;
    }
    /* pre-fill */
    try {
      const savedPat = localStorage.getItem(LC_STORAGE_GITHUB_PAT);
      if (savedPat && patInput) patInput.value = savedPat;
    } catch { /* localStorage blocked */ }

    const url = urlInput.value.trim();
    const parsedRepo = parseRepoFromAnything(url);
    if (parsedRepo && repoInput) repoInput.value = `${parsedRepo.owner}/${parsedRepo.repo}`;
    if (dialogStatus) dialogStatus.hidden = true;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  };

  const closeGithubDialog = () => {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  };

  githubPushBtn.addEventListener("click", openGithubDialog);
  dialogClose.addEventListener("click", closeGithubDialog);
  dialogCancel.addEventListener("click", closeGithubDialog);
  dialog.addEventListener("click", (event) => {
    /* clicks on the backdrop close the dialog */
    if (event.target === dialog) closeGithubDialog();
  });

  const pushGithubRelease = async () => {
    const pat = (patInput && patInput.value.trim()) || "";
    const repoRaw = (repoInput && repoInput.value.trim()) || "";
    const parsedRepo = parseRepoFromAnything(repoRaw);
    if (!pat) { setDialogStatus("Personal access token is required.", "error"); return; }
    if (!parsedRepo) { setDialogStatus("Repo must be in <code>owner/repo</code> format.", "error"); return; }
    const version = (versionInput && versionInput.value.trim()) || "v1.0.0";
    const title = (titleInput && titleInput.value.trim()) || version;
    const body = (state.parsed && state.parsed.releaseNotes) || "";
    if (!body) { setDialogStatus("No release notes generated yet.", "error"); return; }

    dialogConfirm.disabled = true;
    dialogConfirm.classList.add("is-busy");

    const headers = {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    try {
      setDialogStatus("Verifying repo & permissions…", "running");
      const repoRes = await fetch(`https://api.github.com/repos/${parsedRepo.owner}/${parsedRepo.repo}`, { headers });
      if (!repoRes.ok) {
        const err = await repoRes.json().catch(() => ({}));
        throw new Error(err.message || `Repo lookup failed (HTTP ${repoRes.status}).`);
      }
      const repoData = await repoRes.json();
      const branch = repoData.default_branch || "main";

      setDialogStatus(`Reading HEAD of <code>${branch}</code>…`, "running");
      const refRes = await fetch(`https://api.github.com/repos/${parsedRepo.owner}/${parsedRepo.repo}/git/ref/heads/${branch}`, { headers });
      if (!refRes.ok) {
        const err = await refRes.json().catch(() => ({}));
        throw new Error(err.message || `Could not read HEAD of ${branch}.`);
      }
      const refData = await refRes.json();
      const targetSha = refData.object && refData.object.sha;
      if (!targetSha) throw new Error("HEAD commit sha was missing in the GitHub response.");

      setDialogStatus("Creating draft release…", "running");
      const releaseRes = await fetch(`https://api.github.com/repos/${parsedRepo.owner}/${parsedRepo.repo}/releases`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          tag_name: version,
          name: title,
          body,
          target_commitish: targetSha,
          draft: true,
          prerelease: false,
        }),
      });
      if (!releaseRes.ok) {
        const err = await releaseRes.json().catch(() => ({}));
        const detail = (err.errors && err.errors[0] && err.errors[0].message) || err.message || "";
        throw new Error(`${detail || `HTTP ${releaseRes.status}`}`);
      }
      const releaseData = await releaseRes.json();

      /* persist PAT only after first successful use */
      try { localStorage.setItem(LC_STORAGE_GITHUB_PAT, pat); } catch { /* ignore */ }

      const link = releaseData.html_url || `https://github.com/${parsedRepo.owner}/${parsedRepo.repo}/releases`;
      setDialogStatus(
        `Draft release created. <a href="${link}" target="_blank" rel="noopener">Open on GitHub →</a><br>Tag <code>${version}</code> · branch <code>${branch}</code>`,
        "success"
      );
      mainLed.className = "mc-led mc-led--green";
      mainLabel.textContent = "Draft release on GitHub";
      setNote("Draft release created on GitHub. Open it to publish when ready.", "");
    } catch (err) {
      const msg = (err && err.message) || String(err);
      setDialogStatus(`Error: ${escapeHtml(msg)}`, "error");
    } finally {
      dialogConfirm.disabled = false;
      dialogConfirm.classList.remove("is-busy");
    }
  };

  dialogConfirm.addEventListener("click", pushGithubRelease);
};

/* ============================================================
 *  v5 — Dynamic animation layer
 *  Modules: motionController · Hero particles · custom cursor ·
 *  radar data stream · launch sparks · printer · easter eggs.
 * ============================================================ */

/* ── motionController: global pause/resume + reduced/hidden awareness ── */
const motionController = (() => {
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    reduced: reducedQuery.matches,
    hidden: document.hidden,
    effects: new Map(),
  };

  const shouldAnimate = () => !state.reduced && !state.hidden;

  const startAll = () => {
    state.effects.forEach((eff) => {
      if (!eff.running && eff.start) {
        try { eff.start(); eff.running = true; } catch { /* swallow */ }
      }
    });
  };
  const stopAll = () => {
    state.effects.forEach((eff) => {
      if (eff.running && eff.stop) {
        try { eff.stop(); eff.running = false; } catch { /* swallow */ }
      }
    });
  };

  const register = (name, { start, stop }) => {
    state.effects.set(name, { start, stop, running: false });
    if (shouldAnimate() && start) {
      try { start(); state.effects.get(name).running = true; } catch { /* swallow */ }
    }
  };

  reducedQuery.addEventListener?.("change", (e) => {
    state.reduced = e.matches;
    if (shouldAnimate()) startAll(); else stopAll();
    document.body.classList.toggle("sw-reduced-motion", state.reduced);
  });
  document.addEventListener("visibilitychange", () => {
    state.hidden = document.hidden;
    if (shouldAnimate()) startAll(); else stopAll();
  });

  document.body.classList.toggle("sw-reduced-motion", state.reduced);

  return {
    register,
    get reduced() { return state.reduced; },
    get hidden() { return state.hidden; },
    shouldAnimate,
  };
})();

/* ── Hero Canvas particle text ── */
const initHeroParticles = () => {
  const canvas = document.getElementById("heroParticles");
  if (!canvas) return;
  const hero = canvas.closest(".hero");
  if (!hero) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let rafId = 0;
  let running = false;
  let mouseX = -1e4;
  let mouseY = -1e4;
  let widthCss = 0;
  let heightCss = 0;
  let resizeTimer = 0;

  const themeColors = () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    return isLight
      ? ["rgba(36, 86, 160, 0.85)", "rgba(204, 122, 38, 0.85)", "rgba(72, 116, 184, 0.85)"]
      : ["rgba(76, 213, 255, 0.85)", "rgba(255, 181, 71, 0.85)", "rgba(180, 220, 255, 0.85)"];
  };

  const sampleTextTargets = (text, fontPx, stepPx) => {
    const off = document.createElement("canvas");
    off.width = widthCss;
    off.height = heightCss;
    const octx = off.getContext("2d");
    if (!octx) return [];
    octx.fillStyle = "#000";
    octx.textBaseline = "middle";
    octx.textAlign = "center";
    octx.font = `900 ${fontPx}px "Inter", "Helvetica Neue", sans-serif`;
    octx.fillText(text, widthCss / 2, heightCss / 2);
    const data = octx.getImageData(0, 0, widthCss, heightCss).data;
    const targets = [];
    for (let y = 0; y < heightCss; y += stepPx) {
      for (let x = 0; x < widthCss; x += stepPx) {
        const idx = (y * widthCss + x) * 4 + 3;
        if (data[idx] > 128) targets.push({ x, y });
      }
    }
    return targets;
  };

  const buildParticles = () => {
    /* Canvas is now a dedicated full-width band row beneath the hero copy,
     * not an absolute backdrop behind it. Measure the canvas directly so
     * the SHIPWRIGHT glyph fills the band vertically. */
    const rect = canvas.getBoundingClientRect();
    widthCss = Math.max(320, Math.floor(rect.width));
    heightCss = Math.max(140, Math.floor(rect.height));
    canvas.width = widthCss * dpr;
    canvas.height = heightCss * dpr;
    canvas.style.width = `${widthCss}px`;
    canvas.style.height = `${heightCss}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* Lowercase "shipwright" sized to fill the slim band. */
    const fontPx = Math.min(140, Math.max(58, Math.floor(heightCss * 0.92)));
    /* Smaller band ⇒ smaller step keeps glyph legible. */
    const stepPx = widthCss > 900 ? 6 : 7;
    const targets = sampleTextTargets("shipwright", fontPx, stepPx);
    const palette = themeColors();

    if (motionController.reduced) {
      // Static one-shot draw: just dots at targets, no rAF.
      ctx.clearRect(0, 0, widthCss, heightCss);
      targets.forEach((t, i) => {
        ctx.fillStyle = palette[i % palette.length];
        ctx.fillRect(t.x - 1.1, t.y - 1.1, 2.2, 2.2);
      });
      particles = [];
      return;
    }

    particles = targets.map((t, i) => ({
      x: Math.random() * widthCss,
      y: Math.random() * heightCss,
      tx: t.x,
      ty: t.y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      color: palette[i % palette.length],
    }));
  };

  /* Full 60fps — the band is small (≤96px tall) with ~600-900 particles
   * after the v5e slimming, so per-frame work is light. Throttling to 30fps
   * was making the mouse repulsion feel laggy (up to 33ms input-to-pixel
   * delay). Keep the rAF tight; the IntersectionObserver still pauses
   * everything when the band scrolls out of view. */
  const drawFrame = (now) => {
    rafId = requestAnimationFrame(drawFrame);

    ctx.clearRect(0, 0, widthCss, heightCss);
    const breathe = Math.sin(now / 1400) * 0.7;
    /* Snappier physics: tighter spring + stronger repulsion + slightly
     * lower damping so particles dart away from the cursor crisply and
     * snap back into the glyph quickly. */
    const SPRING = 0.058;
    const DAMPING = 0.84;
    const REPEL_R2 = 6400;        // 80px radius
    const REPEL_STRENGTH = 2.2;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const tx = p.tx;
      const ty = p.ty + breathe;
      const dx = tx - p.x;
      const dy = ty - p.y;
      p.vx += dx * SPRING;
      p.vy += dy * SPRING;

      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const md2 = mdx * mdx + mdy * mdy;
      if (md2 < REPEL_R2 && md2 > 1) {
        const force = (REPEL_R2 - md2) / REPEL_R2;
        const d = Math.sqrt(md2);
        p.vx += (mdx / d) * force * REPEL_STRENGTH;
        p.vy += (mdy / d) * force * REPEL_STRENGTH;
      }

      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.x += p.vx;
      p.y += p.vy;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 1.1, p.y - 1.1, 2.2, 2.2);
    }
  };

  const onMouseMove = (event) => {
    /* Coords relative to the canvas band, not the full hero. */
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  };
  const onMouseLeave = () => { mouseX = -1e4; mouseY = -1e4; };

  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      buildParticles();
    }, 220);
  };

  const start = () => {
    if (running) return;
    running = true;
    buildParticles();
    canvas.classList.add("is-fading-in");
    if (!motionController.reduced) {
      rafId = requestAnimationFrame(drawFrame);
    }
  };
  const stop = () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  };

  hero.addEventListener("pointermove", onMouseMove);
  hero.addEventListener("pointerleave", onMouseLeave);
  window.addEventListener("resize", onResize);

  // Visibility observer — pause when off-screen. Higher threshold means we
  // stop drawing much earlier on scroll-down, freeing the main thread.
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && motionController.shouldAnimate()) start();
        else stop();
      });
    }, { threshold: 0.3 });
    io.observe(hero);
  } else {
    start();
  }

  motionController.register("hero-particles", { start, stop });
};

/* ── Custom cursor (ring + dot + 5-dot trail + magnetic hover) ── */
const initCursorFX = () => {
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
  if (motionController.reduced) return;
  const ring = document.getElementById("swCursorRing");
  const dot = document.getElementById("swCursorDot");
  const trailEl = document.getElementById("swCursorTrail");
  if (!ring || !dot || !trailEl) return;

  // Disable older cursor follower if it appended one
  document.querySelectorAll(".cursor-follower").forEach((el) => el.remove());

  document.body.classList.add("sw-cursor-on");

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;
  const trailDots = Array.from(trailEl.querySelectorAll("span"));
  const trailPos = trailDots.map(() => ({ x: mx, y: my }));
  let magneticTarget = null;
  let firstMove = false;

  const INTERACTIVE = "a, button, .feature-nav-btn, .quick-sample, .sample-btn, .button, .ai-explain-btn, .skill-card, .skill-tile, .mission-card, summary, [role='button'], .lc-tone-chip, .lc-tab-btn, .lc-action, .chip";
  const TEXT_INPUT = "input[type='text'], input[type='url'], input[type='email'], input[type='password'], input[type='search'], textarea";

  const onMove = (event) => {
    mx = event.clientX;
    my = event.clientY;
    if (!firstMove) {
      firstMove = true;
      ring.classList.add("is-visible");
      dot.classList.add("is-visible");
      trailEl.classList.add("is-visible");
    }
  };

  const onOver = (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    ring.classList.remove("is-hover", "is-text");
    magneticTarget = null;
    if (target.closest(TEXT_INPUT)) {
      ring.classList.add("is-text");
    } else {
      const interactive = target.closest(INTERACTIVE);
      if (interactive) {
        ring.classList.add("is-hover");
        magneticTarget = interactive;
      }
    }
  };
  const onOut = () => { magneticTarget = null; };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerover", onOver);
  document.addEventListener("pointerout", onOut);

  const tick = () => {
    let targetX = mx;
    let targetY = my;
    if (magneticTarget && magneticTarget.isConnected) {
      const rect = magneticTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const inside = mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom;
      if (inside) {
        targetX = cx * 0.4 + mx * 0.6;
        targetY = cy * 0.4 + my * 0.6;
      }
    }
    rx += (targetX - rx) * 0.22;
    ry += (targetY - ry) * 0.22;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

    let prevX = mx;
    let prevY = my;
    for (let i = 0; i < trailDots.length; i++) {
      const p = trailPos[i];
      p.x += (prevX - p.x) * (0.32 - i * 0.04);
      p.y += (prevY - p.y) * (0.32 - i * 0.04);
      trailDots[i].style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      prevX = p.x;
      prevY = p.y;
    }
    rafId = requestAnimationFrame(tick);
  };
  let rafId = requestAnimationFrame(tick);

  motionController.register("cursor-fx", {
    start: () => { if (!rafId) rafId = requestAnimationFrame(tick); },
    stop: () => { if (rafId) cancelAnimationFrame(rafId); rafId = 0; },
  });
};

/* ── Inspection Radar data stream overlay ── */
const initRadarDataStream = () => {
  const section = document.getElementById("inspection-radar");
  if (!section) return;
  const svg = section.querySelector(".radar-svg");
  const sweep = section.querySelector(".radar-sweep");
  if (!svg || !sweep) return;
  const host = svg.parentElement;
  if (!host) return;

  if (motionController.reduced) return;

  const canvas = document.createElement("canvas");
  canvas.className = "radar-stream-canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.style.position = host.style.position || "relative";
  host.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let widthCss = 0;
  let heightCss = 0;
  let particles = [];
  let pings = [];
  let rafId = 0;
  let running = false;
  let lastSpawn = 0;

  const resize = () => {
    const rect = host.getBoundingClientRect();
    widthCss = Math.max(200, Math.floor(rect.width));
    heightCss = Math.max(160, Math.floor(rect.height));
    canvas.width = widthCss * dpr;
    canvas.height = heightCss * dpr;
    canvas.style.width = `${widthCss}px`;
    canvas.style.height = `${heightCss}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const spawnParticle = () => {
    const cx = widthCss / 2;
    const cy = heightCss / 2;
    const angle = Math.random() * Math.PI * 2;
    const startRadius = Math.min(widthCss, heightCss) * 0.48;
    return {
      angle,
      r: startRadius,
      speed: 60 + Math.random() * 100,
      cx, cy,
      life: 1,
    };
  };

  const tick = (now) => {
    if (!lastSpawn) lastSpawn = now;
    const dt = Math.min(48, now - (tick.last || now));
    tick.last = now;
    ctx.clearRect(0, 0, widthCss, heightCss);

    if (now - lastSpawn > 110 && particles.length < 60) {
      particles.push(spawnParticle());
      lastSpawn = now;
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.r -= (p.speed * dt) / 1000;
      const x = p.cx + Math.cos(p.angle) * p.r;
      const y = p.cy + Math.sin(p.angle) * p.r;
      const t = p.r / (Math.min(widthCss, heightCss) * 0.48);
      const alpha = Math.max(0, Math.min(1, t * 1.4));
      ctx.fillStyle = `rgba(76, 213, 255, ${alpha * 0.85})`;
      ctx.fillRect(x - 1, y - 1, 2, 2);
      if (p.r < 18) particles.splice(i, 1);
    }

    for (let i = pings.length - 1; i >= 0; i--) {
      const ping = pings[i];
      ping.age += dt;
      const lifeFrac = ping.age / ping.duration;
      if (lifeFrac >= 1) { pings.splice(i, 1); continue; }
      const radius = 6 + lifeFrac * 28;
      ctx.beginPath();
      ctx.arc(ping.x, ping.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 181, 71, ${(1 - lifeFrac) * 0.85})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    rafId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    running = true;
    resize();
    lastSpawn = 0;
    tick.last = 0;
    rafId = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    particles = [];
    pings = [];
  };

  window.addEventListener("resize", () => { if (running) resize(); });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && motionController.shouldAnimate()) start();
        else stop();
      });
    }, { threshold: 0.15 });
    io.observe(section);
  } else {
    start();
  }

  motionController.register("radar-stream", { start, stop });
};

/* ── Launch Console ignition sparks (one-shot, called from runLaunchSequence) ── */
const emitLaunchSparks = (anchorEl) => {
  if (motionController.reduced) return;
  if (!anchorEl) return;
  const host = anchorEl.closest(".launch-console") || document.body;
  const hostRect = host.getBoundingClientRect();
  const anchorRect = anchorEl.getBoundingClientRect();
  const originX = anchorRect.left + anchorRect.width / 2 - hostRect.left;
  const originY = anchorRect.top + anchorRect.height / 2 - hostRect.top;

  const canvas = document.createElement("canvas");
  canvas.className = "lc-sparks-canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.style.position = host.style.position || "relative";
  host.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return; }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const widthCss = Math.floor(hostRect.width);
  const heightCss = Math.floor(hostRect.height);
  canvas.width = widthCss * dpr;
  canvas.height = heightCss * dpr;
  canvas.style.width = `${widthCss}px`;
  canvas.style.height = `${heightCss}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const sparks = [];
  const count = 72;
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.55);
    const speed = 3.2 + Math.random() * 4.6;
    sparks.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.012 + Math.random() * 0.012,
      size: 1.2 + Math.random() * 1.6,
    });
  }

  const start = performance.now();
  const duration = 1400;
  const tick = (now) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, widthCss, heightCss);
    let alive = 0;
    for (let i = 0; i < sparks.length; i++) {
      const s = sparks[i];
      if (s.life <= 0) continue;
      s.vy += 0.16;
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
      if (s.life <= 0) continue;
      alive++;
      const hue = 36 + (1 - s.life) * 18; // amber → red
      ctx.fillStyle = `hsla(${hue}, 95%, ${50 + s.life * 18}%, ${s.life})`;
      ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
    }
    if (alive > 0 && elapsed < duration) {
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  };
  requestAnimationFrame(tick);
};

/* ── Brand-check printer effect: wraps reportBody with printer head while streaming ── */
const initReportPrinter = () => {
  const report = document.getElementById("brandReport");
  const reportBody = document.getElementById("brandReportBody");
  if (!report || !reportBody) return;

  // Create printer head element
  const head = document.createElement("div");
  head.className = "printer-head";
  head.innerHTML = `
    <span class="printer-led" aria-hidden="true"></span>
    <span class="printer-label">PRINTING REPORT</span>
    <span class="printer-bytes" id="printerBytes">0 chars</span>
  `;
  report.insertBefore(head, reportBody);

  const bytesEl = head.querySelector("#printerBytes");

  // Wrap simpleMarkdown / innerHTML assignments via MutationObserver so we
  // toggle .is-printing class while the assistant is streaming.
  const observer = new MutationObserver(() => {
    const loadingMarker = reportBody.querySelector(".brand-report-loading");
    const isStreaming = !!loadingMarker;
    report.classList.toggle("is-printing", isStreaming);
    if (bytesEl) bytesEl.textContent = `${reportBody.textContent.length} chars`;
  });
  observer.observe(reportBody, { childList: true, subtree: true, characterData: true });

  // Hide printer head when report becomes hidden again
  const hiddenObserver = new MutationObserver(() => {
    if (report.hasAttribute("hidden")) {
      report.classList.remove("is-printing");
    }
  });
  hiddenObserver.observe(report, { attributes: true, attributeFilter: ["hidden"] });
};

/* ── Easter eggs: long-press logo → ASCII ship; Konami → Captain's Log ── */
const initEasterEggs = () => {
  const logo = document.querySelector(".brand");
  let pressTimer = 0;
  let shipCoolUntil = 0;

  const launchShip = () => {
    if (performance.now() < shipCoolUntil) return;
    shipCoolUntil = performance.now() + 10000;
    const ship = document.createElement("div");
    ship.className = "sw-ascii-ship";
    ship.textContent = "~~~⛵~~~  Shipwright ahoy!  ~~~";
    document.body.appendChild(ship);
    window.setTimeout(() => ship.remove(), motionController.reduced ? 2600 : 6200);
  };

  if (logo) {
    logo.addEventListener("pointerdown", () => {
      pressTimer = window.setTimeout(launchShip, 1500);
    });
    const cancel = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = 0; } };
    logo.addEventListener("pointerup", cancel);
    logo.addEventListener("pointerleave", cancel);
    logo.addEventListener("pointercancel", cancel);
  }

  /* Konami code: ↑ ↑ ↓ ↓ ← → ← → b a */
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let buffer = [];
  let bufferUntil = 0;
  let logActiveUntil = 0;

  document.addEventListener("keydown", (event) => {
    const now = performance.now();
    if (now > bufferUntil) buffer = [];
    bufferUntil = now + 5000;
    const k = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    buffer.push(k);
    if (buffer.length > KONAMI.length) buffer = buffer.slice(-KONAMI.length);
    if (buffer.length === KONAMI.length && buffer.every((v, i) => v === KONAMI[i])) {
      buffer = [];
      if (now < logActiveUntil) return;
      logActiveUntil = now + 8000;
      document.body.classList.add("captains-log");
      window.setTimeout(() => document.body.classList.remove("captains-log"), 8000);
    }
  });
};

/* ── Init everything ── */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

initLanguageToggle();
initScrollProgress();
initInspectionRadar();
initBackToTop();
initFeatureNav();
initAIChat();
initAIChatDrag();
initBrandWizard();
initLaunchConsole();
initSectionNumbers();
initV6WorkflowState();

if (!prefersReduced) {
  initHeroSplitH1();
  initCycleWords();
  // v5: initCursorFX replaces initCursorFollower (richer ring+dot+trail+magnetic)
  initCursorFX();
  initMagneticEverywhere();
}

/* ── v5 — Dynamic animation modules ── */
initHeroParticles();
initRadarDataStream();
initReportPrinter();
initEasterEggs();

if (!prefersReduced) {
  initHeroReveal();
  initCardTilt();
  initHeroBlobs();
  initCounters();
  initStaggeredCards();
  initCursorGlow();
  initMagneticButtons();
  initFloatingFindings();
  initDividers();
  initTextHighlight();
  initParallax();
  initWorkflowSlides();
  initIconPop();
  initEyebrowReveal();
}

initReveal();
