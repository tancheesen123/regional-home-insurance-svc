import { getSession, clearSession } from "@/lib/session"

const BASE_URL = "https://localhost:44337/api"


export interface PolicySummary {
  proposalId:      string
  policyId:        string
  policyNumber:    string
  planType:        string
  region:          string
  coverageAmount:  number
  startDate:       string
  endDate:         string
  issuedAt:        string
  isDocumentReady: boolean
}

export interface PolicyDocument {
  documentId:  string
  fileType:    string
  fileName:    string
  uploadedAt:  string
}

export interface PolicyDetail extends PolicySummary {
  issuedBy: string
  propertyAddress: {
    addressLine1: string
    addressLine2: string
    city:         string
    postcode:     string
    state:        string
    country:      string
  }
  documents: PolicyDocument[]
}


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
      Authorization:   `Bearer ${session.token}`,
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

// ── GET /api/policy ───────────────────────────────────────────────────────────

export async function fetchPolicies(): Promise<PolicySummary[]> {
  const res = await authFetch(`${BASE_URL}/policy`)
  if (!res.ok) throw new Error(`Failed to fetch policies (${res.status})`)
  const data: { policies: PolicySummary[] } = await res.json()
  return data.policies ?? []
}

// ── GET /api/policy/{proposalId} ──────────────────────────────────────────────

export async function fetchPolicyDetail(proposalId: string): Promise<PolicyDetail> {
  const res = await authFetch(`${BASE_URL}/policy/${encodeURIComponent(proposalId)}`)
  if (res.status === 404) throw new Error("Policy not found.")
  if (res.status === 400) throw new Error("Policy has not been issued yet.")
  if (res.status === 403) throw new Error("Access denied.")
  if (!res.ok)           throw new Error(`Failed to fetch policy detail (${res.status})`)
  return res.json() as Promise<PolicyDetail>
}
