"use client"

import { useState } from "react"
import { ChevronUp, Sofa, Tag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getRegionConfig } from "@/lib/region"
import { getSession } from "@/lib/session"

export interface SummaryBreakdown {
  planLabel?:        string
  coveragePeriod?:   string
  coverageType?:     string   // e.g. "Landed, 1-storey"
  constructionType?: string   // e.g. "Partial Brick"
  buildingSum?:      number
  contentsSum?:      number
  grossPremium?:     number
  discountAmount?:   number
  discountRatePct?:  number
  serviceTaxRate?:   number
  serviceTaxAmount?: number
  stampDuty?:        number
  addOns?:           { name: string; premium?: number }[]
  valuables?:        { label: string; value: number }[]
}

interface SummaryBarProps {
  total?:                number | null
  totalBeforeDiscount?:  number | null
  monthly?:              number | null
  loading?:              boolean
  breakdown?:            SummaryBreakdown
  onProceed:             () => void
  proceedLabel:          string
  proceedLoading?:       boolean
  proceedDisabled?:      boolean
}

export default function SummaryBar({
  total,
  totalBeforeDiscount,
  monthly,
  loading,
  breakdown,
  onProceed,
  proceedLabel,
  proceedLoading,
  proceedDisabled,
}: SummaryBarProps) {
  const [open, setOpen] = useState(false)
  const { symbol } = getRegionConfig(getSession()?.countryCode ?? "")

  const money = (n: number) =>
    `${symbol} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const hasTotal    = typeof total === "number" && total > 0
  const hasDiscount =
    hasTotal &&
    typeof totalBeforeDiscount === "number" &&
    totalBeforeDiscount > (total as number)

  const savePct =
    breakdown?.discountRatePct ??
    (hasDiscount
      ? Math.round((1 - (total as number) / (totalBeforeDiscount as number)) * 100)
      : 0)

  const hasBreakdown = !!breakdown && (
    !!breakdown.planLabel || !!breakdown.grossPremium || (breakdown.addOns?.length ?? 0) > 0
  )

  return (
    /*
     * sticky bottom-0 anchors the BOTTOM edge to the viewport.
     * The panel lives above the bar row inside this same flex column.
     * When the panel expands, the container grows UPWARD (bottom stays pinned)
     * — no absolute overlay, no content blocking.
     */
    <div className="sticky bottom-0 z-30 flex flex-col">

      {/* ── Expanding breakdown panel — grows upward from the bar ── */}
      {hasBreakdown && (
        <div
          className={cn(
            "grid bg-white border-t border-[#E5E7EB] shadow-[0_-6px_20px_-8px_rgba(0,0,0,0.15)]",
            "transition-[grid-template-rows] duration-300 ease-out",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          {/* min-h-0 is required for grid-rows collapse to work */}
          <div className="min-h-0 overflow-hidden">
            <div className="max-h-[55vh] overflow-y-auto">
              <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">

                {/* Left — coverage */}
                <div>
                  <h4 className="font-semibold text-[#1A1A1A] mb-2">{breakdown!.planLabel ?? "Coverage"}</h4>
                  <dl className="space-y-1.5 text-sm">
                    {breakdown!.coveragePeriod && <Row label="Coverage Period" value={breakdown!.coveragePeriod} />}
                    {breakdown!.coverageType && <Row label="Coverage Type" value={breakdown!.coverageType} />}
                    {breakdown!.constructionType && <Row label="Construction Type" value={breakdown!.constructionType} />}
                    {typeof breakdown!.buildingSum === "number" && (
                      <Row label="Building" value={money(breakdown!.buildingSum)} />
                    )}
                    {typeof breakdown!.contentsSum === "number" && (
                      <Row label="Contents" value={money(breakdown!.contentsSum)} />
                    )}
                  </dl>

                  {breakdown!.valuables && breakdown!.valuables.length > 0 && (
                    <>
                      <h4 className="font-semibold text-[#1A1A1A] mt-4 mb-2">Declared Valuables</h4>
                      <dl className="space-y-1.5 text-sm">
                        {breakdown!.valuables.map((v, i) => (
                          <Row key={i} label={v.label} value={money(v.value)} />
                        ))}
                      </dl>
                    </>
                  )}
                </div>

                {/* Right — cost breakdown */}
                <div>
                  <h4 className="font-semibold text-[#1A1A1A] mb-2">Cost Breakdown</h4>
                  <dl className="space-y-1.5 text-sm">
                    {typeof breakdown!.grossPremium === "number" && (
                      <Row label="Gross Premium" value={money(breakdown!.grossPremium)} />
                    )}
                    {typeof breakdown!.discountAmount === "number" && breakdown!.discountAmount > 0 && (
                      <Row
                        label={`Online Rebate ${savePct}%`}
                        value={`- ${money(breakdown!.discountAmount)}`}
                        valueClass="text-[#00A651]"
                        labelClass="text-[#00A651]"
                      />
                    )}
                    {typeof breakdown!.serviceTaxAmount === "number" && (
                      <Row
                        label={`Service Tax ${breakdown!.serviceTaxRate ?? ""}%`}
                        value={money(breakdown!.serviceTaxAmount)}
                      />
                    )}
                    {typeof breakdown!.stampDuty === "number" && (
                      <Row label="Stamp Duty" value={money(breakdown!.stampDuty)} />
                    )}
                    {breakdown!.addOns && breakdown!.addOns.length > 0 && breakdown!.addOns.map((a, i) => (
                      typeof a.premium === "number"
                        ? <Row key={`a${i}`} label={a.name} value={`+ ${money(a.premium)}`} />
                        : <Row key={`a${i}`} label={a.name} value="Included" />
                    ))}
                  </dl>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── The bar row — always visible at the bottom ── */}
      <div className="bg-white border-t border-[#E5E7EB] shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.15)]">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">

          {/* Left — label + toggle */}
          <div className="min-w-0">
            <p className="text-base sm:text-lg font-bold text-[#1A1A1A] leading-tight">Total Premium</p>
            {hasBreakdown && (
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-[#0066CC] hover:text-[#004EA8] transition-colors"
              >
                {open ? "Hide Summary" : "View Summary"}
                <Sofa className="h-4 w-4" />
                <ChevronUp className={cn("h-4 w-4 transition-transform duration-300", open ? "rotate-0" : "rotate-180")} />
              </button>
            )}
          </div>

          {/* Right — price + CTA */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <div className="text-right">
              {loading ? (
                <span className="text-sm text-[#9E9E9E] flex items-center gap-1.5 justify-end">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Calculating…
                </span>
              ) : hasTotal ? (
                <>
                  <div className="flex items-baseline gap-2 justify-end">
                    {hasDiscount && (
                      <span className="text-sm text-[#9E9E9E] line-through">
                        {money(totalBeforeDiscount as number)}
                      </span>
                    )}
                    <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                      {money(total as number)}
                    </span>
                  </div>
                  {hasDiscount && savePct > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#00A651] mt-0.5">
                      <Tag className="h-3 w-3" /> You save {savePct}%
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm text-[#9E9E9E]">Adjust your plan</span>
              )}
            </div>

            <Button
              onClick={onProceed}
              disabled={proceedDisabled || proceedLoading}
              className="bg-[#F5A623] hover:bg-[#D4891A] text-[#1A1A1A] font-semibold h-12 px-8 rounded-lg disabled:bg-[#E0E0E0] disabled:text-[#9E9E9E]"
            >
              {proceedLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> {proceedLabel}
                </span>
              ) : proceedLabel}
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}

// ── Small row helper ────────────────────────────────────────────────────────
function Row({
  label, value, labelClass, valueClass,
}: {
  label: string; value: string; labelClass?: string; valueClass?: string
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={cn("text-[#555555]", labelClass)}>{label}</dt>
      <dd className={cn("text-[#1A1A1A] text-right", valueClass)}>{value}</dd>
    </div>
  )
}
