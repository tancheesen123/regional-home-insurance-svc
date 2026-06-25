"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { CalendarIcon, Home, Building, Minus, Plus, Check, AlertCircle } from "lucide-react"
import { format, parse, isValid } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { getQuote, saveQuotationId, saveQuotationStartDate, saveQuotationIdentity, saveQuotationPropertySummary } from "@/lib/api"
import { getSession } from "@/lib/session"
import { getIdTypeOptions, getDefaultNationality } from "@/lib/id-type-helpers"
import { markFieldManual, saveScanSession, type ScanSessionField } from "@/lib/scan-session"
import { getMappingsForStep } from "@/lib/scan-field-map"
import ScanFieldBadge from "@/components/quotation/scan-field-badge"
import ScanBanner from "@/components/quotation/scan-banner"

interface FormData {
  ownershipType: string
  coverageStartDate: Date | undefined
  propertyType: string
  numberOfStorey: number
  constructionType: string
  postcode: string
  currentFlooding: string
  unoccupiedProperty: string
  previousLoss: string
  idType: string
  passportNumber: string
  nricNumber: string
  nationality: string
  dateOfBirth: string
}

const PROPERTY_TYPES = [
  { id: "landed", icon: Home },
  { id: "non-landed", icon: Building },
]

const CONSTRUCTION_TYPES = [
  { id: "full-brick" },
  { id: "partial-brick" },
]

const NATIONALITIES = [
  "MALAYSIAN", "SINGAPOREAN", "INDONESIAN", "THAI", "FILIPINO", "CAMBODIAN", "OTHER",
]

function getIdInputLabel(cc: string): string {
  switch (cc.toUpperCase()) {
    case "PH": return "PhilID Number"
    case "KH": return "Khmer ID Number"
    case "ID": return "KTP Number (NIK)"
    default:   return "IC Number (NRIC)"
  }
}

function getIdInputMode(cc: string): "numeric" | "text" {
  return cc.toUpperCase() === "ID" ? "numeric" : "text"
}

function getIdMaxLength(cc: string): number | undefined {
  return cc.toUpperCase() === "ID" ? 16 : undefined
}

function normaliseNationality(raw: string): string {
  const v = raw.trim().toUpperCase()
  if (v.includes("INDONESIA") || v === "WNI") return "INDONESIAN"
  if (v.includes("MALAYSIA"))                 return "MALAYSIAN"
  if (v.includes("SINGAPORE"))                return "SINGAPOREAN"
  if (v.includes("PHILIPPIN") || v.includes("FILIPINO")) return "FILIPINO"
  if (v.includes("CAMBODIA")  || v.includes("KHMER"))    return "CAMBODIAN"
  if (v.includes("THAI"))                     return "THAI"
  if (NATIONALITIES.includes(v)) return v
  return "OTHER"
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 text-xs text-[#D32F2F] flex items-center gap-1">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {msg}
    </p>
  )
}

interface QuotationFormProps {
  scanResult?: import("@/lib/api/scan-document").ScanDocumentResult | null
}

export default function QuotationForm({ scanResult }: QuotationFormProps = {}) {
  const router = useRouter()
  const t = useTranslations("quotation")

  const [countryCode, setCountryCode] = useState("ID")
  const idTypeOptions = getIdTypeOptions(countryCode)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dobOpen, setDobOpen] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<FormData>({
    ownershipType:    "",
    coverageStartDate: undefined,
    propertyType:     "",
    numberOfStorey:   1,
    constructionType: "",
    postcode:         "",
    currentFlooding:  "",
    unoccupiedProperty: "",
    previousLoss:     "",
    idType: getIdTypeOptions("ID")[0].value,
    passportNumber:   "",
    nricNumber:       "",
    nationality: getDefaultNationality("ID"),
    dateOfBirth:      "",
  })

  useEffect(() => {
    const cc = getSession()?.countryCode ?? "ID"
    if (cc === countryCode) return
    setCountryCode(cc)
    const opts = getIdTypeOptions(cc)
    setFormData((prev) => ({
      ...prev,
      idType:      opts[0].value,
      nationality: getDefaultNationality(cc),
    }))
  }, [])


  const [scanFields, setScanFields] = useState<Record<string, ScanSessionField>>({})

  useEffect(() => {
    if (!scanResult) return

    const raw = scanResult.fields

    const sessionFields: Record<string, ScanSessionField> = {}
    Object.entries(raw).forEach(([key, field]) => {
      sessionFields[key] = { ...field, source: "scanned" }
    })
    saveScanSession({
      scannedAt:    new Date().toISOString(),
      documentType: scanResult.sources[0]?.documentType ?? "UNKNOWN",
      fields:       sessionFields,
    })


    const normaliseDate = (raw: string): string | null => {
      const s = raw.trim()
      const datePart = s.split(" ")[0]
      const formats = ["dd/MM/yyyy", "dd-MM-yyyy", "yyyy-MM-dd", "MM/dd/yyyy"]
      for (const fmt of formats) {
        const p = parse(datePart, fmt, new Date())
        if (isValid(p)) return format(p, "dd/MM/yyyy")
      }
      return null
    }

    setFormData((prev) => {
      const next = { ...prev }

      if (!prev.coverageStartDate && raw.periodFrom?.filled && raw.periodFrom.value) {
        const normalised = normaliseDate(raw.periodFrom.value)
        if (normalised) {
          const parsed = parse(normalised, "dd/MM/yyyy", new Date())
          if (isValid(parsed)) next.coverageStartDate = parsed
        }
      }

      if (raw.occupiedAs?.filled && raw.occupiedAs.value) {
        next.propertyType = raw.occupiedAs.value.toLowerCase().includes("landed")
          ? "landed"
          : "non-landed"
      }

      if (raw.constructionClassification?.filled && raw.constructionClassification.value) {
        next.constructionType = raw.constructionClassification.value
          .toUpperCase()
          .includes("CLASS I")
          ? "full-brick"
          : "partial-brick"
      }

      if (!prev.postcode && raw.riskAddress?.filled && raw.riskAddress.value) {
        const found = raw.riskAddress.value
          .split(",")
          .map((s) => s.trim())
          .find((s) => /^\d{5}$/.test(s))
        if (found) next.postcode = found
      }

      const docType = (
        raw.documentType?.value ??
        scanResult.sources[0]?.documentType ??
        ""
      ).toUpperCase()
      const hasPassportNumber = !!(raw.passportNumber?.filled && raw.passportNumber.value)
      const isPassport = docType.includes("PASSPORT") || hasPassportNumber

      if (isPassport) {
        next.idType = "passport"

        const pp = raw.passportNumber ?? raw.idNumber
        if (pp?.filled && pp.value && !prev.passportNumber) {
          next.passportNumber = pp.value
        }

        if (raw.nationality?.filled && raw.nationality.value) {
          next.nationality = normaliseNationality(raw.nationality.value)
        }
      } else {
        const rawId = raw.idNumber ?? raw.nik
        if (rawId?.filled && rawId.value && !prev.nricNumber) {
          next.nricNumber = rawId.value
        }
      }

      const rawDob = raw.dateOfBirth ?? raw.birthdate ?? raw.birthDate
      if (!prev.dateOfBirth && rawDob?.filled && rawDob.value) {
        const normalised = normaliseDate(rawDob.value)
        if (normalised) next.dateOfBirth = normalised
      }

      return next
    })

    const toSession = (f: typeof raw[string] | undefined): ScanSessionField | undefined =>
      f ? { ...f, source: "scanned" as const } : undefined

    setScanFields({
      periodFrom:                 toSession(raw.periodFrom),
      occupiedAs:                 toSession(raw.occupiedAs),
      constructionClassification: toSession(raw.constructionClassification),
      postcode:                   toSession(raw.riskAddress ?? raw.postcode),
      idNumber:    toSession(raw.passportNumber ?? raw.idNumber ?? raw.nik),
      dateOfBirth: toSession(raw.dateOfBirth ?? raw.birthdate ?? raw.birthDate),
    } as Record<string, ScanSessionField>)
  }, [scanResult])

  const badge = (aiKey: string): ScanSessionField | undefined => scanFields[aiKey]

  const handleInputChange = useCallback((field: keyof FormData, value: string | Date | undefined | number) => {
    getMappingsForStep(1).forEach(({ aiKey, formKey }) => {
      if (formKey === field || (formKey === "idNumber" && (field === "passportNumber" || field === "nricNumber"))) {
        markFieldManual(aiKey)
        setScanFields((prev) => {
          if (!prev[aiKey]) return prev
          return { ...prev, [aiKey]: { ...prev[aiKey], source: "manual" } }
        })
      }
    })
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => {
      if (!prev[field] && !(field === "passportNumber" || field === "nricNumber")) return prev
      const next = { ...prev }
      delete next[field as string]
      if (field === "passportNumber" || field === "nricNumber") delete next.idNumber
      return next
    })
  }, [])

  const validate = useCallback((): Record<string, string> => {
    const e: Record<string, string> = {}

    if (!formData.ownershipType)     e.ownershipType     = t("validation.required")
    if (!formData.coverageStartDate) e.coverageStartDate = t("validation.selectDate")
    if (!formData.propertyType)      e.propertyType      = t("validation.required")
    if (!formData.constructionType)  e.constructionType  = t("validation.required")

    if (!formData.postcode.trim())          e.postcode = t("validation.required")
    else if (!/^\d{5}$/.test(formData.postcode.trim())) e.postcode = t("validation.postcode5")

    if (!formData.unoccupiedProperty) e.unoccupiedProperty = t("validation.required")
    if (!formData.previousLoss)       e.previousLoss       = t("validation.required")

    if (!formData.currentFlooding)             e.currentFlooding = t("validation.required")
    else if (formData.currentFlooding === "yes") e.currentFlooding = t("validation.floodingBlock")

    if (formData.idType === "passport") {
      const pp = formData.passportNumber.trim()
      if (!pp) e.idNumber = t("validation.required")
      else if (!/^[A-Za-z0-9]{6,9}$/.test(pp)) e.idNumber = t("validation.passportFormat")
      if (!formData.nationality) e.nationality = t("validation.required")
    } else {
      const id = formData.nricNumber.trim()
      if (!id) e.idNumber = t("validation.required")
      else if (countryCode === "ID" && !/^\d{16}$/.test(id)) e.idNumber = t("validation.ktpFormat")
    }

    if (!formData.dateOfBirth) e.dateOfBirth = t("validation.selectDate")

    return e
  }, [formData, countryCode, t])

  const handleIdTypeChange = useCallback((type: string) => {
    setFormData((prev) => ({
      ...prev,
      idType: type,
      ...(type !== "passport" && { nationality: getDefaultNationality(countryCode) }),
    }))
  }, [countryCode])

  const handleDobSelect = useCallback((date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, dateOfBirth: format(date, "dd/MM/yyyy") }))
    }
    setDobOpen(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const errs = validate()
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0]
      const el = document.getElementById(`field-${firstKey}`)
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setIsLoading(true)

    const session = getSession()
    if (!session) {
      setError(t("common.sessionExpired"))
      setIsLoading(false)
      return
    }

    try {
      const response = await getQuote(
        {
          customerId: session.customerId,
          ownershipType: formData.ownershipType,
          coverageStartDate: formData.coverageStartDate
            ? format(formData.coverageStartDate, "dd/MM/yyyy")
            : "",
          propertyType: formData.propertyType,
          // Derived from propertyType + constructionType — no longer a separate input
          propertySubType: `${formData.propertyType}-${formData.constructionType}`,
          numberOfStorey: formData.numberOfStorey,
          constructionType: formData.constructionType,
          postcode: formData.postcode,
          currentFlooding: formData.currentFlooding,
          unoccupiedProperty: formData.unoccupiedProperty,
          previousLoss: formData.previousLoss,
          idType: formData.idType,
          idNumber: formData.idType === "passport" ? formData.passportNumber : formData.nricNumber,
          nationality: formData.nationality,
          dateOfBirth: formData.dateOfBirth,
        },
        session.countryCode
      )


      if (!response.succeeded) {
        setError(response.message ?? t("form.failedToGetQuote"))
        return
      }

      saveQuotationId(response.data.quotationId)
      // Save start date so plan-customization can use it for CalculatePremium live preview
      if (formData.coverageStartDate) {
        saveQuotationStartDate(format(formData.coverageStartDate, "dd/MM/yyyy"))
      }
      // Persist the chosen ID type + number so fill-details locks to the same values
      saveQuotationIdentity({
        idType:   formData.idType,
        idNumber: formData.idType === "passport" ? formData.passportNumber : formData.nricNumber,
      })
      // Persist property summary so the summary bar can show coverage/construction type
      saveQuotationPropertySummary({
        propertyType:     formData.propertyType,
        numberOfStorey:   formData.numberOfStorey,
        constructionType: formData.constructionType,
      })
      router.push("/dashboard/quotation/customize")
    } catch (err) {
      console.error("[GetQuote Error]", err)
      setError(t("common.somethingWentWrong"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">{t("form.title")}</h1>
      </div>

      {/* Scan banner — shown once field mapping is wired up */}
      {scanResult && Object.keys(scanFields).length > 0 && null}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Owner/Tenant Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div id="field-ownershipType">
            <Label className="text-sm font-medium text-[#1A1A1A] mb-3 block">{t("form.iAmA")}</Label>
            <div className={cn(
              "grid grid-cols-2 bg-[#F5F5F5] rounded-lg p-1",
              fieldErrors.ownershipType && "ring-1 ring-[#D32F2F] rounded-lg",
            )}>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "rounded-md text-sm font-medium transition-colors duration-150",
                  formData.ownershipType === "owner"
                    ? "bg-[#333331] text-white shadow-sm hover:bg-[#4a4a48] hover:text-white"
                    : "bg-transparent text-[#555555] hover:bg-[#FEF3DC] hover:text-[#D4891A]",
                )}
                onClick={() => handleInputChange("ownershipType", "owner")}
              >
                {t("form.owner")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "rounded-md text-sm font-medium transition-colors duration-150",
                  formData.ownershipType === "tenant"
                    ? "bg-[#333331] text-white shadow-sm hover:bg-[#4a4a48] hover:text-white"
                    : "bg-transparent text-[#555555] hover:bg-[#FEF3DC] hover:text-[#D4891A]",
                )}
                onClick={() => handleInputChange("ownershipType", "tenant")}
              >
                {t("form.tenant")}
              </Button>
            </div>
            <FieldError msg={fieldErrors.ownershipType} />
          </div>

          <div id="field-coverageStartDate">
            <Label className="text-sm font-medium text-[#1A1A1A] mb-3 flex items-center gap-1">
              {t("form.coverageStartsFrom")}
              <ScanFieldBadge field={badge("periodFrom")} />
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn(
                  "w-full justify-start text-left font-normal border-[#E0E0E0] rounded-lg",
                  fieldErrors.coverageStartDate && "border-[#D32F2F]",
                )}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.coverageStartDate ? format(formData.coverageStartDate, "dd/MM/yyyy") : t("form.selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.coverageStartDate}
                  onSelect={(date) => handleInputChange("coverageStartDate", date)}
                  disabled={(date) => date < new Date()}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <FieldError msg={fieldErrors.coverageStartDate} />
          </div>
        </div>

        {/* Property Type Cards */}
        <div id="field-propertyType">
          <Label className="text-sm font-medium text-[#1A1A1A] mb-4 block">{t("form.propertyTypeLabel")}</Label>
          <div className="grid grid-cols-2 gap-4">
            {PROPERTY_TYPES.map((type) => (
              <Card
                key={type.id}
                className={cn(
                  "cursor-pointer transition-colors duration-150",
                  formData.propertyType === type.id
                    ? "border-2 border-[#00A651] bg-[#E6F7EE]"
                    : "border-[1.5px] border-[#E0E0E0] hover:border-[#F5A623] hover:shadow-md",
                )}
                onClick={() => handleInputChange("propertyType", type.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <type.icon className="h-8 w-8 text-[#F5A623]" />
                    {formData.propertyType === type.id && <div className="w-5 h-5 rounded-full bg-[#00A651] flex items-center justify-center"><Check className="h-3 w-3 text-white" strokeWidth={2.5} /></div>}
                  </div>
                  <h3 className="font-semibold text-[#1A1A1A] mb-1">
                    {type.id === "landed" ? t("form.landedTitle") : t("form.nonLandedTitle")}
                  </h3>
                  <p className="text-sm text-[#555555]">
                    {type.id === "landed" ? t("form.landedDesc") : t("form.nonLandedDesc")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <FieldError msg={fieldErrors.propertyType} />
        </div>

        {/* Number of Storey */}
        <div>
          <Label className="text-sm font-medium text-[#1A1A1A] mb-3 block">{t("form.numberOfStorey")}</Label>
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-lg border-[#E0E0E0] disabled:opacity-60"
              onClick={() => handleInputChange("numberOfStorey", Math.max(1, formData.numberOfStorey - 1))}
              disabled={formData.numberOfStorey <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-semibold w-8 text-center">{formData.numberOfStorey}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-lg border-[#E0E0E0] disabled:opacity-60"
              onClick={() => handleInputChange("numberOfStorey", Math.min(5, formData.numberOfStorey + 1))}
              disabled={formData.numberOfStorey >= 5}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Construction Type */}
        <div id="field-constructionType">
          <Label className="text-sm font-medium text-[#1A1A1A] mb-4 block">{t("form.constructionType")}</Label>
          <div className="space-y-3">
            {CONSTRUCTION_TYPES.map((type) => (
              <Card
                key={type.id}
                className={cn(
                  "cursor-pointer transition-colors duration-150",
                  formData.constructionType === type.id
                    ? "border-2 border-[#00A651] bg-[#E6F7EE]"
                    : "border-[1.5px] border-[#E0E0E0] hover:border-[#F5A623] hover:shadow-md",
                )}
                onClick={() => handleInputChange("constructionType", type.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-[#FEF3DC] rounded-lg flex items-center justify-center mr-3">
                          <div className="w-4 h-4 bg-[#F5A623] rounded"></div>
                        </div>
                        <h3 className="font-semibold text-[#1A1A1A]">
                          {type.id === "full-brick" ? t("form.fullBrickTitle") : t("form.partialBrickTitle")}
                        </h3>
                      </div>
                      <p className="text-sm text-[#555555]">
                        {type.id === "full-brick" ? t("form.fullBrickDesc") : t("form.partialBrickDesc")}
                      </p>
                    </div>
                    {formData.constructionType === type.id && (
                      <div className="w-5 h-5 rounded-full bg-[#00A651] flex items-center justify-center ml-3 flex-shrink-0"><Check className="h-3 w-3 text-white" strokeWidth={2.5} /></div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <FieldError msg={fieldErrors.constructionType} />
        </div>

        {/* Postcode */}
        <div id="field-postcode">
          <Label htmlFor="postcode" className="text-sm font-medium text-[#1A1A1A] mb-3 flex items-center">
            {t("form.postcodeLabel")}
            <ScanFieldBadge field={badge("postcode")} />
          </Label>
          <Input
            id="postcode"
            inputMode="numeric"
            maxLength={5}
            value={formData.postcode}
            onChange={(e) => handleInputChange("postcode", e.target.value.replace(/\D/g, ""))}
            className={cn("border-[#E0E0E0]", fieldErrors.postcode && "border-[#D32F2F]")}
            placeholder={t("form.postcodePlaceholder")}
          />
          <FieldError msg={fieldErrors.postcode} />
        </div>

        {/* Risk Assessment Questions */}
        <div className="space-y-6">
          {(
            [
              { field: "currentFlooding",    labelKey: "form.currentFlooding"    },
              { field: "unoccupiedProperty", labelKey: "form.unoccupiedProperty" },
              { field: "previousLoss",       labelKey: "form.previousLoss"       },
            ] as const
          ).map(({ field, labelKey }) => (
            <div key={field} id={`field-${field}`}>
              <Label className="text-sm font-medium text-[#1A1A1A] mb-3 block">
                {t(labelKey)}
              </Label>
              <div className={cn(
                "grid grid-cols-2 bg-[#F5F5F5] rounded-lg p-1",
                fieldErrors[field] && "ring-1 ring-[#D32F2F]",
              )}>
                {(["yes", "no"] as const).map((val) => (
                  <Button
                    key={val}
                    type="button"
                    variant="ghost"
                    className={cn(
                      "rounded-md text-sm font-medium transition-colors duration-150",
                      formData[field] === val
                        ? "bg-[#333331] text-white shadow-sm hover:bg-[#4a4a48] hover:text-white"
                        : "bg-transparent text-[#555555] hover:bg-[#FEF3DC] hover:text-[#D4891A]",
                    )}
                    onClick={() => handleInputChange(field, val)}
                  >
                    {t(val === "yes" ? "common.yes" : "common.no")}
                  </Button>
                ))}
              </div>
              <FieldError msg={fieldErrors[field]} />
            </div>
          ))}
        </div>

        {/* ── ID Type + ID Number (same row) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">

          {/* ID Type toggle pill */}
          <div>
            <Label className="text-sm font-medium text-[#1A1A1A] mb-3 block">{t("form.idTypeLabel")}</Label>
            <div className={cn(
              "grid bg-[#F5F5F5] rounded-lg p-1 gap-0",
              idTypeOptions.length === 2 ? "grid-cols-2" : "grid-cols-3",
            )}>
              {idTypeOptions.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant="ghost"
                  className={cn(
                    "rounded-md text-sm font-medium transition-colors duration-150 h-9",
                    formData.idType === opt.value
                      ? "bg-[#333331] text-white shadow-sm hover:bg-[#4a4a48] hover:text-white"
                      : "bg-transparent text-[#555555] hover:bg-[#FEF3DC] hover:text-[#D4891A]",
                  )}
                  onClick={() => handleIdTypeChange(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* ID Number — changes based on selected type */}
          <div id="field-idNumber">
            {formData.idType === "passport" ? (
              <>
                <Label htmlFor="passport" className="text-sm font-medium text-[#1A1A1A] mb-3 flex items-center">
                  {t("form.passportLabel")}
                  <ScanFieldBadge field={badge("idNumber")} />
                </Label>
                <Input
                  id="passport"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange("passportNumber", e.target.value.toUpperCase())}
                  className={cn("border-[#E0E0E0] rounded-lg h-10", fieldErrors.idNumber && "border-[#D32F2F]")}
                  placeholder={t("form.passportPlaceholder")}
                />
              </>
            ) : (
              <>
                <Label htmlFor="nric" className="text-sm font-medium text-[#1A1A1A] mb-3 flex items-center">
                  {getIdInputLabel(countryCode)}
                  <ScanFieldBadge field={badge("idNumber")} />
                </Label>
                <Input
                  id="nric"
                  inputMode={getIdInputMode(countryCode)}
                  maxLength={getIdMaxLength(countryCode)}
                  value={formData.nricNumber}
                  onChange={(e) => handleInputChange(
                    "nricNumber",
                    countryCode === "ID" ? e.target.value.replace(/\D/g, "") : e.target.value,
                  )}
                  className={cn("border-[#E0E0E0] rounded-lg h-10", fieldErrors.idNumber && "border-[#D32F2F]")}
                  placeholder={t("form.nricPlaceholder")}
                />
              </>
            )}
            <FieldError msg={fieldErrors.idNumber} />
          </div>
        </div>

        {/* ── Passport extras: Nationality + Date of Birth (same row) ── */}
        {formData.idType === "passport" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div id="field-nationality">
              <Label className="text-sm font-medium text-[#1A1A1A] mb-3 block">{t("form.nationalityLabel")}</Label>
              <Select value={formData.nationality} onValueChange={(value) => handleInputChange("nationality", value)}>
                <SelectTrigger className={cn("border-[#E0E0E0] rounded-lg h-10", fieldErrors.nationality && "border-[#D32F2F]")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NATIONALITIES.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError msg={fieldErrors.nationality} />
            </div>

            <div id="field-dateOfBirth">
              <Label htmlFor="dob-passport" className="text-sm font-medium text-[#1A1A1A] mb-3 flex items-center">
                {t("form.dobLabel")}
                <ScanFieldBadge field={badge("dateOfBirth")} />
              </Label>
              <Popover open={dobOpen} onOpenChange={setDobOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="dob-passport"
                    type="button"
                    variant="outline"
                    onClick={() => setDobOpen(true)}
                    className={cn(
                      "w-full justify-start text-left font-normal border-[#E0E0E0] rounded-lg h-10",
                      !formData.dateOfBirth && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    {formData.dateOfBirth || <span className="text-[#9E9E9E]">DD/MM/YYYY</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    startMonth={new Date(1900, 0)}
                    endMonth={new Date()}
                    selected={(() => {
                      if (!formData.dateOfBirth) return undefined
                      const parsed = parse(formData.dateOfBirth, "dd/MM/yyyy", new Date())
                      return isValid(parsed) ? parsed : undefined
                    })()}
                    onSelect={handleDobSelect}
                    disabled={{ after: new Date() }}
                    defaultMonth={(() => {
                      if (!formData.dateOfBirth) {
                        // Default to 30 years ago so the calendar opens near a typical birth year
                        return new Date(new Date().getFullYear() - 30, 0, 1)
                      }
                      const parsed = parse(formData.dateOfBirth, "dd/MM/yyyy", new Date())
                      return isValid(parsed) ? parsed : undefined
                    })()}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FieldError msg={fieldErrors.dateOfBirth} />
            </div>
          </div>
        )}

        {/* ── Date of Birth — non-passport only ── */}
        {formData.idType !== "passport" && (
          <div id="field-dateOfBirth">
            <Label htmlFor="dob" className="text-sm font-medium text-[#1A1A1A] mb-3 flex items-center">
              {t("form.dobLabel")}
              <ScanFieldBadge field={badge("dateOfBirth")} />
            </Label>
            <Popover open={dobOpen} onOpenChange={setDobOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="dob"
                  type="button"
                  variant="outline"
                  onClick={() => setDobOpen(true)}
                  className={cn(
                    "w-full justify-start text-left font-normal border-[#E0E0E0] rounded-lg h-10",
                    !formData.dateOfBirth && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  {formData.dateOfBirth || <span className="text-[#9E9E9E]">DD/MM/YYYY</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  startMonth={new Date(1900, 0)}
                  endMonth={new Date()}
                  selected={(() => {
                    if (!formData.dateOfBirth) return undefined
                    const parsed = parse(formData.dateOfBirth, "dd/MM/yyyy", new Date())
                    return isValid(parsed) ? parsed : undefined
                  })()}
                  onSelect={handleDobSelect}
                  disabled={{ after: new Date() }}
                  defaultMonth={(() => {
                    if (!formData.dateOfBirth) {
                      // Default to 30 years ago so the calendar opens near a typical birth year
                      return new Date(new Date().getFullYear() - 30, 0, 1)
                    }
                    const parsed = parse(formData.dateOfBirth, "dd/MM/yyyy", new Date())
                    return isValid(parsed) ? parsed : undefined
                  })()}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <FieldError msg={fieldErrors.dateOfBirth} />
          </div>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#F5A623] hover:bg-[#D4891A] text-white font-semibold h-12 text-base rounded-lg disabled:bg-[#E0E0E0] disabled:text-[#9E9E9E]"
          disabled={isLoading}
        >
          {isLoading ? t("form.gettingQuote") : t("form.getQuote")}
        </Button>
      </form>
    </div>
  )
}
