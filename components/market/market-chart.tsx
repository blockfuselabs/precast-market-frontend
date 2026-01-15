"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Dummy data generator with more volatility for "jagged" look
const generateDummyData = () => {
    const data = []
    let currentValue = 55
    const startDate = new Date('2024-09-01')

    for (let i = 0; i < 120; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)

        // Volatile Random walk
        const change = (Math.random() - 0.5) * 8
        currentValue = Math.max(5, Math.min(95, currentValue + change))

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            probability: Number(currentValue.toFixed(1))
        })
    }
    return data
}

const data = generateDummyData()

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value
        const isPositive = value >= 50 // Simple heuristic for tooltip color or just match chart color? 
        // Let's just use the payload color which is passed from the Area component

        return (
            <div className="rounded-lg border border-border bg-background/95 p-3 shadow-lg backdrop-blur-sm">
                <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].stroke }} />
                    <span className="text-sm font-bold text-foreground">
                        {value}% Chance
                    </span>
                </div>
            </div>
        )
    }
    return null
}

export function MarketChart() {
    // Determine color based on start vs end
    const startProb = data[0].probability
    const endProb = data[data.length - 1].probability
    const isPositive = endProb >= startProb

    // Use Red for negative, Emerald (Green) for positive
    const color = isPositive ? "#10b981" : "#ef4444"

    return (
        <div className="w-full">
            <div className="mb-4 flex items-baseline gap-3">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">{endProb}%</span>
                    <span className="text-sm font-medium text-muted-foreground">chance</span>
                </div>
                <span className={`text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(endProb - startProb).toFixed(1)}%
                    <span className="ml-1 text-muted-foreground">all time</span>
                </span>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {/* margin-right set to 40 to accommodate Y-axis labels better */}
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorProbability" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                            minTickGap={40}
                        />
                        <YAxis
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                            tickFormatter={(value) => `${value}%`}
                            orientation="right"
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--muted-foreground)', strokeDasharray: '4 4' }} />
                        <Area
                            type="linear"
                            dataKey="probability"
                            stroke={color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorProbability)"
                            activeDot={{ r: 4, fill: color, stroke: 'white', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Time Range Selectors (Static for now) */}
            <div className="mt-4 flex justify-end gap-1">
                {['1H', '6H', '1D', '1W', '1M', 'All'].map((range) => (
                    <button
                        key={range}
                        className={`rounded px-3 py-1 text-xs font-medium transition-colors ${range === 'All'
                            ? 'bg-secondary text-primary'
                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                            }`}
                    >
                        {range}
                    </button>
                ))}
            </div>
        </div>
    )
}
