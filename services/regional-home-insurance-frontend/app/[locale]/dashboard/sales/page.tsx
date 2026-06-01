import type { Metadata } from "next"
import AdminGuard from "@/components/admin-guard"
import SalesReports from "@/components/sales/sales-reports"

export const metadata: Metadata = {
  title: "Sales Reports | Etiqa Home Insurance",
  description: "View and analyze insurance sales data and reports",
}

export default function SalesPage() {
  return (
    <AdminGuard>
      <div className="p-6">
        <SalesReports />
      </div>
    </AdminGuard>
  )
}
