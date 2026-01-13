import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/layout/header"

export function MarketDetailSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Market Info (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-20 rounded" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                            <Skeleton className="h-10 w-3/4" />
                            <Skeleton className="aspect-video w-full rounded-xl" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-40 mb-2" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                            <Skeleton className="h-64 w-full rounded-lg" />
                        </div>
                    </div>

                    {/* Right Column: Trading Sidebar (4 cols) */}
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <Skeleton className="h-40 w-full rounded-xl" />
                            <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden h-96">
                                <Skeleton className="h-12 w-full" />
                                <div className="p-4 space-y-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-32 w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
