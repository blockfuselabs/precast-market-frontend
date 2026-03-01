"use client"

import { Search, Bell, Command, Plus } from "lucide-react"
import Link from "next/link"
import { usePrivy } from '@privy-io/react-auth'
import { useUserRights } from "@/hooks/useUserRights"

export function Navbar() {
    const { authenticated, login } = usePrivy()
    const { hasCreationRights } = useUserRights()

    return (
        <nav className="glass sticky top-0 z-50 w-full">
            <div className="container-app flex items-center justify-between py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
                        <span className="text-white text-sm font-bold">P</span>
                    </div>
                    <span className="text-heading-3 text-foreground">precast</span>
                </Link>

                {/* Search Bar */}
                <div className="hidden md:flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 w-full max-w-md mx-8">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="text-body text-muted-foreground flex-1">
                        Search markets...
                    </span>
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-secondary rounded border border-border">
                        <Command className="w-3 h-3 text-muted-foreground" />
                        <span className="text-kbd-sm text-muted-foreground">K</span>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {authenticated && hasCreationRights && (
                        <Link
                            href="/admin/create-market"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-btn"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Create Market</span>
                        </Link>
                    )}
                    <button
                        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5" />
                    </button>
                    {!authenticated ? (
                        <button
                            onClick={login}
                            className="inline-flex items-center px-5 py-2 rounded-full border border-border text-foreground text-btn transition-colors hover:bg-secondary"
                        >
                            Sign In
                        </button>
                    ) : (
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-primary/50" />
                    )}
                </div>
            </div>
        </nav>
    )
}
