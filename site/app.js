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

/* ── Init everything ── */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

initScrollProgress();
initInspectionRadar();
initBackToTop();
initFeatureNav();
initAIChat();

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
