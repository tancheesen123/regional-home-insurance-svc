"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PAYMENT_GATEWAYS } from "@/components/payment/payment-gateway-config"
import IPay88Payment from "@/components/payment/ipay88-payment"
import PaynamicsPayment from "@/components/payment/paynamics-payment"
import DokuPayment from "@/components/payment/doku-payment"

export default function SummaryPayment() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreementChecked, setAgreementChecked] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [summaryExpanded, setSummaryExpanded] = useState(true)
  const [userRegion, setUserRegion] = useState<"KH" | "PH" | "ID">("PH") // This should come from user data

  // Mock user data - in real app, this would come from context/props
  const userData = {
    name: "Adam Bin Bakri",
    email: "adam@gmail.com",
    region: userRegion,
  }

  const orderData = {
    orderId: `ORD_${Date.now()}`,
    amount: 1333.76,
    currency: PAYMENT_GATEWAYS[userRegion].currency,
  }

  // Convert amount to local currency if needed
  const getLocalAmount = () => {
    switch (userRegion) {
      case "KH":
        return orderData.amount * 4000 // Approximate USD to KHR conversion
      case "PH":
        return orderData.amount * 56 // Approximate USD to PHP conversion
      case "ID":
        return orderData.amount * 15000 // Approximate USD to IDR conversion
      default:
        return orderData.amount
    }
  }

  const handlePaymentInitiated = (paymentData: any) => {
    setIsProcessing(true)
    console.log("Payment initiated:", paymentData)
    // Store payment data in session/database for tracking
    sessionStorage.setItem(
      "pendingPayment",
      JSON.stringify({
        ...paymentData,
        timestamp: new Date().toISOString(),
      }),
    )
  }

  const handleDirectPayment = async () => {
    if (!agreementChecked) {
      alert("Please agree to the terms and conditions to proceed.")
      return
    }

    setIsProcessing(true)
    // Simulate direct payment processing (for testing)
    setTimeout(() => {
      setIsProcessing(false)
      router.push("/dashboard/quotation/success")
    }, 3000)
  }

  const renderPaymentGateway = () => {
    const localAmount = getLocalAmount()
    const currency = PAYMENT_GATEWAYS[userRegion].currency

    switch (userRegion) {
      case "KH":
        return (
          <IPay88Payment
            amount={localAmount}
            currency={currency}
            orderId={orderData.orderId}
            customerEmail={userData.email}
            onPaymentInitiated={handlePaymentInitiated}
          />
        )
      case "PH":
        return (
          <PaynamicsPayment
            amount={localAmount}
            currency={currency}
            orderId={orderData.orderId}
            customerEmail={userData.email}
            customerName={userData.name}
            onPaymentInitiated={handlePaymentInitiated}
          />
        )
      case "ID":
        return (
          <DokuPayment
            amount={localAmount}
            currency={currency}
            orderId={orderData.orderId}
            customerEmail={userData.email}
            customerName={userData.name}
            onPaymentInitiated={handlePaymentInitiated}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <span className="ml-2 text-sm font-medium text-green-600">Choose Plan</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <span className="ml-2 text-sm font-medium text-green-600">Declare Valuables</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <span className="ml-2 text-sm font-medium text-green-600">Fill Up Details</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              4
            </div>
            <span className="ml-2 text-sm font-medium">Summary & Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Region Selector for Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Select Region (Demo)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {Object.entries(PAYMENT_GATEWAYS).map(([region, config]) => (
                  <Button
                    key={region}
                    variant={userRegion === region ? "default" : "outline"}
                    onClick={() => setUserRegion(region as "KH" | "PH" | "ID")}
                    className="flex items-center gap-2"
                  >
                    <img src={config.logo || "/placeholder.svg"} alt={config.name} className="h-4" />
                    {region} - {config.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Declaration & Aqad */}
          <Card>
            <CardHeader>
              <CardTitle>Declaration & Aqad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreement"
                  checked={agreementChecked}
                  onCheckedChange={(checked) => setAgreementChecked(checked as boolean)}
                  className="mt-1"
                />
                <div className="text-sm">
                  <Label htmlFor="agreement" className="cursor-pointer">
                    I hereby confirm that I have read, and agree to the{" "}
                    <a href="#" className="text-blue-600 underline">
                      Important Notice
                    </a>
                    ,{" "}
                    <a href="#" className="text-blue-600 underline">
                      Declaration & Aqad
                    </a>
                    ,{" "}
                    <a href="#" className="text-blue-600 underline">
                      Certificate Contract
                    </a>
                    ,{" "}
                    <a href="#" className="text-blue-600 underline">
                      Privacy Notice
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 underline">
                      Product Disclosure Sheet
                    </a>
                    .
                  </Label>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <p>
                  The benefit(s) payable under eligible certificate are protected by PIDM up to limits. Please refer to{" "}
                  <a href="#" className="text-blue-600 underline">
                    PIDM's TIPS Brochure
                  </a>{" "}
                  or contact Etiqa General Takaful Berhad or PIDM.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Marketing Consent */}
          <Card>
            <CardHeader>
              <CardTitle>
                Marketing Consent <span className="text-sm font-normal text-gray-500">(Optional)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketing"
                  checked={marketingConsent}
                  onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                  className="mt-1"
                />
                <div className="text-sm">
                  <Label htmlFor="marketing" className="cursor-pointer">
                    I expressly agree to receive marketing communications from Etiqa General Takaful Berhad or Maybank
                    Group, Etiqa General Takaful Berhad's agents or strategic partners, and other third parties.
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Gateway */}
          {renderPaymentGateway()}

          {/* Test Payment Button (for demo purposes) */}
          <Card className="border-dashed border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="text-gray-600">Test Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDirectPayment}
                disabled={!agreementChecked || isProcessing}
                variant="outline"
                className="w-full"
              >
                {isProcessing ? "Processing..." : "Complete Payment (Test Mode)"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader className="cursor-pointer" onClick={() => setSummaryExpanded(!summaryExpanded)}>
              <CardTitle className="flex items-center justify-between">
                <span>Summary</span>
                {summaryExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
            {summaryExpanded && (
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Building + Contents</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coverage Period</span>
                      <span>21 Jun 2025 - 20 Jun 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Region</span>
                      <span>{PAYMENT_GATEWAYS[userRegion].name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Building</span>
                      <span>RM 500,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contents</span>
                      <span>RM 60,000.00</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Cost Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Contribution</span>
                      <span>RM 1,442.00</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Online Rebate 15%</span>
                      <span>- RM 216.30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Tax 6%</span>
                      <span>RM 98.06</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stamp Duty</span>
                      <span>RM 10.00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black text-white p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Contribution</span>
                    <span className="text-xl font-bold">
                      {PAYMENT_GATEWAYS[userRegion].currency} {getLocalAmount().toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 mt-1">≈ RM {orderData.amount.toLocaleString()}</div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
