import { Navbar } from "@/components/layout/Navbar"
import { TrendingTicker } from "@/components/layout/TrendingTicker"
import { Footer } from "@/components/layout/Footer"
import { CategoryTabs } from "@/components/home/CategoryTabs"
import { FeaturedHero } from "@/components/home/FeaturedHero"
import { LiveSports } from "@/components/home/LiveSports"
import { AllMarkets } from "@/components/home/AllMarkets"

export default function Home() {
    return (
        <>
            <Navbar />
            <TrendingTicker />

            <main className="container-app space-y-8 py-6">
                <CategoryTabs />
                <FeaturedHero />
                <LiveSports />
                <AllMarkets />
            </main>

            <Footer />
        </>
    )
}
