import type { Metadata } from "next"
import PlanCustomization from "@/components/quotation/plan-customization"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Customize Your Protection | Etiqa Home Insurance",
  description: "Customize your home insurance coverage and add-ons",
}

export default function CustomizePage() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader>
        <Link
          href="/dashboard/quotation"
          className="flex items-center gap-1.5 text-sm text-[#0066CC] hover:text-[#004EA8] hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotation
        </Link>
      </PageHeader>

      <div className="flex-1 overflow-y-auto bg-transparent min-h-0">
        <div className="pt-8">
          <PlanCustomization />
        </div>
      </div>
    </div>
  )
}
