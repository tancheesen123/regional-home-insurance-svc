// ── Types ──────────────────────────────────────────────────────────────────────

export interface ScanSessionField {
  value:      string | null
  confidence: number               // 0.0 – 1.0
  filled:     boolean
  source:     "scanned" | "manual" // updated to 'manual' when customer edits
}

export interface ScanSession {
  scannedAt:    string             // ISO timestamp
  documentType: string             // e.g. "IC", "PASSPORT", "POLICY"
  fields:       Record<string, ScanSessionField>
}

// ── Storage key ────────────────────────────────────────────────────────────────

const KEY = "scanSession"

// ── Read / Write / Clear ───────────────────────────────────────────────────────

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

/**
 * Mark a single AI field as manually edited.
 * Call this whenever the customer changes an auto-filled input.
 */
export function markFieldManual(aiKey: string): void {
  const session = getScanSession()
  if (!session?.fields[aiKey]) return
  session.fields[aiKey] = { ...session.fields[aiKey], source: "manual" }
  saveScanSession(session)
}

// ── Helpers ────────────────────────────────────────────────────────────────────

export const CONFIDENCE_THRESHOLD = 0.80

/** True if field was AI-filled with high confidence */
export function isAutoFilled(field: ScanSessionField): boolean {
  return field.filled && field.source === "scanned" && field.confidence >= CONFIDENCE_THRESHOLD
}

/** True if field needs manual verification (low confidence) */
export function isLowConfidence(field: ScanSessionField): boolean {
  return field.filled && field.source === "scanned" && field.confidence < CONFIDENCE_THRESHOLD
}
