'use client'

import { Navbar } from "@/components/layout/Navbar"
import { TrendingTicker } from "@/components/layout/TrendingTicker"
import { Footer } from "@/components/layout/Footer"
import { useMarket } from "@/hooks/useMarket"
import { MarketDetailLayout } from "@/components/market/MarketDetailLayout"

import { use } from "react"

interface MarketPageProps {
    params: Promise<{
        id: string
    }>
}

export default function MarketPage({ params }: MarketPageProps) {
    const resolvedParams = use(params)
    const { market, isLoading, refetchMarket } = useMarket(resolvedParams.id)

    return (
        <>
            <Navbar />
            {/* <TrendingTicker /> */}

            <main className="container-app space-y-6 py-6">
                <MarketDetailLayout market={market} isLoading={isLoading} refetchMarket={refetchMarket} />
            </main>

            <Footer />
        </>
    )
}

