"use client"

import MarketGrid from "@/components/market/market-grid"
import { useMarkets } from "@/hooks/useMarkets"
import { MarketGridSkeleton } from "@/components/skeletons/market-grid-skeleton"
import { usePrivy } from '@privy-io/react-auth';

export default function Home() {
  const { markets, isLoading } = useMarkets()
  const { ready } = usePrivy();

  console.log(markets)
  return (
    <div className="bg-background text-foreground selection:bg-primary/20">
      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        {isLoading && (
          <MarketGridSkeleton count={8} />
        )}

        {/* All Markets Section */}
        {!isLoading && markets.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">All Markets</h2>
            </div>
            <MarketGrid markets={markets} />
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
