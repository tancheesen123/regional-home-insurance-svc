"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, HelpCircle, User, LogOut, Settings, UserCircle } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import LanguageSwitcher from "@/components/language-switcher"
import { clearSession, getSession } from "@/lib/session"

export default function DashboardHeader() {
  const router = useRouter()
  const t      = useTranslations("dashboard.header")
  const [countryCode, setCountryCode] = useState("")
  const [userEmail,        setUserEmail]        = useState("")

  useEffect(() => {
    const session = getSession()
    if (session?.countryCode) setCountryCode(session.countryCode)
    if (session?.email)       setUserEmail(session.email)
  }, [])

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  return (
    <header className="bg-white border-b border-[#E0E0E0] sticky top-0 z-30">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Left — sidebar trigger + logo */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-[#555555] hover:text-[#1A1A1A] hover:bg-[#FAFAFA]" />

          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src="/images/Etiqa-EGIB.png"
              alt="Etiqa"
              width={80}
              height={24}
              className="h-5 w-auto object-contain"
              priority
            />
            {countryCode && (
              <span className="text-[11px] font-semibold text-white bg-[#F5A623] px-1.5 py-0.5 rounded-md leading-none">
                {countryCode}
              </span>
            )}
          </Link>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-1">
          <LanguageSwitcher />

          {/* Bell */}
          <button
            className="p-2 rounded-lg text-[#9E9E9E] hover:text-[#555555] hover:bg-[#FAFAFA] transition-colors"
            aria-label={t("notifications")}
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* Help */}
          <button
            className="p-2 rounded-lg text-[#9E9E9E] hover:text-[#555555] hover:bg-[#FAFAFA] transition-colors"
            aria-label={t("help")}
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 ml-1 pl-3 border-l border-[#E0E0E0] text-[#555555] hover:text-[#1A1A1A] transition-colors"
                aria-label={t("userMenu")}
              >
                <div className="w-8 h-8 rounded-full bg-[#FEF3DC] border border-[#F5A623]/30 flex items-center justify-center">
                  <User className="h-4 w-4 text-[#F5A623]" />
                </div>
                {userEmail && (
                  <span className="hidden md:block text-xs text-[#555555] max-w-[140px] truncate">
                    {userEmail}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-[#9E9E9E] font-normal">
                {t("myAccount")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <UserCircle className="h-4 w-4 text-[#9E9E9E]" />
                {t("profileItem")}
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings className="h-4 w-4 text-[#9E9E9E]" />
                {t("settingsItem")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-2 cursor-pointer text-[#D32F2F] focus:text-[#D32F2F] focus:bg-[#FFEBEE]"
              >
                <LogOut className="h-4 w-4" />
                {t("logOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  )
}
