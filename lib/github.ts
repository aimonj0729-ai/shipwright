import type { Finding, GitHubCheckResult } from "./types"

interface GitHubRepo {
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  topics: string[]
  license: { spdx_id: string } | null
  pushed_at: string
  default_branch: string
  language: string | null
  archived: boolean
}

interface GitHubContent {
  content: string
  encoding: string
}

export function parseGitHubUrl(input: string): { owner: string; repo: string } | null {
  const cleaned = input
    .trim()
    .replace(/\.git$/i, "")
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "")

  const urlMatch = cleaned.match(
    /github\.com\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)/
  )
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] }

  const shortMatch = cleaned.match(/^([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)$/)
  if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] }

  return null
}

async function ghFetch<T>(path: string, token?: string): Promise<T | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`https://api.github.com${path}`, { headers })
  if (!res.ok) return null
  return res.json() as Promise<T>
}

export async function checkGitHub(
  owner: string,
  repo: string,
  token?: string
): Promise<GitHubCheckResult> {
  const findings: Finding[] = []

  const repoData = await ghFetch<GitHubRepo>(`/repos/${owner}/${repo}`, token)

  if (!repoData) {
    return {
      exists: false,
      hasReadme: false,
      findings: [
        {
          id: "github-not-found",
          title: "Repository not found",
          severity: "P0",
          category: "GitHub",
          description: `Repository ${owner}/${repo} does not exist or is private.`,
          evidence: "GitHub API returned 404.",
          impact: "Cannot perform any GitHub-based checks.",
          fix: "Verify the repository URL. If private, checks are limited.",
        },
      ],
    }
  }

  if (repoData.archived) {
    findings.push({
      id: "github-archived",
      title: "Repository is archived",
      severity: "P0",
      category: "GitHub",
      description: "This repository is marked as archived — no new contributions accepted.",
      evidence: "GitHub API: archived = true",
      impact: "Users will assume the project is abandoned.",
      fix: "Unarchive the repository if it's still actively maintained.",
    })
  }

  if (!repoData.description) {
    findings.push({
      id: "github-no-description",
      title: "Repository has no description",
      severity: "P1",
      category: "GitHub",
      description: "The repo has no description on GitHub.",
      evidence: "GitHub API: description = null",
      impact: "Appears low-effort in search results and social shares.",
      fix: "Add a one-line description in repo settings.",
      claudePrompt: "Write a concise GitHub repo description for this project.",
    })
  }

  if (!repoData.topics || repoData.topics.length === 0) {
    findings.push({
      id: "github-no-topics",
      title: "No topics/tags set",
      severity: "P2",
      category: "GitHub",
      description: "Repository has no topics set.",
      evidence: "GitHub API: topics = []",
      impact: "Harder to discover via GitHub search and explore.",
      fix: "Add 3-5 relevant topics in repo settings.",
    })
  }

  if (!repoData.license) {
    findings.push({
      id: "github-no-license",
      title: "No license file detected",
      severity: "P1",
      category: "GitHub",
      description: "GitHub did not detect a license for this repository.",
      evidence: "GitHub API: license = null",
      impact: "Without a license, others legally cannot use or contribute to the code.",
      fix: "Add a LICENSE file. MIT or Apache-2.0 are common choices for open source.",
      claudePrompt: "Add a MIT LICENSE file to this repository.",
    })
  }

  const lastPush = new Date(repoData.pushed_at)
  const daysSincePush = Math.floor(
    (Date.now() - lastPush.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (daysSincePush > 180) {
    findings.push({
      id: "github-stale",
      title: "Repository appears stale",
      severity: "P2",
      category: "GitHub",
      description: `Last push was ${daysSincePush} days ago.`,
      evidence: `pushed_at: ${repoData.pushed_at}`,
      impact: "Users may perceive the project as unmaintained.",
      fix: "Push an update, even if it's just documentation improvements.",
    })
  }

  const readmeData = await ghFetch<GitHubContent>(
    `/repos/${owner}/${repo}/readme`,
    token
  )
  const hasReadme = readmeData !== null
  let readmeContent: string | undefined
  if (readmeData?.content) {
    readmeContent = Buffer.from(readmeData.content, "base64").toString("utf-8")
  }

  if (!hasReadme) {
    findings.push({
      id: "github-no-readme",
      title: "No README file",
      severity: "P0",
      category: "GitHub",
      description: "Repository has no README file.",
      evidence: "GitHub API returned 404 for /readme endpoint.",
      impact: "Visitors have no idea what this project is or how to use it.",
      fix: "Create a README.md with project description, installation, and usage.",
      claudePrompt: "Create a comprehensive README.md for this project.",
    })
  }

  let packageJson: Record<string, unknown> | undefined
  const pkgData = await ghFetch<GitHubContent>(
    `/repos/${owner}/${repo}/contents/package.json`,
    token
  )
  if (pkgData?.content) {
    try {
      packageJson = JSON.parse(
        Buffer.from(pkgData.content, "base64").toString("utf-8")
      ) as Record<string, unknown>
    } catch {
      // malformed package.json
    }
  }

  return {
    exists: true,
    name: repoData.name,
    description: repoData.description ?? undefined,
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    openIssues: repoData.open_issues_count,
    topics: repoData.topics,
    license: repoData.license?.spdx_id,
    hasReadme,
    readmeContent,
    packageJson,
    lastPush: repoData.pushed_at,
    defaultBranch: repoData.default_branch,
    language: repoData.language ?? undefined,
    isArchived: repoData.archived,
    findings,
  }
}
