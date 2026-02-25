"use client"

import { useState } from "react"
import { ArrowUpDown, SlidersHorizontal, LayoutGrid, List } from "lucide-react"
import { allMarkets } from "@/lib/mock-data"
import { MarketCard } from "./MarketCard"

export function AllMarkets() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [visibleCount, setVisibleCount] = useState(8)

    const visibleMarkets = allMarkets.slice(0, visibleCount)

    return (
        <section className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-heading-2-xl text-foreground">
                    All Markets
                </h2>

                <div className="flex items-center gap-3">
                    {/* Sort */}
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border text-body text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        <span className="text-caption">Sort by:</span>
                        <span className="text-caption text-foreground">
                            24h Volume
                        </span>
                    </button>

                    {/* Filters */}
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border text-caption text-muted-foreground hover:text-foreground transition-colors">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filters
                    </button>

                    {/* View Toggle */}
                    <div className="flex items-center bg-secondary rounded-lg border border-border overflow-hidden">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 transition-colors ${viewMode === "grid"
                                    ? "bg-primary/15 text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-1.5 transition-colors ${viewMode === "list"
                                    ? "bg-primary/15 text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Market Grid */}
            <div
                className={
                    viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        : "flex flex-col gap-3"
                }
            >
                {visibleMarkets.map((market) => (
                    <MarketCard key={market.id} market={market} />
                ))}
            </div>

            {/* Load More */}
            {visibleCount < allMarkets.length && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={() =>
                            setVisibleCount((c) =>
                                Math.min(c + 8, allMarkets.length)
                            )
                        }
                        className="inline-flex items-center px-8 py-2.5 rounded-full border border-border text-body text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                        Load more markets
                    </button>
                </div>
            )}
        </section>
    )
}
