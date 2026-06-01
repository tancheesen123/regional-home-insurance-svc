import type React from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import SessionGuard from "@/components/session-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionGuard>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex h-[calc(100vh-64px)]">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SessionGuard>
  )
}
