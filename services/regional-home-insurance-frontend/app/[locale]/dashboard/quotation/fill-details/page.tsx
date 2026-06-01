import type { Metadata } from "next"
import FillDetailsForm from "@/components/quotation/fill-details-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Fill Up Details | Etiqa Home Insurance",
  description: "Complete your personal and property information",
}

export default function FillDetailsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/quotation/declare-valuables">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Declare Valuables
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Fill Up Details</h1>
              <p className="text-muted-foreground">Step 3 of 4 - Complete your information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <FillDetailsForm />
      </div>
    </div>
  )
}
