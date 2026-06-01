"use client"

import { useState, useCallback, useEffect } from "react"
import { useTranslations } from "next-intl"
import { ChevronLeft, Minus, Plus, ArrowRight, Info, Loader2, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input }  from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fmtAmount } from "@/lib/region"
import {
  inferLocationTier,
  toApiPropertyType,
  toApiConstructionType,
  PROPERTY_TYPE_IDS,
  PROPERTY_TYPE_EMOJI,
  type PropertyTypeId,
  type ConstructionId,
  type LocationId,
} from "@/lib/building-rates"
import {
  fetchBuildingConfig,
  calculateBuildingCost,
  type BuildingConfigResponse,
  type BccResponse,
} from "@/lib/api/rate-config"
import {
  fetchPhProvinces, fetchPhCities,
  fetchIdProvinces, fetchIdCities,
  fetchKhProvinces,
  type PhProvince,
  type IdOption,
  type KhEntry,
} from "@/lib/address-api"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────

type AgeOfBuilding    = "1to10" | "11to20" | "21to30" | "30plus"
type BuildQuality     = "low" | "standard" | "high"
type Topography       = "flat" | "slope"
type SiteSurrounding  = "normal" | "confined" | "city-centre"

// ── Display maps ──────────────────────────────────────────────────────────────

const AGE_LABELS: Record<AgeOfBuilding, string> = {
  "1to10":  "1–10 yrs",
  "11to20": "11–20 yrs",
  "21to30": "21–30 yrs",
  "30plus": "30+ yrs",
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
  normal:       { label: "Normal",      desc: "Standard access" },
  confined:     { label: "Confined",    desc: "Restricted access" },
  "city-centre":{ label: "City Centre", desc: "Premium access costs" },
}

// ── Property colours ──────────────────────────────────────────────────────────

const PROPERTY_COLORS: Record<PropertyTypeId, { ring: string; bg: string; text: string }> = {
  bungalow:     { ring: "ring-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700" },
  semiDetached: { ring: "ring-blue-400",    bg: "bg-blue-50",    text: "text-blue-700"    },
  terrace:      { ring: "ring-violet-400",  bg: "bg-violet-50",  text: "text-violet-700"  },
  condo:        { ring: "ring-amber-400",   bg: "bg-amber-50",   text: "text-amber-700"   },
  apartment:    { ring: "ring-rose-400",    bg: "bg-rose-50",    text: "text-rose-700"    },
  flat:         { ring: "ring-slate-400",   bg: "bg-slate-50",   text: "text-slate-700"   },
}

const TIER_BADGE: Record<LocationId, string> = {
  prime: "bg-amber-100 text-amber-700 ring-1 ring-amber-300",
  urban: "bg-blue-100 text-blue-700 ring-1 ring-blue-300",
  rural: "bg-green-100 text-green-700 ring-1 ring-green-300",
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  onBack:      () => void
  onConfirm:   (total: number) => void
  symbol:      string
  countryCode: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const parseAmt = (raw: string) => parseFloat(raw.replace(/,/g, "")) || 0
const fmtRaw   = (raw: string) => {
  const n = parseAmt(raw)
  return n > 0 ? n.toLocaleString("en") : ""
}
const stripNonNumeric = (v: string) => v.replace(/[^0-9.]/g, "")

function StepBadge({ n }: { n: number | "+" }) {
  return (
    <span className={cn(
      "inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold flex-shrink-0",
      n === "+" ? "bg-gray-400" : "bg-amber-400",
    )}>
      {n}
    </span>
  )
}

function CostInput({
  label, symbol: sym, raw,
  onChange, onBlur,
}: {
  label: string; symbol: string; raw: string
  onChange: (v: string) => void; onBlur: () => void
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1.5 block">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">{sym}</span>
        <Input
          value={raw}
          onChange={(e) => onChange(stripNonNumeric(e.target.value))}
          onBlur={onBlur}
          placeholder="0"
          inputMode="decimal"
          className="pl-8 text-right"
        />
      </div>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BuildingCalculator({ onBack, onConfirm, symbol, countryCode }: Props) {
  const t  = useTranslations("quotation")
  const cc = countryCode.toUpperCase()

  // ── API config ─────────────────────────────────────────────────────────────
  const [config,        setConfig]        = useState<BuildingConfigResponse | null>(null)
  const [configLoading, setConfigLoading] = useState(true)
  const [configError,   setConfigError]   = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setConfigLoading(true); setConfigError(null)
    fetchBuildingConfig(cc)
      .then((d) => { if (!cancelled) { setConfig(d); setConfigLoading(false) } })
      .catch((e) => { if (!cancelled) { setConfigError(e instanceof Error ? e.message : "Failed to load config"); setConfigLoading(false) } })
    return () => { cancelled = true }
  }, [cc])

  // ── Core form state ────────────────────────────────────────────────────────
  const [propertyType, setPropertyType] = useState<PropertyTypeId>("bungalow")
  const [construction, setConstruction] = useState<ConstructionId>("fullBrick")
  const [areaRaw,      setAreaRaw]      = useState("")
  const [storeys,      setStoreys]      = useState(1)

  // Classification
  const [ageOfBuilding,   setAgeOfBuilding]   = useState<AgeOfBuilding>("1to10")
  const [quality,         setQuality]         = useState<BuildQuality>("standard")
  const [topography,      setTopography]      = useState<Topography>("flat")
  const [siteSurrounding, setSiteSurrounding] = useState<SiteSurrounding>("normal")

  // Province / city state
  const [provinces,   setProvinces]   = useState<{ value: string; label: string }[]>([])
  const [cities,      setCities]      = useState<{ value: string; label: string }[]>([])
  const [selProv,     setSelProv]     = useState("")
  const [selCity,     setSelCity]     = useState("")
  const [loadProv,    setLoadProv]    = useState(false)
  const [loadCity,    setLoadCity]    = useState(false)
  const [selProvName, setSelProvName] = useState("")
  const [selCityName, setSelCityName] = useState("")

  const hasAddressApi = cc === "PH" || cc === "ID" || cc === "KH"

  // Inferred tier (instant badge — not used in the actual API call)
  const [location,    setLocation]    = useState<LocationId>("urban")
  const [tierAutoSet, setTierAutoSet] = useState(false)

  // Cost add-ons (five separate inputs)
  const [furnitureRaw, setFurnitureRaw] = useState("")
  const [featuresRaw,  setFeaturesRaw]  = useState("")
  const [extRenovRaw,  setExtRenovRaw]  = useState("")
  const [intRenovRaw,  setIntRenovRaw]  = useState("")
  const [finishesRaw,  setFinishesRaw]  = useState("")

  // BCC result
  const [bccResult,  setBccResult]  = useState<BccResponse | null>(null)
  const [bccLoading, setBccLoading] = useState(false)
  const [bccError,   setBccError]   = useState<string | null>(null)

  // ── Load provinces on mount ────────────────────────────────────────────────
  useEffect(() => {
    if (!hasAddressApi) return
    setLoadProv(true)
    if (cc === "PH") {
      fetchPhProvinces().then((data: PhProvince[]) => {
        setProvinces(data.map((p) => ({ value: p.code, label: p.name }))); setLoadProv(false)
      })
    } else if (cc === "ID") {
      fetchIdProvinces().then((data: IdOption[]) => {
        setProvinces(data.map((p) => ({ value: p.id, label: p.text }))); setLoadProv(false)
      })
    } else if (cc === "KH") {
      fetchKhProvinces().then((data: KhEntry[]) => {
        setProvinces(data.map((p) => ({ value: p.id, label: p.name.latin }))); setLoadProv(false)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cc])

  // ── Derived values ─────────────────────────────────────────────────────────
  const parsedArea     = parseAmt(areaRaw)
  const parsedFurniture = parseAmt(furnitureRaw)
  const parsedFeatures  = parseAmt(featuresRaw)
  const parsedExtRenov  = parseAmt(extRenovRaw)
  const parsedIntRenov  = parseAmt(intRenovRaw)
  const parsedFinishes  = parseAmt(finishesRaw)

  const maxStoreys = config?.maxStoreys ?? 5
  const areaUnit   = config?.areaUnit   ?? "sqm"

  // For ID: city name gives a more specific location match than province
  const provinceForApi = (cc === "ID" && selCityName) ? selCityName : selProvName
  const canCalculate   = config !== null && parsedArea > 0 && !!provinceForApi

  // ── Debounced BCC call (600 ms) ────────────────────────────────────────────
  useEffect(() => {
    if (!canCalculate) { setBccResult(null); setBccError(null); return }
    setBccLoading(true); setBccError(null)

    const timer = setTimeout(async () => {
      try {
        const result = await calculateBuildingCost(cc, {
          propertySubType:  toApiPropertyType(propertyType),
          constructionType: toApiConstructionType(construction),
          floorArea:        parsedArea,
          numberOfStoreys:  storeys,
          province:         provinceForApi,
          ageOfBuilding,
          quality,
          topography,
          siteSurrounding,
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
    canCalculate, propertyType, construction, parsedArea, storeys, provinceForApi,
    ageOfBuilding, quality, topography, siteSurrounding,
    parsedFurniture, parsedFeatures, parsedExtRenov, parsedIntRenov, parsedFinishes,
    cc,
  ])

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleProvince = useCallback(async (value: string) => {
    const prov = provinces.find((p) => p.value === value)
    setSelProv(value); setSelProvName(prov?.label ?? "")
    setSelCity(""); setSelCityName(""); setCities([]); setBccResult(null)
    if (config && prov) { setLocation(inferLocationTier(prov.label, config.locationTiers)); setTierAutoSet(true) }
    if (cc === "ID") {
      setLoadCity(true)
      const data = await fetchIdCities(value)
      setCities(data.map((c: IdOption) => ({ value: c.id, label: c.text }))); setLoadCity(false)
    }
    if (cc === "PH") {
      setLoadCity(true)
      const data = await fetchPhCities(value)
      setCities(data.map((c) => ({ value: c.code, label: `${c.name} (${c.type})` }))); setLoadCity(false)
    }
  }, [provinces, cc, config])

  const handleCity = useCallback((value: string) => {
    const city = cities.find((c) => c.value === value)
    setSelCity(value); setSelCityName(city?.label ?? ""); setBccResult(null)
    if (cc === "ID" && city && config) setLocation(inferLocationTier(city.label, config.locationTiers))
  }, [cities, cc, config])

  const handleManualTier = useCallback((tier: LocationId) => {
    setLocation(tier); setTierAutoSet(false)
  }, [])

  const handleStoreys = useCallback((delta: number) => {
    setStoreys((prev) => Math.min(Math.max(prev + delta, 1), maxStoreys))
  }, [maxStoreys])

  const handleConfirm = useCallback(() => {
    if (bccResult) onConfirm(bccResult.totalRebuildingCost)
  }, [bccResult, onConfirm])

  // ── Display helpers ─────────────────────────────────────────────────────────

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const propLabel = (id: PropertyTypeId) => t(`calculator.${id}` as any)
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const tierLabel    = (loc: LocationId) => config?.locationTiers[loc].label ?? (loc.charAt(0).toUpperCase() + loc.slice(1))
  const tierPctLabel = (loc: LocationId) => {
    const m = config?.locationTiers[loc].multiplier
    if (!m || m === 1) return "Base rate"
    return m > 1 ? `+${((m - 1) * 100).toFixed(0)}%` : `−${((1 - m) * 100).toFixed(0)}%`
  }

  const fmtFactor = (f: number) => {
    if (f === 1) return { label: "× 1.00", cls: "text-gray-400" }
    return f > 1
      ? { label: `× ${f.toFixed(2)}`, cls: "text-amber-600" }
      : { label: `× ${f.toFixed(2)}`, cls: "text-green-600" }
  }

  // ── Loading / error ─────────────────────────────────────────────────────────

  if (configLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 pb-56">
        <div className="h-44 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 animate-pulse" />
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />)}
      </div>
    )
  }

  if (configError || !config) {
    return (
      <div className="max-w-4xl mx-auto pb-56">
        <button onClick={onBack} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-6">
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

  // ── Classification adjustment factors (used in breakdown) ──────────────────
  const hasClassification = bccResult && (
    bccResult.ageFactor !== 1 ||
    bccResult.qualityMultiplier !== 1 ||
    bccResult.topographyFactor !== 1 ||
    bccResult.siteFactor !== 1
  )

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto pb-56">

      {/* ── Hero header ─────────────────────────────────────────────────── */}
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

        {/* ── 1. Property Type ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {t("calculator.buildingCalcPropertyType")}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PROPERTY_TYPE_IDS.map((id) => {
              const colors = PROPERTY_COLORS[id]; const isActive = propertyType === id
              return (
                <button key={id} type="button" onClick={() => setPropertyType(id)}
                  className={cn("flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all",
                    isActive ? `${colors.bg} ring-2 ${colors.ring} border-transparent` : "border-gray-200 hover:border-gray-300 bg-white",
                  )}
                >
                  <span className="text-2xl">{PROPERTY_TYPE_EMOJI[id]}</span>
                  <span className={cn("text-xs font-medium text-center leading-tight", isActive ? colors.text : "text-gray-600")}>
                    {propLabel(id)}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 2. Construction Type ─────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {t("calculator.buildingCalcConstruction")}
          </h2>
          <div className="flex gap-3">
            {(["fullBrick", "partialBrick"] as ConstructionId[]).map((id) => (
              <button key={id} type="button" onClick={() => setConstruction(id)}
                className={cn("flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all",
                  construction === id ? "bg-amber-50 border-amber-400 text-amber-700 ring-2 ring-amber-300" : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white",
                )}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {t(`calculator.${id}` as any)}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {construction === "fullBrick" ? "Brick / Reinforced concrete — higher durability" : "Timber / Mixed materials — lighter construction"}
          </p>
        </section>

        {/* ── 3. Built-Up Area ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {t("calculator.buildingCalcArea")}
          </h2>
          <div className="relative flex-1 max-w-xs">
            <Input
              value={areaRaw}
              onChange={(e) => setAreaRaw(stripNonNumeric(e.target.value))}
              onBlur={() => setAreaRaw(fmtRaw(areaRaw))}
              placeholder={`e.g. ${areaUnit === "sqft" ? "1,500" : "150"}`}
              inputMode="decimal"
              className="pr-14 text-right"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">{areaUnit}</span>
          </div>
          {parsedArea > 0 && (parsedArea < config.areaMin || parsedArea > config.areaMax) && (
            <p className="text-xs text-red-500 mt-1.5">
              Area must be between {config.areaMin.toLocaleString()} – {config.areaMax.toLocaleString()} {areaUnit}
            </p>
          )}
        </section>

        {/* ── 4. Number of Storeys ─────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {t("calculator.buildingCalcStoreys")}
          </h2>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => handleStoreys(-1)} disabled={storeys <= 1}
              className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-amber-400 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="text-center min-w-[4rem]">
              <span className="text-3xl font-bold text-gray-800">{storeys}</span>
              <span className="text-sm text-gray-500 ml-1.5">{t("calculator.storeysSuffix")}</span>
            </div>
            <button type="button" onClick={() => handleStoreys(1)} disabled={storeys >= maxStoreys}
              className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-amber-400 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
            {storeys > 1 && (
              <span className="text-xs text-amber-600 font-medium">
                +{((storeys - 1) * config.storeyIncrementPct * 100).toFixed(0)}% storey surcharge
              </span>
            )}
          </div>
        </section>

        {/* ── 5. Age of Building ───────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Age of Building</h2>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(AGE_LABELS) as AgeOfBuilding[]).map((age) => (
              <button key={age} type="button" onClick={() => setAgeOfBuilding(age)}
                className={cn("py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all",
                  ageOfBuilding === age ? "bg-amber-50 border-amber-400 text-amber-700 ring-2 ring-amber-300" : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white",
                )}
              >
                {AGE_LABELS[age]}
              </button>
            ))}
          </div>
        </section>

        {/* ── 6. Build Quality ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Build Quality</h2>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(QUALITY_LABELS) as BuildQuality[]).map((q) => {
              const meta = QUALITY_LABELS[q]; const isActive = quality === q
              return (
                <button key={q} type="button" onClick={() => setQuality(q)}
                  className={cn("rounded-xl border-2 p-3 text-left transition-all",
                    isActive ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300" : "border-gray-200 hover:border-gray-300 bg-white",
                  )}
                >
                  <p className={cn("text-sm font-semibold", isActive ? "text-amber-800" : "text-gray-700")}>{meta.label}</p>
                  <p className={cn("text-xs mt-0.5", isActive ? "text-amber-600" : "text-gray-400")}>{meta.desc}</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 7. Topography ────────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Topography</h2>
          <div className="flex gap-3">
            {(Object.keys(TOPO_LABELS) as Topography[]).map((topo) => {
              const meta = TOPO_LABELS[topo]; const isActive = topography === topo
              return (
                <button key={topo} type="button" onClick={() => setTopography(topo)}
                  className={cn("flex-1 rounded-xl border-2 p-3 text-left transition-all",
                    isActive ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300" : "border-gray-200 hover:border-gray-300 bg-white",
                  )}
                >
                  <p className={cn("text-sm font-semibold", isActive ? "text-amber-800" : "text-gray-700")}>{meta.label}</p>
                  <p className={cn("text-xs mt-0.5", isActive ? "text-amber-600" : "text-gray-400")}>{meta.desc}</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 8. Site Surrounding ──────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Site Surrounding</h2>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(SITE_LABELS) as SiteSurrounding[]).map((site) => {
              const meta = SITE_LABELS[site]; const isActive = siteSurrounding === site
              return (
                <button key={site} type="button" onClick={() => setSiteSurrounding(site)}
                  className={cn("rounded-xl border-2 p-3 text-left transition-all",
                    isActive ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300" : "border-gray-200 hover:border-gray-300 bg-white",
                  )}
                >
                  <p className={cn("text-sm font-semibold", isActive ? "text-amber-800" : "text-gray-700")}>{meta.label}</p>
                  <p className={cn("text-xs mt-0.5", isActive ? "text-amber-600" : "text-gray-400")}>{meta.desc}</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 9. Location ──────────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {t("calculator.buildingCalcLocation")}
          </h2>

          {hasAddressApi && (
            <div className="space-y-3 mb-4">
              {/* Province */}
              <div className="relative">
                <Select value={selProv} onValueChange={handleProvince} disabled={loadProv}>
                  <SelectTrigger className={cn("w-full", loadProv && "text-gray-400")}>
                    <SelectValue placeholder={loadProv ? "Loading provinces…" : "Select province / state"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 overflow-y-auto">
                    {provinces.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {loadProv && <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-gray-400 pointer-events-none" />}
              </div>

              {/* City (PH + ID) */}
              {(cc === "PH" || cc === "ID") && selProv && (
                <div className="relative">
                  <Select value={selCity} onValueChange={handleCity} disabled={loadCity || !selProv}>
                    <SelectTrigger className={cn("w-full", loadCity && "text-gray-400")}>
                      <SelectValue placeholder={loadCity ? "Loading cities…" : cc === "ID" ? "Select kab / kota (optional)" : "Select city / municipality (optional)"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 overflow-y-auto">
                      {cities.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {loadCity && <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-gray-400 pointer-events-none" />}
                </div>
              )}

              {/* Auto-detected tier badge */}
              {selProvName && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400">Rate tier:</span>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", TIER_BADGE[location])}>
                    {tierLabel(location)} · {tierPctLabel(location)}
                  </span>
                  <span className="text-xs text-gray-400 truncate max-w-[200px]">for {selCityName || selProvName}</span>
                  {tierAutoSet && <span className="text-xs text-gray-400 italic">— auto-detected</span>}
                </div>
              )}
            </div>
          )}

          {/* Tier override buttons */}
          <div className={cn("grid gap-2", hasAddressApi ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3")}>
            {(["prime", "urban", "rural"] as LocationId[]).map((loc) => {
              const isActive = location === loc
              return (
                <button key={loc} type="button" onClick={() => handleManualTier(loc)}
                  className={cn("rounded-xl border-2 text-left transition-all", hasAddressApi ? "p-2.5" : "p-4",
                    isActive ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300" : "border-gray-200 hover:border-gray-300 bg-white",
                  )}
                >
                  <p className={cn("font-semibold leading-snug", hasAddressApi ? "text-xs" : "text-sm", isActive ? "text-amber-800" : "text-gray-700")}>
                    {hasAddressApi ? loc.charAt(0).toUpperCase() + loc.slice(1) : tierLabel(loc)}
                  </p>
                  <p className={cn("font-medium mt-0.5 text-xs", isActive ? "text-amber-600" : "text-gray-400")}>{tierPctLabel(loc)}</p>
                  {!hasAddressApi && <p className="text-xs text-gray-400 mt-1 leading-snug">{tierLabel(loc)}</p>}
                </button>
              )
            })}
          </div>
          {hasAddressApi && <p className="text-xs text-gray-400 mt-2">Province auto-selects the rate tier. Tap a button above to override.</p>}
        </section>

        {/* ── 10. Cost Add-Ons ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Cost Add-Ons{" "}
            <span className="normal-case font-normal text-gray-400">(optional)</span>
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Include any additional costs to arrive at a complete rebuilding estimate.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CostInput label="Furniture"         symbol={symbol} raw={furnitureRaw} onChange={setFurnitureRaw} onBlur={() => setFurnitureRaw(fmtRaw(furnitureRaw))} />
            <CostInput label="Features (lifts + AC)" symbol={symbol} raw={featuresRaw}  onChange={setFeaturesRaw}  onBlur={() => setFeaturesRaw(fmtRaw(featuresRaw))}   />
            <CostInput label="External Renovation"  symbol={symbol} raw={extRenovRaw}   onChange={setExtRenovRaw}   onBlur={() => setExtRenovRaw(fmtRaw(extRenovRaw))}   />
            <CostInput label="Internal Renovation"  symbol={symbol} raw={intRenovRaw}   onChange={setIntRenovRaw}   onBlur={() => setIntRenovRaw(fmtRaw(intRenovRaw))}   />
            <CostInput label="Improved Finishes"    symbol={symbol} raw={finishesRaw}   onChange={setFinishesRaw}   onBlur={() => setFinishesRaw(fmtRaw(finishesRaw))}   />
          </div>
        </section>

      </div>

      {/* ── Province prompt ──────────────────────────────────────────────── */}
      {!selProvName && parsedArea > 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-6 text-center">
          <p className="text-sm text-gray-400">Select a province above to calculate your rebuilding cost.</p>
        </div>
      )}

      {/* ── BCC loading ──────────────────────────────────────────────────── */}
      {bccLoading && (
        <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50/40 px-5 py-10 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
          <p className="text-sm text-amber-600 font-medium">Calculating…</p>
        </div>
      )}

      {/* ── BCC error ────────────────────────────────────────────────────── */}
      {bccError && !bccLoading && (
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{bccError}</p>
        </div>
      )}

      {/* ── Server breakdown ─────────────────────────────────────────────── */}
      {bccResult && !bccLoading && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/60 overflow-hidden">
          <div className="bg-amber-100/80 px-5 py-3 border-b border-amber-200">
            <h3 className="font-semibold text-amber-900 text-sm">How your estimate is calculated</h3>
            <p className="text-xs text-amber-700 mt-0.5">Each factor is applied in sequence to arrive at your total rebuilding cost.</p>
          </div>

          <div className="divide-y divide-amber-100">

            {/* Step 1 — Base Rate × Area */}
            <div className="flex items-start justify-between gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StepBadge n={1} />
                  <p className="text-sm font-semibold text-gray-800">Base Rate × Area</p>
                </div>
                <p className="text-xs text-gray-500 ml-7">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {t(`calculator.${propertyType}` as any)} · {t(`calculator.${construction}` as any)} · {bccResult.floorArea.toLocaleString()} {bccResult.areaUnit}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">{symbol} {fmtAmount(bccResult.rawConstructionCost)}</p>
                <p className="text-xs text-gray-400">{symbol} {fmtAmount(bccResult.baseRatePerUnit)} / {bccResult.areaUnit}</p>
              </div>
            </div>

            {/* Step 2 — Classification Adjustments (only shown when any factor ≠ 1) */}
            {hasClassification && (
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <StepBadge n={2} />
                  <p className="text-sm font-semibold text-gray-800">Property Classification</p>
                </div>
                <div className="ml-7 space-y-1.5">
                  {[
                    { label: `Age of building (${AGE_LABELS[bccResult.ageOfBuilding as AgeOfBuilding] ?? bccResult.ageOfBuilding})`, factor: bccResult.ageFactor },
                    { label: `Build quality (${QUALITY_LABELS[bccResult.quality as BuildQuality]?.label ?? bccResult.quality})`,        factor: bccResult.qualityMultiplier },
                    { label: `Topography (${TOPO_LABELS[bccResult.topography as Topography]?.label ?? bccResult.topography})`,         factor: bccResult.topographyFactor },
                    { label: `Site (${SITE_LABELS[bccResult.siteSurrounding as SiteSurrounding]?.label ?? bccResult.siteSurrounding})`, factor: bccResult.siteFactor },
                  ].map(({ label, factor }) => {
                    const f = fmtFactor(factor)
                    return (
                      <div key={label} className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{label}</span>
                        <span className={cn("font-mono font-medium", f.cls)}>{f.label}</span>
                      </div>
                    )
                  })}
                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-amber-100">
                    <span className="text-gray-500 font-medium">= Classified Cost</span>
                    <span className="font-bold text-gray-800">{symbol} {fmtAmount(bccResult.classifiedCost)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Storey Loading */}
            <div className="flex items-start justify-between gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StepBadge n={hasClassification ? 3 : 2} />
                  <p className="text-sm font-semibold text-gray-800">Storey Loading</p>
                </div>
                <p className="text-xs text-gray-500 ml-7">
                  {bccResult.numberOfStoreys === 1
                    ? "Single storey — no surcharge"
                    : `${bccResult.numberOfStoreys} storeys · +${((bccResult.numberOfStoreys - 1) * bccResult.storeyIncrementPct * 100).toFixed(0)}% (${(bccResult.storeyIncrementPct * 100).toFixed(0)}% per additional storey)`}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">+ {symbol} {fmtAmount(bccResult.storeyLoading)}</p>
                <p className="text-xs text-gray-400">= {symbol} {fmtAmount(bccResult.storeyAdjustedCost)}</p>
              </div>
            </div>

            {/* Step 4 — Location Multiplier */}
            <div className="flex items-start justify-between gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StepBadge n={hasClassification ? 4 : 3} />
                  <p className="text-sm font-semibold text-gray-800">Location Multiplier</p>
                </div>
                <p className="text-xs text-gray-500 ml-7">
                  {bccResult.detectedLocationTier.charAt(0).toUpperCase() + bccResult.detectedLocationTier.slice(1)} area
                  {" — "}{config.locationTiers[bccResult.detectedLocationTier as LocationId]?.label ?? bccResult.detectedLocationTier}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">× {bccResult.locationMultiplier.toFixed(2)}</p>
                <p className={cn("text-xs",
                  bccResult.locationMultiplier > 1 ? "text-amber-600"
                    : bccResult.locationMultiplier < 1 ? "text-green-600" : "text-gray-400",
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
                  <p className="text-sm font-semibold text-gray-800">
                    Professional Fees ({(bccResult.professionalFeeRate * 100).toFixed(0)}%)
                  </p>
                </div>
                <p className="text-xs text-gray-500 ml-7">Architect, engineer &amp; project management fees</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">+ {symbol} {fmtAmount(bccResult.professionalFee)}</p>
                <p className="text-xs text-gray-400">{(bccResult.professionalFeeRate * 100).toFixed(0)}% of {symbol} {fmtAmount(bccResult.locationAdjustedCost)}</p>
              </div>
            </div>

            {/* Step 6 — Add-Ons (only if totalAddOns > 0) */}
            {bccResult.totalAddOns > 0 && (
              <div className="px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <StepBadge n="+" />
                  <p className="text-sm font-semibold text-gray-800">Cost Add-Ons</p>
                </div>
                <div className="ml-7 space-y-1.5">
                  {[
                    { label: "Furniture",          value: bccResult.furnitureCost },
                    { label: "Features (lifts + AC)", value: bccResult.featuresCost },
                    { label: "External Renovation",value: bccResult.externalRenovation },
                    { label: "Internal Renovation",value: bccResult.internalRenovation },
                    { label: "Improved Finishes",  value: bccResult.improvedFinishes },
                  ]
                    .filter((item) => item.value > 0)
                    .map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-medium text-gray-700">{symbol} {fmtAmount(value)}</span>
                      </div>
                    ))}
                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-amber-100">
                    <span className="text-gray-500 font-medium">Total Add-Ons</span>
                    <span className="font-bold text-gray-800">+ {symbol} {fmtAmount(bccResult.totalAddOns)}</span>
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
      )}

      {/* ── Sticky bottom bar ────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        <div className="max-w-4xl mx-auto px-4 pt-3 pb-4">

          {bccResult && !bccLoading ? (
            <>
              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400 mb-0.5">{t("calculator.constructionCost")}</p>
                  <p className="text-sm font-semibold text-gray-700">{symbol} {fmtAmount(bccResult.locationAdjustedCost)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400 mb-0.5">{t("calculator.professionalFees")}</p>
                  <p className="text-sm font-semibold text-gray-700">{symbol} {fmtAmount(bccResult.professionalFee)}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 ring-1 ring-amber-200">
                  <p className="text-xs text-amber-600 mb-0.5 font-medium">{t("calculator.totalRebuilding")}</p>
                  <p className="text-sm font-bold text-amber-700">{symbol} {fmtAmount(bccResult.totalRebuildingCost)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-gray-400 leading-snug max-w-[55%]">{t("calculator.buildingCalcDisclaimer")}</p>
                <Button onClick={handleConfirm} className="bg-[#0056b3] hover:bg-[#004494] text-white shrink-0 gap-1.5">
                  {t("calculator.buildingCalcConfirm")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-400">
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

    </div>
  )
}
