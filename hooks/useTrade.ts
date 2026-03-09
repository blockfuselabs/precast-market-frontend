import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACT_ADDRESS, USDC_ADDRESS } from "@/lib/constants"
import LMSRABI from "@/lib/LMSRABI.json"
import { erc20ABI } from "@/lib/erc20-abi"
import { parseUnits } from "viem"
import { useState } from "react"

export function useTrade() {
    const [isApproving, setIsApproving] = useState(false)
    const [isTrading, setIsTrading] = useState(false)

    // Setup write contracts
    const { writeContractAsync: writeApprove } = useWriteContract()
    const { writeContractAsync: writeTrade } = useWriteContract()

    const executeTrade = async (
        marketId: string,
        amountText: string | number, // Amount in dollars (e.g., 100)
        side: "yes" | "no"
    ) => {
        try {
            // Convert dollar amount to 6 decimals expected by USDC
            const amountWei = parseUnits(amountText.toString(), 6)

            // 1. Approve USDC
            setIsApproving(true)
            const approveTxHash = await writeApprove({
                address: USDC_ADDRESS as `0x${string}`,
                abi: erc20ABI,
                functionName: "approve",
                args: [CONTRACT_ADDRESS as `0x${string}`, amountWei],
            })
            setIsApproving(false)

            // 2. Execute Trade on LMSR Contract
            setIsTrading(true)
            const functionName = side === "yes" ? "buyYES" : "buyNO"

            const tradeTxHash = await writeTrade({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: LMSRABI as any,
                functionName: functionName,
                args: [BigInt(marketId), amountWei],
            })

            setIsTrading(false)
            return {
                success: true,
                approveTxHash,
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
