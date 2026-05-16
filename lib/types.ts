export type DoctorInputType = "github" | "url" | "readme" | "idea"

export type Severity = "P0" | "P1" | "P2" | "P3"

export type Grade = "A" | "B" | "C" | "D" | "F"

export interface DoctorRequest {
  type: DoctorInputType
  value: string
  apiKey?: string
  apiBase?: string
}

export interface Finding {
  id: string
  title: string
  severity: Severity
  category: string
  description: string
  evidence: string
  impact: string
  fix: string
  claudePrompt?: string
}

export interface DoctorReport {
  score: number
  grade: Grade
  verdict: string
  inputType: DoctorInputType
  inputValue: string
  timestamp: string
  findings: Finding[]
  summary: DoctorSummary
  checks: CheckResults
  actionPlan: DoctorActionPlan
  reportMarkdown: string
  nextPatch: string
}

export interface DoctorSummary {
  launchBlockers: number
  criticalIssues: number
  improvements: number
  suggestions: number
  quickWins: Finding[]
}

export interface DoctorActionItem {
  id: string
  severity: Severity
  category: string
  title: string
  fix: string
  prompt: string
}

export interface DoctorActionPlan {
  shipDecision: string
  immediate: DoctorActionItem[]
  quickWins: DoctorActionItem[]
  followUps: DoctorActionItem[]
  agentPrompt: string
}

export interface CheckResults {
  github?: GitHubCheckResult
  browser?: BrowserCheckResult
  readme?: ReadmeCheckResult
}

export interface GitHubCheckResult {
  exists: boolean
  name?: string
  description?: string
  stars?: number
  forks?: number
  openIssues?: number
  topics?: string[]
  license?: string
  hasReadme: boolean
  readmeContent?: string
  packageJson?: Record<string, unknown>
  lastPush?: string
  defaultBranch?: string
  language?: string
  isArchived?: boolean
  findings: Finding[]
}

export interface BrowserCheckResult {
  reachable: boolean
  statusCode?: number
  redirectUrl?: string
  responseTimeMs?: number
  hasHttps: boolean
  headers?: Record<string, string>
  pageTitle?: string
  hasMetaDescription?: boolean
  hasViewportMeta?: boolean
  htmlBytes?: number
  findings: Finding[]
}

export interface ReadmeCheckResult {
  hasTitle: boolean
  hasDescription: boolean
  hasInstallation: boolean
  hasUsage: boolean
  hasLicense: boolean
  hasContributing: boolean
  hasBadges: boolean
  hasScreenshots: boolean
  wordCount: number
  sectionCount: number
  score: number
  findings: Finding[]
}
