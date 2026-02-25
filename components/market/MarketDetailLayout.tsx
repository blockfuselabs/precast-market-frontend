import type { Market } from "@/lib/types"
import { MarketDetailHeader } from "./MarketDetailHeader"
import { MarketPriceHistoryCard } from "./MarketPriceHistoryCard"
import { MarketTradePanel } from "./MarketTradePanel"
import { MarketRightRailRelated } from "./MarketRightRailRelated"
import { MarketOrderBookShell } from "./MarketOrderBookShell"
import { MarketRelatedMain } from "./MarketRelatedMain"

interface MarketDetailLayoutProps {
    market: Market | null
    isLoading: boolean
}

export function MarketDetailLayout({
    market,
    isLoading,
}: MarketDetailLayoutProps) {
    return (
        <div className="space-y-5">
            {market && <MarketDetailHeader market={market} />}

            {!market && isLoading && (
                <div className="rounded-2xl bg-card border border-border p-4 md:p-5 animate-pulse">
                    <div className="h-4 w-32 bg-secondary rounded mb-3" />
                    <div className="h-7 w-3/4 bg-secondary rounded mb-2" />
                    <div className="h-4 w-1/2 bg-secondary rounded" />
                </div>
            )}

            {/* Main grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
                <div className="space-y-5">
                    <MarketPriceHistoryCard isLoading={isLoading || !market} />
                    <MarketOrderBookShell />
                    <MarketRelatedMain />
                </div>

                <div className="space-y-4">
                    <MarketTradePanel market={market} isLoading={isLoading} />
                    <MarketRightRailRelated />
                </div>
            </div>
        </div>
    )
}

