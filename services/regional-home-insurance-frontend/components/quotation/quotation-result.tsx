"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Shield, Home, AlertTriangle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function QuotationResult() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleProceedToPurchase = () => {
    setIsProcessing(true)
    setTimeout(() => {
      router.push("/dashboard/purchase")
    }, 1000)
  }

  const quotationData = {
    quoteNumber: "QT-2025-001234",
    premium: {
      annual: 450.0,
      monthly: 42.5,
    },
    coverage: {
      building: 250000,
      contents: 50000,
      liability: 100000,
    },
    riskAssessment: "Medium Risk",
    validUntil: "2025-06-21",
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {}
      <Card>
        <CardHeader className="bg-green-50 border-b">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <CardTitle className="text-green-800">Quote Generated Successfully</CardTitle>
              <CardDescription className="text-green-600">
                Quote #{quotationData.quoteNumber} • Valid until {quotationData.validUntil}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Premium Options</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Annual Payment</p>
                    <p className="text-sm text-muted-foreground">Save 10% with annual payment</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#0056b3]">${quotationData.premium.annual}</p>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Monthly Payment</p>
                    <p className="text-sm text-muted-foreground">Pay monthly for convenience</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">${quotationData.premium.monthly}/month</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Risk Assessment</h3>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{quotationData.riskAssessment}</strong> - Your property has been assessed based on location,
                  construction type, and other factors.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Coverage Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Home className="h-8 w-8 mx-auto mb-2 text-[#0056b3]" />
              <h4 className="font-semibold">Building Coverage</h4>
              <p className="text-2xl font-bold text-[#0056b3]">${quotationData.coverage.building.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Structure and fixtures</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 text-[#0056b3]" />
              <h4 className="font-semibold">Contents Coverage</h4>
              <p className="text-2xl font-bold text-[#0056b3]">${quotationData.coverage.contents.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Personal belongings</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-[#0056b3]" />
              <h4 className="font-semibold">Liability Coverage</h4>
              <p className="text-2xl font-bold text-[#0056b3]">${quotationData.coverage.liability.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Third-party claims</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <h4 className="font-semibold">What's Covered</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Fire and lightning damage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Theft and burglary</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Water damage (excluding flood)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Storm and wind damage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Vandalism and malicious damage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Personal liability coverage</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button variant="outline" onClick={() => router.back()}>
          Modify Quote
        </Button>
        <Button variant="outline">Download Quote</Button>
        <Button className="bg-[#0056b3] hover:bg-[#004494]" onClick={handleProceedToPurchase} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Proceed to Purchase"}
        </Button>
      </div>
    </div>
  )
}
