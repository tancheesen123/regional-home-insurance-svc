"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PaynamicsPaymentProps {
  amount: number
  currency: string
  orderId: string
  customerEmail: string
  customerName: string
  onPaymentInitiated: (paymentData: any) => void
}

export default function PaynamicsPayment({
  amount,
  currency,
  orderId,
  customerEmail,
  customerName,
  onPaymentInitiated,
}: PaynamicsPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState("visa-master")
  const [isProcessing, setIsProcessing] = useState(false)

  const paymentMethods = [
    { id: "visa-master", name: "Visa/MasterCard", logo: "💳", description: "Credit/Debit Cards" },
    { id: "gcash", name: "GCash", logo: "📱", description: "GCash Mobile Wallet" },
    { id: "paymaya", name: "PayMaya", logo: "💰", description: "PayMaya Digital Wallet" },
    { id: "bpi", name: "BPI Online", logo: "🏦", description: "BPI Online Banking" },
    { id: "bdo", name: "BDO Online", logo: "🏦", description: "BDO Online Banking" },
  ]

  const generateSignature = (data: any) => {
    // In production, this should be done on the server side
    const crypto = require("crypto")
    const merchantKey = process.env.PAYNAMICS_MERCHANT_KEY || ""
    const signatureString = `${data.merchantid}${data.request_id}${data.notification_url}${data.response_url}${data.fname}${data.lname}${data.mname}${data.address1}${data.address2}${data.city}${data.state}${data.country}${data.zip}${data.secure3d}${data.trxtype}${data.amount}${data.currency}${merchantKey}`
    return crypto.createHash("sha1").update(signatureString).digest("hex")
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const [firstName, ...lastNameParts] = customerName.split(" ")
      const lastName = lastNameParts.join(" ") || firstName

      const paymentData = {
        merchantid: process.env.NEXT_PUBLIC_PAYNAMICS_MERCHANT_ID,
        request_id: orderId,
        notification_url: `${window.location.origin}/api/payment/paynamics/notification`,
        response_url: `${window.location.origin}/api/payment/paynamics/response`,
        cancel_url: `${window.location.origin}/dashboard/quotation/summary`,
        fname: firstName,
        lname: lastName,
        mname: "",
        address1: "N/A",
        address2: "",
        city: "Manila",
        state: "NCR",
        country: "PH",
        zip: "1000",
        email: customerEmail,
        phone: "",
        secure3d: "try3d",
        trxtype: "sale",
        amount: amount.toFixed(2),
        currency: currency,
        payment_method: getPaymentMethodCode(selectedMethod),
        description: "Etiqa Home Insurance Premium",
      }

      // Generate signature (should be done server-side in production)
      paymentData.signature = generateSignature(paymentData)

      // Create form and submit to Paynamics
      const form = document.createElement("form")
      form.method = "POST"
      form.action =
        process.env.NODE_ENV === "production"
          ? "https://api.paynamics.net/paygate.aspx"
          : "https://testapi.paynamics.net/paygate.aspx"

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

  const getPaymentMethodCode = (method: string) => {
    const methodMap = {
      "visa-master": "CC",
      gcash: "GCASH",
      paymaya: "PAYMAYA",
      bpi: "BPI",
      bdo: "BDO",
    }
    return methodMap[method] || "CC"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src="/images/paynamics-logo.png" alt="Paynamics" className="h-6" />
          Paynamics Payment Gateway
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
