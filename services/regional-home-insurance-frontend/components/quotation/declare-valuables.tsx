"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Plus, Minus, Edit, Trash2,
  Medal, Gem, Coins, Diamond, Shirt, Dumbbell, Archive,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SummaryBar, { type SummaryBreakdown } from "./summary-bar"
import QuotationStepper from "./quotation-stepper"
import {
  declareValuables, getQuotationId,
  getQuotationPremium, getQuotationPropertySummary, patchQuotationPremiumTotals,
} from "@/lib/api"
import { getSession } from "@/lib/session"
import { getRegionConfig } from "@/lib/region"

interface ValuableItem {
  id: string
  description: string
  value: number
}

interface ValuableCategory {
  id: string
  nameKey: string
  descKey?: string
  Icon: React.ElementType
  items: ValuableItem[]
  isExpanded: boolean
}

export default function DeclareValuables() {
  const router = useRouter()
  const t = useTranslations("quotation")
  const { symbol } = getRegionConfig(getSession()?.countryCode ?? "")
  const [showDeclaration, setShowDeclaration] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<ValuableCategory[]>([
    { id: "gold",         nameKey: "declare.gold",         Icon: Medal,   items: [], isExpanded: false },
    { id: "platinum",     nameKey: "declare.platinum",     Icon: Gem,     items: [], isExpanded: false },
    { id: "silver",       nameKey: "declare.silver",       Icon: Coins,   items: [], isExpanded: false },
    { id: "jewellery",    nameKey: "declare.jewellery",    descKey: "declare.jewelleryDesc",   Icon: Diamond, items: [], isExpanded: false },
    { id: "animal-fur",   nameKey: "declare.animalFur",    descKey: "declare.animalFurDesc",   Icon: Shirt,   items: [], isExpanded: false },
    { id: "sports",       nameKey: "declare.sports",       descKey: "declare.sportsDesc",      Icon: Dumbbell,items: [], isExpanded: false },
    { id: "collectibles", nameKey: "declare.collectibles", descKey: "declare.collectiblesDesc", Icon: Archive, items: [], isExpanded: false },
  ])

  const [newItem, setNewItem] = useState({ description: "", value: "" })

  const maxDeclarableAmount = 20000
  const totalDeclaredAmount = categories.reduce(
    (total, category) => total + category.items.reduce((sum, item) => sum + item.value, 0),
    0,
  )
  const undeclaredAmount = 60000 - totalDeclaredAmount

  // ── Summary bar data (real premium carried from the customize step) ──────────
  const storedPremium = getQuotationPremium()
  const propSummary   = getQuotationPropertySummary()

  const PLAN_LABEL: Record<string, string> = {
    "building-contents": "Building + Contents",
    "building-only":     "Building Only",
    "content-only":      "Content Only",
  }

  const buildBreakdown = (): SummaryBreakdown | undefined => {
    const declared = categories.flatMap((c) =>
      c.items.map((it) => ({
        label: it.description || t(c.nameKey as Parameters<typeof t>[0]),
        value: it.value,
      })),
    )
    if (!storedPremium) {
      return declared.length ? { valuables: declared } : undefined
    }
    const gross = storedPremium.grossPremium
    const pct = gross > 0 ? Math.round((storedPremium.discountAmount / gross) * 100) : undefined
    return {
      planLabel:        PLAN_LABEL[storedPremium.planType] ?? storedPremium.planType,
      coveragePeriod:   `${storedPremium.startDate} – ${storedPremium.endDate}`,
      coverageType:     propSummary
        ? `${propSummary.propertyType === "landed" ? "Landed" : "Non-landed"}, ${propSummary.numberOfStorey}-storey`
        : undefined,
      constructionType: propSummary
        ? (propSummary.constructionType === "full-brick" ? "Full Brick" : "Partial Brick")
        : undefined,
      buildingSum:      storedPremium.buildingSum  > 0 ? storedPremium.buildingSum  : undefined,
      contentsSum:      storedPremium.contentsSum  > 0 ? storedPremium.contentsSum  : undefined,
      grossPremium:     storedPremium.grossPremium,
      discountAmount:   storedPremium.discountAmount,
      discountRatePct:  pct,
      serviceTaxRate:   storedPremium.serviceTaxRate,
      serviceTaxAmount: storedPremium.serviceTaxAmount,
      stampDuty:        storedPremium.stampDutyAmount,
      addOns:           storedPremium.addOnBreakdown.map((a) => ({ name: a.name, premium: a.premium })),
      valuables:        declared.length ? declared : undefined,
    }
  }

  const handleWantToDeclare = () => {
    setShowDeclaration(true)
  }

  const handleSkipDeclaration = () => {
    router.push("/dashboard/quotation/fill-details")
  }

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        isExpanded: cat.id === categoryId ? !cat.isExpanded : false,
      })),
    )
    setNewItem({ description: "", value: "" })
  }

  const addItem = (categoryId: string) => {
    if (!newItem.description || !newItem.value) return

    const value = Number.parseFloat(newItem.value)
    if (value < 3000 || value > 20000) return

    const newItemObj: ValuableItem = {
      id: Date.now().toString(),
      description: newItem.description,
      value: value,
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: [...cat.items, newItemObj] }
          : cat,
      ),
    )

    setNewItem({ description: "", value: "" })
  }

  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat,
      ),
    )
  }

  const handleContinue = async () => {
    setError(null)

    const session = getSession()
    const quotationId = getQuotationId()

    if (!session) { setError(t("common.sessionExpired")); return }
    if (!quotationId) { setError(t("declare.declarationQuotationNotFound")); return }

    // Flatten all items from all categories
    const items = categories.flatMap((cat) =>
      cat.items.map((item) => ({
        category: cat.id,
        description: item.description,
        value: item.value,
      }))
    )

    if (items.length === 0) {
      // No items declared — skip API call and go straight to fill-details
      router.push("/dashboard/quotation/fill-details")
      return
    }

    setIsLoading(true)
    try {
      const response = await declareValuables({ quotationId, items }, session.countryCode)
      console.log("[DeclareValuables Response]", response)

      if (!response.succeeded) {
        setError(response.message ?? t("declare.failedToDeclare"))
        return
      }

      // Keep the carried premium snapshot in sync with the valuables-inclusive total
      patchQuotationPremiumTotals(response.data.totalPremium, response.data.monthlyPremium)
      router.push("/dashboard/quotation/fill-details")
    } catch (err) {
      console.error("[DeclareValuables Error]", err)
      setError(t("common.somethingWentWrong"))
    } finally {
      setIsLoading(false)
    }
  }


  if (!showDeclaration) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <QuotationStepper currentStep={2} />

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">
            {t("declare.ownMoreThan", { symbol })}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {categories.map((category) => (
              <div key={category.id} className="group flex flex-col items-center text-center p-4 rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] hover:border-[#F5A623] hover:bg-[#FEF3DC] hover:shadow-md transition-all duration-150 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-[#F5A623] flex items-center justify-center mb-3 transition-colors duration-150">
                  <category.Icon className="h-6 w-6 text-[#F5A623] group-hover:text-white transition-colors duration-150" />
                </div>
                <h3 className="font-semibold text-[#1A1A1A] text-sm mb-0.5">{t(category.nameKey as Parameters<typeof t>[0])}</h3>
                {category.descKey && (
                  <p className="text-xs text-[#555555] leading-snug">({t(category.descKey as Parameters<typeof t>[0])})</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4 mb-8">
            <Button
              onClick={handleWantToDeclare}
              className="flex-1 bg-[#F5A623] hover:bg-[#D4891A] text-white font-semibold h-12 rounded-lg transition-all duration-150"
            >
              {t("declare.yesWantToDeclare")}
            </Button>
            <Button
              onClick={handleSkipDeclaration}
              className="flex-1 bg-white border-[1.5px] border-[#E0E0E0] text-[#1A1A1A] hover:border-[#F5A623] hover:text-[#F5A623] hover:bg-[#FEF3DC] h-12 rounded-lg transition-all duration-150"
            >
              {t("declare.noSkip")}
            </Button>
          </div>

          <Alert className="bg-[#FAFAFA] border-[#E0E0E0]">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-[#1A1A1A]">{t("declare.itemsNotNeededTitle")}</p>
                <p className="text-sm text-[#555555]">
                  <span className="text-[#0066CC]">
                    {t("declare.coverageUpTo", { symbol })}
                  </span>
                </p>
                <p className="text-sm text-[#555555]">{t("declare.furnitureDesc")}</p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 pb-6">
      <QuotationStepper currentStep={2} />

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">{t("declare.fillDetailsTitle")}</h2>
          <Button
            variant="link"
            className="text-[#0066CC] hover:text-[#004EA8] p-0 h-auto"
            onClick={handleSkipDeclaration}
          >
            {t("declare.skipDeclaration")}
          </Button>
        </div>

        <div className="space-y-3 mb-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={cn(
                "border-[1.5px] rounded-xl transition-all duration-150",
                category.isExpanded
                  ? "border-[#F5A623] shadow-sm"
                  : "border-[#E0E0E0] hover:border-[#F5A623] hover:shadow-md",
              )}
            >
              <CardContent className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      category.isExpanded ? "bg-[#FEF3DC]" : "bg-[#F5F5F5]",
                    )}>
                      <category.Icon className={cn(
                        "h-5 w-5",
                        category.isExpanded ? "text-[#F5A623]" : "text-[#9E9E9E]",
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">{t(category.nameKey as Parameters<typeof t>[0])}</h3>
                      {category.descKey && (
                        <p className="text-sm text-[#555555]">({t(category.descKey as Parameters<typeof t>[0])})</p>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-[#9E9E9E] hover:text-[#1A1A1A]">
                    {category.isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>

                {category.isExpanded && (
                  <div className="mt-4 space-y-4 pt-4 border-t border-[#F5F5F5]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="description" className="text-sm font-medium text-[#1A1A1A] mb-1.5 block">
                          {t("declare.descriptionLabel")}
                        </Label>
                        <Input
                          id="description"
                          placeholder={t("declare.descriptionPlaceholder")}
                          value={newItem.description}
                          onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                          className="border-[#E0E0E0] rounded-lg h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="value" className="text-sm font-medium text-[#1A1A1A] mb-1.5 block">
                          {t("declare.valueLabel")}
                        </Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 text-sm text-[#1A1A1A] bg-[#FAFAFA] border border-r-0 border-[#E0E0E0] rounded-l-lg">
                            {symbol}
                          </span>
                          <Input
                            id="value"
                            type="number"
                            className="rounded-l-none border-[#E0E0E0] h-10"
                            value={newItem.value}
                            onChange={(e) => setNewItem((prev) => ({ ...prev, value: e.target.value }))}
                          />
                        </div>
                        <p className="text-xs text-[#9E9E9E] mt-1.5">{t("declare.minMax", { symbol })}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => addItem(category.id)}
                      className="text-[#0066CC] hover:text-[#004EA8] bg-transparent hover:bg-transparent hover:underline p-0 h-auto font-medium transition-colors duration-150"
                      disabled={!newItem.description || !newItem.value}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      {t("declare.addItem")}
                    </Button>

                    {category.items.length > 0 && (
                      <div className="space-y-2">
                        {category.items.map((item, index) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg">
                            <span className="text-sm text-[#1A1A1A]">
                              {index + 1}. {item.description}
                              <span className="text-[#9E9E9E] mx-1">·</span>
                              <span className="font-medium">{symbol} {item.value.toLocaleString()}</span>
                            </span>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm" className="text-[#0066CC] hover:text-[#004EA8] hover:bg-[#E0F0FF] h-8 px-2">
                                <Edit className="h-3.5 w-3.5" />
                                <span className="ml-1 text-xs">{t("declare.edit")}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#D32F2F] hover:text-[#B71C1C] hover:bg-[#FFEBEE] h-8 px-2"
                                onClick={() => deleteItem(category.id, item.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

      </div>
    </div>

      <SummaryBar
        total={storedPremium?.totalPremium}
        totalBeforeDiscount={storedPremium?.totalBeforeDiscount}
        monthly={storedPremium?.monthlyPremium}
        breakdown={buildBreakdown()}
        onProceed={handleContinue}
        proceedLabel={t("declare.continue")}
        proceedLoading={isLoading}
      />
    </>
  )
}
