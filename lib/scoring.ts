import type { Finding, Grade, DoctorSummary } from "./types"

export function computeGrade(score: number): Grade {
  if (score >= 90) return "A"
  if (score >= 75) return "B"
  if (score >= 60) return "C"
  if (score >= 40) return "D"
  return "F"
}

export function computeScore(findings: Finding[]): number {
  const deductions: Record<string, number> = {
    P0: 25,
    P1: 15,
    P2: 8,
    P3: 3,
  }

  let score = 100
  for (const f of findings) {
    score -= deductions[f.severity] ?? 0
  }

  return Math.max(0, Math.min(100, score))
}

export function buildSummary(findings: Finding[]): DoctorSummary {
  const launchBlockers = findings.filter((f) => f.severity === "P0").length
  const criticalIssues = findings.filter((f) => f.severity === "P1").length
  const improvements = findings.filter((f) => f.severity === "P2").length
  const suggestions = findings.filter((f) => f.severity === "P3").length

  const quickWins = findings.filter(
    (f) => f.severity === "P2" || f.severity === "P3"
  ).slice(0, 3)

  return {
    launchBlockers,
    criticalIssues,
    improvements,
    suggestions,
    quickWins,
  }
}
