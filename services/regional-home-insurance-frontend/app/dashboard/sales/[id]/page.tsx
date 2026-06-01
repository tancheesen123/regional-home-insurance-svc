import type { Metadata } from "next"
import SalesReportDetail from "@/components/sales/sales-report-detail"

export const metadata: Metadata = {
  title: "Sales Report Detail | Etiqa Home Insurance",
  description: "Detailed view of individual sales report",
}

interface SalesReportDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function SalesReportDetailPage({ params }: SalesReportDetailPageProps) {
  const { id } = await params
  return (
    <div className="p-6">
      <SalesReportDetail reportId={id} />
    </div>
  )
}
