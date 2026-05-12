import { NextRequest, NextResponse } from "next/server"
import { checkUrl } from "@/lib/browser"

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: { url: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!body.url || typeof body.url !== "string") {
    return NextResponse.json({ error: "Missing url field" }, { status: 400 })
  }

  const result = await checkUrl(body.url)

  return NextResponse.json(result)
}
