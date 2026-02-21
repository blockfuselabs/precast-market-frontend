"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

export type TradeTab = "YES" | "NO"
export type SortBy = "trending" | "newest" | "volume" | "closing-soon"

type UIStoreValue = {
  activeTab: TradeTab
  selectedCategory: string
  sortBy: SortBy
  sidebarCollapsed: boolean
  setActiveTab: (tab: TradeTab) => void
  setSelectedCategory: (category: string) => void
  setSortBy: (sort: SortBy) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebarCollapsed: () => void
}

const UIStoreContext = createContext<UIStoreValue | null>(null)

export function UIStoreProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TradeTab>("YES")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortBy>("trending")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const value = useMemo<UIStoreValue>(
    () => ({
      activeTab,
      selectedCategory,
      sortBy,
      sidebarCollapsed,
      setActiveTab,
      setSelectedCategory,
      setSortBy,
      setSidebarCollapsed,
      toggleSidebarCollapsed: () => setSidebarCollapsed((prev) => !prev),
    }),
    [activeTab, selectedCategory, sortBy, sidebarCollapsed],
  )

  return <UIStoreContext.Provider value={value}>{children}</UIStoreContext.Provider>
}

export function useUIStore() {
  const context = useContext(UIStoreContext)
  if (!context) {
    throw new Error("useUIStore must be used within UIStoreProvider")
  }
  return context
}
