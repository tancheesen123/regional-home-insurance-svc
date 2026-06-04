"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Check, Home, Package, Shield, Calculator, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import CalculationSummary from "./calculation-summary"
import QuotationStepper from "./quotation-stepper"
import ContentCalculator, {
  type RoomAmounts,
  EMPTY_ROOM_AMOUNTS,
} from "./content-calculator"
import BuildingCalculator from "./building-calculator"
import {
  customizePlan,
  calculatePremium,
  getQuotationId,
  getQuotationStartDate,
  toCalculateDateFormat,
  type PremiumData,
} from "@/lib/api"
import { getSession } from "@/lib/session"
import { getRegionConfig, fmtAmount, clampAndRound } from "@/lib/region"

// ── Static constants ──────────────────────────────────────────────────────────

const PLAN_TYPE_INT: Record<string, 1 | 2 | 3> = {
  "building-only":     1,
  "content-only":      2,
  "building-contents": 3,
}

const ADD_ON_CODES: Record<string, string> = {
  riotStrike:               "E008",
  extendedTheft:            "E005",
  alternativeAccommodation: "E006",
  publicLiability:          "E007",
}

const PLAN_IDS = ["building-contents", "building-only", "content-only"] as const
type PlanId = typeof PLAN_IDS[number]

const ADD_ON_IDS = [
  "riotStrike",
  "extendedTheft",
  "alternativeAccommodation",
  "publicLiability",
] as const
type AddOnId = typeof ADD_ON_IDS[number]

// ── Types ─────────────────────────────────────────────────────────────────────

interface AddOns {
  riotStrike: boolean
  extendedTheft: boolean
  alternativeAccommodation: boolean
  publicLiability: boolean
}

interface PlanState {
  selectedPlan: string
  buildingAmount: number
  contentAmount: number
  addOns: AddOns
}

// ─────────────────────────────────────────────────────────────────────────────

export default function PlanCustomization() {
  const router = useRouter()
  const t = useTranslations("quotation")
  const region = getRegionConfig(getSession()?.countryCode ?? "")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Per-field validation errors (plan, buildingAmount, contentAmount)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Plan state — initialised with building-contents defaults
  const [planState, setPlanState] = useState<PlanState>({
    selectedPlan:   "",   // no plan pre-selected — customer must choose
    buildingAmount: 0,
    contentAmount:  0,
    addOns: {
      riotStrike:               false,
      extendedTheft:            false,
      alternativeAccommodation: false,
      publicLiability:          false,
    },
  })

  // Live premium
  const [premiumData, setPremiumData]         = useState<PremiumData | null>(null)
  const [isPremiumLoading, setIsPremiumLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Content calculator
  const [showContentCalculator, setShowContentCalculator] = useState(false)
  const [savedRoomAmounts, setSavedRoomAmounts] = useState<RoomAmounts>(EMPTY_ROOM_AMOUNTS)

  // Building calculator full-page swap
  const [showBuildingCalculator, setShowBuildingCalculator] = useState(false)
  // True while the building amount was last set by the calculator (cleared on manual edit)
  const [buildingFromCalc, setBuildingFromCalc] = useState(false)

  // ── Live preview ──────────────────────────────────────────────────────────

  const runLiveCalculation = useCallback(async (state: PlanState) => {
    const session = getSession()
    if (!session) return

    const selectedCodes = Object.entries(state.addOns)
      .filter(([, checked]) => checked)
      .map(([key]) => ADD_ON_CODES[key])
      .filter(Boolean)

    const startDate = toCalculateDateFormat(getQuotationStartDate())

    setIsPremiumLoading(true)
    try {
      const res = await calculatePremium(
        {
          planType: PLAN_TYPE_INT[state.selectedPlan] ?? 3,
          buildingSumInsured:
            state.selectedPlan === "content-only" ? 0 : state.buildingAmount,
          contentSumInsured:
            state.selectedPlan === "building-only" ? 0 : state.contentAmount,
          addOnCodes: selectedCodes,
          startDate,
          discountAmount: 0,
        },
        session.countryCode,
      )
      if (res.succeeded) setPremiumData(res.data)
    } catch {
      // Non-fatal — leave previous data in place
    } finally {
      setIsPremiumLoading(false)
    }
  }, [])

  // Debounced recalc on relevant state changes
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      runLiveCalculation(planState)
    }, 600)
    return () => clearTimeout(debounceRef.current)
  }, [
    planState.selectedPlan,
    planState.buildingAmount,
    planState.contentAmount,
    planState.addOns.riotStrike,
    planState.addOns.extendedTheft,
    planState.addOns.alternativeAccommodation,
    planState.addOns.publicLiability,
    runLiveCalculation,
  ])

  // ── Handlers ─────────────────────────────────────────────────────────────

  /** Switch plan and reset sum-insured to sensible plan-specific defaults. */
  const handlePlanSelect = useCallback(
    (planId: string) => {
      setPlanState((prev) => ({
        ...prev,
        selectedPlan:   planId,
        buildingAmount: 0,   // customer enters their own amount
        contentAmount:  0,
      }))
      setFieldErrors({})   // plan changed — reset all amount errors
    },
    [],
  )

  /** Parse raw input value and update state immediately (raw, un-rounded). */
  const handleAmountChange = useCallback(
    (field: "buildingAmount" | "contentAmount", value: string) => {
      const num = parseInt(value.replace(/,/g, ""), 10) || 0
      setPlanState((prev) => ({ ...prev, [field]: num }))
      // Clear the "from calculator" badge when the user manually edits the building field
      if (field === "buildingAmount") setBuildingFromCalc(false)
      // Clear inline error for this amount field as the user types
      setFieldErrors((prev) => {
        if (!prev[field]) return prev
        const next = { ...prev }; delete next[field]; return next
      })
    },
    [],
  )

  /**
   * On blur: clamp to region min/max and snap to the nearest rounding unit.
   * This gives the same UX as Unity's `roundToNearestThousand` on blur.
   */
  const handleAmountBlur = useCallback(
    (field: "buildingAmount" | "contentAmount") => {
      setPlanState((prev) => {
        const raw = prev[field]
        const min = field === "buildingAmount" ? region.buildingMin : region.contentMin
        const max = field === "buildingAmount" ? region.buildingMax : region.contentMax
        const snapped = clampAndRound(raw, min, max, region.roundingUnit)
        return { ...prev, [field]: snapped }
      })
    },
    [region],
  )

  const handleAddOnChange = useCallback((id: keyof AddOns, checked: boolean) => {
    setPlanState((prev) => ({
      ...prev,
      addOns: { ...prev.addOns, [id]: checked },
    }))
  }, [])

  /** Called when the user confirms a total in the content calculator. */
  const handleCalculatorConfirm = useCallback(
    (total: number, roomAmounts: RoomAmounts) => {
      setSavedRoomAmounts(roomAmounts)
      setPlanState((prev) => ({ ...prev, contentAmount: total }))
      setShowContentCalculator(false)
      setFieldErrors((prev) => { const n = { ...prev }; delete n.contentAmount; return n })
    },
    [],
  )

  /** Called when the user confirms a total in the building calculator. */
  const handleBuildingConfirm = useCallback(
    (total: number) => {
      const snapped = clampAndRound(total, region.buildingMin, region.buildingMax, region.roundingUnit)
      setPlanState((prev) => ({ ...prev, buildingAmount: snapped }))
      setShowBuildingCalculator(false)
      setBuildingFromCalc(true)
      setFieldErrors((prev) => { const n = { ...prev }; delete n.buildingAmount; return n })
    },
    [region],
  )

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleProceed = async () => {
    setError(null)

    // ── Validate required fields ───────────────────────────────────────────────
    const e: Record<string, string> = {}
    if (!planState.selectedPlan) {
      e.plan = t("validation.required")
    } else {
      const needsBuilding = planState.selectedPlan === "building-contents" || planState.selectedPlan === "building-only"
      const needsContent  = planState.selectedPlan === "building-contents" || planState.selectedPlan === "content-only"
      if (needsBuilding && (!planState.buildingAmount || planState.buildingAmount < region.buildingMin)) {
        e.buildingAmount = t("validation.required")
      }
      if (needsContent && (!planState.contentAmount || planState.contentAmount < region.contentMin)) {
        e.contentAmount = t("validation.required")
      }
    }
    setFieldErrors(e)
    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0]
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    const session = getSession()
    const quotationId = getQuotationId()

    if (!session) { setError(t("common.sessionExpired")); return }
    if (!quotationId) { setError(t("common.quotationNotFound")); return }

    setIsLoading(true)
    try {
      const response = await customizePlan(
        {
          quotationId,
          planType: planState.selectedPlan,
          buildingSum:
            planState.selectedPlan === "content-only"  ? 0 : planState.buildingAmount,
          contentsSum:
            planState.selectedPlan === "building-only" ? 0 : planState.contentAmount,
          discountAmount: 0,
          addOns: planState.addOns,
        },
        session.countryCode,
      )

      console.log("[CustomizePlan Response]", response)

      if (!response.succeeded) {
        setError(response.message ?? t("customize.failedToSave"))
        return
      }

      router.push("/dashboard/quotation/declare-valuables")
    } catch (err) {
      console.error("[CustomizePlan Error]", err)
      setError(t("common.somethingWentWrong"))
    } finally {
      setIsLoading(false)
    }
  }

  // ── Derived / helpers ─────────────────────────────────────────────────────

  const summaryPlanData = {
    selectedPlan:   planState.selectedPlan,
    buildingAmount: planState.buildingAmount,
    contentAmount:  planState.contentAmount,
  }

  const planTitle = (id: string) => {
    if (id === "building-contents") return t("customize.buildingContentsTitle")
    if (id === "building-only")     return t("customize.buildingOnlyTitle")
    return t("customize.contentOnlyTitle")
  }

  const planDesc = (id: string) => {
    if (id === "building-contents") return t("customize.buildingContentsDesc")
    if (id === "building-only")     return t("customize.buildingOnlyDesc")
    return t("customize.contentOnlyDesc")
  }

  const planIcons = (id: string) => {
    if (id === "building-contents") return [Home, Package]
    if (id === "building-only")     return [Home]
    return [Package]
  }

  const addOnTitle = (id: AddOnId) =>
    ({
      riotStrike:               t("customize.riotStrikeTitle"),
      extendedTheft:            t("customize.extendedTheftTitle"),
      alternativeAccommodation: t("customize.altAccommodationTitle"),
      publicLiability:          t("customize.publicLiabilityTitle"),
    })[id]

  const addOnCategory = (id: AddOnId) =>
    ({
      riotStrike:               t("customize.riotStrikeCategory"),
      extendedTheft:            t("customize.extendedTheftCategory"),
      alternativeAccommodation: t("customize.altAccommodationCategory"),
      publicLiability:          t("customize.publicLiabilityCategory"),
    })[id]

  const addOnDesc = (id: AddOnId) =>
    ({
      riotStrike:               t("customize.riotStrikeDesc"),
      extendedTheft:            t("customize.extendedTheftDesc"),
      alternativeAccommodation: t("customize.altAccommodationDesc"),
      publicLiability:          t("customize.publicLiabilityDesc"),
    })[id]

  // ── Render — Building Calculator full-page swap ────────────────────────────

  if (showBuildingCalculator) {
    return (
      <BuildingCalculator
        onBack={() => setShowBuildingCalculator(false)}
        onConfirm={handleBuildingConfirm}
        symbol={region.symbol}
        countryCode={getSession()?.countryCode ?? "ID"}
      />
    )
  }

  // ── Render — Content Calculator full-page swap ─────────────────────────────

  if (showContentCalculator) {
    return (
      <ContentCalculator
        onBack={() => setShowContentCalculator(false)}
        onConfirm={handleCalculatorConfirm}
        minAmount={region.contentMin}
        maxAmount={region.contentMax}
        roundingUnit={region.roundingUnit}
        symbol={region.symbol}
        initialAmounts={savedRoomAmounts}
      />
    )
  }

  // ── Render — Main plan customization ──────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto pr-0 lg:pr-8">

      <QuotationStepper currentStep={1} />

      <div className="space-y-8">

        {/* ── Plan Selection ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("customize.title")}</h2>
            <Button variant="link" className="text-[#0066CC] hover:text-[#004EA8] flex items-center gap-1">
              {t("customize.productComparison")}<ChevronRight className="h-[14px] w-[14px]" />
            </Button>
          </div>

          <div className="mb-6" id="field-plan">
            <p className="text-lg font-medium mb-4">{t("customize.iWouldLikeToProtect")}</p>
            <div className={cn(
              "grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg",
              fieldErrors.plan && "ring-1 ring-[#D32F2F] p-2",
            )}>
              {PLAN_IDS.map((id) => {
                const icons = planIcons(id)
                return (
                  <Card
                    key={id}
                    className={cn(
                      "cursor-pointer transition-all duration-150",
                      planState.selectedPlan === id
                        ? "border-2 border-[#00A651] bg-[#E6F7EE]"
                        : "border-[1.5px] border-[#E0E0E0] hover:border-[#F5A623] hover:shadow-md",
                    )}
                    onClick={() => handlePlanSelect(id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {icons.map((Icon, i) => (
                            <Icon key={i} className="h-8 w-8 text-[#F5A623]" />
                          ))}
                        </div>
                        {planState.selectedPlan === id && (
                          <div className="w-5 h-5 rounded-full bg-[#00A651] flex items-center justify-center shrink-0"><Check className="h-3 w-3 text-white" strokeWidth={2.5} /></div>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1">{planTitle(id)}</h3>
                      <p className="text-sm text-[#555555]">{planDesc(id)}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            {fieldErrors.plan && (
              <p className="mt-2 text-xs text-[#D32F2F] flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.plan}
              </p>
            )}
          </div>
        </div>

        {/* ── Building Sum Insured ── */}
        {(planState.selectedPlan === "building-contents" ||
          planState.selectedPlan === "building-only") && (
          <div id="field-buildingAmount" className={cn(
            "border p-6 rounded-lg transition-all duration-150",
            fieldErrors.buildingAmount
              ? "bg-white border-[#D32F2F]"
              : buildingFromCalc
                ? "bg-[#E6F7EE] border-[#00A651]"
                : "bg-white border-[#E0E0E0]",
          )}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-[#1A1A1A]">{t("customize.homeBuildingTitle")}</h3>
              {buildingFromCalc && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#00A651] bg-[#E6F7EE] border border-[#00A651]/30 px-2.5 py-1 rounded-full">
                  <Calculator className="h-3 w-3" />
                  {t("customize.estimateApplied")}
                </span>
              )}
            </div>
            <p className="text-[#555555] mb-4 text-sm">{t("customize.homeBuildingDesc")}</p>

            <div className="flex items-center space-x-3 mb-2">
              <Label htmlFor="building-amount" className="text-sm font-medium text-[#555555] w-10 text-right shrink-0">
                {region.symbol}
              </Label>
              <Input
                id="building-amount"
                value={planState.buildingAmount.toLocaleString("en")}
                onChange={(e) => handleAmountChange("buildingAmount", e.target.value)}
                onBlur={() => handleAmountBlur("buildingAmount")}
                className={cn(
                  "w-44 text-right transition-colors duration-300",
                  buildingFromCalc && "border-[#00A651] ring-1 ring-[#00A651]/30 bg-white",
                )}
                inputMode="numeric"
              />
              <Button
                variant="link"
                className="text-[#0066CC] hover:text-[#004EA8] text-sm p-0 h-auto"
                onClick={() => setShowBuildingCalculator(true)}
              >
                {t("customize.getEstimate")}
              </Button>
            </div>

            <p className="text-xs text-[#9E9E9E] ml-13">
              Min {region.symbol} {fmtAmount(region.buildingMin)} &nbsp;–&nbsp; Max {region.symbol} {fmtAmount(region.buildingMax)}
            </p>
            {fieldErrors.buildingAmount && (
              <p className="mt-2 text-xs text-[#D32F2F] flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.buildingAmount}
              </p>
            )}
          </div>
        )}

        {/* ── Content Sum Insured ── */}
        {(planState.selectedPlan === "building-contents" ||
          planState.selectedPlan === "content-only") && (
          <div id="field-contentAmount" className={cn(
            "bg-[#FFFDE7] border p-6 rounded-lg",
            fieldErrors.contentAmount ? "border-[#D32F2F]" : "border-[#E0E0E0]",
          )}>
            <span className="inline-block mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#E87722] bg-[#FDF0E6] border border-[#F5C896] px-2 py-0.5 rounded-md">Home Content</span>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">{t("customize.homeContentTitle")}</h3>
            <p className="text-[#555555] mb-1 text-sm">{t("customize.homeContentDesc")}</p>
            <p className="text-xs text-[#9E9E9E] mb-4 italic">{t("customize.homeContentExample")}</p>

            <div className="flex items-center space-x-3 mb-2">
              <Label htmlFor="content-amount" className="text-sm font-medium text-[#555555] w-10 text-right shrink-0">
                {region.symbol}
              </Label>
              <Input
                id="content-amount"
                value={planState.contentAmount.toLocaleString("en")}
                onChange={(e) => handleAmountChange("contentAmount", e.target.value)}
                onBlur={() => handleAmountBlur("contentAmount")}
                className="w-44 text-right"
                inputMode="numeric"
              />
              {/* Opens the in-app room-by-room content calculator */}
              <Button
                variant="link"
                className="text-[#0066CC] hover:text-[#004EA8] text-sm p-0 h-auto"
                onClick={() => setShowContentCalculator(true)}
              >
                {t("customize.getEstimate")}
              </Button>
            </div>

            <p className="text-xs text-[#9E9E9E]">
              Min {region.symbol} {fmtAmount(region.contentMin)} &nbsp;–&nbsp; Max {region.symbol} {fmtAmount(region.contentMax)}
            </p>
            {fieldErrors.contentAmount && (
              <p className="mt-2 text-xs text-[#D32F2F] flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" />{fieldErrors.contentAmount}
              </p>
            )}
          </div>
        )}

        {/* ── Optional Add-ons ── */}
        <div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">{t("customize.optionalAddons")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ADD_ON_IDS.map((id) => (
              <Card
                key={id}
                className={cn(
                  "transition-all duration-150",
                  planState.addOns[id]
                    ? "border-[#00A651] bg-[#E6F7EE]"
                    : "border-[#E0E0E0] bg-white",
                )}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <Shield className={cn("h-6 w-6 shrink-0 mt-0.5", planState.addOns[id] ? "text-[#F5A623]" : "text-[#9E9E9E]")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#E87722] mb-0.5">{addOnCategory(id)}</p>
                    <h4 className="font-semibold text-sm">{addOnTitle(id)}</h4>
                    <p className="text-xs text-[#9E9E9E] mt-1">{addOnDesc(id)}</p>
                    <Button variant="link" className="text-[#0066CC] text-sm p-0 h-auto mt-1">
                      {t("customize.showMore")}
                    </Button>
                  </div>
                  <Checkbox
                    checked={planState.addOns[id]}
                    onCheckedChange={(checked) =>
                      handleAddOnChange(id, checked as boolean)
                    }
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ── Proceed ── */}
        <div className="flex justify-center pt-6">
          <Button
            className="bg-[#F5A623] hover:bg-[#D4891A] text-white font-semibold h-12 px-12 rounded-lg disabled:bg-[#E0E0E0] disabled:text-[#9E9E9E]"
            onClick={handleProceed}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t("customize.saving")}</span>
              </div>
            ) : (
              t("customize.proceed")
            )}
          </Button>
        </div>
      </div>

      {/* ── Calculation Summary sidebar ── */}
      <CalculationSummary
        step="customize"
        planData={summaryPlanData}
        premiumData={premiumData}
        isPremiumLoading={isPremiumLoading}
      />

    </div>
  )
}
