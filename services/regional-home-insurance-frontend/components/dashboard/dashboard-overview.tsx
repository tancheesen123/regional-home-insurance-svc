"use client"

import { useState, useEffect } from "react"
import { Car, Bike, Plane, Shield, Home, Heart, Users, CheckCircle2, ArrowRight, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/session"

export default function DashboardOverview() {
  const [selectedCategory, setSelectedCategory] = useState("home")
  const [activeFilter,     setActiveFilter]     = useState("all")
  const router = useRouter()
  const t      = useTranslations("dashboard.overview")
  const tCommon = useTranslations("common")

  useEffect(() => {
    const session = getSession()
    console.log("[Session]", session)
  }, [])

  // ── Data ──────────────────────────────────────────────────────────────────────

  const categories = [
    { id: "car",        name: t("categories.car"),        icon: Car,    discount: "15%", comingSoon: true  },
    { id: "motorcycle", name: t("categories.motorcycle"), icon: Bike,   discount: "15%", comingSoon: true  },
    { id: "travel",     name: t("categories.travel"),     icon: Plane,  discount: "20%", comingSoon: true  },
    { id: "personal",   name: t("categories.personal"),   icon: Shield, discount: "25%", comingSoon: true  },
    { id: "home",       name: t("categories.home"),       icon: Home,   discount: "15%", comingSoon: false },
    { id: "medical",    name: t("categories.medical"),    icon: Heart,                   comingSoon: true  },
    { id: "life",       name: t("categories.life"),       icon: Users,                   comingSoon: true  },
  ]

  const filters = [
    { id: "all",       name: "Show All"    },
    { id: "insurance", name: "Insurance"   },
    { id: "takaful",   name: "Takaful"     },
    { id: "budget",    name: "Cheap Budget"},
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
    {
      id: 2,
      title:       t("products.houseownerTakaful.title"),
      subtitle:    t("products.houseownerTakaful.subtitle"),
      description: t("products.houseownerTakaful.description"),
      features: [
        t("products.houseownerTakaful.feature1"),
        t("products.houseownerTakaful.feature2"),
        t("products.houseownerTakaful.feature3"),
        t("products.houseownerTakaful.feature4"),
        t("products.houseownerTakaful.feature5"),
      ],
      type: "takaful", category: "home",
    },
    {
      id: 3,
      title:       t("products.myRumah.title"),
      subtitle:    t("products.myRumah.subtitle"),
      description: t("products.myRumah.description"),
      features: [
        t("products.myRumah.feature1"),
        t("products.myRumah.feature2"),
        t("products.myRumah.feature3"),
      ],
      type: "insurance", category: "home",
    },
    {
      id: 4,
      title:       t("products.myRumahTakaful.title"),
      subtitle:    t("products.myRumahTakaful.subtitle"),
      description: t("products.myRumahTakaful.description"),
      features: [
        t("products.myRumahTakaful.feature1"),
        t("products.myRumahTakaful.feature2"),
        t("products.myRumahTakaful.feature3"),
      ],
      type: "takaful", category: "home",
    },
  ]

  const mortgageProducts = [
    {
      id: 5,
      title:       t("products.mrta.title"),
      description: t("products.mrta.description"),
      benefits: [t("products.mrta.benefit1"), t("products.mrta.benefit2")],
      type: "insurance",
    },
    {
      id: 6,
      title:       t("products.mrtt.title"),
      description: t("products.mrtt.description"),
      benefits: [t("products.mrtt.benefit1"), t("products.mrtt.benefit2")],
      type: "takaful",
    },
  ]

  const filteredProducts = products.filter((p) =>
    activeFilter === "all"
      ? p.category === selectedCategory
      : p.category === selectedCategory && p.type === activeFilter,
  )

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleCategoryClick = (id: string) => {
    const cat = categories.find((c) => c.id === id)
    if (!cat?.comingSoon) setSelectedCategory(id)
  }

  const handleApplyOnline = () => router.push("/dashboard/quotation")

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">

      {/* ── Page heading ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">{t("signUpOnline")}</h1>
        <p className="text-sm text-[#555555] mt-1">Select a category below to explore available plans.</p>
      </div>

      {/* ── Category picker ──────────────────────────────────────────────────── */}
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
                "relative flex flex-col items-center gap-2 px-5 py-4 rounded-xl border-2 transition-all duration-150 min-w-[84px]",
                isSelected
                  ? "bg-[#FEF3DC] border-[#F5A623] shadow-sm"
                  : "bg-white border-[#E0E0E0] hover:border-[#F5A623]",
                cat.comingSoon && "opacity-50 cursor-not-allowed hover:border-[#E0E0E0]",
              )}
            >
              {/* Discount badge */}
              {cat.discount && !cat.comingSoon && (
                <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-[#E87722] text-white px-1.5 py-0.5 rounded-full leading-none">
                  {cat.discount}
                </span>
              )}

              {/* Icon */}
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

              {/* Coming soon pill */}
              {cat.comingSoon && (
                <span className="text-[10px] font-semibold bg-[#F5F5F5] text-[#9E9E9E] border border-[#E0E0E0] px-2 py-0.5 rounded-full leading-none">
                  {tCommon("comingSoon")}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Home category content ─────────────────────────────────────────────── */}
      {selectedCategory === "home" && (
        <>
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "h-8 px-4 rounded-full text-sm font-medium border transition-all duration-150",
                  activeFilter === f.id
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "bg-white text-[#555555] border-[#E0E0E0] hover:border-[#1A1A1A] hover:text-[#1A1A1A]",
                )}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Product cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-[#E0E0E0] rounded-xl p-5 shadow-sm hover:border-[#F5A623] hover:shadow-md transition-all duration-150 flex flex-col"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    {/* Category badge */}
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
                  {/* Icon */}
                  <div className="w-12 h-12 shrink-0 bg-[#FFFDE7] rounded-xl flex items-center justify-center">
                    <Home className="h-6 w-6 text-[#F5A623]" />
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-5 flex-1">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-[#00A651] shrink-0 mt-0.5" />
                      <span className="text-[#555555]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Actions */}
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

          {/* ── Mortgage protection ─────────────────────────────────────────── */}
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">{t("mortgageProtection")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mortgageProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#E0E0E0] rounded-xl p-5 shadow-sm hover:border-[#F5A623] hover:shadow-md transition-all duration-150 flex flex-col"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          "inline-block text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md mb-2",
                          product.type === "takaful"
                            ? "bg-[#E6F7EE] text-[#00A651]"
                            : "bg-[#FDF0E6] text-[#E87722]",
                        )}
                      >
                        {product.type === "takaful" ? "Takaful" : "Insurance"}
                      </span>
                      <h3 className="text-base font-semibold text-[#1A1A1A] leading-snug mb-1">
                        {product.title}
                      </h3>
                      <p className="text-sm text-[#555555] leading-relaxed">{product.description}</p>
                    </div>
                    <div className="w-12 h-12 shrink-0 bg-[#FFFDE7] rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-[#F5A623]" />
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-5 flex-1">
                    <p className="text-xs font-semibold text-[#9E9E9E] uppercase tracking-wide mb-2">
                      {tCommon("benefits")}
                    </p>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-[#00A651] shrink-0 mt-0.5" />
                          <span className="text-[#555555]">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
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
          </div>
        </>
      )}

      {/* ── Coming soon placeholder ───────────────────────────────────────────── */}
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
