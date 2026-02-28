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

            {/* Chance */}
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                    {yesProb}%
                </span>
                <span className="text-caption ml-auto">chance</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 rounded-full bg-secondary overflow-hidden">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${yesProb}%` }}
                />
            </div>

            {/* Yes/No Buttons */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="py-1.5 rounded-md bg-primary text-primary-foreground text-btn text-xs transition-all hover:brightness-110 active:scale-95"
                >
                    Yes {yesProb}¢
                </button>
                <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="py-1.5 rounded-md bg-destructive text-destructive-foreground text-btn text-xs transition-all hover:brightness-110 active:scale-95"
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
