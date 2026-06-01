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
  CreditCard,
  Shield,
  Edit,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Archive,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { fetchSalesRecordDetail, sendSalesEmail, type SalesRecordDetail } from "@/lib/api/sales"
import { formatAmount } from "@/lib/currency"
import { downloadSingleFile, downloadPolicyDocuments, DocumentDownloadError } from "@/lib/api/document"

interface SalesReportDetailProps {
  reportId: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusColor(status: string) {
  switch (status) {
    case "Active":    return "bg-green-100 text-green-800"
    case "Pending":   return "bg-yellow-100 text-yellow-800"
    case "Cancelled": return "bg-red-100 text-red-800"
    case "Expired":   return "bg-gray-100 text-gray-800"
    default:          return "bg-gray-100 text-gray-800"
  }
}

function getPaymentStatusColor(status: string) {
  switch (status) {
    case "Paid":    return "bg-green-100 text-green-800"
    case "Pending": return "bg-yellow-100 text-yellow-800"
    case "Failed":  return "bg-red-100 text-red-800"
    default:        return "bg-gray-100 text-gray-800"
  }
}

function safeFormatDate(dateStr: string | undefined | null, fmt = "MMM dd, yyyy"): string {
  if (!dateStr) return "—"
  try { return format(new Date(dateStr), fmt) } catch { return dateStr }
}

function safeFormatDateTime(isoStr: string): { date: string; time: string } {
  try {
    const d = new Date(isoStr)
    return {
      date: format(d, "MMM dd"),
      time: format(d, "hh:mm a"),
    }
  } catch {
    return { date: isoStr, time: "" }
  }
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="p-6 space-y-4">
        {[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-6 w-full" />)}
      </CardContent></Card>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SalesReportDetail({ reportId }: SalesReportDetailProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [data,    setData]    = useState<SalesRecordDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  // Download state
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null)
  const [downloadingAll,   setDownloadingAll]   = useState(false)
  const [downloadError,    setDownloadError]    = useState<string | null>(null)

  // Email state
  const [emailOpen,    setEmailOpen]    = useState(false)
  const [emailTo,      setEmailTo]      = useState("")
  const [emailSending, setEmailSending] = useState(false)
  const [emailError,   setEmailError]   = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setNotFound(false)

    fetchSalesRecordDetail(reportId)
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err: Error) => {
        if (cancelled) return
        if (err.message === "not_found") {
          setNotFound(true)
        } else {
          setError("Failed to load sales record. Please try again.")
          console.error("[SalesReportDetail] fetch error", err)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [reportId])

  // ── Download handlers ──────────────────────────────────────────────────────

  const handleDownloadDoc = async (docId: string, fileType: string, fileName: string) => {
    if (!data) return
    setDownloadingDocId(docId)
    setDownloadError(null)
    try {
      await downloadSingleFile(data.id, fileType, fileName)
    } catch (err) {
      const msg = err instanceof DocumentDownloadError
        ? err.message
        : "Download failed. Please try again."
      setDownloadError(msg)
    } finally {
      setDownloadingDocId(null)
    }
  }

  const handleDownloadAll = async () => {
    if (!data) return
    setDownloadingAll(true)
    setDownloadError(null)
    try {
      await downloadPolicyDocuments(data.id, data.policyNumber)
    } catch (err) {
      const msg = err instanceof DocumentDownloadError
        ? err.message
        : "Download failed. Please try again."
      setDownloadError(msg)
    } finally {
      setDownloadingAll(false)
    }
  }

  // ── Email handlers ────────────────────────────────────────────────────────

  const openEmailDialog = () => {
    if (!data) return
    setEmailTo(data.customerInfo.email)
    setEmailError(null)
    setEmailSuccess(false)
    setEmailOpen(true)
  }

  const handleSendEmail = async () => {
    if (!data || !emailTo.trim()) return
    setEmailSending(true)
    setEmailError(null)
    try {
      await sendSalesEmail(data.id, emailTo.trim())
      setEmailSuccess(true)
      setTimeout(() => setEmailOpen(false), 1500)
    } catch {
      setEmailError("Failed to send email. Please try again.")
    } finally {
      setEmailSending(false)
    }
  }

  if (loading) return <LoadingSkeleton />

  if (notFound) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sales Report Not Found</h3>
        <p className="text-gray-600 mb-4">No record exists for ID: {reportId}</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sales Reports
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error ?? "An unexpected error occurred."}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const policyStatus = data.policyDetails.status

  return (
    <>
    {/* ── Email Dialog ─────────────────────────────────────────────────────── */}
    <Dialog open={emailOpen} onOpenChange={(open) => { if (!emailSending) setEmailOpen(open) }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Send Email to Customer
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {emailSuccess ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="font-medium text-gray-800">Email sent successfully!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {emailError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{emailError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email-to">Recipient Email</Label>
                <Input
                  id="email-to"
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="recipient@example.com"
                  disabled={emailSending}
                  autoFocus
                />
                <p className="text-xs text-gray-400">
                  The policy documents and details will be sent to this address.
                </p>
              </div>
            </div>
          )}
        </div>

        {!emailSuccess && (
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setEmailOpen(false)}
              disabled={emailSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={emailSending || !emailTo.trim()}
              className="bg-[#0056b3] hover:bg-[#004494] gap-2"
            >
              {emailSending
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                : <><Mail className="h-4 w-4" /> Send Email</>}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>

    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales Reports
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Sales Report Detail</h1>
            <p className="text-gray-600">Policy: {data.policyNumber}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={openEmailDialog}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline" disabled title="Report download coming soon">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button disabled title="Edit functionality coming soon">
            <Edit className="h-4 w-4 mr-2" />
            Edit Policy
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      <Alert className={policyStatus === "Active" ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Policy Status: {policyStatus}</strong>
          {policyStatus === "Active" && " — This policy is currently active and providing coverage to the customer."}
          {policyStatus === "Expired" && " — This policy has expired and is no longer providing coverage."}
          {policyStatus === "Cancelled" && " — This policy has been cancelled."}
          {policyStatus === "Pending" && " — This policy is pending activation."}
        </AlertDescription>
      </Alert>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Premium</p>
                <p className="text-xl font-bold">{formatAmount(data.financialInfo.premium, data.salesInfo.region)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Commission</p>
                <p className="text-xl font-bold">{formatAmount(data.financialInfo.commission, data.salesInfo.region)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Sale Date</p>
                <p className="text-lg font-bold">{safeFormatDate(data.salesInfo.saleDate)}</p>
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
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="policy">Policy Details</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{data.customerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{data.customerInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{data.customerInfo.phone || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Region:</span>
                  <span className="font-medium">{data.salesInfo.region}</span>
                </div>
              </CardContent>
            </Card>

            {/* Sales Agent */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sales Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Agent:</span>
                  <span className="font-medium">{data.salesInfo.agentName || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Agent ID:</span>
                  <span className="font-medium">{data.salesInfo.agentId || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{data.salesInfo.agentEmail || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Branch:</span>
                  <span className="font-medium">{data.salesInfo.branch || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Channel:</span>
                  <span className="font-medium">{data.salesInfo.channel || "—"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Policy Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Policy Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Coverage Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span>{data.policyDetails.coverageType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Building:</span>
                      <span>{formatAmount(data.policyDetails.buildingAmount, data.salesInfo.region)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contents:</span>
                      <span>{formatAmount(data.policyDetails.contentAmount, data.salesInfo.region)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Policy Period</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effective:</span>
                      <span>{safeFormatDate(data.policyDetails.effectiveDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span>{safeFormatDate(data.policyDetails.expiryDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Renewal:</span>
                      <span>{safeFormatDate(data.policyDetails.renewalDate)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Financial Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premium:</span>
                      <span>{formatAmount(data.financialInfo.premium, data.salesInfo.region)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission:</span>
                      <span className="text-green-600">{formatAmount(data.financialInfo.commission, data.salesInfo.region)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold">{formatAmount(data.financialInfo.totalAmount, data.salesInfo.region)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Customer ── */}
        <TabsContent value="customer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Personal Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full Name:</span>
                      <span className="font-medium">{data.customerInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span>{safeFormatDate(data.customerInfo.dateOfBirth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Type:</span>
                      <span>{data.customerInfo.idType || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Number:</span>
                      <span>{data.customerInfo.idNumber || "—"}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{data.customerInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{data.customerInfo.phone || "—"}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <span className="text-sm">{data.customerInfo.address || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Policy Details ── */}
        <TabsContent value="policy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Policy Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Coverage Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product Type:</span>
                      <span className="font-medium">{data.policyDetails.productType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coverage Type:</span>
                      <span className="font-medium">{data.policyDetails.coverageType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Building Amount:</span>
                      <span className="font-medium">{formatAmount(data.policyDetails.buildingAmount, data.salesInfo.region)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Content Amount:</span>
                      <span className="font-medium">{formatAmount(data.policyDetails.contentAmount, data.salesInfo.region)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(policyStatus)}>{policyStatus}</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Policy Period</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effective Date:</span>
                      <span>{safeFormatDate(data.policyDetails.effectiveDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry Date:</span>
                      <span>{safeFormatDate(data.policyDetails.expiryDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Renewal Date:</span>
                      <span>{safeFormatDate(data.policyDetails.renewalDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Documents */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Documents</h4>
                  {data.documents.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadAll}
                      disabled={downloadingAll || !!downloadingDocId}
                      className="gap-1.5"
                    >
                      {downloadingAll
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Archive className="h-4 w-4" />}
                      {downloadingAll ? "Preparing ZIP…" : "Download All (ZIP)"}
                    </Button>
                  )}
                </div>

                {downloadError && (
                  <Alert variant="destructive" className="mb-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      {downloadError}
                      <button onClick={() => setDownloadError(null)} className="ml-2 text-xs underline">Dismiss</button>
                    </AlertDescription>
                  </Alert>
                )}

                {data.documents.length === 0 ? (
                  <p className="text-sm text-gray-500">No documents available.</p>
                ) : (
                  <div className="space-y-2">
                    {data.documents.map((doc) => {
                      const isDownloading = downloadingDocId === doc.id
                      return (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-600">
                                {doc.fileType} · {doc.fileName} · Uploaded {safeFormatDate(doc.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDoc(doc.id, doc.fileType, doc.fileName)}
                            disabled={isDownloading || downloadingAll}
                            title={`Download ${doc.name}`}
                          >
                            {isDownloading
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <Download className="h-4 w-4" />}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Financial ── */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Premium Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Premium:</span>
                      <span>{formatAmount(data.financialInfo.premium, data.salesInfo.region)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes:</span>
                      <span>{formatAmount(data.financialInfo.taxes, data.salesInfo.region)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fees:</span>
                      <span>{formatAmount(data.financialInfo.fees, data.salesInfo.region)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span>{formatAmount(data.financialInfo.totalAmount, data.salesInfo.region)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Commission Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission Rate:</span>
                      <span>{data.financialInfo.commissionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission Amount:</span>
                      <span className="text-green-600 font-semibold">{formatAmount(data.financialInfo.commission, data.salesInfo.region)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agent:</span>
                      <span>{data.salesInfo.agentName || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        {data.financialInfo.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <Badge className={getPaymentStatusColor(data.financialInfo.paymentStatus)}>
                        {data.financialInfo.paymentStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date:</span>
                      <span>{safeFormatDate(data.financialInfo.paymentDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-sm">{data.financialInfo.transactionId || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Timeline ── */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Sales Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.timeline.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No timeline events available.</p>
              ) : (
                <div className="space-y-4">
                  {data.timeline.map((event, index) => {
                    const { date, time } = safeFormatDateTime(event.date)
                    const isCompleted = event.status === "completed"
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? "bg-blue-100" : "bg-gray-100"}`}>
                            {isCompleted
                              ? <CheckCircle2 className="h-4 w-4 text-blue-600" />
                              : <Clock className="h-4 w-4 text-gray-400" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{event.event}</p>
                            <div className="text-sm text-gray-500">
                              {date}{time ? ` at ${time}` : ""}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </>
  )
}
