import type { Metadata } from "next"
import SalesReportDetail from "@/components/sales/sales-report-detail"

export const metadata: Metadata = {
  title: "Sales Report Detail | Etiqa Home Insurance",
  description: "Detailed view of individual sales report",
}

interface SalesReportDetailPageProps {
  params: {
    id: string
  }
}

export default function SalesReportDetailPage({ params }: SalesReportDetailPageProps) {
  return (
    <div className="p-6">
      <SalesReportDetail reportId={params.id} />
    </div>
  )
}
