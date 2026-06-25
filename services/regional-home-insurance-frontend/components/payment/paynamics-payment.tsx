"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"


export interface PaynamicsCustomerAddress {
  addressLine1?: string
  addressLine2?: string
  city?:         string
  state?:        string
  postcode?:     string
  country?:      string
}

export interface PaynamicsPaymentProps {
  orderId:        string
  amount:         number
  currency:       string
  customerEmail:  string
  customerName:   string
  mobileNumber?:  string
  address?:       PaynamicsCustomerAddress | null
}


const PAYMENT_METHODS = [
  { id: "visa-master", code: "CC",      name: "Visa / MasterCard",   icon: "💳", desc: "Credit or debit card" },
  { id: "gcash",       code: "GCASH",   name: "GCash",               icon: "📱", desc: "GCash mobile wallet" },
  { id: "paymaya",     code: "PAYMAYA", name: "Maya (PayMaya)",       icon: "💜", desc: "Maya digital wallet" },
  { id: "bpi",         code: "BPI",     name: "BPI Online Banking",   icon: "🏦", desc: "Bank of the Philippine Islands" },
  { id: "bdo",         code: "BDO",     name: "BDO Online Banking",   icon: "🏦", desc: "Banco de Oro" },
] as const

type MethodId = (typeof PAYMENT_METHODS)[number]["id"]


export default function PaynamicsPayment({
  orderId,
  amount,
  currency,
  customerEmail,
  customerName,
  mobileNumber = "",
  address = null,
}: PaynamicsPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<MethodId>("visa-master")
  const [isProcessing,   setIsProcessing]   = useState(false)
  const [signError,      setSignError]      = useState<string | null>(null)

  const nameParts = customerName.trim().split(/\s+/)
  const fname = nameParts[0] ?? "N"
  const lname = nameParts.length > 1 ? nameParts.slice(1).join(" ") : fname

  const handlePay = async () => {
    setSignError(null)
    setIsProcessing(true)

    const origin = window.location.origin
    const notificationUrl = `${origin}/api/payment/paynamics/notification`
    const responseUrl     = `${origin}/api/payment/paynamics/response`
    const cancelUrl       = `${origin}/dashboard/quotation/summary`

    const addr1    = address?.addressLine1 ?? "N/A"
    const addr2    = address?.addressLine2 ?? ""
    const city     = address?.city         ?? "N/A"
    const state    = address?.state        ?? "N/A"
    const country  = "PH"                            // always PH for this component
    const zip      = address?.postcode     ?? "0000"

    const unsigned = {
      request_id:       orderId,
      notification_url: notificationUrl,
      response_url:     responseUrl,
      cancel_url:       cancelUrl,
      fname,
      lname,
      mname:            "",
      address1:         addr1,
      address2:         addr2,
      city,
      state,
      country,
      zip,
      email:            customerEmail,
      phone:            mobileNumber,
      secure3d:         "try3d",
      trxtype:          "sale",
      amount:           amount.toFixed(2),
      currency,
      payment_method:   PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.code ?? "CC",
      description:      "Home Insurance Premium",
    }

    try {
      // Signature is generated server-side so the merchant key is never in the browser
      const res = await fetch("/api/payment/paynamics/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unsigned),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.error ?? `Sign endpoint returned ${res.status}`)
      }

      const signed: Record<string, string> = await res.json()

      // Build and submit the hidden form directly to Paynamics gateway
      const form = document.createElement("form")
      form.method = "POST"
      form.action = signed.gatewayUrl  // returned by sign endpoint (prod vs sandbox)

      // Remove our internal helper field before posting
      delete signed.gatewayUrl

      for (const [key, value] of Object.entries(signed)) {
        const input = document.createElement("input")
        input.type  = "hidden"
        input.name  = key
        input.value = String(value ?? "")
        form.appendChild(input)
      }

      document.body.appendChild(form)
      form.submit()
      // Browser navigates away — no further JS execution here
    } catch (err) {
      console.error("[PaynamicsPayment] Error:", err)
      setSignError(
        err instanceof Error ? err.message : "Failed to initiate payment. Please try again.",
      )
      setIsProcessing(false)
    }
  }

  const selected = PAYMENT_METHODS.find((m) => m.id === selectedMethod)!

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-[#1A1A1A]">
          Select Payment Method
        </CardTitle>
        <p className="text-sm text-[#555555]">You will be redirected to Paynamics to complete payment.</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Method selector */}
        <RadioGroup
          value={selectedMethod}
          onValueChange={(v) => setSelectedMethod(v as MethodId)}
        >
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.id}
              htmlFor={method.id}
              className={[
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                selectedMethod === method.id
                  ? "border-[#F5A623] bg-[#FEF3DC]"
                  : "border-gray-200 hover:bg-gray-50",
              ].join(" ")}
            >
              <RadioGroupItem value={method.id} id={method.id} />
              <span className="text-xl">{method.icon}</span>
              <div className="min-w-0">
                <p className="font-medium text-sm text-[#1A1A1A]">{method.name}</p>
                <p className="text-xs text-[#555555]">{method.desc}</p>
              </div>
            </label>
          ))}
        </RadioGroup>

        {/* Amount */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
          <span className="text-sm font-medium text-[#555555]">Total Amount</span>
          <span className="text-lg font-bold text-[#1A1A1A]">
            {currency} {amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {signError && (
          <Alert variant="destructive">
            <AlertDescription>{signError}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full bg-[#F5A623] hover:bg-[#D4891A] text-[#1A1A1A] font-semibold h-12"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting to Paynamics…
            </span>
          ) : (
            `Pay with ${selected.name}`
          )}
        </Button>

        <p className="text-xs text-center text-[#9E9E9E]">
          Secured by Paynamics • Your payment is encrypted and protected
        </p>
      </CardContent>
    </Card>
  )
}
