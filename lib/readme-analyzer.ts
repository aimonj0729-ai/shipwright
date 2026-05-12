import type { Finding, ReadmeCheckResult } from "./types"

const SECTION_PATTERNS: Record<string, RegExp> = {
  installation: /^#{1,3}\s*(install|getting\s*started|setup|quick\s*start)/im,
  usage: /^#{1,3}\s*(usage|how\s*to\s*use|examples?|demo)/im,
  license: /^#{1,3}\s*license/im,
  contributing: /^#{1,3}\s*(contribut|development|develop)/im,
}

const BADGE_PATTERN = /\[!\[.*?\]\(.*?\)\]/
const IMAGE_PATTERN = /!\[.*?\]\(.*?\.(png|jpg|jpeg|gif|svg|webp)/i

export function analyzeReadme(content: string): ReadmeCheckResult {
  const lines = content.split("\n")
  const findings: Finding[] = []

  const hasTitle = /^#\s+\S/.test(content)
  const firstNewline = content.indexOf("\n")
  const afterTitle = firstNewline === -1 ? "" : content.slice(firstNewline + 1)
  const nextHeadingIdx = afterTitle.search(/^#{1,6}\s/m)
  const preamble = nextHeadingIdx === -1
    ? afterTitle.slice(0, 500)
    : afterTitle.slice(0, nextHeadingIdx)
  const preambleWords = preamble.trim().split(/\s+/).filter(Boolean)
  const hasDescription = preambleWords.length >= 8

  const hasInstallation = SECTION_PATTERNS.installation.test(content)
  const hasUsage = SECTION_PATTERNS.usage.test(content)
  const hasLicense = SECTION_PATTERNS.license.test(content)
  const hasContributing = SECTION_PATTERNS.contributing.test(content)
  const hasBadges = BADGE_PATTERN.test(content)
  const hasScreenshots = IMAGE_PATTERN.test(content)

  const wordCount = content.split(/\s+/).filter(Boolean).length
  const sectionCount = lines.filter((l) => /^#{1,3}\s/.test(l)).length

  if (!hasTitle) {
    findings.push({
      id: "readme-no-title",
      title: "README missing title",
      severity: "P1",
      category: "README",
      description: "README does not start with a heading.",
      evidence: "First line: " + (lines[0]?.slice(0, 80) ?? "(empty)"),
      impact: "Visitors cannot immediately identify what this project is.",
      fix: "Add a `# Project Name` heading as the first line.",
      claudePrompt: "Add a clear H1 title to the top of README.md that describes the project name.",
    })
  }

  if (!hasDescription) {
    findings.push({
      id: "readme-no-description",
      title: "README missing description",
      severity: "P1",
      category: "README",
      description: "No substantive description found after the title.",
      evidence: `Preamble word count: ${preambleWords.length}`,
      impact: "Visitors won't understand what this project does in the first 10 seconds.",
      fix: "Add 1-2 sentences below the title explaining what the project does and who it's for.",
    })
  }

  if (!hasInstallation) {
    findings.push({
      id: "readme-no-install",
      title: "README missing installation instructions",
      severity: "P0",
      category: "README",
      description: "No installation or setup section found.",
      evidence: "Searched for: install, getting started, setup, quick start headings.",
      impact: "Users cannot figure out how to run the project.",
      fix: "Add a ## Installation or ## Getting Started section with step-by-step instructions.",
      claudePrompt: "Add a ## Getting Started section to README.md with installation commands for this project.",
    })
  }

  if (!hasUsage) {
    findings.push({
      id: "readme-no-usage",
      title: "README missing usage examples",
      severity: "P1",
      category: "README",
      description: "No usage or examples section found.",
      evidence: "Searched for: usage, how to use, examples, demo headings.",
      impact: "Users won't know how to actually use the project after installing.",
      fix: "Add a ## Usage section with code examples or screenshots.",
    })
  }

  if (!hasLicense) {
    findings.push({
      id: "readme-no-license",
      title: "README missing license section",
      severity: "P2",
      category: "README",
      description: "No license section found in README.",
      evidence: "No ## License heading detected.",
      impact: "Users and companies may avoid using the project due to unclear licensing.",
      fix: "Add a ## License section referencing your LICENSE file.",
    })
  }

  if (!hasBadges) {
    findings.push({
      id: "readme-no-badges",
      title: "No badges in README",
      severity: "P3",
      category: "README",
      description: "README has no status badges (build, coverage, version, etc.).",
      evidence: "No badge markdown pattern found.",
      impact: "Project appears less professional and harder to assess at a glance.",
      fix: "Add badges for build status, test coverage, npm version, or license.",
    })
  }

  if (!hasScreenshots && !hasTitle) {
    findings.push({
      id: "readme-no-visuals",
      title: "No images or screenshots",
      severity: "P3",
      category: "README",
      description: "README contains no images or screenshots.",
      evidence: "No image markdown found.",
      impact: "Visual projects benefit greatly from showing what they look like.",
      fix: "Add a screenshot or GIF demonstrating the project.",
    })
  }

  if (wordCount < 50) {
    findings.push({
      id: "readme-too-short",
      title: "README is very short",
      severity: "P1",
      category: "README",
      description: `README has only ${wordCount} words.`,
      evidence: `Word count: ${wordCount}`,
      impact: "Insufficient documentation for users to understand or use the project.",
      fix: "Expand the README with description, installation, usage, and examples.",
    })
  }

  let score = 100
  if (!hasTitle) score -= 10
  if (!hasDescription) score -= 15
  if (!hasInstallation) score -= 25
  if (!hasUsage) score -= 20
  if (!hasLicense) score -= 5
  if (!hasContributing) score -= 5
  if (!hasBadges) score -= 5
  if (!hasScreenshots) score -= 5
  if (wordCount < 50) score -= 10
  score = Math.max(0, score)

  return {
    hasTitle,
    hasDescription,
    hasInstallation,
    hasUsage,
    hasLicense,
    hasContributing,
    hasBadges,
    hasScreenshots,
    wordCount,
    sectionCount,
    score,
    findings,
  }
}
