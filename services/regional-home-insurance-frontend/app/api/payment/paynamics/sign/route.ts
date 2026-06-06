import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

/**
 * POST /api/payment/paynamics/sign
 *
 * Generates the Paynamics SHA1 request signature server-side so the merchant
 * key is never exposed to the browser.
 *
 * Body (JSON):
 *   request_id, notification_url, response_url, cancel_url,
 *   fname, lname, mname,
 *   address1, address2, city, state, country, zip,
 *   email, phone,
 *   secure3d, trxtype,
 *   amount (string, e.g. "1500.00"),
 *   currency (e.g. "PHP"),
 *   payment_method (e.g. "GCASH")
 *
 * Returns:
 *   { merchantid, signature, gatewayUrl, ...all original fields }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const merchantId  = process.env.PAYNAMICS_MERCHANT_ID  ?? ""
    const merchantKey = process.env.PAYNAMICS_MERCHANT_KEY ?? ""

    if (!merchantId || !merchantKey) {
      console.error("[paynamics/sign] Missing PAYNAMICS_MERCHANT_ID or PAYNAMICS_MERCHANT_KEY env vars")
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 })
    }

    const {
      request_id,
      notification_url,
      response_url,
      fname, lname, mname,
      address1, address2, city, state, country, zip,
      secure3d, trxtype,
      amount, currency,
    } = body

    // Paynamics SHA1 signature field order (must exactly match their spec)
    const sigParts = [
      merchantId,
      request_id,
      notification_url,
      response_url,
      fname, lname, mname,
      address1, address2, city, state, country, zip,
      secure3d, trxtype,
      amount, currency,
      merchantKey,
    ]

    const signature = crypto
      .createHash("sha1")
      .update(sigParts.join(""))
      .digest("hex")

    const gatewayUrl =
      process.env.NODE_ENV === "production"
        ? "https://api.paynamics.net/paygate.aspx"
        : "https://testapi.paynamics.net/paygate.aspx"

    return NextResponse.json({
      ...body,
      merchantid: merchantId,
      signature,
      gatewayUrl,
    })
  } catch (err) {
    console.error("[paynamics/sign] Error:", err)
    return NextResponse.json({ error: "Signature generation failed" }, { status: 500 })
  }
}
