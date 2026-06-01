"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, CheckCircle, Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FormData {
  name: string
  email: string
  contact: string
  address: string
  ic_number: string
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
    name: "",
    email: "",
    contact: "",
    address: "",
    ic_number: "",
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

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = t("register.errors.nameRequired")
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("register.errors.nameTooShort")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = t("register.errors.emailRequired")
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("register.errors.emailInvalid")
    }

    if (!formData.contact) {
      newErrors.contact = t("register.errors.contactRequired")
    } else if (formData.contact.length < 8) {
      newErrors.contact = t("register.errors.contactTooShort")
    }

    if (!formData.address.trim()) {
      newErrors.address = t("register.errors.addressRequired")
    } else if (formData.address.trim().length < 10) {
      newErrors.address = t("register.errors.addressTooShort")
    }

    if (!formData.ic_number) {
      newErrors.ic_number = t("register.errors.idRequired")
    } else if (formData.ic_number.length < 6) {
      newErrors.ic_number = t("register.errors.idTooShort")
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
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const customerId = `CUST_${formData.region}_${Date.now()}`

      console.log("Registration data:", {
        customer_id: customerId,
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        address: formData.address,
        ic_number: formData.ic_number,
        region: formData.region,
        user_id: `USER_${Date.now()}`,
      })

      setShowVerificationMessage(true)
    } catch (error) {
      console.error("Registration failed:", error)
      setErrors({ general: t("register.errors.registrationFailed") })
    } finally {
      setIsLoading(false)
    }
  }

  const getContactPrefix = () => {
    switch (formData.region) {
      case "KH":
        return "+855"
      case "PH":
        return "+63"
      case "ID":
        return "+62"
      default:
        return "+60"
    }
  }

  const getIdLabel = () => {
    switch (formData.region) {
      case "KH":
        return t("register.idLabelKH")
      case "PH":
        return t("register.idLabelPH")
      case "ID":
        return t("register.idLabelID")
      default:
        return t("register.idLabelDefault")
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

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t("register.fullName")} *</Label>
            <Input
              id="name"
              type="text"
              placeholder={t("register.fullNamePlaceholder")}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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

          {/* ID/Passport Number */}
          <div className="space-y-2">
            <Label htmlFor="ic_number">{getIdLabel()} *</Label>
            <Input
              id="ic_number"
              type="text"
              placeholder={t("register.idLabelDefault")}
              value={formData.ic_number}
              onChange={(e) => handleInputChange("ic_number", e.target.value)}
              className={errors.ic_number ? "border-red-500" : ""}
            />
            {errors.ic_number && <p className="text-sm text-red-500">{errors.ic_number}</p>}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">{t("register.address")} *</Label>
            <Textarea
              id="address"
              placeholder={t("register.addressPlaceholder")}
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={`min-h-[80px] ${errors.address ? "border-red-500" : ""}`}
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
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
