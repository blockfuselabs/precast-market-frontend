'use client'

import { useState } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts"
import { useMarketPriceHistory } from "@/hooks/useMarketPriceHistory"
import { TrendingUp } from "lucide-react"

const TIMEFRAMES = ["1H", "24H", "7D", "1M", "ALL"] as const
type Timeframe = (typeof TIMEFRAMES)[number]

interface MarketPriceHistoryCardProps {
    isLoading?: boolean
    marketId?: string
}

function formatTimestamp(ts: number, timeframe: Timeframe): string {
    const d = new Date(ts * 1000)
    if (timeframe === "1H") return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    if (timeframe === "24H") return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    return d.toLocaleDateString([], { month: "short", day: "numeric" })
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
                <p className="text-muted-foreground">{label}</p>
                <p className="text-primary font-bold">{payload[0].value}% YES</p>
            </div>
        )
    }
    return null
}

export function MarketPriceHistoryCard({ isLoading: parentLoading, marketId }: MarketPriceHistoryCardProps) {
    const [timeframe, setTimeframe] = useState<Timeframe>("ALL")
    const { data, isLoading, hasData } = useMarketPriceHistory(marketId, timeframe)

    const chartData = data.map(p => ({
        time: formatTimestamp(p.timestamp, timeframe),
        price: p.priceYES,
    }))

    if (parentLoading) {
        return (
            <div className="rounded-2xl bg-card border border-border p-4 md:p-5 animate-pulse">
                <div className="h-4 w-32 bg-secondary rounded mb-4" />
                <div className="h-52 w-full bg-secondary rounded" />
            </div>
        )
    }

    return (
        <section className="rounded-2xl bg-card border border-border px-4 py-3 md:px-5 md:py-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-heading-3 text-foreground">Price History</h2>
                <div className="flex items-center gap-2 text-caption">
                    {TIMEFRAMES.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-2.5 py-1 rounded-full transition-colors ${timeframe === tf
                                ? "bg-primary/15 text-primary border border-primary/40"
                                : "bg-secondary text-secondary-foreground border border-border hover:text-foreground"
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="h-52 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : !hasData || chartData.length === 0 ? (
                <div className="h-52 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-8 h-8 opacity-40" />
                    <p className="text-sm">No trades yet — be the first!</p>
                </div>
            ) : (
                <div className="h-52 md:h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                                tickLine={false}
                                axisLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v}%`}
                                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    )
}
