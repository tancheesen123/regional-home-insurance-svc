"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  FileText,
  User,
  MapPin,
  Shield,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Archive,
  CreditCard,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import {
  getProposal,
  fetchCustomerProposals,
  type GetProposalData,
  type CustomerProposalPolicy,
  type CustomerProposalDocument,
} from "@/lib/api"
import { formatAmount } from "@/lib/currency"
import { downloadSingleFile, downloadPolicyDocuments, DocumentDownloadError } from "@/lib/api/document"
import { getSession } from "@/lib/session"

interface PolicyDetailProps {
  proposalId: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function safeFormatDate(dateStr: string | undefined | null, fmt = "MMM dd, yyyy"): string {
  if (!dateStr) return "—"
  try { return format(new Date(dateStr), fmt) } catch { return dateStr }
}

function formatPlanType(planType: string): string {
  switch (planType.toLowerCase()) {
    case "building-contents": return "Building + Contents"
    case "building":          return "Building Only"
    case "contents":          return "Contents Only"
    default:
      return planType.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" + ")
  }
}

function deriveStatus(endDate: string | undefined): "Active" | "Expired" {
  if (!endDate) return "Expired"
  return new Date(endDate) >= new Date() ? "Active" : "Expired"
}

function getStatusColor(status: string) {
  switch (status) {
    case "Active":  return "bg-green-100 text-green-800"
    case "Expired": return "bg-gray-100 text-gray-800"
    default:        return "bg-gray-100 text-gray-800"
  }
}

function YesNo({ val }: { val: boolean }) {
  return <span className={val ? "text-green-600 font-medium" : "text-gray-500"}>{val ? "Yes" : "No"}</span>
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="p-6 space-y-4">
        {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-6 w-full" />)}
      </CardContent></Card>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PolicyDetail({ proposalId }: PolicyDetailProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [proposal, setProposal] = useState<GetProposalData | null>(null)
  const [policy,   setPolicy]   = useState<CustomerProposalPolicy | null>(null)
  const [documents, setDocuments] = useState<CustomerProposalDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  // Download state
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null)
  const [downloadingAll,   setDownloadingAll]   = useState(false)
  const [downloadError,    setDownloadError]    = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const session = getSession()
    if (!session) {
      setError("Session expired. Please log in again.")
      setLoading(false)
      return
    }

    Promise.all([
      getProposal(proposalId, session.countryCode),
      fetchCustomerProposals(session.customerId),
    ])
      .then(([proposalRes, allProposals]) => {
        if (cancelled) return

        if (!proposalRes.succeeded) {
          setError(proposalRes.message ?? "Failed to load policy details.")
          return
        }
        setProposal(proposalRes.data)

        const match = allProposals.find((p) => p.proposalId === proposalId)
        if (match?.policy) {
          setPolicy(match.policy)
          setDocuments(match.policy.documents ?? [])
        }
      })
      .catch((err: Error) => {
        if (cancelled) return
        setError("Failed to load policy details. Please try again.")
        console.error("[PolicyDetail] fetch error", err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [proposalId])

  // ── Download handlers ──────────────────────────────────────────────────────

  const handleDownloadDoc = async (docId: string, fileType: string, fileName: string) => {
    setDownloadingDocId(docId)
    setDownloadError(null)
    try {
      await downloadSingleFile(proposalId, fileType, fileName)
    } catch (err) {
      setDownloadError(
        err instanceof DocumentDownloadError ? err.message : "Download failed. Please try again."
      )
    } finally {
      setDownloadingDocId(null)
    }
  }

  const handleDownloadAll = async () => {
    if (!policy) return
    setDownloadingAll(true)
    setDownloadError(null)
    try {
      await downloadPolicyDocuments(proposalId, policy.policyNumber)
    } catch (err) {
      setDownloadError(
        err instanceof DocumentDownloadError ? err.message : "Download failed. Please try again."
      )
    } finally {
      setDownloadingAll(false)
    }
  }

  if (loading) return <LoadingSkeleton />

  if (error || !proposal) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Policies
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error ?? "An unexpected error occurred."}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const { personalDetails, propertyAddress, mailingAddress, bankDetails, quotation } = proposal
  const policyStatus = deriveStatus(policy?.endDate)
  const region = quotation.region.toUpperCase()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Policies
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Policy Details</h1>
            <p className="text-gray-600">Policy: {policy?.policyNumber ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      <Alert className={policyStatus === "Active" ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Policy Status: {policyStatus}</strong>
          {policyStatus === "Active" && " — This policy is currently active and providing coverage."}
          {policyStatus === "Expired" && " — This policy has expired and is no longer providing coverage."}
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Premium</p>
                <p className="text-xl font-bold">
                  {formatAmount(quotation.premiumBreakdown?.totalPremium ?? quotation.totalPremium, region, true)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Sum Insured</p>
                <p className="text-xl font-bold">
                  {formatAmount((quotation.buildingSum ?? 0) + (quotation.contentsSum ?? 0), region, true)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Expires</p>
                <p className="text-lg font-bold">{safeFormatDate(policy?.endDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-2">
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <Badge className={getStatusColor(policyStatus)}>{policyStatus}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Policy Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Policy Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Policy Number:</span>
                  <span className="font-medium">{policy?.policyNumber ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coverage Type:</span>
                  <span className="font-medium">{formatPlanType(quotation.planType)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Region:</span>
                  <span className="font-medium">{region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={getStatusColor(policyStatus)}>{policyStatus}</Badge>
                </div>
                {policy && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issued By:</span>
                      <span className="font-medium">{policy.issuedBy || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issued At:</span>
                      <span className="font-medium">{safeFormatDate(policy.issuedAt)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Coverage Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Coverage Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Building Sum:</span>
                  <span className="font-medium">{formatAmount(quotation.buildingSum, region, true)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contents Sum:</span>
                  <span className="font-medium">{formatAmount(quotation.contentsSum, region, true)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective Date:</span>
                  <span>{safeFormatDate(policy?.startDate ?? quotation.coverageStartDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiry Date:</span>
                  <span>{safeFormatDate(policy?.endDate ?? quotation.expiryDate)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total Premium:</span>
                  <span>{formatAmount(quotation.premiumBreakdown?.totalPremium ?? quotation.totalPremium, region, true)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insured Person (quick view) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Insured Person
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Name</h4>
                  <p>{personalDetails.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contact</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Mail className="h-3.5 w-3.5" />
                      {personalDetails.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Phone className="h-3.5 w-3.5" />
                      {personalDetails.mobileNumber}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Property</h4>
                  <div className="flex items-start gap-1.5 text-gray-600">
                    <MapPin className="h-3.5 w-3.5 mt-0.5" />
                    <span>
                      {propertyAddress.city}, {propertyAddress.state}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Personal Details ── */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Personal Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full Name:</span>
                      <span className="font-medium">{personalDetails.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span>{safeFormatDate(personalDetails.dateOfBirth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span>{personalDetails.gender || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nationality:</span>
                      <span>{personalDetails.nationality || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Type:</span>
                      <span>{personalDetails.idType || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Number:</span>
                      <span>{personalDetails.idNumber || "—"}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{personalDetails.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{personalDetails.mobileNumber}</span>
                    </div>
                  </div>

                  <Separator />

                  <h4 className="font-semibold">Bank Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank Name:</span>
                      <span className="font-medium">{bankDetails.bankName || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-mono">{bankDetails.accountNumber || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> Property Address
                  </h4>
                  <div className="text-sm text-gray-600 space-y-0.5">
                    <p>{propertyAddress.addressLine1}</p>
                    {propertyAddress.addressLine2 && <p>{propertyAddress.addressLine2}</p>}
                    <p>{propertyAddress.postcode} {propertyAddress.city}</p>
                    <p>{propertyAddress.state}, {propertyAddress.country}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> Mailing Address
                  </h4>
                  {mailingAddress.sameAsPropertyAddress ? (
                    <p className="text-sm text-gray-500 italic">Same as property address</p>
                  ) : (
                    <div className="text-sm text-gray-600 space-y-0.5">
                      <p>{mailingAddress.addressLine1}</p>
                      {mailingAddress.addressLine2 && <p>{mailingAddress.addressLine2}</p>}
                      <p>{mailingAddress.postcode} {mailingAddress.city}</p>
                      <p>{mailingAddress.state}, {mailingAddress.country}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Property ── */}
        <TabsContent value="property" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Property Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ownership Type:</span>
                      <span className="font-medium capitalize">{quotation.ownershipType || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium capitalize">{quotation.propertyType || "—"}</span>
                    </div>
                    {quotation.propertySubType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sub-type:</span>
                        <span className="capitalize">{quotation.propertySubType}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Construction:</span>
                      <span className="capitalize">{quotation.constructionType || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Storeys:</span>
                      <span>{quotation.numberOfStorey ?? "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Postcode:</span>
                      <span>{quotation.postcode || "—"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Risk Factors</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Flood Risk Area:</span>
                      <YesNo val={quotation.currentFlooding} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unoccupied Property:</span>
                      <YesNo val={quotation.unoccupiedProperty} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Previous Loss:</span>
                      <YesNo val={quotation.previousLoss} />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Add-ons */}
              <div>
                <h4 className="font-semibold mb-3">Add-on Coverage</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Riot & Strike",             val: quotation.addOns.riotStrike },
                    { label: "Extended Theft",            val: quotation.addOns.extendedTheft },
                    { label: "Alternative Accommodation", val: quotation.addOns.alternativeAccommodation },
                    { label: "Public Liability",          val: quotation.addOns.publicLiability },
                  ].map(({ label, val }) => (
                    <div key={label} className={`rounded-lg p-3 text-center text-sm border ${val ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                      <p className="font-medium">{label}</p>
                      <p className={val ? "text-green-600" : "text-gray-400"}>{val ? "Included" : "Not included"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Valuable Items */}
              {quotation.valuableItems && quotation.valuableItems.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Declared Valuable Items</h4>
                    <div className="space-y-2">
                      {quotation.valuableItems.map((item) => (
                        <div key={item.itemId} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                          <div>
                            <p className="font-medium">{item.description}</p>
                            <p className="text-gray-500 capitalize">{item.category}</p>
                          </div>
                          <span className="font-semibold">{formatAmount(item.value, region, true)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Financial ── */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Premium Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {quotation.premiumBreakdown ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Calculation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan Premium:</span>
                        <span>{formatAmount(quotation.premiumBreakdown.planPremium, region, true)}</span>
                      </div>
                      {quotation.premiumBreakdown.addOnPremium > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Add-on Premium:</span>
                          <span>{formatAmount(quotation.premiumBreakdown.addOnPremium, region, true)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gross Premium:</span>
                        <span>{formatAmount(quotation.premiumBreakdown.grossPremium, region, true)}</span>
                      </div>
                      {quotation.premiumBreakdown.discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>−{formatAmount(quotation.premiumBreakdown.discountAmount, region, true)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Premium:</span>
                        <span>{formatAmount(quotation.premiumBreakdown.netPremium, region, true)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Service Tax ({(quotation.premiumBreakdown.taxRate * 100).toFixed(0)}%):
                        </span>
                        <span>{formatAmount(quotation.premiumBreakdown.taxAmount, region, true)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stamp Duty:</span>
                        <span>{formatAmount(quotation.premiumBreakdown.stampDuty, region, true)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-base">
                        <span>Total Premium:</span>
                        <span>{formatAmount(quotation.premiumBreakdown.totalPremium, region, true)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Sum Insured</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Building:</span>
                        <span className="font-medium">{formatAmount(quotation.buildingSum, region, true)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contents:</span>
                        <span className="font-medium">{formatAmount(quotation.contentsSum, region, true)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total Sum Insured:</span>
                        <span>{formatAmount((quotation.buildingSum ?? 0) + (quotation.contentsSum ?? 0), region, true)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Premium:</span>
                    <span>{formatAmount(quotation.annualPremium, region, true)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Premium:</span>
                    <span>{formatAmount(quotation.monthlyPremium, region, true)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total Premium:</span>
                    <span>{formatAmount(quotation.totalPremium, region, true)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Documents ── */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Policy Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {downloadError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    {downloadError}
                    <button onClick={() => setDownloadError(null)} className="ml-2 text-xs underline">Dismiss</button>
                  </AlertDescription>
                </Alert>
              )}

              {!policy?.isDocumentReady ? (
                <div className="text-center py-8">
                  <Clock className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium text-gray-700">Documents being generated</p>
                  <p className="text-sm text-gray-500 mt-1">Please check back shortly.</p>
                </div>
              ) : documents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No documents available.</p>
              ) : (
                <>
                  {documents.length > 1 && (
                    <div className="flex justify-end mb-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadAll}
                        disabled={downloadingAll || !!downloadingDocId}
                        className="gap-1.5"
                      >
                        {downloadingAll
                          ? <><Loader2 className="h-4 w-4 animate-spin" /> Preparing ZIP…</>
                          : <><Archive className="h-4 w-4" /> Download All (ZIP)</>}
                      </Button>
                    </div>
                  )}
                  <div className="space-y-2">
                    {documents.map((doc) => {
                      const isDownloading = downloadingDocId === doc.documentId
                      return (
                        <div key={doc.documentId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{doc.fileName}</p>
                              <p className="text-sm text-gray-500">
                                {doc.fileType.toUpperCase()} · Uploaded {safeFormatDate(doc.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDoc(doc.documentId, doc.fileType, doc.fileName)}
                            disabled={isDownloading || downloadingAll}
                            title={`Download ${doc.fileName}`}
                          >
                            {isDownloading
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <Download className="h-4 w-4" />}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
