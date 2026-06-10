"use client"

import { useState, useEffect } from "react"
import { Save, X, Edit, Shield } from "lucide-react"
import { getCustomerByUserId, updateCustomerData } from "@/lib/api"
import { getSession } from "@/lib/session"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProfileData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  nationality: string
  idType: string
  idNumber: string

  // Address Information
  address1: string
  address2: string
  city: string
  state: string
  postcode: string
  country: string

  // Emergency Contact
  emergencyName: string
  emergencyRelation: string
  emergencyPhone: string

  // Preferences
  language: string
  currency: string
  timezone: string

  // Notifications
  emailNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
  policyReminders: boolean

  // Security
  twoFactorEnabled: boolean
}

const inputClass =
  "h-10 rounded-lg border-[1.5px] border-[#E0E0E0] text-sm text-[#1A1A1A] placeholder:text-[#9E9E9E] focus-visible:border-[#F5A623] focus-visible:ring-[3px] focus-visible:ring-[#F5A62333] disabled:bg-[#FAFAFA] disabled:text-[#BDBDBD] disabled:opacity-100"

const selectTriggerClass =
  "h-10 rounded-lg border-[1.5px] border-[#E0E0E0] text-sm text-[#1A1A1A] focus:border-[#F5A623] focus:ring-[3px] focus:ring-[#F5A62333] disabled:bg-[#FAFAFA] disabled:text-[#BDBDBD] disabled:opacity-100"

const labelClass = "text-xs font-medium text-[#555555] mb-1.5 block"

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E0E0E0] rounded-xl shadow-sm">
      <div className="px-5 py-4 border-b border-[#E0E0E0]">
        <h3 className="text-base font-semibold text-[#1A1A1A]">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "Adam",
    lastName: "Bin Bakri",
    email: "adam@gmail.com",
    phone: "+60123456789",
    dateOfBirth: "17/12/2002",
    gender: "Male",
    nationality: "Malaysian",
    idType: "MyKad",
    idNumber: "021217020209",

    address1: "123 Jalan Bangsar",
    address2: "Bangsar Baru",
    city: "Kuala Lumpur",
    state: "Selangor",
    postcode: "59100",
    country: "Malaysia",

    emergencyName: "Sarah Binti Ahmad",
    emergencyRelation: "Spouse",
    emergencyPhone: "+60123456788",

    language: "English",
    currency: "MYR",
    timezone: "Asia/Kuala_Lumpur",

    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: false,
    policyReminders: true,

    twoFactorEnabled: false,
  })

  useEffect(() => {
    const session = getSession()
    if (!session?.userId) return

    getCustomerByUserId(session.userId)
      .then((res) => {
        if (!res.succeeded) return
        console.log(res.data);
        const c = res.data
        setProfileData((prev) => ({
          ...prev,
          firstName: c.firstName ?? prev.firstName,
          lastName: c.lastName ?? prev.lastName,
          email: c.email ?? prev.email,
          phone: c.contact ?? prev.phone,
          dateOfBirth: c.dateOfBirth ?? prev.dateOfBirth,
          gender: c.gender ?? prev.gender,
          nationality: c.nationality ?? prev.nationality,
          idType: c.idType ?? prev.idType,
          idNumber: c.idNumber ?? prev.idNumber,
          // Address (null-safe)
          address1: c.address?.addressLine1 ?? prev.address1,
          address2: c.address?.addressLine2 ?? prev.address2,
          city: c.address?.city ?? prev.city,
          postcode: c.address?.postcode ?? prev.postcode,
          state: c.address?.state
            ? c.address.state.charAt(0).toUpperCase() + c.address.state.slice(1)
            : prev.state,
        }))
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    const session = getSession()
    if (!session?.userId) return

    setIsSaving(true)
    try {
      const response = await updateCustomerData(
        session.userId,
        {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          dateOfBirth: profileData.dateOfBirth,
          gender: profileData.gender,
          nationality: profileData.nationality,
          idType: profileData.idType,
          idNumber: profileData.idNumber,
          contact: profileData.phone,
          address: {
            addressLine1: profileData.address1,
            addressLine2: profileData.address2,
            city: profileData.city,
            postcode: profileData.postcode,
            state: profileData.state,
            country: "",
          },
        },
        session.countryCode
      )

      if (!response.succeeded) {
        console.error("[UpdateCustomer] Failed:", response.message)
        return
      }

      console.log("[UpdateCustomer] Success")
      setIsEditing(false)
    } catch (error) {
      console.error("[UpdateCustomer] Error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const states = ["Selangor", "Kuala Lumpur", "Johor", "Penang", "Sabah", "Sarawak", "Kedah"]
  const relations = ["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"]

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-[#555555]">
          <div className="w-8 h-8 border-4 border-[#F5A623]/20 border-t-[#F5A623] rounded-full animate-spin" />
          <p className="text-sm">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Profile Settings</h1>
          <p className="text-sm text-[#555555] mt-1">Manage your account information and preferences</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="h-10 px-5 rounded-lg border-[1.5px] border-[#E0E0E0] text-sm font-medium text-[#1A1A1A] hover:border-[#F5A623] hover:text-[#F5A623] hover:bg-[#FEF3DC] transition-colors duration-150 flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="h-10 px-5 rounded-lg bg-[#F5A623] hover:bg-[#D4891A] text-white text-sm font-semibold transition-colors duration-150 flex items-center justify-center gap-2 disabled:bg-[#E0E0E0] disabled:text-[#9E9E9E] disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-10 px-5 rounded-lg bg-[#F5A623] hover:bg-[#D4891A] text-white text-sm font-semibold transition-colors duration-150 flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-[#E0E0E0] rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[#FEF3DC] flex items-center justify-center text-[#F5A623] font-bold text-xl shrink-0">
            {profileData.firstName.charAt(0)}
            {profileData.lastName.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A]">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-sm text-[#555555]">{profileData.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00A651] bg-[#E6F7EE] border border-[#86EFAC] rounded-full px-2.5 py-1">
                <Shield className="h-3 w-3" />
                Verified Account
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
          <SectionCard title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className={labelClass}>First Name</Label>
                <Input
                  id="firstName"
                  className={inputClass}
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="lastName" className={labelClass}>Last Name</Label>
                <Input
                  id="lastName"
                  className={inputClass}
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className={labelClass}>Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  className={inputClass}
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone" className={labelClass}>Phone Number</Label>
                <Input
                  id="phone"
                  className={inputClass}
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  className={inputClass}
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label className={labelClass}>Gender</Label>
                <Select
                  value={profileData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={labelClass}>Nationality</Label>
                <Select
                  value={profileData.nationality}
                  onValueChange={(value) => handleInputChange("nationality", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Malaysian">Malaysian</SelectItem>
                    <SelectItem value="Singaporean">Singaporean</SelectItem>
                    <SelectItem value="Indonesian">Indonesian</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className={labelClass}>ID Type</Label>
                <Select
                  value={profileData.idType}
                  onValueChange={(value) => handleInputChange("idType", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MyKad">MyKad</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                    <SelectItem value="MyPR">MyPR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="idNumber" className={labelClass}>ID Number</Label>
                <Input
                  id="idNumber"
                  className={inputClass}
                  value={profileData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Address Information">
            <div>
              <Label htmlFor="address1" className={labelClass}>Address Line 1</Label>
              <Input
                id="address1"
                className={inputClass}
                value={profileData.address1}
                onChange={(e) => handleInputChange("address1", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="address2" className={labelClass}>Address Line 2</Label>
              <Input
                id="address2"
                className={inputClass}
                value={profileData.address2}
                onChange={(e) => handleInputChange("address2", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className={labelClass}>City</Label>
                <Input
                  id="city"
                  className={inputClass}
                  value={profileData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label className={labelClass}>State</Label>
                <Select
                  value={profileData.state}
                  onValueChange={(value) => handleInputChange("state", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="postcode" className={labelClass}>Postcode</Label>
                <Input
                  id="postcode"
                  className={inputClass}
                  value={profileData.postcode}
                  onChange={(e) => handleInputChange("postcode", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </SectionCard>
      </div>
    </div>
  )
}
