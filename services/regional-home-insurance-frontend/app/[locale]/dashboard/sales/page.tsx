import type { Metadata } from "next"
import AdminGuard from "@/components/admin-guard"
import SalesReports from "@/components/sales/sales-reports"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Sales Reports | Etiqa Home Insurance",
  description: "View and analyze insurance sales data and reports",
}

export default function SalesPage() {
  return (
    <AdminGuard>
      <div className="flex h-full min-h-0 flex-col">
        <PageHeader />
        <div className="flex-1 overflow-y-auto min-h-0 bg-transparent">
          <div className="p-6">
            <SalesReports />
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
