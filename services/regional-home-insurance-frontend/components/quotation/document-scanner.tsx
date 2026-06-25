"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import {
  Upload, X, Loader2, AlertCircle, AlertTriangle,
  CheckCircle2, FileText, CreditCard, Home, Zap,
  ChevronDown, ChevronUp, ScanLine,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { scanDocument, type ScanDocumentResult } from "@/lib/api/scan-document"
import { getSession } from "@/lib/session"
import ScanResultOverview from "@/components/quotation/scan-result-overview"


const DOC_TYPES = [
  { id: "IC",       label: "IC / Passport",    icon: CreditCard, available: true  },
  { id: "PROPERTY", label: "Property Title",   icon: Home,       available: false },
  { id: "POLICY",   label: "Insurance Policy", icon: FileText,   available: false },
  { id: "UTILITY",  label: "Utility Bill",     icon: Zap,        available: false },
] as const


function humanize(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

function confColor(confidence: number, filled: boolean) {
  if (!filled) return "text-[#BDBDBD]"
  if (confidence >= 0.8) return "text-[#00A651]"
  return "text-[#D4891A]"
}


interface Props {
  onScanComplete: (result: ScanDocumentResult) => void
  onSkip:         () => void
  onReopen:       () => void
  collapsed:      boolean
}


export default function DocumentScanner({ onScanComplete, onSkip, onReopen, collapsed }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const countryCode  = getSession()?.countryCode ?? "ID"

  const [files,       setFiles]       = useState<File[]>([])
  const [scanning,    setScanning]    = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const [result,      setResult]      = useState<ScanDocumentResult | null>(null)
  const [isDragging,  setIsDragging]  = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const [animateIn,     setAnimateIn]     = useState(false)
  const [stripAnimateIn, setStripAnimateIn] = useState(false)

  useEffect(() => {
    let raf: number
    if (!collapsed) {
      setShowDetails(false)
      setAnimateIn(false)
      raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true))
      })
    } else {
      setStripAnimateIn(false)
      raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setStripAnimateIn(true)
          setShowDetails(true)
        })
      })
    }
    return () => cancelAnimationFrame(raf)
  }, [collapsed])


  const addFiles = useCallback((list: FileList | null) => {
    if (!list) return
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"]
    const valid   = Array.from(list).filter(
      (f) => allowed.includes(f.type) && f.size <= 10 * 1024 * 1024,
    )
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name))
      return [...prev, ...valid.filter((f) => !names.has(f.name))].slice(0, 3)
    })
    setError(null)
  }, [])

  const removeFile = (name: string) => setFiles((p) => p.filter((f) => f.name !== name))

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }, [addFiles])


  const handleScan = async () => {
    if (!files.length) return
    setError(null)
    setScanning(true)
    try {
      const data = await scanDocument(files, countryCode)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setScanning(false)
    }
  }


  const filledCount = result
    ? Object.values(result.fields).filter((f) => f.filled).length
    : 0
  const totalCount  = result ? Object.keys(result.fields).length : 0


  if (collapsed) {
    const canExpand = !!result

    return (
      <div className={cn(
        "rounded-xl border border-[#E0E0E0] bg-white overflow-hidden",
        "transition-[opacity,transform] duration-200 ease-out",
        stripAnimateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}>

        {}
        <div
          role="button"
          tabIndex={0}
          onClick={() => canExpand && setShowDetails((v) => !v)}
          onKeyDown={(e) => e.key === "Enter" && canExpand && setShowDetails((v) => !v)}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 transition-colors",
            canExpand ? "hover:bg-[#FAFAFA] cursor-pointer" : "cursor-default",
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#F5A623] flex items-center justify-center shrink-0">
              <ScanLine className="h-3.5 w-3.5 text-white" />
            </div>
            {result ? (
              <span className="text-sm text-[#1A1A1A]">
                <span className="font-semibold">{filledCount} of {totalCount} fields</span>
                {" "}extracted from document
                {result.sources[0]?.documentType && result.sources[0].documentType !== "UNKNOWN" && (
                  <span className="ml-1.5 text-xs text-[#9E9E9E]">
                    ({result.sources[0].documentType})
                  </span>
                )}
              </span>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#555555]">AI scan skipped — filling manually</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onReopen() }}
                  className="text-xs font-medium text-[#0066CC] hover:text-[#004EA8] hover:underline transition-colors whitespace-nowrap"
                >
                  Upload document
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {result && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setResult(null)
                  setFiles([])
                  setError(null)
                  onReopen()
                }}
                className="text-xs text-[#9E9E9E] hover:text-[#555555] transition-colors px-1"
              >
                Re-scan
              </button>
            )}
            {canExpand && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-[#9E9E9E] transition-transform duration-300 ease-in-out",
                  showDetails && "rotate-180",
                )}
              />
            )}
          </div>
        </div>

        {}
        <div
          className="overflow-hidden"
          style={{
            maxHeight: showDetails && canExpand ? 400 : 0,
            transition: "max-height 250ms ease-out",
            willChange: "max-height",
          }}
        >
          <div>
            {result && (
              <div className="border-t border-[#F5F5F5]">
                <ResultFieldList result={result} compact />
              </div>
            )}
          </div>
        </div>

      </div>
    )
  }


  return (
    <div>
      {}
      {!result && (
        <div className={cn(
          "rounded-2xl border-2 border-dashed border-[#F5A623] bg-[#FFFBF0] p-6 text-center",
          "transition-[opacity,transform] duration-200 ease-out",
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
        )}>

          {}
          <div className="w-14 h-14 rounded-2xl bg-[#FEF3DC] flex items-center justify-center mx-auto mb-4">
            <ScanLine className="h-7 w-7 text-[#D4891A]" />
          </div>

          {}
          <h2 className="text-xl font-bold text-[#1A1A1A]">Save time, let AI fill your form</h2>
          <p className="text-sm text-[#6B6B6B] mt-2 mb-5 leading-relaxed">
            Upload your IC or property document and our AI will pre-fill as many fields as possible to streamline your journey.
          </p>

          {}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border border-dashed rounded-xl px-6 py-8 text-center cursor-pointer transition-colors mb-4",
              isDragging
                ? "border-[#F5A623] bg-[#FEF3DC]"
                : "border-[#E0E0E0] bg-white hover:border-[#F5A623] hover:bg-[#FEFBF3]",
            )}
          >
            <Upload className="h-8 w-8 text-[#BDBDBD] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1A1A1A]">Drop your document here or click to browse</p>
            <p className="text-xs text-[#9E9E9E] mt-1">PDF, JPG, PNG • max 10MB • up to 3 files</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />

          {}
          {files.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2 justify-center">
              {files.map((f) => (
                <div key={f.name} className="flex items-center gap-1.5 bg-white border border-[#E0E0E0] rounded-lg px-2.5 py-1.5 text-xs text-[#555555]">
                  <FileText className="h-3 w-3 text-[#9E9E9E] shrink-0" />
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

          {}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-[#FFEBEE] border border-[#FECACA] px-3 py-2.5 text-left">
              <AlertCircle className="h-4 w-4 text-[#D32F2F] shrink-0 mt-0.5" />
              <p className="text-xs text-[#D32F2F] leading-snug">{error}</p>
            </div>
          )}

          {}
          <button
            type="button"
            onClick={handleScan}
            disabled={!files.length || scanning}
            className={cn(
              "w-full h-12 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors",
              files.length && !scanning
                ? "bg-[#F5A623] hover:bg-[#D4891A] text-white"
                : "bg-[#F5A623]/40 text-white cursor-not-allowed",
            )}
          >
            {scanning
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning your document…</>
              : <>Upload &amp; Scan Document</>
            }
          </button>

          {}
          <div className="mt-3">
            <button
              type="button"
              onClick={onSkip}
              className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors font-medium"
            >
              Skip it and fill the form manually
            </button>
          </div>
        </div>
      )}

      {}
      {result && (
        <div className={cn(
          "transition-[opacity,transform] duration-200 ease-out",
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
        )}>
          <ScanResultOverview
            result={result}
            onContinue={() => onScanComplete(result)}
            onRescan={() => { setResult(null); setFiles([]) }}
          />
        </div>
      )}
    </div>
  )
}


function ResultFieldList({
  result,
  compact,
}: {
  result: ScanDocumentResult
  compact: boolean
}) {
  const entries = Object.entries(result.fields)

  return (
    <div className={cn("divide-y divide-[#F5F5F5]", compact && "max-h-64 overflow-y-auto")}>
      {entries.map(([key, field]) => {
        const highConf = field.filled && field.confidence >= 0.8
        const lowConf  = field.filled && field.confidence < 0.8

        return (
          <div
            key={key}
            className={cn(
              "flex items-center justify-between px-5",
              compact ? "py-2" : "py-3",
              lowConf && "bg-[#FDF8EC]",
            )}
          >
            {}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {highConf && <CheckCircle2 className="h-3.5 w-3.5 text-[#00A651] shrink-0" />}
              {lowConf  && <AlertTriangle className="h-3.5 w-3.5 text-[#D4891A] shrink-0" />}
              {!field.filled && (
                <div className="h-3.5 w-3.5 rounded-full border-2 border-[#BDBDBD] shrink-0" />
              )}
              <span className={cn(
                "text-sm truncate",
                highConf ? "text-[#555555]" : lowConf ? "text-[#D4891A]" : "text-[#BDBDBD]",
              )}>
                {humanize(key)}
              </span>
            </div>

            {}
            <div className="flex items-center gap-2.5 shrink-0 ml-4">
              {field.filled && field.value ? (
                <>
                  <span className="text-sm font-medium text-[#1A1A1A] max-w-[180px] truncate text-right">
                    {field.value}
                  </span>
                  <span className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap",
                    highConf
                      ? "text-[#00A651] bg-[#E6F7EE]"
                      : "text-[#D4891A] bg-[#FDF0E6]",
                  )}>
                    {Math.round(field.confidence * 100)}%
                  </span>
                </>
              ) : (
                <span className="text-xs text-[#BDBDBD]">Not found</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
