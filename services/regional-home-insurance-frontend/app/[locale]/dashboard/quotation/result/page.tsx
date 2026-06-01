import type { Metadata } from "next"
import QuotationResult from "@/components/quotation/quotation-result"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Quotation Result | Etiqa Home Insurance",
  description: "Your home insurance quotation result",
}

export default function QuotationResultPage() {
  return (
    <>
      <PageHeader>
        <Link
          href="/dashboard/quotation"
          className="flex items-center gap-1.5 text-sm text-[#0066CC] hover:text-[#004EA8] hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotation
        </Link>
      </PageHeader>

      <div className="flex-1 overflow-y-auto bg-transparent">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <QuotationResult />
        </div>
      </div>
    </>
  )
}
