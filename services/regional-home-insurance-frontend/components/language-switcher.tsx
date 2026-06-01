"use client"

import { useLocale, useTranslations } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { Globe } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const locales = [
  { value: "en", label: "English" },
  { value: "fil", label: "Filipino" },
  { value: "id", label: "Bahasa Indonesia" },
  { value: "km", label: "ភាសាខ្មែរ" },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("language")

  const handleChange = (newLocale: string) => {
    // Replace the locale segment at the start of the path
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/"))
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-500 shrink-0" />
      <Select value={locale} onValueChange={handleChange}>
        <SelectTrigger className="w-[160px] h-8 text-sm">
          <SelectValue placeholder={t("selectLanguage")} />
        </SelectTrigger>
        <SelectContent>
          {locales.map((l) => (
            <SelectItem key={l.value} value={l.value}>
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
