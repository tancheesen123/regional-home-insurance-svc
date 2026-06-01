"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface IPay88PaymentProps {
  amount: number
  currency: string
  orderId: string
  customerEmail: string
  onPaymentInitiated: (paymentData: any) => void
}

export default function IPay88Payment({
  amount,
  currency,
  orderId,
  customerEmail,
  onPaymentInitiated,
}: IPay88PaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState("fpx")
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods = [
    { id: "fpx", name: "FPX Online Banking", logo: "🏦", description: "Secure online banking" },
    { id: "visa-master", name: "Visa/MasterCard", logo: "💳", description: "Credit/Debit Cards" },
    { id: "aba-bank", name: "ABA Bank", logo: "🏛️", description: "ABA Mobile/Internet Banking" },
    { id: "acleda-bank", name: "ACLEDA Bank", logo: "🏛️", description: "ACLEDA Mobile Banking" },
  ]

  const generateSignature = (data: any) => {
    // In production, this should be done on the server side for security
    const crypto = require("crypto")
    const merchantKey = process.env.IPAY88_MERCHANT_KEY || ""
    const signatureString = `${merchantKey}${data.MerchantCode}${data.RefNo}${data.Amount}${data.Currency}`
    return crypto.createHash("sha256").update(signatureString).digest("hex")
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const paymentData = {
        MerchantCode: process.env.NEXT_PUBLIC_IPAY88_MERCHANT_CODE,
        PaymentId: getPaymentId(selectedMethod),
        RefNo: orderId,
        Amount: (amount * 100).toString(), // Convert to cents
        Currency: currency,
        ProdDesc: "Etiqa Home Insurance Premium",
        UserName: customerEmail,
        UserEmail: customerEmail,
        UserContact: "",
        Remark: "",
        Lang: "UTF-8",
        ResponseURL: `${window.location.origin}/api/payment/ipay88/callback`,
        BackendURL: `${window.location.origin}/api/payment/ipay88/backend`,
      }

      // Generate signature (should be done server-side in production)
      paymentData.Signature = generateSignature(paymentData)

      // Create form and submit to iPay88
      const form = document.createElement("form")
      form.method = "POST"
      form.action =
        process.env.NODE_ENV === "production"
          ? "https://payment.ipay88.com.kh/epayment/entry.asp"
          : "https://sandbox.ipay88.com.kh/epayment/entry.asp"

      Object.keys(paymentData).forEach((key) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = paymentData[key]
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()

      onPaymentInitiated(paymentData)
    } catch (error) {
      console.error("Payment initiation failed:", error)
      setIsProcessing(false)
    }
  }

  const getPaymentId = (method: string) => {
    const methodMap = {
      fpx: "6",
      "visa-master": "2",
      "aba-bank": "15",
      "acleda-bank": "16",
    }
    return methodMap[method] || "6"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src="/images/ipay88-logo.png" alt="iPay88" className="h-6" />
          iPay88 Payment Gateway
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={method.id} id={method.id} />
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-2xl">{method.logo}</span>
                <div>
                  <Label htmlFor={method.id} className="font-medium cursor-pointer">
                    {method.name}
                  </Label>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-xl font-bold">
              {currency} {amount.toLocaleString()}
            </span>
          </div>
        </div>

        <Button onClick={handlePayment} disabled={isProcessing} className="w-full bg-[#0056b3] hover:bg-[#004494]">
          {isProcessing ? "Processing..." : `Pay with ${paymentMethods.find((m) => m.id === selectedMethod)?.name}`}
        </Button>
      </CardContent>
    </Card>
  )
}
