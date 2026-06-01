"use client"

import { Check, ChevronLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

// ── Route for each step number ────────────────────────────────────────────────

const STEP_ROUTES: Record<number, string> = {
  1: "/dashboard/quotation/customize",
  2: "/dashboard/quotation/declare-valuables",
  3: "/dashboard/quotation/fill-details",
  4: "/dashboard/quotation/summary",
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  currentStep: 1 | 2 | 3 | 4
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuotationStepper({ currentStep }: Props) {
  const t      = useTranslations("quotation")
  const router = useRouter()

  const steps = [
    t("common.choosePlan"),
    t("common.declareValuables"),
    t("common.fillUpDetails"),
    t("common.summaryPayment"),
  ] as const

  // Only steps already completed (< currentStep) are navigable
  const canNavigate = (step: number) => step < currentStep

  const handleClick = (step: number) => {
    if (canNavigate(step)) router.push(STEP_ROUTES[step])
  }

  return (
    <div className="mb-8">

      {/* ── Desktop: full 4-step row ─────────────────────────────────────── */}
      <div className="hidden sm:flex items-center justify-center">
        {steps.map((label, idx) => {
          const step      = idx + 1
          const isDone    = step < currentStep
          const isActive  = step === currentStep
          const isLast    = step === steps.length
          const clickable = canNavigate(step)

          return (
            <div key={step} className="flex items-center">
              {/* Circle + label — clickable when done */}
              <button
                type="button"
                onClick={() => handleClick(step)}
                disabled={!clickable}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-1 py-0.5 transition-all",
                  clickable
                    ? "cursor-pointer hover:bg-[#E6F7EE] group"
                    : "cursor-default",
                )}
              >
                {/* Circle */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-all duration-150",
                    isDone   && "bg-[#00A651] text-white",
                    isActive && "bg-[#F5A623] text-white",
                    !isDone && !isActive && "bg-[#E0E0E0] text-[#9E9E9E]",
                    clickable && "group-hover:bg-[#00A651]",
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" strokeWidth={2.5} /> : step}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-sm font-medium whitespace-nowrap transition-all duration-150",
                    isDone   && "text-[#00A651]",
                    isActive && "text-[#1A1A1A]",
                    !isDone && !isActive && "text-[#9E9E9E]",
                    clickable && "group-hover:text-[#00A651] group-hover:underline underline-offset-2",
                  )}
                >
                  {label}
                </span>
              </button>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-3 rounded-full transition-all duration-150",
                    isDone ? "bg-[#00A651]" : "bg-[#E0E0E0]",
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Mobile: compact step indicator ──────────────────────────────── */}
      <div className="sm:hidden">
        {/* Back link — shown when not on first step */}
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => handleClick(currentStep - 1)}
            className="flex items-center gap-1 text-xs text-[#00A651] hover:text-[#00A651] mb-2 transition-all duration-150"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>{steps[currentStep - 2]}</span>
          </button>
        )}

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#9E9E9E] font-medium">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-xs font-semibold text-[#F5A623]">
            {steps[currentStep - 1]}
          </span>
        </div>

        {/* Segmented progress bar — completed segments are clickable */}
        <div className="flex gap-1">
          {steps.map((_, idx) => {
            const step      = idx + 1
            const isDone    = step < currentStep
            const isActive  = step === currentStep
            const clickable = canNavigate(step)

            return (
              <button
                key={step}
                type="button"
                onClick={() => handleClick(step)}
                disabled={!clickable}
                title={clickable ? `Go back to ${steps[idx]}` : undefined}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all duration-150",
                  isDone   && "bg-[#00A651]",
                  isActive && "bg-[#F5A623]",
                  !isDone && !isActive && "bg-[#E0E0E0]",
                  clickable && "cursor-pointer hover:brightness-90",
                  !clickable && "cursor-default",
                )}
              />
            )
          })}
        </div>
      </div>

    </div>
  )
}
