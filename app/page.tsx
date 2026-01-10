"use client"

import Header from "@/components/header"
import MarketGrid from "@/components/market-grid"
import { useMarkets } from "@/hooks/useMarkets"

export default function Home() {
  const { markets, isLoading } = useMarkets()

  console.log("Markets: ", markets)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse text-muted-foreground">Loading markets...</div>
        </div>
      ) : markets.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No markets found. Be the first to create one!
        </div>
      ) : (
        <MarketGrid markets={markets} />
      )}
    </main>
  )
}
