import { TrendingDown, Users, MessageCircle, Calendar } from "lucide-react"
import type { MarketCardData } from "@/lib/types"
import Link from "next/link"
import type { ReactNode } from "react"

interface MarketCardProps {
    market: MarketCardData
    href?: string
}

function wrapWithLink(href: string | undefined, children: ReactNode) {
    if (!href) return children
    return (
        <Link href={href} className="block">
            {children}
        </Link>
    )
}

export function MarketCard({ market, href }: MarketCardProps) {
    const m = market

    // Multi-outcome card (like Grammys)
    if (m.outcomes && m.outcomes.length > 0) {
        const content = (
            <div className="rounded-xl bg-card border border-border p-4 space-y-3 hover:border-primary/30 transition-colors group cursor-pointer">
                {/* Category */}
                <div className="flex items-center gap-2">
                    {m.image && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-muted-foreground">
                                {m.category.slice(0, 2).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div>
                        <span
                            className="text-caption font-bold"
                            style={{ color: m.categoryColor }}
                        >
                            {m.category}
                        </span>
                        <h3 className="text-heading-3 text-foreground leading-tight text-sm">
                            {m.title}
                        </h3>
                    </div>
                </div>

                {/* Outcomes list */}
                <div className="space-y-2">
                    {m.outcomes.map((outcome) => (
                        <div
                            key={outcome.name}
                            className="flex items-center justify-between"
                        >
                            <span className="text-body text-muted-foreground text-xs truncate mr-2">
                                {outcome.name}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-heading-3 text-foreground text-xs">
                                    {outcome.odds}%
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-bold">
                                    Yes
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/15 text-destructive font-bold">
                                    No
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 text-caption pt-1">
                    <span>{m.volume} Vol.</span>
                    <span className="flex items-center gap-0.5">
                        <Users className="w-3 h-3" />
                        {m.traders}
                    </span>
                    <span className="flex items-center gap-0.5">
                        <MessageCircle className="w-3 h-3" />
                        {m.comments}
                    </span>
                    <span className="flex items-center gap-0.5 ml-auto">
                        <Calendar className="w-3 h-3" />
                        {m.date}
                    </span>
                </div>
            </div>
        )

        return wrapWithLink(href, content)
    }

    // Standard binary card
    const content = (
        <div className="rounded-xl bg-card border border-border p-4 space-y-3 hover:border-primary/30 transition-colors group cursor-pointer">
            {/* Category + Image */}
            <div className="flex items-start gap-3">
                {m.image && (
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-muted-foreground">
                            {m.category.slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <span
                        className="text-caption font-bold"
                        style={{ color: m.categoryColor }}
                    >
                        {m.category}
                    </span>
                    <h3 className="text-heading-3 text-foreground leading-snug mt-0.5">
                        {m.title}
                    </h3>
                </div>
            </div>

            {/* Chance + Trend */}
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                    {m.chance}%
                </span>
                {m.trend && (
                    <span
                        className={`flex items-center gap-0.5 text-caption ${m.trendPositive ? "text-primary" : "text-destructive"
                            }`}
                    >
                        <TrendingDown className="w-3 h-3" />
                        {m.trend}
                    </span>
                )}
                <span className="text-caption ml-auto">chance</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 rounded-full bg-secondary overflow-hidden">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${m.chance}%` }}
                />
            </div>

            {/* Yes/No Buttons */}
            <div className="grid grid-cols-2 gap-2">
                <button className="py-1.5 rounded-md bg-primary text-primary-foreground text-btn text-xs transition-all hover:brightness-110 active:scale-95">
                    Yes {m.yesPrice}
                </button>
                <button className="py-1.5 rounded-md bg-destructive text-destructive-foreground text-btn text-xs transition-all hover:brightness-110 active:scale-95">
                    No {m.noPrice}
                </button>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center gap-3 text-caption pt-1">
                <span>{m.volume} Vol.</span>
                <span className="flex items-center gap-0.5">
                    <Users className="w-3 h-3" />
                    {m.traders}
                </span>
                {m.comments && (
                    <span className="flex items-center gap-0.5">
                        <MessageCircle className="w-3 h-3" />
                        {m.comments}
                    </span>
                )}
                <span className="flex items-center gap-0.5 ml-auto">
                    <Calendar className="w-3 h-3" />
                    {m.date}
                </span>
            </div>
        </div>
    )

    return wrapWithLink(href, content)
}
