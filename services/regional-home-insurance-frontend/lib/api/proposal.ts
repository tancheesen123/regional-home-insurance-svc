import { request, APIResponse } from "./client"
import { getSession, clearSession } from "@/lib/session"

const BASE_URL = "https://localhost:44337/api"


export interface ProposalAddress {
  addressLine1: string
  addressLine2?: string
  city: string
  postcode: string
  state: string
  country: string
}

export interface ProposalMailingAddress {
  sameAsPropertyAddress: boolean
  addressLine1?: string
  addressLine2?: string
  city?: string
  postcode?: string
  state?: string
  country?: string
}

export interface ProposalPersonalDetails {
  name: string
  idType: string
  idNumber: string
  nationality: string
  race: string | null
  gender: string
  dateOfBirth: string
  mobileNumber: string
  email: string
}

export interface ProposalBankDetails {
  bankName: string
  accountNumber: string
}

export interface CreateProposalPayload {
  quotationId: string
  personalDetails: ProposalPersonalDetails
  propertyAddress: ProposalAddress
  mailingAddress: ProposalMailingAddress
  bankDetails: ProposalBankDetails
}

export interface CreateProposalData {
  proposalId: string
  quotationId: string
  status: string
  quotationStatus: string
  premium: number
  coverageStartDate: string
  expiryDate: string
  message: string
}

export async function createProposal(
  payload: CreateProposalPayload,
  countryCode: string
): Promise<APIResponse<CreateProposalData>> {
  return request<CreateProposalData>("/proposal/CreateProposal", {
    method: "POST",
    headers: { "X-Country-Code": countryCode },
    body: JSON.stringify(payload),
  })
}


export interface ProposalQuotation {
  quotationId: string
  quotationStatus: string
  region: string
  ownershipType: string
  propertyType: string
  propertySubType: string
  numberOfStorey: number
  constructionType: string
  postcode: string
  currentFlooding: boolean
  unoccupiedProperty: boolean
  previousLoss: boolean
  planType: string
  buildingSum: number
  contentsSum: number
  addOns: {
    riotStrike: boolean
    extendedTheft: boolean
    alternativeAccommodation: boolean
    publicLiability: boolean
  }
  totalPremium: number
  annualPremium: number
  monthlyPremium: number
  premiumBreakdown?: {
    planPremium: number
    addOnPremium: number
    grossPremium: number
    discountAmount: number
    netPremium: number
    taxRate: number
    taxAmount: number
    stampDuty: number
    totalPremium: number
    totalBeforeDiscount: number
  } | null
  coverageStartDate: string
  expiryDate: string
  valuableItems: {
    itemId: string
    category: string
    description: string
    value: number
  }[]
}

export interface GetProposalData {
  proposalId: string
  status: string
  customerId: string
  personalDetails: ProposalPersonalDetails
  propertyAddress: ProposalAddress
  mailingAddress: ProposalMailingAddress & {
    addressLine1: string
    city: string
    postcode: string
    state: string
    country: string
  }
  bankDetails: ProposalBankDetails
  quotation: ProposalQuotation
}

export async function getProposal(
  proposalId: string,
  countryCode: string
): Promise<APIResponse<GetProposalData>> {
  return request<GetProposalData>("/proposal/GetProposal", {
    method: "POST",
    headers: { "X-Country-Code": countryCode },
    body: JSON.stringify({ proposalId }),
  })
}


export interface CustomerProposalDocument {
  documentId: string
  fileType:   string
  fileName:   string
  uploadedAt: string
}

export interface CustomerProposalPolicy {
  policyId:        string
  policyNumber:    string
  coverageAmount:  number
  startDate:       string
  endDate:         string
  issuedAt:        string
  issuedBy:        string
  isDocumentReady: boolean
  documents:       CustomerProposalDocument[]
}

export interface CustomerProposal {
  proposalId:      string
  status:          string
  createdAt:       string
  planType:        string
  region:          string
  insuredName:     string
  mobileNumber:    string
  email:           string
  propertyAddress: ProposalAddress
  policy:          CustomerProposalPolicy | null
}

export async function fetchCustomerProposals(
  customerId: string,
): Promise<CustomerProposal[]> {
  const session = getSession()
  if (!session) {
    clearSession()
    if (typeof window !== "undefined") window.location.href = "/"
    throw new Error("Session expired")
  }

  const res = await fetch(`${BASE_URL}/proposal/GetCustomerProposals`, {
    method: "POST",
    headers: {
      "Content-Type":   "application/json",
      "Authorization":  `Bearer ${session.token}`,
      "X-Country-Code": session.countryCode,
    },
    body: JSON.stringify({ customerId }),
  })

  if (res.status === 401) {
    clearSession()
    if (typeof window !== "undefined") window.location.href = "/"
    throw new Error("Unauthorized")
  }

  if (!res.ok) throw new Error(`Failed to fetch proposals (${res.status})`)

  const data: { proposals: CustomerProposal[] } = await res.json()
  return data.proposals ?? []
}

// ── Proposal localStorage helpers ─────────────────────────────────────────────

const PROPOSAL_KEY = "etiqa_proposal"

export function saveProposalId(proposalId: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PROPOSAL_KEY, proposalId)
}

export function getProposalId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(PROPOSAL_KEY)
}

export function clearProposalId(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(PROPOSAL_KEY)
}
