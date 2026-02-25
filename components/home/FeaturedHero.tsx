import { ArrowRight, Users, Calendar, Landmark } from "lucide-react"
import { featuredMarket } from "@/lib/mock-data"

export function FeaturedHero() {
    const m = featuredMarket

    return (
        <div className="relative rounded-2xl border border-[#1A231A80] bg-gradient-to-br from-[#081208] to-[#081208] to-[#1E993B0D]  overflow-hidden">
            <div className="flex flex-col  p-5 md:p-6 md:flex-row gap-4 md:gap-5 ">
                {/* Image */}
                <div className="relative w-full md:w-48 h-40 rounded-xl md:h-auto flex-shrink-0 bg-secondary overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Landmark className="w-10 h-10 text-primary/60" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    {/* Badges */}
                    <div className="flex items-center gap-2">
                        {m.badges.map((badge) => (
                            <span
                                key={badge}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-caption ${badge === "Featured"
                                    ? "bg-primary/15 text-primary"
                                    : "bg-warning/15 text-warning"
                                    }`}
                            >
                                {badge}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h2 className="text-heading-2-lg text-foreground">
                        {m.title}
                    </h2>

                    {/* Description */}
                    <p className="text-body text-muted-foreground max-w-xl">
                        {m.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-caption">
                        <span className="text-primary font-bold">{m.volume}</span>
                        <span>Volume</span>
                        <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {m.traders} traders
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {m.date}
                        </span>
                    </div>

                    {/* Chance + Buttons */}
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-primary">
                                {m.chance}%
                            </span>
                            <span className="text-body text-muted-foreground">
                                chance
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="inline-flex items-center px-6 py-2 rounded-lg bg-primary text-primary-foreground text-btn transition-all hover:brightness-110 active:scale-95">
                                Buy Yes
                            </button>
                            <button className="inline-flex items-center px-6 py-2 rounded-lg bg-destructive text-destructive-foreground text-btn transition-all hover:brightness-110 active:scale-95">
                                Buy No
                            </button>
                            <button
                                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                aria-label="View details"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
