"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"

interface SalesReportDetailProps {
  reportId: string
}

// Mock detailed sales data
const mockDetailedSalesData = {
  "SR-2025-001": {
    id: "SR-2025-001",
    policyNumber: "HI-2025-001234",
    customerInfo: {
      name: "Maria Santos",
      email: "maria.santos@email.com",
      phone: "+63 912 345 6789",
      address: "123 Rizal Street, Makati City, Metro Manila, Philippines",
      dateOfBirth: "1985-03-15",
      idNumber: "123456789012",
      idType: "National ID",
    },
    policyDetails: {
      productType: "Home Insurance",
      coverageType: "Building + Contents",
      buildingAmount: 500000,
      contentAmount: 60000,
      effectiveDate: "2025-01-21",
      expiryDate: "2026-01-21",
      renewalDate: "2026-01-21",
      status: "Active",
    },
    financialInfo: {
      premium: 1333.76,
      commission: 133.38,
      commissionRate: 10,
      taxes: 80.03,
      fees: 25.0,
      totalAmount: 1438.79,
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
      paymentDate: "2025-01-15",
      transactionId: "TXN-2025-001234",
    },
    salesInfo: {
      saleDate: "2025-01-15",
      agentName: "Juan Dela Cruz",
      agentId: "AGT-001",
      agentEmail: "juan.delacruz@etiqa.com",
      agentPhone: "+63 917 123 4567",
      region: "Philippines",
      branch: "Makati Branch",
      channel: "Online",
    },
    documents: [
      {
        id: "DOC-001",
        name: "Policy Certificate",
        type: "PDF",
        size: "245 KB",
        uploadDate: "2025-01-21",
      },
      {
        id: "DOC-002",
        name: "Payment Receipt",
        type: "PDF",
        size: "128 KB",
        uploadDate: "2025-01-15",
      },
      {
        id: "DOC-003",
        name: "Application Form",
        type: "PDF",
        size: "356 KB",
        uploadDate: "2025-01-15",
      },
    ],
    timeline: [
      {
        date: "2025-01-15",
        time: "10:30 AM",
        event: "Application Submitted",
        description: "Customer submitted online application",
        status: "completed",
      },
      {
        date: "2025-01-15",
        time: "11:45 AM",
        event: "Payment Processed",
        description: "Payment of $1,438.79 processed successfully",
        status: "completed",
      },
      {
        date: "2025-01-15",
        time: "02:15 PM",
        event: "Underwriting Review",
        description: "Application reviewed and approved",
        status: "completed",
      },
      {
        date: "2025-01-21",
        time: "09:00 AM",
        event: "Policy Issued",
        description: "Policy certificate generated and sent to customer",
        status: "completed",
      },
    ],
  },
}

export default function SalesReportDetail({ reportId }: SalesReportDetailProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Get the detailed data for this report
  const reportData = mockDetailedSalesData[reportId as keyof typeof mockDetailedSalesData]

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sales Report Not Found</h3>
        <p className="text-gray-600 mb-4">The requested sales report could not be found.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  const handleDownloadReport = () => {
    // Implement PDF generation and download
    console.log("Downloading report for:", reportId)
  }

  const handleSendEmail = () => {
    // Implement email functionality
    console.log("Sending email for report:", reportId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      case "Expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
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
            <p className="text-gray-600">Policy: {reportData.policyNumber}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Policy
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      <Alert className="border-green-200 bg-green-50">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Policy Status: Active</strong> - This policy is currently active and providing coverage to the
          customer.
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
                <p className="text-xl font-bold">${reportData.financialInfo.premium.toLocaleString()}</p>
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
                <p className="text-xl font-bold">${reportData.financialInfo.commission.toLocaleString()}</p>
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
                <p className="text-lg font-bold">{format(new Date(reportData.salesInfo.saleDate), "MMM dd, yyyy")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(reportData.policyDetails.status)}>
                {reportData.policyDetails.status}
              </Badge>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-bold">{reportData.policyDetails.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="policy">Policy Details</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

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
                  <span className="font-medium">{reportData.customerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{reportData.customerInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{reportData.customerInfo.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Region:</span>
                  <span className="font-medium">{reportData.salesInfo.region}</span>
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
                  <span className="font-medium">{reportData.salesInfo.agentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Agent ID:</span>
                  <span className="font-medium">{reportData.salesInfo.agentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{reportData.salesInfo.agentEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Branch:</span>
                  <span className="font-medium">{reportData.salesInfo.branch}</span>
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
                      <span>{reportData.policyDetails.coverageType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Building:</span>
                      <span>${reportData.policyDetails.buildingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contents:</span>
                      <span>${reportData.policyDetails.contentAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Policy Period</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effective:</span>
                      <span>{format(new Date(reportData.policyDetails.effectiveDate), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span>{format(new Date(reportData.policyDetails.expiryDate), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Renewal:</span>
                      <span>{format(new Date(reportData.policyDetails.renewalDate), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Financial Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Premium:</span>
                      <span>${reportData.financialInfo.premium.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission:</span>
                      <span className="text-green-600">${reportData.financialInfo.commission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold">${reportData.financialInfo.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                      <span className="font-medium">{reportData.customerInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span>{format(new Date(reportData.customerInfo.dateOfBirth), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Type:</span>
                      <span>{reportData.customerInfo.idType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Number:</span>
                      <span>{reportData.customerInfo.idNumber}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{reportData.customerInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{reportData.customerInfo.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <span className="text-sm">{reportData.customerInfo.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                      <span className="font-medium">{reportData.policyDetails.productType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coverage Type:</span>
                      <span className="font-medium">{reportData.policyDetails.coverageType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Building Amount:</span>
                      <span className="font-medium">${reportData.policyDetails.buildingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Content Amount:</span>
                      <span className="font-medium">${reportData.policyDetails.contentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(reportData.policyDetails.status)}>
                        {reportData.policyDetails.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Policy Period</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effective Date:</span>
                      <span>{format(new Date(reportData.policyDetails.effectiveDate), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry Date:</span>
                      <span>{format(new Date(reportData.policyDetails.expiryDate), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Renewal Date:</span>
                      <span>{format(new Date(reportData.policyDetails.renewalDate), "MMM dd, yyyy")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Documents</h4>
                <div className="space-y-2">
                  {reportData.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-600">
                            {doc.type} • {doc.size} • Uploaded {format(new Date(doc.uploadDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                      <span>${reportData.financialInfo.premium.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes:</span>
                      <span>${reportData.financialInfo.taxes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fees:</span>
                      <span>${reportData.financialInfo.fees.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span>${reportData.financialInfo.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Commission Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission Rate:</span>
                      <span>{reportData.financialInfo.commissionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission Amount:</span>
                      <span className="text-green-600 font-semibold">
                        ${reportData.financialInfo.commission.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agent:</span>
                      <span>{reportData.salesInfo.agentName}</span>
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
                        {reportData.financialInfo.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <Badge className="bg-green-100 text-green-800">{reportData.financialInfo.paymentStatus}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date:</span>
                      <span>{format(new Date(reportData.financialInfo.paymentDate), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-sm">{reportData.financialInfo.transactionId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Sales Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{event.event}</p>
                        <div className="text-sm text-gray-500">
                          {format(new Date(event.date), "MMM dd")} at {event.time}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
