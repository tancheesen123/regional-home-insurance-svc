"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Home, Package, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import CalculationSummary from "./calculation-summary"

interface PlanData {
  selectedPlan: string
  buildingAmount: number
  contentAmount: number
  addOns: {
    riotStrike: boolean
    extendedTheft: boolean
  }
}

export default function PlanCustomization() {
  const router = useRouter()
  const [planData, setPlanData] = useState<PlanData>({
    selectedPlan: "building-contents",
    buildingAmount: 500000,
    contentAmount: 60000,
    addOns: {
      riotStrike: false,
      extendedTheft: false,
    },
  })

  const plans = [
    {
      id: "building-contents",
      title: "Building + Contents",
      description: "Covers both home's structure and the contents inside it.",
      icon: [Home, Package],
    },
    {
      id: "building-only",
      title: "Building only",
      description: "Covers home's structure.",
      icon: [Home],
    },
    {
      id: "content-only",
      title: "Content only",
      description: "Covers home contents and valuables.",
      icon: [Package],
    },
  ]

  const addOns = [
    {
      id: "riotStrike",
      title: "Riot, Strike and Malicious Damage",
      category: "Home Building",
      price: 50.0,
      description: "Additional protection against civil unrest and malicious acts",
    },
    {
      id: "extendedTheft",
      title: "Extended Theft Cover",
      category: "Home Content",
      price: 150.0,
      description: "Enhanced coverage for theft-related losses",
    },
  ]

  const handlePlanSelect = (planId: string) => {
    setPlanData((prev) => ({ ...prev, selectedPlan: planId }))
  }

  const handleAmountChange = (field: "buildingAmount" | "contentAmount", value: string) => {
    const numValue = Number.parseInt(value.replace(/,/g, "")) || 0
    setPlanData((prev) => ({ ...prev, [field]: numValue }))
  }

  const handleAddOnChange = (addOnId: keyof PlanData["addOns"], checked: boolean) => {
    setPlanData((prev) => ({
      ...prev,
      addOns: { ...prev.addOns, [addOnId]: checked },
    }))
  }

  const handleProceed = () => {
    router.push("/dashboard/quotation/declare-valuables")
  }

  return (
    <div className="max-w-4xl mx-auto pr-0 lg:pr-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="ml-2 text-sm font-medium">Choose Plan</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="ml-2 text-sm text-gray-600">Declare Valuables</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="ml-2 text-sm text-gray-600">Fill Up Details</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
              4
            </div>
            <span className="ml-2 text-sm text-gray-600">Summary & Payment</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Plan Selection */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Customise your protection</h2>
            <Button variant="link" className="text-blue-600">
              Product and coverage comparison
            </Button>
          </div>

          <div className="mb-6">
            <p className="text-lg font-medium mb-4">I would like to protect my</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    planData.selectedPlan === plan.id
                      ? "border-green-500 bg-green-50 ring-2 ring-green-500"
                      : "border-gray-200",
                  )}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {plan.icon.map((Icon, index) => (
                          <Icon key={index} className="h-6 w-6 text-gray-600" />
                        ))}
                      </div>
                      {planData.selectedPlan === plan.id && <Check className="h-5 w-5 text-green-600" />}
                    </div>
                    <h3 className="font-semibold mb-1">{plan.title}</h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Coverage Amounts */}
        {(planData.selectedPlan === "building-contents" || planData.selectedPlan === "building-only") && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Home Building</h3>
            <p className="text-gray-600 mb-4">
              Key in the total costs to repair or rebuild any damaged part of your building from unexpected incidents.
            </p>
            <div className="flex items-center space-x-4">
              <Label htmlFor="building-amount" className="text-sm font-medium">
                RM
              </Label>
              <Input
                id="building-amount"
                value={planData.buildingAmount.toLocaleString()}
                onChange={(e) => handleAmountChange("buildingAmount", e.target.value)}
                className="w-32 text-right"
              />
              <Button variant="link" className="text-blue-600 text-sm">
                Get estimate cost here
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Min RM 67,000 to Max RM 5,000,000</p>
          </div>
        )}

        {(planData.selectedPlan === "building-contents" || planData.selectedPlan === "content-only") && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Home Content</h3>
            <p className="text-gray-600 mb-2">Key in the total cost of replacing your contents at today's prices.</p>
            <p className="text-sm text-gray-600 mb-4">
              Example: Your furniture, electronic appliances, jewellery, collectibles, sports equipment and more.
            </p>
            <div className="flex items-center space-x-4">
              <Label htmlFor="content-amount" className="text-sm font-medium">
                RM
              </Label>
              <Input
                id="content-amount"
                value={planData.contentAmount.toLocaleString()}
                onChange={(e) => handleAmountChange("contentAmount", e.target.value)}
                className="w-32 text-right"
              />
              <Button variant="link" className="text-blue-600 text-sm">
                Get estimate cost here
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Min RM 18,000 to Max RM 1,000,000</p>
          </div>
        )}

        {/* Optional Add-ons */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Optional add-ons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addOns.map((addOn) => (
              <Card key={addOn.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Shield className="h-8 w-8 text-gray-400 mt-1" />
                    <div className="text-right">
                      <p className="font-semibold">+ RM {addOn.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">/yr</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">{addOn.category}</p>
                    <h4 className="font-semibold text-sm">{addOn.title}</h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="link" className="text-blue-600 text-sm p-0 h-auto">
                      Show More
                    </Button>
                    <Checkbox
                      checked={planData.addOns[addOn.id as keyof PlanData["addOns"]]}
                      onCheckedChange={(checked) =>
                        handleAddOnChange(addOn.id as keyof PlanData["addOns"], checked as boolean)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-6">
          <Button
            className="bg-[#0056b3] hover:bg-[#004494] text-white font-semibold px-12 py-3"
            onClick={handleProceed}
          >
            Proceed
          </Button>
        </div>
      </div>

      {/* Calculation Summary */}
      <CalculationSummary step="customize" planData={planData} />
    </div>
  )
}
