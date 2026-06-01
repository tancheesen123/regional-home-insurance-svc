import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const paymentData = {
      request_id: formData.get("request_id"),
      response_id: formData.get("response_id"),
      response_code: formData.get("response_code"),
      response_message: formData.get("response_message"),
      response_advise: formData.get("response_advise"),
      timestamp: formData.get("timestamp"),
      rebill_id: formData.get("rebill_id"),
      signature: formData.get("signature"),
    }

    // Verify signature
    const isValidSignature = verifyPaynamicsSignature(paymentData)

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Update payment status
    if (paymentData.response_code === "GR001" || paymentData.response_code === "GR002") {
      // Payment successful
      await updatePaymentStatus(paymentData.request_id, "completed", paymentData)
      return NextResponse.redirect(new URL("/dashboard/quotation/success", request.url))
    } else {
      // Payment failed
      await updatePaymentStatus(paymentData.request_id, "failed", paymentData)
      return NextResponse.redirect(new URL("/dashboard/quotation/payment-failed", request.url))
    }
  } catch (error) {
    console.error("Paynamics response error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function verifyPaynamicsSignature(data: any): boolean {
  // Implement Paynamics signature verification
  const crypto = require("crypto")
  const merchantKey = process.env.PAYNAMICS_MERCHANT_KEY || ""
  const signatureString = `${data.request_id}${data.response_id}${data.response_code}${data.response_message}${data.response_advise}${data.timestamp}${data.rebill_id}${merchantKey}`
  const expectedSignature = crypto.createHash("sha1").update(signatureString).digest("hex")

  return expectedSignature === data.signature
}

async function updatePaymentStatus(orderId: string, status: string, paymentData: any) {
  console.log(`Updating payment ${orderId} to status: ${status}`, paymentData)
}
