import { getSession } from "@/lib/session"

const SCANNER_URL = process.env.NEXT_PUBLIC_SCANNER_URL ?? "http://localhost:8001"


export interface ScannedItem {
  name: string
  category: string
  estimatedPrice: number
  confidence: number
  lowConfidence: boolean
  note: string | null
}

export interface ScannedRoom {
  roomType: string
  photoIndex: number
  items: ScannedItem[]
  subtotal: number
}

export interface ScanContentResult {
  countryCode: string
  currency: string
  rooms: ScannedRoom[]
  totalEstimate: number
  totalItems: number
  warnings: string[]
}


export async function scanContent(
  files: File[],
  countryCode: string,
): Promise<ScanContentResult> {
  const token = getSession()?.token
  if (!token) throw new Error("Session expired. Please log in again.")

  const form = new FormData()
  files.forEach((f) => form.append("files", f))
  form.append("countryCode", countryCode)

  const res = await fetch(`${SCANNER_URL}/scan-content`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg =
      (err as { message?: string }).message ??
      `Scan failed (${res.status})`
    throw new Error(msg)
  }

  return res.json() as Promise<ScanContentResult>
}
