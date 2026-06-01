import { getSession } from "@/lib/session"

const SCANNER_URL = process.env.NEXT_PUBLIC_SCANNER_URL ?? "http://localhost:8001"

// ── Response types (matching actual /scan-document response) ───────────────────

export interface ScannedField {
  value:      string | null
  confidence: number       // 0.0 – 1.0
  filled:     boolean
}

export interface ScanDocumentSource {
  documentType: string   // e.g. "UNKNOWN", "KTP", "PASSPORT"
  autoDetected: boolean
  confidence:   number
  fieldsFound:  number
}

export interface ScanDocumentResult {
  countryCode:       string
  extractionMethod:  string          // e.g. "vision"
  confidence:        number
  fields:            Record<string, ScannedField>
  warnings:          string[]
  sources:           ScanDocumentSource[]
}

// ── API call ───────────────────────────────────────────────────────────────────

export async function scanDocument(
  files:       File[],
  countryCode: string,
): Promise<ScanDocumentResult> {
  const token = getSession()?.token
  if (!token) throw new Error("Session expired. Please log in again.")

  const form = new FormData()
  files.forEach((f) => form.append("files", f))
  form.append("countryCode", countryCode)

  const res = await fetch(`${SCANNER_URL}/scan-document`, {
    method:  "POST",
    headers: { Authorization: `Bearer ${token}` },
    body:    form,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      (err as { message?: string }).message ?? `Scan failed (${res.status})`,
    )
  }

  return res.json() as Promise<ScanDocumentResult>
}
