"use client"

import { useMarket } from "@/hooks/useMarket"
import Header from "@/components/header"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function EventPage() {
    const params = useParams()
    const id = params.id as string
    const { market, isLoading } = useMarket(id)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex justify-center py-20">
                    <div className="animate-pulse text-muted-foreground">Loading market details...</div>
                </div>
            </div>
        )
    }

    if (!market) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex justify-center py-20">
                    <div className="text-muted-foreground">Market not found</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex gap-8 flex-col md:flex-row">
                    {/* Left Column: Image and Main Info */}
                    <div className="flex-1 space-y-6">
                        <div className="aspect-video relative rounded-lg overflow-hidden border border-border">
                            <Image
                                src={market.image}
                                alt={market.title}
                                fill
                                className="object-cover"
                                unoptimized // For IPFS images
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold mb-2">{market.title}</h1>
                            {market.description && (
                                <p className="text-muted-foreground">{market.description}</p>
                            )}
                        </div>

                        <div className="bg-card border border-border rounded-lg p-6">
                            <h3 className="font-semibold mb-4">Market Details</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Resolution Source</span>
                                    <span>{market.resolutionSource || "Oracle"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Start Date</span>
                                    <span>{market.startDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">End Date</span>
                                    <span>{market.endDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Trading Interface (Mock for now) */}
                    <div className="w-full md:w-80 space-y-4">
                        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Yes</span>
                                <span className="text-2xl font-bold text-green-500">{market.outcomes[0].probability}%</span>
                            </div>
                            <Button className="w-full bg-green-500 hover:bg-green-600">Buy Yes</Button>
                        </div>

                        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">No</span>
                                <span className="text-2xl font-bold text-red-500">{market.outcomes[1].probability}%</span>
                            </div>
                            <Button className="w-full bg-red-500 hover:bg-red-600">Buy No</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
