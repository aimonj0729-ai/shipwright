import { NextRequest, NextResponse } from "next/server"
import { parseGitHubUrl, checkGitHub } from "@/lib/github"

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

  const parsed = parseGitHubUrl(body.url)
  if (!parsed) {
    return NextResponse.json(
      { error: "Could not parse GitHub URL. Expected format: https://github.com/owner/repo" },
      { status: 400 }
    )
  }

  const token = process.env.GITHUB_TOKEN || undefined
  const result = await checkGitHub(parsed.owner, parsed.repo, token)

  return NextResponse.json(result)
}
