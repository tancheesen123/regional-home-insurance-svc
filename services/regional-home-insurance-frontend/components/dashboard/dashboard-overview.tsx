"use client"

import { useState, useEffect } from "react"
import { Car, Bike, Plane, Shield, Home, Heart, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/session"

export default function DashboardOverview() {
  const [selectedCategory, setSelectedCategory] = useState("home")
  const [activeFilter, setActiveFilter] = useState("all")
  const router = useRouter()
  const t = useTranslations("dashboard.overview")
  const tCommon = useTranslations("common")

  useEffect(() => {
    const session = getSession()
    console.log("[Session]", session)
  }, [])

  const categories = [
    { id: "car", name: t("categories.car"), icon: Car, discount: "15%", comingSoon: true },
    { id: "motorcycle", name: t("categories.motorcycle"), icon: Bike, discount: "15%", comingSoon: true },
    { id: "travel", name: t("categories.travel"), icon: Plane, discount: "20%", comingSoon: true },
    { id: "personal", name: t("categories.personal"), icon: Shield, discount: "25%", comingSoon: true },
    { id: "home", name: t("categories.home"), icon: Home, discount: "15%", comingSoon: false },
    { id: "medical", name: t("categories.medical"), icon: Heart, comingSoon: true },
    { id: "life", name: t("categories.life"), icon: Users, comingSoon: true },
  ]

  const filters = [
    { id: "all", name: "Show All" },
    { id: "insurance", name: "Insurance" },
    { id: "takaful", name: "Takaful" },
    { id: "budget", name: "Cheap Budget" },
    { id: "test", name: "test" },
  ]

  const products = [
    {
      id: 1,
      title: t("products.houseowner.title"),
      subtitle: t("products.houseowner.subtitle"),
      description: t("products.houseowner.description"),
      features: [
        t("products.houseowner.feature1"),
        t("products.houseowner.feature2"),
        t("products.houseowner.feature3"),
        t("products.houseowner.feature4"),
      ],
      type: "insurance",
      category: "home",
    },
    {
      id: 2,
      title: t("products.houseownerTakaful.title"),
      subtitle: t("products.houseownerTakaful.subtitle"),
      description: t("products.houseownerTakaful.description"),
      features: [
        t("products.houseownerTakaful.feature1"),
        t("products.houseownerTakaful.feature2"),
        t("products.houseownerTakaful.feature3"),
        t("products.houseownerTakaful.feature4"),
        t("products.houseownerTakaful.feature5"),
      ],
      type: "takaful",
      category: "home",
    },
    {
      id: 3,
      title: t("products.myRumah.title"),
      subtitle: t("products.myRumah.subtitle"),
      description: t("products.myRumah.description"),
      features: [
        t("products.myRumah.feature1"),
        t("products.myRumah.feature2"),
        t("products.myRumah.feature3"),
      ],
      type: "insurance",
      category: "home",
    },
    {
      id: 4,
      title: t("products.myRumahTakaful.title"),
      subtitle: t("products.myRumahTakaful.subtitle"),
      description: t("products.myRumahTakaful.description"),
      features: [
        t("products.myRumahTakaful.feature1"),
        t("products.myRumahTakaful.feature2"),
        t("products.myRumahTakaful.feature3"),
      ],
      type: "takaful",
      category: "home",
    },
  ]

  const mortgageProducts = [
    {
      id: 5,
      title: t("products.mrta.title"),
      description: t("products.mrta.description"),
      benefits: [t("products.mrta.benefit1"), t("products.mrta.benefit2")],
      type: "insurance",
    },
    {
      id: 6,
      title: t("products.mrtt.title"),
      description: t("products.mrtt.description"),
      benefits: [t("products.mrtt.benefit1"), t("products.mrtt.benefit2")],
      type: "takaful",
    },
  ]

  const filteredProducts = products.filter((product) => {
    if (activeFilter === "all") return product.category === selectedCategory
    return product.category === selectedCategory && product.type === activeFilter
  })

  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (category?.comingSoon) {
      return
    }
    setSelectedCategory(categoryId)
  }

  const handleApplyOnline = () => {
    router.push("/dashboard/quotation")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center bg-white border-b-2 border-blue-500 px-6 py-2 rounded-t-lg">
          <span className="text-blue-600 font-medium">{t("signUpOnline")}</span>
        </div>
      </div>

      {/* Category Icons */}
      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((category) => (
          <div
            key={category.id}
            className={cn(
              "flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all hover:shadow-md relative",
              selectedCategory === category.id && !category.comingSoon
                ? "bg-blue-50 border-2 border-blue-500"
                : "bg-white border border-gray-200",
              category.comingSoon && "opacity-60 cursor-not-allowed",
            )}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="relative">
              <div
                className={cn(
                  "p-3 rounded-lg mb-2",
                  selectedCategory === category.id && !category.comingSoon ? "bg-blue-500 text-white" : "bg-gray-100",
                )}
              >
                <category.icon className="h-6 w-6" />
              </div>
              {category.discount && !category.comingSoon && (
                <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1">
                  {category.discount}
                </Badge>
              )}
            </div>
            <span className="text-sm font-medium text-center">{category.name}</span>
            {category.comingSoon && (
              <Badge variant="secondary" className="mt-1 text-xs">
                {tCommon("comingSoon")}
              </Badge>
            )}
          </div>
        ))}
      </div>

      {/* Filter Buttons */}
      {selectedCategory === "home" && (
        <div className="flex flex-wrap gap-2 justify-center">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                activeFilter === filter.id
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "border-gray-300 hover:bg-gray-50",
              )}
            >
              {filter.name}
            </Button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {selectedCategory === "home" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          "mb-2",
                          product.type === "takaful"
                            ? "border-green-500 text-green-700"
                            : "border-orange-500 text-orange-700",
                        )}
                      >
                        {product.subtitle}
                      </Badge>
                      <CardTitle className="text-lg font-semibold mb-2">{product.title}</CardTitle>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Home className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-green-500 mr-2 mt-0.5">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      {tCommon("viewProductInfo")}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleApplyOnline}
                    >
                      {tCommon("applyOnline")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mortgage Products */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{t("mortgageProtection")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mortgageProducts.map((product) => (
                <Card key={product.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold mb-2">{product.title}</CardTitle>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                      <div className="ml-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Shield className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">{tCommon("benefits")}</h4>
                      <ul className="space-y-1">
                        {product.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <span className="text-green-500 mr-2 mt-0.5">✓</span>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        {tCommon("viewProductInfo")}
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleApplyOnline}
                      >
                        {tCommon("applyOnline")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Coming Soon Message */}
      {selectedCategory !== "home" && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {(() => {
                const category = categories.find((c) => c.id === selectedCategory)
                const IconComponent = category?.icon || Shield
                return <IconComponent className="h-8 w-8 text-gray-400" />
              })()}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">{tCommon("comingSoon")}</h3>
            <p className="text-gray-500 mb-6">
              {categories.find((c) => c.id === selectedCategory)?.name} {t("comingSoonMessage")}
            </p>
            <Button
              variant="outline"
              onClick={() => setSelectedCategory("home")}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              {t("exploreHome")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
