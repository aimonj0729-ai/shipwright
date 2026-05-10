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
        severity: "P2",
        title: "README should show expected output",
        detail: "Add the first successful terminal output or screenshot so users know the app is working.",
      },
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
        severity: "P2",
        title: "Tool examples need before/after output",
        detail: "Show one realistic request, the tool call shape, and the resulting output.",
      },
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

const buildMarkdown = ({ target, profile, score, channels }) => {
  const findings = profile.findings
    .map((finding) => `- **${finding.severity}**: ${finding.title} — ${finding.detail}`)
    .join("\n");
  const metadata = channels.map((channel) => `- ${metadataByChannel[channel]}`).join("\n");

  return `# Shipwright Launch QA Report

## Verdict

**${profile.verdict}** (${score}/100)

## Target

- **Project:** ${target}
- **Type:** ${profile.label}
- **Channels:** ${channels.join(", ") || "GitHub"}

## Critical Findings

${findings}

## Audit Coverage

${coverageItems.map((item) => `- ${item}`).join("\n")}

## Launch Metadata

${metadata || "- GitHub topics, repo description, release title"}

## Next Patch

${profile.nextPatch}

---

> This report was generated by the static Shipwright website demo. Run the open-source Shipwright skills locally for evidence-backed browser, README, and release audits.
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

  verdictTitle.textContent = profile.verdict;
  scoreRing.setAttribute("aria-label", `Launch score ${score} out of 100`);
  targetBadge.textContent = target;
  typeBadge.textContent = profile.label;
  findingsList.innerHTML = profile.findings.map(findingTemplate).join("");
  coverageList.innerHTML = simpleListTemplate(coverageItems);
  metadataList.innerHTML = simpleListTemplate(
    (channels.length ? channels : ["GitHub"]).map((channel) => metadataByChannel[channel])
  );
  nextPatch.textContent = profile.nextPatch;

  animateScore(score);

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
    projectType.value = btn.dataset.type;
    setTargetError();
    targetInput.focus();
  });
});

const initReveal = () => {
  const sections = document.querySelectorAll(
    ".pain-grid, .audience, .usage-guide, .analyzer, .workflow, .honesty, .cta"
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

initReveal();
renderReport();
