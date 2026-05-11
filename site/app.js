const storedTheme = localStorage.getItem("shipwright-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
document.documentElement.setAttribute("data-theme", initialTheme);

document.querySelector("#themeToggle").addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("shipwright-theme", next);
});

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
  if (!h1) return;

  const text = h1.textContent;
  const words = text.split(" ");

  h1.innerHTML = words
    .map((word) => `<span class="hero-word"><span class="hero-word-inner">${word}</span></span>`)
    .join(" ");

  const wordEls = h1.querySelectorAll(".hero-word-inner");
  wordEls.forEach((el, i) => {
    el.style.animationDelay = `${i * 80 + 200}ms`;
  });

  const eyebrow = document.querySelector(".hero-copy .eyebrow");
  if (eyebrow) {
    const eyebrowText = eyebrow.textContent;
    eyebrow.textContent = "";
    eyebrow.style.opacity = "1";
    window.setTimeout(() => scrambleText(eyebrow, eyebrowText, 1000), 100);
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
    ".pain-cards, .audience-cards, .workflow-steps, .guide-steps, .radar-checklist"
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
  return true;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const parsedTarget = parseTarget(targetInput.value);
  if (!parsedTarget.valid) {
    setTargetError(parsedTarget.error);
    targetInput.focus();
    return;
  }

  btnText.textContent = "Analyzing…";
  btnSpinner.hidden = false;
  analyzeBtn.disabled = true;
  reportPanel.classList.add("is-loading");

  window.setTimeout(() => {
    const rendered = renderReport();
    btnText.textContent = "Analyze launch risk";
    btnSpinner.hidden = true;
    analyzeBtn.disabled = false;
    reportPanel.classList.remove("is-loading");

    if (!rendered) {
      return;
    }

    reportPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => reportPanel.focus({ preventScroll: true }), 220);
  }, 800);
});

const setButtonStatus = (button, message, resetMessage) => {
  button.textContent = message;
  button.disabled = true;
  window.setTimeout(() => {
    button.textContent = resetMessage;
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

if (heroQuickForm && quickInput) {
  const submitHeroForm = (url, type) => {
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
      quickInput.focus();
      return;
    }
    submitHeroForm(url);
  });

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
  const actionNote = radar.querySelector("#radarActionNote");

  if (!nodes.length || !detailCard || !code || !status || !title || !detail) {
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
    status.textContent = node.dataset.status || "";
    title.textContent = node.dataset.title || "";
    detail.textContent = node.dataset.detail || "";
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
        actionNote.textContent = `${node.dataset.title || "Waypoint"} loaded into the analyzer. Review the report or run the demo audit.`;
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

const initReveal = () => {
  const sections = document.querySelectorAll(
    ".pain-grid, .audience, .usage-guide, .inspection-radar, .analyzer, .workflow, .honesty, .skills-catalog, .cta"
  );

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    return;
  }

  sections.forEach((section) => section.classList.add("reveal"));

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
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
};

/* ── Section divider line draw ── */

const initDividers = () => {
  const dividers = document.querySelectorAll(".section-divider");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
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
    ".pain-grid .eyebrow, .audience .eyebrow, .usage-guide .eyebrow, .inspection-radar .eyebrow, .analyzer .eyebrow, .workflow .eyebrow, .honesty .eyebrow, .skills-catalog .eyebrow, .cta .eyebrow"
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
    btn.classList.toggle("is-visible", shouldShow);
  };

  window.addEventListener("scroll", toggle, { passive: true });
  toggle();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

/* ── Init everything ── */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

initScrollProgress();
initInspectionRadar();
initBackToTop();

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
