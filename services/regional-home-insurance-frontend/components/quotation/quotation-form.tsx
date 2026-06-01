"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Home, Building, Minus, Plus, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface FormData {
  ownershipType: string
  coverageStartDate: Date | undefined
  propertyType: string
  propertySubType: string
  numberOfStorey: number
  constructionType: string
  postcode: string
  currentFlooding: string
  unoccupiedProperty: string
  previousLoss: string
  idType: string
  passportNumber: string
  nricNumber: string
  nationality: string
  dateOfBirth: string
}

export default function QuotationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    ownershipType: "owner",
    coverageStartDate: new Date("2025-06-21"),
    propertyType: "landed",
    propertySubType: "landed-partial-brick",
    numberOfStorey: 1,
    constructionType: "partial-brick",
    postcode: "09300",
    currentFlooding: "no",
    unoccupiedProperty: "no",
    previousLoss: "no",
    idType: "passport",
    passportNumber: "021217020209",
    nricNumber: "",
    nationality: "MALAYSIAN",
    dateOfBirth: "17/12/2002",
  })

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/quotation/customize")
    }, 2000)
  }

  const propertyTypes = [
    {
      id: "landed",
      title: "Landed",
      description: "Bungalow, terrace, semi-detached house",
      icon: Home,
    },
    {
      id: "non-landed",
      title: "Non-Landed",
      description: "Apartments, flats and condos",
      icon: Building,
    },
  ]

  const constructionTypes = [
    {
      id: "full-brick",
      title: "Full Brick",
      description: "My house is built with sturdy brick walls and concrete floors",
    },
    {
      id: "partial-brick",
      title: "Partial Brick",
      description:
        "My house has a mixture of brick, concrete, and timber materials such as attap roof, wooden glass walls. The roof is made of non-flammable materials.",
    },
  ]

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get a free quotation in minutes</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Owner/Tenant Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">I'm a</Label>
            <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-1">
              <Button
                type="button"
                variant={formData.ownershipType === "owner" ? "default" : "ghost"}
                className={cn(
                  "rounded-md transition-all",
                  formData.ownershipType === "owner"
                    ? "bg-gray-800 text-white shadow-sm"
                    : "bg-transparent text-gray-600 hover:bg-gray-200",
                )}
                onClick={() => handleInputChange("ownershipType", "owner")}
              >
                Owner
              </Button>
              <Button
                type="button"
                variant={formData.ownershipType === "tenant" ? "default" : "ghost"}
                className={cn(
                  "rounded-md transition-all",
                  formData.ownershipType === "tenant"
                    ? "bg-gray-800 text-white shadow-sm"
                    : "bg-transparent text-gray-600 hover:bg-gray-200",
                )}
                onClick={() => handleInputChange("ownershipType", "tenant")}
              >
                Tenant
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">The coverage starts from</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal border-gray-300">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.coverageStartDate ? format(formData.coverageStartDate, "dd/MM/yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.coverageStartDate}
                  onSelect={(date) => handleInputChange("coverageStartDate", date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Property Type Dropdown */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Property Type</Label>
          <Select
            value={formData.propertySubType}
            onValueChange={(value) => handleInputChange("propertySubType", value)}
          >
            <SelectTrigger className="w-full border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landed-partial-brick">Landed, Partial Brick</SelectItem>
              <SelectItem value="landed-full-brick">Landed, Full Brick</SelectItem>
              <SelectItem value="non-landed-partial-brick">Non-Landed, Partial Brick</SelectItem>
              <SelectItem value="non-landed-full-brick">Non-Landed, Full Brick</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type Cards */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">Property Type</Label>
          <div className="grid grid-cols-2 gap-4">
            {propertyTypes.map((type) => (
              <Card
                key={type.id}
                className={cn(
                  "cursor-pointer transition-all border-2",
                  formData.propertyType === type.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => handleInputChange("propertyType", type.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <type.icon className="h-6 w-6 text-gray-600" />
                    {formData.propertyType === type.id && <CheckCircle className="h-5 w-5 text-green-600" />}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Number of Storey */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">No. of storey</Label>
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-gray-300"
              onClick={() => handleInputChange("numberOfStorey", Math.max(1, formData.numberOfStorey - 1))}
              disabled={formData.numberOfStorey <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-semibold w-8 text-center">{formData.numberOfStorey}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-gray-300"
              onClick={() => handleInputChange("numberOfStorey", Math.min(5, formData.numberOfStorey + 1))}
              disabled={formData.numberOfStorey >= 5}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Construction Type */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">Construction type</Label>
          <div className="space-y-3">
            {constructionTypes.map((type) => (
              <Card
                key={type.id}
                className={cn(
                  "cursor-pointer transition-all border-2",
                  formData.constructionType === type.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300",
                )}
                onClick={() => handleInputChange("constructionType", type.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                          <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        </div>
                        <h3 className="font-semibold text-gray-900">{type.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                    {formData.constructionType === type.id && (
                      <CheckCircle className="h-5 w-5 text-green-600 ml-3 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Postcode */}
        <div>
          <Label htmlFor="postcode" className="text-sm font-medium text-gray-700 mb-3 block">
            Key in your postcode to check for flood risk
          </Label>
          <Input
            id="postcode"
            value={formData.postcode}
            onChange={(e) => handleInputChange("postcode", e.target.value)}
            className="border-gray-300"
            placeholder="Enter postcode"
          />
        </div>

        {/* Risk Assessment Questions */}
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Is your property currently experiencing flooding?
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={formData.currentFlooding === "yes" ? "default" : "outline"}
                className={cn(
                  formData.currentFlooding === "yes"
                    ? "bg-gray-800 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50",
                )}
                onClick={() => handleInputChange("currentFlooding", "yes")}
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={formData.currentFlooding === "no" ? "default" : "outline"}
                className={cn(
                  formData.currentFlooding === "no"
                    ? "bg-gray-800 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50",
                )}
                onClick={() => handleInputChange("currentFlooding", "no")}
              >
                No
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Will this property be unoccupied for 90 days or more?
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={formData.unoccupiedProperty === "yes" ? "default" : "outline"}
                className={cn(
                  formData.unoccupiedProperty === "yes"
                    ? "bg-gray-800 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50",
                )}
                onClick={() => handleInputChange("unoccupiedProperty", "yes")}
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={formData.unoccupiedProperty === "no" ? "default" : "outline"}
                className={cn(
                  formData.unoccupiedProperty === "no"
                    ? "bg-gray-800 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50",
                )}
                onClick={() => handleInputChange("unoccupiedProperty", "no")}
              >
                No
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Have you suffered any loss or damage on this property in the past two years?
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={formData.previousLoss === "yes" ? "default" : "outline"}
                className={cn(
                  formData.previousLoss === "yes"
                    ? "bg-gray-800 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50",
                )}
                onClick={() => handleInputChange("previousLoss", "yes")}
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={formData.previousLoss === "no" ? "default" : "outline"}
                className={cn(
                  formData.previousLoss === "no"
                    ? "bg-gray-800 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50",
                )}
                onClick={() => handleInputChange("previousLoss", "no")}
              >
                No
              </Button>
            </div>
          </div>
        </div>

        {/* ID Type Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">ID Type</Label>
          <div className="grid grid-cols-3 gap-3">
            {["mykad", "passport", "mypr"].map((type) => (
              <Button
                key={type}
                type="button"
                variant={formData.idType === type ? "default" : "outline"}
                className={cn(
                  formData.idType === type
                    ? "bg-gray-800 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50",
                )}
                onClick={() => handleInputChange("idType", type)}
              >
                {type === "mykad" ? "MyKad" : type === "passport" ? "Passport" : "MyPR"}
              </Button>
            ))}
          </div>
        </div>

        {/* ID Number Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.idType === "passport" ? (
            <div>
              <Label htmlFor="passport" className="text-sm font-medium text-gray-700 mb-3 block">
                Passport no.
              </Label>
              <Input
                id="passport"
                value={formData.passportNumber}
                onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                className="border-gray-300"
                placeholder="Enter passport number"
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="nric" className="text-sm font-medium text-gray-700 mb-3 block">
                NRIC no.
              </Label>
              <Input
                id="nric"
                value={formData.nricNumber}
                onChange={(e) => handleInputChange("nricNumber", e.target.value)}
                className="border-gray-300"
                placeholder="Enter NRIC number"
              />
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Nationality</Label>
            <Select value={formData.nationality} onValueChange={(value) => handleInputChange("nationality", value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALAYSIAN">MALAYSIAN</SelectItem>
                <SelectItem value="SINGAPOREAN">SINGAPOREAN</SelectItem>
                <SelectItem value="INDONESIAN">INDONESIAN</SelectItem>
                <SelectItem value="THAI">THAI</SelectItem>
                <SelectItem value="FILIPINO">FILIPINO</SelectItem>
                <SelectItem value="OTHER">OTHER</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <Label htmlFor="dob" className="text-sm font-medium text-gray-700 mb-3 block">
            Date of Birth
          </Label>
          <Input
            id="dob"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className="border-gray-300"
            placeholder="DD/MM/YYYY"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#0056b3] hover:bg-[#004494] text-white font-semibold py-4 text-lg rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? "Getting Quote..." : "Get a Quote"}
        </Button>
      </form>
    </div>
  )
}
