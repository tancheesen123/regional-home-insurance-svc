import type { Metadata } from "next"
import PaymentFailed from "@/components/quotation/payment-failed"

export const metadata: Metadata = {
  title: "Payment Failed | Etiqa Home Insurance",
  description: "Your policy payment could not be completed",
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PaymentFailed />
      </div>
    </div>
  )
}
