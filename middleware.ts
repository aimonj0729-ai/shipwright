import { NextResponse, type NextRequest } from "next/server"

const ALLOWED_ORIGINS = new Set([
  "https://shipwright.com.cn",
  "https://www.shipwright.com.cn",
  "https://aimonj0729-ai.github.io",
  "http://localhost:4173",
  "http://localhost:4174",
  "http://127.0.0.1:4173",
  "http://127.0.0.1:4174",
])

function corsHeaders(origin: string | null): Record<string, string> {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://shipwright.com.cn"
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  }
}

export function middleware(req: NextRequest): NextResponse {
  const origin = req.headers.get("origin")
  const headers = corsHeaders(origin)

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers })
  }

  const res = NextResponse.next()
  for (const [key, value] of Object.entries(headers)) {
    res.headers.set(key, value)
  }
  return res
}

export const config = {
  matcher: "/api/:path*",
}
