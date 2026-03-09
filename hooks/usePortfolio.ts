import { useState, useEffect } from "react"
import { fetchSubgraph } from "@/lib/subgraph"
import { formatUnits } from "viem"

export interface TradeEntry {
    id: string
    marketId: string
    user: string
    yes: boolean
    amount: string         // raw USDC units (6 decimals)
    cost: string           // raw USDC units (6 decimals)
    priceYES: string       // raw 18‑decimal probability
    priceNO: string
    blockTimestamp: string
    transactionHash: string
}

export interface PortfolioPosition {
    marketId: string
    yesShares: number
    noShares: number
    totalSpent: number     // in USDC
    trades: TradeEntry[]
}

const SHARES_BOUGHT_QUERY = `
  query GetUserTrades($user: String!) {
    sharesBoughts(
      where: { user: $user }
      orderBy: blockTimestamp
      orderDirection: desc
      first: 200
    ) {
      id
      marketId
      user
      yes
      amount
      cost
      priceYES
      priceNO
      blockTimestamp
      transactionHash
    }
  }
`

export function usePortfolio(walletAddress: string | undefined) {
    const [trades, setTrades] = useState<TradeEntry[]>([])
    const [positions, setPositions] = useState<PortfolioPosition[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!walletAddress) {
            setTrades([])
            setPositions([])
            return
        }

        const fetchData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const data = await fetchSubgraph<{ sharesBoughts: TradeEntry[] }>(
                    SHARES_BOUGHT_QUERY,
                    { user: walletAddress.toLowerCase() }
                )

                const allTrades = data.sharesBoughts || []
                setTrades(allTrades)

                // Aggregate into positions per market
                const posMap = new Map<string, PortfolioPosition>()
                for (const t of allTrades) {
                    const existing = posMap.get(t.marketId) || {
                        marketId: t.marketId,
                        yesShares: 0,
                        noShares: 0,
                        totalSpent: 0,
                        trades: [],
                    }
                    const costUsdc = Number(formatUnits(BigInt(t.cost), 6))
                    const amountShares = Number(formatUnits(BigInt(t.amount), 6))

                    if (t.yes) {
                        existing.yesShares += amountShares
                    } else {
                        existing.noShares += amountShares
                    }
                    existing.totalSpent += costUsdc
                    existing.trades.push(t)
                    posMap.set(t.marketId, existing)
                }

                setPositions(Array.from(posMap.values()))
            } catch (err: any) {
                console.error("Portfolio fetch failed:", err)
                setError(err?.message || "Failed to fetch portfolio data")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [walletAddress])

    const totalSpent = positions.reduce((sum, p) => sum + p.totalSpent, 0)

    return {
        trades,
        positions,
        totalSpent,
        isLoading,
        error,
    }
}
