import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const paymentData = {
      MALLID: formData.get("MALLID"),
      CHAINMERCHANT: formData.get("CHAINMERCHANT"),
      TRANSIDMERCHANT: formData.get("TRANSIDMERCHANT"),
      AMOUNT: formData.get("AMOUNT"),
      PURCHASECURRENCY: formData.get("PURCHASECURRENCY"),
      WORDS: formData.get("WORDS"),
      RESPONSECODE: formData.get("RESPONSECODE"),
      APPROVALCODE: formData.get("APPROVALCODE"),
      RESULTMSG: formData.get("RESULTMSG"),
      PAYMENTCHANNEL: formData.get("PAYMENTCHANNEL"),
      PAYMENTCODE: formData.get("PAYMENTCODE"),
      SESSIONID: formData.get("SESSIONID"),
      BANK: formData.get("BANK"),
      MCN: formData.get("MCN"),
      PAYMENTDATETIME: formData.get("PAYMENTDATETIME"),
      VERIFYID: formData.get("VERIFYID"),
      VERIFYSCORE: formData.get("VERIFYSCORE"),
      VERIFYSTATUS: formData.get("VERIFYSTATUS"),
    }

    const isValidSignature = verifyDokuSignature(paymentData)

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (paymentData.RESPONSECODE === "0000") {
      await updatePaymentStatus(paymentData.TRANSIDMERCHANT, "completed", paymentData)
      return NextResponse.redirect(new URL("/dashboard/quotation/success", request.url))
    } else {
      await updatePaymentStatus(paymentData.TRANSIDMERCHANT, "failed", paymentData)
      return NextResponse.redirect(new URL("/dashboard/quotation/payment-failed", request.url))
    }
  } catch (error) {
    console.error("DOKU redirect error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function verifyDokuSignature(data: any): boolean {
  const crypto = require("crypto")
  const sharedKey = process.env.DOKU_SHARED_KEY || ""
  const signatureString = `${data.AMOUNT}${data.MALLID}${sharedKey}${data.TRANSIDMERCHANT}${data.RESPONSECODE}`
  const expectedSignature = crypto.createHash("sha1").update(signatureString).digest("hex")

  return expectedSignature === data.WORDS
}

async function updatePaymentStatus(orderId: string, status: string, paymentData: any) {
  console.log(`Updating payment ${orderId} to status: ${status}`, paymentData)
}
