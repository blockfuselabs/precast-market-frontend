import { Skeleton } from "@/components/ui/skeleton"

export function MarketCardSkeleton() {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-lg border-[0.2px] border-border bg-card p-5">
            <div className="flex items-start gap-2.5">
                <Skeleton className="h-10 w-10 shrink-0 rounded-md" />
                <div className="flex-1 space-y-2 pt-0.5">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
            <div className="mt-auto pt-3">
                <div className="grid grid-cols-2 gap-1.5">
                    <Skeleton className="h-9 rounded-sm" />
                    <Skeleton className="h-9 rounded-sm" />
                </div>
                <div className="mt-2.5 flex items-center">
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </div>
    )
}
