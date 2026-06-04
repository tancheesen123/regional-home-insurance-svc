"use client"

import { useEffect, useState, useCallback } from "react"
import {
  SlidersHorizontal, RefreshCw, Save, Loader2, AlertCircle,
  CheckCircle2, ChevronDown, ChevronUp, Database, History,
  RotateCcw, ChevronLeft, ChevronRight, Clock, User, ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  fetchRateConfigs,
  updateBuildingRates,
  updateRegionConfig,
  updateLocationTier,
  updateLocationTiersBatch,
  updateRiskMultiplier,
  updateRiskMultipliersBatch,
  seedRateConfig,
  fetchSnapshots,
  fetchSnapshot,
  fetchChangeLogs,
  restoreSnapshot,
  type RateConfigsResponse,
  type BuildingRateRow,
  type RegionConfigRow,
  type LocationTierRow,
  type RiskMultiplierRow,
  type SnapshotListItem,
  type SnapshotDetail,
  type ChangeLogEntry,
} from "@/lib/api/rate-config"
import { cn } from "@/lib/utils"

// ─── Constants ────────────────────────────────────────────────────────────────

const COUNTRIES = ["ID", "PH", "KH"] as const
type CountryCode = (typeof COUNTRIES)[number]

const COUNTRY_LABELS: Record<CountryCode, string> = {
  ID: "🇮🇩 Indonesia",
  PH: "🇵🇭 Philippines",
  KH: "🇰🇭 Cambodia",
}

function pct(v: number) {
  return `${(v * 100).toFixed(2)}%`
}

// ─── Inline edit cells ────────────────────────────────────────────────────────

interface EditCellProps {
  value: number
  onSave: (v: number) => Promise<void>
  decimals?: number
  isPct?: boolean
}

function EditCell({ value, onSave, decimals = 2, isPct = false }: EditCellProps) {
  const displayVal = isPct ? +(value * 100).toFixed(4) : value
  const [editing, setEditing] = useState(false)
  const [raw, setRaw]         = useState(String(displayVal))
  const [err, setErr]         = useState<string | null>(null)

  // Stage the value locally — no API call. Parent's amber dot shows it's pending.
  const handleStage = async () => {
    const num = parseFloat(raw)
    if (isNaN(num)) { setErr("Invalid number"); return }
    setErr(null)
    try {
      await onSave(isPct ? num / 100 : num)
      setEditing(false)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Invalid value")
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => { setRaw(String(displayVal)); setEditing(true); setErr(null) }}
        className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600 group-hover:text-white transition-colors"
        title="Click to edit"
      >
        <span className="font-medium tabular-nums">
          {isPct ? pct(value) : Number(value.toFixed(decimals)).toLocaleString()}
        </span>
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        autoFocus
        value={raw}
        onChange={(e) => { setRaw(e.target.value); setErr(null) }}
        onKeyDown={(e) => { if (e.key === "Enter") handleStage(); if (e.key === "Escape") setEditing(false) }}
        className="h-7 w-24 text-sm text-right px-2"
      />
      {isPct && <span className="text-xs text-gray-400">%</span>}
      {/* Amber = stage only, NOT save to API */}
      <button
        onClick={handleStage}
        className="h-7 px-1.5 text-amber-500 hover:text-amber-600 rounded transition-colors"
        title="Stage change · Save All to commit to server"
      >
        <CheckCircle2 className="h-4 w-4" />
      </button>
      <button onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:text-gray-600 px-1">✕</button>
      {err && <span className="text-xs text-red-500">{err}</span>}
    </div>
  )
}

interface LabelEditProps { value: string; onSave: (v: string) => Promise<void> }

function LabelEdit({ value, onSave }: LabelEditProps) {
  const [editing, setEditing] = useState(false)
  const [raw, setRaw]         = useState(value)
  const [err, setErr]         = useState<string | null>(null)

  const handleStage = async () => {
    if (!raw.trim()) return
    setErr(null)
    try {
      await onSave(raw.trim())
      setEditing(false)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Invalid value")
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => { setRaw(value); setEditing(true); setErr(null) }}
        className="text-left text-sm text-gray-700 hover:text-blue-600 group-hover:text-white transition-colors"
      >
        {value || <span className="text-gray-300 italic group-hover:text-white/40">—</span>}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        autoFocus
        value={raw}
        onChange={(e) => { setRaw(e.target.value); setErr(null) }}
        onKeyDown={(e) => { if (e.key === "Enter") handleStage(); if (e.key === "Escape") setEditing(false) }}
        className="h-7 text-sm px-2 min-w-[180px]"
      />
      {/* Amber = stage only, NOT save to API */}
      <button
        onClick={handleStage}
        className="h-7 px-1.5 text-amber-500 hover:text-amber-600 rounded transition-colors"
        title="Stage change · Save All to commit to server"
      >
        <CheckCircle2 className="h-4 w-4" />
      </button>
      <button onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:text-gray-600 px-1">✕</button>
      {err && <span className="text-xs text-red-500">{err}</span>}
    </div>
  )
}

interface KeywordsEditProps { value: string[]; onSave: (v: string[]) => Promise<void> }

function KeywordsEdit({ value, onSave }: KeywordsEditProps) {
  const [editing, setEditing] = useState(false)
  const [raw, setRaw]         = useState(value.join(", "))
  const [err, setErr]         = useState<string | null>(null)

  const handleStage = async () => {
    const arr = raw.split(",").map((s) => s.trim()).filter(Boolean)
    setErr(null)
    try {
      await onSave(arr)
      setEditing(false)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Invalid value")
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => { setRaw(value.join(", ")); setEditing(true); setErr(null) }}
        className="text-left text-xs text-gray-500 hover:text-blue-600 group-hover:text-white/80 transition-colors max-w-[240px] truncate"
        title={value.join(", ") || "Click to add keywords"}
      >
        {value.length > 0 ? value.join(", ") : <span className="text-gray-300 italic group-hover:text-white/40">none</span>}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-1 min-w-[220px]">
      <Input
        autoFocus
        value={raw}
        onChange={(e) => { setRaw(e.target.value); setErr(null) }}
        onKeyDown={(e) => { if (e.key === "Escape") setEditing(false) }}
        className="h-7 text-xs px-2"
        placeholder="kl, klcc, pj"
      />
      <div className="flex items-center gap-1">
        {/* Amber = stage only, NOT save to API */}
        <button
          onClick={handleStage}
          className="flex items-center gap-1 h-6 px-2 text-xs text-amber-600 hover:text-amber-700 border border-amber-300 hover:border-amber-400 rounded transition-colors bg-amber-50 hover:bg-amber-100"
          title="Stage change · Save All to commit to server"
        >
          <CheckCircle2 className="h-3 w-3" />
          Stage
        </button>
        <button onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:text-gray-600 px-1">Cancel</button>
      </div>
      {err && <span className="text-xs text-red-500">{err}</span>}
    </div>
  )
}

// ─── Tab: Construction Rates ──────────────────────────────────────────────────

function BuildingRatesTab({
  rows,
  countryCode,
  onSaved,
}: {
  rows: BuildingRateRow[]
  countryCode: string
  onSaved: () => void
}) {
  const safeRows    = rows ?? []
  const propTypes   = [...new Set(safeRows.map((r) => r.propertySubType))]
  const constrTypes = [...new Set(safeRows.map((r) => r.constructionType))]

  // pending: id → new ratePerUnit (not yet sent to API)
  const [pending, setPending]   = useState<Record<string, number>>({})
  const [saving, setSaving]     = useState(false)
  const [saveOk, setSaveOk]     = useState(false)
  const [saveErr, setSaveErr]   = useState<string | null>(null)

  const pendingCount = Object.keys(pending).length

  // When EditCell confirms a value, store it locally instead of calling the API
  const stageEdit = (id: string, value: number): Promise<void> => {
    setPending((prev) => ({ ...prev, [id]: value }))
    return Promise.resolve()
  }

  const handleSaveAll = async () => {
    if (pendingCount === 0) return
    setSaving(true); setSaveErr(null); setSaveOk(false)
    try {
      const rates = Object.entries(pending).map(([id, ratePerUnit]) => ({ id, ratePerUnit }))
      await updateBuildingRates(rates, countryCode)
      setPending({})
      setSaveOk(true)
      setTimeout(() => setSaveOk(false), 3000)
      onSaved()
    } catch (e: unknown) {
      setSaveErr(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const handleDiscardAll = () => { setPending({}); setSaveErr(null) }

  const propertyLabel     = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  const constructionLabel = (s: string) =>
    s === "full-brick" ? "Full Brick" : s === "partial-brick" ? "Partial Brick" : s

  if (safeRows.length === 0) {
    return <EmptyState message="No construction rates found. Try seeding this country first." />
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-blue-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col style={{ width: "40%" }} />
            {constrTypes.map((ct) => (
              <col key={ct} style={{ width: "30%" }} />
            ))}
          </colgroup>
          {/* Dark blue header */}
          <thead>
            <tr className="bg-[#0056b3] text-white">
              <th className="text-left px-5 py-3.5 font-semibold text-sm">Property Type</th>
              {constrTypes.map((ct) => (
                <th key={ct} className="text-right px-5 py-3.5 font-semibold text-sm">
                  {constructionLabel(ct)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {propTypes.map((pt, idx) => {
              const isEven = idx % 2 === 0
              return (
                <tr
                  key={pt}
                  className={cn(
                    "border-b border-blue-50 transition-all duration-150 group",
                    "hover:bg-blue-600 hover:shadow-md",
                    isEven ? "bg-white" : "bg-blue-50/50",
                  )}
                >
                  <td className="px-5 py-3.5 font-medium text-gray-800 group-hover:text-white transition-colors">
                    {propertyLabel(pt)}
                  </td>
                  {constrTypes.map((ct) => {
                    const row = safeRows.find(
                      (r) => r.propertySubType === pt && r.constructionType === ct,
                    )
                    if (!row) return (
                      <td key={ct} className="px-5 py-3.5">
                        <div className="flex justify-end text-gray-300">—</div>
                      </td>
                    )
                    const hasPending = row.id in pending
                    const displayVal = hasPending ? pending[row.id] : row.ratePerUnit
                    return (
                      <td key={ct} className="px-5 py-3.5">
                        <div className="flex justify-end items-center gap-1.5">
                          {/* Amber dot = unsaved change */}
                          {hasPending && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 group-hover:bg-amber-300" title="Unsaved change" />
                          )}
                          <EditCell
                            value={displayVal}
                            onSave={(v) => stageEdit(row.id, v)}
                            decimals={0}
                          />
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <SaveAllFooter
        pendingCount={pendingCount}
        saving={saving}
        saveOk={saveOk}
        saveErr={saveErr}
        onSaveAll={handleSaveAll}
        onDiscard={handleDiscardAll}
      />
    </div>
  )
}

// ─── Shared footer for all Save-All tabs ─────────────────────────────────────

function SaveAllFooter({
  pendingCount, saving, saveOk, saveErr, onSaveAll, onDiscard,
}: {
  pendingCount: number
  saving: boolean
  saveOk: boolean
  saveErr: string | null
  onSaveAll: () => void
  onDiscard: () => void
}) {
  return (
    <div className="px-5 py-3 bg-blue-50 border-t border-blue-100 flex items-center justify-between gap-4">
      <p className="text-xs text-blue-400">
        Click any value to edit · ✓ or Enter to stage · Save All to commit to server
      </p>
      <div className="flex items-center gap-2 shrink-0">
        {saveOk && (
          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> Saved successfully
          </span>
        )}
        {saveErr && (
          <span className="flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5" /> {saveErr}
          </span>
        )}
        {pendingCount > 0 && (
          <button
            onClick={onDiscard}
            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded transition-colors"
          >
            Discard
          </button>
        )}
        <Button
          size="sm"
          onClick={onSaveAll}
          disabled={pendingCount === 0 || saving}
          className={cn(
            "gap-1.5 transition-all",
            pendingCount > 0
              ? "bg-[#0056b3] hover:bg-[#004494] text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed",
          )}
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save All
          {pendingCount > 0 && (
            <span className="ml-0.5 bg-white/25 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}

// Amber dot indicator for pending changes
function PendingDot() {
  return <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 group-hover:bg-amber-300" title="Unsaved change" />
}

// ─── Tab: Region Settings ─────────────────────────────────────────────────────

type RegionPending = Partial<Pick<RegionConfigRow,
  "areaMin" | "areaMax" | "storeyIncrementPct" | "maxStoreys" | "professionalFeeRate" | "benchmarkYear"
>>

function RegionConfigTab({
  config, countryCode, onSaved,
}: {
  config: RegionConfigRow | null
  countryCode: string
  onSaved: () => void
}) {
  const [pending, setPending]   = useState<RegionPending>({})
  const [saving, setSaving]     = useState(false)
  const [saveOk, setSaveOk]     = useState(false)
  const [saveErr, setSaveErr]   = useState<string | null>(null)

  const pendingCount = Object.keys(pending).length

  const stage = (field: keyof RegionPending, value: number): Promise<void> => {
    setPending((p) => ({ ...p, [field]: value }))
    return Promise.resolve()
  }

  const handleSaveAll = async () => {
    if (!config || pendingCount === 0) return
    setSaving(true); setSaveErr(null); setSaveOk(false)
    try {
      await updateRegionConfig(config.id, pending, countryCode)
      setPending({})
      setSaveOk(true)
      setTimeout(() => setSaveOk(false), 3000)
      onSaved()
    } catch (e: unknown) {
      setSaveErr(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (!config) {
    return <EmptyState message="No region config found. Try seeding this country first." />
  }

  // Helper: returns the display value (pending override or original)
  const val = <K extends keyof RegionPending>(field: K, original: number) =>
    (field in pending ? pending[field] : original) as number

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-blue-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0056b3] text-white">
              <th className="text-left px-4 py-3.5 font-semibold w-20">Unit</th>
              <th className="text-right px-4 py-3.5 font-semibold">Min Area</th>
              <th className="text-right px-4 py-3.5 font-semibold">Max Area</th>
              <th className="text-right px-4 py-3.5 font-semibold">Storey Inc %</th>
              <th className="text-right px-4 py-3.5 font-semibold">Max Storeys</th>
              <th className="text-right px-4 py-3.5 font-semibold">Prof Fee %</th>
              <th className="text-right px-4 py-3.5 font-semibold">Benchmark Yr</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-blue-50 hover:bg-blue-600 hover:shadow-md transition-all duration-150 group bg-white">
              <td className="px-4 py-3">
                <Badge variant="outline" className="text-xs font-mono group-hover:border-white/40 group-hover:text-white group-hover:bg-white/10 transition-colors">
                  {config.areaUnit}
                </Badge>
              </td>
              {(
                [
                  { field: "areaMin"           as const, isPct: false },
                  { field: "areaMax"           as const, isPct: false },
                  { field: "storeyIncrementPct"as const, isPct: true  },
                  { field: "maxStoreys"        as const, isPct: false },
                  { field: "professionalFeeRate"as const,isPct: true  },
                  { field: "benchmarkYear"     as const, isPct: false },
                ] as { field: keyof RegionPending; isPct: boolean }[]
              ).map(({ field, isPct }) => (
                <td key={field} className="px-4 py-3">
                  <div className="flex justify-end items-center gap-1.5">
                    {field in pending && <PendingDot />}
                    <EditCell
                      value={val(field, config[field] as number)}
                      onSave={(v) => stage(field, v)}
                      decimals={isPct ? 2 : 0}
                      isPct={isPct}
                    />
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <SaveAllFooter
        pendingCount={pendingCount}
        saving={saving}
        saveOk={saveOk}
        saveErr={saveErr}
        onSaveAll={handleSaveAll}
        onDiscard={() => { setPending({}); setSaveErr(null) }}
      />
    </div>
  )
}

// ─── Tab: Location Tiers ──────────────────────────────────────────────────────

const TIER_META: Record<string, { label: string; color: string }> = {
  prime: { label: "Prime", color: "bg-amber-100 text-amber-700 border-amber-200" },
  urban: { label: "Urban", color: "bg-blue-100 text-blue-700 border-blue-200"   },
  rural: { label: "Rural", color: "bg-green-100 text-green-700 border-green-200" },
}

type TierPending = Record<string, { multiplier?: number; label?: string; keywords?: string[] }>

function LocationTiersTab({
  rows, countryCode, onSaved,
}: {
  rows: LocationTierRow[]
  countryCode: string
  onSaved: () => void
}) {
  const safeRows = rows ?? []
  const [pending, setPending]   = useState<TierPending>({})
  const [saving, setSaving]     = useState(false)
  const [saveOk, setSaveOk]     = useState(false)
  const [saveErr, setSaveErr]   = useState<string | null>(null)

  const pendingCount = Object.keys(pending).length

  const stage = (id: string, patch: { multiplier?: number; label?: string; keywords?: string[] }): Promise<void> => {
    setPending((p) => ({ ...p, [id]: { ...p[id], ...patch } }))
    return Promise.resolve()
  }

  const handleSaveAll = async () => {
    if (pendingCount === 0) return
    setSaving(true); setSaveErr(null); setSaveOk(false)
    try {
      // Single batch request → backend creates ONE snapshot for the whole Save All.
      const tiers = Object.entries(pending).map(([id, data]) => ({ id, ...data }))
      await updateLocationTiersBatch(tiers, countryCode)
      setPending({})
      setSaveOk(true)
      setTimeout(() => setSaveOk(false), 3000)
      onSaved()
    } catch (e: unknown) {
      setSaveErr(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (safeRows.length === 0) {
    return <EmptyState message="No location tiers found. Try seeding this country first." />
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-blue-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0056b3] text-white">
              <th className="text-left px-4 py-3.5 font-semibold">Tier</th>
              <th className="text-left px-4 py-3.5 font-semibold">Label</th>
              <th className="text-right px-4 py-3.5 font-semibold">Multiplier</th>
              <th className="text-left px-4 py-3.5 font-semibold">Keywords (comma-separated)</th>
            </tr>
          </thead>
          <tbody>
            {safeRows.map((row, idx) => {
              const meta   = TIER_META[row.tier] ?? { label: row.tier, color: "bg-gray-100 text-gray-600 border-gray-200" }
              const p      = pending[row.id] ?? {}
              const hasAny = row.id in pending
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-blue-50 transition-all duration-150 group",
                    "hover:bg-blue-600 hover:shadow-md",
                    idx % 2 === 0 ? "bg-white" : "bg-blue-50/50",
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {hasAny && <PendingDot />}
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors",
                        "group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30",
                        meta.color,
                      )}>
                        {meta.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <LabelEdit
                      value={p.label ?? row.label}
                      onSave={(v) => stage(row.id, { label: v })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <EditCell
                        value={p.multiplier ?? row.multiplier}
                        onSave={(v) => stage(row.id, { multiplier: v })}
                        decimals={4}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <KeywordsEdit
                      value={p.keywords ?? row.keywords ?? []}
                      onSave={(v) => stage(row.id, { keywords: v })}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <SaveAllFooter
        pendingCount={pendingCount}
        saving={saving}
        saveOk={saveOk}
        saveErr={saveErr}
        onSaveAll={handleSaveAll}
        onDiscard={() => { setPending({}); setSaveErr(null) }}
      />
    </div>
  )
}

// ─── Tab: Risk Multipliers ────────────────────────────────────────────────────

function RiskMultipliersTab({
  rows, countryCode, onSaved,
}: {
  rows: RiskMultiplierRow[]
  countryCode: string
  onSaved: () => void
}) {
  const safeRows = rows ?? []
  const [pending, setPending]   = useState<Record<string, number>>({})
  const [saving, setSaving]     = useState(false)
  const [saveOk, setSaveOk]     = useState(false)
  const [saveErr, setSaveErr]   = useState<string | null>(null)

  const pendingCount = Object.keys(pending).length

  const stage = (id: string, value: number): Promise<void> => {
    setPending((p) => ({ ...p, [id]: value }))
    return Promise.resolve()
  }

  const handleSaveAll = async () => {
    if (pendingCount === 0) return
    setSaving(true); setSaveErr(null); setSaveOk(false)
    try {
      // Single batch request → backend creates ONE snapshot for the whole Save All.
      const multipliers = Object.entries(pending).map(([id, multiplier]) => ({ id, multiplier }))
      await updateRiskMultipliersBatch(multipliers, countryCode)
      setPending({})
      setSaveOk(true)
      setTimeout(() => setSaveOk(false), 3000)
      onSaved()
    } catch (e: unknown) {
      setSaveErr(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (safeRows.length === 0) {
    return <EmptyState message="No risk multipliers found. Try seeding this country first." />
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-blue-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0056b3] text-white">
              <th className="text-left px-4 py-3.5 font-semibold">Factor Key</th>
              <th className="text-left px-4 py-3.5 font-semibold">Description</th>
              <th className="text-right px-4 py-3.5 font-semibold">Multiplier</th>
            </tr>
          </thead>
          <tbody>
            {safeRows.map((row, idx) => {
              const hasPending = row.id in pending
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-blue-50 transition-all duration-150 group",
                    "hover:bg-blue-600 hover:shadow-md",
                    idx % 2 === 0 ? "bg-white" : "bg-blue-50/50",
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {hasPending && <PendingDot />}
                      <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded group-hover:bg-white/20 group-hover:text-white transition-colors">
                        {row.factorKey}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs group-hover:text-white/80 transition-colors">
                    {row.description}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <EditCell
                        value={hasPending ? pending[row.id] : row.multiplier}
                        onSave={(v) => stage(row.id, v)}
                        decimals={4}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <SaveAllFooter
        pendingCount={pendingCount}
        saving={saving}
        saveOk={saveOk}
        saveErr={saveErr}
        onSaveAll={handleSaveAll}
        onDiscard={() => { setPending({}); setSaveErr(null) }}
      />
    </div>
  )
}

// ─── Tab: History ────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

const SNAPSHOT_TYPE_META: Record<string, { label: string; color: string }> = {
  auto:     { label: "Auto",     color: "bg-blue-100 text-blue-700 border-blue-200"    },
  restored: { label: "Restored", color: "bg-amber-100 text-amber-700 border-amber-200" },
}

function HistoryTab({
  countryCode,
  onRestored,
}: {
  countryCode: string
  onRestored: () => void
}) {
  const [snapshots, setSnapshots]       = useState<SnapshotListItem[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)

  // Detail view
  const [detail, setDetail]             = useState<SnapshotDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError]   = useState<string | null>(null)

  // Restore
  const [restoringId, setRestoringId]   = useState<string | null>(null)
  const [restoreNote, setRestoreNote]   = useState("")
  const [restoring, setRestoring]       = useState(false)
  const [restoreOk, setRestoreOk]       = useState<string | null>(null)
  const [restoreErr, setRestoreErr]     = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      setSnapshots(await fetchSnapshots(countryCode))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load snapshots")
    } finally {
      setLoading(false)
    }
  }, [countryCode])

  useEffect(() => { load() }, [load])

  const handleViewDetail = async (id: string) => {
    if (detail?.id === id) { setDetail(null); return }
    setDetailLoading(true); setDetailError(null)
    try {
      setDetail(await fetchSnapshot(id, countryCode))
    } catch (e: unknown) {
      setDetailError(e instanceof Error ? e.message : "Failed to load snapshot")
    } finally {
      setDetailLoading(false)
    }
  }

  const handleRestore = async () => {
    if (!restoringId) return
    setRestoring(true); setRestoreErr(null); setRestoreOk(null)
    try {
      const result = await restoreSnapshot(restoringId, restoreNote || undefined, countryCode)
      setRestoreOk(result.message)
      setRestoringId(null)
      setRestoreNote("")
      await load()
      onRestored()
      setTimeout(() => setRestoreOk(null), 5000)
    } catch (e: unknown) {
      setRestoreErr(e instanceof Error ? e.message : "Restore failed")
    } finally {
      setRestoring(false)
    }
  }

  if (loading) return (
    <div className="space-y-2">
      {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}
    </div>
  )

  if (error) return (
    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
      <p className="text-sm text-red-700">{error}</p>
      <Button size="sm" variant="outline" onClick={load} className="ml-auto border-red-300 text-red-700">Retry</Button>
    </div>
  )

  if (snapshots.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-gray-200 bg-gray-50">
      <History className="h-8 w-8 text-gray-300 mb-3" />
      <p className="text-sm text-gray-400">No snapshots yet. Changes will be recorded automatically after the first save.</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {/* Success banner */}
      {restoreOk && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {restoreOk}
        </div>
      )}

      {snapshots.map((snap) => {
        const typeMeta  = SNAPSHOT_TYPE_META[snap.snapshotType] ?? SNAPSHOT_TYPE_META.auto
        const isExpanded = detail?.id === snap.id
        const isRestoring = restoringId === snap.id

        return (
          <div key={snap.id} className="rounded-xl border border-gray-200 overflow-hidden">
            {/* Row */}
            <div className={cn(
              "flex items-center gap-4 px-5 py-4 transition-colors",
              isExpanded ? "bg-blue-50 border-b border-blue-100" : "bg-white hover:bg-gray-50",
            )}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{snap.label}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{snap.createdBy}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{fmtDate(snap.createdAt)}</span>
                </div>
              </div>
              <span className={cn("shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border", typeMeta.color)}>
                {typeMeta.label}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetail(snap.id)}
                  className="text-xs h-8"
                >
                  {detailLoading && detail === null ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                  {isExpanded ? "Hide" : "View Changes"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setRestoringId(isRestoring ? null : snap.id); setRestoreNote(""); setRestoreErr(null) }}
                  className="text-xs h-8 border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Restore
                </Button>
              </div>
            </div>

            {/* Restore confirm panel */}
            {isRestoring && (
              <div className="px-5 py-4 bg-amber-50 border-b border-amber-200">
                <p className="text-sm font-medium text-amber-900 mb-3">
                  ⚠️ Restore this snapshot? This will immediately overwrite the live config for this region.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    value={restoreNote}
                    onChange={(e) => setRestoreNote(e.target.value)}
                    placeholder="Optional note (e.g. Rolling back bad rate update)"
                    className="text-sm h-8 flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleRestore}
                    disabled={restoring}
                    className="bg-amber-600 hover:bg-amber-700 text-white h-8 shrink-0"
                  >
                    {restoring ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                    Confirm Restore
                  </Button>
                  <button onClick={() => setRestoringId(null)} className="text-xs text-gray-400 hover:text-gray-600 px-2">Cancel</button>
                </div>
                {restoreErr && <p className="text-xs text-red-500 mt-2">{restoreErr}</p>}
              </div>
            )}

            {/* Change-log detail panel */}
            {isExpanded && (
              <div className="px-5 py-4 bg-white">
                {detailLoading && (
                  <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
                )}
                {detailError && (
                  <p className="text-sm text-red-500">{detailError}</p>
                )}
                {detail && detail.changeLogs.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No field-level changes recorded for this snapshot.</p>
                )}
                {detail && detail.changeLogs.length > 0 && (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 pr-4 font-semibold text-gray-500 w-1/3">Field</th>
                        <th className="text-left py-2 pr-4 font-semibold text-red-400">Old Value</th>
                        <th className="text-left py-2 pr-4 font-semibold text-green-600">New Value</th>
                        <th className="text-left py-2 font-semibold text-gray-400">Changed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.changeLogs.map((log, idx) => (
                        <tr key={log.id || idx} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-2 pr-4 font-mono text-gray-700">{log.fieldName}</td>
                          <td className="py-2 pr-4 text-red-500 line-through">{log.oldValue}</td>
                          <td className="py-2 pr-4 text-green-600 font-medium">{log.newValue}</td>
                          <td className="py-2 text-gray-400">{fmtDate(log.changedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Tab: Change Log ──────────────────────────────────────────────────────────

function ChangeLogTab({ countryCode }: { countryCode: string }) {
  const PAGE_SIZE = 50
  const [logs, setLogs]       = useState<ChangeLogEntry[]>([])
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const load = useCallback(async (p: number) => {
    setLoading(true); setError(null)
    try {
      const data = await fetchChangeLogs(countryCode, p, PAGE_SIZE)
      setLogs(data ?? [])
      setHasMore((data ?? []).length === PAGE_SIZE)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load change logs")
    } finally {
      setLoading(false)
    }
  }, [countryCode])

  useEffect(() => { setPage(1); load(1) }, [load])

  const goPage = (p: number) => { setPage(p); load(p) }

  if (error) return (
    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
      <p className="text-sm text-red-700">{error}</p>
      <Button size="sm" variant="outline" onClick={() => load(page)} className="ml-auto border-red-300 text-red-700">Retry</Button>
    </div>
  )

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-blue-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0056b3] text-white">
              <th className="text-left px-4 py-3.5 font-semibold">Field</th>
              <th className="text-left px-4 py-3.5 font-semibold">Old Value</th>
              <th className="text-left px-4 py-3.5 font-semibold">New Value</th>
              <th className="text-left px-4 py-3.5 font-semibold">Changed By</th>
              <th className="text-left px-4 py-3.5 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto" />
              </td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No changes recorded yet.</td></tr>
            ) : logs.map((log, idx) => (
              <tr
                key={log.id || idx}
                className={cn(
                  "border-b border-blue-50 transition-all duration-150 group",
                  "hover:bg-blue-600 hover:shadow-md",
                  idx % 2 === 0 ? "bg-white" : "bg-blue-50/50",
                )}
              >
                <td className="px-4 py-3 font-mono text-xs text-gray-700 group-hover:text-white transition-colors">
                  {log.fieldName}
                </td>
                <td className="px-4 py-3 text-red-500 group-hover:text-red-200 transition-colors line-through text-xs">
                  {log.oldValue}
                </td>
                <td className="px-4 py-3 text-green-600 group-hover:text-green-200 transition-colors font-medium text-xs">
                  {log.newValue}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs group-hover:text-white/80 transition-colors">
                  {log.changedBy}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs group-hover:text-white/70 transition-colors whitespace-nowrap">
                  {fmtDate(log.changedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="px-5 py-3 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
        <span className="text-xs text-blue-400">
          Page {page} · {PAGE_SIZE} entries per page
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => goPage(page - 1)}
            disabled={page === 1 || loading}
            className="h-7 px-2"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-gray-600 font-medium px-1">{page}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => goPage(page + 1)}
            disabled={!hasMore || loading}
            className="h-7 px-2"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
      <Database className="h-8 w-8 text-gray-300 mb-3" />
      <p className="text-sm text-gray-400 max-w-xs">{message}</p>
    </div>
  )
}

// ─── Seed Section ─────────────────────────────────────────────────────────────

function SeedSection({ activeCountry, onSeeded }: { activeCountry: CountryCode; onSeeded: () => void }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "already" | "error">("idle")
  const [msg, setMsg]     = useState<string>("")
  const [expanded, setExpanded] = useState(false)

  const handleSeed = async () => {
    setState("loading"); setMsg("")
    try {
      const result = await seedRateConfig(activeCountry)
      setState(result.seeded ? "done" : "already")
      setMsg(result.message)
      if (result.seeded) onSeeded()
      setTimeout(() => setState("idle"), 4000)
    } catch (e: unknown) {
      setState("error")
      setMsg(e instanceof Error ? e.message : "Seed failed")
      setTimeout(() => setState("idle"), 4000)
    }
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-amber-600" />
          <span className="font-semibold text-amber-900">Seed Initial Data</span>
          <span className="text-xs text-amber-600 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
            Safe to re-run
          </span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-amber-500" /> : <ChevronDown className="h-4 w-4 text-amber-500" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5">
          <p className="text-sm text-amber-700 mb-4">
            Seeds default rates for <strong>{COUNTRY_LABELS[activeCountry]}</strong> if they don&apos;t exist yet.
            Existing values will not be overwritten.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSeed}
              disabled={state === "loading"}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                state === "done"    && "bg-green-50 border-green-300 text-green-700",
                state === "already" && "bg-blue-50 border-blue-300 text-blue-700",
                state === "error"   && "bg-red-50 border-red-300 text-red-700",
                state === "loading" && "bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed",
                state === "idle"    && "bg-white border-amber-300 text-amber-800 hover:bg-amber-100",
              )}
            >
              {state === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {state === "done"    && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
              {state === "already" && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />}
              {state === "error"   && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
              {state === "idle"    && <Database className="h-3.5 w-3.5" />}
              Seed {COUNTRY_LABELS[activeCountry]}
            </button>
            {msg && (
              <span className={cn(
                "text-xs",
                state === "done"    && "text-green-600",
                state === "already" && "text-blue-600",
                state === "error"   && "text-red-600",
              )}>
                {msg}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ModifyConfigPage() {
  const [activeCountry, setActiveCountry] = useState<CountryCode>("ID")
  const [activeTab, setActiveTab]         = useState("building-rates")
  const [data, setData]   = useState<RateConfigsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetchRateConfigs(activeCountry)
      setData(res)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load config")
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [activeCountry])

  useEffect(() => { load() }, [load])

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <SlidersHorizontal className="h-5 w-5 text-[#0056b3]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Modify Config</h1>
            <p className="text-sm text-gray-500">Manage building rates, region settings, and risk factors</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* ── Country selector ────────────────────────────────────────────────── */}
      <div className="flex gap-2">
        {COUNTRIES.map((cc) => (
          <button
            key={cc}
            onClick={() => setActiveCountry(cc)}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
              activeCountry === cc
                ? "bg-[#0056b3] text-white border-[#0056b3] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50",
            )}
          >
            {COUNTRY_LABELS[cc]}
          </button>
        ))}
      </div>

      {/* ── Seed section ────────────────────────────────────────────────────── */}
      <SeedSection activeCountry={activeCountry} onSeeded={load} />

      {/* ── Error state ─────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Failed to load configuration</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
          <Button size="sm" variant="outline" onClick={load} className="border-red-300 text-red-700 hover:bg-red-100">
            Retry
          </Button>
        </div>
      )}

      {/* ── Loading skeleton ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      {!loading && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="building-rates">Building Rates</TabsTrigger>
            <TabsTrigger value="region">Region Config</TabsTrigger>
            <TabsTrigger value="location">Location Tiers</TabsTrigger>
            <TabsTrigger value="risk">Risk Multipliers</TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1.5">
              <History className="h-3.5 w-3.5" />History
            </TabsTrigger>
            <TabsTrigger value="changelog" className="flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5 rotate-[225deg]" />Change Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="building-rates">
            <BuildingRatesTab rows={data?.buildingRates ?? []} countryCode={activeCountry} onSaved={load} />
          </TabsContent>

          <TabsContent value="region">
            <RegionConfigTab config={data?.regionConfig ?? null} countryCode={activeCountry} onSaved={load} />
          </TabsContent>

          <TabsContent value="location">
            <LocationTiersTab rows={data?.locationTiers ?? []} countryCode={activeCountry} onSaved={load} />
          </TabsContent>

          <TabsContent value="risk">
            <RiskMultipliersTab rows={data?.riskMultipliers ?? []} countryCode={activeCountry} onSaved={load} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab countryCode={activeCountry} onRestored={load} />
          </TabsContent>

          <TabsContent value="changelog">
            <ChangeLogTab countryCode={activeCountry} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
