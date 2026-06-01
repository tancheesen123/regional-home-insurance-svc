"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Minus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CalculationSummary from "./calculation-summary"

interface ValuableItem {
  id: string
  description: string
  value: number
}

interface ValuableCategory {
  id: string
  name: string
  description?: string
  icon: string
  items: ValuableItem[]
  isExpanded: boolean
}

export default function DeclareValuables() {
  const router = useRouter()
  const [showDeclaration, setShowDeclaration] = useState(false)
  const [categories, setCategories] = useState<ValuableCategory[]>([
    {
      id: "gold",
      name: "Gold",
      icon: "🏅",
      items: [],
      isExpanded: false,
    },
    {
      id: "platinum",
      name: "Platinum",
      icon: "🥈",
      items: [],
      isExpanded: false,
    },
    {
      id: "silver",
      name: "Silver",
      icon: "🥉",
      items: [],
      isExpanded: false,
    },
    {
      id: "jewellery",
      name: "Jewellery",
      description: "Diamond, watches, necklace, bracelet...",
      icon: "💎",
      items: [],
      isExpanded: false,
    },
    {
      id: "animal-fur",
      name: "Animal Fur Products",
      description: "Fur coats, capes, accessories",
      icon: "🧥",
      items: [],
      isExpanded: false,
    },
    {
      id: "sports",
      name: "Sports",
      description: "Golf set, bicycle, gym set...",
      icon: "🚴",
      items: [],
      isExpanded: false,
    },
    {
      id: "collectibles",
      name: "Collectibles",
      description: "Vintage watches, musical instruments, art painting, antique furniture...",
      icon: "🏺",
      items: [],
      isExpanded: false,
    },
  ])

  const [newItem, setNewItem] = useState({ description: "", value: "" })

  const maxDeclarableAmount = 20000
  const totalDeclaredAmount = categories.reduce(
    (total, category) => total + category.items.reduce((sum, item) => sum + item.value, 0),
    0,
  )
  const undeclaredAmount = 60000 - totalDeclaredAmount

  const planData = {
    selectedPlan: "building-contents",
    buildingAmount: 500000,
    contentAmount: 60000,
    addOns: {
      riotStrike: false,
      extendedTheft: false,
    },
  }

  const valuablesData = {
    totalDeclaredAmount,
    maxDeclarableAmount,
    undeclaredAmount,
  }

  const handleWantToDeclare = () => {
    setShowDeclaration(true)
  }

  const handleSkipDeclaration = () => {
    router.push("/dashboard/quotation/fill-details")
  }

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        isExpanded: cat.id === categoryId ? !cat.isExpanded : false,
      })),
    )
    setNewItem({ description: "", value: "" })
  }

  const addItem = (categoryId: string) => {
    if (!newItem.description || !newItem.value) return

    const value = Number.parseFloat(newItem.value)
    if (value < 3000 || value > 20000) return

    const newItemObj: ValuableItem = {
      id: Date.now().toString(),
      description: newItem.description,
      value: value,
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: [...cat.items, newItemObj],
            }
          : cat,
      ),
    )

    setNewItem({ description: "", value: "" })
  }

  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.filter((item) => item.id !== itemId),
            }
          : cat,
      ),
    )
  }

  const handleContinue = () => {
    router.push("/dashboard/quotation/fill-details")
  }

  if (!showDeclaration) {
    return (
      <div className="max-w-4xl mx-auto pr-0 lg:pr-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Choose Plan</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium">Declare Valuables</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600">Fill Up Details</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm text-gray-600">Summary & Payment</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-8">
            Own more than RM 3,000 worth of the following items? Declare them to get complete coverage
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {categories.map((category) => (
              <div key={category.id} className="text-center">
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                {category.description && <p className="text-sm text-gray-600">({category.description})</p>}
              </div>
            ))}
          </div>

          <div className="flex gap-4 mb-8">
            <Button
              onClick={handleWantToDeclare}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-4"
            >
              Yes, I want to declare
            </Button>
            <Button
              onClick={handleSkipDeclaration}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-4"
            >
              No, I want to skip this
            </Button>
          </div>

          <Alert className="bg-gray-50 border-gray-200">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Items that do not need to be declared</p>
                <p className="text-sm text-gray-600">
                  <span className="text-blue-600">
                    Coverage of up to RM 40,000 (Coverage calculation is 2/3 of the content sum assured)
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Furniture, piano, organ, household appliances, radio, television set, recorder set, and Hi-Fi
                  equipment.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        <CalculationSummary step="declare" planData={planData} valuablesData={valuablesData} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pr-0 lg:pr-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <span className="ml-2 text-sm font-medium text-green-600">Choose Plan</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="ml-2 text-sm font-medium">Declare Valuables</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="ml-2 text-sm text-gray-600">Fill Up Details</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
              4
            </div>
            <span className="ml-2 text-sm text-gray-600">Summary & Payment</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Fill in the details of your declarable items</h2>
          <Button variant="link" className="text-blue-600" onClick={handleSkipDeclaration}>
            Skip declaration
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          {categories.map((category) => (
            <Card key={category.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      {category.description && <p className="text-sm text-gray-600">({category.description})</p>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    {category.isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>

                {category.isExpanded && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          placeholder="Please insert your item"
                          value={newItem.description}
                          onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="value">Value amount</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                            RM
                          </span>
                          <Input
                            id="value"
                            type="number"
                            className="rounded-l-none"
                            value={newItem.value}
                            onChange={(e) => setNewItem((prev) => ({ ...prev, value: e.target.value }))}
                          />
                        </div>
                        <p className="text-xs text-red-500 mt-1">Minimum RM 3,000 to Maximum RM 20,000</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => addItem(category.id)}
                      className="text-blue-600 bg-transparent hover:bg-blue-50 p-0 h-auto"
                      disabled={!newItem.description || !newItem.value}
                    >
                      + Add Item
                    </Button>

                    {category.items.length > 0 && (
                      <div className="space-y-2">
                        {category.items.map((item, index) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm">
                              {index + 1}. {item.description} | RM {item.value.toLocaleString()}
                            </span>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="text-blue-600">
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() => deleteItem(category.id, item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button onClick={handleContinue} className="bg-[#0056b3] hover:bg-[#004494] text-white px-12 py-3">
            Continue
          </Button>
        </div>
      </div>

      <CalculationSummary step="declare" planData={planData} valuablesData={valuablesData} />
    </div>
  )
}
