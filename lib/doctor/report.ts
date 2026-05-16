import type {
  DoctorActionItem,
  DoctorActionPlan,
  DoctorInputType,
  DoctorReport,
  Finding,
  Grade,
} from "@/lib/types"

export function verdictForGrade(grade: Grade, blockerCount: number): string {
  if (blockerCount > 0) return "Do not launch yet"
  if (grade === "A") return "Launch ready"
  if (grade === "B") return "Almost ready"
  if (grade === "C") return "Needs one focused pass"
  if (grade === "D") return "Not ready"
  return "Major launch gaps"
}

export function nextPatchFromFindings(findings: Finding[]): string {
  const topFinding = findings[0]
  if (!topFinding) return "No critical patch is required. Keep one verified smoke test before publishing."
  return `${topFinding.title}: ${topFinding.fix}`
}

export function buildActionPlan(input: {
  inputType: DoctorInputType
  inputValue: string
  score: number
  grade: Grade
  verdict: string
  findings: Finding[]
  nextPatch: string
}): DoctorActionPlan {
  const blockers = input.findings.filter((finding) => finding.severity === "P0" || finding.severity === "P1")
  const quickFixes = input.findings.filter((finding) => finding.severity === "P2")
  const followUps = input.findings.filter((finding) => finding.severity === "P3")

  const immediate = blockers.slice(0, 4).map(toActionItem)
  const quickWins = quickFixes.slice(0, 4).map(toActionItem)
  const later = followUps.slice(0, 4).map(toActionItem)
  const shipDecision = buildShipDecision(input.verdict, input.score, blockers.length)

  return {
    shipDecision,
    immediate,
    quickWins,
    followUps: later,
    agentPrompt: buildAgentPrompt({
      ...input,
      shipDecision,
      immediate,
      quickWins,
      followUps: later,
    }),
  }
}

export function buildReportMarkdown(report: Omit<DoctorReport, "reportMarkdown">): string {
  const lines = [
    "# Shipwright Doctor Report",
    "",
    `**Target:** ${report.inputValue}`,
    `**Input:** ${report.inputType}`,
    `**Score:** ${report.score}/100 (${report.grade})`,
    `**Verdict:** ${report.verdict}`,
    `**Checked:** ${report.timestamp}`,
    "",
    "## Summary",
    `- Launch blockers: ${report.summary.launchBlockers}`,
    `- Critical issues: ${report.summary.criticalIssues}`,
    `- Improvements: ${report.summary.improvements}`,
    `- Suggestions: ${report.summary.suggestions}`,
    "",
    "## Next Patch",
    report.nextPatch,
    "",
    "## Ship Decision",
    report.actionPlan.shipDecision,
    "",
    "## Agent Fix Prompt",
    "```text",
    report.actionPlan.agentPrompt,
    "```",
    "",
    "## Action Plan",
    "",
    ...actionSection("Must fix before launch", report.actionPlan.immediate),
    ...actionSection("Quick wins", report.actionPlan.quickWins),
    ...actionSection("Follow-ups", report.actionPlan.followUps),
    "",
    "## Findings",
  ]

  if (report.findings.length === 0) {
    lines.push("No findings were detected by the current checks.")
  } else {
    for (const finding of report.findings) {
      lines.push(
        "",
        `### [${finding.severity}] ${finding.title}`,
        "",
        `- **Category:** ${finding.category}`,
        `- **Description:** ${finding.description}`,
        `- **Evidence:** ${finding.evidence}`,
        `- **Impact:** ${finding.impact}`,
        `- **Fix:** ${finding.fix}`
      )
      if (finding.claudePrompt) {
        lines.push(`- **Agent prompt:** ${finding.claudePrompt}`)
      }
    }
  }

  return lines.join("\n")
}

function toActionItem(finding: Finding): DoctorActionItem {
  return {
    id: finding.id,
    severity: finding.severity,
    category: finding.category,
    title: finding.title,
    fix: finding.fix,
    prompt:
      finding.claudePrompt ??
      `Fix the Shipwright finding "${finding.title}". Evidence: ${finding.evidence}. Required outcome: ${finding.fix}`,
  }
}

function buildShipDecision(verdict: string, score: number, blockerCount: number): string {
  if (blockerCount > 0) {
    return `Do not launch yet. Fix ${blockerCount} P0/P1 issue${blockerCount === 1 ? "" : "s"} first, then rerun Shipwright Doctor.`
  }
  if (score >= 90) return "Launch is acceptable. Do one smoke test and publish with confidence."
  if (score >= 75) return "Almost ready. Clear the quick wins before public launch."
  return `${verdict}. Treat this as a focused repair pass, not a cosmetic polish pass.`
}

function actionSection(title: string, items: DoctorActionItem[]): string[] {
  if (items.length === 0) return [`### ${title}`, "", "- None detected.", ""]
  return [
    `### ${title}`,
    "",
    ...items.flatMap((item, index) => [
      `${index + 1}. **[${item.severity}] ${item.title}**`,
      `   Fix: ${item.fix}`,
      `   Agent prompt: ${item.prompt}`,
      "",
    ]),
  ]
}

function buildAgentPrompt(input: {
  inputType: DoctorInputType
  inputValue: string
  score: number
  grade: Grade
  verdict: string
  nextPatch: string
  shipDecision: string
  immediate: DoctorActionItem[]
  quickWins: DoctorActionItem[]
  followUps: DoctorActionItem[]
}): string {
  const allActions = [...input.immediate, ...input.quickWins, ...input.followUps]
  const actions = allActions.length
    ? allActions.map((item, index) => `${index + 1}. [${item.severity}] ${item.title}: ${item.fix}`).join("\n")
    : "No action items detected. Run a smoke test and confirm the launch path still works."

  return [
    "You are improving a project based on a Shipwright Doctor report.",
    "",
    `Target: ${input.inputValue}`,
    `Input type: ${input.inputType}`,
    `Score: ${input.score}/100 (${input.grade})`,
    `Verdict: ${input.verdict}`,
    `Ship decision: ${input.shipDecision}`,
    "",
    "Work in this order:",
    actions,
    "",
    `Start with this patch: ${input.nextPatch}`,
    "",
    "Rules:",
    "- Fix behavior and documentation before visual polish.",
    "- Do not remove unrelated user changes.",
    "- After editing, run the relevant tests/build and summarize evidence.",
    "- If a finding cannot be fully fixed, explain the remaining risk clearly.",
  ].join("\n")
}
