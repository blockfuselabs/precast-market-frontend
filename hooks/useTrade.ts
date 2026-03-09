import { usePublicClient } from "wagmi"
import { CONTRACT_ADDRESS, USDC_ADDRESS } from "@/lib/constants"
import LMSRABI from "@/lib/LMSRABI.json"
import { erc20ABI } from "@/lib/erc20-abi"
import { parseUnits, encodeFunctionData } from "viem"
import { useState } from "react"
import { baseSepolia } from "wagmi/chains"
import type { ConnectedWallet } from "@privy-io/react-auth"

export function useTrade() {
    const [isApproving, setIsApproving] = useState(false)
    const [isTrading, setIsTrading] = useState(false)
    const publicClient = usePublicClient()

    const executeTrade = async (
        marketId: string,
        amountText: string | number, // Amount in dollars (e.g., 100)
        side: "yes" | "no",
        allowance: bigint,
        sendTransaction: any, // passed from useSendTransaction from privy
        wallet: ConnectedWallet
    ) => {
        try {
            // Convert dollar amount to 6 decimals expected by USDC
            const amountWei = parseUnits(amountText.toString(), 6)

            // 1. Approve USDC if necessary
            if (allowance < amountWei) {
                setIsApproving(true)
                const approveData = encodeFunctionData({
                    abi: erc20ABI,
                    functionName: "approve",
                    args: [CONTRACT_ADDRESS as `0x${string}`, amountWei],
                })

                const { hash: approveTxHash } = await sendTransaction(
                    { to: USDC_ADDRESS as `0x${string}`, data: approveData, chainId: baseSepolia.id },
                    { address: wallet.address as `0x${string}` }
                )

                if (publicClient) {
                    await publicClient.waitForTransactionReceipt({ hash: approveTxHash as `0x${string}` })
                } else {
                    await new Promise(resolve => setTimeout(resolve, 4000))
                }
                setIsApproving(false)
            }

            // 2. Execute Trade on LMSR Contract
            setIsTrading(true)
            const functionName = side === "yes" ? "buyYES" : "buyNO"
            const tradeData = encodeFunctionData({
                abi: LMSRABI as any,
                functionName: functionName,
                args: [BigInt(marketId), amountWei],
            })

            const { hash: tradeTxHash } = await sendTransaction(
                { to: CONTRACT_ADDRESS as `0x${string}`, data: tradeData, chainId: baseSepolia.id },
                { address: wallet.address as `0x${string}` }
            )

            if (publicClient) {
                await publicClient.waitForTransactionReceipt({ hash: tradeTxHash as `0x${string}` })
            } else {
                await new Promise(resolve => setTimeout(resolve, 4000))
            }

            setIsTrading(false)
            return {
                success: true,
                tradeTxHash
            }

        } catch (error) {
            console.error("Trade failed:", error)
            setIsApproving(false)
            setIsTrading(false)
            return {
                success: false,
                error
            }
        }
    }

    return {
        executeTrade,
        isApproving,
        isTrading,
        isPending: isApproving || isTrading
    }
}
