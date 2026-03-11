"use client"

import { useSearchParams } from "next/navigation"
import { useMarkets } from "@/hooks/useMarkets"
import { MarketCard } from "@/components/home/MarketCard"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Search as SearchIcon, Loader2 } from "lucide-react"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const { markets, isLoading } = useMarkets()

    const filteredMarkets = markets.filter((m) => {
        const searchContent = `${m.title} ${m.category} ${m.description} ${m.tag}`.toLowerCase()
        return searchContent.includes(query.toLowerCase())
    })

    return (
        <>
            <Navbar />
            <main className="container-app py-8 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <SearchIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-heading-1 text-foreground">
                            Search Results
                        </h1>
                        <p className="text-body text-muted-foreground">
                            {query ? `Showing results for "${query}"` : "Browse all markets"}
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-body text-muted-foreground">Searching markets...</p>
                    </div>
                ) : filteredMarkets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredMarkets.map((market) => (
                            <MarketCard key={market.id} market={market} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                            <SearchIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-heading-3 text-foreground">No markets found</h3>
                            <p className="text-body text-muted-foreground max-w-xs">
                                We couldn't find any results for "{query}". Try different keywords or browse categories.
                            </p>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    )
}
