"use client"

import { useQuery } from "@tanstack/react-query"
import { Market } from "@/lib/types"
import { formatEther } from "viem"
import { useEffect, useState } from "react"
import { fetchIPFSMetadata, getIPFSUrl } from "@/lib/ipfs"
import {
    fetchSubgraph,
    MARKETS_QUERY,
    MarketsQueryResult,
} from "@/lib/subgraph"

export function useMarkets() {
    // 1. Fetch all market events from the subgraph in one request
    const { data: subgraphData, isLoading: isLoadingSubgraph } =
        useQuery<MarketsQueryResult>({
            queryKey: ["markets"],
            queryFn: () => fetchSubgraph<MarketsQueryResult>(MARKETS_QUERY),
            staleTime: 30_000, // consider fresh for 30s
        })

    // 2. Fetch IPFS metadata for each unique cId
    const [metadataMap, setMetadataMap] = useState<Record<string, any>>({})

    useEffect(() => {
        if (!subgraphData?.marketCreateds) return

        const fetchAll = async () => {
            const cidsToFetch = new Set<string>()
            subgraphData.marketCreateds.forEach((m) => {
                if (m.cId && !metadataMap[m.cId]) {
                    cidsToFetch.add(m.cId)
                }
            })

            if (cidsToFetch.size === 0) return

            const results = await Promise.all(
                Array.from(cidsToFetch).map(async (cid) => ({
                    cid,
                    data: await fetchIPFSMetadata(cid),
                }))
            )

            setMetadataMap((prev) => {
                const next = { ...prev }
                let hasUpdates = false
                results.forEach(({ cid, data }) => {
                    if (data && !next[cid]) {
                        next[cid] = data
                        hasUpdates = true
                    }
                })
                return hasUpdates ? next : prev
            })
        }

        fetchAll()
    }, [subgraphData, metadataMap])

    // 3. Build lookup tables from price and resolution events
    const latestPriceByMarket: Record<string, { priceYES: string; priceNO: string }> = {}

    // First, populate from sharesBoughts (the most frequent price source)
    if (subgraphData?.sharesBoughts) {
        for (const s of subgraphData.sharesBoughts) {
            if (!latestPriceByMarket[s.marketId]) {
                latestPriceByMarket[s.marketId] = { priceYES: s.priceYES, priceNO: s.priceNO }
            }
        }
    }

    // Then, overlay with priceUpdateds (if any) - these take precedence if they exist for the same timestamp/block
    if (subgraphData?.priceUpdateds) {
        // priceUpdateds are already ordered desc by blockTimestamp — first entry per market is the latest
        for (const p of subgraphData.priceUpdateds) {
            if (!latestPriceByMarket[p.marketId]) {
                latestPriceByMarket[p.marketId] = { priceYES: p.priceYES, priceNO: p.priceNO }
            }
        }
    }

    const resolvedByMarket: Record<string, boolean> = {}
    if (subgraphData?.marketResolveds) {
        for (const r of subgraphData.marketResolveds) {
            resolvedByMarket[r.marketId] = r.yesWon
        }
    }

    // Real volume: sum of USDC `cost` across all SharesBought events per market
    const volumeByMarket: Record<string, bigint> = {}
    if (subgraphData?.sharesBoughts) {
        for (const s of subgraphData.sharesBoughts) {
            const prev = volumeByMarket[s.marketId] ?? BigInt(0)
            volumeByMarket[s.marketId] = prev + BigInt(s.cost)
        }
    }

    // 4. Transform into Market[]  (marketCreateds is already newest-first)
    const markets: Market[] = (subgraphData?.marketCreateds ?? []).map((m) => {
        console.log('Market:', m)
        const startTime = Number(m.startTime)
        const endTime = Number(m.endTime)
        const now = Date.now() / 1000

        // Price / probability
        const price = latestPriceByMarket[m.marketId]
        let probability = 50
        if (price) {
            probability = parseFloat(formatEther(BigInt(price.priceYES))) * 100
        }

        // Volume
        const rawVolume = volumeByMarket[m.marketId] ?? BigInt(0)
        const volumeNum = Number(rawVolume) / 1e18
        const volumeStr =
            volumeNum >= 1_000_000
                ? `$${(volumeNum / 1_000_000).toFixed(1)}M`
                : volumeNum >= 1_000
                    ? `$${(volumeNum / 1_000).toFixed(1)}K`
                    : `$${volumeNum.toFixed(2)}`

        // Image
        const metadata = metadataMap[m.cId]
        let imageUrl = "/prediction-market-placeholder.png"
        if (metadata?.image) {
            imageUrl =
                metadata.imageSource === "cloudinary"
                    ? metadata.image
                    : getIPFSUrl(metadata.image)
        } else if (m.cId?.includes("TestImageCid")) {
            imageUrl = "/super-bowl-atmosphere.png"
        }

        const isResolved = m.marketId in resolvedByMarket
        const yesWon = resolvedByMarket[m.marketId]

        return {
            id: m.marketId,
            title: m.question,
            image: imageUrl,
            type: "binary",
            outcomes: [
                { name: "Yes", probability: Math.round(probability) },
                { name: "No", probability: 100 - Math.round(probability) },
            ],
            volume: volumeStr,
            tag: "",
            startTime,
            endTime,
            startDate: new Date(startTime * 1000).toLocaleString(),
            endDate: new Date(endTime * 1000).toLocaleString(),
            resolved: isResolved,
            yesWon,
            isExpired: now > endTime,
            description: metadata?.description ?? "",
            resolutionSource: metadata?.resolutionSource ?? "",
            category: metadata?.category ?? "General",
        } satisfies Market
    })

    return {
        markets,
        isLoading: isLoadingSubgraph,
    }
}
