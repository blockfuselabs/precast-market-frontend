const RELATED_MARKETS = [
    {
        id: "rel-1",
        question: "Will US or Israel strike Iran by December 31, 2026?",
        probability: 78,
    },
    {
        id: "rel-2",
        question: "Israel & Iran ceasefire broken by June 30, 2026?",
        probability: 63,
    },
    {
        id: "rel-3",
        question: "Iran strike on Israel by February 28?",
        probability: 36,
    },
];

const FILTERS = ["All", "Politics", "Middle East", "Israel", "Iran"] as const

export function MarketRightRailRelated() {

    return (
        <div className="space-y-3 pt-1">
            <div className="flex items-center gap-1 text-[11px] text-secondary-foreground overflow-x-auto scrollbar-none">
                {FILTERS.map((label, index) => (
                    <button
                        key={label}
                        className={`px-3 py-1 rounded-full whitespace-nowrap ${
                            index === 0
                                ? "bg-secondary text-foreground"
                                : "bg-transparent text-secondary-foreground hover:bg-secondary/70"
                        }`}
                        type="button"
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="space-y-1.5">
                {RELATED_MARKETS.map((m) => (
                    <button
                        key={m.id}
                        type="button"
                        className="w-full flex items-center justify-between gap-3 rounded-xl bg-transparent hover:bg-secondary/80 px-2.5 py-2 text-left transition-colors"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="h-7 w-7 rounded-md bg-secondary shrink-0" />
                            <p className="text-[11px] text-foreground leading-snug line-clamp-2">
                                {m.question}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                            <span className="text-sm font-semibold text-foreground">
                                {m.probability}%
                            </span>
                            <span className="text-[10px] text-secondary-foreground">
                                Yes
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

