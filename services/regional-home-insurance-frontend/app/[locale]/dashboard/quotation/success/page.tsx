import type { Metadata } from "next"
import PaymentSuccess from "@/components/quotation/payment-success"

export const metadata: Metadata = {
  title: "Payment Successful | Etiqa Home Insurance",
  description: "Your policy has been successfully purchased",
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PaymentSuccess />
      </div>
    </div>
  )
}
