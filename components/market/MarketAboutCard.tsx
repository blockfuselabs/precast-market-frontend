import type { Market } from "@/lib/types"

interface MarketAboutCardProps {
    market: Market
}

export function MarketAboutCard({ market }: MarketAboutCardProps) {
    return (
        <section className="rounded-2xl bg-card border border-border p-4 md:p-5 space-y-3">
            <h2 className="text-heading-3 text-foreground">About this market</h2>

            {market.description ? (
                <p className="text-body text-muted-foreground whitespace-pre-line">
                    {market.description}
                </p>
            ) : (
                <p className="text-body text-muted-foreground">
                    No description provided for this market yet.
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-caption pt-2">
                {market.startDate && (
                    <div className="rounded-lg bg-secondary px-3 py-2">
                        <div className="text-secondary-foreground">
                            Start date
                        </div>
                        <div className="text-foreground font-semibold">
                            {market.startDate}
                        </div>
                    </div>
                )}
                {market.endDate && (
                    <div className="rounded-lg bg-secondary px-3 py-2">
                        <div className="text-secondary-foreground">End date</div>
                        <div className="text-foreground font-semibold">
                            {market.endDate}
                        </div>
                    </div>
                )}
                {market.resolutionSource && (
                    <div className="rounded-lg bg-secondary px-3 py-2 sm:col-span-2">
                        <div className="text-secondary-foreground">
                            Resolution source
                        </div>
                        <div className="text-foreground font-semibold wrap-break-word">
                            {market.resolutionSource}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

