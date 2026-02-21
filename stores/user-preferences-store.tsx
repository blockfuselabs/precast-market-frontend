"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

const STORAGE_KEY = "precast:user-preferences"
const MAX_RECENT_SEARCHES = 5

type StoredPreferences = {
  favoriteMarkets: string[]
  recentSearches: string[]
  defaultTradeAmount: number
}

type UserPreferencesStoreValue = StoredPreferences & {
  toggleFavoriteMarket: (marketId: string) => void
  addRecentSearch: (query: string) => void
  setDefaultTradeAmount: (amount: number) => void
}

const defaultState: StoredPreferences = {
  favoriteMarkets: [],
  recentSearches: [],
  defaultTradeAmount: 0,
}

const UserPreferencesContext = createContext<UserPreferencesStoreValue | null>(null)

export function UserPreferencesStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredPreferences>(defaultState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredPreferences>
        setState({
          favoriteMarkets: Array.isArray(parsed.favoriteMarkets) ? parsed.favoriteMarkets : [],
          recentSearches: Array.isArray(parsed.recentSearches) ? parsed.recentSearches : [],
          defaultTradeAmount:
            typeof parsed.defaultTradeAmount === "number" && Number.isFinite(parsed.defaultTradeAmount)
              ? parsed.defaultTradeAmount
              : 0,
        })
      }
    } catch {
      setState(defaultState)
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, hydrated])

  const value = useMemo<UserPreferencesStoreValue>(
    () => ({
      ...state,
      toggleFavoriteMarket: (marketId: string) =>
        setState((prev) => {
          const exists = prev.favoriteMarkets.includes(marketId)
          return {
            ...prev,
            favoriteMarkets: exists
              ? prev.favoriteMarkets.filter((id) => id !== marketId)
              : [...prev.favoriteMarkets, marketId],
          }
        }),
      addRecentSearch: (query: string) =>
        setState((prev) => {
          const normalized = query.trim()
          if (!normalized) return prev
          const deduped = prev.recentSearches.filter((item) => item.toLowerCase() !== normalized.toLowerCase())
          return {
            ...prev,
            recentSearches: [normalized, ...deduped].slice(0, MAX_RECENT_SEARCHES),
          }
        }),
      setDefaultTradeAmount: (amount: number) =>
        setState((prev) => ({
          ...prev,
          defaultTradeAmount: Number.isFinite(amount) && amount >= 0 ? amount : prev.defaultTradeAmount,
        })),
    }),
    [state],
  )

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>
}

export function useUserPreferencesStore() {
  const context = useContext(UserPreferencesContext)
  if (!context) {
    throw new Error("useUserPreferencesStore must be used within UserPreferencesStoreProvider")
  }
  return context
}
