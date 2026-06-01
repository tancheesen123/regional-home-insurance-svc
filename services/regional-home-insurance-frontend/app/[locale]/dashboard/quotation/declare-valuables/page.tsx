import type { Metadata } from "next"
import DeclareValuables from "@/components/quotation/declare-valuables"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Declare Valuables | Etiqa Home Insurance",
  description: "Declare your valuable items for comprehensive insurance coverage",
}

export default function DeclareValuablesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/quotation/customize">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Customize
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Declare Valuables</h1>
              <p className="text-muted-foreground">Step 2 of 4 - Declare your valuable items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <DeclareValuables />
      </div>
    </div>
  )
}
