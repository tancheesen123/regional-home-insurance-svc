import type { Metadata } from "next"
import FillDetailsForm from "@/components/quotation/fill-details-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Fill Up Details | Etiqa Home Insurance",
  description: "Complete your personal and property information",
}

export default function FillDetailsPage() {
  return (
    <>
      <PageHeader>
        <Link
          href="/dashboard/quotation/declare-valuables"
          className="flex items-center gap-1.5 text-sm text-[#0066CC] hover:text-[#004EA8] hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Declare Valuables
        </Link>
      </PageHeader>

      <div className="flex-1 overflow-y-auto bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <FillDetailsForm />
        </div>
      </div>
    </>
  )
}
