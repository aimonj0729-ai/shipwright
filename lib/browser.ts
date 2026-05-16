import type { Finding, BrowserCheckResult } from "./types"

const MAX_REDIRECTS = 5
const TIMEOUT_MS = 15000
const MAX_HTML_BYTES = 600_000

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
  bodyText?: string
  bodyBytes?: number
  error?: string
  isTimeout?: boolean
  blockedHost?: string
}

interface PageEvidence {
  title?: string
  hasMetaDescription: boolean
  hasViewportMeta: boolean
  htmlBytes?: number
  findings: Finding[]
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

      const body = await readHtmlSnippet(res, headerEntries)

      return {
        ok: true,
        status: res.status,
        responseTimeMs: Date.now() - start,
        finalUrl: currentUrl.toString(),
        headers: headerEntries,
        bodyText: body.text,
        bodyBytes: body.bytes,
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

async function readHtmlSnippet(
  res: Response,
  headers: Record<string, string>
): Promise<{ text?: string; bytes?: number }> {
  const contentType = headers["content-type"] ?? ""
  if (!contentType.toLowerCase().includes("text/html")) {
    return {}
  }

  const declaredLength = Number(headers["content-length"] ?? "0")
  if (declaredLength > MAX_HTML_BYTES) {
    return { bytes: declaredLength }
  }

  const reader = res.body?.getReader()
  if (!reader) return {}

  const chunks: Uint8Array[] = []
  let bytes = 0

  while (bytes < MAX_HTML_BYTES) {
    const { done, value } = await reader.read()
    if (done) break
    if (!value) continue
    chunks.push(value)
    bytes += value.byteLength
  }

  const merged = new Uint8Array(bytes)
  let offset = 0
  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.byteLength
  }

  return {
    bytes,
    text: new TextDecoder("utf-8", { fatal: false }).decode(merged),
  }
}

function analyzePageEvidence(html: string | undefined, htmlBytes: number | undefined): PageEvidence {
  const findings: Finding[] = []
  const evidence: PageEvidence = {
    hasMetaDescription: false,
    hasViewportMeta: false,
    htmlBytes,
    findings,
  }

  if (!html) {
    if (htmlBytes && htmlBytes > MAX_HTML_BYTES) {
      findings.push({
        id: "url-html-too-heavy",
        title: "HTML payload is heavy",
        severity: "P2",
        category: "Performance",
        description: "The initial HTML response is large enough to slow mobile first render.",
        evidence: `HTML content-length: ${htmlBytes} bytes`,
        impact: "Mobile users wait longer before the browser can parse and render the page.",
        fix: "Reduce server-rendered payload, defer non-critical markup, and move large inline data below the fold.",
      })
    }
    return evidence
  }

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = normalizeHtmlText(titleMatch?.[1] ?? "")
  evidence.title = title || undefined
  evidence.hasMetaDescription = /<meta\s+[^>]*name=["']description["'][^>]*content=["'][^"']{20,}["'][^>]*>/i.test(html)
  evidence.hasViewportMeta = /<meta\s+[^>]*name=["']viewport["'][^>]*>/i.test(html)

  if (!title) {
    findings.push({
      id: "url-no-title",
      title: "Page has no document title",
      severity: "P1",
      category: "Browser",
      description: "The fetched HTML does not include a usable <title>.",
      evidence: "No non-empty <title> tag detected in initial HTML.",
      impact: "Search results, tabs, bookmarks, and social previews look unfinished.",
      fix: "Add a concise page title that names the product and promise.",
    })
  }

  if (!evidence.hasMetaDescription) {
    findings.push({
      id: "url-no-meta-description",
      title: "Page has no useful meta description",
      severity: "P2",
      category: "Browser",
      description: "The fetched HTML does not include a description meta tag with enough content.",
      evidence: "No meta name=\"description\" with at least 20 characters detected.",
      impact: "Search and social previews may be vague or auto-generated.",
      fix: "Add a concrete meta description explaining what the page does and who it is for.",
    })
  }

  if (!evidence.hasViewportMeta) {
    findings.push({
      id: "url-no-viewport",
      title: "Page is missing mobile viewport metadata",
      severity: "P1",
      category: "Mobile",
      description: "The fetched HTML has no viewport meta tag.",
      evidence: "No meta name=\"viewport\" tag detected.",
      impact: "Mobile browsers may render the page at desktop width, making it feel slow and broken.",
      fix: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> to the document head.",
    })
  }

  if (htmlBytes && htmlBytes > 350_000) {
    findings.push({
      id: "url-large-html",
      title: "Initial HTML is large for mobile",
      severity: "P2",
      category: "Performance",
      description: "The first HTML response is large enough to delay parsing on mobile devices.",
      evidence: `HTML bytes read: ${htmlBytes}`,
      impact: "Slow networks and lower-power phones will take longer to reach interactive UI.",
      fix: "Split below-the-fold sections, remove inline payloads, and lazy-load non-critical widgets.",
    })
  }

  return evidence
}

function normalizeHtmlText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
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
  const pageEvidence = analyzePageEvidence(outcome.bodyText, outcome.bodyBytes)
  findings.push(...pageEvidence.findings)

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
    pageTitle: pageEvidence.title,
    hasMetaDescription: pageEvidence.hasMetaDescription,
    hasViewportMeta: pageEvidence.hasViewportMeta,
    htmlBytes: pageEvidence.htmlBytes,
    findings,
  }
}
