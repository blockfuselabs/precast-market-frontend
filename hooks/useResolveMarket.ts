import { usePublicClient } from "wagmi"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import LMSRABI from "@/lib/LMSRABI.json"
import { encodeFunctionData } from "viem"
import { useState } from "react"
import { baseSepolia } from "wagmi/chains"
import type { ConnectedWallet } from "@privy-io/react-auth"

export function useResolveMarket() {
    const [isResolving, setIsResolving] = useState(false)
    const publicClient = usePublicClient()

    const resolveMarket = async (
        marketId: string | number,
        yesWon: boolean,
        sendTransaction: any, // passed from useSendTransaction from privy
        wallet: ConnectedWallet
    ) => {
        try {
            setIsResolving(true)

            const resolveData = encodeFunctionData({
                abi: LMSRABI as any,
                functionName: "resolve",
                args: [BigInt(marketId), yesWon],
            })

            const { hash: resolveTxHash } = await sendTransaction(
                { to: CONTRACT_ADDRESS as `0x${string}`, data: resolveData, chainId: baseSepolia.id },
                { address: wallet.address as `0x${string}` }
            )

            if (publicClient) {
                await publicClient.waitForTransactionReceipt({ hash: resolveTxHash as `0x${string}` })
            } else {
                await new Promise(resolve => setTimeout(resolve, 4000))
            }

            setIsResolving(false)
            return {
                success: true,
                resolveTxHash
            }

        } catch (error) {
            console.error("Resolve failed:", error)
            setIsResolving(false)
            return {
                success: false,
                error
            }
        }
    }

    return {
        resolveMarket,
        isResolving,
    }
}
