"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Plus, Minus, Edit, Trash2, AlertTriangle,
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

  const [region, setRegion] = useState(() => getRegionConfig(""))
  useEffect(() => {
    setRegion(getRegionConfig(getSession()?.countryCode ?? ""))
  }, [])
  const symbol = region.symbol
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

  const [newItems, setNewItems] = useState<Record<string, { description: string; value: string }>>({})

  const [editingItem, setEditingItem] = useState<Record<string, string | null>>({})

  const MIN_ITEM_VALUE     = region.valuableMinItem
  const MAX_ITEM_VALUE     = region.valuableMaxItem
  const MAX_TOTAL_DECLARED = region.valuableMaxTotal

  const totalDeclaredAmount = categories.reduce(
    (total, category) => total + category.items.reduce((sum, item) => sum + item.value, 0),
    0,
  )
  const remainingCoverage  = MAX_TOTAL_DECLARED - totalDeclaredAmount
  const isAtLimit          = totalDeclaredAmount >= MAX_TOTAL_DECLARED
  const isNearLimit        = !isAtLimit && totalDeclaredAmount >= MAX_TOTAL_DECLARED * 0.8

  const [storedPremium, setStoredPremium] = useState<ReturnType<typeof getQuotationPremium>>(null)
  const [propSummary,   setPropSummary]   = useState<ReturnType<typeof getQuotationPropertySummary>>(null)
  useEffect(() => {
    setStoredPremium(getQuotationPremium())
    setPropSummary(getQuotationPropertySummary())
  }, [])

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

  // Toggle a single card; other cards stay as-is (multi-expand allowed)
  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        isExpanded: cat.id === categoryId ? !cat.isExpanded : cat.isExpanded,
      })),
    )
  }

  const getNewItem = (categoryId: string) =>
    newItems[categoryId] ?? { description: "", value: "" }

  const setNewItemField = (categoryId: string, field: "description" | "value", val: string) =>
    setNewItems((prev) => ({
      ...prev,
      [categoryId]: { ...getNewItem(categoryId), [field]: val },
    }))

  const addItem = (categoryId: string) => {
    const item = getNewItem(categoryId)
    if (!item.description || !item.value) return

    const value = Number.parseFloat(item.value)
    if (value < MIN_ITEM_VALUE || value > MAX_ITEM_VALUE) return

    const editingId = editingItem[categoryId]
    if (editingId) {
      // Editing an existing item — exclude its current value from the cap check
      const category = categories.find((c) => c.id === categoryId)
      const existingValue = category?.items.find((i) => i.id === editingId)?.value ?? 0
      if (totalDeclaredAmount - existingValue + value > MAX_TOTAL_DECLARED) return

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                items: cat.items.map((i) =>
                  i.id === editingId ? { ...i, description: item.description, value } : i,
                ),
              }
            : cat,
        ),
      )
      setEditingItem((prev) => ({ ...prev, [categoryId]: null }))
    } else {
      if (totalDeclaredAmount + value > MAX_TOTAL_DECLARED) return   // hard cap

      const newItemObj: ValuableItem = {
        id: Date.now().toString(),
        description: item.description,
        value,
      }

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, items: [...cat.items, newItemObj] }
            : cat,
        ),
      )
    }

    // Clear only this card's inputs
    setNewItems((prev) => ({ ...prev, [categoryId]: { description: "", value: "" } }))
  }

  const startEditItem = (categoryId: string, item: ValuableItem) => {
    setEditingItem((prev) => ({ ...prev, [categoryId]: item.id }))
    setNewItems((prev) => ({
      ...prev,
      [categoryId]: { description: item.description, value: String(item.value) },
    }))
  }

  const cancelEditItem = (categoryId: string) => {
    setEditingItem((prev) => ({ ...prev, [categoryId]: null }))
    setNewItems((prev) => ({ ...prev, [categoryId]: { description: "", value: "" } }))
  }

  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat,
      ),
    )
    if (editingItem[categoryId] === itemId) cancelEditItem(categoryId)
  }

  // Maps the UI's declaration categories to the rate-config categories the
  // backend validates against (jewellery, electronics, artwork, sports-equipment, other).
  const BACKEND_CATEGORY: Record<string, string> = {
    gold:         "jewellery",
    platinum:     "jewellery",
    silver:       "jewellery",
    jewellery:    "jewellery",
    "animal-fur": "other",
    sports:       "sports-equipment",
    collectibles: "artwork",
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
        category: BACKEND_CATEGORY[cat.id] ?? cat.id,
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
      <>
        <div className="max-w-4xl mx-auto px-4 pb-6">
          <QuotationStepper currentStep={2} />

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">
              {t("declare.ownMoreThan", { symbol })}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {categories.map((category) => (
                <div key={category.id} className="group flex flex-col items-center text-center p-4 rounded-xl border border-[#E0E0E0] bg-[#FAFAFA] hover:border-[#F5A623] hover:bg-[#FEF3DC] hover:shadow-md transition-colors duration-150 cursor-pointer">
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
                className="flex-1 bg-[#F5A623] hover:bg-[#D4891A] text-white font-semibold h-12 rounded-lg transition-colors duration-150"
              >
                {t("declare.yesWantToDeclare")}
              </Button>
              <Button
                onClick={handleSkipDeclaration}
                className="flex-1 bg-white border-[1.5px] border-[#E0E0E0] text-[#1A1A1A] hover:border-[#F5A623] hover:text-[#F5A623] hover:bg-[#FEF3DC] h-12 rounded-lg transition-colors duration-150"
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

        <SummaryBar
          total={storedPremium?.totalPremium}
          totalBeforeDiscount={storedPremium?.totalBeforeDiscount}
          monthly={storedPremium?.monthlyPremium}
          breakdown={buildBreakdown()}
          onProceed={handleSkipDeclaration}
          proceedLabel={t("declare.continue")}
        />
      </>
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

        {/* ── Coverage limit banner ──────────────────────────────────────── */}
        {(isAtLimit || isNearLimit) && (
          <div className={cn(
            "flex items-start gap-3 rounded-xl px-4 py-3 mb-4 border",
            isAtLimit
              ? "bg-[#FFF3F3] border-[#FFCDD2] text-[#C62828]"
              : "bg-[#FFFBE6] border-[#FFE082] text-[#E65100]",
          )}>
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="text-sm leading-snug">
              {isAtLimit ? (
                <>
                  <span className="font-semibold">Coverage limit reached.</span>{" "}
                  You have declared {symbol} {totalDeclaredAmount.toLocaleString()}, which is the maximum
                  coverable amount ({symbol} {MAX_TOTAL_DECLARED.toLocaleString()}). No more items can be added.
                </>
              ) : (
                <>
                  <span className="font-semibold">Approaching limit.</span>{" "}
                  {symbol} {remainingCoverage.toLocaleString()} remaining out of{" "}
                  {symbol} {MAX_TOTAL_DECLARED.toLocaleString()} total coverage.
                </>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3 mb-8">
          {categories.map((category) => {
            const catTotal    = category.items.reduce((s, i) => s + i.value, 0)
            const cardNewItem = getNewItem(category.id)

            return (
            <Card
              key={category.id}
              className={cn(
                "border-[1.5px] rounded-xl transition-colors duration-150",
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
                  <div className="flex items-center gap-2">
                    {/* Per-card declared total badge */}
                    {catTotal > 0 && (
                      <span className="text-xs font-semibold bg-[#FEF3DC] text-[#D4891A] px-2 py-0.5 rounded-full">
                        {symbol} {catTotal.toLocaleString()}
                      </span>
                    )}
                    <Button variant="ghost" size="icon" className="text-[#9E9E9E] hover:text-[#1A1A1A]">
                      {category.isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-in-out",
                  category.isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}>
                  <div className="overflow-hidden">
                    <div className="mt-4 space-y-4 pt-4 border-t border-[#F5F5F5]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`desc-${category.id}`} className="text-sm font-medium text-[#1A1A1A] mb-1.5 block">
                            {t("declare.descriptionLabel")}
                          </Label>
                          <Input
                            id={`desc-${category.id}`}
                            placeholder={t("declare.descriptionPlaceholder")}
                            value={cardNewItem.description}
                            onChange={(e) => setNewItemField(category.id, "description", e.target.value)}
                            className="border-[#E0E0E0] rounded-lg h-10"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`val-${category.id}`} className="text-sm font-medium text-[#1A1A1A] mb-1.5 block">
                            {t("declare.valueLabel")}
                          </Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm text-[#1A1A1A] bg-[#FAFAFA] border border-r-0 border-[#E0E0E0] rounded-l-lg">
                              {symbol}
                            </span>
                            <Input
                              id={`val-${category.id}`}
                              type="number"
                              className="rounded-l-none border-[#E0E0E0] h-10"
                              value={cardNewItem.value}
                              onChange={(e) => setNewItemField(category.id, "value", e.target.value)}
                              disabled={isAtLimit}
                            />
                          </div>
                          <p className="text-xs text-[#9E9E9E] mt-1.5">
                            {t("declare.minMax", { symbol, min: MIN_ITEM_VALUE.toLocaleString(), max: MAX_ITEM_VALUE.toLocaleString() })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => addItem(category.id)}
                          className="text-[#0066CC] hover:text-[#004EA8] bg-transparent hover:bg-transparent hover:underline p-0 h-auto font-medium transition-colors duration-150"
                          disabled={(isAtLimit && !editingItem[category.id]) || !cardNewItem.description || !cardNewItem.value}
                        >
                          {editingItem[category.id] ? (
                            <>
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              {t("declare.saveItem")}
                            </>
                          ) : (
                            <>
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              {t("declare.addItem")}
                            </>
                          )}
                        </Button>
                        {editingItem[category.id] && (
                          <Button
                            onClick={() => cancelEditItem(category.id)}
                            variant="ghost"
                            className="text-[#9E9E9E] hover:text-[#1A1A1A] p-0 h-auto font-medium transition-colors duration-150"
                          >
                            {t("declare.cancel")}
                          </Button>
                        )}
                      </div>

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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[#0066CC] hover:text-[#004EA8] hover:bg-[#E0F0FF] h-8 px-2"
                                  onClick={() => startEditItem(category.id, item)}
                                >
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
                  </div>
                </div>
              </CardContent>
            </Card>
          )
          })}
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
