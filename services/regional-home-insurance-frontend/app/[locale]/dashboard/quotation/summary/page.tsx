import type { Metadata } from "next"
import SummaryPayment from "@/components/quotation/summary-payment"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Summary & Payment | Etiqa Home Insurance",
  description: "Review your policy details and complete your purchase",
}

export default function SummaryPage() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader>
        <Link
          href="/dashboard/quotation/fill-details"
          className="flex items-center gap-1.5 text-sm text-[#0066CC] hover:text-[#004EA8] hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Fill Details
        </Link>
      </PageHeader>

      <div className="flex-1 overflow-y-auto bg-transparent min-h-0">
        <div className="pt-8">
          <SummaryPayment />
        </div>
      </div>
    </div>
  )
}
