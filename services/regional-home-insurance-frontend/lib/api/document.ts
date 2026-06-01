import { getSession, clearSession } from "@/lib/session"

const BASE_URL = "https://localhost:44337/api"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PolicyDocumentInfo {
  fileType: string  // "PDS" | "EPolicy" | "TaxInvoice"
  fileName: string  // e.g. "HI-ID-2026-001234 - PDS.pdf"
}

export interface DocumentStatusResponse {
  isReady: boolean
  policyNumber: string
  documents: PolicyDocumentInfo[]
}

// ── Custom error ──────────────────────────────────────────────────────────────

export class DocumentDownloadError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = "DocumentDownloadError"
  }
}

// ── Internal: authenticated fetch with standard error mapping ─────────────────

async function authFetch(url: string): Promise<Response> {
  const session = getSession()
  if (!session) {
    clearSession()
    if (typeof window !== "undefined") window.location.href = "/"
    throw new Error("Session expired")
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token}`,
      "X-Country-Code": session.countryCode,
    },
  })

  if (res.status === 401) {
    clearSession()
    if (typeof window !== "undefined") window.location.href = "/"
    throw new Error("Unauthorized")
  }

  return res
}

// ── Internal: create a temporary <a> and trigger a browser file save ──────────

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

// ── Poll: GET /api/Document/PolicyDocumentStatus?proposalId= ─────────────────

export async function getPolicyDocumentStatus(
  proposalId: string,
): Promise<DocumentStatusResponse> {
  const url = `${BASE_URL}/Document/PolicyDocumentStatus?proposalId=${encodeURIComponent(proposalId)}`
  const res = await authFetch(url)

  if (!res.ok) throw new Error(`Status check failed: ${res.status}`)
  return res.json() as Promise<DocumentStatusResponse>
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Normalise the fileType value returned by the status API to one the download
 * endpoint actually accepts: "PDS" | "EPolicy" | "TaxInvoice".
 *
 * The status API sometimes returns aliases or different casing (e.g. "Other",
 * "other", "pds").  When a direct match fails we fall back to scanning the
 * document's filename for a recognisable keyword.
 */
function resolveDownloadFileType(fileType: string, fileName: string): string {
  const map: Record<string, string> = {
    pds:        "PDS",
    epolicy:    "EPolicy",
    taxinvoice: "TaxInvoice",
  }

  // 1. Direct case-insensitive lookup
  const direct = map[fileType.toLowerCase()]
  if (direct) return direct

  // 2. Infer from the filename (e.g. "HI-ID-2026-001234 - PDS.pdf")
  const f = fileName.toLowerCase()
  if (f.includes("pds"))                                return "PDS"
  if (f.includes("epolicy") || f.includes("e-policy")) return "EPolicy"
  if (f.includes("taxinvoice") || f.includes("tax"))   return "TaxInvoice"

  // 3. Give up — pass through and let the server error surface naturally
  return fileType
}

// ── Download: GET /api/Document/DownloadFile?proposalId=&fileType= ────────────

export async function downloadSingleFile(
  proposalId: string,
  fileType: string,
  fileName: string,
): Promise<void> {
  const resolvedType = resolveDownloadFileType(fileType, fileName)
  const url = `${BASE_URL}/Document/DownloadFile?proposalId=${encodeURIComponent(proposalId)}&fileType=${encodeURIComponent(resolvedType)}`
  const res = await authFetch(url)

  if (res.status === 400) throw new DocumentDownloadError("Documents are still being prepared. Please wait.", 400)
  if (res.status === 403) throw new DocumentDownloadError("Access denied.", 403)
  if (res.status === 404) throw new DocumentDownloadError("Document not found. Please contact support.", 404)
  if (!res.ok) throw new DocumentDownloadError(`Unexpected error (${res.status}).`, res.status)

  const blob = await res.blob()
  triggerDownload(blob, fileName)
}

// ── Download: GET /api/Document/DownloadPolicyDocuments?proposalId= ───────────

export async function downloadPolicyDocuments(
  proposalId: string,
  policyNumber?: string,
): Promise<void> {
  const url = `${BASE_URL}/Document/DownloadPolicyDocuments?proposalId=${encodeURIComponent(proposalId)}`
  const res = await authFetch(url)

  if (res.status === 400) throw new DocumentDownloadError("Documents are still being prepared. Please wait.", 400)
  if (res.status === 403) throw new DocumentDownloadError("Access denied.", 403)
  if (res.status === 404) throw new DocumentDownloadError("Documents not found. Please contact support.", 404)
  if (!res.ok) throw new DocumentDownloadError(`Unexpected error (${res.status}).`, res.status)

  // Prefer server-provided filename; fall back to a constructed one
  const disposition = res.headers.get("Content-Disposition") ?? ""
  const match = disposition.match(/filename="?([^"]+)"?/)
  const filename =
    match?.[1] ??
    (policyNumber ? `${policyNumber} - Policy Documents.zip` : "Policy Documents.zip")

  const blob = await res.blob()
  triggerDownload(blob, filename)
}
