import { describe, expect, it } from "vitest"
import { detectDoctorInputType } from "../lib/doctor/input"
import {
  buildActionPlan,
  buildReportMarkdown,
  nextPatchFromFindings,
  verdictForGrade,
} from "../lib/doctor/report"
import { runDoctorCheck } from "../lib/doctor/orchestrator"
import type { DoctorReport, Finding } from "../lib/types"

describe("detectDoctorInputType", () => {
  it("detects GitHub URLs and owner/repo shorthand", () => {
    expect(detectDoctorInputType("https://github.com/aimonj0729-ai/shipwright")).toBe("github")
    expect(detectDoctorInputType("aimonj0729-ai/shipwright")).toBe("github")
  })

  it("detects live URLs, README text, and rough ideas", () => {
    expect(detectDoctorInputType("https://shipwright.com.cn")).toBe("url")
    expect(detectDoctorInputType("# Shipwright\n\n## Getting Started\n\nnpm install")).toBe("readme")
    expect(detectDoctorInputType("A small launch QA app for indie builders")).toBe("idea")
  })
})

describe("report helpers", () => {
  const finding: Finding = {
    id: "readme-no-install",
    title: "README missing installation instructions",
    severity: "P0",
    category: "README",
    description: "No installation section found.",
    evidence: "No install heading.",
    impact: "Users cannot run the project.",
    fix: "Add a Getting Started section.",
  }

  it("keeps launch blockers from being called launch ready", () => {
    expect(verdictForGrade("A", 1)).toBe("Do not launch yet")
    expect(verdictForGrade("A", 0)).toBe("Launch ready")
  })

  it("builds a concrete next patch and markdown report", () => {
    const baseReport = {
      score: 75,
      grade: "B" as const,
      verdict: "Almost ready",
      inputType: "readme" as const,
      inputValue: "README",
      timestamp: "2026-05-14T00:00:00.000Z",
      findings: [finding],
      summary: {
        launchBlockers: 1,
        criticalIssues: 0,
        improvements: 0,
        suggestions: 0,
        quickWins: [],
      },
      checks: {},
      nextPatch: nextPatchFromFindings([finding]),
    }

    const partialReport = {
      ...baseReport,
      actionPlan: buildActionPlan(baseReport),
    } satisfies Omit<DoctorReport, "reportMarkdown">

    expect(partialReport.nextPatch).toContain("README missing installation instructions")
    expect(buildReportMarkdown(partialReport)).toContain("## Next Patch")
    expect(buildReportMarkdown(partialReport)).toContain("## Agent Fix Prompt")
  })
})

describe("runDoctorCheck", () => {
  it("turns vague idea input into actionable launch findings", async () => {
    const report = await runDoctorCheck({
      type: "idea",
      value: "A launch QA app",
    })

    expect(report.inputType).toBe("idea")
    expect(report.findings.map((finding) => finding.id)).toContain("idea-too-thin")
    expect(report.actionPlan.immediate.length).toBeGreaterThan(0)
    expect(report.actionPlan.agentPrompt).toContain("Shipwright Doctor report")
    expect(report.reportMarkdown).toContain("Shipwright Doctor Report")
  })
})
