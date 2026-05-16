import { NextRequest, NextResponse } from "next/server"
import type { DoctorRequest } from "@/lib/types"
import {
  DoctorInputError,
  runDoctorCheck,
  validateDoctorRequest,
} from "@/lib/doctor/orchestrator"

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let body: DoctorRequest
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const validationError = validateDoctorRequest(body)
    if (validationError) {
      const status = validationError.startsWith("Input too large") ? 413 : 400
      return NextResponse.json({ error: validationError }, { status })
    }

    const report = await runDoctorCheck(body, {
      githubToken: process.env.GITHUB_TOKEN || undefined,
    })

    return NextResponse.json(report)
  } catch (err: unknown) {
    if (err instanceof DoctorInputError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }

    console.error("Doctor route error:", err)
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const value = req.nextUrl.searchParams.get("value")
  const type = req.nextUrl.searchParams.get("type") as DoctorRequest["type"] | null

  if (!value || !type) {
    return NextResponse.json(
      { error: "Pass both type and value query parameters." },
      { status: 400 }
    )
  }

  try {
    const body: DoctorRequest = { type, value }
    const validationError = validateDoctorRequest(body)
    if (validationError) {
      const status = validationError.startsWith("Input too large") ? 413 : 400
      return NextResponse.json({ error: validationError }, { status })
    }

    const report = await runDoctorCheck(body, {
      githubToken: process.env.GITHUB_TOKEN || undefined,
    })

    return NextResponse.json(report)
  } catch (err: unknown) {
    if (err instanceof DoctorInputError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }

    console.error("Doctor route error:", err)
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    )
  }
}
