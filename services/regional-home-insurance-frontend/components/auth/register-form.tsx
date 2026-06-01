"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, CheckCircle, Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import { register } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormData {
  firstName: string
  lastName: string
  email: string
  contact: string
  dateOfBirth: string
  gender: string
  nationality: string
  idType: string
  idNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  postcode: string
  state: string
  region: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
  agreeToMarketing: boolean
}

interface FormErrors {
  [key: string]: string
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
    nationality: "",
    idType: "",
    idNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    state: "",
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
    }

    if (!formData.gender) {
      newErrors.gender = t("register.errors.genderRequired")
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = t("register.errors.nationalityRequired")
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

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = t("register.errors.addressRequired")
    }
    if (!formData.city.trim()) {
      newErrors.city = t("register.errors.cityRequired")
    }
    if (!formData.postcode.trim()) {
      newErrors.postcode = t("register.errors.postcodeRequired")
    }
    if (!formData.state.trim()) {
      newErrors.state = t("register.errors.stateRequired")
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
          nationality: formData.nationality,
          idType: formData.idType,
          idNumber: formData.idNumber,
          contact: `${getContactPrefix()}${formData.contact}`,
          region: formData.region,
          address: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            postcode: formData.postcode,
            state: formData.state,
            country: "",
          },
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
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("register.verification.checkEmail")}</h2>
            <p className="text-gray-600 mb-4">
              {t("register.verification.sentTo")} <strong>{formData.email}</strong>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-blue-800 font-medium mb-1">{t("register.verification.nextSteps")}</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• {t("register.verification.step1")}</li>
                    <li>• {t("register.verification.step2")}</li>
                    <li>• {t("register.verification.step3")}</li>
                    <li>• {t("register.verification.step4")}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Button onClick={() => setShowVerificationMessage(false)} variant="outline" className="w-full">
                {t("register.verification.registerAnother")}
              </Button>
              <Button onClick={() => router.push("/")} className="w-full bg-[#0056b3] hover:bg-[#004494]">
                {t("register.verification.returnToLogin")}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">{t("register.verification.didntReceive")}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{t("auth.createAccountTitle")}</CardTitle>
        <CardDescription>{t("auth.createAccountDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* First Name / Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("register.firstName")} *</Label>
              <Input
                id="firstName"
                type="text"
                placeholder={t("register.firstNamePlaceholder")}
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("register.lastName")} *</Label>
              <Input
                id="lastName"
                type="text"
                placeholder={t("register.lastNamePlaceholder")}
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t("register.emailAddress")} *</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("register.emailPlaceholder")}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Date of Birth / Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">{t("register.dateOfBirth")} *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className={errors.dateOfBirth ? "border-red-500" : ""}
              />
              {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">{t("register.gender")} *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("register.selectGender")} />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((g) => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
            </div>
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label htmlFor="nationality">{t("register.nationality")} *</Label>
            <Input
              id="nationality"
              type="text"
              placeholder={t("register.nationalityPlaceholder")}
              value={formData.nationality}
              onChange={(e) => handleInputChange("nationality", e.target.value)}
              className={errors.nationality ? "border-red-500" : ""}
            />
            {errors.nationality && <p className="text-sm text-red-500">{errors.nationality}</p>}
          </div>

          {/* Region Selection */}
          <div className="space-y-2">
            <Label htmlFor="region">{t("register.region")} *</Label>
            <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
              <SelectTrigger className={errors.region ? "border-red-500" : ""}>
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
            {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
          </div>

          {/* ID Type / ID Number */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="idType">{t("register.idType")} *</Label>
              <Select value={formData.idType} onValueChange={(value) => handleInputChange("idType", value)}>
                <SelectTrigger className={errors.idType ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("register.selectIdType")} />
                </SelectTrigger>
                <SelectContent>
                  {getIdTypeOptions().map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.idType && <p className="text-sm text-red-500">{errors.idType}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="idNumber">{getIdLabel()} *</Label>
              <Input
                id="idNumber"
                type="text"
                placeholder={t("register.idLabelDefault")}
                value={formData.idNumber}
                onChange={(e) => handleInputChange("idNumber", e.target.value)}
                className={errors.idNumber ? "border-red-500" : ""}
              />
              {errors.idNumber && <p className="text-sm text-red-500">{errors.idNumber}</p>}
            </div>
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <Label htmlFor="contact">{t("register.contactNumber")} *</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                {getContactPrefix()}
              </span>
              <Input
                id="contact"
                type="tel"
                placeholder={t("register.contactPlaceholder")}
                value={formData.contact}
                onChange={(e) => handleInputChange("contact", e.target.value.replace(/\D/g, ""))}
                className={`rounded-l-none ${errors.contact ? "border-red-500" : ""}`}
              />
            </div>
            {errors.contact && <p className="text-sm text-red-500">{errors.contact}</p>}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label>{t("register.address")} *</Label>
            <Input
              placeholder="Address Line 1 *"
              value={formData.addressLine1}
              onChange={(e) => handleInputChange("addressLine1", e.target.value)}
              className={errors.addressLine1 ? "border-red-500" : ""}
            />
            {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1}</p>}
            <Input
              placeholder="Address Line 2"
              value={formData.addressLine2}
              onChange={(e) => handleInputChange("addressLine2", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  placeholder="City *"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>
              <div>
                <Input
                  placeholder="Postcode *"
                  value={formData.postcode}
                  onChange={(e) => handleInputChange("postcode", e.target.value)}
                  className={errors.postcode ? "border-red-500" : ""}
                />
                {errors.postcode && <p className="text-sm text-red-500">{errors.postcode}</p>}
              </div>
            </div>
            <div>
              <Input
                placeholder="State *"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">{t("register.password")} *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("register.passwordPlaceholder")}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={errors.password ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            <p className="text-xs text-gray-500">{t("register.passwordHint")}</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("register.confirmPassword")} *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("register.confirmPasswordPlaceholder")}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                className="mt-1"
              />
              <div className="text-sm">
                <Label htmlFor="terms" className="cursor-pointer">
                  {t("register.agreeToTerms")}{" "}
                  <a href="#" className="text-[#0056b3] hover:underline">
                    {t("register.termsAndConditions")}
                  </a>{" "}
                  {t("register.and")}{" "}
                  <a href="#" className="text-[#0056b3] hover:underline">
                    {t("register.privacyPolicy")}
                  </a>{" "}
                  *
                </Label>
              </div>
            </div>
            {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}

            <div className="flex items-start space-x-3">
              <Checkbox
                id="marketing"
                checked={formData.agreeToMarketing}
                onCheckedChange={(checked) => handleInputChange("agreeToMarketing", checked as boolean)}
                className="mt-1"
              />
              <div className="text-sm">
                <Label htmlFor="marketing" className="cursor-pointer">
                  {t("register.marketingConsent")}
                </Label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-[#0056b3] hover:bg-[#004494]" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t("auth.creatingAccount")}</span>
              </div>
            ) : (
              t("auth.createAccountTitle")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
