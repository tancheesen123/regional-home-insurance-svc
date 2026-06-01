import { request, APIResponse } from "./client"

// ── Initiate Payment ──────────────────────────────────────────────────────────

export interface InitiatePaymentPayload {
  proposalId: string
  paymentMethod: string   // "card" | "online_banking" | "ewallet"
}

export interface InitiatePaymentData {
  paymentId: string
  referenceNumber: string
  proposalId: string
  amount: number
  currency: string
  paymentMethod: string
  gatewayName: string
  stripeSession: {
    sessionId: string
    checkoutUrl: string
  }
  status: string
  expiresAt: string
  message: string
}

export async function initiatePayment(
  payload: InitiatePaymentPayload,
  countryCode: string
): Promise<APIResponse<InitiatePaymentData>> {
  return request<InitiatePaymentData>("/payment/InitiatePayment", {
    method: "POST",
    headers: { "X-Country-Code": countryCode },
    body: JSON.stringify(payload),
  })
}

// ── Payment result localStorage helpers ──────────────────────────────────────

const PAYMENT_RESULT_KEY = "etiqa_payment_result"

export interface PaymentResult {
  paymentId: string
  referenceNumber: string
  paymentMethod: string
  gatewayName: string
  amount: number
  currency: string
}

export function savePaymentResult(data: PaymentResult): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PAYMENT_RESULT_KEY, JSON.stringify(data))
}

export function getPaymentResult(): PaymentResult | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(PAYMENT_RESULT_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as PaymentResult } catch { return null }
}

export function clearPaymentResult(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(PAYMENT_RESULT_KEY)
}
