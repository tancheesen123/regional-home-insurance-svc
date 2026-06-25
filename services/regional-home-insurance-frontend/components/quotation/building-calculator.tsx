"use client"

import React, { useState, useCallback, useEffect, useReducer, useMemo, memo } from "react"
import { useTranslations } from "next-intl"
import {
  ChevronLeft, Minus, Plus, ArrowRight, Info, Loader2, X, AlertCircle, Check,
  Home, Building2, Building, Hotel, Warehouse, Rows3,
} from "lucide-react"
import { Button }  from "@/components/ui/button"
import { Input }   from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { fmtAmount } from "@/lib/region"
import {
  inferLocationTier, toApiPropertyType, toApiConstructionType,
  PROPERTY_TYPE_IDS,
  type PropertyTypeId, type ConstructionId, type LocationId,
} from "@/lib/building-rates"
import { useSidebar } from "@/components/ui/sidebar"
import {
  fetchBuildingConfig, calculateBuildingCost,
  type BuildingConfigResponse, type BccResponse,
} from "@/lib/api/rate-config"
import {
  fetchPhProvinces, fetchPhCities,
  fetchIdProvinces, fetchIdCities,
  fetchKhProvinces,
  type PhProvince, type IdOption, type KhEntry,
} from "@/lib/address-api"
import { cn } from "@/lib/utils"


type AgeOfBuilding   = "1to10" | "11to20" | "21to30" | "30plus"
type BuildQuality    = "low" | "standard" | "high"
type Topography      = "flat" | "slope"
type SiteSurrounding = "normal" | "confined" | "city-centre"


const AGE_LABELS: Record<AgeOfBuilding, string> = {
  "1to10": "1–10 yrs", "11to20": "11–20 yrs", "21to30": "21–30 yrs", "30plus": "30+ yrs",
}

const QUALITY_LABELS: Record<BuildQuality, { label: string; desc: string }> = {
  low:      { label: "Low",      desc: "Budget construction" },
  standard: { label: "Standard", desc: "Typical residential" },
  high:     { label: "High",     desc: "Premium / custom" },
}

const TOPO_LABELS: Record<Topography, { label: string; desc: string }> = {
  flat:  { label: "Flat",  desc: "Flat land" },
  slope: { label: "Slope", desc: "Sloped / hillside" },
}

const SITE_LABELS: Record<SiteSurrounding, { label: string; desc: string }> = {
  normal:        { label: "Normal",      desc: "Standard access" },
  confined:      { label: "Confined",    desc: "Restricted access" },
  "city-centre": { label: "City Centre", desc: "Premium access costs" },
}

const PROPERTY_TYPE_ICON: Record<PropertyTypeId, React.ElementType> = {
  bungalow: Home, semiDetached: Building2, terrace: Rows3,
  condo: Building, apartment: Hotel, flat: Warehouse,
}

const TIER_BADGE: Record<LocationId, string> = {
  prime: "bg-amber-100 text-amber-700 ring-1 ring-amber-300",
  urban: "bg-blue-100 text-blue-700 ring-1 ring-blue-300",
  rural: "bg-green-100 text-green-700 ring-1 ring-green-300",
}


interface Props {
  onBack:      () => void
  onConfirm:   (total: number) => void
  symbol:      string
  countryCode: string
}


interface FormState {
  propertyType:    PropertyTypeId | ""
  construction:    ConstructionId | ""
  areaRaw:         string
  storeys:         number
  ageOfBuilding:   AgeOfBuilding | ""
  quality:         BuildQuality
  topography:      Topography
  siteSurrounding: SiteSurrounding
  location:        LocationId
  tierAutoSet:     boolean
  provinces:    { value: string; label: string }[]
  cities:       { value: string; label: string }[]
  selProv:      string
  selCity:      string
  selProvName:  string
  selCityName:  string
  loadProv:     boolean
  loadCity:     boolean
  furnitureRaw: string
  featuresRaw:  string
  extRenovRaw:  string
  intRenovRaw:  string
  finishesRaw:  string
}

type FormAction =
  | { type: "SET_PROPERTY_TYPE";    payload: PropertyTypeId }
  | { type: "SET_CONSTRUCTION";     payload: ConstructionId }
  | { type: "SET_AREA_RAW";         payload: string }
  | { type: "SET_STOREYS";          payload: number }
  | { type: "SET_AGE";              payload: AgeOfBuilding }
  | { type: "SET_QUALITY";          payload: BuildQuality }
  | { type: "SET_TOPOGRAPHY";       payload: Topography }
  | { type: "SET_SITE";             payload: SiteSurrounding }
  | { type: "SET_LOCATION";         payload: { loc: LocationId; auto: boolean } }
  | { type: "SET_PROVINCES";        payload: { value: string; label: string }[] }
  | { type: "SET_CITIES";           payload: { value: string; label: string }[] }
  | { type: "SELECT_PROVINCE";      payload: { value: string; label: string } }
  | { type: "SELECT_CITY";          payload: { value: string; label: string } }
  | { type: "SET_LOAD_PROV";        payload: boolean }
  | { type: "SET_LOAD_CITY";        payload: boolean }
  | { type: "SET_FURNITURE_RAW";    payload: string }
  | { type: "SET_FEATURES_RAW";     payload: string }
  | { type: "SET_EXT_RENOV_RAW";    payload: string }
  | { type: "SET_INT_RENOV_RAW";    payload: string }
  | { type: "SET_FINISHES_RAW";     payload: string }

const INITIAL: FormState = {
  propertyType: "", construction: "",
  areaRaw: "", storeys: 0,
  ageOfBuilding: "", quality: "standard",
  topography: "flat", siteSurrounding: "normal",
  location: "urban", tierAutoSet: false,
  provinces: [], cities: [],
  selProv: "", selCity: "", selProvName: "", selCityName: "",
  loadProv: false, loadCity: false,
  furnitureRaw: "", featuresRaw: "", extRenovRaw: "", intRenovRaw: "", finishesRaw: "",
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_PROPERTY_TYPE":    return { ...state, propertyType: action.payload }
    case "SET_CONSTRUCTION":     return { ...state, construction: action.payload }
    case "SET_AREA_RAW":         return { ...state, areaRaw: action.payload }
    case "SET_STOREYS":          return { ...state, storeys: action.payload }
    case "SET_AGE":              return { ...state, ageOfBuilding: action.payload }
    case "SET_QUALITY":          return { ...state, quality: action.payload }
    case "SET_TOPOGRAPHY":       return { ...state, topography: action.payload }
    case "SET_SITE":             return { ...state, siteSurrounding: action.payload }
    case "SET_LOCATION":         return { ...state, location: action.payload.loc, tierAutoSet: action.payload.auto }
    case "SET_PROVINCES":        return { ...state, provinces: action.payload, loadProv: false }
    case "SET_CITIES":           return { ...state, cities: action.payload, loadCity: false }
    case "SELECT_PROVINCE":      return { ...state, selProv: action.payload.value, selProvName: action.payload.label, selCity: "", selCityName: "", cities: [] }
    case "SELECT_CITY":          return { ...state, selCity: action.payload.value, selCityName: action.payload.label }
    case "SET_LOAD_PROV":        return { ...state, loadProv: action.payload }
    case "SET_LOAD_CITY":        return { ...state, loadCity: action.payload }
    case "SET_FURNITURE_RAW":    return { ...state, furnitureRaw: action.payload }
    case "SET_FEATURES_RAW":     return { ...state, featuresRaw: action.payload }
    case "SET_EXT_RENOV_RAW":    return { ...state, extRenovRaw: action.payload }
    case "SET_INT_RENOV_RAW":    return { ...state, intRenovRaw: action.payload }
    case "SET_FINISHES_RAW":     return { ...state, finishesRaw: action.payload }
    default:                     return state
  }
}


const parseAmt         = (raw: string) => parseFloat(raw.replace(/,/g, "")) || 0
const fmtRaw           = (raw: string) => { const n = parseAmt(raw); return n > 0 ? n.toLocaleString("en") : "" }
const stripNonNumeric  = (v: string)   => v.replace(/[^0-9.]/g, "")


const StepBadge = memo(function StepBadge({ n }: { n: number | "+" }) {
  return (
    <span className={cn(
      "inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold flex-shrink-0",
      n === "+" ? "bg-gray-400" : "bg-amber-400",
    )}>
      {n}
    </span>
  )
})

const AreaInput = memo(function AreaInput({
  committedValue, areaUnit, areaMin, areaMax, onCommit,
}: {
  committedValue: string
  areaUnit:       string
  areaMin:        number
  areaMax:        number
  onCommit:       (formatted: string) => void
}) {
  const [local, setLocal] = useState(committedValue)

  useEffect(() => { setLocal(committedValue) }, [committedValue])

  const parsed = parseAmt(local)
  const showError = parsed > 0 && (parsed < areaMin || parsed > areaMax)

  return (
    <div>
      <div className="relative flex-1 max-w-xs">
        <Input
          value={local}
          onChange={(e) => setLocal(stripNonNumeric(e.target.value))}
          onBlur={() => {
            const formatted = fmtRaw(local)
            setLocal(formatted)
            onCommit(formatted)
          }}
          placeholder={`e.g. ${areaUnit === "sqft" ? "1,500" : "150"}`}
          inputMode="decimal"
          className="pr-14 text-right"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9E9E9E] font-medium pointer-events-none">{areaUnit}</span>
      </div>
      {showError && (
        <p className="text-xs text-red-500 mt-1.5">
          Area must be between {areaMin.toLocaleString()} – {areaMax.toLocaleString()} {areaUnit}
        </p>
      )}
    </div>
  )
})

// CostInput — same local-buffer pattern as AreaInput.
// Keystrokes update local state only; the parent reducer is called once on blur.
// With React.memo + stable onCommit ref, only the active input re-renders while typing.
const CostInput = memo(function CostInput({
  label, symbol: sym, committedValue, onCommit,
}: {
  label:          string
  symbol:         string
  committedValue: string
  onCommit:       (formatted: string) => void
}) {
  const [local, setLocal] = useState(committedValue)

  // Sync if parent resets (e.g. clear form)
  useEffect(() => { setLocal(committedValue) }, [committedValue])

  return (
    <div>
      <label className="text-xs font-medium text-[#555555] mb-1.5 block">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#555555] font-medium pointer-events-none select-none">{sym}</span>
        <Input
          value={local}
          onChange={(e) => setLocal(stripNonNumeric(e.target.value))}
          onBlur={() => {
            const formatted = fmtRaw(local)
            setLocal(formatted)
            onCommit(formatted)          // single parent dispatch on blur
          }}
          placeholder="0"
          inputMode="decimal"
          className="pl-8 text-right bg-white border-[#E0E0E0] rounded-lg h-10 text-[#1A1A1A] placeholder:text-[#9E9E9E]"
        />
      </div>
    </div>
  )
})

// BreakdownPanel is the heaviest section (~160 lines of DOM).
// It only needs to re-render when bccResult, config, or symbol changes.
const BreakdownPanel = memo(function BreakdownPanel({
  bccResult, config, symbol, propertyType, construction,
}: {
  bccResult:    BccResponse
  config:       BuildingConfigResponse
  symbol:       string
  propertyType: PropertyTypeId
  construction: ConstructionId
}) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const t = useTranslations("quotation")

  const hasClassification = (
    bccResult.ageFactor !== 1 || bccResult.qualityMultiplier !== 1 ||
    bccResult.topographyFactor !== 1 || bccResult.siteFactor !== 1
  )

  const fmtFactor = (f: number) => {
    if (f === 1) return { label: "× 1.00", cls: "text-[#9E9E9E]" }
    return f > 1
      ? { label: `× ${f.toFixed(2)}`, cls: "text-amber-600" }
      : { label: `× ${f.toFixed(2)}`, cls: "text-green-600" }
  }

  return (
    <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/60 overflow-hidden">
      <div className="bg-amber-100/80 px-5 py-3 border-b border-amber-200">
        <h3 className="font-semibold text-amber-900 text-sm">How your estimate is calculated</h3>
        <p className="text-xs text-amber-700 mt-0.5">Each factor is applied in sequence to arrive at your total rebuilding cost.</p>
      </div>

      <div className="divide-y divide-amber-100">

        {/* Step 1 */}
        <div className="flex items-start justify-between gap-4 px-5 py-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StepBadge n={1} />
              <p className="text-sm font-semibold text-[#1A1A1A]">Base Rate × Area</p>
            </div>
            <p className="text-xs text-[#555555] ml-7">
              {t(`calculator.${propertyType}` as any)} · {t(`calculator.${construction}` as any)} · {bccResult.floorArea.toLocaleString()} {bccResult.areaUnit}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-[#1A1A1A]">{symbol} {fmtAmount(bccResult.rawConstructionCost)}</p>
            <p className="text-xs text-[#9E9E9E]">{symbol} {fmtAmount(bccResult.baseRatePerUnit)} / {bccResult.areaUnit}</p>
          </div>
        </div>

        {/* Step 2 — Classification */}
        {hasClassification && (
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <StepBadge n={2} />
              <p className="text-sm font-semibold text-[#1A1A1A]">Property Classification</p>
            </div>
            <div className="ml-7 space-y-1.5">
              {[
                { label: `Age of building (${AGE_LABELS[bccResult.ageOfBuilding as AgeOfBuilding] ?? bccResult.ageOfBuilding})`, factor: bccResult.ageFactor },
                { label: `Build quality (${QUALITY_LABELS[bccResult.quality as BuildQuality]?.label ?? bccResult.quality})`,      factor: bccResult.qualityMultiplier },
                { label: `Topography (${TOPO_LABELS[bccResult.topography as Topography]?.label ?? bccResult.topography})`,       factor: bccResult.topographyFactor },
                { label: `Site (${SITE_LABELS[bccResult.siteSurrounding as SiteSurrounding]?.label ?? bccResult.siteSurrounding})`, factor: bccResult.siteFactor },
              ].map(({ label, factor }) => {
                const f = fmtFactor(factor)
                return (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-[#555555]">{label}</span>
                    <span className={cn("font-mono font-medium", f.cls)}>{f.label}</span>
                  </div>
                )
              })}
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-amber-100">
                <span className="text-[#555555] font-medium">= Classified Cost</span>
                <span className="font-bold text-[#1A1A1A]">{symbol} {fmtAmount(bccResult.classifiedCost)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Storey Loading */}
        <div className="flex items-start justify-between gap-4 px-5 py-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StepBadge n={hasClassification ? 3 : 2} />
              <p className="text-sm font-semibold text-[#1A1A1A]">Storey Loading</p>
            </div>
            <p className="text-xs text-[#555555] ml-7">
              {bccResult.numberOfStoreys === 1
                ? "Single storey — no surcharge"
                : `${bccResult.numberOfStoreys} storeys · +${((bccResult.numberOfStoreys - 1) * bccResult.storeyIncrementPct * 100).toFixed(0)}% (${(bccResult.storeyIncrementPct * 100).toFixed(0)}% per additional storey)`}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-[#1A1A1A]">+ {symbol} {fmtAmount(bccResult.storeyLoading)}</p>
            <p className="text-xs text-[#9E9E9E]">= {symbol} {fmtAmount(bccResult.storeyAdjustedCost)}</p>
          </div>
        </div>

        {/* Step 4 — Location Multiplier */}
        <div className="flex items-start justify-between gap-4 px-5 py-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StepBadge n={hasClassification ? 4 : 3} />
              <p className="text-sm font-semibold text-[#1A1A1A]">Location Multiplier</p>
            </div>
            <p className="text-xs text-[#555555] ml-7">
              {bccResult.detectedLocationTier.charAt(0).toUpperCase() + bccResult.detectedLocationTier.slice(1)} area
              {" — "}{config.locationTiers[bccResult.detectedLocationTier as LocationId]?.label ?? bccResult.detectedLocationTier}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-[#1A1A1A]">× {bccResult.locationMultiplier.toFixed(2)}</p>
            <p className={cn("text-xs",
              bccResult.locationMultiplier > 1 ? "text-amber-600"
              : bccResult.locationMultiplier < 1 ? "text-green-600" : "text-[#9E9E9E]",
            )}>
              = {symbol} {fmtAmount(bccResult.locationAdjustedCost)}
            </p>
          </div>
        </div>

        {/* Step 5 — Professional Fees */}
        <div className="flex items-start justify-between gap-4 px-5 py-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StepBadge n="+" />
              <p className="text-sm font-semibold text-[#1A1A1A]">
                Professional Fees ({(bccResult.professionalFeeRate * 100).toFixed(0)}%)
              </p>
            </div>
            <p className="text-xs text-[#555555] ml-7">Architect, engineer &amp; project management fees</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-[#1A1A1A]">+ {symbol} {fmtAmount(bccResult.professionalFee)}</p>
            <p className="text-xs text-[#9E9E9E]">{(bccResult.professionalFeeRate * 100).toFixed(0)}% of {symbol} {fmtAmount(bccResult.locationAdjustedCost)}</p>
          </div>
        </div>

        {/* Step 6 — Add-Ons */}
        {bccResult.totalAddOns > 0 && (
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <StepBadge n="+" />
              <p className="text-sm font-semibold text-[#1A1A1A]">Cost Add-Ons</p>
            </div>
            <div className="ml-7 space-y-1.5">
              {[
                { label: "Furniture",             value: bccResult.furnitureCost },
                { label: "Features (lifts + AC)", value: bccResult.featuresCost },
                { label: "External Renovation",   value: bccResult.externalRenovation },
                { label: "Internal Renovation",   value: bccResult.internalRenovation },
                { label: "Improved Finishes",     value: bccResult.improvedFinishes },
              ]
                .filter((item) => item.value > 0)
                .map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-[#555555]">{label}</span>
                    <span className="font-medium text-[#555555]">{symbol} {fmtAmount(value)}</span>
                  </div>
                ))}
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-amber-100">
                <span className="text-[#555555] font-medium">Total Add-Ons</span>
                <span className="font-bold text-[#1A1A1A]">+ {symbol} {fmtAmount(bccResult.totalAddOns)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-amber-100/80">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-600 text-white text-xs font-bold flex-shrink-0">✓</span>
            <p className="font-bold text-amber-900">Total Rebuilding Cost</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-amber-700">{symbol} {fmtAmount(bccResult.totalRebuildingCost)}</p>
            <p className="text-xs text-amber-600">{config.benchmarkYear} benchmark rates</p>
          </div>
        </div>

      </div>
    </div>
  )
  /* eslint-enable @typescript-eslint/no-explicit-any */
})

// StickyBar is isolated so useSidebar() state changes ONLY re-render
// this small component, not the entire 929-line form.
const StickyBar = memo(function StickyBar({
  bccResult, bccLoading, symbol, areaUnit, selProvName, onConfirm,
}: {
  bccResult:   BccResponse | null
  bccLoading:  boolean
  symbol:      string
  areaUnit:    string
  selProvName: string
  onConfirm:   () => void
}) {
  const t = useTranslations("quotation")
  const { state: sidebarState, isMobile } = useSidebar()
  const stickyLeft = isMobile ? "0px" : sidebarState === "expanded" ? "var(--sidebar-width)" : "var(--sidebar-width-icon)"

  return (
    <div
      className="fixed bottom-0 right-0 bg-white border-t border-[#E0E0E0] shadow-2xl z-50 transition-[left] duration-200 ease-linear"
      style={{ left: stickyLeft, willChange: "left" }}
    >
      <div className="max-w-3xl mx-auto px-6 pt-3 pb-4">
        {bccResult && !bccLoading ? (
          <>
            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-[#9E9E9E] mb-0.5">{t("calculator.constructionCost")}</p>
                <p className="text-sm font-semibold text-[#555555]">{symbol} {fmtAmount(bccResult.locationAdjustedCost)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-[#9E9E9E] mb-0.5">{t("calculator.professionalFees")}</p>
                <p className="text-sm font-semibold text-[#555555]">{symbol} {fmtAmount(bccResult.professionalFee)}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-2 ring-1 ring-amber-200">
                <p className="text-xs text-amber-600 mb-0.5 font-medium">{t("calculator.totalRebuilding")}</p>
                <p className="text-sm font-bold text-amber-700">{symbol} {fmtAmount(bccResult.totalRebuildingCost)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-[#9E9E9E] leading-snug max-w-[55%]">{t("calculator.buildingCalcDisclaimer")}</p>
              <Button onClick={onConfirm} className="bg-[#F5A623] hover:bg-[#D4891A] text-white font-semibold h-10 rounded-lg shrink-0 gap-1.5 transition-colors duration-150">
                {t("calculator.buildingCalcConfirm")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[#9E9E9E]">
              {bccLoading ? "Calculating your estimate…"
                : !selProvName ? "Select a province and enter your built-up area to see an estimate."
                : `Enter your built-up area (${areaUnit}) above to see an estimate.`}
            </p>
            <Button disabled className="shrink-0 gap-1.5 opacity-40">
              {bccLoading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              {t("calculator.buildingCalcConfirm")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
})

// ── Main Component ─────────────────────────────────────────────────────────────

export default function BuildingCalculator({ onBack, onConfirm, symbol, countryCode }: Props) {
  const t  = useTranslations("quotation")
  const cc = useMemo(() => countryCode.toUpperCase(), [countryCode])

  // ── Single reducer replaces 30 individual useState calls ──────────────────
  const [form, dispatch] = useReducer(formReducer, INITIAL)

  // ── API state (separate from form — different lifecycle) ──────────────────
  const [config,        setConfig]        = useState<BuildingConfigResponse | null>(null)
  const [configLoading, setConfigLoading] = useState(true)
  const [configError,   setConfigError]   = useState<string | null>(null)
  const [bccResult,     setBccResult]     = useState<BccResponse | null>(null)
  const [bccLoading,    setBccLoading]    = useState(false)
  const [bccError,      setBccError]      = useState<string | null>(null)

  // ── Load config once ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setConfigLoading(true); setConfigError(null)
    fetchBuildingConfig(cc)
      .then((d) => { if (!cancelled) { setConfig(d); setConfigLoading(false) } })
      .catch((e) => { if (!cancelled) { setConfigError(e instanceof Error ? e.message : "Failed to load config"); setConfigLoading(false) } })
    return () => { cancelled = true }
  }, [cc])

  // ── Load provinces once ───────────────────────────────────────────────────
  const hasAddressApi = cc === "PH" || cc === "ID" || cc === "KH"

  useEffect(() => {
    if (!hasAddressApi) return
    dispatch({ type: "SET_LOAD_PROV", payload: true })
    if (cc === "PH") {
      fetchPhProvinces().then((data: PhProvince[]) =>
        dispatch({ type: "SET_PROVINCES", payload: data.map((p) => ({ value: p.code, label: p.name })) }))
    } else if (cc === "ID") {
      fetchIdProvinces().then((data: IdOption[]) =>
        dispatch({ type: "SET_PROVINCES", payload: data.map((p) => ({ value: p.id, label: p.text })) }))
    } else if (cc === "KH") {
      fetchKhProvinces().then((data: KhEntry[]) =>
        dispatch({ type: "SET_PROVINCES", payload: data.map((p) => ({ value: p.id, label: p.name.latin })) }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cc])

  // ── Memoized derived values — only recompute when inputs change ───────────
  const parsedArea      = useMemo(() => parseAmt(form.areaRaw),      [form.areaRaw])
  const parsedFurniture = useMemo(() => parseAmt(form.furnitureRaw), [form.furnitureRaw])
  const parsedFeatures  = useMemo(() => parseAmt(form.featuresRaw),  [form.featuresRaw])
  const parsedExtRenov  = useMemo(() => parseAmt(form.extRenovRaw),  [form.extRenovRaw])
  const parsedIntRenov  = useMemo(() => parseAmt(form.intRenovRaw),  [form.intRenovRaw])
  const parsedFinishes  = useMemo(() => parseAmt(form.finishesRaw),  [form.finishesRaw])

  const maxStoreys = config?.maxStoreys ?? 5
  const areaUnit   = config?.areaUnit   ?? "sqm"

  // For ID: city name gives more specific location match than province
  const provinceForApi = useMemo(
    () => (cc === "ID" && form.selCityName) ? form.selCityName : form.selProvName,
    [cc, form.selCityName, form.selProvName]
  )

  const canCalculate = config !== null && parsedArea > 0 && !!provinceForApi
    && !!form.propertyType && !!form.construction && !!form.ageOfBuilding && form.storeys > 0

  // ── Debounced BCC call (600 ms) ───────────────────────────────────────────
  useEffect(() => {
    if (!canCalculate) { setBccResult(null); setBccError(null); return }
    setBccLoading(true); setBccError(null)

    const timer = setTimeout(async () => {
      try {
        const result = await calculateBuildingCost(cc, {
          propertySubType:    toApiPropertyType(form.propertyType as PropertyTypeId),
          constructionType:   toApiConstructionType(form.construction as ConstructionId),
          floorArea:          parsedArea,
          numberOfStoreys:    form.storeys,
          province:           provinceForApi,
          ageOfBuilding:      form.ageOfBuilding as AgeOfBuilding,
          quality:            form.quality,
          topography:         form.topography,
          siteSurrounding:    form.siteSurrounding,
          furnitureCost:      parsedFurniture  || undefined,
          featuresCost:       parsedFeatures   || undefined,
          externalRenovation: parsedExtRenov   || undefined,
          internalRenovation: parsedIntRenov   || undefined,
          improvedFinishes:   parsedFinishes   || undefined,
        })
        setBccResult(result); setBccError(null)
      } catch (e: unknown) {
        setBccResult(null); setBccError(e instanceof Error ? e.message : "Calculation failed")
      } finally {
        setBccLoading(false)
      }
    }, 600)

    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canCalculate, form.propertyType, form.construction, parsedArea, form.storeys, provinceForApi,
    form.ageOfBuilding, form.quality, form.topography, form.siteSurrounding,
    parsedFurniture, parsedFeatures, parsedExtRenov, parsedIntRenov, parsedFinishes, cc,
  ])

  // ── Stable event handlers (useCallback) ───────────────────────────────────
  // These are passed as props to memoized children. Without useCallback they'd
  // be new function references every render, defeating React.memo entirely.

  const handleProvince = useCallback(async (value: string) => {
    const prov = form.provinces.find((p) => p.value === value)
    dispatch({ type: "SELECT_PROVINCE", payload: { value, label: prov?.label ?? "" } })
    setBccResult(null)
    if (config && prov) dispatch({ type: "SET_LOCATION", payload: { loc: inferLocationTier(prov.label, config.locationTiers), auto: true } })
    if (cc === "ID") {
      dispatch({ type: "SET_LOAD_CITY", payload: true })
      const data = await fetchIdCities(value)
      dispatch({ type: "SET_CITIES", payload: data.map((c: IdOption) => ({ value: c.id, label: c.text })) })
    }
    if (cc === "PH") {
      dispatch({ type: "SET_LOAD_CITY", payload: true })
      const data = await fetchPhCities(value)
      dispatch({ type: "SET_CITIES", payload: data.map((c) => ({ value: c.code, label: `${c.name} (${c.type})` })) })
    }
  }, [form.provinces, cc, config])

  const handleCity = useCallback((value: string) => {
    const city = form.cities.find((c) => c.value === value)
    dispatch({ type: "SELECT_CITY", payload: { value, label: city?.label ?? "" } })
    setBccResult(null)
    if (cc === "ID" && city && config) dispatch({ type: "SET_LOCATION", payload: { loc: inferLocationTier(city.label, config.locationTiers), auto: true } })
  }, [form.cities, cc, config])

  const handleManualTier = useCallback((tier: LocationId) => {
    dispatch({ type: "SET_LOCATION", payload: { loc: tier, auto: false } })
  }, [])

  const handleStoreys = useCallback((delta: number) => {
    dispatch({ type: "SET_STOREYS", payload: Math.min(Math.max(form.storeys + delta, 1), maxStoreys) })
  }, [form.storeys, maxStoreys])

  const handleConfirm = useCallback(() => {
    if (bccResult) onConfirm(bccResult.totalRebuildingCost)
  }, [bccResult, onConfirm])

  // All input commit callbacks — called once on blur, not on every keystroke.
  // Stable refs (empty deps) because CostInput/AreaInput hold their own local state.
  const onAreaCommit      = useCallback((v: string) => dispatch({ type: "SET_AREA_RAW",      payload: v }), [])
  const onFurnitureCommit = useCallback((v: string) => dispatch({ type: "SET_FURNITURE_RAW", payload: v }), [])
  const onFeaturesCommit  = useCallback((v: string) => dispatch({ type: "SET_FEATURES_RAW",  payload: v }), [])
  const onExtRenovCommit  = useCallback((v: string) => dispatch({ type: "SET_EXT_RENOV_RAW", payload: v }), [])
  const onIntRenovCommit  = useCallback((v: string) => dispatch({ type: "SET_INT_RENOV_RAW", payload: v }), [])
  const onFinishesCommit  = useCallback((v: string) => dispatch({ type: "SET_FINISHES_RAW",  payload: v }), [])

  // ── Display helpers ────────────────────────────────────────────────────────
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const propLabel = useCallback((id: PropertyTypeId) => t(`calculator.${id}` as any), [t])
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const tierLabel    = useCallback((loc: LocationId) => config?.locationTiers[loc].label ?? (loc.charAt(0).toUpperCase() + loc.slice(1)), [config])
  const tierPctLabel = useCallback((loc: LocationId) => {
    const m = config?.locationTiers[loc].multiplier
    if (!m || m === 1) return "Base rate"
    return m > 1 ? `+${((m - 1) * 100).toFixed(0)}%` : `−${((1 - m) * 100).toFixed(0)}%`
  }, [config])

  // ── Loading / error states ─────────────────────────────────────────────────

  if (configLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 pb-56">
        <div className="h-44 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 animate-pulse" />
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-xl bg-[#E0E0E0] animate-pulse" />)}
      </div>
    )
  }

  if (configError || !config) {
    return (
      <div className="max-w-4xl mx-auto pb-56">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#555555] hover:text-[#555555] text-sm mb-6">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Failed to load calculator</p>
            <p className="text-xs text-red-600 mt-0.5">{configError}</p>
          </div>
        </div>
      </div>
    )
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto pb-56">

      {/* ── Hero header ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-amber-100 hover:text-white text-sm transition-colors" aria-label="Back">
            <ChevronLeft className="h-4 w-4" />
            <span>{t("calculator.buildingCalcBack")}</span>
          </button>
          <button onClick={onBack} className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors" aria-label="Exit calculator">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-1">{t("calculator.buildingCalcTitle")}</h1>
        <p className="text-amber-100 text-sm leading-relaxed">{t("calculator.buildingCalcDesc")}</p>
        <div className="mt-4 inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
          <Info className="h-3.5 w-3.5 text-amber-100 shrink-0" />
          <span className="text-xs text-amber-100">
            {t("calculator.buildingCalcNote", { year: config.benchmarkYear, unit: config.areaUnit })}
          </span>
        </div>
      </div>

      <div className="space-y-6">

        {/* ── 1. Property Type ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#555555] mb-3">
            {t("calculator.buildingCalcPropertyType")}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PROPERTY_TYPE_IDS.map((id) => {
              const Icon     = PROPERTY_TYPE_ICON[id]
              const isActive = form.propertyType === id
              return (
                <button key={id} type="button" onClick={() => dispatch({ type: "SET_PROPERTY_TYPE", payload: id })}
                  className={cn(
                    "relative flex flex-col items-center gap-2 rounded-xl p-3 transition-colors duration-150",
                    isActive
                      ? "bg-[#E6F7EE] border-2 border-[#00A651] shadow-sm"
                      : "bg-white border-[1.5px] border-[#E0E0E0] hover:border-[#F5A623] hover:bg-[#FEF3DC] hover:shadow-md active:border-[#9E9E9E]",
                  )}
                >
                  {isActive && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#00A651] flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                  <Icon className={cn("h-6 w-6", isActive ? "text-[#00A651]" : "text-[#F5A623]")} />
                  <span className={cn("text-xs font-medium text-center leading-tight", isActive ? "text-[#00A651]" : "text-[#555555]")}>
                    {propLabel(id)}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 2. Construction Type ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#555555] mb-3">
            {t("calculator.buildingCalcConstruction")}
          </h2>
          <div className="grid grid-cols-2 bg-[#F5F5F5] rounded-lg p-1 gap-1">
            {(["fullBrick", "partialBrick"] as ConstructionId[]).map((id) => (
              <button key={id} type="button" onClick={() => dispatch({ type: "SET_CONSTRUCTION", payload: id })}
                className={cn("rounded-md py-2.5 px-4 text-sm font-medium transition-colors duration-150",
                  form.construction === id
                    ? "bg-[#333331] text-white shadow-sm"
                    : "bg-transparent text-[#1A1A1A] hover:bg-[#FEF3DC] hover:text-[#D4891A] active:bg-[#E0E0E0] active:text-[#1A1A1A]",
                )}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {t(`calculator.${id}` as any)}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#555555] mt-2">
            {form.construction === "fullBrick" ? "Brick / Reinforced concrete — higher durability"
              : form.construction === "partialBrick" ? "Timber / Mixed materials — lighter construction"
              : "Select a construction type"}
          </p>
        </section>

        {/* ── 3. Built-Up Area ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#555555] mb-3">
            {t("calculator.buildingCalcArea")}
          </h2>
          {/* AreaInput buffers keystrokes locally — parent only re-renders on blur */}
          <AreaInput
            committedValue={form.areaRaw}
            areaUnit={areaUnit}
            areaMin={config.areaMin}
            areaMax={config.areaMax}
            onCommit={onAreaCommit}
          />
        </section>

        {/* ── 4. Number of Storeys ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#555555] mb-3">
            {t("calculator.buildingCalcStoreys")}
          </h2>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => handleStoreys(-1)} disabled={form.storeys <= 1}
              className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-[#555555] hover:border-amber-400 hover:text-amber-600 active:border-[#9E9E9E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="text-center min-w-[4rem]">
              <span className="text-3xl font-bold text-[#1A1A1A]">{form.storeys > 0 ? form.storeys : "–"}</span>
              <span className="text-sm text-[#555555] ml-1.5">{t("calculator.storeysSuffix")}</span>
            </div>
            <button type="button" onClick={() => handleStoreys(1)} disabled={form.storeys >= maxStoreys}
              className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-[#555555] hover:border-amber-400 hover:text-amber-600 active:border-[#9E9E9E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
            {form.storeys > 1 && (
              <span className="text-xs text-amber-600 font-medium">
                +{((form.storeys - 1) * config.storeyIncrementPct * 100).toFixed(0)}% storey surcharge
              </span>
            )}
          </div>
        </section>

        {/* ── 5. Age of Building ───────────────────────────────────────────── */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#555555] mb-3">Age of Building</h2>
          <div className="grid grid-cols-4 bg-[#F5F5F5] rounded-lg p-1 gap-1">
            {(Object.keys(AGE_LABELS) as AgeOfBuilding[]).map((age) => (
              <button key={age} type="button" onClick={() => dispatch({ type: "SET_AGE", payload: age })}
                className={cn("rounded-md py-2.5 px-2 text-sm font-medium text-center transition-colors duration-150",
                  form.ageOfBuilding === age
                    ? "bg-[#333331] text-white shadow-sm"
                    : "bg-transparent text-[#1A1A1A] hover:bg-[#FEF3DC] hover:text-[#D4891A] active:bg-[#E0E0E0] active:text-[#1A1A1A]",
                )}
              >
                {AGE_LABELS[age]}
              </button>
            ))}
          </div>
        </section>

        {/* ── 6. Build Quality ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#555555] mb-3">Build Quality</h2>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(QUALITY_LABELS) as BuildQuality[]).map((q) => {
              const meta = QUALITY_LABELS[q]; const isActive = form.quality === q
              return (
                <button key={q} type="button" onClick={() => dispatch({ type: "SET_QUALITY", payload: q })}
                  className={cn("rounded-xl border-[1.5px] p-3 text-left transition-colors duration-150",
                    isActive
                      ? "bg-[#333331] border-[#333331]"
                      : "bg-white border-[#E0E0E0] hover:border-[#F5A623] hover:bg-[#FEF3DC] hover:shadow-md active:border-[#9E9E9E]",
                  )}
                >
                  <p className={cn("text-sm font-semibold", isActive ? "text-white" : "text-[#1A1A1A]")}>{meta.label}</p>
                  <p className={cn("text-xs mt-0.5", isActive ? "text-white/70" : "text-[#555555]")}>{meta.desc}</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 7. Topography ────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#555555] mb-3">Topography</h2>
          <div className="grid grid-cols-2 bg-[#F5F5F5] rounded-lg p-1 gap-1">
            {(Object.keys(TOPO_LABELS) as Topography[]).map((topo) => {
              const meta = TOPO_LABELS[topo]; const isActive = form.topography === topo
              return (
                <button key={topo} type="button" onClick={() => dispatch({ type: "SET_TOPOGRAPHY", payload: topo })}
                  className={cn("rounded-md py-2.5 px-3 text-left transition-colors duration-150",
                    isActive ? "bg-[#333331] shadow-sm" : "bg-transparent hover:bg-[#FEF3DC] active:bg-[#E0E0E0]",
                  )}
                >
                  <p className={cn("text-sm font-semibold", isActive ? "text-white" : "text-[#1A1A1A]")}>{meta.label}</p>
                  <p className={cn("text-xs mt-0.5", isActive ? "text-white/70" : "text-[#555555]")}>{meta.desc}</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 8. Site Surrounding ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#555555] mb-3">Site Surrounding</h2>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(SITE_LABELS) as SiteSurrounding[]).map((site) => {
              const meta = SITE_LABELS[site]; const isActive = form.siteSurrounding === site
              return (
                <button key={site} type="button" onClick={() => dispatch({ type: "SET_SITE", payload: site })}
                  className={cn("rounded-xl border-[1.5px] p-3 text-left transition-colors duration-150",
                    isActive
                      ? "bg-[#333331] border-[#333331]"
                      : "bg-white border-[#E0E0E0] hover:border-[#F5A623] hover:bg-[#FEF3DC] hover:shadow-md active:border-[#9E9E9E]",
                  )}
                >
                  <p className={cn("text-sm font-semibold", isActive ? "text-white" : "text-[#1A1A1A]")}>{meta.label}</p>
                  <p className={cn("text-xs mt-0.5", isActive ? "text-white/70" : "text-[#555555]")}>{meta.desc}</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 9. Location ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[#555555] mb-3">
            {t("calculator.buildingCalcLocation")}
          </h2>

          {hasAddressApi && (
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Select value={form.selProv} onValueChange={handleProvince} disabled={form.loadProv}>
                  <SelectTrigger className={cn("w-full", form.loadProv && "text-[#9E9E9E]")}>
                    <SelectValue placeholder={form.loadProv ? "Loading provinces…" : "Select province / state"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 overflow-y-auto">
                    {form.provinces.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {form.loadProv && <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-[#9E9E9E] pointer-events-none" />}
              </div>

              {(cc === "PH" || cc === "ID") && form.selProv && (
                <div className="relative">
                  <Select value={form.selCity} onValueChange={handleCity} disabled={form.loadCity || !form.selProv}>
                    <SelectTrigger className={cn("w-full", form.loadCity && "text-[#9E9E9E]")}>
                      <SelectValue placeholder={form.loadCity ? "Loading cities…" : cc === "ID" ? "Select kab / kota (optional)" : "Select city / municipality (optional)"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 overflow-y-auto">
                      {form.cities.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {form.loadCity && <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-[#9E9E9E] pointer-events-none" />}
                </div>
              )}

              {form.selProvName && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-[#555555]">Rate tier:</span>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", TIER_BADGE[form.location])}>
                    {tierLabel(form.location)} · {tierPctLabel(form.location)}
                  </span>
                  <span className="text-xs text-[#555555] truncate max-w-[200px]">for {form.selCityName || form.selProvName}</span>
                  {form.tierAutoSet && <span className="text-xs text-[#555555] italic">— auto-detected</span>}
                </div>
              )}
            </div>
          )}

          <div className={cn("grid gap-2", hasAddressApi ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3")}>
            {(["prime", "urban", "rural"] as LocationId[]).map((loc) => {
              const isActive = form.location === loc
              return (
                <button key={loc} type="button" onClick={() => handleManualTier(loc)}
                  className={cn("rounded-xl border-[1.5px] text-left transition-colors duration-150", hasAddressApi ? "p-2.5" : "p-4",
                    isActive ? "bg-[#333331] border-[#333331]" : "bg-white border-[#E0E0E0] hover:border-[#F5A623] hover:bg-[#FEF3DC] hover:shadow-md active:border-[#9E9E9E]",
                  )}
                >
                  <p className={cn("font-semibold leading-snug", hasAddressApi ? "text-xs" : "text-sm", isActive ? "text-white" : "text-[#1A1A1A]")}>
                    {hasAddressApi ? loc.charAt(0).toUpperCase() + loc.slice(1) : tierLabel(loc)}
                  </p>
                  <p className={cn("font-medium mt-0.5 text-xs", isActive ? "text-white/70" : "text-[#555555]")}>{tierPctLabel(loc)}</p>
                  {!hasAddressApi && <p className={cn("text-xs mt-1 leading-snug", isActive ? "text-white/60" : "text-[#555555]")}>{tierLabel(loc)}</p>}
                </button>
              )
            })}
          </div>
          {hasAddressApi && <p className="text-xs text-[#555555] mt-2">Province auto-selects the rate tier. Tap a button above to override.</p>}
        </section>

        {/* ── 10. Cost Add-Ons ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1">
            Cost Add-Ons{" "}<span className="normal-case font-normal text-[#555555]">(optional)</span>
          </h2>
          <p className="text-xs text-[#555555] mb-4">Include any additional costs to arrive at a complete rebuilding estimate.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CostInput label="Furniture"              symbol={symbol} committedValue={form.furnitureRaw} onCommit={onFurnitureCommit} />
            <CostInput label="Features (lifts + AC)"  symbol={symbol} committedValue={form.featuresRaw}  onCommit={onFeaturesCommit} />
            <CostInput label="External Renovation"    symbol={symbol} committedValue={form.extRenovRaw}  onCommit={onExtRenovCommit} />
            <CostInput label="Internal Renovation"    symbol={symbol} committedValue={form.intRenovRaw}  onCommit={onIntRenovCommit} />
            <CostInput label="Improved Finishes"      symbol={symbol} committedValue={form.finishesRaw}  onCommit={onFinishesCommit} />
          </div>
        </section>

      </div>

      {/* ── Province prompt ──────────────────────────────────────────────────── */}
      {!form.selProvName && parsedArea > 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-[#E0E0E0] bg-[#FAFAFA] px-5 py-6 text-center">
          <p className="text-sm text-[#555555]">Select a province above to calculate your rebuilding cost.</p>
        </div>
      )}

      {/* ── BCC loading ──────────────────────────────────────────────────────── */}
      {bccLoading && (
        <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50/40 px-5 py-10 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
          <p className="text-sm text-amber-600 font-medium">Calculating…</p>
        </div>
      )}

      {/* ── BCC error ────────────────────────────────────────────────────────── */}
      {bccError && !bccLoading && (
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{bccError}</p>
        </div>
      )}

      {/* ── Breakdown panel — memoized, only re-renders when bccResult changes ── */}
      {bccResult && !bccLoading && (
        <BreakdownPanel
          bccResult={bccResult}
          config={config}
          symbol={symbol}
          propertyType={form.propertyType as PropertyTypeId}
          construction={form.construction as ConstructionId}
        />
      )}

      {/* ── Sticky bottom bar — isolated component (useSidebar lives here only) ── */}
      <StickyBar
        bccResult={bccResult}
        bccLoading={bccLoading}
        symbol={symbol}
        areaUnit={areaUnit}
        selProvName={form.selProvName}
        onConfirm={handleConfirm}
      />

    </div>
  )
}
