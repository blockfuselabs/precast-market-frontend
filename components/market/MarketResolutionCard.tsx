import type { Market } from "@/lib/types"

interface MarketResolutionCardProps {
    market: Market
}

export function MarketResolutionCard({ market }: MarketResolutionCardProps) {
    const winningOutcome =
        market.yesWon === true ? "YES" : market.yesWon === false ? "NO" : null

    return (
        <aside className="rounded-2xl border-2 border-destructive bg-card p-5 md:p-6">
            <h2 className="text-lg font-bold text-destructive">
                Market Resolved
            </h2>

            {winningOutcome !== null && (
                <p className="mt-3 text-body font-semibold text-foreground">
                    Winning Outcome:{" "}
                    <span className="font-bold text-destructive">
                        {winningOutcome}
                    </span>
                </p>
            )}

            <p className="mt-3 text-caption text-muted-foreground leading-relaxed">
                This market has been resolved. You can now claim your winnings
                if you hold shares of the winning outcome.
            </p>
        </aside>
    )
}
