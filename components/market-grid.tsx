"use client"

import MarketCard from "./market-card"
import type { Market } from "@/lib/mock-data"

interface MarketGridProps {
  markets: Market[]
}

export default function MarketGrid({ markets }: MarketGridProps) {
  return (
    <div className="px-6 py-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-border pt-8 pb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Adventure One QSS Inc. ©2025</p>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms of Use
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Learn
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Careers
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Press
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
