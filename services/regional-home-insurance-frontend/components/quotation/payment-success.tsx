"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Download, Eye, Home, Mail, Phone, Calendar, FileText, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PaymentSuccess() {
  const router = useRouter()
  const [isDownloading, setIsDownloading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleDownloadPolicy = async () => {
    setIsDownloading(true)
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false)
      // In a real app, this would trigger a file download
      console.log("Policy document downloaded")
    }, 2000)
  }

  const handleViewDashboard = () => {
    router.push("/dashboard")
  }

  const handleViewPolicies = () => {
    router.push("/dashboard/policies")
  }

  const policyDetails = {
    policyNumber: "HI-2025-001239",
    effectiveDate: "21 Jun 2025",
    expiryDate: "20 Jun 2026",
    premium: 1333.76,
    paymentMethod: "FPX Online Banking",
    transactionId: "TXN-2025-062100234",
    coverageType: "Building + Contents",
    buildingAmount: 500000,
    contentAmount: 60000,
  }

  const customerDetails = {
    name: "Adam Bin Bakri",
    email: "adam@gmail.com",
    phone: "+60123456789",
    propertyAddress: "123 Jalan Bangsar, Bangsar Baru, Kuala Lumpur, 59100 Selangor",
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent">
            {/* Simple confetti effect with CSS animations */}
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
            <div
              className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-0 right-1/4 w-2 h-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-0 left-1/3 w-2 h-2 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div
              className="absolute top-0 right-1/3 w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
        </div>
      )}

      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-lg text-gray-600 mb-4">
          Congratulations! Your home insurance policy has been successfully purchased.
        </p>
        <Badge variant="default" className="bg-green-600 text-white px-4 py-2">
          Policy Active from {policyDetails.effectiveDate}
        </Badge>
      </div>

      {/* Important Notice */}
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Mail className="h-4 w-4" />
        <AlertDescription>
          <strong>Policy documents have been sent to your email.</strong> Please check your inbox and spam folder for
          your policy certificate and important documents.
        </AlertDescription>
      </Alert>

      {/* Policy Summary Card */}
      <Card className="mb-6 border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <FileText className="h-5 w-5" />
            Policy Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Policy Number:</span>
                <span className="font-medium">{policyDetails.policyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Coverage Type:</span>
                <span className="font-medium">{policyDetails.coverageType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Policy Period:</span>
                <span className="font-medium">
                  {policyDetails.effectiveDate} to {policyDetails.expiryDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Premium:</span>
                <span className="font-medium">RM {policyDetails.premium.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Building Coverage:</span>
                <span className="font-medium">RM {policyDetails.buildingAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contents Coverage:</span>
                <span className="font-medium">RM {policyDetails.contentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{policyDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium text-sm">{policyDetails.transactionId}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Policyholder Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{customerDetails.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{customerDetails.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{customerDetails.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Property Address</p>
              <p className="font-medium text-sm">{customerDetails.propertyAddress}</p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium">Save Your Documents</p>
                <p className="text-sm text-gray-600">Download and keep your policy certificate safe</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium">Mark Your Calendar</p>
                <p className="text-sm text-gray-600">Policy renewal date: {policyDetails.expiryDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium">Stay Connected</p>
                <p className="text-sm text-gray-600">Get the Etiqa mobile app for easy policy management</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Button
          onClick={handleDownloadPolicy}
          disabled={isDownloading}
          className="bg-[#0056b3] hover:bg-[#004494] text-white"
        >
          {isDownloading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Downloading...</span>
            </div>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Policy
            </>
          )}
        </Button>

        <Button variant="outline" onClick={handleViewPolicies}>
          <Eye className="h-4 w-4 mr-2" />
          View All Policies
        </Button>

        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share Policy
        </Button>

        <Button variant="outline">
          <Phone className="h-4 w-4 mr-2" />
          Contact Support
        </Button>
      </div>

      {/* Support Information */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold mb-1">Customer Service</h4>
              <p className="text-sm text-gray-600">1-300-13-8420</p>
              <p className="text-xs text-gray-500">Available 24/7</p>
            </div>
            <div className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold mb-1">Email Support</h4>
              <p className="text-sm text-gray-600">support@etiqa.com</p>
              <p className="text-xs text-gray-500">Response within 24 hours</p>
            </div>
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold mb-1">Claims Hotline</h4>
              <p className="text-sm text-gray-600">1-800-22-3372</p>
              <p className="text-xs text-gray-500">For emergency claims</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final CTA */}
      <div className="text-center mt-8">
        <Button onClick={handleViewDashboard} size="lg" className="bg-[#0056b3] hover:bg-[#004494] text-white">
          <Home className="h-5 w-5 mr-2" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}
