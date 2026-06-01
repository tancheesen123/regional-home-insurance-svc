import type { Metadata } from "next"
import QuotationJourney from "@/components/quotation/quotation-journey"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "New Policy Quotation | Etiqa Home Insurance",
  description: "Get a quote for your home insurance policy",
}

export default function QuotationPage() {
  return (
    <>
      <PageHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-[#0066CC] hover:text-[#004EA8] hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </PageHeader>

      <div className="flex-1 overflow-y-auto bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <QuotationJourney />
        </div>
      </div>
    </>
  )
}
