"use client"

import { TrendingUp } from "lucide-react"
import { trendingItems } from "@/lib/mock-data"

function TickerContent() {
    return (
        <div className="flex items-center gap-8 shrink-0">
            {trendingItems.map((item, i) => (
                <div
                    key={`${item.label}-${i}`}
                    className="flex items-center gap-4"
                >
                    {i === 0 && (
                        <span className="flex items-center gap-1.5 text-caption text-muted-foreground">
                            <TrendingUp className="w-3.5 h-3.5 text-primary" />
                            Trending
                        </span>
                    )}
                    <span className="flex items-center gap-2">
                        <span className="text-body-medium text-foreground whitespace-nowrap">
                            {item.label}
                        </span>
                        <span
                            className={`text-caption whitespace-nowrap ${item.positive
                                ? "text-primary"
                                : "text-destructive"
                                }`}
                        >
                            {item.change}
                        </span>
                    </span>
                </div>
            ))}
        </div>
    )
}

export function TrendingTicker() {
    return (
        <div className="relative w-full overflow-hidden border-b border-border bg-background py-2.5">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

            <div className="ticker-track">
                <TickerContent />
                <TickerContent />
                <TickerContent />
                <TickerContent />
            </div>
        </div>
    )
}
