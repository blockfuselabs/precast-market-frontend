import * as React from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatEther } from "viem"

interface ChartData {
    priceYES: string
    blockTimestamp?: string
}

interface MarketChartProps {
    data?: ChartData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value
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

const timeRanges = {
    '1H': 60 * 60,
    '6H': 6 * 60 * 60,
    '1D': 24 * 60 * 60,
    '1W': 7 * 24 * 60 * 60,
    '1M': 30 * 24 * 60 * 60,
    'All': Infinity
}

export function MarketChart({ data }: MarketChartProps) {
    const [timeRange, setTimeRange] = React.useState<keyof typeof timeRanges>('All')

    const chartData = React.useMemo(() => {
        if (!data || data.length === 0) {
            return [
                { date: 'Start', probability: 0 },
                { date: '', probability: 0 },
                { date: 'End', probability: 0 }
            ]
        }

        const now = Date.now() / 1000 // current timestamp in seconds
        const rangeDuration = timeRanges[timeRange]
        const cutoffTimestamp = rangeDuration === Infinity ? 0 : now - rangeDuration

        // Sort data by timestamp just in case
        const sortedData = [...data].sort((a, b) => Number(a.blockTimestamp || 0) - Number(b.blockTimestamp || 0))

        // Find the "start" value - the last trade BEFORE the cutoff
        // This ensures the line starts from the correct previous value instead of 0 or a gap
        let startValueIndex = -1
        for (let i = 0; i < sortedData.length; i++) {
            if (Number(sortedData[i].blockTimestamp || 0) < cutoffTimestamp) {
                startValueIndex = i
            } else {
                break
            }
        }

        // Filter data points within range
        const filteredRawData = sortedData.filter(item => Number(item.blockTimestamp || 0) >= cutoffTimestamp)

        // Logic to ensure continuous line
        let finalDataToMap = filteredRawData
        if (startValueIndex !== -1 && rangeDuration !== Infinity) {
            const startItem = sortedData[startValueIndex]

            if (filteredRawData.length === 0) {
                // If NO trades happened in the window, but we have prior history, 
                // show a flat line from start to "now" at the last known price
                finalDataToMap = [
                    { ...startItem, blockTimestamp: cutoffTimestamp.toString() },
                    { ...startItem, blockTimestamp: now.toString() }
                ]
            } else {
                // If we have trades, prepend the "virtual" start point at the cutoff time
                // so the chart shows the state at the beginning of the selected period
                finalDataToMap = [
                    { ...startItem, blockTimestamp: cutoffTimestamp.toString() },
                    ...filteredRawData
                ]
            }
        }

        // If "All" or effectively showing everything, and we're just mapping
        if (timeRange === 'All') {
            finalDataToMap = sortedData
        }


        return finalDataToMap.map((item, index) => {
            const probability = Number(formatEther(BigInt(item.priceYES))) * 100

            let date = `Trade ${index + 1}`
            if (item.blockTimestamp) {
                date = new Date(Number(item.blockTimestamp) * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }

            return {
                date,
                probability: Number(probability.toFixed(1))
            }
        })
    }, [data, timeRange])

    const startProb = chartData.length > 0 ? chartData[0].probability : 0
    const endProb = chartData.length > 0 ? chartData[chartData.length - 1].probability : 0
    const isPositive = endProb >= startProb
    const color = isPositive ? "#10b981" : "#ef4444"

    return (
        <div className="w-full">
            <div className="mb-4 flex items-baseline gap-3">
                <div className="flex items-baseline gap-1">
                    <span className="text-xl md:text-3xl font-bold text-foreground">{endProb}%</span>
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">chance</span>
                </div>
            </div>

            <div className="h-[200px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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
                            tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }}
                            minTickGap={40}
                        />
                        <YAxis
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }}
                            tickFormatter={(value) => `${value}%`}
                            orientation="right"
                            tickMargin={0}
                            width={35}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--muted-foreground)', strokeDasharray: '4 4' }} />
                        <Area
                            type="stepAfter" // stepAfter is often good for price history, or linear
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

            {/* Time Range Selectors */}
            <div className="mt-4 flex justify-end gap-1">
                {(Object.keys(timeRanges) as Array<keyof typeof timeRanges>).map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`cursor-pointer rounded px-3 py-1 text-[10px] font-medium transition-colors ${timeRange === range
                            ? 'bg-secondary text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {range}
                    </button>
                ))}
            </div>
        </div >
    )
}
