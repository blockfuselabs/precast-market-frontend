import { MarketCreationForm } from "@/components/admin/MarketCreationForm"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export const dynamic = 'force-dynamic';

export default function CreateMarketPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-3">
                        <h1 className="text-heading-1">Create Admin Market</h1>
                        <p className="text-body text-muted-foreground">Launch a new prediction market on the Precast protocol.</p>
                    </div>

                    <div className="glass-card rounded-xl p-6 md:p-8">
                        <MarketCreationForm />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
