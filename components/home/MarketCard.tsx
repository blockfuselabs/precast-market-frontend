import { TrendingDown, Users, Calendar } from "lucide-react"
import type { Market } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

interface MarketCardProps {
    market: Market
}

function formatEndDate(endTime?: number): string {
    if (!endTime) return "TBD"
    const date = new Date(endTime * 1000)
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export function MarketCard({ market }: MarketCardProps) {
    const yesOutcome = market.outcomes.find((o) => o.name.toLowerCase() === "yes")
    const noOutcome = market.outcomes.find((o) => o.name.toLowerCase() === "no")
    const yesProb = yesOutcome?.probability ?? 50
    const noProb = noOutcome?.probability ?? 50

    return (
        <Link
            href={`/markets/${market.id}`}
            className="block rounded-xl bg-card border border-border p-4 space-y-3 hover:border-primary/30 transition-colors group cursor-pointer"
        >
            {/* Image + Title */}
            <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-secondary border border-border shrink-0">
                    {market.image ? (
                        <Image
                            src={market.image}
                            alt={market.title}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                            {(market.category ?? market.tag ?? "").slice(0, 2).toUpperCase() || "MK"}
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    {(market.category || market.tag) && (
                        <span className="text-caption font-bold text-primary">
                            {market.category || market.tag}
                        </span>
                    )}
                    <h3 className="text-heading-3 text-foreground leading-snug mt-0.5 line-clamp-2">
                        {market.title}
                    </h3>
                </div>
            </div>

            {/* Chance — YES left (green), NO right (red) */}
            <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">{yesProb}%</span>
                    <span className="text-caption text-primary/70">Yes</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-caption text-destructive/70">No</span>
                    <span className="text-2xl font-bold text-destructive">{noProb}%</span>
                </div>
            </div>

            {/* Progress bar — green YES | red NO */}
            <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden flex">
                <div
                    className="h-full bg-primary/15 transition-all"
                    style={{ width: `${yesProb}%` }}
                />
                <div
                    className="h-full bg-destructive/15 transition-all flex-1"
                />
            </div>

            {/* Yes/No Buttons */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="py-1.5 rounded-md bg-primary/10 text-primary text-btn text-xs transition-all hover:bg-primary/20 active:scale-95"
                >
                    Yes {yesProb}¢
                </button>
                <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="py-1.5 rounded-md bg-destructive/10 text-destructive text-btn text-xs transition-all hover:bg-destructive/20 active:scale-95"
                >
                    No {noProb}¢
                </button>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center gap-3 text-caption pt-1">
                <span>{market.volume} Vol.</span>
                <span className="flex items-center gap-0.5 ml-auto">
                    <Calendar className="w-3 h-3" />
                    {formatEndDate(market.endTime)}
                </span>
            </div>
        </Link>
    )
}
