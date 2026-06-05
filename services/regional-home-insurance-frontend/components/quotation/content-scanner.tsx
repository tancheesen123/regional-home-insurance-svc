"use client"

import { useRef, useState, useCallback } from "react"
import {
  Camera, Upload, X, Loader2, AlertCircle, AlertTriangle,
  Trash2, Plus, CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { scanContent, type ScannedRoom, type ScanContentResult } from "@/lib/api/scan-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RoomKey } from "./content-calculator"

// ── Room type → RoomKey mapping ────────────────────────────────────────────────

const ROOM_TYPE_MAP: Record<string, RoomKey> = {
  "Living Room":   "livingRoom",
  "Bedroom":       "bedroom",
  "Dining Room":   "diningRoom",
  "Kitchen":       "kitchen",
  "Bathroom":      "bathroom",
  "Store Room":    "storeRoom",
  "Car Park":      "carpark",
  "Carpark":       "carpark",
  "Balcony":       "balcony",
  "Garden":        "garden",
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface EditableItem {
  _id: string
  name: string
  category: string
  estimatedPrice: number
  confidence: number
  lowConfidence: boolean
  note: string | null
}

export interface EditableRoom {
  roomType: string
  roomKey: RoomKey | null
  items: EditableItem[]
}

export interface ScanApplyPayload {
  rooms: EditableRoom[]
  totalEstimate: number
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  countryCode: string
  symbol: string
  onApply: (payload: ScanApplyPayload) => void
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function roomSubtotal(items: EditableItem[]) {
  return items.reduce((s, i) => s + i.estimatedPrice, 0)
}

function toEditable(room: ScannedRoom): EditableRoom {
  return {
    roomType: room.roomType,
    roomKey:  ROOM_TYPE_MAP[room.roomType] ?? null,
    items: room.items.map((item, idx) => ({
      ...item,
      _id: `${room.roomType}-${idx}-${Date.now()}`,
    })),
  }
}

function fmt(n: number) {
  return n.toLocaleString("en-ID")
}

// ── Confidence badge ───────────────────────────────────────────────────────────

function ConfidenceBadge({ item }: { item: EditableItem }) {
  if (item.lowConfidence) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#D4891A] bg-[#FDF0E6] px-1.5 py-0.5 rounded shrink-0">
        <AlertTriangle className="h-2.5 w-2.5" />
        Please verify
      </span>
    )
  }
  if (item.confidence >= 0.85) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#00A651] bg-[#E6F7EE] px-1.5 py-0.5 rounded shrink-0">
        <CheckCircle2 className="h-2.5 w-2.5" />
        Identified
      </span>
    )
  }
  return null
}

// ── Add-item inline form ───────────────────────────────────────────────────────

function AddItemForm({ symbol, onAdd }: { symbol: string; onAdd: (item: EditableItem) => void }) {
  const [name,  setName]  = useState("")
  const [price, setPrice] = useState("")

  const submit = () => {
    const p = parseFloat(price.replace(/,/g, ""))
    if (!name.trim() || isNaN(p) || p <= 0) return
    onAdd({
      _id:            `manual-${Date.now()}`,
      name:           name.trim(),
      category:       "Miscellaneous Items",
      estimatedPrice: p,
      confidence:     1,
      lowConfidence:  false,
      note:           null,
    })
    setName("")
    setPrice("")
  }

  return (
    <div className="flex gap-2 pt-3 mt-3 border-t border-dashed border-[#E0E0E0]">
      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className="flex-1 h-8 px-2.5 text-xs border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]/20"
      />
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-[#9E9E9E] pointer-events-none">{symbol}</span>
        <input
          type="number"
          placeholder="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-28 h-8 pl-6 pr-2 text-xs border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]/20"
        />
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={!name.trim() || !price}
        title="Add item"
        className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#1A1A1A] text-white disabled:opacity-30 hover:bg-[#333] transition-colors shrink-0"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ContentScanner({ countryCode, symbol, onApply }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [files,      setFiles]      = useState<File[]>([])
  const [scanning,   setScanning]   = useState(false)
  const [scanError,  setScanError]  = useState<string | null>(null)
  const [result,     setResult]     = useState<ScanContentResult | null>(null)
  const [rooms,      setRooms]      = useState<EditableRoom[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // ── File handling ────────────────────────────────────────────────────────────

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return
    const valid = Array.from(incoming).filter((f) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type) &&
      f.size <= 10 * 1024 * 1024,
    )
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name))
      return [...prev, ...valid.filter((f) => !names.has(f.name))]
    })
    setScanError(null)
  }, [])

  const removeFile = (name: string) => setFiles((prev) => prev.filter((f) => f.name !== name))

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  // ── Scan ─────────────────────────────────────────────────────────────────────

  const handleScan = async () => {
    if (files.length === 0) return
    setScanError(null)
    setScanning(true)
    try {
      const data = await scanContent(files, countryCode)
      setResult(data)
      setRooms(data.rooms.map(toEditable))
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setScanning(false)
    }
  }

  // ── Room item editing ────────────────────────────────────────────────────────

  const deleteItem = (roomIdx: number, itemId: string) =>
    setRooms((prev) => prev.map((r, i) =>
      i === roomIdx ? { ...r, items: r.items.filter((it) => it._id !== itemId) } : r,
    ))

  const updatePrice = (roomIdx: number, itemId: string, price: number) =>
    setRooms((prev) => prev.map((r, i) =>
      i === roomIdx
        ? { ...r, items: r.items.map((it) => it._id === itemId ? { ...it, estimatedPrice: price } : it) }
        : r,
    ))

  const addItem = (roomIdx: number, item: EditableItem) =>
    setRooms((prev) => prev.map((r, i) =>
      i === roomIdx ? { ...r, items: [...r.items, item] } : r,
    ))

  // ── Apply / Reset ────────────────────────────────────────────────────────────

  const totalEstimate = rooms.reduce((s, r) => s + roomSubtotal(r.items), 0)

  const handleApply = () => onApply({ rooms, totalEstimate })

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setRooms([])
    setScanError(null)
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-sm mb-6 overflow-hidden">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#333] px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#F5A623] flex items-center justify-center shrink-0">
          <Camera className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">AI Content Scanner</p>
          <p className="text-xs text-white/60 mt-0.5">Upload room photos to auto-estimate contents value</p>
        </div>
        {result && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-white/50 hover:text-white/80 transition-colors flex items-center gap-1 shrink-0"
          >
            <X className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>

      <div className="p-5">

        {/* ── Upload zone ── */}
        {!result && (
          <>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-150",
                isDragging
                  ? "border-[#F5A623] bg-[#FEF3DC]"
                  : "border-[#E0E0E0] bg-[#FAFAFA] hover:border-[#F5A623] hover:bg-[#FEFBF3]",
              )}
            >
              <Upload className="h-8 w-8 text-[#9E9E9E] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#1A1A1A]">Drop room photos here or click to browse</p>
              <p className="text-xs text-[#9E9E9E] mt-1">JPG, PNG, WEBP · max 10 MB each · multiple files supported</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />

            {/* Selected file pills */}
            {files.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center gap-1.5 bg-[#F5F5F5] rounded-lg px-2.5 py-1.5 text-xs text-[#555555]"
                  >
                    <Camera className="h-3 w-3 text-[#9E9E9E] shrink-0" />
                    <span className="max-w-[140px] truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(f.name) }}
                      className="text-[#9E9E9E] hover:text-[#D32F2F] transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Error banner */}
            {scanError && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#FFEBEE] border border-[#FECACA] px-3 py-2.5">
                <AlertCircle className="h-4 w-4 text-[#D32F2F] shrink-0 mt-0.5" />
                <p className="text-xs text-[#D32F2F] leading-snug">{scanError}</p>
              </div>
            )}

            {/* Scan button */}
            <button
              type="button"
              onClick={handleScan}
              disabled={files.length === 0 || scanning}
              className={cn(
                "mt-4 w-full h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors",
                files.length === 0 || scanning
                  ? "bg-[#F5A623]/40 text-white cursor-not-allowed"
                  : "bg-[#F5A623] hover:bg-[#D4891A] text-white",
              )}
            >
              {scanning
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning your photos…</>
                : <><Camera className="h-4 w-4" /> Scan {files.length > 0 ? `${files.length} photo${files.length > 1 ? "s" : ""}` : "photos"}</>
              }
            </button>
          </>
        )}

        {/* ── Results via Tabs ── */}
        {result && rooms.length > 0 && (
          <div className="space-y-4">

            {/* Summary strip */}
            <div className="flex items-center justify-between bg-[#F5F5F5] rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-[#9E9E9E]">Items detected</p>
                <p className="text-lg font-bold text-[#1A1A1A]">{result.totalItems} items</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#9E9E9E]">across {rooms.length} room{rooms.length !== 1 ? "s" : ""}</p>
                <p className="text-xs text-[#555555] mt-0.5">{files.length} photo{files.length !== 1 ? "s" : ""} scanned</p>
              </div>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="flex items-start gap-2 bg-[#FDF0E6] border border-[#F5A623]/30 rounded-xl px-3 py-2.5">
                <AlertTriangle className="h-4 w-4 text-[#D4891A] shrink-0 mt-0.5" />
                <div className="text-xs text-[#D4891A] space-y-0.5">
                  {result.warnings.map((w, i) => <p key={i}>{w}</p>)}
                </div>
              </div>
            )}

            {/* Room tabs */}
            <Tabs defaultValue={rooms[0]?.roomType ?? ""}>

              {/* Tab bar */}
              <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-[#F5F5F5] p-1 rounded-xl justify-start">
                {rooms.map((room) => {
                  const sub = roomSubtotal(room.items)
                  const hasWarning = room.items.some((it) => it.lowConfidence)
                  return (
                    <TabsTrigger
                      key={room.roomType}
                      value={room.roomType}
                      className={cn(
                        "relative h-9 px-3 rounded-lg text-xs font-medium transition-colors",
                        "data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1A1A1A]",
                        "data-[state=inactive]:text-[#555555] data-[state=inactive]:hover:text-[#1A1A1A]",
                      )}
                    >
                      {hasWarning && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#F5A623]" />
                      )}
                      <span>{room.roomType}</span>
                      <span className="ml-1.5 text-[10px] text-[#9E9E9E] font-normal">
                        {symbol} {fmt(sub)}
                      </span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {/* Tab panels */}
              {rooms.map((room, roomIdx) => (
                <TabsContent key={room.roomType} value={room.roomType} className="mt-3">
                  <div className="border border-[#E0E0E0] rounded-xl overflow-hidden">

                    {/* Room subtotal header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#FAFAFA] border-b border-[#E0E0E0]">
                      <p className="text-xs text-[#9E9E9E]">{room.items.length} items detected</p>
                      <p className="text-sm font-bold text-[#1A1A1A]">
                        Subtotal: {symbol} {fmt(roomSubtotal(room.items))}
                      </p>
                    </div>

                    {/* Item list */}
                    <div className="divide-y divide-[#F5F5F5]">
                      {room.items.map((item) => (
                        <div
                          key={item._id}
                          className={cn(
                            "flex items-start gap-3 px-4 py-3 group",
                            item.lowConfidence && "bg-[#FDF8EC]",
                          )}
                        >
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={cn(
                                "text-xs font-medium",
                                item.lowConfidence ? "text-[#D4891A]" : "text-[#1A1A1A]",
                              )}>
                                {item.name}
                              </span>
                              <ConfidenceBadge item={item} />
                            </div>
                            <p className="text-[11px] text-[#9E9E9E] mt-0.5">{item.category}</p>
                            {item.note && (
                              <p className="text-[11px] text-[#D4891A] mt-0.5 italic">{item.note}</p>
                            )}
                          </div>

                          {/* Editable price */}
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[11px] text-[#9E9E9E]">{symbol}</span>
                            <input
                              type="number"
                              value={item.estimatedPrice}
                              onChange={(e) => updatePrice(roomIdx, item._id, parseFloat(e.target.value) || 0)}
                              className="w-24 h-7 px-2 text-xs text-right border border-[#E0E0E0] rounded-md bg-white focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]/20"
                            />
                          </div>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => deleteItem(roomIdx, item._id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#9E9E9E] hover:text-[#D32F2F] mt-0.5 shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add item */}
                    <div className="px-4 pb-4">
                      <AddItemForm symbol={symbol} onAdd={(item) => addItem(roomIdx, item)} />
                    </div>

                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Grand total + Apply */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E0E0E0]">
              <div>
                <p className="text-xs text-[#9E9E9E]">Total estimate</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">
                  {symbol} {fmt(totalEstimate)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleApply}
                className="h-10 px-5 rounded-xl bg-[#F5A623] hover:bg-[#D4891A] text-white text-sm font-semibold transition-colors"
              >
                Apply to Calculator
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
