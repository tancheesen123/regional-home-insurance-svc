import { getSession } from "@/lib/session"

const SCANNER_URL = process.env.NEXT_PUBLIC_SCANNER_URL ?? "http://localhost:8001"


export interface ScannedField {
  value:      string | null
  confidence: number
  filled:     boolean
}

export interface ScanDocumentSource {
  documentType: string
  autoDetected: boolean
  confidence:   number
  fieldsFound:  number
}

export interface ScanDocumentResult {
  countryCode:       string
  extractionMethod:  string
  confidence:        number
  fields:            Record<string, ScannedField>
  warnings:          string[]
  sources:           ScanDocumentSource[]
}


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
