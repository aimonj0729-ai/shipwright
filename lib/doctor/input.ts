import type { DoctorInputType } from "@/lib/types"

export function detectDoctorInputType(value: string): DoctorInputType {
  const trimmed = value.trim()
  if (/^https?:\/\/(www\.)?github\.com\//i.test(trimmed)) return "github"
  if (/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(trimmed)) return "github"
  if (/^https?:\/\//i.test(trimmed)) return "url"
  if (/^#\s+/.test(trimmed) || trimmed.split("\n").length > 3) return "readme"
  return "idea"
}
