"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useWatchContractEvent } from "wagmi"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import LMSRABI from "@/lib/LMSRABI.json"

/**
 * Hook to invalidate queries when contract events are emitted
 * This ensures UI updates after successful transactions
 */
export function useInvalidateOnTransaction() {
  const queryClient = useQueryClient()

  // Watch for Trade events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: LMSRABI as any,
    eventName: "Trade",
    onLogs() {
      // Invalidate all market-related queries
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      queryClient.invalidateQueries({ queryKey: ["readContracts"] })
    },
  })

  // Watch for MarketCreated events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: LMSRABI as any,
    eventName: "MarketCreated",
    onLogs() {
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      queryClient.invalidateQueries({ queryKey: ["readContracts"] })
    },
  })

  // Watch for MarketResolved events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: LMSRABI as any,
    eventName: "MarketResolved",
    onLogs() {
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      queryClient.invalidateQueries({ queryKey: ["readContracts"] })
    },
  })
}
