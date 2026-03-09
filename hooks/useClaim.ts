import { usePublicClient } from "wagmi"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import LMSRABI from "@/lib/LMSRABI.json"
import { useState } from "react"
import { encodeFunctionData } from "viem"
import { baseSepolia } from "wagmi/chains"
import type { ConnectedWallet } from "@privy-io/react-auth"

export function useClaim() {
    const [isClaiming, setIsClaiming] = useState(false)
    const publicClient = usePublicClient()

    const executeClaim = async (
        marketId: string | number,
        sendTransaction: any,
        wallet: ConnectedWallet
    ) => {
        try {
            setIsClaiming(true)

            const claimData = encodeFunctionData({
                abi: LMSRABI as any,
                functionName: "claim",
                args: [BigInt(marketId)],
            })

            const { hash: claimTxHash } = await sendTransaction(
                { to: CONTRACT_ADDRESS as `0x${string}`, data: claimData, chainId: baseSepolia.id },
                { address: wallet.address as `0x${string}` }
            )

            if (publicClient) {
                await publicClient.waitForTransactionReceipt({ hash: claimTxHash as `0x${string}` })
            } else {
                await new Promise(resolve => setTimeout(resolve, 4000))
            }

            setIsClaiming(false)
            return {
                success: true,
                claimTxHash
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
    }
}

