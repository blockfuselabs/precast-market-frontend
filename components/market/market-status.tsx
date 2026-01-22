import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Market } from "@/lib/mock-data"

interface MarketStatusProps {
    market: Market
}

export function MarketStatus({ market }: MarketStatusProps) {
    if (!market.resolved && market.endTime && Date.now() / 1000 < market.endTime) {
        return null 
    }

    const isResolved = market.resolved
    const yesWon = market.yesWon

    return (
        <Card className={`border-2 ${isResolved ? (yesWon ? "border-emerald-500/50 bg-emerald-950/10" : "border-red-500/50 bg-red-950/10") : "border-orange-500/50 bg-orange-950/10"}`}>
            <CardHeader>
                <CardTitle className={isResolved ? (yesWon ? "text-emerald-500" : "text-red-500") : "text-muted-foreground"}>
                    {isResolved ? "Market Resolved" : "Market Ended"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isResolved ? (
                    <div className="space-y-2">
                        <p className="text-lg font-bold">
                            Winning Outcome: <span className={yesWon ? "text-emerald-500" : "text-red-500"}>{yesWon ? "YES" : "NO"}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            This market has been resolved. You can now claim your winnings if you hold shares of the winning outcome.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-muted-foreground">
                            Awaiting Resolution
                        </p>
                        <p className="text-sm text-muted-foreground">
                            This market has ended and is waiting for the admin to resolve the outcome.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
