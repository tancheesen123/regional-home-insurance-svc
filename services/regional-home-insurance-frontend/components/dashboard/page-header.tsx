"use client"

import { Bell, HelpCircle } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import LanguageSwitcher from "@/components/language-switcher"

interface PageHeaderProps {
  /** Optional extra content to show on the right (e.g. breadcrumb / page title) */
  children?: React.ReactNode
}

/**
 * Slim top bar that lives at the top of each page's content area.
 * Contains the SidebarTrigger and global utility icons.
 */
export default function PageHeader({ children }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between h-12 px-4 border-b border-[#E0E0E0] bg-white shrink-0">
      {/* Left — collapse/expand trigger + optional page content */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-[#555555] hover:text-[#1A1A1A] hover:bg-[#FAFAFA]" />
        {children && (
          <span className="text-sm text-[#555555]">{children}</span>
        )}
      </div>

      {/* Right — utility icons */}
      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <button
          className="p-2 rounded-lg text-[#9E9E9E] hover:text-[#555555] hover:bg-[#FAFAFA] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          className="p-2 rounded-lg text-[#9E9E9E] hover:text-[#555555] hover:bg-[#FAFAFA] transition-colors"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
