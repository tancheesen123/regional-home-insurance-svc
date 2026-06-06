import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// ── Types ─────────────────────────────────────────────────────────────────────

interface PaynamicsResponseData {
  request_id:       string | null
  response_id:      string | null
  response_code:    string | null
  response_message: string | null
  response_advise:  string | null
  timestamp:        string | null
  rebill_id:        string | null
  signature:        string | null
}

// ── Handler ───────────────────────────────────────────────────────────────────

/**
 * POST /api/payment/paynamics/response
 *
 * Paynamics redirects the customer's browser here after payment completes
 * (success or failure). It also POSTs the same data to notification_url
 * (a separate server-to-server call handled by /api/payment/paynamics/notification).
 *
 * Flow:
 *  1. Parse form-encoded body from Paynamics
 *  2. Verify SHA1 signature (merchant key server-side only)
 *  3. Call backend to update payment status
 *  4. Redirect customer to success or payment-failed page
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const data: PaynamicsResponseData = {
      request_id:       formData.get("request_id")       as string | null,
      response_id:      formData.get("response_id")      as string | null,
      response_code:    formData.get("response_code")    as string | null,
      response_message: formData.get("response_message") as string | null,
      response_advise:  formData.get("response_advise")  as string | null,
      timestamp:        formData.get("timestamp")        as string | null,
      rebill_id:        formData.get("rebill_id")        as string | null,
      signature:        formData.get("signature")        as string | null,
    }

    console.log("[paynamics/response] Received:", {
      request_id:    data.request_id,
      response_code: data.response_code,
      response_id:   data.response_id,
    })

    // 1. Verify signature — reject tampered callbacks immediately
    if (!verifySignature(data)) {
      console.warn("[paynamics/response] Invalid signature — request_id:", data.request_id)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const isSuccess =
      data.response_code === "GR001" || data.response_code === "GR002"

    // 2. Notify backend so it can mark the payment and trigger policy inforce
    await notifyBackend(data, isSuccess ? "completed" : "failed")

    // 3. Redirect customer's browser
    const baseUrl = request.nextUrl.origin
    if (isSuccess) {
      return NextResponse.redirect(new URL("/dashboard/quotation/success", baseUrl))
    }
    return NextResponse.redirect(
      new URL(
        `/dashboard/quotation/payment-failed?code=${encodeURIComponent(data.response_code ?? "")}&ref=${encodeURIComponent(data.request_id ?? "")}`,
        baseUrl,
      ),
    )
  } catch (error) {
    console.error("[paynamics/response] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ── Signature verification ────────────────────────────────────────────────────

function verifySignature(data: PaynamicsResponseData): boolean {
  const merchantKey = process.env.PAYNAMICS_MERCHANT_KEY ?? ""
  if (!merchantKey) {
    console.error("[paynamics/response] PAYNAMICS_MERCHANT_KEY env var not set — skipping verification in dev")
    return process.env.NODE_ENV !== "production"  // allow in dev if key missing
  }

  // Paynamics response signature field order (different from request signature)
  const str = [
    data.request_id,
    data.response_id,
    data.response_code,
    data.response_message,
    data.response_advise,
    data.timestamp,
    data.rebill_id,
    merchantKey,
  ].join("")

  const expected = crypto.createHash("sha1").update(str).digest("hex")
  return expected === data.signature
}

// ── Backend notification ──────────────────────────────────────────────────────

async function notifyBackend(
  data: PaynamicsResponseData,
  status: "completed" | "failed",
): Promise<void> {
  const backendUrl = process.env.BACKEND_API_URL ?? "https://localhost:44337/api"
  const internalKey = process.env.INTERNAL_API_KEY ?? ""

  try {
    const res = await fetch(`${backendUrl}/payment/PaynamicsCallback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(internalKey ? { "X-Internal-Key": internalKey } : {}),
      },
      body: JSON.stringify({
        referenceNumber: data.request_id,
        transactionId:   data.response_id,
        responseCode:    data.response_code,
        responseMessage: data.response_message,
        status,
      }),
    })

    if (!res.ok) {
      console.warn("[paynamics/response] Backend callback returned:", res.status, await res.text())
    } else {
      console.log("[paynamics/response] Backend updated payment status →", status)
    }
  } catch (err) {
    // Don't block the redirect if backend is temporarily unreachable
    console.error("[paynamics/response] Failed to notify backend:", err)
  }
}
