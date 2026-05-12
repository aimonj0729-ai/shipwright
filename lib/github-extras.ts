import type { Finding } from "./types"

interface RepoFile {
  type: "file" | "dir"
  name: string
  path: string
}

interface GhContent {
  content?: string
  encoding?: string
  type?: string
}

async function ghJson<T>(path: string, token?: string): Promise<T | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`https://api.github.com${path}`, { headers })
  if (!res.ok) return null
  return res.json() as Promise<T>
}

async function pathExists(owner: string, repo: string, path: string, token?: string): Promise<boolean> {
  const data = await ghJson<GhContent | RepoFile[]>(`/repos/${owner}/${repo}/contents/${path}`, token)
  return data !== null
}

async function fetchFileText(owner: string, repo: string, path: string, token?: string): Promise<string | null> {
  const data = await ghJson<GhContent>(`/repos/${owner}/${repo}/contents/${path}`, token)
  if (!data?.content) return null
  try {
    return Buffer.from(data.content, "base64").toString("utf-8")
  } catch {
    return null
  }
}

export async function runExtraGitHubChecks(
  owner: string,
  repo: string,
  token?: string
): Promise<Finding[]> {
  const findings: Finding[] = []

  const [
    workflowsExists,
    securityExists,
    contributingExists,
    cocExists,
    issueTemplatesExists,
    pkgText,
  ] = await Promise.all([
    pathExists(owner, repo, ".github/workflows", token),
    Promise.all([
      pathExists(owner, repo, "SECURITY.md", token),
      pathExists(owner, repo, ".github/SECURITY.md", token),
    ]).then((arr) => arr.some(Boolean)),
    Promise.all([
      pathExists(owner, repo, "CONTRIBUTING.md", token),
      pathExists(owner, repo, ".github/CONTRIBUTING.md", token),
    ]).then((arr) => arr.some(Boolean)),
    Promise.all([
      pathExists(owner, repo, "CODE_OF_CONDUCT.md", token),
      pathExists(owner, repo, ".github/CODE_OF_CONDUCT.md", token),
    ]).then((arr) => arr.some(Boolean)),
    pathExists(owner, repo, ".github/ISSUE_TEMPLATE", token),
    fetchFileText(owner, repo, "package.json", token),
  ])

  if (!workflowsExists) {
    findings.push({
      id: "github-no-ci",
      title: "No CI/CD workflows detected",
      severity: "P1",
      category: "Automation",
      description: "Repository has no .github/workflows directory.",
      evidence: "GET /repos/{owner}/{repo}/contents/.github/workflows returned 404",
      impact: "No automated tests, builds, or deploy checks run on each PR. Regressions can ship unnoticed.",
      fix: "Add a basic GitHub Actions workflow that runs tests on push and pull_request.",
      claudePrompt:
        "Create a .github/workflows/ci.yml that installs dependencies, runs the project's test command, and runs on push and pull_request to the default branch.",
    })
  }

  if (!securityExists) {
    findings.push({
      id: "github-no-security",
      title: "No SECURITY.md",
      severity: "P3",
      category: "Trust",
      description: "Repository has no SECURITY.md explaining how to report vulnerabilities.",
      evidence: "Neither /SECURITY.md nor /.github/SECURITY.md exists.",
      impact: "Researchers may not know where to report security issues, and may disclose publicly instead.",
      fix: "Add a SECURITY.md with a contact email and a brief disclosure policy.",
    })
  }

  if (!contributingExists) {
    findings.push({
      id: "github-no-contributing",
      title: "No CONTRIBUTING.md",
      severity: "P3",
      category: "Trust",
      description: "Repository has no CONTRIBUTING.md.",
      evidence: "Neither /CONTRIBUTING.md nor /.github/CONTRIBUTING.md exists.",
      impact: "Contributors don't know how to set up the project, run tests, or submit PRs.",
      fix: "Add a CONTRIBUTING.md with development setup, test commands, and PR conventions.",
    })
  }

  if (!cocExists) {
    findings.push({
      id: "github-no-coc",
      title: "No CODE_OF_CONDUCT.md",
      severity: "P3",
      category: "Trust",
      description: "Repository has no CODE_OF_CONDUCT.md.",
      evidence: "Neither /CODE_OF_CONDUCT.md nor /.github/CODE_OF_CONDUCT.md exists.",
      impact: "Community contributors may feel unsafe without explicit conduct expectations.",
      fix: "Add the Contributor Covenant or a similar code of conduct.",
    })
  }

  if (!issueTemplatesExists) {
    findings.push({
      id: "github-no-issue-templates",
      title: "No issue templates",
      severity: "P3",
      category: "Trust",
      description: "Repository has no .github/ISSUE_TEMPLATE directory.",
      evidence: "/.github/ISSUE_TEMPLATE returned 404",
      impact: "Bug reports come in unstructured, missing reproduction steps and environment info.",
      fix: "Add bug_report.md and feature_request.md templates under .github/ISSUE_TEMPLATE.",
    })
  }

  if (pkgText) {
    try {
      const pkg = JSON.parse(pkgText) as Record<string, unknown>
      const scripts = (pkg.scripts ?? {}) as Record<string, string>

      if (!scripts.test || /no test specified|exit 1/i.test(scripts.test)) {
        findings.push({
          id: "pkg-no-test-script",
          title: "package.json has no real test script",
          severity: "P1",
          category: "Automation",
          description: "package.json is missing a meaningful `test` script.",
          evidence: `scripts.test = ${JSON.stringify(scripts.test ?? null)}`,
          impact: "CI cannot verify changes. Other contributors can't run tests with a known command.",
          fix: "Set a real test command in package.json scripts (e.g., 'vitest', 'jest', or 'node --test').",
        })
      }

      if (!scripts.build && !scripts.start && !scripts.dev) {
        findings.push({
          id: "pkg-no-build-script",
          title: "package.json has no build/start/dev script",
          severity: "P2",
          category: "Automation",
          description: "package.json is missing build/start/dev scripts.",
          evidence: `scripts = ${JSON.stringify(Object.keys(scripts))}`,
          impact: "Users don't know how to run or build the project from a fresh clone.",
          fix: "Add appropriate build, start, or dev scripts.",
        })
      }

      if (!pkg.description) {
        findings.push({
          id: "pkg-no-description",
          title: "package.json missing description",
          severity: "P3",
          category: "Trust",
          description: "package.json has no description field.",
          evidence: "description is undefined or empty",
          impact: "Less informative on npm, less SEO value, weaker first impression.",
          fix: "Set a one-line description in package.json.",
        })
      }

      if (!pkg.repository) {
        findings.push({
          id: "pkg-no-repository",
          title: "package.json missing repository field",
          severity: "P3",
          category: "Trust",
          description: "package.json has no repository field.",
          evidence: "repository is undefined",
          impact: "npm package page won't link back to source.",
          fix: 'Add a repository field: { "type": "git", "url": "..." }.',
        })
      }
    } catch {
      findings.push({
        id: "pkg-malformed",
        title: "package.json is malformed",
        severity: "P0",
        category: "Automation",
        description: "package.json failed to parse as JSON.",
        evidence: "JSON.parse threw",
        impact: "npm install will fail and no tooling will work.",
        fix: "Validate package.json with `node -e \"JSON.parse(require('fs').readFileSync('package.json'))\"`.",
      })
    }
  }

  return findings
}
