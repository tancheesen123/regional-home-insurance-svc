"use client"

/**
 * ScanResultOverview
 * ─────────────────────────────────────────────────────────────────────────────
 * Replaces the inline scan-result block inside DocumentScanner after a
 * successful scan. Shows 4 journey-step cards, each expandable to show
 * field-level match status.
 *
 * Clicking a field row:
 *   • Step 1 fields  → scrollIntoView + 2-second amber pulse (Google Forms style)
 *   • Other steps    → nothing (they live on a different page)
 *
 * All 4 cards can be open simultaneously (not an accordion).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from "react"
import { CheckCircle2, AlertTriangle, Circle, ChevronDown, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ScanDocumentResult } from "@/lib/api/scan-document"

// ── Field definitions per step ────────────────────────────────────────────────

interface StepField {
  label:    string
  /** Primary AI response key to look up in ScanDocumentResult.fields */
  aiKey:    string
  /** Fallback keys tried in order if the primary key has no value */
  altKeys?: string[]
  /** DOM element id to scroll to — null means a different page, no scroll */
  fieldId:  string | null
  /** Optional value transform for display (e.g. extract postcode from address) */
  display?: (raw: string) => string
}

interface StepConfig {
  id:     string
  label:  string
  fields: StepField[]
}

const STEP_CONFIGS: StepConfig[] = [
  {
    id:    "quotation",
    label: "QUOTATION",
    fields: [
      {
        label:   "Coverage Start Date",
        aiKey:   "periodFrom",
        fieldId: "field-coverageStartDate",
      },
      {
        label:   "Property Type",
        aiKey:   "occupiedAs",
        fieldId: "field-propertyType",
        display: (v) => v.toLowerCase().includes("landed") ? "Landed" : "Non-Landed",
      },
      {
        label:   "Construction Type",
        aiKey:   "constructionClassification",
        fieldId: "field-constructionType",
        display: (v) => v.toUpperCase().includes("CLASS I") ? "Full Brick" : "Partial Brick",
      },
      {
        label:   "Postcode",
        aiKey:   "riskAddress",
        fieldId: "field-postcode",
        display: (v) => {
          const match = v.split(",").map((s) => s.trim()).find((s) => /^\d{5}$/.test(s))
          return match ?? v.slice(0, 20)
        },
      },
      {
        label:    "ID Number",
        aiKey:    "idNumber",
        altKeys:  ["nik"],
        fieldId:  "field-idNumber",
      },
      {
        label:    "Date of Birth",
        aiKey:    "dateOfBirth",
        altKeys:  ["birthdate", "birthDate"],
        fieldId:  "field-dateOfBirth",
      },
    ],
  },
  {
    id:    "customize",
    label: "CUSTOMIZE PLAN",
    fields: [
      { label: "Cover Type",  aiKey: "coverType",  altKeys: ["planName"],   fieldId: null },
      { label: "Sum Insured", aiKey: "sumInsured",                           fieldId: null },
    ],
  },
  {
    id:    "valuables",
    label: "DECLARE VALUABLES",
    fields: [],   // no direct scan fields for valuables
  },
  {
    id:    "fillDetails",
    label: "FILL DETAILS",
    fields: [
      { label: "Full Name",  aiKey: "insuredName",    altKeys: ["name", "givenNames"],  fieldId: null },
      { label: "Address",    aiKey: "insuredAddress", altKeys: ["riskAddress", "address"], fieldId: null },
      { label: "NIK / ID",   aiKey: "nik",            altKeys: ["idNumber"],             fieldId: null },
      { label: "Gender",     aiKey: "gender",                                             fieldId: null },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

type FieldStatus = "filled-high" | "filled-low" | "missing"
type StepStatus  = "ready" | "review" | "partial" | "empty"

/** Try the primary key then altKeys in order — return first filled entry. */
function resolveField(
  field: StepField,
  result: ScanDocumentResult,
): { value: string; confidence: number } | null {
  const keys = [field.aiKey, ...(field.altKeys ?? [])]
  for (const k of keys) {
    const f = result.fields[k]
    if (f?.filled && f.value) return { value: f.value, confidence: f.confidence }
  }
  return null
}

function fieldStatus(field: StepField, result: ScanDocumentResult): FieldStatus {
  const resolved = resolveField(field, result)
  if (!resolved) return "missing"
  return resolved.confidence >= 0.8 ? "filled-high" : "filled-low"
}

function displayValue(field: StepField, result: ScanDocumentResult): string {
  const resolved = resolveField(field, result)
  if (!resolved) return "—"
  return field.display ? field.display(resolved.value) : resolved.value
}

function stepStatus(config: StepConfig, result: ScanDocumentResult): StepStatus {
  if (config.fields.length === 0) return "empty"
  const statuses = config.fields.map((f) => fieldStatus(f, result))
  const filledCount = statuses.filter((s) => s !== "missing").length
  if (filledCount === 0) return "empty"
  if (statuses.some((s) => s === "missing"))      return "partial"
  if (statuses.some((s) => s === "filled-low"))   return "review"
  return "ready"
}

function countFilled(config: StepConfig, result: ScanDocumentResult): number {
  return config.fields.filter((f) => fieldStatus(f, result) !== "missing").length
}

/** Scroll to the target form element and pulse an amber ring (Google Forms style). */
function scrollToField(fieldId: string) {
  const el = document.getElementById(fieldId)
  if (!el) return
  el.scrollIntoView({ behavior: "smooth", block: "center" })
  el.classList.add("field-scan-highlight")
  setTimeout(() => el.classList.remove("field-scan-highlight"), 2000)
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepStatusIcon({ status }: { status: StepStatus }) {
  if (status === "ready")   return <CheckCircle2  className="h-4 w-4 text-[#00A651] shrink-0" />
  if (status === "review")  return <AlertTriangle className="h-4 w-4 text-[#D4891A] shrink-0" />
  if (status === "partial") return <AlertTriangle className="h-4 w-4 text-[#F5A623] shrink-0" />
  return <Circle className="h-4 w-4 text-[#BDBDBD] shrink-0" />
}

function FieldStatusIcon({ status }: { status: FieldStatus }) {
  if (status === "filled-high") return <CheckCircle2  className="h-3.5 w-3.5 text-[#00A651] shrink-0" />
  if (status === "filled-low")  return <AlertTriangle className="h-3.5 w-3.5 text-[#D4891A] shrink-0" />
  return <Circle className="h-3.5 w-3.5 text-[#BDBDBD] shrink-0" />
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  result:     ScanDocumentResult
  onContinue: () => void
  onRescan:   () => void
}

export default function ScanResultOverview({ result, onContinue, onRescan }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  const totalFilled = STEP_CONFIGS.reduce((sum, c) => sum + countFilled(c, result), 0)
  const totalFields = STEP_CONFIGS.reduce((sum, c) => sum + c.fields.length, 0)

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E0E0E0] bg-white shadow-sm overflow-hidden",
        "transition-[opacity,transform] duration-200 ease-out",
      )}
    >

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-5 pt-4 pb-3.5 border-b border-[#F5F5F5]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E6F7EE] flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#00A651]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">Document Scanned Successfully!</p>
              <p className="text-xs text-[#555555] mt-0.5">
                {totalFilled} of {totalFields} fields matched —
                <span className="text-[#F5A623] font-medium"> click any row to jump to the field</span>
              </p>
            </div>
          </div>
          {/* Re-scan */}
          <button
            type="button"
            onClick={onRescan}
            className="flex items-center gap-1 text-xs text-[#9E9E9E] hover:text-[#555555] transition-colors shrink-0 pt-0.5"
          >
            <X className="h-3 w-3" />
            Re-scan
          </button>
        </div>
      </div>

      {/* ── Step cards ─────────────────────────────────────────────────────── */}
      <div className="divide-y divide-[#F5F5F5]">
        {STEP_CONFIGS.map((config) => {
          const status   = stepStatus(config, result)
          const filled   = countFilled(config, result)
          const isOpen   = !!expanded[config.id]
          const hasFields = config.fields.length > 0

          return (
            <div key={config.id}>

              {/* Card header row */}
              <button
                type="button"
                onClick={() => hasFields && toggle(config.id)}
                className={cn(
                  "w-full flex items-center justify-between px-5 py-3 transition-colors duration-150",
                  hasFields ? "hover:bg-[#FAFAFA] cursor-pointer" : "cursor-default",
                )}
              >
                <div className="flex items-center gap-3">
                  <StepStatusIcon status={status} />
                  <div className="text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9E9E9E]">
                      {config.label}
                    </p>
                    <p className="text-xs font-medium text-[#1A1A1A] mt-0.5">
                      {status === "empty"
                        ? "No fields matched"
                        : `${filled} of ${config.fields.length} fields auto-filled`}
                    </p>
                  </div>
                </div>

                {hasFields && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-[#9E9E9E] transition-transform duration-200 ease-in-out shrink-0",
                      isOpen && "rotate-180",
                    )}
                  />
                )}
              </button>

              {/* Animated field list */}
              {hasFields && (
                <div className={cn(
                  "grid transition-[transform,opacity] duration-200 ease-in-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}>
                  <div className="overflow-hidden">
                    <div className="border-t border-[#F5F5F5]">
                      {config.fields.map((field) => {
                        const fStatus   = fieldStatus(field, result)
                        const value     = displayValue(field, result)
                        const isMissing = fStatus === "missing"
                        const canScroll = field.fieldId !== null

                        return (
                          <button
                            key={`${config.id}-${field.aiKey}`}
                            type="button"
                            onClick={() => {
                              if (canScroll && field.fieldId) scrollToField(field.fieldId)
                            }}
                            title={
                              !canScroll
                                ? "This value will be auto-applied when you reach that step"
                                : isMissing
                                ? "Jump to this field in the form"
                                : "Jump to review this value in the form"
                            }
                            className={cn(
                              "group w-full flex items-center justify-between px-5 py-2.5 text-left",
                              "transition-colors duration-150",
                              canScroll
                                ? "hover:bg-[#FEF3DC] cursor-pointer"
                                : "cursor-default",
                              isMissing && "opacity-70",
                            )}
                          >
                            {/* Left: icon + label */}
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <FieldStatusIcon status={fStatus} />
                              <span className={cn(
                                "text-sm truncate",
                                fStatus === "filled-high" && "text-[#555555]",
                                fStatus === "filled-low"  && "text-[#D4891A]",
                                fStatus === "missing"      && "text-[#BDBDBD]",
                              )}>
                                {field.label}
                              </span>
                            </div>

                            {/* Right: value + confidence OR missing */}
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              {!isMissing ? (
                                <>
                                  <span className="text-xs font-medium text-[#1A1A1A] max-w-[130px] truncate text-right">
                                    {value}
                                  </span>
                                  <span className={cn(
                                    "text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap",
                                    fStatus === "filled-high"
                                      ? "text-[#00A651] bg-[#E6F7EE]"
                                      : "text-[#D4891A] bg-[#FDF0E6]",
                                  )}>
                                    {Math.round(
                                      (resolveField(field, result)?.confidence ?? 0) * 100,
                                    )}%
                                  </span>
                                </>
                              ) : (
                                <span className="text-xs text-[#BDBDBD]">not found</span>
                              )}

                              {/* Jump icon — visible on hover for scrollable fields */}
                              {canScroll && (
                                <ArrowRight
                                  className={cn(
                                    "h-3 w-3 transition-opacity duration-150 shrink-0",
                                    "opacity-0 group-hover:opacity-100",
                                    fStatus === "missing"
                                      ? "text-[#9E9E9E]"
                                      : "text-[#F5A623]",
                                  )}
                                />
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Footer CTA ─────────────────────────────────────────────────────── */}
      <div className="px-5 py-3.5 border-t border-[#F5F5F5] flex items-center justify-between gap-4">
        <p className="text-xs text-[#9E9E9E] leading-snug">
          Please review all auto-filled values — they are pre-filled but not confirmed.
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="flex items-center gap-1.5 bg-[#F5A623] hover:bg-[#D4891A] text-white text-sm font-semibold px-4 h-9 rounded-lg transition-colors duration-150 shrink-0 whitespace-nowrap"
        >
          Got it, continue
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

    </div>
  )
}
