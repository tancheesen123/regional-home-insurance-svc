"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, User, Home, Mail, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import CalculationSummary from "./calculation-summary"

interface FormData {
  // Personal Details
  name: string
  idType: string
  nricNumber: string
  nationality: string
  race: string
  gender: string
  dateOfBirth: string
  mobileNumber: string
  email: string

  // Property Details
  propertyAddress1: string
  propertyAddress2: string
  propertyCity: string
  propertyPostcode: string
  propertyState: string
  propertyCountry: string

  // Mailing Address
  sameAsPropertyAddress: boolean
  mailingAddress1: string
  mailingAddress2: string
  mailingCity: string
  mailingPostcode: string
  mailingState: string
  mailingCountry: string

  // Bank Details
  bankName: string
  accountNumber: string
}

export default function FillDetailsForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    property: true,
    mailing: true,
    bank: true,
  })

  const [formData, setFormData] = useState<FormData>({
    name: "ADAM BIN BAKRI",
    idType: "MYKAD",
    nricNumber: "021217020209",
    nationality: "MALAYSIAN",
    race: "",
    gender: "MALE",
    dateOfBirth: "17/12/2002",
    mobileNumber: "123456789",
    email: "ADAM@GMAIL.COM",

    propertyAddress1: "",
    propertyAddress2: "",
    propertyCity: "",
    propertyPostcode: "09300",
    propertyState: "KEDAH",
    propertyCountry: "MALAYSIA",

    sameAsPropertyAddress: false,
    mailingAddress1: "",
    mailingAddress2: "",
    mailingCity: "",
    mailingPostcode: "",
    mailingState: "",
    mailingCountry: "",

    bankName: "",
    accountNumber: "123456789012",
  })

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
    totalDeclaredAmount: 5000,
    maxDeclarableAmount: 20000,
    undeclaredAmount: 55000,
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-fill mailing address when checkbox is checked
    if (field === "sameAsPropertyAddress" && value === true) {
      setFormData((prev) => ({
        ...prev,
        mailingAddress1: prev.propertyAddress1,
        mailingAddress2: prev.propertyAddress2,
        mailingCity: prev.propertyCity,
        mailingPostcode: prev.propertyPostcode,
        mailingState: prev.propertyState,
        mailingCountry: prev.propertyCountry,
      }))
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/quotation/summary")
    }, 2000)
  }

  const races = ["MALAY", "CHINESE", "INDIAN", "OTHERS"]

  const banks = [
    "MAYBANK",
    "CIMB BANK",
    "PUBLIC BANK",
    "RHB BANK",
    "HONG LEONG BANK",
    "AMBANK",
    "BANK ISLAM",
    "BANK RAKYAT",
    "AFFIN BANK",
    "ALLIANCE BANK",
  ]

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
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <span className="ml-2 text-sm font-medium text-green-600">Declare Valuables</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="ml-2 text-sm font-medium">Fill Up Details</span>
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
        <h2 className="text-2xl font-bold mb-8">Tell us more about you</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details Section */}
          <Card className="border border-gray-200">
            <CardHeader className="cursor-pointer" onClick={() => toggleSection("personal")}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Details</span>
                </div>
                {expandedSections.personal ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
            {expandedSections.personal && (
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name (as per NRIC)</Label>
                  <Input
                    id="name"
                    placeholder="E.G.: ADAM BIN BAKRI"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>ID Type</Label>
                    <Select value={formData.idType} onValueChange={(value) => handleInputChange("idType", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MYKAD">MYKAD</SelectItem>
                        <SelectItem value="PASSPORT">PASSPORT</SelectItem>
                        <SelectItem value="MYPR">MYPR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="nric">NRIC no.</Label>
                    <Input
                      id="nric"
                      value={formData.nricNumber}
                      onChange={(e) => handleInputChange("nricNumber", e.target.value)}
                      className="bg-gray-100"
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nationality</Label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(value) => handleInputChange("nationality", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALAYSIAN">MALAYSIAN</SelectItem>
                        <SelectItem value="SINGAPOREAN">SINGAPOREAN</SelectItem>
                        <SelectItem value="INDONESIAN">INDONESIAN</SelectItem>
                        <SelectItem value="OTHER">OTHER</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Race</Label>
                    <Select value={formData.race} onValueChange={(value) => handleInputChange("race", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="SELECT RACE" />
                      </SelectTrigger>
                      <SelectContent>
                        {races.map((race) => (
                          <SelectItem key={race} value={race}>
                            {race}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Gender</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Button
                      type="button"
                      variant={formData.gender === "MALE" ? "default" : "outline"}
                      className={cn(
                        formData.gender === "MALE"
                          ? "bg-gray-800 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50",
                      )}
                      onClick={() => handleInputChange("gender", "MALE")}
                    >
                      MALE
                    </Button>
                    <Button
                      type="button"
                      variant={formData.gender === "FEMALE" ? "default" : "outline"}
                      className={cn(
                        formData.gender === "FEMALE"
                          ? "bg-gray-800 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50",
                      )}
                      onClick={() => handleInputChange("gender", "FEMALE")}
                    >
                      FEMALE
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className="bg-gray-100"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile">Mobile number</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                        +60
                      </span>
                      <Input
                        id="mobile"
                        className="rounded-l-none"
                        value={formData.mobileNumber}
                        onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="E.G.: ADAM@GMAIL.COM"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Property Details Section */}
          <Card className="border border-gray-200">
            <CardHeader className="cursor-pointer" onClick={() => toggleSection("property")}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>Property Details</span>
                </div>
                {expandedSections.property ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
            {expandedSections.property && (
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address1">Address 1</Label>
                  <Input
                    id="address1"
                    placeholder="E.G. ADDRESS LINE 1"
                    value={formData.propertyAddress1}
                    onChange={(e) => handleInputChange("propertyAddress1", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="address2">Address 2</Label>
                  <Input
                    id="address2"
                    placeholder="E.G. ADDRESS LINE 2"
                    value={formData.propertyAddress2}
                    onChange={(e) => handleInputChange("propertyAddress2", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="E.G. BANGSAR"
                    value={formData.propertyCity}
                    onChange={(e) => handleInputChange("propertyCity", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input id="postcode" value={formData.propertyPostcode} className="bg-gray-100" readOnly />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" value={formData.propertyState} className="bg-gray-100" readOnly />
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={formData.propertyCountry} className="bg-gray-100" readOnly />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Mailing Address Section */}
          <Card className="border border-gray-200">
            <CardHeader className="cursor-pointer" onClick={() => toggleSection("mailing")}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Mailing address</span>
                </div>
                {expandedSections.mailing ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
            {expandedSections.mailing && (
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="same-address"
                    checked={formData.sameAsPropertyAddress}
                    onCheckedChange={(checked) => handleInputChange("sameAsPropertyAddress", checked as boolean)}
                  />
                  <Label htmlFor="same-address">Is your mailing address same as property address?</Label>
                </div>

                <div>
                  <Label htmlFor="mail-address1">Address 1</Label>
                  <Input
                    id="mail-address1"
                    placeholder="E.G. ADDRESS LINE 1"
                    value={formData.mailingAddress1}
                    onChange={(e) => handleInputChange("mailingAddress1", e.target.value)}
                    disabled={formData.sameAsPropertyAddress}
                  />
                </div>

                <div>
                  <Label htmlFor="mail-address2">Address 2</Label>
                  <Input
                    id="mail-address2"
                    placeholder="E.G. ADDRESS LINE 2"
                    value={formData.mailingAddress2}
                    onChange={(e) => handleInputChange("mailingAddress2", e.target.value)}
                    disabled={formData.sameAsPropertyAddress}
                  />
                </div>

                <div>
                  <Label htmlFor="mail-city">City</Label>
                  <Input
                    id="mail-city"
                    placeholder="E.G. BANGSAR"
                    value={formData.mailingCity}
                    onChange={(e) => handleInputChange("mailingCity", e.target.value)}
                    disabled={formData.sameAsPropertyAddress}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="mail-postcode">Postcode</Label>
                    <Input
                      id="mail-postcode"
                      placeholder="E.G. 68100"
                      value={formData.mailingPostcode}
                      onChange={(e) => handleInputChange("mailingPostcode", e.target.value)}
                      disabled={formData.sameAsPropertyAddress}
                    />
                  </div>

                  <div>
                    <Label htmlFor="mail-state">State</Label>
                    <Input
                      id="mail-state"
                      placeholder="E.G. SELANGOR"
                      value={formData.mailingState}
                      onChange={(e) => handleInputChange("mailingState", e.target.value)}
                      disabled={formData.sameAsPropertyAddress}
                    />
                  </div>

                  <div>
                    <Label htmlFor="mail-country">Country</Label>
                    <Input
                      id="mail-country"
                      placeholder="E.G. MALAYSIA"
                      value={formData.mailingCountry}
                      onChange={(e) => handleInputChange("mailingCountry", e.target.value)}
                      disabled={formData.sameAsPropertyAddress}
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Bank Details Section */}
          <Card className="border border-gray-200">
            <CardHeader className="cursor-pointer" onClick={() => toggleSection("bank")}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Your Bank Details</span>
                </div>
                {expandedSections.bank ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
            {expandedSections.bank && (
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">For benefit payment/surrender/refund of contribution in future.</p>

                <div>
                  <Label>Bank name</Label>
                  <Select value={formData.bankName} onValueChange={(value) => handleInputChange("bankName", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="SELECT BANK" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="account">Current / Saving Account no.</Label>
                  <Input
                    id="account"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="bg-[#0056b3] hover:bg-[#004494] text-white font-semibold px-12 py-3"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Continue to Summary"}
            </Button>
          </div>
        </form>
      </div>

      <CalculationSummary step="details" planData={planData} valuablesData={valuablesData} />
    </div>
  )
}
