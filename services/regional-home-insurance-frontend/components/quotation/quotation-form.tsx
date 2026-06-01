"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { CalendarIcon, Home, Building, Minus, Plus, Check } from "lucide-react"
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
import { getQuote, saveQuotationId, saveQuotationStartDate } from "@/lib/api"
import { getSession } from "@/lib/session"
import { getIdTypeOptions, getDefaultNationality } from "@/lib/id-type-helpers"
import { markFieldManual, type ScanSessionField } from "@/lib/scan-session"
import { getMappingsForStep } from "@/lib/scan-field-map"
import ScanFieldBadge from "@/components/quotation/scan-field-badge"
import ScanBanner from "@/components/quotation/scan-banner"

interface FormData {
  ownershipType: string
  coverageStartDate: Date | undefined
  propertyType: string
  propertySubType: string
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

// Static data — defined outside component so they're never recreated on re-render
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

interface QuotationFormProps {
  /** Raw scan result passed from DocumentScanner — field mapping handled here */
  scanResult?: import("@/lib/api/scan-document").ScanDocumentResult | null
}

export default function QuotationForm({ scanResult }: QuotationFormProps = {}) {
  const router = useRouter()
  const t = useTranslations("quotation")
  const countryCode = getSession()?.countryCode ?? "MY"
  const idTypeOptions = getIdTypeOptions(countryCode)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dobOpen, setDobOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    ownershipType: "owner",
    coverageStartDate: new Date("2025-06-21"),
    propertyType: "landed",
    propertySubType: "landed-partial-brick",
    numberOfStorey: 1,
    constructionType: "partial-brick",
    postcode: "09300",
    currentFlooding: "no",
    unoccupiedProperty: "no",
    previousLoss: "no",
    idType: idTypeOptions[0].value,
    passportNumber: "021217020209",
    nricNumber: "",
    nationality: getDefaultNationality(countryCode),
    dateOfBirth: "17/12/2002",
  })

  // ── Scan result → form field mapping ──────────────────────────────────────
  // scanResult contains raw document fields (nik, name, birthdate, province…).
  // Field mapping logic will be added here once the AI key schema is finalised.
  // For now we just track the result so the banner can reference it.

  const [scanFields, setScanFields] = useState<Record<string, ScanSessionField>>({})

  useEffect(() => {
    if (!scanResult) return
    // TODO: map scanResult.fields (nik, name, birthdate…) → formData fields
    // e.g. scanResult.fields.nik?.value → nricNumber
    //      scanResult.fields.birthdate?.value → dateOfBirth (reformat)
    // For now: no auto-fill, just acknowledge scan happened
    setScanFields({})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanResult])

  // Helper to get badge data for a given AI key
  const badge = (aiKey: string): ScanSessionField | undefined => scanFields[aiKey]

  // Mark a field as manually edited when customer changes it
  const handleInputChange = useCallback((field: keyof FormData, value: string | Date | undefined | number) => {
    // Find if this form field matches any AI key and mark it manual
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
  }, [])

  const handleIdTypeChange = useCallback((type: string) => {
    setFormData((prev) => ({
      ...prev,
      idType: type,
      // Snap nationality back to country default when leaving passport
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
          propertySubType: formData.propertySubType,
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

      console.log("[GetQuote Response]", response)

      if (!response.succeeded) {
        setError(response.message ?? t("form.failedToGetQuote"))
        return
      }

      saveQuotationId(response.data.quotationId)
      // Save start date so plan-customization can use it for CalculatePremium live preview
      if (formData.coverageStartDate) {
        saveQuotationStartDate(format(formData.coverageStartDate, "dd/MM/yyyy"))
      }
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
          <div>
            <Label className="text-sm font-medium text-[#1A1A1A] mb-3 block">{t("form.iAmA")}</Label>
            <div className="grid grid-cols-2 bg-[#F5F5F5] rounded-lg p-1">
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "rounded-md text-sm font-medium transition-all duration-150",
                  formData.ownershipType === "owner"
                    ? "bg-[#1A1A1A] text-white shadow-sm hover:bg-[#333333] hover:text-white"
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
                  "rounded-md text-sm font-medium transition-all duration-150",
                  formData.ownershipType === "tenant"
                    ? "bg-[#1A1A1A] text-white shadow-sm hover:bg-[#333333] hover:text-white"
                    : "bg-transparent text-[#555555] hover:bg-[#FEF3DC] hover:text-[#D4891A]",
                )}
                onClick={() => handleInputChange("ownershipType", "tenant")}
              >
                {t("form.tenant")}
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-[#1A1A1A] mb-3 block">{t("form.coverageStartsFrom")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal border-[#E0E0E0] rounded-lg">
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
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Property Type Dropdown */}
        <div>
          <Label className="text-sm font-medium text-[#1A1A1A] mb-3 block">{t("form.propertyTypeLabel")}</Label>
          <Select
            value={formData.propertySubType}
            onValueChange={(value) => handleInputChange("propertySubType", value)}
          >
            <SelectTrigger className="w-full border-[#E0E0E0]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landed-partial-brick">{t("form.landedPartialBrick")}</SelectItem>
              <SelectItem value="landed-full-brick">{t("form.landedFullBrick")}</SelectItem>
              <SelectItem value="non-landed-partial-brick">{t("form.nonLandedPartialBrick")}</SelectItem>
              <SelectItem value="non-landed-full-brick">{t("form.nonLandedFullBrick")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type Cards */}
        <div>
          <Label className="text-sm font-medium text-[#1A1A1A] mb-4 block">{t("form.propertyTypeLabel")}</Label>
          <div className="grid grid-cols-2 gap-4">
            {PROPERTY_TYPES.map((type) => (
              <Card
                key={type.id}
                className={cn(
                  "cursor-pointer transition-all duration-150",
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
        <div>
          <Label className="text-sm font-medium text-[#1A1A1A] mb-4 block">{t("form.constructionType")}</Label>
          <div className="space-y-3">
            {CONSTRUCTION_TYPES.map((type) => (
              <Card
                key={type.id}
                className={cn(
                  "cursor-pointer transition-all duration-150",
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
        </div>

        {/* Postcode */}
        <div>
          <Label htmlFor="postcode" className="text-sm font-medium text-[#1A1A1A] mb-3 flex items-center">
            {t("form.postcodeLabel")}
            <ScanFieldBadge field={badge("postcode")} />
          </Label>
          <Input
            id="postcode"
            value={formData.postcode}
            onChange={(e) => handleInputChange("postcode", e.target.value)}
            className="border-[#E0E0E0]"
            placeholder={t("form.postcodePlaceholder")}
          />
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
            <div key={field}>
              <Label className="text-sm font-medium text-[#1A1A1A] mb-3 block">
                {t(labelKey)}
              </Label>
              <div className="grid grid-cols-2 bg-[#F5F5F5] rounded-lg p-1">
                {(["yes", "no"] as const).map((val) => (
                  <Button
                    key={val}
                    type="button"
                    variant="ghost"
                    className={cn(
                      "rounded-md text-sm font-medium transition-all duration-150",
                      formData[field] === val
                        ? "bg-[#1A1A1A] text-white shadow-sm hover:bg-[#333333] hover:text-white"
                        : "bg-transparent text-[#555555] hover:bg-[#FEF3DC] hover:text-[#D4891A]",
                    )}
                    onClick={() => handleInputChange(field, val)}
                  >
                    {t(val === "yes" ? "common.yes" : "common.no")}
                  </Button>
                ))}
              </div>
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
                    "rounded-md text-sm font-medium transition-all duration-150 h-9",
                    formData.idType === opt.value
                      ? "bg-[#1A1A1A] text-white shadow-sm hover:bg-[#333333] hover:text-white"
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
          <div>
            {formData.idType === "passport" ? (
              <>
                <Label htmlFor="passport" className="text-sm font-medium text-[#1A1A1A] mb-3 flex items-center">
                  {t("form.passportLabel")}
                  <ScanFieldBadge field={badge("idNumber")} />
                </Label>
                <Input
                  id="passport"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                  className="border-[#E0E0E0] rounded-lg h-10"
                  placeholder={t("form.passportPlaceholder")}
                />
              </>
            ) : (
              <>
                <Label htmlFor="nric" className="text-sm font-medium text-[#1A1A1A] mb-3 flex items-center">
                  {t("form.nricLabel")}
                  <ScanFieldBadge field={badge("idNumber")} />
                </Label>
                <Input
                  id="nric"
                  value={formData.nricNumber}
                  onChange={(e) => handleInputChange("nricNumber", e.target.value)}
                  className="border-[#E0E0E0] rounded-lg h-10"
                  placeholder={t("form.nricPlaceholder")}
                />
              </>
            )}
          </div>
        </div>

        {/* ── Passport extras: Nationality + Date of Birth (same row) ── */}
        {formData.idType === "passport" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-[#1A1A1A] mb-3 block">{t("form.nationalityLabel")}</Label>
              <Select value={formData.nationality} onValueChange={(value) => handleInputChange("nationality", value)}>
                <SelectTrigger className="border-[#E0E0E0] rounded-lg h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NATIONALITIES.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
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
                    selected={(() => {
                      if (!formData.dateOfBirth) return undefined
                      const parsed = parse(formData.dateOfBirth, "dd/MM/yyyy", new Date())
                      return isValid(parsed) ? parsed : undefined
                    })()}
                    onSelect={handleDobSelect}
                    disabled={{ after: new Date() }}
                    defaultMonth={(() => {
                      if (!formData.dateOfBirth) return undefined
                      const parsed = parse(formData.dateOfBirth, "dd/MM/yyyy", new Date())
                      return isValid(parsed) ? parsed : undefined
                    })()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* ── Date of Birth — non-passport only ── */}
        {formData.idType !== "passport" && (
          <div>
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
                  selected={(() => {
                    if (!formData.dateOfBirth) return undefined
                    const parsed = parse(formData.dateOfBirth, "dd/MM/yyyy", new Date())
                    return isValid(parsed) ? parsed : undefined
                  })()}
                  onSelect={handleDobSelect}
                  disabled={{ after: new Date() }}
                  defaultMonth={(() => {
                    if (!formData.dateOfBirth) return undefined
                    const parsed = parse(formData.dateOfBirth, "dd/MM/yyyy", new Date())
                    return isValid(parsed) ? parsed : undefined
                  })()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
