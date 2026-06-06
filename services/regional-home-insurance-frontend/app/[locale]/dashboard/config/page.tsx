import type { Metadata } from "next"
import AdminGuard from "@/components/admin-guard"
import ModifyConfigPage from "@/components/config/modify-config-page"
import PageHeader from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Modify Config | Etiqa Home Insurance",
  description: "Manage building rates, region settings, location tiers, and risk multipliers",
}

export default function ConfigPage() {
  return (
    <AdminGuard>
      <div className="flex h-full min-h-0 flex-col">
        <PageHeader />
        <div className="flex-1 overflow-y-auto min-h-0 bg-transparent">
          <div className="p-6">
            <ModifyConfigPage />
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
