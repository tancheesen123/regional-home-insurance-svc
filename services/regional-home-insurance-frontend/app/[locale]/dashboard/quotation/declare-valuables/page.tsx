import type { Metadata } from "next"
import DeclareValuables from "@/components/quotation/declare-valuables"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Declare Valuables | Etiqa Home Insurance",
  description: "Declare your valuable items for comprehensive insurance coverage",
}

export default function DeclareValuablesPage() {
  return (
    <>
      <PageHeader>
        <Link
          href="/dashboard/quotation/customize"
          className="flex items-center gap-1.5 text-sm text-[#0066CC] hover:text-[#004EA8] hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Customize
        </Link>
      </PageHeader>

      <div className="flex-1 overflow-y-auto bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <DeclareValuables />
        </div>
      </div>
    </>
  )
}
