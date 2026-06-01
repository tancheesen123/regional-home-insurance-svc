import type { Metadata } from "next"
import PlanCustomization from "@/components/quotation/plan-customization"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Customize Your Protection | Etiqa Home Insurance",
  description: "Customize your home insurance coverage and add-ons",
}

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/quotation">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quotation
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Customize Your Protection</h1>
              <p className="text-muted-foreground">Choose your coverage options and add-ons</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <PlanCustomization />
      </div>
    </div>
  )
}
