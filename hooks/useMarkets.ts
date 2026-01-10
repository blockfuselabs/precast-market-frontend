"use client"

import { useReadContract, useReadContracts } from "wagmi"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import LMSRABI from "@/lib/LMSRABI.json"
import { Market } from "@/lib/mock-data"
import { formatEther } from "viem"

export function useMarkets() {
    // 1. Fetch total market count
    const { data: marketCount } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: LMSRABI,
        functionName: "marketCount",
    })

    // 2. Generate array of indices [0, 1, ..., marketCount-1]
    const count = marketCount ? Number(marketCount) : 0
    const marketIds = Array.from({ length: count }, (_, i) => BigInt(i))

    // 3. Batch fetch market data
    const { data: marketsData, isLoading: isLoadingMarkets } = useReadContracts({
        contracts: marketIds.map((id) => ({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: LMSRABI,
            functionName: "markets",
            args: [id],
        })),
    })

    // 4. Batch fetch prices (priceYES)
    // Note: Cost to buy 1 full share of YES is roughly the probability
    const { data: pricesData, isLoading: isLoadingPrices } = useReadContracts({
        contracts: marketIds.map((id) => ({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: LMSRABI,
            functionName: "priceYES",
            args: [id],
        })),
    })

    // 5. Transform data
    const markets = marketsData?.map((result, index): Market | null => {
        if (result.status !== "success") return null

        // result.result matches the struct:
        // [exists, b, qYes, qNo, startTime, endTime, resolved, yesWon, question, cId]
        const data = result.result as any
        const question = data[8] || data.question
        const cId = data[9] || data.cId

        // Parse price
        const priceResult = pricesData?.[index]
        let probability = 50
        if (priceResult?.status === "success") {
            const priceWei = priceResult.result as bigint
            probability = parseFloat(formatEther(priceWei)) * 100
        }

        // Mock Metadata Extraction
        let imageUrl = "/bitcoin-concept.png" // Default
        if (cId && cId.includes("TestImageCid")) {
            imageUrl = "/super-bowl-atmosphere.png"
        }

        return {
            id: index.toString(),
            title: question,
            image: imageUrl,
            type: "binary",
            outcomes: [
                { name: "Yes", probability: Math.round(probability) },
                { name: "No", probability: 100 - Math.round(probability) },
            ],
            volume: "0",
            tag: "Crypto",
        }
    }).filter((m): m is Market => m !== null) || []

    return {
        markets,
        isLoading: isLoadingMarkets || isLoadingPrices,
    }
}
