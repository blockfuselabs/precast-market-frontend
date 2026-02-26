import { useState } from "react"

const TIMEFRAMES = ["1H", "24H", "7D", "1M", "ALL"] as const

type Timeframe = (typeof TIMEFRAMES)[number]

interface MarketPriceHistoryCardProps {
    // In future we can pass real historical data here.
    isLoading?: boolean
}

export function MarketPriceHistoryCard({
    isLoading,
}: MarketPriceHistoryCardProps) {
    const [timeframe, setTimeframe] = useState<Timeframe>("1M")

    if (isLoading) {
        return (
            <div className="rounded-2xl bg-card border border-border p-4 md:p-5 animate-pulse">
                <div className="h-4 w-32 bg-secondary rounded mb-4" />
                <div className="h-40 w-full bg-secondary rounded" />
            </div>
        )
    }

    return (
        <section className="rounded-2xl bg-card border border-border px-4 py-3 md:px-5 md:py-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-heading-3 text-foreground">
                    Price History
                </h2>

                <div className="flex items-center gap-2 text-caption">
                    {TIMEFRAMES.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-2.5 py-1 rounded-full transition-colors ${timeframe === tf
                                ? "bg-primary/15 text-primary border border-primary/40"
                                : "bg-secondary text-secondary-foreground border border-border hover:text-foreground"
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lightweight, purely visual chart placeholder */}
            <div className="relative h-44 md:h-52 rounded-xl bg-linear-to-b from-primary/25 via-primary/10 to-transparent overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,#1E993B_0,transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,#1E993B_0,transparent_60%)]" />
                </div>

                {/* Fake axis lines */}
                <div className="absolute left-10 right-3 top-4 bottom-8 flex flex-col justify-between">
                    {[0, 1, 2, 3].map((idx) => (
                        <div
                            key={idx}
                            className="h-px w-full bg-primary/15"
                        />
                    ))}
                </div>

                {/* Y axis labels */}
                <div className="absolute left-2 top-3 bottom-8 flex flex-col justify-between text-[10px] text-secondary-foreground/80 pointer-events-none">
                    {["100¢", "75¢", "50¢", "25¢", "0¢"].map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>

                {/* Simple SVG curve to evoke chart */}
                <svg
                    viewBox="0 0 100 40"
                    preserveAspectRatio="none"
                    className="absolute left-10 right-3 bottom-5 h-[60%] text-primary"
                >
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={
                            timeframe === "1H"
                                ? "0,20 15,18 30,21 45,17 60,19 75,16 90,18 100,15"
                                : timeframe === "24H"
                                    ? "0,24 15,20 30,23 45,19 60,21 75,17 90,19 100,16"
                                    : timeframe === "7D"
                                        ? "0,26 15,22 30,24 45,18 60,20 75,15 90,17 100,14"
                                        : timeframe === "1M"
                                            ? "0,30 15,25 30,27 45,23 60,21 75,19 90,20 100,18"
                                            : "0,32 15,28 30,30 45,26 60,24 75,22 90,23 100,20"
                        }
                    />
                </svg>

                {/* X axis labels */}
                <div className="absolute left-10 right-3 bottom-1.5 flex items-center justify-between text-[10px] text-secondary-foreground/80 pointer-events-none">
                    {["Jan 2", "Jan 6", "Jan 10", "Jan 16", "Jan 22", "Jan 28", "Feb 1"].map(
                        (label) => (
                            <span key={label}>{label}</span>
                        ),
                    )}
                </div>
            </div>
        </section>
    )
}

