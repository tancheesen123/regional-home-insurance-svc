import type { Metadata } from "next"
import QuotationForm from "@/components/quotation/quotation-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "New Policy Quotation | Etiqa Home Insurance",
  description: "Get a quote for your home insurance policy",
}

export default function QuotationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">New Policy Quotation</h1>
              <p className="text-muted-foreground">Fill in the details to get your home insurance quote</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <QuotationForm />
      </div>
    </div>
  )
}
