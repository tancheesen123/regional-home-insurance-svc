"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calculator, Home, Shield, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface CalculationSummaryProps {
  step: "customize" | "declare" | "details" | "summary"
  planData?: {
    selectedPlan: string
    buildingAmount: number
    contentAmount: number
    addOns: {
      riotStrike: boolean
      extendedTheft: boolean
    }
  }
  valuablesData?: {
    totalDeclaredAmount: number
    maxDeclarableAmount: number
    undeclaredAmount: number
  }
}

export default function CalculationSummary({ step, planData, valuablesData }: CalculationSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const calculateTotal = () => {
    if (!planData) return { gross: 0, rebate: 0, tax: 0, stamp: 0, total: 0 }

    let grossContribution = 1442.0
    const onlineRebate = grossContribution * 0.15
    const serviceTax = grossContribution * 0.06
    const stampDuty = 10.0

    if (planData.addOns?.riotStrike) grossContribution += 50.0
    if (planData.addOns?.extendedTheft) grossContribution += 150.0

    const total = grossContribution - onlineRebate + serviceTax + stampDuty
    return {
      gross: grossContribution,
      rebate: onlineRebate,
      tax: serviceTax,
      stamp: stampDuty,
      total,
    }
  }

  const costs = calculateTotal()

  const getStepTitle = () => {
    switch (step) {
      case "customize":
        return "Plan Customization"
      case "declare":
        return "Valuables Declaration"
      case "details":
        return "Personal Details"
      case "summary":
        return "Final Summary"
      default:
        return "Insurance Summary"
    }
  }

  return (
    <>
      {/* Mobile/Tablet Toggle Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-full w-14 h-14 bg-[#0056b3] hover:bg-[#004494] shadow-lg"
          size="icon"
        >
          <Calculator className="h-6 w-6" />
        </Button>
      </div>

      {/* Desktop Sidebar Toggle */}
      <div className="hidden lg:block fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className={cn(
            "rounded-l-lg rounded-r-none h-20 w-8 bg-white border-r-0 shadow-md transition-all duration-300",
            isExpanded && "opacity-0 pointer-events-none",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isExpanded && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsExpanded(false)} />
      )}

      {/* Summary Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-50 overflow-y-auto",
          isExpanded ? "translate-x-0" : "translate-x-full",
          "lg:w-96",
        )}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-[#0056b3]" />
              <h3 className="font-semibold text-lg">Insurance Summary</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Step Indicator */}
          <div className="mb-6">
            <Badge variant="outline" className="mb-2">
              {getStepTitle()}
            </Badge>
            <div className="flex space-x-1">
              <div className={cn("h-2 w-8 rounded", step === "customize" ? "bg-[#0056b3]" : "bg-gray-200")} />
              <div className={cn("h-2 w-8 rounded", step === "declare" ? "bg-[#0056b3]" : "bg-gray-200")} />
              <div className={cn("h-2 w-8 rounded", step === "details" ? "bg-[#0056b3]" : "bg-gray-200")} />
              <div className={cn("h-2 w-8 rounded", step === "summary" ? "bg-[#0056b3]" : "bg-gray-200")} />
            </div>
          </div>

          {/* Plan Details */}
          {planData && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Coverage Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan Type</span>
                  <span className="font-medium capitalize">{planData.selectedPlan.replace("-", " + ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coverage Period</span>
                  <span>21 Jun 2025 - 20 Jun 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span>Landed, 1-storey</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Construction</span>
                  <span>Partial Brick</span>
                </div>
                {(planData.selectedPlan === "building-contents" || planData.selectedPlan === "building-only") && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Building</span>
                    <span>RM {planData.buildingAmount.toLocaleString()}</span>
                  </div>
                )}
                {(planData.selectedPlan === "building-contents" || planData.selectedPlan === "content-only") && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contents</span>
                    <span>RM {planData.contentAmount.toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Valuables Summary */}
          {valuablesData && step !== "customize" && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Declared Valuables
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Declarable</span>
                  <span>RM {valuablesData.maxDeclarableAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Declared</span>
                  <span className="font-medium text-orange-600">
                    {valuablesData.totalDeclaredAmount > 0
                      ? `RM ${valuablesData.totalDeclaredAmount.toLocaleString()}`
                      : "-RM 0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Undeclared Amount</span>
                  <span className="font-medium text-green-600">
                    RM {valuablesData.undeclaredAmount.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cost Breakdown */}
          {planData && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Contribution</span>
                  <span>RM {costs.gross.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Online Rebate 15%</span>
                  <span>- RM {costs.rebate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Tax 6%</span>
                  <span>RM {costs.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stamp Duty</span>
                  <span>RM {costs.stamp.toFixed(2)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Total Premium</p>
                    <p className="text-xs text-gray-500">
                      <span className="line-through">RM 1,567.36</span> You save 15%
                    </p>
                  </div>
                  <p className="text-xl font-bold text-[#0056b3]">RM {costs.total.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add-ons */}
          {planData?.addOns && (planData.addOns.riotStrike || planData.addOns.extendedTheft) && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Optional Add-ons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {planData.addOns.riotStrike && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Riot & Strike Coverage</span>
                    <span>+ RM 50.00/yr</span>
                  </div>
                )}
                {planData.addOns.extendedTheft && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Extended Theft Cover</span>
                    <span>+ RM 150.00/yr</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button variant="outline" className="w-full" onClick={() => setIsExpanded(false)}>
              Continue Shopping
            </Button>
            {step === "summary" && (
              <Button className="w-full bg-[#0056b3] hover:bg-[#004494]">Complete Purchase</Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
