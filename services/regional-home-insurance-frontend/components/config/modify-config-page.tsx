"use client"

import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import {
  SlidersHorizontal, RefreshCw, Save, Loader2, AlertCircle,
  CheckCircle2, ChevronDown, ChevronUp, Database, History,
  RotateCcw, ChevronLeft, ChevronRight, Clock, User,
  Search, Filter, X, MoreHorizontal, MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getSession } from "@/lib/session"
import {
  fetchIdProvinces, fetchIdCities, fetchPhProvinces, fetchPhCities,
  fetchKhProvinces, fetchKhDistricts,
} from "@/lib/address-api"
import {
  fetchRateConfigs, updateBuildingRates, updateRegionConfig,
  updateLocationTiersBatch, updateRiskMultipliersBatch,
  seedRateConfig, fetchSnapshots, fetchSnapshot, fetchChangeLogs,
  restoreSnapshot,
  type RateConfigsResponse, type BuildingRateRow, type RegionConfigRow,
  type LocationTierRow, type RiskMultiplierRow,
  type SnapshotListItem, type SnapshotDetail, type ChangeLogEntry,
} from "@/lib/api/rate-config"
import { cn } from "@/lib/utils"


type CountryCode = "ID" | "PH" | "KH"

const COUNTRY_LABELS: Record<CountryCode, string> = {
  ID: "🇮🇩 Indonesia",
  PH: "🇵🇭 Philippines",
  KH: "🇰🇭 Cambodia",
}

const TABLE_CATEGORY: Record<string, string> = {
  BuildingConstructionRates: "Building Rates",
  RegionConfig:              "Region Config",
  LocationTiers:             "Location Tiers",
  RiskMultipliers:           "Risk Multipliers",
}

function pct(v: number) { return `${(v * 100).toFixed(2)}%` }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

// ─── Grid-line table cell classes ─────────────────────────────────────────────
// Clear horizontal + vertical lines: every cell gets bottom + right border;
// last column drops the right border (sits against the rounded container edge).

const TH   = "px-4 py-3 text-left  text-[11px] font-semibold uppercase tracking-wider text-[#9E9E9E] border-b border-r border-[#E0E0E0] last:border-r-0"
const TH_R = "px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#9E9E9E] border-b border-r border-[#E0E0E0] last:border-r-0"
// relative → lets the inline editor overlay the whole cell (absolute inset-0),
//   exactly like Excel: the editor fills the cell, never reflows neighbours.
// h-16 reserves a fixed row height so the overlay always has a stable box.
const TD   = "relative px-4 py-2 h-12 align-middle border-b border-r border-[#E0E0E0] last:border-r-0"

// Excel-style inline editor: fills the entire cell, same padding/alignment as
// the resting text, thin selection ring. Absolute so it adds zero layout.
const INLINE_EDIT = "absolute inset-0 w-full h-full bg-white outline-none ring-2 ring-inset ring-[#F5A623] z-10 text-sm"

// Yellow = staged/pending value (replaces the old amber pending dot)
const PENDING_TEXT = "text-[#F5A623]"

// ─── 3-dot row action menu ────────────────────────────────────────────────────

function RowMenu({ items }: { items: { label: string; icon?: React.ReactNode; danger?: boolean; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div ref={ref} className="relative flex justify-center">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-[#BDBDBD] hover:text-[#555555] hover:bg-[#F5F5F5] transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 min-w-[140px] bg-white rounded-xl shadow-lg border border-[#E0E0E0] py-1 overflow-hidden">
          {items.map((item, i) => (
            <button key={i}
              onClick={() => { item.onClick(); setOpen(false) }}
              className={cn("w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
                item.danger ? "text-[#D32F2F] hover:bg-[#FFEBEE]" : "text-[#1A1A1A] hover:bg-[#FAFAFA]")}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Inline edit cells (yellow text when staged) ──────────────────────────────

interface EditCellProps {
  value: number; onSave: (v: number) => Promise<void>
  decimals?: number; isPct?: boolean; pending?: boolean
}

function EditCell({ value, onSave, decimals = 2, isPct = false, pending = false }: EditCellProps) {
  const displayVal = isPct ? +(value * 100).toFixed(4) : value
  const [editing, setEditing] = useState(false)
  const [raw, setRaw]         = useState(String(displayVal))
  const [err, setErr]         = useState<string | null>(null)
  // Guard so blur after a successful Enter/Escape doesn't double-commit
  const committedRef = useRef(false)

  const commit = async () => {
    if (committedRef.current) return
    committedRef.current = true
    const num = parseFloat(raw)
    if (isNaN(num)) { setErr("Invalid"); committedRef.current = false; return }
    // No real change → just close, don't stage (prevents accidental yellow)
    if (num === displayVal) { setEditing(false); return }
    setErr(null)
    try { await onSave(isPct ? num / 100 : num); setEditing(false) }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : "Error"); committedRef.current = false }
  }

  const cancel = () => { committedRef.current = true; setEditing(false); setErr(null) }

  if (!editing) {
    return (
      <button
        onClick={() => { setRaw(String(displayVal)); setEditing(true); setErr(null); committedRef.current = false }}
        className={cn(
          "w-full text-right text-sm font-medium tabular-nums transition-colors",
          pending ? PENDING_TEXT : "text-[#1A1A1A] hover:text-[#0066CC]",
        )}
        title="Click to edit"
      >
        {isPct ? pct(value) : Number(value.toFixed(decimals)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals })}
      </button>
    )
  }

  // Excel-style: editor overlays the whole cell, same px-4 + right alignment.
  return (
    <input autoFocus value={raw}
      onChange={(e) => { setRaw(e.target.value); setErr(null) }}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel() }}
      className={cn(INLINE_EDIT, "px-4 text-right font-medium tabular-nums text-[#1A1A1A]", err && "ring-[#D32F2F]")}
    />
  )
}

function LabelEdit({ value, onSave, pending = false }: { value: string; onSave: (v: string) => Promise<void>; pending?: boolean }) {
  const [editing, setEditing] = useState(false)
  const [raw, setRaw]         = useState(value)
  const [err, setErr]         = useState<string | null>(null)
  const committedRef = useRef(false)

  const commit = async () => {
    if (committedRef.current) return
    committedRef.current = true
    const trimmed = raw.trim()
    // Empty or unchanged → just close, don't stage
    if (!trimmed || trimmed === value) { setEditing(false); return }
    try { await onSave(trimmed); setEditing(false) }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : "Error"); committedRef.current = false }
  }
  const cancel = () => { committedRef.current = true; setEditing(false); setErr(null) }

  if (!editing) {
    return (
      <button onClick={() => { setRaw(value); setEditing(true); committedRef.current = false }}
        title={value}
        className={cn("w-full text-left text-sm transition-colors truncate block",
          pending ? PENDING_TEXT : "text-[#1A1A1A] hover:text-[#0066CC]")}>
        {value || <span className="text-[#BDBDBD] italic">—</span>}
      </button>
    )
  }
  return (
    <input autoFocus value={raw}
      onChange={(e) => { setRaw(e.target.value); setErr(null) }}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel() }}
      className={cn(INLINE_EDIT, "px-4 text-left text-[#1A1A1A]", err && "ring-[#D32F2F]")}
    />
  )
}

function KeywordsEdit({ value, onSave, pending = false }: { value: string[]; onSave: (v: string[]) => Promise<void>; pending?: boolean }) {
  const [editing, setEditing] = useState(false)
  const [raw, setRaw]         = useState(value.join(", "))
  const [err, setErr]         = useState<string | null>(null)
  const committedRef = useRef(false)

  const commit = async () => {
    if (committedRef.current) return
    committedRef.current = true
    const arr = raw.split(",").map((s) => s.trim()).filter(Boolean)
    // Unchanged → just close, don't stage
    if (arr.join(" ") === value.join(" ")) { setEditing(false); return }
    try { await onSave(arr); setEditing(false) }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : "Error"); committedRef.current = false }
  }
  const cancel = () => { committedRef.current = true; setEditing(false); setErr(null) }

  if (!editing) {
    return (
      <button onClick={() => { setRaw(value.join(", ")); setEditing(true); committedRef.current = false }}
        className={cn("w-full text-left text-sm transition-colors truncate block",
          pending ? PENDING_TEXT : "text-[#555555] hover:text-[#0066CC]")}
        title={value.join(", ") || "Click to add"}>
        {value.length > 0 ? value.join(", ") : <span className="text-[#BDBDBD] italic">none</span>}
      </button>
    )
  }
  return (
    <input autoFocus value={raw} onChange={(e) => setRaw(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel() }}
      placeholder="kl, klcc, pj"
      className={cn(INLINE_EDIT, "px-4 text-left text-[#1A1A1A]", err && "ring-[#D32F2F]")}
    />
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-[#E0E0E0] bg-[#FAFAFA]">
      <Database className="h-8 w-8 text-[#BDBDBD] mb-3" />
      <p className="text-sm text-[#9E9E9E] max-w-xs">{message}</p>
    </div>
  )
}

// Shared save footer
function SaveFooter({ pendingCount, saving, saveOk, saveErr, onSave, onDiscard, helpText }: {
  pendingCount: number; saving: boolean; saveOk: boolean; saveErr: string | null
  onSave: () => void; onDiscard: () => void; helpText?: string
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#E0E0E0] bg-[#FAFAFA]">
      <p className="text-xs text-[#9E9E9E]">{helpText ?? "Click any value to edit · staged edits show in yellow"}</p>
      <div className="flex items-center gap-2">
        {saveOk && <span className="text-xs text-[#00A651] flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Saved</span>}
        {saveErr && <span className="text-xs text-[#D32F2F] flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> {saveErr}</span>}
        {pendingCount > 0 && (
          <button onClick={onDiscard} className="text-xs text-[#9E9E9E] hover:text-[#555555]">Discard all</button>
        )}
        <Button size="sm" onClick={onSave} disabled={pendingCount === 0 || saving}
          className={cn("gap-1.5 h-8 text-xs", pendingCount > 0 ? "bg-[#0066CC] hover:bg-[#004EA8] text-white" : "bg-[#E0E0E0] text-[#9E9E9E] cursor-not-allowed")}>
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save All {pendingCount > 0 && <span className="ml-0.5 bg-white/25 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
        </Button>
      </div>
    </div>
  )
}

// ─── Tab: Building Rates ──────────────────────────────────────────────────────

function BuildingRatesTab({ rows, countryCode, onSaved }: {
  rows: BuildingRateRow[]; countryCode: string; onSaved: () => void
}) {
  const safeRows    = rows ?? []
  const propTypes   = [...new Set(safeRows.map((r) => r.propertySubType))]
  const constrTypes = [...new Set(safeRows.map((r) => r.constructionType))]

  const [pending, setPending] = useState<Record<string, number>>({})
  const [saving, setSaving]   = useState(false)
  const [saveOk, setSaveOk]   = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)

  const pendingCount = Object.keys(pending).length

  const stageEdit = (id: string, value: number): Promise<void> => {
    setPending((p) => ({ ...p, [id]: value })); return Promise.resolve()
  }

  const handleSave = async () => {
    if (pendingCount === 0) return
    setSaving(true); setSaveErr(null); setSaveOk(false)
    try {
      await updateBuildingRates(Object.entries(pending).map(([id, ratePerUnit]) => ({ id, ratePerUnit })), countryCode)
      setPending({}); setSaveOk(true); setTimeout(() => setSaveOk(false), 3000); onSaved()
    } catch (e: unknown) { setSaveErr(e instanceof Error ? e.message : "Save failed") }
    finally { setSaving(false) }
  }

  const propertyLabel     = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  const constructionLabel = (s: string) => s === "full-brick" ? "Full Brick" : s === "partial-brick" ? "Partial Brick" : s

  if (safeRows.length === 0) return <EmptyState message="No construction rates found. Try seeding this country first." />

  return (
    <div className="rounded-xl overflow-hidden border border-[#E0E0E0] bg-white shadow-sm">
      <div className="px-4 py-3 bg-[#E0F0FF] border-b border-[#BFDBFE] text-xs text-[#0066CC] flex items-start gap-2">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          These rates determine the per-unit construction cost used to calculate the building sum insured
          and premium for new and renewed quotations. Changes apply to quotations created after saving and
          do not retroactively affect existing policies.
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#FAFAFA]">
              <th className={TH}>Property Type</th>
              {constrTypes.map((ct) => <th key={ct} className={TH_R}>{constructionLabel(ct)}</th>)}
            </tr>
          </thead>
          <tbody>
            {propTypes.map((pt) => (
              <tr key={pt} className="hover:bg-[#FAFAFA] transition-colors">
                <td className={cn(TD, "font-medium text-[#1A1A1A]")}>{propertyLabel(pt)}</td>
                {constrTypes.map((ct) => {
                  const row = safeRows.find((r) => r.propertySubType === pt && r.constructionType === ct)
                  if (!row) return <td key={ct} className={cn(TD, "text-right text-[#BDBDBD]")}>—</td>
                  const hasPending = row.id in pending
                  return (
                    <td key={ct} className={TD}>
                      <div className="flex justify-end">
                        <EditCell value={hasPending ? pending[row.id] : row.ratePerUnit} onSave={(v) => stageEdit(row.id, v)} decimals={0} pending={hasPending} />
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SaveFooter pendingCount={pendingCount} saving={saving} saveOk={saveOk} saveErr={saveErr} onSave={handleSave} onDiscard={() => { setPending({}); setSaveErr(null) }} />
    </div>
  )
}

// ─── Tab: Region Config ───────────────────────────────────────────────────────

type RegionPending = Partial<Pick<RegionConfigRow, "areaMin" | "areaMax" | "storeyIncrementPct" | "maxStoreys" | "professionalFeeRate" | "benchmarkYear" | "buildingRate" | "contentRate">>

function RegionConfigTab({ config, countryCode, onSaved }: {
  config: RegionConfigRow | null; countryCode: string; onSaved: () => void
}) {
  const [pending, setPending] = useState<RegionPending>({})
  const [saving, setSaving]   = useState(false)
  const [saveOk, setSaveOk]   = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const pendingCount = Object.keys(pending).length

  const stage = (field: keyof RegionPending, value: number): Promise<void> => {
    setPending((p) => ({ ...p, [field]: value })); return Promise.resolve()
  }
  const handleSave = async () => {
    if (!config || pendingCount === 0) return
    setSaving(true); setSaveErr(null); setSaveOk(false)
    try {
      await updateRegionConfig(config.id, pending, countryCode)
      setPending({}); setSaveOk(true); setTimeout(() => setSaveOk(false), 3000); onSaved()
    } catch (e: unknown) { setSaveErr(e instanceof Error ? e.message : "Save failed") }
    finally { setSaving(false) }
  }

  if (!config) return <EmptyState message="No region config found. Try seeding this country first." />

  const val = <K extends keyof RegionPending>(f: K) => (f in pending ? pending[f] : config[f]) as number
  const FIELDS: { field: keyof RegionPending; label: string; isPct: boolean; decimals?: number }[] = [
    { field: "areaMin",             label: "Min Area",      isPct: false },
    { field: "areaMax",             label: "Max Area",      isPct: false },
    { field: "storeyIncrementPct",  label: "Storey Inc %",  isPct: true  },
    { field: "maxStoreys",          label: "Max Storeys",   isPct: false },
    { field: "professionalFeeRate", label: "Prof Fee %",    isPct: true  },
    { field: "benchmarkYear",       label: "Benchmark Yr",  isPct: false },
    { field: "buildingRate",        label: "Building Rate", isPct: false, decimals: 6 },
    { field: "contentRate",         label: "Content Rate",  isPct: false, decimals: 6 },
  ]

  return (
    <div className="rounded-xl overflow-hidden border border-[#E0E0E0] bg-white shadow-sm">
      <div className="px-4 py-3 bg-[#E0F0FF] border-b border-[#BFDBFE] text-xs text-[#0066CC] flex items-start gap-2">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          These settings define the valid building area range, the storey/professional-fee adjustments,
          and the benchmark year used when calculating the sum insured for new and renewed quotations.
          Changes apply to quotations created after saving and do not retroactively affect existing policies.
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#FAFAFA]">
              <th className={TH}>Unit</th>
              {FIELDS.map((f) => <th key={f.field} className={TH_R}>{f.label}</th>)}
              <th className={cn(TH, "w-12 text-center")}>·</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-[#FAFAFA] transition-colors">
              <td className={TD}>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F5F5F5] text-[#555555] text-xs font-mono border border-[#E0E0E0]">{config.areaUnit}</span>
              </td>
              {FIELDS.map(({ field, isPct, decimals }) => (
                <td key={field} className={TD}>
                  <div className="flex justify-end">
                    <EditCell value={val(field)} onSave={(v) => stage(field, v)} decimals={decimals ?? (isPct ? 2 : 0)} isPct={isPct} pending={field in pending} />
                  </div>
                </td>
              ))}
              <td className={cn(TD, "w-12")}>
                <RowMenu items={[{ label: "Revert all", icon: <RotateCcw className="h-3.5 w-3.5" />, onClick: () => { setPending({}); setSaveErr(null) } }]} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <SaveFooter pendingCount={pendingCount} saving={saving} saveOk={saveOk} saveErr={saveErr} onSave={handleSave} onDiscard={() => { setPending({}); setSaveErr(null) }} />
    </div>
  )
}

// ─── Tab: Location Tiers ──────────────────────────────────────────────────────

const TIER_BADGE: Record<string, string> = {
  prime: "bg-[#FEF3DC] text-[#D4891A] border-[#F5C896]",
  urban: "bg-[#E0F0FF] text-[#0066CC] border-[#BFDBFE]",
  rural: "bg-[#E6F7EE] text-[#00A651] border-[#86EFAC]",
}

// Lets an admin search the same province/city lists used in the building
// calculator and add a real location name as a tier-matching keyword.
function LocationKeywordPicker({ countryCode, existing, onAdd }: {
  countryCode: string; existing: string[]; onAdd: (label: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [provinces, setProvinces] = useState<{ value: string; label: string }[]>([])
  const [cities, setCities] = useState<{ value: string; label: string }[]>([])
  const [loadingProv, setLoadingProv] = useState(false)
  const [loadingCity, setLoadingCity] = useState(false)
  const [selProv, setSelProv] = useState("")
  const [selCity, setSelCity] = useState("")

  useEffect(() => {
    if (!open || provinces.length > 0) return
    let active = true
    setLoadingProv(true)
    const load = async () => {
      try {
        if (countryCode === "ID") {
          const r = await fetchIdProvinces()
          if (active) setProvinces(r.map((p) => ({ value: p.id, label: p.text })))
        } else if (countryCode === "PH") {
          const r = await fetchPhProvinces()
          if (active) setProvinces(r.map((p) => ({ value: p.code, label: p.name })))
        } else if (countryCode === "KH") {
          const r = await fetchKhProvinces()
          if (active) setProvinces(r.map((p) => ({ value: p.id, label: p.name.latin })))
        }
      } finally { if (active) setLoadingProv(false) }
    }
    load()
    return () => { active = false }
  }, [open, countryCode, provinces.length])

  const handleProvince = async (value: string) => {
    setSelProv(value); setSelCity(""); setCities([])
    setLoadingCity(true)
    try {
      if (countryCode === "ID") {
        const r = await fetchIdCities(value)
        setCities(r.map((c) => ({ value: c.id, label: c.text })))
      } else if (countryCode === "PH") {
        const r = await fetchPhCities(value)
        setCities(r.map((c) => ({ value: c.code, label: c.name })))
      } else if (countryCode === "KH") {
        const r = await fetchKhDistricts(value)
        setCities(r.map((c) => ({ value: c.id, label: c.name.latin })))
      }
    } finally { setLoadingCity(false) }
  }

  const provLabel = provinces.find((p) => p.value === selProv)?.label
  const cityLabel = cities.find((c) => c.value === selCity)?.label

  const add = (label?: string) => {
    if (!label) return
    if (!existing.some((k) => k.toLowerCase() === label.toLowerCase())) onAdd(label)
    setOpen(false); setSelProv(""); setSelCity(""); setCities([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" title="Add location from list"
          className="shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-md border border-[#E0E0E0] text-[#9E9E9E] hover:text-[#0066CC] hover:border-[#0066CC] transition-colors">
          <MapPin className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 space-y-2" align="start">
        <p className="text-xs text-[#9E9E9E]">Add a province/city as a keyword</p>
        <Select value={selProv} onValueChange={handleProvince}>
          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={loadingProv ? "Loading…" : "Province"} /></SelectTrigger>
          <SelectContent>
            {provinces.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {selProv && (
          <Select value={selCity} onValueChange={setSelCity}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={loadingCity ? "Loading…" : "City / Regency (optional)"} /></SelectTrigger>
            <SelectContent>
              {cities.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="outline" className="h-7 text-xs flex-1" disabled={!provLabel} onClick={() => add(provLabel)}>
            Add province
          </Button>
          {cityLabel && (
            <Button size="sm" variant="outline" className="h-7 text-xs flex-1" onClick={() => add(cityLabel)}>
              Add city
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

type TierPending = Record<string, { multiplier?: number; label?: string; keywords?: string[] }>

function LocationTiersTab({ rows, countryCode, onSaved }: {
  rows: LocationTierRow[]; countryCode: string; onSaved: () => void
}) {
  const safeRows = rows ?? []
  const [pending, setPending] = useState<TierPending>({})
  const [saving, setSaving]   = useState(false)
  const [saveOk, setSaveOk]   = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const pendingCount = Object.keys(pending).length

  const stage = (id: string, patch: { multiplier?: number; label?: string; keywords?: string[] }): Promise<void> => {
    setPending((p) => ({ ...p, [id]: { ...p[id], ...patch } })); return Promise.resolve()
  }
  const handleSave = async () => {
    if (pendingCount === 0) return
    setSaving(true); setSaveErr(null); setSaveOk(false)
    try {
      await updateLocationTiersBatch(Object.entries(pending).map(([id, data]) => ({ id, ...data })), countryCode)
      setPending({}); setSaveOk(true); setTimeout(() => setSaveOk(false), 3000); onSaved()
    } catch (e: unknown) { setSaveErr(e instanceof Error ? e.message : "Save failed") }
    finally { setSaving(false) }
  }

  if (safeRows.length === 0) return <EmptyState message="No location tiers found. Try seeding this country first." />

  return (
    <div className="rounded-xl overflow-hidden border border-[#E0E0E0] bg-white shadow-sm">
      <div className="px-4 py-3 bg-[#E0F0FF] border-b border-[#BFDBFE] text-xs text-[#0066CC] flex items-start gap-2">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          The multiplier for each tier is applied to the base premium when a quotation&apos;s address matches
          one of that tier&apos;s keywords. Changes apply to quotations created after saving and do not
          retroactively affect existing policies.
        </span>
      </div>
      <table className="w-full text-sm border-separate border-spacing-0 table-fixed">
        <colgroup>
          {/* Tier */}
          <col style={{ width: "110px" }} />
          {/* Label */}
          <col style={{ width: "26%" }} />
          {/* Multiplier */}
          <col style={{ width: "120px" }} />
          {/* Keywords — takes the rest */}
          <col />
          {/* Actions */}
          <col style={{ width: "52px" }} />
        </colgroup>
        <thead>
          <tr className="bg-[#FAFAFA]">
            <th className={TH}>Tier</th>
            <th className={TH}>Label</th>
            <th className={TH_R}>Multiplier</th>
            <th className={TH}>Keywords</th>
            <th className={cn(TH, "text-center")}>·</th>
          </tr>
        </thead>
        <tbody>
          {safeRows.map((row) => {
            const p = pending[row.id] ?? {}
            return (
              <tr key={row.id} className="hover:bg-[#FAFAFA] transition-colors">
                <td className={TD}>
                  <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", TIER_BADGE[row.tier] ?? "bg-[#F5F5F5] text-[#555555] border-[#E0E0E0]")}>
                    {row.tier.charAt(0).toUpperCase() + row.tier.slice(1)}
                  </span>
                </td>
                <td className={TD}><LabelEdit value={p.label ?? row.label} onSave={(v) => stage(row.id, { label: v })} pending={"label" in p} /></td>
                <td className={TD}>
                  <div className="flex justify-end">
                    <EditCell value={p.multiplier ?? row.multiplier} onSave={(v) => stage(row.id, { multiplier: v })} decimals={4} pending={"multiplier" in p} />
                  </div>
                </td>
                <td className={TD}>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 min-w-0">
                      <KeywordsEdit value={p.keywords ?? row.keywords ?? []} onSave={(v) => stage(row.id, { keywords: v })} pending={"keywords" in p} />
                    </div>
                    <LocationKeywordPicker
                      countryCode={countryCode}
                      existing={p.keywords ?? row.keywords ?? []}
                      onAdd={(label) => stage(row.id, { keywords: [...(p.keywords ?? row.keywords ?? []), label] })}
                    />
                  </div>
                </td>
                <td className={TD}>
                  <RowMenu items={[{ label: "Revert row", icon: <RotateCcw className="h-3.5 w-3.5" />, onClick: () => setPending((pp) => { const n = { ...pp }; delete n[row.id]; return n }) }]} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <SaveFooter pendingCount={pendingCount} saving={saving} saveOk={saveOk} saveErr={saveErr} onSave={handleSave} onDiscard={() => { setPending({}); setSaveErr(null) }} />
    </div>
  )
}

// ─── Tab: Risk Multipliers ────────────────────────────────────────────────────

function RiskMultipliersTab({ rows, countryCode, onSaved }: {
  rows: RiskMultiplierRow[]; countryCode: string; onSaved: () => void
}) {
  const safeRows = rows ?? []
  const [pending, setPending] = useState<Record<string, number>>({})
  const [saving, setSaving]   = useState(false)
  const [saveOk, setSaveOk]   = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const pendingCount = Object.keys(pending).length

  const handleSave = async () => {
    if (pendingCount === 0) return
    setSaving(true); setSaveErr(null); setSaveOk(false)
    try {
      await updateRiskMultipliersBatch(Object.entries(pending).map(([id, multiplier]) => ({ id, multiplier })), countryCode)
      setPending({}); setSaveOk(true); setTimeout(() => setSaveOk(false), 3000); onSaved()
    } catch (e: unknown) { setSaveErr(e instanceof Error ? e.message : "Save failed") }
    finally { setSaving(false) }
  }

  if (safeRows.length === 0) return <EmptyState message="No risk multipliers found. Try seeding this country first." />

  return (
    <div className="rounded-xl overflow-hidden border border-[#E0E0E0] bg-white shadow-sm">
      <div className="px-4 py-3 bg-[#E0F0FF] border-b border-[#BFDBFE] text-xs text-[#0066CC] flex items-start gap-2">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          Each multiplier is applied to the base premium when a quotation matches the corresponding risk
          factor (e.g. flood zone, building age). Changes apply to quotations created after saving and do
          not retroactively affect existing policies.
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#FAFAFA]">
              <th className={TH}>Factor Key</th>
              <th className={TH}>Description</th>
              <th className={TH_R}>Multiplier</th>
              <th className={cn(TH, "w-12 text-center")}>·</th>
            </tr>
          </thead>
          <tbody>
            {safeRows.map((row) => {
              const hasPending = row.id in pending
              return (
                <tr key={row.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className={TD}>
                    <span className="font-mono text-xs bg-[#F5F5F5] text-[#555555] px-2 py-0.5 rounded border border-[#E0E0E0]">{row.factorKey}</span>
                  </td>
                  <td className={cn(TD, "text-[#555555] text-xs")}>{row.description}</td>
                  <td className={TD}>
                    <div className="flex justify-end">
                      <EditCell value={hasPending ? pending[row.id] : row.multiplier} onSave={(v) => { setPending((p) => ({ ...p, [row.id]: v })); return Promise.resolve() }} decimals={4} pending={hasPending} />
                    </div>
                  </td>
                  <td className={cn(TD, "w-12")}>
                    <RowMenu items={[{ label: "Revert", icon: <RotateCcw className="h-3.5 w-3.5" />, onClick: () => setPending((p) => { const n = { ...p }; delete n[row.id]; return n }) }]} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <SaveFooter pendingCount={pendingCount} saving={saving} saveOk={saveOk} saveErr={saveErr} onSave={handleSave} onDiscard={() => { setPending({}); setSaveErr(null) }} />
    </div>
  )
}

// ─── Diff value renderer ──────────────────────────────────────────────────────

function DiffValue({ raw, mode }: { raw: string; mode: "old" | "new" }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = raw.length > 60
  const display = isLong && !expanded ? `${raw.slice(0, 60).trim()}…` : raw
  const cls = mode === "old" ? "text-[#D32F2F] line-through decoration-[#D32F2F]/60" : "text-[#00A651] font-medium"
  return (
    <span className="inline-flex flex-col gap-0.5">
      <span className={cn("text-xs font-mono break-all", cls)}>{display}</span>
      {isLong && (
        <button onClick={() => setExpanded((v) => !v)} className="text-[10px] text-[#0066CC] hover:underline self-start">
          {expanded ? "Show less" : `+${raw.length - 60} chars`}
        </button>
      )}
    </span>
  )
}

// ─── Tab: History ─────────────────────────────────────────────────────────────

const SNAP_BADGE: Record<string, string> = {
  auto:     "bg-[#E0F0FF] text-[#0066CC] border-[#BFDBFE]",
  manual:   "bg-[#FEF3DC] text-[#D4891A] border-[#F5C896]",
  restored: "bg-[#E6F7EE] text-[#00A651] border-[#86EFAC]",
}

function HistoryTab({ countryCode, onRestored }: { countryCode: string; onRestored: () => void }) {
  const [snapshots, setSnapshots]         = useState<SnapshotListItem[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState<string | null>(null)
  const [detail, setDetail]               = useState<SnapshotDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError]     = useState<string | null>(null)
  const [restoringId, setRestoringId]     = useState<string | null>(null)
  const [restoreNote, setRestoreNote]     = useState("")
  const [restoring, setRestoring]         = useState(false)
  const [restoreOk, setRestoreOk]         = useState<string | null>(null)
  const [restoreErr, setRestoreErr]       = useState<string | null>(null)
  const [filterType, setFilterType]       = useState("all")
  const [filterFrom, setFilterFrom]       = useState("")
  const [filterTo, setFilterTo]           = useState("")

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try { setSnapshots(await fetchSnapshots(countryCode)) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed") }
    finally { setLoading(false) }
  }, [countryCode])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    let list = snapshots
    if (filterType !== "all") list = list.filter((s) => s.snapshotType === filterType)
    if (filterFrom) list = list.filter((s) => new Date(s.createdAt) >= new Date(filterFrom))
    if (filterTo)   list = list.filter((s) => new Date(s.createdAt) <= new Date(filterTo + "T23:59:59"))
    return list
  }, [snapshots, filterType, filterFrom, filterTo])

  const handleViewDetail = async (id: string) => {
    if (detail?.id === id) { setDetail(null); return }
    setDetailLoading(true); setDetailError(null)
    try { setDetail(await fetchSnapshot(id, countryCode)) }
    catch (e: unknown) { setDetailError(e instanceof Error ? e.message : "Failed") }
    finally { setDetailLoading(false) }
  }
  const handleRestore = async () => {
    if (!restoringId) return
    setRestoring(true); setRestoreErr(null); setRestoreOk(null)
    try {
      const r = await restoreSnapshot(restoringId, restoreNote || undefined, countryCode)
      setRestoreOk(r.message); setRestoringId(null); setRestoreNote("")
      await load(); onRestored(); setTimeout(() => setRestoreOk(null), 5000)
    } catch (e: unknown) { setRestoreErr(e instanceof Error ? e.message : "Failed") }
    finally { setRestoring(false) }
  }

  if (loading) return <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-[#E0E0E0] animate-pulse" />)}</div>
  if (error) return (
    <div className="flex items-center gap-3 rounded-xl border border-[#FECACA] bg-[#FFEBEE] px-4 py-3">
      <AlertCircle className="h-4 w-4 text-[#D32F2F] shrink-0" />
      <p className="text-sm text-[#D32F2F]">{error}</p>
      <Button size="sm" variant="outline" onClick={load} className="ml-auto">Retry</Button>
    </div>
  )

  return (
    <div className="space-y-4">
      {restoreOk && (
        <div className="flex items-center gap-2 rounded-xl bg-[#E6F7EE] border border-[#86EFAC] px-4 py-3 text-sm text-[#00A651]">
          <CheckCircle2 className="h-4 w-4" /> {restoreOk}
        </div>
      )}
      <div className="flex items-center gap-3 flex-wrap px-3 py-2.5 bg-[#FAFAFA] rounded-xl border border-[#E0E0E0]">
        <Filter className="h-4 w-4 text-[#9E9E9E]" />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="h-8 w-36 text-xs border-[#E0E0E0]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="restored">Restored</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#555555]">From</span>
          <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)}
            className="h-8 rounded-lg border border-[#E0E0E0] px-2 text-xs bg-white focus:outline-none focus:border-[#F5A623]" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#555555]">To</span>
          <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)}
            className="h-8 rounded-lg border border-[#E0E0E0] px-2 text-xs bg-white focus:outline-none focus:border-[#F5A623]" />
        </div>
        {(filterType !== "all" || filterFrom || filterTo) && (
          <button onClick={() => { setFilterType("all"); setFilterFrom(""); setFilterTo("") }} className="flex items-center gap-1 text-xs text-[#9E9E9E] hover:text-[#555555]">
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
        <span className="text-xs text-[#9E9E9E] ml-auto">{filtered.length} of {snapshots.length}</span>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 rounded-xl border border-dashed border-[#E0E0E0] bg-[#FAFAFA]">
          <History className="h-8 w-8 text-[#BDBDBD] mb-3" />
          <p className="text-sm text-[#9E9E9E]">No snapshots match your filters.</p>
        </div>
      )}

      {filtered.map((snap) => {
        const isExpanded  = detail?.id === snap.id
        const isRestoring = restoringId === snap.id
        return (
          <div key={snap.id} className="rounded-xl border border-[#E0E0E0] overflow-hidden shadow-sm bg-white">
            <div className={cn("flex items-center gap-4 px-5 py-4 transition-colors", isExpanded ? "bg-[#EFF6FF] border-b border-[#BFDBFE]" : "hover:bg-[#FAFAFA]")}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A1A] truncate">{snap.label}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-[#9E9E9E]">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{snap.createdBy}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{fmtDate(snap.createdAt)}</span>
                </div>
              </div>
              <span className={cn("shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full border", SNAP_BADGE[snap.snapshotType] ?? SNAP_BADGE.auto)}>
                {snap.snapshotType.charAt(0).toUpperCase() + snap.snapshotType.slice(1)}
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleViewDetail(snap.id)} className="text-xs h-8 border-[#E0E0E0] hover:border-[#0066CC] hover:text-[#0066CC]">
                  {isExpanded ? "Hide" : "View Changes"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setRestoringId(isRestoring ? null : snap.id); setRestoreNote(""); setRestoreErr(null) }} className="text-xs h-8 border-[#FDE68A] text-[#D97706] hover:bg-[#FFFBEB]">
                  <RotateCcw className="h-3 w-3 mr-1" /> Restore
                </Button>
              </div>
            </div>

            {isRestoring && (
              <div className="px-5 py-4 bg-[#FFFBEB] border-b border-[#FDE68A]">
                <p className="text-sm font-semibold text-[#D97706] mb-3">⚠️ This will immediately overwrite the live config for this region.</p>
                <div className="flex items-center gap-2">
                  <Input value={restoreNote} onChange={(e) => setRestoreNote(e.target.value)} placeholder="Optional note" className="text-sm h-8 flex-1 border-[#E0E0E0]" />
                  <Button size="sm" onClick={handleRestore} disabled={restoring} className="bg-[#D97706] hover:bg-[#B45309] text-white h-8">
                    {restoring ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />} Confirm
                  </Button>
                  <button onClick={() => setRestoringId(null)} className="text-xs text-[#9E9E9E] hover:text-[#555555] px-2">Cancel</button>
                </div>
                {restoreErr && <p className="text-xs text-[#D32F2F] mt-2">{restoreErr}</p>}
              </div>
            )}

            {isExpanded && (
              <div className="px-5 py-4">
                {detailLoading && <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-[#9E9E9E]" /></div>}
                {detailError && <p className="text-sm text-[#D32F2F]">{detailError}</p>}
                {detail && detail.changeLogs.length === 0 && <p className="text-sm text-[#9E9E9E] text-center py-4">No field-level changes recorded.</p>}
                {detail && detail.changeLogs.length > 0 && (
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAFAFA]">
                        <th className="text-left py-2 px-3 font-semibold text-[#555555] w-1/3 border border-[#E0E0E0]">Field</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#D32F2F] border border-[#E0E0E0]">Old Value</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#00A651] border border-[#E0E0E0]">New Value</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#9E9E9E] whitespace-nowrap border border-[#E0E0E0]">Changed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.changeLogs.map((log, idx) => (
                        <tr key={log.id || idx} className="hover:bg-[#FAFAFA]">
                          <td className="py-2 px-3 font-mono text-[#555555] border border-[#E0E0E0]">{log.fieldName}</td>
                          <td className="py-2 px-3 max-w-[200px] border border-[#E0E0E0]"><DiffValue raw={log.oldValue} mode="old" /></td>
                          <td className="py-2 px-3 max-w-[200px] border border-[#E0E0E0]"><DiffValue raw={log.newValue} mode="new" /></td>
                          <td className="py-2 px-3 text-[#9E9E9E] whitespace-nowrap border border-[#E0E0E0]">{fmtDate(log.changedAt)}</td>
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

const ALL_CATEGORIES = Object.values(TABLE_CATEGORY)

function ChangeLogTab({ countryCode }: { countryCode: string }) {
  const PAGE_SIZE = 50
  const [allLogs, setAllLogs]   = useState<ChangeLogEntry[]>([])
  const [page, setPage]         = useState(1)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [hasMore, setHasMore]   = useState(true)
  const [search, setSearch]     = useState("")
  const [filterCat, setFilterCat] = useState("all")
  const [filterFrom, setFilterFrom] = useState("")
  const [filterTo, setFilterTo]     = useState("")

  const load = useCallback(async (p: number) => {
    setLoading(true); setError(null)
    try {
      const data = await fetchChangeLogs(countryCode, p, PAGE_SIZE)
      setAllLogs(data ?? []); setHasMore((data ?? []).length === PAGE_SIZE)
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed") }
    finally { setLoading(false) }
  }, [countryCode])

  useEffect(() => { setPage(1); load(1) }, [load])

  const filtered = useMemo(() => {
    let list = allLogs
    if (filterCat !== "all") {
      const tblKey = Object.entries(TABLE_CATEGORY).find(([, v]) => v === filterCat)?.[0]
      if (tblKey) list = list.filter((l) => l.tableName === tblKey)
    }
    if (filterFrom) list = list.filter((l) => new Date(l.changedAt) >= new Date(filterFrom))
    if (filterTo)   list = list.filter((l) => new Date(l.changedAt) <= new Date(filterTo + "T23:59:59"))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((l) => l.fieldName.toLowerCase().includes(q) || l.changedBy.toLowerCase().includes(q))
    }
    return list
  }, [allLogs, filterCat, filterFrom, filterTo, search])

  const hasFilter = search || filterCat !== "all" || filterFrom || filterTo

  if (error) return (
    <div className="flex items-center gap-3 rounded-xl border border-[#FECACA] bg-[#FFEBEE] px-4 py-3">
      <AlertCircle className="h-4 w-4 text-[#D32F2F]" />
      <p className="text-sm text-[#D32F2F]">{error}</p>
      <Button size="sm" variant="outline" onClick={() => load(page)} className="ml-auto">Retry</Button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap px-3 py-2.5 bg-[#FAFAFA] rounded-xl border border-[#E0E0E0]">
        <Filter className="h-4 w-4 text-[#9E9E9E]" />
        <div className="relative min-w-[160px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9E9E9E]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Field, user…"
            className="w-full h-8 pl-8 pr-3 rounded-lg border border-[#E0E0E0] text-xs bg-white focus:outline-none focus:border-[#F5A623]" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="h-8 w-44 text-xs border-[#E0E0E0]"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {ALL_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#555555]">From</span>
          <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)}
            className="h-8 rounded-lg border border-[#E0E0E0] px-2 text-xs bg-white focus:outline-none focus:border-[#F5A623]" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#555555]">To</span>
          <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)}
            className="h-8 rounded-lg border border-[#E0E0E0] px-2 text-xs bg-white focus:outline-none focus:border-[#F5A623]" />
        </div>
        {hasFilter && (
          <button onClick={() => { setSearch(""); setFilterCat("all"); setFilterFrom(""); setFilterTo("") }} className="flex items-center gap-1 text-xs text-[#9E9E9E] hover:text-[#555555]">
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
        <span className="text-xs text-[#9E9E9E] ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="rounded-xl overflow-hidden border border-[#E0E0E0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className={TH}>Category</th>
                <th className={TH}>Field</th>
                <th className={TH}>Old Value</th>
                <th className={TH}>New Value</th>
                <th className={TH}>Changed By</th>
                <th className={cn(TH, "whitespace-nowrap")}>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center border-b border-[#E0E0E0]"><Loader2 className="h-5 w-5 animate-spin text-[#9E9E9E] mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-[#9E9E9E] border-b border-[#E0E0E0]">
                  {hasFilter ? "No results match your filters." : "No changes recorded yet."}
                </td></tr>
              ) : filtered.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className={TD}>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#E0F0FF] text-[#0066CC] border border-[#BFDBFE] whitespace-nowrap">
                      {TABLE_CATEGORY[log.tableName] ?? log.tableName}
                    </span>
                  </td>
                  <td className={cn(TD, "font-mono text-xs text-[#555555] max-w-[160px]")}>
                    <span className="truncate block" title={log.fieldName}>{log.fieldName}</span>
                  </td>
                  <td className={cn(TD, "max-w-[180px]")}><DiffValue raw={log.oldValue} mode="old" /></td>
                  <td className={cn(TD, "max-w-[180px]")}><DiffValue raw={log.newValue} mode="new" /></td>
                  <td className={cn(TD, "text-sm text-[#555555]")}>{log.changedBy}</td>
                  <td className={cn(TD, "text-xs text-[#9E9E9E] whitespace-nowrap")}>{fmtDate(log.changedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E0E0E0] bg-[#FAFAFA]">
          <span className="text-xs text-[#9E9E9E]">Page {page} · up to {PAGE_SIZE} per page</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => { const p = page - 1; setPage(p); load(p) }} disabled={page === 1 || loading} className="h-7 px-2 border-[#E0E0E0] hover:border-[#0066CC] hover:text-[#0066CC]">
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-semibold text-[#1A1A1A] px-1">{page}</span>
            <Button size="sm" variant="outline" onClick={() => { const p = page + 1; setPage(p); load(p) }} disabled={!hasMore || loading} className="h-7 px-2 border-[#E0E0E0] hover:border-[#0066CC] hover:text-[#0066CC]">
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Seed section ─────────────────────────────────────────────────────────────

function SeedSection({ activeCountry, onSeeded }: { activeCountry: CountryCode; onSeeded: () => void }) {
  const [state, setState]       = useState<"idle" | "loading" | "done" | "already" | "error">("idle")
  const [msg, setMsg]           = useState("")
  const [expanded, setExpanded] = useState(false)

  const handleSeed = async () => {
    setState("loading"); setMsg("")
    try {
      const r = await seedRateConfig(activeCountry)
      setState(r.seeded ? "done" : "already"); setMsg(r.message)
      if (r.seeded) onSeeded()
      setTimeout(() => setState("idle"), 4000)
    } catch (e: unknown) {
      setState("error"); setMsg(e instanceof Error ? e.message : "Seed failed")
      setTimeout(() => setState("idle"), 4000)
    }
  }

  return (
    <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] overflow-hidden">
      <button onClick={() => setExpanded((v) => !v)} className="w-full px-5 py-4 flex items-center justify-between text-left">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-[#D97706]" />
          <span className="font-semibold text-sm text-[#D97706]">Seed Initial Data</span>
          <span className="text-xs text-[#D97706] bg-[#FEF3DC] border border-[#FDE68A] px-2 py-0.5 rounded-full">Safe to re-run</span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-[#D97706]" /> : <ChevronDown className="h-4 w-4 text-[#D97706]" />}
      </button>
      {expanded && (
        <div className="px-5 pb-5">
          <p className="text-sm text-[#D97706] mb-4">Seeds default rates for <strong>{COUNTRY_LABELS[activeCountry]}</strong> if they don&apos;t exist yet.</p>
          <div className="flex items-center gap-3">
            <button onClick={handleSeed} disabled={state === "loading"}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                state === "done"    && "bg-[#E6F7EE] border-[#86EFAC] text-[#00A651]",
                state === "already" && "bg-[#E0F0FF] border-[#BFDBFE] text-[#0066CC]",
                state === "error"   && "bg-[#FFEBEE] border-[#FECACA] text-[#D32F2F]",
                state === "loading" && "bg-[#FAFAFA] border-[#E0E0E0] text-[#9E9E9E] cursor-not-allowed",
                state === "idle"    && "bg-white border-[#FDE68A] text-[#D97706] hover:bg-[#FFFBEB]",
              )}>
              {state === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {(state === "done" || state === "already") && <CheckCircle2 className="h-3.5 w-3.5" />}
              {state === "error" && <AlertCircle className="h-3.5 w-3.5" />}
              {state === "idle"  && <Database className="h-3.5 w-3.5" />}
              Seed {COUNTRY_LABELS[activeCountry]}
            </button>
            {msg && <span className={cn("text-xs", state === "done" && "text-[#00A651]", state === "already" && "text-[#0066CC]", state === "error" && "text-[#D32F2F]")}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ModifyConfigPage() {
  // Country comes from the session — each admin only sees their own region
  const session       = getSession()
  const activeCountry = (session?.countryCode?.toUpperCase() ?? "ID") as CountryCode

  const [activeTab, setActiveTab] = useState("building-rates")
  const [data, setData]           = useState<RateConfigsResponse | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try { setData(await fetchRateConfigs(activeCountry)) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to load config"); setData(null) }
    finally { setLoading(false) }
  }, [activeCountry])

  useEffect(() => { load() }, [load])

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FEF3DC] rounded-lg"><SlidersHorizontal className="h-5 w-5 text-[#F5A623]" /></div>
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">Modify Config</h1>
            <p className="text-sm text-[#555555]">{COUNTRY_LABELS[activeCountry]} · Building rates, region settings &amp; risk factors</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2 border-[#E0E0E0] text-[#555555] hover:border-[#F5A623] hover:text-[#F5A623] hover:bg-[#FEF3DC]">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      <SeedSection activeCountry={activeCountry} onSeeded={load} />

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-[#FECACA] bg-[#FFEBEE] px-4 py-3">
          <AlertCircle className="h-5 w-5 text-[#D32F2F] shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#D32F2F]">Failed to load configuration</p>
            <p className="text-xs text-[#D32F2F]/80">{error}</p>
          </div>
          <Button size="sm" variant="outline" onClick={load} className="border-[#FECACA] text-[#D32F2F]">Retry</Button>
        </div>
      )}

      {loading && (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-28 rounded-xl bg-[#E0E0E0] animate-pulse" />)}</div>
      )}

      {!loading && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-6 mb-6 bg-[#F5F5F5] rounded-xl p-1 h-auto">
            {[
              { value: "building-rates", label: "Building Rates" },
              { value: "region",         label: "Region Config"  },
              { value: "location",       label: "Location Tiers" },
              { value: "risk",           label: "Risk Multipliers" },
              { value: "history",        label: "History"        },
              { value: "changelog",      label: "Change Log"     },
            ].map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}
                className="text-xs font-medium rounded-lg py-2 px-3 transition-colors duration-150 data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-sm data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-[#F5A623] data-[state=inactive]:text-[#555555]">
                {tab.label}
              </TabsTrigger>
            ))}
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
