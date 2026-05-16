import type {
  CheckResults,
  DoctorInputType,
  DoctorReport,
  DoctorRequest,
  Finding,
} from "@/lib/types"
import { checkUrl } from "@/lib/browser"
import { checkGitHub, parseGitHubUrl } from "@/lib/github"
import { runExtraGitHubChecks } from "@/lib/github-extras"
import { analyzeReadme } from "@/lib/readme-analyzer"
import { buildSummary, computeGrade, computeScore } from "@/lib/scoring"
import { detectDoctorInputType } from "./input"
import {
  buildActionPlan,
  buildReportMarkdown,
  nextPatchFromFindings,
  verdictForGrade,
} from "./report"

export const MAX_INPUT_LENGTH = 100_000

const VALID_TYPES: DoctorInputType[] = ["github", "url", "readme", "idea"]

export function validateDoctorRequest(body: DoctorRequest): string | null {
  if (!body.type || !body.value || typeof body.value !== "string") {
    return "Missing type or value"
  }

  if (!VALID_TYPES.includes(body.type)) {
    return `Invalid type. Must be one of: ${VALID_TYPES.join(", ")}`
  }

  if (body.value.length > MAX_INPUT_LENGTH) {
    return `Input too large (max ${MAX_INPUT_LENGTH} chars)`
  }

  return null
}

export { detectDoctorInputType }

export async function runDoctorCheck(
  request: DoctorRequest,
  options: { githubToken?: string } = {}
): Promise<DoctorReport> {
  const value = request.value.trim()
  const type = request.type
  const checks: CheckResults = {}
  const allFindings: Finding[] = []

  if (type === "github") {
    const parsed = parseGitHubUrl(value)
    if (!parsed) {
      throw new DoctorInputError("Invalid GitHub URL format. Expected: https://github.com/owner/repo")
    }

    const [githubResult, extraFindings] = await Promise.all([
      checkGitHub(parsed.owner, parsed.repo, options.githubToken),
      runExtraGitHubChecks(parsed.owner, parsed.repo, options.githubToken),
    ])

    checks.github = githubResult
    allFindings.push(...githubResult.findings, ...extraFindings)

    if (githubResult.readmeContent) {
      const readmeResult = analyzeReadme(githubResult.readmeContent)
      checks.readme = readmeResult
      allFindings.push(...readmeResult.findings)
    }
  }

  if (type === "url") {
    const browserResult = await checkUrl(value)
    checks.browser = browserResult
    allFindings.push(...browserResult.findings)
  }

  if (type === "readme") {
    const readmeResult = analyzeReadme(value)
    checks.readme = readmeResult
    allFindings.push(...readmeResult.findings)
  }

  if (type === "idea") {
    allFindings.push(...buildIdeaFindings(value))
  }

  const findings = deduplicateFindings(allFindings)
  const score = computeScore(findings)
  const grade = computeGrade(score)
  const summary = buildSummary(findings)
  const verdict = verdictForGrade(grade, summary.launchBlockers)
  const nextPatch = nextPatchFromFindings(findings)
  const baseReport = {
    score,
    grade,
    verdict,
    inputType: type,
    inputValue: value.length > 200 ? `${value.slice(0, 200)}...` : value,
    timestamp: new Date().toISOString(),
    findings,
    summary,
    checks,
    nextPatch,
  }
  const actionPlan = buildActionPlan(baseReport)
  const reportWithoutMarkdown = {
    ...baseReport,
    actionPlan,
  }

  return {
    ...reportWithoutMarkdown,
    reportMarkdown: buildReportMarkdown(reportWithoutMarkdown),
  }
}

export class DoctorInputError extends Error {
  status = 400
}

function deduplicateFindings(findings: Finding[]): Finding[] {
  const seen = new Set<string>()
  return findings.filter((finding) => {
    if (seen.has(finding.id)) return false
    seen.add(finding.id)
    return true
  })
}

function buildIdeaFindings(value: string): Finding[] {
  const wordCount = value.split(/\s+/).filter(Boolean).length
  const findings: Finding[] = []

  if (wordCount < 25) {
    findings.push({
      id: "idea-too-thin",
      title: "Idea needs a sharper launch brief",
      severity: "P1",
      category: "Product",
      description: "The idea is too short to judge audience, first use case, scope, or launch channel.",
      evidence: `Idea word count: ${wordCount}`,
      impact: "Builders will make broad UI and feature decisions without a clear user or success condition.",
      fix: "Add target audience, one concrete workflow, launch channel, and the smallest useful first version.",
      claudePrompt:
        "Turn this rough product idea into a one-page launch brief with audience, job-to-be-done, MVP scope, non-goals, and acceptance criteria.",
    })
  }

  if (!/(audience|user|customer|developer|founder|creator|student|team|用户|受众|客户)/i.test(value)) {
    findings.push({
      id: "idea-no-audience",
      title: "Primary audience is not explicit",
      severity: "P1",
      category: "Positioning",
      description: "The input does not name who the product is for.",
      evidence: "No audience term detected in idea text.",
      impact: "The site cannot make strong layout, copy, pricing, or onboarding choices.",
      fix: "Name the first user segment and the situation where they would reach for this product.",
    })
  }

  if (!/(github|website|waitlist|trial|download|install|community|demo|product hunt|x\/twitter|小红书|发布|下载|安装)/i.test(value)) {
    findings.push({
      id: "idea-no-launch-channel",
      title: "Launch channel is missing",
      severity: "P2",
      category: "Launch",
      description: "The idea does not mention where the first users will come from.",
      evidence: "No launch or distribution channel detected.",
      impact: "The first version may optimize for the wrong CTA and proof points.",
      fix: "Pick one launch channel and make the homepage CTA match that channel.",
    })
  }

  findings.push({
    id: "idea-needs-repo-check",
    title: "Run Doctor again when a repo or URL exists",
    severity: "P3",
    category: "Evidence",
    description: "Idea mode can only inspect product clarity. It cannot verify install, browser, or GitHub health.",
    evidence: "Input type: idea",
    impact: "The launch verdict remains incomplete until there is a repo, README, or public URL.",
    fix: "Create the first repo or deploy preview, then run Shipwright Doctor on that artifact.",
  })

  return findings
}
