"use client"

import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { useUserRights } from "@/hooks/useUserRights"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import LMSRABI from "@/lib/LMSRABI.json"
import { toast } from "sonner"

interface MarketResolutionProps {
    marketId: string
}

export function MarketResolution({ marketId }: MarketResolutionProps) {
    const { hasCreationRights, isConnected } = useUserRights()
    const { data: hash, isPending: isWritePending, writeContract } = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    const [resolvingOutcome, setResolvingOutcome] = useState<"YES" | "NO" | null>(null)

    const handleResolve = (victoryOutcome: boolean) => {
        setResolvingOutcome(victoryOutcome ? "YES" : "NO")
        writeContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: LMSRABI,
            functionName: "resolve",
            args: [BigInt(marketId), victoryOutcome],
        })
    }

    if (!isConnected || !hasCreationRights) {
        return null
    }

    const isPending = isWritePending || isConfirming

    return (
        <Card className="border-orange-500/50 bg-orange-950/10">
            <CardHeader>
                <CardTitle className="text-orange-500 text-lg">Admin Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    As an admin/moderator, you can resolve this market. This action is irreversible.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isPending}
                        onClick={() => handleResolve(true)}
                    >
                        {isPending && resolvingOutcome === "YES" ? "Resolving..." : "Resolve YES Won"}
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={isPending}
                        onClick={() => handleResolve(false)}
                    >
                        {isPending && resolvingOutcome === "NO" ? "Resolving..." : "Resolve NO Won"}
                    </Button>
                </div>

                {hash && <div className="text-xs text-muted-foreground break-all">Tx: {hash}</div>}
                {isConfirmed && <div className="text-sm text-green-500 font-medium">Market Resolved Successfully!</div>}
            </CardContent>
        </Card>
    )
}
