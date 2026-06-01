"use client"

import { useState, memo } from "react"
import { ChevronLeft, ChevronRight, Calculator, Home, Shield, CreditCard, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { PremiumData } from "@/lib/api"
import { getRegionConfig } from "@/lib/region"
import { getSession } from "@/lib/session"

interface CalculationSummaryProps {
  step: "customize" | "declare" | "details" | "summary"
  planData?: {
    selectedPlan: string
    buildingAmount: number
    contentAmount: number
  }
  premiumData?: PremiumData | null
  isPremiumLoading?: boolean
  valuablesData?: {
    totalDeclaredAmount: number
    maxDeclarableAmount: number
    undeclaredAmount: number
  }
}

function CalculationSummary({
  step,
  planData,
  premiumData,
  isPremiumLoading,
  valuablesData,
}: CalculationSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { symbol } = getRegionConfig(getSession()?.countryCode ?? "")

  const getStepTitle = () => {
    switch (step) {
      case "customize": return "Plan Customization"
      case "declare":   return "Valuables Declaration"
      case "details":   return "Personal Details"
      case "summary":   return "Final Summary"
      default:          return "Insurance Summary"
    }
  }

  const fmt = (n: number) => n.toFixed(2)

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

          {/* Step Indicator */}
          <div className="mb-6">
            <Badge variant="outline" className="mb-2">
              {getStepTitle()}
            </Badge>
            <div className="flex space-x-1">
              {(["customize", "declare", "details", "summary"] as const).map((s) => (
                <div key={s} className={cn("h-2 w-8 rounded", step === s ? "bg-[#0056b3]" : "bg-gray-200")} />
              ))}
            </div>
          </div>

          {/* Coverage Plan */}
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
                  <span className="font-medium capitalize">
                    {planData.selectedPlan.replace("building-contents", "Building + Contents")
                      .replace("building-only", "Building Only")
                      .replace("content-only", "Content Only")}
                  </span>
                </div>

                {/* Coverage dates from API when available */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Coverage Period</span>
                  <span className="text-right text-xs">
                    {premiumData
                      ? `${premiumData.startDate} – ${premiumData.endDate}`
                      : "–"}
                  </span>
                </div>

                {(planData.selectedPlan === "building-contents" || planData.selectedPlan === "building-only") && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Building Sum</span>
                    <span>{symbol} {planData.buildingAmount.toLocaleString()}</span>
                  </div>
                )}
                {(planData.selectedPlan === "building-contents" || planData.selectedPlan === "content-only") && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contents Sum</span>
                    <span>{symbol} {planData.contentAmount.toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Declared Valuables */}
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
                  <span>{symbol} {valuablesData.maxDeclarableAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Declared</span>
                  <span className="font-medium text-orange-600">
                    {symbol} {valuablesData.totalDeclaredAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Undeclared Amount</span>
                  <span className="font-medium text-green-600">
                    {symbol} {valuablesData.undeclaredAmount.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cost Breakdown */}
          {(planData || premiumData) && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Cost Breakdown
                  </span>
                  {isPremiumLoading && (
                    <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {premiumData ? (
                  <>
                    {/* Building / Content split */}
                    {premiumData.buildingPremium > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Building Premium</span>
                        <span>{symbol} {fmt(premiumData.buildingPremium)}</span>
                      </div>
                    )}
                    {premiumData.contentPremium > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Content Premium</span>
                        <span>{symbol} {fmt(premiumData.contentPremium)}</span>
                      </div>
                    )}
                    {premiumData.addOnsPremium > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Add-ons Premium</span>
                        <span>{symbol} {fmt(premiumData.addOnsPremium)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-700">Gross Premium</span>
                      <span>{symbol} {fmt(premiumData.grossPremium)}</span>
                    </div>
                    {premiumData.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>− {symbol} {fmt(premiumData.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Service Tax ({premiumData.serviceTaxRate}%)
                      </span>
                      <span>{symbol} {fmt(premiumData.serviceTaxAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stamp Duty</span>
                      <span>{symbol} {fmt(premiumData.stampDutyAmount)}</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Total Premium</p>
                        <p className="text-xs text-gray-500">
                          {symbol} {fmt(premiumData.monthlyPremium)} / month
                        </p>
                      </div>
                      <p className="text-xl font-bold text-[#0056b3]">
                        {symbol} {fmt(premiumData.totalPremium)}
                      </p>
                    </div>
                  </>
                ) : (
                  // Placeholder while waiting for first calculation
                  <div className="flex items-center justify-center py-6 text-gray-400 text-sm">
                    {isPremiumLoading
                      ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Calculating…</span>
                      : "Adjust your plan to see a breakdown"}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Add-on Breakdown (from API response array) */}
          {premiumData && premiumData.addOnBreakdown.length > 0 && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Optional Add-ons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {premiumData.addOnBreakdown.map((item) => (
                  <div key={item.code} className="flex justify-between">
                    <span className="text-gray-600">{item.name}</span>
                    <span>+ {symbol} {fmt(item.premium)}</span>
                  </div>
                ))}
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

export default memo(CalculationSummary)
