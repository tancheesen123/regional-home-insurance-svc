"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { setSession, isSessionValid } from "@/lib/session"
import { login, getCustomerByUserId } from "@/lib/api"
import { cn } from "@/lib/utils"

// ── Country config ─────────────────────────────────────────────────────────────

const COUNTRIES = [
  { value: "cambodia",    code: "KH", flag: "🇰🇭", label: "Cambodia"    },
  { value: "philippines", code: "PH", flag: "🇵🇭", label: "Philippines" },
  { value: "indonesia",   code: "ID", flag: "🇮🇩", label: "Indonesia"   },
] as const

const COUNTRY_CODE_MAP: Record<string, string> = {
  cambodia:    "KH",
  philippines: "PH",
  indonesia:   "ID",
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function LoginForm() {
  const router = useRouter()
  const t = useTranslations()

  const [isLoading,    setIsLoading]    = useState(false)
  const [country,      setCountry]      = useState("philippines")
  const [rememberMe,   setRememberMe]   = useState(false)
  const [error,        setError]        = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const emailRef    = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // Redirect to dashboard if session already exists
  useEffect(() => {
    if (isSessionValid()) router.replace("/dashboard")
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const email       = emailRef.current?.value    ?? ""
    const password    = passwordRef.current?.value ?? ""
    const countryCode = COUNTRY_CODE_MAP[country]

    try {
      const response = await login({ email, password }, countryCode)

      if (!response.succeeded) {
        setError(response.message ?? "Invalid email or password.")
        return
      }

      // Temporarily persist token so getCustomerByUserId can authenticate
      localStorage.setItem("etiqa_session", JSON.stringify({
        token:      response.data.token,
        countryCode,
        userId:     response.data.userId,
        email:      response.data.email,
        customerId: "",
        country,
        role:       response.data.role ?? "User",
        loginAt:    Date.now(),
        expiresAt:  new Date(response.data.expiresAt).getTime(),
        rememberMe,
      }))

      let customerId = ""
      try {
        const customerRes = await getCustomerByUserId(response.data.userId)
        if (customerRes.succeeded) customerId = customerRes.data.customerId
      } catch {
        console.warn("[Login] Failed to fetch customerId")
      }

      setSession(
        {
          email:       response.data.email,
          userId:      response.data.userId,
          customerId,
          country,
          countryCode,
          role:        (response.data.role ?? "User") as "User" | "Admin",
          token:       response.data.token,
          expiresAt:   response.data.expiresAt,
        },
        rememberMe,
      )

      router.push("/dashboard")
    } catch (err) {
      console.error("[Login Error]", err)
      setError("Unable to connect to the server. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1.5">
          {t("auth.signIn")}
        </h2>
        <p className="text-sm text-[#555555]">
          {t("auth.signInDesc")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-lg bg-[#FFEBEE] border border-[#FECACA] px-4 py-3">
            <AlertCircle className="h-4 w-4 text-[#D32F2F] shrink-0 mt-0.5" />
            <p className="text-sm text-[#D32F2F] leading-snug">{error}</p>
          </div>
        )}

        {/* Country */}
        <div className="space-y-1.5">
          <Label htmlFor="country" className="text-sm font-medium text-[#1A1A1A]">
            {t("countries.selectCountry")}
          </Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger
              id="country"
              className="h-10 rounded-lg border-[#E0E0E0] text-[#1A1A1A] focus:border-[#F5A623] focus:ring-[#F5A623]/20"
            >
              <SelectValue placeholder={t("countries.selectCountry")} />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <span className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-[#1A1A1A]">
            {t("auth.email")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            ref={emailRef}
            required
            className="h-10 rounded-lg border-[#E0E0E0] text-[#1A1A1A] placeholder:text-[#9E9E9E] focus-visible:border-[#F5A623] focus-visible:ring-[#F5A623]/20"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-[#1A1A1A]">
              {t("auth.password")}
            </Label>
            <a
              href="#"
              className="text-xs text-[#0066CC] hover:text-[#004EA8] hover:underline transition-colors"
            >
              {t("auth.forgotPassword")}
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              ref={passwordRef}
              required
              className="h-10 rounded-lg border-[#E0E0E0] text-[#1A1A1A] pr-10 focus-visible:border-[#F5A623] focus-visible:ring-[#F5A623]/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#555555] transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword
                ? <EyeOff className="h-4 w-4" />
                : <Eye    className="h-4 w-4" />
              }
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="data-[state=checked]:bg-[#F5A623] data-[state=checked]:border-[#F5A623]"
          />
          <label
            htmlFor="remember"
            className="text-sm text-[#555555] cursor-pointer select-none"
          >
            {t("auth.rememberMe")}
          </label>
        </div>

        {/* Submit */}
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
            ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("auth.signingIn")}</>
            : <>{t("auth.signIn")} <ArrowRight className="h-4 w-4" /></>
          }
        </button>

      </form>

      {/* Create account */}
      <div className="mt-6 pt-6 border-t border-[#E0E0E0] text-center">
        <p className="text-sm text-[#555555]">
          {t("auth.noAccount")}{" "}
          <Link
            href="/register"
            className="text-[#0066CC] hover:text-[#004EA8] font-medium hover:underline transition-colors"
          >
            {t("auth.createAccount")}
          </Link>
        </p>
      </div>
    </div>
  )
}
