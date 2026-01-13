"use client"

import { Button } from "@/components/ui/button"
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import LMSRABI from "@/lib/LMSRABI.json"
import { Loader2, Trophy } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

interface ClaimWinningsProps {
    marketId: string
    resolved?: boolean
    yesWon?: boolean
}

export function ClaimWinnings({ marketId, resolved, yesWon }: ClaimWinningsProps) {
    const { isConnected } = useAccount()
    const { data: hash, isPending, writeContract } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    useEffect(() => {
        if (isSuccess) {
            toast.success("Winnings claimed successfully!")
        }
    }, [isSuccess])

    const handleClaim = () => {
        writeContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: LMSRABI,
            functionName: "claim",
            args: [BigInt(marketId)],
        })
    }

    if (!isConnected || !resolved) {
        return null
    }

    return (
        <div className="w-full p-4 border rounded-lg bg-green-500/10 border-green-500/20 space-y-3">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                <Trophy className="w-5 h-5" />
                <span>Market Resolved: {yesWon ? "YES" : "NO"} Won</span>
            </div>
            <p className="text-sm text-muted-foreground">
                If you hold winning shares, claim your payout now.
            </p>
            <Button
                onClick={handleClaim}
                disabled={isPending || isConfirming}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
                {isPending || isConfirming ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Claiming...
                    </>
                ) : (
                    "Claim Winnings"
                )}
            </Button>
        </div>
    )
}
