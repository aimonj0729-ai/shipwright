"use client"

import { useState } from "react"
import type { DoctorInputType, DoctorReport } from "@/lib/types"

const INPUT_TABS: { type: DoctorInputType; label: string; placeholder: string; icon: string }[] = [
  {
    type: "github",
    label: "GitHub Repo",
    placeholder: "https://github.com/user/repo",
    icon: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z",
  },
  {
    type: "url",
    label: "Live URL",
    placeholder: "https://your-project.com",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  },
  {
    type: "readme",
    label: "README Text",
    placeholder: "Paste your README.md content here...",
    icon: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  },
  {
    type: "idea",
    label: "Product Idea",
    placeholder: "Describe your product idea and we'll assess launch readiness...",
    icon: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z",
  },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<DoctorInputType>("github")
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<DoctorReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activeConfig = INPUT_TABS.find((t) => t.type === activeTab)!

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!inputValue.trim()) return

    setLoading(true)
    setError(null)
    setReport(null)

    try {
      const res = await fetch("/api/doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, value: inputValue.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? `Server error: ${res.status}`)
      }

      const data: DoctorReport = await res.json()
      setReport(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span style={styles.logoText}>Shipwright Doctor</span>
        </div>
        <a href="/site/" style={styles.siteLink}>About Shipwright</a>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.h1}>
            Is your project ready to launch?
          </h1>
          <p style={styles.subtitle}>
            Paste a GitHub repo, live URL, or README — get an honest health report in seconds.
          </p>
        </section>

        <form onSubmit={handleSubmit} style={styles.card}>
          <div style={styles.tabs}>
            {INPUT_TABS.map((tab) => (
              <button
                key={tab.type}
                type="button"
                onClick={() => { setActiveTab(tab.type); setInputValue(""); setReport(null); setError(null) }}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.type ? styles.tabActive : {}),
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "readme" || activeTab === "idea" ? (
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={activeConfig.placeholder}
              rows={6}
              style={styles.textarea}
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={activeConfig.placeholder}
              style={styles.input}
            />
          )}

          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            style={{
              ...styles.submitBtn,
              ...(loading || !inputValue.trim() ? styles.submitBtnDisabled : {}),
            }}
          >
            {loading ? "Analyzing..." : "Run Doctor Check"}
          </button>
        </form>

        {error && (
          <div style={styles.errorBox}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {report && <ReportView report={report} />}
      </main>

      <footer style={styles.footer}>
        <p>Shipwright Doctor — Launch QA for AI-built projects</p>
        <p style={{ fontSize: "12px", opacity: 0.6 }}>
          All checks are real. No data is stored. Your code is never executed.
        </p>
      </footer>
    </div>
  )
}

function ReportView({ report }: { report: DoctorReport }) {
  const gradeColors: Record<string, string> = {
    A: "#059669",
    B: "#0d9488",
    C: "#d97706",
    D: "#dc2626",
    F: "#991b1b",
  }

  return (
    <div style={styles.report}>
      <div style={styles.scoreHeader}>
        <div
          style={{
            ...styles.gradeCircle,
            borderColor: gradeColors[report.grade] ?? "#666",
            color: gradeColors[report.grade] ?? "#666",
          }}
        >
          {report.grade}
        </div>
        <div>
          <div style={styles.scoreNumber}>{report.score}/100</div>
          <div style={styles.scoreLabel}>Launch Readiness Score</div>
        </div>
      </div>

      <div style={styles.summaryGrid}>
        <SummaryCard label="Launch Blockers" count={report.summary.launchBlockers} color="#dc2626" />
        <SummaryCard label="Critical Issues" count={report.summary.criticalIssues} color="#ea580c" />
        <SummaryCard label="Improvements" count={report.summary.improvements} color="#d97706" />
        <SummaryCard label="Suggestions" count={report.summary.suggestions} color="#0d9488" />
      </div>

      {report.findings.length > 0 && (
        <div style={styles.findingsSection}>
          <h3 style={styles.findingsTitle}>Findings</h3>
          {report.findings.map((f) => (
            <FindingCard key={f.id} finding={f} />
          ))}
        </div>
      )}

      {report.findings.length === 0 && (
        <div style={{ ...styles.errorBox, borderColor: "#059669", background: "#f0fdf4", color: "#065f46" }}>
          No issues found — your project looks launch-ready!
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={styles.summaryCard}>
      <div style={{ ...styles.summaryCount, color }}>{count}</div>
      <div style={styles.summaryLabel}>{label}</div>
    </div>
  )
}

function FindingCard({ finding }: { finding: DoctorReport["findings"][number] }) {
  const severityColors: Record<string, { bg: string; fg: string }> = {
    P0: { bg: "#fef2f2", fg: "#dc2626" },
    P1: { bg: "#fff7ed", fg: "#ea580c" },
    P2: { bg: "#fffbeb", fg: "#d97706" },
    P3: { bg: "#f0fdfa", fg: "#0d9488" },
  }
  const sev = severityColors[finding.severity] ?? { bg: "#f5f5f5", fg: "#666" }

  return (
    <div style={styles.findingCard}>
      <div style={styles.findingHeader}>
        <span style={{ ...styles.severityBadge, background: sev.bg, color: sev.fg }}>
          {finding.severity}
        </span>
        <span style={styles.categoryBadge}>{finding.category}</span>
        <strong>{finding.title}</strong>
      </div>
      <p style={styles.findingDesc}>{finding.description}</p>
      <div style={styles.findingMeta}>
        <div><strong>Evidence:</strong> {finding.evidence}</div>
        <div><strong>Impact:</strong> {finding.impact}</div>
        <div><strong>Fix:</strong> {finding.fix}</div>
        {finding.claudePrompt && (
          <div style={styles.promptBox}>
            <strong>Claude Code prompt:</strong>
            <code style={styles.promptCode}>{finding.claudePrompt}</code>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#fafaf9",
    color: "#1c1917",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    borderBottom: "1px solid #e7e5e4",
    background: "#fff",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: 700,
    fontSize: "18px",
  },
  logoText: { letterSpacing: "-0.02em" },
  siteLink: {
    color: "#0f766e",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
  },
  main: {
    flex: 1,
    maxWidth: "720px",
    margin: "0 auto",
    padding: "48px 24px",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  hero: { textAlign: "center" as const, marginBottom: "40px" },
  h1: {
    fontSize: "36px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
    margin: "0 0 12px",
  },
  subtitle: {
    fontSize: "17px",
    color: "#57534e",
    margin: 0,
    lineHeight: 1.5,
  },
  card: {
    background: "#fff",
    border: "1px solid #e7e5e4",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  tabs: {
    display: "flex",
    gap: "4px",
    marginBottom: "20px",
    flexWrap: "wrap" as const,
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 500,
    border: "1px solid #d6d3d1",
    borderRadius: "8px",
    background: "#fafaf9",
    color: "#57534e",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  tabActive: {
    background: "#0f766e",
    color: "#fff",
    borderColor: "#0f766e",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    border: "1px solid #d6d3d1",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    border: "1px solid #d6d3d1",
    borderRadius: "8px",
    outline: "none",
    resize: "vertical" as const,
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  },
  submitBtn: {
    marginTop: "16px",
    width: "100%",
    padding: "12px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#fff",
    background: "#0f766e",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.15s",
  },
  submitBtnDisabled: {
    background: "#a8a29e",
    cursor: "not-allowed",
  },
  errorBox: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #fca5a5",
    background: "#fef2f2",
    color: "#991b1b",
    fontSize: "14px",
  },
  report: { marginTop: "32px" },
  scoreHeader: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "24px",
  },
  gradeCircle: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    border: "3px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: 700,
    flexShrink: 0,
  },
  scoreNumber: { fontSize: "28px", fontWeight: 700 },
  scoreLabel: { fontSize: "14px", color: "#78716c" },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "32px",
  },
  summaryCard: {
    textAlign: "center" as const,
    padding: "16px 8px",
    background: "#fff",
    border: "1px solid #e7e5e4",
    borderRadius: "8px",
  },
  summaryCount: { fontSize: "24px", fontWeight: 700 },
  summaryLabel: { fontSize: "12px", color: "#78716c", marginTop: "4px" },
  findingsSection: { marginTop: "8px" },
  findingsTitle: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "16px",
    margin: "0 0 16px",
  },
  findingCard: {
    padding: "16px",
    border: "1px solid #e7e5e4",
    borderRadius: "8px",
    background: "#fff",
    marginBottom: "12px",
  },
  findingHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
    flexWrap: "wrap" as const,
  },
  severityBadge: {
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
  },
  categoryBadge: {
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    background: "#f5f5f4",
    color: "#78716c",
  },
  findingDesc: {
    margin: "0 0 12px",
    fontSize: "14px",
    color: "#44403c",
    lineHeight: 1.5,
  },
  findingMeta: {
    fontSize: "13px",
    color: "#57534e",
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  promptBox: {
    marginTop: "4px",
    padding: "8px 12px",
    background: "#f5f5f4",
    borderRadius: "6px",
    fontSize: "13px",
  },
  promptCode: {
    display: "block",
    marginTop: "4px",
    fontFamily: "monospace",
    fontSize: "12px",
    color: "#0f766e",
  },
  footer: {
    textAlign: "center" as const,
    padding: "24px",
    fontSize: "13px",
    color: "#78716c",
    borderTop: "1px solid #e7e5e4",
  },
}
