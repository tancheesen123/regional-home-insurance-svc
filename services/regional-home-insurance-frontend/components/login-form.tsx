"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LanguageSwitcher from "@/components/language-switcher"
import { setSession, isSessionValid } from "@/lib/session"
import { login } from "@/lib/api"

const COUNTRY_CODE_MAP: Record<string, string> = {
  cambodia: "KH",
  philippines: "PH",
  indonesia: "ID",
}

export default function LoginForm() {
  const router = useRouter()
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [country, setCountry] = useState("philippines")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // Redirect to dashboard if session already exists
  useEffect(() => {
    if (isSessionValid()) {
      router.replace("/dashboard")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const email = emailRef.current?.value ?? ""
    const password = passwordRef.current?.value ?? ""
    const countryCode = COUNTRY_CODE_MAP[country]

    try {
      const response = await login({ email, password }, countryCode)
      console.log("[Login Response]", response)

      if (!response.succeeded) {
        setError(response.message ?? "Invalid email or password.")
        return
      }

      setSession(
        {
          email: response.data.email,
          userId: response.data.userId,
          country,
          countryCode,
          token: response.data.token,
          expiresAt: response.data.expiresAt,
        },
        rememberMe
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{t("auth.signIn")}</CardTitle>
            <CardDescription>{t("auth.signInDesc")}</CardDescription>
          </div>
          <LanguageSwitcher />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="country">{t("countries.selectCountry")}</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country" className="w-full">
                <SelectValue placeholder={t("countries.selectCountry")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cambodia">{t("countries.cambodia")}</SelectItem>
                <SelectItem value="philippines">{t("countries.philippines")}</SelectItem>
                <SelectItem value="indonesia">{t("countries.indonesia")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input id="email" type="email" placeholder={t("auth.emailPlaceholder")} ref={emailRef} required />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <a href="#" className="text-sm text-[#0056b3] hover:underline">
                {t("auth.forgotPassword")}
              </a>
            </div>
            <Input id="password" type="password" ref={passwordRef} required />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("auth.rememberMe")}
            </label>
          </div>

          <Button type="submit" className="w-full bg-[#0056b3] hover:bg-[#004494]" disabled={isLoading}>
            {isLoading ? t("auth.signingIn") : t("auth.signIn")}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t("auth.noAccount")}{" "}
            <Link href="/register" className="text-[#0056b3] hover:underline font-medium">
              {t("auth.createAccount")}
            </Link>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <div className="flex items-center text-sm text-gray-500">
          <span>{t("common.regionalPortal")}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
