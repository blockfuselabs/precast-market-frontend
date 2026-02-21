"use client"

import { useMemo } from "react"
import MarketGrid from "@/components/market/market-grid"
import { useMarkets } from "@/hooks/useMarkets"
import { MarketGridSkeleton } from "@/components/skeletons/market-grid-skeleton"
import { useUIStore } from "@/stores/ui-store"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { markets, isLoading } = useMarkets()
  const { selectedCategory, setSelectedCategory, sortBy, setSortBy } = useUIStore()

  const categories = useMemo(() => {
    const source = new Set<string>(["all"])
    markets.forEach((market) => {
      const category = (market.category || market.tag || "general").toLowerCase()
      source.add(category)
    })
    return Array.from(source)
  }, [markets])

  const filteredMarkets = useMemo(() => {
    if (selectedCategory === "all") return markets
    return markets.filter((market) => {
      const category = (market.category || market.tag || "general").toLowerCase()
      return category === selectedCategory
    })
  }, [markets, selectedCategory])

  const sortedMarkets = useMemo(() => {
    const next = [...filteredMarkets]

    if (sortBy === "newest") {
      return next.sort((a, b) => (b.startTime || 0) - (a.startTime || 0))
    }
    if (sortBy === "volume") {
      return next.sort((a, b) => Number(b.volume || 0) - Number(a.volume || 0))
    }
    if (sortBy === "closing-soon") {
      return next.sort((a, b) => {
        const aEnd = a.endTime || Number.MAX_SAFE_INTEGER
        const bEnd = b.endTime || Number.MAX_SAFE_INTEGER
        return aEnd - bEnd
      })
    }

    // trending
    return next.sort((a, b) => Number(b.volume || 0) - Number(a.volume || 0))
  }, [filteredMarkets, sortBy])

  return (
    <div className="bg-background text-foreground selection:bg-primary/20">
      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        {isLoading && (
          <MarketGridSkeleton count={8} />
        )}

        {/* All Markets Section */}
        {!isLoading && markets.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">All Markets</h2>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All categories" : category}
                    </option>
                  ))}
                </select>

                <select
                  className="h-9 rounded-md border border-border bg-background px-3 text-sm"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as "trending" | "newest" | "volume" | "closing-soon")
                  }
                >
                  <option value="trending">Trending</option>
                  <option value="newest">Newest</option>
                  <option value="volume">Volume</option>
                  <option value="closing-soon">Closing soon</option>
                </select>

                {selectedCategory !== "all" && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedCategory("all")}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
            {sortedMarkets.length > 0 ? (
              <MarketGrid markets={sortedMarkets} />
            ) : (
              <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No markets match the current filters.
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {!isLoading && markets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="p-4 rounded-full bg-black/5 dark:bg-white/5">
              <span className="text-4xl">🤷‍♂️</span>
            </div>
            <h3 className="text-xl font-semibold">No markets yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Be the first to predict the future. Create a market and start trading.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
