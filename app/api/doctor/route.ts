import { NextRequest, NextResponse } from "next/server"
import type {
  DoctorRequest,
  DoctorReport,
  Finding,
  CheckResults,
} from "@/lib/types"
import { computeScore, computeGrade, buildSummary } from "@/lib/scoring"
import { parseGitHubUrl, checkGitHub } from "@/lib/github"
import { checkUrl } from "@/lib/browser"
import { analyzeReadme } from "@/lib/readme-analyzer"

const MAX_INPUT_LENGTH = 100_000

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let body: DoctorRequest
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const { type, value } = body
    if (!type || !value || typeof value !== "string") {
      return NextResponse.json({ error: "Missing type or value" }, { status: 400 })
    }

    if (value.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: `Input too large (max ${MAX_INPUT_LENGTH} chars)` },
        { status: 413 }
      )
    }

    const validTypes = ["github", "url", "readme", "idea"]
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }

    const checks: CheckResults = {}
    const allFindings: Finding[] = []
    const token = process.env.GITHUB_TOKEN || undefined

    switch (type) {
      case "github": {
        const parsed = parseGitHubUrl(value)
        if (!parsed) {
          return NextResponse.json(
            { error: "Invalid GitHub URL format. Expected: https://github.com/owner/repo" },
            { status: 400 }
          )
        }

        const ghResult = await checkGitHub(parsed.owner, parsed.repo, token)
        checks.github = ghResult
        allFindings.push(...ghResult.findings)

        if (ghResult.readmeContent) {
          const readmeResult = analyzeReadme(ghResult.readmeContent)
          checks.readme = readmeResult
          allFindings.push(...readmeResult.findings)
        }
        break
      }

      case "url": {
        const browserResult = await checkUrl(value)
        checks.browser = browserResult
        allFindings.push(...browserResult.findings)
        break
      }

      case "readme": {
        const readmeResult = analyzeReadme(value)
        checks.readme = readmeResult
        allFindings.push(...readmeResult.findings)
        break
      }

      case "idea": {
        allFindings.push({
          id: "idea-no-repo",
          title: "No repository to check",
          severity: "P3",
          category: "Info",
          description:
            "Product idea mode provides guidance only. Create a repo and run Doctor again for real checks.",
          evidence: "Input type: idea",
          impact: "N/A",
          fix: "Create a GitHub repository and run Doctor with the repo URL.",
        })
        break
      }
    }

    const dedupedFindings = deduplicateFindings(allFindings)
    const score = computeScore(dedupedFindings)
    const grade = computeGrade(score)
    const summary = buildSummary(dedupedFindings)

    const report: DoctorReport = {
      score,
      grade,
      inputType: type,
      inputValue: value.length > 200 ? value.slice(0, 200) + "..." : value,
      timestamp: new Date().toISOString(),
      findings: dedupedFindings,
      summary,
      checks,
    }

    return NextResponse.json(report)
  } catch (err: unknown) {
    console.error("Doctor route error:", err)
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    )
  }
}

function deduplicateFindings(findings: Finding[]): Finding[] {
  const seen = new Set<string>()
  return findings.filter((f) => {
    if (seen.has(f.id)) return false
    seen.add(f.id)
    return true
  })
}
