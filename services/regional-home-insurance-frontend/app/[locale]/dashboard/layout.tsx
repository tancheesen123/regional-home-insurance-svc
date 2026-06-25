import type React from "react"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import SessionGuard from "@/components/session-guard"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import SpotlightBackground from "@/components/ui/spotlight-background"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionGuard>
      <SidebarProvider
        className="h-screen overflow-hidden"
        style={{ "--sidebar-width": "13rem" } as React.CSSProperties}
      >
        <DashboardSidebar />

        {}
        <SpotlightBackground
          className="flex flex-col h-full min-h-0 overflow-hidden flex-1 bg-[#F1F5F9]"
          size={420}
          intensity={0.13}
        >
          {}
          <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 z-0" />

          <SidebarInset className="flex flex-col h-full min-h-0 bg-transparent">
            <div className="flex-1 overflow-y-auto min-h-0">
              {children}
            </div>
          </SidebarInset>
        </SpotlightBackground>

      </SidebarProvider>
    </SessionGuard>
  )
}
