"use client"

import { useMemo, useState } from "react"
import { ArrowRight, Users, Calendar } from "lucide-react"
import { useMarkets } from "@/hooks/useMarkets"
import Image from "next/image"
import Link from "next/link"

function formatEndDate(endTime?: number): string {
    if (!endTime) return "TBD"
    return new Date(endTime * 1000).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export function FeaturedHero() {
    const { markets, isLoading } = useMarkets()

    const featured = useMemo(() => {
        if (!markets.length) return null
        const idx = Math.floor(Math.random() * markets.length)
        return markets[idx]
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markets.length])

    const [imgError, setImgError] = useState(false)

    if (isLoading || !featured) {
        return (
            <div className="relative rounded-2xl border border-[#2A2D3580] bg-gradient-to-br from-[#1C1F26] to-[#1C1F26] overflow-hidden animate-pulse">
                <div className="flex flex-col p-5 md:p-6 md:flex-row gap-4 md:gap-5">
                    <div className="w-full md:w-48 h-40 md:h-auto rounded-xl bg-secondary shrink-0" />
                    <div className="flex-1 space-y-3 py-2">
                        <div className="h-3 w-24 bg-secondary rounded" />
                        <div className="h-6 w-3/4 bg-secondary rounded" />
                        <div className="h-4 w-full bg-secondary rounded" />
                        <div className="h-4 w-1/2 bg-secondary rounded" />
                    </div>
                </div>
            </div>
        )
    }

    const yesProb = featured.outcomes.find((o) => o.name.toLowerCase() === "yes")?.probability ?? 50
    const showImage = !!featured.image && !imgError

    return (
        <div className="relative rounded-2xl border border-[#2A2D3580] bg-gradient-to-br from-[#1C1F26] to-[#1C1F26] to-[#34D3990D] overflow-hidden">
            <div className="flex flex-col p-5 md:p-6 md:flex-row gap-4 md:gap-5">
                {/* Image — fixed h-48 so next/image fill always has a concrete parent height */}
                <div className="relative w-full md:w-48 h-48 rounded-xl shrink-0 overflow-hidden bg-secondary">
                    {showImage ? (
                        <Image
                            src={featured.image}
                            alt={featured.title}
                            fill
                            className="object-cover"
                            unoptimized
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    {/* Badges */}
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-caption bg-primary/15 text-primary">
                            Featured
                        </span>
                        {(featured.category || featured.tag) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-caption bg-secondary text-muted-foreground">
                                {featured.category || featured.tag}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-heading-2-lg text-foreground">
                        {featured.title}
                    </h2>

                    {/* Description */}
                    {featured.description && (
                        <p className="text-body text-muted-foreground max-w-xl line-clamp-2">
                            {featured.description}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-caption">
                        <span className="text-primary font-bold">{featured.volume || "$0"}</span>
                        <span>Volume</span>
                        {featured.endTime && (
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 shrink-0" />
                                {formatEndDate(featured.endTime)}
                            </span>
                        )}
                    </div>

                    {/* Chance + Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl sm:text-4xl font-bold text-primary">
                                {yesProb}%
                            </span>
                            <span className="text-body text-muted-foreground">
                                chance
                            </span>
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 sm:px-6 py-2 rounded-lg bg-primary/10 text-primary text-btn transition-all hover:bg-primary/20 active:scale-95 whitespace-nowrap">
                                Buy Yes
                            </button>
                            <button className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 sm:px-6 py-2 rounded-lg bg-destructive/10 text-destructive text-btn transition-all hover:bg-destructive/20 active:scale-95 whitespace-nowrap">
                                Buy No
                            </button>
                            <Link
                                href={`/markets/${featured.id}`}
                                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
                                aria-label="View details"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
