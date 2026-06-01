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
      <SidebarProvider className="h-screen overflow-hidden">
        <DashboardSidebar />

        {/*
          SpotlightBackground wraps SidebarInset so the spotlight covers the
          full content area. It uses useRef + rAF — zero React re-renders on
          mouse move, so the rest of the page is never affected.
        */}
        <SpotlightBackground
          className="flex flex-col h-full min-h-0 overflow-hidden flex-1 bg-[#F1F5F9]"
          size={420}
          intensity={0.13}
        >
          {/* Dot-grid texture — dark dots on light bg */}
          <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 z-0" />

          <SidebarInset className="flex flex-col h-full min-h-0 overflow-hidden bg-transparent">
            {children}
          </SidebarInset>
        </SpotlightBackground>

      </SidebarProvider>
    </SessionGuard>
  )
}
