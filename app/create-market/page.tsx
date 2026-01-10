import { MarketCreationForm } from "@/components/market-creation-form"

export default function CreateMarketPage() {
    return (
        <main className="min-h-screen bg-background py-8">
            <div className="max-w-[800px] mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Create New Market</h1>
                <div className="bg-card border border-border rounded-xl p-6">
                    <MarketCreationForm />
                </div>
            </div>
        </main>
    )
}
