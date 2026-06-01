"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Plus, Minus, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CalculationSummary from "./calculation-summary"
import QuotationStepper from "./quotation-stepper"
import { declareValuables, getQuotationId } from "@/lib/api"
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
  icon: string
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
    { id: "gold",       nameKey: "declare.gold",       icon: "🏅", items: [], isExpanded: false },
    { id: "platinum",   nameKey: "declare.platinum",   icon: "🥈", items: [], isExpanded: false },
    { id: "silver",     nameKey: "declare.silver",     icon: "🥉", items: [], isExpanded: false },
    { id: "jewellery",  nameKey: "declare.jewellery",  descKey: "declare.jewelleryDesc",   icon: "💎", items: [], isExpanded: false },
    { id: "animal-fur", nameKey: "declare.animalFur",  descKey: "declare.animalFurDesc",   icon: "🧥", items: [], isExpanded: false },
    { id: "sports",     nameKey: "declare.sports",     descKey: "declare.sportsDesc",      icon: "🚴", items: [], isExpanded: false },
    { id: "collectibles", nameKey: "declare.collectibles", descKey: "declare.collectiblesDesc", icon: "🏺", items: [], isExpanded: false },
  ])

  const [newItem, setNewItem] = useState({ description: "", value: "" })

  const maxDeclarableAmount = 20000
  const totalDeclaredAmount = categories.reduce(
    (total, category) => total + category.items.reduce((sum, item) => sum + item.value, 0),
    0,
  )
  const undeclaredAmount = 60000 - totalDeclaredAmount

  const planData = {
    selectedPlan: "building-contents",
    buildingAmount: 500000,
    contentAmount: 60000,
    addOns: {
      riotStrike: false,
      extendedTheft: false,
    },
  }

  const valuablesData = {
    totalDeclaredAmount,
    maxDeclarableAmount,
    undeclaredAmount,
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
      <div className="max-w-4xl mx-auto pr-0 lg:pr-8">
        <QuotationStepper currentStep={2} />

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">
            {t("declare.ownMoreThan", { symbol })}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {categories.map((category) => (
              <div key={category.id} className="text-center">
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-[#1A1A1A] mb-1">{t(category.nameKey as Parameters<typeof t>[0])}</h3>
                {category.descKey && (
                  <p className="text-sm text-[#555555]">({t(category.descKey as Parameters<typeof t>[0])})</p>
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
              className="flex-1 bg-white border-[1.5px] border-[#E0E0E0] text-[#1A1A1A] hover:border-[#F5A623] hover:text-[#F5A623] h-12 rounded-lg transition-all duration-150"
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

        <CalculationSummary step="declare" planData={planData} valuablesData={valuablesData} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pr-0 lg:pr-8">
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
                  : "border-[#E0E0E0] hover:border-[#F5A623] hover:shadow-sm",
              )}
            >
              <CardContent className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
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

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            className="bg-[#F5A623] hover:bg-[#D4891A] text-white font-semibold h-12 px-12 rounded-lg disabled:bg-[#E0E0E0] disabled:text-[#9E9E9E] transition-all duration-150"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t("declare.saving")}</span>
              </div>
            ) : t("declare.continue")}
          </Button>
        </div>
      </div>

      <CalculationSummary step="declare" planData={planData} valuablesData={valuablesData} />
    </div>
  )
}
