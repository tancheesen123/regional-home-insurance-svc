"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  FileText, Home, User, BarChart3, SlidersHorizontal,
  LogOut, UserCircle, ChevronsUpDown, Bell, HelpCircle,
} from "lucide-react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { getSession, clearSession } from "@/lib/session"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
} from "@/components/ui/sidebar"

export default function DashboardSidebar() {
  const rawPathname = usePathname()
  const locale      = useLocale()
  const router      = useRouter()

  const pathname = rawPathname.startsWith(`/${locale}`)
    ? rawPathname.slice(`/${locale}`.length) || "/"
    : rawPathname

  const t       = useTranslations("dashboard")
  const tHeader = useTranslations("dashboard.header")

  const [role,        setRole]        = useState<string | null>(null)
  const [countryCode, setCountryCode] = useState("")
  const [userEmail,   setUserEmail]   = useState("")

  useEffect(() => {
    const session = getSession()
    setRole(session?.role ?? "User")
    if (session?.countryCode) setCountryCode(session.countryCode)
    if (session?.email)       setUserEmail(session.email)
  }, [])

  const isAdmin = role === "Admin"
  const isUser  = role === "User"

  const navigation = [
    { name: t("nav.dashboard"), href: "/dashboard",          icon: Home,              show: isUser  },
    { name: t("nav.policies"),  href: "/dashboard/policies", icon: FileText,          show: isUser  },
    { name: t("nav.sales"),     href: "/dashboard/sales",    icon: BarChart3,         show: isAdmin },
    { name: t("nav.config"),    href: "/dashboard/config",   icon: SlidersHorizontal, show: isAdmin },
    { name: t("nav.profile"),   href: "/dashboard/profile",  icon: User,              show: isUser  },
  ].filter((item) => item.show)

  const isActive = (href: string): boolean => {
    if (pathname === href) return true
    if (href !== "/dashboard" && pathname.startsWith(href + "/")) return true
    if (href === "/dashboard") {
      const claimedByOther = navigation
        .filter((n) => n.href !== "/dashboard")
        .some((n) => pathname === n.href || pathname.startsWith(n.href + "/"))
      return !claimedByOther && pathname.startsWith("/dashboard/")
    }
    return false
  }

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  return (
    <Sidebar collapsible="icon">

      {/* ── Header — logo ──────────────────────────────────────────────────── */}
      <SidebarHeader className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-[#FAFAFA] data-[state=open]:bg-[#FAFAFA] h-16"
            >
              <Link href="/dashboard" className="flex items-center gap-2.5">

                {/* Expanded: logo + text block + country badge */}
                <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:hidden min-w-0">
                  <Image
                    src="/images/Etiqa-logo-1.png"
                    alt="Etiqa"
                    width={52}
                    height={52}
                    className="h-[52px] w-auto object-contain shrink-0"
                    priority
                  />
                  <div className="flex flex-col min-w-0">
                    {/* <span className="text-sm font-bold text-[#1A1A1A] leading-tight truncate">
                      Etiqa General Insurance
                    </span> */}
                    {countryCode && (
                      <span className="mt-0.5 inline-flex w-fit text-[10px] font-semibold text-white bg-[#F5A623] px-1.5 py-0.5 rounded-md leading-none">
                        {countryCode}
                      </span>
                    )}
                  </div>
                </div>

                {/* Collapsed: favicon only */}
                <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-8 h-8">
                  <Image
                    src="/images/Etiqa_Favicon.png"
                    alt="Etiqa"
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                </div>

              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

              {/* Skeleton while role loads */}
              {role === null && (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuSkeleton showIcon className={`skeleton-item-${i}`} />
                    </SidebarMenuItem>
                  ))}
                </>
              )}

              {navigation.map((item) => {
                const active = isActive(item.href)
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.name}
                      className={
                        active
                          ? "relative overflow-hidden bg-[#FEF3DC] text-[#1A1A1A] hover:bg-[#FEF3DC] hover:text-[#1A1A1A] font-medium"
                          : "text-[#555555] hover:bg-[#FAFAFA] hover:text-[#1A1A1A]"
                      }
                    >
                      <Link href={item.href}>
                        {active && (
                          <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#F5A623]" />
                        )}
                        <item.icon className={active ? "text-[#F5A623]!" : "text-[#9E9E9E]"} />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer — user dropdown ─────────────────────────────────────────── */}
      <SidebarFooter className="border-t border-[#E0E0E0]">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={userEmail}
                  className="hover:bg-[#FAFAFA] data-[state=open]:bg-[#FEF3DC]"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#FEF3DC] border border-[#F5A623]/30 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-[#F5A623]" />
                  </div>
                  {/* Email + role */}
                  <div className="flex flex-col min-w-0 flex-1 text-left">
                    <span className="text-xs font-medium text-[#1A1A1A] truncate">
                      {userEmail || "—"}
                    </span>
                    <span className="text-[11px] text-[#9E9E9E] capitalize">
                      {role?.toLowerCase() ?? ""}
                    </span>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 text-[#9E9E9E] shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="end" className="w-52 mb-1">
                <DropdownMenuLabel className="text-xs text-[#9E9E9E] font-normal">
                  {tHeader("myAccount")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link href="/dashboard/profile">
                    <UserCircle className="h-4 w-4 text-[#9E9E9E]" />
                    {tHeader("profileItem")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="gap-2 cursor-pointer text-[#D32F2F] focus:text-[#D32F2F] focus:bg-[#FFEBEE]"
                >
                  <LogOut className="h-4 w-4" />
                  {tHeader("logOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Drag-to-resize rail */}
      <SidebarRail />
    </Sidebar>
  )
}
