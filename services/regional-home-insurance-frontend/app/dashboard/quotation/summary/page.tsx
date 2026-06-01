import type { Metadata } from "next"
import SummaryPayment from "@/components/quotation/summary-payment"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Summary & Payment | Etiqa Home Insurance",
  description: "Review your policy details and complete your purchase",
}

export default function SummaryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/quotation/fill-details">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Fill Details
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Summary & Payment</h1>
              <p className="text-muted-foreground">Step 4 of 4 - Review and complete your purchase</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <SummaryPayment />
      </div>
    </div>
  )
}
