"use client"

import type { ComponentType } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, Home, PlusCircle } from "lucide-react"

import { useUserRights } from "@/hooks/useUserRights"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/stores/ui-store"

type NavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  show: boolean
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  compact,
  isActive,
}: {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  compact: boolean
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-transparent text-sm font-medium transition-colors",
        compact ? "justify-center px-2 py-3" : "px-3 py-2.5",
        isActive
          ? "border-border bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
      )}
      aria-label={compact ? label : undefined}
      title={compact ? label : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!compact && <span>{label}</span>}
    </Link>
  )
}

export function SidebarNav() {
  const pathname = usePathname()
  const { hasCreationRights, isConnected } = useUserRights()
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore()
  const canCreateMarket = Boolean(isConnected && hasCreationRights)

  const navItems: NavItem[] = [
    { href: "/", label: "Home", icon: Home, show: true },
    { href: "/create-market", label: "Create", icon: PlusCircle, show: canCreateMarket },
  ]

  const visibleItems = navItems.filter((item) => item.show)

  return (
    <>
      <aside className="hidden h-full border-r border-border bg-card/40 md:flex md:w-[72px] lg:hidden">
        <nav className="flex w-full flex-col gap-2 p-2">
          {visibleItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              compact
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </aside>

      <aside className="hidden h-full border-r border-border bg-card/40 lg:flex">
        <nav className={cn("flex w-full flex-col gap-2 p-4", sidebarCollapsed && "items-center")}>
          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            className={cn(
              "mb-2 h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground flex",
              sidebarCollapsed && "rotate-180",
            )}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {visibleItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              compact={sidebarCollapsed}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </aside>
    </>
  )
}
