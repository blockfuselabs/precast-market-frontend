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

    if (isLoading || !featured) {
        return (
            <div className="relative rounded-2xl border border-[#1A231A80] bg-gradient-to-br from-[#081208] to-[#081208] overflow-hidden animate-pulse">
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
    const [imgError, setImgError] = useState(false)
    const showImage = !!featured.image && !imgError

    return (
        <div className="relative rounded-2xl border border-[#1A231A80] bg-gradient-to-br from-[#081208] to-[#081208] to-[#1E993B0D] overflow-hidden">
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
                    <div className="flex items-center gap-4 text-caption">
                        <span className="text-primary font-bold">{featured.volume || "$0"}</span>
                        <span>Volume</span>
                        {featured.endTime && (
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatEndDate(featured.endTime)}
                            </span>
                        )}
                    </div>

                    {/* Chance + Buttons */}
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-primary">
                                {yesProb}%
                            </span>
                            <span className="text-body text-muted-foreground">
                                chance
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="inline-flex items-center px-6 py-2 rounded-lg bg-primary text-primary-foreground text-btn transition-all hover:brightness-110 active:scale-95">
                                Buy Yes
                            </button>
                            <button className="inline-flex items-center px-6 py-2 rounded-lg bg-destructive text-destructive-foreground text-btn transition-all hover:brightness-110 active:scale-95">
                                Buy No
                            </button>
                            <Link
                                href={`/markets/${featured.id}`}
                                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
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
