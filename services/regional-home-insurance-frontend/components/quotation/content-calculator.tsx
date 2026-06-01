"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { ChevronLeft, Info, CheckCircle2, RotateCcw, ArrowRight, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { fmtAmount, roundToUnit } from "@/lib/region"
import { cn } from "@/lib/utils"
import ContentScanner, { type ScanApplyPayload } from "./content-scanner"
import { getSession } from "@/lib/session"
import { useSidebar } from "@/components/ui/sidebar"

// ── Types ─────────────────────────────────────────────────────────────────────

export type RoomKey =
  | "livingRoom"
  | "bedroom"
  | "diningRoom"
  | "kitchen"
  | "bathroom"
  | "storeRoom"
  | "carpark"
  | "balcony"
  | "garden"
  | "miscellaneous"

const ROOM_KEYS: RoomKey[] = [
  "livingRoom", "bedroom", "diningRoom", "kitchen", "bathroom",
  "storeRoom",  "carpark", "balcony",   "garden",  "miscellaneous",
]

export type RoomAmounts = Record<RoomKey, string>

export const EMPTY_ROOM_AMOUNTS: RoomAmounts = {
  livingRoom: "", bedroom: "", diningRoom: "", kitchen: "", bathroom: "",
  storeRoom:  "", carpark: "", balcony:   "", garden:  "", miscellaneous: "",
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseRoomValue(raw: string, roundingUnit: number): number {
  return roundToUnit(parseFloat(raw.replace(/,/g, "")) || 0, roundingUnit)
}

function calcTotal(amounts: RoomAmounts, roundingUnit: number): number {
  return ROOM_KEYS.reduce((sum, k) => sum + parseRoomValue(amounts[k], roundingUnit), 0)
}

function filledRooms(amounts: RoomAmounts, roundingUnit: number): number {
  return ROOM_KEYS.filter((k) => parseRoomValue(amounts[k], roundingUnit) > 0).length
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  onBack:       () => void
  onConfirm:    (total: number, amounts: RoomAmounts) => void
  minAmount:    number
  maxAmount:    number
  roundingUnit: number
  symbol:       string
  initialAmounts?: RoomAmounts
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContentCalculator({
  onBack, onConfirm, minAmount, maxAmount, roundingUnit, symbol, initialAmounts,
}: Props) {
  const t             = useTranslations("quotation")
  const countryCode   = getSession()?.countryCode ?? "MY"
  const { state: sidebarState } = useSidebar()

  const [amounts, setAmounts] = useState<RoomAmounts>(initialAmounts ?? EMPTY_ROOM_AMOUNTS)

  // ── Scanner apply ─────────────────────────────────────────────────────────

  const handleScanApply = useCallback((payload: ScanApplyPayload) => {
    setAmounts((prev) => {
      const next = { ...prev }
      payload.rooms.forEach((room) => {
        if (!room.roomKey) return
        const subtotal = room.items.reduce((s, i) => s + i.estimatedPrice, 0)
        const rounded  = roundToUnit(subtotal, roundingUnit)
        if (rounded > 0) next[room.roomKey] = rounded.toLocaleString("en")
      })
      return next
    })
  }, [roundingUnit])

  // ── Derived ──────────────────────────────────────────────────────────────

  const totalAmount = calcTotal(amounts, roundingUnit)
  const filled      = filledRooms(amounts, roundingUnit)
  const isAboveMin  = totalAmount >= minAmount
  const isBelowMax  = totalAmount <= maxAmount
  const isValid     = totalAmount > 0 && isAboveMin && isBelowMax

  const progressPct  = Math.min((totalAmount / maxAmount) * 100, 100)
  const belowMinPct  = (minAmount / maxAmount) * 100
  const progressColor =
    totalAmount === 0 ? "bg-[#E0E0E0]"
    : !isAboveMin || !isBelowMax ? "bg-[#D32F2F]"
    : "bg-[#00A651]"

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = useCallback((room: RoomKey, raw: string) => {
    setAmounts((prev) => ({ ...prev, [room]: raw.replace(/[^0-9,]/g, "") }))
  }, [])

  const handleBlur = useCallback((room: RoomKey) => {
    setAmounts((prev) => {
      const rounded = parseRoomValue(prev[room], roundingUnit)
      return { ...prev, [room]: rounded > 0 ? rounded.toLocaleString("en") : "" }
    })
  }, [roundingUnit])

  const handleReset   = () => setAmounts(EMPTY_ROOM_AMOUNTS)
  const handleConfirm = () => { if (isValid) onConfirm(totalAmount, amounts) }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const roomTitle = (key: RoomKey) => t(`calculator.${key}Title` as any)
  const roomItems = (key: RoomKey) => t(`calculator.${key}Items` as any)
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto pb-40">

      {/* ── Hero header ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-[#1A1A1A] p-6 mb-6 shadow-sm">

        {/* Nav row */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{t("common.choosePlan")}</span>
          </button>
          <button
            onClick={onBack}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Exit calculator"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#F5A623] flex items-center justify-center shrink-0 mt-0.5">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">{t("calculator.title")}</h1>
            <p className="text-sm text-white/60 mt-1 leading-relaxed">
              {t("calculator.description")}
            </p>
          </div>
        </div>

        {/* Room progress pills */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {ROOM_KEYS.map((key) => {
              const done = parseRoomValue(amounts[key], roundingUnit) > 0
              return (
                <div
                  key={key}
                  className={cn(
                    "h-1.5 w-5 rounded-full transition-all duration-300",
                    done ? "bg-[#F5A623]" : "bg-white/20",
                  )}
                />
              )
            })}
          </div>
          <span className="text-xs text-white/50">
            {filled} / {ROOM_KEYS.length} {filled === 1 ? "room" : "rooms"} filled
          </span>
        </div>
      </div>

      {/* ── AI Scanner ───────────────────────────────────────────────────────── */}
      <ContentScanner
        countryCode={countryCode}
        symbol={symbol}
        onApply={handleScanApply}
      />

      {/* ── Info banner ──────────────────────────────────────────────────────── */}
      <div className="flex gap-3 bg-[#E1F5FE] border border-[#0288D1]/25 rounded-xl p-4 mb-5">
        <Info className="h-4 w-4 text-[#0288D1] shrink-0 mt-0.5" />
        <p className="text-sm text-[#0288D1] leading-relaxed">
          {t("calculator.infoText", {
            minAmount: `${symbol} ${fmtAmount(minAmount)}`,
            maxAmount: `${symbol} ${fmtAmount(maxAmount)}`,
          })}
        </p>
      </div>

      {/* ── Room cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ROOM_KEYS.map((room) => {
          const roomVal  = parseRoomValue(amounts[room], roundingUnit)
          const filled   = roomVal > 0

          return (
            <div
              key={room}
              className={cn(
                "rounded-xl border border-l-4 overflow-hidden transition-all duration-150",
                filled
                  ? "border-[#E0E0E0] border-l-[#F5A623] shadow-sm"
                  : "border-[#E0E0E0] border-l-[#E0E0E0] hover:border-l-[#F5A623] hover:shadow-sm",
              )}
            >
              {/* Card header */}
              <div className={cn(
                "px-4 pt-4 pb-3 transition-colors",
                filled ? "bg-[#FEF3DC]" : "bg-white",
              )}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#1A1A1A] text-sm leading-tight">
                      {roomTitle(room)}
                    </p>
                    <p className="text-xs text-[#9E9E9E] mt-0.5 leading-snug line-clamp-2">
                      {roomItems(room)}
                    </p>
                  </div>
                  {filled && (
                    <CheckCircle2 className="h-4 w-4 text-[#00A651] shrink-0 mt-0.5" />
                  )}
                </div>
              </div>

              {/* Amount input */}
              <div className="px-4 pb-4 pt-2.5 bg-white border-t border-[#F5F5F5]">
                <p className="text-xs text-[#9E9E9E] mb-1.5">{t("calculator.estimatedAmount")}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#555555] shrink-0">{symbol}</span>
                  <Input
                    value={amounts[room]}
                    onChange={(e) => handleChange(room, e.target.value)}
                    onBlur={() => handleBlur(room)}
                    placeholder="0"
                    inputMode="numeric"
                    className={cn(
                      "text-right border-[#E0E0E0] text-[#1A1A1A] placeholder:text-[#9E9E9E]",
                      "focus-visible:border-[#F5A623] focus-visible:ring-[#F5A623]/20",
                    )}
                  />
                </div>
                {filled && (
                  <p className="text-xs text-[#00A651] font-medium mt-1.5 text-right">
                    {symbol} {roomVal.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Sticky bottom bar ────────────────────────────────────────────────── */}
      {/* left offset mirrors sidebar width and transitions with it */}
      <div className={cn(
        "fixed bottom-0 right-0 bg-white border-t border-[#E0E0E0] shadow-lg z-50",
        "transition-[left] duration-200 ease-linear",
        sidebarState === "collapsed" ? "left-12" : "left-64",
      )}>
        <div className="max-w-4xl mx-auto px-5 pt-3 pb-4">

          {/* Range progress bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-[#9E9E9E] mb-1.5">
              <span>{symbol} {fmtAmount(minAmount)} min</span>
              <span>{symbol} {fmtAmount(maxAmount)} max</span>
            </div>
            <div className="relative h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
              {/* Min threshold marker */}
              <div
                className="absolute top-0 bottom-0 w-px bg-[#E0E0E0] z-10"
                style={{ left: `${belowMinPct}%` }}
              />
              {/* Fill */}
              <div
                className={cn("h-full rounded-full transition-all duration-300", progressColor)}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {totalAmount > 0 && !isValid && (
              <p className="text-xs text-[#D32F2F] mt-1">
                {t("calculator.outOfRange", {
                  minAmount: `${symbol} ${fmtAmount(minAmount)}`,
                  maxAmount: `${symbol} ${fmtAmount(maxAmount)}`,
                })}
              </p>
            )}
          </div>

          {/* Total + actions */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#9E9E9E] mb-0.5">{t("calculator.totalAmount")}</p>
              <p className={cn(
                "text-2xl font-bold leading-tight",
                isValid          ? "text-[#1A1A1A]"
                : totalAmount > 0 ? "text-[#D32F2F]"
                :                   "text-[#BDBDBD]",
              )}>
                {symbol} {fmtAmount(totalAmount)}
              </p>
              <p className="text-xs text-[#9E9E9E] mt-0.5">
                {t("calculator.amountNote", { unit: fmtAmount(roundingUnit) })}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-sm text-[#9E9E9E] hover:text-[#555555] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[#FAFAFA]"
                title={t("calculator.reset")}
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">{t("calculator.reset")}</span>
              </button>
              <button
                onClick={handleConfirm}
                disabled={!isValid}
                className={cn(
                  "flex items-center gap-1.5 px-5 h-10 rounded-xl text-sm font-semibold text-white transition-colors",
                  isValid
                    ? "bg-[#F5A623] hover:bg-[#D4891A]"
                    : "bg-[#F5A623]/40 cursor-not-allowed",
                )}
              >
                {t("calculator.confirm")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
