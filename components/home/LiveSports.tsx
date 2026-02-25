import { Users } from "lucide-react"
import { sportsMatches } from "@/lib/mock-data"

export function LiveSports() {
    return (
        <section className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-heading-2-lg text-foreground">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive" />
                    </span>
                    Live &amp; Upcoming Sports
                </h2>
                <button className="text-caption text-primary hover:underline">
                    View all
                </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sportsMatches.map((match) => (
                    <div
                        key={match.id}
                        className="rounded-xl bg-card border border-border p-4 space-y-4 hover:border-primary/30 transition-colors"
                    >
                        {/* League + Time */}
                        <div className="flex items-center gap-2">
                            <span
                                className="text-btn text-xs px-2 py-0.5 rounded font-bold"
                                style={{
                                    color: match.leagueColor,
                                    backgroundColor: `${match.leagueColor}15`,
                                }}
                            >
                                {match.league}
                            </span>
                            {match.isLive ? (
                                <span className="flex items-center gap-1 text-caption text-destructive">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-destructive" />
                                    </span>
                                    {match.liveIndicator}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-caption">
                                    ⏱ {match.time}
                                </span>
                            )}
                        </div>

                        {/* Teams */}
                        <div className="space-y-3">
                            {match.teams.map((team) => (
                                <div
                                    key={team.abbreviation}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                            <span className="text-[8px] font-bold text-muted-foreground">
                                                {team.abbreviation.slice(0, 2)}
                                            </span>
                                        </div>
                                        <span className="text-body text-foreground">
                                            {team.name}
                                        </span>
                                        {team.score !== undefined && (
                                            <span className="text-heading-3 text-foreground ml-1">
                                                {team.score}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-heading-3 text-foreground">
                                        {team.odds}%
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Bet Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                            <button className="py-1.5 rounded-md text-btn text-xs bg-primary text-primary-foreground transition-all hover:brightness-110 active:scale-95">
                                {match.teams[0].abbreviation}
                            </button>
                            <button className="py-1.5 rounded-md text-btn text-xs bg-secondary text-secondary-foreground hover:text-foreground transition-colors">
                                Draw
                            </button>
                            <button className="py-1.5 rounded-md text-btn text-xs bg-secondary text-secondary-foreground hover:text-foreground transition-colors">
                                {match.teams[1].abbreviation}
                            </button>
                        </div>

                        {/* Footer Stats */}
                        <div className="flex items-center justify-between text-caption">
                            <span>{match.volume} Vol.</span>
                            <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {match.traders} traders
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
