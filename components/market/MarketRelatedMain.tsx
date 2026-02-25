const MAIN_RELATED = [
    {
        id: "rel-main-1",
        title: "Will Bitcoin reach $150k by end of 2026?",
        category: "Crypto",
        volume: "$12.5M vol.",
        probability: 34,
    },
    {
        id: "rel-main-2",
        title: "Fed rate cut in March 2026?",
        category: "Finance",
        volume: "$8.3M vol.",
        probability: 45,
    },
    {
        id: "rel-main-3",
        title: "OpenAI releases GPT-5 by Q2 2026?",
        category: "Tech",
        volume: "$5.8M vol.",
        probability: 67,
    },
]

export function MarketRelatedMain() {
    return (
        <section className="rounded-2xl bg-card border border-border px-4 py-3 md:px-5 md:py-4 space-y-3">
            <h2 className="text-heading-3 text-foreground">Related Markets</h2>

            <div className="space-y-2">
                {MAIN_RELATED.map((m) => (
                    <button
                        key={m.id}
                        type="button"
                        className="flex w-full items-center justify-between gap-3 rounded-xl bg-secondary/70 hover:bg-secondary border border-transparent hover:border-border px-3 py-2.5 text-left transition-colors"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
                            <div className="space-y-0.5 min-w-0">
                                <p className="text-body text-foreground truncate">
                                    {m.title}
                                </p>
                                <p className="text-[11px] text-secondary-foreground">
                                    <span className="text-primary">
                                        {m.category}
                                    </span>{" "}
                                    • {m.volume}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                            <span className="text-sm font-semibold text-primary">
                                {m.probability}%
                            </span>
                            <span className="text-[10px] text-secondary-foreground">
                                Yes
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    )
}

