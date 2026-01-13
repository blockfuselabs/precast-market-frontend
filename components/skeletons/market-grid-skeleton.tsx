import { MarketCardSkeleton } from "./market-card-skeleton"
import { cn } from "@/lib/utils"

interface MarketGridSkeletonProps {
    count?: number
    columns?: 1 | 2 | 3 | 4
    className?: string
}

export function MarketGridSkeleton({ count = 8, columns, className }: MarketGridSkeletonProps) {
    const gridCols = columns
        ? {
            1: 'grid-cols-1',
            2: 'grid-cols-1 sm:grid-cols-2',
            3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
            4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }[columns]
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

    return (
        <div className={cn("grid gap-2 md:gap-3", gridCols, className)}>
            {Array.from({ length: count }).map((_, i) => (
                <MarketCardSkeleton key={i} />
            ))}
        </div>
    )
}
