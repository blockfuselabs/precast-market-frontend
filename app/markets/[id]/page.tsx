'use client'

import { Navbar } from "@/components/layout/Navbar"
import { TrendingTicker } from "@/components/layout/TrendingTicker"
import { Footer } from "@/components/layout/Footer"
import { useMarket } from "@/hooks/useMarket"
import { MarketDetailLayout } from "@/components/market/MarketDetailLayout"

interface MarketPageProps {
    params: {
        id: string
    }
}

export default function MarketPage({ params }: MarketPageProps) {
    const { market, isLoading } = useMarket(params.id)

    return (
        <>
            <Navbar />
            <TrendingTicker />

            <main className="container-app space-y-6 py-6">
                <MarketDetailLayout market={market} isLoading={isLoading} />
            </main>

            <Footer />
        </>
    )
}

