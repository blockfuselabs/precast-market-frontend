import {
    ArrowLeft,
    CalendarDays,
    MessageCircle,
    Users,
    Share2,
    Bookmark,
} from "lucide-react"
import type { Market } from "@/lib/types"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface MarketDetailHeaderProps {
    market: Market
}

function formatEndDate(market: Market) {
    if (market.endTime) {
        const date = new Date(market.endTime * 1000)
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        })
    }

    if (market.endDate) {
        return market.endDate
    }

    return "TBD"
}

export function MarketDetailHeader({ market }: MarketDetailHeaderProps) {
    const yes = market.outcomes.find((o) => o.name.toLowerCase() === "yes")
    const no = market.outcomes.find((o) => o.name.toLowerCase() === "no")

    const yesProb = yes?.probability ?? 50
    const noProb = no?.probability ?? 50

    return (
        <section className="space-y-4">
            {/* Breadcrumb / Back */}
            <div className="flex items-center gap-2 text-caption text-muted-foreground">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to markets</span>
                </Link>
            </div>

            {/* Main card */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_0,#1E993B22,transparent_55%)]" />
                <div className="relative px-5 py-4 md:px-6 md:py-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            {/* Thumbnail */}
                            {market.image && (
                                <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-secondary border border-border shrink-0">
                                    <img
                                        src={market.image}
                                        alt={market.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2 text-caption">
                                    {market.category && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                                            {market.category}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1 text-secondary-foreground">
                                        <CalendarDays className="w-3.5 h-3.5" />
                                        <span>Ends {formatEndDate(market)}</span>
                                    </span>
                                </div>

                                <h1 className="text-heading-2-xl md:text-[1.75rem] leading-snug text-foreground max-w-3xl">
                                    {market.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-caption text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5" />
                                        15,678 traders
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        892 comments
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="text-primary font-semibold">
                                            {market.volume || "$0"}
                                        </span>
                                        <span>Volume</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary border border-border hover:text-foreground hover:bg-secondary/80 transition-colors"
                                aria-label="Bookmark market"
                            >
                                <Bookmark className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary border border-border hover:text-foreground hover:bg-secondary/80 transition-colors"
                                aria-label="Share market"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Yes / No summary bar */}
                    <div className="flex items-center gap-4 rounded-xl bg-secondary/80 border border-border px-4 py-2.5">
                        <div className="flex items-center gap-6">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-bold text-primary">
                                    {yesProb.toFixed(0)}%
                                </span>
                                <div className="flex flex-col leading-tight text-caption">
                                    <span className="text-foreground">Yes</span>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-bold text-destructive">
                                    {noProb.toFixed(0)}%
                                </span>
                                <div className="flex flex-col leading-tight text-caption">
                                    <span className="text-foreground">No</span>
                                </div>
                            </div>
                        </div>

                        <div className="ml-auto">
                            <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-1 text-caption text-primary font-semibold">
                                +0.0% (24h)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

