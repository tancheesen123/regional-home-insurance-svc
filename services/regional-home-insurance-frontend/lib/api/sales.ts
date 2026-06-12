import { getSession, clearSession } from "@/lib/session"

const BASE_URL = "https://localhost:44337/api"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SalesRecord {
  id: string
  policyNumber: string
  customerName: string
  customerEmail: string
  productType: string
  coverageType: string
  premium: number
  commission: number
  saleDate: string
  effectiveDate: string
  status: "Active" | "Pending" | "Cancelled" | "Expired"
  paymentMethod: string
  region: string
  agentName: string
  agentId: string
  renewalDate: string
}

export interface SalesSummary {
  totalSales: number
  totalPremium: number
  totalCommission: number
  activePolicies: number
  pendingPolicies: number
  averagePremium: number
  conversionRate: number
  premiumGrowthPct: number
}

export interface SalesRecordsResponse {
  records: SalesRecord[]
  summary: SalesSummary
}

export interface SalesDocument {
  id: string
  name: string
  fileType: string
  fileName: string
  uploadedAt: string
}

export interface SalesTimelineEvent {
  date: string         // ISO datetime e.g. "2025-01-06T08:00:00"
  event: string
  description: string
  status: "completed" | "pending"
}

export interface SalesRecordDetail {
  id: string
  policyNumber: string
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    dateOfBirth: string
    idNumber: string
    idType: string
  }
  policyDetails: {
    productType: string
    coverageType: string
    buildingAmount: number
    contentAmount: number
    effectiveDate: string
    expiryDate: string
    renewalDate: string
    status: string
  }
  financialInfo: {
    premium: number
    commission: number
    commissionRate: number
    taxes: number
    fees: number
    totalAmount: number
    paymentMethod: string
    paymentStatus: string
    paymentDate: string
    transactionId: string
  }
  salesInfo: {
    saleDate: string
    agentName: string
    agentId: string
    agentEmail: string
    agentPhone: string
    region: string
    branch: string
    channel: string
  }
  documents: SalesDocument[]
  timeline: SalesTimelineEvent[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const session = getSession()
  if (!session) {
    clearSession()
    if (typeof window !== "undefined") window.location.href = "/"
    throw new Error("Session expired")
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.token}`,
    "X-Country-Code": session.countryCode,
  }
}

function handle401(): never {
  clearSession()
  if (typeof window !== "undefined") window.location.href = "/"
  throw new Error("Unauthorized")
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * POST /api/sales/GetSalesRecords
 *
 * Only dateFrom / dateTo affect the summary block in the response.
 * status, productType, search filter the records list only.
 */
export async function fetchSalesRecords(filter: {
  dateFrom?: string
  dateTo?: string
  status?: string
  productType?: string
  search?: string
} = {}): Promise<SalesRecordsResponse> {
  const headers = getAuthHeaders()

  // Omit undefined / empty values — backend treats omitted = "return all"
  const body: Record<string, string> = {}
  if (filter.dateFrom)    body.dateFrom    = filter.dateFrom
  if (filter.dateTo)      body.dateTo      = filter.dateTo
  if (filter.status)      body.status      = filter.status
  if (filter.productType) body.productType = filter.productType
  if (filter.search)      body.search      = filter.search

  const res = await fetch(`${BASE_URL}/sales/GetSalesRecords`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })

  if (res.status === 401) handle401()
  if (!res.ok) throw new Error(`Failed to fetch sales records (${res.status})`)

  return res.json() as Promise<SalesRecordsResponse>
}

/**
 * POST /api/sales/ExportExcel
 *
 * Returns a binary .xlsx file. The function handles the blob download
 * automatically — callers only need to handle the result type.
 *
 * Result types:
 *  { type: "downloaded"; filename: string } — file was saved
 *  { type: "empty" }                        — 204: no records matched the filters
 */
export type ExportSalesExcelResult =
  | { type: "downloaded"; filename: string }
  | { type: "empty" }

export async function exportSalesExcel(filter: {
  dateFrom?:    string
  dateTo?:      string
  status?:      string
  productType?: string
  search?:      string
} = {}): Promise<ExportSalesExcelResult> {
  // Excel export headers — same auth, but NO "Content-Type: application/json"
  // for the request so we can receive the binary response cleanly.
  const session = getSession()
  if (!session) {
    clearSession()
    if (typeof window !== "undefined") window.location.href = "/"
    throw new Error("Session expired")
  }

  const body: Record<string, string> = {}
  if (filter.dateFrom)    body.dateFrom    = filter.dateFrom
  if (filter.dateTo)      body.dateTo      = filter.dateTo
  if (filter.status)      body.status      = filter.status
  if (filter.productType) body.productType = filter.productType
  if (filter.search)      body.search      = filter.search

  const res = await fetch(`${BASE_URL}/sales/ExportExcel`, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      Authorization:   `Bearer ${session.token}`,
      "X-Country-Code": session.countryCode,
    },
    body: JSON.stringify(body),
  })

  if (res.status === 401) handle401()

  // 204 — backend found no records for these filters
  if (res.status === 204) return { type: "empty" }

  if (!res.ok) throw new Error(`Export failed (${res.status})`)

  // Extract filename from Content-Disposition: attachment; filename="SalesReport_PH_....xlsx"
  const disposition = res.headers.get("Content-Disposition") ?? ""
  const filenameMatch = disposition.match(/filename="?([^";\r\n]+)"?/i)
  const filename = filenameMatch?.[1]?.trim() ?? "Sales_Report.xlsx"

  // Trigger browser download
  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = objectUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(objectUrl)

  return { type: "downloaded", filename }
}

/**
 * POST /api/sales/{recordId}/SendEmail
 * Sends a policy-related email to the customer (or any recipient the admin specifies).
 */
export async function sendSalesEmail(
  recordId: string,
  to: string,
): Promise<void> {
  const headers = getAuthHeaders()

  const res = await fetch(
    `${BASE_URL}/sales/${encodeURIComponent(recordId)}/SendEmail`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ to }),
    },
  )

  if (res.status === 401) handle401()
  if (res.status === 404) throw new Error("not_found")
  if (!res.ok) throw new Error(`Failed to send email (${res.status})`)
}

/**
 * GET /api/sales/{recordId}
 * Throws "not_found" if the server returns 404.
 */
export async function fetchSalesRecordDetail(recordId: string): Promise<SalesRecordDetail> {
  const headers = getAuthHeaders()

  const res = await fetch(`${BASE_URL}/sales/${encodeURIComponent(recordId)}`, { headers })

  if (res.status === 401) handle401()
  if (res.status === 404) throw new Error("not_found")
  if (!res.ok) throw new Error(`Failed to fetch sales record (${res.status})`)

  return res.json() as Promise<SalesRecordDetail>
}
