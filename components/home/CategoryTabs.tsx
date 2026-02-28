"use client"

import { useState } from "react"
import {
    TrendingUp,
    Sparkles,
    Landmark,
    Trophy,
    Bitcoin,
    BarChart3,
    Cpu,
    Music,
    Globe,
    CloudSun,
} from "lucide-react"
import { categories } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
    TrendingUp,
    Sparkles,
    Landmark,
    Trophy,
    Bitcoin,
    BarChart3,
    Cpu,
    Music,
    Globe,
    CloudSun,
}

export function CategoryTabs() {
    const [activeId, setActiveId] = useState("trending")

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
                const Icon = iconMap[cat.icon]
                const isActive = activeId === cat.id
                return (
                    <button
                        key={cat.id}
                        onClick={() => setActiveId(cat.id)}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-4 text-sm py-1.5 rounded-full text-btn whitespace-nowrap transition-all",
                            isActive
                                ? "bg-primary/15 text-primary border border-primary/40"
                                : "bg-secondary text-muted-foreground border border-border hover:text-foreground hover:border-muted-foreground/30"
                        )}
                    >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        {cat.label}
                    </button>
                )
            })}
        </div>
    )
}
