import { NextRequest, NextResponse } from "next/server"
import type { Finding } from "@/lib/types"

interface AiExplainRequest {
  finding: Finding
  apiKey: string
  apiBase?: string
  model?: string
}

const DEFAULT_BASE = "https://api.gptsapi.net"
const DEFAULT_MODEL = "claude-sonnet-4-20250514"

const SYSTEM_PROMPT = `You are Shipwright Doctor, an expert in launch readiness for indie and AI-built projects.

The user will give you a single Finding from a launch QA report. Produce a focused fix plan:
1. **Why this matters** — 1-2 sentences on real-world impact.
2. **The fix** — concrete step-by-step actions, with file paths and minimal code/config snippets.
3. **Copy-paste prompt** — a single prompt the user can give Claude Code or Codex to apply the fix.

Be terse. No filler. Markdown formatting. Stop at the prompt — no closing remarks.`

export async function POST(req: NextRequest): Promise<Response> {
  let body: AiExplainRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { finding, apiKey } = body
  const apiBase = (body.apiBase || DEFAULT_BASE).replace(/\/+$/, "")
  const model = body.model || DEFAULT_MODEL

  if (!finding || !finding.id || !finding.title) {
    return NextResponse.json({ error: "Missing finding" }, { status: 400 })
  }
  if (!apiKey || typeof apiKey !== "string" || apiKey.length < 8) {
    return NextResponse.json({ error: "Missing or invalid apiKey" }, { status: 400 })
  }

  const findingText = [
    `Severity: ${finding.severity}`,
    `Category: ${finding.category}`,
    `Title: ${finding.title}`,
    `Description: ${finding.description}`,
    `Evidence: ${finding.evidence}`,
    `Impact: ${finding.impact}`,
    `Suggested fix: ${finding.fix}`,
  ].join("\n")

  const upstreamUrl = `${apiBase}/v1/chat/completions`

  let upstreamRes: Response
  try {
    upstreamRes = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: true,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: findingText },
        ],
      }),
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: `Upstream connection failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 }
    )
  }

  if (!upstreamRes.ok || !upstreamRes.body) {
    const text = await upstreamRes.text().catch(() => "")
    return NextResponse.json(
      { error: `Upstream ${upstreamRes.status}: ${text.slice(0, 500)}` },
      { status: upstreamRes.status }
    )
  }

  return new Response(upstreamRes.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
