"use client"

import { useState } from "react"
import { Shield, Home, CheckCircle2, ArrowRight, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function DashboardOverview() {
  const [selectedCategory, setSelectedCategory] = useState("home")
  const router = useRouter()
  const t      = useTranslations("dashboard.overview")
  const tCommon = useTranslations("common")


  const categories = [
    { id: "home",       name: t("categories.home"),       icon: Home,   discount: "15%", comingSoon: false },
  ]

  const products = [
    {
      id: 1,
      title:       t("products.houseowner.title"),
      subtitle:    t("products.houseowner.subtitle"),
      description: t("products.houseowner.description"),
      features: [
        t("products.houseowner.feature1"),
        t("products.houseowner.feature2"),
        t("products.houseowner.feature3"),
        t("products.houseowner.feature4"),
      ],
      type: "insurance", category: "home",
    },
  ]

  const filteredProducts = products.filter((p) => p.category === selectedCategory)


  const handleCategoryClick = (id: string) => {
    const cat = categories.find((c) => c.id === id)
    if (!cat?.comingSoon) setSelectedCategory(id)
  }

  const handleApplyOnline = () => router.push("/dashboard/quotation")


  return (
    <div className="space-y-8">

      {}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">{t("signUpOnline")}</h1>
        <p className="text-sm text-[#555555] mt-1">Select a category below to explore available plans.</p>
      </div>

      {}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id && !cat.comingSoon
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              disabled={cat.comingSoon}
              className={cn(
                "relative flex flex-col items-center gap-2 px-5 py-4 rounded-xl border-2 transition-colors duration-150 min-w-[84px]",
                isSelected
                  ? "bg-[#FEF3DC] border-[#F5A623] shadow-sm"
                  : "bg-white border-[#E0E0E0] hover:border-[#F5A623]",
                cat.comingSoon && "opacity-50 cursor-not-allowed hover:border-[#E0E0E0]",
              )}
            >
              {}
              {cat.discount && !cat.comingSoon && (
                <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-[#E87722] text-white px-1.5 py-0.5 rounded-full leading-none">
                  {cat.discount}
                </span>
              )}

              {}
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150",
                  isSelected ? "bg-[#F5A623]" : "bg-[#F5F5F5]",
                )}
              >
                <cat.icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-150",
                    isSelected ? "text-white" : "text-[#9E9E9E]",
                  )}
                />
              </div>

              <span
                className={cn(
                  "text-xs font-medium text-center leading-tight",
                  isSelected ? "text-[#1A1A1A]" : "text-[#555555]",
                )}
              >
                {cat.name}
              </span>

              {}
              {cat.comingSoon && (
                <span className="text-[10px] font-semibold bg-[#F5F5F5] text-[#9E9E9E] border border-[#E0E0E0] px-2 py-0.5 rounded-full leading-none">
                  {tCommon("comingSoon")}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {}
      {selectedCategory === "home" && (
        <>
          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-[#E0E0E0] rounded-xl p-5 shadow-sm hover:border-[#F5A623] hover:shadow-md transition-colors duration-150 flex flex-col"
              >
                {}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    {}
                    <span
                      className={cn(
                        "inline-block text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md mb-2",
                        product.type === "takaful"
                          ? "bg-[#E6F7EE] text-[#00A651]"
                          : "bg-[#FDF0E6] text-[#E87722]",
                      )}
                    >
                      {product.subtitle}
                    </span>
                    <h3 className="text-base font-semibold text-[#1A1A1A] leading-snug mb-1">
                      {product.title}
                    </h3>
                    <p className="text-sm text-[#555555] leading-relaxed">{product.description}</p>
                  </div>
                  {}
                  <div className="w-12 h-12 shrink-0 bg-[#FFFDE7] rounded-xl flex items-center justify-center">
                    <Home className="h-6 w-6 text-[#F5A623]" />
                  </div>
                </div>

                {}
                <ul className="space-y-2 mb-5 flex-1">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-[#00A651] shrink-0 mt-0.5" />
                      <span className="text-[#555555]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {}
                <div className="flex gap-2.5 pt-4 border-t border-[#E0E0E0]">
                  <button
                    type="button"
                    className="flex-1 h-9 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors duration-150"
                  >
                    {tCommon("viewProductInfo")}
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyOnline}
                    className="flex-1 h-9 rounded-lg bg-[#F5A623] hover:bg-[#D4891A] text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors duration-150"
                  >
                    {tCommon("applyOnline")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </>
      )}

      {}
      {selectedCategory !== "home" && (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-[#E0E0E0] bg-[#FAFAFA]">
          {(() => {
            const cat = categories.find((c) => c.id === selectedCategory)
            const Icon = cat?.icon ?? Shield
            return (
              <>
                <div className="w-16 h-16 rounded-2xl bg-[#F5F5F5] flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-[#BDBDBD]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">{tCommon("comingSoon")}</h3>
                <p className="text-sm text-[#9E9E9E] mb-6 text-center max-w-xs">
                  {cat?.name} {t("comingSoonMessage")}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("home")}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#0066CC] hover:text-[#004EA8] hover:underline transition-colors"
                >
                  {t("exploreHome")}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )
          })()}
        </div>
      )}

    </div>
  )
}
