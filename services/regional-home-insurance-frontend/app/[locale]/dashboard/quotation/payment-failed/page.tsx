import type { Metadata } from "next"
import PaymentFailed from "@/components/quotation/payment-failed"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Payment Failed | Etiqa Home Insurance",
  description: "Your policy payment could not be completed",
}

export default function PaymentFailedPage() {
  return (
    <>
      <PageHeader />

      <div className="flex-1 overflow-y-auto bg-transparent">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <PaymentFailed />
        </div>
      </div>
    </>
  )
}
