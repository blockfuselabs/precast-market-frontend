'use client'

import { usePrivy } from "@privy-io/react-auth"
import { usePortfolio } from "@/hooks/usePortfolio"
import { formatUnits } from "viem"
import { Wallet, TrendingUp, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { TrendingTicker } from "@/components/layout/TrendingTicker"
import { Footer } from "@/components/layout/Footer"

export default function PortfolioPage() {
    const { authenticated, login, user } = usePrivy()
    const walletAddress = user?.wallet?.address

    const { trades, positions, totalSpent, isLoading, error } = usePortfolio(walletAddress)

    return (
        <>
            <Navbar />
            {/* <TrendingTicker /> */}
            <main className="container-app py-8 space-y-6">
                <div className="space-y-1">
                    <h1 className="text-heading-1 text-foreground">My Portfolio</h1>
                    <p className="text-body text-muted-foreground">Track your active positions and trade history.</p>
                </div>

                {!authenticated ? (
                    <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-4">
                        <Wallet className="w-12 h-12 mx-auto text-muted-foreground" />
                        <h2 className="text-heading-3">Connect your wallet</h2>
                        <p className="text-muted-foreground">Connect your wallet to see your positions and trade history.</p>
                        <button
                            type="button"
                            onClick={login}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 font-semibold hover:brightness-110 transition-all"
                        >
                            Connect Wallet
                        </button>
                    </div>
                ) : isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
                                <div className="h-4 w-1/3 bg-secondary rounded mb-3" />
                                <div className="h-6 w-1/2 bg-secondary rounded mb-2" />
                                <div className="h-4 w-1/4 bg-secondary rounded" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center space-y-2">
                        <AlertTriangle className="w-8 h-8 mx-auto text-destructive" />
                        <p className="text-destructive font-medium">Failed to load portfolio</p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
                                <p className="text-caption text-muted-foreground">Active Positions</p>
                                <p className="text-heading-2 text-foreground">{positions.length}</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
                                <p className="text-caption text-muted-foreground">Total Invested</p>
                                <p className="text-heading-2 text-foreground">${totalSpent.toFixed(2)}</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
                                <p className="text-caption text-muted-foreground">Total Trades</p>
                                <p className="text-heading-2 text-foreground">{trades.length}</p>
                            </div>
                        </div>

                        {positions.length === 0 ? (
                            <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
                                <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground" />
                                <h2 className="text-heading-3">No positions yet</h2>
                                <p className="text-muted-foreground">Head to the markets page to place your first trade.</p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-2.5 font-semibold hover:brightness-110 transition-all"
                                >
                                    Browse Markets
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Active Positions */}
                                <section className="space-y-3">
                                    <h2 className="text-heading-3 text-foreground">Active Positions</h2>
                                    <div className="space-y-3">
                                        {positions.map(pos => (
                                            <Link
                                                key={pos.marketId}
                                                href={`/markets/${pos.marketId}`}
                                                className="block rounded-2xl border border-border bg-card p-5 hover:border-muted-foreground/40 transition-colors"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-caption text-muted-foreground">Market #{pos.marketId}</span>
                                                    <span className="text-caption text-muted-foreground">${pos.totalSpent.toFixed(2)} invested</span>
                                                </div>
                                                <div className="flex gap-4">
                                                    {pos.yesShares > 0 && (
                                                        <div className="flex-1 rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
                                                            <p className="text-caption text-primary font-semibold">YES Shares</p>
                                                            <p className="text-heading-3 text-primary">{pos.yesShares.toFixed(2)}</p>
                                                        </div>
                                                    )}
                                                    {pos.noShares > 0 && (
                                                        <div className="flex-1 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-center">
                                                            <p className="text-caption text-destructive font-semibold">NO Shares</p>
                                                            <p className="text-heading-3 text-destructive">{pos.noShares.toFixed(2)}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                {/* Trade History */}
                                <section className="space-y-3">
                                    <h2 className="text-heading-3 text-foreground">Trade History</h2>
                                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="border-b border-border">
                                                <tr className="text-left text-muted-foreground text-caption">
                                                    <th className="px-4 py-3">Market</th>
                                                    <th className="px-4 py-3">Side</th>
                                                    <th className="px-4 py-3">Shares</th>
                                                    <th className="px-4 py-3">Cost</th>
                                                    <th className="px-4 py-3">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {trades.map(trade => (
                                                    <tr key={trade.id} className="border-b border-border last:border-none hover:bg-secondary/50 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <Link href={`/markets/${trade.marketId}`} className="text-primary hover:underline">
                                                                #{trade.marketId}
                                                            </Link>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${trade.yes
                                                                ? "bg-primary/10 text-primary"
                                                                : "bg-destructive/10 text-destructive"
                                                                }`}>
                                                                {trade.yes ? "YES" : "NO"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-foreground">
                                                            {Number(formatUnits(BigInt(trade.amount), 6)).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 text-foreground">
                                                            ${Number(formatUnits(BigInt(trade.cost), 6)).toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-3 text-muted-foreground">
                                                            <span className="inline-flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(Number(trade.blockTimestamp) * 1000).toLocaleDateString()}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </>
    )
}
