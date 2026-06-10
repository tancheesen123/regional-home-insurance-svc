"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, CheckCircle, Mail, Loader2, ArrowRight, AlertCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { register } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface FormData {
  firstName: string
  lastName: string
  email: string
  contact: string
  dateOfBirth: string
  gender: string
  idType: string
  idNumber: string
  region: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
  agreeToMarketing: boolean
}

interface FormErrors {
  [key: string]: string
}

const inputClass =
  "h-10 rounded-lg border-[1.5px] border-[#E0E0E0] text-sm text-[#1A1A1A] placeholder:text-[#9E9E9E] focus-visible:border-[#F5A623] focus-visible:ring-[3px] focus-visible:ring-[#F5A62333]"

const inputErrorClass =
  "border-[#D32F2F] focus-visible:border-[#D32F2F] focus-visible:ring-[#D32F2F26]"

const selectTriggerClass =
  "h-10 rounded-lg border-[1.5px] border-[#E0E0E0] text-sm text-[#1A1A1A] focus:border-[#F5A623] focus:ring-[3px] focus:ring-[#F5A62333]"

const labelClass = "text-sm font-medium text-[#1A1A1A]"

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-[#D32F2F]">{message}</p>
}

export default function RegisterForm() {
  const router = useRouter()
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    dateOfBirth: "",
    gender: "",
    idType: "",
    idNumber: "",
    region: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToMarketing: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const regions = [
    { value: "KH", label: t("countries.cambodia") },
    { value: "PH", label: t("countries.philippines") },
    { value: "ID", label: t("countries.indonesia") },
  ]

  const genderOptions = [
    { value: "Male", label: t("register.genderMale") },
    { value: "Female", label: t("register.genderFemale") },
  ]

  const getIdTypeOptions = () => {
    switch (formData.region) {
      case "KH":
        return [
          { value: "NationalID", label: t("register.idTypeNationalID") },
          { value: "Passport", label: t("register.idTypePassport") },
        ]
      case "PH":
        return [
          { value: "PhilSys", label: t("register.idTypePhilSys") },
          { value: "Passport", label: t("register.idTypePassport") },
          { value: "DriversLicense", label: t("register.idTypeDriversLicense") },
          { value: "SSS", label: t("register.idTypeSSS") },
        ]
      case "ID":
        return [
          { value: "KTP", label: t("register.idTypeKTP") },
          { value: "Passport", label: t("register.idTypePassport") },
          { value: "SIM", label: t("register.idTypeSIM") },
        ]
      default:
        return [
          { value: "NationalID", label: t("register.idTypeNationalID") },
          { value: "Passport", label: t("register.idTypePassport") },
        ]
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      // Reset idType when region changes
      if (field === "region") {
        updated.idType = ""
      }
      return updated
    })
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("register.errors.firstNameRequired")
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("register.errors.lastNameRequired")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = t("register.errors.emailRequired")
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("register.errors.emailInvalid")
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t("register.errors.dateOfBirthRequired")
    } else {
      const dob = new Date(formData.dateOfBirth)
      const today = new Date()
      if (dob > today) {
        newErrors.dateOfBirth = t("register.errors.dateOfBirthFuture")
      } else {
        let age = today.getFullYear() - dob.getFullYear()
        const monthDiff = today.getMonth() - dob.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--
        }
        if (age < 18) {
          newErrors.dateOfBirth = t("register.errors.dateOfBirthMinAge")
        }
      }
    }

    if (!formData.gender) {
      newErrors.gender = t("register.errors.genderRequired")
    }

    if (!formData.idType) {
      newErrors.idType = t("register.errors.idTypeRequired")
    }

    if (!formData.idNumber) {
      newErrors.idNumber = t("register.errors.idRequired")
    } else if (formData.idNumber.length < 6) {
      newErrors.idNumber = t("register.errors.idTooShort")
    }

    if (!formData.contact) {
      newErrors.contact = t("register.errors.contactRequired")
    } else if (formData.contact.length < 8) {
      newErrors.contact = t("register.errors.contactTooShort")
    }

    if (!formData.region) {
      newErrors.region = t("register.errors.regionRequired")
    }

    if (!formData.password) {
      newErrors.password = t("register.errors.passwordRequired")
    } else if (formData.password.length < 8) {
      newErrors.password = t("register.errors.passwordTooShort")
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t("register.errors.passwordWeak")
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("register.errors.confirmPasswordRequired")
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("register.errors.passwordMismatch")
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t("register.errors.termsRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await register(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          idType: formData.idType,
          idNumber: formData.idNumber,
          contact: `${getContactPrefix()}${formData.contact}`,
          region: formData.region,
        },
        formData.region
      )

      console.log("[Register Response]", response)

      if (!response.succeeded) {
        setErrors({ general: response.message ?? t("register.errors.registrationFailed") })
        return
      }

      setShowVerificationMessage(true)
    } catch (error) {
      console.error("[Register Error]", error)
      setErrors({ general: t("register.errors.registrationFailed") })
    } finally {
      setIsLoading(false)
    }
  }

  const getContactPrefix = () => {
    switch (formData.region) {
      case "KH": return "+855"
      case "PH": return "+63"
      case "ID": return "+62"
      default: return "+60"
    }
  }

  const getIdLabel = () => {
    switch (formData.region) {
      case "KH": return t("register.idLabelKH")
      case "PH": return t("register.idLabelPH")
      case "ID": return t("register.idLabelID")
      default: return t("register.idLabelDefault")
    }
  }

  if (showVerificationMessage) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E6F7EE] rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-[#00A651]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">{t("register.verification.checkEmail")}</h2>
        <p className="text-sm text-[#555555] mb-4">
          {t("register.verification.sentTo")} <strong className="text-[#1A1A1A]">{formData.email}</strong>
        </p>
        <div className="bg-[#E1F5FE] border border-[#0288D1]/30 rounded-lg p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-[#0288D1] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-[#1A1A1A] font-medium mb-1">{t("register.verification.nextSteps")}</p>
              <ul className="text-sm text-[#555555] space-y-1">
                <li>• {t("register.verification.step1")}</li>
                <li>• {t("register.verification.step2")}</li>
                <li>• {t("register.verification.step3")}</li>
                <li>• {t("register.verification.step4")}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowVerificationMessage(false)}
            className="w-full h-11 rounded-lg border-[1.5px] border-[#E0E0E0] text-sm font-medium text-[#1A1A1A] hover:border-[#F5A623] hover:text-[#F5A623] hover:bg-[#FEF3DC] transition-colors duration-150"
          >
            {t("register.verification.registerAnother")}
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full h-11 rounded-lg bg-[#F5A623] hover:bg-[#D4891A] text-white text-sm font-semibold transition-colors duration-150"
          >
            {t("register.verification.returnToLogin")}
          </button>
        </div>
        <p className="text-xs text-[#9E9E9E] mt-4">{t("register.verification.didntReceive")}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1.5">{t("auth.createAccountTitle")}</h2>
        <p className="text-sm text-[#555555]">{t("auth.createAccountDesc")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <div className="flex items-start gap-2.5 rounded-lg bg-[#FFEBEE] border border-[#FECACA] px-4 py-3">
            <AlertCircle className="h-4 w-4 text-[#D32F2F] shrink-0 mt-0.5" />
            <p className="text-sm text-[#D32F2F] leading-snug">{errors.general}</p>
          </div>
        )}

        {/* First Name / Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className={labelClass}>{t("register.firstName")} *</Label>
            <Input
              id="firstName"
              type="text"
              placeholder={t("register.firstNamePlaceholder")}
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={cn(inputClass, errors.firstName && inputErrorClass)}
            />
            <FieldError message={errors.firstName} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className={labelClass}>{t("register.lastName")} *</Label>
            <Input
              id="lastName"
              type="text"
              placeholder={t("register.lastNamePlaceholder")}
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={cn(inputClass, errors.lastName && inputErrorClass)}
            />
            <FieldError message={errors.lastName} />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className={labelClass}>{t("register.emailAddress")} *</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("register.emailPlaceholder")}
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={cn(inputClass, errors.email && inputErrorClass)}
          />
          <FieldError message={errors.email} />
        </div>

        {/* Date of Birth / Gender */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="dateOfBirth" className={labelClass}>{t("register.dateOfBirth")} *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              className={cn(inputClass, errors.dateOfBirth && inputErrorClass)}
            />
            <FieldError message={errors.dateOfBirth} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gender" className={labelClass}>{t("register.gender")} *</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
              <SelectTrigger className={cn(selectTriggerClass, errors.gender && inputErrorClass)}>
                <SelectValue placeholder={t("register.selectGender")} />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((g) => (
                  <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.gender} />
          </div>
        </div>

        {/* Region Selection */}
        <div className="space-y-1.5">
          <Label htmlFor="region" className={labelClass}>{t("register.region")} *</Label>
          <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
            <SelectTrigger className={cn(selectTriggerClass, errors.region && inputErrorClass)}>
              <SelectValue placeholder={t("register.selectRegion")} />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.region} />
        </div>

        {/* ID Type / ID Number */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="idType" className={labelClass}>{t("register.idType")} *</Label>
            <Select value={formData.idType} onValueChange={(value) => handleInputChange("idType", value)}>
              <SelectTrigger className={cn(selectTriggerClass, errors.idType && inputErrorClass)}>
                <SelectValue placeholder={t("register.selectIdType")} />
              </SelectTrigger>
              <SelectContent>
                {getIdTypeOptions().map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.idType} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="idNumber" className={labelClass}>{getIdLabel()} *</Label>
            <Input
              id="idNumber"
              type="text"
              placeholder={t("register.idLabelDefault")}
              value={formData.idNumber}
              onChange={(e) => handleInputChange("idNumber", e.target.value)}
              className={cn(inputClass, errors.idNumber && inputErrorClass)}
            />
            <FieldError message={errors.idNumber} />
          </div>
        </div>

        {/* Contact Number */}
        <div className="space-y-1.5">
          <Label htmlFor="contact" className={labelClass}>{t("register.contactNumber")} *</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-[#555555] bg-[#F5F5F5] border border-r-0 border-[#E0E0E0] rounded-l-lg">
              {getContactPrefix()}
            </span>
            <Input
              id="contact"
              type="tel"
              placeholder={t("register.contactPlaceholder")}
              value={formData.contact}
              onChange={(e) => handleInputChange("contact", e.target.value.replace(/\D/g, ""))}
              className={cn(inputClass, "rounded-l-none", errors.contact && inputErrorClass)}
            />
          </div>
          <FieldError message={errors.contact} />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className={labelClass}>{t("register.password")} *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("register.passwordPlaceholder")}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={cn(inputClass, "pr-10", errors.password && inputErrorClass)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#555555] transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FieldError message={errors.password} />
          <p className="text-xs text-[#9E9E9E]">{t("register.passwordHint")}</p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className={labelClass}>{t("register.confirmPassword")} *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("register.confirmPasswordPlaceholder")}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className={cn(inputClass, "pr-10", errors.confirmPassword && inputErrorClass)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#555555] transition-colors"
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FieldError message={errors.confirmPassword} />
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
              className="mt-0.5 data-[state=checked]:bg-[#F5A623] data-[state=checked]:border-[#F5A623]"
            />
            <Label htmlFor="terms" className="text-sm text-[#555555] cursor-pointer font-normal leading-snug">
              {t("register.agreeToTerms")}{" "}
              <a href="#" className="text-[#0066CC] hover:text-[#004EA8] hover:underline">
                {t("register.termsAndConditions")}
              </a>{" "}
              {t("register.and")}{" "}
              <a href="#" className="text-[#0066CC] hover:text-[#004EA8] hover:underline">
                {t("register.privacyPolicy")}
              </a>{" "}
              *
            </Label>
          </div>
          <FieldError message={errors.agreeToTerms} />

          <div className="flex items-start gap-2.5">
            <Checkbox
              id="marketing"
              checked={formData.agreeToMarketing}
              onCheckedChange={(checked) => handleInputChange("agreeToMarketing", checked as boolean)}
              className="mt-0.5 data-[state=checked]:bg-[#F5A623] data-[state=checked]:border-[#F5A623]"
            />
            <Label htmlFor="marketing" className="text-sm text-[#555555] cursor-pointer font-normal leading-snug">
              {t("register.marketingConsent")}
            </Label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full h-11 rounded-lg font-semibold text-sm text-white",
            "flex items-center justify-center gap-2",
            "transition-colors duration-150",
            isLoading
              ? "bg-[#F5A623]/60 cursor-not-allowed"
              : "bg-[#F5A623] hover:bg-[#D4891A] active:bg-[#B8751A]",
          )}
        >
          {isLoading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("auth.creatingAccount")}</>
            : <>{t("auth.createAccountTitle")} <ArrowRight className="h-4 w-4" /></>
          }
        </button>
      </form>
    </div>
  )
}
