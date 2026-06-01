import type { Metadata } from "next"
import DashboardOverview from "@/components/dashboard/dashboard-overview"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Dashboard | Etiqa Home Insurance",
  description: "Manage your home insurance policies across Southeast Asia",
}

export default function DashboardPage() {
  return (
    <>
      <PageHeader />
      <div className="flex-1 overflow-y-auto p-6">
        <DashboardOverview />
      </div>
    </>
  )
}
