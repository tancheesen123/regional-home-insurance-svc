
export interface ScanSessionField {
  value:      string | null
  confidence: number
  filled:     boolean
  source:     "scanned" | "manual"
}

export interface ScanSession {
  scannedAt:    string
  documentType: string
  fields:       Record<string, ScanSessionField>
}


const KEY = "scanSession"


export function saveScanSession(data: ScanSession): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(KEY, JSON.stringify(data))
}

export function getScanSession(): ScanSession | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as ScanSession
  } catch {
    return null
  }
}

export function clearScanSession(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(KEY)
}

export function markFieldManual(aiKey: string): void {
  const session = getScanSession()
  if (!session?.fields[aiKey]) return
  session.fields[aiKey] = { ...session.fields[aiKey], source: "manual" }
  saveScanSession(session)
}


export const CONFIDENCE_THRESHOLD = 0.80

export function isAutoFilled(field: ScanSessionField): boolean {
  return field.filled && field.source === "scanned" && field.confidence >= CONFIDENCE_THRESHOLD
}

export function isLowConfidence(field: ScanSessionField): boolean {
  return field.filled && field.source === "scanned" && field.confidence < CONFIDENCE_THRESHOLD
}
