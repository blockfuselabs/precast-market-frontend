import type { Market } from "@/lib/types"
import { useClaim } from "@/hooks/useClaim"
import { usePrivy, useSendTransaction, useWallets } from "@privy-io/react-auth"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface MarketResolutionCardProps {
    market: Market
}

export function MarketResolutionCard({ market }: MarketResolutionCardProps) {
    const isResolved = market.resolved
    const yesWon = market.yesWon

    const { executeClaim, isClaiming } = useClaim()
    const { authenticated, login } = usePrivy()
    const { sendTransaction } = useSendTransaction()
    const { wallets } = useWallets()
    const wallet = wallets?.[0]

    const handleClaim = async () => {
        if (!authenticated) {
            login()
            return
        }
        if (!wallet) {
            toast.error("Wallet not available. Please reconnect.")
            return
        }

        const result = await executeClaim(market.id, sendTransaction, wallet)
        if (result.success) {
            toast.success("Winnings claimed successfully!")
        } else {
            toast.error(`Claim failed: ${(result.error as any)?.message || "Unknown error"}`)
        }
    }

    return (
        <aside className={`rounded-2xl border-2 p-5 md:p-6 bg-card ${isResolved ? (yesWon ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5") : "border-warning/30 bg-warning/5"}`}>
            <h2 className={`text-lg font-bold ${isResolved ? (yesWon ? "text-primary" : "text-destructive") : "text-warning"}`}>
                {isResolved ? "Market Resolved" : "Market Ended"}
            </h2>

            <div className="mt-3">
                {isResolved ? (
                    <div className="space-y-4">
                        <div>
                            <p className="text-body font-semibold text-foreground">
                                Winning Outcome: <span className={yesWon ? "text-primary font-bold" : "text-destructive font-bold"}>{yesWon ? "YES" : "NO"}</span>
                            </p>
                            <p className="text-caption text-muted-foreground leading-relaxed mt-2">
                                This market has been resolved. You can now claim your winnings if you hold shares of the winning outcome.
                            </p>
                        </div>

                        <button
                            onClick={handleClaim}
                            disabled={isClaiming}
                            className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${yesWon
                                ? "bg-primary/15 text-primary hover:bg-primary/25"
                                : "bg-destructive/15 text-destructive hover:bg-destructive/25"
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


