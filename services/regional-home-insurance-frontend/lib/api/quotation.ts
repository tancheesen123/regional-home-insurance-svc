import { request, APIResponse } from "./client"

// ── Get Quote ────────────────────────────────────────────────────────────────

export interface GetQuotePayload {
  customerId: string
  ownershipType: string
  coverageStartDate: string   // "DD/MM/YYYY"
  propertyType: string
  propertySubType: string
  numberOfStorey: number
  constructionType: string
  postcode: string
  currentFlooding: string     // "yes" | "no"
  unoccupiedProperty: string  // "yes" | "no"
  previousLoss: string        // "yes" | "no"
  idType: string
  idNumber: string
  nationality: string
  dateOfBirth: string         // "DD/MM/YYYY"
}

export interface GetQuoteData {
  quotationId: string
  status: string
  premium: number
  coverageStartDate: string
  expiryDate: string
  ownershipType: string
  propertyType: string
  propertySubType: string
  numberOfStorey: number
  constructionType: string
  postcode: string
  region: string
}

export async function getQuote(
  payload: GetQuotePayload,
  countryCode: string
): Promise<APIResponse<GetQuoteData>> {
  return request<GetQuoteData>("/quotation/GetQuote", {
    method: "POST",
    headers: { "X-Country-Code": countryCode },
    body: JSON.stringify(payload),
  })
}

// ── Customize Plan ───────────────────────────────────────────────────────────

export interface CustomizePlanAddOns {
  riotStrike: boolean
  extendedTheft: boolean
  alternativeAccommodation: boolean
  publicLiability: boolean
}

export interface CustomizePlanPayload {
  quotationId: string
  planType: string        // "building" | "contents" | "building-contents"
  buildingSum: number
  contentsSum: number
  discountAmount?: number // optional — flat discount before tax
  addOns: CustomizePlanAddOns
}

export interface AddOnBreakdownItem {
  code: string
  name: string
  premium: number
}

/** Shared shape for both CustomizePlan and CalculatePremium responses */
export interface PremiumData {
  quotationId?: string
  planType: string
  buildingSum: number
  contentsSum: number

  buildingPremium: number
  contentPremium: number
  planPremium: number

  addOnsPremium: number
  grossPremium: number
  discountAmount: number
  netPremium: number

  serviceTaxRate: number
  serviceTaxAmount: number
  stampDutyAmount: number

  totalPremium: number
  totalBeforeDiscount: number
  annualPremium: number
  monthlyPremium: number

  startDate: string     // "DD/MM/YYYY"
  endDate: string       // "DD/MM/YYYY"

  addOnBreakdown: AddOnBreakdownItem[]
}

export async function customizePlan(
  payload: CustomizePlanPayload,
  countryCode: string
): Promise<APIResponse<PremiumData>> {
  return request<PremiumData>("/quotation/CustomizePlan", {
    method: "POST",
    headers: { "X-Country-Code": countryCode },
    body: JSON.stringify(payload),
  })
}

// ── Calculate Premium (live preview — no DB save) ────────────────────────────

/** planType as int: 1 = Building, 2 = Content, 3 = Both */
export type PlanTypeInt = 1 | 2 | 3

export interface CalculatePremiumPayload {
  planType: PlanTypeInt
  buildingSumInsured: number
  contentSumInsured: number
  addOnCodes: string[]    // e.g. ["E008", "E005"]
  startDate: string       // "YYYY-MM-DD"
  discountAmount: number
}

export async function calculatePremium(
  payload: CalculatePremiumPayload,
  countryCode: string
): Promise<APIResponse<PremiumData>> {
  return request<PremiumData>("/product/CalculatePremium", {
    method: "POST",
    headers: { "X-Country-Code": countryCode },
    body: JSON.stringify(payload),
  })
}

// ── Declare Valuables ────────────────────────────────────────────────────────

export interface ValuableItem {
  category: string
  description: string
  value: number
}

export interface DeclareValuablesPayload {
  quotationId: string
  items: ValuableItem[]
}

export interface ValuableItemResult {
  itemId: string
  category: string
  description: string
  value: number
  itemPremium: number
}

export interface DeclareValuablesData {
  quotationId: string
  items: ValuableItemResult[]
  totalDeclaredValue: number
  valuablesPremium: number
  planPremium: number
  totalPremium: number
  annualPremium: number
  monthlyPremium: number
}

export async function declareValuables(
  payload: DeclareValuablesPayload,
  countryCode: string
): Promise<APIResponse<DeclareValuablesData>> {
  return request<DeclareValuablesData>("/quotation/DeclareValuables", {
    method: "POST",
    headers: { "X-Country-Code": countryCode },
    body: JSON.stringify(payload),
  })
}

// ── Quotation localStorage helpers ───────────────────────────────────────────

const QUOTATION_KEY       = "etiqa_quotation"
const QUOTATION_START_KEY = "etiqa_quotation_start"

export function saveQuotationId(quotationId: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(QUOTATION_KEY, quotationId)
}

export function getQuotationId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(QUOTATION_KEY)
}

export function clearQuotationId(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(QUOTATION_KEY)
}

/** Save the coverage start date (DD/MM/YYYY) so plan-customization can use it for live preview. */
export function saveQuotationStartDate(date: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(QUOTATION_START_KEY, date)
}

export function getQuotationStartDate(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(QUOTATION_START_KEY)
}

// ── Identity (idType + idNumber) carried from quotation → fill-details ─────────

const QUOTATION_IDENTITY_KEY = "etiqa_quotation_identity"

export interface QuotationIdentity {
  idType:   string   // lower-case from quotation form, e.g. "ktp" | "passport"
  idNumber: string
}

/** Persist the ID type + number chosen on the quotation page so fill-details can lock them. */
export function saveQuotationIdentity(identity: QuotationIdentity): void {
  if (typeof window === "undefined") return
  localStorage.setItem(QUOTATION_IDENTITY_KEY, JSON.stringify(identity))
}

export function getQuotationIdentity(): QuotationIdentity | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(QUOTATION_IDENTITY_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as QuotationIdentity } catch { return null }
}

export function clearQuotationIdentity(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(QUOTATION_IDENTITY_KEY)
}

/** Convert "DD/MM/YYYY" → "YYYY-MM-DD" for CalculatePremium.
 *  Falls back to tomorrow's date if input is missing. */
export function toCalculateDateFormat(ddmmyyyy: string | null): string {
  if (ddmmyyyy) {
    const parts = ddmmyyyy.split("/")
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split("T")[0]
}
