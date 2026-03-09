import type { Market } from "@/lib/types"
import { useClaim } from "@/hooks/useClaim"
import { usePrivy } from "@privy-io/react-auth"
import { Loader2 } from "lucide-react"

interface MarketResolutionCardProps {
    market: Market
}

export function MarketResolutionCard({ market }: MarketResolutionCardProps) {
    const isResolved = market.resolved
    const yesWon = market.yesWon

    const { executeClaim, isClaiming } = useClaim()
    const { authenticated, login } = usePrivy()

    const handleClaim = async () => {
        if (!authenticated) {
            login()
            return
        }

        const result = await executeClaim(market.id)
        if (result.success) {
            alert(`Claim transaction successful!\nHash: ${result.claimTxHash}`)
        } else {
            alert(`Claim failed. See console for details.`)
        }
    }

    return (
        <aside className={`rounded-2xl border-2 p-5 md:p-6 bg-card ${isResolved ? (yesWon ? "border-emerald-500/50 bg-emerald-950/10" : "border-red-500/50 bg-red-950/10") : "border-amber-500/50 bg-amber-950/10"}`}>
            <h2 className={`text-lg font-bold ${isResolved ? (yesWon ? "text-emerald-500" : "text-red-500") : "text-amber-500"}`}>
                {isResolved ? "Market Resolved" : "Market Ended"}
            </h2>

            <div className="mt-3">
                {isResolved ? (
                    <div className="space-y-4">
                        <div>
                            <p className="text-body font-semibold text-foreground">
                                Winning Outcome: <span className={yesWon ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>{yesWon ? "YES" : "NO"}</span>
                            </p>
                            <p className="text-caption text-muted-foreground leading-relaxed mt-2">
                                This market has been resolved. You can now claim your winnings if you hold shares of the winning outcome.
                            </p>
                        </div>

                        <button
                            onClick={handleClaim}
                            disabled={isClaiming}
                            className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${yesWon
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                                } ${isClaiming ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {isClaiming && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isClaiming ? "Claiming..." : "Claim Winnings"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-body font-semibold text-amber-500/90">
                            Awaiting Resolution
                        </p>
                        <p className="text-caption text-muted-foreground leading-relaxed">
                            This market has ended and is waiting for the admin to resolve the outcome.
                        </p>
                    </div>
                )}
            </div>
        </aside>
    )
}
