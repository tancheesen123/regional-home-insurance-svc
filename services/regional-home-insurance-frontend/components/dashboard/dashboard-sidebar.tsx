"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Home, Settings, User, BarChart3 } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const t = useTranslations("dashboard")
  const tCommon = useTranslations("common")
  const tCountries = useTranslations("countries")
  const [country, setCountry] = useState("philippines")

  const navigation = [
    { name: t("nav.dashboard"), href: "/dashboard", icon: Home },
    { name: t("nav.policies"), href: "/dashboard/policies", icon: FileText },
    { name: t("nav.sales"), href: "/dashboard/sales", icon: BarChart3 },
    { name: t("nav.profile"), href: "/dashboard/profile", icon: User },
    { name: t("nav.settings"), href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={tCountries("selectCountry")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cambodia">{tCountries("cambodia")}</SelectItem>
              <SelectItem value="philippines">{tCountries("philippines")}</SelectItem>
              <SelectItem value="indonesia">{tCountries("indonesia")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href ? "bg-[#0056b3] text-white" : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="text-xs text-gray-500">
            <p>{tCommon("copyright")}</p>
            <p>{tCommon("regionalPortal")}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
