import type { Market } from "@/lib/types"

interface MarketResolutionCardProps {
    market: Market
}

export function MarketResolutionCard({ market }: MarketResolutionCardProps) {
    const isResolved = market.resolved
    const yesWon = market.yesWon

    return (
        <aside className={`rounded-2xl border-2 p-5 md:p-6 bg-card ${isResolved ? (yesWon ? "border-emerald-500/50 bg-emerald-950/10" : "border-red-500/50 bg-red-950/10") : "border-amber-500/50 bg-amber-950/10"}`}>
            <h2 className={`text-lg font-bold ${isResolved ? (yesWon ? "text-emerald-500" : "text-red-500") : "text-amber-500"}`}>
                {isResolved ? "Market Resolved" : "Market Ended"}
            </h2>

            <div className="mt-3">
                {isResolved ? (
                    <div className="space-y-2">
                        <p className="text-body font-semibold text-foreground">
                            Winning Outcome: <span className={yesWon ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>{yesWon ? "YES" : "NO"}</span>
                        </p>
                        <p className="text-caption text-muted-foreground leading-relaxed">
                            This market has been resolved. You can now claim your winnings if you hold shares of the winning outcome.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-body font-semibold text-amber-500/90">
                            Awaiting Resolution
                        </p>
                        <p className="text-caption text-muted-foreground leading-relaxed">
                            This market has ended and is waiting for the admin to resolve the outcome.
                        </p>
                    </div>
                )}
            </div>
        </aside>
    )
}
