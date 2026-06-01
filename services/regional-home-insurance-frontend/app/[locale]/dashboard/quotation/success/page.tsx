import type { Metadata } from "next"
import PaymentSuccess from "@/components/quotation/payment-success"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Payment Successful | Etiqa Home Insurance",
  description: "Your policy has been successfully purchased",
}

export default function PaymentSuccessPage() {
  return (
    <>
      <PageHeader />

      <div className="flex-1 overflow-y-auto bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <PaymentSuccess />
        </div>
      </div>
    </>
  )
}
