import { useMemo, useState } from "react"
import type { Market } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CircleHelp, Minus, Plus, Wallet, Loader2 } from "lucide-react"
import { useTrade } from "@/hooks/useTrade"
import { usePrivy, useSendTransaction, useWallets } from "@privy-io/react-auth"
import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESS, USDC_ADDRESS } from "@/lib/constants"
import { erc20ABI } from "@/lib/erc20-abi"
import { formatUnits, type Address } from "viem"
import { toast } from "sonner"

type Side = "yes" | "no"

interface MarketTradePanelProps {
    market: Market | null
    isLoading: boolean
    refetchMarket?: () => void
}

const QUICK_AMOUNTS = [25, 50, 100, 250, 500]
const MAX_AMOUNT = 500

export function MarketTradePanel({ market, isLoading, refetchMarket }: MarketTradePanelProps) {
    const [side, setSide] = useState<Side>("yes")
    const [amount, setAmount] = useState<number>(100)

    const { authenticated, login, user } = usePrivy()
    const walletAddress = user?.wallet?.address as Address | undefined
    const { sendTransaction } = useSendTransaction()
    const { wallets } = useWallets()
    const wallet = wallets?.[0]

    const { data: rawAllowance, refetch: refetchAllowance } = useReadContract({
        address: USDC_ADDRESS as Address,
        abi: erc20ABI,
        functionName: "allowance",
        args: [walletAddress as Address, CONTRACT_ADDRESS as Address],
        query: { enabled: !!walletAddress }
    })

    const allowance = rawAllowance as unknown as bigint

    const { data: balanceData } = useReadContract({
        address: USDC_ADDRESS as Address,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [walletAddress as Address],
        query: { enabled: !!walletAddress }
    })

    const balance = balanceData ? Number(formatUnits(balanceData as bigint, 6)) : 0

    // Trading Hook
    const { executeTrade, isPending, isApproving, isTrading } = useTrade()

    const { yesProb, noProb } = useMemo(() => {
        const yesOutcome = market?.outcomes.find(
            (o) => o.name.toLowerCase() === "yes",
        )
        const noOutcome = market?.outcomes.find(
            (o) => o.name.toLowerCase() === "no",
        )
        return {
            yesProb: yesOutcome?.probability ?? 50,
            noProb: noOutcome?.probability ?? 50,
        }
    }, [market])

    const selectedProb = side === "yes" ? yesProb : noProb
    const pricePerShare = selectedProb / 100 // LMSR approx: cost to buy 1 full share ≈ probability

    const shares = amount && pricePerShare > 0 ? amount / pricePerShare : 0
    const potentialPayout = shares // total payout if the selected side wins
    const potentialProfit = potentialPayout - amount
    const potentialReturnPct =
        amount > 0 ? (potentialProfit / amount) * 100 : 0

    const handleAmountChange = (next: number) => {
        if (Number.isNaN(next)) return
        const clamped = Math.max(0, Math.min(MAX_AMOUNT, next))
        setAmount(clamped)
    }

    const stepAdjust = (delta: number) => {
        handleAmountChange((amount || 0) + delta)
    }

    if (isLoading || !market) {
        return (
            <aside className="rounded-2xl bg-card border border-border p-4 md:p-5 space-y-4 animate-pulse">
                <div className="h-4 w-24 bg-secondary rounded" />
                <div className="h-9 w-full bg-secondary rounded" />
                <div className="h-24 w-full bg-secondary rounded" />
                <div className="h-10 w-full bg-secondary rounded" />
            </aside>
        )
    }

    if (market.resolved || market.isExpired) {
        return null
    }

    return (
        <aside className="rounded-2xl bg-card border border-border p-4 md:p-5 space-y-4">
            <h2 className="text-heading-3 text-foreground">Place trade</h2>

            {/* Side toggle */}
            <div className="grid grid-cols-2 gap-0.5 rounded-xl bg-secondary border border-border p-0.5">
                <button
                    type="button"
                    onClick={() => setSide("yes")}
                    className={cn(
                        "flex items-center justify-center gap-1.5 rounded-[0.625rem] px-3 py-2 text-left text-sm font-semibold transition-all",
                        side === "yes"
                            ? "bg-primary text-primary-foreground"
                            : "text-secondary-foreground hover:text-foreground",
                    )}
                >
                    <span>Yes</span>
                    <span className="text-xs opacity-80">
                        {yesProb.toFixed(0)}¢
                    </span>
                </button>
                <button
                    type="button"
                    onClick={() => setSide("no")}
                    className={cn(
                        "flex items-center justify-center gap-1.5 rounded-[0.625rem] px-3 py-2 text-left text-sm font-semibold transition-all",
                        side === "no"
                            ? "bg-destructive text-destructive-foreground"
                            : "text-secondary-foreground hover:text-foreground",
                    )}
                >
                    <span>No</span>
                    <span className="text-xs opacity-80">
                        {noProb.toFixed(0)}¢
                    </span>
                </button>
            </div>

            {/* Amount input */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-caption">
                    <span className="text-muted-foreground">Amount</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-secondary border border-border px-3 py-2">
                    <button
                        type="button"
                        onClick={() => stepAdjust(-10)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-muted text-secondary-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-muted-foreground text-sm">$</span>
                    <input
                        type="number"
                        min={0}
                        step={1}
                        value={Number.isNaN(amount) ? "" : amount}
                        onChange={(e) =>
                            handleAmountChange(
                                e.target.value === ""
                                    ? 0
                                    : Number(e.target.value),
                            )
                        }
                        className="bg-transparent border-none outline-none text-body text-foreground w-full placeholder:text-secondary-foreground"
                        placeholder="0"
                    />
                    <button
                        type="button"
                        onClick={() => stepAdjust(10)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-muted text-secondary-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {QUICK_AMOUNTS.map((val) => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => handleAmountChange(val)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-caption border transition-colors",
                                amount === val
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-secondary text-secondary-foreground border-border hover:text-foreground hover:border-muted-foreground/40",
                            )}
                        >
                            ${val}
                        </button>
                    ))}
                </div>

                {/* Slider, mirroring Figma amount slider */}
                <input
                    type="range"
                    min={0}
                    max={MAX_AMOUNT}
                    step={5}
                    value={amount}
                    onChange={(e) => handleAmountChange(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full bg-secondary accent-primary"
                />
            </div>

            {/* Summary */}
            <div className="space-y-1.5 rounded-xl bg-secondary border border-border px-3 py-3 text-caption">
                <div className="flex items-center justify-between">
                    <span className="text-secondary-foreground">
                        Avg price
                    </span>
                    <span className="text-foreground">
                        {selectedProb.toFixed(0)}¢
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-secondary-foreground">Shares</span>
                    <span className="text-foreground">
                        {shares > 0 ? shares.toFixed(0) : "0"}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-secondary-foreground">
                        <span>Potential return</span>
                        <CircleHelp className="w-3 h-3" />
                    </span>
                    <div className="flex items-center gap-1">
                        <span className="text-emerald-400 font-semibold">
                            ${Math.max(potentialProfit, 0).toFixed(2)}
                        </span>
                        <span className="text-emerald-400 font-semibold">
                            ({Math.max(potentialReturnPct, 0).toFixed(1)}%)
                        </span>
                    </div>
                </div>
            </div>

            {/* Submit button */}
            <button
                type="button"
                onClick={async () => {
                    if (!authenticated) {
                        login()
                        return
                    }
                    if (!wallet) {
                        toast.error("Wallet not available")
                        return
                    }
                    const result = await executeTrade(
                        market.id,
                        amount,
                        side,
                        allowance ? (allowance as bigint) : BigInt(0),
                        sendTransaction,
                        wallet
                    )
                    if (result.success) {
                        toast.success(`Trade successful!`)
                        setAmount(0) // Reset after trade
                        refetchAllowance()
                        refetchMarket?.()
                    } else {
                        toast.error(`Trade failed. ${(result.error as any)?.message || ""}`)
                    }
                }}
                className={cn(
                    "w-full rounded-xl py-2.5 text-btn font-semibold transition-all flex items-center justify-center gap-2",
                    (!authenticated)
                        ? "bg-primary text-primary-foreground hover:brightness-110"
                        : side === "yes"
                            ? "bg-primary text-primary-foreground hover:brightness-110"
                            : "bg-destructive text-destructive-foreground hover:brightness-110",
                    isPending && "opacity-70 cursor-not-allowed"
                )}
                disabled={isPending || (authenticated && (!amount || amount <= 0))}
            >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {!authenticated
                    ? "Connect Wallet"
                    : isPending
                        ? (isApproving ? "Approving USDC..." : "Confirming Trade...")
                        : (side === "yes" ? "Buy Yes Shares" : "Buy No Shares")}
            </button>

            <div className="flex items-center justify-between text-caption text-secondary-foreground pt-1">
                <div className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Balance</span>
                </div>
                <span className="text-foreground">
                    {!authenticated ? "--" : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
            </div>
        </aside>
    )
}

