"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, HelpCircle, Menu, Shield, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import LanguageSwitcher from "@/components/language-switcher"
import { clearSession, getSession } from "@/lib/session"

export default function DashboardHeader() {
  const router = useRouter()
  const t = useTranslations("dashboard.header")
  const tCommon = useTranslations("common")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [countryCode, setCountryCode] = useState("")

  useEffect(() => {
    const session = getSession()
    if (session?.countryCode) setCountryCode(session.countryCode)
  }, [])

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t("toggleMenu")}</span>
          </Button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#0056b3]" />
            <span className="font-bold text-xl hidden sm:inline">{tCommon("appName")}</span>
            <span className="font-bold text-xl sm:hidden">Etiqa</span>
            {countryCode && (
              <span className="text-xs font-semibold text-white bg-[#0056b3] px-1.5 py-0.5 rounded">
                {countryCode}
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <Button variant="ghost" size="icon" className="text-gray-500">
            <Bell className="h-5 w-5" />
            <span className="sr-only">{t("notifications")}</span>
          </Button>

          <Button variant="ghost" size="icon" className="text-gray-500">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">{t("help")}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">{t("userMenu")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t("profileItem")}</DropdownMenuItem>
              <DropdownMenuItem>{t("settingsItem")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>{t("logOut")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
