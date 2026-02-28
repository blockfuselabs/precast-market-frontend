export interface Outcome {
    name: string
    probability: number
}

export interface Market {
    id: string
    title: string
    image: string
    type: "binary"
    outcomes: Outcome[]
    volume: string
    tag?: string
    startTime?: number
    endTime?: number
    resolved?: boolean
    yesWon?: boolean
    isExpired?: boolean
    description?: string
    resolutionSource?: string
    startDate?: string
    endDate?: string
    category?: string
}

/* ── Homepage-specific types ─────────────────────── */

export interface TrendingItem {
    label: string
    change: string
    positive: boolean
}

export interface Category {
    id: string
    label: string
    icon: string // Lucide icon name
    active?: boolean
}

export interface FeaturedMarket {
    id: string
    image: string
    badges: string[]
    title: string
    description: string
    volume: string
    traders: string
    date: string
    chance: number
}

export interface SportTeam {
    name: string
    abbreviation: string
    logo?: string
    score?: number
    odds: number
}

export interface SportMatch {
    id: string
    league: string
    leagueColor: string
    time?: string
    liveIndicator?: string
    teams: SportTeam[]
    volume: string
    traders: string
    isLive: boolean
}

export interface MarketCardData {
    id: string
    category: string
    categoryColor: string
    title: string
    image?: string
    chance: number
    trend: string
    trendPositive: boolean
    yesPrice: string
    noPrice: string
    volume: string
    traders: string
    comments?: string
    date: string
    // For multi-outcome cards
    outcomes?: { name: string; odds: number; hasYes?: boolean; hasNo?: boolean }[]
}