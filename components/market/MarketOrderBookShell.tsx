"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Market } from "@/lib/types"

const TABS = ["Description", "Resolution"] as const
type Tab = (typeof TABS)[number]

interface MarketOrderBookShellProps {
    market: Market | null
}

export function MarketOrderBookShell({ market }: MarketOrderBookShellProps) {
    const [activeTab, setActiveTab] = useState<Tab>("Description")

    return (
        <section className="rounded-2xl bg-card border border-border px-4 py-3 md:px-5 md:py-4 space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-6 text-sm">
                {TABS.map((tab) => {
                    const isActive = tab === activeTab
                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "relative pb-1 text-caption transition-colors",
                                isActive
                                    ? "text-foreground font-semibold"
                                    : "text-secondary-foreground hover:text-foreground",
                            )}
                        >
                            {tab}
                            {isActive && (
                                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-primary" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Tab content */}
            {activeTab === "Description" && (
                <div className="rounded-xl bg-secondary px-4 py-3 text-caption text-secondary-foreground">
                    {market?.description ? (
                        <p className="whitespace-pre-line text-foreground">
                            {market.description}
                        </p>
                    ) : (
                        <p className="text-muted-foreground">
                            No description provided for this market.
                        </p>
                    )}
                </div>
            )}

            {activeTab === "Resolution" && (
                <div className="rounded-xl bg-secondary px-4 py-3 text-caption text-secondary-foreground">
                    {market?.resolved ? (
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">
                                This market has been resolved.
                            </p>
                            <p>
                                Outcome:{" "}
                                {market.yesWon === true
                                    ? "Yes"
                                    : market.yesWon === false
                                      ? "No"
                                      : "—"}
                            </p>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            This market has not been resolved yet.
                        </p>
                    )}
                </div>
            )}
        </section>
    )
}

