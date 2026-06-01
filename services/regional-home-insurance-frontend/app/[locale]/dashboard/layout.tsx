import type React from "react"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import SessionGuard from "@/components/session-guard"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionGuard>
      <SidebarProvider className="h-screen overflow-hidden">
        <DashboardSidebar />
        <SidebarInset className="flex flex-col h-full min-h-0 overflow-hidden bg-gray-50">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SessionGuard>
  )
}
