import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const paymentData = {
      MerchantCode: formData.get("MerchantCode"),
      PaymentId: formData.get("PaymentId"),
      RefNo: formData.get("RefNo"),
      Amount: formData.get("Amount"),
      Currency: formData.get("Currency"),
      Remark: formData.get("Remark"),
      TransId: formData.get("TransId"),
      AuthCode: formData.get("AuthCode"),
      Status: formData.get("Status"),
      ErrDesc: formData.get("ErrDesc"),
      Signature: formData.get("Signature"),
    }

    const isValidSignature = verifyIPay88Signature(paymentData)

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (paymentData.Status === "1") {
      await updatePaymentStatus(paymentData.RefNo, "completed", paymentData)

      return NextResponse.redirect(new URL("/dashboard/quotation/success", request.url))
    } else {
      await updatePaymentStatus(paymentData.RefNo, "failed", paymentData)

      return NextResponse.redirect(new URL("/dashboard/quotation/payment-failed", request.url))
    }
  } catch (error) {
    console.error("iPay88 callback error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function verifyIPay88Signature(data: any): boolean {
  const crypto = require("crypto")
  const merchantKey = process.env.IPAY88_MERCHANT_KEY || ""
  const signatureString = `${merchantKey}${data.MerchantCode}${data.PaymentId}${data.RefNo}${data.Amount}${data.Currency}${data.Status}`
  const expectedSignature = crypto.createHash("sha256").update(signatureString).digest("hex")

  return expectedSignature === data.Signature
}

async function updatePaymentStatus(orderId: string, status: string, paymentData: any) {
  // Update payment status in your database
  console.log(`Updating payment ${orderId} to status: ${status}`, paymentData)
  // Implementation depends on your database setup
}
