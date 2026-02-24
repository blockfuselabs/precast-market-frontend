import type React from "react"

import Header from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BottomNav } from "@/components/layout/bottom-nav"
import { SidebarNav } from "@/components/layout/sidebar-nav"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[72px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]">
        <SidebarNav />
        
        <main className="flex min-h-0 flex-col overflow-y-auto pb-24 md:pb-0">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
