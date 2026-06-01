"use client"

import { useState, useEffect } from "react"
import { Save, X, Edit, Eye, EyeOff, Shield, CreditCard, User } from "lucide-react"
import { getCustomerByUserId, updateCustomerData } from "@/lib/api"
import { getSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

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
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-8 h-8 border-4 border-[#0056b3]/20 border-t-[#0056b3] rounded-full animate-spin" />
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
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-bold">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-600">{profileData.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Account
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Personal</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          {/* Notifications tab — commented out, pending implementation */}
          {/* <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger> */}
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select
                    value={profileData.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
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
                  <Label>Nationality</Label>
                  <Select
                    value={profileData.nationality}
                    onValueChange={(value) => handleInputChange("nationality", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
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
                  <Label>ID Type</Label>
                  <Select
                    value={profileData.idType}
                    onValueChange={(value) => handleInputChange("idType", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input
                    id="idNumber"
                    value={profileData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address1">Address Line 1</Label>
                <Input
                  id="address1"
                  value={profileData.address1}
                  onChange={(e) => handleInputChange("address1", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  value={profileData.address2}
                  onChange={(e) => handleInputChange("address2", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Select
                    value={profileData.state}
                    onValueChange={(value) => handleInputChange("state", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    value={profileData.postcode}
                    onChange={(e) => handleInputChange("postcode", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={profileData.emergencyName}
                    onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Relationship</Label>
                  <Select
                    value={profileData.emergencyRelation}
                    onValueChange={(value) => handleInputChange("emergencyRelation", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {relations.map((relation) => (
                        <SelectItem key={relation} value={relation}>
                          {relation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Phone Number</Label>
                <Input
                  id="emergencyPhone"
                  value={profileData.emergencyPhone}
                  onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card> */}
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    disabled={!isEditing}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" disabled={!isEditing} />
              </div>

              {/* <Separator /> */}

              {/* <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={profileData.twoFactorEnabled}
                  onCheckedChange={(checked) => handleInputChange("twoFactorEnabled", checked)}
                  disabled={!isEditing}
                />
              </div> */}

              {profileData.twoFactorEnabled && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Two-factor authentication is enabled. You'll receive a verification code via SMS when logging in.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Login Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-gray-600">Chrome on Windows • Kuala Lumpur, Malaysia</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Mobile App</p>
                    <p className="text-sm text-gray-600">iOS App • 2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </TabsContent>

        {/* Notifications Tab — commented out, pending implementation */}
        {/* <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch
                  checked={profileData.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
                <Switch
                  checked={profileData.smsNotifications}
                  onCheckedChange={(checked) => handleInputChange("smsNotifications", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Marketing Emails</h4>
                  <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                </div>
                <Switch
                  checked={profileData.marketingEmails}
                  onCheckedChange={(checked) => handleInputChange("marketingEmails", checked)}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Policy Reminders</h4>
                  <p className="text-sm text-gray-600">Receive reminders about policy renewals and payments</p>
                </div>
                <Switch
                  checked={profileData.policyReminders}
                  onCheckedChange={(checked) => handleInputChange("policyReminders", checked)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Preferred Language</Label>
                  <Select
                    value={profileData.language}
                    onValueChange={(value) => handleInputChange("language", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Bahasa Malaysia">Bahasa Malaysia</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select
                    value={profileData.timezone}
                    onValueChange={(value) => handleInputChange("timezone", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kuala_Lumpur">Asia/Kuala Lumpur</SelectItem>
                      <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
                      <SelectItem value="Asia/Jakarta">Asia/Jakarta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 1234</p>
                      <p className="text-sm text-gray-600">Expires 12/26</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="default">Primary</Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Add New Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Home Insurance Premium</p>
                    <p className="text-sm text-gray-600">Policy HI-2025-001234 • Jan 21, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">RM 1,333.76</p>
                    <Badge variant="default" className="text-xs">
                      Paid
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Home Insurance Premium</p>
                    <p className="text-sm text-gray-600">Policy HI-2024-001234 • Jan 21, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">RM 1,250.00</p>
                    <Badge variant="default" className="text-xs">
                      Paid
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
