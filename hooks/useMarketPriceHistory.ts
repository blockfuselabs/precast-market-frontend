import { useState, useEffect } from "react"
import { fetchSubgraph } from "@/lib/subgraph"
import { formatEther } from "viem"

export interface ChartPoint {
    timestamp: number
    priceYES: number   // 0-100 percentage
}

const PRICE_HISTORY_QUERY = `
  query GetMarketPriceHistory($marketId: String!) {
    sharesBoughts(
      where: { marketId: $marketId }
      orderBy: blockTimestamp
      orderDirection: asc
      first: 1000
    ) {
      blockTimestamp
      priceYES
    }
  }
`

function filterByTimeframe(data: ChartPoint[], timeframe: string): ChartPoint[] {
    if (timeframe === "ALL" || data.length === 0) return data
    const now = Date.now() / 1000
    const cutoffs: Record<string, number> = {
        "1H": now - 3600,
        "24H": now - 86400,
        "7D": now - 7 * 86400,
        "1M": now - 30 * 86400,
    }
    const cutoff = cutoffs[timeframe] ?? 0
    return data.filter(p => p.timestamp >= cutoff)
}

export function useMarketPriceHistory(marketId: string | undefined, timeframe: string) {
    const [allData, setAllData] = useState<ChartPoint[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!marketId) return
        setIsLoading(true)
        setError(null)

        fetchSubgraph<{ sharesBoughts: { blockTimestamp: string; priceYES: string }[] }>(
            PRICE_HISTORY_QUERY,
            { marketId }
        )
            .then(data => {
                const points: ChartPoint[] = (data.sharesBoughts || []).map(t => ({
                    timestamp: Number(t.blockTimestamp),
                    priceYES: Math.round(parseFloat(formatEther(BigInt(t.priceYES))) * 100),
                }))
                setAllData(points)
            })
            .catch(err => {
                console.error("Price history fetch failed:", err)
                setError(err?.message || "Failed to fetch price history")
            })
            .finally(() => setIsLoading(false))
    }, [marketId])

    const data = filterByTimeframe(allData, timeframe)

    return { data, isLoading, error, hasData: allData.length > 0 }
}
