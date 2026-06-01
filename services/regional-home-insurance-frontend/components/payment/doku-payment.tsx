"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface DokuPaymentProps {
  amount: number
  currency: string
  orderId: string
  customerEmail: string
  customerName: string
  onPaymentInitiated: (paymentData: any) => void
}

export default function DokuPayment({
  amount,
  currency,
  orderId,
  customerEmail,
  customerName,
  onPaymentInitiated,
}: DokuPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState("visa-master")
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods = [
    { id: "visa-master", name: "Visa/MasterCard", logo: "💳", description: "Credit/Debit Cards" },
    { id: "mandiri-va", name: "Mandiri Virtual Account", logo: "🏦", description: "Bank Mandiri VA" },
    { id: "bca-va", name: "BCA Virtual Account", logo: "🏦", description: "Bank BCA VA" },
    { id: "bni-va", name: "BNI Virtual Account", logo: "🏦", description: "Bank BNI VA" },
    { id: "gopay", name: "GoPay", logo: "📱", description: "GoPay Digital Wallet" },
    { id: "ovo", name: "OVO", logo: "💰", description: "OVO Digital Wallet" },
  ]

  const generateSignature = (data: any) => {
    // In production, this should be done on the server side
    const crypto = require("crypto")
    const sharedKey = process.env.DOKU_SHARED_KEY || ""
    const signatureString = `${data.amount}${data.mallid}${sharedKey}${data.transidmerchant}`
    return crypto.createHash("sha1").update(signatureString).digest("hex")
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const paymentData = {
        mallid: process.env.NEXT_PUBLIC_DOKU_MALL_ID,
        chainmerchant: "NA",
        amount: Math.round(amount).toString(),
        purchasecurrency: currency,
        transidmerchant: orderId,
        words: "",
        requestdatetime: new Date().toISOString().replace(/[-:]/g, "").split(".")[0],
        currency: "360", // IDR currency code
        purchaseamount: Math.round(amount).toString(),
        sessionid: `session_${Date.now()}`,
        name: customerName,
        email: customerEmail,
        basket: "Etiqa Home Insurance Premium",
        paymentchannel: getPaymentChannel(selectedMethod),
        redirecturl: `${window.location.origin}/api/payment/doku/redirect`,
        notifyurl: `${window.location.origin}/api/payment/doku/notify`,
      }

      // Generate signature (should be done server-side in production)
      paymentData.words = generateSignature(paymentData)

      // Create form and submit to DOKU
      const form = document.createElement("form")
      form.method = "POST"
      form.action =
        process.env.NODE_ENV === "production"
          ? "https://pay.doku.com/Suite/Receive"
          : "https://staging.doku.com/Suite/Receive"

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

  const getPaymentChannel = (method: string) => {
    const channelMap = {
      "visa-master": "15",
      "mandiri-va": "02",
      "bca-va": "14",
      "bni-va": "11",
      gopay: "54",
      ovo: "58",
    }
    return channelMap[method] || "15"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src="/images/doku-logo.png" alt="DOKU" className="h-6" />
          DOKU Payment Gateway
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
