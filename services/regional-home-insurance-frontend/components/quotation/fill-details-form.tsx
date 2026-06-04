"use client"

import type React from "react"

import { useState, useCallback, useMemo, memo, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { ChevronDown, ChevronUp, User, Home, Mail, CreditCard, CalendarIcon } from "lucide-react"
import { format, parse, isValid } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import CalculationSummary from "./calculation-summary"
import QuotationStepper from "./quotation-stepper"
import AddressSelect, { type AddressValues } from "./address-select"
import { createProposal, saveProposalId, getQuotationId, getQuotationIdentity } from "@/lib/api"
import { getSession } from "@/lib/session"
import { getScanSession, markFieldManual, type ScanSessionField } from "@/lib/scan-session"
import { getMappingsForStep } from "@/lib/scan-field-map"
import ScanFieldBadge from "@/components/quotation/scan-field-badge"
import ScanBanner from "@/components/quotation/scan-banner"

// ─── Section data interfaces ──────────────────────────────────────────────────

interface PersonalData {
  name: string
  idType: string
  nricNumber: string
  nationality: string
  race: string
  gender: string
  dateOfBirth: string
  mobileNumber: string
  email: string
}

interface PropertyData {
  propertyAddress1: string
  propertyAddress2: string
  propertyCity:     string
  propertyPostcode: string
  propertyState:    string
  propertyCountry:  string
  propertyDistrict: string   // Kecamatan (ID), District (KH/PH if applicable)
  propertyVillage:  string   // Kelurahan/Desa (ID), Commune (KH)
}

interface MailingData {
  sameAsPropertyAddress: boolean
  mailingAddress1:  string
  mailingAddress2:  string
  mailingCity:      string
  mailingPostcode:  string
  mailingState:     string
  mailingCountry:   string
  mailingDistrict:  string   // Kecamatan (ID), District (KH/PH if applicable)
  mailingVillage:   string   // Kelurahan/Desa (ID), Commune (KH)
}

interface BankData {
  bankName: string
  accountNumber: string
}

// ─── Country-specific helpers ─────────────────────────────────────────────────

/** ID type options per country code */
function getIdTypeOptions(cc: string): { value: string; label: string }[] {
  switch (cc.toUpperCase()) {
    case "ID": return [
      { value: "KTP",      label: "KTP" },
      { value: "PASSPORT", label: "PASSPORT" },
    ]
    case "PH": return [
      { value: "PHILID",   label: "PhilID" },
      { value: "PASSPORT", label: "PASSPORT" },
    ]
    case "KH": return [
      { value: "KHMERID",  label: "Khmer Identity Card" },
      { value: "PASSPORT", label: "PASSPORT" },
    ]
    default: return [ // MY and fallback
      { value: "MYKAD",    label: "MYKAD" },
      { value: "PASSPORT", label: "PASSPORT" },
      { value: "MYPR",     label: "MYPR" },
    ]
  }
}

/** Default nationality when a non-passport ID type is selected */
function getDefaultNationality(cc: string): string {
  switch (cc.toUpperCase()) {
    case "ID": return "INDONESIAN"
    case "PH": return "FILIPINO"
    case "KH": return "CAMBODIAN"
    default:   return "MALAYSIAN"
  }
}

// ─── Static constants (never recreated) ──────────────────────────────────────

/** International dialling code per region (hard-coded per requirement). */
const PHONE_DIAL_CODE: Record<string, string> = {
  MY: "+60",
  ID: "+62",
  PH: "+63",
  KH: "+855",
}
function getDialCode(cc: string): string {
  return PHONE_DIAL_CODE[cc.toUpperCase()] ?? "+62"
}

const RACES = ["MALAY", "CHINESE", "INDIAN", "OTHERS"]

/** Inline field error message + red styling helper. */
function FErr({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="mt-1 text-xs text-[#D32F2F]">{msg}</p>
}
/** Returns red-border class when an error is present. */
const errCls = (msg?: string) => (msg ? "border-[#D32F2F] focus-visible:ring-[#D32F2F]" : "")

const BANKS = [
  "MAYBANK", "CIMB BANK", "PUBLIC BANK", "RHB BANK", "HONG LEONG BANK",
  "AMBANK", "BANK ISLAM", "BANK RAKYAT", "AFFIN BANK", "ALLIANCE BANK",
]

// ─── Memoized section components ─────────────────────────────────────────────

interface PersonalSectionProps {
  data: PersonalData
  isExpanded: boolean
  onToggle: () => void
  onChange: (field: keyof PersonalData, value: string) => void
  countryCode: string
  scanFields?: Record<string, ScanSessionField>
  errors?: Record<string, string>
}

const PersonalDetailsSection = memo(function PersonalDetailsSection({
  data,
  isExpanded,
  onToggle,
  onChange,
  countryCode,
  scanFields = {},
  errors = {},
}: PersonalSectionProps) {
  const sf = (aiKey: string): ScanSessionField | undefined => scanFields[aiKey]
  const t = useTranslations("quotation")
  const [dobOpen, setDobOpen] = useState(false)

  const idTypeOptions = getIdTypeOptions(countryCode)
  const isPassport    = data.idType === "PASSPORT"

  /** Parse stored "DD/MM/YYYY" → Date for the Calendar */
  const dobDate: Date | undefined = (() => {
    if (!data.dateOfBirth) return undefined
    const parsed = parse(data.dateOfBirth, "dd/MM/yyyy", new Date())
    return isValid(parsed) ? parsed : undefined
  })()

  const handleIdTypeChange = (value: string) => {
    onChange("idType", value)
    // When switching away from PASSPORT, snap nationality back to the country default
    if (value !== "PASSPORT") {
      onChange("nationality", getDefaultNationality(countryCode))
    }
  }

  const handleDobSelect = (date: Date | undefined) => {
    if (date) {
      onChange("dateOfBirth", format(date, "dd/MM/yyyy"))
    }
    setDobOpen(false)
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{t("fillDetails.personalDetails")}</span>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="inline-flex items-center">
              {t("fillDetails.nameLabel")}
              <ScanFieldBadge field={sf("fullName")} />
            </Label>
            <Input
              id="name"
              placeholder={t("fillDetails.namePlaceholder")}
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              className={errCls(errors.name)}
            />
            <FErr msg={errors.name} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("fillDetails.idType")}</Label>
              <Select value={data.idType} disabled>
                <SelectTrigger className="bg-gray-100 opacity-100 cursor-default">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {idTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nric">{t("fillDetails.nricLabel")}</Label>
              <Input
                id="nric"
                value={data.nricNumber}
                onChange={(e) => onChange("nricNumber", e.target.value)}
                className="bg-gray-100"
                readOnly
              />
            </div>
          </div>

          {/* Nationality — only shown when customer selects PASSPORT */}
          {isPassport && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t("fillDetails.nationality")}</Label>
                <Select value={data.nationality} onValueChange={(value) => onChange("nationality", value)}>
                  <SelectTrigger className={errCls(errors.nationality)}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALAYSIAN">MALAYSIAN</SelectItem>
                    <SelectItem value="SINGAPOREAN">SINGAPOREAN</SelectItem>
                    <SelectItem value="INDONESIAN">INDONESIAN</SelectItem>
                    <SelectItem value="FILIPINO">FILIPINO</SelectItem>
                    <SelectItem value="CAMBODIAN">CAMBODIAN</SelectItem>
                    <SelectItem value="OTHER">OTHER</SelectItem>
                  </SelectContent>
                </Select>
                <FErr msg={errors.nationality} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("fillDetails.race")} <span className="text-[#9E9E9E] font-normal">({t("fillDetails.optional")})</span></Label>
              <Select value={data.race} onValueChange={(value) => onChange("race", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("fillDetails.selectRace")} />
                </SelectTrigger>
                <SelectContent>
                  {RACES.map((race) => (
                    <SelectItem key={race} value={race}>
                      {race}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>{t("fillDetails.gender")}</Label>
            <div className={cn("grid grid-cols-2 gap-3 mt-2 rounded-md", errors.gender && "ring-1 ring-[#D32F2F] p-1")}>
              <Button
                type="button"
                variant={data.gender === "MALE" ? "default" : "outline"}
                className={cn(
                  data.gender === "MALE"
                    ? "bg-gray-800 text-white"
                    : "border-gray-300 text-[#555555] hover:bg-gray-50",
                )}
                onClick={() => onChange("gender", "MALE")}
              >
                {t("fillDetails.male")}
              </Button>
              <Button
                type="button"
                variant={data.gender === "FEMALE" ? "default" : "outline"}
                className={cn(
                  data.gender === "FEMALE"
                    ? "bg-gray-800 text-white"
                    : "border-gray-300 text-[#555555] hover:bg-gray-50",
                )}
                onClick={() => onChange("gender", "FEMALE")}
              >
                {t("fillDetails.female")}
              </Button>
            </div>
            <FErr msg={errors.gender} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date of Birth — calendar picker */}
            <div>
              <Label htmlFor="dob" className="inline-flex items-center">
                {t("fillDetails.dobLabel")}
                <ScanFieldBadge field={sf("dateOfBirth")} />
              </Label>
              <Popover open={dobOpen} onOpenChange={setDobOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="dob"
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !data.dateOfBirth && "text-muted-foreground",
                      errCls(errors.dateOfBirth),
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    {data.dateOfBirth || <span className="text-[#9E9E9E]">DD/MM/YYYY</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    startMonth={new Date(1900, 0)}
                    endMonth={new Date()}
                    selected={dobDate}
                    onSelect={handleDobSelect}
                    disabled={{ after: new Date() }}
                    defaultMonth={dobDate ?? new Date(new Date().getFullYear() - 30, 0, 1)}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FErr msg={errors.dateOfBirth} />
            </div>

            <div>
              <Label htmlFor="mobile">{t("fillDetails.mobileLabel")}</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-[#1A1A1A] bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                  {getDialCode(countryCode)}
                </span>
                <Input
                  id="mobile"
                  inputMode="numeric"
                  className={cn("rounded-l-none", errCls(errors.mobileNumber))}
                  value={data.mobileNumber}
                  onChange={(e) => onChange("mobileNumber", e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <FErr msg={errors.mobileNumber} />
            </div>
          </div>

          <div>
            <Label htmlFor="email">{t("fillDetails.emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("fillDetails.emailPlaceholder")}
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              className={errCls(errors.email)}
            />
            <FErr msg={errors.email} />
          </div>
        </CardContent>
      )}
    </Card>
  )
})

// ─────────────────────────────────────────────────────────────────────────────

interface PropertySectionProps {
  data: PropertyData
  isExpanded: boolean
  onToggle: () => void
  onChange: (field: keyof PropertyData, value: string) => void
  countryCode: string
  scanFields?: Record<string, ScanSessionField>
  errors?: Record<string, string>
}

const PropertyDetailsSection = memo(function PropertyDetailsSection({
  data,
  isExpanded,
  onToggle,
  onChange,
  countryCode,
  scanFields = {},
  errors = {},
}: PropertySectionProps) {
  const sf = (aiKey: string): ScanSessionField | undefined => scanFields[aiKey]
  const t = useTranslations("quotation")
  return (
    <Card className="border border-gray-200">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-5 w-5" />
            <span>{t("fillDetails.propertyDetails")}</span>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address1" className="inline-flex items-center">
              {t("fillDetails.address1")}
              <ScanFieldBadge field={sf("addressLine1")} />
            </Label>
            <Input
              id="address1"
              placeholder={t("fillDetails.address1Placeholder")}
              value={data.propertyAddress1}
              onChange={(e) => onChange("propertyAddress1", e.target.value)}
              className={errCls(errors.propertyAddress1)}
            />
            <FErr msg={errors.propertyAddress1} />
            {(errors.propertyState || errors.propertyCity || errors.propertyPostcode) && (
              <FErr msg={t("validation.completeAddress")} />
            )}
          </div>

          <div>
            <Label htmlFor="address2">{t("fillDetails.address2")}</Label>
            <Input
              id="address2"
              placeholder={t("fillDetails.address2Placeholder")}
              value={data.propertyAddress2}
              onChange={(e) => onChange("propertyAddress2", e.target.value)}
            />
          </div>

          <AddressSelect
            countryCode={countryCode}
            values={{
              city:     data.propertyCity,
              postcode: data.propertyPostcode,
              state:    data.propertyState,
              country:  data.propertyCountry,
            }}
            onChange={(partial) => {
              if (partial.city     !== undefined) onChange("propertyCity",     partial.city)
              if (partial.postcode !== undefined) onChange("propertyPostcode", partial.postcode)
              if (partial.state    !== undefined) onChange("propertyState",    partial.state)
              if (partial.country  !== undefined) onChange("propertyCountry",  partial.country)
              if (partial.district !== undefined) onChange("propertyDistrict", partial.district)
              if (partial.village  !== undefined) onChange("propertyVillage",  partial.village)
            }}
          />
        </CardContent>
      )}
    </Card>
  )
})

// ─────────────────────────────────────────────────────────────────────────────

interface MailingSectionProps {
  data: MailingData
  isExpanded: boolean
  onToggle: () => void
  onChange: (field: keyof MailingData, value: string | boolean) => void
  countryCode: string
  errors?: Record<string, string>
}

const MailingAddressSection = memo(function MailingAddressSection({
  data,
  isExpanded,
  onToggle,
  onChange,
  countryCode,
  errors = {},
}: MailingSectionProps) {
  const t = useTranslations("quotation")
  return (
    <Card className="border border-gray-200">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>{t("fillDetails.mailingAddress")}</span>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="same-address"
              checked={data.sameAsPropertyAddress}
              onCheckedChange={(checked) => onChange("sameAsPropertyAddress", checked as boolean)}
            />
            <Label htmlFor="same-address">{t("fillDetails.sameAsProperty")}</Label>
          </div>

          <div>
            <Label htmlFor="mail-address1">{t("fillDetails.address1")}</Label>
            <Input
              id="mail-address1"
              placeholder={t("fillDetails.address1Placeholder")}
              value={data.mailingAddress1}
              onChange={(e) => onChange("mailingAddress1", e.target.value)}
              readOnly={data.sameAsPropertyAddress}
              className={cn(data.sameAsPropertyAddress ? "bg-gray-100" : "", errCls(errors.mailingAddress1))}
            />
            <FErr msg={errors.mailingAddress1} />
            {errors.mailingPostcode && <FErr msg={t("validation.completeAddress")} />}
          </div>

          <div>
            <Label htmlFor="mail-address2">{t("fillDetails.address2")}</Label>
            <Input
              id="mail-address2"
              placeholder={t("fillDetails.address2Placeholder")}
              value={data.mailingAddress2}
              onChange={(e) => onChange("mailingAddress2", e.target.value)}
              readOnly={data.sameAsPropertyAddress}
              className={data.sameAsPropertyAddress ? "bg-gray-100" : ""}
            />
          </div>

          {/* When "same as property" is ticked, show copied values as readonly fields.
              AddressSelect uses internal dropdown state that can't be pre-seeded from
              outside, so we bypass it entirely to display the mirrored values.
              Fields shown depend on country — district/village only appear when non-empty. */}
          {data.sameAsPropertyAddress ? (
            <div className="space-y-3">
              {/* Province / State */}
              {data.mailingState && (
                <div>
                  <Label>
                    {countryCode.toUpperCase() === "ID" ? "Provinsi"
                      : countryCode.toUpperCase() === "KH" ? "Province"
                      : countryCode.toUpperCase() === "PH" ? "Province"
                      : t("fillDetails.state")}
                  </Label>
                  <Input value={data.mailingState} readOnly className="bg-gray-100" />
                </div>
              )}

              {/* City / Kabupaten / District */}
              {data.mailingCity && (
                <div>
                  <Label>
                    {countryCode.toUpperCase() === "ID" ? "Kabupaten / Kota"
                      : countryCode.toUpperCase() === "KH" ? "District"
                      : countryCode.toUpperCase() === "PH" ? "City / Municipality"
                      : t("fillDetails.city")}
                  </Label>
                  <Input value={data.mailingCity} readOnly className="bg-gray-100" />
                </div>
              )}

              {/* Kecamatan / District (ID only) */}
              {data.mailingDistrict && (
                <div>
                  <Label>{countryCode.toUpperCase() === "ID" ? "Kecamatan" : "District"}</Label>
                  <Input value={data.mailingDistrict} readOnly className="bg-gray-100" />
                </div>
              )}

              {/* Kelurahan / Commune (ID + KH) */}
              {data.mailingVillage && (
                <div>
                  <Label>{countryCode.toUpperCase() === "ID" ? "Kelurahan / Desa" : "Commune"}</Label>
                  <Input value={data.mailingVillage} readOnly className="bg-gray-100" />
                </div>
              )}

              {/* Postcode + Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{countryCode.toUpperCase() === "ID" ? "Kode Pos" : t("fillDetails.postcode")}</Label>
                  <Input value={data.mailingPostcode} readOnly className="bg-gray-100" />
                </div>
                <div>
                  <Label>{countryCode.toUpperCase() === "ID" ? "Negara" : t("fillDetails.country")}</Label>
                  <Input value={data.mailingCountry} readOnly className="bg-gray-100" />
                </div>
              </div>
            </div>
          ) : (
            <AddressSelect
              countryCode={countryCode}
              values={{
                city:     data.mailingCity,
                postcode: data.mailingPostcode,
                state:    data.mailingState,
                country:  data.mailingCountry,
                district: data.mailingDistrict,
                village:  data.mailingVillage,
              }}
              onChange={(partial) => {
                if (partial.city     !== undefined) onChange("mailingCity",     partial.city)
                if (partial.postcode !== undefined) onChange("mailingPostcode", partial.postcode)
                if (partial.state    !== undefined) onChange("mailingState",    partial.state)
                if (partial.country  !== undefined) onChange("mailingCountry",  partial.country)
                if (partial.district !== undefined) onChange("mailingDistrict", partial.district)
                if (partial.village  !== undefined) onChange("mailingVillage",  partial.village)
              }}
            />
          )}
        </CardContent>
      )}
    </Card>
  )
})

// ─────────────────────────────────────────────────────────────────────────────

interface BankSectionProps {
  data: BankData
  isExpanded: boolean
  onToggle: () => void
  onChange: (field: keyof BankData, value: string) => void
  errors?: Record<string, string>
}

const BankDetailsSection = memo(function BankDetailsSection({
  data,
  isExpanded,
  onToggle,
  onChange,
  errors = {},
}: BankSectionProps) {
  const t = useTranslations("quotation")
  return (
    <Card className="border border-gray-200">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>{t("fillDetails.bankDetails")}</span>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <p className="text-sm text-[#555555]">{t("fillDetails.bankDetailsDesc")}</p>

          <div>
            <Label>{t("fillDetails.bankName")}</Label>
            <Select value={data.bankName} onValueChange={(value) => onChange("bankName", value)}>
              <SelectTrigger className={errCls(errors.bankName)}>
                <SelectValue placeholder={t("fillDetails.selectBank")} />
              </SelectTrigger>
              <SelectContent>
                {BANKS.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FErr msg={errors.bankName} />
          </div>

          <div>
            <Label htmlFor="account">{t("fillDetails.accountLabel")}</Label>
            <Input
              id="account"
              value={data.accountNumber}
              onChange={(e) => onChange("accountNumber", e.target.value)}
              className={errCls(errors.accountNumber)}
            />
            <FErr msg={errors.accountNumber} />
          </div>
        </CardContent>
      )}
    </Card>
  )
})

// ─── Main form component ──────────────────────────────────────────────────────

export default function FillDetailsForm() {
  const router = useRouter()
  const t = useTranslations("quotation")
  const countryCode = getSession()?.countryCode ?? "ID"

  const COUNTRY_NAMES: Record<string, string> = {
    MY: "MALAYSIA",
    ID: "INDONESIA",
    PH: "PHILIPPINES",
    KH: "CAMBODIA",
  }
  const countryName = COUNTRY_NAMES[countryCode.toUpperCase()] ?? countryCode.toUpperCase()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Per-field validation errors, keyed by field name (matches input ids where possible)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    property: true,
    mailing: true,
    bank: true,
  })

  // ── Separate state per section — typing in one section won't re-render others ──

  // Identity carried over from the quotation page — locks idType + idNumber here.
  const quotationIdentity = getQuotationIdentity()
  const defaultIdType = quotationIdentity?.idType
    ? quotationIdentity.idType.toUpperCase()              // "ktp" → "KTP", "passport" → "PASSPORT"
    : getIdTypeOptions(countryCode)[0].value
  const defaultNationality = getDefaultNationality(countryCode)

  const [personalData, setPersonalData] = useState<PersonalData>({
    name:         "",
    idType:       defaultIdType,
    nricNumber:   quotationIdentity?.idNumber ?? "",
    nationality:  defaultNationality,
    race:         "",
    gender:       "",
    dateOfBirth:  "",
    mobileNumber: "",
    email:        "",
  })

  const [propertyData, setPropertyData] = useState<PropertyData>({
    propertyAddress1: "",
    propertyAddress2: "",
    propertyCity:     "",
    propertyPostcode: "",
    propertyState:    "",
    propertyCountry:  countryName,
    propertyDistrict: "",
    propertyVillage:  "",
  })

  const [mailingData, setMailingData] = useState<MailingData>({
    sameAsPropertyAddress: false,
    mailingAddress1:  "",
    mailingAddress2:  "",
    mailingCity:      "",
    mailingPostcode:  "",
    mailingState:     "",
    mailingCountry:   countryName,   // pre-set so Negara/Country is never blank
    mailingDistrict:  "",
    mailingVillage:   "",
  })

  const [bankData, setBankData] = useState<BankData>({
    bankName:      "",
    accountNumber: "",
  })

  // ── Scan session auto-fill ────────────────────────────────────────────────

  const [scanSession,  setScanSession]  = useState(() => getScanSession())
  const [scanFields,   setScanFields]   = useState<Record<string, ScanSessionField>>({})

  useEffect(() => {
    const session = getScanSession()
    if (!session) return
    setScanSession(session)

    const raw = session.fields
    const applied: Record<string, ScanSessionField> = {}

    // ── Helper: try each key in order, return first filled entry ─────────────
    const resolve = (keys: string[]) => {
      for (const k of keys) {
        const f = raw[k]
        if (f?.filled && f.value) return { f, k }
      }
      return null
    }

    // ── Gender normaliser — KTP returns Indonesian ("Laki-Laki" / "Perempuan")
    const normaliseGender = (v: string): string => {
      const lower = v.toLowerCase()
      if (lower.includes("laki") || lower.includes("male")   || lower === "m") return "MALE"
      if (lower.includes("perempuan") || lower.includes("female") || lower === "f") return "FEMALE"
      return v.toUpperCase()
    }

    // ── Personal data auto-fill ───────────────────────────────────────────────
    setPersonalData((prev) => {
      const next = { ...prev }

      // Full name: policy → "insuredName", KTP-ID → "name", PHL → "givenNames"
      const name = resolve(["insuredName", "name", "fullName", "givenNames"])
      if (name && !prev.name) {
        next.name = name.f.value!
        applied[name.k] = { ...name.f, source: "scanned" }
      }

      // NIK / ID number: KTP → "nik", PHL → "idNumber"
      const nik = resolve(["nik", "idNumber", "nric"])
      if (nik && !prev.nricNumber) {
        next.nricNumber = nik.f.value!
        applied[nik.k] = { ...nik.f, source: "scanned" }
      }

      // Date of birth: KTP → "birthdate", PHL → "dateOfBirth"
      const dob = resolve(["dateOfBirth", "birthdate", "birthDate"])
      if (dob && !prev.dateOfBirth) {
        next.dateOfBirth = dob.f.value!
        applied[dob.k] = { ...dob.f, source: "scanned" }
      }

      // Gender: KTP → "gender" (value: "Laki-Laki" / "Perempuan")
      const gender = resolve(["gender"])
      if (gender && !prev.gender) {
        next.gender = normaliseGender(gender.f.value!)
        applied[gender.k] = { ...gender.f, source: "scanned" }
      }

      return next
    })

    // ── Property data auto-fill ───────────────────────────────────────────────
    setPropertyData((prev) => {
      const next = { ...prev }

      // Address line 1: policy → "insuredAddress" / "riskAddress", PHL → "address"
      const addr = resolve(["insuredAddress", "riskAddress", "address", "addressLine1"])
      if (addr && !prev.propertyAddress1) {
        next.propertyAddress1 = addr.f.value!
        applied[addr.k] = { ...addr.f, source: "scanned" }
      }

      // City / province from address APIs
      const city = resolve(["city", "propertyCity"])
      if (city && !prev.propertyCity) {
        next.propertyCity = city.f.value!
        applied[city.k] = { ...city.f, source: "scanned" }
      }

      const state = resolve(["state", "province", "propertyState"])
      if (state && !prev.propertyState) {
        next.propertyState = state.f.value!
        applied[state.k] = { ...state.f, source: "scanned" }
      }

      const postcode = resolve(["postcode", "propertyPostcode"])
      if (postcode && !prev.propertyPostcode) {
        next.propertyPostcode = postcode.f.value!
        applied[postcode.k] = { ...postcode.f, source: "scanned" }
      }

      return next
    })

    setScanFields(applied)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const badge = (aiKey: string): ScanSessionField | undefined => scanFields[aiKey]

  // Wrap personal / property change handlers to mark fields manual on edit
  const clearFieldError = useCallback((key: string) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const n = { ...prev }; delete n[key]; return n
    })
  }, [])

  const handlePersonalChangeScan = useCallback((field: keyof PersonalData, value: string) => {
    getMappingsForStep(4, "personal").forEach(({ aiKey, formKey }) => {
      if (formKey === field) {
        markFieldManual(aiKey)
        setScanFields((prev) => prev[aiKey] ? { ...prev, [aiKey]: { ...prev[aiKey], source: "manual" } } : prev)
      }
    })
    setPersonalData((prev) => ({ ...prev, [field]: value }))
    clearFieldError(field as string)
  }, [clearFieldError])

  const handlePropertyChangeScan = useCallback((field: keyof PropertyData, value: string) => {
    getMappingsForStep(4, "property").forEach(({ aiKey, formKey }) => {
      if (formKey === field) {
        markFieldManual(aiKey)
        setScanFields((prev) => prev[aiKey] ? { ...prev, [aiKey]: { ...prev[aiKey], source: "manual" } } : prev)
      }
    })
    setPropertyData((prev) => ({ ...prev, [field]: value }))
    clearFieldError(field as string)
  }, [clearFieldError])

  // Ref keeps latest propertyData accessible inside mailing handler without
  // causing the handler to be recreated on every property field change.
  const propertyDataRef = useRef(propertyData)
  propertyDataRef.current = propertyData

  // ── Stable section change handlers ───────────────────────────────────────────

  const handlePersonalChange = useCallback((field: keyof PersonalData, value: string) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handlePropertyChange = useCallback((field: keyof PropertyData, value: string) => {
    setPropertyData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleMailingChange = useCallback((field: keyof MailingData, value: string | boolean) => {
    setMailingData((prev) => {
      const updated = { ...prev, [field]: value }
      // Auto-fill mailing from property when checkbox is ticked
      if (field === "sameAsPropertyAddress" && value === true) {
        const prop = propertyDataRef.current
        updated.mailingAddress1  = prop.propertyAddress1
        updated.mailingAddress2  = prop.propertyAddress2
        updated.mailingCity      = prop.propertyCity
        updated.mailingPostcode  = prop.propertyPostcode
        updated.mailingState     = prop.propertyState
        updated.mailingCountry   = prop.propertyCountry
        updated.mailingDistrict  = prop.propertyDistrict
        updated.mailingVillage   = prop.propertyVillage
      }
      return updated
    })
    clearFieldError(field as string)
  }, [clearFieldError])

  const handleBankChange = useCallback((field: keyof BankData, value: string) => {
    setBankData((prev) => ({ ...prev, [field]: value }))
    clearFieldError(field as string)
  }, [clearFieldError])

  // ── Toggle handlers (stable) ──────────────────────────────────────────────────

  const togglePersonal = useCallback(() => setExpandedSections((p) => ({ ...p, personal: !p.personal })), [])
  const toggleProperty = useCallback(() => setExpandedSections((p) => ({ ...p, property: !p.property })), [])
  const toggleMailing  = useCallback(() => setExpandedSections((p) => ({ ...p, mailing:  !p.mailing  })), [])
  const toggleBank     = useCallback(() => setExpandedSections((p) => ({ ...p, bank:     !p.bank     })), [])

  // ── Submit ────────────────────────────────────────────────────────────────────

  // ── Validation — required fields across all sections ───────────────────────
  // Note: race is intentionally OPTIONAL. Ethnicity/"suku" is not a standard
  // field on Indonesian insurance forms (unlike Malaysia), so we never block on it.
  const validateDetails = (): Record<string, string> => {
    const e: Record<string, string> = {}
    const req = t("validation.required")
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Personal
    if (!personalData.name.trim())         e.name        = req
    if (!personalData.gender)              e.gender      = req
    if (!personalData.dateOfBirth)         e.dateOfBirth = req
    if (!personalData.mobileNumber.trim()) e.mobileNumber = req
    if (!personalData.email.trim())        e.email       = req
    else if (!emailRe.test(personalData.email.trim())) e.email = t("validation.emailFormat")
    if (personalData.idType === "PASSPORT" && !personalData.nationality) e.nationality = req

    // Property address
    if (!propertyData.propertyAddress1.trim()) e.propertyAddress1 = req
    if (!propertyData.propertyState.trim())    e.propertyState    = req
    if (!propertyData.propertyCity.trim())     e.propertyCity     = req
    if (!propertyData.propertyPostcode.trim()) e.propertyPostcode = req

    // Mailing — only when not same as property
    if (!mailingData.sameAsPropertyAddress) {
      if (!mailingData.mailingAddress1.trim()) e.mailingAddress1 = req
      if (!mailingData.mailingPostcode.trim()) e.mailingPostcode = req
    }

    // Bank
    if (!bankData.bankName)              e.bankName      = req
    if (!bankData.accountNumber.trim()) e.accountNumber = req

    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate before anything else
    const errs = validateDetails()
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) {
      // Expand every section so the highlighted fields are visible
      setExpandedSections({ personal: true, property: true, mailing: true, bank: true })
      setError(t("validation.fixHighlighted"))
      return
    }

    setIsLoading(true)

    const session = getSession()
    const quotationId = getQuotationId()

    if (!session) {
      setError(t("common.sessionExpired"))
      setIsLoading(false)
      return
    }

    if (!quotationId) {
      setError(t("common.quotationNotFound"))
      setIsLoading(false)
      return
    }

    try {
      const mailingAddress = mailingData.sameAsPropertyAddress
        ? { sameAsPropertyAddress: true }
        : {
            sameAsPropertyAddress: false,
            addressLine1: mailingData.mailingAddress1,
            addressLine2: mailingData.mailingAddress2,
            city:         mailingData.mailingCity,
            postcode:     mailingData.mailingPostcode,
            state:        mailingData.mailingState,
            country:      mailingData.mailingCountry,
            ...(mailingData.mailingDistrict && { district: mailingData.mailingDistrict }),
            ...(mailingData.mailingVillage  && { village:  mailingData.mailingVillage  }),
          }

      const response = await createProposal(
        {
          quotationId,
          personalDetails: {
            name: personalData.name,
            idType: personalData.idType,
            idNumber: personalData.nricNumber,
            nationality: personalData.nationality,
            race: personalData.race || null,
            gender: personalData.gender,
            dateOfBirth: personalData.dateOfBirth,
            mobileNumber: personalData.mobileNumber,
            email: personalData.email,
          },
          propertyAddress: {
            addressLine1: propertyData.propertyAddress1,
            addressLine2: propertyData.propertyAddress2,
            city:         propertyData.propertyCity,
            postcode:     propertyData.propertyPostcode,
            state:        propertyData.propertyState,
            country:      propertyData.propertyCountry,
            ...(propertyData.propertyDistrict && { district: propertyData.propertyDistrict }),
            ...(propertyData.propertyVillage  && { village:  propertyData.propertyVillage  }),
          },
          mailingAddress,
          bankDetails: {
            bankName: bankData.bankName,
            accountNumber: bankData.accountNumber,
          },
        },
        session.countryCode
      )

      console.log("[CreateProposal Response]", response)

      if (!response.succeeded) {
        setError(response.message ?? t("fillDetails.failedToCreate"))
        return
      }

      saveProposalId(response.data.proposalId)
      router.push("/dashboard/quotation/summary")
    } catch (err) {
      console.error("[CreateProposal Error]", err)
      setError(t("common.somethingWentWrong"))
    } finally {
      setIsLoading(false)
    }
  }

  // Stable references for CalculationSummary — never changes so sidebar never re-renders
  const planData = useMemo(() => ({
    selectedPlan: "building-contents",
    buildingAmount: 500000,
    contentAmount: 60000,
    addOns: { riotStrike: false, extendedTheft: false },
  }), [])

  const valuablesData = useMemo(() => ({
    totalDeclaredAmount: 5000,
    maxDeclarableAmount: 20000,
    undeclaredAmount: 55000,
  }), [])

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto pr-0 lg:pr-8">
      <QuotationStepper currentStep={3} />

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">{t("fillDetails.title")}</h2>

        {/* Scan banner */}
        {scanSession && <ScanBanner session={scanSession} step={4} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <PersonalDetailsSection
            data={personalData}
            isExpanded={expandedSections.personal}
            onToggle={togglePersonal}
            onChange={handlePersonalChangeScan}
            countryCode={countryCode}
            scanFields={scanFields}
            errors={fieldErrors}
          />

          <PropertyDetailsSection
            data={propertyData}
            isExpanded={expandedSections.property}
            onToggle={toggleProperty}
            onChange={handlePropertyChangeScan}
            countryCode={countryCode}
            scanFields={scanFields}
            errors={fieldErrors}
          />

          <MailingAddressSection
            data={mailingData}
            isExpanded={expandedSections.mailing}
            onToggle={toggleMailing}
            onChange={handleMailingChange}
            countryCode={countryCode}
            errors={fieldErrors}
          />

          <BankDetailsSection
            data={bankData}
            isExpanded={expandedSections.bank}
            onToggle={toggleBank}
            onChange={handleBankChange}
            errors={fieldErrors}
          />

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="bg-[#0056b3] hover:bg-[#004494] text-white font-semibold px-12 py-3"
              disabled={isLoading}
            >
              {isLoading ? t("fillDetails.processing") : t("fillDetails.continueToSummary")}
            </Button>
          </div>
        </form>
      </div>

      <CalculationSummary step="details" planData={planData} valuablesData={valuablesData} />
    </div>
  )
}
