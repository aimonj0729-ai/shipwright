import type { Finding, BrowserCheckResult } from "./types"

const MAX_REDIRECTS = 5
const TIMEOUT_MS = 15000

function isPrivateHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase().trim()

  if (lower === "localhost") return true
  if (lower === "0.0.0.0") return true
  if (lower === "[::1]" || lower === "::1") return true
  if (lower.endsWith(".local") || lower.endsWith(".internal") || lower.endsWith(".localhost")) return true

  if (/^127\./.test(lower)) return true
  if (/^10\./.test(lower)) return true
  if (/^192\.168\./.test(lower)) return true
  if (/^169\.254\./.test(lower)) return true
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(lower)) return true

  return false
}

function privateHostFinding(hostname: string): Finding {
  return {
    id: "url-private-host",
    title: "URL points to an internal or private address",
    severity: "P0",
    category: "Security",
    description: "Shipwright Doctor refuses to scan internal, loopback, or cloud metadata addresses.",
    evidence: `Hostname: ${hostname}`,
    impact: "Scanning internal addresses would let attackers probe your infrastructure.",
    fix: "Submit a publicly reachable URL instead.",
  }
}

interface FetchOutcome {
  ok: boolean
  status?: number
  responseTimeMs?: number
  finalUrl?: string
  headers?: Record<string, string>
  error?: string
  isTimeout?: boolean
  blockedHost?: string
}

async function fetchWithSafeRedirects(initialUrl: URL): Promise<FetchOutcome> {
  let currentUrl = initialUrl
  const start = Date.now()

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (isPrivateHostname(currentUrl.hostname)) {
      return { ok: false, blockedHost: currentUrl.hostname }
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
      const res = await fetch(currentUrl.toString(), {
        method: "GET",
        signal: controller.signal,
        redirect: "manual",
        headers: { "User-Agent": "Shipwright-Doctor/1.0" },
      })

      clearTimeout(timer)

      const isRedirect = res.status >= 300 && res.status < 400
      const location = res.headers.get("location")

      if (isRedirect && location) {
        let nextUrl: URL
        try {
          nextUrl = new URL(location, currentUrl)
        } catch {
          return {
            ok: false,
            error: `Invalid redirect target: ${location}`,
          }
        }
        currentUrl = nextUrl
        continue
      }

      const headerEntries: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        headerEntries[key.toLowerCase()] = value
      })

      return {
        ok: true,
        status: res.status,
        responseTimeMs: Date.now() - start,
        finalUrl: currentUrl.toString(),
        headers: headerEntries,
      }
    } catch (err: unknown) {
      clearTimeout(timer)
      const isTimeout = err instanceof Error && err.name === "AbortError"
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        isTimeout,
      }
    }
  }

  return { ok: false, error: "Too many redirects" }
}

export async function checkUrl(rawUrl: string): Promise<BrowserCheckResult> {
  const findings: Finding[] = []

  let url: URL
  try {
    const trimmed = rawUrl.trim()
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : "https://" + trimmed
    url = new URL(withProto)
  } catch {
    return {
      reachable: false,
      hasHttps: false,
      findings: [
        {
          id: "url-invalid",
          title: "Invalid URL",
          severity: "P0",
          category: "URL",
          description: "The provided URL is not a valid web address.",
          evidence: `Input: ${rawUrl}`,
          impact: "Cannot perform any URL-based checks.",
          fix: "Provide a valid URL starting with https://",
        },
      ],
    }
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return {
      reachable: false,
      hasHttps: false,
      findings: [
        {
          id: "url-bad-protocol",
          title: "Unsupported URL protocol",
          severity: "P0",
          category: "URL",
          description: "Only http:// and https:// URLs are supported.",
          evidence: `Protocol: ${url.protocol}`,
          impact: "Cannot perform any URL-based checks.",
          fix: "Provide a URL starting with http:// or https://",
        },
      ],
    }
  }

  if (isPrivateHostname(url.hostname)) {
    return {
      reachable: false,
      hasHttps: url.protocol === "https:",
      findings: [privateHostFinding(url.hostname)],
    }
  }

  const hasHttps = url.protocol === "https:"

  if (!hasHttps) {
    findings.push({
      id: "url-no-https",
      title: "Site does not use HTTPS",
      severity: "P0",
      category: "Security",
      description: "The site is served over plain HTTP.",
      evidence: `Protocol: ${url.protocol}`,
      impact: "Browsers show security warnings. User data is transmitted in plaintext.",
      fix: "Enable HTTPS via your hosting provider or use a service like Cloudflare.",
    })
  }

  const outcome = await fetchWithSafeRedirects(url)

  if (outcome.blockedHost) {
    return {
      reachable: false,
      hasHttps,
      findings: [...findings, privateHostFinding(outcome.blockedHost)],
    }
  }

  if (!outcome.ok) {
    return {
      reachable: false,
      hasHttps,
      responseTimeMs: outcome.isTimeout ? TIMEOUT_MS : undefined,
      findings: [
        ...findings,
        {
          id: outcome.isTimeout ? "url-timeout" : "url-unreachable",
          title: outcome.isTimeout ? "Site timed out" : "Site is unreachable",
          severity: "P0",
          category: "URL",
          description: outcome.isTimeout
            ? `The site did not respond within ${TIMEOUT_MS / 1000} seconds.`
            : `Could not connect: ${outcome.error ?? "unknown error"}`,
          evidence: outcome.isTimeout ? `Request aborted after ${TIMEOUT_MS}ms` : (outcome.error ?? "unknown"),
          impact: "Users cannot access the site.",
          fix: outcome.isTimeout
            ? "Check server health and consider performance optimization."
            : "Verify DNS, hosting, and server are running.",
        },
      ],
    }
  }

  const statusCode = outcome.status!
  const responseTimeMs = outcome.responseTimeMs!
  const headers = outcome.headers ?? {}
  const redirectUrl = outcome.finalUrl !== url.toString() ? outcome.finalUrl : undefined

  if (statusCode >= 400) {
    findings.push({
      id: "url-error-status",
      title: `Site returns HTTP ${statusCode}`,
      severity: statusCode >= 500 ? "P0" : "P1",
      category: "URL",
      description: `The site responded with status ${statusCode}.`,
      evidence: `HTTP ${statusCode} for ${outcome.finalUrl}`,
      impact: statusCode >= 500 ? "Site is broken — server error." : "Site is returning a client error.",
      fix: "Check your deployment and server logs.",
    })
  }

  if (responseTimeMs > 5000) {
    findings.push({
      id: "url-slow",
      title: "Very slow response time",
      severity: "P1",
      category: "Performance",
      description: `Site took ${responseTimeMs}ms to respond.`,
      evidence: `Response time: ${responseTimeMs}ms`,
      impact: "Users will leave before the page loads. Search engines penalize slow sites.",
      fix: "Optimize server response time. Consider a CDN or static hosting.",
    })
  } else if (responseTimeMs > 2000) {
    findings.push({
      id: "url-moderate-slow",
      title: "Slow response time",
      severity: "P2",
      category: "Performance",
      description: `Site took ${responseTimeMs}ms to respond.`,
      evidence: `Response time: ${responseTimeMs}ms`,
      impact: "Response is noticeable. Users expect pages to load in under 2 seconds.",
      fix: "Consider caching, CDN, or optimizing server-side rendering.",
    })
  }

  if (statusCode < 400) {
    if (!headers["content-security-policy"]) {
      findings.push({
        id: "url-no-csp",
        title: "No Content-Security-Policy header",
        severity: "P2",
        category: "Security",
        description: "The site does not set a Content-Security-Policy header.",
        evidence: "CSP header missing from response.",
        impact: "Site is more vulnerable to XSS attacks.",
        fix: "Add a Content-Security-Policy header to your server configuration.",
      })
    }

    const frameAncestors = headers["content-security-policy"]?.toLowerCase().includes("frame-ancestors")
    if (!headers["x-frame-options"] && !frameAncestors) {
      findings.push({
        id: "url-no-frame-protection",
        title: "No clickjacking protection",
        severity: "P2",
        category: "Security",
        description: "Neither X-Frame-Options nor CSP frame-ancestors is set.",
        evidence: "X-Frame-Options and frame-ancestors both missing.",
        impact: "Site can be embedded in iframes, enabling clickjacking attacks.",
        fix: "Add X-Frame-Options: DENY or a CSP frame-ancestors directive.",
      })
    }
  }

  return {
    reachable: true,
    statusCode,
    redirectUrl,
    responseTimeMs,
    hasHttps,
    headers,
    findings,
  }
}
