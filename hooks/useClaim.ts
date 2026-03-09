import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import LMSRABI from "@/lib/LMSRABI.json"
import { useState, useEffect } from "react"
import { Address } from "viem"

export function useClaim() {
    const [isClaiming, setIsClaiming] = useState(false)
    const [claimHash, setClaimHash] = useState<string | null>(null)

    // Setup write contract
    const { writeContractAsync } = useWriteContract()

    const executeClaim = async (marketId: string | number) => {
        try {
            setIsClaiming(true)

            const txHash = await writeContractAsync({
                address: CONTRACT_ADDRESS as Address,
                abi: LMSRABI as any,
                functionName: "claim",
                args: [BigInt(marketId)],
            })

            setClaimHash(txHash)
            setIsClaiming(false)

            return {
                success: true,
                claimTxHash: txHash
            }

        } catch (error) {
            console.error("Claim failed:", error)
            setIsClaiming(false)
            return {
                success: false,
                error
            }
        }
    }

    return {
        executeClaim,
        isClaiming,
        claimHash
    }
}
