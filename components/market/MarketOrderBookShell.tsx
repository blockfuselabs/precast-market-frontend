import { cn } from "@/lib/utils"

const TABS = ["Order Book", "Comments (892)", "Resolution"] as const

export function MarketOrderBookShell() {
    // Static UI only – LMSR binary markets do not use a traditional order book.
    const activeTab = "Order Book"

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

            {/* LMSR info row instead of real order book */}
            <div className="rounded-xl bg-secondary px-4 py-3 text-caption text-secondary-foreground">
                <p className="mb-1 font-semibold text-foreground">
                    This market uses an LMSR automated market maker.
                </p>
                <p>
                    Prices and liquidity are determined by the LMSR curve, not a
                    traditional limit-order book. Depth and quotes are computed
                    from outstanding YES/NO shares rather than individual limit
                    orders.
                </p>
            </div>
        </section>
    )
}

