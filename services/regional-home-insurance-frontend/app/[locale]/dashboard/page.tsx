import type { Metadata } from "next"
import DashboardOverview from "@/components/dashboard/dashboard-overview"

export const metadata: Metadata = {
  title: "Dashboard | Etiqa Home Insurance",
  description: "Manage your home insurance policies across Southeast Asia",
}

export default function DashboardPage() {
  return (
    <div className="p-6">
      <DashboardOverview />
    </div>
  )
}
